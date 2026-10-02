/**
 * MIT College Management System - Admin Dashboard Controller
 */

document.addEventListener('DOMContentLoaded', function() {
    // Session Authentication Check
    let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'admin') {
        // Fallback for direct browser preview
        currentUser = { username: 'admin', role: 'admin', name: 'System Administrator' };
        sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
    
    // Update User Display in Sidebar
    const userNameEl = document.querySelector('.user-name-display');
    if (userNameEl) userNameEl.textContent = currentUser.name;
    
    // Update Live Date & Time
    updateLiveClock();
    setInterval(updateLiveClock, 30000);
    
    // Initialize Data
    let students = initializeStudentsData();
    
    // Setup Navigation
    setupNavigation();
    
    // Setup Logout
    setupLogout();
    
    // Keyboard Shortcuts
    setupKeyboardShortcuts();
    
    // Update Overview Stats & Counts
    updateAllStats();
    
    // By default, check if URL hash requests specific section or load dashboard
    const initialSection = window.location.hash ? window.location.hash.substring(1) : 'dashboard';
    switchSection(initialSection);

    // ==========================================================================
    // Functions & Handlers
    // ==========================================================================

    function updateLiveClock() {
        const dateDisplay = document.getElementById('current-date');
        if (!dateDisplay) return;
        const now = new Date();
        const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
        dateDisplay.innerHTML = `<i class="far fa-calendar-alt"></i> <span>${now.toLocaleDateString('en-US', options)}</span>`;
    }

    function initializeStudentsData() {
        const defaultStudents = [
            { 
                id: 'S001', 
                name: 'Alice Johnson', 
                email: 'alice.johnson@college.edu', 
                phone: '(555) 019-2831',
                dob: '2003-05-14',
                gender: 'Female',
                course: 'Computer Science', 
                year: '3rd Year', 
                semester: '5th Semester',
                status: 'Active',
                cgpa: '3.85',
                feeStatus: 'Paid'
            },
            { 
                id: 'S002', 
                name: 'Bob Smith', 
                email: 'bob.smith@college.edu', 
                phone: '(555) 014-9923',
                dob: '2004-02-20',
                gender: 'Male',
                course: 'Mathematics', 
                year: '2nd Year',
                semester: '3rd Semester',
                status: 'Active', 
                cgpa: '3.62',
                feeStatus: 'Paid'
            },
            { 
                id: 'S003', 
                name: 'Catherine Davis', 
                email: 'catherine.d@college.edu', 
                phone: '(555) 018-7744',
                dob: '2002-11-09',
                gender: 'Female',
                course: 'Physics', 
                year: '4th Year',
                semester: '7th Semester',
                status: 'Active', 
                cgpa: '3.91',
                feeStatus: 'Paid'
            },
            { 
                id: 'S004', 
                name: 'David Wilson', 
                email: 'david.wilson@college.edu', 
                phone: '(555) 012-4411',
                dob: '2003-08-30',
                gender: 'Male',
                course: 'Computer Science', 
                year: '3rd Year',
                semester: '5th Semester',
                status: 'Inactive', 
                cgpa: '3.20',
                feeStatus: 'Pending'
            },
            { 
                id: 'S005', 
                name: 'Emma Watson', 
                email: 'emma.w@college.edu', 
                phone: '(555) 015-8833',
                dob: '2001-04-18',
                gender: 'Female',
                course: 'Chemistry', 
                year: 'Graduated',
                semester: 'Alumni',
                status: 'Graduated', 
                cgpa: '3.95',
                feeStatus: 'Paid'
            }
        ];
        
        const saved = localStorage.getItem('mit_students');
        if (saved) {
            try { return JSON.parse(saved); } catch (e) { /* fallback */ }
        }
        localStorage.setItem('mit_students', JSON.stringify(defaultStudents));
        return defaultStudents;
    }

    function saveStudents() {
        localStorage.setItem('mit_students', JSON.stringify(students));
        updateAllStats();
    }

    function updateAllStats() {
        const totalStudentsEl = document.getElementById('total-students');
        const sidebarStudentCount = document.getElementById('sidebar-student-count');
        if (totalStudentsEl) totalStudentsEl.textContent = students.length.toLocaleString();
        if (sidebarStudentCount) sidebarStudentCount.textContent = students.length;

        // Faculty count from localStorage or default
        const savedFaculty = localStorage.getItem('mit_faculty');
        let facultyCount = 2;
        if (savedFaculty) {
            try { facultyCount = JSON.parse(savedFaculty).length; } catch (e) {}
        }
        const totalFacultyEl = document.getElementById('total-faculty');
        const sidebarFacultyCount = document.getElementById('sidebar-faculty-count');
        if (totalFacultyEl) totalFacultyEl.textContent = facultyCount;
        if (sidebarFacultyCount) sidebarFacultyCount.textContent = facultyCount;
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

        // Global search input in header
        const globalSearch = document.getElementById('global-search');
        if (globalSearch) {
            globalSearch.addEventListener('input', function(e) {
                const term = e.target.value.trim();
                if (term) {
                    switchSection('students');
                    const studentSearch = document.getElementById('student-search');
                    if (studentSearch) {
                        studentSearch.value = term;
                        filterStudents();
                    }
                }
            });
        }
    }

    function switchSection(sectionId) {
        const navLinks = document.querySelectorAll('.sidebar-nav a[data-section]');
        const sections = document.querySelectorAll('.dashboard-section');
        const breadcrumbEl = document.getElementById('current-section-breadcrumb');
        const headerTitleEl = document.getElementById('header-main-title');

        navLinks.forEach(l => l.parentElement.classList.remove('active'));
        sections.forEach(s => s.classList.remove('active'));

        const targetLink = document.querySelector(`.sidebar-nav a[data-section="${sectionId}"]`);
        if (targetLink) {
            targetLink.parentElement.classList.add('active');
        }

        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Update breadcrumb and header title
        let titleText = 'Administrator Dashboard';
        let breadcrumbText = 'Overview';

        if (sectionId === 'students') {
            titleText = 'Student Information System';
            breadcrumbText = 'Students';
            loadStudentsSection();
        } else if (sectionId === 'faculty') {
            titleText = 'Faculty & Staff Directory';
            breadcrumbText = 'Faculty';
            if (typeof window.loadFacultySection === 'function') {
                window.loadFacultySection();
            }
        } else {
            titleText = 'Administrator Dashboard';
            breadcrumbText = 'Overview';
            updateAllStats();
        }

        if (headerTitleEl) headerTitleEl.textContent = titleText;
        if (breadcrumbEl) breadcrumbEl.textContent = breadcrumbText;
        window.location.hash = sectionId;
    }

    function setupLogout() {
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function() {
                sessionStorage.removeItem('currentUser');
                showNotification('Logging out...', 'info');
                setTimeout(() => {
                    window.location.href = '../index.html';
                }, 600);
            });
        }
    }

    function setupKeyboardShortcuts() {
        document.addEventListener('keydown', function(e) {
            // Press '/' to focus global search
            if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
                e.preventDefault();
                const globalSearch = document.getElementById('global-search');
                if (globalSearch) globalSearch.focus();
            }
            // Press ESC to close open modals
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal-backdrop.active').forEach(modal => {
                    modal.classList.remove('active');
                });
            }
        });
    }

    // ==========================================================================
    // Student Management Section Renderer
    // ==========================================================================

    function loadStudentsSection() {
        const section = document.getElementById('students');
        if (!section) return;

        const activeCount = students.filter(s => s.status === 'Active').length;
        const inactiveCount = students.filter(s => s.status === 'Inactive').length;
        const graduatedCount = students.filter(s => s.status === 'Graduated').length;

        section.innerHTML = `
            <div class="section-header">
                <div class="section-header-title">
                    <div class="section-icon-badge">
                        <i class="fas fa-user-graduate"></i>
                    </div>
                    <div>
                        <h2>Student Management</h2>
                        <div class="section-subtitle">Monitor enrollments, academic progress, and student credentials</div>
                    </div>
                </div>
                <div class="section-actions">
                    <button class="btn-export" id="exportStudentsBtn" title="Export to CSV Spreadsheet">
                        <i class="fas fa-file-csv"></i> Export CSV
                    </button>
                    <button class="btn-add" id="addStudentBtn">
                        <i class="fas fa-plus"></i> Add New Student
                    </button>
                </div>
            </div>

            <!-- Toolbar & Filter Controls -->
            <div class="section-header" style="margin-bottom: 16px;">
                <div class="table-search-box">
                    <i class="fas fa-search"></i>
                    <input type="text" id="student-search" placeholder="Search by name, ID, or email...">
                </div>
                <div class="section-actions">
                    <select class="table-filter-select" id="filterCourse">
                        <option value="">All Courses</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="Mathematics">Mathematics</option>
                        <option value="Physics">Physics</option>
                        <option value="Chemistry">Chemistry</option>
                        <option value="Engineering">Engineering</option>
                    </select>
                    <select class="table-filter-select" id="filterStatus">
                        <option value="">All Statuses</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Graduated">Graduated</option>
                    </select>
                </div>
            </div>

            <!-- Quick Summary Pills -->
            <div class="table-summary-bar">
                <div class="summary-pill">Total: <strong>${students.length}</strong></div>
                <div class="summary-pill active-pill">Active: <strong>${activeCount}</strong></div>
                <div class="summary-pill">Inactive: <strong>${inactiveCount}</strong></div>
                <div class="summary-pill">Graduated: <strong>${graduatedCount}</strong></div>
            </div>

            <!-- Data Table Card Container -->
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>Student Name</th>
                            <th>Contact Phone</th>
                            <th>Department & Year</th>
                            <th>Enrollment Status</th>
                            <th style="text-align: right;">Actions</th>
                        </tr>
                    </thead>
                    <tbody id="studentsTableBody">
                        <!-- Populated by renderStudentsTable -->
                    </tbody>
                </table>
                <div id="tableEmptyState" class="table-empty-state" style="display: none;">
                    <div class="empty-icon"><i class="fas fa-search"></i></div>
                    <h3>No matching students found</h3>
                    <p>Try adjusting your search keywords or resetting the course and status filters.</p>
                    <button class="btn-reset-filters" id="resetFiltersBtn">Reset Filters</button>
                </div>
                <div class="table-footer">
                    <span id="tableRecordsCount">Showing ${students.length} of ${students.length} students</span>
                    <span>MIT Campus Database • Synchronized</span>
                </div>
            </div>

            <!-- Add / Edit Student Modal -->
            <div class="modal-backdrop" id="studentFormModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 id="modalTitle"><i class="fas fa-user-plus"></i> Add New Student</h3>
                        <button class="modal-close" id="closeFormModalBtn">&times;</button>
                    </div>
                    <form id="studentForm">
                        <div class="modal-body">
                            <div class="form-group">
                                <label for="formStudentName">Full Name *</label>
                                <input type="text" id="formStudentName" required placeholder="e.g. Eleanor Vance">
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="formStudentEmail">Email Address *</label>
                                    <input type="email" id="formStudentEmail" required placeholder="name@college.edu">
                                </div>
                                <div class="form-group">
                                    <label for="formStudentPhone">Phone Number *</label>
                                    <input type="tel" id="formStudentPhone" required placeholder="(555) 012-3456">
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label for="formStudentCourse">Course / Major *</label>
                                    <select id="formStudentCourse" required>
                                        <option value="">Select Course</option>
                                        <option value="Computer Science">Computer Science</option>
                                        <option value="Mathematics">Mathematics</option>
                                        <option value="Physics">Physics</option>
                                        <option value="Chemistry">Chemistry</option>
                                        <option value="Engineering">Engineering</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="formStudentYear">Academic Year *</label>
                                    <select id="formStudentYear" required>
                                        <option value="">Select Year</option>
                                        <option value="1st Year">1st Year</option>
                                        <option value="2nd Year">2nd Year</option>
                                        <option value="3rd Year">3rd Year</option>
                                        <option value="4th Year">4th Year</option>
                                        <option value="Graduated">Graduated</option>
                                    </select>
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label for="formStudentStatus">Enrollment Status</label>
                                    <select id="formStudentStatus">
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                        <option value="Graduated">Graduated</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="formStudentFee">Tuition Fee Status</label>
                                    <select id="formStudentFee">
                                        <option value="Paid">Paid</option>
                                        <option value="Pending">Pending</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn-cancel" id="cancelFormModalBtn">Cancel</button>
                            <button type="submit" class="btn-submit" id="saveStudentBtn">
                                <i class="fas fa-check"></i> Save Student
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- View Student Details Modal -->
            <div class="modal-backdrop" id="viewStudentModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3><i class="fas fa-id-badge"></i> Student Profile Summary</h3>
                        <button class="modal-close" id="closeViewModalBtn">&times;</button>
                    </div>
                    <div class="modal-body" id="viewStudentModalBody">
                        <!-- Populated by viewStudent -->
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn-cancel" id="closeViewModalBtnFooter">Close</button>
                    </div>
                </div>
            </div>

            <!-- Delete Confirmation Modal -->
            <div class="modal-backdrop" id="deleteConfirmModal">
                <div class="modal-content" style="max-width: 440px;">
                    <div class="modal-body delete-warning-box">
                        <div class="delete-warning-icon">
                            <i class="fas fa-trash-alt"></i>
                        </div>
                        <h3>Remove Student Record?</h3>
                        <p style="color: #64748b; font-size: 0.9rem; margin-top: 6px;">
                            This action cannot be undone. All academic records and attendance history will be permanently deleted.
                        </p>
                        <div class="delete-target-info">
                            <p>Student: <strong id="deleteTargetName">...</strong></p>
                            <p>ID: <strong id="deleteTargetId">...</strong></p>
                        </div>
                    </div>
                    <div class="modal-footer" style="justify-content: center;">
                        <button type="button" class="btn-cancel" id="cancelDeleteBtn">Cancel</button>
                        <button type="button" class="btn-delete-confirm" id="confirmDeleteBtn">
                            <i class="fas fa-trash"></i> Delete Student
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Render rows
        renderStudentsTable(students);

        // Setup Event Listeners
        setupStudentSectionEvents();
    }

    function renderStudentsTable(studentList) {
        const tbody = document.getElementById('studentsTableBody');
        const emptyState = document.getElementById('tableEmptyState');
        const recordsCount = document.getElementById('tableRecordsCount');
        if (!tbody) return;

        tbody.innerHTML = '';

        if (!studentList || studentList.length === 0) {
            if (emptyState) emptyState.style.display = 'block';
            if (recordsCount) recordsCount.textContent = 'Showing 0 students';
            return;
        }

        if (emptyState) emptyState.style.display = 'none';
        if (recordsCount) recordsCount.textContent = `Showing ${studentList.length} of ${students.length} students`;

        const avatarGradients = [
            'linear-gradient(135deg, #4f46e5, #0ea5e9)',
            'linear-gradient(135deg, #8b5cf6, #ec4899)',
            'linear-gradient(135deg, #10b981, #059669)',
            'linear-gradient(135deg, #f59e0b, #d97706)',
            'linear-gradient(135deg, #06b6d4, #3b82f6)'
        ];

        studentList.forEach((s, idx) => {
            const initials = s.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
            const gradient = avatarGradients[idx % avatarGradients.length];
            const statusClass = (s.status || 'Active').toLowerCase().replace(' ', '-');

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <span class="id-tag">${s.id}</span>
                </td>
                <td>
                    <div class="user-identity-cell">
                        <div class="user-avatar-circle" style="background: ${gradient};">${initials}</div>
                        <div class="user-identity-info">
                            <span class="user-identity-name">${s.name}</span>
                            <span class="user-identity-email">${s.email}</span>
                        </div>
                    </div>
                </td>
                <td>
                    <div class="contact-cell">
                        <i class="fas fa-phone"></i>
                        <span>${s.phone || 'N/A'}</span>
                    </div>
                </td>
                <td>
                    <div style="display: flex; flex-direction: column; gap: 4px; align-items: flex-start;">
                        <span class="tag-course"><i class="fas fa-graduation-cap"></i> ${s.course}</span>
                        <span class="tag-year">${s.year || '1st Year'}</span>
                    </div>
                </td>
                <td>
                    <span class="status-badge ${statusClass}">
                        ${s.status}
                    </span>
                </td>
                <td style="text-align: right;">
                    <div class="action-buttons" style="justify-content: flex-end;">
                        <button class="btn-action btn-view" data-id="${s.id}" title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-action btn-edit" data-id="${s.id}" title="Edit Student">
                            <i class="fas fa-pencil-alt"></i>
                        </button>
                        <button class="btn-action btn-delete" data-id="${s.id}" title="Delete Student">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });

        // Attach action handlers
        tbody.querySelectorAll('.btn-view').forEach(btn => {
            btn.addEventListener('click', () => viewStudent(btn.getAttribute('data-id')));
        });
        tbody.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', () => editStudent(btn.getAttribute('data-id')));
        });
        tbody.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', () => showDeleteModal(btn.getAttribute('data-id')));
        });
    }

    function setupStudentSectionEvents() {
        const searchInput = document.getElementById('student-search');
        const filterCourse = document.getElementById('filterCourse');
        const filterStatus = document.getElementById('filterStatus');
        const resetBtn = document.getElementById('resetFiltersBtn');
        const addBtn = document.getElementById('addStudentBtn');
        const exportBtn = document.getElementById('exportStudentsBtn');
        const formModal = document.getElementById('studentFormModal');
        const studentForm = document.getElementById('studentForm');

        if (searchInput) searchInput.addEventListener('input', filterStudents);
        if (filterCourse) filterCourse.addEventListener('change', filterStudents);
        if (filterStatus) filterStatus.addEventListener('change', filterStudents);

        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                if (searchInput) searchInput.value = '';
                if (filterCourse) filterCourse.value = '';
                if (filterStatus) filterStatus.value = '';
                filterStudents();
            });
        }

        if (exportBtn) {
            exportBtn.addEventListener('click', exportStudentsToCSV);
        }

        // Add Student Click
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                studentForm.reset();
                studentForm.dataset.mode = 'add';
                delete studentForm.dataset.editId;
                document.getElementById('modalTitle').innerHTML = '<i class="fas fa-user-plus"></i> Add New Student';
                document.getElementById('saveStudentBtn').innerHTML = '<i class="fas fa-check"></i> Add Student';
                formModal.classList.add('active');
            });
        }

        // Close Form Modal Handlers
        const closeFormBtn = document.getElementById('closeFormModalBtn');
        const cancelFormBtn = document.getElementById('cancelFormModalBtn');
        if (closeFormBtn) closeFormBtn.addEventListener('click', () => formModal.classList.remove('active'));
        if (cancelFormBtn) cancelFormBtn.addEventListener('click', () => formModal.classList.remove('active'));

        // Form Submit
        if (studentForm) {
            studentForm.addEventListener('submit', handleStudentFormSubmit);
        }

        // View Modal Close Handlers
        const viewModal = document.getElementById('viewStudentModal');
        const closeViewBtn = document.getElementById('closeViewModalBtn');
        const closeViewBtnFooter = document.getElementById('closeViewModalBtnFooter');
        if (closeViewBtn) closeViewBtn.addEventListener('click', () => viewModal.classList.remove('active'));
        if (closeViewBtnFooter) closeViewBtnFooter.addEventListener('click', () => viewModal.classList.remove('active'));

        // Delete Modal Handlers
        const deleteModal = document.getElementById('deleteConfirmModal');
        const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
        const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
        if (cancelDeleteBtn) cancelDeleteBtn.addEventListener('click', () => deleteModal.classList.remove('active'));
        if (confirmDeleteBtn) confirmDeleteBtn.addEventListener('click', handleConfirmDelete);
    }

    function filterStudents() {
        const searchVal = (document.getElementById('student-search')?.value || '').toLowerCase().trim();
        const courseVal = document.getElementById('filterCourse')?.value || '';
        const statusVal = document.getElementById('filterStatus')?.value || '';

        const filtered = students.filter(s => {
            const matchesSearch = !searchVal || 
                s.name.toLowerCase().includes(searchVal) ||
                s.id.toLowerCase().includes(searchVal) ||
                s.email.toLowerCase().includes(searchVal);

            const matchesCourse = !courseVal || s.course === courseVal;
            const matchesStatus = !statusVal || s.status === statusVal;

            return matchesSearch && matchesCourse && matchesStatus;
        });

        renderStudentsTable(filtered);
    }

    function handleStudentFormSubmit(e) {
        e.preventDefault();
        const form = document.getElementById('studentForm');
        const mode = form.dataset.mode;
        const studentId = form.dataset.editId;

        const newStudentData = {
            name: document.getElementById('formStudentName').value.trim(),
            email: document.getElementById('formStudentEmail').value.trim(),
            phone: document.getElementById('formStudentPhone').value.trim(),
            course: document.getElementById('formStudentCourse').value,
            year: document.getElementById('formStudentYear').value,
            status: document.getElementById('formStudentStatus').value,
            feeStatus: document.getElementById('formStudentFee').value
        };

        if (mode === 'add') {
            const nextNumber = (students.length + 1).toString().padStart(3, '0');
            newStudentData.id = `S${nextNumber}`;
            newStudentData.cgpa = '3.50';
            students.unshift(newStudentData);
            showNotification(`Student ${newStudentData.name} enrolled with ID ${newStudentData.id}!`, 'success');
        } else if (mode === 'edit' && studentId) {
            const idx = students.findIndex(s => s.id === studentId);
            if (idx !== -1) {
                students[idx] = Object.assign({}, students[idx], newStudentData);
                showNotification(`Student ${students[idx].name} updated successfully!`, 'success');
            }
        }

        saveStudents();
        document.getElementById('studentFormModal').classList.remove('active');
        loadStudentsSection();
    }

    function editStudent(id) {
        const s = students.find(item => item.id === id);
        if (!s) return;

        const form = document.getElementById('studentForm');
        form.dataset.mode = 'edit';
        form.dataset.editId = id;

        document.getElementById('formStudentName').value = s.name;
        document.getElementById('formStudentEmail').value = s.email;
        document.getElementById('formStudentPhone').value = s.phone || '';
        document.getElementById('formStudentCourse').value = s.course;
        document.getElementById('formStudentYear').value = s.year;
        document.getElementById('formStudentStatus').value = s.status || 'Active';
        document.getElementById('formStudentFee').value = s.feeStatus || 'Paid';

        document.getElementById('modalTitle').innerHTML = `<i class="fas fa-user-edit"></i> Edit Student: ${s.id}`;
        document.getElementById('saveStudentBtn').innerHTML = '<i class="fas fa-save"></i> Save Changes';

        document.getElementById('studentFormModal').classList.add('active');
    }

    function viewStudent(id) {
        const s = students.find(item => item.id === id);
        if (!s) return;

        const modalBody = document.getElementById('viewStudentModalBody');
        const initials = s.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

        modalBody.innerHTML = `
            <div class="view-profile-hero">
                <div class="view-profile-avatar">${initials}</div>
                <div class="view-profile-title">
                    <h4>${s.name}</h4>
                    <span class="id-tag">${s.id}</span> • 
                    <span class="status-badge ${s.status.toLowerCase()}">${s.status}</span>
                </div>
            </div>
            <div class="view-details-grid">
                <div class="detail-tile">
                    <div class="detail-tile-label">Academic Department</div>
                    <div class="detail-tile-val">${s.course}</div>
                </div>
                <div class="detail-tile">
                    <div class="detail-tile-label">Academic Year</div>
                    <div class="detail-tile-val">${s.year || '3rd Year'}</div>
                </div>
                <div class="detail-tile">
                    <div class="detail-tile-label">Email Address</div>
                    <div class="detail-tile-val">${s.email}</div>
                </div>
                <div class="detail-tile">
                    <div class="detail-tile-label">Contact Phone</div>
                    <div class="detail-tile-val">${s.phone || 'N/A'}</div>
                </div>
                <div class="detail-tile">
                    <div class="detail-tile-label">Cumulative GPA</div>
                    <div class="detail-tile-val">${s.cgpa || '3.75'} / 4.00</div>
                </div>
                <div class="detail-tile">
                    <div class="detail-tile-label">Tuition Fee Status</div>
                    <div class="detail-tile-val">${s.feeStatus === 'Paid' ? '<span style="color:#059669; font-weight:700;"><i class="fas fa-check-circle"></i> Paid in Full</span>' : '<span style="color:#d97706; font-weight:700;"><i class="fas fa-clock"></i> Payment Pending</span>'}</div>
                </div>
            </div>
        `;

        document.getElementById('viewStudentModal').classList.add('active');
    }

    function showDeleteModal(id) {
        const s = students.find(item => item.id === id);
        if (!s) return;

        document.getElementById('deleteTargetName').textContent = s.name;
        document.getElementById('deleteTargetId').textContent = s.id;
        document.getElementById('deleteConfirmModal').dataset.deleteId = id;
        document.getElementById('deleteConfirmModal').classList.add('active');
    }

    function handleConfirmDelete() {
        const modal = document.getElementById('deleteConfirmModal');
        const id = modal.dataset.deleteId;
        const idx = students.findIndex(s => s.id === id);

        if (idx !== -1) {
            const removed = students.splice(idx, 1)[0];
            saveStudents();
            showNotification(`Student ${removed.name} (${removed.id}) deleted.`, 'warning');
            modal.classList.remove('active');
            loadStudentsSection();
        }
    }

    function exportStudentsToCSV() {
        if (!students || students.length === 0) {
            showNotification('No student records to export.', 'warning');
            return;
        }

        const headers = ['ID', 'Name', 'Email', 'Phone', 'Course', 'Year', 'Status', 'FeeStatus', 'CGPA'];
        const csvRows = [headers.join(',')];

        students.forEach(s => {
            const row = [
                s.id,
                `"${s.name}"`,
                `"${s.email}"`,
                `"${s.phone || ''}"`,
                `"${s.course}"`,
                `"${s.year}"`,
                s.status,
                s.feeStatus || 'Paid',
                s.cgpa || '3.50'
            ];
            csvRows.push(row.join(','));
        });

        const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvRows.join('\n'));
        const link = document.createElement('a');
        link.setAttribute('href', csvContent);
        link.setAttribute('download', `mit_students_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showNotification('Student records exported to CSV successfully!', 'success');
    }

    // Expose helpers globally for other modules
    window.switchAdminSection = switchSection;
    window.showAdminNotification = showNotification;
});

// Standalone Toast Notification
function showNotification(msg, type = 'info') {
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
    let title = 'System Alert';
    if (type === 'success') { icon = 'check-circle'; title = 'Success'; }
    if (type === 'error') { icon = 'exclamation-circle'; title = 'Error'; }
    if (type === 'warning') { icon = 'exclamation-triangle'; title = 'Notice'; }

    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas fa-${icon}"></i>
        </div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${msg}</div>
        </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'toastSlideOut 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3200);
}
