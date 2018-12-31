const Card = require('./index');

class ApprenticeSeer extends Card {
    constructor(clientName) {
        super({
            name: 'Apprentice Seer',
            clientName,
            turn: 8,
            actionDesc: 'You wake up and look at 1 centre card',
            turnInstructions: 'Look at 1 centre card',
            globalInstructions: 'Apprentice Seer, wake up and look at 1 centre card',
            canInteract: 'centre',
        });

        this.checkLimit = {
            both: 0,
            player: 0,
            centre: 1,
        };
    }

    doTurn(client, gameRoom) {
        this.wakeUp(client, gameRoom);
        let cardsChecked = 0;

        client.on('message', rawmsg => {
            const message = JSON.parse(rawmsg);

            switch (message.type) {
                case 'check-card':
                    if (cardsChecked >= 1 || !message.data.centre) break;
                    cardsChecked++;

                    client.send(JSON.stringify({
                        type: 'show-card',
                        data: {
                            id: message.data.id,
                            centre: true,
                            cardName: gameRoom.centreCards[message.data.id],
                        },
                    }));
                    break;
            }
        });
    }
}

module.exports = ApprenticeSeer;