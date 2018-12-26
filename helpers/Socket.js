const WebSocket = require('ws');
const bcrypt = require('bcrypt-nodejs');

class Socket {
    constructor(server) {
        this.connectionCount = 0;
        this.ws = new WebSocket.Server({ server });
        this.rooms = {};

        console.log('--[ INIT ]-- Socket Setup');

        this.createRoom('test', 'this is a test name');

        this.ws.on('connection', (ws, req) => {
            ws.isAlive = true;
            ws.on('pong', () => this.heartbeat(ws));

            if (ws.protocol === 'new-connection') {
                console.log(
                    '--[ WS CONNECTION ]-- New connection to room:',
                    ws.protocol,
                    'from IP:',
                    req.connection.remoteAddress,
                    'this is connection:',
                    this.connectionCount
                );
                ws.id = this.connectionCount++;
                ws.send(JSON.stringify({ type: 'connection-id-assign', data: { id: ws.id } }));
            } else {
                console.log('--[ WS CONNECTION ]--', ws.protocol, 'has reconnected to the server');
                ws.id = ws.protocol;
            }

            ws.on('message', rawmsg => {
                const message = JSON.parse(rawmsg);

                switch (message.type) {
                    case 'room-connection':
                        this.clientJoinRoom(ws, message.data.roomHash);
                        ws.on('close', () => {
                            this.prepareForDisconnect(ws, message.data.roomHash);
                            console.log('Has Closed');
                        });
                        break;
                }
            });
        });

        setInterval(() => {
            this.ws.clients.forEach(clientWS => {
                if (clientWS.isAlive === false) return clientWS.terminate();
                clientWS.isAlive = false;
                clientWS.ping(() => {});
            });
        }, 30000);

        setInterval(() => {
            this.checkAliveRooms();
        }, 120000);
    }

    prepareForDisconnect(ws, roomHash) {
        this.rooms[roomHash].inactivePlayers[ws.id] = ws;
        console.log('--[ WS ROOM CONNECTION ]-- Client', ws.id, 'has gone inactive, wait 15 seconds before doing anything');
        setTimeout(() => {
            if (this.rooms[roomHash].inactivePlayers.hasOwnProperty(ws.id)) {
                const players = [];
                console.log('--[ WS ROOM CONNECTION ]-- Is client', ws.id, 'still disconnected?');
                for (let player of this.rooms[roomHash].players) {
                    if (player.id !== ws.id) {
                        players.push(player);
                    }
                }

                this.rooms[roomHash].players = players;
            }
        }, 15000);
    }

    createRoom(hostname, roomname, data = {}) {
        let roomhash = bcrypt.hashSync(hostname + roomname, '', null);
        roomhash = roomhash.replace(/[^a-zA-Z]/g, '');

        while (this.rooms.hasOwnProperty(roomhash)) {
            roomhash = bcrypt.hashSync(hostname + roomname + Math.floor((Math.random() * 10000) + 1), '', null);
            roomhash = roomhash.replace(/[^a-zA-Z]/g, '');
        }

        console.log('--[ WS ROOM CREATION ]-- Creating new room:', roomhash);

        this.rooms[roomhash] = {
            password: data.password || null,
            players: [],
            inactivePlayers: {},
            maxPlayers: data.maxPlayers || 16,
        };

        return roomhash;
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

    clientJoinRoom(client, roomHash) {
        console.log('--[ WS ROOM CONNECTION ]-- Attempting to connect to room:', roomHash);

        if (!this.rooms.hasOwnProperty(roomHash)) {
            console.log('--[ WS ROOM CONNECTION FAILURE ]-- Room', roomHash, 'does not exist');
            client.send(JSON.stringify({
                type: 'room-connection',
                data: {
                    success: false,
                    reason: 'Room does not exist',
                },
            }));
            return false;
        }

        let exists = false;
        let count = 0;

        for (let roomClient of this.rooms[roomHash].players) {
            if (client.id === roomClient.id) {
                exists = true;
                this.rooms[roomHash].players[count] = client;
                console.log('--[ WS ROOM CONNECTION ]-- Client', client.id, 'has reconnected to room', roomHash);
                break;
            }

            count++;
        }

        if (this.rooms[roomHash].inactivePlayers.hasOwnProperty(client.id)) {
            console.log('--[ WS ROOM CONNECTION ]-- Client', client.id, 'has reconnected');
            delete this.rooms[roomHash].inactivePlayers[client.id];
        }

        if (!exists) {
            this.rooms[roomHash].players.push(client);
            console.log('--{ WS ROOM CONNECTION ]-- Client', client.id, 'Successfully joined the room', roomHash);
        }
    };

    heartbeat(ws) {
        ws.isAlive = true;
    }
}

module.exports = Socket;