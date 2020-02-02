from flask import Flask, request, jsonify
import requests
import datetime
import threading, time

from user import user_exists, get_user


app = Flask(__name__)


@app.route("/")
def home():
    return "Hello, World!"


url_user_flight = 'http://user-flight_adapter/'
url_flight = 'http://flight_adapter/'
url_calculate_route = 'http://calculate_route_time/'
url_tg_wrapper = 'http://telegram_wrapper/'


@app.route("/location", methods=['POST'])
def location():
    user_id = request.headers.get('Authorization')

    if user_id is not None and user_exists(user_id):
        data = request.json

        err_msg = None
        if 'latitude' not in data:
            err_msg = 'Mandatory field "latitude" not present!'
        elif 'longitude' not in data:
            err_msg = 'Mandatory field "longitude" not present!'

        if err_msg is not None:
            return jsonify({ "error": err_msg }), 400

        #get user fligths
        r = requests.get(url_user_flight + "flight-users/" + user_id)
        relations = r.json()

        results = []
        for rel in relations:
            #get flight destAirport
            r = requests.get(url_flight + "flights/" + rel['flightNumber'])
            res = r.json()
            destAirport = res['arrAirport']
            format_parse = '%Y-%m-%dT%H:%M:%S.%fZ'
            timeArr = datetime.datetime.strptime(res['arrTime'], format_parse)

            data = {
                'airport': destAirport,
                'latitude': data['latitude'],
                'longitude': data['longitude']
            }

            r = requests.post(url_calculate_route + 'route', json=data)
            resp = r.json()
            time = datetime.timedelta(seconds=resp['duration'])
            dist = resp['distance'] / 1000 # Km

            depart = timeArr - time
            if depart < datetime.datetime.now(): # in case user asks info late
                depart = 'now'
            else:
                depart = depart.strftime('%H:%M')
            time = ':'.join(str(time).split(':')[:2])

            data = {
                'distance': dist,
                'destAirport': destAirport,
                'timeNeeded': time,
                'depart': depart
            }
            results.append(data)

        return jsonify(results), 200
    else:
        return jsonify({"error": "Not a valid user!"}), 401


updates = {}

def check_updates():
    print("launched", flush=True)
    while True:
        time.sleep(60 * 2)  # Every 2 minute

        r = requests.get(url_user_flight + "flight-users")
        relations = r.json()
        for r in relations:
            r_f = requests.get(url_user_flight + "flight-users/" +r['userId'] +"/"+ r['flightNumber'])
            result = r_f.json()

            # Just for debug
            if result['flight']['status'] == 'OT':
                print('Flight {} on time'.format(r['flightNumber']), flush=True)
            elif result['flight']['status'] == 'DL':
                print('Flight {} delayed'.format(r['flightNumber']), flush=True)
            elif result['flight']['status'] == 'FE':
                print('Flight {} early'.format(r['flightNumber']), flush=True)
            elif result['flight']['status'] == 'ARR':
                print('Flight {} arrived'.format(r['flightNumber']), flush=True)


            if result['flight']['status'] in ['DL', 'FE', 'ARR']:
                data = {
                    'status': result['flight']['status'],
                    'chatId': result['user']['chatid'],
                    'flight': result['flight']
                }

                key = r['userId'] + '-' + r['flightNumber']
                if (key in updates and updates[key] != result['flight']['status']) or key not in updates: # notify only changes of status
                    updates[key] = result['flight']['status']
                    r = requests.post(url_tg_wrapper + 'update', json=data)



# FE = Flight Early
# NI = Next Information
# OT = Flight On Time
# DL = Flight Delayed
# NO = No status


if __name__ == "__main__":
    thread = threading.Thread(target=check_updates)
    thread.start()

    app.run(debug=False, host='0.0.0.0', port=80)
