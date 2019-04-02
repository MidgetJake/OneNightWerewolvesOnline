const Card = require('./index');

class Insomniac extends Card {
    constructor(clientName) {
        super({
            team: 'Village',
            name: 'Insomniac',
            clientName,
            turn: '15',
            actionDesc: 'As the insomniac you wake up last and check you own card for any changes.',
            turnInstructions: 'View at your card',
            globalInstructions: 'Insomniac, wake up and look at your own card',
            canInteract: 'player',
        });
    }

    doTurn(client, gameRoom) {
        this.wakeUp(client, gameRoom, true);

        client.send(JSON.stringify({ type: 'wake-up',
            data: {
                othersAwake: [{ type: gameRoom.playerCards[client.id], username: client.username + ' (You)', id: client.id }],
                turnInstructions: this.turnInstructions,
                canInteract: this.canInteract,
                blockedPlayer: gameRoom.blockedPlayer,
            },
        }));
    }
}

module.exports = Insomniac;