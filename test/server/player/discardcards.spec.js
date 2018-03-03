const Player = require('../../../server/game/player.js');

describe('Player', function() {

    function createCardSpy(num) {
        let spy = jasmine.createSpyObj('card', ['moveTo', 'removeDuplicate']);
        spy.num = num;
        spy.location = 'loc';
        return spy;
    }

    beforeEach(function() {
        this.gameSpy = jasmine.createSpyObj('game', ['applyGameAction', 'raiseSimultaneousEvent']);
        this.gameSpy.applyGameAction.and.callFake((type, cards, handler) => {
            if(cards.length > 0) {
                handler(cards);
            }
        });
        this.gameSpy.raiseSimultaneousEvent.and.callFake((cards, params) => {
            this.handler = params.handler;
            this.postHandler = params.postHandler;
            this.perCardHandler = params.perCardHandler;
        });

        this.player = new Player('1', { username: 'Test 1', settings: {} }, true, this.gameSpy);
        spyOn(this.player, 'moveCard');

        this.callbackSpy = jasmine.createSpy('callback');

        this.card1 = createCardSpy(1);
        this.card2 = createCardSpy(2);
    });

    describe('discardCards()', function() {
        describe('when no cards are passed', function() {
            beforeEach(function() {
                this.player.discardCards([], false, this.callbackSpy);
            });

            it('should not raise the event', function() {
                expect(this.gameSpy.raiseSimultaneousEvent).not.toHaveBeenCalled();
            });
        });

        describe('when cards are passed', function() {
            beforeEach(function() {
                this.player.discardCards([this.card1, this.card2], false, this.callbackSpy);
            });

            it('should raise the onCardsDiscarded event', function() {
<<<<<<< HEAD
                expect(this.gameSpy.raiseMergedEvent).toHaveBeenCalledWith('onCardsDiscarded', this.eventOuterParams, jasmine.any(Function));
            });

            describe('the onCardsDiscarded handler', function() {
                beforeEach(function() {
                    this.gameSpy.queueSimpleStep.and.callFake(callback => {
                        this.simpleStepCallback = callback;
                    });
                    this.eventInnerParams1 = { player: this.player, card: this.card1, allowSave: false, originalLocation: 'loc' };
                    this.eventInnerParams2 = { player: this.player, card: this.card2, allowSave: false, originalLocation: 'loc' };
                    this.onCardsDiscardedHandler = this.gameSpy.raiseMergedEvent.calls.mostRecent().args[2];
                    this.onCardsDiscardedHandler(this.eventOuterParams);
                });

                it('should raise the onCardDiscarded event for each card', function() {
                    expect(this.gameSpy.raiseMergedEvent).toHaveBeenCalledWith('onCardDiscarded', this.eventInnerParams1, jasmine.any(Function));
                    expect(this.gameSpy.raiseMergedEvent).toHaveBeenCalledWith('onCardDiscarded', this.eventInnerParams2, jasmine.any(Function));
                });

                it('should queue a step to call the callback', function() {
                    expect(this.gameSpy.queueSimpleStep).toHaveBeenCalled();
                });

                describe('the simple step callback', function () {
                    it('should call the original callback', function() {
                        this.simpleStepCallback();
                        expect(this.callbackSpy).toHaveBeenCalledWith([this.card1,this.card2]);
                    });
                });

                describe('the onCardDiscarded handler', function() {
                    beforeEach(function() {
                        this.onCardDiscardedHandler = this.gameSpy.raiseMergedEvent.calls.mostRecent().args[2];
                        this.onCardDiscardedHandler(this.eventInnerParams1);
                    });

                    it('should move the card to discard', function() {
                        expect(this.player.moveCard).toHaveBeenCalledWith(this.card1, 'discard pile');
                    });
=======
                expect(this.gameSpy.raiseSimultaneousEvent).toHaveBeenCalledWith([this.card1, this.card2], jasmine.objectContaining({
                    eventName: 'onCardsDiscarded',
                    postHandler: jasmine.any(Function),
                    perCardEventName: 'onCardDiscarded',
                    perCardHandler: jasmine.any(Function),
                    params: jasmine.objectContaining({
                        allowSave: false,
                        automaticSaveWithDupe: true,
                        originalLocation: 'loc'
                    })
                }));
            });

            describe('the perCardHandler', function() {
                beforeEach(function() {
                    this.perCardHandler({ card: this.card1 });
                });

                it('should move the card to the discard pile', function() {
                    expect(this.player.moveCard).toHaveBeenCalledWith(this.card1, 'discard pile');
                });
            });

            describe('the postHandler', function() {
                beforeEach(function() {
                    this.postHandler({ cards: [this.card1, this.card2] });
                });

                it('should call the callback with the appropriate cards', function() {
                    expect(this.callbackSpy).toHaveBeenCalledWith([this.card1, this.card2]);
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
                });
            });
        });
    });

<<<<<<< HEAD
    describe('discardCard()', function () {
        describe('when the card has no dupes', function() {
            beforeEach(function() {
                this.eventOuterParams = { player: this.player, cards: [this.card1], allowSave: false, originalLocation: 'loc' };
                this.player.discardCard(this.card1, false);
            });

            it('should raise the onCardsDiscarded event', function() {
                expect(this.gameSpy.raiseMergedEvent).toHaveBeenCalledWith('onCardsDiscarded', this.eventOuterParams, jasmine.any(Function));
            });

            describe('the onCardsDiscarded handler', function() {
                beforeEach(function() {
                    this.gameSpy.queueSimpleStep.and.callFake(callback => {
                        this.simpleStepCallback = callback;
                    });
                    this.eventInnerParams1 = { player: this.player, card: this.card1, allowSave: false, originalLocation: 'loc' };
                    this.onCardsDiscardedHandler = this.gameSpy.raiseMergedEvent.calls.mostRecent().args[2];
                    this.onCardsDiscardedHandler(this.eventOuterParams);
                });

                it('should raise the onCardDiscarded event for each card', function() {
                    expect(this.gameSpy.raiseMergedEvent).toHaveBeenCalledWith('onCardDiscarded', this.eventInnerParams1, jasmine.any(Function));
                });

                describe('the onCardDiscarded handler', function() {
                    beforeEach(function() {
                        this.onCardDiscardedHandler = this.gameSpy.raiseMergedEvent.calls.mostRecent().args[2];
                        this.onCardDiscardedHandler(this.eventInnerParams1);
                    });
=======
    describe('discardCard()', function() {
        beforeEach(function() {
            this.player.discardCard(this.card1, false);
        });
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9

        it('should raise the onCardsDiscarded event', function() {
            expect(this.gameSpy.raiseSimultaneousEvent).toHaveBeenCalledWith([this.card1], jasmine.objectContaining({ eventName: 'onCardsDiscarded' }));
        });
    });
});
