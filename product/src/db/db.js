const mongoose = require('mongoose')

async function connectDb() {
    try {
        await mongoose.connect(process.env.MONGO_URI,
            {
                
            }
        )
        console.log("MongoDb is connected");
    } catch (error) {
        console.log("MongoDb connection error",error);
    }
}

module.exports = connectDb