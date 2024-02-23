document.addEventListener("DOMContentLoaded", function () {
  const arrowDiv = document.getElementById('arrowDiv');
  console.log('Arrow back button is clicked.');
  arrowDiv.addEventListener('click', function () {
    redirectTo('/dashboard');
  });
});

function submitDeposit() {
    const walletAddress = $('#wallet-address').text();
    var txnID = document.getElementById('txnID').value;

    console.log(walletAddress)
    console.log(txnID)
    const data = {
        "address" : walletAddress,
        "txnId" : txnId
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
            var successMsg = document.getElementById('successmsg');
            successMsg.style.display = 'block';
            setTimeout(function () {
                successMsg.style.display = 'none';
            }, 2000);
        } else {
            console.error('Error on submit deposit', responseData);
        }
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

        var successMsg = document.getElementById('successmsg');
        successMsg.style.display = 'block';
        setTimeout(function () {
            successMsg.style.display = 'none';
        }, 3000);
    } catch (error) {
        console.error('Error copying wallet address:', error);
    }
}

async function updateQRCode() {
    try {
        const qrCodePath = `./assets/qr-codes/1.png`;
        $('#qr-code-img').attr('src', qrCodePath);
    } catch (error) {
        console.error('Error updating QR code:', error);
    }
}


setInterval(async function () {
    await updateQRCode();
}, 1800000);



document.addEventListener('DOMContentLoaded', function () {

    // Check if countdown is already started
    var countdownStarted = localStorage.getItem('countdownStarted');
    var countdownStartTime = localStorage.getItem('countdownStartTime');

    if (!countdownStarted || isCountdownExpired(countdownStartTime)) {
        // If countdown is not started or already expired, start a new countdown
        startCountdown();
    } else {
        // If countdown is already started and not expired, resume the existing countdown
        resumeCountdown(parseInt(countdownStartTime)); // Parse to integer
    }

    function startCountdown() {
        var countdownTimeInSeconds = isCountdownExpired(countdownStartTime) ? 0 : 30 * 60;

        var countdownElement = document.getElementById('countdown');

        var countdownInterval = setInterval(function () {
            var minutes = Math.floor(countdownTimeInSeconds / 60);
            var seconds = countdownTimeInSeconds % 60;

            var formattedTime = padNumber(minutes) + ':' + padNumber(seconds);

            countdownElement.textContent = formattedTime;

            countdownTimeInSeconds--;

            if (countdownTimeInSeconds < 0) {
                clearInterval(countdownInterval);
                countdownElement.textContent = 'Time expired';
            }
        }, 1000);

        // Save countdown start information to localStorage
        localStorage.setItem('countdownStarted', true);
        localStorage.setItem('countdownStartTime', new Date().getTime());
    }

    function resumeCountdown(startTime) {
        var currentTime = new Date().getTime();
        var elapsedSeconds = Math.floor((currentTime - startTime) / 1000);

        var remainingSeconds = Math.max(30 * 60 - elapsedSeconds, 0);

        var countdownElement = document.getElementById('countdown');
        var countdownInterval = setInterval(function () {
            var minutes = Math.floor(remainingSeconds / 60);
            var seconds = remainingSeconds % 60;

            var formattedTime = padNumber(minutes) + ':' + padNumber(seconds);

            countdownElement.textContent = formattedTime;

            remainingSeconds--;

            if (remainingSeconds < 0) {
                clearInterval(countdownInterval);
                countdownElement.textContent = 'Time expired';

                // Add logic here to handle countdown expiration
                // You may want to make a request to the server or perform other actions.
            }
        }, 1000);
    }

    function isCountdownExpired(startTime) {
        var currentTime = new Date().getTime();
        var elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
        return elapsedSeconds >= 30 * 60 || elapsedSeconds < 0; 
    }

    function padNumber(number) {
        return (number < 10 ? '0' : '') + number;
    }
});


function redirectTo(page) {
    window.location.href = page;
}
