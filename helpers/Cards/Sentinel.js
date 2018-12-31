const Card = require('./index');

class Sentinel extends Card {
    constructor(clientName) {
        super({
            team: 'Village',
            name: 'Sentinel',
            clientName,
            turn: '0',
            actionDesc: 'Wake up and put a token on a player. That players card cannot be touched',
            turnInstructions: 'Select a player to guard',
            globalInstructions: 'Sentinel, wake up and place your token upon a player',
            canInteract: 'player',
        });
    }

    doTurn(client, gameRoom) {
        this.wakeUp(client, gameRoom);
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

module.exports = Sentinel;