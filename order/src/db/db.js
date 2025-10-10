const mongoose = require('mongoose')

async function connectDb(){
    try {

        await mongoose.connect(process.env.MONGO_URI)
        console.log("✅ Database Connected Successfully");
        
    } catch (error) {
        console.log("❌ Internal server error");
    }
}

module.exports = connectDb