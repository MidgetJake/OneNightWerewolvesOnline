import Default from 'Static/Img/CardArt/Placehold.png';
import Demon from 'Static/Img/CardArt/Demon.png';
import Jester from 'Static/Img/CardArt/Jester.png';
import Blacksmith from 'Static/Img/CardArt/Blacksmith.png';
import Cultist from 'Static/Img/CardArt/Cultist.png';
import EnchantedDemon from 'Static/Img/CardArt/EnchantedDemon.png';
import Idiot from 'Static/Img/CardArt/Idiot.png';
import Insomniac from 'Static/Img/CardArt/Insomniac.png';
import Oracle from 'Static/Img/CardArt/Oracle.png';
import Priest from 'Static/Img/CardArt/Priest.png';
import RestfulDemon from 'Static/Img/CardArt/RestfulDemon.png';
import Sorcerer from 'Static/Img/CardArt/Sorcerer.png';
import Thief from 'Static/Img/CardArt/Thief.png';
import Villager from 'Static/Img/CardArt/Villager.png';
import YoungOracle from 'Static/Img/CardArt/YoungOracle.png';

const images = {
    default: Default,
    demon: Demon,
    jester: Jester,
    blacksmith: Blacksmith,
    'enchanted demon': EnchantedDemon,
    cultist: Cultist,
    idiot: Idiot,
    insomniac: Insomniac,
    oracle: Oracle,
    priest: Priest,
    'restful demon': RestfulDemon,
    sorcerer: Sorcerer,
    thief: Thief,
    villager: Villager,
    'young oracle': YoungOracle,
};

export default cardName => {
    if (images.hasOwnProperty(cardName)) {
        return images[cardName];
    } else {
        return images.default;
    }
};