const Card = require('./index');

class MysticWolf extends Card {
    constructor(clientName) {
        super({
            team: 'Werewolf',
            name: 'Mystic Wolf',
            clientName,
            turn: 2,
            extraTurns: [4, 5],
            actionDesc: 'As a mystic wolf you wake up twice. First with the other werewolves and then again to view another players card.',
            turnInstructions: 'Select a player to view their card',
            globalInstructions: 'Mystic Wolf, wake up and look at another players card',
            canInteract: 'player',
        });
    }

    doTurn(client, gameRoom) {
        if (gameRoom.turn === 5) return;
        this.wakeUp(client, gameRoom, true);
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

module.exports = MysticWolf;