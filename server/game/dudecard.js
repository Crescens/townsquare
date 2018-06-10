const _ = require('underscore');

const DrawCard = require('./drawcard.js');
const SetupCardAction = require('./setupcardaction.js');
//const MarshalCardAction = require('./marshalcardaction.js');
//const AmbushCardAction = require('./ambushcardaction.js');

const StandardPlayActions = [
    new SetupCardAction()
    //new MarshalCardAction(),
    //new AmbushCardAction()
];

class DudeCard extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Boot/Unboot',
            handler: context => {
                this.game.addMessage('Test {0}', context.player);
            }
        });
    }
}

module.exports = DudeCard;
