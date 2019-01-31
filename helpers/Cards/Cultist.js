const Card = require('./index');

class Cultist extends Card {
    constructor(clientName) {
        super({
            name: 'Cultist',
            clientName,
            turn: 5,
            actionDesc: 'You will know who the demons are.',
            turnInstructions: 'You can now see the demons',
            globalInstructions: 'Cultist, wake up and see the demons',
        });
    }

    doTurn(client, gameRoom) {
        this.wakeUp(client, gameRoom);
    }
}

module.exports = Cultist;