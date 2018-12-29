const Card = require('./index');

class Mason extends Card {
    constructor(clientName) {
        super({
            name: 'Mason',
            clientName,
            turn: 5,
            actionDesc: 'You will know who the other Masons are.',
            turnInstructions: 'You can now see the other Masons',
            globalInstructions: 'Masons, wake up and see the other Masons',
        });
    }

    doTurn(client, gameRoom) {
        client.send(JSON.stringify({
            type: 'wake-up',
            data: {
                othersAwake: gameRoom.awakePlayers.map((other, index) => {
                    if (other.id !== client.id) {
                        return other.username;
                    }
                }),
                turnInstructions: this.turnInstructions,
                canInteract: this.canInteract,
            },
        }));
    }
}

module.exports = Mason;