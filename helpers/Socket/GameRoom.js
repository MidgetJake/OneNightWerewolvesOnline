const { CardList, CardOrder } = require('../Cards/CardList');
const Cards = require('../Cards');
const WebSocket = require('ws');

// This class will handle what is needed for the game room to function
class GameRoom {
    constructor(hostname, roomname, data = {}, roomhash) {
        this.roomhash = roomhash;

        console.log('--[ WS ROOM CREATION ]-- Creating new room:', this.roomhash);

        // Currently unused
        this.password = data.password || null; // Password for the room (null if none)
        this.public = data.public || false; // Will the room be listed in the public lobby?
        this.name = roomname !== '' ? roomname : roomhash; // Name of the room
        this.turnTime = 7.5; // Time in seconds for each turn
        this.discussionTime = 3; // Time in minutes until a vote must be made
        this.tiedCooldown = 10; // Time in seconds to check votes if there is a tie

        // Variables in use
        this.idCount = 0; // Total number of connections that have been made to the room, easiest way to assign an ID
        this.maxPlayers = data.maxPlayers || 14; // Max number of players that can be in the room
        this.cardsInPlay = []; // All cards that are in game (centre & player)
        this.inProgress = false; // Has the game started?
        this.centreCards = []; // The 4 centre cards
        this.turn = 0; // The current turn number
        this.playerCards = {}; // Key: PlayerID, Value: What card they are
        this.playerData = {
            players: {}, // List of all players connected
            playerCount: 0, // Number of players connected
        };

        /* This should be used as an array or false (for when doppelganger is added in case of 2 sentinels) */
        this.blockedPlayer = false; // Player that the sentinel has guarded (False if none)

        this.aliveInterval = setInterval(() => {
            this.checkIfAlive();
        }, 120000)
    }

    checkIfAlive() {
        if (this.playerData.playerCount < 1) {
            clearInterval(this.aliveInterval);
            this.removeSelf(this.roomhash);
        }
    };

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

            let hasMinion = false;
            if(turn === 5) {
                for (let role of turnOrder[turn.toString()]) {
                    if (role.name === 'Minion') {
                        hasMinion = true;
                        break;
                    }
                }
                if (!hasMinion) turn = 6;
                while (!turnOrder.hasOwnProperty(turn.toString())) {
                    turn++;
                    if (turn > 25) {
                        break;
                    }
                }
            }

            if (turn > 25) {
                this.sendMessageToAll(JSON.stringify({ type: 'end-night', data: { blockedPlayer: this.blockedPlayer, } }));
                this.votePhase();
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
            }, 1000 * this.turnTime);
        }, 1500);
    }

    votePhase() {
        // this.playerVotes = { 'centre': 0 };
        this.playerData.players.centre = { votes: 0 };
        let skipCount = 0;
        const skippers = {};

        for (let clientID in this.playerData.players) {
            if (!this.playerData.players.hasOwnProperty(clientID) || clientID === 'centre') continue;
            // this.playerVotes[clientID] = 0;
            this.playerData.players[clientID].votes = 0;
            this.playerData.players[clientID].on('message', rawmsg => {
                const message = JSON.parse(rawmsg);
                console.log(message);

                switch (message.type) {
                    case 'vote-player':
                        this.playerData.players[message.data.id].votes++;
                        if (message.data.removeVote !== null) {
                            this.playerData.players[message.data.removeVote].votes--;
                        }
                        let votes = {};
                        for (let player in this.playerData.players) {
                            if (!this.playerData.players.hasOwnProperty(player)) continue;
                            votes[player] = this.playerData.players[player].votes;
                        }

                        this.sendMessageToAll(JSON.stringify({ type: 'vote-update', data: { votes } }));
                        break;
                    case 'skip-vote-timer':
                        if (skippers.hasOwnProperty(message.data.id)) {
                            delete skippers[message.data.id];
                            skipCount--;
                        } else {
                            skippers[message.data.id] = true;
                            skipCount++;
                            if (skipCount > this.playerData.playerCount / 2) {
                                this.endGame();
                            }
                        }
                        break;
                }
            })
        }

        setTimeout(() => {
            console.log('Ending game');
            this.endGame();
        }, this.discussionTime * 60000)
    }

    endGame() {
        let highest = [];
        let highestCount = 0;

        for (let id in this.playerData.players) {
            if (!this.playerData.players.hasOwnProperty(id)) continue;

            if (this.playerData.players[id].votes > highestCount) {
                highest = [id];
                highestCount = this.playerData.players[id].votes;
            } else if (this.playerData.players[id].votes === highestCount) {
                highest.push(id);
            }
        }

        if (highest.length === 1) {
            const packet = {
                type: 'game-complete',
                data: {
                    killed: highest[0],
                    playerCards: this.playerCards,
                    centreCards: this.centreCards,
                }
            };

            if (highest[0] !== 'centre') {
                packet.data = {
                    ...packet.data,
                    role: this.playerCards[highest[0]],
                    centre: false,
                    playerName: this.playerData.players[highest[0]].username,
                    winningTeam: Cards.determineWinner(this.playerCards[highest[0]]),
                }
            } else {
                packet.data = {
                    ...packet.data,
                    centre: true,
                    winningTeam: Object.keys(this.playerCards).reduce((accumulator, nextVal) => accumulator ? accumulator : Cards.isWerewolf(this.playerCards[nextVal]), false) ? 'Werewolf' : 'Village',
                }
            }

            this.sendMessageToAll(JSON.stringify(packet))
        } else {
            this.sendMessageToAll(JSON.stringify({ type: 'failed-vote' }));
            setTimeout(() => {
                this.endGame()
            }, 1000 * this.tiedCooldown);
        }
    }

    startGame() {
        if (this.playerData.playerCount < 3) {
            console.log('Needs more players');
            return this.sendMessageToHost(JSON.stringify({ type: 'failed-game-start', data: { reason: 'Not enough players' } }));
        }

        if(this.playerData.playerCount !== this.cardsInPlay.length - 4) {
            return this.sendMessageToHost(JSON.stringify({ type: 'failed-game-start', data: { reason: 'Needs to be exactly 4 more cards than players' } }));
        }

        this.inProgress = true;
        this.sendMessageToAll(JSON.stringify({
            type: 'game-start',
            data: {
                players: Object.keys(this.playerData.players).map(
                    clientID => ({ cardName: '', username: this.playerData.players[clientID].username, id: clientID })
                ),
            },
        }));

        // Shuffle the cards
        const cardList = this.cardsInPlay;
        for (let i = cardList.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cardList[i], cardList[j]] = [cardList[j], cardList[i]];
        }

        let count = 0;
        for (let clientID in this.playerData.players) {
            if(!this.playerData.players.hasOwnProperty(clientID)) continue;
            this.playerData.players[clientID].send(JSON.stringify({ type: 'card-assign', data: { card: cardList[count].name, id: clientID } }));
            cardList[count].player = this.playerData.players[clientID];
            this.playerData.players[clientID].card = cardList[count];
            this.playerCards[clientID] = cardList[count].name;
            count++;
        }

        for (let i = 0; i < 4; i++) {
            this.centreCards.push(this.cardsInPlay[i + this.playerData.playerCount].name);
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

        setTimeout(() => {
            this.makeGameTurn(turnOrder, 0);
        }, 7500);
    }

    // Disconnect the client from the room
    disconnect(client) {
        console.log('--[ WS ROOM DISCONNECT ]-- Client', client.id, 'has disconnected from room', this.roomhash);
        delete this.playerData.players[client.id];
        this.playerData.playerCount--;
        this.sendMessageToAll(JSON.stringify({ type: 'user-disconnected' }));
    }

    connect(client) {
        if (this.playerData.playerCount >= this.maxPlayers) {
            console.log('--[ WS ROOM CONNECTION REJECTED ]-- Room', this.roomhash, 'is full!');
            return client.send(JSON.stringify({ type: 'connection-failed', data: { reason: 'Room is full' } }));
        }

        if (this.inProgress) {
            console.log('--[ WS ROOM CONNECTION REJECTED ]-- Room', this.roomhash, 'is in progress!');
            return client.send(JSON.stringify({ type: 'connection-failed', data: { reason: 'Game is in progress' } }));
        }

        client.id = this.idCount++;
        client.host = this.playerData.playerCount === 0;
        this.playerData.playerCount++;
        this.playerData.players[client.id] = client; //.push(client);

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
                case 'set-changes':
                    if (!client.host) break;
                    this.password = message.data.password;
                    this.turnTime = message.data.turnTime;
                    this.discussionTime = message.data.discussionTime;
                    this.tiedCooldown = message.data.tiedCooldown;
                    this.maxPlayers = message.data.maxPlayers;
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
        client.send(JSON.stringify({ type: 'room-connected', data: { host: client.host, ownID: client.id } }));
        this.sendMessageToAll(JSON.stringify({ type: 'user-connected', data: { username: client.username, id: client.id } }));
    }

    sendMessageToAll(message) {
        for (let clientID in this.playerData.players) {
            if (!this.playerData.players.hasOwnProperty(clientID) || clientID === 'centre') continue;
            if (this.playerData.players[clientID].readyState === WebSocket.OPEN) {
                this.playerData.players[clientID].send(message);
            }
        }
    }

    sendMessageToHost(message) {
        for (let clientID in this.playerData.players) {
            if(!this.playerData.players.hasOwnProperty(clientID) || clientID === 'centre') continue;
            if (this.playerData.players[clientID].host && this.playerData.players[clientID].readyState === WebSocket.OPEN) {
                this.playerData.players[clientID].send(message);
                break;
            }
        }
    }
}

module.exports = GameRoom;