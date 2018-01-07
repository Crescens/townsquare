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

        for(let i = 0; i < 11; i++) {

            this.handEvaluators[i]();

        }

    }

    Jokers() {}

    DeadMansHand() {}

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
