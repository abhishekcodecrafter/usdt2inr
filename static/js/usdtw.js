

$(document).ready(function() {
    document.getElementById('hallbtn').addEventListener('click', function () {
        console.log('Hall Button is clicked');
        document.getElementById('recordContainer').style.display = 'none';
        document.getElementById('hallContainer').style.display = 'flex';
        
        
    });


    document.getElementById('recordbtn').addEventListener('click', function () {
        console.log('Record Button is clicked');
        document.getElementById('hallContainer').style.display = 'none';
        document.getElementById('recordContainer').style.display = 'flex';
    });

    $('#hallbtn').click();





$('.button-container button').click(function() {
    $('.button-container button').removeClass('active');
    $(this).addClass('active');
});
});


$(document).ready(function() {
$('.bottom-nav a').click(function() {
  $('.bottom-nav a').removeClass('active');
  $(this).addClass('active');
});
});




function redirectTo(page) {
  window.location.href = page;
}
