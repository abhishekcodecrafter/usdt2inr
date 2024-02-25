$(document).ready(function() {
    $('.bottom-nav a').click(function() {
      $('.bottom-nav a').removeClass('active');
      $(this).addClass('active');
    });
  });


  function copyMobileNumber() {
var mobileNumber = document.getElementById('mobileNumber');
var tempInput = document.createElement('input');
document.body.appendChild(tempInput);
tempInput.value = mobileNumber.innerText;
tempInput.select();
document.execCommand('copy');
document.body.removeChild(tempInput);
var successMsg = document.getElementById('successmsg');
successMsg.style.display = 'block';
successMsg.innerText = 'Mobile Number Copied!!'; 

setTimeout(function () {
    successMsg.style.display = 'none';
}, 3000);

}

function copyInvitationCode() {
    var mobileNumber = document.getElementById('invitationNumber');
    var tempInput = document.createElement('input');
    document.body.appendChild(tempInput);
    tempInput.value = mobileNumber.innerText;
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    alert('Invitation Code Copied!');
}


function copyInvitationLink() {
    var invitationLink = "Your Invitation Link";
    var tempInput = document.createElement('input');
    document.body.appendChild(tempInput);
    tempInput.value = invitationLink;
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    alert('Invitation Link Copied!');
}

function redirectTo(page) {
  window.location.href = page;
}


function updateUsername() {
  var newUsername = $('#newUsername').val();

  // Check if the newUsername is not empty
  if (!newUsername) {
    alert('Please enter a new username.');
    return;
  }

  // Make an AJAX request to update the username
  $.ajax({
    url: '/edit_tg_username',
    type: 'PUT',
    data: { newUsername: newUsername },
    success: function(response) {
      // Handle the success response from the server
      console.log('Username updated successfully:', response);

       // Update the username on the page
    $('#usernameElement').text(newUsername);
    
      // Close the modal
      $('#editUsernameModal').modal('hide');
    },
    error: function(error) {
      // Handle the error response from the server
      console.error('Error updating username:', error);
      // Display an error message
      alert('Error updating username. Please try again.');
    }
  });
}



$(document).ready(function() {
  // Check if the content of tusername is empty
  const tusername = $('#tusername').text().trim();

  if (tusername === 'None') {
    console.log('Username does not exist.');
    // Show the editUsernameModal
    $('#editUsernameModal').modal('show');
  } else {
    console.log('Username Exists:', tusername);
  }
});


