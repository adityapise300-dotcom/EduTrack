/**
 * config.js
 * Global application constants. Adjust API_BASE to point at your real
 * backend when it's ready — everything else in this codebase reads from
 * window.APP_CONFIG rather than hard-coding values.
 */
window.APP_CONFIG = {
  APP_NAME: 'EduTrack',
  APP_TAGLINE: 'Multi-School Management Portal',
  API_BASE: 'https://api.edutrack.example.com/api',

  // When true, api.js and the service layer serve data from mock-data.js
  // instead of calling fetch(). Flip to false once a real backend exists.
  USE_MOCK_BACKEND: true,

  // Simulated network latency (ms) for the mock backend, so loading states
  // are visible during development.
  MOCK_LATENCY: 350,

  TOKEN_STORAGE_KEY: 'edutrack.token',
  USER_STORAGE_KEY: 'edutrack.user',
  SCHOOL_STORAGE_KEY: 'edutrack.school',

  ROLES: ['student', 'teacher', 'parent', 'admin', 'accountant', 'transport', 'librarian'],

  ROLE_HOME: {
    student: '/student/dashboard.html',
    teacher: '/teacher/dashboard.html',
    parent: '/parent/dashboard.html',
    admin: '/admin/dashboard.html',
    accountant: '/accountant/dashboard.html',
    transport: '/transport/dashboard.html',
    librarian: '/librarian/dashboard.html',
  },

  ROLE_LABELS: {
    student: 'Student',
    teacher: 'Teacher',
    parent: 'Parent / Guardian',
    admin: 'Administrator',
    accountant: 'Accountant',
    transport: 'Transport Staff',
    librarian: 'Librarian',
  },
};
