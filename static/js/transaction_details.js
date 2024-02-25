function copyToClipboard(elementId) {
    var element = document.getElementById(elementId);
    var tempInput = document.createElement("input");
    document.body.appendChild(tempInput);
    tempInput.value = element.textContent || element.innerText;
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
    var successMsg = document.getElementById('successmsg');
    successMsg.style.display = 'block';
    setTimeout(function () {
        successMsg.style.display = 'none';
    }, 3000);
}
