document.addEventListener("DOMContentLoaded", function () {
  const arrowDiv = document.getElementById('arrowDiv');
  console.log('Arrow back button is clicked.');
  arrowDiv.addEventListener('click', function () {
    var currentUrl = window.location.href;
var urlParams = new URLSearchParams(window.location.search);
var redirection = urlParams.get('redirect');
if (redirection === 'dash') {
    redirectTo('/dashboard');
} else {
    redirectTo('/fullprofile');
}
  });
});


function submitDeposit() {
    const walletAddress = $('#wallet-address').text();
    const txnID = document.getElementById('txnID').value;

    const data = {
        "address" : walletAddress,
        "txnId" : txnID
    }

    fetch('/submitDeposit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })

    .then(response => response.json())
    .then(responseData => {
        if (responseData.success) {
            showToast('success', `${responseData.message}`);
            setTimeout(function () {
                window.location.href = '/dashboard';
            }, 4000);
        } else {
            console.error('Error on submit deposit', responseData);
            showToast('error', `${responseData.message}`);
        }
        var input = document.getElementById('txnID');
        input.value = ''
    })
    .catch(error => {
        console.error('Error on submit deposit', error);
    });
}

function submitDeposit2() {
    const walletAddress = $('#wallet-address').text();
    const txnID = document.getElementById('txnID').value;

    const data = {
        "address" : walletAddress,
        "txnId" : txnID
    }

    fetch('/submitDeposit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })

    .then(response => response.json())
    .then(responseData => {
        if (responseData.success) {
            showToast('success', `${responseData.message}`);
            setTimeout(function () {
                window.location.href = '/dashboard';
            }, 4000);
        } else {
            console.error('Error on submit deposit', responseData);
            showToast('error', `${responseData.message}`);
        }
        var input = document.getElementById('txnID');
        input.value = ''
    })
    .catch(error => {
        console.error('Error on submit deposit', error);
    });
}


function copyWalletAddress() {
    try {
        const walletAddress = $('#wallet-address').text();

       const tempInput = $('<input>');
        $('body').append(tempInput);
        tempInput.val(walletAddress).select();

        document.execCommand('copy');

        tempInput.remove();

        showToast('success','Wallet Address copied')
    } catch (error) {
        console.error('Error copying wallet address:', error);
    }
}


function redirectTo(page) {
    window.location.href = page;
}

let countdownTime =  $('#my-data').data("other");
console.log(countdownTime)
console.log(countdownTime) // time in minutes from Jinja

let remainingTime = countdownTime * 60; // Convert minutes to seconds

// Function to update the countdown timer
function updateTime() {
    const timeDisplay = document.getElementById('time-display');

    if (remainingTime > 0) {
        const minutes = Math.floor(remainingTime / 60);
        const seconds = Math.floor(remainingTime % 60);
        timeDisplay.innerHTML = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;

        remainingTime--; // Decrease remaining time by 1 second
    } else {
        showPopup();
    }
}

// Function to show the popup when the time expires
function showPopup() {
    const popup = document.getElementById('popup');
    popup.style.display = 'block';  // Show popup
    clearInterval(countdownInterval); // Stop the countdown
}

// Function to close the popup
function closePopup() {
    const popup = document.getElementById('popup');
    popup.style.display = 'none'; // Hide popup
    window.location.href= "/dashboard";
}

// Update time every second
const countdownInterval = setInterval(updateTime, 1000);

// Initially display time
updateTime();
