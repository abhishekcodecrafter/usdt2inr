function toggleTransactions(activeButton) {
    var withdrawalsButton = document.getElementById("withdrawalsButton");
    var depositsButton = document.getElementById("depositsButton");
    var withdrawalSection = document.getElementById("withdrawals");
    var depositSections = document.getElementById("deposits");

    if (activeButton === 'withdrawals') {
        withdrawalsButton.classList.add("active");
        depositsButton.classList.remove("active");
        withdrawalSection.style.display = "flex";
        depositSections.style.display = "none";
    } else {
        withdrawalsButton.classList.remove("active");
        depositsButton.classList.add("active");
        depositSections.style.display = "flex";
        withdrawalSection.style.display = "none";
    }
}

// Click on withdrawals button by default on document load
document.addEventListener("DOMContentLoaded", function() {
    toggleTransactions('withdrawals');
});
