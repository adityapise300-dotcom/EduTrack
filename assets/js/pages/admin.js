/**
 * pages/admin.js
 * One render function per admin page, backed by AdminService.
 */
(function () {
  const $ = (sel) => document.querySelector(sel);

  async function renderDashboard() {
    const root = $('#page-content');
    const [overview, notices] = await Promise.all([AdminService.getOverview(), AdminService.getNotices()]);
    const session = Auth.getCurrentUser();
    root.innerHTML = `
      <div class="welcome-banner">
        <div><h2>Welcome, ${session.user.name} 👋</h2><p>Here's what's happening across the school today.</p></div>
        <div class="banner-actions">
          <a href="reports.html" class="btn btn-secondary">View Reports</a>
          <a href="notices.html" class="btn btn-primary">+ Post Notice</a>
        </div>
      </div>
      <div class="content-grid grid-4" style="margin-bottom:var(--space-lg);">
        <div class="stat-card"><div class="stat-top"><span class="stat-label">Total Students</span><div class="stat-icon"><span class="material-symbols-outlined">groups</span></div></div><div class="stat-value">${Utils.formatNumber(overview.totalStudents)}</div></div>
        <div class="stat-card"><div class="stat-top"><span class="stat-label">Total Teachers</span><div class="stat-icon tertiary"><span class="material-symbols-outlined">badge</span></div></div><div class="stat-value">${Utils.formatNumber(overview.totalTeachers)}</div></div>
        <div class="stat-card"><div class="stat-top"><span class="stat-label">Fee Collected (Month)</span><div class="stat-icon"><span class="material-symbols-outlined">payments</span></div></div><div class="stat-value">${Utils.formatCurrency(overview.feeCollectedThisMonth)}</div><div class="stat-delta up"><span class="material-symbols-outlined" style="font-size:14px;">trending_up</span> ${overview.feeCollectionRate}% collection rate</div></div>
        <div class="stat-card"><div class="stat-top"><span class="stat-label">Attendance Today</span><div class="stat-icon accent"><span class="material-symbols-outlined">event_available</span></div></div><div class="stat-value">${Utils.formatPercentage(overview.attendanceToday)}</div></div>
      </div>
      <div class="content-grid grid-main-side">
        <div class="card">
          <div class="card-header"><h3>Quick Links</h3></div>
          <div class="quick-actions">
            <a class="qa-btn" href="students-manage.html"><span class="material-symbols-outlined">person_add</span>Add Student</a>
            <a class="qa-btn" href="teachers-manage.html"><span class="material-symbols-outlined">badge</span>Add Teacher</a>
            <a class="qa-btn" href="exams-manage.html"><span class="material-symbols-outlined">edit_document</span>Create Exam</a>
            <a class="qa-btn" href="notices.html"><span class="material-symbols-outlined">campaign</span>Post Notice</a>
            <a class="qa-btn" href="fee-structure.html"><span class="material-symbols-outlined">account_balance</span>Fee Structure</a>
            <a class="qa-btn" href="classes-sections.html"><span class="material-symbols-outlined">meeting_room</span>Classes</a>
            <a class="qa-btn" href="timetable-manage.html"><span class="material-symbols-outlined">calendar_month</span>Timetable</a>
            <a class="qa-btn" href="reports.html"><span class="material-symbols-outlined">bar_chart</span>Reports</a>
          </div>
        </div>
        <div class="card list-widget">
          <div class="card-header"><h3>Recent Notices</h3><a href="notices.html" class="btn btn-ghost btn-sm">View all</a></div>
          ${notices.slice(0, 4).map((n) => `<div class="list-item"><div class="list-item-icon"><span class="material-symbols-outlined">campaign</span></div>
          <div><div class="list-item-title">${n.title}</div><div class="list-item-sub">${Utils.formatDate(n.date)} · ${n.audience}</div></div>
          <div class="list-item-meta">${n.priority === 'High' ? '<span class="badge badge-error">High</span>' : ''}</div></div>`).join('')}
        </div>
      </div>`;
  }

  async function renderStudentsManage() {
    const root = $('#page-content');
    const students = await AdminService.getStudents();
    root.innerHTML = `
      <div class="filter-bar">
        <div class="search-input"><span class="material-symbols-outlined">search</span><input type="text" id="search-input" placeholder="Search students…"></div>
        <select id="status-filter"><option value="">All Status</option><option>Active</option><option>Inactive</option></select>
        <button class="btn btn-primary" id="add-btn"><span class="material-symbols-outlined">person_add</span>Add Student</button>
      </div>
      <div class="card"><div class="table-wrap"><table class="data-table">
        <thead><tr><th>Name</th><th>Roll No.</th><th>Class</th><th>Guardian</th><th>Status</th><th></th></tr></thead>
        <tbody id="rows">${students.map(rowHtml).join('')}</tbody>
      </table></div></div>`;

    function rowHtml(s) {
      return `<tr><td>${s.name}</td><td class="tabular-nums">${s.rollNo}</td><td>${s.classLabel}</td><td>${s.guardian}</td>
      <td><span class="badge ${Utils.statusBadgeClass(s.status)}">${s.status}</span></td>
      <td><button class="btn btn-ghost btn-sm">Edit</button></td></tr>`;
    }
    function filter() {
      const q = $('#search-input').value.toLowerCase();
      const status = $('#status-filter').value;
      const rows = students.filter((s) => (!q || s.name.toLowerCase().includes(q) || s.rollNo.toLowerCase().includes(q)) && (!status || s.status === status));
      $('#rows').innerHTML = rows.map(rowHtml).join('') || `<tr><td colspan="6"><div class="empty-state"><span class="material-symbols-outlined">search_off</span><p>No matching students.</p></div></td></tr>`;
    }
    $('#search-input').addEventListener('input', Utils.debounce(filter, 200));
    $('#status-filter').addEventListener('change', filter);
    $('#add-btn').addEventListener('click', () => Utils.toast('Add-student form would open here.', 'info'));
  }

  async function renderTeachersManage() {
    const root = $('#page-content');
    const teachers = await AdminService.getTeachers();
    root.innerHTML = `
      <div class="filter-bar">
        <div class="search-input"><span class="material-symbols-outlined">search</span><input type="text" placeholder="Search teachers…"></div>
        <button class="btn btn-primary"><span class="material-symbols-outlined">person_add</span>Add Teacher</button>
      </div>
      <div class="card"><div class="table-wrap"><table class="data-table">
        <thead><tr><th>Name</th><th>Subject</th><th>Classes</th><th>Email</th><th>Status</th></tr></thead>
        <tbody>${teachers.map((t) => `<tr><td>${t.name}</td><td>${t.subject}</td><td>${t.classes}</td><td>${t.email}</td>
        <td><span class="badge ${Utils.statusBadgeClass(t.status)}">${t.status}</span></td></tr>`).join('')}</tbody>
      </table></div></div>`;
  }

  async function renderClassesSections() {
    const root = $('#page-content');
    const classes = await AdminService.getClasses();
    root.innerHTML = `
      <div class="page-actions" style="margin-bottom:var(--space-lg);justify-content:flex-end;display:flex;">
        <button class="btn btn-primary"><span class="material-symbols-outlined">add</span>Add Class / Section</button>
      </div>
      <div class="content-grid grid-3">
        ${classes.map((c) => `<div class="card">
          <h4 style="margin-bottom:6px;">${c.label}</h4>
          <p style="font-size:13px;margin-bottom:12px;">Class Teacher: ${c.teacher}</p>
          <div style="display:flex;justify-content:space-between;font-size:12.5px;color:var(--text-muted);border-top:1px solid var(--surface-container);padding-top:10px;">
            <span>${c.students} students</span><span>${c.room}</span>
          </div>
        </div>`).join('')}
      </div>`;
  }

  async function renderExamsManage() {
    const root = $('#page-content');
    const exams = await AdminService.getExams();
    root.innerHTML = `
      <div class="page-actions" style="margin-bottom:var(--space-lg);justify-content:flex-end;display:flex;">
        <button class="btn btn-primary"><span class="material-symbols-outlined">add</span>Create Exam</button>
      </div>
      <div class="card"><div class="table-wrap"><table class="data-table">
        <thead><tr><th>Exam</th><th>Classes</th><th>Start</th><th>End</th><th>Status</th></tr></thead>
        <tbody>${exams.map((e) => `<tr><td>${e.name}</td><td>${e.classes}</td><td>${Utils.formatDate(e.startDate)}</td><td>${Utils.formatDate(e.endDate)}</td>
        <td><span class="badge ${Utils.statusBadgeClass(e.status)}">${e.status}</span></td></tr>`).join('')}</tbody>
      </table></div></div>`;
  }

  async function renderFeeStructure() {
    const root = $('#page-content');
    const structures = await AdminService.getFeeStructure();
    root.innerHTML = `
      <div class="page-actions" style="margin-bottom:var(--space-lg);justify-content:flex-end;display:flex;">
        <button class="btn btn-primary"><span class="material-symbols-outlined">add</span>Add Fee Structure</button>
      </div>
      <div class="card"><div class="table-wrap"><table class="data-table">
        <thead><tr><th>Class Range</th><th>Tuition</th><th>Transport</th><th>Lab &amp; Activity</th><th>Total / Year</th></tr></thead>
        <tbody>${structures.map((f) => `<tr><td>${f.classLabel}</td><td class="tabular-nums">${Utils.formatCurrency(f.tuition)}</td>
        <td class="tabular-nums">${Utils.formatCurrency(f.transport)}</td><td class="tabular-nums">${Utils.formatCurrency(f.lab)}</td>
        <td class="tabular-nums" style="font-weight:700;">${Utils.formatCurrency(f.tuition + f.transport + f.lab)}</td></tr>`).join('')}</tbody>
      </table></div></div>`;
  }

  async function renderTimetableManage() {
    const root = $('#page-content');
    const timetable = await AdminService.getTimetable();
    const days = Object.keys(timetable);
    root.innerHTML = `
      <div class="filter-bar"><select id="class-select"><option>Grade 10 - A</option><option>Grade 10 - B</option><option>Grade 9 - A</option></select></div>
      <div class="tabs" id="day-tabs">${days.map((d, i) => `<button class="${i === 0 ? 'active' : ''}" data-day="${d}">${d}</button>`).join('')}</div>
      <div class="card"><div class="table-wrap"><table class="data-table" id="tt-table">
        <thead><tr><th>Time</th><th>Subject</th><th>Room</th><th>Teacher</th><th></th></tr></thead><tbody></tbody></table></div>
        <div style="margin-top:var(--space-lg);display:flex;justify-content:space-between;">
          <button class="btn btn-secondary btn-sm"><span class="material-symbols-outlined">add</span>Add Period</button>
          <button class="btn btn-primary" id="save-tt-btn"><span class="material-symbols-outlined">save</span>Save Timetable</button>
        </div>
      </div>`;
    function paint(day) {
      $('#tt-table tbody').innerHTML = timetable[day].map((c) => `<tr><td class="tabular-nums">${c.time}</td><td>${c.subject}</td><td>${c.room}</td><td>${c.teacher}</td>
      <td><button class="btn btn-ghost btn-sm">Edit</button></td></tr>`).join('');
    }
    paint(days[0]);
    Utils.qsa('#day-tabs button').forEach((btn) => btn.addEventListener('click', () => {
      Utils.qsa('#day-tabs button').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active'); paint(btn.dataset.day);
    }));
    $('#save-tt-btn').addEventListener('click', () => Utils.toast('Timetable saved.', 'success'));
  }

  async function renderNotices() {
    const root = $('#page-content');
    const notices = await AdminService.getNotices();
    root.innerHTML = `
      <div class="content-grid grid-main-side">
        <div class="card list-widget">
          <div class="card-header"><h3>All Notices</h3></div>
          ${notices.map((n) => `<div class="list-item"><div class="list-item-icon"><span class="material-symbols-outlined">campaign</span></div>
          <div><div class="list-item-title">${n.title}</div><div class="list-item-sub">${Utils.formatDate(n.date)} · Audience: ${n.audience}</div></div>
          <div class="list-item-meta">${n.priority === 'High' ? '<span class="badge badge-error">High</span>' : '<span class="badge badge-neutral">Normal</span>'}</div></div>`).join('')}
        </div>
        <div class="card">
          <div class="card-header"><h3>Post New Notice</h3></div>
          <form id="notice-form">
            <div class="form-group"><label>Title</label><input type="text" id="n-title" required></div>
            <div class="form-group"><label>Audience</label><select id="n-audience"><option>All</option><option>Students</option><option>Parents</option><option>Teachers</option></select></div>
            <div class="form-group"><label>Priority</label><select id="n-priority"><option>Normal</option><option>High</option></select></div>
            <div class="form-group"><label>Message</label><textarea id="n-body" placeholder="Write the notice…"></textarea></div>
            <button type="submit" class="btn btn-primary btn-block"><span class="material-symbols-outlined">campaign</span>Publish Notice</button>
          </form>
        </div>
      </div>`;
    $('#notice-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      await AdminService.createNotice({ title: $('#n-title').value, audience: $('#n-audience').value, priority: $('#n-priority').value, body: $('#n-body').value });
      Utils.toast('Notice published.', 'success');
      renderNotices();
    });
  }

  async function renderReports() {
    const root = $('#page-content');
    const overview = await AdminService.getOverview();
    root.innerHTML = `
      <div class="content-grid grid-4" style="margin-bottom:var(--space-lg);">
        <div class="stat-card"><div class="stat-label">Attendance Report</div><div class="stat-value">${Utils.formatPercentage(overview.attendanceToday)}</div><a href="#" class="btn btn-ghost btn-sm" style="padding-left:0;">View details →</a></div>
        <div class="stat-card"><div class="stat-label">Fee Collection</div><div class="stat-value">${overview.feeCollectionRate}%</div><a href="#" class="btn btn-ghost btn-sm" style="padding-left:0;">View details →</a></div>
        <div class="stat-card"><div class="stat-label">Exam Results</div><div class="stat-value">B+ avg</div><a href="#" class="btn btn-ghost btn-sm" style="padding-left:0;">View details →</a></div>
        <div class="stat-card"><div class="stat-label">Pending Admissions</div><div class="stat-value">${overview.pendingAdmissions}</div><a href="#" class="btn btn-ghost btn-sm" style="padding-left:0;">View details →</a></div>
      </div>
      <div class="card">
        <div class="card-header"><h3>Report Library</h3></div>
        <div class="content-grid grid-3">
          ${['Attendance Summary', 'Fee Collection', 'Academic Performance', 'Staff Directory', 'Transport Utilization', 'Library Circulation'].map((r) => `
          <div style="display:flex;align-items:center;gap:10px;padding:12px;border:1px solid var(--border);border-radius:var(--radius-md);">
            <span class="material-symbols-outlined" style="color:var(--color-primary);">description</span>
            <div style="flex:1;font-size:13.5px;font-weight:600;">${r}</div>
            <button class="btn btn-ghost btn-sm"><span class="material-symbols-outlined">download</span></button>
          </div>`).join('')}
        </div>
      </div>`;
  }

  window.AdminPages = { renderDashboard, renderStudentsManage, renderTeachersManage, renderClassesSections, renderExamsManage, renderFeeStructure, renderTimetableManage, renderNotices, renderReports };
})();
