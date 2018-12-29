const Werewolf = require('./Werewolf');
const Mason = require('./Mason');
const Villager = require('./VIllager');
const Tanner = require('./Tanner');
const DreamWolf = require('./DreamWolf');

const CardList = {
    Villager,
    Mason,
    Werewolf,
    Tanner,
    'Dream Wolf': DreamWolf,
};

module.exports = CardList;