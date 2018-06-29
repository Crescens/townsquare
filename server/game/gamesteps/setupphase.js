const _ = require('underscore');
const Phase = require('./phase.js');
const SimpleStep = require('./simplestep.js');
const StartingPossePrompt = require('./setup/startingposseprompt.js');
const GrifterPrompt = require('./setup/grifterprompt.js');

class SetupPhase extends Phase {
    constructor(game) {
        super(game, 'setup');
        this.initialise([
            new SimpleStep(game, () => this.prepareDecks()),
            new SimpleStep(game, () => this.drawStartingPosse()),
            new StartingPossePrompt(game),
            new GrifterPrompt(game),
            new SimpleStep(game, () => this.startGame()),
            //new GrifterPrompt(game)
        ]);
    }

    prepareDecks() {
        this.game.raiseEvent('onDecksPrepared');
        _.each(this.game.getPlayers(), player => {
            if(player.legend) {
                player.legend.applyPersistentEffects();
            }
        });
        this.game.allCards.each(card => {
            card.applyAnyLocationPersistentEffects();
        });
    }

    drawStartingPosse() {
        _.each(this.game.getPlayers(), player => {
            player.drawCardsToHand('hand', player.startingPosse);
        });
    }

    startGame() {
        _.each(this.game.getPlayers(), player => {
            player.startGame();
        });
    }

    setupDone() {
        _.each(this.game.getPlayers(), p => {
            p.setupDone();
        });
    }
}

module.exports = SetupPhase;
