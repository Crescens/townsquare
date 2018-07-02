const DrawCard = require('../../../drawcard.js');

class TravisMoone extends DrawCard{
    setupCardAbilities(ability) {
        this.action({
            title: 'Draw new starting hand',
            limit: ability.limit.perPhase(1),
            handler: context => {
                context.player.hand.each(card => context.player.moveCard(card, 'draw deck')); 
            }
        });
    }
}


TravisMoone.code = '01049';

module.exports = TravisMoone;
