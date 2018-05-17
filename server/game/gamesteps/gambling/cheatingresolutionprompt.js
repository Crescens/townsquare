const AllPlayerPrompt = require('../allplayerprompt.js');

class CheatingResolutionPrompt extends AllPlayerPrompt {
    completionCondition() {
        return this.done;
    }

    activePrompt() {
        return {
            menuTitle: 'Play Cheatin\' Resolution?',
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
    }
}

module.exports = CheatingResolutionPrompt;
