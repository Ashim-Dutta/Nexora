require('dotenv').config()
const app = require('./src/app')
const connectDB = require('./src/db/db')


connectDB()
app.listen(3004, () => {
    console.log('payment service is running on pport number 3004');
})