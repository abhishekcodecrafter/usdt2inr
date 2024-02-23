from flask import session , redirect

def logout():
    session.pop('phonenumber', None)
    return redirect('/')
    
