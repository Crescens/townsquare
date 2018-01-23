/*global describe, it, beforeEach, expect, jasmine*/
/*eslint camelcase: 0, no-invalid-this: 0 */
//const _ = require('underscore');
const uuid = require('uuid');
const GameLocation = require('../../../../server/game/gamelocation.js');

describe('GameLocation', function () {
    beforeEach(function () {
        this.testCard1 = { uuid: uuid.v1(), title: 'test 1' };
        this.testCard2 = { uuid: uuid.v1(), title: 'test 2' };
        this.game = jasmine.createSpyObj('game', ['raiseMergedEvent']);
        this.owner = jasmine.createSpyObj('owner', ['getCardSelectionState']);
        this.owner.getCardSelectionState.and.returnValue({});
        this.owner.game = this.game;
        this.location = new GameLocation('townsquare', 0);
    });

    describe('when a location is created with a string', function () {
        it('should have a bare string in its uuid property', function() {
            this.location = new GameLocation('testlocation', 1);
            expect(this.location.getKey()).toEqual('testlocation');
            expect(this.location.isCardLocation()).toBe(false);
        });
    });

    describe('when a location is created with a uuid', function () {
        beforeEach(function() {
            this.location = new GameLocation(this.testCard1.uuid, -1);
        });

        it('should have an uuid in its uuid property', function() {
            expect(this.location.uuid).toEqual(this.testCard1.uuid);
            expect(this.location.getKey()).toEqual(this.testCard1.uuid);
        });

        it('isCardLocation should return true', function() {
            expect(this.location.isCardLocation()).toBe(true);
        });

        it('should have an order parameter that matches what was passed', function () {
            expect(this.location.order).toBe(-1);
        });
    });

    describe('when a location is made adjacent', function () {
        beforeEach(function() {
            this.location.attach(this.testCard1.uuid, 'placement');
        });

        it('isAdjacent should return true', function () {
            expect(this.location.isAdjacent(this.testCard1.uuid)).toEqual(true);
        });

        it('isAdjacent should return false on a different object', function () {
            expect(this.location.isAdjacent(this.testCard2.uuid)).toEqual(false);
        });

        it('should no longer return adjacent if detached', function () {
            expect(this.location.isAdjacent(this.testCard1.uuid)).toEqual(true);
            this.location.detach(this.testCard1.uuid);
            expect(this.location.isAdjacent(this.testCard1.uuid)).toEqual(false);
        });
    });

    describe('when a location is added on the left', function () {
        beforeEach(function () {
            this.location.attach(this.testCard1.uuid, 'left');
        });

        it('should be found on the left', function () {
            expect(this.location.left()).toEqual(this.testCard1.uuid);
        });

        it('should find nothing on the right', function() {
            expect(this.location.right()).toBeUndefined();
        });
    });

    describe('when a location is added on the right', function () {
        beforeEach(function () {
            this.location.attach(this.testCard1.uuid, 'right');
        });

        it('should be found on the right', function () {
            expect(this.location.right()).toEqual(this.testCard1.uuid);
        });

        it('should find nothing on the left', function() {
            expect(this.location.left()).toBeUndefined();
        });
    });

    /*
    describe('when a card is added to the location', function () {
        beforeEach(function () {
            this.location.addCard(this.testCard2.uuid);
        });

        it('should be found in the cards object', function () {
            expect(this.location.cards).toContain(this.testCard2.uuid);
        });

        it('should no longer be found after being removed', function () {
            expect(this.location.cards).toContain(this.testCard2.uuid);
            this.location.removeCard(this.testCard2.uuid);
            expect(this.location.cards).not.toContain(this.testCard2.uuid);
        });

        it('should do nothing if nothing is passed', function () {
            this.location.addCard();
            this.location.removeCard(this.testCard2.uuid);
            expect(this.location.cards).toEqual(_([]));
        });

        it('should remove nothing if nothing is passed', function () {
            this.location.removeCard();
            expect(this.location.cards).toContain(this.testCard2.uuid);
        });
    });
    */

    /*
    describe('when new instance created', function()
    {
        it('should generate a new uuid', function() {
            expect(this.location.uuid).not.toBeUndefined();
        });
    });
    */
});
