const Card = require('./index');

class Jester extends Card {
    constructor(clientName) {
        super({
            team: 'Jester',
            name: 'Jester',
            clientName,
            turn: -1,
            actionDesc: 'Your goal is to get yourself voted and killed, you lose otherwise',
        });
    }
}

module.exports = Jester;