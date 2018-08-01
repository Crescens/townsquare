const DrawCard = require('../../../drawcard.js');

class TravisMoone extends DrawCard{
    setupCardAbilities(ability) {
        this.action({
            title: 'Discard cards and draw new starting hand',
            limit: ability.limit.perPhase(1),
            handler: context => {
                context.player.bootCard(this);
                context.player.hand.each(card => context.player.moveCard(card, 'draw deck')); 
                context.player.shuffleDrawDeck();
                context.player.drawCardsToHand('hand', 5);
                context.player.game.addMessage(`${context.player.name} used ${this.title} ability to draw new starting hand`);
            }
        });
    }
}


TravisMoone.code = '01049';

module.exports = TravisMoone;
