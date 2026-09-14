/**
 * pages/parent.js
 * One render function per parent page, backed by ParentService. All pages
 * except dashboard/child-select operate on the currently selected child
 * (see ParentService.selectedChildId / setSelectedChild).
 */
(function () {
  const $ = (sel) => document.querySelector(sel);

  function activeChildBanner(children) {
    const activeId = ParentService.selectedChildId();
    const active = children.find((c) => c.id === activeId) || children[0];
    if (active && !activeId) ParentService.setSelectedChild(active.id);
    return active;
  }

  async function renderDashboard() {
    const root = $('#page-content');
    const children = await ParentService.getChildren();
    const active = activeChildBanner(children);
    const [{ summary }, assignments, fees] = await Promise.all([
      ParentService.getChildAttendance(), ParentService.getChildAssignments(), ParentService.getChildFees(),
    ]);
    root.innerHTML = `
      <div class="welcome-banner">
        <div><h2>Welcome back 👋</h2><p>Viewing ${children.length > 1 ? 'summary for all children' : `${active.name}'s`} portal</p></div>
        ${children.length > 1 ? `<div class="banner-actions"><a href="child-select.html" class="btn btn-secondary">Switch Child</a></div>` : ''}
      </div>
      <div class="content-grid" style="grid-template-columns:repeat(${children.length}, 1fr);margin-bottom:var(--space-lg);">
        ${children.map((c) => `
          <div class="card" style="${c.id === active.id ? 'border-color:var(--color-primary);' : ''}">
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:1rem;">
              <div class="avatar" style="background:var(--color-primary-soft);color:var(--color-primary);width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;">${Utils.initials(c.name)}</div>
              <div><h4 style="margin-bottom:2px;">${c.name}</h4><p style="margin:0;font-size:12.5px;">${c.classLabel} · Roll ${c.rollNo}</p></div>
            </div>
            <button class="btn btn-secondary btn-block btn-sm select-child-btn" data-id="${c.id}">${c.id === active.id ? 'Currently Viewing' : 'View This Child'}</button>
          </div>`).join('')}
      </div>
      <div class="content-grid grid-3" style="margin-bottom:var(--space-lg);">
        <div class="stat-card"><div class="stat-label">Attendance</div><div class="stat-value">${Utils.formatPercentage(summary.percentage)}</div></div>
        <div class="stat-card"><div class="stat-label">Pending Assignments</div><div class="stat-value">${assignments.filter((a) => a.status === 'Pending').length}</div></div>
        <div class="stat-card"><div class="stat-label">Fees Due</div><div class="stat-value text-error">${Utils.formatCurrency(fees.summary.pending)}</div></div>
      </div>
      <div class="content-grid grid-2">
        <div class="card list-widget">
          <div class="card-header"><h3>Recent Assignments</h3><a href="child-assignments.html" class="btn btn-ghost btn-sm">View all</a></div>
          ${assignments.slice(0, 4).map((a) => `<div class="list-item"><div class="list-item-icon"><span class="material-symbols-outlined">assignment</span></div>
          <div><div class="list-item-title">${a.title}</div><div class="list-item-sub">${a.subject} · Due ${Utils.formatDate(a.dueDate)}</div></div>
          <div class="list-item-meta"><span class="badge ${Utils.statusBadgeClass(a.status)}">${a.status}</span></div></div>`).join('')}
        </div>
        <div class="card">
          <div class="card-header"><h3>Fee Installments</h3><a href="child-fees.html" class="btn btn-ghost btn-sm">View all</a></div>
          <div class="table-wrap"><table class="data-table">
            <tbody>${fees.installments.slice(0, 4).map((f) => `<tr><td>${f.term}</td><td class="tabular-nums">${Utils.formatCurrency(f.amount)}</td><td><span class="badge ${Utils.statusBadgeClass(f.status)}">${f.status}</span></td></tr>`).join('')}</tbody>
          </table></div>
        </div>
      </div>`;
    Utils.qsa('.select-child-btn').forEach((btn) => btn.addEventListener('click', () => {
      ParentService.setSelectedChild(btn.dataset.id);
      renderDashboard();
    }));
  }

  async function renderChildSelect() {
    const root = $('#page-content');
    const children = await ParentService.getChildren();
    const activeId = ParentService.selectedChildId();
    root.innerHTML = `
      <div class="content-grid grid-3">
        ${children.map((c) => `
        <div class="card" style="text-align:center;${c.id === activeId ? 'border-color:var(--color-primary);box-shadow:0 0 0 3px rgba(79,70,229,.12);' : ''}">
          <div class="avatar" style="background:var(--color-primary-soft);color:var(--color-primary);width:64px;height:64px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:20px;margin:0 auto 1rem;">${Utils.initials(c.name)}</div>
          <h4 style="margin-bottom:2px;">${c.name}</h4>
          <p style="font-size:13px;">${c.classLabel} · Roll ${c.rollNo}</p>
          <button class="btn ${c.id === activeId ? 'btn-primary' : 'btn-secondary'} btn-block select-child-btn" data-id="${c.id}">
            ${c.id === activeId ? '✓ Selected' : 'Select'}
          </button>
        </div>`).join('')}
      </div>`;
    Utils.qsa('.select-child-btn').forEach((btn) => btn.addEventListener('click', () => {
      ParentService.setSelectedChild(btn.dataset.id);
      Utils.toast('Switched active child.', 'success');
      renderChildSelect();
    }));
  }

  async function renderChildAttendance() {
    const root = $('#page-content');
    const { summary, log } = await ParentService.getChildAttendance();
    root.innerHTML = `
      <div class="content-grid grid-4" style="margin-bottom:var(--space-lg);">
        <div class="stat-card"><div class="stat-label">Present</div><div class="stat-value">${summary.present}</div></div>
        <div class="stat-card"><div class="stat-label">Absent</div><div class="stat-value">${summary.absent}</div></div>
        <div class="stat-card"><div class="stat-label">Late</div><div class="stat-value">${summary.late}</div></div>
        <div class="stat-card"><div class="stat-label">Overall %</div><div class="stat-value">${Utils.formatPercentage(summary.percentage)}</div></div>
      </div>
      <div class="card"><div class="table-wrap"><table class="data-table"><thead><tr><th>Date</th><th>Status</th></tr></thead>
      <tbody>${log.map((d) => `<tr><td>${Utils.formatDate(d.date, { weekday: 'short', day: '2-digit', month: 'short' })}</td><td><span class="badge ${Utils.statusBadgeClass(d.status)}">${d.status}</span></td></tr>`).join('')}</tbody></table></div></div>`;
  }

  async function renderChildResults() {
    const root = $('#page-content');
    const results = await ParentService.getChildResults();
    root.innerHTML = `<div class="card"><div class="table-wrap"><table class="data-table">
      <thead><tr><th>Exam</th><th>Subject</th><th>Marks</th><th>Grade</th></tr></thead>
      <tbody>${results.map((r) => `<tr><td>${r.exam}</td><td>${r.subject}</td><td class="tabular-nums">${r.marks}/${r.maxMarks}</td><td><span class="badge badge-primary">${r.grade}</span></td></tr>`).join('')}</tbody>
    </table></div></div>`;
  }

  async function renderChildAssignments() {
    const root = $('#page-content');
    const assignments = await ParentService.getChildAssignments();
    root.innerHTML = `<div class="content-grid">${assignments.map((a) => `
      <div class="card">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:1rem;">
          <div><h4 style="margin-bottom:4px;">${a.title}</h4><p style="margin:0;font-size:13px;">${a.subject} · ${a.teacher}</p></div>
          <span class="badge ${Utils.statusBadgeClass(a.status)}">${a.status}</span>
        </div>
        <p style="margin:1rem 0 0;font-size:12.5px;color:var(--text-muted);">Due ${Utils.formatDate(a.dueDate)}${a.grade ? ' · Grade: ' + a.grade : ''}</p>
      </div>`).join('')}</div>`;
  }

  async function renderChildFees() {
    const root = $('#page-content');
    const fees = await ParentService.getChildFees();
    root.innerHTML = `
      <div class="content-grid grid-3" style="margin-bottom:var(--space-lg);">
        <div class="stat-card"><div class="stat-label">Total Fees</div><div class="stat-value">${Utils.formatCurrency(fees.summary.totalDue)}</div></div>
        <div class="stat-card"><div class="stat-label">Paid</div><div class="stat-value text-success">${Utils.formatCurrency(fees.summary.totalPaid)}</div></div>
        <div class="stat-card"><div class="stat-label">Pending</div><div class="stat-value text-error">${Utils.formatCurrency(fees.summary.pending)}</div></div>
      </div>
      <div class="card"><div class="table-wrap"><table class="data-table">
        <thead><tr><th>Term</th><th>Amount</th><th>Status</th><th>Paid On</th><th>Receipt</th></tr></thead>
        <tbody>${fees.installments.map((f) => `<tr><td>${f.term}</td><td class="tabular-nums">${Utils.formatCurrency(f.amount)}</td>
        <td><span class="badge ${Utils.statusBadgeClass(f.status)}">${f.status}</span></td><td>${f.paidOn ? Utils.formatDate(f.paidOn) : '—'}</td>
        <td>${f.receipt ? `<a href="#">${f.receipt}</a>` : (f.status === 'Due' ? `<button class="btn btn-primary btn-sm">Pay Now</button>` : '—')}</td></tr>`).join('')}</tbody>
      </table></div></div>`;
  }

  async function renderProfile() {
    const root = $('#page-content');
    const session = Auth.getCurrentUser();
    root.innerHTML = `
      <div class="content-grid grid-main-side">
        <div class="card">
          <div class="card-header"><h3>Personal Information</h3></div>
          <form id="profile-form">
            <div class="form-group"><label>Full Name</label><input type="text" value="${session.user.name}"></div>
            <div class="form-group"><label>Email</label><input type="email" value="${session.user.email}"></div>
            <div class="form-group"><label>Phone</label><input type="tel" placeholder="+91 98xxxxxxxx"></div>
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

  window.ParentPages = { renderDashboard, renderChildSelect, renderChildAttendance, renderChildResults, renderChildAssignments, renderChildFees, renderProfile };
})();
