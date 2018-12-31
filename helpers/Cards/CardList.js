const Werewolf = require('./Werewolf');
const Mason = require('./Mason');
const Villager = require('./VIllager');
const Tanner = require('./Tanner');
const DreamWolf = require('./DreamWolf');
const Seer = require('./Seer');
const ApprenticeSeer = require('./ApprenticeSeer');
const MysticWolf = require('./MysticWolf');
const Minion = require('./Minion');
const Sentinel = require('./Sentinel');

const CardList = {
    Villager,
    Mason,
    Werewolf,
    Tanner,
    'Dream Wolf': DreamWolf,
    Seer,
    'Apprentice Seer': ApprenticeSeer,
    'Mystic Wolf': MysticWolf,
    Minion,
    Sentinel,
};

const CardOrder = {
    '0': new Sentinel(),
    '2': new Werewolf(),
    '4': new MysticWolf(),
    '5': new Minion(),
    '6': new Mason(),
    '7': new Seer(),
    '8': new ApprenticeSeer(),
};

module.exports = { CardList, CardOrder };