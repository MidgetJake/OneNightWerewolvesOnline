class Card {
    constructor(data = {}) {
        this.team = data.team || 'Village';
        this.name = data.name || 'UnknownCard';
        this.clientName = data.clientName || 'ClientCard';
        this.turn = data.turn || -1;
        this.actionDesc = data.actionDesc || 'Plain ol\' standard card that does nothing';
        this.turnInstructions = data.turnInstructions || 'You don\'t wake up, so should never see this';
        this.globalInstructions = data.globalInstructions || 'Stay asleep';
        this.canInteract = data.canInteract || 'none';
        this.player = null;
        this.checkLimit = data.checkLimit || { both: 0, centre: 0, player: 0 };
        this.extraTurns = data.extraTurns || false;
        this.blocked = false;
    }

    wakeUp(client, gameRoom) {
        client.send(JSON.stringify({
            type: 'wake-up',
            data: {
                othersAwake: gameRoom.awakePlayers.map((other, index) => {
                    if (other.id !== client.id) {
                        return { type: other.card.name, username: other.username, id: other.id };
                    } else {
                        return { type: other.card.name, username: other.username + ' (You)', id: other.id };
                    }
                }),
                turnInstructions: this.turnInstructions,
                canInteract: this.canInteract,
                blockedPlayer: gameRoom.blockedPlayer,
            },
        }));
    }
}

module.exports = Card;