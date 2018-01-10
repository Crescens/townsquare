const _ = require('lodash');

/**
 * Class to evaluate hand rank from a hand of cards.
 */

class HandRank {
    constructor(hand) {

        this.modifier = 0;
        this.hands = [];

        if(!hand) {
            return;
        }

        if(!Array.isArray(hand)) {
            return;
        }

        this.pokerHand = this.PokerHand(hand);

        this.HandRanks();
    }

    HandRanks() {

        if(this.handRanks) {
            return;
        }

        this.handEvaluators = [
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

        this.Jokers()
            .then(Promise.all(this.handEvaluators))
            .then((result) => {
                return result;
            });
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
        this.hands[11] = {rank: 11};
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

}


module.exports = HandRank;
