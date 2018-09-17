const _ = require('underscore');

const DrawCard = require('./drawcard.js');

class DudeCard extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Call Out',
            condition: () => this.game.currentPhase === 'high noon',
            target: {
                activePromptTitle: 'Select dude to call out',
                cardCondition: card => card.getType() === 'dude' && card.gamelocation === this.gamelocation
            },
            targetController: 'opponent',
            handler: context => {
                //this.game.killCharacter(context.target);
                this.game.addMessage('{0} uses {1} to call out {2}', context.player, this.title, context.target.title);
            }
        });
    }
}

module.exports = DudeCard;
