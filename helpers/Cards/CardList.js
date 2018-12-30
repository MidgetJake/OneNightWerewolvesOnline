const Werewolf = require('./Werewolf');
const Mason = require('./Mason');
const Villager = require('./VIllager');
const Tanner = require('./Tanner');
const DreamWolf = require('./DreamWolf');
const Seer = require('./Seer');

const CardList = {
    Villager,
    Mason,
    Werewolf,
    Tanner,
    'Dream Wolf': DreamWolf,
    Seer,
};

const CardOrder = {
    2: Werewolf,
    6: Mason,
    7: Seer,
};

module.exports = { CardList, CardOrder };