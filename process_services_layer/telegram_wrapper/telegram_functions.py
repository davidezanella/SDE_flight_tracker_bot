import os, requests
from datetime import datetime
from telegram.ext import CommandHandler, Updater, MessageHandler, Filters


register_user = 'http://register_user/register'
flight_finder = 'http://flight_finder/find/'


def start(update, context):
    user = {
        'id': update.message.from_user.id,
        'username': update.message.from_user.username,
        'firstName': update.message.from_user.first_name,
        'lastName': update.message.from_user.last_name,
        'chatId': update.effective_chat.id
    }
    
    context.bot.send_message(chat_id=user['chatId'], text="Hi {}! I'll help you tracking flights!".format(user['firstName']))

    #register user and chat
    r = requests.post(register_user, json=user)
    assert r.status_code == 200


def find_by_arr_airport(update, context):
    if len(context.args) == 0:
        msg = 'You should give me a code of an airport (ex. VRN)'
    else:
        airport = context.args[0]
        header = { 'Authorization': str(update.message.from_user.id) }
        r = requests.get(flight_finder + airport, headers=header)
        if r.status_code == 200:
            flights = r.json()
            msg = "Flights found:\n\n"
            format_parse = '%Y-%m-%dT%H:%M:%SZ'
            format_print = '%d/%m/%Y %H:%M'
            for f in flights:
                dep_time = datetime.strptime(f['depTime'], format_parse)
                dep_time = dep_time.strftime(format_print)
                arr_time = datetime.strptime(f['arrTime'], format_parse)
                arr_time = arr_time.strftime(format_print)
                msg += "From:\n\t\t\U0001F6EB {}\n\t\t\U0001F4C5 {}\nTo:\n\t\t\U0001F6EC {}\n\t\t\U0001F4C5 {}\nFlight ID: \U0000FE0F `{}`\n\n".format(
                    f['depAirport'], dep_time, f['arrAirport'], arr_time, f['flightId'])
        else:
            msg = "Invalid airport code!"

    context.bot.send_message(parse_mode='Markdown', chat_id=update.effective_chat.id, text=msg)


def unknown(update, context):
    context.bot.send_message(chat_id=update.effective_chat.id, text="Sorry, I didn't understand that command.")


def init_bot():
    TOKEN = os.environ['TOKEN']

    updater = Updater(token=TOKEN, use_context=True)

    dispatcher = updater.dispatcher

    start_handler = CommandHandler('start', start)
    dispatcher.add_handler(start_handler)

    find_handler = CommandHandler('find', find_by_arr_airport)
    dispatcher.add_handler(find_handler)

    unknown_handler = MessageHandler(Filters.command, unknown)
    dispatcher.add_handler(unknown_handler)

    return updater
