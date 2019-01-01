const Card = require('./index');

class Drunk extends Card {
    constructor(clientName) {
        super({
            team: 'Village',
            name: 'Drunk',
            clientName,
            turn: '14',
            actionDesc: 'You take a card from the centre cards, you do not look at it but become the role of that card',
            turnInstructions: 'Select a centre card',
            globalInstructions: 'Drunk, wake up and swap your card with a centre card',
            canInteract: 'centre',
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
                    if (message.data.centre) {
                        const tmpCard = gameRoom.playerCards[client.id];
                        gameRoom.playerCards[client.id] = gameRoom.centreCards[message.data.id];
                        gameRoom.centreCards[message.data.id] = tmpCard;
                        hasChecked = true;
                        client.send(JSON.stringify({ type: 'wake-up',
                            data: {
                                othersAwake: [{ type: '', username: client.username + ' (You)', id: client.id }],
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

module.exports = Drunk;