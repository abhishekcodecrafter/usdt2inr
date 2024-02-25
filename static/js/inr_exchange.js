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
                    verificationMessage.innerText = responseData.message;
                    verificationBox.removeAttribute('hidden');
                    verificationMessage.removeAttribute('hidden');
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
