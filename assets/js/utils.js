/**
 * utils.js
 * Reusable formatters, validators and small DOM helpers.
 * Exposed on window.Utils so plain <script> pages (no bundler) can use it.
 */
(function () {
  function formatDate(dateString, opts) {
    if (!dateString) return '—';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-IN', opts || { day: '2-digit', month: 'short', year: 'numeric' });
  }

  function formatDateTime(dateString) {
    if (!dateString) return '—';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  function formatCurrency(amount, currency) {
    const value = Number(amount) || 0;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency || 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  }

  function formatPercentage(value, digits) {
    const n = Number(value) || 0;
    return `${n.toFixed(digits != null ? digits : 1)}%`;
  }

  function formatNumber(value) {
    return new Intl.NumberFormat('en-IN').format(Number(value) || 0);
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
  }

  function validatePassword(password) {
    // At least 8 chars, one letter, one number.
    return /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(String(password || ''));
  }

  function validateRequired(value) {
    return String(value || '').trim().length > 0;
  }

  function initials(name) {
    if (!name) return '?';
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0].toUpperCase())
      .join('');
  }

  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.from((root || document).querySelectorAll(selector));
  }

  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    Object.entries(attrs || {}).forEach(([key, value]) => {
      if (key === 'class') node.className = value;
      else if (key === 'html') node.innerHTML = value;
      else if (key.startsWith('on') && typeof value === 'function') node.addEventListener(key.slice(2), value);
      else node.setAttribute(key, value);
    });
    (children || []).forEach((child) => {
      if (child == null) return;
      node.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
    });
    return node;
  }

  function debounce(fn, wait) {
    let t;
    return function debounced(...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait || 250);
    };
  }

  function escapeHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function toast(message, type) {
    let stack = document.querySelector('.toast-stack');
    if (!stack) {
      stack = document.createElement('div');
      stack.className = 'toast-stack';
      document.body.appendChild(stack);
    }
    const node = document.createElement('div');
    node.className = `toast ${type || ''}`.trim();
    const icon = type === 'success' ? 'check_circle' : type === 'error' ? 'error' : 'info';
    node.innerHTML = `<span class="material-symbols-outlined">${icon}</span><span>${escapeHtml(message)}</span>`;
    stack.appendChild(node);
    setTimeout(() => {
      node.style.transition = 'opacity .2s ease';
      node.style.opacity = '0';
      setTimeout(() => node.remove(), 200);
    }, 3200);
  }

  function statusBadgeClass(status) {
    const s = String(status || '').toLowerCase();
    if (['paid', 'present', 'active', 'approved', 'returned', 'verified', 'resolved'].includes(s)) return 'badge-success';
    if (['pending', 'due', 'partial', 'in review', 'upcoming', 'processing'].includes(s)) return 'badge-warning';
    if (['overdue', 'absent', 'rejected', 'inactive', 'failed', 'cancelled'].includes(s)) return 'badge-error';
    return 'badge-neutral';
  }

  window.Utils = {
    formatDate,
    formatDateTime,
    formatCurrency,
    formatPercentage,
    formatNumber,
    validateEmail,
    validatePassword,
    validateRequired,
    initials,
    qs,
    qsa,
    el,
    debounce,
    escapeHtml,
    toast,
    statusBadgeClass,
  };
})();
