(function () {
  function createBackdrop(html) {
    var backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.innerHTML = html;
    return backdrop;
  }

  function confirm(opts) {
    opts = opts || {};
    return new Promise(function (resolve) {
      var title = opts.title || 'Confirm';
      var message = opts.message || 'Are you sure?';
      var confirmText = opts.confirmText || 'Confirm';
      var cancelText = opts.cancelText || 'Cancel';
      var danger = opts.danger;

      var html = '' +
        '<div class="modal" role="dialog" aria-modal="true" aria-label="' + title + '">' +
        '  <div class="modal-header">' + title + '</div>' +
        '  <div class="modal-body">' + message + '</div>' +
        '  <div class="modal-actions">' +
        '    <button class="btn secondary" data-action="cancel">' + cancelText + '</button>' +
        '    <button class="btn ' + (danger ? 'danger' : '') + '" data-action="confirm">' + confirmText + '</button>' +
        '  </div>' +
        '</div>';
      var el = createBackdrop(html);
      document.body.appendChild(el);
      function cleanup() { if (el && el.parentNode) el.parentNode.removeChild(el); }
      el.addEventListener('click', function (e) {
        if (e.target === el) { cleanup(); resolve(false); }
      });
      el.querySelector('[data-action="cancel"]').addEventListener('click', function () { cleanup(); resolve(false); });
      el.querySelector('[data-action="confirm"]').addEventListener('click', function () { cleanup(); resolve(true); });
    });
  }

  window.Modal = { confirm: confirm };
})();


