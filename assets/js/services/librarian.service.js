/**
 * librarian.service.js
 * Data access for the librarian role.
 */
window.LibrarianService = {
  getBooks: () => Api.fetchWithToken('/librarian/books'),
  getIssued: () => Api.fetchWithToken('/librarian/issued'),
  getReports: () => Api.fetchWithToken('/librarian/reports'),
  issueBook: (data) => Api.fetchWithToken('/librarian/issue', { method: 'POST', body: JSON.stringify(data) }),
};
