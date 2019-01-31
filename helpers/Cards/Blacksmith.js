const Card = require('./index');

class Blacksmith extends Card {
    constructor(clientName) {
        super({
            name: 'Blacksmith',
            clientName,
            turn: 6,
            actionDesc: 'You will know who the other Blacksmiths are.',
            turnInstructions: 'You can now see the other Blacksmiths',
            globalInstructions: 'Blacksmiths, wake up and see the other Blacksmiths',
        });
    }

    doTurn(client, gameRoom) {
        this.wakeUp(client, gameRoom);
    }
}

module.exports = Blacksmith;