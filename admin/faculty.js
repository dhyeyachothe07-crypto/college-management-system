/**
 * MIT College Management System - Admin Faculty Management Module
 */

(function() {
    let faculty = initializeFacultyData();

    function initializeFacultyData() {
        const defaultFaculty = [
            { 
                id: 'F001', 
                name: 'Dr. Sarah Johnson', 
                email: 'sarah.johnson@college.edu', 
                phone: '(555) 021-9821',
                department: 'Computer Science',
                designation: 'Professor & Dean',
                qualification: 'Ph.D. in Computer Science (MIT)',
                experience: '14 Years',
                salary: 98000,
                status: 'Active'
            },
            { 
                id: 'F002', 
                name: 'Prof. Michael Brown', 
                email: 'michael.brown@college.edu', 
                phone: '(555) 022-7741',
                department: 'Mathematics',
                designation: 'Associate Professor',
                qualification: 'Ph.D. in Applied Mathematics',
                experience: '9 Years',
                salary: 82000,
                status: 'Active'
            },
            { 
                id: 'F003', 
                name: 'Dr. Emily Carter', 
                email: 'emily.carter@college.edu', 
                phone: '(555) 024-5512',
                department: 'Physics',
                designation: 'Assistant Professor',
                qualification: 'Ph.D. in Quantum Mechanics',
                experience: '6 Years',
                salary: 76000,
                status: 'Active'
            },
            { 
                id: 'F004', 
                name: 'Prof. Robert Taylor', 
                email: 'robert.taylor@college.edu', 
                phone: '(555) 029-3388',
                department: 'Chemistry',
                designation: 'Senior Lecturer',
                qualification: 'M.Sc. in Organic Chemistry',
                experience: '11 Years',
                salary: 71000,
                status: 'On Leave'
            }
        ];

        const saved = localStorage.getItem('mit_faculty');
        if (saved) {
            try { return JSON.parse(saved); } catch (e) {}
        }
        localStorage.setItem('mit_faculty', JSON.stringify(defaultFaculty));
        return defaultFaculty;
    }

    function saveFaculty() {
        localStorage.setItem('mit_faculty', JSON.stringify(faculty));
        updateFacultyGlobalStats();
    }

    function updateFacultyGlobalStats() {
        const totalFacultyEl = document.getElementById('total-faculty');
        const sidebarFacultyCount = document.getElementById('sidebar-faculty-count');
        if (totalFacultyEl) totalFacultyEl.textContent = faculty.length;
        if (sidebarFacultyCount) sidebarFacultyCount.textContent = faculty.length;
    }

    // Expose loader to window for admin.js navigation
    window.loadFacultySection = function() {
        const section = document.getElementById('faculty');
        if (!section) return;

        const activeCount = faculty.filter(f => f.status === 'Active').length;
        const onLeaveCount = faculty.filter(f => f.status === 'On Leave').length;

        section.innerHTML = `
            <div class="section-header">
                <div class="section-header-title">
                    <div class="section-icon-badge" style="background: linear-gradient(135deg, #10b981, #0ea5e9);">
                        <i class="fas fa-chalkboard-teacher"></i>
                    </div>
                    <div>
                        <h2>Faculty Management</h2>
                        <div class="section-subtitle">Oversee academic staff, departmental assignments, and faculty records</div>
                    </div>
                </div>
                <div class="section-actions">
                    <button class="btn-export" id="exportFacultyBtn" title="Export Faculty to CSV">
                        <i class="fas fa-file-csv"></i> Export CSV
                    </button>
                    <button class="btn-add" id="addFacultyBtn" style="background: linear-gradient(135deg, #4f46e5, #4338ca);">
                        <i class="fas fa-plus"></i> Add New Faculty
                    </button>
                </div>
            </div>

            <!-- Toolbar & Filter Controls -->
            <div class="section-header" style="margin-bottom: 16px;">
                <div class="table-search-box">
                    <i class="fas fa-search"></i>
                    <input type="text" id="faculty-search" placeholder="Search by name, department, or ID...">
                </div>
                <div class="section-actions">
                    <select class="table-filter-select" id="filterFacultyDept">
                        <option value="">All Departments</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="Mathematics">Mathematics</option>
                        <option value="Physics">Physics</option>
                        <option value="Chemistry">Chemistry</option>
                        <option value="Engineering">Engineering</option>
                    </select>
                    <select class="table-filter-select" id="filterFacultyStatus">
                        <option value="">All Statuses</option>
                        <option value="Active">Active</option>
                        <option value="On Leave">On Leave</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>
            </div>

            <!-- Summary Bar -->
            <div class="table-summary-bar">
                <div class="summary-pill">Total Faculty: <strong>${faculty.length}</strong></div>
                <div class="summary-pill active-pill">Active Staff: <strong>${activeCount}</strong></div>
                <div class="summary-pill">On Leave: <strong>${onLeaveCount}</strong></div>
            </div>

            <!-- Data Table Card Container -->
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Faculty ID</th>
                            <th>Staff Member</th>
                            <th>Department & Role</th>
                            <th>Contact Phone</th>
                            <th>Annual Salary</th>
                            <th>Status</th>
                            <th style="text-align: right;">Actions</th>
                        </tr>
                    </thead>
                    <tbody id="facultyTableBody">
                        <!-- Populated by renderFacultyTable -->
                    </tbody>
                </table>
                <div id="facultyEmptyState" class="table-empty-state" style="display: none;">
                    <div class="empty-icon"><i class="fas fa-search"></i></div>
                    <h3>No faculty members found</h3>
                    <p>Try searching with another keyword or resetting department filters.</p>
                    <button class="btn-reset-filters" id="resetFacultyFiltersBtn">Reset Filters</button>
                </div>
                <div class="table-footer">
                    <span id="facultyRecordsCount">Showing ${faculty.length} of ${faculty.length} faculty</span>
                    <span>MIT Academic Directory • Verified</span>
                </div>
            </div>

            <!-- Add / Edit Faculty Modal -->
            <div class="modal-backdrop" id="facultyFormModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 id="facultyModalTitle"><i class="fas fa-user-plus"></i> Add New Faculty</h3>
                        <button class="modal-close" id="closeFacultyFormModalBtn">&times;</button>
                    </div>
                    <form id="facultyForm">
                        <div class="modal-body">
                            <div class="form-group">
                                <label for="formFacultyName">Full Name & Title *</label>
                                <input type="text" id="formFacultyName" required placeholder="e.g. Dr. Alan Turing">
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label for="formFacultyEmail">Email Address *</label>
                                    <input type="email" id="formFacultyEmail" required placeholder="faculty@college.edu">
                                </div>
                                <div class="form-group">
                                    <label for="formFacultyPhone">Phone Number *</label>
                                    <input type="tel" id="formFacultyPhone" required placeholder="(555) 012-3456">
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label for="formFacultyDept">Department *</label>
                                    <select id="formFacultyDept" required>
                                        <option value="">Select Department</option>
                                        <option value="Computer Science">Computer Science</option>
                                        <option value="Mathematics">Mathematics</option>
                                        <option value="Physics">Physics</option>
                                        <option value="Chemistry">Chemistry</option>
                                        <option value="Engineering">Engineering</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="formFacultyRole">Academic Designation *</label>
                                    <select id="formFacultyRole" required>
                                        <option value="">Select Role</option>
                                        <option value="Professor & Dean">Professor & Dean</option>
                                        <option value="Professor">Professor</option>
                                        <option value="Associate Professor">Associate Professor</option>
                                        <option value="Assistant Professor">Assistant Professor</option>
                                        <option value="Senior Lecturer">Senior Lecturer</option>
                                    </select>
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label for="formFacultyQualification">Highest Qualification</label>
                                    <input type="text" id="formFacultyQualification" placeholder="e.g. Ph.D. in Computer Science">
                                </div>
                                <div class="form-group">
                                    <label for="formFacultyExperience">Experience</label>
                                    <input type="text" id="formFacultyExperience" placeholder="e.g. 8 Years">
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label for="formFacultySalary">Annual Salary ($)</label>
                                    <input type="number" id="formFacultySalary" required min="30000" step="1000" placeholder="e.g. 85000">
                                </div>
                                <div class="form-group">
                                    <label for="formFacultyStatus">Employment Status</label>
                                    <select id="formFacultyStatus">
                                        <option value="Active">Active</option>
                                        <option value="On Leave">On Leave</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn-cancel" id="cancelFacultyFormModalBtn">Cancel</button>
                            <button type="submit" class="btn-submit" id="saveFacultyBtn">
                                <i class="fas fa-check"></i> Save Faculty
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- View Faculty Details Modal -->
            <div class="modal-backdrop" id="viewFacultyModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3><i class="fas fa-id-card"></i> Faculty Staff Dossier</h3>
                        <button class="modal-close" id="closeViewFacultyModalBtn">&times;</button>
                    </div>
                    <div class="modal-body" id="viewFacultyModalBody">
                        <!-- Populated by viewFaculty -->
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn-cancel" id="closeViewFacultyModalBtnFooter">Close</button>
                    </div>
                </div>
            </div>

            <!-- Delete Faculty Confirmation Modal -->
            <div class="modal-backdrop" id="deleteFacultyConfirmModal">
                <div class="modal-content" style="max-width: 440px;">
                    <div class="modal-body delete-warning-box">
                        <div class="delete-warning-icon">
                            <i class="fas fa-user-times"></i>
                        </div>
                        <h3>Remove Faculty Staff?</h3>
                        <p style="color: #64748b; font-size: 0.9rem; margin-top: 6px;">
                            Removing this faculty member will unassign them from their associated courses and academic modules.
                        </p>
                        <div class="delete-target-info">
                            <p>Faculty: <strong id="deleteFacultyTargetName">...</strong></p>
                            <p>ID: <strong id="deleteFacultyTargetId">...</strong></p>
                        </div>
                    </div>
                    <div class="modal-footer" style="justify-content: center;">
                        <button type="button" class="btn-cancel" id="cancelDeleteFacultyBtn">Cancel</button>
                        <button type="button" class="btn-delete-confirm" id="confirmDeleteFacultyBtn">
                            <i class="fas fa-trash"></i> Delete Faculty
                        </button>
                    </div>
                </div>
            </div>
        `;

        renderFacultyTable(faculty);
        setupFacultyEvents();
    };

    function renderFacultyTable(facultyList) {
        const tbody = document.getElementById('facultyTableBody');
        const emptyState = document.getElementById('facultyEmptyState');
        const countDisplay = document.getElementById('facultyRecordsCount');
        if (!tbody) return;

        tbody.innerHTML = '';

        if (!facultyList || facultyList.length === 0) {
            if (emptyState) emptyState.style.display = 'block';
            if (countDisplay) countDisplay.textContent = 'Showing 0 faculty';
            return;
        }

        if (emptyState) emptyState.style.display = 'none';
        if (countDisplay) countDisplay.textContent = `Showing ${facultyList.length} of ${faculty.length} faculty`;

        const avatarGradients = [
            'linear-gradient(135deg, #10b981, #0ea5e9)',
            'linear-gradient(135deg, #6366f1, #a855f7)',
            'linear-gradient(135deg, #f59e0b, #ec4899)',
            'linear-gradient(135deg, #3b82f6, #1d4ed8)'
        ];

        facultyList.forEach((f, idx) => {
            const initials = f.name.replace('Dr. ', '').replace('Prof. ', '').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
            const gradient = avatarGradients[idx % avatarGradients.length];
            const statusClass = (f.status || 'Active').toLowerCase().replace(' ', '-');
            const formattedSalary = f.salary ? `$${Number(f.salary).toLocaleString()}` : '$75,000';

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <span class="id-tag">${f.id}</span>
                </td>
                <td>
                    <div class="user-identity-cell">
                        <div class="user-avatar-circle" style="background: ${gradient};">${initials}</div>
                        <div class="user-identity-info">
                            <span class="user-identity-name">${f.name}</span>
                            <span class="user-identity-email">${f.email}</span>
                        </div>
                    </div>
                </td>
                <td>
                    <div style="display: flex; flex-direction: column; gap: 4px; align-items: flex-start;">
                        <span class="tag-course" style="background: #e0f2fe; color: #0284c7;">
                            <i class="fas fa-building"></i> ${f.department}
                        </span>
                        <span class="tag-year">${f.designation}</span>
                    </div>
                </td>
                <td>
                    <div class="contact-cell">
                        <i class="fas fa-phone"></i>
                        <span>${f.phone || 'N/A'}</span>
                    </div>
                </td>
                <td>
                    <span style="font-family: 'JetBrains Mono', monospace; font-weight: 700; color: #0f172a;">
                        ${formattedSalary}
                    </span>
                </td>
                <td>
                    <span class="status-badge ${statusClass}">
                        ${f.status}
                    </span>
                </td>
                <td style="text-align: right;">
                    <div class="action-buttons" style="justify-content: flex-end;">
                        <button class="btn-action btn-view" data-id="${f.id}" title="View Dossier">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-action btn-edit" data-id="${f.id}" title="Edit Faculty">
                            <i class="fas fa-pencil-alt"></i>
                        </button>
                        <button class="btn-action btn-delete" data-id="${f.id}" title="Delete Faculty">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });

        // Event hooks
        tbody.querySelectorAll('.btn-view').forEach(btn => {
            btn.addEventListener('click', () => viewFaculty(btn.getAttribute('data-id')));
        });
        tbody.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', () => editFaculty(btn.getAttribute('data-id')));
        });
        tbody.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', () => showDeleteFacultyModal(btn.getAttribute('data-id')));
        });
    }

    function setupFacultyEvents() {
        const searchInput = document.getElementById('faculty-search');
        const filterDept = document.getElementById('filterFacultyDept');
        const filterStatus = document.getElementById('filterFacultyStatus');
        const resetBtn = document.getElementById('resetFacultyFiltersBtn');
        const addBtn = document.getElementById('addFacultyBtn');
        const exportBtn = document.getElementById('exportFacultyBtn');
        const formModal = document.getElementById('facultyFormModal');
        const facultyForm = document.getElementById('facultyForm');

        if (searchInput) searchInput.addEventListener('input', filterFaculty);
        if (filterDept) filterDept.addEventListener('change', filterFaculty);
        if (filterStatus) filterStatus.addEventListener('change', filterFaculty);

        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                if (searchInput) searchInput.value = '';
                if (filterDept) filterDept.value = '';
                if (filterStatus) filterStatus.value = '';
                filterFaculty();
            });
        }

        if (exportBtn) {
            exportBtn.addEventListener('click', exportFacultyToCSV);
        }

        if (addBtn) {
            addBtn.addEventListener('click', () => {
                facultyForm.reset();
                facultyForm.dataset.mode = 'add';
                delete facultyForm.dataset.editId;
                document.getElementById('facultyModalTitle').innerHTML = '<i class="fas fa-user-plus"></i> Add New Faculty';
                document.getElementById('saveFacultyBtn').innerHTML = '<i class="fas fa-check"></i> Add Faculty';
                formModal.classList.add('active');
            });
        }

        const closeFormBtn = document.getElementById('closeFacultyFormModalBtn');
        const cancelFormBtn = document.getElementById('cancelFacultyFormModalBtn');
        if (closeFormBtn) closeFormBtn.addEventListener('click', () => formModal.classList.remove('active'));
        if (cancelFormBtn) cancelFormBtn.addEventListener('click', () => formModal.classList.remove('active'));

        if (facultyForm) {
            facultyForm.addEventListener('submit', handleFacultyFormSubmit);
        }

        const viewModal = document.getElementById('viewFacultyModal');
        const closeViewBtn = document.getElementById('closeViewFacultyModalBtn');
        const closeViewBtnFooter = document.getElementById('closeViewFacultyModalBtnFooter');
        if (closeViewBtn) closeViewBtn.addEventListener('click', () => viewModal.classList.remove('active'));
        if (closeViewBtnFooter) closeViewBtnFooter.addEventListener('click', () => viewModal.classList.remove('active'));

        const deleteModal = document.getElementById('deleteFacultyConfirmModal');
        const cancelDeleteBtn = document.getElementById('cancelDeleteFacultyBtn');
        const confirmDeleteBtn = document.getElementById('confirmDeleteFacultyBtn');
        if (cancelDeleteBtn) cancelDeleteBtn.addEventListener('click', () => deleteModal.classList.remove('active'));
        if (confirmDeleteBtn) confirmDeleteBtn.addEventListener('click', handleConfirmDeleteFaculty);
    }

    function filterFaculty() {
        const searchVal = (document.getElementById('faculty-search')?.value || '').toLowerCase().trim();
        const deptVal = document.getElementById('filterFacultyDept')?.value || '';
        const statusVal = document.getElementById('filterFacultyStatus')?.value || '';

        const filtered = faculty.filter(f => {
            const matchesSearch = !searchVal || 
                f.name.toLowerCase().includes(searchVal) ||
                f.id.toLowerCase().includes(searchVal) ||
                f.department.toLowerCase().includes(searchVal);

            const matchesDept = !deptVal || f.department === deptVal;
            const matchesStatus = !statusVal || f.status === statusVal;

            return matchesSearch && matchesDept && matchesStatus;
        });

        renderFacultyTable(filtered);
    }

    function handleFacultyFormSubmit(e) {
        e.preventDefault();
        const form = document.getElementById('facultyForm');
        const mode = form.dataset.mode;
        const facultyId = form.dataset.editId;

        const newFacultyData = {
            name: document.getElementById('formFacultyName').value.trim(),
            email: document.getElementById('formFacultyEmail').value.trim(),
            phone: document.getElementById('formFacultyPhone').value.trim(),
            department: document.getElementById('formFacultyDept').value,
            designation: document.getElementById('formFacultyRole').value,
            qualification: document.getElementById('formFacultyQualification').value.trim() || 'Ph.D. / Master degree',
            experience: document.getElementById('formFacultyExperience').value.trim() || '5+ Years',
            salary: Number(document.getElementById('formFacultySalary').value) || 75000,
            status: document.getElementById('formFacultyStatus').value
        };

        if (mode === 'add') {
            const nextNumber = (faculty.length + 1).toString().padStart(3, '0');
            newFacultyData.id = `F${nextNumber}`;
            faculty.unshift(newFacultyData);
            if (typeof window.showAdminNotification === 'function') {
                window.showAdminNotification(`Faculty member ${newFacultyData.name} registered as ${newFacultyData.id}!`, 'success');
            }
        } else if (mode === 'edit' && facultyId) {
            const idx = faculty.findIndex(f => f.id === facultyId);
            if (idx !== -1) {
                faculty[idx] = Object.assign({}, faculty[idx], newFacultyData);
                if (typeof window.showAdminNotification === 'function') {
                    window.showAdminNotification(`Faculty ${faculty[idx].name} updated successfully!`, 'success');
                }
            }
        }

        saveFaculty();
        document.getElementById('facultyFormModal').classList.remove('active');
        window.loadFacultySection();
    }

    function editFaculty(id) {
        const f = faculty.find(item => item.id === id);
        if (!f) return;

        const form = document.getElementById('facultyForm');
        form.dataset.mode = 'edit';
        form.dataset.editId = id;

        document.getElementById('formFacultyName').value = f.name;
        document.getElementById('formFacultyEmail').value = f.email;
        document.getElementById('formFacultyPhone').value = f.phone || '';
        document.getElementById('formFacultyDept').value = f.department;
        document.getElementById('formFacultyRole').value = f.designation;
        document.getElementById('formFacultyQualification').value = f.qualification || '';
        document.getElementById('formFacultyExperience').value = f.experience || '';
        document.getElementById('formFacultySalary').value = f.salary || 75000;
        document.getElementById('formFacultyStatus').value = f.status || 'Active';

        document.getElementById('facultyModalTitle').innerHTML = `<i class="fas fa-edit"></i> Edit Faculty: ${f.id}`;
        document.getElementById('saveFacultyBtn').innerHTML = '<i class="fas fa-save"></i> Save Changes';

        document.getElementById('facultyFormModal').classList.add('active');
    }

    function viewFaculty(id) {
        const f = faculty.find(item => item.id === id);
        if (!f) return;

        const modalBody = document.getElementById('viewFacultyModalBody');
        const initials = f.name.replace('Dr. ', '').replace('Prof. ', '').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

        modalBody.innerHTML = `
            <div class="view-profile-hero">
                <div class="view-profile-avatar" style="background: linear-gradient(135deg, #10b981, #0ea5e9);">${initials}</div>
                <div class="view-profile-title">
                    <h4>${f.name}</h4>
                    <span class="id-tag">${f.id}</span> • 
                    <span class="status-badge ${f.status.toLowerCase().replace(' ', '-')}">${f.status}</span>
                </div>
            </div>
            <div class="view-details-grid">
                <div class="detail-tile">
                    <div class="detail-tile-label">Department</div>
                    <div class="detail-tile-val">${f.department}</div>
                </div>
                <div class="detail-tile">
                    <div class="detail-tile-label">Designation</div>
                    <div class="detail-tile-val">${f.designation}</div>
                </div>
                <div class="detail-tile">
                    <div class="detail-tile-label">Academic Qualification</div>
                    <div class="detail-tile-val">${f.qualification}</div>
                </div>
                <div class="detail-tile">
                    <div class="detail-tile-label">Teaching Experience</div>
                    <div class="detail-tile-val">${f.experience}</div>
                </div>
                <div class="detail-tile">
                    <div class="detail-tile-label">Official Email</div>
                    <div class="detail-tile-val">${f.email}</div>
                </div>
                <div class="detail-tile">
                    <div class="detail-tile-label">Annual Compensation</div>
                    <div class="detail-tile-val" style="font-family:'JetBrains Mono', monospace; font-weight:700;">$${Number(f.salary).toLocaleString()}</div>
                </div>
            </div>
        `;

        document.getElementById('viewFacultyModal').classList.add('active');
    }

    function showDeleteFacultyModal(id) {
        const f = faculty.find(item => item.id === id);
        if (!f) return;

        document.getElementById('deleteFacultyTargetName').textContent = f.name;
        document.getElementById('deleteFacultyTargetId').textContent = f.id;
        document.getElementById('deleteFacultyConfirmModal').dataset.deleteId = id;
        document.getElementById('deleteFacultyConfirmModal').classList.add('active');
    }

    function handleConfirmDeleteFaculty() {
        const modal = document.getElementById('deleteFacultyConfirmModal');
        const id = modal.dataset.deleteId;
        const idx = faculty.findIndex(f => f.id === id);

        if (idx !== -1) {
            const removed = faculty.splice(idx, 1)[0];
            saveFaculty();
            if (typeof window.showAdminNotification === 'function') {
                window.showAdminNotification(`Faculty ${removed.name} (${removed.id}) removed from roster.`, 'warning');
            }
            modal.classList.remove('active');
            window.loadFacultySection();
        }
    }

    function exportFacultyToCSV() {
        if (!faculty || faculty.length === 0) {
            if (typeof window.showAdminNotification === 'function') {
                window.showAdminNotification('No faculty records to export.', 'warning');
            }
            return;
        }

        const headers = ['ID', 'Name', 'Email', 'Phone', 'Department', 'Designation', 'Qualification', 'Experience', 'Salary', 'Status'];
        const csvRows = [headers.join(',')];

        faculty.forEach(f => {
            const row = [
                f.id,
                `"${f.name}"`,
                `"${f.email}"`,
                `"${f.phone || ''}"`,
                `"${f.department}"`,
                `"${f.designation}"`,
                `"${f.qualification}"`,
                `"${f.experience}"`,
                f.salary,
                f.status
            ];
            csvRows.push(row.join(','));
        });

        const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvRows.join('\n'));
        const link = document.createElement('a');
        link.setAttribute('href', csvContent);
        link.setAttribute('download', `mit_faculty_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        if (typeof window.showAdminNotification === 'function') {
            window.showAdminNotification('Faculty records exported to CSV successfully!', 'success');
        }
    }
})();