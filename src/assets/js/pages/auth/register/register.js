// Register page validation
(function () {
    const form = document.querySelector('.auth-form');
    if (!form) return;

    const emailInput = form.querySelector('#email');
    const passwordInput = form.querySelector('#password');
    const confirmInput = form.querySelector('#confirm-password');
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

    function validateConfirm() {
        const pwd = (passwordInput.value || '').trim();
        const c = (confirmInput.value || '').trim();
        
        // If confirm password is empty, don't show error immediately
        if (!c) {
            clearError(confirmInput);
            return false;
        }
        
        // If passwords don't match, show error
        if (c !== pwd) {
            showError(confirmInput, 'Passwords do not match');
            return false;
        }
        
        // If passwords match, mark as valid
        markValid(confirmInput);
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
    passwordInput.addEventListener('input', function(){
        validatePassword();
        // Always validate confirm password when password changes
        validateConfirm();
    });
    confirmInput.addEventListener('input', validateConfirm);

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        
        // Validate all fields
        const emailValid = validateEmail();
        const passwordValid = validatePassword();
        const confirmValid = validateConfirm();
        
        // Additional check for confirm password on submit
        const confirmValue = (confirmInput.value || '').trim();
        if (!confirmValue) {
            showError(confirmInput, 'Please confirm your password');
        }
        
        const ok = emailValid && passwordValid && confirmValid && confirmValue;
        if (!ok) return;
        setSubmitting(true);

        // Simulated request
        setTimeout(function () {
            setSubmitting(false);
            showFormMessage('Account created successfully (demo).', 'success');
            form.reset();
            [emailInput, passwordInput, confirmInput].forEach(function (el) { el.classList.remove('valid'); });
        }, 900);
    });
})();


