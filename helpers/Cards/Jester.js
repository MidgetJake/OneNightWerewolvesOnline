const Card = require('./index');

class Jester extends Card {
    constructor(clientName) {
        super({
            team: 'Jester',
            name: 'Jester',
            clientName,
            turn: -1,
            actionDesc: 'As a jester you do not wake up. Your goal is to get yourself voted. If you have the majority vote you win.',
        });
    }
}

module.exports = Jester;