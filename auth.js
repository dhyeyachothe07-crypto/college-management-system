// Mock user database
let users = {
    'admin': { password: 'admin123', role: 'admin', name: 'System Administrator' },
    'faculty': { password: 'faculty123', role: 'faculty', name: 'Prof. Akash Verma' },
    'student': { password: 'student123', role: 'student', name: 'Atharva Chothe' }
};

document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const roleInput = document.getElementById('role');
    const togglePassword = document.getElementById('togglePassword');
    const roleTabs = document.querySelectorAll('.role-tab-btn');
    const demoChips = document.querySelectorAll('.demo-chip');

    // Role Tab Switching
    roleTabs.forEach(tab => {
        tab.addEventListener('click', function () {
            roleTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            const selectedRole = this.getAttribute('data-role');
            if (roleInput) {
                roleInput.value = selectedRole;
            }
        });
    });

    // Password Show / Hide
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function () {
            const isPassword = passwordInput.getAttribute('type') === 'password';
            passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
            this.classList.toggle('fa-eye', !isPassword);
            this.classList.toggle('fa-eye-slash', isPassword);
        });
    }

    // Interactive Demo Credentials Autofill
    demoChips.forEach(chip => {
        chip.addEventListener('click', function () {
            const u = this.getAttribute('data-user');
            const p = this.getAttribute('data-pass');
            const r = this.getAttribute('data-role');

            if (usernameInput) usernameInput.value = u;
            if (passwordInput) passwordInput.value = p;
            if (roleInput) roleInput.value = r;

            // Update active role tab
            roleTabs.forEach(tab => {
                if (tab.getAttribute('data-role') === r) {
                    tab.classList.add('active');
                } else {
                    tab.classList.remove('active');
                }
            });

            showToast(`Loaded ${r.toUpperCase()} demo credentials!`, 'info');
        });
    });

    // Form Submit
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const username = usernameInput.value.trim();
            const password = passwordInput.value;
            const role = roleInput ? roleInput.value : 'admin';

            if (!username || !password || !role) {
                showToast('Please enter your username and password.', 'error');
                return;
            }

            const user = users[username];
            if (!user) {
                showToast('Invalid username or account does not exist.', 'error');
                return;
            }

            if (user.password !== password) {
                showToast('Incorrect password. Please try again.', 'error');
                return;
            }

            if (user.role !== role) {
                showToast(`This account is registered as a ${user.role}, not ${role}.`, 'warning');
                return;
            }

            // Save session
            sessionStorage.setItem('currentUser', JSON.stringify({
                username: username,
                role: user.role,
                name: user.name
            }));

            showToast(`Welcome back, ${user.name}! Redirecting...`, 'success');

            const submitBtn = document.getElementById('loginBtn');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
            }

            setTimeout(() => {
                switch (role) {
                    case 'admin':
                        window.location.href = 'admin/dashboard.html';
                        break;
                    case 'faculty':
                        window.location.href = 'faculty/dashboard.html';
                        break;
                    case 'student':
                        window.location.href = 'student/dashboard.html';
                        break;
                }
            }, 800);
        });
    }

    // Try fetching PHP backend if hosted on server
    if (typeof fetch === 'function') {
        fetch('get_user.php')
            .then(res => res.json())
            .then(data => {
                if (data && typeof data === 'object') {
                    users = Object.assign({}, users, data);
                }
            })
            .catch(() => {
                // Silently fallback to built-in mock users
            });
    }
});

// Toast Notification Helper
function showToast(message, type = 'info') {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let icon = 'info-circle';
    let title = 'Notification';
    if (type === 'success') { icon = 'check-circle'; title = 'Success'; }
    if (type === 'error') { icon = 'exclamation-circle'; title = 'Error'; }
    if (type === 'warning') { icon = 'exclamation-triangle'; title = 'Notice'; }

    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas fa-${icon}"></i>
        </div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'toastSlideOut 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3200);
}
