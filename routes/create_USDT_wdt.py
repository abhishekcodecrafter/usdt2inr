from passlib.hash import bcrypt
import logging
from flask import request, jsonify, redirect
from flask_cors import CORS
from db.models import get_user_by_phone_number, create_USDT_wdt_model, get_current_exchange_rate
from routes.all_pages import get_user_phone_number


def create_USDT_wdt():
    try:
        data = request.get_json()
        amount = data.get('amount')
        uusdt_address = data.get('accountNo')
        password = data.get('transactionPassword')

        phone = get_user_phone_number()
        if not phone:
            return redirect('/')

        user_details = get_user_by_phone_number(phone)

        # if int(amount) > user_details['usdt_balance']:
        #     return jsonify({'success': False, 'message': 'Insufficient balance To Trade!'})

        # Authenticate the user
        if not authenticate_user_by_pass(phone, password):
            return jsonify({'success': False, 'message': 'Authentication failed'})

        # Perform the actual data insertion into the database
        success = create_USDT_wdt_model(phone,amount,uusdt_address, get_current_exchange_rate())

        if success:
            return jsonify({'success': True, 'message': 'Data inserted successfully'})
        else:
            return jsonify({'success': False, 'message': 'Failed to insert data'})

    except Exception as e:
        # Log the error using Python's logging module
        logging.error(f"An unexpected error occurred: {str(e)}")
        return jsonify({'success': False, 'message': 'An error occurred while processing your request. Check logs for details.'})

def authenticate_user_by_pass(phone, password):
    try:
        # Retrieve the hashed password and salt from the database
        user = get_user_by_phone_number(phone)

        if user and len(user) > 0:
            stored_hashed_password = user['transaction_password']

            # Check if the input password matches the stored hashed password
            if bcrypt.verify(password, stored_hashed_password):
                return True
            else:
                return False
        else:
            return False
    except Exception as e:
        logging.error(f"An error occurred during authentication: {str(e)}")
        return False
