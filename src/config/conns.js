const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        const { DATABASE_URI } = process.env
        await mongoose.connect(DATABASE_URI)
    } catch (err) {
        console.log(err)
    }
}

module.exports = connectDB