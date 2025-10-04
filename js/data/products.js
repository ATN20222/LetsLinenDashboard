// Products data module using localStorage
(function () {
  var STORAGE_KEY = 'app.products';

  function seed() {
    var existing = localStorage.getItem(STORAGE_KEY);
    if (existing) return JSON.parse(existing);
    var demo = [
      {
        id: 1,
        sku: 'BED-SET-001',
        name: 'Luxury Bedding Set',
        category: 'Bedding',
        price: 129.99,
        stock: 44,
        variants: [
          { color: 'White', size: 'Queen', price: 129.99 },
          { color: 'Ivory', size: 'King', price: 149.99 }
        ],
        images: []
      },
      {
        id: 2,
        sku: 'SHEET-SET-002',
        name: 'Premium Sheet Set',
        category: 'Bedding',
        price: 79.99,
        stock: 120,
        variants: [
          { color: 'Gray', size: 'Twin', price: 69.99 },
          { color: 'Gray', size: 'Queen', price: 79.99 }
        ],
        images: []
      }
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demo));
    return demo;
  }

  function list() {
    var data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : seed();
  }

  function getById(id) {
    id = Number(id);
    return list().find(function (p) { return p.id === id; }) || null;
  }

  function save(product) {
    var items = list();
    if (product.id) {
      var idx = items.findIndex(function (p) { return p.id === product.id; });
      if (idx !== -1) items[idx] = product;
    } else {
      product.id = (items.reduce(function (m, p) { return Math.max(m, p.id); }, 0) + 1) || 1;
      items.push(product);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    return product;
  }

  function remove(id) {
    id = Number(id);
    var items = list().filter(function (p) { return p.id !== id; });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  window.ProductsStore = { list: list, getById: getById, save: save, remove: remove };
})();


