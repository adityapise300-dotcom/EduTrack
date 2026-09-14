/**
 * pages/teacher.js
 * One render function per teacher page, backed by TeacherService.
 */
(function () {
  const $ = (sel) => document.querySelector(sel);

  async function renderDashboard() {
    const root = $('#page-content');
    const [classesToday, submissions] = await Promise.all([TeacherService.getClassesToday(), TeacherService.getSubmissions()]);
    const session = Auth.getCurrentUser();
    const toGrade = submissions.filter((s) => s.status === 'Submitted').length;
    const pendingAttendance = classesToday.filter((c) => !c.attendanceMarked).length;

    root.innerHTML = `
      <div class="welcome-banner">
        <div><h2>Good morning, ${session.user.name.split(' ')[1] || session.user.name} 👋</h2><p>${session.user.subject || 'Teacher'} · ${classesToday.length} classes today</p></div>
        <div class="banner-actions">
          <a href="take-attendance.html" class="btn btn-secondary">Take Attendance</a>
          <a href="create-assignment.html" class="btn btn-primary">+ New Assignment</a>
        </div>
      </div>
      <div class="content-grid grid-4" style="margin-bottom:var(--space-lg);">
        <div class="stat-card"><div class="stat-top"><span class="stat-label">Classes Today</span><div class="stat-icon"><span class="material-symbols-outlined">calendar_month</span></div></div><div class="stat-value">${classesToday.length}</div></div>
        <div class="stat-card"><div class="stat-top"><span class="stat-label">Pending Attendance</span><div class="stat-icon accent"><span class="material-symbols-outlined">event_busy</span></div></div><div class="stat-value">${pendingAttendance}</div></div>
        <div class="stat-card"><div class="stat-top"><span class="stat-label">To Grade</span><div class="stat-icon error"><span class="material-symbols-outlined">rate_review</span></div></div><div class="stat-value">${toGrade}</div></div>
        <div class="stat-card"><div class="stat-top"><span class="stat-label">Active Classes</span><div class="stat-icon tertiary"><span class="material-symbols-outlined">groups</span></div></div><div class="stat-value">3</div></div>
      </div>
      <div class="card">
        <div class="card-header"><h3>Today's Classes</h3></div>
        <div class="table-wrap"><table class="data-table"><thead><tr><th>Time</th><th>Class</th><th>Subject</th><th>Room</th><th>Attendance</th></tr></thead>
        <tbody>${classesToday.map((c) => `<tr><td class="tabular-nums">${c.time}</td><td>${c.classLabel}</td><td>${c.subject}</td><td>${c.room}</td>
        <td>${c.attendanceMarked ? '<span class="badge badge-success">Marked</span>' : '<span class="badge badge-warning">Pending</span>'}</td></tr>`).join('')}</tbody></table></div>
      </div>`;
  }

  async function renderTakeAttendance() {
    const root = $('#page-content');
    const [classes, roster] = await Promise.all([TeacherService.getClasses(), TeacherService.getRoster()]);
    root.innerHTML = `
      <div class="filter-bar">
        <select id="class-select">${classes.map((c) => `<option value="${c.id}">${c.label}</option>`).join('')}</select>
        <input type="date" id="date-input" value="${new Date().toISOString().slice(0, 10)}">
        <button class="btn btn-secondary btn-sm" id="mark-all-present"><span class="material-symbols-outlined">done_all</span>Mark all present</button>
      </div>
      <div class="card">
        <div class="table-wrap"><table class="data-table">
          <thead><tr><th>Roll No.</th><th>Name</th><th>Status</th></tr></thead>
          <tbody id="attendance-rows">${roster.map((s) => `
            <tr data-roll="${s.rollNo}">
              <td class="tabular-nums">${s.rollNo}</td><td>${s.name}</td>
              <td>
                <div style="display:flex;gap:6px;">
                  <button type="button" class="btn btn-sm status-btn active-present" data-status="Present">Present</button>
                  <button type="button" class="btn btn-sm status-btn" data-status="Absent">Absent</button>
                  <button type="button" class="btn btn-sm status-btn" data-status="Late">Late</button>
                </div>
              </td>
            </tr>`).join('')}</tbody>
        </table></div>
        <div style="margin-top:var(--space-lg);display:flex;justify-content:flex-end;">
          <button class="btn btn-primary btn-lg" id="save-attendance-btn"><span class="material-symbols-outlined">save</span> Save Attendance</button>
        </div>
      </div>`;

    function styleButtons(row) {
      Utils.qsa('.status-btn', row).forEach((b) => {
        const isActive = b.classList.contains('active-present') || b.classList.contains('active-status');
        b.className = 'btn btn-sm status-btn' + (isActive ? '' : '');
      });
    }

    Utils.qsa('#attendance-rows tr').forEach((row) => {
      const buttons = Utils.qsa('.status-btn', row);
      function setActive(target) {
        buttons.forEach((b) => {
          const isTarget = b === target;
          b.style.background = isTarget ? (b.dataset.status === 'Present' ? 'var(--color-tertiary)' : b.dataset.status === 'Late' ? 'var(--color-accent)' : 'var(--color-error)') : '';
          b.style.color = isTarget ? '#fff' : '';
          b.style.borderColor = isTarget ? 'transparent' : '';
        });
      }
      setActive(buttons[0]);
      buttons.forEach((b) => b.addEventListener('click', () => setActive(b)));
    });

    $('#mark-all-present').addEventListener('click', () => {
      Utils.qsa('#attendance-rows tr').forEach((row) => Utils.qs('.status-btn', row).click());
    });

    $('#save-attendance-btn').addEventListener('click', async () => {
      const records = Utils.qsa('#attendance-rows tr').map((row) => {
        const active = Utils.qsa('.status-btn', row).find((b) => b.style.background);
        return { rollNo: row.dataset.roll, status: active ? active.dataset.status : 'Present' };
      });
      const btn = $('#save-attendance-btn');
      btn.disabled = true; btn.innerHTML = '<span class="material-symbols-outlined">progress_activity</span> Saving…';
      await TeacherService.markAttendance($('#class-select').value, $('#date-input').value, records);
      Utils.toast('Attendance saved successfully.', 'success');
      btn.disabled = false; btn.innerHTML = '<span class="material-symbols-outlined">save</span> Save Attendance';
    });
  }

  async function renderEnterMarks() {
    const root = $('#page-content');
    const [classes, roster] = await Promise.all([TeacherService.getClasses(), TeacherService.getRoster()]);
    root.innerHTML = `
      <div class="filter-bar">
        <select id="class-select">${classes.map((c) => `<option value="${c.id}">${c.label}</option>`).join('')}</select>
        <select id="exam-select"><option>Term 1 — Unit Test 2</option><option>Term 1 — Final Examination</option></select>
        <input type="text" id="max-marks" value="100" style="max-width:110px;" placeholder="Max marks">
      </div>
      <div class="card">
        <div class="table-wrap"><table class="data-table">
          <thead><tr><th>Roll No.</th><th>Name</th><th style="width:140px;">Marks Obtained</th></tr></thead>
          <tbody>${roster.map((s) => `
            <tr><td class="tabular-nums">${s.rollNo}</td><td>${s.name}</td>
            <td><input type="number" min="0" max="100" placeholder="—" style="height:36px;"></td></tr>`).join('')}</tbody>
        </table></div>
        <div style="margin-top:var(--space-lg);display:flex;justify-content:flex-end;">
          <button class="btn btn-primary btn-lg" id="save-marks-btn"><span class="material-symbols-outlined">save</span> Save Marks</button>
        </div>
      </div>`;
    $('#save-marks-btn').addEventListener('click', async () => {
      await TeacherService.saveMarks($('#exam-select').value, []);
      Utils.toast('Marks saved successfully.', 'success');
    });
  }

  async function renderCreateAssignment() {
    const root = $('#page-content');
    const classes = await TeacherService.getClasses();
    root.innerHTML = `
      <div class="card" style="max-width:680px;">
        <form id="assignment-form">
          <div class="form-row">
            <div class="form-group"><label>Title</label><input type="text" id="a-title" placeholder="e.g. Quadratic Equations — Problem Set 4" required></div>
          </div>
          <div class="form-row">
            <div class="form-group"><label>Class</label><select id="a-class">${classes.map((c) => `<option>${c.label}</option>`).join('')}</select></div>
            <div class="form-group"><label>Subject</label><input type="text" id="a-subject" placeholder="e.g. Mathematics" required></div>
          </div>
          <div class="form-row">
            <div class="form-group"><label>Due Date</label><input type="date" id="a-due" required></div>
            <div class="form-group"><label>Max Marks</label><input type="number" id="a-marks" placeholder="e.g. 20"></div>
          </div>
          <div class="form-group"><label>Description / Instructions</label><textarea id="a-desc" placeholder="Describe the assignment…"></textarea></div>
          <div class="form-group">
            <label>Attachment</label>
            <div style="border:1px dashed var(--border-strong);border-radius:var(--radius-md);padding:var(--space-lg);text-align:center;color:var(--text-muted);">
              <span class="material-symbols-outlined" style="font-size:28px;">upload_file</span>
              <p style="margin:6px 0 0;font-size:13px;">Drag a file here, or click to browse (optional)</p>
            </div>
          </div>
          <button type="submit" class="btn btn-primary btn-lg"><span class="material-symbols-outlined">send</span> Publish Assignment</button>
        </form>
      </div>`;
    $('#assignment-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      await TeacherService.createAssignment({
        title: $('#a-title').value, classLabel: $('#a-class').value, subject: $('#a-subject').value,
        dueDate: $('#a-due').value, description: $('#a-desc').value,
      });
      Utils.toast('Assignment published to the class.', 'success');
      e.target.reset();
    });
  }

  async function renderViewSubmissions() {
    const root = $('#page-content');
    const submissions = await TeacherService.getSubmissions();
    root.innerHTML = `
      <div class="card">
        <div class="table-wrap"><table class="data-table">
          <thead><tr><th>Student</th><th>Assignment</th><th>Submitted On</th><th>Status</th><th>Grade</th></tr></thead>
          <tbody>${submissions.map((s) => `
            <tr><td>${s.student}</td><td>${s.assignment}</td><td>${s.submittedOn ? Utils.formatDate(s.submittedOn) : '—'}</td>
            <td><span class="badge ${Utils.statusBadgeClass(s.status)}">${s.status}</span></td>
            <td>${s.grade || (s.status === 'Submitted' ? `<button class="btn btn-sm btn-secondary">Grade</button>` : '—')}</td></tr>`).join('')}</tbody>
        </table></div>
      </div>`;
  }

  async function renderClassSchedule() {
    const root = $('#page-content');
    const schedule = await TeacherService.getSchedule();
    const days = Object.keys(schedule);
    root.innerHTML = `
      <div class="tabs" id="day-tabs">${days.map((d, i) => `<button class="${i === 0 ? 'active' : ''}" data-day="${d}">${d}</button>`).join('')}</div>
      <div class="card"><div class="table-wrap"><table class="data-table" id="schedule-table">
        <thead><tr><th>Time</th><th>Class / Subject</th><th>Room</th></tr></thead><tbody></tbody></table></div></div>`;
    function paint(day) {
      $('#schedule-table tbody').innerHTML = schedule[day].map((c) => `<tr><td class="tabular-nums">${c.time}</td><td>${c.subject}</td><td>${c.room}</td></tr>`).join('');
    }
    paint(days[0]);
    Utils.qsa('#day-tabs button').forEach((btn) => btn.addEventListener('click', () => {
      Utils.qsa('#day-tabs button').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active'); paint(btn.dataset.day);
    }));
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
            <div class="form-group"><label>Subject</label><input type="text" value="${session.user.subject || ''}"></div></div>
            <div class="form-group"><label>Email</label><input type="email" value="${session.user.email}"></div>
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

  window.TeacherPages = { renderDashboard, renderTakeAttendance, renderEnterMarks, renderCreateAssignment, renderViewSubmissions, renderClassSchedule, renderProfile };
})();
