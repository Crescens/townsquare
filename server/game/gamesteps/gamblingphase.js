const _ = require('underscore');
const Phase = require('./phase.js');
const SimpleStep = require('./simplestep.js');
const CheatingResolutionPrompt = require('./gambling/cheatingresolutionprompt.js');
const RevealDrawHandPrompt = require('./gambling/revealdrawhandprompt.js');

class GamblingPhase extends Phase {
    constructor(game) {
        super(game, 'gambling');

        this.lowballPot = 0;

        this.initialise([
            //new SimpleStep(game, () => this.ante()),
            new SimpleStep(game, () => this.drawHands()),
            //new RevealDrawHandPrompt(game), //Throwing exceptions?
            new SimpleStep(game, () => this.revealHands()),
            new CheatingResolutionPrompt(game)
        ]);
    }

    ante() {
        _.each(this.game.getPlayers(), player => {
            player.ante();
            lowballPot++;
        });
    }

    drawHands() {
        _.each(this.game.getPlayers(), player => {
            player.drawCardsToHand('draw hand', 5);
        });
    }

    revealHands() {
        _.each(this.game.getPlayers(), player => {
            player.revealDrawHand();
        });
    }
}

module.exports = GamblingPhase;
