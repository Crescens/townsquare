const _ = require('underscore');
const Phase = require('./phase.js');
const SimpleStep = require('./simplestep.js');
const StartingPossePrompt = require('./setup/startingposseprompt.js');

class SetupPhase extends Phase {
    constructor(game) {
        super(game, 'setup');
        this.initialise([
            new SimpleStep(game, () => this.prepareDecks()),
<<<<<<< HEAD
            new SimpleStep(game, () => this.drawStartingPosse()),
            new StartingPossePrompt(game),
            new SimpleStep(game, () => this.startGame()),
            //Grift Prompt
            new SimpleStep(game, () => this.setupDone())
=======
            new SimpleStep(game, () => this.drawSetupHand()),
            new KeepOrMulliganPrompt(game),
            new SimpleStep(game, () => this.startGame()),
            new SetupCardsPrompt(game),
            new SimpleStep(game, () => this.setupDone()),
            new CheckAttachmentsPrompt(game),
            new SimpleStep(game, () => game.activatePersistentEffects())
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
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

<<<<<<< HEAD
    drawStartingPosse() {
        _.each(this.game.getPlayers(), player => {
            player.drawCardsToHand('hand', player.startingPosse);
=======
    drawSetupHand() {
        _.each(this.game.getPlayers(), player => {
            player.drawSetupHand();
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
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
