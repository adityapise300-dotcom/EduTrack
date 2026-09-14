/**
 * layout.js
 * Builds the shared header + sidebar + footer for every protected page and
 * injects them into the placeholders below. Building the DOM in JS (rather
 * than fetch()-ing components/header.html etc.) means the layout also works
 * when the site is opened directly from disk, where fetch() of local files
 * is blocked by the browser. components/*.html in this project hold the
 * same markup as a static reference for anyone wiring up a templating /
 * include step server-side later.
 *
 * Expected placeholders on the page:
 *   <div id="layout-root">
 *     <div id="layout-sidebar"></div>
 *     <div id="layout-header"></div>
 *     <main class="main-content" id="layout-main">...page content...</main>
 *     <div id="layout-footer-slot"></div>
 *   </div>
 */
(function () {
  const NAV = {
    student: {
      base: '/student/',
      sectionTitle: 'Student',
      items: [
        { href: 'dashboard.html', icon: 'dashboard', label: 'Dashboard' },
        { href: 'attendance.html', icon: 'event_available', label: 'Attendance' },
        { href: 'results.html', icon: 'school', label: 'Results' },
        { href: 'assignments.html', icon: 'assignment', label: 'Assignments' },
        { href: 'timetable.html', icon: 'calendar_month', label: 'Timetable' },
        { href: 'fees.html', icon: 'payments', label: 'Fees' },
        { href: 'profile.html', icon: 'person', label: 'Profile' },
      ],
    },
    teacher: {
      base: '/teacher/',
      sectionTitle: 'Teacher',
      items: [
        { href: 'dashboard.html', icon: 'dashboard', label: 'Dashboard' },
        { href: 'take-attendance.html', icon: 'event_available', label: 'Take Attendance' },
        { href: 'enter-marks.html', icon: 'edit_note', label: 'Enter Marks' },
        { href: 'create-assignment.html', icon: 'add_task', label: 'Create Assignment' },
        { href: 'view-submissions.html', icon: 'inbox', label: 'Submissions' },
        { href: 'class-schedule.html', icon: 'calendar_month', label: 'Class Schedule' },
        { href: 'profile.html', icon: 'person', label: 'Profile' },
      ],
    },
    parent: {
      base: '/parent/',
      sectionTitle: 'Parent',
      items: [
        { href: 'dashboard.html', icon: 'dashboard', label: 'Dashboard' },
        { href: 'child-select.html', icon: 'family_restroom', label: 'Select Child' },
        { href: 'child-attendance.html', icon: 'event_available', label: 'Attendance' },
        { href: 'child-results.html', icon: 'school', label: 'Results' },
        { href: 'child-assignments.html', icon: 'assignment', label: 'Assignments' },
        { href: 'child-fees.html', icon: 'payments', label: 'Fees' },
        { href: 'profile.html', icon: 'person', label: 'Profile' },
      ],
    },
    admin: {
      base: '/admin/',
      sectionTitle: 'Administration',
      items: [
        { href: 'dashboard.html', icon: 'dashboard', label: 'Dashboard' },
        { href: 'students-manage.html', icon: 'groups', label: 'Students' },
        { href: 'teachers-manage.html', icon: 'badge', label: 'Teachers' },
        { href: 'classes-sections.html', icon: 'meeting_room', label: 'Classes & Sections' },
        { href: 'exams-manage.html', icon: 'edit_document', label: 'Exams' },
        { href: 'fee-structure.html', icon: 'account_balance', label: 'Fee Structure' },
        { href: 'timetable-manage.html', icon: 'calendar_month', label: 'Timetable' },
        { href: 'notices.html', icon: 'campaign', label: 'Notices' },
        { href: 'reports.html', icon: 'bar_chart', label: 'Reports' },
      ],
    },
    accountant: {
      base: '/accountant/',
      sectionTitle: 'Accounts',
      items: [
        { href: 'dashboard.html', icon: 'dashboard', label: 'Dashboard' },
        { href: 'fee-collection.html', icon: 'point_of_sale', label: 'Fee Collection' },
        { href: 'fee-reports.html', icon: 'bar_chart', label: 'Fee Reports' },
        { href: 'concessions.html', icon: 'redeem', label: 'Concessions' },
        { href: 'transactions.html', icon: 'receipt_long', label: 'Transactions' },
      ],
    },
    transport: {
      base: '/transport/',
      sectionTitle: 'Transport',
      items: [
        { href: 'dashboard.html', icon: 'dashboard', label: 'Dashboard' },
        { href: 'routes-manage.html', icon: 'alt_route', label: 'Routes' },
        { href: 'students-transport.html', icon: 'directions_bus', label: 'Students on Transport' },
        { href: 'transport-reports.html', icon: 'bar_chart', label: 'Reports' },
      ],
    },
    librarian: {
      base: '/librarian/',
      sectionTitle: 'Library',
      items: [
        { href: 'dashboard.html', icon: 'dashboard', label: 'Dashboard' },
        { href: 'books-manage.html', icon: 'menu_book', label: 'Books' },
        { href: 'issue-return.html', icon: 'swap_horiz', label: 'Issue / Return' },
        { href: 'library-reports.html', icon: 'bar_chart', label: 'Reports' },
      ],
    },
  };

  function currentFile() {
    const parts = window.location.pathname.split('/');
    return parts[parts.length - 1] || 'dashboard.html';
  }

  function buildSidebar(role, schoolName) {
    const config = NAV[role];
    const file = currentFile();
    const initials = 'ET';

    const navLinks = config.items
      .map((item) => {
        const active = item.href === file ? ' active' : '';
        return `<a href="${item.href}" class="${active.trim()}">
          <span class="material-symbols-outlined">${item.icon}</span>
          <span class="nav-label">${item.label}</span>
        </a>`;
      })
      .join('');

    const schoolInitials = (schoolName || 'ET').split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

    return `
    <aside class="sidebar">
      <div class="sidebar-brand">
        <div class="logo-mark">${initials}</div>
        <div class="brand-text">
          <div class="brand-name">${window.APP_CONFIG.APP_NAME}</div>
          <div class="brand-sub">${window.APP_CONFIG.APP_TAGLINE}</div>
        </div>
      </div>
      <div class="sidebar-school">
        <div class="school-avatar">${schoolInitials}</div>
        <div>
          <div class="school-name">${schoolName || 'Your School'}</div>
          <div class="school-role">${config.sectionTitle} workspace</div>
        </div>
      </div>
      <nav class="sidebar-nav">
        <div class="nav-section-title">Menu</div>
        ${navLinks}
      </nav>
      <div class="sidebar-footer">
        <button class="btn btn-ghost btn-block" id="sidebar-logout-btn" style="color:#fff;border:1px solid rgba(255,255,255,.15);">
          <span class="material-symbols-outlined">logout</span><span>Log out</span>
        </button>
        <button class="sidebar-collapse-toggle" id="sidebar-collapse-btn">
          <span class="material-symbols-outlined" style="font-size:16px;">chevron_left</span>
          <span>Collapse</span>
        </button>
      </div>
    </aside>
    <div class="sidebar-scrim" id="sidebar-scrim"></div>`;
  }

  function buildHeader(user, pageTitle) {
    const initials = window.Utils.initials(user.name);
    return `
    <header class="topbar">
      <div class="topbar-left">
        <button class="topbar-menu-btn icon-btn" id="topbar-menu-btn" aria-label="Open menu">
          <span class="material-symbols-outlined">menu</span>
        </button>
        <div class="topbar-title">${pageTitle || ''}</div>
      </div>
      <div class="topbar-right">
        <button class="icon-btn" aria-label="Notifications">
          <span class="material-symbols-outlined">notifications</span>
          <span class="badge-dot"></span>
        </button>
        <div class="user-menu">
          <button class="user-menu-btn" id="user-menu-btn">
            <div class="avatar" style="background:${user.avatarColor ? user.avatarColor + '22' : ''};color:${user.avatarColor || ''}">${initials}</div>
            <div class="user-meta">
              <div class="user-name">${user.name}</div>
              <div class="user-role">${window.APP_CONFIG.ROLE_LABELS[user.role] || user.role}</div>
            </div>
            <span class="material-symbols-outlined" style="font-size:18px;color:var(--text-muted);">expand_more</span>
          </button>
          <div class="user-dropdown hidden" id="user-dropdown">
            <a href="profile.html"><span class="material-symbols-outlined" style="font-size:18px;">person</span>My Profile</a>
            <a href="#"><span class="material-symbols-outlined" style="font-size:18px;">settings</span>Settings</a>
            <hr>
            <button class="danger" id="dropdown-logout-btn"><span class="material-symbols-outlined" style="font-size:18px;">logout</span>Log out</button>
          </div>
        </div>
      </div>
    </header>`;
  }

  function buildFooter() {
    const year = new Date().getFullYear();
    return `<footer class="app-footer">
      <span>© ${year} ${window.APP_CONFIG.APP_NAME}. All rights reserved.</span>
      <span><a href="#">Help Center</a> · <a href="#">Privacy</a> · <a href="#">Terms</a></span>
    </footer>`;
  }

  function wireInteractions() {
    const shell = document.querySelector('.app-shell');
    const menuBtn = document.getElementById('topbar-menu-btn');
    const scrim = document.getElementById('sidebar-scrim');
    const collapseBtn = document.getElementById('sidebar-collapse-btn');
    const userBtn = document.getElementById('user-menu-btn');
    const dropdown = document.getElementById('user-dropdown');
    const logoutBtn = document.getElementById('sidebar-logout-btn');
    const dropdownLogoutBtn = document.getElementById('dropdown-logout-btn');

    if (menuBtn) menuBtn.addEventListener('click', () => shell.classList.toggle('sidebar-open'));
    if (scrim) scrim.addEventListener('click', () => shell.classList.remove('sidebar-open'));
    if (collapseBtn) collapseBtn.addEventListener('click', () => shell.classList.toggle('sidebar-collapsed'));
    if (userBtn) userBtn.addEventListener('click', (e) => { e.stopPropagation(); dropdown.classList.toggle('hidden'); });
    document.addEventListener('click', () => dropdown && dropdown.classList.add('hidden'));

    function doLogout(e) {
      e.preventDefault();
      window.Auth.logout();
      window.location.href = '/login.html';
    }
    if (logoutBtn) logoutBtn.addEventListener('click', doLogout);
    if (dropdownLogoutBtn) dropdownLogoutBtn.addEventListener('click', doLogout);
  }

  /**
   * Renders the shared shell around whatever markup already lives inside
   * <main id="layout-main">. Call after Router.requireRole() has confirmed
   * the session, passing the human page title shown in the topbar.
   */
  async function render(pageTitle) {
    const session = window.Auth.getCurrentUser();
    if (!session) return;

    let schoolName = 'Your School';
    try {
      const config = await window.School.getSchoolConfig(session.schoolId);
      if (config) schoolName = config.name;
    } catch (e) { /* non-fatal */ }

    const root = document.getElementById('layout-root');
    root.classList.add('app-shell');
    document.getElementById('layout-sidebar').outerHTML = buildSidebar(session.role, schoolName);
    document.getElementById('layout-header').outerHTML = buildHeader(session.user, pageTitle);
    const footerSlot = document.getElementById('layout-footer-slot');
    if (footerSlot) footerSlot.outerHTML = buildFooter();

    wireInteractions();
    document.title = `${pageTitle} · ${window.APP_CONFIG.APP_NAME}`;
  }

  window.Layout = { render, NAV };
})();
