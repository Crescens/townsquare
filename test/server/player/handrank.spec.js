/*global describe, it, beforeEach, expect, jasmine*/
/* eslint camelcase: 0, no-invalid-this: 0 */
const Game = require('../../../server/game/game.js');
const Player = require('../../../server/game/player.js');
const HandRank = require('../../../server/game/handrank.js');


describe('Game', function() {
    beforeEach(function() {
        this.gameRepository = jasmine.createSpyObj('gameRepository', ['save']);
        this.game = new Game('1', 'Test Game', { gameRepository: this.gameRepository });

        this.player1 = new Player('1', { username: 'Player 1', settings: {} }, true, this.game);

        this.game.playersAndSpectators[this.player1.id] = this.player1;

        this.game.initialise();

        this.handler = jasmine.createSpy('handler');
    });

    describe('HandRank()', function() {
        describe('called with no argument', function() {
            it('returns an invalid hand rank.', function() {
                expect(new HandRank().Hand()).toBeUndefined();
            });
        });

        describe('called with an argument that is not an array', function() {
            it('returns an invalid hand rank.', function() {
                expect(new HandRank(1).Hand()).toBeUndefined();
                expect(new HandRank('foo').Hand()).toBeUndefined();
            });
        });

        describe('Dead Mans Hand', function() {
            beforeEach(function() {
                this.hand = [new Card('A', 'S'), new Card('A', 'C'), new Card('8', 'S'), new Card('8', 'C'), new Card('J', 'D')];
            });

            it('should return a Hand Rank of 11', function() {
                let handrank = new HandRank(this.hand);
                expect(handrank.Hand().rank).toBe(11);
            });

        });
    });
});

class Card {
    constructor(rank, suit) {
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
