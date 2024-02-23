from flask import request, jsonify
import requests

def send_verification():
    try:
        data = request.json
        number = data.get('number')

        if not number:
            return jsonify({'success': False, 'error': 'Number is a required parameter'}), 400

        api_url = 'https://13.233.206.35/sendVerification'
        api_data = {'number': number}

        headers = {
            'Content-Type': 'application/json',
        }

        try:
            response = requests.post(api_url, json=api_data, headers=headers)
            print('Phone Number is:', number)
            print('Raw response:', response.text)
            response_data = response.json()
            print(response)

            if response_data.get('success'):
                return jsonify({'success': True, 'message': 'Verification message sent successfully'}), 200
            else:
                return jsonify({'success': False, 'error': 'Error sending Verification Code.'}), 200
            
        except Exception as e:
            print('Error:', e)
 


    except Exception as e:
        print('Error sending verification code:', e)
        return jsonify({'success': False, 'error': 'Error sending verification message'}), 500
