from flask import Flask, render_template
from flask_cors import CORS
import platform


app = Flask(__name__)
app.secret_key = 'UnseenUmbrellaNeverGotaShower'
CORS(app)


system = platform.system()
development = False
production = False

if system == 'Windows':
    print('Running on Windows By Default Development Server')
    development = True
elif system == 'Linux':
    print('Running on Ubuntu or another Linux distribution By Default Production Server')
    production = True
elif system == 'Darwin':
    print('Running on macOS By Default Development Server')
    development = True
else:
    print(f'Unsupported operating system: {system}')

external_server_url = 'https://13.233.206.35/'

# Import routes
from routes.all_pages import *
from routes.sendVerification import send_verification
from routes.verifyCode import verify_code
from routes.add_user import add_user
from routes.log_out import logout
from routes.changewdtpasswd import change_withdrawals_password
from routes.create_INR_wdt import create_INR_wdt
from routes.create_USDT_wdt import create_USDT_wdt

# Register routes
app.route('/')(index)
app.route('/add_user', methods=['POST'])(add_user)
app.route('/dashboard')(dashboard)
app.route('/profile')(profile)
app.route('/inrwrh')(inrwrh)
app.route('/cwp')(cwp)
app.route('/help')(help)
app.route('/usdtw')(usdtw)
app.route('/usdtwrh')(usdtwrh)
app.route('/usdtidthdrawl')(usdt_widthdrawl)
app.route('/rh')(rh)
app.route('/usdt_deposit')(usdt_deposit)
app.route('/usdt_deposit_info')(usdt_deposit_info)
app.route('/usdtwidthdrawl')(usdt_widthdrawl)
app.route('/fullprofile')(full_profile)
app.route('/sendVerification', methods=['POST'])(send_verification)
app.route('/verifyCode', methods=['POST'])(verify_code)
app.route('/submitDeposit', methods=['POST'])(submitDeposit)
app.route('/logout')(logout)
app.route('/edit_tg_username', methods=['PUT'])(edit_tg_username)
app.route('/change_wdtpassword', methods=['POST'])(change_withdrawals_password)
app.route('/create_INR_wdt_request', methods=['POST'])(create_INR_wdt)
app.route('/create_USDT_wdt_request', methods=['POST'])(create_USDT_wdt)

if __name__ == '__main__':
    if development:
        app.run(host='0.0.0.0', port=8000, debug=True)

    if production:
        from gevent.pywsgi import WSGIServer
        port = 8000
        http_server = WSGIServer(('', port), app)
        print(f'Server is running on http://localhost:{port}')
        http_server.serve_forever()
