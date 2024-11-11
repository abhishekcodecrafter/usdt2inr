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
                // console.log("Secret received:", secret); 
                showToast('success',`OTP sent to ${phoneNumber}`)
                otpButton.textContent = 'Resend OTP';
            } else {
                console.error("Failed to receive secret from server");
                showToast('error',`Failed to send OTP. ${responseData.message || 'Please try again.'}`)
            }
        })
        .catch(error => {
            console.error('Error in OTP sending process:', error);
            hideSpinner();
            showToast('error',`An error occurred: ${error.message}. Please try again.'}`)
        });
    } else {
        hideSpinner();
        showToast('error',`Invalid phone number: ${phoneNumber}. Please enter a valid 10-digit number.'}`)
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
        showToast('warning',`Please enter both passwords.'}`)
        return false;
    }

    if (formData.newPassword !== formData.reenterPassword) {
        showToast('warning',`Passwords do not match. Please try again.`)
        return false;
    }

    if (formData.newPassword.length < 6) {
        showToast('warning',`Password must be at least 6 characters long.`)
        return false;
    }

    if (!formData.securityOTP || formData.securityOTP.length !== 6 || isNaN(formData.securityOTP)) {
        showToast('warning',`Please enter a valid 6-digit OTP.`)
        return false;
    }

    if (!secret) {
        showToast('warning',`Please request an OTP before submitting.`)
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
        showToast('error',`OTP not requested. Please request a new OTP.`)
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
            showToast('success',`OTP verified successfully. Changing your password...`)
            changeWithdrawalPassword(formData);
        } else {
            hideSpinner();
            showToast('error',`Invalid OTP. Please enter the correct OTP.`)
        }
    })
    .catch(error => {
        console.error('Error verifying OTP:', error);
        hideSpinner();
        showToast('error',`An error occurred while verifying OTP. Please try again.`)
    });
}

function changeWithdrawalPassword(formData) {
    const data = {
        ...formData,
        secret: secret
    };

    fetch('/change_wdtpassword', {
        method: 'POST',
        headers: {'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(responseData => {
        hideSpinner();
        if (responseData.success) {
            showToast('success',`Changed withdrawals password successfully.`)
            clearForm();
            setTimeout(function() {
                window.location.href = "/profile";
            }, 2000);
        } else {
            showToast('error',`Error changing withdrawals password. Please try again.`)
        }
    })
    .catch(error => {
        console.error('Error changing withdrawals password:', error);
        hideSpinner();
        showToast('error',`Error changing withdrawals password. Please try again.`)
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