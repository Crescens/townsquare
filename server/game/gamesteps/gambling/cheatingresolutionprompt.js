const AllPlayerPrompt = require('../allplayerprompt.js');

class CheatingResolutionPrompt extends AllPlayerPrompt {
    completionCondition(player) {
        return player.done;
    }

    activePrompt() {
        return {
            menuTitle: 'Play Cheatin\' Resolution?',
            buttons: [
                { arg: 'selected', text: 'Pass' }
            ]
        };
    }

    waitingPrompt() {
        return { menuTitle: 'Waiting for opponent...' };
    }

    onMenuCommand(player) {
        player.done = true;
    }
}

module.exports = CheatingResolutionPrompt;
