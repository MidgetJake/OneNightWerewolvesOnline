const Card = require('./index');

class Mason extends Card {
    constructor(clientName) {
        super({
            name: 'Mason',
            clientName,
            turn: 6,
            actionDesc: 'You will know who the other Masons are.',
            turnInstructions: 'You can now see the other Masons',
            globalInstructions: 'Masons, wake up and see the other Masons',
        });
    }

    doTurn(client, gameRoom) {
        this.wakeUp(client, gameRoom);
    }
}

module.exports = Mason;