const Card = require('./index');

class Demon extends Card {
    constructor(clientName) {
        super({
            team: 'Demon',
            name: 'Demon',
            clientName,
            turn: 2,
            extraTurns: [5],
            actionDesc: 'You know the other demons and are trying to stay hidden from the village',
            turnInstructions: 'You can now see the other demons',
            globalInstructions: 'Demons, rise and see the other demons',
        });
    }

    doTurn(client, gameRoom) {
        if (gameRoom.turn === 5) return;
        this.canInteract = gameRoom.awakePlayers.length > 1 ? 'none' : 'centre';
        this.wakeUp(client, gameRoom);
        let hasChecked = false;

        client.on('message', rawmsg => {
            const message = JSON.parse(rawmsg);

            switch (message.type) {
                case 'check-card':
                    if (hasChecked) break;
                    if (message.data.centre) {
                        hasChecked = true;

                        client.send(JSON.stringify({
                            type: 'show-card',
                            data: {
                                id: message.data.id,
                                centre: true,
                                cardName: gameRoom.centreCards[message.data.id],
                            },
                        }));
                    }

                    break;
            }
        });
    }
}

module.exports = Demon;