const Werewolf = require('./Werewolf');
const Jester = require('./Jester');
const Mason = require('./Mason');
const Villager = require('./Villager');
const SleepingWolf = require('./SleepingWolf');
const Seer = require('./Seer');
const ApprenticeSeer = require('./ApprenticeSeer');
const MysticWolf = require('./MysticWolf');
const Minion = require('./Minion');
const Doctor = require('./Doctor');
const Thief = require('./Thief');
const Drunk = require('./Drunk');
const Witch = require('./Witch');
const Insomniac = require('./Insomniac');

const CardList = {
    Villager,
    Jester,
    Mason,
    Werewolf,
    'Sleeping Wolf': SleepingWolf,
    Seer,
    'Apprentice Seer': ApprenticeSeer,
    'Mystic Wolf': MysticWolf,
    Minion,
    Doctor,
    Thief,
    Drunk,
    Witch,
    Insomniac,
};

const CardData = cardname => {
    const name = decodeURI(cardname);
    const data = new CardList[name];

    return { action: data.actionDesc, name: data.name, team: data.team };
};

const CardOrder = {
    '0': new Doctor(),
    '2': new Werewolf(),
    '4': new MysticWolf(),
    '5': new Minion(),
    '6': new Mason(),
    '7': new Seer(),
    '8': new ApprenticeSeer(),
    '10': new Thief(),
    '11': new Witch(),
    '14': new Drunk(),
    '15': new Insomniac(),
};

module.exports = { CardList, CardOrder, CardData };