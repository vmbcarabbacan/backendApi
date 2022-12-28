const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'User'
    },
    active: {
        type: Boolean,
        default: true
    }
})

userSchema.methods.isValidPassword = async (password) => {
    const user = this
    const compare = await bcrypt.compare(password, user.password)

    return compare
}

module.exports = mongoose.model('User', userSchema)