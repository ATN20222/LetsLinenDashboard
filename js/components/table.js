// Reusable Tabulator wrapper
(function () {
  function SimpleTable(container, options) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    this.options = options || {};
    this.columns = this.options.columns || [];
    this.pageSize = this.options.paginationSize || 10;
    this.page = 0;
    this.sort = { field: null, dir: 'asc' };
    this.filters = null;
    this.data = Array.isArray(this.options.data) ? this.options.data.slice() : [];
    this.filtered = this.data.slice();
    this._build();
    this._render();
  }

  SimpleTable.prototype._build = function () {
    this.container.innerHTML = '';
    var wrapper = document.createElement('div');
    wrapper.className = 'simple-table';

    var table = document.createElement('table');
    var thead = document.createElement('thead');
    var tr = document.createElement('tr');
    var self = this;
    this.columns.forEach(function (col) {
      var th = document.createElement('th');
      th.textContent = col.title || col.field;
      th.style.cursor = 'pointer';
      th.addEventListener('click', function () {
        var field = col.field;
        if (!field) return;
        if (self.sort.field === field) {
          self.sort.dir = self.sort.dir === 'asc' ? 'desc' : 'asc';
        } else {
          self.sort.field = field;
          self.sort.dir = 'asc';
        }
        self._applySort();
        self.page = 0;
        self._render();
      });
      tr.appendChild(th);
    });
    thead.appendChild(tr);

    var tbody = document.createElement('tbody');
    table.appendChild(thead);
    table.appendChild(tbody);

    var footer = document.createElement('div');
    footer.className = 'simple-table-footer';
    var prev = document.createElement('button');
    prev.textContent = 'Prev';
    var next = document.createElement('button');
    next.textContent = 'Next';
    var info = document.createElement('span');
    info.className = 'info';
    var selfRef = this;
    prev.addEventListener('click', function () {
      if (selfRef.page > 0) { selfRef.page--; selfRef._render(); }
    });
    next.addEventListener('click', function () {
      var totalPages = Math.ceil(selfRef.filtered.length / selfRef.pageSize);
      if (selfRef.page < totalPages - 1) { selfRef.page++; selfRef._render(); }
    });
    footer.appendChild(prev);
    footer.appendChild(info);
    footer.appendChild(next);

    wrapper.appendChild(table);
    wrapper.appendChild(footer);
    this.container.appendChild(wrapper);

    this._els = { tbody: tbody, info: info };
  };

  SimpleTable.prototype._applySort = function () {
    var f = this.sort.field, d = this.sort.dir;
    if (!f) return;
    this.filtered.sort(function (a, b) {
      var av = a[f], bv = b[f];
      if (!isNaN(av) && !isNaN(bv)) { av = Number(av); bv = Number(bv); }
      if (av < bv) return d === 'asc' ? -1 : 1;
      if (av > bv) return d === 'asc' ? 1 : -1;
      return 0;
    });
  };

  SimpleTable.prototype._applyFilters = function () {
    var filters = this.filters;
    var data = this.data.slice();
    if (!filters || (Array.isArray(filters) && filters.length === 0)) {
      this.filtered = data;
      return;
    }
    // Support Tabulator-like filters array with OR groups
    function match(item, f) {
      var field = f.field, type = f.type, value = f.value;
      var v = (item[field] + '').toLowerCase();
      var q = (value + '').toLowerCase();
      if (type === 'like') return v.indexOf(q) !== -1;
      if (type === '=') return (item[field] + '') === (value + '');
      return true;
    }
    var out = [];
    for (var i = 0; i < data.length; i++) {
      var row = data[i];
      var include = true;
      for (var j = 0; j < filters.length; j++) {
        var f = filters[j];
        if (Array.isArray(f)) {
          // OR group
          var any = false;
          for (var k = 0; k < f.length; k++) { if (match(row, f[k])) { any = true; break; } }
          if (!any) { include = false; break; }
        } else {
          if (!match(row, f)) { include = false; break; }
        }
      }
      if (include) out.push(row);
    }
    this.filtered = out;
  };

  SimpleTable.prototype._render = function () {
    var start = this.page * this.pageSize;
    var end = start + this.pageSize;
    var rows = this.filtered.slice(start, end);
    var tbody = this._els.tbody;
    tbody.innerHTML = '';
    var self = this;
    rows.forEach(function (row) {
      var tr = document.createElement('tr');
      self.columns.forEach(function (col) {
        var td = document.createElement('td');
        var value = row[col.field];
        td.setAttribute('data-label', (col.title || col.field || ''));
        if (typeof col.formatter === 'function') {
          // mimic Tabulator cell param
          var cell = {
            getValue: function () { return value; },
            getRow: function () { return { getData: function () { return row; } }; }
          };
          td.innerHTML = col.formatter(cell);
        } else {
          td.textContent = value;
        }
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    var totalPages = Math.max(1, Math.ceil(this.filtered.length / this.pageSize));
    this._els.info.textContent = 'Page ' + (this.page + 1) + ' of ' + totalPages + ' • ' + this.filtered.length + ' rows';
  };

  // Public API similar to Tabulator
  SimpleTable.prototype.replaceData = function (newData) {
    this.data = Array.isArray(newData) ? newData.slice() : [];
    this._applyFilters();
    this._applySort();
    this.page = 0;
    this._render();
  };

  SimpleTable.prototype.setFilter = function (filters) {
    this.filters = filters;
    this._applyFilters();
    this._applySort();
    this.page = 0;
    this._render();
  };

  SimpleTable.prototype.clearFilter = function () {
    this.filters = null;
    this._applyFilters();
    this._applySort();
    this.page = 0;
    this._render();
  };

  function createTable(container, options) {
    var defaultOptions = {
      layout: 'fitColumns',
      reactiveData: true,
      pagination: 'local',
      paginationSize: 10,
      paginationSizeSelector: [10, 25, 50, 100],
      movableColumns: true,
      columnHeaderVertAlign: 'bottom',
      height: 'auto',
      responsiveLayout: 'collapse'
    };

    var merged = Object.assign({}, defaultOptions, options || {});

    if (window.Tabulator) {
      return new Tabulator(container, merged);
    }
    // Fallback local table to avoid runtime errors when CDN is blocked
    return new SimpleTable(container, merged);
  }

  window.TableComponent = { createTable: createTable };
})();


