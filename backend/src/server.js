import dotenv from 'dotenv';
import app from './app.js';
import {createServer} from 'http';
import {Server} from 'socket.io';

dotenv.config();
const httpServer = createServer(app);

export const io = new Server(httpServer, {
    cors: {
        origin: '*',
    },
});

io.on('connection', (socket) => {
    console.log('Client connected: ',socket.id);

    socket.on('disconnect', () =>{
        console.log('Disconnected: ', socket.id);
    });
});

const port = process.env.PORT || 3000;

httpServer.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
})