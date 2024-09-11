
let depositsDataFetched = false;
let withdrawalsDataFetched = false;
let settingsDataFetched = false;

 document.getElementById('buttonGroup').addEventListener('click', function (event) {
    const  clickedButton = event.target;


    if (clickedButton.tagName === 'BUTTON') {
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.classList.remove('active');
        });


        clickedButton.classList.add('active');

        if (clickedButton.id === 'usersbtn'){
            console.log('active button clicked is : ',clickedButton.id)
            document.getElementById('depositsDataContainer').setAttribute('hidden',true);
            document.getElementById('withdrawalsDataContainer').setAttribute('hidden', true);
            document.getElementById('userDataContainer').removeAttribute('hidden');
            document.getElementById('settingsDataContainer').setAttribute('hidden',true);
        }
        

        else if (clickedButton.id === 'depositbtn') {
            document.getElementById('depositsDataContainer').removeAttribute('hidden');
            console.log('active button clicked is : ', clickedButton.id);
            document.getElementById('userDataContainer').setAttribute('hidden', true);
            document.getElementById('withdrawalsDataContainer').setAttribute('hidden', true);
            document.getElementById('settingsDataContainer').setAttribute('hidden',true);
            if(!depositsDataFetched){
            getTransactions('deposits');
            depositsDataFetched = true;
        }
        }
        
        else if (clickedButton.id === 'withdrawalsbtn') {
            console.log('active button clicked is : ', clickedButton.id);
            document.getElementById('withdrawalsDataContainer').removeAttribute('hidden');
            document.getElementById('depositsDataContainer').setAttribute('hidden', true);
            document.getElementById('userDataContainer').setAttribute('hidden', true);
            document.getElementById('settingsDataContainer').setAttribute('hidden',true);
            if(!withdrawalsDataFetched){
            getTransactions('withdrawals');
            withdrawalsDataFetched = true;
            }
        }
        

        else if (clickedButton.id === 'settingsbtn'){
            console.log('active button clicked is : ',clickedButton.id)
            document.getElementById('userDataContainer').setAttribute('hidden',true);
            document.getElementById('depositsDataContainer').setAttribute('hidden',true);
            document.getElementById('withdrawalsDataContainer').setAttribute('hidden',true);
            document.getElementById('settingsDataContainer').removeAttribute('hidden');
            if(!settingsDataFetched){
                getsettings();
                settingsDataFetched = true;
                }
        }

    }
});




function getUsers() {
    fetch('/get_users')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            displayUserData(data.data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function displayUserData(userData) {
    const container = document.getElementById('userDataContainer');

    if (userData && userData.length > 0) {
        const table = document.createElement('table');
        table.className = 'table table-bordered table-responsive';
        table.id = 'tabel'

        const headerRow = document.createElement('tr');
        headerRow.id = 'header'

        headerRow.innerHTML = `
            <th class="text-sm">Phone Number</th>
            <th class="text-sm">USDT Balance</th>
            <th class="text-sm">Hold Balance</th>
            <th  class="text-sm t_me">T.Me</th>
            <th class="text-sm">User Status</th>
        `;
        table.appendChild(headerRow);

        userData.forEach((user, index) => {
            if (user.active) {
                user_status = 'Active';
            } else {
                user_status = 'Banned';
            }

            const row = document.createElement('tr');
            row.id = 'row'+index
            
            row.innerHTML = `
                <td class="text-md" style='cursor:pointer;'>${user.phone_number}</td>
                <td class="text-md" contenteditable>${user.usdt_balance || 0}</td>
                <td class="text-md">${user.hold_balance || 0}</td>
                <td class="text-md t_me">${user.t_me}</td>
                <td class="text-md"><span id='user_status${index}'>${user_status}</span><br>
                <span><label class="switch-button">
                    <input type="checkbox" id="statusSwitch${index}" ${user_status === 'Active' ? 'checked' : ''} onchange="handleStatusChange(this, ${user.phone_number},${index})">
                    <span class="slider"></span></label>
                </span></td>
            `;

            const editableCells = row.querySelectorAll('[contenteditable]');
            editableCells.forEach(cell => {
                cell.addEventListener('blur', (event) => handleCellEdit(event, user.phone_number));


                const initialContent = cell.textContent;

                cell.addEventListener('keydown', function (event) {
                    if (event.keyCode === 13) {
                        event.preventDefault(); 
                        cell.blur(); 
                    }
                });

                cell.addEventListener('blur', function () {
                    if (cell.textContent.trim() === '') {
                        cell.textContent = initialContent;
                    }
                });
            });            

            table.appendChild(row);

        });

        container.appendChild(table);
    } else {
        container.innerHTML = '<p>No user data available.</p>';
    }
}

function handleCellEdit(event,phone_number) {
    const editedValue = event.target.textContent;
    console.log('Edited value for' , phone_number, editedValue);


    $.ajax({
        url: '/save_user_data',
        type: 'POST',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify({ phone_number: phone_number, editedValue: editedValue }),
        success: function (response) {
            console.log('Data successfully sent to the server.');
        },
        error: function (error) {
            console.error('Error sending data to the server:', error);
        }
    });
}

function handleStatusChange(checkbox , phone,index) {
    user_status = checkbox.checked ? 'Active' : 'Banned';
    $('#user_status'+index).text(user_status);
    console.log('User status changed For ', phone ,'To :', user_status , "For User:", index);

    $.ajax({
        url: '/save_user_data',
        type: 'POST',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify({ phone_number: phone, status: user_status }),
        success: function (response) {
            console.log('Data successfully sent to the server.');
        },
        error: function (error) {
            console.error('Error sending data to the server:', error);
        }
    });
}

getUsers();






function getTransactions(thisone) {
    console.log("Passed Parameter is : ", thisone)
    fetch('/get_transactions')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data[thisone]);
            displayTransactionData(data[thisone],thisone);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


function handleStatusToggle(idindex , phoneNumber , amount , txn_id , transactiontype) {
    const tdElement = document.getElementById(idindex);
    if (amount === 'null'){
        alert('Please Enter the amount first');
        return; 
    }



function sendTransactionState(txn_Id,Status){
    $.ajax({
        url: '/save_transaction_state_route',
        type: 'POST',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify({ txn_id: txn_Id, status: Status , phone:phoneNumber , Amount:amount , TransactionType:transactiontype }),
        success: function (response) {
            console.log('Data successfully sent to the server.');
        },
        error: function (error) {
            console.error('Error sending data to the server:', error);
        }
    });
}

    // Check if the element exists
    if (tdElement) {
        let currentStatus = tdElement.textContent.trim();


        // Toggle between states
        switch (currentStatus) {
            case 'PROCESSING':
                tdElement.textContent = 'COMPLETED';
                tdElement.classList.remove('processing');
                tdElement.classList.add('completed');

                sendTransactionState(txn_id,'COMPLETED');

                console.log(idindex , phoneNumber , amount , txn_id)

                break;
            case 'COMPLETED':
                tdElement.textContent = 'FAILED';
                tdElement.classList.remove('completed');
                tdElement.classList.add('failed');

                console.log(idindex , phoneNumber , amount , txn_id)
                sendTransactionState(txn_id,'FAILED');
                break;
            case 'FAILED':
                tdElement.textContent = 'PROCESSING';
                tdElement.classList.remove('failed');
                tdElement.classList.add('processing');

                console.log(idindex , phoneNumber , amount , txn_id)
                sendTransactionState(txn_id,'PROCESSING');
                break;
            default:
                break;
        }
    } else {
        console.error(`Element with ID '${idindex}' not found.`);
    }
}


function displayTransactionData(TransactionData,thiscontainer) {
    const container = document.getElementById(thiscontainer+'DataContainer');

    if (TransactionData && TransactionData.length > 0) {
        const table = document.createElement('table');
        table.className = 'table table-bordered table-responsive';

        const headerRow = document.createElement('tr');
        headerRow.id = 'transactionheader'

        if (thiscontainer === 'deposits'){
            table.id = 'transactiontabeld'
        headerRow.innerHTML = `
            <th class="text-sm">Phone Number</th>
            <th class="text-sm">status</th>
            <th class="text-sm">deposit_address</th>
            <th class="text-sm">txn_id</th>
            <th class="text-sm">amount</th>
            <th class="text-sm">created_at</th>
            <th class="text-sm">updated_at</th>
            <th class="text-sm">deposit_txn_id</th>
            <th class="text-sm">exchange_rate</th>
        `;
        }

        if (thiscontainer === 'withdrawals'){
            table.id = 'transactiontabelw'


            headerRow.innerHTML = `
            <th class="text-sm">Phone Number</th>
            <th class="text-sm">status</th>
            <th  class="sub_type">sub_type</th>
            <th class="text-sm">withdraw_address</th>
            <th class="text-sm">txn_id</th>
            <th class="text-sm">account_no</th>
            <th class="text-sm">account_name</th>
            <th class="text-sm">ifsc</th>
            <th class="text-sm">amount</th>
            <th class="text-sm">created_at</th>
            <th class="text-sm">exchange_rate</th>
        `;
        }




        table.appendChild(headerRow);

        TransactionData.forEach((Transaction, index) => {
            const row = document.createElement('tr');
            row.id = 'transactionrow'+index

            let statusClass = '';
    if (Transaction.status === 'COMPLETED') {
        statusClass = 'completed';
    } else if (Transaction.status === 'FAILED') {
        statusClass = 'failed';
    } else {
        statusClass = 'processing';
    }

    if (Transaction.type === "DEPOSIT"){
        row.innerHTML = `
                <td class="text-md" style='cursor:pointer;'>${Transaction.phone_number}</td>
                <td class="text-md status ${statusClass}" style='cursor:pointer;' 
                onclick="handleStatusToggle('${Transaction.type.toLowerCase()}statustext${index}', '${Transaction.phone_number}', '${Transaction.amount}', '${Transaction.txn_id}' , '${Transaction.type}')"
                id="${Transaction.type.toLowerCase()}statustext${index}">
                ${Transaction.status || 'N/A'}
            </td>
                <td class="text-md" >${Transaction.deposit_address || 'N/A'}</td>
                <td class="text-md" >${Transaction.txn_id || 'N/A'}</td>
                <td class="text-md" id="${Transaction.type.toLowerCase()}amount${index}" ${Transaction.type.toLowerCase() === 'deposit' ? 'contenteditable' : ''}>
                ${Transaction.amount || 'N/A'}</td>
                <td class="text-md" >${Transaction.created_at || 'N/A'}</td>
                <td class="text-md" >${Transaction.updated_at || 'N/A'}</td>
                <td class="text-md" >${Transaction.deposit_txn_id || 'N/A'}</td>
                <td class="text-md" >${Transaction.exchange_rate || 'N/A'}</td>
            `;
    }
            
    if (Transaction.type === 'WITHDRAW') {
        row.innerHTML = `
                <td class="text-md" style='cursor:pointer;'>${Transaction.phone_number}</td>
                <td class="text-md status ${statusClass}" style='cursor:pointer;' 
                onclick="handleStatusToggle('${Transaction.type.toLowerCase()}statustext${index}', '${Transaction.phone_number}', '${Transaction.amount}', '${Transaction.txn_id}' , '${Transaction.type}')"
                id="${Transaction.type.toLowerCase()}statustext${index}">
                ${Transaction.status || 'N/A'}
            </td>
                <td class="text-md">${Transaction.sub_type}</td>
                <td class="text-md" >${Transaction.withdraw_address || 'N/A'}</td>
                <td class="text-md" >${Transaction.txn_id || 'N/A'}</td>
                <td class="text-md" >${Transaction.account_no || 'N/A'}</td>
                <td class="text-md" >${Transaction.account_name || 'N/A'}</td>
                <td class="text-md" >${Transaction.ifsc || 'N/A'}</td>
                <td class="text-md" id="${Transaction.type.toLowerCase()}amount${index}" ${Transaction.type.toLowerCase() === 'deposit' ? 'contenteditable' : ''}>
                ${Transaction.amount || 'N/A'}</td>
                <td class="text-md" >${Transaction.created_at || 'N/A'}</td>
                <td class="text-md" >${Transaction.exchange_rate || 'N/A'}</td>
            `;
    }

            
            const editableCells = row.querySelectorAll('[contenteditable]');
            editableCells.forEach(cell => {
                cell.addEventListener('blur', (event) => handleDepositsCellEdit(event, Transaction.txn_id));

                const initialContent = cell.textContent;

                cell.addEventListener('keydown', function (event) {
                    if (event.keyCode === 13) {
                        event.preventDefault(); 
                        cell.blur(); 
                    }
                });

                cell.addEventListener('blur', function () {
                    if (cell.textContent.trim() === '') {
                        cell.textContent = initialContent;
                    }
                });
                
            });          


            table.appendChild(row);

        });

        container.appendChild(table);
    } else {
        container.innerHTML = '<p>No Transaction data available.</p>';
    }
}


function handleDepositsCellEdit(event,txn_id) {
    const editedsettingsValue = event.target.textContent;
    console.log('Edited value for' , txn_id, editedsettingsValue);


    $.ajax({
        url: '/save_transaction_state_route',
        type: 'POST',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify({ txn_id: txn_id, editedValue: editedsettingsValue }),
        success: function (response) {
            console.log('Data successfully sent to the server.');
        },
        error: function (error) {
            console.error('Error sending data to the server:', error);
        }
    });
}







function getsettings() {
    fetch('/get_settings_route')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data.data)
            displaySettingsData(data.data)
        })
        .catch(error => {
            console.error('Error:', error);
        });
}




function displaySettingsData(SettingsData) {
    const container = document.getElementById('settingsDataContainer');

    if (SettingsData) {
        const table = document.createElement('table');
        table.className = 'table table-bordered table-responsive';
        table.id = 'settingstabel'

        const headerRow = document.createElement('tr');
        headerRow.id = 'settingsheader'

        headerRow.innerHTML = `
            <th class="text-sm">exchange_rate</th>
            <th class="text-sm">wazir_x_price</th>
            <th class="text-sm">binance_price</th>
            <th  class="text-sm">ku_coin_price</th>
            <th class="text-sm">invite_link</th>
            <th class="text-sm">QR Code</th>
            <th class="text-sm">Address</th>
        `;
        table.appendChild(headerRow);
            const row = document.createElement('tr');
            row.id = 'settingsrow';
            
            row.innerHTML = `
                <td class="text-md"  id='exchange_rate'  contenteditable>${SettingsData.exchange_rate}</td>
                <td class="text-md" id='wazir_x_price' contenteditable>${SettingsData.wazir_x_price || 'N/A'}</td>
                <td class="text-md" id='binance_price' contenteditable>${SettingsData.binance_price || 'N/A'}</td>
                <td class="text-md" id='ku_coin_price' contenteditable>${SettingsData.ku_coin_price}</td>
                <td class="text-md" id='invite_link' contenteditable>${SettingsData.invite_link || 'N/A'}</td>
                <td class="text-md" id='qr' contenteditable>${SettingsData.qr || 'N/A'}</td>
                <td class="text-md" id='address' contenteditable>${SettingsData.address || 'N/A'}</td>
            `;


            const editableCells = row.querySelectorAll('[contenteditable]');
            editableCells.forEach(cell => {
                const idName = cell.id;
                cell.addEventListener('blur', (event) => handlesettingsCellEdit(event, idName));


                const initialContent = cell.textContent;

                cell.addEventListener('keydown', function (event) {
                    if (event.keyCode === 13) {
                        event.preventDefault(); 
                        cell.blur(); 
                    }
                });

                cell.addEventListener('blur', function () {
                    if (cell.textContent.trim() === '') {
                        cell.textContent = initialContent;
                    }
                });
                
            });          

            table.appendChild(row);

        container.appendChild(table);
    } else {
        container.innerHTML = '<p>No Settings data available.</p>';
    }
}

function handlesettingsCellEdit(event,idName) {
    const editedsettingsValue = event.target.textContent;
    console.log('Edited value for' , idName, editedsettingsValue);


    $.ajax({
        url: '/save_settings_route',
        type: 'POST',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify({ idName: idName, editedValue: editedsettingsValue }),
        success: function (response) {
            console.log('Data successfully sent to the server.');
        },
        error: function (error) {
            console.error('Error sending data to the server:', error);
        }
    });
}



document.addEventListener('DOMContentLoaded', function () {
    function setActiveButton(buttonId) {
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            if (button.id === buttonId) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });

        localStorage.setItem('activeButton', buttonId);
    }

    const buttonGroup = document.getElementById('buttonGroup');
    buttonGroup.addEventListener('click', function (event) {
        if (event.target.classList.contains('btn')) {
            setActiveButton(event.target.id);
        }
    });

    const storedActiveButton = localStorage.getItem('activeButton');
    if (storedActiveButton) {
        setActiveButton(storedActiveButton);

        const activeButton = document.getElementById(storedActiveButton);
        if (activeButton) {
            activeButton.click();
        }
    }
});
