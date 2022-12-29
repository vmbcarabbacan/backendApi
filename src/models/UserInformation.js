const mongoose = require('mongoose')
const AutoIncrement = require("mongoose-sequence")(mongoose)

const userInformationSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required']
    },
    familyName: {
        type: String,
        required: [false, 'Family name is required']
    },
    profile: {
        type: String,
        default: '/img/profile/default.png'
    }
}
)

userInformationSchema.plugin(AutoIncrement, {
    inc_field: 'userInformation',
    id: 'userInformationId',
    start_seq: 100
})

userInformationSchema.virtual('fullName')
.get(() => {
    return `${this.firstName} ${this.familyName}`
})
.set((v) => {
    this.firstName = v.substr(0, v.indexOf(' '))
    this.familyName = v.substr(v.indexOf(' ') + 1)
})

module.exports = mongoose.model('UserInformation', userInformationSchema)