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
            var successMsg = document.getElementById('deposit-alert');
            successMsg.style.display = 'block';
            setTimeout(function () {
                successMsg.style.display = 'none';
                window.location.href = '/dashboard';
            }, 3000);
        } else {
            console.error('Error on submit deposit', responseData);
            var errorMsg = document.getElementById('deposit-alert');
            errorMsg.innerHTML = responseData.message
            errorMsg.style.display = 'block';
            setTimeout(function () {
                errorMsg.style.display = 'none';
            }, 3000);
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


function redirectTo(page) {
    window.location.href = page;
}
