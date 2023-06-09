import app from './server/src/app';
import http from 'http';
import { Server } from 'socket.io';

const port = process.env.PORT || 5000;
const server = http.createServer(app);

// Configure CORS options
const corsOptions = {
    origin: [process.env.BASE_URL, process.env.PROD_URL],
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

    /** SEND NOTIFICATION */
    socket.on('sendNotification', ({ sender, receiver, type }) => {
        const receiverUser = getReceiverUser(receiver);
        io.to(receiverUser?.socketId).emit('getNotification', {
            sender,
            type,
        });
    });

    /** SEND MESSAGE - START */
    socket.on('sendMessage', ({ sender, receiver, message }) => {
        const receiverUser = getReceiverUser(receiver);
        io.to(receiverUser?.socketId).emit('getMessage', {
            sender,
            receiver,
            message,
        });
    });
    socket.on('sendMessageNotification', ({ sender, receiver, message }) => {
        const receiverUser = getReceiverUser(receiver);
        io.to(receiverUser?.socketId).emit('getMessageNotification', {
            sender,
            receiver,
            message,
        });
    });
    socket.on('sendMessageStatus', ({ messageId, receiver, isMessageRead }) => {
        const receiverUser = getReceiverUser(receiver);
        io.to(receiverUser?.socketId).emit('getMessageStatus', {
            messageId,
            receiver,
            isMessageRead,
        });
    });
    /** SEND MESSAGE - END */

    socket.on('disconnect', () => {
        removeUser(socket.id);
    });
});

server.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
