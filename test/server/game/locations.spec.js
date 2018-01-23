/*global describe, it, beforeEach, expect, jasmine*/
/* eslint camelcase: 0, no-invalid-this: 0 */
const uuid = require('uuid');

const Game = require('../../../server/game/game.js');
const Player = require('../../../server/game/player.js');
const Spectator = require('../../../server/game/spectator.js');

describe('Game', function() {
    beforeEach(function() {
        this.gameRepository = jasmine.createSpyObj('gameRepository', ['save']);
        this.game = new Game('1', 'Test Game', { gameRepository: this.gameRepository });

        this.player1 = new Player('1', { username: 'Player 1', settings: {} }, true, this.game);
        this.spectator = new Spectator('3', { username: 'Spectator 1', settings: {} }, this.game);

        this.game.playersAndSpectators[this.player1.id] = this.player1;
        this.game.playersAndSpectators[this.spectator.id] = this.spectator;

        this.game.initialise();

        this.testCard1 = { uuid: uuid.v1(), title: 'test 1' };
        //this.card2 = jasmine.createSpyObj('card', ['allowGameAction']);
        this.handler = jasmine.createSpy('handler');
    });

    describe('getLocations()', function() {
        describe('immediately after game creation', function() {
            it('should not be empty', function() {
                expect(this.game.getLocations().length).not.toBe(0);
            });

            it('should contain an object townsquare', function() {
                console.log(this.game.locations);
                expect(this.game.locations).toContain(jasmine.objectContaining({key: 'townsquare'}));
            });
        });

        describe('after adding a location', function () {
            beforeEach(function () {
                this.game.addGameLocation(this.testCard1.key);
            });

            it('should have two objects', function () {
                expect(this.game.getLocations().length).toBe(2);
            });

            it('should contain the added card', function () {
                expect(this.game.getLocations()).toContain(jasmine.objectContaining({uuid: this.testCard1.uuid}));
            });
        });
    });

    describe('getLocationByID()', function() {
        describe('immediately after game creation', function() {
            it('should be able to return the townsquare', function() {
                expect(this.game.getLocationByID('townsquare')).not.toBe(null);
            });
        });
    });
});
