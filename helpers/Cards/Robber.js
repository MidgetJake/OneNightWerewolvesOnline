const Card = require('./index');

class Robber extends Card {
    constructor(clientName) {
        super({
            team: 'Village',
            name: 'Robber',
            clientName,
            turn: '10',
            actionDesc: 'You look at another players card and swap it with your own',
            turnInstructions: 'Select a player rob',
            globalInstructions: 'Robber, wake up and swap your card with another players',
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

module.exports = Robber;