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
            new SimpleStep(game, () => this.ante()),
            new SimpleStep(game, () => this.drawHands()),
            new RevealDrawHandPrompt(game),
            new SimpleStep(game, () => this.revealHands()),
            new CheatingResolutionPrompt(game),
            new SimpleStep(game, () => this.compareHands()),
            new SimpleStep(game, () => this.discardCards())
        ]);
    }

    ante() {
        _.each(this.game.getPlayers(), player => {
            player.ante();
            this.lowballPot++;
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

    discardCards() {
        _.each(this.game.getPlayers(), player => {
            player.discardDrawHand();
        });
    }

    compareHands() {

        let winner = _.reduce(this.game.getPlayers(), (player, memo) => {

            if(player.getHandRank() < memo.getHandRank()) {
                return player;
            }
            
            return memo;
            
        });

        let firstPlayer = winner;

        this.game.addMessage('{0} is the winner and receives {1} GR', winner.name, this.lowballPot);

        _.each(this.game.getPlayers(), player => {
            player.firstPlayer = firstPlayer === player;
        });
        
        winner.winLowball(this.lowballPot);
    }
}

module.exports = GamblingPhase;
