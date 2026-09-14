/**
 * pages/transport.js
 * One render function per transport page, backed by TransportService.
 */
(function () {
  const $ = (sel) => document.querySelector(sel);

  async function renderDashboard() {
    const root = $('#page-content');
    const [routes, reports] = await Promise.all([TransportService.getRoutes(), TransportService.getReports()]);
    const session = Auth.getCurrentUser();
    const totalCapacity = routes.reduce((s, r) => s + r.capacity, 0);
    const totalOccupied = routes.reduce((s, r) => s + r.occupied, 0);
    const activeRoutes = routes.filter((r) => r.status === 'Active').length;
    root.innerHTML = `
      <div class="welcome-banner">
        <div><h2>Welcome, ${session.user.name.split(' ')[0]} 👋</h2><p>Fleet status and today's routes at a glance.</p></div>
        <div class="banner-actions"><a href="routes-manage.html" class="btn btn-primary">Manage Routes</a></div>
      </div>
      <div class="content-grid grid-4" style="margin-bottom:var(--space-lg);">
        <div class="stat-card"><div class="stat-top"><span class="stat-label">Active Routes</span><div class="stat-icon"><span class="material-symbols-outlined">alt_route</span></div></div><div class="stat-value">${activeRoutes}</div></div>
        <div class="stat-card"><div class="stat-top"><span class="stat-label">Seats Occupied</span><div class="stat-icon tertiary"><span class="material-symbols-outlined">directions_bus</span></div></div><div class="stat-value">${totalOccupied}/${totalCapacity}</div></div>
        <div class="stat-card"><div class="stat-top"><span class="stat-label">On-Time Rate</span><div class="stat-icon"><span class="material-symbols-outlined">schedule</span></div></div><div class="stat-value">${Utils.formatPercentage(reports.onTimeRate)}</div></div>
        <div class="stat-card"><div class="stat-top"><span class="stat-label">Incidents (Month)</span><div class="stat-icon ${reports.incidents > 0 ? 'error' : 'tertiary'}"><span class="material-symbols-outlined">report</span></div></div><div class="stat-value">${reports.incidents}</div></div>
      </div>
      <div class="card">
        <div class="card-header"><h3>Routes Overview</h3><a href="routes-manage.html" class="btn btn-ghost btn-sm">Manage</a></div>
        <div class="table-wrap"><table class="data-table"><thead><tr><th>Route</th><th>Driver</th><th>Vehicle</th><th>Occupancy</th><th>Status</th></tr></thead>
        <tbody>${routes.map((r) => `<tr><td>${r.name}</td><td>${r.driver}</td><td>${r.vehicle}</td>
        <td><div style="display:flex;align-items:center;gap:8px;"><div class="progress-bar" style="width:80px;"><span style="width:${Math.round((r.occupied / r.capacity) * 100)}%;"></span></div><span class="text-muted" style="font-size:12px;">${r.occupied}/${r.capacity}</span></div></td>
        <td><span class="badge ${r.status === 'Active' ? 'badge-success' : 'badge-warning'}">${r.status}</span></td></tr>`).join('')}</tbody></table></div>
      </div>`;
  }

  async function renderRoutesManage() {
    const root = $('#page-content');
    const routes = await TransportService.getRoutes();
    root.innerHTML = `
      <div class="page-actions" style="margin-bottom:var(--space-lg);justify-content:flex-end;display:flex;">
        <button class="btn btn-primary"><span class="material-symbols-outlined">add</span>Add Route</button>
      </div>
      <div class="content-grid grid-2">
        ${routes.map((r) => `
        <div class="card">
          <div class="card-header"><h4 style="margin:0;">${r.name}</h4><span class="badge ${r.status === 'Active' ? 'badge-success' : 'badge-warning'}">${r.status}</span></div>
          <div class="route-map-placeholder" style="margin-bottom:1rem;"><span class="material-symbols-outlined">map</span> Route map preview</div>
          <div class="content-grid grid-2" style="gap:.75rem;font-size:13px;">
            <div><span class="text-muted">Driver</span><div style="font-weight:600;">${r.driver}</div></div>
            <div><span class="text-muted">Vehicle No.</span><div style="font-weight:600;">${r.vehicle}</div></div>
            <div><span class="text-muted">Stops</span><div style="font-weight:600;">${r.stops}</div></div>
            <div><span class="text-muted">Occupancy</span><div style="font-weight:600;">${r.occupied}/${r.capacity}</div></div>
          </div>
          <div style="display:flex;gap:8px;margin-top:1rem;">
            <button class="btn btn-secondary btn-sm" style="flex:1;">Edit Stops</button>
            <button class="btn btn-ghost btn-sm" style="flex:1;">View Students</button>
          </div>
        </div>`).join('')}
      </div>`;
  }

  async function renderStudentsTransport() {
    const root = $('#page-content');
    const students = await TransportService.getStudents();
    root.innerHTML = `
      <div class="filter-bar">
        <div class="search-input"><span class="material-symbols-outlined">search</span><input type="text" id="search-input" placeholder="Search students…"></div>
        <button class="btn btn-primary"><span class="material-symbols-outlined">add</span>Assign Student</button>
      </div>
      <div class="card"><div class="table-wrap"><table class="data-table">
        <thead><tr><th>Student</th><th>Class</th><th>Route</th><th>Stop</th><th>Pickup</th></tr></thead>
        <tbody id="rows">${students.map(rowHtml).join('')}</tbody>
      </table></div></div>`;
    function rowHtml(s) {
      return `<tr><td><span class="stop-marker" style="display:inline-block;margin-right:6px;"></span>${s.name}</td><td>${s.classLabel}</td><td>${s.route}</td><td>${s.stop}</td><td class="tabular-nums">${s.pickupTime}</td></tr>`;
    }
    $('#search-input').addEventListener('input', Utils.debounce((e) => {
      const q = e.target.value.toLowerCase();
      $('#rows').innerHTML = students.filter((s) => s.name.toLowerCase().includes(q)).map(rowHtml).join('');
    }, 200));
  }

  async function renderTransportReports() {
    const root = $('#page-content');
    const reports = await TransportService.getReports();
    root.innerHTML = `
      <div class="content-grid grid-4" style="margin-bottom:var(--space-lg);">
        <div class="stat-card"><div class="stat-label">On-Time Rate</div><div class="stat-value">${Utils.formatPercentage(reports.onTimeRate)}</div></div>
        <div class="stat-card"><div class="stat-label">Total Trips (Month)</div><div class="stat-value">${reports.totalTrips}</div></div>
        <div class="stat-card"><div class="stat-label">Incidents</div><div class="stat-value">${reports.incidents}</div></div>
        <div class="stat-card"><div class="stat-label">Fuel Cost (Month)</div><div class="stat-value">${Utils.formatCurrency(reports.fuelCostThisMonth)}</div></div>
      </div>
      <div class="card">
        <div class="card-header"><h3>Report Library</h3></div>
        <div class="content-grid grid-3">
          ${['Route Utilization', 'Fuel & Maintenance', 'Driver Attendance', 'Incident Log', 'Pickup/Drop Timeliness'].map((r) => `
          <div style="display:flex;align-items:center;gap:10px;padding:12px;border:1px solid var(--border);border-radius:var(--radius-md);">
            <span class="material-symbols-outlined" style="color:var(--color-primary);">description</span>
            <div style="flex:1;font-size:13.5px;font-weight:600;">${r}</div>
            <button class="btn btn-ghost btn-sm"><span class="material-symbols-outlined">download</span></button>
          </div>`).join('')}
        </div>
      </div>`;
  }

  window.TransportPages = { renderDashboard, renderRoutesManage, renderStudentsTransport, renderTransportReports };
})();
