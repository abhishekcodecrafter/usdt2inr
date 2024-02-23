const verificationBox = document.getElementById('verificationBox');
const verificationMessage = document.getElementById('verificationMessage');
verificationMessage.setAttribute('hidden', 'true');
const otpbox = document.getElementById('otp');
const loginsignupbtn = document.getElementById('btn-verification');
const verifyotpelements = document.getElementById('sendotp');



otpbox.setAttribute('hidden', 'true');
loginsignupbtn.setAttribute('hidden', 'true');


function sendOTP() {
    const phoneNumber = document.getElementById('phoneNumber').value;

    if (phoneNumber && phoneNumber.length === 10 && !isNaN(phoneNumber)) {
        // Generate a random OTP
        const otp = Math.floor(1000 + Math.random() * 9000);

        // Prepare the data for the API request
        const data = {
            number: phoneNumber,
            code: otp,
        };

        // Make the API request to send the verification code
        fetch('/sendVerification', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })

        .then(response => response.json())
        .then(responseData => {
            // Check the response and handle accordingly
            if (responseData.success) {
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

    if (otpEntered && !isNaN(otpEntered) && otpEntered.length === 4) {
        // Prepare the data for the API request
        const phoneNumber = document.getElementById('phoneNumber').value;
        const data = {
            number: phoneNumber,
            enteredCode: otpEntered,
        };

        console.log(data);

        // Make the API request to verify the entered OTP
        fetch('/verifyCode', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })


        .then(response => response.json())
        .then(responseData => {
            console.log('response Data : ',responseData)
            if (responseData.success) {

                verificationMessage.removeAttribute('hidden');
                verificationBox.removeAttribute('hidden');
                verificationMessage.innerText = 'Authentication successful! Redirecting to the dashboard...';


                // Define the data to be sent
                const userData = {
                    phonenumber: phoneNumber,  // Replace with the actual data from your form
                    usdtbalance: 0,
                    active: true,
                    deposit_address: 'abc123',
                    totaltxns:0,
                };

                addUser(userData,
                    function (successResponse) {
                        // User created successfully, handle the success case
                        console.log('User created successfully');
                    },
                    function (errorResponse) {
                        // Error creating user, handle the error case
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
