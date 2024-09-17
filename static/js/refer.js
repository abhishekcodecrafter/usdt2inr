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
    navigator.clipboard.writeText(fullLink).then(() => {
        showToast();
    });
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
            console.log('Thanks for sharing!');
        }).catch(console.error);
    } else {
        // Fallback for browsers that don't support Web Share API
        copyReferralCode();
    }
}

function showToast() {
    const toast = document.getElementById('toast');
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}