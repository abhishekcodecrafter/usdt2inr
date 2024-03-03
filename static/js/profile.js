function redirectTo(destination) {
  console.log('Redirecting to:', destination);
}

const verificationBox = document.getElementById('verificationBox');
const verificationMessage = document.getElementById('verificationMessage');

function copyInviteLink() {
    console.log("invitelink called")
    var invite_link = document.getElementById('invite-code');
    var tempInput = document.createElement('input');
    document.body.appendChild(tempInput);
    tempInput.value = invite_link.innerText;
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    verificationMessage.removeAttribute('hidden');
    verificationBox.removeAttribute('hidden');
    verificationMessage.innerText = `Invite link copied`;
    setTimeout(function() {
        verificationMessage.setAttribute('hidden', true);
        verificationBox.setAttribute('hidden', true);
    }, 2000);
}

function redirectTo(page) {
    window.location.href = page;
}

  
function openAvatarPopup() {
  document.body.style.overflow = 'hidden';

  var modal = document.createElement('div');
  modal.id = 'avatarModal';
  modal.className = 'modal d-flex align-items-center justify-content-center';
  modal.style.display = 'block';

  var modalContent = document.createElement('div');
  modalContent.className = 'modal-content';

  var closeButton = document.createElement('span');
  closeButton.className = 'close';
  closeButton.innerHTML = '&times;';
  closeButton.onclick = function() {
    closeAvatarPopup();
  };

  var title = document.createElement('h2');
  title.innerHTML = 'Select Avatar';

  var avatarListContainer = document.createElement('div');
  avatarListContainer.id = 'avatarList';
  avatarListContainer.className = 'avatar-list';

  modalContent.appendChild(closeButton);
  modalContent.appendChild(title);
  modalContent.appendChild(avatarListContainer);
  modal.appendChild(modalContent);

  document.body.appendChild(modal);

  for (var i = 11; i <= 35; i++) {
    var avatarSrc = 'static/assets/avatars/av' + i + '.jpg';

    var avatarContainer = document.createElement('div');
    avatarContainer.className = 'avatar-option-container';

    var avatarImg = document.createElement('img');
    avatarImg.src = avatarSrc;
    avatarImg.alt = 'Avatar ' + i;
    avatarImg.className = 'avatar-option';
    avatarImg.setAttribute('onclick', 'changeAvatar("' + avatarSrc + '")');

    avatarContainer.appendChild(avatarImg);

    avatarListContainer.appendChild(avatarContainer);
  }

  modal.addEventListener('click', function(event) {
    if (event.target === modal) {
      closeAvatarPopup();
    }
  });
}

function closeAvatarPopup() {
  document.body.style.overflow = '';

  var modal = document.getElementById('avatarModal');
  document.body.removeChild(modal);
}

function changeAvatar(newAvatarSrc) {
  var avatar = document.getElementById('avatar');

  // Save the selected avatar source in localStorage
  localStorage.setItem('selectedAvatar', newAvatarSrc);

  avatar.src = newAvatarSrc;

  closeAvatarPopup();
}

// Load the selected avatar from localStorage on page load
document.addEventListener('DOMContentLoaded', function () {
  var savedAvatar = localStorage.getItem('selectedAvatar');
  var avatar = document.getElementById('avatar');
  
  if (savedAvatar) {
    avatar.src = savedAvatar;
  }
  else {
    avatar.src = 'static/assets/avatars/av16.jpg';
  }
});



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
