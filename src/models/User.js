const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        lowercase: true,
        required: [true, 'Name is required'],
    },
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: [true, 'Email is required'],
        validate(val) {
            const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            if(!emailRegex.test(val))
                throw new Error('Please enter valid email address')
        }
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
    },
    UserInformation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserInformation'
    }
},
{
    timestamps: true
})

userSchema.query.byName = (value) => {
    return this.where({ name: new RegExp(value, 'i') })
}

userSchema.query.byUsername = (value) => {
    return this.where({ username: new RegExp(value, 'i') })
}

userSchema.query.byEmail = (value) => {
    return this.where({ email: new RegExp(value, 'i') })
}

userSchema.query.byGeneric = (column ,value) => {
    return this.where({ [column]: new RegExp(value, 'i') })
}

userSchema.statics.getAll = (column ,value) => {
    return this.find({ [column]: new RegExp(value, 'i') })
}

userSchema.statics.getOne = (column ,value) => {
    return this.findOne({ [column]: new RegExp(value, 'i') })
}

userSchema.methods.isValidPassword = async (password) => {
    const user = this
    const compare = await bcrypt.compare(password, user.password)

    return compare
}

module.exports = mongoose.model('User', userSchema)