document.addEventListener("DOMContentLoaded", function () {
  const arrowDiv = document.getElementById('arrowDiv');
  console.log('Arrow back button is clicked.');
  arrowDiv.addEventListener('click', function () {
    redirectTo('/dashboard');
  });
});

function submitDeposit() {
    const walletAddress = $('#wallet-address').text();
    const txnID = document.getElementById('txnID').value;

    console.log(walletAddress)
    console.log(txnID)
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
            var successMsg = document.getElementById('successmsg');
            successMsg.style.display = 'block';
            setTimeout(function () {
                successMsg.style.display = 'none';
                window.location.href = '/dashboard';
            }, 3000);
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


function redirectTo(page) {
    window.location.href = page;
}
