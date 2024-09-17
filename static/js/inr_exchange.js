document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('form');
  const accountNoInput = document.getElementById('accountNo');
  const accountNameInput = document.getElementById('accountName');
  const ifscInput = document.getElementById('ifsc');
  const modal = document.getElementById('bankModal');
  const scrollArrow = document.getElementById('scrollArrow');

  let isNewBank = false;

  // Check if modal exists before accessing its properties
  const closeBtn = modal ? modal.querySelector('.close') : null;
  const newBankOption = document.getElementById('newBankOption');

  // Event listeners
  if (form) form.addEventListener('submit', handleFormSubmit);
  if (ifscInput) ifscInput.addEventListener('input', validateIFSC);
  [accountNoInput, accountNameInput, ifscInput].forEach(input => {
      if (input) input.addEventListener('click', showModal);
  });
  if (closeBtn) closeBtn.addEventListener('click', hideModal);
  if (newBankOption) newBankOption.addEventListener('click', enableNewBankEntry);
  if (scrollArrow) scrollArrow.addEventListener('click', handleBackArrow);

  // Event delegation for bank cards
  if (modal) {
    modal.addEventListener('click', function(e) {
        const card = e.target.closest('.bank-card');
        if (card) {
            const accountNo = card.getAttribute('data-account-no');
            const accountName = card.getAttribute('data-account-name');
            const ifsc = card.getAttribute('data-ifsc');
            console.log('Bank card clicked:', { accountNo, accountName, ifsc });
            window.fillForm(accountNo, accountName, ifsc);
            isNewBank = false;
        }
    });
}

  // Close modal when clicking outside
  window.addEventListener('click', function(e) {
      if (e.target === modal) {
          hideModal();
      }
  });

  function showModal() {
      if (!isNewBank && modal) {
          modal.style.display = 'block';
      }
  }

  function hideModal() {
      if (modal) modal.style.display = 'none';
  }

  // Make fillForm globally accessible
  window.fillForm = function(accountNo, accountName, ifsc) {
    console.log('fillForm called with:', accountNo, accountName, ifsc);
    if (accountNoInput && accountNo) accountNoInput.value = accountNo;
    if (accountNameInput && accountName) accountNameInput.value = accountName;
    if (ifscInput && ifsc) ifscInput.value = ifsc;
    console.log('Form filled. Current values:', 
        accountNoInput?.value || 'N/A', 
        accountNameInput?.value || 'N/A', 
        ifscInput?.value || 'N/A'
    );
    hideModal();
}

  function enableNewBankEntry() {
      isNewBank = true;
      if (accountNoInput) {
          accountNoInput.readOnly = false;
          accountNoInput.value = '';
      }
      if (accountNameInput) {
          accountNameInput.readOnly = false;
          accountNameInput.value = '';
      }
      if (ifscInput) {
          ifscInput.readOnly = false;
          ifscInput.value = '';
      }
      hideModal();
  }

  function handleBackArrow() {
      const urlParams = new URLSearchParams(window.location.search);
      const redirection = urlParams.get('redirect');
      window.location.href = redirection === 'dash' ? '/dashboard' : '/fullprofile';
  }

  function validateIFSC(event) {
      const inputValue = event.target.value;
      const serverEndpoint = '/Validate_IFSC';
      const data = { ifsc: inputValue };

      fetch(serverEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
      })
      .then(response => response.json())
      .then(response_data => {
          console.log(response_data);
          const msgbox = document.getElementById('Validation_Msg');
          if (msgbox) {
              if (response_data.status === 'Success') {
                  msgbox.innerHTML = `<span style="color: green;">${response_data.bank_details['BANK']}, ${response_data.bank_details['BRANCH']}</span>`;
              } else if (response_data.status === 'Failed') {
                  msgbox.innerHTML = `Invalid IFSC code: <span style="color: red;">${inputValue}</span>`;
              }
          }
      })
      .catch(error => {
          console.error('Error:', error);
          const msgbox = document.getElementById('Validation_Msg');
          if (msgbox) msgbox.innerHTML = `Server Error: ${error}`;
      });
  }

  function handleFormSubmit(event) {
      event.preventDefault();

      try {
          const formData = new FormData(form);
          const data = Object.fromEntries(formData.entries());

          // Validate that all required fields are filled
          for (let key in data) {
              if (!data[key] && key !== 'transactionPassword') { // Make transactionPassword optional
                  throw new Error(`${key} is required`);
              }
          }

          // Add isNewBank flag to the data
          data.isNewBank = isNewBank;

          console.log('Data to be sent:', data);

          const spinner = document.getElementById('spinner');
          if (spinner) spinner.style.display = 'block';

          fetch('/create_INR_wdt_request', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data),
          })
          .then(response => response.json())
          .then(responseData => {
              if (spinner) spinner.style.display = 'none';
              handleResponse(responseData);
          })
          .catch(error => {
              console.error('Error submitting INR WDT Details:', error);
              if (spinner) spinner.style.display = 'none';
              showToast('error',`Error occurred while submitting. Please try again.`)
          });
      } catch (error) {
          console.error('Error preparing form data:', error);
          showToast('error',`${error.message}`)
      }
  }

  function handleResponse(responseData) {
      if (responseData.success) {
          if (form) form.reset();
          console.log('success:', responseData);
          showToast('success',`Order Details Submitted successfully.`)
          setTimeout(() => { window.location.href = '/dashboard'; }, 3000);
      } else {
          let message = responseData.message;
          let toastmsg = ''
          if (message === 'Authentication failed') {
              message += `  <br> Wrong Transaction Password. <br> <a href="/cwp" style="color: gray; text-decoration: underline;">Forgot Password?</a>`;
              toastmsg = 'Authentication failed';
          } else if (message === 'Insufficient balance To Trade!') {
              message += ` <br> <a href="/usdt_deposit_info?redirect=usdtwithdraw" style="color: blue; text-decoration: underline;">Recharge Now</a>`;
              toastmsg = 'Insufficient balance';
          }
          showVerificationMessage(message);
          showToast('warning',`${toastmsg}`)
      }
  }

  function showVerificationMessage(message) {
    const verificationBox = document.getElementById('verificationBox');
    const verificationMessage = document.getElementById('verificationMessage');
    if (verificationMessage) verificationMessage.innerHTML = message;
    if (verificationBox) verificationBox.removeAttribute('hidden');
    if (verificationMessage) verificationMessage.removeAttribute('hidden');
}


  function calculateINR(constantValue) {
      const amountInput = document.getElementById('amount');
      const resultElement = document.getElementById('result');
      if (amountInput && resultElement) {
          const inputValue = parseFloat(amountInput.value);
          const result = (inputValue * constantValue).toFixed(2);
          resultElement.innerText = "INR " + result;
          resultElement.classList.add("show");
      }
  }

  // Expose necessary functions to global scope
  window.calculateINR = calculateINR;
});