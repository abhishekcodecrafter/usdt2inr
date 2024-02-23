from flask import request, jsonify
import requests


def send_verification():
    try:
        data = request.json
        number = data.get('number')

        if not number:
            return jsonify({'success': False, 'error': 'Number is a required parameter'}), 400

        api_url = 'https://2factor.in/API/V1/d7b643bb-d6aa-11eb-8089-0200cd936042/SMS/{}/AUTOGEN/EpicWin'
        ph_number = '+91' + number
        api_url = api_url.format(ph_number)
        print(api_url)

        headers = {
            'Content-Type': 'application/json',
        }

        try:
            response = requests.get(api_url, headers=headers)
            print('Phone Number is:', number)
            response_data = response.json()
            print(response)

            if response_data.get('Status') == "Success":
                return jsonify({'success': True, 'secret': response_data['Details'], 'message': 'Verification code sent successfully'}), 200
            else:
                return jsonify({'success': False, 'error': 'Error sending Verification Code.'}), 200

        except Exception as e:
            print('Error:', e)

    except Exception as e:
        print('Error sending verification code:', e)
        return jsonify({'success': False, 'error': 'Error sending verification message'}), 500
