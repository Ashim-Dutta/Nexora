const mongoose = require('mongoose')

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("connected to the database");
    } catch (error) {
        console.log(err);
    }
}

module.exports = connectDB