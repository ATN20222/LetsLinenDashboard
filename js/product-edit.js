// Edit Product: load existing product, manage images/variants, save
document.addEventListener('DOMContentLoaded', function () {
  function getParam(name) { return new URLSearchParams(window.location.search).get(name); }
  var id = Number(getParam('id'));
  var product = ProductsStore.getById(id);
  var form = document.getElementById('productForm');
  var imageInput = document.getElementById('imageInput');
  var imagesPreview = document.getElementById('imagesPreview');
  var variantsList = document.getElementById('variantsList');
  var addVariantBtn = document.getElementById('addVariant');
  var saveBtn = document.getElementById('saveProduct');
  var deleteBtn = document.getElementById('deleteProduct');

  if (!product) {
    form.innerHTML = '<div class="muted">Product not found.</div>';
    saveBtn.disabled = true;
    return;
  }

  var images = (product.images || []).slice();
  var variants = (product.variants || []).map(function (v) { return { color: v.color, size: v.size, price: Number(v.price || 0) }; });

  form.innerHTML = '' +
    '<div class="form-field"><input class="form-control" name="name" placeholder="Product name" required value="' + (product.name || '') + '"></div>' +
    '<div class="form-field"><input class="form-control" name="sku" placeholder="SKU" required value="' + (product.sku || '') + '"></div>' +
    '<div class="form-field"><input class="form-control" name="category" placeholder="Category" required value="' + (product.category || '') + '"></div>' +
    '<div class="form-field"><input class="form-control" name="stock" placeholder="Stock" type="number" min="0" required value="' + (product.stock || 0) + '"></div>' +
    '<div class="form-field"><input class="form-control" name="price" placeholder="Base price ($)" type="number" step="0.01" min="0" required value="' + (product.price || 0) + '"></div>';

  function renderImages() {
    imagesPreview.innerHTML = '';
    images.forEach(function (src, idx) {
      var wrap = document.createElement('div');
      wrap.className = 'image-item';
      var img = document.createElement('img');
      img.src = src;
      var remove = document.createElement('button');
      remove.className = 'image-remove';
      remove.type = 'button';
      remove.innerHTML = '×';
      remove.addEventListener('click', function () { images.splice(idx, 1); renderImages(); });
      wrap.appendChild(img);
      wrap.appendChild(remove);
      imagesPreview.appendChild(wrap);
    });
  }
  renderImages();

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
    dropzone.addEventListener(evt, function(e){ e.preventDefault(); dropzone.style.borderColor = 'var(--secondary-color)'; });
  });
  ;['dragleave','drop'].forEach(function(evt){
    dropzone.addEventListener(evt, function(e){ e.preventDefault(); dropzone.style.borderColor = 'var(--border-color)'; });
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
      row.className = 'variant-row';
      row.innerHTML = '' +
        '<input class="form-control" placeholder="Color" value="' + (v.color || '') + '">' +
        '<input class="form-control" placeholder="Size" value="' + (v.size || '') + '">' +
        '<input class="form-control" type="number" step="0.01" min="0" placeholder="Price ($)" value="' + (v.price || 0) + '">' +
        '<button class="variant-remove" type="button">Remove</button>';
      var inputs = row.querySelectorAll('input');
      inputs[0].addEventListener('input', function () { v.color = this.value; });
      inputs[1].addEventListener('input', function () { v.size = this.value; });
      inputs[2].addEventListener('input', function () { v.price = Number(this.value || 0); });
      row.querySelector('.variant-remove').addEventListener('click', function () { variants.splice(i, 1); renderVariants(); });
      variantsList.appendChild(row);
    });
  }
  renderVariants();

  addVariantBtn.addEventListener('click', function () { variants.push({ color: '', size: '', price: 0 }); renderVariants(); });

  saveBtn.addEventListener('click', function () {
    // Clear old errors
    Array.prototype.forEach.call(form.querySelectorAll('.field-error'), function (e) { e.remove(); });
    Array.prototype.forEach.call(form.querySelectorAll('.is-invalid'), function (e) { e.classList.remove('is-invalid'); });

    var fd = new FormData(form);
    var errors = {};

    function requireText(name, label) {
      var val = (fd.get(name) || '').toString().trim();
      if (!val) errors[name] = label + ' is required.';
      return val;
    }
    function requireNumber(name, label, min) {
      var raw = (fd.get(name) || '').toString().trim();
      var num = Number(raw);
      if (raw === '' || isNaN(num) || (typeof min === 'number' && num < min)) errors[name] = label + ' must be a number' + (typeof min === 'number' ? ' ≥ ' + min : '') + '.';
      return num;
    }

    var sku = requireText('sku', 'SKU');
    var name = requireText('name', 'Name');
    var category = requireText('category', 'Category');
    var stock = requireNumber('stock', 'Stock', 0);
    var price = requireNumber('price', 'Base price', 0);

    // Validate variants
    var invalidVariant = variants.some(function (v) { return !v.color || !v.size || isNaN(Number(v.price)) || Number(v.price) < 0; });
    if (invalidVariant) errors['variants'] = 'Each variant requires color, size, and non-negative price.';

    if (Object.keys(errors).length) {
      ['sku','name','category','stock','price'].forEach(function (field) {
        if (errors[field]) {
          var input = form.querySelector('[name="' + field + '"]');
          if (input) {
            input.classList.add('is-invalid');
            var msg = document.createElement('div');
            msg.className = 'field-error';
            msg.textContent = errors[field];
            var wrapper = input.parentElement;
            if (wrapper && wrapper.classList.contains('form-field')) {
              wrapper.appendChild(msg);
            } else {
              input.insertAdjacentElement('afterend', msg);
            }
          }
        }
      });
      if (errors['variants']) {
        var msgV = document.createElement('div');
        msgV.className = 'field-error';
        msgV.textContent = errors['variants'];
        variantsList.insertAdjacentElement('beforebegin', msgV);
      }
      return;
    }

    var updated = { id: product.id, sku: sku, name: name, category: category, stock: stock, price: price, variants: variants.slice(), images: images.slice() };
    ProductsStore.save(updated);
    window.location.href = './products.html';
  });

  if (deleteBtn) {
    deleteBtn.addEventListener('click', function () {
      Modal.confirm({ title: 'Delete Product', message: 'This action cannot be undone.', confirmText: 'Delete', danger: true })
        .then(function (ok) {
          if (!ok) return;
          ProductsStore.remove(product.id);
          window.location.href = './products.html';
        });
    });
  }
});


