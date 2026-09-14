/**
 * accountant.service.js
 * Data access for the accountant role.
 */
window.AccountantService = {
  getSummary: () => Api.fetchWithToken('/accountant/summary'),
  getTransactions: () => Api.fetchWithToken('/accountant/transactions'),
  getDefaulters: () => Api.fetchWithToken('/accountant/defaulters'),
  getConcessions: () => Api.fetchWithToken('/accountant/concessions'),
  collectFee: (data) => Api.fetchWithToken('/accountant/collect', { method: 'POST', body: JSON.stringify(data) }),
};
