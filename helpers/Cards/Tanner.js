const Card = require('./index');

class Tanner extends Card {
    constructor(clientName) {
        super({
            team: 'Tanner',
            name: 'Tanner',
            clientName,
            turn: -1,
            actionDesc: 'You goal is to get yourself voted and killed, you lose otherwise',
        });
    }
}

module.exports = Tanner;