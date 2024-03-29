const mongoose = require("mongoose")
const User = require('./User');

const statuses = ['Pending', 'Onboard', 'Completed', 'Cancelled', 'Rescheduled']
const tripSchema = new mongoose.Schema({
    
    fromDestination: {
        type: [Number],
        default: [],
        required: false,
    },
    endDestination: {
        type: [Number],
        default: [],
        required: false,
    },
    schedule: {
        type: Date,
        required: [true, 'Date is required'],
        validate(value) {
            const today = new Date()
            const valDate = new Date(value)

            if(today.setHours(today.getHours) < valDate.setHours(valDate.getHours)) {
                throw new Error('Date must not be less that current time and day')
            }
        }
    },
    exclusive: {
        type: mongoose.Schema.Types.Decimal128,
        default: 0.00
    },
    vat: {
        type: mongoose.Schema.Types.Decimal128,
        default: 0.00
    },
    total: {
        type: mongoose.Schema.Types.Decimal128,
        default: 0.00
    },
    customerRating: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: statuses,
        default: 'Pending',
        required: true,
        validate(value) {
            if(!statuses.includes(value)) {
                throw new Error(`${value} is not correct format for status`)
            }
        }
    },
    passenger: {
        type: User,
        required: true
    },
    driver: {
        type: User,
        required: false
    }
})

module.exports = mongoose.model("Trip", tripSchema);
