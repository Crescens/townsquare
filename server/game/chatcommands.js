const _ = require('underscore');

class ChatCommands {
    constructor(game) {
        this.game = game;
        this.commands = {
            '/draw': this.draw,
            '/drawhand': this.drawhand,
            '/discard': this.discard,

            '/discarddraw': this.discardDrawHand,
            '/dd': this.discardDrawHand,

            '/revealdraw': this.revealDrawHand,
            '/rd': this.revealDrawHand,

            '/control': this.control,
            '/influence': this.influence,

            '/token': this.generateToken,

            '/counter': this.setCounter,

            '/add-keyword': this.addKeyword,
            '/remove-keyword': this.removeKeyword,
            
            '/cancel-prompt': this.cancelPrompt,
            '/disconnectme': this.disconnectMe,

            '/give-control': this.giveControl

            //'/kill': this.kill,
            //'/blank': this.blank,
            //'/unblank': this.unblank,
            //'/add-trait': this.addTrait,
            //'/remove-trait': this.removeTrait,

            //'/pillage': this.pillage,

            //'/str': this.strength,
            //'/give-icon': this.addIcon,
            //'/add-icon': this.addIcon,
            //'/take-icon': this.removeIcon,
            //'/remove-icon': this.removeIcon,

            //'/reset-challenges-count': this.resetChallengeCount,

        };
        this.tokens = [
            'control',
            'influence',
            'ghostrock',
            'bounty'
        ];
    }

    executeCommand(player, command, args) {
        if(!player || !this.commands[command]) {
            return false;
        }

        return this.commands[command].call(this, player, args) !== false;
    }

    revealDrawHand(player) {
        player.revealDrawHand();
    }

    generateToken(player, args) {
        player.generateToken(args[1]);
    }

    draw(player, args) {
        var num = this.getNumberOrDefault(args[1], 1);

        this.game.addMessage('{0} uses the /draw command to draw {1} cards to their hand', player, num);

        player.drawCardsToHand('hand', num);
    }

    drawhand(player, args) {
        var num = this.getNumberOrDefault(args[1], 1);

        this.game.addMessage('{0} uses the /drawhand command to draw {1} cards to their draw hand', player, num);

        player.drawCardsToHand('draw hand', num);
    }

    discardDrawHand(player) {
        player.discardDrawHand();
    }

    control(player, args) {
        var num = this.getNumberOrDefault(args[1], 1);
        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a card to set control for',
            waitingPromptTitle: 'Waiting for opponent to set control',
            cardCondition: card => card.location === 'play area' && card.controller === player,
            onSelect: (i, card) => {
                let control = num - card.control;
                card.control += control;

                if(card.control < 0) {
                    card.control = 0;
                }

                this.game.addMessage('{0} uses the /control command to set the control of {1} to {2}', i, card, num);
                return true;
            }
        });
    }

    influence(player, args) {
        var num = this.getNumberOrDefault(args[1], 1);
        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a card to set influence for',
            waitingPromptTitle: 'Waiting for opponent to set influence',
            cardCondition: card => card.location === 'play area' && card.controller === player,
            onSelect: (i, card) => {
                let influence = num - card.influence;
                card.influence += influence;

                if(card.influence < 0) {
                    card.influence = 0;
                }

                this.game.addMessage('{0} uses the /influence command to set the influence of {1} to {2}', i, card, num);
                return true;
            }
        });
    }

    bounty(player, args) {
        var num = this.getNumberOrDefault(args[1], 1);
        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a card to set bounty for',
            waitingPromptTitle: 'Waiting for opponent to set bounty',
            cardCondition: card => card.location === 'play area' && card.controller === player,
            onSelect: (i, card) => {

                if(card.bounty === null) {
                    card.bounty = 0;
                }

                let bounty = num - card.bounty;
                card.bounty += bounty;

                if(card.bounty < 0) {
                    card.bounty = 0;
                }

                this.game.addMessage('{0} uses the /bounty command to set the bounty of {1} to {2}', i, card, num);
                return true;
            }
        });
    }

    ace(player) {
        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a card',
            waitingPromptTitle: 'Waiting for opponent to ace card',
            cardCondition: card => card.location === 'play area' && card.controller === player,
            gameAction: 'ace',
            onSelect: (p, card) => {
                card.controller.ace(card);

                this.game.addMessage('{0} uses the /kill command to kill {1}', p, card);
                return true;
            }
        });
    }

    blank(player) {
        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a card',
            waitingPromptTitle: 'Waiting for opponent to blank card',
            cardCondition: card => card.location === 'play area' && card.controller === player,
            onSelect: (p, card) => {
                card.setBlank();

                this.game.addMessage('{0} uses the /blank command to blank {1}', p, card);
                return true;
            }
        });
    }

    unblank(player) {
        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a card',
            waitingPromptTitle: 'Waiting for opponent to unblank card',
            cardCondition: card => card.location === 'play area' && card.controller === player,
            onSelect: (p, card) => {
                card.clearBlank();

                this.game.addMessage('{0} uses the /unblank command to remove the blank condition from {1}', p, card);
                return true;
            }
        });
    }

    addTrait(player, args) {
        var trait = args[1];

        if(!trait) {
            return false;
        }

        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a card',
            waitingPromptTitle: 'Waiting for opponent to add trait to card',
            cardCondition: card => card.location === 'play area' && card.controller === player,
            onSelect: (p, card) => {
                card.addTrait(trait);

                this.game.addMessage('{0} uses the /add-trait command to add the {1} trait to {2}', p, trait, card);
                return true;
            }
        });
    }

    removeTrait(player, args) {
        var trait = args[1];
        if(!trait) {
            return false;
        }

        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a card',
            waitingPromptTitle: 'Waiting for opponent to remove trait remove card',
            cardCondition: card => card.location === 'play area' && card.controller === player,
            onSelect: (p, card) => {
                card.removeTrait(trait);

                this.game.addMessage('{0} uses the /remove-trait command to remove the {1} trait from {2}', p, trait, card);
                return true;
            }
        });
    }

    addKeyword(player, args) {
        var keyword = args[1];
        if(!keyword) {
            return false;
        }

        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a card',
            waitingPromptTitle: 'Waiting for opponent to add keyword to card',
            cardCondition: card => card.location === 'play area' && card.controller === player,
            onSelect: (p, card) => {
                card.addKeyword(keyword);

                this.game.addMessage('{0} uses the /add-keyword command to add the {1} keyword to {2}', p, keyword, card);
                return true;
            }
        });
    }

    removeKeyword(player, args) {
        var keyword = args[1];
        if(!keyword) {
            return false;
        }

        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a card',
            waitingPromptTitle: 'Waiting for opponent to add keyword to card',
            cardCondition: card => card.location === 'play area' && card.controller === player,
            onSelect: (p, card) => {
                card.removeKeyword(keyword);

                this.game.addMessage('{0} uses the /remove-keyword command to remove the {1} keyword from {2}', p, keyword, card);
                return true;
            }
        });
    }

    discard(player, args) {
        var num = this.getNumberOrDefault(args[1], 1);

        this.game.addMessage('{0} uses the /discard command to discard {1} card{2} at random', player, num, num > 1 ? 's' : '');

        player.discardAtRandom(num);
    }

    pillage(player) {
        this.game.addMessage('{0} uses the /pillage command to discard 1 card from the top of their draw deck', player);

        player.discardFromDraw(1, discarded => {
            this.game.addMessage('{0} discards {1} due to Pillage', player, discarded);
        });
    }

    addIcon(player, args) {
        var icon = args[1];

        if(!this.isValidIcon(icon)) {
            return false;
        }

        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a character',
            waitingPromptTitle: 'Waiting for opponent to give icon',
            cardCondition: card => card.location === 'play area' && card.controller === player && card.getType() === 'character',
            onSelect: (p, card) => {
                card.addIcon(icon);
                this.game.addMessage('{0} uses the /give-icon command to give {1} a {2} icon', p, card, icon);

                return true;
            }
        });
    }

    removeIcon(player, args) {
        var icon = args[1];

        if(!this.isValidIcon(icon)) {
            return false;
        }

        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a character',
            waitingPromptTitle: 'Waiting for opponent to remove icon',
            cardCondition: card => card.location === 'play area' && card.controller === player && card.getType() === 'character',
            onSelect: (p, card) => {
                card.removeIcon(icon);
                this.game.addMessage('{0} uses the /take-icon command to remove a {1} icon from {2}', p, icon, card);

                return true;
            }
        });
    }

    giveControl(player) {
        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a character',
            waitingPromptTitle: 'Waiting for opponent to give control',
            cardCondition: card => ['play area', 'discard pile', 'boothill pile'].includes(card.location) && card.controller === player,
            onSelect: (p, card) => {
                var otherPlayer = this.game.getOtherPlayer(player);
                if(!otherPlayer) {
                    return true;
                }

                this.game.takeControl(otherPlayer, card);
                this.game.addMessage('{0} uses the /give-control command to pass control of {1} to {2}', p, card, otherPlayer);

                return true;
            }
        });
    }

    resetChallengeCount(player) {
        player.challenges.reset();
        this.game.addMessage('{0} uses /reset-challenges-count to reset the number of challenges performed', player);
    }

    cancelPrompt(player) {
        this.game.addMessage('{0} uses the /cancel-prompt to skip the current step.', player);
        this.game.pipeline.cancelStep();
    }

    setCounter(player, args) {
        var token = args[1];
        var num = this.getNumberOrDefault(args[2], 1);

        if(!this.isValidToken(token)) {
            return false;
        }

        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a card',
            waitingPromptTitle: 'Waiting for opponent to set token',
            cardCondition: card => (card.location === 'play area' || card.location === 'plot') && card.controller === player,
            onSelect: (p, card) => {
                var numTokens = card.tokens[token] || 0;

                card.addToken(token, num - numTokens);
                this.game.addMessage('{0} uses the /token command to set the {1} token count of {2} to {3}', p, token, card, num - numTokens);

                return true;
            }
        });
    }

    bestow(player, args) {
        var num = this.getNumberOrDefault(args[1], 1);

        if(player.gold < num) {
            return false;
        }

        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a card to bestow ' + num + ' gold',
            waitingPromptTitle: 'Waiting for opponent to bestow',
            cardCondition: card => card.location === 'play area' && card.controller === player,
            onSelect: (p, card) => {
                player.gold -= num;

                card.addToken('gold', num);
                this.game.addMessage('{0} uses the /bestow command to add {1} gold to {2}', p, num, card);

                return true;
            }
        });
    }

    disconnectMe(player) {
        player.socket.disconnect();
    }

    getNumberOrDefault(string, defaultNumber) {
        var num = parseInt(string);

        if(isNaN(num)) {
            num = defaultNumber;
        }

        if(num < 0) {
            num = defaultNumber;
        }

        return num;
    }

    isValidIcon(icon) {
        if(!icon) {
            return false;
        }

        var lowerIcon = icon.toLowerCase();

        return lowerIcon === 'military' || lowerIcon === 'intrigue' || lowerIcon === 'power';
    }

    isValidToken(token) {
        if(!token) {
            return false;
        }

        var lowerToken = token.toLowerCase();

        return _.contains(this.tokens, lowerToken);
    }
}

module.exports = ChatCommands;
