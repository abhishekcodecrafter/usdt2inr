from flask import request, jsonify, redirect, abort, session, render_template
from db.models import *

admins = ['admin1', 'admin2', '9509251093', '9001939821', '9256308961']

def get_user_phone_number():
    return session.get('phone_number', None)

def admin_panel():
    phone = get_user_phone_number()
    if not phone:
        return redirect('/')
    if phone in admins:
        return render_template('admin.html',phone=phone)
    else:
        abort(403, "You are not authorized to access this page.")


def get_users():
    users = get_all_users()
    phone = get_user_phone_number()

    if not phone:
        if not phone in admins:
            abort(403, "You are not authorized to access this page.")

    response_data = {
        "success": True,
        "message": "Users retrieved successfully",
        "data": users
    }

    return jsonify(response_data)


def get_transactions():
    transactions = get_all_transactions()
    phone = get_user_phone_number()

    if not phone:
        if not phone in admins:
            abort(403, "You are not authorized to access this page.")

    response_data = {
        "success": True,
        "message": "Transactions retrieved successfully",
        "data": transactions
    }

    return jsonify(response_data)



def get_settings_route():
    phone = get_user_phone_number()

    if not phone:
        if not phone in admins:
            abort(403, "You are not authorized to access this page.")


    try:
        settings = get_settings()


        return jsonify({'data': settings}), 200

    except Exception as e:
        print(f"Error in get_settings_route: {str(e)}")
        return jsonify({'error': 'Internal Server Error'}), 500



def save_user_data():
    phone = get_user_phone_number()

    if not phone:
        if not phone in admins:
            abort(403, "You are not authorized to change this data.")

    try:
        data = request.get_json()
        phone_number = data.get('phone_number')
        edited_value = data.get('editedValue')
        status = data.get('status')

        if edited_value:
            save_user_state_data(phone=phone_number,Wallet_balance=edited_value)

        if status:
             save_user_state_data(phone=phone_number,User_Status=status)

        return 'Data received successfully', 200
    except Exception as e:
        print(f"Error processing data: {str(e)}")
        return 'Error processing data', 500