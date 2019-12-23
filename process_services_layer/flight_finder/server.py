from flask import Flask, request, jsonify
import requests

from user import user_exists


app = Flask(__name__)


@app.route("/")
def home():
    return "Hello, World!"


url_search_flight = 'http://search_flight/'


@app.route("/find/<airport>")
def find(airport):
    user_id = request.headers.get('Authorization')

    if user_id is not None and user_exists(user_id):
        r = requests.get(url_search_flight + 'flights/' + airport)
        return jsonify(r.json()), r.status_code
    else:
        return jsonify({"error": "Not a valid user!"}), 401


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=80)
