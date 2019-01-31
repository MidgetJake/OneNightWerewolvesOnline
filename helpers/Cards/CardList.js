const Demon = require('./Demon');
const Jester = require('./Jester');
const Blacksmith = require('./Blacksmith');
const Villager = require('./Villager');
const RestfulDemon = require('./RestfulDemon');
const Oracle = require('./Oracle');
const YoungOracle = require('./YoungOracle');
const EnchantedDemon = require('./EnchantedDemon');
const Cultist = require('./Cultist');
const Priest = require('./Priest');
const Thief = require('./Thief');
const Idiot = require('./Idiot');
const Sorcerer = require('./Sorcerer');
const Insomniac = require('./Insomniac');

const CardList = {
    Villager,
    Jester,
    Blacksmith,
    Demon,
    'Restful Demon': RestfulDemon,
    Oracle,
    'Young Oracle': YoungOracle,
    'Enchanted Demon': EnchantedDemon,
    Cultist,
    Priest,
    Thief,
    Idiot,
    Sorcerer,
    Insomniac,
};

const CardData = cardname => {
    const name = decodeURI(cardname);
    const data = new CardList[name];

    return { action: data.actionDesc, name: data.name, team: data.team };
};

const CardOrder = {
    '0': new Priest(),
    '2': new Demon(),
    '4': new EnchantedDemon(),
    '5': new Cultist(),
    '6': new Blacksmith(),
    '7': new Oracle(),
    '8': new YoungOracle(),
    '10': new Thief(),
    '11': new Sorcerer(),
    '14': new Idiot(),
    '15': new Insomniac(),
};

module.exports = { CardList, CardOrder, CardData };