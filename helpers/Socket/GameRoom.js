const bcrypt = require('bcrypt-nodejs');

// This class will handle what is needed for the game room to function
class GameRoom {
    constructor(roomname, hostname, data = {}) {
        // The chances of this roomhash already existing is basically impossible...
        this.roomhash = bcrypt.hashSync(hostname + roomname + Math.floor((Math.random() * 10000) + 1) + new Date().toDateString(), '', null);
        this.roomhash = this.roomhash.replace(/[^a-zA-Z]/g, '');

        console.log('--[ WS ROOM CREATION ]-- Creating new room:', this.roomhash);

        this.password = data.password || null;
        this.players = [];
        this.maxPlayers = data.maxPlayers || 16;
    }

    // Disconnect the client from the room
    disconnect(client) {
        console.log('--[ WS ROOM DISCONNECT ]-- Client', client.id, 'has disconnected from room', this.roomhash);
        const players = [];

        for (let player of this.players) {
            if (player.id !== client.id) {
                player.id = players.length;
                players.push(player);
            }
        }

        this.players = players;
        this.sendMessageToAll(JSON.stringify({ type: 'user-disconnected' }));
    }

    // Connect a client to the room
    // ToDo: PRooms can be password protected
    // ToDo: Max number of clients per room
    connect(client) {
        client.id = this.players.length;
        this.players.push(client);

        // Listen for the clients to close their connection
        client.on('close', () => {
            this.disconnect(client);
        });

        console.log('--{ WS ROOM CONNECTION ]-- Client', client.id, 'Successfully joined the room', this.roomhash);
        client.send(JSON.stringify({ type: 'room-connected' }));
        this.sendMessageToAll(JSON.stringify({ type: 'user-connected', data: { username: client.username } }));
    }

    sendMessageToAll(message) {
        for (let client of this.players) {
            client.send(message);
        }
    }
}

module.exports = GameRoom;