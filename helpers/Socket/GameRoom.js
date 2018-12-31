const shortid = require('shortid');
const { CardList, CardOrder } = require('../Cards/CardList');

// This class will handle what is needed for the game room to function
class GameRoom {
    constructor(roomname, hostname, data = {}) {
        this.roomhash = shortid.generate();

        console.log('--[ WS ROOM CREATION ]-- Creating new room:', this.roomhash);

        this.password = data.password || null;
        this.players = [];
        this.idCount = 0;
        this.maxPlayers = data.maxPlayers || 16;
        this.cardsInPlay = [];
        this.inProgress = false;
        this.centreCards = [];
        this.playerCards = {};
        this.turn = 0;
        this.blockedPlayer = false;
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
            while (!turnOrder.hasOwnProperty(turn.toString())) {
                turn++;
                if (turn > 25) {
                    break;
                }
            }

            if (turn > 25) {
                this.sendMessageToAll(JSON.stringify({ type: 'end-night', data: { blockedPlayer: this.blockedPlayer, } }));
                return;
            }

            this.turn = turn;
            this.sendMessageToAll(JSON.stringify({ type: 'turn-text', data: { text: CardOrder[turn.toString()].globalInstructions } }));

            this.awakePlayers = [];
            for (let cards of turnOrder[turn.toString()]) {
                if (cards.player !== null) {
                    this.awakePlayers.push(cards.player);
                }
            }

            for (let i = 0; i < this.awakePlayers.length; i++) {
                this.awakePlayers[i].card.doTurn(this.awakePlayers[i], this);
            }

            setTimeout(() => {
                for (let cards of turnOrder[turn.toString()]) {
                    if (cards.player !== null) {
                        cards.player.send(JSON.stringify({ type: 'go-sleep' }));
                    }
                }

                if (turn <= 25) {
                    this.makeGameTurn(turnOrder, ++turn);
                }
            }, 7500);
        }, 1500);
    }

    startGame() {
        if (this.players.length < 3 || this.players.length !== this.cardsInPlay.length - 4) {
            return this.sendMessageToHost(JSON.stringify({ type: 'failed-game-start', data: { reason: 'Not enough players' } }));
        }

        this.inProgress = true;
        this.sendMessageToAll(JSON.stringify({
            type: 'game-start',
            data: {
                players: this.players.map(
                    player => ({ cardName: '', username: player.username, id: player.id })
                ),
            },
        }));

        // Shuffle the cards
        const cardList = this.cardsInPlay;
        for (let i = cardList.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cardList[i], cardList[j]] = [cardList[j], cardList[i]];
        }

        for (let i = 0; i < this.players.length; i++) {
            console.log(cardList[i].name);
            this.players[i].send(JSON.stringify({ type: 'card-assign', data: { card: cardList[i].name, id: this.players[i].id } }));
            cardList[i].player = this.players[i];
            this.players[i].card = cardList[i];
            this.playerCards[this.players[i].id] = cardList[i].name;
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

            if (card.extraTurns) {
                for (let extraTurn of card.extraTurns) {
                    if (turnOrder.hasOwnProperty(extraTurn.toString())) {
                        turnOrder[extraTurn.toString()].push(card);
                    } else {
                        turnOrder[extraTurn.toString()] = [card];
                    }
                }
            }
        }

        console.log(turnOrder);

        setTimeout(() => {
            this.makeGameTurn(turnOrder, 0);
        }, 7500);
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

        client.id = this.idCount++;
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
                /*case 'check-card':
                    client.send(JSON.stringify({ type: 'show-card', data: { id: message.data.id, cardName: this.centreCards[message.data.id].name } }));
                    break;*/
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