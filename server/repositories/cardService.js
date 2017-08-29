const _ = require('underscore');

const monk = require('monk');
const logger = require('../log.js');

class CardService {
    constructor(options) {
        let db = monk(options.dbPath);

        this.cards = db.get('cards');
        this.packs = db.get('packs');
    }

    getAllCards(options) {
        return this.cards.find({})
            .then(result => {
                let cards = {};

                _.each(result, card => {
                    if(options && options.shortForm) {
                        cards[card.code] = _.pick(card, 'code', 'title', 'label', 'type_code', 'type', 'is_loyal', 'gang_code', 'quantity', 'pack_code', 'keywords');
                    } else {
                        cards[card.code] = card;
                    }
                });

                return cards;
            }).catch(err => {
                logger.info(err);
            });
    }

    getAllPacks() {
        return this.packs.find({}).catch(err => {
            logger.info(err);
        });
    }
}

module.exports = CardService;
