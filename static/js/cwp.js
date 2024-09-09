let secret;
const verificationBox = document.getElementById('verificationBox');
const verificationMessage = document.getElementById('verificationMessage');

function sendOTP() {
    const phoneNumber = document.getElementById('phoneNumber').textContent.trim();
    console.log("Sending OTP to:", phoneNumber);

    document.getElementById('spinner').style.display = 'flex';

    if (phoneNumber && phoneNumber.length === 10 && !isNaN(phoneNumber)) {
        const data = { number: phoneNumber };

        fetch('/sendVerification', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(responseData => {
            document.getElementById('spinner').style.display = 'none';
            if (responseData.success) {
                // Don't store the secret on the client side for production
                showVerificationMessage(`OTP sent to ${phoneNumber}`, true);
                document.getElementById('otpButton').textContent = 'Resend OTP';
            } else {
                showVerificationMessage(`Failed to send OTP. ${responseData.message || 'Please try again.'}`, false);
            }
        })
        .catch(error => {
            console.error('Error in OTP sending process:', error);
            document.getElementById('spinner').style.display = 'none';
            showVerificationMessage(`An error occurred: ${error.message}. Please try again.`, false);
        });
    } else {
        document.getElementById('spinner').style.display = 'none';
        showVerificationMessage(`Invalid phone number: ${phoneNumber}. Please enter a valid 10-digit number.`, false);
    }
}

function showVerificationMessage(message, isSuccess) {
    console.log(`Showing verification message: ${message} (Success: ${isSuccess})`);
    verificationMessage.textContent = message;
    verificationBox.hidden = false;
    verificationBox.className = isSuccess ? 'success' : '';
    setTimeout(() => {
        verificationBox.hidden = true;
    }, 5000);
}

document.getElementById('form').addEventListener('submit', function(e) {
    e.preventDefault();
    authenticateUser();
});

function getFormData() {
    return {
        phoneNumber: document.getElementById('phoneNumber').textContent.trim(),
        newPassword: document.getElementById('newPassword').value.trim(),
        reenterPassword: document.getElementById('reenterPassword').value.trim(),
        securityOTP: document.getElementById('securityOTP').value.trim()
    };
}

function authenticateUser() {
    const formData = getFormData();
    const otpEntered = formData.securityOTP;

    if (otpEntered && !isNaN(otpEntered) && otpEntered.length === 6) {
        document.getElementById('spinner').style.display = 'flex';

        fetch('/verifyCode', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                number: formData.phoneNumber,
                enteredCode: otpEntered
            }),
        })
        .then(response => response.json())
        .then(responseData => {
            if (responseData.success) {
                showVerificationMessage('OTP verified successfully. Changing your password...', true);
                changeWithdrawalPassword(formData);
            } else {
                document.getElementById('spinner').style.display = 'none';
                showVerificationMessage('Invalid OTP. Please enter the correct OTP.', false);
            }
        })
        .catch(error => {
            console.error('Error verifying OTP:', error);
            document.getElementById('spinner').style.display = 'none';
            showVerificationMessage('An error occurred while verifying OTP. Please try again.', false);
        });
    } else {
        showVerificationMessage('Invalid OTP. Please enter the correct OTP.', false);
    }
}

function changeWithdrawalPassword(formData) {
    fetch('/change_wdtpassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
    })
    .then(response => response.json())
    .then(responseData => {
        document.getElementById('spinner').style.display = 'none';
        if (responseData.success) {
            showVerificationMessage('Changed withdrawals password successfully.', true);
            clearForm();
            setTimeout(function() {
                window.history.back();
            }, 3000);
        } else {
            showVerificationMessage(responseData.message || 'Error changing withdrawals password. Please try again.', false);
        }
    })
    .catch(error => {
        console.error('Error changing withdrawals password:', error);
        document.getElementById('spinner').style.display = 'none';
        showVerificationMessage('Error changing withdrawals password. Please try again.', false);
    });
}

function clearForm() {
    document.getElementById('newPassword').value = '';
    document.getElementById('reenterPassword').value = '';
    document.getElementById('securityOTP').value = '';
    document.getElementById('passwordMatchError').textContent = '';
    document.getElementById('passwordMatchError').style.display = 'none';
    document.getElementById('otpButton').textContent = 'Send OTP';
}

// Password match checking
document.getElementById('reenterPassword').addEventListener('input', function() {
    const newPassword = document.getElementById('newPassword').value.trim();
    const reenterPassword = this.value.trim();
    const passwordMatchError = document.getElementById('passwordMatchError');

    if (newPassword !== reenterPassword) {
        passwordMatchError.textContent = 'Passwords do not match';
        passwordMatchError.style.color = 'red';
    } else {
        passwordMatchError.textContent = 'Passwords matched';
        passwordMatchError.style.color = 'green';
    }
    passwordMatchError.style.display = 'block';
});sage.removeAttribute('hidden');
                verificationBox.removeAttribute('hidden');
                verificationMessage.innerText = 'Invalid OTP. Please enter the correct OTP.';
            }
        })

        
        .catch(error => {
            console.error('Error verifying OTP:', error);
            verificationMessage.removeAttribute('hidden');
            verificationBox.removeAttribute('hidden');
            verificationMessage.innerText = 'An error occurred while verifying OTP. Please try again.';
        });
    } else {
        verificationMessage.removeAttribute('hidden');
        verificationBox.removeAttribute('hidden');
        verificationMessage.innerText = 'Invalid OTP. Please enter the correct OTP.';
    }
}

$(document).ready(function() {
    $('#reenterPassword').on('input', function() {
        const newPassword = $('#newPassword').val().trim();
        const reenterPassword = $(this).val().trim();

        if (newPassword !== reenterPassword) {
            // Passwords do not match, display an error message
            $('#passwordMatchError').text('Passwords do not match').css('color', 'red').show();
        } else {
            // Passwords match, display a success message in green
            $('#passwordMatchError').text('Passwords matched').css('color', 'green').show();
        }
    });
});




function redirectToProfile() {
    window.location.href = "/profile";
}
