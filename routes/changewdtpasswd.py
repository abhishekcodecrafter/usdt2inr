from flask import Flask, render_template, request, jsonify, redirect
from flask_cors import CORS
from db.models import edit_wdt_password_model  # Import your function for changing the withdrawals password
from routes.create_INR_wdt import get_user_phone_number


def change_withdrawals_password():
    try:
        data = request.get_json()
        new_password = data.get('newPassword')
        reenter_password = data.get('reenterPassword')
        security_otp = data.get('securityOTP')

        phone = get_user_phone_number();
        if not phone:
            return redirect('/')
        # You might want to add additional validation logic here

        # Check if new password and reentered password match
        if new_password != reenter_password:
            return jsonify({'success': False, 'message': 'New password and re-entered password do not match'})

        # Perform the actual password change in the database
        success = edit_wdt_password_model(new_password, phone)

        if success:
            return jsonify({'success': True, 'message': 'Withdrawals password changed successfully'})
        else:
            return jsonify({'success': False, 'message': 'Failed to change withdrawals password'})

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return jsonify({'success': False, 'message': 'An error occurred while processing your request'})
