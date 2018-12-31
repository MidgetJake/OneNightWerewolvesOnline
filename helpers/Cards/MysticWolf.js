const Card = require('./index');

class Werewolf extends Card {
    constructor(clientName) {
        super({
            team: 'Werewolf',
            name: 'Mystic Wolf',
            clientName,
            turn: 2,
            extraTurns: [4, 5],
            actionDesc: 'Wake up with the werewolves, then wake up again and look at another players card',
            turnInstructions: 'Look at another players card',
            globalInstructions: 'Mystic Wolf, wake up and look at another players card',
            canInteract: 'player',
        });
    }

    doTurn(client, gameRoom) {
        if (gameRoom.turn === 5) return;
        this.wakeUp(client, gameRoom);
        let hasChecked = false;

        if (gameRoom.turn !== 4) return;
        client.on('message', rawmsg => {
            const message = JSON.parse(rawmsg);

            switch (message.type) {
                case 'check-card':
                    if (hasChecked) break;
                    if (!message.data.centre) {
                        if (gameRoom.blockedPlayer === message.data.id) break;
                        hasChecked = true;

                        client.send(JSON.stringify({
                            type: 'show-card',
                            data: {
                                id: message.data.id,
                                centre: false,
                                cardName: gameRoom.playerCards[message.data.id],
                            },
                        }));
                    }

                    break;
            }
        });
    }
}

module.exports = Werewolf;