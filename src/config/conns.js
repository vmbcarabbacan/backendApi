const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        const { DATABASE_URI } = process.env
        const connectionParams = {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true
        }
        await mongoose.connect(DATABASE_URI)
    } catch (err) {
        console.log(err)
    }
}

module.exports = connectDB