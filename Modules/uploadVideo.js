module.exports = (bot, YandexDrive, dir) => {

    const typeFile = 'Video'

    const uploadData = (dirName, fromDir, fileName) => {
        YandexDrive.cd(dirName)
        YandexDrive.uploadFile(fromDir + fileName, fileName, (err, msg) => {
            YandexDrive.cd('..')
            YandexDrive.cd('..')
            YandexDrive.cd('..')
            console.log(YandexDrive._workDir)
        })
    }


    bot.on('video', async msg => {
        await bot.downloadFile(msg.video.file_id, dir).then(msg => {
            const currentDate = new Date()
            const toDay = currentDate.getDate() + "." + currentDate.getMonth() + "." + currentDate.getFullYear()

            const FileName = msg.substr(dir.length)
            console.log(toDay)
            YandexDrive.cd('Bot')
            YandexDrive.exists(toDay, (err, msg) => {
                if (msg === false) {
                    YandexDrive.mkdir(toDay, (err, msg) => {
                        YandexDrive.cd(toDay)
                        YandexDrive.exists(typeFile, (err, msg) => {
                            if (msg === false) {
                                YandexDrive.mkdir(typeFile, (err, msg) => {
                                    uploadData(typeFile, dir, FileName)
                                })
                            } else {
                                uploadData(typeFile, dir, FileName)
                            }
                        })
                    })
                }else {
                    YandexDrive.cd(toDay)
                    YandexDrive.exists(typeFile, (err, msg) => {
                        if (msg === false) {
                            YandexDrive.mkdir(typeFile, (err, msg) => {
                                uploadData(typeFile, dir, FileName)
                            })
                        } else {
                            uploadData(typeFile, dir, FileName)
                        }
                    })
                }
            })

        })


    })
}