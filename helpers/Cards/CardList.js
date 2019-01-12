const Werewolf = require('./Werewolf');
const Tanner = require('./Tanner');
const Mason = require('./Mason');
const Villager = require('./Villager');
const DreamWolf = require('./DreamWolf');
const Seer = require('./Seer');
const ApprenticeSeer = require('./ApprenticeSeer');
const MysticWolf = require('./MysticWolf');
const Minion = require('./Minion');
const Sentinel = require('./Sentinel');
const Robber = require('./Robber');
const Drunk = require('./Drunk');
const Witch = require('./Witch');
const Insomniac = require('./Insomniac');

const CardList = {
    Villager,
    Tanner,
    Mason,
    Werewolf,
    'Dream Wolf': DreamWolf,
    Seer,
    'Apprentice Seer': ApprenticeSeer,
    'Mystic Wolf': MysticWolf,
    Minion,
    Sentinel,
    Robber,
    Drunk,
    Witch,
    Insomniac
};

const CardData = cardname => {
    const name = decodeURI(cardname);
    const data = new CardList[name];

    return { action: data.actionDesc, name: data.name, team: data.team };
};

const CardOrder = {
    '0': new Sentinel(),
    '2': new Werewolf(),
    '4': new MysticWolf(),
    '5': new Minion(),
    '6': new Mason(),
    '7': new Seer(),
    '8': new ApprenticeSeer(),
    '10': new Robber(),
    '11': new Witch(),
    '14': new Drunk(),
    '15': new Insomniac(),
};

module.exports = { CardList, CardOrder, CardData };