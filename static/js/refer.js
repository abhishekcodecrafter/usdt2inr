function redirectTo(page) {
    window.location.href = page;
}

function showTab(tabId) {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => tab.classList.remove('active'));
    tabContents.forEach(content => content.style.display = 'none');

    document.querySelector(`.tab:nth-child(${tabId === 'referralEarnings' ? '1' : '2'}`).classList.add('active');
    document.getElementById(tabId).style.display = 'block';
}

function copyReferralCode() {
    const referralCode = document.getElementById('referralCode').innerText;
    const fullLink = `https://whatever.com/${referralCode}`;

    // Create a temporary textarea element to hold our text
    const tempTextArea = document.createElement('textarea');
    tempTextArea.value = fullLink;
    
    // Make the textarea out of viewport
    tempTextArea.style.position = 'fixed';
    tempTextArea.style.left = '-999999px';
    tempTextArea.style.top = '-999999px';
    document.body.appendChild(tempTextArea);

    // Select and copy the text
    tempTextArea.focus();
    tempTextArea.select();

    let success = false;
    try {
        success = document.execCommand('copy');
    } catch (err) {
        console.error('Failed to copy: ', err);
    }

    // Remove the temporary element
    document.body.removeChild(tempTextArea);

    // Show appropriate toast message
    if (success) {
        showToast('success', 'Referral link copied to clipboard!');
    } else {
        showToast('error', 'Failed to copy referral link');
    }
}

function shareReferralCode() {
    const referralCode = document.getElementById('referralCode').innerText;
    const fullLink = `https://whatever.com/${referralCode}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'My Referral Code',
            text: 'Use my referral code to sign up!',
            url: fullLink
        }).then(() => {
            showToast('success', 'Thanks for sharing!');
        }).catch((error) => {
            console.error('Error sharing:', error);
            copyReferralCode(); // Fallback to copying if sharing fails
        });
    } else {
        copyReferralCode(); // If Web Share API is not available, just copy the link
    }
}

// function showToast() {
//     const toast = document.getElementById('toast');
//     toast.classList.add('show');
//     setTimeout(() => {
//         toast.classList.remove('show');
//     }, 3000);
// }