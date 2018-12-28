const Card = require('./index');

class Werewolf extends Card {
    constructor(clientName) {
        super({
            team: 'Werewolf',
            name: 'Werewolf',
            clientName,
            turn: 2,
            actionDesc: 'You know the other werewolves and are trying to stay hidden from the village',
            turnInstructions: 'You can now see the other werewolves',
        });
    }
}

module.exports = Werewolf;