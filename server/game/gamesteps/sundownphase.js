const _ = require('underscore');
const Phase = require('./phase.js');
const SimpleStep = require('./simplestep.js');
const ReadyPrompt = require('./readyprompt.js');

class SundownPhase extends Phase {
    constructor(game) {
        super(game, 'sundown');
        this.initialise([
            new SimpleStep(game, () => this.unbootCards()),
            new SimpleStep(game, () => this.checkWinCondition()),
            new ReadyPrompt(game, 'sundown')
        ]);
    }

    checkWinCondition() {
        const potentialWinner = [];
        let numberOfPlayers = [];
        _.each(this.game.getPlayers(), player => {
            numberOfPlayers.push(player.name);
        }
        );
        
        if( numberOfPlayers.length === 1 ){
            return this.game.addMessage('Victory check is skipped in one player mode');
        }

        _.each(this.game.getPlayers(), player => {
            let opponents = _.reject(this.game.getPlayers(), activePlayer => activePlayer === player);
            if (_.every(opponents, opponent => opponent.getTotalInfluence() < player.getTotalControl())){
                potentialWinner.push(player);
            }


        }
        );
        if (potentialWinner.length === 1) {
            this.game.recordWinner(potentialWinner[0], 'Control points greater than influence');
        }
        
    }
                 

    unbootCards() { 
        _.each(this.game.getPlayers(), player => {
              player.cardsInPlay.each(card => {
              player.unbootCard(card);
            });
        });
    }
    
    resetPlayerStatus() {
        _.each(this.game.getPlayers(), player => {
            player.resetForRound();
        });
    }

}

module.exports = SundownPhase;
