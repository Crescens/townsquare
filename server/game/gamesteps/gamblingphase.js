const _ = require('underscore');
const Phase = require('./phase.js');
const SimpleStep = require('./simplestep.js');
const CheatingResolutionPrompt = require('./gambling/cheatingresolutionprompt.js');

class GamblingPhase extends Phase {
    constructor(game) {
        super(game, 'gambling');
        this.initialise([
            //new SimpleStep(game, () => this.ante()),
            //new SimpleStep(game, () => this.drawAndCompareHands()),
            new CheatingResolutionPrompt(game)
        ]);
    }

    prepareDecks() {
        this.game.raiseEvent('onDecksPrepared');
        _.each(this.game.getPlayers(), player => {
            if(player.agenda) {
                player.agenda.applyPersistentEffects();
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

module.exports = GamblingPhase;
