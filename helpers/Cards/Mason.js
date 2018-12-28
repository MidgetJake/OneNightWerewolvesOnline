const Card = require('./index');

class Mason extends Card {
    constructor(clientName) {
        super({
            name: 'Mason',
            clientName,
            turn: 5,
            actionDesc: 'You will know who the other Masons are.',
            turnInstructions: 'You can now see the other Masons',
        });
    }
}

module.exports = Mason;