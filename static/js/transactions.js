function redirectTo(page) {
    window.location.href = page;
}

function toggleTransactions(type) {
    const withdrawalsSection = document.getElementById('withdrawals');
    const depositsSection = document.getElementById('deposits');
    const tabs = document.querySelectorAll('.tab');

    if (type === 'withdrawals') {
        withdrawalsSection.style.display = 'block';
        depositsSection.style.display = 'none';
    } else {
        withdrawalsSection.style.display = 'none';
        depositsSection.style.display = 'block';
    }

    tabs.forEach(tab => {
        if (tab.textContent.toLowerCase().includes(type)) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
}

// Initialize the page with the withdrawals tab active
document.addEventListener('DOMContentLoaded', function() {
    toggleTransactions('withdrawals');
});