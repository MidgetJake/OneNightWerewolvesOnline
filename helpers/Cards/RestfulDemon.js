const Card = require('./index');

class RestfulDemon extends Card {
    constructor(clientName) {
        super({
            team: 'Demon',
            name: 'Restful Demon',
            clientName,
            turn: 2,
            extraTurns: [5],
            turnInstructions: 'You are still asleep, but the other demons know who you are',
            actionDesc: 'You know that you are a demon, but you sleep through the night and have no idea who the other demons but they know you',
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

module.exports = RestfulDemon;