const Card = require('./index');

class Werewolf extends Card {
    constructor(clientName) {
        super({
            team: 'Werewolf',
            name: 'Werewolf',
            clientName,
            turn: 2,
            extraTurns: [5],
            actionDesc: 'As a werewolf you will need to stay hidden from the village. You will wake with other werewolves so you will all know each other',
            turnInstructions: 'You can now see the other werewolves',
            globalInstructions: 'Werewolves, wake up and see the other werewolves',
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

module.exports = Werewolf;