const Card = require('./index');

class Thief extends Card {
    constructor(clientName) {
        super({
            team: 'Village',
            name: 'Thief',
            clientName,
            turn: '10',
            actionDesc: 'As a thief you will steal another players card. You will then become the role that you have stolen.',
            turnInstructions: 'Select a player and take their role',
            globalInstructions: 'Thief, wake up and swap your card with another players',
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
                        const tmpCard = gameRoom.playerCards[client.id];
                        gameRoom.playerCards[client.id] = gameRoom.playerCards[message.data.id];
                        gameRoom.playerCards[message.data.id] = tmpCard;
                        hasChecked = true;
                        client.send(JSON.stringify({ type: 'wake-up',
                            data: {
                                othersAwake: [{ type: gameRoom.playerCards[client.id], username: client.username + ' (You)', id: client.id }],
                                turnInstructions: this.turnInstructions,
                                canInteract: this.canInteract,
                                blockedPlayer: gameRoom.blockedPlayer,
                            },
                        }));
                    }

                    break;
            }
        });
    }
}

module.exports = Thief;