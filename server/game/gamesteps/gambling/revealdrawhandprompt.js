const AllPlayerPrompt = require('../allplayerprompt.js');

class RevealDrawHandPrompt extends AllPlayerPrompt {
    completionCondition(player) {
        return player.drawHandRevealed;
    }

    activePrompt() {
        return {
            menuTitle: 'Reveal Draw Hand?',
            buttons: [
                { arg: 'selected', text: 'Done' }
            ]
        };
    }

    waitingPrompt() {
        return { menuTitle: 'Waiting for Opponent to Reveal Draw Hand' };
    }

    onMenuCommand(player) {
        this.game.addMessage('{0} is ready to reveal their draw hand', this);
    }
}

module.exports = RevealDrawHandPrompt;
