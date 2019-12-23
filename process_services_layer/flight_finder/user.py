import requests


user_adapter_url = 'http://user_adapter/users/'

def user_exists(user_id):
    r = requests.get(user_adapter_url + str(user_id))
    return r.status_code == 200
