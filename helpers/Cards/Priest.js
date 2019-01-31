const Card = require('./index');

class Priest extends Card {
    constructor(clientName) {
        super({
            team: 'Village',
            name: 'Priest',
            clientName,
            turn: '0',
            actionDesc: 'You wake up and select a player to guard. This players role cannot be changed or viewed',
            turnInstructions: 'Select a player to guard',
            globalInstructions: 'Priest, select a player to guard',
            canInteract: 'player',
        });
    }

    doTurn(client, gameRoom) {
        this.wakeUp(client, gameRoom, true);
        let hasChecked = false;

        client.on('message', rawmsg => {
            const message = JSON.parse(rawmsg);

            switch (message.type) {
                case 'check-card':
                    if (hasChecked) break;
                    if (!message.data.centre) {
                        gameRoom.blockedPlayer = message.data.id;
                        hasChecked = true;
                        client.send(JSON.stringify({ type: 'show-blocked', data: { blockedPlayer: message.data.id } }));
                    }

                    break;
            }
        });
    }
}

module.exports = Priest;