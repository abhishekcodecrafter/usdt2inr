import requests
from flask import Flask, request, jsonify

app = Flask(__name__)

def get_bank_details_from_ifsc_lookup(ifsc_code):
    url = f"https://ifsc-lookup-api.p.rapidapi.com/{ifsc_code}"
    headers = {
        "x-rapidapi-key": "f1ef54d763mshc7f6cdbe8d56c93p19fef1jsnd00a57dfaeda",
        "x-rapidapi-host": "ifsc-lookup-api.p.rapidapi.com"
    }
    
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()  # Check for HTTP errors
        return response.json()
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
        bank_details = get_bank_details_from_ifsc_lookup(ifsc_code)

        if "error" in bank_details:
            return jsonify({
                'status': 'Failed',
                'message': f'Invalid IFSC Code: {ifsc_code}',
                'error': bank_details["error"]
            }), 400
        else:
            return jsonify({
                'status': 'Success',
                'message': 'IFSC code validated successfully',
                'bank_details': bank_details
            })

    except Exception as e:
        # Log or handle the exception as needed
        return jsonify({
            'status': 'Failed',
            'message': 'An unexpected error occurred.',
            'error': str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True)
