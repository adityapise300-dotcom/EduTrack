/**
 * pages/student.js
 * One render function per student page. Each page's inline <script> calls
 * Router.requireRole(['student']), Layout.render(title), then the matching
 * function here, which fetches from StudentService and paints #page-content.
 */
(function () {
  const $ = (sel) => document.querySelector(sel);

  async function renderDashboard() {
    const root = $('#page-content');
    root.innerHTML = `<div class="empty-state"><span class="material-symbols-outlined">progress_activity</span><p>Loading your dashboard…</p></div>`;
    const [{ summary }, assignments, timetable, fees] = await Promise.all([
      StudentService.getAttendance(), StudentService.getAssignments(), StudentService.getTimetable(), StudentService.getFees(),
    ]);
    const session = Auth.getCurrentUser();
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const todayClasses = timetable[today] || [];
    const pending = assignments.filter((a) => a.status === 'Pending');

    root.innerHTML = `
      <div class="welcome-banner">
        <div>
          <h2>Welcome back, ${session.user.name.split(' ')[0]} 👋</h2>
          <p>${session.user.classLabel || ''} · Roll No. ${session.user.rollNo || '—'}</p>
        </div>
        <div class="banner-actions">
          <a href="timetable.html" class="btn btn-secondary">View Timetable</a>
          <a href="assignments.html" class="btn btn-primary">View Assignments</a>
        </div>
      </div>

      <div class="content-grid grid-4" style="margin-bottom: var(--space-lg);">
        <div class="stat-card">
          <div class="stat-top"><span class="stat-label">Attendance</span><div class="stat-icon tertiary"><span class="material-symbols-outlined">event_available</span></div></div>
          <div class="stat-value">${Utils.formatPercentage(summary.percentage)}</div>
          <div class="stat-delta up"><span class="material-symbols-outlined" style="font-size:14px;">trending_up</span> ${summary.present}/${summary.totalDays} days present</div>
        </div>
        <div class="stat-card">
          <div class="stat-top"><span class="stat-label">Pending Assignments</span><div class="stat-icon accent"><span class="material-symbols-outlined">assignment</span></div></div>
          <div class="stat-value">${pending.length}</div>
          <div class="stat-delta">of ${assignments.length} total this term</div>
        </div>
        <div class="stat-card">
          <div class="stat-top"><span class="stat-label">Fees Due</span><div class="stat-icon error"><span class="material-symbols-outlined">payments</span></div></div>
          <div class="stat-value">${Utils.formatCurrency(fees.summary.pending)}</div>
          <div class="stat-delta">due by ${Utils.formatDate(fees.summary.nextDueDate)}</div>
        </div>
        <div class="stat-card">
          <div class="stat-top"><span class="stat-label">Classes Today</span><div class="stat-icon"><span class="material-symbols-outlined">calendar_month</span></div></div>
          <div class="stat-value">${todayClasses.length}</div>
          <div class="stat-delta">${today}</div>
        </div>
      </div>

      <div class="content-grid grid-main-side">
        <div class="card">
          <div class="card-header"><h3>Today's Timetable</h3><a href="timetable.html" class="btn btn-ghost btn-sm">Full week</a></div>
          ${todayClasses.length ? `
          <div class="table-wrap"><table class="data-table"><thead><tr><th>Time</th><th>Subject</th><th>Room</th><th>Teacher</th></tr></thead>
          <tbody>${todayClasses.map((c) => `<tr><td class="tabular-nums">${c.time}</td><td>${c.subject}</td><td>${c.room}</td><td>${c.teacher}</td></tr>`).join('')}</tbody></table></div>`
          : `<div class="empty-state"><span class="material-symbols-outlined">weekend</span><p>No classes scheduled today.</p></div>`}
        </div>
        <div class="card list-widget">
          <div class="card-header"><h3>Recent Assignments</h3></div>
          ${assignments.slice(0, 4).map((a) => `
            <div class="list-item">
              <div class="list-item-icon"><span class="material-symbols-outlined">assignment</span></div>
              <div>
                <div class="list-item-title">${a.title}</div>
                <div class="list-item-sub">${a.subject} · Due ${Utils.formatDate(a.dueDate)}</div>
              </div>
              <div class="list-item-meta"><span class="badge ${Utils.statusBadgeClass(a.status)}">${a.status}</span></div>
            </div>`).join('')}
        </div>
      </div>`;
  }

  async function renderAttendance() {
    const root = $('#page-content');
    const { summary, log } = await StudentService.getAttendance();
    root.innerHTML = `
      <div class="content-grid grid-4" style="margin-bottom:var(--space-lg);">
        <div class="stat-card"><div class="stat-label">Present</div><div class="stat-value">${summary.present}</div></div>
        <div class="stat-card"><div class="stat-label">Absent</div><div class="stat-value">${summary.absent}</div></div>
        <div class="stat-card"><div class="stat-label">Late</div><div class="stat-value">${summary.late}</div></div>
        <div class="stat-card"><div class="stat-label">Overall %</div><div class="stat-value">${Utils.formatPercentage(summary.percentage)}</div></div>
      </div>
      <div class="card">
        <div class="card-header"><h3>Attendance Log</h3><span class="card-subtitle">Most recent first</span></div>
        <div class="table-wrap"><table class="data-table"><thead><tr><th>Date</th><th>Status</th></tr></thead>
        <tbody>${log.map((d) => `<tr><td>${Utils.formatDate(d.date, { weekday: 'short', day: '2-digit', month: 'short' })}</td><td><span class="badge ${Utils.statusBadgeClass(d.status)}">${d.status}</span></td></tr>`).join('')}</tbody></table></div>
      </div>`;
  }

  async function renderResults() {
    const root = $('#page-content');
    const results = await StudentService.getResults();
    const exams = [...new Set(results.map((r) => r.exam))];
    root.innerHTML = `
      <div class="filter-bar">
        <select id="exam-filter"><option value="">All Exams</option>${exams.map((e) => `<option value="${e}">${e}</option>`).join('')}</select>
      </div>
      <div class="card"><div class="table-wrap"><table class="data-table" id="results-table">
        <thead><tr><th>Exam</th><th>Subject</th><th>Marks</th><th>Grade</th></tr></thead>
        <tbody></tbody></table></div></div>`;

    function paint(filter) {
      const rows = results.filter((r) => !filter || r.exam === filter);
      $('#results-table tbody').innerHTML = rows.map((r) => `
        <tr><td>${r.exam}</td><td>${r.subject}</td>
        <td class="tabular-nums">${r.marks}/${r.maxMarks}</td>
        <td><span class="badge badge-primary">${r.grade}</span></td></tr>`).join('') ||
        `<tr><td colspan="4"><div class="empty-state"><span class="material-symbols-outlined">search_off</span><p>No results found.</p></div></td></tr>`;
    }
    paint('');
    $('#exam-filter').addEventListener('change', (e) => paint(e.target.value));
  }

  async function renderAssignments() {
    const root = $('#page-content');
    const assignments = await StudentService.getAssignments();
    root.innerHTML = `
      <div class="tabs" id="assignment-tabs">
        <button class="active" data-filter="">All (${assignments.length})</button>
        <button data-filter="Pending">Pending (${assignments.filter((a) => a.status === 'Pending').length})</button>
        <button data-filter="Submitted">Submitted (${assignments.filter((a) => a.status === 'Submitted').length})</button>
        <button data-filter="Graded">Graded (${assignments.filter((a) => a.status === 'Graded').length})</button>
      </div>
      <div class="content-grid" id="assignment-list"></div>`;

    function paint(filter) {
      const rows = assignments.filter((a) => !filter || a.status === filter);
      $('#assignment-list').innerHTML = rows.map((a) => `
        <div class="card">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:1rem;">
            <div>
              <h4 style="margin-bottom:4px;">${a.title}</h4>
              <p style="margin:0;font-size:13px;">${a.subject} · ${a.teacher}</p>
            </div>
            <span class="badge ${Utils.statusBadgeClass(a.status)}">${a.status}</span>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:1rem;padding-top:1rem;border-top:1px solid var(--surface-container);">
            <span class="text-muted" style="font-size:12.5px;">Due ${Utils.formatDate(a.dueDate)}</span>
            ${a.grade ? `<span class="badge badge-success">${a.grade}</span>` : `<button class="btn btn-primary btn-sm">Open</button>`}
          </div>
        </div>`).join('') || `<div class="empty-state" style="grid-column:1/-1;"><span class="material-symbols-outlined">assignment_turned_in</span><p>Nothing here.</p></div>`;
    }
    paint('');
    Utils.qsa('#assignment-tabs button').forEach((btn) => btn.addEventListener('click', () => {
      Utils.qsa('#assignment-tabs button').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      paint(btn.dataset.filter);
    }));
  }

  async function renderTimetable() {
    const root = $('#page-content');
    const timetable = await StudentService.getTimetable();
    const days = Object.keys(timetable);
    root.innerHTML = `
      <div class="tabs" id="day-tabs">${days.map((d, i) => `<button class="${i === 0 ? 'active' : ''}" data-day="${d}">${d}</button>`).join('')}</div>
      <div class="card"><div class="table-wrap"><table class="data-table" id="timetable-table">
        <thead><tr><th>Time</th><th>Subject</th><th>Room</th><th>Teacher</th></tr></thead><tbody></tbody></table></div></div>`;

    function paint(day) {
      $('#timetable-table tbody').innerHTML = timetable[day].map((c) => `
        <tr><td class="tabular-nums">${c.time}</td><td>${c.subject}</td><td>${c.room}</td><td>${c.teacher}</td></tr>`).join('');
    }
    paint(days[0]);
    Utils.qsa('#day-tabs button').forEach((btn) => btn.addEventListener('click', () => {
      Utils.qsa('#day-tabs button').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      paint(btn.dataset.day);
    }));
  }

  async function renderFees() {
    const root = $('#page-content');
    const fees = await StudentService.getFees();
    root.innerHTML = `
      <div class="content-grid grid-3" style="margin-bottom:var(--space-lg);">
        <div class="stat-card"><div class="stat-label">Total Fees</div><div class="stat-value">${Utils.formatCurrency(fees.summary.totalDue)}</div></div>
        <div class="stat-card"><div class="stat-label">Paid</div><div class="stat-value text-success">${Utils.formatCurrency(fees.summary.totalPaid)}</div></div>
        <div class="stat-card"><div class="stat-label">Pending</div><div class="stat-value text-error">${Utils.formatCurrency(fees.summary.pending)}</div></div>
      </div>
      <div class="card">
        <div class="card-header"><h3>Installments</h3></div>
        <div class="table-wrap"><table class="data-table">
          <thead><tr><th>Term</th><th>Amount</th><th>Status</th><th>Paid On</th><th>Receipt</th></tr></thead>
          <tbody>${fees.installments.map((f) => `
            <tr><td>${f.term}</td><td class="tabular-nums">${Utils.formatCurrency(f.amount)}</td>
            <td><span class="badge ${Utils.statusBadgeClass(f.status)}">${f.status}</span></td>
            <td>${f.paidOn ? Utils.formatDate(f.paidOn) : '—'}</td>
            <td>${f.receipt ? `<a href="#">${f.receipt}</a>` : (f.status === 'Due' ? `<button class="btn btn-primary btn-sm">Pay Now</button>` : '—')}</td></tr>`).join('')}
          </tbody></table></div>
      </div>`;
  }

  async function renderProfile() {
    const root = $('#page-content');
    const session = Auth.getCurrentUser();
    root.innerHTML = `
      <div class="content-grid grid-main-side">
        <div class="card">
          <div class="card-header"><h3>Personal Information</h3></div>
          <form id="profile-form">
            <div class="form-row"><div class="form-group"><label>Full Name</label><input type="text" value="${session.user.name}"></div>
            <div class="form-group"><label>Roll No.</label><input type="text" value="${session.user.rollNo || ''}" disabled></div></div>
            <div class="form-row"><div class="form-group"><label>Email</label><input type="email" value="${session.user.email}"></div>
            <div class="form-group"><label>Class</label><input type="text" value="${session.user.classLabel || ''}" disabled></div></div>
            <button type="submit" class="btn btn-primary">Save Changes</button>
          </form>
        </div>
        <div class="card">
          <div class="card-header"><h3>Change Password</h3></div>
          <form id="password-form">
            <div class="form-group"><label>Current Password</label><input type="password" placeholder="••••••••"></div>
            <div class="form-group"><label>New Password</label><input type="password" placeholder="••••••••"></div>
            <button type="submit" class="btn btn-secondary btn-block">Update Password</button>
          </form>
        </div>
      </div>`;
    $('#profile-form').addEventListener('submit', (e) => { e.preventDefault(); Utils.toast('Profile updated.', 'success'); });
    $('#password-form').addEventListener('submit', (e) => { e.preventDefault(); Utils.toast('Password updated.', 'success'); });
  }

  window.StudentPages = { renderDashboard, renderAttendance, renderResults, renderAssignments, renderTimetable, renderFees, renderProfile };
})();
