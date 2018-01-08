const _ = require('lodash');

/**
 * Class to evaluate hand rank from a hand of cards.
 */

class HandRank {
    constructor(hand) {

        this.modifier = 0;

        if(!hand) {
            return;
        }

        if(!Array.isArray(hand)) {
            return;
        }

        this.pokerhand = this.PokerHand(hand);

        this.GetRank().then((rank) => {
            this.rank = rank;
        });
    }

    async _initialize() {

        this.handEvaluators = [
            this.Jokers,
            this.DeadMansHand,
            this.FiveOfAKind,
            this.StraightFlush,
            this.FourOfAKind,
            this.FullHouse,
            this.Flush,
            this.Straight,
            this.ThreeOfAKind,
            this.TwoPair,
            this.OnePair,
            this.HighCard
        ];

        for(let i = 0; i < 12; i++) {
            this.handEvaluators[i](this.pokerhand);
        }
    }

    Jokers(hand) {

    }

    DeadMansHand(hand) {
        /*
        let dmh = [{value: 1, suit: 'spades'},
                   {value: 1, suit: 'clubs'},
                   {value: 8, suit: 'spades'},
                   {value: 8, suit: 'clubs'},
                   {value: 11, suit: 'diamonds'}];

        let diff = _.intersectionBy(dmh, hand, ['value', 'suit']);

        if(diff.length === 0) {

            this.rank = 11;
        }
        */
        return 11;
    }

    PokerHand(hand) {
        let strippedhand = [];

        _.each(hand, (card) => {
            strippedhand.push({value: card.value, suit: card.suit});
        });

        return strippedhand;
    }

    FiveOfAKind() {}

    StraightFlush() {}

    FourOfAKind() {}

    FullHouse() {}

    Flush() {}

    Straight() {}

    ThreeOfAKind() {}

    TwoPair() {}

    OnePair() {}

    HighCard() {}

    async GetRank() {
        return await this._initialize();
    }

}


module.exports = HandRank;
