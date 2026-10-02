/**
 * MIT College Management System - Student Portal Controller
 */

document.addEventListener('DOMContentLoaded', function () {
    let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'student') {
        currentUser = { username: 'student', role: 'student', name: 'Atharva Chothe' };
        sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
    }

    // Set User Profile Display
    const nameEl = document.getElementById('student-name');
    const sidebarName = document.getElementById('student-sidebar-name');
    const initialsEl = document.getElementById('student-avatar-initials');

    if (nameEl) nameEl.textContent = currentUser.name.split(' ')[0];
    if (sidebarName) sidebarName.textContent = currentUser.name;
    if (initialsEl) {
        initialsEl.textContent = currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    }

    // Live Date
    updateLiveDate();

    // Navigation
    setupNavigation();

    // Logout
    setupLogout();

    function updateLiveDate() {
        const dateDisplay = document.getElementById('current-date');
        if (!dateDisplay) return;
        const now = new Date();
        const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
        dateDisplay.innerHTML = `<i class="far fa-calendar-alt"></i> <span>${now.toLocaleDateString('en-US', options)}</span>`;
    }

    function setupNavigation() {
        const navLinks = document.querySelectorAll('.sidebar-nav a[data-section]');
        navLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                const sectionId = this.getAttribute('data-section');
                switchSection(sectionId);
            });
        });
    }

    function switchSection(sectionId) {
        const navLinks = document.querySelectorAll('.sidebar-nav a[data-section]');
        const sections = document.querySelectorAll('.dashboard-section');
        const breadcrumbEl = document.getElementById('student-breadcrumb');
        const headerTitleEl = document.getElementById('student-header-title');

        navLinks.forEach(l => l.parentElement.classList.remove('active'));
        sections.forEach(s => s.classList.remove('active'));

        const targetLink = document.querySelector(`.sidebar-nav a[data-section="${sectionId}"]`);
        if (targetLink) targetLink.parentElement.classList.add('active');

        const targetSection = document.getElementById(sectionId);
        if (targetSection) targetSection.classList.add('active');

        let title = 'Student Dashboard';
        let breadcrumb = 'Overview';

        if (sectionId === 'profile') {
            title = 'Student Dossier & Profile';
            breadcrumb = 'My Profile';
            renderProfileSection();
        } else if (sectionId === 'courses') {
            title = 'Enrolled Courses & Curriculum';
            breadcrumb = 'My Courses';
            renderCoursesSection();
        } else if (sectionId === 'results') {
            title = 'Academic Performance & Grades';
            breadcrumb = 'Exam Results';
            renderResultsSection();
        } else if (sectionId === 'fees') {
            title = 'Tuition Fees & Payments';
            breadcrumb = 'Fee Records';
            renderFeesSection();
        }

        if (headerTitleEl) headerTitleEl.textContent = title;
        if (breadcrumbEl) breadcrumbEl.textContent = breadcrumb;
    }

    function setupLogout() {
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function () {
                sessionStorage.removeItem('currentUser');
                window.location.href = '../index.html';
            });
        }
    }

    // ==========================================================================
    // Dynamic Section Renderers
    // ==========================================================================

    function renderProfileSection() {
        const section = document.getElementById('profile');
        if (!section) return;

        section.innerHTML = `
            <div class="profile-card">
                <div class="profile-header-banner">
                    <div class="profile-big-avatar">
                        <i class="fas fa-user-graduate"></i>
                    </div>
                    <div class="profile-header-info">
                        <h2>${currentUser.name}</h2>
                        <p>Undergraduate • Computer Science & Engineering</p>
                        <p style="font-size: 0.85rem; opacity: 0.8; margin-top: 4px;">Student ID: MIT-2023-CS018 • Enrolled Fall 2023</p>
                    </div>
                </div>
                
                <div class="profile-body-content">
                    <h3><i class="fas fa-id-card"></i> Personal Information</h3>
                    <div class="details-grid">
                        <div class="detail-item">
                            <span class="detail-label">Roll Number</span>
                            <span class="detail-value">CSE-023-018</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Date of Birth</span>
                            <span class="detail-value">October 15, 2004</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Gender</span>
                            <span class="detail-value">Male</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Email Address</span>
                            <span class="detail-value">atharva.c@college.edu</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Contact Phone</span>
                            <span class="detail-value">+1 (555) 019-3382</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Campus Residence</span>
                            <span class="detail-value">Block B • Room 204</span>
                        </div>
                    </div>

                    <h3><i class="fas fa-graduation-cap"></i> Academic Standing</h3>
                    <div class="details-grid">
                        <div class="detail-item">
                            <span class="detail-label">Degree Program</span>
                            <span class="detail-value">B.Tech in Computer Science</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Academic Year</span>
                            <span class="detail-value">3rd Year (Junior)</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Cumulative GPA</span>
                            <span class="detail-value" style="color: #7c3aed; font-weight: 800;">3.85 / 4.00</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Credits Earned</span>
                            <span class="detail-value">92 Credits</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function renderCoursesSection() {
        const section = document.getElementById('courses');
        if (!section) return;

        section.innerHTML = `
            <div class="card" style="margin-bottom: 24px;">
                <h3><i class="fas fa-book-open"></i> Enrolled Fall Semester Courses</h3>
                <p style="color: #64748b; font-size: 0.9rem;">
                    Access course syllabi, assignments, and faculty instructor profiles.
                </p>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px;">
                <div class="card" style="border-top: 4px solid #3b82f6;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                        <span style="font-family: monospace; font-weight: 800; font-size: 1.1rem; color: #1d4ed8;">CS101</span>
                        <span style="background: #eff6ff; color: #1e40af; font-weight: 700; font-size: 0.78rem; padding: 4px 10px; border-radius: 20px;">4 Credits</span>
                    </div>
                    <h4 style="font-size: 1.05rem; margin-bottom: 6px;">Introduction to Programming</h4>
                    <p style="color: #64748b; font-size: 0.85rem; margin-bottom: 14px;">Instructor: Prof. Akash Verma • Room 201</p>
                    <button style="padding: 8px 14px; background: #eef2ff; color: #4338ca; border: none; border-radius: 8px; font-weight: 600; font-size: 0.82rem; cursor: pointer;" onclick="alert('Downloading Syllabus for CS101...')">
                        <i class="fas fa-download"></i> Course Syllabus
                    </button>
                </div>

                <div class="card" style="border-top: 4px solid #10b981;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                        <span style="font-family: monospace; font-weight: 800; font-size: 1.1rem; color: #047857;">MATH201</span>
                        <span style="background: #ecfdf5; color: #065f46; font-weight: 700; font-size: 0.78rem; padding: 4px 10px; border-radius: 20px;">4 Credits</span>
                    </div>
                    <h4 style="font-size: 1.05rem; margin-bottom: 6px;">Calculus & Linear Algebra</h4>
                    <p style="color: #64748b; font-size: 0.85rem; margin-bottom: 14px;">Instructor: Prof. Michael Brown • Room 105</p>
                    <button style="padding: 8px 14px; background: #ecfdf5; color: #065f46; border: none; border-radius: 8px; font-weight: 600; font-size: 0.82rem; cursor: pointer;" onclick="alert('Downloading Syllabus for MATH201...')">
                        <i class="fas fa-download"></i> Course Syllabus
                    </button>
                </div>

                <div class="card" style="border-top: 4px solid #8b5cf6;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                        <span style="font-family: monospace; font-weight: 800; font-size: 1.1rem; color: #6d28d9;">PHYS101</span>
                        <span style="background: #f5f3ff; color: #5b21b6; font-weight: 700; font-size: 0.78rem; padding: 4px 10px; border-radius: 20px;">3 Credits</span>
                    </div>
                    <h4 style="font-size: 1.05rem; margin-bottom: 6px;">Engineering Physics Lab</h4>
                    <p style="color: #64748b; font-size: 0.85rem; margin-bottom: 14px;">Instructor: Dr. Emily Carter • Lab 3</p>
                    <button style="padding: 8px 14px; background: #f5f3ff; color: #5b21b6; border: none; border-radius: 8px; font-weight: 600; font-size: 0.82rem; cursor: pointer;" onclick="alert('Downloading Syllabus for PHYS101...')">
                        <i class="fas fa-download"></i> Course Syllabus
                    </button>
                </div>
            </div>
        `;
    }

    function renderResultsSection() {
        const section = document.getElementById('results');
        if (!section) return;

        section.innerHTML = `
            <div class="card" style="margin-bottom: 24px;">
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
                    <div>
                        <h3><i class="fas fa-award"></i> Semester 4 Official Grade Transcript</h3>
                        <p style="color: #64748b; font-size: 0.9rem;">Term SGPA: <strong style="color: #059669; font-size: 1.1rem;">3.90</strong> • Status: <strong>Dean's Honor List</strong></p>
                    </div>
                    <button style="padding: 10px 18px; background: linear-gradient(135deg, #4f46e5, #0ea5e9); color: white; border: none; border-radius: 10px; font-weight: 600; cursor: pointer;" onclick="alert('Generating official PDF Transcript...')">
                        <i class="fas fa-file-pdf"></i> Download PDF Transcript
                    </button>
                </div>
            </div>

            <div class="card" style="padding: 0; overflow: hidden;">
                <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem;">
                    <thead>
                        <tr style="background: #f8fafc; border-bottom: 1px solid #e2e8f0; color: #64748b;">
                            <th style="padding: 14px 20px;">Course Code</th>
                            <th style="padding: 14px 20px;">Course Title</th>
                            <th style="padding: 14px 20px;">Credits</th>
                            <th style="padding: 14px 20px;">Letter Grade</th>
                            <th style="padding: 14px 20px; text-align: right;">Grade Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border-bottom: 1px solid #f1f5f9;">
                            <td style="padding: 16px 20px; font-family: monospace; font-weight: 700;">CS201</td>
                            <td style="padding: 16px 20px; font-weight: 600;">Computer Architecture & Organization</td>
                            <td style="padding: 16px 20px;">4</td>
                            <td style="padding: 16px 20px;"><span style="padding: 4px 10px; background: #ecfdf5; color: #059669; font-weight: 800; border-radius: 6px;">A+</span></td>
                            <td style="padding: 16px 20px; text-align: right; font-weight: 700;">4.00</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #f1f5f9;">
                            <td style="padding: 16px 20px; font-family: monospace; font-weight: 700;">CS202</td>
                            <td style="padding: 16px 20px; font-weight: 600;">Database Management Systems</td>
                            <td style="padding: 16px 20px;">4</td>
                            <td style="padding: 16px 20px;"><span style="padding: 4px 10px; background: #ecfdf5; color: #059669; font-weight: 800; border-radius: 6px;">A</span></td>
                            <td style="padding: 16px 20px; text-align: right; font-weight: 700;">3.80</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #f1f5f9;">
                            <td style="padding: 16px 20px; font-family: monospace; font-weight: 700;">MATH202</td>
                            <td style="padding: 16px 20px; font-weight: 600;">Discrete Mathematics & Probability</td>
                            <td style="padding: 16px 20px;">3</td>
                            <td style="padding: 16px 20px;"><span style="padding: 4px 10px; background: #ecfdf5; color: #059669; font-weight: 800; border-radius: 6px;">A+</span></td>
                            <td style="padding: 16px 20px; text-align: right; font-weight: 700;">4.00</td>
                        </tr>
                        <tr>
                            <td style="padding: 16px 20px; font-family: monospace; font-weight: 700;">HUM101</td>
                            <td style="padding: 16px 20px; font-weight: 600;">Technical Writing & Professional Ethics</td>
                            <td style="padding: 16px 20px;">2</td>
                            <td style="padding: 16px 20px;"><span style="padding: 4px 10px; background: #eff6ff; color: #1d4ed8; font-weight: 800; border-radius: 6px;">A-</span></td>
                            <td style="padding: 16px 20px; text-align: right; font-weight: 700;">3.70</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    }

    function renderFeesSection() {
        const section = document.getElementById('fees');
        if (!section) return;

        section.innerHTML = `
            <div class="card" style="margin-bottom: 24px;">
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
                    <div>
                        <h3><i class="fas fa-receipt"></i> Tuition Fee Statements</h3>
                        <p style="color: #64748b; font-size: 0.9rem;">
                            Academic Year 2026-2027 • All installment payments verified
                        </p>
                    </div>
                    <span style="padding: 6px 16px; background: #ecfdf5; color: #059669; font-weight: 700; border-radius: 20px; font-size: 0.88rem; display: inline-flex; align-items: center; gap: 6px;">
                        <i class="fas fa-check-circle"></i> Paid in Full
                    </span>
                </div>
            </div>

            <div class="card" style="padding: 0; overflow: hidden;">
                <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem;">
                    <thead>
                        <tr style="background: #f8fafc; border-bottom: 1px solid #e2e8f0; color: #64748b;">
                            <th style="padding: 14px 20px;">Receipt #</th>
                            <th style="padding: 14px 20px;">Description</th>
                            <th style="padding: 14px 20px;">Date Paid</th>
                            <th style="padding: 14px 20px;">Amount</th>
                            <th style="padding: 14px 20px; text-align: right;">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border-bottom: 1px solid #f1f5f9;">
                            <td style="padding: 16px 20px; font-family: monospace; font-weight: 700;">REC-2026-8812</td>
                            <td style="padding: 16px 20px; font-weight: 600;">Semester 5 Tuition & Campus Fee</td>
                            <td style="padding: 16px 20px; color: #64748b;">August 18, 2026</td>
                            <td style="padding: 16px 20px; font-weight: 800; color: #0f172a;">$3,850.00</td>
                            <td style="padding: 16px 20px; text-align: right;">
                                <button style="padding: 6px 12px; background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 6px; font-weight: 600; cursor: pointer;" onclick="alert('Downloading Receipt REC-2026-8812...')">
                                    <i class="fas fa-receipt"></i> Receipt
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 16px 20px; font-family: monospace; font-weight: 700;">REC-2026-8940</td>
                            <td style="padding: 16px 20px; font-weight: 600;">Advanced Computing Laboratory Fee</td>
                            <td style="padding: 16px 20px; color: #64748b;">August 18, 2026</td>
                            <td style="padding: 16px 20px; font-weight: 800; color: #0f172a;">$400.00</td>
                            <td style="padding: 16px 20px; text-align: right;">
                                <button style="padding: 6px 12px; background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 6px; font-weight: 600; cursor: pointer;" onclick="alert('Downloading Receipt REC-2026-8940...')">
                                    <i class="fas fa-receipt"></i> Receipt
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    }
});