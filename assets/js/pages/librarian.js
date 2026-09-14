/**
 * pages/librarian.js
 * One render function per librarian page, backed by LibrarianService.
 */
(function () {
  const $ = (sel) => document.querySelector(sel);

  async function renderDashboard() {
    const root = $('#page-content');
    const [reports, issued] = await Promise.all([LibrarianService.getReports(), LibrarianService.getIssued()]);
    const session = Auth.getCurrentUser();
    const overdue = issued.filter((b) => b.status === 'Overdue');
    root.innerHTML = `
      <div class="welcome-banner">
        <div><h2>Welcome, ${session.user.name.split(' ')[0]} 👋</h2><p>Here's today's circulation summary.</p></div>
        <div class="banner-actions"><a href="issue-return.html" class="btn btn-primary">Issue / Return</a></div>
      </div>
      <div class="content-grid grid-4" style="margin-bottom:var(--space-lg);">
        <div class="stat-card"><div class="stat-top"><span class="stat-label">Issued Today</span><div class="stat-icon"><span class="material-symbols-outlined">outbound</span></div></div><div class="stat-value">${reports.issuedToday}</div></div>
        <div class="stat-card"><div class="stat-top"><span class="stat-label">Returned Today</span><div class="stat-icon tertiary"><span class="material-symbols-outlined">inventory_2</span></div></div><div class="stat-value">${reports.returnedToday}</div></div>
        <div class="stat-card"><div class="stat-top"><span class="stat-label">Overdue Books</span><div class="stat-icon error"><span class="material-symbols-outlined">warning</span></div></div><div class="stat-value">${reports.overdue}</div></div>
        <div class="stat-card"><div class="stat-top"><span class="stat-label">Total Titles</span><div class="stat-icon"><span class="material-symbols-outlined">menu_book</span></div></div><div class="stat-value">${reports.totalTitles}</div></div>
      </div>
      <div class="card">
        <div class="card-header"><h3>Overdue Books</h3><a href="issue-return.html" class="btn btn-ghost btn-sm">Manage</a></div>
        ${overdue.length ? `<div class="table-wrap"><table class="data-table"><thead><tr><th>Book</th><th>Student</th><th>Class</th><th>Due On</th><th>Status</th></tr></thead>
        <tbody>${overdue.map((b) => `<tr><td>${b.title}</td><td>${b.student}</td><td>${b.classLabel}</td><td>${Utils.formatDate(b.dueOn)}</td><td><span class="badge badge-error">Overdue</span></td></tr>`).join('')}</tbody></table></div>`
        : `<div class="empty-state"><span class="material-symbols-outlined">task_alt</span><p>No overdue books right now.</p></div>`}
      </div>`;
  }

  async function renderBooksManage() {
    const root = $('#page-content');
    const books = await LibrarianService.getBooks();
    root.innerHTML = `
      <div class="content-grid grid-main-side">
        <div class="card">
          <div class="filter-bar" style="margin-bottom:0;">
            <div class="search-input"><span class="material-symbols-outlined">search</span><input type="text" id="search-input" placeholder="Search title, author or ISBN…"></div>
          </div>
          <div class="table-wrap" style="margin-top:var(--space-md);"><table class="data-table">
            <thead><tr><th>Title</th><th>Author</th><th>Category</th><th>Copies</th><th>Available</th></tr></thead>
            <tbody id="rows">${books.map(rowHtml).join('')}</tbody>
          </table></div>
        </div>
        <div class="card">
          <div class="card-header"><h3>Add New Book</h3></div>
          <form id="book-form">
            <div class="form-group"><label>Title</label><input type="text" required></div>
            <div class="form-group"><label>Author</label><input type="text" required></div>
            <div class="form-row">
              <div class="form-group"><label>ISBN</label><input type="text" class="barcode-scan-input" placeholder="978-…"></div>
              <div class="form-group"><label>Copies</label><input type="number" min="1" value="1"></div>
            </div>
            <div class="form-group"><label>Category</label><select><option>Fiction</option><option>Science</option><option>Computer Science</option><option>History</option></select></div>
            <button type="submit" class="btn btn-primary btn-block"><span class="material-symbols-outlined">add</span>Add to Catalog</button>
          </form>
        </div>
      </div>`;
    function rowHtml(b) {
      return `<tr><td style="display:flex;align-items:center;gap:10px;"><div class="book-cover-placeholder"><span class="material-symbols-outlined" style="font-size:18px;">menu_book</span></div>${b.title}</td>
      <td>${b.author}</td><td><span class="badge badge-neutral">${b.category}</span></td><td class="tabular-nums">${b.copies}</td>
      <td class="tabular-nums">${b.available === 0 ? '<span class="badge badge-error">0</span>' : b.available}</td></tr>`;
    }
    $('#search-input').addEventListener('input', Utils.debounce((e) => {
      const q = e.target.value.toLowerCase();
      $('#rows').innerHTML = books.filter((b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || b.isbn.includes(q)).map(rowHtml).join('');
    }, 200));
    $('#book-form').addEventListener('submit', (e) => { e.preventDefault(); Utils.toast('Book added to catalog.', 'success'); e.target.reset(); });
  }

  async function renderIssueReturn() {
    const root = $('#page-content');
    const issued = await LibrarianService.getIssued();
    root.innerHTML = `
      <div class="content-grid grid-main-side">
        <div class="card">
          <div class="card-header"><h3>Currently Issued</h3></div>
          <div class="table-wrap"><table class="data-table">
            <thead><tr><th>Book</th><th>Student</th><th>Issued On</th><th>Due On</th><th>Status</th><th></th></tr></thead>
            <tbody id="rows">${issued.map(rowHtml).join('')}</tbody>
          </table></div>
        </div>
        <div class="card">
          <div class="card-header"><h3>Issue a Book</h3></div>
          <form id="issue-form">
            <div class="form-group"><label>Scan / Enter ISBN</label><input type="text" class="barcode-scan-input" placeholder="978-…" autofocus></div>
            <div class="form-group"><label>Student Name / Roll No.</label><input type="text" placeholder="Search student…" required></div>
            <div class="form-group"><label>Due Date</label><input type="date"></div>
            <button type="submit" class="btn btn-primary btn-block"><span class="material-symbols-outlined">outbound</span>Issue Book</button>
          </form>
        </div>
      </div>`;
    function rowHtml(b) {
      return `<tr><td>${b.title}</td><td>${b.student} <span class="text-muted">(${b.classLabel})</span></td><td>${Utils.formatDate(b.issuedOn)}</td><td>${Utils.formatDate(b.dueOn)}</td>
      <td><span class="badge ${Utils.statusBadgeClass(b.status)}">${b.status}</span></td>
      <td>${b.status !== 'Returned' ? `<button class="btn btn-secondary btn-sm return-btn">Return</button>` : '—'}</td></tr>`;
    }
    Utils.qsa('.return-btn').forEach((btn) => btn.addEventListener('click', () => Utils.toast('Book marked as returned.', 'success')));
    $('#issue-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      await LibrarianService.issueBook({});
      Utils.toast('Book issued successfully.', 'success');
      e.target.reset();
    });
  }

  async function renderLibraryReports() {
    const root = $('#page-content');
    const reports = await LibrarianService.getReports();
    root.innerHTML = `
      <div class="content-grid grid-4" style="margin-bottom:var(--space-lg);">
        <div class="stat-card"><div class="stat-label">Issued Today</div><div class="stat-value">${reports.issuedToday}</div></div>
        <div class="stat-card"><div class="stat-label">Returned Today</div><div class="stat-value">${reports.returnedToday}</div></div>
        <div class="stat-card"><div class="stat-label">Overdue</div><div class="stat-value">${reports.overdue}</div></div>
        <div class="stat-card"><div class="stat-label">Total Titles</div><div class="stat-value">${reports.totalTitles}</div></div>
      </div>
      <div class="card">
        <div class="card-header"><h3>Report Library</h3></div>
        <div class="content-grid grid-3">
          ${['Circulation Summary', 'Overdue Books', 'Popular Titles', 'Category Breakdown', 'Damaged / Lost Books'].map((r) => `
          <div style="display:flex;align-items:center;gap:10px;padding:12px;border:1px solid var(--border);border-radius:var(--radius-md);">
            <span class="material-symbols-outlined" style="color:var(--color-primary);">description</span>
            <div style="flex:1;font-size:13.5px;font-weight:600;">${r}</div>
            <button class="btn btn-ghost btn-sm"><span class="material-symbols-outlined">download</span></button>
          </div>`).join('')}
        </div>
      </div>`;
  }

  window.LibrarianPages = { renderDashboard, renderBooksManage, renderIssueReturn, renderLibraryReports };
})();
