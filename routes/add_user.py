from flask import request, jsonify
from db.models import create_user, get_user_by_phone_number


def add_user():
    try:
        # Get data from JSON request
        data = request.get_json()
        phone_number = data.get('phone_number')

        # Check if the user already exists
        existing_user = get_user_by_phone_number(phone_number)
        print(existing_user)
        if existing_user is None or len(existing_user) < 1:
            usdt_balance = float(0)
            hold_balance = float(0)
            active = True
            success = create_user(phone_number, usdt_balance, hold_balance, active)
            if success:
                return jsonify({"success": True, "message": "User created successfully"})
            else:
                return jsonify({"success": False, "message": "Error creating user"})
        else:
            return jsonify({"success": False, "message": "User already exists"})
    except Exception as e:
        return jsonify({"success": False, "message": f"Error: {str(e)}"})
