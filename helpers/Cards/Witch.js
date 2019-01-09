const Card = require('./index');

class Robber extends Card {
    constructor(clientName) {
        super({
            team: 'Village',
            name: 'Witch',
            clientName,
            turn: '11',
            actionDesc: 'you look at a centre card and swap it with another players card',
            turnInstructions: 'Select a centre card, then select a player',
            globalInstructions: 'Witch, wake up and look at a centre card. Then swap it with another players card',
            canInteract: 'both',
        });

        this.checkLimit = {
            both: 0,
            player: 1,
            centre: 1,
        };
    }

    doTurn(client, gameRoom) {
        this.wakeUp(client, gameRoom, true);
        let checkType = 'centre';
        let centreID = null;

        client.on('message', rawmsg => {
            const message = JSON.parse(rawmsg);
            console.log(message.data);

            switch (message.type) {
                case 'check-card':
                    if (this.checkLimit[checkType] < 1) break;
                    if (!message.data.centre) {
                        if(message.data.id === client.id) break;
                        this.checkLimit.player = 0;
                        const tmpCard = gameRoom.playerCards[message.data.id];
                        gameRoom.playerCards[message.data.id] = gameRoom.centreCards[centreID];
                        gameRoom.centreCards[centreID] = tmpCard;
                        client.send(JSON.stringify({
                            type: 'show-card',
                            data: {
                                id: centreID,
                                centre: true,
                                cardName: '',
                            },
                        }));


                        client.send(JSON.stringify({
                            type: 'show-card',
                            data: {
                                id: message.data.id,
                                centre: false,
                                cardName: gameRoom.playerCards[message.data.id],
                            },
                        }));
                    } else {
                        console.log(gameRoom.centreCards);
                        centreID = message.data.id;
                        checkType = 'player';
                        this.checkLimit.centre = 0;
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

module.exports = Robber;