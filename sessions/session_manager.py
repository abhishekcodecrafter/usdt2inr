from flask import Flask, session
from flask_session import Session

app = Flask(__name__)
app.config['SECRET_KEY'] = 'abhi213145' 
app.config['SESSION_TYPE'] = 'filesystem'

Session(app)

def set_user_session(user_id):
    session['user_id'] = user_id

def get_user_session():
    return session.get('user_id', None)

def clear_user_session():
    session.pop('user_id', None)
