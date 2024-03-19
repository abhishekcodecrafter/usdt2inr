$(document).ready(function(){
    $('#bankModal').modal('show');
  });

  document.getElementById("selectBank").addEventListener("click", function() {
    $('#bankModal').modal('show');
  });


  function fillForm(accountNo, accountName, ifsc) {
    document.getElementById("accountNo").value = accountNo;
    document.getElementById("accountName").value = accountName;
    document.getElementById("ifsc").value = ifsc;
    $('#bankModal').modal('hide'); 
    $('#amount').focus();
  }
  
  
  


document.addEventListener("DOMContentLoaded", function () {
    const arrowDiv = document.getElementById('scrollArrow');
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






const verificationBox = document.getElementById('verificationBox');
const verificationMessage = document.getElementById('verificationMessage');  
  
  
  document.addEventListener("DOMContentLoaded", function() {
        var arrow = document.getElementById("scrollArrow");
        var container = document.querySelector(".container");
    
        window.addEventListener("scroll", function() {
            arrow.style.display = isElementInViewport(container) ? "block" : "none";
        });
    
        function isElementInViewport(el) {
            var rect = el.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        }


        var ifscInput = document.getElementById('ifsc');

        ifscInput.addEventListener('input', function(event) {
            var inputValue = event.target.value;
        
            var serverEndpoint = '/Validate_IFSC';
        
            var data = {
                ifsc: inputValue
            };
        
            fetch(serverEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })

            .then(response => response.json())
            .then(response_data => {
                console.log(response_data);
                if (response_data.status == 'Success'){
                    msgbox = document.getElementById("Validation_Msg")
                    msgbox.innerHTML = `Bank Found Successfully. <span style="color: green;">${response_data.bank_details['BANK']}</span>`;
                }
                if (response_data.status == 'Failed'){
                    msgbox = document.getElementById("Validation_Msg")
                    msgbox.innerHTML = `Not a Valid IFSC Code: <span style="color: red;">${inputValue}</span>`;
                }
            })
            .catch(error => {
                console.error('Error:', error);
                msgbox = document.getElementById("Validation_Msg")
                msgbox.innerHTML = `Server Error : ${error}`;
            });
        });
        

    });
    
    function redirectTo(page) {
        window.location.href = page;
    }
    
    $(document).ready(function() {
        $("#form").submit(function(event) {
            event.preventDefault();
    
            var data = {
                phone: $("#phone").text().trim(),
                amount: $("#amount").val(),
                accountNo: $("#accountNo").val(),
                accountName: $("#accountName").val(),
                ifsc: $("#ifsc").val(),
                transactionPassword: $("#transactionPassword").val()
            };
    
            console.log("Data to be sent:", data);

            // Display loading spinner or some indicator here

            fetch('/create_INR_wdt_request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            .then(response => response.json())
            .then(responseData => {
                // Remove loading spinner or indicator here
    
                if (responseData.success) {
                    // Reset the form after successful submission
                    document.getElementById("form").reset();
                    // Handle the success response from the server
                    console.log('success:', responseData);

                    verificationMessage.innerText = `Order Details Submitted successfully.`;
                    verificationBox.removeAttribute('hidden');
                    verificationMessage.removeAttribute('hidden');
                    setTimeout(function() {
                        window.location.href = "/dashboard";
                    }, 3000);
                } else {
                    var Forgotpassword = "/cwp";
                    var RechargeNow = "/usdt_deposit_info?redirect=usdtwithdraw";
                    
                    if (responseData.message === "Authentication failed") {
                        verificationMessage.innerHTML = `Wrong Transaction Password. Authentication failed. <br> <a href="${Forgotpassword}" style="color: bisque; text-decoration: underline;">Forgot Password?</a>`;
                        verificationBox.removeAttribute('hidden');
                        verificationMessage.removeAttribute('hidden');
                    }
                    
                    if (responseData.message === "Insufficient balance To Trade!") {
                        verificationMessage.innerHTML = `Insufficient balance To Trade! <br> <a href="${RechargeNow}" style="color: bisque; text-decoration: underline;">Recharge Now</a>`;
                        verificationBox.removeAttribute('hidden');
                        verificationMessage.removeAttribute('hidden');
                    }
                    
                    if (responseData.message !== "Authentication failed" && responseData.message !== "Insufficient balance To Trade!") {
                        verificationMessage.innerText = responseData.message;
                        verificationBox.removeAttribute('hidden');
                        verificationMessage.removeAttribute('hidden');
                    }
                    
                }
            })
            .catch(error => {
                console.error('Error submitting INR WDT Details:', error);
                
                verificationMessage.innerText = `Error occurred. Please try again`;
                    verificationBox.removeAttribute('hidden');
                    verificationMessage.removeAttribute('hidden');
            });
        });
    });
