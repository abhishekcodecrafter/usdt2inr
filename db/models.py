import time
from random import randint

from passlib.hash import bcrypt
import logging
from db.db_connector import DBConnector


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


def get_exchanges_todays_value():
    query = "SELECT wazir_x_price, binance_price, ku_coin_price FROM settings LIMIT 1;"

    connector = DBConnector()
    result = connector.fetch_all(query)
    connector.close_connection()
    if result is None or len(result) < 1:
        return None

    return result[0]


def get_all_users():
    query = "SELECT * FROM users"

    connector = DBConnector()
    result = connector.fetch_all(query)
    connector.close_connection()

    return result


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
        "active": result[5],
        "wallet_address": "TJsBwTcscL5WxUNoFoQxEHou8CJc3ghKqv",
        "wallet_qr": ""
    }


def get_all_transactions():
    query = "SELECT * FROM transactions"

    connector = DBConnector()
    result = connector.fetch_all(query)
    connector.close_connection()

    return result


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


def get_deposits(phone_number):
    query = f"SELECT * FROM transactions where phone_number = {phone_number} and type='DEPOSIT'"
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
            "timestamp": row[11]
        })

    return data


def get_withdrawls(phone_number):
    query = f"SELECT * FROM transactions where phone_number = {phone_number} and type='WITHDRAW'"
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
            "timestamp": row[11]
        })

    return data


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

        # Retrieve the hashed password and salt from the database
        query = "SELECT transaction_password, salt FROM users WHERE phone_number = %s"
        values = (phone,)
        result = connector.fetch_all(query, values)

        if not result or len(result) == 0:
            # User not found
            return False

        stored_password = result[0][0]
        salt = result[0][1]

        # Hash the entered password with the retrieved salt
        entered_password_hashed = bcrypt.hashpw(password.encode('utf-8'), salt.encode('utf-8'))

        # Check if the hashed entered password matches the stored password
        success = bcrypt.checkpw(entered_password_hashed, stored_password.encode('utf-8'))

        connector.close_connection()

        return success
    except Exception as e:
        logging.error(f"An error occurred during authentication: {str(e)}")
        return True


def create_INR_wdt_model(phone, amount, accountNo, accountName, ifsc):
    try:
        query = """
            INSERT INTO transactions (txn_id, phone_number, amount, account_no, account_name, ifsc,
            created_at, updated_at,
            status, type, sub_type)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, 'PROCESSING', 'WITHDRAW', 'INR')
        """

        values = (get_txn_id(), phone, amount, accountNo, accountName, ifsc, int(time.time()), int(time.time()))

        connector = DBConnector()
        success = connector.execute_query(query, values)
        connector.close_connection()

        return success

    except Exception as e:
        logging.error(f"An error occurred while creating INR withdrawal: {str(e)}")
        print(f"An error occurred while creating INR withdrawal: {str(e)}")
        return False


def create_deposit_model(phone, address, txn_id):
    try:
        query = """
            INSERT INTO transactions (txn_id, phone_number, deposit_address, deposit_txn_id, created_at, updated_at, status, type, sub_type)
            VALUES (%s, %s, %s, %s, %s, %s, 'PROCESSING', 'DEPOSIT', 'USDT')
        """
        values = (get_txn_id(), phone, address, txn_id, int(time.time()), int(time.time()))

        connector = DBConnector()
        success = connector.execute_query(query, values)
        connector.close_connection()

        return success
    except Exception as e:
        logging.error(f"An error occurred while creating deposit txn: {str(e)}")
        return False


def create_USDT_wdt_model(phone, amount, withdraw_address):
    try:
        query = """
            INSERT INTO transactions (txn_id, phone_number, amount, withdraw_address, status, type, sub_type)
            VALUES (%s, %s, %s, %s, 'PROCESSING', 'WITHDRAW', 'USDT')
        """

        values = (get_txn_id(), phone, amount, withdraw_address)

        connector = DBConnector()
        success = connector.execute_query(query, values)
        connector.close_connection()

        return success

    except Exception as e:
        logging.error(f"An error occurred while creating INR withdrawal: {str(e)}")
        print(f"An error occurred while creating INR withdrawal: {str(e)}")
        return False


def get_txn_id():
    return "WME" + str(randint(1000000000, 9999999999))
