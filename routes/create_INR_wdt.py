from passlib.hash import bcrypt
import logging
from flask import request, jsonify
from flask_cors import CORS
from db.models import get_a_user, create_INR_wdt_model

def create_INR_wdt():
    try:
        data = request.get_json()
        phone = data.get('phone')
        amount = data.get('amount')
        accountNo = data.get('accountNo')
        accountName = data.get('accountName')
        ifsc = data.get('ifsc')
        password = data.get('transactionPassword')

        # Authenticate the user
        if not authenticate_user_by_pass(phone, password):
            return jsonify({'success': False, 'message': 'Authentication failed'})

        # Perform the actual data insertion into the database
        success = create_INR_wdt_model(phone, amount, accountNo, accountName, ifsc)

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
        user = get_a_user(phone)

        if user and len(user) > 0:
            stored_hashed_password = user[0][6]

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
