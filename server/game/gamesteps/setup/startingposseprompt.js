const AllPlayerPrompt = require('../allplayerprompt.js');

class StartingPossePrompt extends AllPlayerPrompt {
    completionCondition(player) {
        return player.possewrangled;
    }

    activePrompt() {
        return {
            menuTitle: 'Select Starting Posse',
            buttons: [
                { arg: 'selected', text: 'Done' }
            ]
        };
    }

    waitingPrompt() {
        return { menuTitle: 'Waiting for opponent to select starting posse' };
    }

    onMenuCommand(player) {
        player.startPosse();
        this.game.addMessage('{0} has wrangled their starting posse', player);
    }
}

module.exports = StartingPossePrompt;
