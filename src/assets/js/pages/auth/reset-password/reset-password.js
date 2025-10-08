// Reset password page validation
(function () {
    const form = document.querySelector('.auth-form');
    if (!form) return;

    const passwordInput = form.querySelector('#password');
    const confirmInput = form.querySelector('#confirm-password');
    const submitButton = form.querySelector('button[type="submit"]');
    const originalSubmitText = submitButton ? submitButton.textContent : '';

    function getFieldContainer(input) {
        return input.closest('.form-field') || input.parentElement || form;
    }

    function ensureErrorElement(container) {
        let errorEl = container.querySelector('.form-error');
        if (!errorEl) {
            errorEl = document.createElement('div');
            errorEl.className = 'form-error';
            container.appendChild(errorEl);
        }
        return errorEl;
    }

    function showError(input, message) {
        const container = getFieldContainer(input);
        ensureErrorElement(container).textContent = message;
        input.classList.add('error');
        input.classList.remove('valid');
    }

    function clearError(input) {
        const container = getFieldContainer(input);
        const el = container.querySelector('.form-error');
        if (el) el.textContent = '';
        input.classList.remove('error');
    }

    function markValid(input) {
        clearError(input);
        input.classList.add('valid');
    }

    function validatePassword() {
        const value = (passwordInput.value || '').trim();
        if (!value) {
            showError(passwordInput, 'New password is required');
            return false;
        }
        if (value.length < 8) {
            showError(passwordInput, 'Password must be at least 8 characters');
            return false;
        }
        markValid(passwordInput);
        return true;
    }

    function validateConfirm() {
        const pwd = (passwordInput.value || '').trim();
        const c = (confirmInput.value || '').trim();
        if (!c) {
            showError(confirmInput, 'Please confirm your new password');
            return false;
        }
        if (c !== pwd) {
            showError(confirmInput, 'Passwords do not match');
            return false;
        }
        markValid(confirmInput);
        return true;
    }

    function setSubmitting(isSubmitting) {
        if (!submitButton) return;
        submitButton.disabled = isSubmitting;
        submitButton.textContent = isSubmitting ? 'Resetting…' : originalSubmitText;
    }

    function showFormMessage(message, type = 'success') {
        let msg = form.querySelector('.form-message');
        if (!msg) {
            msg = document.createElement('div');
            msg.className = 'form-message';
            form.appendChild(msg);
        }
        msg.textContent = message;
        msg.setAttribute('data-type', type);
    }

    passwordInput.addEventListener('input', function(){
        validatePassword();
        if (confirmInput.value) validateConfirm();
    });
    confirmInput.addEventListener('input', validateConfirm);

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const ok = [validatePassword(), validateConfirm()].every(Boolean);
        if (!ok) return;
        setSubmitting(true);
        setTimeout(function () {
            setSubmitting(false);
            showFormMessage('Password reset successfully (demo).', 'success');
            form.reset();
            [passwordInput, confirmInput].forEach(function (el) { el.classList.remove('valid'); });
        }, 900);
    });
})();


