const verificationBox = document.getElementById('verificationBox');
const verificationMessage = document.getElementById('verificationMessage');
const successMessage = document.getElementById("successMessage");
const otpbox = document.getElementById('otp');
const loginsignupbtn = document.getElementById('btn-verification');
const verifyotpelements = document.getElementById('sendotp');
const sendotp = document.getElementById('otpButton');
const resendOtp = document.getElementById('resendOtpText');
var secret = null;


function sendOTP() {
    const phoneNumber = document.getElementById('phoneNumber').value;
    if (phoneNumber && phoneNumber.length === 10 && !isNaN(phoneNumber)) {
        fetch('/sendVerification', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                number: phoneNumber
            })
        })
        .then(response => response.json())
        .then(responseData => {
            // Check the response and handle accordingly
            if (responseData.success) {
                secret = responseData['secret']
                let wrongNumberLink = "window.location.href = '/';";
                verificationMessage.removeAttribute('hidden');
                verificationBox.removeAttribute('hidden');
                sendotp.setAttribute('hidden', 'true');
                showToast('success', `OTP sent to ${phoneNumber}`);
                verificationMessage.innerHTML = `OTP sent to ${phoneNumber} <br> <a href="${wrongNumberLink}" style="color: gray; text-decoration: underline;">Wrong number?</a>`;
                verifyotpelements.setAttribute('hidden', 'true');
                otpbox.removeAttribute('hidden');
                loginsignupbtn.removeAttribute('hidden');
                resendOtp.removeAttribute('hidden');
            } else {
                showToast('error', `Failed to send OTP to ${phoneNumber} server IDLE`);
            }
        })
        .catch(error => {
            showToast('error', `An error occurred while sending OTP. Please try again.`);
        });
    } else {
        showToast('error', `Please enter a valid 10-digit phone number.`);
    }
}

function authenticateUser() {
    const otpEntered = document.getElementById('otp').value;
    if (otpEntered && !isNaN(otpEntered) && otpEntered.length === 6) {
        // Prepare the data for the API request
        const phoneNumber = document.getElementById('phoneNumber').value;
        const data = {
            number: phoneNumber,
            enteredCode: otpEntered,
            secret: secret
        };

        fetch('/verifyCode', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(responseData => {
            if (responseData.success) {
                const userData = {
                    phone_number: phoneNumber,
                };
                addUser(userData,
                    function (successResponse) {
                        showToast('success', `Success`);
                    },
                    function (errorResponse) {
                        showToast('error', `An error occurred while verifying OTP. Please try again.`);
                        console.error(`Error: ${errorResponse.message}`);
                    }
                );
            } else {
                showToast('error', `Invalid OTP. Please enter the correct OTP.`);
            }
        })
        .catch(error => {
            showToast('error', `An error occurred while verifying OTP. Please try again.`);
        });
    } else {
        showToast('error', `Invalid OTP. Please enter the correct OTP.`);
    }
}

function addUser(data, successCallback, errorCallback) {
    // Make the API request to add a new user
    fetch('/add_user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    
    .then(response => response.json())
    .then(responseData => {
        console.log('add user Response Data:', responseData);
        // Handle the response accordingly in your frontend code
        if (responseData.success) {
            // User created successfully, call the success callback
            if (successCallback) {
                successCallback(responseData);
            }
            setTimeout(function () {
                window.location.href = '/wp';
            }, 1000);

        } else {
            // Error creating user, call the error callback
            if (responseData.message === 'User already exists') {
                setTimeout(function () {
                    window.location.href = '/dashboard';
                }, 1000);
            }
            
            if (successCallback) {
                successCallback(responseData);
            }
        }
    })
    .catch(error => {
        console.error('Error:', error);
        // Handle the error case
        if (errorCallback) {
            errorCallback({ success: false, message: `Error: ${error}` });
        }
    });
}
