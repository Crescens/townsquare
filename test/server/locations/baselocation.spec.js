/*global describe, it, beforeEach, expect, jasmine*/
/*eslint camelcase: 0, no-invalid-this: 0 */

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
            expect(this.location.represents).toEqual('testlocation');
            expect(this.location.Represents()).toEqual('testlocation');
        });
    });

    describe('when a location is created with an object', function () {
        it('should have an object in its represents property', function() {
            this.location = new BaseLocation(this.testCard1);
            expect(this.location.represents).toEqual(this.testCard1);
            expect(this.location.Represents()).toEqual(this.testCard1);
        });
    });

    describe('when a location is made adjacent', function () {
        it('isAdjacent should return true', function () {
            this.location.Attach(this.testCard1, 'placement');
            expect(this.location.isAdjacent(this.testCard1)).toEqual(true);
        });

        it('isAdjacent should return false on a different object', function () {
            this.location.Attach(this.testCard1, 'placement');
            expect(this.location.isAdjacent(this.testCard2)).toEqual(false);
        });

        it('should no longer return adjacent if detached', function () {
            this.location.Attach(this.testCard1, 'placement');
            expect(this.location.isAdjacent(this.testCard1)).toEqual(true);
            this.location.Detach(this.testCard1);
            expect(this.location.isAdjacent(this.testCard1)).toEqual(false);
        });
    });

    describe('when a location is added on the left', function () {
        it('should be found on the left', function () {
            this.location.Attach(this.testCard1, 'left');
            expect(this.location.Left()).toEqual(this.testCard1);
        });

        it('should find nothing on the right', function() {
            this.location.Attach(this.testCard1, 'left');
            expect(this.location.Right()).toBeUndefined();
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
