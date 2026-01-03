require('dotenv').config()
const app = require('./src/app')
const connectDB = require('./src/db/db')
const { connect } = require('./src/broker/broker')


connectDB()
connect()
app.listen(3004, () => {
    console.log('payment service is running on pport number 3004');
})