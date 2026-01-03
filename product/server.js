require('dotenv').config()
const app = require('./src/app')
const connectDb = require('./src/db/db')
const { connect } = require('./src/broker/broker')

connectDb()
connect()
app.listen(3000, () => {
    console.log("Server is listing in port number 3000");
})