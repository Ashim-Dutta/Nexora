const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const cookie = require('cookie');

async function initSocketServer(httpServer) {
    const io = new Server(httpServer, {})


    io.use((socket, next) => { 
        const cookies = socket.handshake.headers.cookie;
        
        const { token } = cookies ? cookie.parse(cookies) : {};
        if (!token) {
            return next(new Error('Token not found'));
        }

        try {

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.user = decoded;
            next();
            
        } catch (error) {
            next(new Error('Authentication error'));
        }
    })

    io.on('connection', (socket) => {
        console.log('a user connected');
        socket.on('disconnect', () => {
            console.log('user disconnected');
        }
        );
    });
}

module.exports = { initSocketServer };