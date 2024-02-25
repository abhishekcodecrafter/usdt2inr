function toggleTransactions(activeButton) {
    var withdrawalsButton = document.getElementById("withdrawalsButton");
    var depositsButton = document.getElementById("depositsButton");

    if (activeButton === 'withdrawals') {
        withdrawalsButton.classList.add("active");
        depositsButton.classList.remove("active");
    } else {
        withdrawalsButton.classList.remove("active");
        depositsButton.classList.add("active");
    }
}

// Click on withdrawals button by default on document load
document.addEventListener("DOMContentLoaded", function() {
    toggleTransactions('withdrawals');
});
