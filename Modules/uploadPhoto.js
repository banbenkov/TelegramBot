
module.exports = (bot, YandexDrive, dir) => {
    const uploadData = (dirName, fromDir, fileName) => {
        YandexDrive.cd(dirName)
        YandexDrive.uploadFile(fromDir + fileName, fileName, (err, msg) => {
            YandexDrive.cd('..')
            YandexDrive.cd('..')
            YandexDrive.cd('..')
            console.log(YandexDrive._workDir)
        })
    }


    bot.on('photo', async msg => {
        await bot.downloadFile(msg.photo[2].file_id, dir).then(msg => {
            const currentDate = new Date()
            const toDay = currentDate.getDate() + "." + currentDate.getMonth() + "." + currentDate.getFullYear()

            const FileName = msg.substr(dir.length)
            console.log(toDay)
            YandexDrive.cd('Bot')
            YandexDrive.exists(toDay, (err, msg) => {
                if (msg === false) {
                    YandexDrive.mkdir(toDay, (err, msg) => {
                        YandexDrive.cd(toDay)
                        YandexDrive.exists('Photo', (err, msg) => {
                            if (msg === false) {
                                YandexDrive.mkdir('Photo', (err, msg) => {
                                    uploadData('Photo', dir, FileName)
                                })
                            } else {
                                uploadData('Photo', dir, FileName)
                            }
                        })
                    })
                }else {
                    YandexDrive.cd(toDay)
                    YandexDrive.exists('Photo', (err, msg) => {
                        if (msg === false) {
                            YandexDrive.mkdir('Photo', (err, msg) => {
                                uploadData('Photo', dir, FileName)
                            })
                        } else {
                            uploadData('Photo', dir, FileName)
                        }
                    })
                }
            })

        })

    })

}

