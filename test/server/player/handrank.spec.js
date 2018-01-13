/*global describe, it, beforeEach, expect, jasmine*/
/* eslint camelcase: 0, no-invalid-this: 0 */
const HandRank = require('../../../server/game/handrank.js');

describe('HandRank()', function() {
    describe('called with no argument', function() {
        it('returns an invalid hand rank.', function() {
            expect(new HandRank().Rank()).toEqual(0);
        });
    });

    describe('called with an argument that is not an array', function() {
        it('returns an invalid hand rank.', function() {
            expect(new HandRank(1).Rank()).toEqual(0);
            expect(new HandRank('foo').Rank()).toEqual(0);
        });
    });

    describe('DeadMansHand', function() {
        beforeEach(function() {
            this.hand = [new Card('A', 'S'), new Card('A', 'C'), new Card('8', 'S'), new Card('8', 'C'), new Card('J', 'D')];
        });

        it('should return a valid DeadMansHand with exactly the correct hand', function() {
            let handRank = new HandRank(this.hand);
            expect(handRank.Rank()).toBe(11);
        });

        it('should return a valid DeadMansHand if it contains extra cards', function() {
            this.hand.push(new Card('K', 'D'));
            let handRank = new HandRank(this.hand);
            expect(handRank.Rank()).toBe(11);

            this.hand.push(new Card('A', 'H'));
            handRank = new HandRank(this.hand);
            expect(handRank.Rank()).toBe(11);

            this.hand.push(new Card('7', 'D'));
            handRank = new HandRank(this.hand);
            expect(handRank.Rank()).toBe(11);
        });

        it('should no longer return a valid DeadMansHand with four cards', function() {
            this.hand.pop();
            let handRank = new HandRank(this.hand);
            expect(handRank.Rank()).not.toBe(11);
        });

        it('should return a DeadMansHand regardless of the order', function () {
            let card = this.hand.pop();
            this.hand.unshift(card);
            let handRank = new HandRank(this.hand);
            expect(handRank.Rank()).toBe(11);

            card = this.hand.pop();
            this.hand.unshift(card);
            handRank = new HandRank(this.hand);
            expect(handRank.Rank()).toBe(11);

            card = this.hand.pop();
            this.hand.unshift(card);
            handRank = new HandRank(this.hand);
            expect(handRank.Rank()).toBe(11);

            card = this.hand.pop();
            this.hand.unshift(card);
            handRank = new HandRank(this.hand);
            expect(handRank.Rank()).toBe(11);
        });

        it('should return a DeadMansHand with Jokers', function () {
            this.hand.pop();
            let handRank = new HandRank(this.hand);
            expect(handRank.Rank()).not.toBe(11);

            this.hand.push(new Card('joker'));
            handRank = new HandRank(this.hand);
            expect(handRank.Rank()).toBe(11);

            let joker1 = new HandRank(this.hand = [new Card('A', 'S'), new Card('A', 'C'), new Card('8', 'S'), new Card('8', 'C'), new Card('joker')]);
            let joker2 = new HandRank(this.hand = [new Card('A', 'S'), new Card('joker'), new Card('joker'), new Card('8', 'C'), new Card('J', 'D')]);
            let joker3 = new HandRank(this.hand = [new Card('joker'), new Card('joker'), new Card('8', 'S'), new Card('joker'), new Card('J', 'D')]);
            let joker4 = new HandRank(this.hand = [new Card('joker'), new Card('joker'), new Card('joker'), new Card('joker'), new Card('J', 'D')]);
            let joker5 = new HandRank(this.hand = [new Card('joker'), new Card('joker'), new Card('joker'), new Card('joker'), new Card('joker')]);

            expect(joker1.Rank()).toBe(11);
            expect(joker2.Rank()).toBe(11);
            expect(joker3.Rank()).toBe(11);
            expect(joker4.Rank()).toBe(11);
            expect(joker5.Rank()).toBe(11);
        });
    });

    describe('FiveOfAKind', function() {
        beforeEach(function() {
            this.cheatinHand = [new Card('J', 'S'), new Card('J', 'D'), new Card('J', 'C'), new Card('J', 'H'), new Card('J', 'D')];
            this.legalHand = [new Card('joker'), new Card('J', 'H'), new Card('J', 'D'), new Card('J', 'D'), new Card('J', 'S')];
        });

        it('should return a valid FiveOfAKind with the correct hand', function() {
            let legalHandRank = new HandRank(this.legalHand);
            let cheatinHandRank = new HandRank(this.cheatinHand);

            expect(legalHandRank.Rank()).toBe(10);
            expect(cheatinHandRank.Rank()).toBe(10);
        });

        it('should return a valid FiveOfAKind with additional cards', function() {
            this.cheatinHand.push(new Card('A', 'H'));
            this.legalHand.push(new Card('J', 'H'));

            let legalHandRank = new HandRank(this.legalHand);
            let cheatinHandRank = new HandRank(this.cheatinHand);

            expect(legalHandRank.Rank()).toBe(10);
            expect(cheatinHandRank.Rank()).toBe(10);
        });

        it('should no longer return FiveOfAKind with 4 cards', function() {
            this.cheatinHand.pop();
            this.legalHand.pop();

            let legalHandRank = new HandRank(this.legalHand);
            let cheatinHandRank = new HandRank(this.cheatinHand);

            expect(legalHandRank.Rank()).not.toBe(10);
            expect(cheatinHandRank.Rank()).not.toBe(10);
        });
    });

    describe('StraightFlush', function() {
        beforeEach(function() {
            this.legalHand = [new Card('K', 'S'), new Card('Q', 'S'), new Card('J', 'S'), new Card('10', 'S'), new Card('9', 'S')];
        });

        it('should return a valid StraightFlush with exactly the correct hand', function() {
            let legalHandRank = new HandRank(this.legalHand);
            expect(legalHandRank.Rank()).toBe(9);
        });

        it('should return a valid StraightFlush with additional cards', function() {
            this.legalHand.push(new Card('A', 'S'));
            this.legalHand.push(new Card('Q', 'D'));

            let legalHandRank = new HandRank(this.legalHand);
            expect(legalHandRank.Rank()).toBe(9);
        });

        it('should no longer return StraightFlush with 4 cards', function() {
            this.legalHand.pop();

            let legalHandRank = new HandRank(this.legalHand);

            expect(legalHandRank.Rank()).not.toBe(9);
        });

    });

    describe('FourOfAKind', function() {
        beforeEach(function() {
            this.cheatinHand = [new Card('7', 'S'), new Card('7', 'D'), new Card('7', 'C'), new Card('7', 'S'), new Card('2', 'D')];
            this.legalHand = [new Card('8', 'S'), new Card('8', 'H'), new Card('8', 'D'), new Card('8', 'S'), new Card('3', 'S')];
        });

        it('should return a valid FourOfAKind with exactly the correct hand', function() {
            let legalHandRank = new HandRank(this.legalHand);
            let cheatinHandRank = new HandRank(this.cheatinHand);

            expect(legalHandRank.Rank()).toBe(8);
            expect(cheatinHandRank.Rank()).toBe(8);
        });

        it('should return a valid FourOfAKind with additional cards', function() {
            this.cheatinHand.push(new Card('10', 'H'));
            this.legalHand.push(new Card('Q', 'H'));

            let legalHandRank = new HandRank(this.legalHand);
            let cheatinHandRank = new HandRank(this.cheatinHand);

            expect(legalHandRank.Rank()).toBe(8);
            expect(cheatinHandRank.Rank()).toBe(8);
        });

        it('should no longer return FourOfAKind with 3 cards', function() {
            this.cheatinHand.pop();
            this.cheatinHand.pop();

            this.legalHand.pop();
            this.legalHand.pop();

            let legalHandRank = new HandRank(this.legalHand);
            let cheatinHandRank = new HandRank(this.cheatinHand);

            expect(legalHandRank.Rank()).not.toBe(8);
            expect(cheatinHandRank.Rank()).not.toBe(8);
        });
    });

    describe('Flush', function() {
        beforeEach(function() {
            this.cheatinHand = [new Card('7', 'H'), new Card('2', 'H'), new Card('J', 'H'), new Card('J', 'H'), new Card('7', 'H')];
            this.legalHand = [new Card('7', 'C'), new Card('3', 'C'), new Card('2', 'C'), new Card('J', 'C'), new Card('K', 'C')];
        });

        it('should return a valid Flush with the correct hand', function() {
            let legalHandRank = new HandRank(this.legalHand);
            let cheatinHandRank = new HandRank(this.cheatinHand);

            expect(legalHandRank.Rank()).toBe(6);
            expect(cheatinHandRank.Rank()).toBe(6);
        });

        it('should return a valid Flush with additional cards', function() {
            this.cheatinHand.push(new Card('A', 'H'));
            this.legalHand.push(new Card('J', 'H'));

            let legalHandRank = new HandRank(this.legalHand);
            let cheatinHandRank = new HandRank(this.cheatinHand);

            expect(legalHandRank.Rank()).toBe(6);
            expect(cheatinHandRank.Rank()).toBe(6);
        });

        it('should no longer return Flush with 4 cards', function() {
            this.cheatinHand.pop();
            this.legalHand.pop();

            let legalHandRank = new HandRank(this.legalHand);
            let cheatinHandRank = new HandRank(this.cheatinHand);

            expect(legalHandRank.Rank()).not.toBe(6);
            expect(cheatinHandRank.Rank()).not.toBe(6);
        });
    });

    describe('Straight', function() {
        beforeEach(function() {
            this.legalHand = [new Card('5', 'S'), new Card('4', 'H'), new Card('3', 'D'), new Card('2', 'S'), new Card('6', 'S')];
        });

        it('should return a valid Straight with exactly the correct hand', function() {
            let legalHandRank = new HandRank(this.legalHand);
            expect(legalHandRank.Rank()).toBe(5);
        });

        it('should return a valid Straight with additional cards', function() {
            this.legalHand.push(new Card('A', 'S'));
            this.legalHand.push(new Card('9', 'D'));

            let legalHandRank = new HandRank(this.legalHand);
            expect(legalHandRank.Rank()).toBe(5);
        });

        it('should no longer return Straight with 4 cards', function() {
            this.legalHand.pop();

            let legalHandRank = new HandRank(this.legalHand);

            expect(legalHandRank.Rank()).not.toBe(5);
        });

    });

    describe('ThreeOfAKind', function() {
        beforeEach(function() {
            this.cheatinHand = [new Card('2', 'S'), new Card('2', 'D'), new Card('2', 'D'), new Card('9', 'S'), new Card('K', 'D')];
            this.legalHand = [new Card('5', 'S'), new Card('5', 'H'), new Card('5', 'D'), new Card('8', 'S'), new Card('3', 'S')];
        });

        it('should return a valid ThreeOfAKind with exactly the correct hand', function() {
            let legalHandRank = new HandRank(this.legalHand);
            let cheatinHandRank = new HandRank(this.cheatinHand);

            expect(legalHandRank.Rank()).toBe(4);
            expect(cheatinHandRank.Rank()).toBe(4);
        });

        it('should return a valid ThreeOfAKind with additional cards', function() {
            this.cheatinHand.push(new Card('A', 'S'));
            this.legalHand.push(new Card('9', 'D'));

            let legalHandRank = new HandRank(this.legalHand);
            let cheatinHandRank = new HandRank(this.cheatinHand);

            expect(legalHandRank.Rank()).toBe(4);
            expect(cheatinHandRank.Rank()).toBe(4);
        });

        it('should no longer return ThreeOfAKind with 2 cards', function() {
            this.cheatinHand.pop();
            this.cheatinHand.pop();
            this.cheatinHand.pop();

            this.legalHand.pop();
            this.legalHand.pop();
            this.legalHand.pop();

            let legalHandRank = new HandRank(this.legalHand);
            let cheatinHandRank = new HandRank(this.cheatinHand);

            expect(legalHandRank.Rank()).not.toBe(4);
            expect(cheatinHandRank.Rank()).not.toBe(4);
        });
    });

    describe('OnePair', function() {
        beforeEach(function() {
            this.cheatinHand = [new Card('A', 'S'), new Card('A', 'S'), new Card('7', 'D'), new Card('9', 'C'), new Card('8', 'D')];
            this.legalHand = [new Card('Q', 'S'), new Card('Q', 'H'), new Card('6', 'D'), new Card('J', 'S'), new Card('10', 'S')];
        });

        it('should return a valid OnePair with exactly the correct hand', function() {
            let legalHandRank = new HandRank(this.legalHand);
            let cheatinHandRank = new HandRank(this.cheatinHand);

            expect(legalHandRank.Rank()).toBe(2);
            expect(cheatinHandRank.Rank()).toBe(2);
        });

        it('should return a valid OnePair with additional cards', function() {
            this.cheatinHand.push(new Card('4', 'C'));
            this.legalHand.push(new Card('2', 'H'));

            let legalHandRank = new HandRank(this.legalHand);
            let cheatinHandRank = new HandRank(this.cheatinHand);

            expect(legalHandRank.Rank()).toBe(2);
            expect(cheatinHandRank.Rank()).toBe(2);
        });

        it('should no longer return OnePair with 1 cards', function() {
            this.cheatinHand.pop();
            this.cheatinHand.pop();
            this.cheatinHand.pop();
            this.cheatinHand.pop();

            this.legalHand.pop();
            this.legalHand.pop();
            this.legalHand.pop();
            this.legalHand.pop();

            let legalHandRank = new HandRank(this.legalHand);
            let cheatinHandRank = new HandRank(this.cheatinHand);

            expect(legalHandRank.Rank()).not.toBe(2);
            expect(cheatinHandRank.Rank()).not.toBe(2);
        });
    });
});

class Card {
    constructor(rank, suit) {

        if(rank === 'joker') {
            this.type = 'joker';
            return;
        }

        this.title = rank + ' of ' + suit;

        this.value = 0;

        if(rank === 'A') {
            this.value = 1;
        } else if(rank >= 2 && rank <= 10) {
            this.value = parseInt(rank);
        } else if(rank === 'J') {
            this.value = 11;
        } else if(rank === 'Q') {
            this.value = 12;
        } else if(rank === 'K') {
            this.value = 13;
        }

        if(this.value === 0) {
            throw 'invalid argument';
        }


        if(suit === 'S') {
            this.suit = 'spades';
        } else if(suit === 'C') {
            this.suit = 'clubs';
        } else if(suit === 'H') {
            this.suit = 'hearts';
        } else if(suit === 'D') {
            this.suit = 'diamonds';
        } else {
            throw 'invalid argument';
        }
    }
}
