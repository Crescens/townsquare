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

        this.pokerHands = this.PokerHands(hand);
    }

    PokerHands(hand) {
        let strippedHand = [];
        let jokers = 0;

        _.each(hand, (card) => {

            if(card.suit === 'joker') {
                jokers++;
            }

            strippedHand.push({value: card.value, suit: card.suit});
        });

        this.DeadMansHand = new DeadMansHand(strippedHand, jokers);
    }

    Hand() {
        return _.reduce(this.pokerHands, (result, value) => {
            console.info('butt');
            return (result.rank < value.rank) ? result : value;
        });
    }
}

class DeadMansHand {
    constructor(hand, jokers) {
        let dmh = [{value: 1, suit: 'spades'},
                   {value: 1, suit: 'clubs'},
                   {value: 8, suit: 'spades'},
                   {value: 8, suit: 'clubs'},
                   {value: 11, suit: 'diamonds'}];

        //let diff = _.intersectionBy(dmh, hand, ['value', 'suit']);

        //if(diff.length <= jokers) {
            this.rank = 11;
        //}
    }
}


/*
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
*/


module.exports = HandRank;
