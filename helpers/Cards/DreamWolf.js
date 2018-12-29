const Card = require('./index');

class DreamWolf extends Card {
    constructor(clientName) {
        super({
            team: 'Werewolf',
            name: 'Dream Wolf',
            clientName,
            turn: -1,
            actionDesc: 'You know that you are a werewolf, but you sleep through the night and have no idea who the other werewolves are and they do not know you',
        });
    }
}

module.exports = DreamWolf;