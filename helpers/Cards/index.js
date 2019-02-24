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

    wakeUp(client, gameRoom, alone = false) {
        client.send(JSON.stringify({
            type: 'wake-up',
            data: {
                othersAwake: gameRoom.awakePlayers.map((other, index) => ({ type: other.card.name, username: other.username, id: other.id })),
                turnInstructions: this.turnInstructions,
                canInteract: this.canInteract,
                blockedPlayer: gameRoom.blockedPlayer,
                turnTime: gameRoom.turnTime,
            },
        }));
    }

    static isWerewolf(cardName) {
        switch (cardName) {
            case 'Demon':
            case 'Enchanted Demon':
            case 'Restful Demon':
                return true;
            default:
                return false;
        }
    }

    static determineWinner(cardName) {
        switch (cardName) {
            case 'Demon':
            case 'Enchanted Demon':
            case 'Restful Demon':
                return 'Village';
            case 'Jester':
                return 'Jester';
            default:
                return 'Demon';
        }
    }
}

module.exports = Card;