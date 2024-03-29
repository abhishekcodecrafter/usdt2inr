console.log("Script Loaded");

const verificationBox = document.getElementById('verificationBox');
const verificationMessage = document.getElementById('verificationMessage');
verificationMessage.setAttribute('hidden', 'true');
const otpbox = document.getElementById('otp');
const loginsignupbtn = document.getElementById('btn-verification');
const verifyotpelements = document.getElementById('sendotp');




function sendOTP() {
    console.log("function Loaded");
    const phoneNumber = document.querySelector('#phoneNumber').textContent.trim();
    console.log(phoneNumber)


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

$(document).ready(function() {
    $('#form').submit(function(event) {
      
        event.preventDefault();
        
        authenticateUser()

    });
});


function getFormData() {
    const phoneNumber = $('#phoneNumber').text().trim(); 
    const newPassword = $('#newPassword').val().trim();
    const reenterPassword = $('#reenterPassword').val().trim();
    const securityOTP = $('#securityOTP').val().trim();

    

    return {
        phoneNumber: phoneNumber,
        newPassword: newPassword,
        reenterPassword: reenterPassword,
        securityOTP: securityOTP
    };
}

function authenticateUser() {
    const formData = getFormData();

    const otpEntered = formData.securityOTP;

    console.log("Hello Form Data : ",formData)
    if (otpEntered && !isNaN(otpEntered) && otpEntered.length === 4) {
        // Prepare the data for the API request
        const phoneNumber = document.querySelector('#phoneNumber').textContent.trim();
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
                verificationMessage.innerText = 'Authentication successful! changing your password...';


                   // Call the Flask endpoint to change withdrawals password
                   
               // Call the Flask endpoint to change withdrawals password
                fetch('/change_wdtpassword', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                })
                .then(response => response.json())
                .then(responseData => {
                    if (responseData.success){
                        // Reset the form after successful submission
                        document.getElementById("form").reset();

                    // Handle the success response from the server
                    console.log('Withdrawals password changed successfully:', responseData);
                    // Additional logic as needed
                    alert('Changed withdrawals password successfully.');
                } else {
                    // Display an error message
                    alert(responseData.message);
                }
                })
                .catch(error => {
                    // Handle the error response from the server
                    console.error('Error changing withdrawals password:', error);
                    // Display an error message
                    alert('Error changing withdrawals password. Please try again.');
                });



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



function redirectToProfile() {
    window.location.href = "/profile";
}
