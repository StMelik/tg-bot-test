const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')

const token = '5392746667:AAHkp5DejjfwlxY2xsypeFRJhmufiwH7V3A'

const bot = new TelegramApi(token, {polling: true})

const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Сейчас я загадаю цыфру от 0 до 9, а ты попробуй ее отгадай!')
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber
    console.log(chats)
    await bot.sendMessage(chatId, 'Отгадывай!', gameOptions)
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветствие'},
        {command: '/info', description: 'Узнать свое имя'},
        {command: '/game', description: 'Игра угадай число'},
    ])

    bot.on('message', async msg => {
        const text = msg.text
        const chatId = msg.chat.id

        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://cdn.tlgrm.app/stickers/ccd/a8d/ccda8d5d-d492-4393-8bb7-e33f77c24907/192/1.webp')
            return  bot.sendMessage(chatId, 'Добро пожаловать в мой первый тестовый бот.')
        }

        if (text === '/info') {
            return  bot.sendMessage(chatId, `Тебя зовут ${msg.from['first_name']}`)
        }

        if (text === '/game') {
           return startGame(chatId)
        }

        return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй еще раз!')
    })

    bot.on('callback_query', async msg => {
        const data = msg.data
        const chatId = msg.message.chat.id

        if (data === '/again') {
            return startGame(chatId)
        }

        if (data == chats[chatId]) {
            return await bot.sendMessage(chatId, `Ура! Ты отгадал цифру ${data}`, againOptions)
        } else {
            return await bot.sendMessage(chatId, `К сожелению, ты не угадал, бот загадал цифру ${chats[chatId]}`, againOptions)
        }
    })
}

start()