from flask import Flask, request, jsonify
import os

from telegram_functions import init_bot, send_flight_info


updater = init_bot()
updater.start_polling()

app = Flask(__name__)


@app.route("/")
def home():
    return "Hello, World!"


@app.route("/start", methods=["POST"])
def start():
    updater.start_polling()
    return "Bot started!"


@app.route("/stop", methods=["POST"])
def stop():
    updater.stop()
    return "Bot stopped!"


@app.route("/update", methods=["POST"])
def update():
    data = request.json
    
    err_msg = None
    if 'status' not in data:
        err_msg = 'Mandatory field "status" not present!'
    elif 'chatId' not in data:
        err_msg = 'Mandatory field "chatId" not present!'
    elif 'flight' not in data:
        err_msg = 'Mandatory field "flight" not present!'

    if err_msg is not None:
        return jsonify({ "error": err_msg }), 400

    send_flight_info(updater, data['status'], data['chatId'], data['flight'])

    return jsonify({ "msg": "OK" }), 200


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=80)
