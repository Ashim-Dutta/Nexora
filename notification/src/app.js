const express = require('express');
const {connect,subscribeToQueue} = require('./broker/broker');
const app = express();

connect();

app.get('/', (req, res) => {
    res.send('Notification service up and running');
})

subscribeToQueue('AUTH_NOTIFICATION.USER_CREATED', (data) => {
    console.log(data);
})

module.exports = app;