const _ = require('lodash');

/**
 * Class to evaluate hand rank from a hand of cards.
 */
/*
 const handEvaluators = [
     DeadMansHand,
     FiveOfAKind,
     StraightFlush,
     FourOfAKind,
     FullHouse,
     Flush,
     Straight,
     ThreeOfAKind,
     TwoPair,
     OnePair,
     HighCard
 ];
*/
class HandRank {
    constructor(hand) {
        if(!hand) {
            return;
        }

        if(!Array.isArray(hand)) {
            return;
        }

        this.pokerHands = new PokerHands(hand);
    }

    Rank() {
        console.log(this.pokerHands);
        return _.reduce(this.pokerHands, (result, value) => {
            if(value.rank) {
                return (result.rank > value.rank) ? result.rank : value.rank;
            }
        }, 0);
    }

}

class PokerHands {
    constructor(hand) {
        let strippedHand = [];
        let jokers = 0;

        _.each(hand, (card) => {

            if(card.suit === 'joker') {
                jokers++;
            }

            strippedHand.push({value: card.value, suit: card.suit});
        });

        this.DeadMansHand = new DeadMansHand(strippedHand, jokers);
        this.FiveOfAKind = new FiveOfAKind(strippedHand, jokers);
        this.StraightFlush = new StraightFlush(strippedHand, jokers);
        this.FourOfAKind = new FourOfAKind(strippedHand, jokers);
        this.FullHouse = new FullHouse(strippedHand, jokers);
        this.Flush = new Flush(strippedHand, jokers);
        this.Straight = new Straight(strippedHand, jokers);
        this.ThreeOfAKind = new ThreeOfAKind(strippedHand, jokers);
        this.TwoPair = new TwoPair(strippedHand, jokers);
        this.OnePair = new OnePair(strippedHand, jokers);
        this.HighCard = new HighCard(strippedHand, jokers);
    }
}

class DeadMansHand {
    constructor(hand, jokers) {

        let dmh = [{value: 1, suit: 'spades'},
                   {value: 1, suit: 'clubs'},
                   {value: 8, suit: 'spades'},
                   {value: 8, suit: 'clubs'},
                   {value: 11, suit: 'diamonds'}];

        let matches = _.intersectionWith(dmh, hand, (left, right) => {
            return ((left.value === right.value) && (left.suit === right.suit));
        });

        if((matches.length + jokers) >= 5) {
            this.rank = 11;
        }
    }
}

class FiveOfAKind {
    constructor(hand, jokers) {}
}

class StraightFlush {
    constructor(hand, jokers) {}
}

class FourOfAKind {
    constructor(hand, jokers) {}
}

class FullHouse {
    constructor(hand, jokers) {}
}

class Flush {
    constructor(hand, jokers) {}
}

class Straight {
    constructor(hand, jokers) {}
}

class ThreeOfAKind {
    constructor(hand, jokers) {}
}

class TwoPair {
    constructor(hand, jokers) {}
}

class OnePair {
    constructor(hand, jokers) {}
}

class HighCard {
    constructor(hand, jokers) {}
}


module.exports = HandRank;
