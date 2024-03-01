import requests
from flask import Flask, request, jsonify 

app = Flask(__name__)

def get_bank_details(ifsc_code):
    url = f"https://ifsc.rizad.me/?ifsc={ifsc_code}"
    response = requests.get(url)

    try:
        response.raise_for_status()  # Check for HTTP errors
        result = response.json()
        return result
    except requests.exceptions.HTTPError as errh:
        return {"error": f"HTTP Error: {errh}"}
    except requests.exceptions.RequestException as err:
        return {"error": f"Request Exception: {err}"}
    except requests.exceptions.JSONDecodeError:
        return {"error": "Response is not in JSON format"}

@app.route('/Validate_IFSC', methods=['POST'])
def validate_IFSC():
    data = request.get_json()
    ifsc_code = data.get('ifsc')
    print("IFSC Code in Validate IFSC: ", ifsc_code)

    bank_details = get_bank_details(ifsc_code)

    if "error" in bank_details:
        print(bank_details["error"])
        response_data = {
            'status': 'Failed',
            'message': f'Invalid IFSC Code: {ifsc_code}',
            'error': bank_details["error"]
        }
    else:
        print(bank_details)
        response_data = {
            'status': 'Success',
            'message': 'IFSC code validated successfully',
            'bank_details': bank_details
        }

    return jsonify(response_data)