const mongoose = require("mongoose")
const User = require('./User');

const statuses = ['Pending', 'Onboard', 'Completed', 'Cancelled', 'Rescheduled']
const tripSchema = new mongoose.Schema({
    passenger: {
        type: User.schema,
        required: true
    },
    driver: {
        type: User.schema,
        required: false
    },
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
    }
})

module.exports = mongoose.model("Trip", tripSchema);
