/**
 * Library ADS PBL System - Interactive Algorithm Visualizer
 * Real-time step-by-step visual workbench with animations and telemetry.
 */

class AlgorithmVisualizer {
    constructor() {
        this.currentAlgorithm = 'bubble';
        this.currentKey = 'year';
        this.speed = 350; // ms per step
        this.isPlaying = false;
        this.timer = null;
        this.frames = [];
        this.currentFrameIdx = 0;
        this.dataset = [];

        this.complexityData = {
            bubble: {
                name: 'Bubble Sort',
                paradigm: 'Comparison / Exchange',
                best: 'O(n)',
                average: 'O(n²)',
                worst: 'O(n²)',
                space: 'O(1)',
                stable: 'Yes',
                desc: 'Repeatedly steps through the list, comparing adjacent items and swapping them if they are in the wrong order. An optimized flag allows early exit if no swaps occur.'
            },
            selection: {
                name: 'Selection Sort',
                paradigm: 'Selection / In-place',
                best: 'O(n²)',
                average: 'O(n²)',
                worst: 'O(n²)',
                space: 'O(1)',
                stable: 'No',
                desc: 'Divides the list into a sorted and unsorted section. Repeatedly finds the minimum (or maximum) element from the unsorted section and swaps it to the front.'
            },
            insertion: {
                name: 'Insertion Sort',
                paradigm: 'Incremental Insertion',
                best: 'O(n)',
                average: 'O(n²)',
                worst: 'O(n²)',
                space: 'O(1)',
                stable: 'Yes',
                desc: 'Builds the sorted array one element at a time by picking the next element and shifting larger elements to the right before inserting it into its correct position.'
            },
            quick: {
                name: 'Quick Sort',
                paradigm: 'Divide & Conquer / Partitioning',
                best: 'O(n log n)',
                average: 'O(n log n)',
                worst: 'O(n²)',
                space: 'O(log n)',
                stable: 'No',
                desc: 'Selects a "pivot" element and partitions the array such that all smaller elements are to the left and larger elements are to the right, then recurses on both halves.'
            },
            linearSearch: {
                name: 'Linear Search',
                paradigm: 'Sequential Scan',
                best: 'O(1)',
                average: 'O(n)',
                worst: 'O(n)',
                space: 'O(1)',
                stable: 'N/A',
                desc: 'Inspects every record sequentially from start to end until a match is found or the end of the collection is reached. Does not require sorted data.'
            },
            binarySearch: {
                name: 'Binary Search',
                paradigm: 'Divide & Conquer / Interval Halving',
                best: 'O(1)',
                average: 'O(log n)',
                worst: 'O(log n)',
                space: 'O(1)',
                stable: 'N/A',
                desc: 'Requires sorted data. Compares the search target with the middle element. Halves the search space in every step by discarding the half where the target cannot reside.'
            }
        };
    }

    init() {
        this.cacheDOM();
        this.bindEvents();
        this.loadSampleData();
        this.updateComplexityCard();
        this.generateFrames();
        this.renderCurrentFrame();
    }

    cacheDOM() {
        this.container = document.getElementById('visualizer-bars-container');
        this.algoSelect = document.getElementById('vis-algo-select');
        this.keySelect = document.getElementById('vis-key-select');
        this.sampleSizeSelect = document.getElementById('vis-sample-size');
        this.searchTargetInput = document.getElementById('vis-search-target');
        this.searchTargetGroup = document.getElementById('vis-search-target-group');
        this.speedSlider = document.getElementById('vis-speed-slider');
        this.speedLabel = document.getElementById('vis-speed-label');
        this.playBtn = document.getElementById('vis-btn-play');
        this.pauseBtn = document.getElementById('vis-btn-pause');
        this.stepBtn = document.getElementById('vis-btn-step');
        this.resetBtn = document.getElementById('vis-btn-reset');
        this.shuffleBtn = document.getElementById('vis-btn-shuffle');
        this.compCountEl = document.getElementById('vis-stat-comparisons');
        this.swapCountEl = document.getElementById('vis-stat-swaps');
        this.stepCountEl = document.getElementById('vis-stat-step');
        this.statusMsgEl = document.getElementById('vis-status-message');

        // Complexity card elements
        this.cardTitle = document.getElementById('vis-card-title');
        this.cardParadigm = document.getElementById('vis-card-paradigm');
        this.cardBest = document.getElementById('vis-card-best');
        this.cardAvg = document.getElementById('vis-card-avg');
        this.cardWorst = document.getElementById('vis-card-worst');
        this.cardSpace = document.getElementById('vis-card-space');
        this.cardStable = document.getElementById('vis-card-stable');
        this.cardDesc = document.getElementById('vis-card-desc');
    }

    bindEvents() {
        if (!this.algoSelect) return;

        this.algoSelect.addEventListener('change', (e) => {
            this.currentAlgorithm = e.target.value;
            const isSearch = this.currentAlgorithm.includes('Search');
            if (this.searchTargetGroup) {
                this.searchTargetGroup.style.display = isSearch ? 'block' : 'none';
            }
            this.updateComplexityCard();
            this.pause();
            this.generateFrames();
            this.renderCurrentFrame();
        });

        this.keySelect.addEventListener('change', (e) => {
            this.currentKey = e.target.value;
            this.pause();
            this.generateFrames();
            this.renderCurrentFrame();
        });

        this.sampleSizeSelect.addEventListener('change', () => {
            this.loadSampleData();
            this.pause();
            this.generateFrames();
            this.renderCurrentFrame();
        });

        if (this.searchTargetInput) {
            this.searchTargetInput.addEventListener('input', () => {
                this.pause();
                this.generateFrames();
                this.renderCurrentFrame();
            });
        }

        this.speedSlider.addEventListener('input', (e) => {
            const val = parseInt(e.target.value, 10);
            // slider 1 (fast: 50ms) to 10 (slow: 1000ms)
            // Inverted for intuitive feel: higher slider = faster
            this.speed = Math.max(30, 1050 - (val * 100));
            this.speedLabel.textContent = `${val}x (${this.speed}ms)`;
        });

        this.playBtn.addEventListener('click', () => this.play());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.stepBtn.addEventListener('click', () => this.step());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.shuffleBtn.addEventListener('click', () => {
            this.shuffleData();
            this.pause();
            this.generateFrames();
            this.renderCurrentFrame();
        });
    }

    loadSampleData() {
        const books = LibraryData.getBooks();
        const count = parseInt(this.sampleSizeSelect.value, 10) || 12;

        // Take a slice and clone
        this.dataset = books.slice(0, count).map(b => ({
            id: b.id,
            title: b.title,
            author: b.author,
            year: b.year,
            borrowsCount: b.borrowsCount
        }));

        // Preset search target default
        if (this.searchTargetInput && !this.searchTargetInput.value) {
            this.searchTargetInput.value = this.dataset[Math.floor(count / 2)].title.split(' ')[0];
        }
    }

    shuffleData() {
        for (let i = this.dataset.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.dataset[i], this.dataset[j]] = [this.dataset[j], this.dataset[i]];
        }
    }

    updateComplexityCard() {
        const info = this.complexityData[this.currentAlgorithm];
        if (!info) return;

        this.cardTitle.textContent = info.name;
        this.cardParadigm.textContent = info.paradigm;
        this.cardBest.textContent = info.best;
        this.cardAvg.textContent = info.average;
        this.cardWorst.textContent = info.worst;
        this.cardSpace.textContent = info.space;
        this.cardStable.textContent = info.stable;
        this.cardDesc.textContent = info.desc;
    }

    generateFrames() {
        const algo = this.currentAlgorithm;
        const key = this.currentKey;
        const query = this.searchTargetInput ? this.searchTargetInput.value.trim() : '';

        this.frames = [];
        let generator = null;

        if (algo === 'bubble') {
            generator = ADSAlgorithms.generateBubbleSortFrames(this.dataset, key, true);
        } else if (algo === 'selection') {
            generator = ADSAlgorithms.generateSelectionSortFrames(this.dataset, key, true);
        } else if (algo === 'insertion') {
            generator = ADSAlgorithms.generateInsertionSortFrames(this.dataset, key, true);
        } else if (algo === 'quick') {
            generator = ADSAlgorithms.generateQuickSortFrames(this.dataset, key, true);
        } else if (algo === 'linearSearch') {
            generator = ADSAlgorithms.generateLinearSearchFrames(this.dataset, key, query || 'Algorithm');
        } else if (algo === 'binarySearch') {
            generator = ADSAlgorithms.generateBinarySearchFrames(this.dataset, key, query || 'Algorithm');
        }

        if (generator) {
            for (const frame of generator) {
                this.frames.push(frame);
            }
        }

        this.currentFrameIdx = 0;
    }

    renderCurrentFrame() {
        if (!this.frames || this.frames.length === 0) return;

        const frame = this.frames[this.currentFrameIdx];
        if (!frame) return;

        // Update status telemetry
        this.compCountEl.textContent = frame.comparisons ?? 0;
        this.swapCountEl.textContent = frame.swaps ?? 0;
        this.stepCountEl.textContent = `${this.currentFrameIdx + 1} / ${this.frames.length}`;
        this.statusMsgEl.textContent = frame.message || 'Ready to execute.';

        // Render Bars / Visual Cards
        this.container.innerHTML = '';
        const items = frame.arr;
        const key = this.currentKey;

        // Calculate scale max for numeric fields (e.g. year: 1980 to 2024 -> map to height)
        const isNumeric = key === 'year' || key === 'borrowsCount';
        let minVal = 0, maxVal = 1;
        if (isNumeric) {
            minVal = Math.min(...items.map(x => Number(x[key]) || 0));
            maxVal = Math.max(...items.map(x => Number(x[key]) || 1));
            if (minVal === maxVal) maxVal += 1;
        }

        items.forEach((item, idx) => {
            const barWrapper = document.createElement('div');
            barWrapper.className = 'vis-element-wrapper';

            // Determine element status classes
            let stateClass = 'vis-default';

            if (frame.foundIndices && frame.foundIndices.includes(idx)) {
                stateClass = 'vis-found';
            } else if (frame.swapIndices && frame.swapIndices.includes(idx)) {
                stateClass = 'vis-swapping';
            } else if (frame.highlightIndices && frame.highlightIndices.includes(idx)) {
                stateClass = 'vis-comparing';
            } else if (frame.pivotIndex === idx) {
                stateClass = 'vis-pivot';
            } else if (frame.sortedIndices && frame.sortedIndices.includes(idx)) {
                stateClass = 'vis-sorted';
            } else if (frame.windowIndices) {
                const [low, high] = frame.windowIndices;
                if (idx < low || idx > high) {
                    stateClass = 'vis-out-of-window';
                }
            }

            // Height calculation
            let heightPercent = 50;
            if (isNumeric) {
                const num = Number(item[key]);
                heightPercent = 25 + Math.round(((num - minVal) / (maxVal - minVal)) * 65);
            } else {
                // String alphabetical height (A=10%, Z=90%)
                const charCode = String(item[key]).toUpperCase().charCodeAt(0) || 65;
                heightPercent = 25 + Math.round(((charCode - 65) / 26) * 65);
            }

            barWrapper.innerHTML = `
                <div class="vis-bar ${stateClass}" style="height: ${heightPercent}%;">
                    <span class="vis-bar-value">${item[key]}</span>
                </div>
                <div class="vis-label-box" title="${item.title} (${item.author})">
                    <span class="vis-item-id">${item.id}</span>
                    <span class="vis-item-name">${item.title.substring(0, 18)}${item.title.length > 18 ? '...' : ''}</span>
                    <span class="vis-item-idx">#${idx}</span>
                </div>
            `;

            this.container.appendChild(barWrapper);
        });
    }

    play() {
        if (this.isPlaying) return;
        this.isPlaying = true;
        this.playBtn.classList.add('active');
        this.pauseBtn.classList.remove('active');

        const stepLoop = () => {
            if (!this.isPlaying) return;
            if (this.currentFrameIdx < this.frames.length - 1) {
                this.currentFrameIdx++;
                this.renderCurrentFrame();
                this.timer = setTimeout(stepLoop, this.speed);
            } else {
                this.pause();
            }
        };

        this.timer = setTimeout(stepLoop, this.speed);
    }

    pause() {
        this.isPlaying = false;
        if (this.timer) clearTimeout(this.timer);
        this.playBtn.classList.remove('active');
        this.pauseBtn.classList.add('active');
    }

    step() {
        this.pause();
        if (this.currentFrameIdx < this.frames.length - 1) {
            this.currentFrameIdx++;
            this.renderCurrentFrame();
        }
    }

    reset() {
        this.pause();
        this.currentFrameIdx = 0;
        this.renderCurrentFrame();
    }
}

// Global visualizer instance
let appVisualizer = null;
window.initVisualizer = function() {
    if (!appVisualizer) {
        appVisualizer = new AlgorithmVisualizer();
        appVisualizer.init();
    } else {
        appVisualizer.reset();
    }
};
