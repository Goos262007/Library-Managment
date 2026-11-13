/**
 * Library ADS PBL System - Data Storage & Seed Management
 * Handles persistent storage via localStorage and loads comprehensive seed records
 */

const STORAGE_KEYS = {
    BOOKS: 'lib_ads_books_v1',
    STUDENTS: 'lib_ads_students_v1',
    TRANSACTIONS: 'lib_ads_transactions_v1',
    SETTINGS: 'lib_ads_settings_v1',
    AUTH_USER: 'lib_ads_auth_user_v1'
};

const DEFAULT_SETTINGS = {
    finePerDay: 5,        // Fine in ₹ per overdue day
    borrowPeriodDays: 14, // Maximum allowed borrowing days
    maxBooksPerStudent: 3,
    currencySymbol: '₹'
};

// 32 Realistic Book Records across various categories
const SEED_BOOKS = [
    {
        id: "BK-1001",
        title: "Introduction to Algorithms",
        author: "Thomas H. Cormen",
        category: "Data Structures & Algorithms",
        publisher: "MIT Press",
        year: 2009,
        status: "Available",
        rack: "Rack A-01",
        isbn: "978-0262033848",
        borrowsCount: 14
    },
    {
        id: "BK-1002",
        title: "Data Structures and Algorithm Analysis in C",
        author: "Mark Allen Weiss",
        category: "Data Structures & Algorithms",
        publisher: "Pearson",
        year: 1996,
        status: "Issued",
        rack: "Rack A-02",
        isbn: "978-0201498400",
        borrowsCount: 9
    },
    {
        id: "BK-1003",
        title: "Algorithms in C++",
        author: "Robert Sedgewick",
        category: "Data Structures & Algorithms",
        publisher: "Addison-Wesley",
        year: 1998,
        status: "Available",
        rack: "Rack A-03",
        isbn: "978-0201350883",
        borrowsCount: 7
    },
    {
        id: "BK-1004",
        title: "Clean Code: A Handbook of Agile Software Craftsmanship",
        author: "Robert C. Martin",
        category: "Software Engineering",
        publisher: "Prentice Hall",
        year: 2008,
        status: "Issued",
        rack: "Rack B-01",
        isbn: "978-0132350884",
        borrowsCount: 22
    },
    {
        id: "BK-1005",
        title: "Design Patterns: Elements of Reusable Object-Oriented Software",
        author: "Erich Gamma",
        category: "Software Engineering",
        publisher: "Addison-Wesley",
        year: 1994,
        status: "Available",
        rack: "Rack B-02",
        isbn: "978-0201633610",
        borrowsCount: 18
    },
    {
        id: "BK-1006",
        title: "Operating System Concepts",
        author: "Abraham Silberschatz",
        category: "Systems & Networking",
        publisher: "Wiley",
        year: 2018,
        status: "Available",
        rack: "Rack C-01",
        isbn: "978-1119456339",
        borrowsCount: 12
    },
    {
        id: "BK-1007",
        title: "Computer Networks",
        author: "Andrew S. Tanenbaum",
        category: "Systems & Networking",
        publisher: "Pearson",
        year: 2010,
        status: "Issued",
        rack: "Rack C-02",
        isbn: "978-0132126953",
        borrowsCount: 15
    },
    {
        id: "BK-1008",
        title: "Artificial Intelligence: A Modern Approach",
        author: "Stuart Russell",
        category: "AI & Machine Learning",
        publisher: "Pearson",
        year: 2020,
        status: "Available",
        rack: "Rack D-01",
        isbn: "978-0134610993",
        borrowsCount: 26
    },
    {
        id: "BK-1009",
        title: "Deep Learning",
        author: "Ian Goodfellow",
        category: "AI & Machine Learning",
        publisher: "MIT Press",
        year: 2016,
        status: "Available",
        rack: "Rack D-02",
        isbn: "978-0262035613",
        borrowsCount: 16
    },
    {
        id: "BK-1010",
        title: "Pattern Recognition and Machine Learning",
        author: "Christopher M. Bishop",
        category: "AI & Machine Learning",
        publisher: "Springer",
        year: 2006,
        status: "Available",
        rack: "Rack D-03",
        isbn: "978-0387310732",
        borrowsCount: 8
    },
    {
        id: "BK-1011",
        title: "Database System Concepts",
        author: "Avi Silberschatz",
        category: "Databases",
        publisher: "McGraw-Hill",
        year: 2019,
        status: "Issued",
        rack: "Rack E-01",
        isbn: "978-0078022159",
        borrowsCount: 11
    },
    {
        id: "BK-1012",
        title: "Designing Data-Intensive Applications",
        author: "Martin Kleppmann",
        category: "Databases",
        publisher: "O'Reilly Media",
        year: 2017,
        status: "Available",
        rack: "Rack E-02",
        isbn: "978-1449373320",
        borrowsCount: 29
    },
    {
        id: "BK-1013",
        title: "The Pragmatic Programmer",
        author: "David Thomas",
        category: "Software Engineering",
        publisher: "Addison-Wesley",
        year: 2019,
        status: "Available",
        rack: "Rack B-03",
        isbn: "978-0135957059",
        borrowsCount: 20
    },
    {
        id: "BK-1014",
        title: "Compilers: Principles, Techniques, and Tools",
        author: "Alfred V. Aho",
        category: "Computer Science Theory",
        publisher: "Addison-Wesley",
        year: 2006,
        status: "Available",
        rack: "Rack F-01",
        isbn: "978-0321486813",
        borrowsCount: 6
    },
    {
        id: "BK-1015",
        title: "Structure and Interpretation of Computer Programs",
        author: "Harold Abelson",
        category: "Computer Science Theory",
        publisher: "MIT Press",
        year: 1996,
        status: "Available",
        rack: "Rack F-02",
        isbn: "978-0262510875",
        borrowsCount: 13
    },
    {
        id: "BK-1016",
        title: "Concrete Mathematics: A Foundation for Computer Science",
        author: "Ronald L. Graham",
        category: "Mathematics",
        publisher: "Addison-Wesley",
        year: 1994,
        status: "Available",
        rack: "Rack G-01",
        isbn: "978-0201558029",
        borrowsCount: 5
    },
    {
        id: "BK-1017",
        title: "Linear Algebra and Its Applications",
        author: "Gilbert Strang",
        category: "Mathematics",
        publisher: "Cengage Learning",
        year: 2005,
        status: "Issued",
        rack: "Rack G-02",
        isbn: "978-0030105678",
        borrowsCount: 10
    },
    {
        id: "BK-1018",
        title: "Discrete Mathematics and Its Applications",
        author: "Kenneth H. Rosen",
        category: "Mathematics",
        publisher: "McGraw-Hill",
        year: 2018,
        status: "Available",
        rack: "Rack G-03",
        isbn: "978-1259676512",
        borrowsCount: 17
    },
    {
        id: "BK-1019",
        title: "JavaScript: The Good Parts",
        author: "Douglas Crockford",
        category: "Web Development",
        publisher: "O'Reilly Media",
        year: 2008,
        status: "Available",
        rack: "Rack H-01",
        isbn: "978-0596517748",
        borrowsCount: 19
    },
    {
        id: "BK-1020",
        title: "Eloquent JavaScript",
        author: "Marijn Haverbeke",
        category: "Web Development",
        publisher: "No Starch Press",
        year: 2018,
        status: "Issued",
        rack: "Rack H-02",
        isbn: "978-1593279509",
        borrowsCount: 14
    },
    {
        id: "BK-1021",
        title: "Learning React",
        author: "Alex Banks",
        category: "Web Development",
        publisher: "O'Reilly Media",
        year: 2020,
        status: "Available",
        rack: "Rack H-03",
        isbn: "978-1492051725",
        borrowsCount: 11
    },
    {
        id: "BK-1022",
        title: "Modern Operating Systems",
        author: "Andrew S. Tanenbaum",
        category: "Systems & Networking",
        publisher: "Pearson",
        year: 2014,
        status: "Available",
        rack: "Rack C-03",
        isbn: "978-0133591620",
        borrowsCount: 8
    },
    {
        id: "BK-1023",
        title: "Python Crash Course",
        author: "Eric Matthes",
        category: "Programming Languages",
        publisher: "No Starch Press",
        year: 2019,
        status: "Available",
        rack: "Rack I-01",
        isbn: "978-1593279288",
        borrowsCount: 23
    },
    {
        id: "BK-1024",
        title: "Effective Java",
        author: "Joshua Bloch",
        category: "Programming Languages",
        publisher: "Addison-Wesley",
        year: 2017,
        status: "Available",
        rack: "Rack I-02",
        isbn: "978-0134685991",
        borrowsCount: 18
    },
    {
        id: "BK-1025",
        title: "The C Programming Language",
        author: "Brian W. Kernighan",
        category: "Programming Languages",
        publisher: "Prentice Hall",
        year: 1988,
        status: "Available",
        rack: "Rack I-03",
        isbn: "978-0131103627",
        borrowsCount: 27
    },
    {
        id: "BK-1026",
        title: "Cracking the Coding Interview",
        author: "Gayle Laakmann McDowell",
        category: "Data Structures & Algorithms",
        publisher: "CareerCup",
        year: 2015,
        status: "Issued",
        rack: "Rack A-04",
        isbn: "978-0984782857",
        borrowsCount: 38
    },
    {
        id: "BK-1027",
        title: "Grokking Algorithms: An Illustrated Guide",
        author: "Aditya Y. Bhargava",
        category: "Data Structures & Algorithms",
        publisher: "Manning Publications",
        year: 2016,
        status: "Available",
        rack: "Rack A-05",
        isbn: "978-1617292231",
        borrowsCount: 31
    },
    {
        id: "BK-1028",
        title: "The Art of Computer Programming, Vol 1",
        author: "Donald E. Knuth",
        category: "Computer Science Theory",
        publisher: "Addison-Wesley",
        year: 1997,
        status: "Available",
        rack: "Rack F-03",
        isbn: "978-0201896831",
        borrowsCount: 15
    },
    {
        id: "BK-1029",
        title: "Computer Organization and Design: RISC-V Edition",
        author: "David A. Patterson",
        category: "Systems & Networking",
        publisher: "Morgan Kaufmann",
        year: 2017,
        status: "Available",
        rack: "Rack C-04",
        isbn: "978-0128122754",
        borrowsCount: 9
    },
    {
        id: "BK-1030",
        title: "Refactoring: Improving the Design of Existing Code",
        author: "Martin Fowler",
        category: "Software Engineering",
        publisher: "Addison-Wesley",
        year: 2018,
        status: "Available",
        rack: "Rack B-04",
        isbn: "978-0134757599",
        borrowsCount: 14
    },
    {
        id: "BK-1031",
        title: "Introduction to the Theory of Computation",
        author: "Michael Sipser",
        category: "Computer Science Theory",
        publisher: "Cengage Learning",
        year: 2012,
        status: "Available",
        rack: "Rack F-04",
        isbn: "978-1133187790",
        borrowsCount: 10
    },
    {
        id: "BK-1032",
        title: "Reinforcement Learning: An Introduction",
        author: "Richard S. Sutton",
        category: "AI & Machine Learning",
        publisher: "MIT Press",
        year: 2018,
        status: "Available",
        rack: "Rack D-04",
        isbn: "978-0262039246",
        borrowsCount: 13
    }
];

// Registered Student Seed Records
const SEED_STUDENTS = [
    {
        id: "STU-201",
        name: "Aarav Sharma",
        department: "Computer Science & Engineering",
        year: "3rd Year",
        email: "aarav.sharma@college.edu",
        phone: "+91 98765 43210",
        activeIssues: 1
    },
    {
        id: "STU-202",
        name: "Ananya Iyer",
        department: "Information Technology",
        year: "4th Year",
        email: "ananya.iyer@college.edu",
        phone: "+91 98765 43211",
        activeIssues: 1
    },
    {
        id: "STU-203",
        name: "Rohan Kulkarni",
        department: "Computer Science & Engineering",
        year: "2nd Year",
        email: "rohan.kulkarni@college.edu",
        phone: "+91 98765 43212",
        activeIssues: 1
    },
    {
        id: "STU-204",
        name: "Pooja Patel",
        department: "Artificial Intelligence & Data Science",
        year: "3rd Year",
        email: "pooja.patel@college.edu",
        phone: "+91 98765 43213",
        activeIssues: 1
    },
    {
        id: "STU-205",
        name: "Vikram Malhotra",
        department: "Electronics & Telecommunication",
        year: "4th Year",
        email: "vikram.m@college.edu",
        phone: "+91 98765 43214",
        activeIssues: 1
    },
    {
        id: "STU-206",
        name: "Sneha Deshmukh",
        department: "Computer Science & Engineering",
        year: "3rd Year",
        email: "sneha.d@college.edu",
        phone: "+91 98765 43215",
        activeIssues: 1
    },
    {
        id: "STU-207",
        name: "Karan Verma",
        department: "Information Technology",
        year: "1st Year",
        email: "karan.v@college.edu",
        phone: "+91 98765 43216",
        activeIssues: 0
    },
    {
        id: "STU-208",
        name: "Ishita Sen",
        department: "Artificial Intelligence & Data Science",
        year: "2nd Year",
        email: "ishita.sen@college.edu",
        phone: "+91 98765 43217",
        activeIssues: 0
    },
    {
        id: "STU-209",
        name: "Aditya Nair",
        department: "Computer Science & Engineering",
        year: "4th Year",
        email: "aditya.n@college.edu",
        phone: "+91 98765 43218",
        activeIssues: 0
    },
    {
        id: "STU-210",
        name: "Meera Reddy",
        department: "Mechanical Engineering",
        year: "2nd Year",
        email: "meera.r@college.edu",
        phone: "+91 98765 43219",
        activeIssues: 0
    }
];

// Helper to format Date string (YYYY-MM-DD)
function formatDateStr(d) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Generate dates relative to current date for realistic overdue / active status
const now = new Date();
const dPast20 = new Date(now); dPast20.setDate(now.getDate() - 20);
const dPast6 = new Date(now); dPast6.setDate(now.getDate() - 6); // Overdue by 6 days (due was 6 days ago)
const dPast25 = new Date(now); dPast25.setDate(now.getDate() - 25);
const dPast11 = new Date(now); dPast11.setDate(now.getDate() - 11); // Overdue by 11 days
const dPast5 = new Date(now); dPast5.setDate(now.getDate() - 5);
const dFuture9 = new Date(now); dFuture9.setDate(now.getDate() + 9); // Active, not overdue
const dPast10 = new Date(now); dPast10.setDate(now.getDate() - 10);
const dFuture4 = new Date(now); dFuture4.setDate(now.getDate() + 4); // Active
const dPast40 = new Date(now); dPast40.setDate(now.getDate() - 40);
const dPast26 = new Date(now); dPast26.setDate(now.getDate() - 26);
const dPast24 = new Date(now); dPast24.setDate(now.getDate() - 24);

const SEED_TRANSACTIONS = [
    {
        id: "TXN-8001",
        bookId: "BK-1002",
        bookTitle: "Data Structures and Algorithm Analysis in C",
        studentId: "STU-201",
        studentName: "Aarav Sharma",
        issueDate: formatDateStr(dPast20),
        dueDate: formatDateStr(dPast6), // Overdue by 6 days -> fine ₹30
        returnDate: null,
        finePaid: 0,
        status: "Overdue"
    },
    {
        id: "TXN-8002",
        bookId: "BK-1004",
        bookTitle: "Clean Code: A Handbook of Agile Software Craftsmanship",
        studentId: "STU-202",
        studentName: "Ananya Iyer",
        issueDate: formatDateStr(dPast25),
        dueDate: formatDateStr(dPast11), // Overdue by 11 days -> fine ₹55
        returnDate: null,
        finePaid: 0,
        status: "Overdue"
    },
    {
        id: "TXN-8003",
        bookId: "BK-1007",
        bookTitle: "Computer Networks",
        studentId: "STU-203",
        studentName: "Rohan Kulkarni",
        issueDate: formatDateStr(dPast5),
        dueDate: formatDateStr(dFuture9), // Active
        returnDate: null,
        finePaid: 0,
        status: "Issued"
    },
    {
        id: "TXN-8004",
        bookId: "BK-1011",
        bookTitle: "Database System Concepts",
        studentId: "STU-204",
        studentName: "Pooja Patel",
        issueDate: formatDateStr(dPast10),
        dueDate: formatDateStr(dFuture4), // Active
        returnDate: null,
        finePaid: 0,
        status: "Issued"
    },
    {
        id: "TXN-8005",
        bookId: "BK-1017",
        bookTitle: "Linear Algebra and Its Applications",
        studentId: "STU-205",
        studentName: "Vikram Malhotra",
        issueDate: formatDateStr(dPast20),
        dueDate: formatDateStr(dPast6), // Overdue
        returnDate: null,
        finePaid: 0,
        status: "Overdue"
    },
    {
        id: "TXN-8006",
        bookId: "BK-1020",
        bookTitle: "Eloquent JavaScript",
        studentId: "STU-206",
        studentName: "Sneha Deshmukh",
        issueDate: formatDateStr(dPast5),
        dueDate: formatDateStr(dFuture9), // Active
        returnDate: null,
        finePaid: 0,
        status: "Issued"
    },
    {
        id: "TXN-8007",
        bookId: "BK-1026",
        bookTitle: "Cracking the Coding Interview",
        studentId: "STU-201",
        studentName: "Aarav Sharma",
        issueDate: formatDateStr(dPast40),
        dueDate: formatDateStr(dPast26),
        returnDate: formatDateStr(dPast24), // Returned 2 days late -> fine was ₹10
        finePaid: 10,
        status: "Returned"
    },
    {
        id: "TXN-8008",
        bookId: "BK-1001",
        bookTitle: "Introduction to Algorithms",
        studentId: "STU-207",
        studentName: "Karan Verma",
        issueDate: formatDateStr(dPast40),
        dueDate: formatDateStr(dPast26),
        returnDate: formatDateStr(dPast26),
        finePaid: 0,
        status: "Returned"
    },
    {
        id: "TXN-8009",
        bookId: "BK-1012",
        bookTitle: "Designing Data-Intensive Applications",
        studentId: "STU-208",
        studentName: "Ishita Sen",
        issueDate: formatDateStr(dPast40),
        dueDate: formatDateStr(dPast26),
        returnDate: formatDateStr(dPast26),
        finePaid: 0,
        status: "Returned"
    }
];

// Data Layer API
const LibraryData = {
    // Initializer
    init() {
        if (!localStorage.getItem(STORAGE_KEYS.BOOKS)) {
            this.resetToDefaults();
        } else {
            this.refreshOverdueStatuses();
        }
    },

    resetToDefaults() {
        localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(SEED_BOOKS));
        localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(SEED_STUDENTS));
        localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(SEED_TRANSACTIONS));
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    },

    // Refresh overdue statuses on load based on today's date
    refreshOverdueStatuses() {
        const txns = this.getTransactions();
        const todayStr = formatDateStr(new Date());
        let changed = false;

        txns.forEach(t => {
            if (t.status === 'Issued' && t.dueDate < todayStr) {
                t.status = 'Overdue';
                changed = true;
            }
        });

        if (changed) {
            localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(txns));
        }
    },

    // Settings
    getSettings() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS)) || DEFAULT_SETTINGS;
        } catch (e) {
            return DEFAULT_SETTINGS;
        }
    },

    saveSettings(settings) {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    },

    // Books CRUD
    getBooks() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKS)) || [];
        } catch (e) {
            return [];
        }
    },

    saveBooks(books) {
        localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(books));
    },

    getBookById(id) {
        const books = this.getBooks();
        return books.find(b => b.id.toUpperCase() === id.toUpperCase());
    },

    addBook(bookData) {
        const books = this.getBooks();
        // Generate new ID if not provided
        if (!bookData.id) {
            const nextNum = books.length + 1001;
            bookData.id = `BK-${nextNum}`;
        }
        bookData.status = bookData.status || "Available";
        bookData.borrowsCount = bookData.borrowsCount || 0;
        books.push(bookData);
        this.saveBooks(books);
        return bookData;
    },

    updateBook(bookData) {
        const books = this.getBooks();
        const index = books.findIndex(b => b.id === bookData.id);
        if (index !== -1) {
            books[index] = { ...books[index], ...bookData };
            this.saveBooks(books);
            return books[index];
        }
        return null;
    },

    deleteBook(id) {
        let books = this.getBooks();
        const book = books.find(b => b.id === id);
        if (book && book.status === 'Issued') {
            throw new Error("Cannot delete a book that is currently issued to a student!");
        }
        books = books.filter(b => b.id !== id);
        this.saveBooks(books);
        return true;
    },

    // Students CRUD
    getStudents() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.STUDENTS)) || [];
        } catch (e) {
            return [];
        }
    },

    saveStudents(students) {
        localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    },

    getStudentById(id) {
        const students = this.getStudents();
        return students.find(s => s.id.toUpperCase() === id.toUpperCase());
    },

    addStudent(studentData) {
        const students = this.getStudents();
        if (!studentData.id) {
            studentData.id = `STU-${students.length + 201}`;
        }
        studentData.activeIssues = 0;
        students.push(studentData);
        this.saveStudents(students);
        return studentData;
    },

    // Transactions / Issue & Return
    getTransactions() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) || [];
        } catch (e) {
            return [];
        }
    },

    saveTransactions(txns) {
        localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(txns));
    },

    issueBook(bookId, studentId, issueDate, dueDate) {
        const book = this.getBookById(bookId);
        if (!book) throw new Error("Book not found!");
        if (book.status === 'Issued') throw new Error(`"${book.title}" is already issued.`);

        const student = this.getStudentById(studentId);
        if (!student) throw new Error("Student not found!");

        const settings = this.getSettings();
        if ((student.activeIssues || 0) >= settings.maxBooksPerStudent) {
            throw new Error(`Student ${student.name} has already reached the maximum limit of ${settings.maxBooksPerStudent} books.`);
        }

        // Create transaction
        const txns = this.getTransactions();
        const txnId = `TXN-${8000 + txns.length + 1}`;
        const newTxn = {
            id: txnId,
            bookId: book.id,
            bookTitle: book.title,
            studentId: student.id,
            studentName: student.name,
            issueDate: issueDate || formatDateStr(new Date()),
            dueDate: dueDate || formatDateStr(new Date(Date.now() + settings.borrowPeriodDays * 86400000)),
            returnDate: null,
            finePaid: 0,
            status: "Issued"
        };
        txns.unshift(newTxn);
        this.saveTransactions(txns);

        // Update Book status & borrowsCount
        book.status = "Issued";
        book.borrowsCount = (book.borrowsCount || 0) + 1;
        this.updateBook(book);

        // Update Student active issues
        student.activeIssues = (student.activeIssues || 0) + 1;
        const students = this.getStudents();
        const sIdx = students.findIndex(s => s.id === student.id);
        if (sIdx !== -1) {
            students[sIdx] = student;
            this.saveStudents(students);
        }

        return newTxn;
    },

    calculateFine(dueDateStr, returnDateStr) {
        const settings = this.getSettings();
        const dueDate = new Date(dueDateStr);
        const returnDate = returnDateStr ? new Date(returnDateStr) : new Date();

        // Calculate whole days difference
        const diffTime = returnDate.getTime() - dueDate.getTime();
        const overdueDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (overdueDays > 0) {
            return {
                daysOverdue: overdueDays,
                fineAmount: overdueDays * settings.finePerDay,
                isOverdue: true
            };
        }
        return {
            daysOverdue: 0,
            fineAmount: 0,
            isOverdue: false
        };
    },

    returnBook(txnId, fineAmount = 0) {
        const txns = this.getTransactions();
        const txn = txns.find(t => t.id === txnId);
        if (!txn) throw new Error("Transaction record not found!");
        if (txn.status === "Returned") throw new Error("Book has already been returned!");

        const todayStr = formatDateStr(new Date());
        txn.returnDate = todayStr;
        txn.status = "Returned";
        txn.finePaid = fineAmount;
        this.saveTransactions(txns);

        // Update book status
        const book = this.getBookById(txn.bookId);
        if (book) {
            book.status = "Available";
            this.updateBook(book);
        }

        // Update student active issues
        const student = this.getStudentById(txn.studentId);
        if (student) {
            student.activeIssues = Math.max(0, (student.activeIssues || 1) - 1);
            const students = this.getStudents();
            const sIdx = students.findIndex(s => s.id === student.id);
            if (sIdx !== -1) {
                students[sIdx] = student;
                this.saveStudents(students);
            }
        }

        return txn;
    },

    // Stats for Dashboard
    getDashboardStats() {
        const books = this.getBooks();
        const students = this.getStudents();
        const txns = this.getTransactions();

        const totalBooks = books.length;
        const issuedBooks = books.filter(b => b.status === 'Issued').length;
        const availableBooks = books.filter(b => b.status === 'Available').length;
        const totalStudents = students.length;

        const todayStr = formatDateStr(new Date());
        const overdueBooks = txns.filter(t => t.status === 'Overdue' || (t.status === 'Issued' && t.dueDate < todayStr)).length;

        // Total fine collected
        const totalFineCollected = txns.reduce((sum, t) => sum + (t.finePaid || 0), 0);

        return {
            totalBooks,
            issuedBooks,
            availableBooks,
            totalStudents,
            overdueBooks,
            totalFineCollected
        };
    }
};

// Initialize on script load
LibraryData.init();
