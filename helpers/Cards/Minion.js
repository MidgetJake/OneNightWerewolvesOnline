const Card = require('./index');

class Minion extends Card {
    constructor(clientName) {
        super({
            name: 'Minion',
            clientName,
            turn: 5,
            actionDesc: 'You will know who the Werewolves are.',
            turnInstructions: 'You can now see the werewolves',
            globalInstructions: 'Minion, wake up and see the Werewolves',
        });
    }

    doTurn(client, gameRoom) {
        this.wakeUp(client, gameRoom);
    }
}

module.exports = Minion;