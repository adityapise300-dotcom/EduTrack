/**
 * transport.service.js
 * Data access for the transport role.
 */
window.TransportService = {
  getRoutes: () => Api.fetchWithToken('/transport/routes'),
  getStudents: () => Api.fetchWithToken('/transport/students'),
  getReports: () => Api.fetchWithToken('/transport/reports'),
};
