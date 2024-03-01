
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

function displayTransactionData(TransactionData,thiscontainer) {
    const container = document.getElementById(thiscontainer+'DataContainer');

    if (TransactionData && TransactionData.length > 0) {
        const table = document.createElement('table');
        table.className = 'table table-bordered table-responsive';
        table.id = 'transactiontabel'

        const headerRow = document.createElement('tr');
        headerRow.id = 'transactionheader'

        headerRow.innerHTML = `
            <th class="text-sm">Phone Number</th>
            <th class="text-sm">status</th>
            <th class="text-sm">type</th>
            <th  class="sub_type">sub_type</th>
            <th class="text-sm">deposit_address</th>
            <th class="text-sm">withdraw_address</th>
            <th class="text-sm">txn_id</th>
            <th class="text-sm">account_no</th>
            <th class="text-sm">account_name</th>
            <th class="text-sm">ifsc</th>
            <th class="text-sm">amount</th>
            <th class="text-sm">created_at</th>
            <th class="text-sm">updated_at</th>
            <th class="text-sm">deposit_txn_id</th>
            <th class="text-sm">exchange_rate</th>
        `;
        table.appendChild(headerRow);

        TransactionData.forEach((Transaction, index) => {
            const row = document.createElement('tr');
            row.id = 'transactionrow'+index
            

            row.innerHTML = `
                <td class="text-md" style='cursor:pointer;'>${Transaction.phone_number}</td>
                <td class="text-md status" >${Transaction.status || 'N/A'}</td>
                <td class="text-md" >${Transaction.type || 'N/A'}</td>
                <td class="text-md">${Transaction.sub_type}</td>
                <td class="text-md" >${Transaction.deposit_address || 'N/A'}</td>
                <td class="text-md" >${Transaction.withdraw_address || 'N/A'}</td>
                <td class="text-md" >${Transaction.txn_id || 'N/A'}</td>
                <td class="text-md" >${Transaction.account_no || 'N/A'}</td>
                <td class="text-md" >${Transaction.account_name || 'N/A'}</td>
                <td class="text-md" >${Transaction.ifsc || 'N/A'}</td>
                <td class="text-md" >${Transaction.amount || 'N/A'}</td>
                <td class="text-md" >${Transaction.created_at || 'N/A'}</td>
                <td class="text-md" >${Transaction.updated_at || 'N/A'}</td>
                <td class="text-md" >${Transaction.deposit_txn_id || 'N/A'}</td>
                <td class="text-md" >${Transaction.exchange_rate || 'N/A'}</td>
            `;

            table.appendChild(row);

        });

        container.appendChild(table);
    } else {
        container.innerHTML = '<p>No Transaction data available.</p>';
    }
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
        `;
        table.appendChild(headerRow);


        

            const row = document.createElement('tr');
            row.id = 'settingsrow';
            
            row.innerHTML = `
                <td class="text-md" contenteditable>${SettingsData.exchange_rate}</td>
                <td class="text-md" contenteditable>${SettingsData.wazir_x_price || 'N/A'}</td>
                <td class="text-md" contenteditable>${SettingsData.binance_price || 'N/A'}</td>
                <td class="text-md" contenteditable>${SettingsData.ku_coin_price}</td>
                <td class="text-md" contenteditable>${SettingsData.invite_link || 'N/A'}</td>
            `;

            table.appendChild(row);

        container.appendChild(table);
    } else {
        container.innerHTML = '<p>No Settings data available.</p>';
    }
}