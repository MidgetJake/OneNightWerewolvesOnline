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
        this.inactivePlayers = {};
        this.maxPlayers = data.maxPlayers || 16;
    }

    // This won't mark or delete the player but will mark them as inactive and will disconnect them in 15 seconds
    // There is probably a better way to do this, but this works for now.
    prepareForDisconnect(client) {

        // Add the player to the inactive list
        this.inactivePlayers[client.id] = client;
        console.log('--[ WS ROOM CONNECTION ]-- Client', client.id, 'has gone inactive, wait 15 seconds before doing anything');

        // Setup a timeout that will fire after 15 seconds, this gives time to reconnect to the server
        setTimeout(() => {
            // If the player has reconnected they shouldn't have an entry in the inactive players object
            if (this.inactivePlayers.hasOwnProperty(client.id)) {
                const players = [];
                console.log('--[ WS ROOM CONNECTION ]-- Is client', client.id, 'still disconnected?');

                // Keep all players that are still active.
                for (let player of this.players) {
                    if (player.id !== client.id) {
                        players.push(player);
                    }
                }

                this.players = players;
            }
        }, 15000);
    }

    clientConnect(client) {
        // This will probably need to be redone slightly and tidied up at some point
        let exists = false;
        let count = 0;

        // Check if this user has already been connected
        for (let roomClient of this.players) {
            if (client.id === roomClient.id) {
                exists = true;

                // Replace the old player with the new player
                this.players[count] = client;

                // ToDo: retain any data that the old player had
                console.log('--[ WS ROOM CONNECTION ]-- Client', client.id, 'has reconnected to room', this.roomhash);
                break;
            }

            count++;
        }

        // If they were marked as inactive then that entry has to be deleted.
        if (this.inactivePlayers.hasOwnProperty(client.id)) {
            console.log('--[ WS ROOM CONNECTION ]-- Client', client.id, 'has reconnected to', this.roomhash);
            delete this.inactivePlayers[client.id];
        }

        // If they don't already exist, add them to the player list.
        if (!exists) {
            this.players.push(client);
            console.log('--{ WS ROOM CONNECTION ]-- Client', client.id, 'Successfully joined the room', this.roomhash);
        }
    }
}

module.exports = GameRoom;