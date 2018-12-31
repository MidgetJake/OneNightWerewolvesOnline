const Card = require('./index');

class DreamWolf extends Card {
    constructor(clientName) {
        super({
            team: 'Werewolf',
            name: 'Dream Wolf',
            clientName,
            turn: 2,
            extraTurns: [5],
            turnInstructions: 'You are still asleep, but the other werewolves know who you are',
            actionDesc: 'You know that you are a werewolf, but you sleep through the night and have no idea who the other werewolves but they know you',
        });
    }

    doTurn(client, gameRoom) {
        if (gameRoom.turn === 5) return;
        client.send(JSON.stringify({
            type: 'stay-asleep',
            data: {
                turnInstructions: this.turnInstructions,
            },
        }));
    }
}

module.exports = DreamWolf;