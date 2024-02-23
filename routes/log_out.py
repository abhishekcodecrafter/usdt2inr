from flask import session, redirect


def logout():
    session.pop('phone_number', None)
    return redirect('/')
