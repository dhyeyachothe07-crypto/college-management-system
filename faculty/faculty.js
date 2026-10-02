/**
 * MIT College Management System - Faculty Dashboard Logic
 */

document.addEventListener('DOMContentLoaded', function() {
    let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'faculty') {
        currentUser = { username: 'faculty', role: 'faculty', name: 'Prof. Akash Verma' };
        sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
    }

    // Set User Profile Display
    const nameDisplay = document.getElementById('faculty-name-display');
    const welcomeName = document.getElementById('faculty-welcome-name');
    const avatarInitials = document.getElementById('faculty-avatar-initials');

    if (nameDisplay) nameDisplay.textContent = currentUser.name;
    if (welcomeName) welcomeName.textContent = currentUser.name;
    if (avatarInitials) {
        avatarInitials.textContent = currentUser.name.replace('Prof. ', '').replace('Dr. ', '').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    }

    // Update Live Date & Time
    updateDateDisplay();

    // Setup Navigation
    setupNavigation();

    // Setup Logout
    setupLogout();

    function updateDateDisplay() {
        const dateDisplay = document.getElementById('current-date');
        if (!dateDisplay) return;
        const now = new Date();
        const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
        dateDisplay.innerHTML = `<i class="far fa-calendar-alt"></i> <span>${now.toLocaleDateString('en-US', options)}</span>`;
    }

    function setupNavigation() {
        const navLinks = document.querySelectorAll('.sidebar-nav a[data-section]');
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const sectionId = this.getAttribute('data-section');
                switchSection(sectionId);
            });
        });
    }

    function switchSection(sectionId) {
        const navLinks = document.querySelectorAll('.sidebar-nav a[data-section]');
        const sections = document.querySelectorAll('.dashboard-section');
        const breadcrumbEl = document.getElementById('faculty-breadcrumb');
        const headerTitleEl = document.getElementById('faculty-header-title');

        navLinks.forEach(l => l.parentElement.classList.remove('active'));
        sections.forEach(s => s.classList.remove('active'));

        const targetLink = document.querySelector(`.sidebar-nav a[data-section="${sectionId}"]`);
        if (targetLink) targetLink.parentElement.classList.add('active');

        const targetSection = document.getElementById(sectionId);
        if (targetSection) targetSection.classList.add('active');

        let title = 'Faculty Dashboard';
        let breadcrumb = 'Overview';

        if (sectionId === 'my-courses') {
            title = 'Assigned Academic Courses';
            breadcrumb = 'My Courses';
            renderCoursesSection();
        } else if (sectionId === 'schedule') {
            title = 'Weekly Class Timetable';
            breadcrumb = 'Class Schedule';
            renderScheduleSection();
        } else if (sectionId === 'attendance') {
            title = 'Digital Attendance Tracker';
            breadcrumb = 'Attendance';
            renderAttendanceSection();
        }

        if (headerTitleEl) headerTitleEl.textContent = title;
        if (breadcrumbEl) breadcrumbEl.textContent = breadcrumb;
    }

    function setupLogout() {
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function() {
                sessionStorage.removeItem('currentUser');
                window.location.href = '../index.html';
            });
        }
    }

    // ==========================================================================
    // Section Renderers
    // ==========================================================================

    function renderCoursesSection() {
        const section = document.getElementById('my-courses');
        if (!section) return;

        section.innerHTML = `
            <div class="card" style="margin-bottom: 24px;">
                <h3><i class="fas fa-book-reader"></i> Current Semester Assigned Courses</h3>
                <p style="color: #64748b; font-size: 0.9rem;">
                    View curriculum modules, student rosters, lecture materials, and grading schedules.
                </p>
            </div>

            <div class="courses-grid">
                <div class="course-card">
                    <div class="course-card-header" style="background: linear-gradient(135deg, #3b82f6, #1d4ed8);">
                        <h3>CS101</h3>
                        <span class="course-credits">4 Credits</span>
                    </div>
                    <div class="course-body">
                        <h4>Introduction to Programming</h4>
                        <p>Foundations of algorithms, Python paradigms, object-oriented concepts and problem solving.</p>
                        <div class="course-meta">
                            <span><i class="fas fa-users"></i> 45 Students</span>
                            <span><i class="fas fa-clock"></i> Mon/Wed 09:00 AM</span>
                        </div>
                    </div>
                    <div class="course-actions">
                        <button class="btn-course-action" onclick="window.takeCourseAttendance('CS101 - Introduction to Programming')">
                            <i class="fas fa-clipboard-check"></i> Attendance
                        </button>
                        <button class="btn-course-action" onclick="window.showFacultyNotice('Gradebook for CS101 opened!')">
                            <i class="fas fa-graduation-cap"></i> Grades
                        </button>
                    </div>
                </div>

                <div class="course-card">
                    <div class="course-card-header" style="background: linear-gradient(135deg, #10b981, #047857);">
                        <h3>CS301</h3>
                        <span class="course-credits">4 Credits</span>
                    </div>
                    <div class="course-body">
                        <h4>Data Structures & Algorithms</h4>
                        <p>Trees, graphs, dynamic programming, sorting optimization, and space-time complexity analysis.</p>
                        <div class="course-meta">
                            <span><i class="fas fa-users"></i> 38 Students</span>
                            <span><i class="fas fa-clock"></i> Tue/Thu 11:00 AM</span>
                        </div>
                    </div>
                    <div class="course-actions">
                        <button class="btn-course-action" onclick="window.takeCourseAttendance('CS301 - Data Structures')">
                            <i class="fas fa-clipboard-check"></i> Attendance
                        </button>
                        <button class="btn-course-action" onclick="window.showFacultyNotice('Gradebook for CS301 opened!')">
                            <i class="fas fa-graduation-cap"></i> Grades
                        </button>
                    </div>
                </div>

                <div class="course-card">
                    <div class="course-card-header" style="background: linear-gradient(135deg, #8b5cf6, #6d28d9);">
                        <h3>CS402</h3>
                        <span class="course-credits">3 Credits</span>
                    </div>
                    <div class="course-body">
                        <h4>Machine Learning Foundations</h4>
                        <p>Supervised and unsupervised learning, regression, neural network models, and PyTorch labs.</p>
                        <div class="course-meta">
                            <span><i class="fas fa-users"></i> 45 Students</span>
                            <span><i class="fas fa-clock"></i> Fri 02:00 PM</span>
                        </div>
                    </div>
                    <div class="course-actions">
                        <button class="btn-course-action" onclick="window.takeCourseAttendance('CS402 - Machine Learning')">
                            <i class="fas fa-clipboard-check"></i> Attendance
                        </button>
                        <button class="btn-course-action" onclick="window.showFacultyNotice('Gradebook for CS402 opened!')">
                            <i class="fas fa-graduation-cap"></i> Grades
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    function renderScheduleSection() {
        const section = document.getElementById('schedule');
        if (!section) return;

        section.innerHTML = `
            <div class="card" style="margin-bottom: 24px;">
                <h3><i class="fas fa-calendar-alt"></i> Complete Weekly Timetable</h3>
                <p style="color: #64748b; font-size: 0.9rem;">
                    Full weekly breakdown of lecture sessions, computer laboratories, and student consultation hours.
                </p>
            </div>

            <div class="schedule-list">
                <div class="schedule-item">
                    <div class="schedule-time">Monday • 09:00 - 10:30</div>
                    <div class="schedule-details">
                        <h4>CS101: Lecture - Python Core & Control Flow</h4>
                        <p>Lecture Hall 201 • Batch A (Undergraduate 1st Year)</p>
                    </div>
                </div>
                <div class="schedule-item">
                    <div class="schedule-time">Monday • 14:00 - 16:00</div>
                    <div class="schedule-details">
                        <h4>CS101: Practical Laboratory Session</h4>
                        <p>Computing Lab 2 • Batch A1 (Hands-on Programming)</p>
                    </div>
                </div>
                <div class="schedule-item">
                    <div class="schedule-time">Tuesday • 11:00 - 12:30</div>
                    <div class="schedule-details">
                        <h4>CS301: Trees, Binary Search & AVL Implementations</h4>
                        <p>Room 305 • Batch B (Undergraduate 2nd Year)</p>
                    </div>
                </div>
                <div class="schedule-item">
                    <div class="schedule-time">Wednesday • 09:00 - 10:30</div>
                    <div class="schedule-details">
                        <h4>CS101: Modular Functions & Recursion</h4>
                        <p>Lecture Hall 201 • Batch A</p>
                    </div>
                </div>
                <div class="schedule-item">
                    <div class="schedule-time">Thursday • 11:00 - 12:30</div>
                    <div class="schedule-details">
                        <h4>CS301: Graph Traversals (BFS / DFS Algorithms)</h4>
                        <p>Room 305 • Batch B</p>
                    </div>
                </div>
                <div class="schedule-item">
                    <div class="schedule-time">Friday • 14:00 - 16:30</div>
                    <div class="schedule-details">
                        <h4>CS402: Neural Networks & Backpropagation Lab</h4>
                        <p>AI Innovation Center • Batch C (Advanced Lab)</p>
                    </div>
                </div>
            </div>
        `;
    }

    function renderAttendanceSection(selectedCourse = 'CS101 - Introduction to Programming') {
        const section = document.getElementById('attendance');
        if (!section) return;

        section.innerHTML = `
            <div class="card" style="margin-bottom: 24px;">
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
                    <div>
                        <h3><i class="fas fa-clipboard-check"></i> Attendance Session Tracker</h3>
                        <p style="color: #64748b; font-size: 0.9rem;">
                            Selected Course: <strong>${selectedCourse}</strong> • Date: <strong>Today</strong>
                        </p>
                    </div>
                    <button class="btn-course-action" style="background:#10b981; color:white; border:none; padding:10px 20px; font-weight:700;" onclick="window.saveAttendanceRoster()">
                        <i class="fas fa-save"></i> Submit & Save Attendance
                    </button>
                </div>
            </div>

            <div class="card">
                <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem;">
                    <thead>
                        <tr style="border-bottom: 2px solid #e2e8f0; color: #64748b;">
                            <th style="padding: 12px 16px;">Roll ID</th>
                            <th style="padding: 12px 16px;">Student Name</th>
                            <th style="padding: 12px 16px;">Semester</th>
                            <th style="padding: 12px 16px; text-align: center;">Attendance Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border-bottom: 1px solid #f1f5f9;">
                            <td style="padding: 14px 16px; font-family: monospace; font-weight: 600;">S001</td>
                            <td style="padding: 14px 16px; font-weight: 600;">Alice Johnson</td>
                            <td style="padding: 14px 16px; color: #64748b;">5th Semester</td>
                            <td style="padding: 14px 16px; text-align: center;">
                                <button class="att-btn present active" style="padding: 6px 14px; border:none; border-radius: 6px; background:#dcfce7; color:#15803d; font-weight: 700; cursor: pointer; margin-right: 6px;" onclick="toggleAtt(this, 'present')">Present</button>
                                <button class="att-btn absent" style="padding: 6px 14px; border:none; border-radius: 6px; background:#f1f5f9; color:#64748b; font-weight: 700; cursor: pointer; margin-right: 6px;" onclick="toggleAtt(this, 'absent')">Absent</button>
                                <button class="att-btn late" style="padding: 6px 14px; border:none; border-radius: 6px; background:#f1f5f9; color:#64748b; font-weight: 700; cursor: pointer;" onclick="toggleAtt(this, 'late')">Late</button>
                            </td>
                        </tr>
                        <tr style="border-bottom: 1px solid #f1f5f9;">
                            <td style="padding: 14px 16px; font-family: monospace; font-weight: 600;">S002</td>
                            <td style="padding: 14px 16px; font-weight: 600;">Bob Smith</td>
                            <td style="padding: 14px 16px; color: #64748b;">3rd Semester</td>
                            <td style="padding: 14px 16px; text-align: center;">
                                <button class="att-btn present active" style="padding: 6px 14px; border:none; border-radius: 6px; background:#dcfce7; color:#15803d; font-weight: 700; cursor: pointer; margin-right: 6px;" onclick="toggleAtt(this, 'present')">Present</button>
                                <button class="att-btn absent" style="padding: 6px 14px; border:none; border-radius: 6px; background:#f1f5f9; color:#64748b; font-weight: 700; cursor: pointer; margin-right: 6px;" onclick="toggleAtt(this, 'absent')">Absent</button>
                                <button class="att-btn late" style="padding: 6px 14px; border:none; border-radius: 6px; background:#f1f5f9; color:#64748b; font-weight: 700; cursor: pointer;" onclick="toggleAtt(this, 'late')">Late</button>
                            </td>
                        </tr>
                        <tr style="border-bottom: 1px solid #f1f5f9;">
                            <td style="padding: 14px 16px; font-family: monospace; font-weight: 600;">S003</td>
                            <td style="padding: 14px 16px; font-weight: 600;">Catherine Davis</td>
                            <td style="padding: 14px 16px; color: #64748b;">7th Semester</td>
                            <td style="padding: 14px 16px; text-align: center;">
                                <button class="att-btn present active" style="padding: 6px 14px; border:none; border-radius: 6px; background:#dcfce7; color:#15803d; font-weight: 700; cursor: pointer; margin-right: 6px;" onclick="toggleAtt(this, 'present')">Present</button>
                                <button class="att-btn absent" style="padding: 6px 14px; border:none; border-radius: 6px; background:#f1f5f9; color:#64748b; font-weight: 700; cursor: pointer; margin-right: 6px;" onclick="toggleAtt(this, 'absent')">Absent</button>
                                <button class="att-btn late" style="padding: 6px 14px; border:none; border-radius: 6px; background:#f1f5f9; color:#64748b; font-weight: 700; cursor: pointer;" onclick="toggleAtt(this, 'late')">Late</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    }

    // Global helpers
    window.takeCourseAttendance = function(courseName) {
        switchSection('attendance');
        renderAttendanceSection(courseName);
    };

    window.toggleAtt = function(btn, type) {
        const parent = btn.parentElement;
        parent.querySelectorAll('.att-btn').forEach(b => {
            b.style.background = '#f1f5f9';
            b.style.color = '#64748b';
        });

        if (type === 'present') {
            btn.style.background = '#dcfce7';
            btn.style.color = '#15803d';
        } else if (type === 'absent') {
            btn.style.background = '#fee2e2';
            btn.style.color = '#b91c1c';
        } else if (type === 'late') {
            btn.style.background = '#fef3c7';
            btn.style.color = '#b45309';
        }
    };

    window.saveAttendanceRoster = function() {
        showFacultyNotice('Attendance submitted successfully to Dean records!', 'success');
    };

    window.showFacultyNotice = function(msg, type = 'success') {
        let container = document.getElementById('toastContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toastContainer';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-icon"><i class="fas fa-check-circle"></i></div>
            <div class="toast-content">
                <div class="toast-title">Faculty Portal</div>
                <div class="toast-message">${msg}</div>
            </div>
        `;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'toastSlideOut 0.3s forwards';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    };
});