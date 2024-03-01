var Spinner = document.getElementById('spinner')
var withdrawalsButton = document.getElementById("withdrawalsButton");
var depositsButton = document.getElementById("depositsButton");
var withdrawalSection = document.getElementById("withdrawals");
var depositSections = document.getElementById("deposits");

function showSpinner(timeout) {
    Spinner.removeAttribute('hidden');
    setTimeout(function () {
        hideSpinner();
    }, timeout);
}

function hideSpinner(){
    Spinner.setAttribute('hidden',true);
}


document.addEventListener('DOMContentLoaded', function () {
    showSpinner(2);
});

if (withdrawalsButton){
withdrawalsButton.click();
withdrawalsButton.onclick = function() {
    showSpinner(1000);
    withdrawalsButton.classList.add("active");
    depositsButton.classList.remove("active");
    withdrawalSection.style.display = "flex";
    depositSections.style.display = "none";
};
};

if (depositsButton){
depositsButton.onclick = function(){
    showSpinner(1000);
    withdrawalsButton.classList.remove("active");
    depositsButton.classList.add("active");
    depositSections.style.display = "flex";
    withdrawalSection.style.display = "none";
};
};