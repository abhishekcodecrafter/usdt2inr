console.log("Script Loaded");

const verificationBox = document.getElementById('verificationBox');
const verificationMessage = document.getElementById('verificationMessage');

verificationMessage.setAttribute('hidden', 'true');

const loginsignupbtn = document.getElementById('btn-verification');
const verifyotpelements = document.getElementById('sendotp');

var secret;

function sendPassword() {
    const formData = getFormData();

    // Make the API request to change the password
    fetch('/change_wdtpassword', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
    .then(response => response.json())
    .then(responseData => {
        if (responseData.success) {
            // Reset the form after successful submission
            document.getElementById("form").reset();
            // Handle the success response from the server
            console.log('Password changed successfully:', responseData);

            verificationMessage.innerText = `Password Saved successfully a mile away from dashboard`;
            verificationBox.removeAttribute('hidden');
            verificationMessage.removeAttribute('hidden');

            
            setTimeout(function() {
                window.location.href = "/dashboard";
            }, 3000);
        } else {
            verificationMessage.setAttribute('hidden', 'true');
            verificationBox.setAttribute('hidden', 'true');
            verificationMessage.innerText = responseData.message;
        }
    })
    .catch(error => {
        console.error('Error changing password:', error);
        verificationMessage.setAttribute('hidden', 'true');
        verificationBox.setAttribute('hidden', 'true');
        verificationMessage.innerText = `Error changing password. Please try again.`;
    });
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


$(document).ready(function() {
    $('#form').submit(function(event) {
        event.preventDefault();
        sendPassword();
    });
});

function getFormData() {
    const phoneNumber = document.querySelector('#phoneNumber').textContent.trim();
    const newPassword = $('#newPassword').val().trim();
    const reenterPassword = $('#reenterPassword').val().trim();

    return {
        phoneNumber: phoneNumber,
        newPassword: newPassword,
        reenterPassword: reenterPassword
    };
}