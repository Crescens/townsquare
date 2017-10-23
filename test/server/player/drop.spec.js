/* global describe, it, beforeEach, expect, jasmine, spyOn */
/* eslint camelcase: 0, no-invalid-this: 0 */

const _ = require('underscore');
const uuid = require('uuid');
const Player = require('../../../server/game/player.js');

describe('Player', () => {
    describe('drop()', function() {
        beforeEach(function() {
            this.gameSpy = jasmine.createSpyObj('game', ['getOtherPlayer', 'raiseEvent', 'raiseMergedEvent', 'playerDecked']);

            this.player = new Player('1', 'Player 1', true, this.gameSpy);
            this.player.initialise();
            spyOn(this.player, 'discardCard');
            spyOn(this.player, 'putIntoPlay');

            this.gameSpy.playersAndSpectators = [];
            this.gameSpy.playersAndSpectators[this.player.name] = this.player;

            this.cardSpy = jasmine.createSpyObj('card', ['getType', 'leavesPlay', 'moveTo']);
            this.cardSpy.uuid = '1111';
            this.cardSpy.controller = this.cardSpy.owner = this.player;
            this.cardSpy.attachments = _([]);
        });

        describe('when dragging a card from hand to play area', function() {
            beforeEach(function() {
                this.player.hand.push(this.cardSpy);
                this.cardSpy.location = 'hand';
            });

            describe('when the card is not in the hand', function() {
                beforeEach(function() {
                    this.dropSucceeded = this.player.drop('', 'hand', 'play area');
                });

                it('should return false and not change the game state', function() {
                    expect(this.dropSucceeded).toBe(false);
                    expect(this.player.cardsInPlay.size()).toBe(0);
                    expect(this.player.hand.size()).toBe(1);
                });
            });

            describe('when the card is in hand and a dude', function() {
                beforeEach(function() {
                    this.cardSpy.getType.and.returnValue('dude');

                    this.dropSucceeded = this.player.drop(this.cardSpy.uuid, 'hand', 'play area');
                });

                it('should return true and add the card to the play area', function() {
                    expect(this.dropSucceeded).toBe(true);
                    expect(this.player.putIntoPlay).toHaveBeenCalledWith(this.cardSpy);
                });
            });

            describe('when the card is in hand and a location', function() {
                beforeEach(function() {
                    this.cardSpy.getType.and.returnValue('location');

                    this.dropSucceeded = this.player.drop(this.cardSpy.uuid, 'hand', 'play area');
                });

                it('should return true and add the card to the play area', function() {
                    expect(this.dropSucceeded).toBe(true);
                    expect(this.player.putIntoPlay).toHaveBeenCalledWith(this.cardSpy);
                });
            });

            describe('when the card is in hand and an action', function() {
                beforeEach(function() {
                    this.cardSpy.getType.and.returnValue('action');

                    this.dropSucceeded = this.player.drop(this.cardSpy.uuid, 'hand', 'play area');
                });

                it('should return false and not add the card to the play area', function() {
                    expect(this.dropSucceeded).toBe(false);
                    expect(this.player.putIntoPlay).not.toHaveBeenCalled();
                });
            });

            /* Extend for spells/goods/gadgets
            describe('when the card is in hand and an attachment', function() {
                beforeEach(function() {
                    this.cardSpy.getType.and.returnValue('attachment');

                    this.dropSucceeded = this.player.drop(this.cardSpy.uuid, 'hand', 'play area');
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

            describe('when the card is in hand and is a location', function() {
                beforeEach(function() {
                    this.cardSpy.getType.and.returnValue('location');

                    this.dropSucceeded = this.player.drop(this.cardSpy.uuid, 'hand', 'boothill pile');
                });

                it('should return false and not update the game state', function() {
                    expect(this.dropSucceeded).toBe(false);
                    expect(this.player.boothillPile.size()).toBe(0);
                });
            });

            describe('when the card is in hand and is an attachment', function() {
                beforeEach(function() {
                    this.cardSpy.getType.and.returnValue('attachment');

                    this.dropSucceeded = this.player.drop(this.cardSpy.uuid, 'hand', 'boothill pile');
                });

                it('should return false and not update the game state', function() {
                    expect(this.dropSucceeded).toBe(false);
                    expect(this.player.boothillPile.size()).toBe(0);
                });
            });

            describe('when the card is in hand and is an event', function() {
                beforeEach(function() {
                    this.cardSpy.getType.and.returnValue('event');

                    this.dropSucceeded = this.player.drop(this.cardSpy.uuid, 'hand', 'boothill pile');
                });

                it('should return false and not update the game state', function() {
                    expect(this.dropSucceeded).toBe(false);
                    expect(this.player.boothillPile.size()).toBe(0);
                });
            });*/

            describe('when the card is in hand and is a dude', function() {
                beforeEach(function() {
                    this.cardSpy.getType.and.returnValue('dude');

                    this.dropSucceeded = this.player.drop(this.cardSpy.uuid, 'hand', 'boothill pile');
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

            describe('when the card is not in hand', function() {
                beforeEach(function() {
                    this.dropSucceeded = this.player.drop('', 'hand', 'discard pile');
                });

                it('should return false and not update the game state', function() {
                    expect(this.dropSucceeded).toBe(false);
                    expect(this.player.discardPile.size()).toBe(0);
                });
            });

            describe('when the card is in hand and is a location', function() {
                beforeEach(function() {
                    this.cardSpy.getType.and.returnValue('location');

                    this.dropSucceeded = this.player.drop(this.cardSpy.uuid, 'hand', 'discard pile');
                });

                it('should return true and update the game state', function() {
                    expect(this.dropSucceeded).toBe(true);
                    expect(this.player.discardCard).toHaveBeenCalled();
                });
            });

            describe('when the card is in hand and is an attachment', function() {
                beforeEach(function() {
                    this.cardSpy.getType.and.returnValue('attachment');

                    this.dropSucceeded = this.player.drop(this.cardSpy.uuid, 'hand', 'discard pile');
                });

                it('should return true and update the game state', function() {
                    expect(this.dropSucceeded).toBe(true);
                    expect(this.player.discardCard).toHaveBeenCalled();
                });
            });

            describe('when the card is in hand and is an event', function() {
                beforeEach(function() {
                    this.cardSpy.getType.and.returnValue('event');

                    this.dropSucceeded = this.player.drop(this.cardSpy.uuid, 'hand', 'discard pile');
                });

                it('should return true and update the game state', function() {
                    expect(this.dropSucceeded).toBe(true);
                    expect(this.player.discardCard).toHaveBeenCalled();
                });
            });

            describe('when the card is in hand and is a dude', function() {
                beforeEach(function() {
                    this.cardSpy.getType.and.returnValue('dude');

                    this.dropSucceeded = this.player.drop(this.cardSpy.uuid, 'hand', 'discard pile');
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

            describe('when the card is not in hand', function() {
                beforeEach(function() {
                    this.dropSucceeded = this.player.drop('', 'hand', 'draw deck');
                });

                it('should return false and not update the game state', function() {
                    expect(this.dropSucceeded).toBe(false);
                    expect(this.player.drawDeck.size()).toBe(0);
                });
            });

            describe('when the card is in hand and is a location', function() {
                beforeEach(function() {
                    this.cardSpy.getType.and.returnValue('location');
                    this.dropSucceeded = this.player.drop(this.cardSpy.uuid, 'hand', 'draw deck');
                });

                it('should return true and put the card in the draw deck', function() {
                    expect(this.dropSucceeded).toBe(true);
                    expect(this.player.drawDeck.size()).toBe(1);
                });
            });

            describe('when the card is in hand and is an attachment', function() {
                beforeEach(function() {
                    this.cardSpy.getType.and.returnValue('attachment');
                    this.dropSucceeded = this.player.drop(this.cardSpy.uuid, 'hand', 'draw deck');
                });

                it('should return true and put the card in the draw deck', function() {
                    expect(this.dropSucceeded).toBe(true);
                    expect(this.player.drawDeck.size()).toBe(1);
                });
            });

            describe('when the card is in hand and is an event', function() {
                beforeEach(function() {
                    this.cardSpy.getType.and.returnValue('event');
                    this.dropSucceeded = this.player.drop(this.cardSpy.uuid, 'hand', 'draw deck');
                });

                it('should return true and put the card in the draw deck', function() {
                    expect(this.dropSucceeded).toBe(true);
                    expect(this.player.drawDeck.size()).toBe(1);
                });
            });

            describe('when the card is in hand and is a dude', function() {
                beforeEach(function() {
                    this.cardSpy.getType.and.returnValue('dude');
                    this.dropSucceeded = this.player.drop(this.cardSpy.uuid, 'hand', 'draw deck');
                });

                it('should return true and put the card in the draw deck', function() {
                    expect(this.dropSucceeded).toBe(true);
                    expect(this.player.drawDeck.size()).toBe(1);
                });
            });

            describe('when two cards are dragged to the draw deck', function() {
                beforeEach(function() {
                    this.cardSpy2 = jasmine.createSpyObj('card', ['getType', 'moveTo']);
                    this.cardSpy2.uuid = '2222';
                    this.cardSpy2.controller = this.player;
                    this.player.hand.push(this.cardSpy2);
                    this.cardSpy2.location = 'hand';

                    this.player.drop(this.cardSpy.uuid, 'hand', 'draw deck');
                    this.dropSucceeded = this.player.drop(this.cardSpy2.uuid, 'hand', 'draw deck');
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

            describe('when the card is not in play', function() {
                beforeEach(function() {
                    this.dropSucceeded = this.player.drop('', 'play area', 'discard pile');
                });

                it('should return false and not update the game state', function() {
                    expect(this.dropSucceeded).toBe(false);
                    expect(this.player.cardsInPlay.size()).toBe(1);
                });
            });

            describe('when the card is in play', function() {
                beforeEach(function() {
                    this.dropSucceeded = this.player.drop(this.cardSpy.uuid, 'play area', 'discard pile');
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

                var result = this.player.drop(this.cardSpy.uuid, 'play area', 'boothill pile');
                expect(result).toBe(true);
                expect(this.player.killCharacter).toHaveBeenCalledWith(this.cardSpy, false);
            });
        });*/
    });
});
