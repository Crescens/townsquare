const _ = require('underscore');

const cards = require('./cards');
const DrawCard = require('./drawcard.js');
//const PlotCard = require('./plotcard.js');
//const LegendCard = require('./legendcard.js');

class Deck {
    constructor(data) {
        this.data = data;
    }

    prepare(player) {
        var result = {
            drawCards: []
        };

        result.starting = 0;

        this.eachRepeatedCard(this.data.drawCards, cardData => {

            if(['action', 'deed', 'dude', 'goods', 'spell'].includes(cardData.type_code)) {
                var drawCard = this.createCard(DrawCard, player, cardData);
                drawCard.location = 'draw deck';

                if(!drawCard.starting) {
                    result.drawCards.push(drawCard);
                } else {
                    result.starting++;
                    result.drawCards.unshift(drawCard);
                }
            }
        });


        /* No plot cards necessary
        this.eachRepeatedCard(this.data.plotCards, cardData => {
            if(cardData.type_code === 'plot') {
                var plotCard = this.createCard(PlotCard, player, cardData);
                plotCard.location = 'plot deck';
                result.plotCards.push(plotCard);
            }
        });
        */

        if(this.data.outfit) {
            result.outfit = new DrawCard(player, _.extend({
                code: this.data.outfit.value,
                type_code: 'outfit',
                outfit_code: this.data.outfit.value
            }, this.data.outfit));
        } else {
            result.outfit = new DrawCard(player, { type_code: 'outfit' });
        }

        result.outfit.moveTo('outfit');

        result.allCards = [result.outfit].concat(result.drawCards);//.concat(result.plotCards);

        if(this.data.legend) {
            result.legend = this.createCard(DrawCard, player, this.data.legend);
            result.legend.moveTo('legend');
            result.allCards.push(result.legend);
        } else {
            result.legend = undefined;
        }

        //result.bannerCards = _.map(this.data.bannerCards, card => this.createCard(LegendCard, player, card));

        return result;
    }

    eachRepeatedCard(cards, func) {
        _.each(cards, cardEntry => {
            let starting = cardEntry.starting;
            for(var i = 0; i < cardEntry.count; i++) {

                if(starting > 0) {
                    cardEntry.card.starting = true;
                    starting--;
                }

                func(cardEntry.card);
            }
        });
    }

    createCard(baseClass, player, cardData) {
        var cardClass = cards[cardData.code] || baseClass;
        return new cardClass(player, cardData);
    }
}

module.exports = Deck;
