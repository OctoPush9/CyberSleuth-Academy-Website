document.addEventListener('DOMContentLoaded', function() {
    const newPasswordInput = document.getElementById('new_password');
    const confirmPasswordInput = document.getElementById('confirm_password');
    const strengthBar = document.getElementById('strengthBar');
    const strengthPercent = document.getElementById('strength-percent');
    const strengthLabel = document.getElementById('strengthLabel');
    const passwordMatch = document.getElementById('passwordMatch');
    const submitBtn = document.getElementById('submitBtn');

    // Password strength checker
    function checkPasswordStrength(password) {
        let strength = 0;
        const strengthTexts = ['None', 'Very Weak', 'Weak', 'Medium', 'Strong', 'Very Strong'];
        const strengthClasses = ['', 'strength-level-1', 'strength-level-2', 'strength-level-3', 'strength-level-4', 'strength-level-5'];

        // Length check
        if (password.length >= 8) strength += 1;
        if (password.length >= 12) strength += 1;

        // Character variety checks
        if (/[a-z]/.test(password)) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;

        // Cap at maximum strength level
        const strengthLevel = Math.min(strength, 5);
        return {
            level: strengthLevel,
            text: strengthTexts[strengthLevel],
            class: strengthClasses[strengthLevel]
        };
    }

    // Update password strength meter
    function updatePasswordStrength() {
        const password = newPasswordInput.value;
        if (!password) {
            strengthBar.className = 'strength-bar strength-level-0';
            strengthBar.style.width = '0%';
            strengthPercent.textContent = '0%';
            strengthLabel.textContent = 'None';
            strengthLabel.className = 'strength-label';
            submitBtn.disabled = true;
            return;
        }

        const strength = checkPasswordStrength(password);
        strengthBar.className = 'strength-bar ' + strength.class;
        strengthBar.style.width = (strength.level * 20) + '%';
        strengthPercent.textContent = (strength.level * 20) + '%';
        strengthLabel.textContent = strength.text;
        strengthLabel.className = 'strength-label ' + (strength.level < 3 ? 'weak' : strength.level < 5 ? 'medium' : 'strong');

        // Enable/disable submit button based on strength
        submitBtn.disabled = strength.level < 3;
    }

    // Check password match
    function checkPasswordMatch() {
        const password = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (!confirmPassword) {
            passwordMatch.textContent = '';
            passwordMatch.className = 'password-match';
            return;
        }

        if (password === confirmPassword) {
            passwordMatch.textContent = 'Passwords match ✓';
            passwordMatch.className = 'password-match match-valid';
            submitBtn.disabled = false;
        } else {
            passwordMatch.textContent = 'Passwords do not match ✗';
            passwordMatch.className = 'password-match match-invalid';
            submitBtn.disabled = true;
        }
    }

    // Event listeners
    newPasswordInput.addEventListener('input', function() {
        updatePasswordStrength();
        checkPasswordMatch();
    });

    confirmPasswordInput.addEventListener('input', checkPasswordMatch);

    // Initialize
    updatePasswordStrength();
    checkPasswordMatch();
});