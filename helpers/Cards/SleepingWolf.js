const Card = require('./index');

class SleepingWolf extends Card {
    constructor(clientName) {
        super({
            team: 'Werewolf',
            name: 'Sleeping Wolf',
            clientName,
            turn: 2,
            extraTurns: [5],
            turnInstructions: 'You are still asleep, but the other werewolves know who you are',
            actionDesc: 'As a sleeping werewolf you will not wake up during the night. However, the werewolves will know who you are but you will have to work out who they are.',
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

module.exports = SleepingWolf;