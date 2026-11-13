/**
 * Library ADS PBL System - Searching and Sorting Algorithms
 * Implemented from scratch without using native Array.prototype.sort()
 * Includes execution metrics and step generator for visualization.
 */

const ADSAlgorithms = {

    // Helper: Key Extractor and Comparator
    compare(a, b, key, isAscending = true) {
        let valA = a[key];
        let valB = b[key];

        // Normalize string comparison
        if (typeof valA === 'string' && typeof valB === 'string') {
            valA = valA.trim().toLowerCase();
            valB = valB.trim().toLowerCase();
            if (valA < valB) return isAscending ? -1 : 1;
            if (valA > valB) return isAscending ? 1 : -1;
            return 0;
        }

        // Numeric or other comparison
        if (valA < valB) return isAscending ? -1 : 1;
        if (valA > valB) return isAscending ? 1 : -1;
        return 0;
    },

    // -------------------------------------------------------------------------
    // 1. SEARCHING ALGORITHMS
    // -------------------------------------------------------------------------

    /**
     * Linear Search (Sequential Search)
     * Time Complexity: Best O(1), Average O(n), Worst O(n)
     * Space Complexity: O(1)
     */
    linearSearch(array, searchKey, query) {
        const startTime = performance.now();
        const results = [];
        const steps = [];
        let comparisons = 0;
        const q = String(query).trim().toLowerCase();

        for (let i = 0; i < array.length; i++) {
            comparisons++;
            const itemVal = String(array[i][searchKey]).toLowerCase();
            const isMatch = itemVal.includes(q);

            steps.push({
                index: i,
                element: array[i],
                testedValue: array[i][searchKey],
                isMatch: isMatch,
                comparisonNumber: comparisons
            });

            if (isMatch) {
                results.push({ index: i, item: array[i] });
            }
        }

        const endTime = performance.now();
        return {
            algorithm: 'Linear Search',
            searchKey,
            query,
            totalItems: array.length,
            comparisons,
            matchesFound: results.length,
            results,
            steps,
            executionTimeMs: (endTime - startTime).toFixed(3),
            explanation: `Sequential scan evaluated ${comparisons} of ${array.length} items. Each item's "${searchKey}" field was checked one-by-one. Found ${results.length} matching result(s).`
        };
    },

    /**
     * Binary Search
     * Time Complexity: Best O(1), Average O(log n), Worst O(log n)
     * Space Complexity: O(1) iterative
     * Prerequisite: Dataset MUST be sorted. We sort by searchKey first using Quick Sort.
     */
    binarySearch(array, searchKey, query) {
        const startTime = performance.now();
        const q = String(query).trim().toLowerCase();

        // 1. Pre-sort dataset by searchKey using custom Quick Sort
        const sortedDataResult = this.quickSort([...array], searchKey, true);
        const sortedArray = sortedDataResult.sortedArray;

        const steps = [];
        const results = [];
        let comparisons = 0;

        let low = 0;
        let high = sortedArray.length - 1;
        let exactMatchIndex = -1;

        while (low <= high) {
            comparisons++;
            const mid = Math.floor((low + high) / 2);
            const midVal = String(sortedArray[mid][searchKey]).toLowerCase();

            steps.push({
                stepNum: steps.length + 1,
                low,
                mid,
                high,
                midElement: sortedArray[mid],
                midValue: sortedArray[mid][searchKey],
                action: ''
            });

            const currentStep = steps[steps.length - 1];

            // Substring or exact match
            if (midVal.includes(q)) {
                exactMatchIndex = mid;
                currentStep.action = `Match found at index ${mid} ("${sortedArray[mid][searchKey]}")! Expanding to catch adjacent matches.`;
                break;
            } else if (midVal < q) {
                currentStep.action = `"${midVal}" < "${q}". Discarding left half [${low} .. ${mid}]. Searching right.`;
                low = mid + 1;
            } else {
                currentStep.action = `"${midVal}" > "${q}". Discarding right half [${mid} .. ${high}]. Searching left.`;
                high = mid - 1;
            }
        }

        // Expand left and right around mid to capture multiple matches sharing the prefix/query
        if (exactMatchIndex !== -1) {
            let left = exactMatchIndex;
            while (left >= 0 && String(sortedArray[left][searchKey]).toLowerCase().includes(q)) {
                results.unshift({ index: left, item: sortedArray[left] });
                left--;
            }
            let right = exactMatchIndex + 1;
            while (right < sortedArray.length && String(sortedArray[right][searchKey]).toLowerCase().includes(q)) {
                results.push({ index: right, item: sortedArray[right] });
                right++;
            }
        }

        const endTime = performance.now();
        return {
            algorithm: 'Binary Search',
            searchKey,
            query,
            totalItems: sortedArray.length,
            comparisons,
            matchesFound: results.length,
            results,
            steps,
            sortedArray,
            preSortComparisons: sortedDataResult.comparisons,
            executionTimeMs: (endTime - startTime).toFixed(3),
            explanation: `Dataset was first sorted by "${searchKey}" using Quick Sort (${sortedDataResult.comparisons} comparisons). Binary Search then repeatedly divided the search window in half, requiring only ${comparisons} interval comparisons to locate matches across ${sortedArray.length} items.`
        };
    },

    // -------------------------------------------------------------------------
    // 2. SORTING ALGORITHMS
    // -------------------------------------------------------------------------

    /**
     * Bubble Sort
     * Repeatedly steps through the list, compares adjacent elements and swaps them if out of order.
     * Time Complexity: Best O(n) (with early exit), Avg O(n²), Worst O(n²)
     * Space: O(1)
     */
    bubbleSort(arr, key, isAscending = true) {
        const startTime = performance.now();
        const a = [...arr];
        const n = a.length;
        let comparisons = 0;
        let swaps = 0;

        for (let i = 0; i < n - 1; i++) {
            let swapped = false;
            for (let j = 0; j < n - i - 1; j++) {
                comparisons++;
                if (this.compare(a[j], a[j + 1], key, isAscending) > 0) {
                    const temp = a[j];
                    a[j] = a[j + 1];
                    a[j + 1] = temp;
                    swaps++;
                    swapped = true;
                }
            }
            if (!swapped) break; // Optimized early exit
        }

        const endTime = performance.now();
        return {
            algorithm: 'Bubble Sort',
            key,
            order: isAscending ? 'Ascending' : 'Descending',
            comparisons,
            swaps,
            executionTimeMs: (endTime - startTime).toFixed(3),
            sortedArray: a,
            complexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)', stable: 'Yes' }
        };
    },

    /**
     * Selection Sort
     * Finds the minimum/maximum element in the unsorted section and puts it at the beginning.
     * Time Complexity: Best O(n²), Avg O(n²), Worst O(n²)
     * Space: O(1)
     */
    selectionSort(arr, key, isAscending = true) {
        const startTime = performance.now();
        const a = [...arr];
        const n = a.length;
        let comparisons = 0;
        let swaps = 0;

        for (let i = 0; i < n - 1; i++) {
            let targetIdx = i;
            for (let j = i + 1; j < n; j++) {
                comparisons++;
                if (this.compare(a[j], a[targetIdx], key, isAscending) < 0) {
                    targetIdx = j;
                }
            }
            if (targetIdx !== i) {
                const temp = a[i];
                a[i] = a[targetIdx];
                a[targetIdx] = temp;
                swaps++;
            }
        }

        const endTime = performance.now();
        return {
            algorithm: 'Selection Sort',
            key,
            order: isAscending ? 'Ascending' : 'Descending',
            comparisons,
            swaps,
            executionTimeMs: (endTime - startTime).toFixed(3),
            sortedArray: a,
            complexity: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)', stable: 'No' }
        };
    },

    /**
     * Insertion Sort
     * Builds the final sorted array one item at a time by inserting into correct place.
     * Time Complexity: Best O(n), Avg O(n²), Worst O(n²)
     * Space: O(1)
     */
    insertionSort(arr, key, isAscending = true) {
        const startTime = performance.now();
        const a = [...arr];
        const n = a.length;
        let comparisons = 0;
        let shifts = 0;

        for (let i = 1; i < n; i++) {
            const current = a[i];
            let j = i - 1;

            while (j >= 0) {
                comparisons++;
                if (this.compare(a[j], current, key, isAscending) > 0) {
                    a[j + 1] = a[j];
                    shifts++;
                    j--;
                } else {
                    break;
                }
            }
            a[j + 1] = current;
        }

        const endTime = performance.now();
        return {
            algorithm: 'Insertion Sort',
            key,
            order: isAscending ? 'Ascending' : 'Descending',
            comparisons,
            swaps: shifts, // array element movements
            executionTimeMs: (endTime - startTime).toFixed(3),
            sortedArray: a,
            complexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)', stable: 'Yes' }
        };
    },

    /**
     * Merge Sort
     * Divide and conquer recursive algorithm that halves the array, sorts and merges.
     * Time Complexity: Best O(n log n), Avg O(n log n), Worst O(n log n)
     * Space: O(n)
     */
    mergeSort(arr, key, isAscending = true) {
        const startTime = performance.now();
        let comparisons = 0;
        let merges = 0;

        const merge = (left, right) => {
            const result = [];
            let i = 0, j = 0;

            while (i < left.length && j < right.length) {
                comparisons++;
                if (this.compare(left[i], right[j], key, isAscending) <= 0) {
                    result.push(left[i]);
                    i++;
                } else {
                    result.push(right[j]);
                    j++;
                }
                merges++;
            }

            while (i < left.length) {
                result.push(left[i]);
                i++;
                merges++;
            }
            while (j < right.length) {
                result.push(right[j]);
                j++;
                merges++;
            }

            return result;
        };

        const sort = (subArr) => {
            if (subArr.length <= 1) return subArr;
            const mid = Math.floor(subArr.length / 2);
            const left = sort(subArr.slice(0, mid));
            const right = sort(subArr.slice(mid));
            return merge(left, right);
        };

        const sortedArray = sort([...arr]);
        const endTime = performance.now();

        return {
            algorithm: 'Merge Sort',
            key,
            order: isAscending ? 'Ascending' : 'Descending',
            comparisons,
            swaps: merges, // data movement ops
            executionTimeMs: (endTime - startTime).toFixed(3),
            sortedArray,
            complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)', stable: 'Yes' }
        };
    },

    /**
     * Quick Sort
     * Divide and conquer algorithm using Lomuto partitioning around a pivot.
     * Time Complexity: Best O(n log n), Avg O(n log n), Worst O(n²)
     * Space: O(log n) call stack
     */
    quickSort(arr, key, isAscending = true) {
        const startTime = performance.now();
        const a = [...arr];
        let comparisons = 0;
        let swaps = 0;

        const partition = (low, high) => {
            const pivot = a[high];
            let i = low - 1;

            for (let j = low; j < high; j++) {
                comparisons++;
                if (this.compare(a[j], pivot, key, isAscending) <= 0) {
                    i++;
                    const temp = a[i];
                    a[i] = a[j];
                    a[j] = temp;
                    swaps++;
                }
            }

            const temp = a[i + 1];
            a[i + 1] = a[high];
            a[high] = temp;
            swaps++;
            return i + 1;
        };

        const sort = (low, high) => {
            if (low < high) {
                const pi = partition(low, high);
                sort(low, pi - 1);
                sort(pi + 1, high);
            }
        };

        if (a.length > 0) {
            sort(0, a.length - 1);
        }

        const endTime = performance.now();
        return {
            algorithm: 'Quick Sort',
            key,
            order: isAscending ? 'Ascending' : 'Descending',
            comparisons,
            swaps,
            executionTimeMs: (endTime - startTime).toFixed(3),
            sortedArray: a,
            complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)', stable: 'No' }
        };
    },

    // -------------------------------------------------------------------------
    // 3. STEP-BY-STEP GENERATORS FOR ANIMATED VISUALIZATION
    // -------------------------------------------------------------------------

    /**
     * Generate visual snapshot states for Bubble Sort
     */
    *generateBubbleSortFrames(items, key, isAscending = true) {
        const arr = items.map(item => ({ ...item }));
        const n = arr.length;
        let comparisons = 0;
        let swaps = 0;

        yield {
            arr: arr.map(x => ({ ...x })),
            highlightIndices: [],
            swapIndices: [],
            sortedIndices: [],
            comparisons,
            swaps,
            message: `Starting Bubble Sort on ${n} items sorted by "${key}" (${isAscending ? 'ASC' : 'DESC'}).`
        };

        for (let i = 0; i < n - 1; i++) {
            let hasSwapped = false;
            for (let j = 0; j < n - i - 1; j++) {
                comparisons++;
                yield {
                    arr: arr.map(x => ({ ...x })),
                    highlightIndices: [j, j + 1],
                    swapIndices: [],
                    sortedIndices: Array.from({ length: i }, (_, k) => n - 1 - k),
                    comparisons,
                    swaps,
                    message: `Comparing item ${j} ("${arr[j][key]}") with item ${j + 1} ("${arr[j + 1][key]}").`
                };

                if (this.compare(arr[j], arr[j + 1], key, isAscending) > 0) {
                    const temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                    swaps++;
                    hasSwapped = true;

                    yield {
                        arr: arr.map(x => ({ ...x })),
                        highlightIndices: [],
                        swapIndices: [j, j + 1],
                        sortedIndices: Array.from({ length: i }, (_, k) => n - 1 - k),
                        comparisons,
                        swaps,
                        message: `Swapped: "${arr[j + 1][key]}" moved past "${arr[j][key]}".`
                    };
                }
            }
            if (!hasSwapped) {
                yield {
                    arr: arr.map(x => ({ ...x })),
                    highlightIndices: [],
                    swapIndices: [],
                    sortedIndices: Array.from({ length: n }, (_, k) => k),
                    comparisons,
                    swaps,
                    message: `Early exit: No swaps needed in pass ${i + 1}. Array is fully sorted!`
                };
                return;
            }
        }

        yield {
            arr: arr.map(x => ({ ...x })),
            highlightIndices: [],
            swapIndices: [],
            sortedIndices: Array.from({ length: n }, (_, k) => k),
            comparisons,
            swaps,
            message: `Bubble Sort Complete! Total comparisons: ${comparisons}, swaps: ${swaps}.`
        };
    },

    /**
     * Generate visual snapshot states for Selection Sort
     */
    *generateSelectionSortFrames(items, key, isAscending = true) {
        const arr = items.map(item => ({ ...item }));
        const n = arr.length;
        let comparisons = 0;
        let swaps = 0;

        yield {
            arr: arr.map(x => ({ ...x })),
            highlightIndices: [],
            swapIndices: [],
            sortedIndices: [],
            comparisons,
            swaps,
            message: `Starting Selection Sort on ${n} items sorted by "${key}".`
        };

        for (let i = 0; i < n - 1; i++) {
            let targetIdx = i;
            for (let j = i + 1; j < n; j++) {
                comparisons++;
                yield {
                    arr: arr.map(x => ({ ...x })),
                    highlightIndices: [j, targetIdx],
                    swapIndices: [],
                    sortedIndices: Array.from({ length: i }, (_, k) => k),
                    comparisons,
                    swaps,
                    message: `Scanning: comparing current min/max index ${targetIdx} ("${arr[targetIdx][key]}") with index ${j} ("${arr[j][key]}").`
                };

                if (this.compare(arr[j], arr[targetIdx], key, isAscending) < 0) {
                    targetIdx = j;
                }
            }

            if (targetIdx !== i) {
                const temp = arr[i];
                arr[i] = arr[targetIdx];
                arr[targetIdx] = temp;
                swaps++;

                yield {
                    arr: arr.map(x => ({ ...x })),
                    highlightIndices: [],
                    swapIndices: [i, targetIdx],
                    sortedIndices: Array.from({ length: i + 1 }, (_, k) => k),
                    comparisons,
                    swaps,
                    message: `Placed "${arr[i][key]}" at position ${i} (swapped with position ${targetIdx}).`
                };
            }
        }

        yield {
            arr: arr.map(x => ({ ...x })),
            highlightIndices: [],
            swapIndices: [],
            sortedIndices: Array.from({ length: n }, (_, k) => k),
            comparisons,
            swaps,
            message: `Selection Sort Complete! Total comparisons: ${comparisons}, swaps: ${swaps}.`
        };
    },

    /**
     * Generate visual snapshot states for Insertion Sort
     */
    *generateInsertionSortFrames(items, key, isAscending = true) {
        const arr = items.map(item => ({ ...item }));
        const n = arr.length;
        let comparisons = 0;
        let shifts = 0;

        for (let i = 1; i < n; i++) {
            const current = arr[i];
            let j = i - 1;

            yield {
                arr: arr.map(x => ({ ...x })),
                highlightIndices: [i],
                swapIndices: [],
                sortedIndices: Array.from({ length: i }, (_, k) => k),
                comparisons,
                swaps: shifts,
                message: `Picking up element at index ${i} ("${current[key]}") to insert into sorted sublist [0..${i - 1}].`
            };

            while (j >= 0) {
                comparisons++;
                if (this.compare(arr[j], current, key, isAscending) > 0) {
                    arr[j + 1] = arr[j];
                    shifts++;
                    yield {
                        arr: arr.map(x => ({ ...x })),
                        highlightIndices: [j, j + 1],
                        swapIndices: [j + 1],
                        sortedIndices: [],
                        comparisons,
                        swaps: shifts,
                        message: `Shifted "${arr[j + 1][key]}" right by 1 position.`
                    };
                    j--;
                } else {
                    break;
                }
            }
            arr[j + 1] = current;

            yield {
                arr: arr.map(x => ({ ...x })),
                highlightIndices: [j + 1],
                swapIndices: [],
                sortedIndices: Array.from({ length: i + 1 }, (_, k) => k),
                comparisons,
                swaps: shifts,
                message: `Inserted "${current[key]}" at index ${j + 1}.`
            };
        }

        yield {
            arr: arr.map(x => ({ ...x })),
            highlightIndices: [],
            swapIndices: [],
            sortedIndices: Array.from({ length: n }, (_, k) => k),
            comparisons,
            swaps: shifts,
            message: `Insertion Sort Complete! Comparisons: ${comparisons}, shifts: ${shifts}.`
        };
    },

    /**
     * Generate visual frames for Quick Sort
     */
    *generateQuickSortFrames(items, key, isAscending = true) {
        const arr = items.map(item => ({ ...item }));
        let comparisons = 0;
        let swaps = 0;
        const frames = [];

        function* quickSortHelper(low, high) {
            if (low < high) {
                const pivot = arr[high];
                let i = low - 1;

                yield {
                    arr: arr.map(x => ({ ...x })),
                    highlightIndices: [high],
                    swapIndices: [],
                    pivotIndex: high,
                    comparisons,
                    swaps,
                    message: `Chosen pivot "${pivot[key]}" at index ${high} for range [${low} .. ${high}].`
                };

                for (let j = low; j < high; j++) {
                    comparisons++;
                    yield {
                        arr: arr.map(x => ({ ...x })),
                        highlightIndices: [j, high],
                        swapIndices: [],
                        pivotIndex: high,
                        comparisons,
                        swaps,
                        message: `Comparing element ${j} ("${arr[j][key]}") with pivot "${pivot[key]}".`
                    };

                    if (ADSAlgorithms.compare(arr[j], pivot, key, isAscending) <= 0) {
                        i++;
                        const temp = arr[i];
                        arr[i] = arr[j];
                        arr[j] = temp;
                        swaps++;

                        yield {
                            arr: arr.map(x => ({ ...x })),
                            highlightIndices: [],
                            swapIndices: [i, j],
                            pivotIndex: high,
                            comparisons,
                            swaps,
                            message: `Partition swap: placed smaller/equal element at boundary index ${i}.`
                        };
                    }
                }

                // Put pivot in its final position
                const temp = arr[i + 1];
                arr[i + 1] = arr[high];
                arr[high] = temp;
                swaps++;
                const pi = i + 1;

                yield {
                    arr: arr.map(x => ({ ...x })),
                    highlightIndices: [],
                    swapIndices: [pi, high],
                    pivotIndex: pi,
                    comparisons,
                    swaps,
                    message: `Pivot placed in its permanent position at index ${pi} ("${arr[pi][key]}").`
                };

                yield* quickSortHelper(low, pi - 1);
                yield* quickSortHelper(pi + 1, high);
            }
        }

        yield* quickSortHelper(0, arr.length - 1);

        yield {
            arr: arr.map(x => ({ ...x })),
            highlightIndices: [],
            swapIndices: [],
            sortedIndices: Array.from({ length: arr.length }, (_, k) => k),
            comparisons,
            swaps,
            message: `Quick Sort Complete! Total comparisons: ${comparisons}, swaps: ${swaps}.`
        };
    },

    /**
     * Generate visual frames for Linear Search
     */
    *generateLinearSearchFrames(items, key, query) {
        const arr = items.map(item => ({ ...item }));
        const q = String(query).trim().toLowerCase();
        let comparisons = 0;
        const matches = [];

        for (let i = 0; i < arr.length; i++) {
            comparisons++;
            const itemVal = String(arr[i][key]).toLowerCase();
            const isMatch = itemVal.includes(q);

            if (isMatch) matches.push(i);

            yield {
                arr: arr.map(x => ({ ...x })),
                highlightIndices: [i],
                foundIndices: [...matches],
                comparisons,
                swaps: 0,
                message: isMatch
                    ? `Match found at index ${i}! ("${arr[i][key]}" contains "${query}").`
                    : `Checked index ${i} ("${arr[i][key]}"). No match.`
            };
        }

        yield {
            arr: arr.map(x => ({ ...x })),
            highlightIndices: [],
            foundIndices: [...matches],
            comparisons,
            swaps: 0,
            message: `Linear Search Complete! Found ${matches.length} matching element(s) in ${comparisons} comparisons.`
        };
    },

    /**
     * Generate visual frames for Binary Search
     */
    *generateBinarySearchFrames(items, key, query) {
        // First sort
        const sortedRes = this.quickSort(items, key, true);
        const arr = sortedRes.sortedArray;
        const q = String(query).trim().toLowerCase();
        let comparisons = 0;
        let low = 0;
        let high = arr.length - 1;
        const matches = [];

        yield {
            arr: arr.map(x => ({ ...x })),
            highlightIndices: [],
            windowIndices: [low, high],
            comparisons: 0,
            swaps: 0,
            message: `Dataset sorted by "${key}". Active window initialized to [0 .. ${high}].`
        };

        while (low <= high) {
            comparisons++;
            const mid = Math.floor((low + high) / 2);
            const midVal = String(arr[mid][key]).toLowerCase();

            yield {
                arr: arr.map(x => ({ ...x })),
                highlightIndices: [mid],
                windowIndices: [low, high],
                comparisons,
                swaps: 0,
                message: `Checking midpoint at index ${mid} ("${arr[mid][key]}"). Current window: [${low} .. ${high}].`
            };

            if (midVal.includes(q)) {
                matches.push(mid);
                // Expand around mid to catch adjacent matches
                let l = mid - 1;
                while (l >= 0 && String(arr[l][key]).toLowerCase().includes(q)) {
                    matches.push(l);
                    l--;
                }
                let r = mid + 1;
                while (r < arr.length && String(arr[r][key]).toLowerCase().includes(q)) {
                    matches.push(r);
                    r++;
                }

                yield {
                    arr: arr.map(x => ({ ...x })),
                    highlightIndices: [],
                    foundIndices: [...matches],
                    comparisons,
                    swaps: 0,
                    message: `Target match found at index ${mid} ("${arr[mid][key]}")! Captured ${matches.length} matching item(s).`
                };
                return;
            } else if (midVal < q) {
                low = mid + 1;
                yield {
                    arr: arr.map(x => ({ ...x })),
                    highlightIndices: [],
                    windowIndices: [low, high],
                    comparisons,
                    swaps: 0,
                    message: `"${midVal}" < "${query}". Target lies to the right. Discarding left half.`
                };
            } else {
                high = mid - 1;
                yield {
                    arr: arr.map(x => ({ ...x })),
                    highlightIndices: [],
                    windowIndices: [low, high],
                    comparisons,
                    swaps: 0,
                    message: `"${midVal}" > "${query}". Target lies to the left. Discarding right half.`
                };
            }
        }

        yield {
            arr: arr.map(x => ({ ...x })),
            highlightIndices: [],
            foundIndices: [],
            comparisons,
            swaps: 0,
            message: `Binary Search finished: "${query}" not found in dataset after ${comparisons} comparisons.`
        };
    }
};
