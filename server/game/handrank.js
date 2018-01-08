const _ = require('underscore');

/**
 * Class to evaluate hand rank from a hand of cards.
 */

class HandRank {
    constructor(hand) {

        this.modifier = 0;
        this.rank = 0;
        this.bestlegal = ([]);
        this.bestcheating = ([]);

        if(!hand) {
            return;
        }

        if(!Array.isArray(hand)) {
            return;
        }


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

        let pokerhand = this.PokerHand(hand);

        for(let i = 0; i < 12; i++) {
            this.handEvaluators[i](pokerhand);
        }

    }

    Jokers(hand) {

    }

    DeadMansHand(hand) {
        let dmh = [{value: 1, suit: 'spades'},
                   {value: 1, suit: 'clubs'},
                   {value: 8, suit: 'spades'},
                   {value: 8, suit: 'clubs'},
                   {value: 11, suit: 'diamonds'}];

        let diff = _.difference(dmh, hand);

        console.log(diff);
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

    HighCard() {

        return true;
    }
}


module.exports = HandRank;
