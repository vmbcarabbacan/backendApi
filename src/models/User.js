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
        unique: [true, 'Username already taken']
    },
    email: {
        type: String,
        unique: [true, 'Email already taken'],
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
        enum: ['Admin', 'User', 'Manager', 'Driver', 'Account'],
        default: 'User'
    },
    active: {
        type: Boolean,
        default: true
    },
    userInformation: {
        firstName: {
            type: String,
            lowercase: true,
            required: [true, 'First name is required']
        },
        familyName: {
            type: String,
            lowercase: true,
            required: [false, 'Family name is required']
        },
        contactNumber: {
            type: String,
            default: null
        },
        profile: {
            type: String,
            default: '/img/profile/default.png'
        }
    }
},
{
    timestamps: true
})

userSchema.query.byName = function(value){
    return this.where({ name: new RegExp(value, 'i') })
}

userSchema.query.byUsername = function(value){
    return this.where({ username: new RegExp(value, 'i') })
}

userSchema.query.byEmail = function(value){
    return this.where({ email: new RegExp(value, 'i') })
}

userSchema.query.byGeneric = function(column ,value){
    return this.where({ [column]: new RegExp(value, 'i') })
}

userSchema.statics.getAll = function(column ,value){
    return this.find({ [column]: new RegExp(value, 'i') })
}

userSchema.statics.getOne = function(column ,value){
    return this.findOne({ [column]: new RegExp(value, 'i') })
}

userSchema.methods.isValidPassword = async function(password){
    const user = this
    const compare = await bcrypt.compare(password, user.password)

    return compare
}

module.exports = mongoose.model('User', userSchema)