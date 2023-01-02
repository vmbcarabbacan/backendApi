const mongoose = require("mongoose")
const User = require('./User');

const tripSchema = new mongoose.Schema({
    passenger: {
        type: User.schema,
        required: true
    },
    
})