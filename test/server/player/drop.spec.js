const _ = require('underscore');
const uuid = require('uuid');
const Player = require('../../../server/game/player.js');
const GameLocation = require ('../../../server/game/gamelocation.js');

describe('Player', () => {
    describe('drop()', function() {
        beforeEach(function() {
<<<<<<< HEAD
            this.gameSpy = jasmine.createSpyObj('game', ['getOtherPlayer', 'raiseEvent', 'raiseMergedEvent', 'playerDecked', 'addGameLocation']);
=======
            this.gameSpy = jasmine.createSpyObj('game', ['raiseEvent', 'playerDecked']);
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9

            this.player = new Player('1', { username: 'Player 1', settings: {} }, true, this.gameSpy);
            this.player.initialise();
            spyOn(this.player, 'discardCard');
            spyOn(this.player, 'putIntoPlay');

            this.gameSpy.playersAndSpectators = [];
            this.gameSpy.playersAndSpectators[this.player.name] = this.player;

<<<<<<< HEAD
            this.cardSpy = jasmine.createSpyObj('card', ['getType', 'leavesPlay', 'moveTo', 'updateGameLocation', 'playableLocation', 'putIntoPlay', 'isUnique', 'isAttachment']);
            this.cardSpy.uuid = uuid.v1();
=======
            this.cardSpy = jasmine.createSpyObj('card', ['getType', 'leavesPlay', 'moveTo']);
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
            this.cardSpy.controller = this.cardSpy.owner = this.player;
            this.cardSpy.getType.and.returnValue('character');
            this.cardSpy.attachments = _([]);
        });

<<<<<<< HEAD
        describe('dragging a card', function() {
=======
        describe('when no card is pased', function() {
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
            beforeEach(function() {
                this.dropSucceeded = this.player.drop(null, 'hand', 'draw deck');
            });

<<<<<<< HEAD
            describe('when the card is not in the hand', function() {
                beforeEach(function() {
                    this.cardsInPlay = this.player.cardsInPlay.size();
                    this.dropSucceeded = this.player.drop('', 'hand', 'play area');
                });

                it('should return false and not change the game state', function() {
                    expect(this.dropSucceeded).toBe(false);
                    expect(this.player.cardsInPlay.size()).toBe(this.cardsInPlay);
                    expect(this.player.hand.size()).toBe(1);
                });
=======
            it('should return false', function() {
                expect(this.dropSucceeded).toBe(false);
            });
        });

        describe('when dragging a card from hand to play area', function() {
            beforeEach(function() {
                this.player.hand.push(this.cardSpy);
                this.cardSpy.location = 'hand';
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
            });

            describe('when the card is a dude in hand', function() {
                beforeEach(function() {
                    this.cardSpy.getType.and.returnValue('dude');
                    this.outfit = uuid.v1();
                    this.location = new GameLocation(this.outfit, 0);

<<<<<<< HEAD
                    this.dropSucceeded = this.player.drop(this.cardSpy.uuid, 'hand', this.location.uuid);
=======
                    this.dropSucceeded = this.player.drop(this.cardSpy, 'hand', 'play area');
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
                });

                it('should return true and add the card to the play area', function() {
                    expect(this.dropSucceeded).toBe(true);
                    expect(this.player.putIntoPlay).toHaveBeenCalledWith(this.cardSpy, 'play', this.location.uuid);
                });
            });

            describe('when the card is in hand and a deed', function() {
                beforeEach(function() {
                    this.cardSpy.getType.and.returnValue('deed');
                    this.cardsInPlay = this.player.cardsInPlay.size();
                    this.locationsInPlay = this.player.locations.length;

<<<<<<< HEAD
                    this.dropSucceeded = this.player.drop(this.cardSpy.uuid, 'hand', 'street-left');
=======
                    this.dropSucceeded = this.player.drop(this.cardSpy, 'hand', 'play area');
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
                });

                it('should return true and add the card to the play area', function() {
                    expect(this.dropSucceeded).toBe(true);
                    expect(this.player.putIntoPlay).toHaveBeenCalledWith(this.cardSpy, 'play', 'street-left');
                });

                //These appear to not work because of some problem in the test
                // When dropping a deed, cardsInPlay and Locations are both
                // bigger in the client.
                xit('should be one more card in play', function () {
                    let oneMore = this.cardsInPlay + 1;
                    console.log(this.player.cardsInPlay);
                    expect(this.player.cardsInPlay.size()).toBe(oneMore);
                });

                xit('should be one more location in play', function () {
                    let oneMore = this.locationsInPlay + 1;
                    expect(this.player.locations.length).toBe(oneMore);
                });
            });

            describe('when the card is in hand and an action', function() {
                beforeEach(function() {
                    this.cardSpy.getType.and.returnValue('action');

                    this.dropSucceeded = this.player.drop(this.cardSpy, 'hand', 'play area');
                });

                xit('should return false and not add the card to the play area', function() {
                    expect(this.dropSucceeded).toBe(false);
                    expect(this.player.putIntoPlay).not.toHaveBeenCalled();
                });
            });

            /* Extend for spells/goods/gadgets
            describe('when the card is in hand and an attachment', function() {
                beforeEach(function() {
                    this.cardSpy.getType.and.returnValue('attachment');

                    this.dropSucceeded = this.player.drop(this.cardSpy, 'hand', 'play area');
                });

                it('should return true and play the card', function() {
                    expect(this.dropSucceeded).toBe(true);
                    expect(this.player.putIntoPlay).toHaveBeenCalledWith(this.cardSpy);
                });
            });*/
        });

        describe('when dragging a card from hand to the boothill pile', function() {
            beforeEach(function() {
                this.player.hand.push(this.cardSpy);
                this.cardSpy.location = 'hand';
            });

<<<<<<< HEAD
            describe('when the card is not in hand', function() {
                beforeEach(function() {
                    this.dropSucceeded = this.player.drop('', 'hand', 'boothill pile');
                });

                it('should return false and not update the game state', function() {
                    expect(this.dropSucceeded).toBe(false);
                    expect(this.player.boothillPile.size()).toBe(0);
                });
            });

            /* No special cases for Boot Hill, all types of cards can go there

=======
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
            describe('when the card is in hand and is a location', function() {
                beforeEach(function() {
                    this.cardSpy.getType.and.returnValue('location');

<<<<<<< HEAD
                    this.dropSucceeded = this.player.drop(this.cardSpy.uuid, 'hand', 'boothill pile');
=======
                    this.dropSucceeded = this.player.drop(this.cardSpy, 'hand', 'dead pile');
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
                });

                it('should return false and not update the game state', function() {
                    expect(this.dropSucceeded).toBe(false);
                    expect(this.player.boothillPile.size()).toBe(0);
                });
            });

            describe('when the card is in hand and is an attachment', function() {
                beforeEach(function() {
                    this.cardSpy.getType.and.returnValue('attachment');

<<<<<<< HEAD
                    this.dropSucceeded = this.player.drop(this.cardSpy.uuid, 'hand', 'boothill pile');
=======
                    this.dropSucceeded = this.player.drop(this.cardSpy, 'hand', 'dead pile');
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
                });

                it('should return false and not update the game state', function() {
                    expect(this.dropSucceeded).toBe(false);
                    expect(this.player.boothillPile.size()).toBe(0);
                });
            });

            describe('when the card is in hand and is an event', function() {
                beforeEach(function() {
                    this.cardSpy.getType.and.returnValue('event');

<<<<<<< HEAD
                    this.dropSucceeded = this.player.drop(this.cardSpy.uuid, 'hand', 'boothill pile');
=======
                    this.dropSucceeded = this.player.drop(this.cardSpy, 'hand', 'dead pile');
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
                });

                it('should return false and not update the game state', function() {
                    expect(this.dropSucceeded).toBe(false);
                    expect(this.player.boothillPile.size()).toBe(0);
                });
            });*/

            describe('when the card is in hand and is a dude', function() {
                beforeEach(function() {
                    this.cardSpy.getType.and.returnValue('dude');

<<<<<<< HEAD
                    this.dropSucceeded = this.player.drop(this.cardSpy.uuid, 'hand', 'boothill pile');
=======
                    this.dropSucceeded = this.player.drop(this.cardSpy, 'hand', 'dead pile');
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
                });

                it('should return true and put the dude in the boothill pile', function() {
                    expect(this.dropSucceeded).toBe(true);
                    expect(this.player.boothillPile.size()).toBe(1);
                });
            });
        });

        describe('when dragging a card from hand to the discard pile', function() {
            beforeEach(function() {
                this.player.hand.push(this.cardSpy);
                this.cardSpy.location = 'hand';
            });

<<<<<<< HEAD
            describe('when the card is not in hand', function() {
                beforeEach(function() {
                    this.dropSucceeded = this.player.drop('', 'hand', 'discard pile');
                });

                it('should return false and not update the game state', function() {
                    expect(this.dropSucceeded).toBe(false);
                    expect(this.player.discardPile.size()).toBe(0);
                });
            });

            describe('when the card is in hand and is a deed', function() {
=======
            describe('when the card is in hand and is a location', function() {
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
                beforeEach(function() {
                    this.cardSpy.getType.and.returnValue('deed');

                    this.dropSucceeded = this.player.drop(this.cardSpy, 'hand', 'discard pile');
                });

                it('should return true and update the game state', function() {
                    expect(this.dropSucceeded).toBe(true);
                    expect(this.player.discardCard).toHaveBeenCalled();
                });
            });

            describe('when the card is in hand and is an attachment', function() {
                beforeEach(function() {
                    this.cardSpy.getType.and.returnValue('attachment');

                    this.dropSucceeded = this.player.drop(this.cardSpy, 'hand', 'discard pile');
                });

                it('should return true and update the game state', function() {
                    expect(this.dropSucceeded).toBe(true);
                    expect(this.player.discardCard).toHaveBeenCalled();
                });
            });

            describe('when the card is in hand and is an event', function() {
                beforeEach(function() {
                    this.cardSpy.getType.and.returnValue('event');

                    this.dropSucceeded = this.player.drop(this.cardSpy, 'hand', 'discard pile');
                });

                it('should return true and update the game state', function() {
                    expect(this.dropSucceeded).toBe(true);
                    expect(this.player.discardCard).toHaveBeenCalled();
                });
            });

            describe('when the card is in hand and is a dude', function() {
                beforeEach(function() {
                    this.cardSpy.getType.and.returnValue('dude');

                    this.dropSucceeded = this.player.drop(this.cardSpy, 'hand', 'discard pile');
                });

                it('should return true and put the dude in the boothill pile', function() {
                    expect(this.dropSucceeded).toBe(true);
                    expect(this.player.discardCard).toHaveBeenCalled();
                });
            });
        });

        describe('when dragging a card from hand to the deck', function() {
            beforeEach(function() {
                this.player.hand.push(this.cardSpy);
                this.cardSpy.location = 'hand';
            });

            describe('when the card is in hand and is a location', function() {
                beforeEach(function() {
                    this.cardSpy.getType.and.returnValue('location');
                    this.dropSucceeded = this.player.drop(this.cardSpy, 'hand', 'draw deck');
                });

                it('should return true and put the card in the draw deck', function() {
                    expect(this.dropSucceeded).toBe(true);
                    expect(this.player.drawDeck.size()).toBe(1);
                });
            });

            describe('when the card is in hand and is an attachment', function() {
                beforeEach(function() {
                    this.cardSpy.getType.and.returnValue('attachment');
                    this.dropSucceeded = this.player.drop(this.cardSpy, 'hand', 'draw deck');
                });

                it('should return true and put the card in the draw deck', function() {
                    expect(this.dropSucceeded).toBe(true);
                    expect(this.player.drawDeck.size()).toBe(1);
                });
            });

            describe('when the card is in hand and is an event', function() {
                beforeEach(function() {
                    this.cardSpy.getType.and.returnValue('event');
                    this.dropSucceeded = this.player.drop(this.cardSpy, 'hand', 'draw deck');
                });

                it('should return true and put the card in the draw deck', function() {
                    expect(this.dropSucceeded).toBe(true);
                    expect(this.player.drawDeck.size()).toBe(1);
                });
            });

            describe('when the card is in hand and is a dude', function() {
                beforeEach(function() {
<<<<<<< HEAD
                    this.cardSpy.getType.and.returnValue('dude');
                    this.dropSucceeded = this.player.drop(this.cardSpy.uuid, 'hand', 'draw deck');
=======
                    this.cardSpy.getType.and.returnValue('character');
                    this.dropSucceeded = this.player.drop(this.cardSpy, 'hand', 'draw deck');
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
                });

                it('should return true and put the card in the draw deck', function() {
                    expect(this.dropSucceeded).toBe(true);
                    expect(this.player.drawDeck.size()).toBe(1);
                });
            });

            describe('when two cards are dragged to the draw deck', function() {
                beforeEach(function() {
<<<<<<< HEAD
                    this.cardSpy2 = jasmine.createSpyObj('card', ['getType', 'moveTo', 'updateGameLocation', 'playableLocation']);
                    this.cardSpy2.uuid = '2222';
=======
                    this.cardSpy2 = jasmine.createSpyObj('card', ['getType', 'moveTo']);
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
                    this.cardSpy2.controller = this.player;
                    this.cardSpy2.owner = this.player;
                    this.cardSpy2.getType.and.returnValue('event');
                    this.player.hand.push(this.cardSpy2);
                    this.cardSpy2.location = 'hand';

                    this.player.drop(this.cardSpy, 'hand', 'draw deck');
                    this.dropSucceeded = this.player.drop(this.cardSpy2, 'hand', 'draw deck');
                });

                it('should put the cards in the draw deck in the correct order', function() {
                    expect(this.dropSucceeded).toBe(true);
                    expect(this.player.drawDeck.first(2)).toEqual([this.cardSpy2, this.cardSpy]);
                });
            });
        });

        describe('when dragging a card from the play area to the discard pile', function() {
            beforeEach(function() {
                this.player.cardsInPlay.push(this.cardSpy);
                this.cardSpy.location = 'play area';
            });

<<<<<<< HEAD
            describe('when the card is not in play', function() {
                beforeEach(function() {
                    this.cardsInPlay = this.player.cardsInPlay.size();
                    this.dropSucceeded = this.player.drop('', 'play area', 'discard pile');
                });

                it('should return false and not update the game state', function() {
                    expect(this.dropSucceeded).toBe(false);
                    expect(this.player.cardsInPlay.size()).toBe(this.cardsInPlay); //Outfit
                });
            });

=======
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
            describe('when the card is in play', function() {
                beforeEach(function() {
                    this.dropSucceeded = this.player.drop(this.cardSpy, 'play area', 'discard pile');
                });

                it('should return true and put the card in the discard pile', function() {
                    expect(this.dropSucceeded).toBe(true);
                    expect(this.player.discardCard).toHaveBeenCalled();
                });
            });
        });

        describe('when dragging a card between game locations', function() {
            beforeEach(function () {

                this.player.cardsInPlay.push(this.cardSpy);

                this.cardSpy.location = 'play area';
                this.cardSpy.gamelocation = uuid.v1();

                var gamelocation = uuid.v1();
                this.gameSpy.addGameLocation(gamelocation);
            });

            it('should return false if the card is a deed', function() {

            });
        });

        /* Avoid Kill Character function for now

        describe('event order', function() {
            beforeEach(function() {
                this.player.cardsInPlay.push(this.cardSpy);
                this.cardSpy.location = 'play area';
                this.cardSpy.getType.and.returnValue('character');
            });

            it('should rely on killCharacter to maintain event order', function() {
                spyOn(this.player, 'killCharacter');

<<<<<<< HEAD
                var result = this.player.drop(this.cardSpy.uuid, 'play area', 'boothill pile');
=======
                let result = this.player.drop(this.cardSpy, 'play area', 'dead pile');
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
                expect(result).toBe(true);
                expect(this.player.killCharacter).toHaveBeenCalledWith(this.cardSpy, false);
            });
        });*/
    });
});
