/**
 * api.js
 * Generic fetch wrapper used by every service in assets/js/services/.
 *
 * - Adds the Authorization header automatically when a token is present.
 * - Normalizes error handling (401 -> logout, 403 -> unauthorized, 5xx -> toast).
 * - When APP_CONFIG.USE_MOCK_BACKEND is true, requests are routed to the
 *   in-memory mock handlers below instead of hitting the network, so the
 *   whole app is click-through-able before a real backend exists.
 *   Swap USE_MOCK_BACKEND to false and point API_BASE at your server —
 *   every service file keeps working unchanged, since they only ever call
 *   fetchWithToken(path, options).
 */
(function () {
  function getToken() {
    return localStorage.getItem(window.APP_CONFIG.TOKEN_STORAGE_KEY);
  }

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function fetchWithToken(path, options) {
    options = options || {};

    if (window.APP_CONFIG.USE_MOCK_BACKEND) {
      return mockRequest(path, options);
    }

    const headers = Object.assign({ 'Content-Type': 'application/json' }, options.headers || {});
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;

    let response;
    try {
      response = await fetch(`${window.APP_CONFIG.API_BASE}${path}`, Object.assign({}, options, { headers }));
    } catch (networkErr) {
      Utils.toast('Network error — please check your connection.', 'error');
      throw networkErr;
    }

    if (response.status === 401) {
      window.Auth.logout();
      window.location.href = '/login.html';
      throw new Error('Unauthorized');
    }
    if (response.status === 403) {
      window.location.href = '/unauthorized.html';
      throw new Error('Forbidden');
    }
    if (!response.ok) {
      let message = `Request failed (${response.status})`;
      try {
        const body = await response.json();
        message = body.message || message;
      } catch (_) { /* ignore parse errors */ }
      Utils.toast(message, 'error');
      throw new Error(message);
    }
    if (response.status === 204) return null;
    return response.json();
  }

  // ---------------------------------------------------------------------
  // Mock backend — resolves against window.MockDB. Kept deliberately
  // simple: each route below is the exact shape a real REST endpoint
  // would return, so migrating later is a find-and-replace of API_BASE.
  // ---------------------------------------------------------------------
  async function mockRequest(path, options) {
    await delay(window.APP_CONFIG.MOCK_LATENCY);
    const db = window.MockDB;
    const method = (options.method || 'GET').toUpperCase();
    const body = options.body ? JSON.parse(options.body) : {};

    // ---- Auth ----
    if (path === '/auth/schools') {
      return db.SCHOOLS;
    }
    if (path === '/auth/login' && method === 'POST') {
      const user = db.USERS.find(
        (u) => u.schoolId === body.schoolId && (u.username === body.username || u.email === body.username)
      );
      if (!user || body.password !== db.DEMO_PASSWORD) {
        const err = new Error('Invalid credentials. Please check your school, username and password.');
        err.isApiError = true;
        throw err;
      }
      return {
        token: `mock-token-${user.id}-${Date.now()}`,
        user: {
          id: user.id, role: user.role, schoolId: user.schoolId, name: user.name,
          email: user.email, username: user.username, avatarColor: user.avatarColor,
        },
      };
    }
    if (path === '/auth/forgot-password' && method === 'POST') {
      return { message: 'If that account exists, a reset link has been sent.' };
    }
    if (path === '/auth/reset-password' && method === 'POST') {
      return { message: 'Password has been reset successfully.' };
    }

    // ---- Student ----
    if (path === '/student/attendance') return { summary: db.ATTENDANCE_SUMMARY, log: db.ATTENDANCE_LOG };
    if (path === '/student/results') return db.RESULTS;
    if (path === '/student/assignments') return db.ASSIGNMENTS;
    if (path === '/student/timetable') return db.TIMETABLE;
    if (path === '/student/fees') return db.FEES;

    // ---- Teacher ----
    if (path === '/teacher/classes-today') return db.TEACHER_CLASSES_TODAY;
    if (path === '/teacher/classes') return db.CLASSES;
    if (path === '/teacher/roster') return db.STUDENTS_FOR_ATTENDANCE;
    if (path === '/teacher/submissions') return db.SUBMISSIONS;
    if (path === '/teacher/schedule') return db.TIMETABLE;
    if (path === '/teacher/attendance' && method === 'POST') return { saved: true, count: (body.records || []).length };
    if (path === '/teacher/marks' && method === 'POST') return { saved: true };
    if (path === '/teacher/assignments' && method === 'POST') return { id: `a${Date.now()}`, ...body };

    // ---- Parent ----
    if (path === '/parent/children') return db.CHILDREN;
    if (path.startsWith('/parent/child-attendance')) return { summary: db.ATTENDANCE_SUMMARY, log: db.ATTENDANCE_LOG };
    if (path.startsWith('/parent/child-results')) return db.RESULTS;
    if (path.startsWith('/parent/child-assignments')) return db.ASSIGNMENTS;
    if (path.startsWith('/parent/child-fees')) return db.FEES;

    // ---- Admin ----
    if (path === '/admin/overview') return db.ADMIN_OVERVIEW;
    if (path === '/admin/students') return db.STUDENTS_DIRECTORY;
    if (path === '/admin/teachers') return db.TEACHERS_DIRECTORY;
    if (path === '/admin/classes') return db.CLASSES;
    if (path === '/admin/exams') return db.EXAMS;
    if (path === '/admin/fee-structure') return db.FEE_STRUCTURES;
    if (path === '/admin/timetable') return db.TIMETABLE;
    if (path === '/admin/notices') return db.NOTICES;
    if (path === '/admin/notices' && method === 'POST') return { id: `n${Date.now()}`, ...body };

    // ---- Accountant ----
    if (path === '/accountant/summary') {
      return { collectedToday: 186000, collectedThisMonth: db.ADMIN_OVERVIEW.feeCollectedThisMonth, pendingDues: 612000, defaultersCount: db.DEFAULTERS.length };
    }
    if (path === '/accountant/transactions') return db.TRANSACTIONS;
    if (path === '/accountant/defaulters') return db.DEFAULTERS;
    if (path === '/accountant/concessions') return db.CONCESSIONS;
    if (path === '/accountant/collect' && method === 'POST') return { receipt: `RCPT-${Math.floor(Math.random() * 9000 + 1000)}`, ...body };

    // ---- Transport ----
    if (path === '/transport/routes') return db.ROUTES;
    if (path === '/transport/students') return db.TRANSPORT_STUDENTS;
    if (path === '/transport/reports') {
      return { onTimeRate: 96.4, totalTrips: 84, incidents: 1, fuelCostThisMonth: 68000 };
    }

    // ---- Librarian ----
    if (path === '/librarian/books') return db.BOOKS;
    if (path === '/librarian/issued') return db.ISSUED_BOOKS;
    if (path === '/librarian/reports') {
      const overdue = db.ISSUED_BOOKS.filter((b) => b.status === 'Overdue').length;
      return { issuedToday: 14, returnedToday: 9, overdue, totalTitles: db.BOOKS.length };
    }
    if (path === '/librarian/issue' && method === 'POST') return { saved: true, ...body };

    const err = new Error(`Mock route not found: ${method} ${path}`);
    err.isApiError = true;
    throw err;
  }

  window.Api = { fetchWithToken };
})();
