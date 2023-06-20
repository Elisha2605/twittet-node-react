import app from './server/src/app';
import http from 'http';
import { Server } from 'socket.io';
import User from 'src/models/user.model';
import { getUserById } from 'src/services/user.service';

const port = process.env.PORT || 5000;
const server = http.createServer(app);

// Configure CORS options
const corsOptions = {
    origin: 'http://localhost:3000', // Replace with your client URL
    credentials: true,
};

const io = new Server(server, { cors: corsOptions });

let onlineUsers: any[] = [];

const addNewUser = (user: string, socketId: string) => {
    !onlineUsers.some((user: any) => user.id === user) &&
        onlineUsers.push({ user, socketId });
};

const removeUser = (socketId: string) => {
    onlineUsers = onlineUsers.filter((user: any) => user.socketId !== socketId);
};

const getReceiverUser = (userId: string) => {
    const user = onlineUsers.find((user) => user.user._id === userId);
    return user;
};

// Socket.IO connection handling
io.on('connection', (socket) => {
    socket.on('newUser', (userId: string) => {
        addNewUser(userId, socket.id);
    });

    socket.on('sendNotification', ({ sender, receiver, type }) => {
        const receiverUser = getReceiverUser(receiver);
        console.log(receiver);
        console.log(receiverUser);
        io.to(receiverUser?.socketId).emit('getNotification', {
            sender,
            type,
        });
    });

    socket.on('disconnect', () => {
        removeUser(socket.id);
    });
});

server.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
