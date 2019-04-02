const Card = require('./index');

class Minion extends Card {
    constructor(clientName) {
        super({
            name: 'Minion',
            clientName,
            turn: 5,
            actionDesc: 'The minion follows the werewolves and will know who they are. The werewolves will not know who you are however. You will win if the voted is not a werewolf, even if it is yourself.',
            turnInstructions: 'You can now see the werewolves',
            globalInstructions: 'Minion, wake up and see who the werewolves are',
        });
    }

    doTurn(client, gameRoom) {
        this.wakeUp(client, gameRoom);
    }
}

module.exports = Minion;