const ReadyPrompt = require('../readyprompt.js');

class GrifterPrompt extends ReadyPrompt {
    completionCondition() {
        return this.done;
    }

    activePrompt() {
        return {
            menuTitle: 'Ready/Grifter?',
            buttons: [
                { arg: 'selected', text: 'Done' }
            ]
        };
    }

    waitingPrompt() {
        return { menuTitle: 'Ready/Grifter?' };
    }

    onMenuCommand(player) {
        player.startPosse();
        this.game.addMessage('{0} is ready to play', player);
    }
}

module.exports = GrifterPrompt;
