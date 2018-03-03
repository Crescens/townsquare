const Game = require('../../../server/game/game.js');
const Spectator = require('../../../server/game/spectator.js');

describe('Game', function() {
    beforeEach(function() {
        this.gameService = jasmine.createSpyObj('gameService', ['save']);
        this.game = new Game({ owner: {} }, { gameService: this.gameService });

        this.player = jasmine.createSpyObj('player', ['']);
        this.player.name = 'Player 1';

        this.game.playersAndSpectators[this.player.name] = this.player;

        this.chatCommands = this.game.chatCommands;
        this.gameChat = this.game.gameChat;
        spyOn(this.chatCommands, 'executeCommand').and.returnValue(false);
        spyOn(this.gameChat, 'addChatMessage');
    });

    describe('chat()', function() {
        describe('when called by a player not in the game', function() {
            it('should not add any chat messages', function() {
                this.game.chat('notinthegame', 'Test Message');

                expect(this.gameChat.addChatMessage).not.toHaveBeenCalled();
            });
        });

        describe('when called by a player in the game', function() {
            describe('and the message is a command', function() {
                beforeEach(function() {
<<<<<<< HEAD
                    spyOn(this.player1, 'drawCardsToHand');
                });

                describe('with no arguments', function() {
                    it('should draw 1 card', function () {
                        this.game.chat(this.player1.name, '/draw');

                        expect(this.game.messages.length).toBe(1);
                        expect(this.player1.drawCardsToHand).toHaveBeenCalledWith('hand', 1);
                    });
                });

                describe('with a string argument', function() {
                    it('should draw 1 card', function () {
                        this.game.chat(this.player1.name, '/draw test');

                        expect(this.game.messages.length).toBe(1);
                        expect(this.player1.drawCardsToHand).toHaveBeenCalledWith('hand', 1);
                    });
                });

                describe('with a negative argument', function() {
                    it('should draw 1 card', function () {
                        this.game.chat(this.player1.name, '/draw -1');

                        expect(this.game.messages.length).toBe(1);
                        expect(this.player1.drawCardsToHand).toHaveBeenCalledWith('hand', 1);
                    });
                });

                describe('with a valid argument', function() {
                    it('should draw 4 cards', function () {
                        this.game.chat(this.player1.name, '/draw 4');

                        expect(this.game.messages.length).toBe(1);
                        expect(this.player1.drawCardsToHand).toHaveBeenCalledWith('hand', 4);
                    });
=======
                    this.chatCommands.executeCommand.and.returnValue(true);

                    this.game.chat(this.player.name, '/this is a command');
                });

                it('should execute the command', function() {
                    expect(this.chatCommands.executeCommand).toHaveBeenCalledWith(this.player, '/this', ['/this', 'is', 'a', 'command']);
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
                });

                it('should not add any chat messages', function() {
                    expect(this.gameChat.addChatMessage).not.toHaveBeenCalled();
                });
            });

<<<<<<< HEAD
            describe('with a /drawhand command', function() {
                beforeEach(function() {
                    spyOn(this.player1, 'drawCardsToHand');
                });

                describe('with no arguments', function() {
                    it('should draw 1 card to draw hand', function () {
                        this.game.chat(this.player1.name, '/drawhand');

                        expect(this.game.messages.length).toBe(1);
                        expect(this.player1.drawCardsToHand).toHaveBeenCalledWith('draw hand', 1);
                    });
                });

                describe('with a string argument', function() {
                    it('should draw 1 card to draw hand', function () {
                        this.game.chat(this.player1.name, '/drawhand test');

                        expect(this.game.messages.length).toBe(1);
                        expect(this.player1.drawCardsToHand).toHaveBeenCalledWith('draw hand', 1);
                    });
                });

                describe('with a negative argument', function() {
                    it('should draw 1 card to draw hand', function () {
                        this.game.chat(this.player1.name, '/drawhand -1');

                        expect(this.game.messages.length).toBe(1);
                        expect(this.player1.drawCardsToHand).toHaveBeenCalledWith('draw hand', 1);
                    });
                });

                describe('with a valid argument', function() {
                    it('should draw 4 cards to draw hand', function () {
                        this.game.chat(this.player1.name, '/drawhand 4');

                        expect(this.game.messages.length).toBe(1);
                        expect(this.player1.drawCardsToHand).toHaveBeenCalledWith('draw hand', 4);
                    });
                });

                describe('half way through a message', function() {
                    it('should not trigger the /drawhand command', function() {
                        this.game.chat(this.player1.name, 'test test /drawhand test');

                        expect(this.player1.drawCardsToHand).not.toHaveBeenCalled();
                    });
                });
            });

            describe('with a /discard command', function() {
=======
            describe('and the message is a not a valid command', function() {
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
                beforeEach(function() {
                    this.chatCommands.executeCommand.and.returnValue(false);

                    this.game.chat(this.player.name, 'this is a message');
                });

                it('should add the chat messages', function() {
                    expect(this.gameChat.addChatMessage).toHaveBeenCalledWith(jasmine.any(String), this.player, 'this is a message');
                });
            });
        });

        describe('when called by a spectator in the game', function() {
            beforeEach(function() {
                this.player.constructor = Spectator;
            });

            describe('and the message is a command', function() {
                beforeEach(function() {
                    this.chatCommands.executeCommand.and.returnValue(true);

                    this.game.chat(this.player.name, '/this is a command');
                });

                it('should not execute the command', function() {
                    expect(this.chatCommands.executeCommand).not.toHaveBeenCalled();
                });

                it('should add it as a chat messages', function() {
                    expect(this.gameChat.addChatMessage).toHaveBeenCalledWith(jasmine.any(String), this.player, '/this is a command');
                });
            });

            describe('and the message is a not a valid command', function() {
                beforeEach(function() {
                    this.chatCommands.executeCommand.and.returnValue(false);

                    this.game.chat(this.player.name, 'this is a message');
                });

                it('should add the chat messages', function() {
                    expect(this.gameChat.addChatMessage).toHaveBeenCalledWith(jasmine.any(String), this.player, 'this is a message');
                });
            });
        });
    });
});
