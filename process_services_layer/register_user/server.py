from flask import Flask, request, jsonify

from user import user_exists, register_user, update_user


app = Flask(__name__)

@app.route("/")
def home():
    return "Hello, World!"


@app.route("/register", methods=["POST"])
def register():
    data = request.json

    err_msg = None
    if 'id' not in data:
        err_msg = 'Mandatory field "id" not present!'
    elif 'username' not in data:
        err_msg = 'Mandatory field "username" not present!'
    elif 'firstName' not in data:
        err_msg = 'Mandatory field "firstName" not present!'
    elif 'chatId' not in data:
        err_msg = 'Mandatory field "chatId" not present!'

    if err_msg is not None:
        return jsonify({ "error": err_msg }), 400

    # call service, check id
    if user_exists(data['id']):
        update_user(data['id'], data)
    else:
        register_user(data)
    return jsonify({"msg": "OK"}), 200


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=80)




