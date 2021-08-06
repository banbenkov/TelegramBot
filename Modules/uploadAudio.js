const {Chat} = require('../models/models')
const YandexApi = require('yandex-disk').YandexDisk
const fs = require('fs')
const path = require('path')
const moment = require('moment')

module.exports = (bot) => {

    const typeFile = 'Audio'
    const dir = path.resolve(__dirname, '..', 'Audio')
    const uploadData = (dirName, fromDir, fileName, YandexDrive) => {
        YandexDrive.cd(dirName)
        YandexDrive.uploadFile(fromDir + fileName, fileName, (err, msg) => {
            YandexDrive.cd('..')
            YandexDrive.cd('..')
            YandexDrive.cd('..')
            console.log(YandexDrive._workDir)
            fs.unlink(dir + '\\' + fileName, err => {
                console.log(err)})
        })
    }


    bot.on('audio', async msg => {
        const chat = await Chat.findOne({where: {chatId: msg.chat.id}})
        if (chat !== null && chat.dirName !== undefined) {
            const YandexDrive = new YandexApi(chat.tokenYandex)
            await bot.downloadFile(msg.audio.file_id, dir).then(msg => {

                moment.locale('ru')
                const toDay = moment().format('L')

                const FileName = msg.substr(dir.length)
                console.log(toDay)
                YandexDrive.cd(chat.dirName)
                YandexDrive.exists(toDay, (err, msg) => {
                    if (msg === false) {
                        YandexDrive.mkdir(toDay, (err, msg) => {
                            YandexDrive.cd(toDay)
                            YandexDrive.exists(typeFile, (err, msg) => {
                                if (msg === false) {
                                    YandexDrive.mkdir(typeFile, (err, msg) => {
                                        uploadData(typeFile, dir, FileName, YandexDrive)
                                    })
                                } else {
                                    uploadData(typeFile, dir, FileName, YandexDrive)
                                }
                            })
                        })
                    }else {
                        YandexDrive.cd(toDay)
                        YandexDrive.exists(typeFile, (err, msg) => {
                            if (msg === false) {
                                YandexDrive.mkdir(typeFile, (err, msg) => {
                                    uploadData(typeFile, dir, FileName, YandexDrive)
                                })
                            } else {
                                uploadData(typeFile, dir, FileName, YandexDrive)
                            }
                        })
                    }
                })

            })
        }


    })
}