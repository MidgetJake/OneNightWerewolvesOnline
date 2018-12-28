const shortid = require('shortid');
const CardList = require('../Cards/CardList');

// This class will handle what is needed for the game room to function
class GameRoom {
    constructor(roomname, hostname, data = {}) {
        // The chances of this roomhash already existing is basically impossible...
        // this.roomhash = bcrypt.hashSync(hostname + roomname + Math.floor((Math.random() * 46656)) + new Date().toDateString(), '', null);
        // this.roomhash = this.roomhash.replace(/[^a-zA-Z]/g, '');
        this.roomhash = shortid.generate();

        console.log('--[ WS ROOM CREATION ]-- Creating new room:', this.roomhash);

        this.password = data.password || null;
        this.players = [];
        this.maxPlayers = data.maxPlayers || 16;
        this.cardsInPlay = [];
        this.inProgress = false;
        this.centreCards = [];
    }

    addCard(card) {
        this.cardsInPlay.push(card);
    }

    removeCard(cardName) {
        for (let i = 0; i < this.cardsInPlay.length; i++) {
            if (this.cardsInPlay[i].name === cardName) {
                return this.cardsInPlay.splice(i, 1);
            }
        }
    }

    makeGameTurn(turnOrder, turn) {
        this.sendMessageToAll(JSON.stringify({ type: 'go-sleep' }));
        setTimeout(() => {
            console.log(turn);
            while (!turnOrder.hasOwnProperty(turn.toString())) {
                turn++;
                if (turn > 25) {
                    break;
                }
            }

            if (turn > 25) {
                return;
            }

            this.sendMessageToAll(JSON.stringify({ type: 'turn-text', data: { text: turnOrder[turn.toString()][0].globalInstructions } }));

            console.log(turn, turnOrder[turn.toString()].length);
            for (let cards of turnOrder[turn.toString()]) {
                if (cards.player !== null) {
                    cards.player.send(JSON.stringify({ type: 'wake-up' }));
                }
            }

            setTimeout(() => {
                console.log('Turn done!');
                for (let cards of turnOrder[turn.toString()]) {
                    if (cards.player !== null) {
                        cards.player.send(JSON.stringify({ type: 'go-sleep' }));
                    }
                }

                if (turn <= 25) {
                    this.makeGameTurn(turnOrder, ++turn);
                }
            }, 5000);
        }, 1500);
    }

    startGame() {
        if (this.players.length < 3 || this.players.length > this.cardsInPlay.length - 4) {
            return this.sendMessageToHost(JSON.stringify({ type: 'failed-game-start', data: { reason: 'Not enough players' } }));
        }

        this.inProgress = true;
        this.sendMessageToAll(JSON.stringify({ type: 'game-start' }));

        const cardList = this.cardsInPlay;
        for (let i = cardList.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cardList[i], cardList[j]] = [cardList[j], cardList[i]];
        }

        console.log(cardList);

        for (let i = 0; i < this.players.length; i++) {
            console.log(cardList[i].name);
            this.players[i].send(JSON.stringify({ type: 'card-assign', data: { card: cardList[i].name } }));
            cardList[i].player = this.players[i];
            this.players[i].card = cardList[i].name;
        }

        for (let i = 0; i < 4; i++) {
            this.centreCards.push(this.cardsInPlay[i + this.players.length]);
        }

        const turnOrder = {};
        for (let card of cardList) {
            console.log(card.name, card.player !== null);
            if (turnOrder.hasOwnProperty(card.turn.toString())) {
                turnOrder[card.turn.toString()].push(card);
            } else {
                turnOrder[card.turn.toString()] = [card];
            }
        }

        console.log(turnOrder);

        setTimeout(() => {
            this.makeGameTurn(turnOrder, 0);
            console.log('Game Over!');
        }, 15000);
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
    // ToDo: Rooms can be password protected
    connect(client) {
        if (this.players.length >= this.maxPlayers) {
            console.log('--[ WS ROOM CONNECTION REJECTED ]-- Room', this.roomhash, 'is full!');
            return client.send(JSON.stringify({ type: 'connection-failed', data: { reason: 'Room is full' } }));
        }

        if (this.inProgress) {
            console.log('--[ WS ROOM CONNECTION REJECTED ]-- Room', this.roomhash, 'is in progress!');
            return client.send(JSON.stringify({ type: 'connection-failed', data: { reason: 'Game is in progress' } }));
        }

        client.id = this.players.length;
        client.host = this.players.length === 0;
        this.players.push(client);

        // Listen for the clients to close their connection
        client.on('close', () => {
            this.disconnect(client);
        });

        client.on('message', rawmsg => {
            const message = JSON.parse(rawmsg);

            switch (message.type) {
                case 'add-card':
                    if (!client.host) break;
                    this.addCard(new CardList[message.data.cardName](message.data.clientCardName));
                    this.sendMessageToAll(JSON.stringify({ type: 'update-card', data: { card: message.data.clientCardName, active: true } }));
                    break;
                case 'remove-card':
                    if (!client.host) break;
                    this.removeCard(message.data.cardName);
                    this.sendMessageToAll(JSON.stringify({ type: 'update-card', data: { card: message.data.clientCardName, active: false } }));
                    break;
                case 'get-cards':
                    client.send(JSON.stringify({ type: 'get-cards', data: { cards: this.cardsInPlay.map(card => (card.clientName)) } }));
                    break;
                case 'start-game':
                    if (!client.host) break;
                    this.startGame();
                    break;
            }
        });

        console.log('--[ WS ROOM CONNECTION ]-- Client', client.id, 'Successfully joined the room', this.roomhash);
        client.send(JSON.stringify({ type: 'room-connected', data: { host: client.host } }));
        this.sendMessageToAll(JSON.stringify({ type: 'user-connected', data: { username: client.username } }));
    }

    sendMessageToAll(message) {
        for (let client of this.players) {
            client.send(message);
        }
    }

    sendMessageToHost(message) {
        for (let client of this.players) {
            if (client.host) {
                client.send(message);
                break;
            }
        }
    }
}

module.exports = GameRoom;