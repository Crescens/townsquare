const AllPlayerPrompt = require('../allplayerprompt.js');

class CheatingResolutionPrompt extends AllPlayerPrompt {
    completionCondition() {
        return this.done;
    }

    activePrompt() {
        return {
            menuTitle: 'Play Gamblin Phase',
            buttons: [
                { arg: 'selected', text: 'Done' }
            ]
        };
    }

    waitingPrompt() {
        return { menuTitle: 'Gamblin\'' };
    }

    onMenuCommand(player) {
        this.done = true;
        this.game.addMessage('{0} was born a gamblin\' Dude', player);
    }
}

module.exports = CheatingResolutionPrompt;
