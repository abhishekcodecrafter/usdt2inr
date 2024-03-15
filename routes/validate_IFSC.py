import requests
from flask import Flask, request, jsonify

from routes.send_message import send_message

app = Flask(__name__)


def get_bank_details(ifsc_code):
    try:
        url = f"https://ifsc.rizad.me/?ifsc={ifsc_code}"
        response = requests.get(url)
        response.raise_for_status()  # Check for HTTP errors
        result = response.json()
        return result
    except requests.exceptions.HTTPError as errh:
        return {"error": f"HTTP Error: {errh}"}
    except requests.exceptions.RequestException as err:
        return {"error": f"Request Exception: {err}"}
    except Exception as e:
        return {"error": "Unexpected Error"}


@app.route('/Validate_IFSC', methods=['POST'])
def validate_IFSC():
    try:
        data = request.get_json()
        ifsc_code = data.get('ifsc')
        bank_details = get_bank_details(ifsc_code)

        if "error" in bank_details:
            print(bank_details["error"])
            response_data = {
                'status': 'Failed',
                'message': f'Invalid IFSC Code: {ifsc_code}',
                'error': bank_details["error"]
            }
        else:
            response_data = {
                'status': 'Success',
                'message': 'IFSC code validated successfully',
                'bank_details': bank_details
            }

        return jsonify(response_data)
    except Exception as e:
        send_message(f"Error in fetching ifsc code : {e}")
        raise e
