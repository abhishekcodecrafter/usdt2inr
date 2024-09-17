function openAvatarPopup() {
    const popup = document.getElementById('avatarPopup');
    const avatarList = document.getElementById('avatarList');
    avatarList.innerHTML = ''; // Clear existing avatars

    for (let i = 11; i <= 34; i++) {
        const avatarSrc = `static/assets/avatars/av${i}.jpg`;
        const avatarImg = document.createElement('img');
        avatarImg.src = avatarSrc;
        avatarImg.alt = `Avatar ${i}`;
        avatarImg.className = 'avatar-option';
        avatarImg.onclick = () => changeAvatar(avatarSrc);
        avatarList.appendChild(avatarImg);
    }

    popup.style.display = 'block';
}

function closeAvatarPopup() {
    document.getElementById('avatarPopup').style.display = 'none';
}

function changeAvatar(newAvatarSrc) {
    const avatar = document.getElementById('avatar');
    avatar.src = newAvatarSrc;
    localStorage.setItem('selectedAvatar', newAvatarSrc);
    closeAvatarPopup();
    showToast('success',`Avatar updated successfully`);
}

function redirectTo(url) {
    window.location.href = url;
}

function copyInviteLink() {
    const inviteLink = document.getElementById('invite-code').textContent;
    if (!inviteLink) {
        showToast('error', 'Invite link not available');
        return;
    }

    if (navigator.clipboard && window.isSecureContext) {
        // For modern browsers
        navigator.clipboard.writeText(inviteLink)
            .then(() => {
                showToast('success', 'Invite link copied to clipboard!');
            })
            .catch((err) => {
                console.error('Failed to copy: ', err);
                showToast('error', 'Failed to copy invite link');
            });
    } else {
        // Fallback for older browsers
        let textArea = document.createElement("textarea");
        textArea.value = inviteLink;
        textArea.style.position = "fixed";  // Avoid scrolling to bottom
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            let successful = document.execCommand('copy');
            if (successful) {
                showToast('success', 'Invite link copied to clipboard!');
            } else {
                showToast('error', 'Failed to copy invite link');
            }
        } catch (err) {
            console.error('Failed to copy: ', err);
            showToast('error', 'Failed to copy invite link');
        }

        document.body.removeChild(textArea);
    }
}

function showVerificationMessage(message) {
    const verificationBox = document.getElementById('verificationBox');
    const verificationMessage = document.getElementById('verificationMessage');
    verificationMessage.textContent = message;
    verificationBox.hidden = false;
    setTimeout(() => {
        verificationBox.hidden = true;
    }, 2000);
}

function openEditUsernameModal() {
    document.getElementById('editUsernameModal').style.display = 'block';
}

function closeEditUsernameModal() {
    document.getElementById('editUsernameModal').style.display = 'none';
}

function updateUsername() {
const newUsername = document.getElementById('newUsername').value;

if (!newUsername) {
    showToast('Warning', 'Please enter a new username.');
    return;
}

console.log('Sending new username:', newUsername);

fetch('/edit_tg_username', {
method: 'PUT',
headers: {
    'Content-Type': 'application/json',
},
body: JSON.stringify({ newUsername: newUsername }),
})
.then(response => response.json())
.then(data => {
console.log('Server response:', data);
if (data.success) {
    document.getElementById('usernameDisplay').textContent = newUsername;
    closeEditUsernameModal();
    showToast('success',`Username updated successfully`)
} else {
    showToast('error', data.message || 'Failed to update username');
    throw new Error(data.message || 'Failed to update username');
}
})
.catch(error => {
console.error('Error updating username:', error);
showToast('error',`Error updating username: ${error.message}`);
});
}

// Close modals when clicking outside of them
window.onclick = function(event) {
    const editUsernameModal = document.getElementById('editUsernameModal');
    const avatarPopup = document.getElementById('avatarPopup');
    if (event.target == editUsernameModal) {
        closeEditUsernameModal();
    } else if (event.target == avatarPopup) {
        closeAvatarPopup();
    }
}

// Load saved avatar on page load
document.addEventListener('DOMContentLoaded', function () {
    const savedAvatar = localStorage.getItem('selectedAvatar');
    const avatar = document.getElementById('avatar');
    if (savedAvatar) {
        avatar.src = savedAvatar;
    }
});