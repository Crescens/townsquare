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

        this.pokerHands = _.filter(new PokerHands(hand), (hr) => (hr.rank !== undefined));

        //console.log(this.pokerHands);
    }

    //This method should return the "best" rank at the given context of the game
    //i.e. lowest possible hand in Gamblin', highest in Noon
    Rank() {
        let bestRank = _.orderBy(this.pokerHands, 'rank', 'desc');
        //console.log(bestRank);
        return (bestRank[0] ? bestRank[0].rank : 0);
    }

}

class PokerHands {
    constructor(hand) {
        let strippedHand = [];
        let jokers = 0;

        _.each(hand, (card) => {

            //console.log(card);

            if(card.type === 'joker') {
                //console.log('joker found');
                jokers++;
            }

            strippedHand.push({key: card.key, value: card.value, suit: card.suit, type: card.type});
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

class HandEvaluator {

    LegalHand(hand) {
        return _.uniqBy(hand, 'value', 'suit');
    }
}

class DeadMansHand {
    constructor(hand, jokers) {

        let dmh = [{value: 1, suit: 'spades'},
                   {value: 1, suit: 'clubs'},
                   {value: 8, suit: 'spades'},
                   {value: 8, suit: 'clubs'},
                   {value: 11, suit: 'diamonds'}];

        this.matches = _.intersectionWith(dmh, hand, (left, right) => {
            return ((left.value === right.value) && (left.suit === right.suit));
        });

        if((this.matches.length + jokers) >= 5) {
            this.rank = 11;
        }
    }
}

class FiveOfAKind {
    constructor(hand, jokers) {

        //Check for 5oaK, starting from the best (Ks)
        //down to the worst (As). Only return the best hand
        for(let i = 13; i > 0; i--) {
            this.matches = _.filter(hand, (card) => {
                return (card.value === i);
            });

            if((this.matches.length + jokers) >= 5) {
                this.rank = 10;
                break;
            }
        }
    }
}

class StraightFlush {
    constructor(hand, jokers) {

        let suits = ['clubs', 'diamonds', 'hearts', 'spades'];

        suits.forEach((suit) => {
            for(let i = 13; i > 0; i--) {
                let straightFlush = [{value: i, suit: suit},
                                     {value: i - 1, suit: suit},
                                     {value: i - 2, suit: suit},
                                     {value: i - 3, suit: suit},
                                     {value: i - 4, suit: suit}];

                this.matches = _.intersectionWith(hand, straightFlush, (left, right) => {
                    return ((left.value === right.value) && (left.suit === right.suit));
                });

                if((this.matches.length + jokers) >= 5) {
                    this.rank = 9;
                    break;
                }
            }
        });
    }
}

class FourOfAKind {
    constructor(hand, jokers) {
        //Check for 4oaK, starting from the best (Ks, value 13)
        //down to the worst (As, value 1). Only return the best hand
        for(let i = 13; i > 0; i--) {
            this.matches = _.filter(hand, (card) => {
                return (card.value === i);
            });

            if((this.matches.length + jokers) === 4) {
                this.rank = 8;
                break;
            }
        }
    }
}

class FullHouse {
    constructor(hand, jokers) {}
}

class Flush extends HandEvaluator {
    super(hand, jokers) {

        suits.forEach((suit) => {
            for(let i = 13; i > 0; i--) {

                let flush = [{value: i, suit: suit},
                             {suit: suit},
                             {suit: suit},
                             {suit: suit},
                             {suit: suit}];

                console.log(this.LegalHand(hand));

                this.matches = _.intersectionWith(hand, flush, (left, right) => {
                    return (left.suit === right.suit);
                });

                if((this.matches.length + jokers) >= 5) {
                    this.rank = 6;
                    break;
                }
            }
        });
    }
}

class Straight {
    constructor(hand, jokers) {
        for(let i = 13; i > 0; i--) {
            let straight = [{value: i},
                            {value: i - 1},
                            {value: i - 2},
                            {value: i - 3},
                            {value: i - 4}];

            this.matches = _.intersectionBy(hand, straight, 'value');

            if((this.matches.length + jokers) >= 5) {
                this.rank = 5;
                break;
            }
        }
    }
}

class ThreeOfAKind {
    constructor(hand, jokers) {
        //Check for 3oaK, starting from the best (Ks)
        //down to the worst (As). Only return the best hand
        for(let i = 13; i > 0; i--) {
            this.matches = _.filter(hand, (card) => {
                return (card.value === i);
            });

            if((this.matches.length + jokers) === 3) {
                this.rank = 4;
                break;
            }
        }
    }
}

class TwoPair {
    constructor(hand, jokers) {}
}

class OnePair {
    constructor(hand, jokers) {
        //Check for 1P, starting from the best (Ks)
        //down to the worst (As). Only return the best hand
        for(let i = 13; i > 0; i--) {
            this.matches = _.filter(hand, (card) => {
                return (card.value === i);
            });

            if((this.matches.length + jokers) === 2) {
                this.rank = 2;
                break;
            }
        }
    }
}

class HighCard {
    constructor(hand, jokers) {}
}


module.exports = HandRank;
