/**
 * Library ADS PBL System - Main Application Controller
 * Handles UI interactions, module switching, forms, CRUD, searching, sorting, and reporting.
 */

// Global state
const App = {
    currentModule: 'dashboard',
    booksPage: 1,
    booksPerPage: 8,
    booksFilterCategory: 'All',
    booksSearchQuery: '',

    init() {
        AuthManager.init();
        this.cacheDOM();
        this.bindEvents();
        this.renderCurrentModule();
        this.updateNotificationBadge();
    },

    cacheDOM() {
        this.navLinks = document.querySelectorAll('.sidebar-nav-item');
        this.moduleContainers = document.querySelectorAll('.app-module');
        this.toastContainer = document.getElementById('toast-container');
    },

    bindEvents() {
        // Navigation clicks
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetModule = link.dataset.module;
                if (targetModule) {
                    this.switchModule(targetModule);
                }
            });
        });

        // Quick action buttons
        document.querySelectorAll('[data-action="navigate"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = btn.dataset.target;
                if (target) this.switchModule(target);
            });
        });

        // Mobile sidebar toggle
        const menuToggle = document.getElementById('mobile-menu-toggle');
        const sidebar = document.getElementById('app-sidebar');
        if (menuToggle && sidebar) {
            menuToggle.addEventListener('click', () => {
                sidebar.classList.toggle('open');
            });
        }

        // Global Reset Data confirmation
        const resetDataBtn = document.getElementById('btn-reset-seed-data');
        if (resetDataBtn) {
            resetDataBtn.addEventListener('click', () => {
                if (confirm("Reset library database back to fresh default sample records?")) {
                    LibraryData.resetToDefaults();
                    this.showToast("Database successfully restored to original seed records!", "success");
                    this.renderCurrentModule();
                }
            });
        }
    },

    switchModule(moduleId) {
        this.currentModule = moduleId;

        // Update active class on nav
        this.navLinks.forEach(link => {
            if (link.dataset.module === moduleId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Update breadcrumb
        const crumb = document.getElementById('current-crumb');
        if (crumb) {
            const titleMap = {
                'dashboard': 'Dashboard',
                'view-books': 'View All Books',
                'add-book': 'Add New Book',
                'search-books': 'ADS Searching Algorithms',
                'sort-books': 'ADS Sorting Algorithms',
                'visualizer': 'Algorithm Step Visualizer',
                'issue-book': 'Book Issue Management',
                'return-book': 'Book Return Management',
                'history': 'Circulation History',
                'students': 'Student Directory',
                'reports': 'Reports & Analytics'
            };
            crumb.textContent = titleMap[moduleId] || moduleId;
        }

        // Close mobile sidebar if open
        const sidebar = document.getElementById('app-sidebar');
        if (sidebar && sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
        }

        // Hide all modules, show selected
        this.moduleContainers.forEach(container => {
            if (container.id === `module-${moduleId}`) {
                container.style.display = 'block';
            } else {
                container.style.display = 'none';
            }
        });

        // Initialize specific module logic
        this.renderCurrentModule();
    },

    renderCurrentModule() {
        switch (this.currentModule) {
            case 'dashboard':
                this.renderDashboard();
                break;
            case 'view-books':
                this.renderBooksTable();
                break;
            case 'add-book':
                this.initAddBookForm();
                break;
            case 'search-books':
                this.initSearchModule();
                break;
            case 'sort-books':
                this.initSortModule();
                break;
            case 'issue-book':
                this.initIssueForm();
                break;
            case 'return-book':
                this.initReturnModule();
                break;
            case 'history':
                this.renderHistoryModule();
                break;
            case 'students':
                this.renderStudentsModule();
                break;
            case 'reports':
                this.renderReportsModule();
                break;
            case 'visualizer':
                if (window.initVisualizer) window.initVisualizer();
                break;
        }
    },

    // -------------------------------------------------------------------------
    // Toast Notification System
    // -------------------------------------------------------------------------
    showToast(message, type = 'info', duration = 3800) {
        if (!this.toastContainer) {
            this.toastContainer = document.getElementById('toast-container');
        }
        if (!this.toastContainer) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type} animate-slide-in`;

        const iconMap = {
            success: 'fa-solid fa-circle-check',
            error: 'fa-solid fa-triangle-exclamation',
            warning: 'fa-solid fa-bell',
            info: 'fa-solid fa-circle-info'
        };

        toast.innerHTML = `
            <div class="toast-icon"><i class="${iconMap[type] || iconMap.info}"></i></div>
            <div class="toast-content">
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
            <div class="toast-progress"></div>
        `;

        this.toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('animate-slide-out');
            setTimeout(() => toast.remove(), 350);
        }, duration);
    },

    updateNotificationBadge() {
        const stats = LibraryData.getDashboardStats();
        const badge = document.getElementById('overdue-badge');
        if (badge) {
            if (stats.overdueBooks > 0) {
                badge.textContent = stats.overdueBooks;
                badge.style.display = 'inline-flex';
            } else {
                badge.style.display = 'none';
            }
        }
    },

    // -------------------------------------------------------------------------
    // MODULE 1: DASHBOARD
    // -------------------------------------------------------------------------
    renderDashboard() {
        const stats = LibraryData.getDashboardStats();

        // Animate counter numbers
        this.animateCounter('stat-total-books', stats.totalBooks);
        this.animateCounter('stat-available-books', stats.availableBooks);
        this.animateCounter('stat-issued-books', stats.issuedBooks);
        this.animateCounter('stat-total-students', stats.totalStudents);
        this.animateCounter('stat-overdue-books', stats.overdueBooks);
        this.animateCounter('stat-fine-collected', `₹${stats.totalFineCollected}`);

        // Category breakdown progress bars
        this.renderCategoryBreakdown();

        // Recent Activity Table
        this.renderRecentActivityTable();

        this.updateNotificationBadge();
    },

    animateCounter(elementId, targetVal) {
        const el = document.getElementById(elementId);
        if (!el) return;
        if (typeof targetVal === 'string' && targetVal.startsWith('₹')) {
            el.textContent = targetVal;
            return;
        }

        let start = 0;
        const end = parseInt(targetVal, 10);
        const duration = 600;
        const stepTime = Math.max(20, Math.floor(duration / Math.max(1, end)));

        const timer = setInterval(() => {
            start++;
            el.textContent = start;
            if (start >= end) {
                el.textContent = end;
                clearInterval(timer);
            }
        }, stepTime);
    },

    renderCategoryBreakdown() {
        const container = document.getElementById('dashboard-category-bars');
        if (!container) return;

        const books = LibraryData.getBooks();
        const categoryMap = {};
        books.forEach(b => {
            categoryMap[b.category] = (categoryMap[b.category] || 0) + 1;
        });

        const total = books.length || 1;
        let html = '';

        for (const [cat, count] of Object.entries(categoryMap)) {
            const pct = Math.round((count / total) * 100);
            html += `
                <div class="category-stat-row">
                    <div class="cat-label-row">
                        <span class="cat-name">${cat}</span>
                        <span class="cat-count">${count} books (${pct}%)</span>
                    </div>
                    <div class="cat-progress-track">
                        <div class="cat-progress-fill" style="width: ${pct}%"></div>
                    </div>
                </div>
            `;
        }

        container.innerHTML = html;
    },

    renderRecentActivityTable() {
        const container = document.getElementById('dashboard-recent-activity-tbody');
        if (!container) return;

        const txns = LibraryData.getTransactions().slice(0, 5);

        if (txns.length === 0) {
            container.innerHTML = `<tr><td colspan="6" class="text-center text-muted">No transactions recorded yet.</td></tr>`;
            return;
        }

        container.innerHTML = txns.map(t => `
            <tr>
                <td><span class="fw-semibold text-gold">${t.id}</span></td>
                <td>
                    <div class="fw-medium">${t.bookTitle}</div>
                    <div class="text-xs text-muted">${t.bookId}</div>
                </td>
                <td>${t.studentName}</td>
                <td>${t.issueDate}</td>
                <td>${t.dueDate}</td>
                <td>${this.renderStatusBadge(t.status)}</td>
            </tr>
        `).join('');
    },

    renderStatusBadge(status) {
        if (status === 'Available') {
            return `<span class="badge badge-success"><i class="fa-solid fa-check"></i> Available</span>`;
        } else if (status === 'Issued') {
            return `<span class="badge badge-warning"><i class="fa-solid fa-clock"></i> Issued</span>`;
        } else if (status === 'Overdue') {
            return `<span class="badge badge-danger"><i class="fa-solid fa-triangle-exclamation"></i> Overdue</span>`;
        } else if (status === 'Returned') {
            return `<span class="badge badge-info"><i class="fa-solid fa-rotate-left"></i> Returned</span>`;
        }
        return `<span class="badge badge-secondary">${status}</span>`;
    },

    // -------------------------------------------------------------------------
    // MODULE 2 & 3: BOOK MANAGEMENT (VIEW ALL & ADD)
    // -------------------------------------------------------------------------
    renderBooksTable() {
        const books = LibraryData.getBooks();
        const tbody = document.getElementById('books-table-tbody');
        const countBadge = document.getElementById('books-total-count');
        const categoryFilter = document.getElementById('books-category-filter');
        const searchInput = document.getElementById('books-search-filter');
        const paginationInfo = document.getElementById('books-pagination-info');

        // Populate category dropdown if empty
        if (categoryFilter && categoryFilter.options.length <= 1) {
            const categories = [...new Set(books.map(b => b.category))].sort();
            categories.forEach(c => {
                const opt = document.createElement('option');
                opt.value = c;
                opt.textContent = c;
                categoryFilter.appendChild(opt);
            });
        }

        // Filter
        let filtered = books;
        if (this.booksFilterCategory && this.booksFilterCategory !== 'All') {
            filtered = filtered.filter(b => b.category === this.booksFilterCategory);
        }
        if (this.booksSearchQuery) {
            const q = this.booksSearchQuery.toLowerCase();
            filtered = filtered.filter(b =>
                b.id.toLowerCase().includes(q) ||
                b.title.toLowerCase().includes(q) ||
                b.author.toLowerCase().includes(q) ||
                b.publisher.toLowerCase().includes(q)
            );
        }

        if (countBadge) countBadge.textContent = `${filtered.length} Books`;

        // Pagination
        const totalItems = filtered.length;
        const totalPages = Math.ceil(totalItems / this.booksPerPage) || 1;
        if (this.booksPage > totalPages) this.booksPage = totalPages;
        const startIdx = (this.booksPage - 1) * this.booksPerPage;
        const pagedItems = filtered.slice(startIdx, startIdx + this.booksPerPage);

        if (paginationInfo) {
            paginationInfo.textContent = `Showing ${Math.min(startIdx + 1, totalItems)} to ${Math.min(startIdx + this.booksPerPage, totalItems)} of ${totalItems} books`;
        }

        // Render rows
        if (!tbody) return;
        if (pagedItems.length === 0) {
            tbody.innerHTML = `<tr><td colspan="8" class="text-center py-5 text-muted">No books matching the selected filter.</td></tr>`;
            return;
        }

        tbody.innerHTML = pagedItems.map(b => `
            <tr>
                <td><span class="badge-code">${b.id}</span></td>
                <td>
                    <div class="fw-semibold text-light">${b.title}</div>
                    <div class="text-xs text-muted">ISBN: ${b.isbn || 'N/A'} • ${b.rack || 'Shelf'}</div>
                </td>
                <td>${b.author}</td>
                <td><span class="cat-pill">${b.category}</span></td>
                <td>${b.publisher}</td>
                <td>${b.year}</td>
                <td>${this.renderStatusBadge(b.status)}</td>
                <td>
                    <div class="table-actions">
                        <button class="btn-icon" title="View Details" onclick="App.openViewBookModal('${b.id}')">
                            <i class="fa-solid fa-eye"></i>
                        </button>
                        <button class="btn-icon text-amber" title="Edit Book" onclick="App.openEditBookModal('${b.id}')">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button class="btn-icon text-crimson" title="Delete Book" onclick="App.deleteBook('${b.id}')">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        // Wire filter listeners once
        if (categoryFilter && !categoryFilter.dataset.bound) {
            categoryFilter.dataset.bound = 'true';
            categoryFilter.addEventListener('change', (e) => {
                this.booksFilterCategory = e.target.value;
                this.booksPage = 1;
                this.renderBooksTable();
            });
        }

        if (searchInput && !searchInput.dataset.bound) {
            searchInput.dataset.bound = 'true';
            searchInput.addEventListener('input', (e) => {
                this.booksSearchQuery = e.target.value.trim();
                this.booksPage = 1;
                this.renderBooksTable();
            });
        }

        // Pagination buttons
        const prevBtn = document.getElementById('books-prev-page');
        const nextBtn = document.getElementById('books-next-page');
        if (prevBtn && !prevBtn.dataset.bound) {
            prevBtn.dataset.bound = 'true';
            prevBtn.addEventListener('click', () => {
                if (this.booksPage > 1) {
                    this.booksPage--;
                    this.renderBooksTable();
                }
            });
        }
        if (nextBtn && !nextBtn.dataset.bound) {
            nextBtn.dataset.bound = 'true';
            nextBtn.addEventListener('click', () => {
                const maxPage = Math.ceil(filtered.length / this.booksPerPage);
                if (this.booksPage < maxPage) {
                    this.booksPage++;
                    this.renderBooksTable();
                }
            });
        }
    },

    initAddBookForm() {
        const form = document.getElementById('add-book-form');
        if (!form || form.dataset.bound) return;
        form.dataset.bound = 'true';

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('add-book-title').value.trim();
            const author = document.getElementById('add-book-author').value.trim();
            const category = document.getElementById('add-book-category').value;
            const publisher = document.getElementById('add-book-publisher').value.trim();
            const year = parseInt(document.getElementById('add-book-year').value, 10);
            const rack = document.getElementById('add-book-rack').value.trim();
            const isbn = document.getElementById('add-book-isbn').value.trim();
            const customId = document.getElementById('add-book-id').value.trim();

            if (!title || !author || !category || isNaN(year)) {
                this.showToast("Please fill in all required fields accurately.", "error");
                return;
            }

            try {
                const newBook = LibraryData.addBook({
                    id: customId || null,
                    title,
                    author,
                    category,
                    publisher: publisher || "Academic Press",
                    year,
                    rack: rack || "Rack General",
                    isbn: isbn || "978-0000000000",
                    status: "Available"
                });

                this.showToast(`Book "${newBook.title}" successfully added with ID ${newBook.id}!`, "success");
                form.reset();
                this.switchModule('view-books');
            } catch (err) {
                this.showToast(err.message, "error");
            }
        });
    },

    openViewBookModal(id) {
        const book = LibraryData.getBookById(id);
        if (!book) return;

        const modal = document.getElementById('view-book-modal');
        const content = document.getElementById('view-book-modal-content');
        if (!modal || !content) return;

        content.innerHTML = `
            <div class="modal-detail-grid">
                <div class="detail-item">
                    <span class="detail-label">Book ID</span>
                    <span class="detail-value text-gold fw-bold">${book.id}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Status</span>
                    <span class="detail-value">${this.renderStatusBadge(book.status)}</span>
                </div>
                <div class="detail-item full-width">
                    <span class="detail-label">Title</span>
                    <span class="detail-value text-lg fw-semibold">${book.title}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Author</span>
                    <span class="detail-value">${book.author}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Category</span>
                    <span class="detail-value"><span class="cat-pill">${book.category}</span></span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Publisher</span>
                    <span class="detail-value">${book.publisher}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Publication Year</span>
                    <span class="detail-value">${book.year}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Shelf / Rack</span>
                    <span class="detail-value">${book.rack || 'Not specified'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Total Times Borrowed</span>
                    <span class="detail-value">${book.borrowsCount || 0} times</span>
                </div>
            </div>
        `;
        modal.classList.add('open');
    },

    openEditBookModal(id) {
        const book = LibraryData.getBookById(id);
        if (!book) return;

        const modal = document.getElementById('edit-book-modal');
        if (!modal) return;

        document.getElementById('edit-book-id').value = book.id;
        document.getElementById('edit-book-title').value = book.title;
        document.getElementById('edit-book-author').value = book.author;
        document.getElementById('edit-book-category').value = book.category;
        document.getElementById('edit-book-publisher').value = book.publisher;
        document.getElementById('edit-book-year').value = book.year;
        document.getElementById('edit-book-rack').value = book.rack || '';
        document.getElementById('edit-book-isbn').value = book.isbn || '';

        modal.classList.add('open');
    },

    handleSaveEditBook() {
        const id = document.getElementById('edit-book-id').value;
        const title = document.getElementById('edit-book-title').value.trim();
        const author = document.getElementById('edit-book-author').value.trim();
        const category = document.getElementById('edit-book-category').value;
        const publisher = document.getElementById('edit-book-publisher').value.trim();
        const year = parseInt(document.getElementById('edit-book-year').value, 10);
        const rack = document.getElementById('edit-book-rack').value.trim();
        const isbn = document.getElementById('edit-book-isbn').value.trim();

        if (!title || !author) {
            this.showToast("Title and Author cannot be empty.", "error");
            return;
        }

        LibraryData.updateBook({
            id,
            title,
            author,
            category,
            publisher,
            year,
            rack,
            isbn
        });

        this.showToast(`Book ${id} updated successfully.`, "success");
        document.getElementById('edit-book-modal').classList.remove('open');
        this.renderBooksTable();
    },

    deleteBook(id) {
        const book = LibraryData.getBookById(id);
        if (!book) return;

        if (confirm(`Are you sure you want to permanently delete "${book.title}" (${id})?`)) {
            try {
                LibraryData.deleteBook(id);
                this.showToast(`Book ${id} was deleted from records.`, "success");
                this.renderBooksTable();
            } catch (err) {
                this.showToast(err.message, "error");
            }
        }
    },

    // -------------------------------------------------------------------------
    // MODULE 4: SEARCHING ALGORITHMS (ADS CORE REQUIREMENT)
    // -------------------------------------------------------------------------
    initSearchModule() {
        const form = document.getElementById('search-books-form');
        if (!form || form.dataset.bound) return;
        form.dataset.bound = 'true';

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.executeSearch();
        });
    },

    executeSearch() {
        const algoType = document.getElementById('search-algorithm-select').value;
        const key = document.getElementById('search-key-select').value;
        const query = document.getElementById('search-query-input').value.trim();

        if (!query) {
            this.showToast("Please enter a search query.", "warning");
            return;
        }

        const books = LibraryData.getBooks();
        let result = null;

        if (algoType === 'linear') {
            result = ADSAlgorithms.linearSearch(books, key, query);
        } else if (algoType === 'binary') {
            result = ADSAlgorithms.binarySearch(books, key, query);
        }

        this.renderSearchResults(result);
    },

    renderSearchResults(result) {
        const container = document.getElementById('search-results-container');
        if (!container) return;

        const isBinary = result.algorithm.includes('Binary');

        container.innerHTML = `
            <div class="search-metrics-banner card animate-fade-in">
                <div class="metric-header-row">
                    <div>
                        <span class="badge badge-gold">${result.algorithm}</span>
                        <h4 class="mt-2 text-light">Execution Telemetry</h4>
                    </div>
                    <div class="metric-chips">
                        <div class="metric-chip">
                            <span class="chip-val">${result.comparisons}</span>
                            <span class="chip-label">Comparisons Made</span>
                        </div>
                        <div class="metric-chip">
                            <span class="chip-val">${result.matchesFound}</span>
                            <span class="chip-label">Matching Items</span>
                        </div>
                        <div class="metric-chip">
                            <span class="chip-val">${result.executionTimeMs} ms</span>
                            <span class="chip-label">Execution Time</span>
                        </div>
                    </div>
                </div>

                <div class="ads-explanation-box mt-3">
                    <div class="fw-semibold text-gold"><i class="fa-solid fa-microchip"></i> ADS Algorithm Analysis:</div>
                    <p class="mb-1 text-sm text-muted">${result.explanation}</p>
                    ${isBinary ? `<div class="text-xs text-amber"><i class="fa-solid fa-arrow-up-right-dots"></i> <strong>Note:</strong> Binary search requires sorted data. The records were pre-sorted by "${result.searchKey}" using Quick Sort (${result.preSortComparisons} partition comparisons) before performing binary divide-and-conquer.</div>` : ''}
                </div>
            </div>

            <div class="mt-4">
                <h5 class="section-subheading mb-3">Matched Book Records (${result.matchesFound})</h5>
                ${result.matchesFound === 0 ? `
                    <div class="empty-state card text-center py-5">
                        <i class="fa-solid fa-magnifying-glass fa-3x text-muted mb-3"></i>
                        <h5>No matches found</h5>
                        <p class="text-muted">No book record matched "${result.query}" under key "${result.searchKey}".</p>
                    </div>
                ` : `
                    <div class="table-responsive card">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Book ID</th>
                                    <th>Book Title</th>
                                    <th>Author</th>
                                    <th>Category</th>
                                    <th>Year</th>
                                    <th>Status</th>
                                    <th>Location</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${result.results.map(r => `
                                    <tr class="highlight-matched-row">
                                        <td><span class="badge-code text-gold">${r.item.id}</span></td>
                                        <td class="fw-semibold">${r.item.title}</td>
                                        <td>${r.item.author}</td>
                                        <td><span class="cat-pill">${r.item.category}</span></td>
                                        <td>${r.item.year}</td>
                                        <td>${this.renderStatusBadge(r.item.status)}</td>
                                        <td>${r.item.rack}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                `}
            </div>

            <!-- Algorithm Probe Steps Log -->
            <div class="mt-4 card">
                <div class="card-header-flex">
                    <h5 class="mb-0 text-light"><i class="fa-solid fa-list-ol"></i> Step-by-Step Search Comparison Log</h5>
                    <span class="text-xs text-muted">Showing first ${Math.min(result.steps.length, 15)} evaluation steps</span>
                </div>
                <div class="table-responsive mt-3">
                    <table class="data-table text-sm">
                        <thead>
                            <tr>
                                <th>Step #</th>
                                <th>Evaluated Index</th>
                                <th>Checked Value (${result.searchKey})</th>
                                <th>Result / Decision Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${result.steps.slice(0, 15).map(s => `
                                <tr>
                                    <td><span class="step-num-circle">${s.comparisonNumber || s.stepNum}</span></td>
                                    <td>Index ${s.index !== undefined ? s.index : s.mid}</td>
                                    <td class="fw-mono">${s.testedValue !== undefined ? s.testedValue : s.midValue}</td>
                                    <td>
                                        ${s.action
                                            ? `<span class="text-light">${s.action}</span>`
                                            : (s.isMatch
                                                ? `<span class="text-success fw-bold"><i class="fa-solid fa-check"></i> Substring Match Found</span>`
                                                : `<span class="text-muted">Did not match query</span>`)
                                        }
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    // -------------------------------------------------------------------------
    // MODULE 5: SORTING ALGORITHMS (ADS CORE REQUIREMENT)
    // -------------------------------------------------------------------------
    initSortModule() {
        const form = document.getElementById('sort-books-form');
        if (!form || form.dataset.bound) return;
        form.dataset.bound = 'true';

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.executeSort();
        });
    },

    executeSort() {
        const algo = document.getElementById('sort-algorithm-select').value;
        const key = document.getElementById('sort-key-select').value;
        const order = document.getElementById('sort-order-select').value;
        const isAscending = order === 'asc';

        const books = LibraryData.getBooks();
        let result = null;

        if (algo === 'bubble') {
            result = ADSAlgorithms.bubbleSort(books, key, isAscending);
        } else if (algo === 'selection') {
            result = ADSAlgorithms.selectionSort(books, key, isAscending);
        } else if (algo === 'insertion') {
            result = ADSAlgorithms.insertionSort(books, key, isAscending);
        } else if (algo === 'merge') {
            result = ADSAlgorithms.mergeSort(books, key, isAscending);
        } else if (algo === 'quick') {
            result = ADSAlgorithms.quickSort(books, key, isAscending);
        }

        this.renderSortResults(result);
    },

    renderSortResults(result) {
        const container = document.getElementById('sort-results-container');
        if (!container) return;

        container.innerHTML = `
            <div class="sort-metrics-banner card animate-fade-in">
                <div class="metric-header-row">
                    <div>
                        <span class="badge badge-gold">${result.algorithm}</span>
                        <h4 class="mt-2 text-light">Sorting Benchmark Results</h4>
                        <p class="text-xs text-muted mb-0">Sorted by <strong>${result.key}</strong> in <strong>${result.order}</strong> order across ${result.sortedArray.length} book records.</p>
                    </div>
                    <div class="metric-chips">
                        <div class="metric-chip">
                            <span class="chip-val">${result.comparisons}</span>
                            <span class="chip-label">Comparisons</span>
                        </div>
                        <div class="metric-chip">
                            <span class="chip-val">${result.swaps}</span>
                            <span class="chip-label">Swaps / Moves</span>
                        </div>
                        <div class="metric-chip">
                            <span class="chip-val">${result.executionTimeMs} ms</span>
                            <span class="chip-label">Execution Time</span>
                        </div>
                    </div>
                </div>

                <div class="ads-complexity-grid mt-4">
                    <div class="complexity-cell">
                        <span class="c-label">Best Case</span>
                        <span class="c-val fw-mono text-emerald">${result.complexity.best}</span>
                    </div>
                    <div class="complexity-cell">
                        <span class="c-label">Average Case</span>
                        <span class="c-val fw-mono text-gold">${result.complexity.average}</span>
                    </div>
                    <div class="complexity-cell">
                        <span class="c-label">Worst Case</span>
                        <span class="c-val fw-mono text-crimson">${result.complexity.worst}</span>
                    </div>
                    <div class="complexity-cell">
                        <span class="c-label">Auxiliary Space</span>
                        <span class="c-val fw-mono">${result.complexity.space}</span>
                    </div>
                    <div class="complexity-cell">
                        <span class="c-label">Stability</span>
                        <span class="c-val fw-mono">${result.complexity.stable}</span>
                    </div>
                </div>
            </div>

            <div class="card mt-4">
                <div class="card-header-flex">
                    <h5 class="mb-0 text-light"><i class="fa-solid fa-arrow-down-a-z"></i> Sorted Records Table</h5>
                    <span class="text-xs text-muted">${result.sortedArray.length} records sorted</span>
                </div>
                <div class="table-responsive mt-3">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Book ID</th>
                                <th>Book Name</th>
                                <th>Author</th>
                                <th>Category</th>
                                <th>Publisher</th>
                                <th>Publication Year</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${result.sortedArray.map((b, idx) => `
                                <tr>
                                    <td><span class="text-muted text-xs">${idx + 1}</span></td>
                                    <td><span class="badge-code text-gold">${b.id}</span></td>
                                    <td class="fw-semibold ${result.key === 'title' ? 'text-gold' : ''}">${b.title}</td>
                                    <td class="${result.key === 'author' ? 'text-gold' : ''}">${b.author}</td>
                                    <td><span class="cat-pill">${b.category}</span></td>
                                    <td>${b.publisher}</td>
                                    <td class="${result.key === 'year' ? 'text-gold fw-bold' : ''}">${b.year}</td>
                                    <td>${this.renderStatusBadge(b.status)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    // -------------------------------------------------------------------------
    // MODULE 6: BOOK ISSUE MANAGEMENT
    // -------------------------------------------------------------------------
    initIssueForm() {
        const bookSelect = document.getElementById('issue-book-select');
        const studentSelect = document.getElementById('issue-student-select');
        const issueDateInput = document.getElementById('issue-date');
        const dueDateInput = document.getElementById('issue-due-date');
        const form = document.getElementById('issue-book-form');

        // Populate available books
        const books = LibraryData.getBooks().filter(b => b.status === 'Available');
        if (bookSelect) {
            bookSelect.innerHTML = `<option value="">-- Choose an Available Book --</option>` +
                books.map(b => `<option value="${b.id}">${b.id} - ${b.title} (${b.author})</option>`).join('');
        }

        // Populate students
        const students = LibraryData.getStudents();
        if (studentSelect) {
            studentSelect.innerHTML = `<option value="">-- Choose a Student --</option>` +
                students.map(s => `<option value="${s.id}">${s.id} - ${s.name} (${s.department}, ${s.year}) [Active: ${s.activeIssues || 0}/3]</option>`).join('');
        }

        // Auto default dates
        const today = new Date();
        const dueDate = new Date(Date.now() + 14 * 86400000);
        if (issueDateInput) issueDateInput.value = formatDateStr(today);
        if (dueDateInput) dueDateInput.value = formatDateStr(dueDate);

        // Bind form submit
        if (form && !form.dataset.bound) {
            form.dataset.bound = 'true';
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const bId = bookSelect.value;
                const sId = studentSelect.value;
                const iDate = issueDateInput.value;
                const dDate = dueDateInput.value;

                if (!bId || !sId || !iDate || !dDate) {
                    this.showToast("Please fill in all issue details.", "warning");
                    return;
                }

                try {
                    const txn = LibraryData.issueBook(bId, sId, iDate, dDate);
                    this.showToast(`Book "${txn.bookTitle}" successfully issued to ${txn.studentName}!`, "success");
                    this.switchModule('history');
                } catch (err) {
                    this.showToast(err.message, "error");
                }
            });
        }
    },

    // -------------------------------------------------------------------------
    // MODULE 7: BOOK RETURN MANAGEMENT
    // -------------------------------------------------------------------------
    initReturnModule() {
        const searchInput = document.getElementById('return-search-query');
        const btnSearch = document.getElementById('btn-search-return');
        const tableBody = document.getElementById('return-active-tbody');

        const renderActiveTxns = (query = '') => {
            const txns = LibraryData.getTransactions().filter(t => t.status === 'Issued' || t.status === 'Overdue');
            const q = query.trim().toLowerCase();
            const filtered = q
                ? txns.filter(t =>
                    t.bookId.toLowerCase().includes(q) ||
                    t.bookTitle.toLowerCase().includes(q) ||
                    t.studentId.toLowerCase().includes(q) ||
                    t.studentName.toLowerCase().includes(q)
                )
                : txns;

            if (filtered.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="7" class="text-center py-5 text-muted">No active issued books matching query.</td></tr>`;
                return;
            }

            tableBody.innerHTML = filtered.map(t => {
                const fineInfo = LibraryData.calculateFine(t.dueDate);
                return `
                    <tr>
                        <td><span class="badge-code text-gold">${t.id}</span></td>
                        <td>
                            <div class="fw-semibold">${t.bookTitle}</div>
                            <div class="text-xs text-muted">${t.bookId}</div>
                        </td>
                        <td>
                            <div class="fw-medium">${t.studentName}</div>
                            <div class="text-xs text-muted">${t.studentId}</div>
                        </td>
                        <td>${t.issueDate}</td>
                        <td>${t.dueDate}</td>
                        <td>
                            ${fineInfo.isOverdue
                                ? `<span class="badge badge-danger">Overdue by ${fineInfo.daysOverdue} days (Fine: ₹${fineInfo.fineAmount})</span>`
                                : `<span class="badge badge-success">On Schedule (₹0 fine)</span>`
                            }
                        </td>
                        <td>
                            <button class="btn btn-sm btn-primary" onclick="App.openReturnModal('${t.id}')">
                                <i class="fa-solid fa-arrow-rotate-left"></i> Return Book
                            </button>
                        </td>
                    </tr>
                `;
            }).join('');
        };

        if (btnSearch && !btnSearch.dataset.bound) {
            btnSearch.dataset.bound = 'true';
            btnSearch.addEventListener('click', () => {
                renderActiveTxns(searchInput ? searchInput.value : '');
            });
        }

        if (searchInput && !searchInput.dataset.bound) {
            searchInput.dataset.bound = 'true';
            searchInput.addEventListener('keyup', (e) => {
                if (e.key === 'Enter') renderActiveTxns(searchInput.value);
            });
        }

        renderActiveTxns();
    },

    openReturnModal(txnId) {
        const txns = LibraryData.getTransactions();
        const txn = txns.find(t => t.id === txnId);
        if (!txn) return;

        const modal = document.getElementById('process-return-modal');
        const content = document.getElementById('process-return-modal-content');
        if (!modal || !content) return;

        const fineInfo = LibraryData.calculateFine(txn.dueDate);
        const todayStr = formatDateStr(new Date());

        content.innerHTML = `
            <div class="return-receipt-card">
                <div class="receipt-header">
                    <h5 class="text-light mb-1">Book Return Confirmation</h5>
                    <span class="text-xs text-gold">Transaction: ${txn.id}</span>
                </div>
                <div class="modal-detail-grid mt-3">
                    <div class="detail-item full-width">
                        <span class="detail-label">Book Details</span>
                        <span class="detail-value fw-semibold">${txn.bookTitle} (${txn.bookId})</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Borrower</span>
                        <span class="detail-value">${txn.studentName} (${txn.studentId})</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Due Date</span>
                        <span class="detail-value">${txn.dueDate}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Return Date</span>
                        <span class="detail-value text-gold fw-bold">${todayStr} (Today)</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Overdue Calculation</span>
                        <span class="detail-value ${fineInfo.isOverdue ? 'text-crimson fw-bold' : 'text-emerald'}">
                            ${fineInfo.isOverdue ? `${fineInfo.daysOverdue} days overdue (Rate: ₹5/day)` : 'Returned on or before due date'}
                        </span>
                    </div>
                    <div class="detail-item full-width bg-navy-card p-3 rounded">
                        <label class="form-label mb-1">Fine Collected (₹):</label>
                        <input type="number" id="return-fine-input" class="form-control" value="${fineInfo.fineAmount}" min="0">
                        <span class="text-xs text-muted">You may adjust or waive fine amount with librarian clearance.</span>
                    </div>
                </div>
                <div class="mt-4 d-flex justify-content-end gap-2">
                    <button class="btn btn-secondary" onclick="document.getElementById('process-return-modal').classList.remove('open')">Cancel</button>
                    <button class="btn btn-primary" onclick="App.processReturnConfirmation('${txn.id}')">
                        <i class="fa-solid fa-check"></i> Complete Return
                    </button>
                </div>
            </div>
        `;

        modal.classList.add('open');
    },

    processReturnConfirmation(txnId) {
        const fineInput = document.getElementById('return-fine-input');
        const finePaid = fineInput ? Math.max(0, parseFloat(fineInput.value) || 0) : 0;

        try {
            const updatedTxn = LibraryData.returnBook(txnId, finePaid);
            this.showToast(`Book returned successfully! Status updated to Available. Fine logged: ₹${finePaid}.`, "success");
            document.getElementById('process-return-modal').classList.remove('open');
            this.initReturnModule();
        } catch (err) {
            this.showToast(err.message, "error");
        }
    },

    // -------------------------------------------------------------------------
    // MODULE 8: ISSUE & RETURN HISTORY
    // -------------------------------------------------------------------------
    renderHistoryModule() {
        const tbody = document.getElementById('history-table-tbody');
        const filterSelect = document.getElementById('history-status-filter');
        const searchInput = document.getElementById('history-search-filter');

        const render = () => {
            let txns = LibraryData.getTransactions();
            const statusFilter = filterSelect ? filterSelect.value : 'All';
            const query = searchInput ? searchInput.value.trim().toLowerCase() : '';

            if (statusFilter !== 'All') {
                txns = txns.filter(t => t.status === statusFilter);
            }

            if (query) {
                txns = txns.filter(t =>
                    t.id.toLowerCase().includes(query) ||
                    t.bookTitle.toLowerCase().includes(query) ||
                    t.bookId.toLowerCase().includes(query) ||
                    t.studentName.toLowerCase().includes(query) ||
                    t.studentId.toLowerCase().includes(query)
                );
            }

            if (!tbody) return;
            if (txns.length === 0) {
                tbody.innerHTML = `<tr><td colspan="8" class="text-center py-5 text-muted">No transaction logs match the filter.</td></tr>`;
                return;
            }

            tbody.innerHTML = txns.map(t => `
                <tr>
                    <td><span class="badge-code text-gold">${t.id}</span></td>
                    <td>
                        <div class="fw-semibold">${t.bookTitle}</div>
                        <div class="text-xs text-muted">${t.bookId}</div>
                    </td>
                    <td>
                        <div class="fw-medium">${t.studentName}</div>
                        <div class="text-xs text-muted">${t.studentId}</div>
                    </td>
                    <td>${t.issueDate}</td>
                    <td>${t.dueDate}</td>
                    <td>${t.returnDate || '<span class="text-muted">—</span>'}</td>
                    <td>${t.finePaid > 0 ? `<span class="text-crimson fw-bold">₹${t.finePaid}</span>` : '<span class="text-muted">₹0</span>'}</td>
                    <td>${this.renderStatusBadge(t.status)}</td>
                </tr>
            `).join('');
        };

        if (filterSelect && !filterSelect.dataset.bound) {
            filterSelect.dataset.bound = 'true';
            filterSelect.addEventListener('change', render);
        }
        if (searchInput && !searchInput.dataset.bound) {
            searchInput.dataset.bound = 'true';
            searchInput.addEventListener('input', render);
        }

        render();
    },

    exportHistoryCSV() {
        const txns = LibraryData.getTransactions();
        let csv = "Transaction ID,Book ID,Book Title,Student ID,Student Name,Issue Date,Due Date,Return Date,Fine Paid,Status\n";

        txns.forEach(t => {
            csv += `"${t.id}","${t.bookId}","${t.bookTitle}","${t.studentId}","${t.studentName}","${t.issueDate}","${t.dueDate}","${t.returnDate || ''}","${t.finePaid || 0}","${t.status}"\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `Library_Transactions_ADS_${new Date().toISOString().slice(0, 10)}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        this.showToast("Transactions successfully exported to CSV!", "success");
    },

    // -------------------------------------------------------------------------
    // MODULE 9: STUDENT DETAILS
    // -------------------------------------------------------------------------
    renderStudentsModule() {
        const tbody = document.getElementById('students-table-tbody');
        if (!tbody) return;

        const students = LibraryData.getStudents();
        const txns = LibraryData.getTransactions();

        tbody.innerHTML = students.map(s => {
            const studentTxns = txns.filter(t => t.studentId === s.id);
            const totalFines = studentTxns.reduce((sum, t) => sum + (t.finePaid || 0), 0);

            return `
                <tr>
                    <td><span class="badge-code text-gold">${s.id}</span></td>
                    <td>
                        <div class="fw-semibold">${s.name}</div>
                        <div class="text-xs text-muted">${s.email}</div>
                    </td>
                    <td>${s.department}</td>
                    <td>${s.year}</td>
                    <td>${s.phone}</td>
                    <td>
                        <span class="badge ${s.activeIssues > 0 ? 'badge-warning' : 'badge-secondary'}">
                            ${s.activeIssues || 0} / 3 Books
                        </span>
                    </td>
                    <td>₹${totalFines}</td>
                    <td>
                        <button class="btn btn-sm btn-secondary" onclick="App.openStudentHistoryModal('${s.id}')">
                            <i class="fa-solid fa-clock-rotate-left"></i> History
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    },

    openAddStudentModal() {
        const modal = document.getElementById('add-student-modal');
        if (modal) modal.classList.add('open');
    },

    handleAddStudent() {
        const name = document.getElementById('new-stu-name').value.trim();
        const dept = document.getElementById('new-stu-dept').value;
        const year = document.getElementById('new-stu-year').value;
        const email = document.getElementById('new-stu-email').value.trim();
        const phone = document.getElementById('new-stu-phone').value.trim();

        if (!name || !dept || !email) {
            this.showToast("Please provide Student Name, Department, and Email.", "error");
            return;
        }

        const newStudent = LibraryData.addStudent({
            name,
            department: dept,
            year,
            email,
            phone: phone || "+91 98000 00000"
        });

        this.showToast(`Student ${newStudent.name} (${newStudent.id}) registered!`, "success");
        document.getElementById('add-student-modal').classList.remove('open');
        this.renderStudentsModule();
    },

    openStudentHistoryModal(studentId) {
        const student = LibraryData.getStudentById(studentId);
        if (!student) return;

        const txns = LibraryData.getTransactions().filter(t => t.studentId === student.id);
        const modal = document.getElementById('student-history-modal');
        const content = document.getElementById('student-history-modal-content');
        if (!modal || !content) return;

        content.innerHTML = `
            <div class="mb-3">
                <h5 class="text-light mb-0">${student.name}</h5>
                <span class="text-xs text-gold">${student.id} • ${student.department} (${student.year})</span>
            </div>
            ${txns.length === 0 ? `
                <div class="text-center py-4 text-muted">No borrowing transactions recorded for this student.</div>
            ` : `
                <div class="table-responsive">
                    <table class="data-table text-sm">
                        <thead>
                            <tr>
                                <th>Txn ID</th>
                                <th>Book Title</th>
                                <th>Issue Date</th>
                                <th>Due Date</th>
                                <th>Return Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${txns.map(t => `
                                <tr>
                                    <td><span class="badge-code">${t.id}</span></td>
                                    <td>${t.bookTitle}</td>
                                    <td>${t.issueDate}</td>
                                    <td>${t.dueDate}</td>
                                    <td>${t.returnDate || '—'}</td>
                                    <td>${this.renderStatusBadge(t.status)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `}
        `;

        modal.classList.add('open');
    },

    // -------------------------------------------------------------------------
    // MODULE 10: REPORTS SECTION
    // -------------------------------------------------------------------------
    renderReportsModule() {
        const books = LibraryData.getBooks();
        const txns = LibraryData.getTransactions();

        // 1. Most Frequently Issued Books (Ranked using Quick Sort)
        const sortedByBorrows = ADSAlgorithms.quickSort([...books], 'borrowsCount', false).sortedArray;
        const topBooksContainer = document.getElementById('report-top-books');
        if (topBooksContainer) {
            const top5 = sortedByBorrows.slice(0, 5);
            const maxBorrows = Math.max(1, top5[0].borrowsCount);
            topBooksContainer.innerHTML = top5.map((b, idx) => {
                const pct = Math.round((b.borrowsCount / maxBorrows) * 100);
                return `
                    <div class="report-rank-item">
                        <div class="rank-badge">${idx + 1}</div>
                        <div class="rank-info">
                            <div class="d-flex justify-content-between mb-1">
                                <span class="fw-semibold text-light">${b.title}</span>
                                <span class="text-gold fw-bold">${b.borrowsCount} borrows</span>
                            </div>
                            <div class="cat-progress-track">
                                <div class="cat-progress-fill" style="width: ${pct}%"></div>
                            </div>
                            <span class="text-xs text-muted">${b.author} • ${b.category}</span>
                        </div>
                    </div>
                `;
            }).join('');
        }

        // 2. Overdue Books Summary
        const overdueContainer = document.getElementById('report-overdue-list');
        const overdueTxns = txns.filter(t => t.status === 'Overdue');
        if (overdueContainer) {
            if (overdueTxns.length === 0) {
                overdueContainer.innerHTML = `<div class="text-center py-4 text-emerald"><i class="fa-solid fa-circle-check"></i> Great news! There are currently no overdue books.</div>`;
            } else {
                overdueContainer.innerHTML = overdueTxns.map(t => {
                    const fine = LibraryData.calculateFine(t.dueDate);
                    return `
                        <div class="overdue-alert-card">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <div class="fw-bold text-light">${t.bookTitle}</div>
                                    <div class="text-xs text-muted">Borrower: ${t.studentName} (${t.studentId}) • Due: ${t.dueDate}</div>
                                </div>
                                <div class="text-end">
                                    <span class="badge badge-danger">${fine.daysOverdue} Days Overdue</span>
                                    <div class="text-xs text-amber mt-1">Pending Fine: ₹${fine.fineAmount}</div>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('');
            }
        }

        // 3. Summary stats
        const availableCount = books.filter(b => b.status === 'Available').length;
        const issuedCount = books.filter(b => b.status === 'Issued').length;
        const totalFinesReceivable = overdueTxns.reduce((sum, t) => sum + LibraryData.calculateFine(t.dueDate).fineAmount, 0);

        const repAvail = document.getElementById('report-stat-available');
        const repIssued = document.getElementById('report-stat-issued');
        const repOverdue = document.getElementById('report-stat-overdue');
        const repReceivable = document.getElementById('report-stat-receivable');

        if (repAvail) repAvail.textContent = availableCount;
        if (repIssued) repIssued.textContent = issuedCount;
        if (repOverdue) repOverdue.textContent = overdueTxns.length;
        if (repReceivable) repReceivable.textContent = `₹${totalFinesReceivable}`;
    },

    printReport() {
        window.print();
    }
};

// Expose on window for inline handlers
window.App = App;

// Bootstrap on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();

    // Login Form Submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const errorEl = document.getElementById('login-error-msg');

            try {
                AuthManager.login(email, password);
                if (errorEl) errorEl.style.display = 'none';
                App.showToast("Welcome back! Logged in as Library Administrator.", "success");
                App.switchModule('dashboard');
            } catch (err) {
                if (errorEl) {
                    errorEl.textContent = err.message;
                    errorEl.style.display = 'block';
                }
            }
        });
    }

    // Modal Close buttons
    document.querySelectorAll('.modal-close-btn, .modal-backdrop-close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = btn.closest('.modal-overlay');
            if (modal) modal.classList.remove('open');
        });
    });

    // Close when clicking directly on overlay backdrop
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('open');
            }
        });
    });
});
