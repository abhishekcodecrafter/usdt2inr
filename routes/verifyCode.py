from flask import request, jsonify, session
import requests


def verify_code():
    try:
        data = request.json
        print(data)
        number = data.get('number')
        entered_code_string = data.get('enteredCode')
        secret = data.get('secret')

        if not number or not entered_code_string:
            return jsonify({'success': False, 'error': 'Number and code are required parameters'}), 400

        entered_code = int(entered_code_string)

        api_url = "https://2factor.in/API/V1/d7b643bb-d6aa-11eb-8089-0200cd936042/SMS/VERIFY/{}/{}";
        api_url = api_url.format(secret, entered_code)
        print(api_url)

        headers = {
            'Content-Type': 'application/json',
        }

        try:
            response = requests.get(api_url, headers=headers)
            response_data = response.json()
            print(response_data)

            if response_data.get('Status') == "Success":
                session['phone_number'] = number
                return jsonify({'success': True, 'message': 'Verification successful'}), 200
            else:
                return jsonify({'success': False, 'error': 'Invalid verification code or expired'}), 400

        except Exception as e:
            print('Error:', e)
            return jsonify({'success': False, 'error': 'Error verifying code'}), 500

    except Exception as e:
        print('Error verifying code:', e)
        return jsonify({'success': False, 'error': 'Error verifying code'}), 500
