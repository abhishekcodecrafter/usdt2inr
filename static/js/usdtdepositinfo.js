function redirectTo(page) {
    window.location.href = page;
}


document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const redirectParam = urlParams.get('redirect');
  
    console.log(redirectParam);
  
    if (redirectParam === 'dash') {
      const arrowDiv = document.getElementById('paybtn');
      console.log('Arrow back button is clicked.');
      arrowDiv.addEventListener('click', function () {
        redirectTo('/usdt_deposit?redirect=dash');
      });
    } else if (redirectParam === 'fullprofile') {
      const arrowDiv = document.getElementById('paybtn');
      console.log('Arrow back button is clicked for full profile.');
      arrowDiv.addEventListener('click', function () {
        redirectTo('/usdt_deposit?redirect=fullprofile');
      });
    }
  });
