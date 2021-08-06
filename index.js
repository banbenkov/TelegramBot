require('dotenv').config()
const axios = require('axios');
const FormData = require('form-data');
const sequelize = require('./db')
const models = require('./models/models')
const {Chat} = require('./models/models')
const TelegramApi = require('node-telegram-bot-api')
const YandexApi = require('yandex-disk').YandexDisk
const Photo = require('./Modules/uploadPhoto')
const Document = require('./Modules/uploadDocument')
const Audio = require('./Modules/uploadAudio')
const Video = require('./Modules/uploadVideo')

const token = process.env.TOKEN_TELEGRAM


const bot = new TelegramApi(token, {polling: true})


bot.setMyCommands([
    {command: '/start', description: 'Начальное приветствие'},
    {command: '/help', description: 'help'},
    {command: '/drive', description: 'Добавить яндекс диск'},
    {command: '/delete', description: 'Удалить яндекс диск'},
])

const start = async () => {

    try {
        await sequelize.authenticate()
        await sequelize.sync()
    } catch (e) {
        console.log(e)
    }

    Photo(bot)
    Document(bot)
    Audio(bot)
    Video(bot)

    bot.on('message', async (msg) => {

        if (msg.text.substr(0, 6) === '/start') {
            return await bot.sendMessage(msg.chat.id, 'Добро пожаловать. Для того что бы начать работать со мной добавьте диск используя команду /drive. Затем для создания и привязки ' +
                'директории куда будут загружаться файлы введите команду /dirname и само название директории через пробел.\n' +
                'Для того что бы я собирал файлы в группе достаточно всего лишь сделать меня её участником. \n' +
                'Более подробную информацию можно получить с помощью команды /help')
        }
        if (msg.text.substr(0, 6) === '/drive') {
            return await bot.sendMessage(msg.chat.id, 'Перейдите по ссылке https://oauth.yandex.ru/authorize?response_type=code&client_id=b9d47c175bb6425f8a0bcdb4c9d135e5 для добавления Яндекс диска. ' +
                'Затем впишите полученный код после команды /code.\n Пример: /code 1234567')
        }
        if (msg.text.substr(0, 5) === '/code' ) {

            const chat = await Chat.findOne({where: {chatId: msg.chat.id}})

            if (chat === null) {
                const data = new FormData();
                data.append('grant_type', 'authorization_code');
                data.append('code', msg.text.substr(6, 7));
                data.append('client_id', 'b9d47c175bb6425f8a0bcdb4c9d135e5');
                data.append('client_secret', '887b8dc271bb4cb5abe29af707c321a5');

                const config = {
                    method: 'post',
                    url: 'https://oauth.yandex.ru/token',
                    headers: {
                        'Host': 'oauth.yandex.ru',
                        ...data.getHeaders()
                    },
                    data : data
                };

                axios(config)
                    .then(function (response) {
                        const resYandex = response.data;
                        Chat.create({chatId: msg.chat.id, tokenYandex: resYandex.access_token })
                        bot.sendMessage(msg.chat.id, 'Яндекс диск успешно добавлен')
                    })
                    .catch(function (error) {
                        bot.sendMessage(msg.chat.id, 'Ошибка при добавление')
                    });


            } else {
                return await bot.sendMessage(msg.chat.id, 'К этому чату уже привязан Яндекс диск')
            }
        }

        if (msg.text.substr(0, 7) === '/delete') {
            const chat = await Chat.findOne({where:{chatId: msg.chat.id}})
            if (chat === null) {
                return await bot.sendMessage(msg.chat.id, 'К этому чату не привязан Яндекс диск')
            } else {
                await chat.destroy()
                await bot.sendMessage(msg.chat.id, 'Яндекс диск удалён')
            }
        }

        if (msg.text.substr(0, 8) === '/dirname') {
            const chat = await Chat.findOne({where: {chatId: msg.chat.id}})
            if (chat === null) {
                return await bot.sendMessage(msg.chat.id, 'К этому чату не привязан Яндекс диск')
            } else {
                const YandexDrive = new YandexApi(chat.tokenYandex)
                YandexDrive.exists(msg.text.substr(9), async (err, message) => {
                    if (message === false) {
                        await YandexDrive.mkdir(msg.text.substr(9), (err, msg) => {

                        })
                        chat.dirName = msg.text.substr(9)
                        await chat.save()
                        return bot.sendMessage(msg.chat.id, 'Директория создана и привязана')
                    } {
                        chat.dirName = msg.text.substr(9)
                        await chat.save()
                        return bot.sendMessage(msg.chat.id, 'Директория привязана')
                    }
                })

            }
        }

        if (msg.text.substr(0, 5) === '/help') {
            return bot.sendMessage(msg.chat.id, 'Вы можете управлять мной посылая эти команды:\n ' +
                '/drive - для получения ссылки на добавления Яндекс диска\n ' +
                '/code - для ввода полученного кода по ссылке. Пример ввода: /code 1234567\n ' +
                '/dirname - для создания и привязывания директории в яндекс диске к боту. Если директория' +
                'не существует, в таком случае она будет автоматически создана\n ' +
                '/delete - отвязывает яндекс диск от бота\n ' +
                'По всем вопросам, предложениям и найденным ошибкам писать @banbenkov')
        }


    })


}


start()