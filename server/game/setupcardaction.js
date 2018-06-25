const BaseAbility = require('./baseability.js');
const Costs = require('./costs.js');

class SetupCardAction extends BaseAbility {
    constructor() {
        super({
            cost: [
                Costs.payPrintedGhostRockCost()
                //Costs.playLimited()
            ]
        });
        this.title = 'Setup';
    }

    meetsRequirements(context) {
        return (
            context.game.currentPhase === 'setup' &&
            context.player.hand.contains(context.source) &&
            context.source.getType() === 'dude' //&& other starting posse requirements
        );
    }

    executeHandler(context) {
        if(context.player.outfit) {
            context.player.putIntoPlay(context.source, 'setup', context.player.outfit.uuid);
        }
    }
}

module.exports = SetupCardAction;
