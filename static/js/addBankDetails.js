$(document).ready(function() {
    // Prevent the default form submission behavior
    $("#form").submit(function(event) {
      event.preventDefault();
  
      // Get the form data
      var formData = {
        accountNumber: $("#accountNumber").val(),
        accountHolderName: $("#accountHolderName").val(),
        ifscNumber: $("#ifscNumber").val()
      };
  
      // Log the form data to the console
      console.log("Form Data:", formData);
  
      // Send the form data to the server-side
      $.ajax({
        type: "POST",
        url: "submit_bank_details.php", // Replace "submit_bank_details.php" with your server-side script URL
        data: formData,
        dataType: "json",
        success: function(response) {
          // Handle the server response here (if needed)
          console.log("Form submitted successfully");
          console.log(response); // Log the response from the server
        },
        error: function(xhr, status, error) {
          // Handle errors here (if any)
          console.error("Error occurred while submitting the form:", error);
        }
      });
    });
  });
  