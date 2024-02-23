from flask import request, jsonify , session
import requests


def verify_code():
    try:
        data = request.json
        number = data.get('number')
        entered_code_string = data.get('enteredCode')
        entered_code = int(entered_code_string)
        print(entered_code_string)
        print(entered_code)

        if not number or not entered_code:
            return jsonify({'success': False, 'error': 'Number and enteredCode are required parameters'}), 400
        
        session['phonenumber'] = number

        api_url = 'https://13.233.206.35/verifyCode'
        verification_data = {'number': number, 'enteredCode': entered_code}

        headers = {
            'Content-Type': 'application/json',
        }

        try:
            response = requests.post(api_url, json=verification_data, headers=headers)
            print('Raw Response:', response.text)
            response_data = response.json()
            print(response_data)

            if response_data.get('success') and response_data.get('isValidCode'):

                return jsonify({'success': True, 'message': 'Verification successful'}), 200
            else:
                return jsonify({'success': False, 'error': 'Invalid verification code or expired'}), 400

        except Exception as e:
            print('Error:', e)
            return jsonify({'success': False, 'error': 'Error verifying code'}), 500

    except Exception as e:
        print('Error verifying code:', e)
        return jsonify({'success': False, 'error': 'Error verifying code'}), 500
