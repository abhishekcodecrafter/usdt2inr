import time
from random import randint
from datetime import datetime
from passlib.hash import bcrypt
import logging
from db.db_connector import DBConnector
import pytz

from routes.send_message import random_string, HashAlreadyExist


def create_user(phone_number, usdt_balance, hold_balance, active):
    query = """
        INSERT INTO users (phone_number, usdt_balance, hold_balance, active)
        VALUES (%s, %s, %s, %s)
    """
    values = (phone_number, usdt_balance, hold_balance, active)

    connector = DBConnector()
    success = connector.execute_query(query, values)
    connector.close_connection()

    return success


def get_current_exchange_rate():
    query = "SELECT exchange_rate FROM settings LIMIT 1;"

    connector = DBConnector()
    result = connector.fetch_all(query)
    connector.close_connection()
    if result is None or len(result) < 1:
        return None

    return result[0][0]


def get_qr_and_address():
    query = "SELECT qr, address FROM settings LIMIT 1;"

    connector = DBConnector()
    result = connector.fetch_all(query)
    connector.close_connection()
    if result is None or len(result) < 1:
        return None

    return result[0][0], result[0][1]


def get_invite_link():
    query = "SELECT invite_link FROM settings LIMIT 1;"
    connector = DBConnector()
    result = connector.fetch_all(query)
    connector.close_connection()
    if result is None or len(result) < 1:
        return None

    return result[0][0]


def get_exchanges_todays_value():
    query = "SELECT wazir_x_price, binance_price, ku_coin_price FROM settings LIMIT 1;"

    connector = DBConnector()
    result = connector.fetch_all(query)
    connector.close_connection()
    if result is None or len(result) < 1:
        return None

    return result[0]


def save_settings(idName, value):
    try:
        if isinstance(value, str):
            value = f"'{value}'"

        query = f"UPDATE settings SET {idName} = {value}"

        connector = DBConnector()
        success = connector.execute_query(query)
        connector.close_connection()
        return True
    except Exception as e:
        return False


def save_transaction_state_data(txn_ID=None, phone=None, depositAmount=None, Amount=None, transaction_status=None,
                                transactionType=None):
    if depositAmount is not None:
        try:
            print("Deposit amount : ", depositAmount, txn_ID)
            query = f""" update transactions set amount = {depositAmount} where txn_id = '{txn_ID}' """

            connector = DBConnector()
            success = connector.execute_query(query)
            connector.close_connection()

            return success
        except Exception as e:
            return False

    if transaction_status is not None:
        if "COMPLETED" == transaction_status and transactionType == "DEPOSIT":
            query1 = f"UPDATE users SET usdt_balance = usdt_balance + {Amount} WHERE phone_number = '{phone}'"
            query2 = f"UPDATE transactions SET status = '{transaction_status}', settled = 1 WHERE txn_id = '{txn_ID}' and settled != 1"
            try:
                connector = DBConnector()
                success = connector.execute_queries(query1, query2)
                connector.close_connection()
                return success
            except Exception as e:
                return False

        if "COMPLETED" == transaction_status and transactionType == "WITHDRAW":
            query1 = f" UPDATE users SET hold_balance = hold_balance - {Amount} WHERE phone_number = '{phone}'"
            query2 = f"UPDATE transactions SET status = '{transaction_status}', settled = 1 WHERE txn_id = '{txn_ID}' and settled != 1"
            try:
                connector = DBConnector()
                success = connector.execute_queries(query1, query2)
                connector.close_connection()
                return success
            except Exception as e:
                return False

        else:
            query = f"UPDATE transactions SET status = '{transaction_status}' WHERE txn_id = '{txn_ID}'"
            try:
                connector = DBConnector()
                success = connector.execute_query(query)
                connector.close_connection()

                return success
            except Exception as e:
                return False


def save_user_state_data(phone=None, Wallet_balance=None, User_Status=None):
    if Wallet_balance is not None:
        try:
            print("Wallet Balance : ", Wallet_balance, phone)
            query = f""" update users set usdt_balance = {Wallet_balance} where phone_number = {phone} """

            connector = DBConnector()
            success = connector.execute_query(query)
            connector.close_connection()

            return success
        except Exception as e:
            return False

    if User_Status is not None:

        if User_Status == 'Active':
            query = f"UPDATE users SET active = True WHERE phone_number = {phone}"
        elif User_Status == 'Banned':
            query = f"UPDATE users SET active = False WHERE phone_number = {phone}"

        try:
            connector = DBConnector()
            success = connector.execute_query(query)
            connector.close_connection()

            return success
        except Exception as e:
            return False


def get_hold_balance(number):
    query = f"SELECT sum(amount) from transactions WHERE phone_number = {number} AND status = 'PROCESSING' AND type = 'WITHDRAW' "

    connector = DBConnector()
    result = connector.fetch_all(query)
    connector.close_connection()

    if result is None:
        return []
    else:
        return result[0][0]


def get_all_users():
    query = "SELECT * FROM users"

    connector = DBConnector()
    result = connector.fetch_all(query)
    connector.close_connection()

    if result is None:
        return []
    data = []
    for row in result:
        data.append({
            "phone_number": row[0],
            "usdt_balance": row[1],
            "hold_balance": get_hold_balance(row[0]),
            "t_me": row[3],
            "transaction_password": row[4],
            "active": row[5],
        })

    return data


def get_all_transactions():
    ten_days_ago_timestamp = int(time.time()) - (3 * 24 * 60 * 60)

    query = f"SELECT * FROM transactions where created_at > {ten_days_ago_timestamp} ORDER BY created_at DESC;"

    connector = DBConnector()
    result = connector.fetch_all(query)
    connector.close_connection()

    deposits = []
    withdrawals = []

    if result is None:
        return {'deposits': [], 'withdrawals': []}

    for row in result:
        if row[2] == 'DEPOSIT':
            deposits.append({
                "phone_number": row[0],
                "status": row[1],
                "type": row[2],
                "sub_type": row[3],
                "deposit_address": row[4],
                "txn_id": row[6],
                "amount": row[10],
                "created_at": convert_timestamp(row[11]),
                "deposit_txn_id": row[13],
                "exchange_rate": row[14],
            })

        else:
            withdrawals.append({
                "phone_number": row[0],
                "status": row[1],
                "type": row[2],
                "sub_type": row[3],
                "withdraw_address": row[5],
                "txn_id": row[6],
                "account_no": row[7],
                "account_name": row[8],
                "ifsc": row[9],
                "amount": row[10],
                "created_at": convert_timestamp(row[11]),
                "updated_at": convert_timestamp(row[12]),
                "exchange_rate": row[14],
            })

    return {'deposits': deposits, 'withdrawals': withdrawals}


def get_settings():
    query = "SELECT * FROM settings"

    connector = DBConnector()
    result = connector.fetch_all(query)
    connector.close_connection()

    data = {
        "exchange_rate": result[0][0],
        "wazir_x_price": result[0][1],
        "binance_price": result[0][2],
        "ku_coin_price": result[0][3],
        "invite_link": result[0][4],
        "qr": result[0][5],
        "address": result[0][6]
    }

    return data


def get_user_by_phone_number(phone_number):
    query = f"SELECT * FROM users where phone_number = {phone_number} limit 1"

    connector = DBConnector()
    result = connector.fetch_all(query)
    connector.close_connection()
    if result is None or len(result) < 1:
        return None

    result = result[0]
    return {
        "phone_number": result[0],
        "usdt_balance": result[1],
        "hold_balance": result[2],
        "t_me": result[3],
        "transaction_password": result[4],
        "active": result[5]
    }


def get_users_all_transactions(number):
    query = f"SELECT * FROM transactions WHERE phone_number = {number}"

    connector = DBConnector()
    result = connector.fetch_all(query)
    connector.close_connection()

    return result


def get_a_user_transactions(phone_number):
    query = f"SELECT * FROM transactions where phone_number = {phone_number}"

    connector = DBConnector()
    result = connector.fetch_all(query)
    connector.close_connection()

    return result


def get_no_completed_transactions(phone_number):
    query = f"SELECT COUNT(*) FROM transactions where phone_number = {phone_number} and status='COMPLETED'"

    connector = DBConnector()
    result = connector.fetch_all(query)
    connector.close_connection()
    if result is None or len(result) < 1:
        return 0
    else:
        return result[0][0]


def transform_status(status):
    if status == "COMPLETED":
        return "Success"
    if status == "PROCESSING":
        return "Processing"
    if status == "FAILED":
        return "Failed"
    return status


def convert_timestamp(timestamp):
    utc_datetime = datetime.utcfromtimestamp(timestamp)

    # Define the timezone for India (IST)
    ist_timezone = pytz.timezone('Asia/Kolkata')

    # Convert UTC datetime to IST datetime
    ist_datetime = utc_datetime.replace(tzinfo=pytz.utc).astimezone(ist_timezone)

    # Format IST datetime as string
    ist_time = ist_datetime.strftime('%Y-%m-%d %H:%M:%S')

    return ist_time


def get_deposits(phone_number):
    query = f"SELECT * FROM transactions where phone_number = {phone_number} and type='DEPOSIT' ORDER BY created_at DESC"
    connector = DBConnector()
    result = connector.fetch_all(query)
    connector.close_connection()
    if result is None:
        return []
    data = []
    for row in result:
        data.append({
            "id": row[6],
            "status": transform_status(row[1]),
            "type": row[2],
            "amount": row[10],
            "time": convert_timestamp(row[11]),
            "exchange_rate": row[14]
        })

    return data


def get_withdrawls(phone_number):
    query = f"SELECT * FROM transactions where phone_number = {phone_number} and type='WITHDRAW' ORDER BY created_at DESC"
    connector = DBConnector()
    result = connector.fetch_all(query)
    connector.close_connection()
    if result is None:
        return []

    data = []
    for row in result:
        data.append({
            "id": row[6],
            "status": transform_status(row[1]),
            "type": row[2],
            "amount": row[10],
            "time": convert_timestamp(row[11]),
            "exchange_rate": row[14]
        })

    return data


def get_withdrawal_details(txn_id):
    query = f"SELECT * FROM transactions where txn_id = '{txn_id}' limit 1"

    connector = DBConnector()
    result = connector.fetch_all(query)
    connector.close_connection()

    print(result)

    response = {
        "txn_id": result[0][6],
        "amount": result[0][10],
        "exchange_rate": result[0][14],
        "account_no": result[0][7],
        "account_name": result[0][8],
        "ifsc": result[0][9],
        "created_at": convert_timestamp(result[0][11]),
        "updated_at": convert_timestamp(result[0][12]),
        "status": transform_status(result[0][1]),
    }

    return response


def get_a_transaction(phone_number, txn_id):
    query = f"SELECT * FROM transactions where phone_number = {phone_number} And txn_id = {txn_id}"

    connector = DBConnector()
    result = connector.fetch_all(query)
    connector.close_connection()

    return result


def create_transaction(txn_id, status, amount, type, user_id):
    query = """
    INSERT INTO transactions (txn_id, status, amount, type, Userid)
    VALUES (%s, %s, %s, %s, %s)
    """
    values = (txn_id, status, amount, type, user_id)

    connector = DBConnector()
    success = connector.execute_query(query, values)
    connector.close_connection()

    return success


def edit_tg_username_model(username, phone):
    query = """
     UPDATE users SET t_me = %s WHERE phone_number = %s
    """
    values = (username, phone)

    connector = DBConnector()
    success = connector.execute_query(query, values)
    connector.close_connection()

    return success


def encrypt_password(password):
    hashed_password = bcrypt.hash(password)
    return hashed_password


def edit_wdt_password_model(password, phone):
    try:
        connector = DBConnector()

        # Hash the password
        encrypted_password = encrypt_password(password)

        query = "UPDATE users SET transaction_password = %s WHERE phone_number = %s"
        values = (encrypted_password, phone)

        success = connector.execute_query(query, values)
        connector.close_connection()

        return success
    except Exception as e:
        logging.error(f"An error occurred while updating the password: {str(e)}")
        return False


def authenticate_user_by_pass(phone, password):
    try:
        connector = DBConnector()
        query = "SELECT transaction_password, salt FROM users WHERE phone_number = %s"
        values = (phone,)
        result = connector.fetch_all(query, values)

        if not result or len(result) == 0:
            return False

        stored_password = result[0][0]
        salt = result[0][1]

        entered_password_hashed = bcrypt.hashpw(password.encode('utf-8'), salt.encode('utf-8'))

        success = bcrypt.checkpw(entered_password_hashed, stored_password.encode('utf-8'))

        connector.close_connection()

        return success
    except Exception as e:
        logging.error(f"An error occurred during authentication: {str(e)}")
        return True


def create_INR_wdt_model(phone, amount, accountNo, accountName, ifsc, exchange_rate):
    try:
        query = """
            INSERT INTO transactions (txn_id, phone_number, amount, account_no, account_name, ifsc,
            exchange_rate, created_at, updated_at, deposit_txn_id,
            status, type, sub_type)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 'PROCESSING', 'WITHDRAW', 'INR')
        """

        query2 = f"UPDATE users SET usdt_balance = usdt_balance - {amount}, hold_balance = hold_balance + {amount} WHERE phone_number = '{phone}'"

        tid =get_txn_id()
        values = (
            tid, phone, amount, accountNo, accountName, ifsc, exchange_rate, int(time.time()),
            int(time.time()), tid)

        connector = DBConnector()
        success = connector.execute_queries(query1=query, query2=query2, values1=values)
        connector.close_connection()

        return success

    except Exception as e:
        logging.error(f"An error occurred while creating INR withdrawal: {str(e)}")
        print(f"An error occurred while creating INR withdrawal: {str(e)}")
        return False


def create_deposit_model(phone, address, txn_id, exchange_rate, status, amount):
    try:
        query = """
            INSERT INTO transactions (txn_id, phone_number, deposit_address, deposit_txn_id, exchange_rate, created_at, updated_at, status, amount, type, sub_type)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, 'DEPOSIT', 'USDT')
        """
        values = (get_txn_id(), phone, address, txn_id, exchange_rate, int(time.time()), int(time.time()), status, amount)

        connector = DBConnector()
        success = connector.execute_query_raise(query, values)
        connector.close_connection()

        return success
    except Exception as e:
        if "transactions.unique_deposit_txn_id" in str(e):
            raise HashAlreadyExist("Transaction already exists with given hash")

        print(str(e))
        logging.error(f"An error occurred while creating deposit txn: {str(e)}")
        return False


def create_USDT_wdt_model(phone, amount, withdraw_address, exchange_rate):
    try:
        query = """
            INSERT INTO transactions (txn_id, phone_number, amount, withdraw_address, exchange_rate,created_at, updated_at, deposit_txn_id, status, type, sub_type)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, 'PROCESSING', 'WITHDRAW', 'USDT')
        """

        tid = get_txn_id()
        values = (tid, phone, amount, withdraw_address, exchange_rate, int(time.time()), int(time.time()), tid)

        connector = DBConnector()
        success = connector.execute_query_raise(query, values)
        connector.close_connection()

        return success

    except Exception as e:
        logging.error(f"An error occurred while creating INR withdrawal: {str(e)}")
        print(f"An error occurred while creating INR withdrawal: {str(e)}")
        return False


def get_txn_id():
    return "WME" + str(randint(1000000000, 9999999999))

# APPROX. UNIQUE TXN ID'S
# def get_txn_id():
#     timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
#     random_number = randint(10000, 99999)
#     return f"WME{timestamp}{random_number}"
