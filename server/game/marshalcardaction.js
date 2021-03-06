const BaseAbility = require('./baseability.js');
const Costs = require('./costs.js');

class MarshalCardAction extends BaseAbility {
    constructor() {
        super({
            cost: [
                Costs.payReduceableGhostRockCost('marshal')
                //Costs.playLimited()
            ]
        });
        this.title = 'Marshal';
    }

    meetsRequirements(context) {
        var {game, player, source} = context;

        return (
            game.currentPhase === 'marshal' &&
            source.canBeMarshaled() &&
            source.getType() !== 'event' &&
            player.isCardInPlayableLocation(source, 'marshal') &&
            player.canPutIntoPlay(source)
        );
    }

    executeHandler(context) {
        if(context.costs.isDupe) {
            context.game.addMessage('{0} duplicates {1} for free', context.player, context.source);
        } else {
            context.game.addMessage('{0} marshals {1} costing {2}', context.player, context.source, context.costs.ghostrock);
        }
        context.player.putIntoPlay(context.source, 'marshal');
    }

    isCardAbility() {
        return false;
    }
}

module.exports = MarshalCardAction;
