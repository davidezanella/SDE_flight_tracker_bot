from flask import Flask
import os

from telegram_functions import init_bot


updater = init_bot()

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


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=80)




