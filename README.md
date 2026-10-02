# 🎓 MIT College Management System

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Font Awesome](https://img.shields.io/badge/Font_Awesome-528DD7?logo=fontawesome&logoColor=white)](https://fontawesome.com/)

A modern, responsive, and feature-rich **College Management System** built with Vanilla HTML5, CSS3, and JavaScript. The system delivers a role-based experience tailored for **Administrators**, **Faculty Members**, and **Students**, featuring a modern institutional design system, glassmorphic modals, and interactive data management.

---

## ✨ Features Overview

### 🔐 Authentication & Onboarding
- **Role-Based Login**: Seamless switching between Administrator, Faculty, and Student accounts.
- **One-Click Demo Credentials**: Clickable credential chips that instantly autofill user credentials for testing.
- **Password Visibility Toggle**: Interactive show/hide toggle.
- **Toast Notification Engine**: Animated floating notifications for success, error, and warning events.

---

### 👑 Administrator Dashboard (`/admin`)
- **Key Metrics & Statistics**: Real-time counter cards with visual indicators for Total Students, Faculty Members, Active Courses, and Fee Collections.
- **Student Information System (SIS)**:
  - Responsive card-table container with zebra striping and divider styling.
  - Dynamic avatar initials circles with color gradients.
  - Monospace ID chips (`S001`, `S002`, etc.) and departmental tags.
  - Glowing status pills (`Active`, `Inactive`, `Graduated`).
  - **Live Search & Multi-Filters**: Instant debounced search combined with department and status dropdown filters.
  - **Export to CSV**: 1-click export of student records into standard CSV format.
  - **Interactive Modals**: Add/Edit student form, comprehensive profile dossier modal, and confirmation delete dialogue.
- **Faculty Directory**: Complete roster management with salary formatting, departmental badges, and dossier inspection.
- **Activity Feed & Event Calendar**: Timeline feed for recent campus activities and upcoming academic council dates.
- **Quick Keyboard Shortcut**: Press `/` anywhere to focus the search bar.

---

### 👨‍🏫 Faculty Portal (`/faculty`)
- **Academic Dashboard**: Personalized welcome banner with instructor ID and quick overview metrics.
- **Course Management**: Enrolled student count, credit hours, lecture timings, and quick-action buttons.
- **Digital Attendance Tracker**: Interactive roster allowing professors to toggle student statuses (**Present**, **Absent**, **Late**) and submit attendance records.
- **Weekly Lecture Schedule**: Timetable detailing lecture halls, laboratory sessions, and batches.
- **Department Notices Board**: Priority-tagged announcements and deadlines.

---

### 🎓 Student Portal (`/student`)
- **Academic Standing Overview**: Real-time summary displaying current term, cumulative GPA meter, and attendance rate.
- **Class Timetable**: Schedule with status indicators (**Completed**, **Ongoing**, **Upcoming**).
- **Student Dossier & Profile**: Detailed personal records, roll numbers, and academic achievements.
- **Enrolled Courses**: Course curriculum cards with direct syllabus download actions.
- **Official Transcript**: Semester-wise letter grades (A+, A, A-) and SGPA calculations.
- **Fee Statements**: Verified tuition fee invoices with downloadable receipts.

---

## 🔑 Demo Credentials

| Role | Username | Password | Default Name |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin` | `admin123` | System Administrator |
| **Faculty** | `faculty` | `faculty123` | Prof. Akash Verma |
| **Student** | `student` | `student123` | Atharva Chothe |

*(Tip: On the login page, simply click any demo chip to automatically fill credentials and select the matching role!)*

---

## 📂 Project Directory Structure

```text
College_Management_System/
├── index.html              # Main campus login portal
├── style.css               # Core global design system & tokens
├── auth.js                 # Authentication, session & toast alerts
├── database.php            # Optional MySQL backend connector
├── get_user.php            # Optional user fetch endpoint
├── .gitignore              # Git ignore rules
├── LICENSE                 # MIT License
├── README.md               # Project documentation
│
├── admin/                  # Administrator Module
│   ├── dashboard.html      # Admin dashboard view
│   ├── admin.css           # Admin & table styles
│   ├── admin.js            # Admin controller & student CRUD
│   └── faculty.js          # Admin faculty directory module
│
├── faculty/                # Faculty Member Module
│   ├── dashboard.html      # Faculty dashboard view
│   ├── faculty.css         # Faculty portal styling
│   └── faculty.js          # Faculty courses & attendance logic
│
└── student/                # Student Portal Module
    ├── dashboard.html      # Student dashboard view
    ├── student.css         # Student portal styling
    └── student.js          # Student profile, results & fee logic
```

---

## 🚀 Getting Started

### Option 1: Direct Browser Launch (Recommended / Zero Dependencies)
No backend server installation required! The application uses local session storage and fallback mock databases out of the box.

1. Clone or download this repository.
2. Open [`index.html`](index.html) directly in any web browser (Chrome, Edge, Firefox, Safari).
3. Click any of the **Demo Credentials** chips to log in!

### Option 2: Live Server in VS Code
1. Open the project folder in **Visual Studio Code**.
2. Install the **Live Server** extension.
3. Right-click on `index.html` and select **"Open with Live Server"**.

### Option 3: Local Development Server
Run with Node.js:
```bash
# Using npx serve
npx serve -l 3000 .
```
Or with Python:
```bash
python -m http.server 3000
```
Then navigate to `http://localhost:3000` in your browser.

---

## 🎨 Design System & Technologies

- **Design System**: Built on vanilla CSS3 custom properties (`--primary: #4f46e5`, `--secondary: #0ea5e9`, etc.).
- **Typography**: [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) & [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) from Google Fonts.
- **Icons**: FontAwesome 6.4.0.
- **Glassmorphism**: Backdrop blur filters (`backdrop-filter: blur(...)`) and translucent rgba surfaces.
- **Animations**: CSS keyframe transitions for modal popups, toast slides, and hover micro-interactions.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
