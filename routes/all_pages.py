from flask import Flask, session, render_template, redirect, request, jsonify
# from db.models import create_user, edit_tg_username_model, get_current_exchange_rate, get_exchanges_todays_value, \
#     get_all_users, get_user_by_phone_number, get_users_all_transactions, get_all_transactions, \
#     get_a_transaction, create_transaction, create_deposit_model, get_no_completed_transactions, get_deposits, \
#     get_withdrawls, get_invite_link
from db.models import *
import requests

from routes.send_message import send_message


def get_user_phone_number():
    return session.get('phone_number', None)


def index():
    user_phone_number = get_user_phone_number()
    if user_phone_number:
        return redirect('/dashboard')
    return render_template('index.html')


def get_total_done_exchanges(user_phone_number):
    return get_no_completed_transactions(user_phone_number)


def dashboard():
    try:
        user_phone_number = get_user_phone_number()
        if not user_phone_number:
            return redirect('/')
        user_details = get_user_by_phone_number(user_phone_number)
        if user_details:
            data = user_details
        else:
            return redirect('/')

        inr_value = get_current_exchange_rate()
        exchanges_value = get_exchanges_todays_value()
        total_number_of_exchanges = get_total_done_exchanges(user_phone_number)

        return render_template('dashboard.html', user_details=data, inrvalue=inr_value,
                               exchanges_value=exchanges_value,
                               no_of_exchanges=total_number_of_exchanges)
    except Exception as e:
        send_message(f"Error on loading dashboard : {e}")
        raise e


def transactions():
    try:
        user_phone_number = get_user_phone_number()
        if not user_phone_number:
            return redirect('/')

        exchange_rate = get_current_exchange_rate()
        deposits = get_deposits(user_phone_number)
        withdrawls = get_withdrawls(user_phone_number)
        no_of_txns = get_no_completed_transactions(user_phone_number)

        print(withdrawls)

        return render_template('transactions.html', exchange_rate=exchange_rate, deposits=deposits,
                               withdrawals=withdrawls, no_of_txns=no_of_txns)
    except Exception as e:
        send_message(f"Error on loading transactions : {e}")
        raise e


def transaction_details():
    try:
        user_phone_number = get_user_phone_number()
        if not user_phone_number:
            return redirect('/')

        exchange_rate = get_current_exchange_rate()
        deposits = get_deposits(user_phone_number)
        withdrawls = get_withdrawls(user_phone_number)
        no_of_txns = get_no_completed_transactions(user_phone_number)

        withdrawal_id = request.args.get('withdrawal_id')
        withdrawal_details = get_withdrawal_details(withdrawal_id)

        print("Withdrawals details : ", withdrawal_details)

        return render_template('transaction_details.html', details=withdrawal_details, no_of_txns=no_of_txns)
    except Exception as e:
        send_message(f"Error on loading transaction details : {e}")
        raise e


def profile():
    try:
        user_phone_number = get_user_phone_number()
        if not user_phone_number:
            return redirect('/')

        user_details = get_user_by_phone_number(user_phone_number)
        invite_link = get_invite_link();
        if user_details:
            data = user_details
        else:
            send_message(f"Error while fetching profile : '{user_phone_number}'")
            print("User not found")

        return render_template('profile.html', user_details=data, invite_link=invite_link)
    except Exception as e:
        send_message(f"Error on loading profile : {e}")
        raise e


def inr_exchange():
    try:
        user_phone_number = get_user_phone_number()
        if not user_phone_number:
            return redirect('/')

        user_details = get_user_by_phone_number(user_phone_number)
        exchange_rate = get_current_exchange_rate()
        qr, address = get_qr_and_address()
        user_details["wallet_address"] = address
        user_details["wallet_qr"] = qr
        return render_template('inr_exchange.html', user_details=user_details, inrvalue=exchange_rate,
                               user_phonenumber=user_phone_number)
    except Exception as e:
        send_message(f"Error on loading INR Exchange : {e}")
        raise e


def cwp():
    user_phone_number = get_user_phone_number()
    if not user_phone_number:
        return redirect('/')
    return render_template('cwp.html', user_phonenumber=user_phone_number)


def wp():
    user_phone_number = get_user_phone_number()
    if not user_phone_number:
        return redirect('/')
    return render_template('wp.html', user_phonenumber=user_phone_number)


def help():
    user_phone_number = get_user_phone_number()
    if not user_phone_number:
        return redirect('/')

    return render_template('help.html')


def usdtw():
    try:
        user_phone_number = get_user_phone_number()
        if not user_phone_number:
            return redirect('/')
        transactions = get_users_all_transactions(user_phone_number)
        if transactions:
            data = list(transactions)
            return render_template('usdtw.html', transactions=data, user_phonenumber=user_phone_number)
        return render_template('usdtw.html', user_phonenumber=user_phone_number)
    except Exception as e:
        send_message(f"Error on loading usdtw : {e}")
        raise e


def usdtwrh():
    try:
        user_phone_number = get_user_phone_number()
        if not user_phone_number:
            return redirect('/')
        transactions = get_users_all_transactions(user_phone_number)
        if transactions:
            data = list(transactions)
            return render_template('usdtwrh.html', transactions=data, user_phonenumber=user_phone_number)
        return render_template('usdtwrh.html', user_phonenumber=user_phone_number)
    except Exception as e:
        send_message(f"Error on loading usdtwrh : {e}")
        raise e


def usdt_widthdrawl():
    try:
        user_phone_number = get_user_phone_number()
        if not user_phone_number:
            return redirect('/')

        user_details = get_user_by_phone_number(user_phone_number)
        if user_details:
            user_details = user_details
        else:
            print("User not found")

        exchange_rate = get_current_exchange_rate()
        if exchange_rate:
            inr_value = exchange_rate
        return render_template('usdtwidthdrawl.html', user_details=user_details, inrvalue=inr_value,
                               user_phonenumber=user_phone_number)
    except Exception as e:
        send_message(f"Error on loading usdt_widthdrawl : {e}")
        raise e


def rh():
    user_phone_number = get_user_phone_number()
    if not user_phone_number:
        return redirect('/')
    deposits = get_deposits(user_phone_number)
    return render_template('rh.html', deposits=deposits, user_phonenumber=user_phone_number)


def get_deposit_address(user_phone_number):
    qr, address = get_qr_and_address()
    return {
        "qr": qr,
        "address": address
    }


def usdt_deposit():
    user_phone_number = get_user_phone_number()
    if not user_phone_number:
        return redirect('/')

    address_info = get_deposit_address(user_phone_number)
    return render_template('usdt_deposit.html', address_info=address_info)


class TransactionNotFound(Exception):
    pass


class TransactionAPIError(Exception):
    pass


def get_transaction_info(hash_value):
    try:
        api_url = f"https://apilist.tronscanapi.com/api/transaction-info?hash={hash_value}"
        response = requests.get(api_url)

        if response.status_code == 200:
            transaction_info = response.json()
            print(transaction_info)
            if not transaction_info:  # Check if JSON response is empty
                raise TransactionNotFound("Not Found")
            return transaction_info
        else:
            raise TransactionAPIError("Invalid response of hash : %s".format(hash_value))
    except TransactionNotFound as e:
        raise e
    except Exception as e:
        raise TransactionAPIError(str(e))


def submitDeposit():
    try:
        user_phone_number = get_user_phone_number()
        if not user_phone_number:
            return redirect('/')

        data = request.json
        txn_id = data.get('txnId')

        if txn_id is None or txn_id == '':
            return jsonify({'success': False, 'message': 'Error! Transaction Hash required'}), 500

        if len(txn_id) < 60:
            return jsonify({'success': False, 'message': 'Invalid Transaction Hash'}), 500

        qr, address = get_qr_and_address()

        details = {}
        try:
            details = get_transaction_info(txn_id)
        except TransactionNotFound as e:
            return jsonify({'success': False, 'message': 'Not able to fetch details, enter correct hash'}), 500
        except TransactionAPIError as e:
            send_message(f"Error while deposit request : '{user_phone_number}', Hash : '{txn_id}',  Error: '{e}'")
            create_deposit_model(user_phone_number, address, txn_id, get_current_exchange_rate(), "PROCESSING", None)
            return jsonify({'success': False, 'message': 'Not able to fetch details, we are manually checking'}), 500

        info = details["trc20TransferInfo"][0]
        print(info)
        if not info or info["symbol"] != "USDT" or info["tokenType"] != "trc20":
            return jsonify({'success': False, 'message': 'Provided input is not valid hash of USDT TRC20'}), 500

        if info["to_address"] != address:
            return jsonify({'success': False, 'message': 'Transaction not received on given address'}), 500

        amount = int(info["amount_str"]) / (10 ** info["decimals"])
        status = "PROCESSING"
        success = create_deposit_model(user_phone_number, address, txn_id, get_current_exchange_rate(), status, amount)
        if success:
            send_message(f"New deposit request of amount '{amount}' from '{user_phone_number}'. Hash is '{txn_id}'")
            return jsonify({'success': True, 'message': 'Transaction detected, processing your request'}), 200
        else:
            return jsonify({'success': False, 'message': 'Deposit Request Failed'}), 500
    except HashAlreadyExist as e:
        print("Error while submit deposit : ", e)
        return jsonify({'success': False, 'message': 'Transaction already exists with given hash'}), 500
    except Exception as e:
        send_message(f"Error while deposit request : Error: '{e}'")
        print("Error while submit deposit : ", e)
        return jsonify({'success': False, 'message': 'Deposit Request Failed'}), 500


def usdt_deposit_info():
    user_phone_number = get_user_phone_number()
    if not user_phone_number:
        return redirect('/')
    return render_template('usdt_deposit_info.html')


def full_profile():
    try:
        user_phone_number = get_user_phone_number()
        if not user_phone_number:
            return redirect('/')
        user_details = get_user_by_phone_number(user_phone_number)
        if user_details:
            data = user_details
        else:
            print("User not found")
        exchange_rate = get_current_exchange_rate()
        if exchange_rate:
            inr_value = exchange_rate

        return render_template('fullprofile.html', user_details=data, inrvalue=inr_value,
                               user_phonenumber=user_phone_number)
    except Exception as e:
        send_message(f"Error on loading full_profile : {e}")
        raise e


def edit_tg_username():
    try:
        user_phone_number = get_user_phone_number()
        new_username = request.form.get('newUsername')
        success = edit_tg_username_model(new_username, user_phone_number)

        return jsonify({'success': success})
    except Exception as e:
        send_message(f"Error on loading edit_tg_name : {e}")
        raise e
