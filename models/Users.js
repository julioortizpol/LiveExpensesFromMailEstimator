const mongoose = require('mongoose');
const { Schema } = mongoose

const userSchema = new Schema({
    name: {
        required: true,
        type: String
    },
    mail: {
        required: true,
        type: String
    },
    lastConsultDate: {
        type: Date
    }
})

const Users = mongoose.model('Users', userSchema)

module.exports = Users
