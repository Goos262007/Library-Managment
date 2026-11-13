/**
 * Library ADS PBL System - Authentication & Session Management
 * Handles animated login, credential validation, and user role sessions.
 */

const AuthManager = {
    currentUser: null,

    init() {
        const storedUser = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
        if (storedUser) {
            try {
                this.currentUser = JSON.parse(storedUser);
            } catch (e) {
                this.currentUser = null;
            }
        }
        this.updateAuthUI();
    },

    isLoggedIn() {
        return !!this.currentUser;
    },

    login(email, password) {
        // Validation rules
        if (!email || !password) {
            throw new Error("Both email and password are required.");
        }

        // Demo credential checks
        const validUsers = [
            {
                email: "admin@college.edu",
                password: "password123",
                name: "Prof. Rajesh Sharma",
                role: "Chief Librarian & ADS Mentor",
                department: "Department of Computer Engineering"
            },
            {
                email: "librarian@college.edu",
                password: "admin",
                name: "Dr. Sunita Deshmukh",
                role: "Senior Librarian",
                department: "Central Library Division"
            }
        ];

        const user = validUsers.find(
            u => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
        );

        if (user) {
            this.currentUser = {
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department,
                loginTime: new Date().toISOString()
            };
            localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(this.currentUser));
            this.updateAuthUI();
            return this.currentUser;
        } else {
            // For convenience, also allow any valid email + 6+ char password in demo mode
            if (email.includes('@') && password.length >= 4) {
                this.currentUser = {
                    name: email.split('@')[0].replace('.', ' ').toUpperCase(),
                    email: email.trim(),
                    role: "ADS Project Evaluator / Admin",
                    department: "Computer Science & Engineering",
                    loginTime: new Date().toISOString()
                };
                localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(this.currentUser));
                this.updateAuthUI();
                return this.currentUser;
            }
            throw new Error("Invalid credentials! You can use admin@college.edu / password123");
        }
    },

    logout() {
        this.currentUser = null;
        localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
        this.updateAuthUI();
        if (window.showToast) {
            window.showToast("Logged out successfully.", "info");
        }
    },

    updateAuthUI() {
        const loginOverlay = document.getElementById('login-overlay');
        const mainApp = document.getElementById('app-layout');
        const userDisplay = document.getElementById('header-user-name');
        const roleDisplay = document.getElementById('header-user-role');
        const avatarCircle = document.getElementById('header-avatar-circle');

        if (this.isLoggedIn()) {
            if (loginOverlay) loginOverlay.style.display = 'none';
            if (mainApp) mainApp.style.display = 'flex';
            if (userDisplay) userDisplay.textContent = this.currentUser.name;
            if (roleDisplay) roleDisplay.textContent = this.currentUser.role;
            if (avatarCircle && this.currentUser.name) {
                const parts = this.currentUser.name.trim().split(/\s+/);
                const initials = parts.length > 1 ? (parts[0][0] + parts[parts.length - 1][0]) : parts[0].slice(0, 2);
                avatarCircle.textContent = initials.toUpperCase();
            }
        } else {
            if (loginOverlay) loginOverlay.style.display = 'flex';
            if (mainApp) mainApp.style.display = 'none';
        }
    }
};
