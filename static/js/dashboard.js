function selectLanguage(language){
        
}


$(document).ready(function() {
$('.bottom-nav a').click(function() {
  $('.bottom-nav a').removeClass('active');
  $(this).addClass('active');
});
});

$(document).ready(function () {
$('#langmodelcard:first-child').click(function () {
    $('#langmodelcard').css('background-color', '');
    $(this).css('background-color', 'green').addClass('active');
    $('#langmodelcard:nth-child(2)').css('background-color', '');
    $('#close').click();

});


$('#langmodelcard:nth-child(2)').click(function () {
    $('#langmodelcard').css('background-color', '');
    $(this).css('background-color', 'green').addClass('active');
    $('#close').click();
});


$('#langmodelcard').hover(
    function () {
        if (!$(this).hasClass('active')) {
            $(this).css('background-color', 'green');
        }
    },
    function () {
        if (!$(this).hasClass('active')) {
            $(this).css('background-color', '');
        }
    }
);

$('#langmodelcard:first-child').css('background-color', 'green').addClass('active').click();

console.log('Clicked on the Language card!');
});

function openLanguageModal() {
    $('#languageModal').modal('show');
  }

  function redirectTo(page) {
    window.location.href = page;
  }

  function handleDepositClick() {
    window.location.href = '/usdt_deposit_info?redirect=dash'
  }