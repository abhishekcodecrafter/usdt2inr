from flask import Flask,session,render_template,redirect,request, jsonify
from db.models import create_user, edit_tg_username_model , get_todays_INR_value, get_exchanges_todays_value, \
                       get_all_users, get_a_user,get_users_all_transactions , get_all_transactions, \
                       get_a_transaction, create_transaction

def get_user_phonenumber():
    return session.get('phonenumber', None)




def index():
    user_phonenumber = get_user_phonenumber()
    if user_phonenumber:
        print('user phone number in index:', user_phonenumber)
        return redirect('/dashboard')
    return render_template('index.html')


def dashboard():
    user_phonenumber = get_user_phonenumber()
    if not user_phonenumber:
        return redirect('/')

    user_details = get_a_user(user_phonenumber)
    if user_details:
        data = user_details[0]
    else:
        print("User not found")

    todays_INR_value = get_todays_INR_value()
    if todays_INR_value:
        inrvalue = todays_INR_value[0][0]

    exchanges_value = get_exchanges_todays_value()
    if exchanges_value:
        exchanges_value = exchanges_value[0]

    return render_template('dashboard.html', user_details = data , inrvalue = inrvalue , exchanges_value = exchanges_value)




def profile():
    user_phonenumber = get_user_phonenumber()
    if not user_phonenumber:
        return redirect('/')
    
    user_details = get_a_user(user_phonenumber)
    if user_details:
        data = user_details[0]
    else:
        print("User not found")
    

    return render_template('profile.html',user_details=data)




def inrwrh():
    user_phonenumber = get_user_phonenumber()
    if not user_phonenumber:
        return redirect('/')


    user_details = get_a_user(user_phonenumber)
    if user_details:
        user_details = user_details[0]
    else:
        print("User not found")

    todays_INR_value = get_todays_INR_value()
    if todays_INR_value:
        inrvalue = todays_INR_value[0][0]


    transactions = get_users_all_transactions(user_phonenumber)
    data = list(transactions)
    return render_template('inrwrh.html',user_details = user_details,inrvalue=inrvalue,transactions=data,user_phonenumber=user_phonenumber)



def cwp():
    user_phonenumber = get_user_phonenumber()
    if not user_phonenumber:
        return redirect('/')
    return render_template('cwp.html',user_phonenumber=user_phonenumber)






def help():
    user_phonenumber = get_user_phonenumber()
    if not user_phonenumber:
        return redirect('/')
    return render_template('help.html')






def usdtw():
    user_phonenumber = get_user_phonenumber()
    if not user_phonenumber:
        return redirect('/')
    transactions = get_users_all_transactions(user_phonenumber)
    if transactions:
        data = list(transactions)
        return render_template('usdtw.html',transactions=data,user_phonenumber=user_phonenumber)
    return render_template('usdtw.html',user_phonenumber=user_phonenumber)






def usdtwrh():
    user_phonenumber = get_user_phonenumber()
    if not user_phonenumber:
        return redirect('/')
    transactions = get_users_all_transactions(user_phonenumber)
    if transactions:
        data = list(transactions)
        return render_template('usdtwrh.html',transactions=data,user_phonenumber=user_phonenumber)
    return render_template('usdtwrh.html',user_phonenumber=user_phonenumber)



def usdtwidthdrawl():
    user_phonenumber = get_user_phonenumber()
    if not user_phonenumber:
        return redirect('/')


    user_details = get_a_user(user_phonenumber)
    if user_details:
        user_details = user_details[0]
    else:
        print("User not found")

    todays_INR_value = get_todays_INR_value()
    if todays_INR_value:
        inrvalue = todays_INR_value[0][0]


    transactions = get_users_all_transactions(user_phonenumber)
    data = list(transactions)
    return render_template('usdtwidthdrawl.html',user_details = user_details,inrvalue=inrvalue,transactions=data,user_phonenumber=user_phonenumber)



def rh():
    user_phonenumber = get_user_phonenumber()
    if not user_phonenumber:
        return redirect('/')
    transactions = get_users_all_transactions(user_phonenumber)
    if transactions:
        data = list(transactions)
        return render_template('rh.html',transactions=data,user_phonenumber=user_phonenumber)
    
    else:
        print("User not found")
    return render_template('rh.html',user_phonenumber=user_phonenumber)






def usdtdeposit():
    user_phonenumber = get_user_phonenumber()
    if not user_phonenumber:
        return redirect('/')
    print('user phone number in usddeposit : ' , user_phonenumber)
    return render_template('usdtdeposit.html')





def usdtdepositinfo():
    user_phonenumber = get_user_phonenumber()
    if not user_phonenumber:
        return redirect('/')
    return render_template('usdtdepositinfo.html')





def fullprofile():
    user_phonenumber = get_user_phonenumber()
    if not user_phonenumber:
        return redirect('/')
    user_details = get_a_user(user_phonenumber)
    if user_details:
        data = user_details[0]
    else:
        print("User not found")

    todays_INR_value = get_todays_INR_value()
    if todays_INR_value:
        inrvalue = todays_INR_value[0][0]
    
    return render_template('fullprofile.html', user_details = data , inrvalue = inrvalue, user_phonenumber=user_phonenumber)





def edit_tg_username():
    user_phonenumber = get_user_phonenumber()
    new_username = request.form.get('newUsername')
    success = edit_tg_username_model(new_username, user_phonenumber)

    return jsonify({'success': success})
