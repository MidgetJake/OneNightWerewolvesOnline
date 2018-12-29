const Card = require('./index');

class Seer extends Card {
    constructor(clientName) {
        super({
            name: 'Seer',
            clientName,
            turn: 7,
            actionDesc: 'You wake up and look at 1 player card or 2 centre cards',
            turnInstructions: 'Look at 2 centre cards or 1 player card',
            globalInstructions: 'Seer, wake up and look at 2 centre cards or 1 player card',
            canInteract: 'both',
        });

        this.checkLimit = {
            both: 1,
            player: 1,
            centre: 2,
        };
    }

    doTurn(client, gameRoom) {
        let cardsChecked = 0;
        let checkType = 'both';

        client.send(JSON.stringify({
            type: 'wake-up',
            data: {
                othersAwake: [null],
                turnInstructions: this.turnInstructions,
                canInteract: this.canInteract,
            },
        }));

        client.on('message', rawmsg => {
            const message = JSON.parse(rawmsg);

            switch (message.type) {
                case 'check-card':
                    if (cardsChecked >= this.checkLimit[checkType]) break;
                    if (message.data.centre) {
                        checkType = 'centre';
                        cardsChecked++;

                        client.send(JSON.stringify({
                            type: 'show-card',
                            data: {
                                id: message.data.id,
                                cardName: gameRoom.centreCards[message.data.id].name,
                            },
                        }));
                    }

                    break;
            }
        });
    }
}

module.exports = Seer;