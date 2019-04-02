const Card = require('./index');

class Doctor extends Card {
    constructor(clientName) {
        super({
            team: 'Village',
            name: 'Doctor',
            clientName,
            turn: '0',
            actionDesc: 'As the village doctor you wake up first and select a player to protect. Nothing may then happen to this players card.',
            turnInstructions: 'Select a player to guard',
            globalInstructions: 'Doctor, select a player to guard',
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

module.exports = Doctor;