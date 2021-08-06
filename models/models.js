const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const Chat = sequelize.define('chat', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    chatId: {type: DataTypes.INTEGER},
    tokenYandex: {type: DataTypes.STRING},
    dirName: {type: DataTypes.STRING}
})
module.exports = {
    Chat
}