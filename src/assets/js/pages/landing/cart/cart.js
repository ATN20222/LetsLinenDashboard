document.addEventListener('DOMContentLoaded', function () {
    var cartItemsContainer = document.getElementById('cartItems');
    var subtotalValue = document.getElementById('subtotalValue');
    var taxValue = document.getElementById('taxValue');
    var totalValue = document.getElementById('totalValue');

    function formatCurrency(n) {
        return n.toFixed(0) + ' EGP';
    }

    function recalc() {
        var items = cartItemsContainer.querySelectorAll('.cart-item');
        var subtotal = 0;
        items.forEach(function (item) {
            var unitPriceEl = item.querySelector('.unit-price');
            var qtyInput = item.querySelector('.qty-input');
            var lineTotalEl = item.querySelector('.line-total');
            var unitPrice = Number(unitPriceEl.getAttribute('data-price')) || 0;
            var qty = Math.max(1, Number(qtyInput.value) || 1);
            var lineTotal = unitPrice * qty;
            lineTotalEl.textContent = formatCurrency(lineTotal);
            subtotal += lineTotal;
        });
        subtotalValue.textContent = formatCurrency(subtotal);
        var taxes = 0; // Placeholder for future tax calculation
        taxValue.textContent = formatCurrency(taxes);
        totalValue.textContent = formatCurrency(subtotal + taxes);
    }

    function onQtyClick(e) {
        var btn = e.target.closest('.qty-btn');
        if (!btn) return;
        var control = btn.parentElement;
        var input = control.querySelector('.qty-input');
        var action = btn.getAttribute('data-action');
        var current = Math.max(1, Number(input.value) || 1);
        if (action === 'increase') current += 1; else if (action === 'decrease') current = Math.max(1, current - 1);
        input.value = String(current);
        recalc();
    }

    function onQtyInput(e) {
        var input = e.target.closest('.qty-input');
        if (!input) return;
        var value = Math.max(1, Number(input.value) || 1);
        input.value = String(value);
        recalc();
    }

    function onRemoveClick(e) {
        var btn = e.target.closest('.remove-item');
        if (!btn) return;
        var item = btn.closest('.cart-item');
        if (item) {
            item.remove();
            recalc();
        }
    }

    cartItemsContainer.addEventListener('click', onQtyClick);
    cartItemsContainer.addEventListener('input', onQtyInput);
    cartItemsContainer.addEventListener('click', onRemoveClick);

    recalc();
});


