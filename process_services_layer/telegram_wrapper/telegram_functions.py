import os, requests
from telegram.ext import CommandHandler, Updater, MessageHandler, Filters


register_user = 'http://register_user/register'

def start(update, context):
    user = {
        'user_id': update.message.from_user.id,
        'username': update.message.from_user.username,
        'first_name': update.message.from_user.first_name,
        'last_name': update.message.from_user.last_name,
        'chat_id': update.effective_chat.id
    }
    
    context.bot.send_message(chat_id=user['chat_id'], text="Hi {}! I'll help you tracking flights!".format(user['first_name']))

    #register user and chat
    r = requests.post(register_user, json=user)
    assert r.status_code == 200


def unknown(update, context):
    context.bot.send_message(chat_id=update.effective_chat.id, text="Sorry, I didn't understand that command.")


def init_bot():
    TOKEN = os.environ['TOKEN']

    updater = Updater(token=TOKEN, use_context=True)

    dispatcher = updater.dispatcher

    start_handler = CommandHandler('start', start)
    dispatcher.add_handler(start_handler)

    unknown_handler = MessageHandler(Filters.command, unknown)
    dispatcher.add_handler(unknown_handler)

    return updater
