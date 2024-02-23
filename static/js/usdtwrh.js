function redirectTo(page) {
    window.location.href = page;
  }


  

  $(document).ready(function() {
  $('.button-container button').click(function() {
      $('.button-container button').removeClass('active');
      $(this).addClass('active');
  });


  document.getElementById('incomebtn').addEventListener('click', function () {
          console.log('Income Button is clicked');
          document.getElementById('expenditureContainer').style.display = 'none';
          document.getElementById('incomeContainer').style.display = 'flex';
          
          
      });


      document.getElementById('expenditurebtn').addEventListener('click', function () {
          console.log('Expenditure Button is clicked');
          document.getElementById('incomeContainer').style.display = 'none';
          document.getElementById('expenditureContainer').style.display = 'flex';
      });

      $('#incomebtn').click();





  });

