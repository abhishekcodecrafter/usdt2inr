// Utility function for redirection
function redirectTo(destination) {
    console.log('Redirecting to:', destination);
    window.location.href = destination;
}

// Elements
const verificationBox = document.getElementById('verificationBox');
const verificationMessage = document.getElementById('verificationMessage');

// Copy invite link function
function copyInviteLink() {
    console.log("invitelink called");
    var invite_link = document.getElementById('invite-code');
    navigator.clipboard.writeText(invite_link.innerText).then(function() {
        showVerificationMessage('Invite link copied');
    }, function(err) {
        console.error('Could not copy text: ', err);
        showVerificationMessage('Failed to copy invite link');
    });
}

// Show verification message
function showVerificationMessage(message) {
    verificationMessage.innerText = message;
    verificationBox.removeAttribute('hidden');
    verificationMessage.removeAttribute('hidden');
    setTimeout(function() {
        verificationBox.setAttribute('hidden', true);
        verificationMessage.setAttribute('hidden', true);
    }, 2000);
}

// Avatar popup functions
function openAvatarPopup() {
    const modal = document.createElement('div');
    modal.id = 'avatarModal';
    modal.className = 'modal';
    modal.style.display = 'block';

    const modalContent = `
        <div class="modal-content">
            <span class="close" onclick="closeAvatarPopup()">&times;</span>
            <h2 class="modal-title">Select Avatar</h2>
            <div id="avatarList" class="avatar-list"></div>
        </div>
    `;

    modal.innerHTML = modalContent;
    document.body.appendChild(modal);

    const avatarList = document.getElementById('avatarList');
    for (let i = 11; i <= 35; i++) {
        const avatarSrc = `static/assets/avatars/av${i}.jpg`;
        avatarList.innerHTML += `
            <img src="${avatarSrc}" alt="Avatar ${i}" class="avatar-option" onclick="changeAvatar('${avatarSrc}')">
        `;
    }

    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeAvatarPopup();
        }
    });
}

function closeAvatarPopup() {
    const modal = document.getElementById('avatarModal');
    document.body.removeChild(modal);
}

function changeAvatar(newAvatarSrc) {
    const avatar = document.getElementById('avatar');
    localStorage.setItem('selectedAvatar', newAvatarSrc);
    avatar.src = newAvatarSrc;
    closeAvatarPopup();
}

// Load saved avatar on page load
document.addEventListener('DOMContentLoaded', function () {
    const savedAvatar = localStorage.getItem('selectedAvatar');
    const avatar = document.getElementById('avatar');
    avatar.src = savedAvatar || 'static/assets/avatars/av16.jpg';
});

// Username editing functions
function openEditUsernameModal() {
    document.getElementById('editUsernameModal').style.display = 'block';
}

function closeEditUsernameModal() {
    document.getElementById('editUsernameModal').style.display = 'none';
}

function updateUsername() {
    const newUsername = document.getElementById('newUsername').value;

    if (!newUsername) {
        alert('Please enter a new username.');
        return;
    }

    // Make an AJAX request to update the username
    fetch('/edit_tg_username', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newUsername: newUsername }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Username updated successfully:', data);
        document.getElementById('usernameDisplay').textContent = newUsername;
        closeEditUsernameModal();
        showVerificationMessage('Username updated successfully');
    })
    .catch(error => {
        console.error('Error updating username:', error);
        alert('Error updating username. Please try again.');
    });
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    if (event.target == document.getElementById('editUsernameModal')) {
        closeEditUsernameModal();
    }
};