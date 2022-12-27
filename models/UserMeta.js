const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const userMetaSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    meta: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: false
    },
    isEditable: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
}
)

userMetaSchema.plugin(AutoIncrement, {
    inc_field: 'meta',
    id: 'metaId',
    start_seq: 1
})

module.exports = mongoose.model('userMeta', userMetaSchema)