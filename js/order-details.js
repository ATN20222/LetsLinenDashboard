// Order details page script
document.addEventListener('DOMContentLoaded', function () {
  // Sidebar toggle
  var app = document.querySelector('.ds-app');
  var toggle = document.getElementById('sidebarToggle');
  if (toggle && app) {
    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      app.classList.toggle('sidebar-open');
      toggle.setAttribute('aria-expanded', app.classList.contains('sidebar-open') ? 'true' : 'false');
    });
  }

  function getParam(name) {
    var params = new URLSearchParams(window.location.search);
    return params.get(name);
  }

  var id = getParam('id');
  var order = OrdersStore.getById(id);
  var summaryEl = document.getElementById('orderSummary');
  var selectEl = document.getElementById('statusSelect');
  var saveBtn = document.getElementById('saveStatus');
  var msgEl = document.getElementById('statusMessage');
  var itemsEl = document.getElementById('itemsList');

  if (!order) {
    if (summaryEl) summaryEl.textContent = 'Order not found.';
    if (saveBtn) saveBtn.disabled = true;
    return;
  }

  function renderSummary(o) {
    summaryEl.innerHTML = '' +
      '<div class="mb-1.5">Order #: <strong>' + o.orderNumber + '</strong></div>' +
      '<div class="mb-1.5">Customer: <strong>' + o.customer + '</strong></div>' +
      '<div class="mb-1.5">Date: <strong>' + o.date + '</strong></div>' +
      '<div>Total: <strong>$' + o.total + '</strong></div>';
  }

  // Fallback: older seeded orders may not have items yet
  if (!order.items || !order.items.length) {
    var products = [
      { sku: 'BED-SET-001', name: 'Luxury Bedding Set' },
      { sku: 'SHEET-SET-002', name: 'Premium Sheet Set' },
      { sku: 'DUVET-003', name: 'Duvet Cover' },
      { sku: 'PILLOW-004', name: 'Memory Pillow' },
      { sku: 'TOWEL-005', name: 'Soft Bath Towel' }
    ];
    var num = (order.id % 4) + 1;
    var items = [];
    for (var k = 0; k < num; k++) {
      var p = products[(order.id + k) % products.length];
      var qty = ((order.id + k) % 3) + 1;
      var price = 19 + (((order.id + k) * 5) % 80);
      var unit = Number((price + ((order.id + k) % 10) * 0.1).toFixed(2));
      var subtotal = Number((unit * qty).toFixed(2));
      items.push({ sku: p.sku, name: p.name, qty: qty, unitPrice: unit, subtotal: subtotal });
    }
    var itemsTotal = items.reduce(function (s, it) { return s + Number(it.subtotal || 0); }, 0);
    var shipping = itemsTotal > 150 ? 0 : 9.99;
    var tax = Number((itemsTotal * 0.08).toFixed(2));
    var grandTotal = Number((itemsTotal + shipping + tax).toFixed(2));
    order.items = items;
    order.totals = { itemsTotal: Number(itemsTotal.toFixed(2)), shipping: shipping, tax: tax, grandTotal: grandTotal };
    order.total = order.totals.grandTotal.toFixed(2);
    OrdersStore.update(order.id, { items: order.items, totals: order.totals, total: order.total });
  }

  renderSummary(order);
  selectEl.value = order.status;

  saveBtn.addEventListener('click', function () {
    var newStatus = selectEl.value;
    var updated = OrdersStore.update(order.id, { status: newStatus });
    if (updated) {
      msgEl.textContent = 'Saved! Status updated to ' + newStatus + '.';
      renderSummary(updated);
    } else {
      msgEl.textContent = 'Error: could not save status.';
    }
  });

  // Render items
  function renderItems(o) {
    if (!o.items || !o.items.length) {
      itemsEl.textContent = 'No items found.';
      return;
    }
    var html = '<div class="orders-table-wrapper"><div class="simple-table"><table><thead><tr>' +
      '<th>SKU</th><th>Product</th><th>Qty</th><th>Unit ($)</th><th>Subtotal ($)</th>' +
      '</tr></thead><tbody>';
    o.items.forEach(function (it) {
      html += '<tr><td>' + it.sku + '</td><td>' + it.name + '</td><td>' + it.qty + '</td><td>' + it.unitPrice.toFixed(2) + '</td><td>' + it.subtotal.toFixed(2) + '</td></tr>';
    });
    html += '</tbody></table></div></div>';
    html += '<div class="mt-2 muted">Items: $' + o.totals.itemsTotal.toFixed(2) + ' • Tax: $' + o.totals.tax.toFixed(2) + ' • Shipping: $' + o.totals.shipping.toFixed(2) + ' • Total: $' + o.totals.grandTotal.toFixed(2) + '</div>';
    itemsEl.innerHTML = html;
  }

  renderItems(order);
});


