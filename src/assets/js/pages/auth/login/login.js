// Login page validation
(function () {
    const form = document.querySelector('.auth-form');
    if (!form) return;

    const emailInput = form.querySelector('#email');
    const passwordInput = form.querySelector('#password');
    const submitButton = form.querySelector('button[type="submit"]');
    const originalSubmitText = submitButton ? submitButton.textContent : '';

    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

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

    function validateEmail() {
        const value = (emailInput.value || '').trim();
        if (!value) {
            showError(emailInput, 'Email is required');
            return false;
        }
        if (!EMAIL_REGEX.test(value)) {
            showError(emailInput, 'Enter a valid email address');
            return false;
        }
        markValid(emailInput);
        return true;
    }

    function validatePassword() {
        const value = (passwordInput.value || '').trim();
        if (!value) {
            showError(passwordInput, 'Password is required');
            return false;
        }
        if (value.length < 8) {
            showError(passwordInput, 'Password must be at least 8 characters');
            return false;
        }
        markValid(passwordInput);
        return true;
    }

    function setSubmitting(isSubmitting) {
        if (!submitButton) return;
        submitButton.disabled = isSubmitting;
        submitButton.textContent = isSubmitting ? 'Please wait…' : originalSubmitText;
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

    // Realtime validation
    emailInput.addEventListener('input', validateEmail);
    passwordInput.addEventListener('input', validatePassword);

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const ok = [validateEmail(), validatePassword()].every(Boolean);
        if (!ok) return;
        setSubmitting(true);

        // Simulate request
        setTimeout(function () {
            setSubmitting(false);
            showFormMessage('Signed in successfully (demo).', 'success');
            form.reset();
            [emailInput, passwordInput].forEach(function (el) { el.classList.remove('valid'); });
        }, 800);
    });
})();


