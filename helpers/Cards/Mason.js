const Card = require('./index');

class Mason extends Card {
    constructor(clientName) {
        super({
            name: 'Mason',
            clientName,
            turn: 6,
            actionDesc: 'As a mason you will wake up with the any other masons. You will then know who the other mason may be.',
            turnInstructions: 'You can now see the other Mason',
            globalInstructions: 'Masons, wake up and see the other Mason',
        });
    }

    doTurn(client, gameRoom) {
        this.wakeUp(client, gameRoom);
    }
}

module.exports = Mason;