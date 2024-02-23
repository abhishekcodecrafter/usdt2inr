const verificationBox = document.getElementById('verificationBox');
const verificationMessage = document.getElementById('verificationMessage');
verificationMessage.setAttribute('hidden', 'true');
const otpbox = document.getElementById('otp');
const loginsignupbtn = document.getElementById('btn-verification');
const verifyotpelements = document.getElementById('sendotp');
otpbox.setAttribute('hidden', 'true');
loginsignupbtn.setAttribute('hidden', 'true');
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
                verificationMessage.removeAttribute('hidden');
                verificationBox.removeAttribute('hidden');
                verificationMessage.innerText = `OTP sent to ${phoneNumber}`;
                console.log("Using Static Folder JS");
                verifyotpelements.setAttribute('hidden', 'true');
                otpbox.removeAttribute('hidden');
                loginsignupbtn.removeAttribute('hidden');
            } else {
                verificationMessage.removeAttribute('hidden');
                verificationBox.removeAttribute('hidden');
                verificationMessage.innerText = `Failed to send OTP to ${phoneNumber} server IDLE`;
            }
        })
        .catch(error => {
            console.error('Error sending OTP:', error);
            verificationMessage.removeAttribute('hidden');
            verificationBox.removeAttribute('hidden');
            verificationMessage.innerText = `An error occurred while sending OTP. Please try again.`;
        });
    } else {
        verificationMessage.removeAttribute('hidden');
        verificationBox.removeAttribute('hidden');
        verificationMessage.innerText = `Please enter a valid 10-digit phone number.`;
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
                verificationMessage.removeAttribute('hidden');
                verificationBox.removeAttribute('hidden');

                const userData = {
                    phone_number: phoneNumber,
                };
                addUser(userData,
                    function (successResponse) {
                        verificationMessage.innerText = 'Success';
                        console.log('User created successfully');
                    },
                    function (errorResponse) {
                        verificationMessage.innerText = 'An error occurred while verifying OTP. Please try again.';
                        console.error(`Error: ${errorResponse.message}`);
                    }
                );
            } else {
                verificationMessage.removeAttribute('hidden');
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
                window.location.href = '/dashboard';
            }, 3000);

        } else {
            // Error creating user, call the error callback
            if (responseData.message === 'User with the provided phone number already exists') {
                setTimeout(function () {
                    window.location.href = '/dashboard';
                }, 3000);
            }
            
            if (errorCallback) {
                errorCallback(responseData);
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
