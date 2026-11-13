# AthenaLib - Library Book Issue and Return Management System
### Advanced Data Structures (ADS) Project-Based Learning (PBL) System

---

## 📌 Executive Summary

**AthenaLib** is a production-quality, modern, web-based Library Book Issue and Return Management System engineered as a college-level **Advanced Data Structures (ADS) Project-Based Learning (PBL)** capstone project. 

In enterprise digital library systems, indexing, cataloguing, and retrieval speeds depend directly on underlying **Searching and Sorting Algorithms**. AthenaLib bridges computer science theory with practical enterprise software by implementing every core searching and sorting technique **completely from scratch in vanilla JavaScript (zero black-box library calls like `Array.prototype.sort()`)**.

The platform features an executive navy blue (`#0A192F` / `#112240`) and soft gold (`#D4AF37`) glassmorphic dashboard, complete circulation controls, fine calculation, student borrowing quota enforcement, audit logs, and a dedicated **Interactive Step-by-Step ADS Algorithm Visualizer**.

---

## 🚀 Key Features & System Modules

### 1. Executive Dashboard
- **Live Metric Tiles**: Live counters for Total Books, Available Books, Issued Books, Overdue Books, Registered Students, and Total Fines Collected.
- **Category Distribution**: Visual progress breakdown of books across computer science and engineering disciplines.
- **Recent Circulation Feed**: Quick audit list of the latest borrowings with status badges.
- **Quick Action Bar**: One-click navigation to book issues, returns, ADS search, ADS sort, and visualizer.

### 2. Book Repository & Catalog (Full CRUD)
- **Add, View, Edit, and Delete**: Full lifecycle management of library books.
- **Comprehensive Fields**: Book ID, Title, Primary Author, Category, Publisher, Publication Year, Rack/Shelf Location, and ISBN.
- **Interactive Table**: Real-time category filtering, search input filter, pagination, and status pills (*Available*, *Issued*, *Overdue*).

### 3. Searching Techniques (ADS Core Requirement 1)
All searching algorithms are built from scratch with real-time telemetry:
- **Linear Search ($O(n)$)**:
  - Scans records sequentially.
  - Generates probe-by-probe comparison logs.
  - Computes comparison counts and execution time in milliseconds.
- **Binary Search ($O(\log n)$)**:
  - Enforces the mathematical prerequisite of sorted data.
  - Automatically pre-sorts dataset by the selected key using our custom Quick Sort.
  - Uses interval halving with dynamic `low`, `mid`, and `high` pointers.
  - Employs bidirectional expansion around `mid` to capture all matching records.
- **Supported Keys**: Search by **Book ID** (e.g., `BK-1002`), **Book Title**, or **Author Name**.

### 4. Sorting Techniques (ADS Core Requirement 2)
Five fundamental sorting algorithms implemented from scratch:
1. **Bubble Sort ($O(n^2)$)**: Adjacent comparison exchange sort with optimized early-exit flag.
2. **Selection Sort ($O(n^2)$)**: In-place unsorted minimum/maximum scan.
3. **Insertion Sort ($O(n^2)$)**: Incremental array shifting and insertion.
4. **Merge Sort ($O(n \log n)$)**: Stable recursive divide-and-conquer partitioning.
5. **Quick Sort ($O(n \log n)$)**: Lomuto partitioning around a pivot element.
- **Keys**: Sort by **Book ID**, **Book Name (alphabetical)**, **Author**, or **Publication Year**.
- **Orders**: Ascending ($A \to Z / 0 \to 9$) and Descending ($Z \to A / 9 \to 0$).
- **Telemetry**: Measures exact comparisons, data swaps/shifts, runtime in milliseconds, and displays full theoretical complexity cards.

### 5. Special ADS Algorithm Visualization Workbench
- **Interactive Step Animation**: Watch the algorithms execute step-by-step on bar graphs and cards.
- **State Highlights**:
  - 🟦 *Default/Unsorted*: Navy Slate
  - 🟨 *Comparing*: Amber/Gold Glow (`#D4AF37`)
  - 🟥 *Swapping/Moving*: Crimson Accent (`#EF4444`)
  - 🟩 *Sorted/Found*: Emerald Green (`#10B981`)
  - 🔷 *Pivot/Midpoint*: Cyan (`#38BDF8`)
- **Player Controls**: Play, Pause, Step Next, Reset, and Shuffle Data.
- **Speed Adjustment**: Slider from 1x to 10x (30ms to 1000ms delay).
- **Telemetry Counters**: Real-time counter of comparisons and swaps.
- **Complexity Matrix**: Displays Best, Average, Worst, Auxiliary Space, and Stability details.

### 6. Book Issue Management
- Automated student borrowing quota validation (maximum 3 books per student).
- Conflict prevention: cannot issue a book that is already issued.
- Automatic due date generation (default 14-day borrowing cycle).
- Updates book status from *Available* to *Issued* and logs transaction.

### 7. Book Return Management & Late Fine System
- Fast lookup by Book ID or Student ID.
- Automatic overdue detection against today's date.
- Fine calculation at **₹5/day** for every overdue day.
- Return receipt confirmation with fine payment logging and waiver options.
- Updates book availability back to *Available*.

### 8. Issue & Return History
- Audit table recording all past and current borrowing cycles.
- Filter by status (*All*, *Active/Issued*, *Overdue*, *Returned*).
- **One-Click CSV Export**: Download transaction logs for offline college reporting.

### 9. Student Directory
- Student database with Department, Academic Year, Phone, and Active Quota.
- Add New Student modal.
- Individual student borrowing history modal.

### 10. Reports & Analytics
- Ranked chart of **Most Frequently Issued Books** (using Quick Sort).
- **Overdue Audit Report** with pending fine receivables.
- **Print / PDF Export** stylesheet for official submission.

---

## 📊 ADS Algorithmic Complexity Reference

| Algorithm | Paradigm | Best Case Time | Average Case Time | Worst Case Time | Auxiliary Space | Stability |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| **Linear Search** | Sequential Scan | $O(1)$ | $O(n)$ | $O(n)$ | $O(1)$ | N/A |
| **Binary Search** | Interval Halving | $O(1)$ | $O(\log n)$ | $O(\log n)$ | $O(1)$ | N/A |
| **Bubble Sort** | Comparison & Exchange | $O(n)$ | $O(n^2)$ | $O(n^2)$ | $O(1)$ | Stable |
| **Selection Sort** | In-place Selection | $O(n^2)$ | $O(n^2)$ | $O(n^2)$ | $O(1)$ | Unstable |
| **Insertion Sort** | Incremental Insertion | $O(n)$ | $O(n^2)$ | $O(n^2)$ | $O(1)$ | Stable |
| **Merge Sort** | Divide & Conquer | $O(n \log n)$ | $O(n \log n)$ | $O(n \log n)$ | $O(n)$ | Stable |
| **Quick Sort** | Partitioning | $O(n \log n)$ | $O(n \log n)$ | $O(n^2)$ | $O(\log n)$ | Unstable |

---

## 📂 Project Architecture

```
library-ads-pbl/
├── index.html              # Main Single-Page Application (SPA) dashboard & modules
├── README.md               # Complete Project PBL documentation & viva guide
├── css/
│   ├── style.css           # Core styling, navy & gold color scheme, typography, layout
│   ├── components.css      # Data tables, cards, visualizer, modals, toasts, login screen
│   └── animations.css      # CSS keyframes, transitions, pulse effects, shimmer loaders
└── js/
    ├── data.js             # 32 seed books, 10 students, transactions & localStorage manager
    ├── algorithms.js       # From-scratch implementations of all 7 searching & sorting algorithms
    ├── visualizer.js       # Step-by-step interactive visualizer workbench & frame player
    ├── auth.js             # Session authentication, login validation & user credentials
    └── app.js              # Application controller, routing, forms, CRUD, reports & toasts
```

---

## ⚡ How to Run the Project

No build tools, Node.js installations, or complex dependencies are needed!

### Method 1: Direct Browser Launch (Easiest)
1. Navigate to the project directory:
   ```
   C:\Users\Arush\.gemini\antigravity\scratch\library-ads-pbl
   ```
2. Double click **`index.html`** to open it in Chrome, Edge, Firefox, or Safari.

### Method 2: Using VS Code Live Server / Python
If you prefer running a local server:
- **VS Code**: Right click `index.html` and click **"Open with Live Server"**.
- **Python**:
  ```bash
  cd C:\Users\Arush\.gemini\antigravity\scratch\library-ads-pbl
  python -m http.server 3000
  ```
  Open `http://localhost:3000` in your web browser.

---

## 🔑 Demo Login Credentials

The application includes an animated login screen with pre-filled quick buttons:

- **Chief Librarian / Evaluator**:
  - **Email**: `admin@college.edu`
  - **Password**: `password123`
- **Senior Librarian**:
  - **Email**: `librarian@college.edu`
  - **Password**: `admin`
- *(Or enter any valid email with 4+ characters for evaluators).*

---

## 🎓 College PBL Presentation / Viva Guide

### Q1: Why must the dataset be sorted before performing Binary Search?
> **Answer**: Binary search is based on the **Divide and Conquer** paradigm with interval halving. At each step, it compares the target key with the middle element $A[\text{mid}]$. If the target is smaller, it assumes the target must lie in the left half $A[\text{low} \dots \text{mid}-1]$. This assumption holds **only if** the array elements are monotonically ordered ($A[i] \le A[i+1]$). If the array is unsorted, discarding either half could discard the target element. AthenaLib guarantees this by running our custom Quick Sort before executing Binary Search.

### Q2: What is the benefit of Quick Sort over Merge Sort in this library system?
> **Answer**: Quick Sort sorts **in-place** with $O(\log n)$ auxiliary stack space, making it memory-efficient for internal inventory manipulation. Merge Sort requires $O(n)$ additional memory buffer to merge the subarrays. However, Merge Sort is **stable** (preserves the original relative order of equal keys), which is desirable when sorting books with identical publication years alphabetically.

### Q3: How is data preserved across browser reloads?
> **Answer**: AthenaLib utilizes **Web Storage API (`localStorage`)** with an automated seed restoration mechanism. If no prior records exist, the system populates 32 curated computer science books, 10 student records, and realistic active/overdue transactions. A **"Reset Seed Data"** button in the header allows evaluators to reset the database at any moment.

---

## 🏆 Authors & Academic Credits
- **Project**: Library Book Issue and Return Management System
- **Curriculum**: Advanced Data Structures (ADS) - Project Based Learning (PBL)
- **Tech Stack**: Vanilla HTML5, CSS3 (Custom Glassmorphism), Vanilla JavaScript (ES6+)
- **Year**: 2026
