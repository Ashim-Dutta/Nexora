const express = require('express');
const { connect, subscribeToQueue } = require('./broker/broker');
const setListners = require('./broker/listners');
const app = express();

connect().then(() => {
    
    setListners();
})

app.get('/', (req, res) => {
    res.send('Notification service up and running');
})



module.exports = app;