// Edit Product: load by id, manage images and variants similar to add-product
document.addEventListener('DOMContentLoaded', function () {
  // Only run on edit product page
  var form = document.getElementById('productForm');
  if (!form) return;

  var imageInput = document.getElementById('imageInput');
  var imagesPreview = document.getElementById('imagesPreview');
  var variantsList = document.getElementById('variantsList');
  var addVariantBtn = document.getElementById('addVariant');
  var saveBtn = document.getElementById('saveProduct');

  var images = [];
  var variants = [];

  function renderImages() {
    imagesPreview.innerHTML = '';
    images.forEach(function (src, idx) {
      var wrap = document.createElement('div');
      wrap.className = 'ds-form-image-item';
      var img = document.createElement('img');
      img.src = src;
      var remove = document.createElement('button');
      remove.className = 'ds-form-image-remove';
      remove.type = 'button';
      remove.innerHTML = '×';
      remove.addEventListener('click', function () {
        images.splice(idx, 1);
        renderImages();
      });
      wrap.appendChild(img);
      wrap.appendChild(remove);
      imagesPreview.appendChild(wrap);
    });
  }

  imageInput.addEventListener('change', function (e) {
    var files = Array.prototype.slice.call(e.target.files || []);
    files.forEach(function (file) {
      var reader = new FileReader();
      reader.onload = function (ev) {
        images.push(ev.target.result);
        renderImages();
      };
      reader.readAsDataURL(file);
    });
    imageInput.value = '';
  });

  // Drag & drop
  var dropzone = imageInput.parentElement;
  ;['dragenter','dragover'].forEach(function(evt){
    dropzone.addEventListener(evt, function(e){ e.preventDefault(); dropzone.style.borderColor = '--color-secondary'; });
  });
  ;['dragleave','drop'].forEach(function(evt){
    dropzone.addEventListener(evt, function(e){ e.preventDefault(); dropzone.style.borderColor = '--border-current/10'; });
  });
  dropzone.addEventListener('drop', function (e) {
    var files = Array.prototype.slice.call(e.dataTransfer.files || []);
    files.forEach(function (file) {
      var reader = new FileReader();
      reader.onload = function (ev) { images.push(ev.target.result); renderImages(); };
      reader.readAsDataURL(file);
    });
  });

  function renderVariants() {
    variantsList.innerHTML = '';
    variants.forEach(function (v, i) {
      var row = document.createElement('div');
      row.className = 'ds-form-variant-row';
      row.innerHTML = '' +
        '<input class="ds-form-control" placeholder="Color" value="' + (v.color || '') + '">' +
        '<input class="ds-form-control" placeholder="Size" value="' + (v.size || '') + '">' +
        '<input class="ds-form-control" type="number" step="0.01" min="0" placeholder="Price ($)" value="' + (v.price || '') + '">' +
        '<button class="ds-secondary-btn" type="button">Remove</button>';
      var inputs = row.querySelectorAll('input');
      inputs[0].addEventListener('input', function () { v.color = this.value; });
      inputs[1].addEventListener('input', function () { v.size = this.value; });
      inputs[2].addEventListener('input', function () { v.price = Number(this.value || 0); });
      row.querySelector('.ds-secondary-btn').addEventListener('click', function () {
        variants.splice(i, 1);
        renderVariants();
      });
      variantsList.appendChild(row);
    });
  }

  addVariantBtn.addEventListener('click', function () {
    variants.push({ color: '', size: '', price: 0 });
    renderVariants();
  });

  // Load by id from query param (demo data source)
  function getIdFromQuery() {
    try { return Number(new URLSearchParams(window.location.search).get('id')); } catch { return NaN; }
  }

  function getDemoProductById(id) {
    // sync with products-table demo data
    var demo = [
      { id: 1, sku: 'BED-SET-001', name: 'Luxury Bedding Set', category: 'Bedding', price: 129.99, stock: 44, variants: [ { color: 'White', size: 'Queen', price: 129.99 }, { color: 'Ivory', size: 'King', price: 149.99 } ], images: [] },
      { id: 2, sku: 'SHEET-SET-002', name: 'Premium Sheet Set', category: 'Bedding', price: 79.99, stock: 120, variants: [ { color: 'Gray', size: 'Twin', price: 69.99 }, { color: 'Gray', size: 'Queen', price: 79.99 } ], images: [] },
    ];
    return demo.find(function(p){ return p.id === id; }) || null;
  }

  function populateForm(product) {
    if (!product) return;
    form.querySelector('[name="name"]').value = product.name || '';
    form.querySelector('[name="sku"]').value = product.sku || '';
    form.querySelector('[name="category"]').value = product.category || '';
    form.querySelector('[name="stock"]').value = product.stock != null ? String(product.stock) : '';
    form.querySelector('[name="price"]').value = product.price != null ? String(product.price) : '';
    
    images = ["../../../assets/img/Logo.svg"] ; // array of img links or files work on both or if u want in one property separated with comma use .slice() function 
    variants = Array.isArray(product.variants) ? product.variants.map(function(v){ return { color: v.color || '', size: v.size || '', price: Number(v.price || 0) }; }) : [];
    renderImages();
    renderVariants();
  }

  var id = getIdFromQuery();
  if (!isNaN(id)) {
    var product = getDemoProductById(id);
    populateForm(product);
  }

  // Save changes (demo)
  saveBtn.addEventListener('click', function (e) {
    e.preventDefault();

    // Clear previous errors
    Array.prototype.forEach.call(form.querySelectorAll('.ds-form-field-error'), function (el) { el.remove(); });
    Array.prototype.forEach.call(form.querySelectorAll('.ds-form-is-invalid'), function (el) { el.classList.remove('ds-form-is-invalid'); });
    var prevErr = variantsList.previousElementSibling;
    if (prevErr && prevErr.classList && prevErr.classList.contains('ds-form-field-error')) {
      prevErr.remove();
    }

    // Gather data
    var fd = new FormData(form);

    // Validation helpers
    var errors = {};
    function requireText(name, label) {
      var val = (fd.get(name) || '').toString().trim();
      if (!val) errors[name] = label + ' is required.';
      return val;
    }
    function requireNumber(name, label, min) {
      var raw = (fd.get(name) || '').toString().trim();
      var num = Number(raw);
      if (raw === '' || isNaN(num) || (typeof min === 'number' && num < min)) {
        errors[name] = label + ' must be a number' + (typeof min === 'number' ? ' ≥ ' + min : '') + '.';
      }
      return num;
    }

    var sku = requireText('sku', 'SKU');
    var name = requireText('name', 'Name');
    var category = requireText('category', 'Category');
    var stock = requireNumber('stock', 'Stock', 0);
    var price = requireNumber('price', 'Base price', 0);

    // Validate variants
    var hasInvalidVariant = variants.some(function (v) {
      return !v || !v.color || !v.size || isNaN(Number(v.price)) || Number(v.price) < 0;
    });
    if (hasInvalidVariant) {
      errors['variants'] = 'Each variant requires color, size, and non-negative price.';
    }

    if (Object.keys(errors).length) {
      // Field errors
      ['sku','name','category','stock','price'].forEach(function (field) {
        if (errors[field]) {
          var input = form.querySelector('[name="' + field + '"]');
          if (input) {
            input.classList.add('ds-form-is-invalid');
            var msg = document.createElement('div');
            msg.className = 'ds-form-field-error !mb-2';
            msg.textContent = errors[field];
            var wrapper = input.parentElement;
            if (wrapper && wrapper.classList.contains('ds-form-field')) {
              wrapper.appendChild(msg);
            } else {
              input.insertAdjacentElement('afterend', msg);
            }
          }
        }
      });
      // Variants error (single)
      if (errors['variants']) {
        var vErr = document.createElement('div');
        vErr.className = 'ds-form-field-error';
        vErr.textContent = errors['variants'];
        variantsList.insertAdjacentElement('beforebegin', vErr);
      }
      return; // Prevent submit/log on validation errors
    }

    var updated = {
      id: isNaN(id) ? undefined : id,
      sku: sku,
      name: name,
      category: category,
      stock: stock,
      price: price,
      variants: variants.slice(),
      images: images.slice(),
    };
    console.log('Save product changes:', updated);
  });
});


