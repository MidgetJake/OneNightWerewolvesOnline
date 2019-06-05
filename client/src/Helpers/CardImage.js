import Default from 'Static/Img/CardArt/Placehold.png';
import Jester from 'Static/Img/CardArt/Jester.png';
import Insomniac from 'Static/Img/CardArt/Insomniac.png';
import Thief from 'Static/Img/CardArt/Thief.png';
import Villager from 'Static/Img/CardArt/Villager.png';

const images = {
    default: Default,
    jester: Jester,
    insomniac: Insomniac,
    thief: Thief,
    villager: Villager,
};

export default cardName => {
    if (images.hasOwnProperty(cardName)) {
        return images[cardName];
    } else {
        return images.default;
    }
};