/**
 * pages/accountant.js
 * One render function per accountant page, backed by AccountantService.
 */
(function () {
  const $ = (sel) => document.querySelector(sel);

  async function renderDashboard() {
    const root = $('#page-content');
    const [summary, transactions] = await Promise.all([AccountantService.getSummary(), AccountantService.getTransactions()]);
    const session = Auth.getCurrentUser();
    root.innerHTML = `
      <div class="welcome-banner">
        <div><h2>Welcome, ${session.user.name.split(' ')[0]} 👋</h2><p>Here's today's fee collection snapshot.</p></div>
        <div class="banner-actions"><a href="fee-collection.html" class="btn btn-primary">+ Collect Fee</a></div>
      </div>
      <div class="content-grid grid-4" style="margin-bottom:var(--space-lg);">
        <div class="stat-card"><div class="stat-top"><span class="stat-label">Collected Today</span><div class="stat-icon tertiary"><span class="material-symbols-outlined">payments</span></div></div><div class="stat-value">${Utils.formatCurrency(summary.collectedToday)}</div></div>
        <div class="stat-card"><div class="stat-top"><span class="stat-label">Collected This Month</span><div class="stat-icon"><span class="material-symbols-outlined">account_balance</span></div></div><div class="stat-value">${Utils.formatCurrency(summary.collectedThisMonth)}</div></div>
        <div class="stat-card"><div class="stat-top"><span class="stat-label">Pending Dues</span><div class="stat-icon error"><span class="material-symbols-outlined">receipt_long</span></div></div><div class="stat-value">${Utils.formatCurrency(summary.pendingDues)}</div></div>
        <div class="stat-card"><div class="stat-top"><span class="stat-label">Defaulters</span><div class="stat-icon accent"><span class="material-symbols-outlined">warning</span></div></div><div class="stat-value">${summary.defaultersCount}</div></div>
      </div>
      <div class="card">
        <div class="card-header"><h3>Recent Transactions</h3><a href="transactions.html" class="btn btn-ghost btn-sm">View all</a></div>
        <div class="table-wrap"><table class="data-table"><thead><tr><th>Txn ID</th><th>Student</th><th>Amount</th><th>Mode</th><th>Date</th><th>Status</th></tr></thead>
        <tbody>${transactions.slice(0, 5).map((t) => `<tr><td>${t.id}</td><td>${t.student}</td><td class="tabular-nums amount-cell">${Utils.formatCurrency(t.amount)}</td>
        <td>${t.mode}</td><td>${Utils.formatDate(t.date)}</td><td><span class="badge ${Utils.statusBadgeClass(t.status)}">${t.status}</span></td></tr>`).join('')}</tbody></table></div>
      </div>`;
  }

  async function renderFeeCollection() {
    const root = $('#page-content');
    const transactions = await AccountantService.getTransactions();
    root.innerHTML = `
      <div class="content-grid grid-main-side">
        <div class="card">
          <div class="card-header"><h3>Record a Payment</h3></div>
          <form id="collect-form">
            <div class="form-row">
              <div class="form-group"><label>Student Name / Roll No.</label><input type="text" id="c-student" placeholder="Search student…" required></div>
              <div class="form-group"><label>Fee Term</label><select id="c-term"><option>Term 3 Tuition</option><option>Annual Lab &amp; Activity Fee</option><option>Transport Fee</option></select></div>
            </div>
            <div class="form-row">
              <div class="form-group"><label>Amount</label><input type="number" id="c-amount" placeholder="e.g. 15000" required></div>
              <div class="form-group"><label>Payment Mode</label><select id="c-mode"><option>Cash</option><option>UPI</option><option>Card</option><option>Bank Transfer</option></select></div>
            </div>
            <div class="form-group"><label>Remarks (optional)</label><textarea id="c-remarks" placeholder="Any notes for this payment…"></textarea></div>
            <button type="submit" class="btn btn-primary btn-lg"><span class="material-symbols-outlined">point_of_sale</span> Record Payment &amp; Generate Receipt</button>
          </form>
        </div>
        <div class="card receipt-box" id="receipt-preview">
          <div class="empty-state"><span class="material-symbols-outlined">receipt_long</span><p>The receipt preview will appear here after you record a payment.</p></div>
        </div>
      </div>
      <div class="card" style="margin-top:var(--space-lg);">
        <div class="card-header"><h3>Today's Collections</h3></div>
        <div class="table-wrap"><table class="data-table"><thead><tr><th>Txn ID</th><th>Student</th><th>Amount</th><th>Mode</th></tr></thead>
        <tbody id="today-rows">${transactions.slice(0, 3).map((t) => `<tr><td>${t.id}</td><td>${t.student}</td><td class="tabular-nums amount-cell">${Utils.formatCurrency(t.amount)}</td><td>${t.mode}</td></tr>`).join('')}</tbody></table></div>
      </div>`;

    $('#collect-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = { student: $('#c-student').value, term: $('#c-term').value, amount: $('#c-amount').value, mode: $('#c-mode').value };
      const res = await AccountantService.collectFee(payload);
      $('#receipt-preview').innerHTML = `
        <div style="text-align:center;margin-bottom:1rem;">
          <span class="material-symbols-outlined" style="font-size:32px;color:var(--color-tertiary);">check_circle</span>
          <h4 style="margin-top:6px;">Payment Recorded</h4>
        </div>
        <div style="font-size:13.5px;line-height:1.9;">
          <div style="display:flex;justify-content:space-between;"><span class="text-muted">Receipt No.</span><strong>${res.receipt}</strong></div>
          <div style="display:flex;justify-content:space-between;"><span class="text-muted">Student</span><strong>${payload.student}</strong></div>
          <div style="display:flex;justify-content:space-between;"><span class="text-muted">Term</span><strong>${payload.term}</strong></div>
          <div style="display:flex;justify-content:space-between;"><span class="text-muted">Amount</span><strong>${Utils.formatCurrency(payload.amount)}</strong></div>
          <div style="display:flex;justify-content:space-between;"><span class="text-muted">Mode</span><strong>${payload.mode}</strong></div>
        </div>
        <button class="btn btn-secondary btn-block" style="margin-top:1rem;"><span class="material-symbols-outlined">print</span>Print Receipt</button>`;
      Utils.toast(`Payment recorded — ${res.receipt}`, 'success');
      e.target.reset();
    });
  }

  async function renderFeeReports() {
    const root = $('#page-content');
    const [summary, defaulters] = await Promise.all([AccountantService.getSummary(), AccountantService.getDefaulters()]);
    root.innerHTML = `
      <div class="content-grid grid-3" style="margin-bottom:var(--space-lg);">
        <div class="stat-card"><div class="stat-label">Collected This Month</div><div class="stat-value">${Utils.formatCurrency(summary.collectedThisMonth)}</div></div>
        <div class="stat-card"><div class="stat-label">Pending Dues</div><div class="stat-value text-error">${Utils.formatCurrency(summary.pendingDues)}</div></div>
        <div class="stat-card"><div class="stat-label">Defaulters</div><div class="stat-value">${defaulters.length}</div></div>
      </div>
      <div class="card">
        <div class="card-header"><h3>Fee Defaulters</h3><span class="card-subtitle">Sorted by overdue days</span></div>
        <div class="table-wrap"><table class="data-table"><thead><tr><th>Student</th><th>Class</th><th>Due Amount</th><th>Overdue</th></tr></thead>
        <tbody>${defaulters.map((d) => `<tr><td>${d.student}</td><td>${d.classLabel}</td><td class="tabular-nums amount-cell">${Utils.formatCurrency(d.dueAmount)}</td>
        <td><span class="badge badge-error">${d.overdueDays} days</span></td></tr>`).join('')}</tbody></table></div>
      </div>`;
  }

  async function renderConcessions() {
    const root = $('#page-content');
    const concessions = await AccountantService.getConcessions();
    root.innerHTML = `
      <div class="content-grid grid-main-side">
        <div class="card">
          <div class="card-header"><h3>Active Concessions</h3></div>
          <div class="table-wrap"><table class="data-table"><thead><tr><th>Student</th><th>Class</th><th>Type</th><th>Discount</th><th>Approved By</th></tr></thead>
          <tbody>${concessions.map((c) => `<tr><td>${c.student}</td><td>${c.classLabel}</td><td>${c.type}</td>
          <td><span class="badge badge-success">${c.percentage}%</span></td><td>${c.approvedBy}</td></tr>`).join('')}</tbody></table></div>
        </div>
        <div class="card">
          <div class="card-header"><h3>Grant Concession</h3></div>
          <form id="concession-form">
            <div class="form-group"><label>Student</label><input type="text" placeholder="Search student…" required></div>
            <div class="form-group"><label>Type</label><select><option>Sibling Discount</option><option>Merit Scholarship</option><option>Staff Ward</option><option>Financial Hardship</option></select></div>
            <div class="form-group"><label>Discount %</label><input type="number" min="1" max="100" placeholder="e.g. 25"></div>
            <button type="submit" class="btn btn-primary btn-block">Submit for Approval</button>
          </form>
        </div>
      </div>`;
    $('#concession-form').addEventListener('submit', (e) => { e.preventDefault(); Utils.toast('Concession request submitted for approval.', 'success'); });
  }

  async function renderTransactions() {
    const root = $('#page-content');
    const transactions = await AccountantService.getTransactions();
    root.innerHTML = `
      <div class="filter-bar">
        <div class="search-input"><span class="material-symbols-outlined">search</span><input type="text" id="search-input" placeholder="Search by student or txn ID…"></div>
        <select id="status-filter"><option value="">All Status</option><option>Paid</option><option>Pending</option></select>
        <select id="mode-filter"><option value="">All Modes</option><option>Cash</option><option>UPI</option><option>Card</option><option>Bank Transfer</option></select>
      </div>
      <div class="card"><div class="table-wrap"><table class="data-table">
        <thead><tr><th>Txn ID</th><th>Student</th><th>Class</th><th>Amount</th><th>Mode</th><th>Date</th><th>Status</th></tr></thead>
        <tbody id="rows"></tbody>
      </table></div></div>`;

    function rowHtml(t) {
      return `<tr><td>${t.id}</td><td>${t.student}</td><td>${t.classLabel}</td><td class="tabular-nums amount-cell">${Utils.formatCurrency(t.amount)}</td>
      <td>${t.mode}</td><td>${Utils.formatDate(t.date)}</td><td><span class="badge ${Utils.statusBadgeClass(t.status)}">${t.status}</span></td></tr>`;
    }
    function paint() {
      const q = $('#search-input').value.toLowerCase();
      const status = $('#status-filter').value;
      const mode = $('#mode-filter').value;
      const rows = transactions.filter((t) =>
        (!q || t.student.toLowerCase().includes(q) || t.id.toLowerCase().includes(q)) &&
        (!status || t.status === status) && (!mode || t.mode === mode));
      $('#rows').innerHTML = rows.map(rowHtml).join('') || `<tr><td colspan="7"><div class="empty-state"><span class="material-symbols-outlined">search_off</span><p>No matching transactions.</p></div></td></tr>`;
    }
    paint();
    $('#search-input').addEventListener('input', Utils.debounce(paint, 200));
    $('#status-filter').addEventListener('change', paint);
    $('#mode-filter').addEventListener('change', paint);
  }

  window.AccountantPages = { renderDashboard, renderFeeCollection, renderFeeReports, renderConcessions, renderTransactions };
})();
