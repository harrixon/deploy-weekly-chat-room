class SocketRouter {
    constructor(io, redisClient) {
        this.io = io;
        this.redisClient = redisClient;
        this.chatroomName = "";
        this.user = "";
    }

    router() {
        this.io.on('connection', (socket) => {
            console.log('a user has connected to our socket.io server');
            console.log('this is from socket.io : \n', socket.session.passport);

            if (!socket.session.passport) {
                socket.emit('unauthorized');
            } else {
                this.user = socket.session.passport.user;
                // console.log(this.user);  // same user obj from db

                socket.on("subscribe", room => {
                    if (this.chatroomName !== room) {
                        this.chatroomName = room;
                        this.onJoinRoom(socket);
                    }
                });

                socket.on("chat message", msg => {
                    console.log('new msg')
                    this.onMsgReceive(socket, msg);
                });

                socket.on('disconnect', () => {
                    this.onDisconnect();
                });
            }
        });
    }

    onJoinRoom(socket) {
        socket.join(this.chatroomName);
        console.log(`a user has joined room: ${this.chatroomName}`);
        this.io.to(this.chatroomName).emit('join room', `new user in room: ${this.chatroomName}.`);

        this.fetchMsg(socket, 0);
    }

    onMsgReceive(socket, msg) {
        let storeMsg = `${this.user.email} : ${msg}`;
        this.redisClient.lpush(this.chatroomName, storeMsg, (err, data) => {
            if (err) { throw err; }
        });
        // console.log(storeMsg);
        // console.log(this.chatroomName);
        this.io.to(this.chatroomName).emit('chat message', storeMsg);
    }

    fetchMsg(socket, count) {
        this.redisClient.lrange(this.chatroomName, count, count + 10, (err, messages) => {
            if (err) {
                console.log(err);
                this.io.emit('read chat error');
                return;
            }
            messages.reverse();
            // let msgBlock = {
            //     user: this.user,
            //     msg: messages
            // };
            this.io.to(this.chatroomName).emit('old message', messages);
        });
    }

    onDisconnect() {
        this.chatroomName = "";
        console.log('a user left us');
    }
}

module.exports = SocketRouter;