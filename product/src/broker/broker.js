const amqp = require('amqplib');

let channel, connection;

async function connect() {
    
    if(connection) return connection;

    try {
        connection = await amqp.connect(process.env.RABBIT_URL);
        console.log('Connected to RabbitMQ');
        channel = await connection.createChannel();
    } catch (error) {
        console.log(error);
    }
}


async function publishToQueue(queueName, data = {}) {
    if (!channel || !connection) await connect();
    
    await channel.assertQueue(queueName, {
        durable: true
    })

    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)))
}

async function subscribeToQueue(queueName, callback) {
    if (!channel || !connection) await connect();
    
    await channel.assertQueue(queueName, {
        durable: true
    })

    channel.consume(queueName, async(msg) => {
        if (msg !== null) {
           await callback(JSON.parse(msg.content.toString()));
            channel.ack(msg);
        }
    })
}

module.exports = { connect,channel,connection,publishToQueue,subscribeToQueue };