from passlib.hash import bcrypt
import logging
from flask import request, jsonify , redirect , session
from db.models import get_user_by_phone_number, create_INR_wdt_model, get_current_exchange_rate


def get_user_phone_number():
    return session.get('phone_number', None)


def create_INR_wdt():
    try:
        phone = get_user_phone_number()
        if not phone:
            return redirect('/')

        data = request.get_json()
        amount = data.get('amount')
        accountNo = data.get('accountNo')
        accountName = data.get('accountName')
        ifsc = data.get('ifsc')
        password = data.get('transactionPassword')

        user_details = get_user_by_phone_number(phone)

        # if int(amount) > user_details['usdt_balance']:
        #     return jsonify({'success': False, 'message': 'Insufficient balance To Trade!'})

        # Authenticate the user
        if not authenticate_user_by_pass(phone, password):
            return jsonify({'success': False, 'message': 'Authentication failed'})

        # Perform the actual data insertion into the database
        success = create_INR_wdt_model(phone, amount, accountNo, accountName, ifsc,get_current_exchange_rate())

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
