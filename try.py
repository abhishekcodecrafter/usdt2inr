import requests
import json

# Replace this with the URL where your Flask app is running
url = 'http://127.0.0.1:8000/change_wdtpassword'

# Dummy data
dummy_data = {
    'phoneNumber': '7073160557',
    'newPassword': 'new_password',
    'reenterPassword': 'new_password',
    'securityOTP': '123456'
}

# Convert data to JSON format
data_json = json.dumps(dummy_data)

# Set the headers
headers = {'Content-Type': 'application/json'}

try:
    # Send the POST request
    response = requests.post(url, data=data_json, headers=headers)

    # Print the response
    print(f"Status Code: {response.status_code}")
    print("Headers:", response.headers)
    print("Body:", response.text)

    # Check if the response is in JSON format
    try:
        json_response = response.json()
        print("JSON Response:", json_response)
    except json.JSONDecodeError:
        print("Response is not in JSON format.")

except requests.RequestException as e:
    print(f"An error occurred during the request: {str(e)}")
