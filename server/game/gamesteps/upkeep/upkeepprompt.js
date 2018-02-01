const AllPlayerPrompt = require('../allplayerprompt.js');

class UpkeepPrompt extends AllPlayerPrompt {
    completionCondition(player) {
        return player.upkeepPaid;
    }

    activePrompt() {
        return {
            menuTitle: 'Discard Unwanted Cards with Upkeep',
            buttons: [
                { arg: 'selected', text: 'Done' }
            ]
        };
    }

    waitingPrompt() {
        return { menuTitle: 'Waiting for opponent to pay upkeep' };
    }

    onMenuCommand(player) {
        player.payUpkeep();
        this.game.addMessage('{0} has paid their upkeep', player);
    }
}

module.exports = UpkeepPrompt;
