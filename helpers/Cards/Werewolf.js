const Card = require('./index');

class Werewolf extends Card {
    constructor(clientName) {
        super({
            team: 'Werewolf',
            name: 'Werewolf',
            clientName,
            turn: 2,
            actionDesc: 'You know the other werewolves and are trying to stay hidden from the village',
            turnInstructions: 'You can now see the other werewolves',
            globalInstructions: 'Werewolves, wake up and see the other werewolves',
        });
    }

    doTurn(client, gameRoom) {
        let hasChecked = false;

        client.send(JSON.stringify({
            type: 'wake-up',
            data: {
                othersAwake: gameRoom.awakePlayers.map((other, index) => {
                    if (other.id !== client.id) {
                        return { type: other.card.name, username: other.username };
                    }
                }),
                turnInstructions: this.turnInstructions,
                canInteract: gameRoom.awakePlayers.length > 1 ? 'none' : 'centre',
            },
        }));

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
                                cardName: gameRoom.centreCards[message.data.id].name,
                            },
                        }));
                    }

                    break;
            }
        });
    }
}

module.exports = Werewolf;