import requests
import os


user_adapter_url = 'http://user_adapter/users/'

def user_exists(user_id):
    r = requests.get(user_adapter_url + str(user_id))
    return r.status_code == 200


def register_user(data):
    r = requests.post(user_adapter_url, json=data)
    assert r.status_code == 201


def update_user(id, data):
    r = requests.put(user_adapter_url + str(id), json=data)
    assert r.status_code == 200
