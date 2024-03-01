const verificationBox = document.getElementById('verificationBox');
const verificationMessage = document.getElementById('verificationMessage');


document.addEventListener("DOMContentLoaded", function() {
    var arrow = document.getElementById("scrollArrow");
  
    var container = document.querySelector(".container");
  
    window.addEventListener("scroll", function() {
      if (isElementInViewport(container)) {
        arrow.style.display = "block";
      } else {
        arrow.style.display = "none";  
      }
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
            accountNo: $("#usdtaddress").val(),
            transactionPassword: $("#transactionPassword").val()
        };

        console.log("Data to be sent:", data);

        // Display loading spinner or some indicator here

        fetch('/create_USDT_wdt_request', {
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
                console.log('USDT WDT Details submitted successfully:', responseData);
                // Additional logic as needed

                verificationMessage.removeAttribute('hidden');
                verificationBox.removeAttribute('hidden');
                verificationMessage.innerText = `USDT WDT Details submitted successfully.`;

                setTimeout(function() {
                  window.location.href = "/fullprofile";
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
            // Remove loading spinner or indicator here

            // Handle the error response from the server
            console.error('Error submitting INR WDT Details:', error);

            verificationMessage.removeAttribute('hidden');
            verificationBox.removeAttribute('hidden');
            verificationMessage.innerText = `Error submitting INR WDT Details.`;

            // Prevent form submission on error
        });
    });
});