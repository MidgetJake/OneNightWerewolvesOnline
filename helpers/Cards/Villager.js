const Card = require('./index');

class Villager extends Card {
    constructor(clientName) {
        super({
            clientName,
            name: 'Villager',
            actionDesc: 'You are a normal villager, try to work out who the werewolves are',
        });
    }
}

module.exports = Villager;