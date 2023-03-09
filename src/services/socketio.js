const socket = (io) => {
    const loginUser = new Map();
    
    io.on('connection', (socket) => {
        console.log('a user connected');
        socket.on('disconnect', () => {
            console.log('user disconnected');
        });

        socket.on('send-data', (data) => {
            socket.emit('receive-data', 'hello');
        })

        socket.on('login', (userId) => {
            loginUser.set(userId, socket.id);
            socket.emit('receive-data', loginUser);
        })

        socket.on('logout', (userId) => {
            loginUser.delete(userId);
        })

        socket.on('updated-profile', (data) => {
            socket.emit('receive-data', 'hello');
            // const notifId = loginUser.get(data._id);
        })
    });
}

module.exports = socket
