const WebSocket = require('ws');
const GameRoom = require('./GameRoom');

class Index {
    constructor(server) {
        this.connectionCount = 0;
        this.ws = new WebSocket.Server({ server });
        this.rooms = {};

        console.log('--[ INIT ]-- Index Setup');

        // Just create a room initially for testing
        this.createRoom('test', 'this is a test name');

        // Listener for a new connection to the WebSocket server
        this.ws.on('connection', (client, req) => {
            client.ip = req.connection.remoteAddress;
            client.isAlive = true;
            client.on('pong', () => this.heartbeat(client));

            // If the connection is a brand new connection the server has to send the client som stuff
            if (client.protocol === 'new-connection') {
                console.log(
                    '--[ WS CONNECTION ]-- New connection to room:',
                    client.protocol,
                    'from IP:',
                    req.connection.remoteAddress,
                    'this is connection:',
                    this.connectionCount
                );

                // Assign the client a unique ID
                client.send(JSON.stringify({ type: 'initial-connection' }));
            }

            // Listen for messages from the client
            client.on('message', rawmsg => {
                const message = JSON.parse(rawmsg);

                switch (message.type) {
                    case 'room-connection':
                        this.clientJoinRoom(client, message.data);
                        break;
                }
            });
        });

        // Check what clients are still alive every 30 seconds
        // ToDo: move this to the GameRoom class so that the rooms know the user has disconnected
        setInterval(() => {
            this.ws.clients.forEach(clientWS => {
                if (clientWS.isAlive === false) return clientWS.terminate();
                clientWS.isAlive = false;
                clientWS.ping(() => {});
            });
        }, 30000);

        // Check if rooms are still active every 2 minutes
        // ToDo: move the interval to the GameRoom class. This will avoid issues if this check is made as a room is created
        setInterval(() => {
            this.checkAliveRooms();
        }, 120000);
    }

    createRoom(hostname, roomname, data = {}) {
        const gameRoom = new GameRoom(hostname, roomname, data);
        this.rooms[gameRoom.roomhash] = gameRoom;

        return gameRoom.roomhash;
    };

    checkAliveRooms() {
        const aliveRooms = {};
        for (let room in this.rooms) {
            if (!this.rooms.hasOwnProperty(room)) continue;
            if (this.rooms[room].players.length > 0) {
                aliveRooms[room] = this.rooms[room];
            }
        }
    };

    clientJoinRoom(client, data) {
        console.log('--[ WS ROOM CONNECTION ]-- Attempting to connect to room:', data.roomHash);

        // Check if a room actually exists
        if (!this.rooms.hasOwnProperty(data.roomHash)) {
            console.log('--[ WS ROOM CONNECTION FAILURE ]-- Room', data.roomHash, 'does not exist');
            client.send(JSON.stringify({
                type: 'room-connection',
                data: {
                    success: false,
                    reason: 'Room does not exist',
                },
            }));
            return false;
        }

        client.username = data.username;
        this.rooms[data.roomHash].connect(client);
    };

    heartbeat(ws) {
        ws.isAlive = true;
    }
}

module.exports = Index;