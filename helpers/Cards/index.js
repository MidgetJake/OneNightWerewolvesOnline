class Card {
    constructor(data = {}) {
        this.team = data.team || 'Village';
        this.name = data.name || 'UnknownCard';
        this.clientName = data.clientName || 'ClientCard';
        this.turn = data.turn || -1;
        this.actionDesc = data.actionDesc || 'Plain ol\' standard card that does nothing';
        this.turnInstructions = data.turnInstructions || 'You don\'t wake up, so should never see this';
        this.globalInstructions = data.globalInstructions || 'Stay asleep',
        this.player = null;
    }
}

module.exports = Card;