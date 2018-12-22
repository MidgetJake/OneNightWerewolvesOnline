import { Teams } from 'Models/Constants';

class Card {
    constructor(cardData) {
        this.name = cardData.name || 'Card name';
        this.team = cardData.team || Teams.Village;
        this.turnOrder = cardData.turnOrder || -1;
        this.image = cardData.image || '';
        this.desc = cardData.desc || 'Template description';
    }
}