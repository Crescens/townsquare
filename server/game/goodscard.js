const _ = require('underscore');

const DrawCard = require('./drawcard.js');

class GoodsCard extends DrawCard {
    canAttach(player, card) {
        if(card.getType() === 'dude') {
            return true;
        }
    }
}

module.exports = GoodsCard;
