from passlib.hash import bcrypt
import logging
from db.db_connector import DBConnector

def create_user(phonenumber, usdtbalance, active, deposit_address):
    query = """
    INSERT INTO users (phonenumber, usdtbalance, active, deposit_address)
    VALUES (%s, %s, %s, %s)
    """
    values = (phonenumber, usdtbalance, active, deposit_address)

    connector = DBConnector()
    success = connector.execute_query(query, values)
    connector.close_connection()

    return success



def get_todays_INR_value():
    query = "SELECT todaysINRvalue FROM settings ORDER BY id DESC LIMIT 1;"
    
    connector = DBConnector()
    result = connector.fetch_all(query)
    connector.close_connection()

    return result

def get_exchanges_todays_value():
    query = "SELECT WaZirxPrice, BinancePrice, KuCoinPrice FROM settings ORDER BY id DESC LIMIT 1;"
    
    connector = DBConnector()
    result = connector.fetch_all(query)
    connector.close_connection()

    return result

def get_all_users():
    query = "SELECT * FROM users"
    
    connector = DBConnector()
    result = connector.fetch_all(query)
    connector.close_connection()

    return result

def get_a_user(phonenumber):
    query = f"SELECT * FROM users where phonenumber = {phonenumber}"
    
    connector = DBConnector()
    result = connector.fetch_all(query)
    connector.close_connection()

    return result

def get_all_transactions():
    query = "SELECT * FROM transactions"
    
    connector = DBConnector()
    result = connector.fetch_all(query)
    connector.close_connection()

    return result

def get_users_all_transactions(number):
    query = f"SELECT * FROM transactions WHERE phonenumber = {number}"
    
    connector = DBConnector()
    result = connector.fetch_all(query)
    connector.close_connection()

    return result

def get_a_user_transactions(phonenumber):
    query = f"SELECT * FROM transactions where phonenumber = {phonenumber}"
    
    connector = DBConnector()
    result = connector.fetch_all(query)
    connector.close_connection()

    return result


def get_a_transaction(phonenumber,Txnid):
    query = f"SELECT * FROM transactions where phonenumber = {phonenumber} And Txnid = {Txnid}"
    
    connector = DBConnector()
    result = connector.fetch_all(query)
    connector.close_connection()

    return result

def create_transaction(Txnid, status, amount, type, Userid):
    query = """
    INSERT INTO transactions (Txnid, status, amount, type, Userid)
    VALUES (%s, %s, %s, %s, %s)
    """
    values = (Txnid, status, amount, type, Userid)

    connector = DBConnector()
    success = connector.execute_query(query, values)
    connector.close_connection()

    return success


def edit_tg_username_model(username, phone):
    query = """
     UPDATE users SET t_me = %s WHERE phonenumber = %s
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

        query = "UPDATE users SET wdtpasswd = %s WHERE phonenumber = %s"
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
        query = "SELECT wdtpasswd, salt FROM users WHERE phonenumber = %s"
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
        return False



def create_INR_wdt_model(phone, amount, accountNo, accountName, ifsc):
    try:
        query = """
INSERT INTO transactions (phonenumber, amount, accountNo, accountName, ifsc, status, type, sub_type)
VALUES (%s, %s, %s, %s, %s, 'processing', 'withdrawal', 'INR')
"""

        values = (phone, amount, accountNo, accountName, ifsc)

        connector = DBConnector()
        success = connector.execute_query(query, values)
        connector.close_connection()

        return success

    except Exception as e:
        logging.error(f"An error occurred while creating INR withdrawal: {str(e)}")
        print(f"An error occurred while creating INR withdrawal: {str(e)}")
        return False
    

def create_USDT_wdt_model(phone, amount,usdtaddress):
    try:
        query = """
INSERT INTO transactions (phonenumber, amount, uusdt_address, status, type, sub_type)
VALUES (%s, %s, %s, 'processing', 'withdrawal', 'USDT')
"""

        values = (phone, amount, usdtaddress)

        connector = DBConnector()
        success = connector.execute_query(query, values)
        connector.close_connection()

        return success

    except Exception as e:
        logging.error(f"An error occurred while creating INR withdrawal: {str(e)}")
        print(f"An error occurred while creating INR withdrawal: {str(e)}")
        return False