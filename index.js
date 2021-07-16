const TelegramApi = require('node-telegram-bot-api')
const YandexApi = require('yandex-disk').YandexDisk

const token = '1729959924:AAE1uk45EkR7cNQmFMSO697p5WSRSyH7LlU'


const bot = new TelegramApi(token, {polling: true})

const chats = {}

const dir = 'C:\\Users\\79629\\WebstormProjects\\TelegramBot\\photo\\'

const YandexDrive = new YandexApi('AQAAAAA49M0rAAdAD2hXUEyVyEuDrKirDkPiOFk')

const createMainDir = () => {
    YandexDrive.mkdir('Bot', (err, msg) => {
        console.log(msg)
    })
}

const createDateDir = () => {
    const currentDate = new Date()
    YandexDrive.mkdir(currentDate.getDate() + "." + currentDate.getMonth() + "." + currentDate.getFullYear(), (err, msg) => {
        console.log(msg)
    })

}

const createTypeDir = (type) => {
    YandexDrive.mkdir(type, (err, msg) => {

    })

}

const gameOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: '1', callback_data: '1'}, {text: '2', callback_data: '2'}, {text: '3', callback_data: '3'}],
            [{text: '4', callback_data: '4'}, {text: '5', callback_data: '5'}, {text: '6', callback_data: '6'},],
            [{text: '7', callback_data: '7'}, {text: '8', callback_data: '8'}, {text: '9', callback_data: '9'},],
        ]
    })
}

const againOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: 'Игрть еще раз', callback_data: '/again'}]
        ]
    })
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветствие'},
        {command: '/info', description: 'Получить информцию о пользователе'},
        {command: '/game', description: 'Игра угадай цифру'},
        {command: '/addyd', description: 'Список чатов пользователя'},
    ])

    bot.on('message', async msg => {
        const text = msg.text
        const chatId = msg.chat.id

    })

    bot.on('photo', async msg => {
        await bot.downloadFile(msg.photo[2].file_id, dir).then(msg => {
            const currentDate = new Date()

            const FileName = msg.substr(dir.length)
            console.log(currentDate.getDate() + "." + currentDate.getMonth() + "." + currentDate.getFullYear())


            const p = new Promise(resolve => {
                YandexDrive.exists(currentDate.getDate() + "." + currentDate.getMonth() + "." + currentDate.getFullYear(), (err, msg) => {
                    if (msg === false) {
                        createDateDir()
                    }
                })
            })

            p.then(data => {
                YandexDrive.uploadFile(dir + FileName, FileName, (err, msg) => {
                    console.log(msg)
                })
                YandexDrive._workDir = '/Bot'
            })

        })

    })

}

start()