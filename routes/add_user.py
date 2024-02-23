from flask import request, jsonify
from db.models import create_user, get_all_users

def add_user():
    try:
        # Get data from JSON request
        data = request.get_json()

        print("Welcome Data: ", data)

        phonenumber_string = data.get('phonenumber')
        phonenumber = int(phonenumber_string)
        usdtbalance = data.get('usdtbalance')
        active = data.get('active')
        deposit_address = data.get('deposit_address')

        # Check if the user already exists
        existing_users = get_all_users()
        print(existing_users)

        for user in existing_users:
           if user[1] == phonenumber:
               return jsonify({"success": False, "message": "User with the provided phone number already exists"})

       
        success = create_user(phonenumber, usdtbalance, active, deposit_address)

        if success:
            return jsonify({"success": True, "message": "User created successfully"})
        else:
            return jsonify({"success": False, "message": "Error creating user"})

    except Exception as e:
        return jsonify({"success": False, "message": f"Error: {str(e)}"})
