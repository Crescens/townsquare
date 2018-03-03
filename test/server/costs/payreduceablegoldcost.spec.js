const Costs = require('../../../server/game/costs.js');

describe('Costs.payReduceableGhostRockCost', function() {
    beforeEach(function() {
        this.gameSpy = jasmine.createSpyObj('game', ['addMessage']);
        this.playerSpy = jasmine.createSpyObj('player', ['getDuplicateInPlay', 'getReducedCost', 'markUsedReducers']);
        this.cardSpy = { card: 1 };
        this.context = {
            costs: {},
            game: this.gameSpy,
            player: this.playerSpy,
            source: this.cardSpy
        };
        this.cost = Costs.payReduceableGhostRockCost('playing-type');
    });

    describe('canPay()', function() {
        beforeEach(function() {
            this.playerSpy.ghostrock = 4;
            this.playerSpy.getReducedCost.and.returnValue(4);
        });

        it('should return true when all criteria are met', function() {
            expect(this.cost.canPay(this.context)).toBe(true);
        });

        it('should check the cost properly', function() {
            this.cost.canPay(this.context);
            expect(this.playerSpy.getReducedCost).toHaveBeenCalledWith('playing-type', this.cardSpy);
        });

        describe('when there is a duplicate in play', function() {
            beforeEach(function() {
                this.playerSpy.getDuplicateInPlay.and.returnValue({});
            });

            describe('and the play type is marshal', function() {
                beforeEach(function() {
                    this.cost = Costs.payReduceableGhostRockCost('marshal');
                });

                it('should return true regardless of ghostrock', function() {
                    this.playerSpy.ghostrock = 0;
                    expect(this.cost.canPay(this.context)).toBe(true);
                });
            });

            describe('and the play type is not marshal', function() {
                beforeEach(function() {
                    this.cost = Costs.payReduceableGhostRockCost('ambush');
                });

                it('should return true if there is enough ghostrock', function() {
                    this.playerSpy.ghostrock = 4;
                    expect(this.cost.canPay(this.context)).toBe(true);
                });

                it('should return false if there is not enough ghostrock', function() {
                    this.playerSpy.ghostrock = 0;
                    expect(this.cost.canPay(this.context)).toBe(false);
                });
            });
        });

        describe('when there is not enough ghostrock', function() {
            beforeEach(function() {
                this.playerSpy.ghostrock = 3;
            });

            it('should return false', function() {
                expect(this.cost.canPay(this.context)).toBe(false);
            });
        });
    });

    describe('pay()', function() {
        beforeEach(function() {
            this.playerSpy.ghostrock = 4;
            this.playerSpy.getReducedCost.and.returnValue(3);
        });

        describe('', function() {
            beforeEach(function() {
                this.cost.pay(this.context);
            });

            it('should mark the ghostrock cost as the reduced cost', function() {
                expect(this.context.costs.ghostrock).toBe(3);
            });

            it('should spend the players ghostrock', function() {
                expect(this.playerSpy.ghostrock).toBe(1);
            });

            it('should mark any reducers as used', function() {
                expect(this.playerSpy.markUsedReducers).toHaveBeenCalledWith('playing-type', this.cardSpy);
            });
        });

    });
});
