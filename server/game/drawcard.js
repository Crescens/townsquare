const _ = require('underscore');

const BaseCard = require('./basecard.js');
const SetupCardAction = require('./setupcardaction.js');
//const MarshalCardAction = require('./marshalcardaction.js');
//const AmbushCardAction = require('./ambushcardaction.js');

const StandardPlayActions = [
    new SetupCardAction()
    //new MarshalCardAction(),
    //new AmbushCardAction()
];

class DrawCard extends BaseCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.attachments = _([]);
        this.icons = {
            bullets: 0,
            influence: 0,
            control: 0,
            bounty: 0,
            ghostrock: 0
        };

        this.booted = false;
        this.minCost = 0;

        if(cardData.starting) {
            this.starting = true;
        }

        if(cardData.bullets) {
            this.icons.bullets = cardData.bullets;
        }

        if(cardData.influence) {
            this.icons.influence = cardData.influence;
        }

        if(cardData.control) {
            this.icons.control = cardData.control;
        }

        this.bounty = 0;
        this.ghostrock = 0;
        /*
        this.strengthModifier = 0;
        this.strengthMultiplier = 1;
        this.strengthSet = undefined;
        this.dominanceStrengthModifier = 0;
        this.contributesToDominance = true;
        this.inChallenge = false;
        this.inDanger = false;
        this.wasAmbush = false;
        this.saved = false;
        this.challengeOptions = {
            doesNotContributeStrength: false,
            doesNotKneelAs: {
                attacker: false,
                defender: false
            },
            mustBeDeclaredAsDefender: false
        };
        this.stealthLimit = 1;
        */
    }

    /*
    canBeDuplicated() {
        return this.controller === this.owner;
    }

    addDuplicate(card) {
        if(!this.canBeDuplicated()) {
            return;
        }

        this.dupes.push(card);
        card.moveTo('duplicate');
    }

    removeDuplicate(force = false) {
        var firstDupe = undefined;

        if(!force) {
            firstDupe = _.first(this.dupes.filter(dupe => {
                return dupe.owner === this.controller;
            }));
        } else {
            firstDupe = this.dupes.first();
        }

        this.dupes = _(this.dupes.reject(dupe => {
            return dupe === firstDupe;
        }));

        return firstDupe;
    }

    isLimited() {
        return this.hasKeyword('Limited') || this.hasPrintedKeyword('Limited');
    }

    isStealth() {
        return this.hasKeyword('Stealth');
    }

    isTerminal() {
        return this.hasKeyword('Terminal');
    }

    isAmbush() {
        return !_.isUndefined(this.ambushCost);
    }

    isBestow() {
        return !_.isUndefined(this.bestowMax);
    }

    isRenown() {
        return this.hasKeyword('renown');
    }

    hasIcon(icon) {
        return this.icons[icon.toLowerCase()] > 0;
    }
    */

    getPrintedCost() {
        return this.cardData.cost || 0;
    }

    getCost() {
        return this.getPrintedCost();
    }

    getMinCost() {
        return this.minCost;
    }

    
    getInfluence() {
        return this.influence || 0;
    }
    

    getControl() {
        return this.control || 0;
    }

    /*
    modifyStrength(amount, applying = true) {
        this.strengthModifier += amount;
        this.game.raiseMergedEvent('onCardStrengthChanged', {
            card: this,
            amount: amount,
            applying: applying
        });
    }

    modifyStrengthMultiplier(amount, applying = true) {
        let strengthBefore = this.getStrength();

        this.strengthMultiplier *= amount;
        this.game.raiseMergedEvent('onCardStrengthChanged', {
            card: this,
            amount: this.getStrength() - strengthBefore,
            applying: applying
        });
    }

    getPrintedStrength() {
        return (this.cardData.strength || 0);
    }

    getStrength() {
        let baseStrength = this.getPrintedStrength();

        if(this.controller.phase === 'setup') {
            return baseStrength;
        }

        if(_.isNumber(this.strengthSet)) {
            return this.strengthSet;
        }

        let modifiedStrength = this.strengthModifier + baseStrength;
        let multipliedStrength = Math.round(this.strengthMultiplier * modifiedStrength);
        return Math.max(0, multipliedStrength);
    }

    modifyDominanceStrength(amount) {
        this.dominanceStrengthModifier += amount;
    }

    getDominanceStrength() {
        let baseStrength = !this.booted && this.getType() === 'character' && this.contributesToDominance ? this.getStrength() : 0;

        return Math.max(0, baseStrength + this.dominanceStrengthModifier);
    }

    getIconsAdded() {
        var icons = [];

        if(this.hasIcon('military') && !this.cardData.is_military) {
            icons.push('military');
        }

        if(this.hasIcon('intrigue') && !this.cardData.is_intrigue) {
            icons.push('intrigue');
        }

        if(this.hasIcon('power') && !this.cardData.is_power) {
            icons.push('power');
        }

        return icons;
    }

    getIconsRemoved() {
        var icons = [];

        if(!this.hasIcon('military') && this.cardData.is_military) {
            icons.push('military');
        }

        if(!this.hasIcon('intrigue') && this.cardData.is_intrigue) {
            icons.push('intrigue');
        }

        if(!this.hasIcon('power') && this.cardData.is_power) {
            icons.push('power');
        }

        return icons;
    }

    getNumberOfIcons() {
        let count = 0;

        if(this.hasIcon('military')) {
            count += 1;
        }
        if(this.hasIcon('intrigue')) {
            count += 1;
        }
        if(this.hasIcon('power')) {
            count += 1;
        }

        return count;
    }

    addIcon(icon) {
        this.icons[icon]++;
    }

    removeIcon(icon) {
        this.icons[icon]--;
    }
    */

    modifyControl(control) {
        this.game.applyGameAction('gainControl', this, card => {
            let oldControl = card.control;

            card.control += control;

            if(card.control < 0) {
                card.control = 0;
            }

            this.game.raiseEvent('onCardControlChanged', this, card.control - oldControl);
        });
    }

    modifyInfluence(influence) {
        this.game.applyGameAction('gainInfluence', this, card => {
            let oldInfluence = card.influence;

            card.influence += influence;

            if(card.influence < 0) {
                card.influence = 0;
            }

            this.game.raiseEvent('onCardInfluenceChanged', this, card.influence - oldInfluence);
        });
    }

    modifyBounty(bounty) {
        this.game.applyGameAction('gainBounty', this, card => {
            let oldBounty = card.bounty;

            card.bounty += bounty;

            if(card.bounty < 0) {
                card.bounty = 0;
            }

            this.game.raiseEvent('onCardBountyChanged', this, card.bounty - oldBounty);
        });
    }

    modifyGhostRock(ghostrock) {
        this.game.applyGameAction('gainGhostRock', this, card => {
            let oldGhostRock = card.ghostrock;

            card.ghostrock += ghostrock;

            if(card.ghostrock < 0) {
                card.ghostrock = 0;
            }

            this.game.raiseEvent('onCardGhostRockChanged', this, card.ghostrock - oldGhostRock);
        });
    }

    /*
    needsStealthTarget() {
        return this.isStealth() && !this.stealthTarget;
    }

    canUseStealthToBypass(targetCard) {
        return this.isStealth() && targetCard.canBeBypassedByStealth();
    }

    useStealthToBypass(targetCard) {
        if(!this.canUseStealthToBypass(targetCard)) {
            return false;
        }

        targetCard.stealth = true;
        this.stealthTarget = targetCard;

        return true;
    }
    */

    clearBlank() {
        super.clearBlank();
        this.attachments.each(attachment => {
            if(!this.allowAttachment(attachment)) {
                this.controller.discardCard(attachment, false);
            }
        });
    }

    /**
     * Checks 'no attachment' restrictions for this card when attempting to
     * attach the passed attachment card.
     */
    allowAttachment(attachment) {
        return (this.getType() === 'dude' || this.getType() === 'deed' || this.getType() === 'outfit');
        //    this.isBlank() ||
        //    this.allowedAttachmentTrait === 'any' ||
        //    this.allowedAttachmentTrait !== 'none' && attachment.hasTrait(this.allowedAttachmentTrait)
    }

    /**
     * Checks whether the passed card meets the attachment restrictions (e.g.
     * Opponent cards only, specific factions, etc) for this card.
     */
    canAttach(player, card) {
        return card && ((this.getType() === 'goods') || (this.getType() === 'spell'));
    }

    removeAttachment(attachment) {
        if(!attachment || !this.attachments.includes(attachment)) {
            return;
        }

        this.attachments = _(this.attachments.reject(a => a === attachment));
        attachment.parent = undefined;
    }

    getPlayActions() {
        return StandardPlayActions
            .concat(this.abilities.playActions)
            .concat(_.filter(this.abilities.actions, action => !action.allowMenu()));
    }

    leavesPlay() {
        this.booted = false;
        this.control = 0;
        //this.wasAmbush = false;
        //this.inChallenge = false;

        super.leavesPlay();
    }

    /*
    resetForChallenge() {
        this.stealth = false;
        this.stealthTarget = undefined;
        this.inChallenge = false;
    }

    canDeclareAsAttacker(challengeType) {
        return this.allowGameAction('declareAsAttacker') && this.canDeclareAsParticipant(challengeType);
    }

    canDeclareAsDefender(challengeType) {
        return this.allowGameAction('declareAsDefender') && this.canDeclareAsParticipant(challengeType);
    }

    canDeclareAsParticipant(challengeType) {
        return (
            this.canParticipateInChallenge() &&
            this.location === 'play area' &&
            !this.stealth &&
            (!this.booted || this.challengeOptions.canBeDeclaredWhileKneeling) &&
            (this.hasIcon(challengeType) || this.challengeOptions.canBeDeclaredWithoutIcon)
        );
    }

    canParticipateInChallenge() {
        return this.getType() === 'character'
            && this.allowGameAction('participateInChallenge');
    }

    canBeBypassedByStealth() {
        return !this.isStealth() && this.allowGameAction('bypassByStealth');
    }

    canBeKilled() {
        return this.allowGameAction('kill');
    }

    canBeMarshaled() {
        return this.allowGameAction('marshal');
    }
    */

    canBePlayed() {
        return this.allowGameAction('play');
    }

    canBeDiscarded() {
        return this.allowGameAction('discard');
    }

    /*
    markAsInDanger() {
        this.inDanger = true;
    }

    markAsSaved() {
        this.inDanger = false;
        this.saved = true;
    }

    clearDanger() {
        this.inDanger = false;
        this.saved = false;
    }
    */

    getSummary(activePlayer, hideWhenFaceup) {
        let baseSummary = super.getSummary(activePlayer, hideWhenFaceup);

        return _.extend(baseSummary, {
            attached: !!this.parent,
            attachments: this.attachments.map(attachment => {
                return attachment.getSummary(activePlayer, hideWhenFaceup);
            }),
            //baseStrength: this.getPrintedStrength(),
            /* -- No Need for Dupe Logic

            dupes: this.dupes.map(dupe => {
                if(dupe.dupes.size() !== 0) {
                    throw new Error('A dupe should not have dupes! ' + dupe.name);
                }

                return dupe.getSummary(activePlayer, hideWhenFaceup);
            }),
            */
            //iconsAdded: this.getIconsAdded(),
            //iconsRemoved: this.getIconsRemoved(),
            //inChallenge: this.inChallenge,
            //inDanger: this.inDanger,
            booted: this.booted,
            control: this.control,
            influence: this.influence
            //saved: this.saved,
            //strength: this.getStrength(),
            //stealth: this.stealth
        });
    }
}

module.exports = DrawCard;
