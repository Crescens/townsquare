/*global describe, it, beforeEach, expect, jasmine*/
/*eslint camelcase: 0, no-invalid-this: 0 */
const _ = require('underscore');
const BaseLocation = require('../../../server/game/baselocation.js');

describe('BaseLocation', function () {
    beforeEach(function () {
        this.testCard1 = { code: '111', title: 'test 1' };
        this.testCard2 = { code: '222', title: 'test 2' };
        this.game = jasmine.createSpyObj('game', ['raiseMergedEvent']);
        this.owner = jasmine.createSpyObj('owner', ['getCardSelectionState']);
        this.owner.getCardSelectionState.and.returnValue({});
        this.owner.game = this.game;
        this.location = new BaseLocation('townsquare');
    });

    describe('when a location is created with a string', function () {
        it('should have a bare string in its represents property', function() {
            this.location = new BaseLocation('testlocation');
            expect(this.location.represents).not.toEqual('testlocation');
            expect(this.location.get()).toEqual({ code: 'testlocation'});
            expect(this.location.isCardLocation()).toBe(false);
        });
    });

    describe('when a location is created with an object', function () {
        it('should have an object in its represents property', function() {
            this.location = new BaseLocation(this.testCard1);
            expect(this.location.represents).toEqual(this.testCard1);
            expect(this.location.get()).toEqual(this.testCard1);
            expect(this.location.isCardLocation()).toBe(true);
        });
    });

    describe('when a location is made adjacent', function () {
        it('isAdjacent should return true', function () {
            this.location.attach(this.testCard1, 'placement');
            expect(this.location.isAdjacent(this.testCard1)).toEqual(true);
        });

        it('isAdjacent should return false on a different object', function () {
            this.location.attach(this.testCard1, 'placement');
            expect(this.location.isAdjacent(this.testCard2)).toEqual(false);
        });

        it('should no longer return adjacent if detached', function () {
            this.location.attach(this.testCard1, 'placement');
            expect(this.location.isAdjacent(this.testCard1)).toEqual(true);
            this.location.detach(this.testCard1);
            expect(this.location.isAdjacent(this.testCard1)).toEqual(false);
        });
    });

    describe('when a location is added on the left', function () {
        it('should be found on the left', function () {
            this.location.attach(this.testCard1, 'left');
            expect(this.location.left()).toEqual(this.testCard1);
        });

        it('should find nothing on the right', function() {
            this.location.attach(this.testCard1, 'left');
            expect(this.location.right()).toBeUndefined();
        });
    });

    describe('when a card is added to the location', function () {
        it('should be found in the cards object', function () {
            this.location.addCard(this.testCard2);
            expect(this.location.cards).toContain(this.testCard2);
        });

        it('should no longer be found after being removed', function () {
            this.location.addCard(this.testCard2);
            expect(this.location.cards).toContain(this.testCard2);
            this.location.removeCard(this.testCard2);
            expect(this.location.cards).not.toContain(this.testCard2);
        });

        it('should do nothing if nothing is passed', function () {
            this.location.addCard(this.testCard1);
            this.location.addCard();
            this.location.removeCard(this.testCard1);
            expect(this.location.cards).toEqual(_([]));
        });

        it('should remove nothing if nothing is passed', function () {
            this.location.addCard(this.testCard1);
            this.location.removeCard();
            expect(this.location.cards).toContain(this.testCard1);
        });
    });

    /*
    describe('when new instance created', function()
    {
        it('should generate a new uuid', function() {
            expect(this.location.uuid).not.toBeUndefined();
        });
    });
    */
});
