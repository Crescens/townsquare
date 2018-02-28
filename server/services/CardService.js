const _ = require('underscore');

const logger = require('../log.js');

class CardService {
    constructor(db) {
        this.cards = db.get('cards');
        this.packs = db.get('packs');
    }

    replaceCards(cards) {
        return this.cards.remove({})
            .then(() => this.cards.insert(cards));
    }

    replacePacks(cards) {
        return this.packs.remove({})
            .then(() => this.packs.insert(cards));
    }

    getAllCards(options) {
        return this.cards.find({})
            .then(result => {
                let cards = {};

                _.each(result, card => {
                    if(options && options.shortForm) {
                        cards[card.code] = _.pick(card, 'code', 'title', 'label', 'type_code', 'type', 'gang_code', 'quantity', 'pack_code', 'keywords', 'wealth');
                    } else {
                        cards[card.code] = card;
                    }
                });

                return cards;

            }).then(result => {
                let matches = {};

                if(options && options.type_code) {
                    matches = _.pick(result, card => {
                        return (card.type_code === options.type_code);
                    });
                } else {
                    matches = result;
                }

                return matches;

            }).catch(err => {
                logger.info(err);
            });
    }

    getTitleCards() {
        return this.cards.find({ type_code: 'title' })
            .then(cards => {
                return cards.reduce((memo, card) => {
                    memo[card.code] = card;
                    return memo;
                }, {});
            });
    }

    getAllPacks() {
        return this.packs.find({}).catch(err => {
            logger.info(err);
        });
    }
}

module.exports = CardService;
