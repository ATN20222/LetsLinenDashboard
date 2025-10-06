// Simple confirm modal controller for product deletion
(function () {
  const backdrop = document.getElementById("confirmDeleteBackdrop");
  let pendingRow = null;

  function showConfirm({ title, message, onConfirm }) {
    if (!backdrop) return;
    const modal = backdrop.querySelector(".ds-modal");
    const header = modal.querySelector(".ds-modal-header");
    const body = modal.querySelector(".ds-modal-body");
    const cancelBtn = modal.querySelector('[data-action="cancel"]');
    const confirmBtn = modal.querySelector('[data-action="confirm"]');

    header.textContent = title;
    body.textContent = message;

    const onCancel = () => hide();
    const onConfirmClick = () => {
      try { onConfirm && onConfirm(); } finally { hide(); }
    };

    cancelBtn.addEventListener("click", onCancel, { once: true });
    confirmBtn.addEventListener("click", onConfirmClick, { once: true });

    backdrop.removeAttribute("hidden");
  }

  function hide() {
    if (!backdrop) return;
    backdrop.setAttribute("hidden", "");
    pendingRow = null;
  }

  window.deleteProduct = function (row) {
    pendingRow = row;
    const data = row && row.getData ? row.getData() : null;
    const name = data ? data.name : "this product";
    showConfirm({
      title: "Delete product",
      message: `Are you sure you want to delete ${name}?`,
      onConfirm: () => {
        console.log("Confirmed delete for product:", data);
      },
    });
  };
})();