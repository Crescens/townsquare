const AllPlayerPrompt = require('./allplayerprompt.js');

class ReadyPrompt extends AllPlayerPrompt {
    completionCondition(player) {
        return player.done;
    }

    activePrompt() {
        return {
            menuTitle: 'Ready?',
            buttons: [
                { arg: 'selected', text: 'Done' }
            ]
        };
    }

    waitingPrompt() {
        return { menuTitle: 'Waiting for opponent...' };
    }

    onMenuCommand(player) {
        player.done = true;
        //this.game.addMessage('{0} is ready to move on', player);
    }
}

module.exports = ReadyPrompt;
