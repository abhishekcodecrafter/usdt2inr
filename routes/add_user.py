from flask import request, jsonify, redirect
from db.models import create_user, get_user_by_phone_number
from routes.all_pages import get_user_phone_number
from routes.send_message import send_message


def add_user():
    try:
        # Get data from JSON request
        phone_number = get_user_phone_number();
        if not phone_number:
            return redirect('/')

        # Check if the user already exists
        existing_user = get_user_by_phone_number(phone_number)
        print(existing_user)
        if existing_user is None or len(existing_user) < 1:
            usdt_balance = float(0)
            hold_balance = float(0)
            active = True
            success = create_user(phone_number, usdt_balance, hold_balance, active)
            if success:
                return jsonify({"success": True, "message": "User created successfully"}), 200
            else:
                return jsonify({"success": False, "message": "Error creating user"}), 500
        else:
            return jsonify({"success": False, "message": "User already exists"}), 200
    except Exception as e:
        send_message(f"Error while creating user : '{phone_number}', '{e}'")
        return jsonify({"success": False, "message": f"Error: {str(e)}"})
