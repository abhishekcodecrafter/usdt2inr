function redirectTo(page) {
    window.location.href = page;
  }


  function toggleTransactions(type) {
    const withdrawalsSection = document.getElementById('withdrawals');
    const depositsSection = document.getElementById('deposits');
    const withdrawalsButton = document.getElementById('withdrawalsButton');
    const depositsButton = document.getElementById('depositsButton');

    if (type === 'withdrawals') {
        withdrawalsSection.style.display = 'block';
        depositsSection.style.display = 'none';
        withdrawalsButton.classList.add('active');
        depositsButton.classList.remove('active');
    } else {
        withdrawalsSection.style.display = 'none';
        depositsSection.style.display = 'block';
        withdrawalsButton.classList.remove('active');
        depositsButton.classList.add('active');
    }
}
