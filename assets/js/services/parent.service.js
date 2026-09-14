/**
 * parent.service.js
 * Data access for the parent role. All endpoints are scoped to the
 * currently-selected child (see child-select.html / localStorage key
 * "edutrack.selectedChild").
 */
function selectedChildId() {
  return localStorage.getItem('edutrack.selectedChild') || '';
}
window.ParentService = {
  getChildren: () => Api.fetchWithToken('/parent/children'),
  getChildAttendance: () => Api.fetchWithToken(`/parent/child-attendance?childId=${selectedChildId()}`),
  getChildResults: () => Api.fetchWithToken(`/parent/child-results?childId=${selectedChildId()}`),
  getChildAssignments: () => Api.fetchWithToken(`/parent/child-assignments?childId=${selectedChildId()}`),
  getChildFees: () => Api.fetchWithToken(`/parent/child-fees?childId=${selectedChildId()}`),
  selectedChildId,
  setSelectedChild: (childId) => localStorage.setItem('edutrack.selectedChild', childId),
};
