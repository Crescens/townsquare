//const _ = require('underscore');
const Phase = require('./phase.js');
const SimpleStep = require('./simplestep.js');
const ReadyPrompt = require('./readyprompt.js');

class HighNoonPhase extends Phase {
    constructor(game) {
        super(game, 'high noon');
        this.initialise([
            new SimpleStep(game, () => this.receiveProduction()),
            new SimpleStep(game, () => this.payUpkeep()),
            new ReadyPrompt(game, 'high noon')
        ]);
    }

    receiveProduction() {

    }

    payUpkeep() {

    }

    /*
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
    }*/
}

module.exports = HighNoonPhase;
