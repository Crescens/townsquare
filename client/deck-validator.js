const _ = require('underscore');
const moment = require('moment');

function getDeckCount(deck) {
    let count = 0;

    _.each(deck, function(card) {
        count += card.count;
    });

    return count;
}

function hasKeyword(card, keyword) {
    return card.keywords && card.keywords.toLowerCase().indexOf(keyword.toLowerCase() + '.') !== -1;
}

function isCardInReleasedPack(packs, card) {
    let pack = _.find(packs, pack => {
        return card.pack_code === pack.code;
    });

    if(!pack) {
        return false;
    }

    let releaseDate = pack.available || pack.date_release;

    if(!releaseDate) {
        return false;
    }

    releaseDate = moment(releaseDate, 'YYYY-MM-DD');
    let now = moment();

    return releaseDate <= now;
}

/*function rulesForBanner(outfit, outfitName) {
    return {
        mayInclude: card => card.outfit_code === outfit && !card.is_loyal && card.type_code !== 'plot',
        rules: [
            {
                message: 'Must contain 12 or more ' + outfitName + ' cards',
                condition: deck => getDeckCount(_(deck.drawCards).filter(cardQuantity => cardQuantity.card.outfit_code === outfit)) >= 12
            }
        ]
    };
}*/

/**
 * Validation rule structure is as follows. All fields are optional.
 *
 * requiredDraw  - the minimum amount of cards required for the draw deck.
 * requiredPlots - the exact number of cards required for the plot deck.
 * mayInclude    - function that takes a card and returns true if it is allowed in the overall deck.
 * cannotInclude - function that takes a card and return true if it is not allowed in the overall deck.
 * rules         - an array of objects containing a `condition` function that takes a deck and return true if the deck is valid for that rule, and a `message` used for errors when invalid.
 */
const legendRules = {
/*    // Fealty
    '01027': {
        rules: [
            {
                message: 'You cannot include more than 15 neutral cards in a deck with Fealty',
                condition: deck => getDeckCount(_.filter(deck.drawCards, cardQuantity => cardQuantity.card.outfit_code === 'neutral')) <= 15
            }
        ]
    },
    // Kings of Summer
    '04037': {
        cannotInclude: card => card.type_code === 'plot' && hasTrait(card, 'Winter'),
        rules: [
            {
                message: 'Kings of Summer cannot include Winter plot cards',
                condition: deck => !_.any(deck.plotCards, cardQuantity => hasTrait(cardQuantity.card, 'Winter'))
            }
        ]
    },
    // Kings of Winter
    '04038': {
        cannotInclude: card => card.type_code === 'plot' && hasTrait(card, 'Summer'),
        rules: [
            {
                message: 'Kings of Winter cannot include Summer plot cards',
                condition: deck => !_.any(deck.plotCards, cardQuantity => hasTrait(cardQuantity.card, 'Summer'))
            }
        ]
    },
    // Rains of Castamere
    '05045': {
        requiredPlots: 12,
        rules: [
            {
                message: 'Rains of Castamere must contain exactly 5 different Scheme plots',
                condition: deck => {
                    let schemePlots = _.filter(deck.plotCards, cardQuantity => hasTrait(cardQuantity.card, 'Scheme'));
                    return schemePlots.length === 5 && getDeckCount(schemePlots) === 5;
                }
            }
        ]
    },
    // Alliance
    '06018': {
        requiredDraw: 75,
        rules: [
            {
                message: 'Alliance cannot have more than 2 Banner agendas',
                condition: deck => _.size(deck.bannerCards) <= 2
            }
        ]
    },
    // The Brotherhood Without Banners
    '06119': {
        cannotInclude: card => card.type_code === 'character' && card.is_loyal,
        rules: [
            {
                message: 'The Brotherhood Without Banners cannot include loyal characters',
                condition: deck => !_.any(deck.drawCards, cardQuantity => cardQuantity.card.type_code === 'character' && cardQuantity.card.is_loyal)
            }
        ]
    },
    // The Conclave
    '09045': {
        mayInclude: card => card.type_code === 'character' && hasTrait(card, 'Maester') && !card.is_loyal,
        rules: [
            {
                message: 'Must contain 12 or more Maester characters',
                condition: deck => getDeckCount(_(deck.drawCards).filter(cardQuantity => cardQuantity.card.type_code === 'character' && hasTrait(cardQuantity.card, 'Maester'))) >= 12
            }
        ]
    }*/
};

class DeckValidator {
    constructor(packs) {
        this.packs = packs;
    }

    validateDeck(deck) {
        let errors = [];
        let unreleasedCards = [];
        let rules = this.getRules(deck);
        //let plotCount = getDeckCount(deck.plotCards);
        let drawCount = getDeckCount(deck.drawCards);

        /*
        if(plotCount < rules.requiredPlots) {
            errors.push('Too few plot cards');
        } else if(plotCount > rules.requiredPlots) {
            errors.push('Too many plot cards');
        }*/

        if(drawCount < rules.requiredDraw) {
            errors.push('Too few draw cards');
        }

        _.each(rules.rules, rule => {
            if(!rule.condition(deck)) {
                errors.push(rule.message);
            }
        });

        let allCards = deck.drawCards;//deck.plotCards.concat(deck.drawCards);
        let cardCountByName = {};

        _.each(allCards, cardQuantity => {
            cardCountByName[cardQuantity.card.name] = cardCountByName[cardQuantity.card.name] || { name: cardQuantity.card.name, limit: cardQuantity.card.deck_limit, count: 0 };
            cardCountByName[cardQuantity.card.name].count += cardQuantity.count;

            /* -- No Outfit restrictions as of TCaR

            if(!rules.mayInclude(cardQuantity.card) || rules.cannotInclude(cardQuantity.card)) {
                errors.push(cardQuantity.card.title + ' is not allowed by outfit');
            }
            */

            if(!isCardInReleasedPack(this.packs, cardQuantity.card)) {
                unreleasedCards.push(cardQuantity.card.title + ' is not yet released');
            }
        });

        _.each(cardCountByName, card => {
            if(card.count > card.limit) {
                errors.push(card.name + ' has limit ' + card.limit);
            }
        });

        let isValid = errors.length === 0;

        return {
            status: !isValid ? 'Invalid' : (unreleasedCards.length === 0 ? 'Valid' : 'Unreleased Cards'),
            drawCount: drawCount,
            extendedStatus: errors.concat(unreleasedCards),
            isValid: isValid
        };
    }

    getRules(deck) {
        const standardRules = {
            requiredDraw: 52
        };
        let outfitRules = this.getOutfitRules(deck.outfit);
        let legendRules = this.getLegendRules(deck);
        return this.combineValidationRules([standardRules, outfitRules].concat(legendRules));
    }

    getOutfitRules(outfit) {
        //No inclusion restrictions for outfit as of TCaR
        return [];
    }

    getLegendRules(deck) {
        if(!deck.legend) {
            return [];
        }

        let allLegends = [];
        return _.compact(_(allLegends).map(legend => legendRules[legend.code]));
    }

    combineValidationRules(validators) {
        let mayIncludeFuncs = _.compact(_.pluck(validators, 'mayInclude'));
        let cannotIncludeFuncs = _.compact(_.pluck(validators, 'cannotInclude'));
        let combinedRules = _.reduce(validators, (rules, validator) => rules.concat(validator.rules || []), []);
        let combined = {
            mayInclude: card => _.any(mayIncludeFuncs, func => func(card)),
            cannotInclude: card => _.any(cannotIncludeFuncs, func => func(card)),
            rules: combinedRules
        };
        return _.extend({}, ...validators, combined);
    }
}

module.exports = function validateDeck(deck, packs) {
    let validator = new DeckValidator(packs);
    return validator.validateDeck(deck);
};
