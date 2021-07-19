
const TelegramApi = require('node-telegram-bot-api')
const YandexApi = require('yandex-disk').YandexDisk
const Photo = require('./Modules/uploadPhoto')
const Document = require('./Modules/uploadDocument')
const Audio = require('./Modules/uploadAudio')
const Video = require('./Modules/uploadVideo')

const token = '1729959924:AAE1uk45EkR7cNQmFMSO697p5WSRSyH7LlU'


const bot = new TelegramApi(token, {polling: true})

const chats = {}

const dirPhoto = 'C:\\Users\\79629\\WebstormProjects\\TelegramBot\\photo\\'
const dirDocument = 'C:\\Users\\79629\\WebstormProjects\\TelegramBot\\documents\\'
const dirAudio = 'C:\\Users\\79629\\WebstormProjects\\TelegramBot\\Audio\\'
const dirVideo = 'C:\\Users\\79629\\WebstormProjects\\TelegramBot\\Video\\'




bot.setMyCommands([
    {command: '/start', description: 'Начальное приветствие'},
    {command: '/info', description: 'Получить информцию о пользователе'},
    {command: '/game', description: 'Игра угадай цифру'},
    {command: '/addyd', description: 'Список чатов пользователя'},
])

const start = () => {
    const YandexDrive = new YandexApi('AQAAAAA49M0rAAdAD2hXUEyVyEuDrKirDkPiOFk')
    Photo(bot, YandexDrive, dirPhoto)
    Document(bot, YandexDrive, dirDocument)
    Audio(bot, YandexDrive, dirAudio)
    Video(bot, YandexDrive, dirVideo)
}


start()