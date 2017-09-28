/*global describe, it, beforeEach, expect, jasmine*/
/*eslint camelcase: 0, no-invalid-this: 0 */

const BaseLocation = require('../../../server/game/baselocation.js');

describe('BaseLocation', function () {
    beforeEach(function () {
        this.testCard = { code: '111', title: 'test 1(some pack)' };
        this.game = jasmine.createSpyObj('game', ['raiseMergedEvent']);
        this.owner = jasmine.createSpyObj('owner', ['getCardSelectionState']);
        this.owner.getCardSelectionState.and.returnValue({});
        this.owner.game = this.game;
        this.location = new BaseLocation();
    });

    describe('when a location is made adjacent', function () {
        it('should show in list of adjacent locations', function () {
            this.location.makeAdjacent(this.testCard, 'placement');
            expect(this.location.one).toContain(this.testCard, 'placement');

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
