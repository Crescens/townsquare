/*global describe, it, beforeEach, expect, jasmine*/
/* eslint camelcase: 0, no-invalid-this: 0 */

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

        this.card1 = jasmine.createSpyObj('card', ['allowGameAction']);
        this.card2 = jasmine.createSpyObj('card', ['allowGameAction']);
        this.handler = jasmine.createSpy('handler');
    });

    describe('getLocations()', function() {
        describe('immediately after game creation', function() {
            it('should not be empty', function() {
                expect(this.game.getLocations().length).not.toBe(0);
                expect(this.game.locations).toContain(jasmine.objectContaining({represents: 'townsquare'}));
            });
        });
    });
});
