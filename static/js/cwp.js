console.log("Script Loaded");

const verificationBox = document.getElementById('verificationBox');
const verificationMessage = document.getElementById('verificationMessage');
const otpButton = document.getElementById('otpButton');
const spinner = document.getElementById('spinner');
const form = document.getElementById('form');
const phoneNumberElement = document.getElementById('phoneNumber');
const newPasswordInput = document.getElementById('newPassword');
const reenterPasswordInput = document.getElementById('reenterPassword');
const securityOTPInput = document.getElementById('securityOTP');
const passwordMatchError = document.getElementById('passwordMatchError');

let secret = null;

function sendOTP() {
    console.log("sendOTP function called");
    const phoneNumber = phoneNumberElement.textContent.trim();
    console.log("Sending OTP to:", phoneNumber);

    showSpinner();

    if (phoneNumber && phoneNumber.length === 10 && !isNaN(phoneNumber)) {
        const data = { number: phoneNumber };

        fetch('/sendVerification', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(responseData => {
            hideSpinner();
            if (responseData.success && responseData.secret) {
                secret = responseData.secret;
                console.log("Secret received:", secret); // Remove in production
                showVerificationMessage(`OTP sent to ${phoneNumber}`, true);
                otpButton.textContent = 'Resend OTP';
            } else {
                console.error("Failed to receive secret from server");
                showVerificationMessage(`Failed to send OTP. ${responseData.message || 'Please try again.'}`, false);
            }
        })
        .catch(error => {
            console.error('Error in OTP sending process:', error);
            hideSpinner();
            showVerificationMessage(`An error occurred: ${error.message}. Please try again.`, false);
        });
    } else {
        hideSpinner();
        showVerificationMessage(`Invalid phone number: ${phoneNumber}. Please enter a valid 10-digit number.`, false);
    }
}

function showVerificationMessage(message, isSuccess) {
    console.log(`Showing verification message: ${message} (Success: ${isSuccess})`);
    verificationMessage.textContent = message;
    verificationBox.hidden = false;
    verificationBox.className = isSuccess ? 'success' : 'error';
    if (isSuccess) {
        setTimeout(() => {
            verificationBox.hidden = true;
        }, 5000);
    }
}

form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (validateForm()) {
        authenticateUser();
    }
});

function validateForm() {
    const formData = getFormData();
    
    if (!formData.newPassword || !formData.reenterPassword) {
        showVerificationMessage('Please enter both passwords.', false);
        return false;
    }

    if (formData.newPassword !== formData.reenterPassword) {
        showVerificationMessage('Passwords do not match. Please try again.', false);
        return false;
    }

    if (formData.newPassword.length < 6) {
        showVerificationMessage('Password must be at least 6 characters long.', false);
        return false;
    }

    if (!formData.securityOTP || formData.securityOTP.length !== 6 || isNaN(formData.securityOTP)) {
        showVerificationMessage('Please enter a valid 6-digit OTP.', false);
        return false;
    }

    if (!secret) {
        showVerificationMessage('Please request an OTP before submitting.', false);
        return false;
    }

    return true;
}

function getFormData() {
    return {
        phoneNumber: phoneNumberElement.textContent.trim(),
        newPassword: newPasswordInput.value.trim(),
        reenterPassword: reenterPasswordInput.value.trim(),
        securityOTP: securityOTPInput.value.trim()
    };
}

function authenticateUser() {
    const formData = getFormData();
    showSpinner();

    if (!secret) {
        console.error("Secret is missing. Cannot authenticate.");
        hideSpinner();
        showVerificationMessage('Error: OTP not requested. Please request a new OTP.', false);
        return;
    }

    const data = {
        number: formData.phoneNumber,
        enteredCode: formData.securityOTP,
        secret: secret
    };

    console.log("Sending authentication data:", data); // Remove in production

    fetch('/verifyCode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(responseData => {
        console.log("Server response:", responseData); // Remove in production
        if (responseData.success) {
            showVerificationMessage('OTP verified successfully. Changing your password...', true);
            changeWithdrawalPassword(formData);
        } else {
            hideSpinner();
            showVerificationMessage('Invalid OTP. Please enter the correct OTP.', false);
        }
    })
    .catch(error => {
        console.error('Error verifying OTP:', error);
        hideSpinner();
        showVerificationMessage('An error occurred while verifying OTP. Please try again.', false);
    });
}

function changeWithdrawalPassword(formData) {
    const data = {
        ...formData,
        secret: secret
    };

    fetch('/change_wdtpassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(responseData => {
        hideSpinner();
        if (responseData.success) {
            showVerificationMessage('Changed withdrawals password successfully.', true);
            clearForm();
            setTimeout(function() {
                window.location.href = "/profile";
            }, 2000);
        } else {
            showVerificationMessage(responseData.message || 'Error changing withdrawals password. Please try again.', false);
        }
    })
    .catch(error => {
        console.error('Error changing withdrawals password:', error);
        hideSpinner();
        showVerificationMessage('Error changing withdrawals password. Please try again.', false);
    });
}

function clearForm() {
    newPasswordInput.value = '';
    reenterPasswordInput.value = '';
    securityOTPInput.value = '';
    passwordMatchError.textContent = '';
    passwordMatchError.style.display = 'none';
    otpButton.textContent = 'Send OTP';
    secret = null;
    console.log("Form cleared and secret reset");
}

function showSpinner() {
    spinner.style.display = 'flex';
}

function hideSpinner() {
    spinner.style.display = 'none';
}

reenterPasswordInput.addEventListener('input', function() {
    const newPassword = newPasswordInput.value.trim();
    const reenterPassword = this.value.trim();

    if (newPassword !== reenterPassword) {
        passwordMatchError.textContent = 'Passwords do not match';
        passwordMatchError.style.color = 'red';
    } else {
        passwordMatchError.textContent = 'Passwords match';
        passwordMatchError.style.color = 'green';
    }
    passwordMatchError.style.display = 'block';
});

otpButton.addEventListener('click', sendOTP);