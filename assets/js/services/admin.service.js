/**
 * admin.service.js
 * Data access for the admin role.
 */
window.AdminService = {
  getOverview: () => Api.fetchWithToken('/admin/overview'),
  getStudents: () => Api.fetchWithToken('/admin/students'),
  getTeachers: () => Api.fetchWithToken('/admin/teachers'),
  getClasses: () => Api.fetchWithToken('/admin/classes'),
  getExams: () => Api.fetchWithToken('/admin/exams'),
  getFeeStructure: () => Api.fetchWithToken('/admin/fee-structure'),
  getTimetable: () => Api.fetchWithToken('/admin/timetable'),
  getNotices: () => Api.fetchWithToken('/admin/notices'),
  createNotice: (data) => Api.fetchWithToken('/admin/notices', { method: 'POST', body: JSON.stringify(data) }),
};
