from flask import Flask, request, jsonify
import requests

from user import user_exists


app = Flask(__name__)


@app.route("/")
def home():
    return "Hello, World!"


url_register_flight = 'http://register_flight-user/'


@app.route("/track", methods=["POST"])
def track():
    data = request.json
    user_id = request.headers.get('Authorization')

    if user_id is not None and user_exists(user_id):
        if 'flightNumber' not in data:
            err_msg = 'Mandatory field "flightNumber" not present!'
            return jsonify({ "error": err_msg }), 400

        data = {
            'userId': user_id,
            'flightNumber': data['flightNumber']
        }
        r = requests.post(url_register_flight + 'userflight', json=data)
        resp = {'msg': 'Inserted correctly'} if r.status_code == 201 else {'error': 'Flight not found!'}
        return jsonify(resp), r.status_code
    else:
        return jsonify({"error": "Not a valid user!"}), 401


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=80)
