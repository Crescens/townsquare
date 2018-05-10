const _ = require('underscore');
const Phase = require('./phase.js');
const SimpleStep = require('./simplestep.js');
const CheatingResolutionPrompt = require('./gambling/cheatingresolutionprompt.js');

class GamblingPhase extends Phase {
    constructor(game) {
        super(game, 'gambling');

        this.lowballPot = 0;

        this.initialise([
            //new SimpleStep(game, () => this.ante()),
            new SimpleStep(game, () => this.drawAndCompareHands()),
            new CheatingResolutionPrompt(game)
        ]);
    }

    ante() {
        _.each(this.game.getPlayers(), player => {
            player.ante();
            lowballPot++;
        });
    }

    drawAndCompareHands() {
        _.each(this.game.getPlayers(), player => {
            player.drawCardsToHand('draw hand', 5);
            player.revealDrawHand();
            //player.discardDrawHand();
        });
    }
}

module.exports = GamblingPhase;
