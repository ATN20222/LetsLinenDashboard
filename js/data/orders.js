// Orders data module using localStorage as a simple store
(function () {
  var STORAGE_KEY = 'app.orders';

  function generateOrders(count) {
    var statuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    var firstNames = ['Liam','Olivia','Noah','Emma','Amelia','Ava','Mason','Sophia','Lucas','Mia','Ethan','Isabella','Aiden','Charlotte','James','Harper'];
    var lastNames = ['Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Wilson','Moore','Taylor','Anderson'];
    var orders = [];
    for (var i = 1; i <= count; i++) {
      var status = statuses[i % statuses.length];
      var name = firstNames[i % firstNames.length] + ' ' + lastNames[(i * 3) % lastNames.length];
      var base = 39 + ((i * 7) % 120);
      var cents = (i * 13) % 100;
      var total = (base + cents / 100).toFixed(2);
      var items = generateItems(i);
      var totals = computeTotals(items);
      orders.push({
        id: i,
        orderNumber: '#ORD' + String(1000 + i),
        customer: name,
        date: new Date(2025, (i % 12), (i % 28) + 1).toISOString().slice(0, 10),
        total: totals.grandTotal.toFixed(2),
        status: status,
        items: items,
        totals: totals
      });
    }
    return orders;
  }

  function generateItems(seed) {
    var products = [
      { sku: 'BED-SET-001', name: 'Luxury Bedding Set' },
      { sku: 'SHEET-SET-002', name: 'Premium Sheet Set' },
      { sku: 'DUVET-003', name: 'Duvet Cover' },
      { sku: 'PILLOW-004', name: 'Memory Pillow' },
      { sku: 'TOWEL-005', name: 'Soft Bath Towel' }
    ];
    var num = (seed % 4) + 1;
    var items = [];
    for (var k = 0; k < num; k++) {
      var p = products[(seed + k) % products.length];
      var qty = ((seed + k) % 3) + 1;
      var price = 19 + (((seed + k) * 5) % 80);
      var unit = Number((price + ((seed + k) % 10) * 0.1).toFixed(2));
      var subtotal = Number((unit * qty).toFixed(2));
      items.push({ sku: p.sku, name: p.name, qty: qty, unitPrice: unit, subtotal: subtotal });
    }
    return items;
  }

  function computeTotals(items) {
    var itemsTotal = items.reduce(function (s, it) { return s + Number(it.subtotal || 0); }, 0);
    var shipping = itemsTotal > 150 ? 0 : 9.99;
    var tax = Number((itemsTotal * 0.08).toFixed(2));
    var grandTotal = Number((itemsTotal + shipping + tax).toFixed(2));
    return { itemsTotal: Number(itemsTotal.toFixed(2)), shipping: shipping, tax: tax, grandTotal: grandTotal };
  }

  function seed() {
    var existing = localStorage.getItem(STORAGE_KEY);
    if (existing) return JSON.parse(existing);
    var orders = generateOrders(120);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    return orders;
  }

  function list() {
    var data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : seed();
  }

  function getById(id) {
    id = Number(id);
    return list().find(function (o) { return o.id === id; }) || null;
  }

  function update(id, patch) {
    id = Number(id);
    var items = list();
    var idx = items.findIndex(function (o) { return o.id === id; });
    if (idx === -1) return null;
    items[idx] = Object.assign({}, items[idx], patch || {});
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    return items[idx];
  }

  function resetDemo(count) {
    var orders = generateOrders(count || 150);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    return orders;
  }

  window.OrdersStore = { list: list, getById: getById, update: update, resetDemo: resetDemo };
})();


