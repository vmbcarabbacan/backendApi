const mongoose = require('mongoose')
const AutoIncrement = require("mongoose-sequence")(mongoose)

const userInformationSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    familyName: {
        type: String,
        required: false
    },
    profile: {
        type: Boolean,
        default: '/img/profile/default.png'
    }
}
)

userMetaSchema.plugin(AutoIncrement, {
    inc_field: 'userInformation',
    id: 'userInformationId',
    start_seq: 100
})

module.exports = mongoose.model('UserMeta', userInformationSchema)