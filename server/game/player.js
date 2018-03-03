const _ = require('underscore');

const Spectator = require('./spectator.js');
const Deck = require('./deck.js');
<<<<<<< HEAD
const HandRank = require('./handrank.js');
const GameLocation = require('./gamelocation.js');
=======
const AbilityContext = require('./AbilityContext.js');
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
const AttachmentPrompt = require('./gamesteps/attachmentprompt.js');
//const BestowPrompt = require('./gamesteps/bestowprompt.js');
//const ChallengeTracker = require('./challengetracker.js');
//const PlayableLocation = require('./playablelocation.js');
const PlayActionPrompt = require('./gamesteps/playactionprompt.js');
const PlayerPromptState = require('./playerpromptstate.js');
const MinMaxProperty = require('./MinMaxProperty.js');

const logger = require('../log.js');

const StartingHandSize = 5;
//const DrawPhaseCards = 2;

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const TOWNSQUARE = /townsquare/i;

class Player extends Spectator {
    constructor(id, user, owner, game) {
        super(id, user);

        this.beingPlayed = _([]);
        this.drawDeck = _([]);
        //this.plotDeck = _([]);
        //this.plotDiscard = _([]);
        this.hand = _([]);
        this.drawHand = _([]);
        this.locations = [];
        this.handRank = 0;
        this.cardsInPlay = _([]);
        this.boothillPile = _([]);
        this.discardPile = _([]);
        this.outOfGamePile = _([]);

        // Agenda specific piles
        this.schemePlots = _([]);
        this.conclavePile = _([]);

        this.owner = owner;
        //this.takenMulligan = false;
        this.game = game;

        this.setupGold = 8;
        this.cardsInPlayBeforeSetup = [];
        this.deck = {};
<<<<<<< HEAD
        //this.challenges = new ChallengeTracker();
        this.minReserve = 0;
        this.costReducers = [];
        //this.playableLocations = _.map(['marshal', 'play', 'ambush'], playingType => new PlayableLocation(playingType, this, 'hand'));
        //this.usedPlotsModifier = 0;
        //this.cannotGainGold = false;
        //this.cannotGainChallengeBonus = false;
        //this.cannotTriggerCardAbilities = false;
        //this.cannotMarshalOrPutIntoPlayByTitle = [];
        //this.abilityMaxByTitle = {};
        //this.standPhaseRestrictions = [];
        //this.mustChooseAsClaim = [];
        this.promptedActionWindows = user.promptedActionWindows || {
            plot: false,
            draw: false,
            challengeBegin: false,
            attackersDeclared: true,
            defendersDeclared: true,
            winnerDetermined: true,
            dominance: false,
            standing: false
        };

        this.createAdditionalPile('out of game');
=======
        this.challenges = new ChallengeTracker(this);
        this.minReserve = 0;
        this.costReducers = [];
        this.playableLocations = _.map(['marshal', 'play', 'ambush'], playingType => new PlayableLocation(playingType, card => card.controller === this && card.location === 'hand'));
        this.usedPlotsModifier = 0;
        this.attackerLimits = new MinMaxProperty({ defaultMin: 0, defaultMax: 0 });
        this.defenderLimits = new MinMaxProperty({ defaultMin: 0, defaultMax: 0 });
        this.cannotGainGold = false;
        this.doesNotReturnUnspentGold = false;
        this.cannotGainChallengeBonus = false;
        this.triggerRestrictions = [];
        this.playCardRestrictions = [];
        this.abilityMaxByTitle = {};
        this.standPhaseRestrictions = [];
        this.mustChooseAsClaim = [];
        this.mustRevealPlot = undefined;
        this.promptedActionWindows = user.promptedActionWindows;
        this.timerSettings = user.settings.timerSettings || {};
        this.timerSettings.windowTimer = user.settings.windowTimer;
        this.keywordSettings = user.settings.keywordSettings;
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9

        this.promptState = new PlayerPromptState();
    }

    isCardUuidInList(list, card) {
        return list.any(c => {
            return c.uuid === card.uuid;
        });
    }

    isCardNameInList(list, card) {
        return list.any(c => {
            return c.name === card.name;
        });
    }

    areCardsSelected() {
        return this.cardsInPlay.any(card => {
            return card.selected;
        });
    }

    removeCardByUuid(list, uuid) {
        return _(list.reject(card => {
            return card.uuid === uuid;
        }));
    }

    addLocation(location) {
        this.locations.push(location);
    }

    findLocations(predicate) {
        if(!predicate) {
            return this.locations;
        }
    }

    findCardByName(list, name) {
        return this.findCard(list, card => card.name === name);
    }

    findCardByUuid(list, uuid) {
        return this.findCard(list, card => card.uuid === uuid);
    }

    findCardInPlayByUuid(uuid) {
        return this.findCard(this.cardsInPlay, card => card.uuid === uuid);
    }

    findCard(cardList, predicate) {
        var cards = this.findCards(cardList, predicate);
        if(!cards || _.isEmpty(cards)) {
            return undefined;
        }

        return cards[0];
    }

    findCards(cardList, predicate) {
        if(!cardList) {
            return;
        }

        var cardsToReturn = [];

        cardList.each(card => {
            if(predicate(card)) {
                cardsToReturn.push(card);
            }

            if(card.attachments) {
                cardsToReturn = cardsToReturn.concat(card.attachments.filter(predicate));
            }

            return cardsToReturn;
        });

        return cardsToReturn;
    }

    anyCardsInPlay(predicate) {
        return this.game.allCards.any(card => card.controller === this && card.location === 'play area' && predicate(card));
    }

    filterCardsInPlay(predicate) {
        return this.game.allCards.filter(card => card.controller === this && card.location === 'play area' && predicate(card));
    }

    getNumberOfCardsInPlay(predicate) {
        return this.game.allCards.reduce((num, card) => {
            if(card.controller === this && card.location === 'play area' && predicate(card)) {
                return num + 1;
            }

            return num;
        }, 0);
    }

    isCardInPlayableLocation(card, playingType) {
        return _.any(this.playableLocations, location => location.playingType === playingType && location.contains(card));
    }

    /*getDuplicateInPlay(card) {
        if(!card.isUnique()) {
            return undefined;
        }

        return this.game.allCards.find(playCard => (
            playCard.controller === this &&
            playCard.location === 'play area' &&
            playCard !== card &&
            (playCard.code === card.code || playCard.name === card.name) &&
            playCard.owner === this
        ));
    }*/

<<<<<<< HEAD
    /*getNumberOfChallengesWon(challengeType) {
=======
    getFaction() {
        return this.faction.getPrintedFaction();
    }

    getNumberOfChallengesWon(challengeType) {
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
        return this.challenges.getWon(challengeType);
    }

    getNumberOfChallengesLost(challengeType) {
        return this.challenges.getLost(challengeType);
    }

    getNumberOfChallengesInitiatedByType(challengeType) {
        return this.challenges.getPerformed(challengeType);
    }

    getNumberOfChallengesInitiated() {
        return this.challenges.getPerformed();
    }

    getNumberOfUsedPlots() {
        return this.plotDiscard.size() + this.usedPlotsModifier;
    }

    modifyUsedPlots(value) {
        this.usedPlotsModifier += value;
<<<<<<< HEAD
        this.game.raiseEvent('onUsedPlotsModified', this);
    }

    modifyClaim(winner, challengeType, claim) {
        claim = this.activePlot.modifyClaim(winner, challengeType, claim);
        this.cardsInPlay.each(card => {
            claim = card.modifyClaim(winner, challengeType, claim);
        });

        return claim;
    }*/

    drawCardsToHand(target, numCards) {

        if(target !== 'hand' && target !== 'draw hand') {
            return false;
        }

        var remainder = 0;
=======
        this.game.raiseEvent('onUsedPlotsModified', { player: this });
    }
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9

        if(numCards > this.drawDeck.size()) {
            remainder = numCards - this.drawDeck.size();
            numCards = this.drawDeck.size();
        }

        let cards = this.drawDeck.first(numCards);

        _.each(cards, card => {
            this.moveCard(card, target);
        });

        if(this.game.currentPhase !== 'setup') {
            this.game.raiseEvent('onCardsDrawn', { cards: cards, player: this });
        }

        if(this.drawDeck.size() === 0) {
            this.shuffleDiscardToDrawDeck();
        }

        if(remainder > 0) {
            var remainingCards = this.drawDeck.first(remainder);

            _.each(remainingCards, card => {
                this.moveCard(card, target);
            });

            cards = _.union(cards, remainingCards);
        }

        if(cards.length > 1) {
            this.handRank = new HandRank(this.drawHand.toArray()).Rank();
        }

        return (cards.length > 1) ? cards : cards[0];
    }

    searchDrawDeck(limit, predicate) {
        var cards = this.drawDeck;

        if(_.isFunction(limit)) {
            predicate = limit;
        } else {
            if(limit > 0) {
                cards = _(this.drawDeck.first(limit));
            } else {
                cards = _(this.drawDeck.last(-limit));
            }
        }

        return cards.filter(predicate);
    }

    shuffleDrawDeck() {
        this.drawDeck = _(this.drawDeck.shuffle());
    }

    shuffleDiscardToDrawDeck() {

        if(this.discardPile.size() > 0) {
            _.each(this.discardPile, card => {
                this.moveCard(card, 'draw deck');
            });

            this.shuffleDrawDeck();
        }
    }

    discardFromDraw(number, callback = () => true) {
        number = Math.min(number, this.drawDeck.size());

        var cards = this.drawDeck.first(number);
        this.discardCards(cards, false, discarded => {
            callback(discarded);
<<<<<<< HEAD
            /*if(this.drawDeck.size() === 0) {

                var otherPlayer = this.game.getOtherPlayer(this);

                if(otherPlayer) {
                    this.game.addMessage('{0}\'s draw deck is empty', this);
                    this.game.addMessage('{0} wins the game', otherPlayer);
                }

            }*/
=======
            if(this.drawDeck.size() === 0) {
                this.game.playerDecked(this);
            }
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
        });
    }

    moveFromTopToBottomOfDrawDeck(number) {
        while(number > 0) {
            this.moveCard(this.drawDeck.first(), 'draw deck', { bottom: true });

            number--;
        }
    }

    discardAtRandom(number, callback = () => true) {
        var toDiscard = Math.min(number, this.hand.size());
        var cards = [];

        while(cards.length < toDiscard) {
            var cardIndex = _.random(0, this.hand.size() - 1);

            var card = this.hand.value()[cardIndex];
            if(!cards.includes(card)) {
                cards.push(card);
            }
        }

        this.discardCards(cards, false, discarded => {
            this.game.addMessage('{0} discards {1} at random', this, discarded);
            callback(discarded);
        });
    }

<<<<<<< HEAD
    /*
    canInitiateChallenge(challengeType) {
        return !this.challenges.isAtMax(challengeType);
=======
    canInitiateChallenge(challengeType, opponent) {
        return this.challenges.canInitiate(challengeType, opponent);
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
    }

    canSelectAsFirstPlayer(player) {
        if(this.firstPlayerSelectCondition) {
            return this.firstPlayerSelectCondition(player);
        }

        return true;
    }

    addChallenge(type, number) {
        this.challenges.modifyMaxForType(type, number);
    }

    setMaxChallenge(number) {
        this.challenges.setMax(number);
    }

    clearMaxChallenge() {
        this.challenges.clearMax();
    }

    addChallengeRestriction(restriction) {
        this.challenges.addRestriction(restriction);
    }
    */

    removeChallengeRestriction(restriction) {
        this.challenges.removeRestriction(restriction);
    }

    resetCardPile(pile) {
        pile.each(card => {
            if(pile !== this.cardsInPlay || !this.cardsInPlayBeforeSetup.includes(card)) {
                card.moveTo('draw deck');
                this.drawDeck.push(card);
            }
        });
    }

    resetDrawDeck() {
        this.resetCardPile(this.hand);
        this.hand = _([]);
<<<<<<< HEAD
=======

        this.resetCardPile(this.cardsInPlay);
        this.cardsInPlay = _(this.cardsInPlay.filter(card => this.cardsInPlayBeforeSetup.includes(card)));

        this.resetCardPile(this.discardPile);
        this.discardPile = _([]);

        this.resetCardPile(this.deadPile);
        this.deadPile = _([]);
    }

    initDrawDeck() {
        this.resetDrawDeck();
        this.shuffleDrawDeck();
    }

    drawSetupHand() {
        this.drawCardsToHand(StartingHandSize);
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
    }

    prepareDecks() {
        var deck = new Deck(this.deck);
        var preparedDeck = deck.prepare(this);
        //this.plotDeck = _( /"dDeck.plotCards);
        this.legend = preparedDeck.legend;
        this.outfit = preparedDeck.outfit;
        this.drawDeck = _(preparedDeck.drawCards);
<<<<<<< HEAD
        this.allCards = _(preparedDeck.allCards);
        this.startingPosse = preparedDeck.starting;
    }

    addOutfitToTown() {
        //Maybe we don't need to manage a TownSquare object, just treat
        //it as abstract adjacency direction.
        //this.game.townsquare.attach(this.outfit.uuid, this.name);

        var outfit = new GameLocation(this.outfit.uuid, 0);
        outfit.attach('townsquare', 'townsquare');
        this.locations.push(outfit);
        this.moveCard(this.outfit, 'play area');
=======
        this.bannerCards = _(preparedDeck.bannerCards);
        this.preparedDeck = preparedDeck;
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
    }

    initialise() {
        this.prepareDecks();
        this.initDrawDeck();

        this.addOutfitToTown();

        this.ghostrock = this.outfit.wealth || 0;
        //this.limitedPlayed = 0;
        //this.maxLimited = 1;
        //this.activePlot = undefined;
    }

    startGame() {
        if(!this.readyToStart) {
            return;
        }

<<<<<<< HEAD
        this.shuffleDrawDeck();
        this.drawCardsToHand('hand', StartingHandSize);
=======
        this.gold = this.setupGold;
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
    }

    /*
    mulligan() {
        if(this.takenMulligan) {
            return false;
        }

        this.initDrawDeck();
        this.drawSetupHand();
        this.takenMulligan = true;
        this.readyToStart = true;

        return true;
    }
    */

    keep() {
        this.readyToStart = true;
    }

    addCostReducer(reducer) {
        this.costReducers.push(reducer);
    }

    removeCostReducer(reducer) {
        if(_.contains(this.costReducers, reducer)) {
            reducer.unregisterEvents();
            this.costReducers = _.reject(this.costReducers, r => r === reducer);
        }
    }

    getCostReduction(playingType, card) {
        let matchingReducers = _.filter(this.costReducers, reducer => reducer.canReduce(playingType, card));
        let reduction = _.reduce(matchingReducers, (memo, reducer) => reducer.getAmount(card) + memo, 0);
        return reduction;
    }

    getReducedCost(playingType, card) {
        let baseCost = playingType === 'ambush' ? card.getAmbushCost() : card.getCost();
        let reducedCost = baseCost - this.getCostReduction(playingType, card);
        return Math.max(reducedCost, card.getMinCost());
    }

    markUsedReducers(playingType, card) {
        var matchingReducers = _.filter(this.costReducers, reducer => reducer.canReduce(playingType, card));
        _.each(matchingReducers, reducer => {
            reducer.markUsed();
            if(reducer.isExpired()) {
                this.removeCostReducer(reducer);
            }
        });
    }

    registerAbilityMax(cardName, limit) {
        if(this.abilityMaxByTitle[cardName]) {
            return;
        }

        this.abilityMaxByTitle[cardName] = limit;
        limit.registerEvents(this.game);
    }

    isAbilityAtMax(cardName) {
        let limit = this.abilityMaxByTitle[cardName];

        if(!limit) {
            return false;
        }

        return limit.isAtMax();
    }

    incrementAbilityMax(cardName) {
        let limit = this.abilityMaxByTitle[cardName];

        if(limit) {
            limit.increment();
        }
    }

    isCharacterDead(card) {
        return card.isUnique() && this.isCardNameInList(this.boothillPile, card);
    }

    playCard(card) {
        if(!card) {
            return false;
        }

        let context = new AbilityContext({
            game: this.game,
            player: this,
            source: card
        });
        var playActions = _.filter(card.getPlayActions(), action => action.meetsRequirements(context) && action.canPayCosts(context) && action.canResolveTargets(context));

        if(playActions.length === 0) {
            return false;
        }

        if(playActions.length === 1) {
            this.game.resolveAbility(playActions[0], context);
        } else {
            this.game.queueStep(new PlayActionPrompt(this.game, this, playActions, context));
        }

        return true;
    }

    canTrigger(card) {
        return !_.any(this.triggerRestrictions, restriction => restriction(card));
    }

    canPlay(card, playingType = 'play') {
        return !_.any(this.playCardRestrictions, restriction => restriction(card, playingType));
    }

    canPutIntoPlay(card, playingType = 'play', options = {}) {
        if(!options.isEffectExpiration && !this.canPlay(card, playingType)) {
            return false;
        }

        return this.canControl(card);
    }

    canControl(card) {
        let owner = card.owner;

        if(!card.isUnique()) {
            return true;
        }

        if(this.isCharacterDead(card) && !this.canResurrect(card)) {
            return false;
        }

        if(owner === this) {
            let controlsAnOpponentsCopy = this.anyCardsInPlay(c => c.name === card.name && c.owner !== this);
            let opponentControlsOurCopy = _.any(this.game.getPlayers(), player => {
                return player !== this && player.anyCardsInPlay(c => c.name === card.name && c.owner === this && c !== card);
            });

            return !controlsAnOpponentsCopy && !opponentControlsOurCopy;
        }

        if(owner.isCharacterDead(card) && !owner.canResurrect(card)) {
            return false;
        }

        let controlsACopy = this.anyCardsInPlay(c => c.name === card.name);
        let opponentControlsACopy = owner.anyCardsInPlay(c => c.name === card.name && c !== card);

        return !controlsACopy && !opponentControlsACopy;
    }

    canResurrect(card) {
        return this.boothillPile.includes(card) && (!card.isUnique() || this.boothillPile.filter(c => c.name === card.name).length === 1);
    }

<<<<<<< HEAD
    putIntoPlay(card, playingType = 'play', target = '') {
        if(!this.canPutIntoPlay(card)) {
=======
    putIntoPlay(card, playingType = 'play', options = {}) {
        if(!this.canPutIntoPlay(card, playingType, options)) {
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
            return;
        }

        if(card.isAttachment()) {
            this.promptForAttachment(card, playingType);
            return;
        }

<<<<<<< HEAD
        let originalLocation = card.location;
=======
        if(dupeCard && playingType !== 'setup') {
            this.removeCardFromPile(card);
            dupeCard.addDuplicate(card);
        } else {
            // Attachments placed in setup should not be considered to be 'played',
            // as it will cause then to double their effects when attached later.
            let isSetupAttachment = playingType === 'setup' && card.getType() === 'attachment';

            let originalLocation = card.location;

            card.facedown = this.game.currentPhase === 'setup';
            card.new = true;
            this.moveCard(card, 'play area', { isDupe: !!dupeCard });
            card.controller = this;
            card.kneeled = playingType !== 'setup' && !!card.entersPlayKneeled || !!options.kneeled;
            card.wasAmbush = (playingType === 'ambush');
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9

        card.facedown = this.game.currentPhase === 'setup';
        card.new = true;

<<<<<<< HEAD
        switch(card.type) {
            case 'dude':
                card.updateGameLocation(target);
                break;
            case 'deed':
                this.addDeedToStreet(card, target);
                break;
            default:
                //empty
        }

        this.moveCard(card, 'play area');

        if(card.controller !== this) {
            card.controller.allCards = _(card.controller.allCards.reject(c => c === card));
            this.allCards.push(card);
=======
            this.game.queueSimpleStep(() => {
                if(this.game.currentPhase !== 'setup' && card.isBestow()) {
                    this.game.queueStep(new BestowPrompt(this.game, this, card));
                }
            });

            this.game.raiseEvent('onCardEntersPlay', { card: card, playingType: playingType, originalLocation: originalLocation });
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
        }
        card.controller = this;

        card.applyPersistentEffects();

        this.game.raiseMergedEvent('onCardEntersPlay', { card: card, playingType: playingType, originalLocation: originalLocation });
    }

    setupDone() {
        if(this.hand.size() < StartingHandSize) {
            this.drawCardsToHand(StartingHandSize - this.hand.size());
        }

        var processedCards = _([]);

        this.cardsInPlay.each(card => {
            card.facedown = false;

            if(!card.isUnique()) {
                processedCards.push(card);
                return;
            }

            var duplicate = this.findCardByName(processedCards, card.name);

            if(duplicate) {
                duplicate.addDuplicate(card);
            } else {
                processedCards.push(card);
            }

        });

        this.cardsInPlay = processedCards;
<<<<<<< HEAD
=======
        this.gold = 0;
    }

    startPlotPhase() {
        this.firstPlayer = false;
        this.selectedPlot = undefined;
        this.roundDone = false;

        if(this.resetTimerAtEndOfRound) {
            this.noTimer = false;
        }

        this.challenges.reset();

        this.drawPhaseCards = DrawPhaseCards;
    }

    flipPlotFaceup() {
        this.selectedPlot.flipFaceup();
        this.moveCard(this.selectedPlot, 'active plot');
        this.selectedPlot = undefined;
    }

    recyclePlots() {
        if(this.plotDeck.isEmpty()) {
            this.plotDiscard.each(plot => {
                this.moveCard(plot, 'plot deck');
            });

            this.game.raiseEvent('onPlotsRecycled', { player: this });
        }
    }

    removeActivePlot() {
        if(this.activePlot) {
            let plot = this.activePlot;
            this.moveCard(this.activePlot, 'revealed plots');
            this.game.raiseEvent('onPlotDiscarded', { player: this, card: plot });
            this.activePlot = undefined;
            return plot;
        }
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
    }

    drawPhase() {
        this.game.addMessage('{0} draws {1} cards for the draw phase', this, this.drawPhaseCards);
        this.drawCardsToHand(this.drawPhaseCards);
    }

    beginMarshal() {
        this.game.addGold(this, this.getTotalIncome());
        this.game.addMessage('{0} collects {1} gold', this, this.getTotalIncome());

        this.game.raiseEvent('onIncomeCollected', { player: this });

        this.limitedPlayed = 0;
    }

    hasUnmappedAttachments() {
        return this.cardsInPlay.any(card => {
            return card.isAttachment();
        });
    }

    canAttach(attachment, card) {
        if(!attachment || !card) {
            return false;
        }

        return (
            card.location === 'play area' &&
            card !== attachment &&
            card.allowAttachment(attachment) &&
            attachment.canAttach(this, card)
        );
    }

    attach(controller, attachment, card, playingType) {
        if(!card || !attachment) {
            return;
        }

        if(!controller.canAttach(attachment, card)) {
            return;
        }

        let originalLocation = attachment.location;

        attachment.owner.removeCardFromPile(attachment);
        attachment.moveTo('play area', card);
        attachment.controller = controller;
        card.attachments.push(attachment);

        this.game.queueSimpleStep(() => {
            attachment.applyPersistentEffects();
        });

        this.game.queueSimpleStep(() => {
            if(this.game.currentPhase !== 'setup' && attachment.isBestow()) {
                this.game.queueStep(new BestowPrompt(this.game, controller, attachment));
            }
        });

        if(originalLocation !== 'play area') {
            this.game.raiseEvent('onCardEntersPlay', { card: attachment, playingType: playingType, originalLocation: originalLocation });
        }

        this.game.raiseEvent('onCardAttached', { card: attachment, parent: card });
    }

    showDrawDeck() {
        this.showDeck = true;
    }

<<<<<<< HEAD
    isValidDropCombination(source, target) {
        /*
        if(source === 'plot deck' && target !== 'revealed plots') {
            return false;
        }

        if(source === 'revealed plots' && target !== 'plot deck') {
            return false;
        }
=======
    isValidDropCombination(card, target) {
        const PlotCardTypes = ['plot'];
        const DrawDeckCardTypes = ['attachment', 'character', 'event', 'location'];
        const AllowedTypesForPile = {
            'active plot': PlotCardTypes,
            'being played': ['event'],
            'dead pile': ['character'],
            'discard pile': DrawDeckCardTypes,
            'draw deck': DrawDeckCardTypes,
            'hand': DrawDeckCardTypes,
            'out of game': DrawDeckCardTypes.concat(PlotCardTypes),
            'play area': ['attachment', 'character', 'location'],
            'plot deck': PlotCardTypes,
            'revealed plots': PlotCardTypes,
            // Agenda specific piles
            'scheme plots': PlotCardTypes,
            'conclave': DrawDeckCardTypes
        };
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9

        let allowedTypes = AllowedTypesForPile[target];

        if(!allowedTypes) {
            return false;
<<<<<<< HEAD
        }*/
        return source !== target;
=======
        }

        return allowedTypes.includes(card.getType());
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
    }

    getSourceList(source) {
        switch(source) {
            case 'being played':
                return this.beingPlayed;
            case 'hand':
                return this.hand;
            case 'draw hand':
                return this.drawHand;
            case 'draw deck':
                return this.drawDeck;
            case 'discard pile':
                return this.discardPile;
            case 'boothill pile':
                return this.boothillPile;
            case 'play area':
                return this.cardsInPlay;
<<<<<<< HEAD
                //return this.game.getLocations();
            default:
                if(this.additionalPiles[source]) {
                    return this.additionalPiles[source].cards;
                }
        }
    }

    createAdditionalPile(name, properties = {}) {
        this.additionalPiles[name] = _.extend({ cards: _([]) }, properties);
    }

    //play area wraps the main board and the out of town boards
=======
            case 'active plot':
                return _([]);
            case 'plot deck':
                return this.plotDeck;
            case 'revealed plots':
                return this.plotDiscard;
            case 'out of game':
                return this.outOfGamePile;
            // Agenda specific piles
            case 'scheme plots':
                return this.schemePlots;
            case 'conclave':
                return this.conclavePile;
        }
    }

>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
    updateSourceList(source, targetList) {
        switch(source) {
            case 'being played':
                this.beingPlayed = targetList;
                return;
            case 'hand':
                this.hand = targetList;
                break;
            case 'draw hand':
                this.drawHand = targetList;
                break;
            case 'draw deck':
                this.drawDeck = targetList;
                break;
            case 'discard pile':
                this.discardPile = targetList;
                break;
            case 'boothill pile':
                this.boothillPile = targetList;
                break;
            case 'play area':
                this.cardsInPlay = targetList;
                break;
            case 'plot deck':
                this.plotDeck = targetList;
                break;
            case 'revealed plots':
                this.plotDiscard = targetList;
                break;
            case 'out of game':
                this.outOfGamePile = targetList;
                break;
            // Agenda specific piles
            case 'scheme plots':
                this.schemePlots = targetList;
                break;
            case 'conclave':
                this.conclavePile = targetList;
        }
    }

<<<<<<< HEAD
    startPosse() {
        _.each(this.hand.value(), (card) => {
            this.drop(card.uuid, 'hand', this.outfit.uuid);
        });

        this.posse = true;
        this.readyToStart = true;
    }

    receiveProduction() {
        let memo = 0;
        let producers = this.findCards(this.cardsInPlay, (card) => (card.production > 0));
        let production = _.reduce(producers, (card) => {
            return memo += card.production;
        }, memo);

        this.ghostrock += production;
    }

    payUpkeep() {
        this.upkeepPaid = true;
    }

    resetForRound() {
        this.upkeepPaid = false;
    }

    drop(cardId, source, target) {
        if(!this.isValidDropCombination(source, target)) {
            return false;
        }

        var sourceList = this.getSourceList(source);
        var card = this.findCardByUuid(sourceList, cardId);

=======
    drop(card, source, target) {
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
        if(!card) {
            return false;
        }

        if(!this.isValidDropCombination(card, target)) {
            return false;
        }

<<<<<<< HEAD
        if(target === 'discard pile') {
            this.discardCard(card, false);
            return true;
        }

        if(this.inPlayLocation(target)) {
            this.putIntoPlay(card, 'play', target);
        } else {
            this.moveCard(card, target);
=======
        if(source === target) {
            return false;
        }

        if(card.controller !== this) {
            return false;
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
        }

        return true;
    }

    leftDeedOrder() {
        let sorted = _.sortBy(this.locations, 'order');
        let leftmost = sorted.shift();
        return leftmost.order;
    }

    rightDeedOrder() {
        let sorted = _.sortBy(this.locations, 'order');
        let rightmost = sorted.pop();
        return rightmost.order;
    }

    addDeedToStreet(card, target) {
        if(/left/.test(target)) {
            this.locations.push(new GameLocation(card.uuid, this.leftDeedOrder() - 1));
        } else if(/right/.test(target)) {
            this.locations.push(new GameLocation(card.uuid, this.rightDeedOrder() + 1));
        }
    }

    inPlayLocation(target) {

        if(UUID.test(target) || TOWNSQUARE.test(target) || /street/.test(target)) {
            return true;
        }
    }

    promptForAttachment(card, playingType) {
        // TODO: Really want to move this out of here.
        this.game.queueStep(new AttachmentPrompt(this.game, this, card, playingType));
    }

    beginChallenge() {
        this.cardsInPlay.each(card => {
            card.resetForChallenge();
        });
    }

    trackChallenge(challenge) {
        this.challenges.track(challenge);
    }

    getParticipatedChallenges() {
        return this.challenges.getChallenges();
    }

    resetForChallenge() {
        this.cardsInPlay.each(card => {
            card.resetForChallenge();
        });
    }

    sacrificeCard(card) {
        this.game.applyGameAction('sacrifice', card, card => {
            this.game.raiseEvent('onSacrificed', { player: this, card: card }, event => {
                event.cardStateWhenSacrificed = card.createSnapshot();
                this.moveCard(card, 'discard pile');
            });
        });
    }

    discardCard(card, allowSave = true) {
<<<<<<< HEAD

=======
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
        this.discardCards([card], allowSave);
    }

    discardCards(cards, allowSave = true, callback = () => true) {
        this.game.applyGameAction('discard', cards, cards => {
            var params = {
                player: this,
                allowSave: allowSave,
                automaticSaveWithDupe: true,
                originalLocation: cards[0].location
            };
            this.game.raiseSimultaneousEvent(cards, {
                eventName: 'onCardsDiscarded',
                params: params,
                handler: () => true,
                perCardEventName: 'onCardDiscarded',
                perCardHandler: event => {
                    this.moveCard(event.card, 'discard pile');
                },
                postHandler: event => {
                    callback(event.cards);
                }
            });
        });
    }

    returnCardToHand(card, allowSave = true) {
        this.game.applyGameAction('returnToHand', card, card => {
            this.moveCard(card, 'hand', { allowSave: allowSave });
        });
    }

<<<<<<< HEAD
    returnCardToHand(card) {
        this.game.applyGameAction('returnToHand', card, card => {
            this.moveCard(card, 'hand');
        });
    }


    getTotalControl() {
        var control = this.cardsInPlay.reduce((memo, card) => {
            return memo + card.getControl();
        }, this.outfit.control);
=======
    moveCardToTopOfDeck(card, allowSave = true) {
        this.game.applyGameAction('moveToTopOfDeck', card, card => {
            this.moveCard(card, 'draw deck', { allowSave: allowSave });
        });
    }

    moveCardToBottomOfDeck(card, allowSave = true) {
        this.game.applyGameAction('moveToBottomOfDeck', card, card => {
            this.moveCard(card, 'draw deck', { bottom: true, allowSave: allowSave });
        });
    }

    shuffleCardIntoDeck(card, allowSave = true) {
        this.game.applyGameAction('shuffleIntoDeck', card, card => {
            this.moveCard(card, 'draw deck', { allowSave: allowSave }, () => {
                this.shuffleDrawDeck();
            });
        });
    }

    /**
     * @deprecated Use `Game.killCharacter` instead.
     */
    killCharacter(card, allowSave = true) {
        this.game.killCharacter(card, { allowSave: allowSave });
    }

    getDominance() {
        let cardStrength = this.cardsInPlay.reduce((memo, card) => {
            return memo + card.getDominanceStrength();
        }, 0);

        if(this.title) {
            cardStrength += this.title.getDominanceStrength();
        }

        return cardStrength + this.gold;
    }
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9

        return control;
    }

<<<<<<< HEAD
    removeAttachment(attachment) {
        return attachment.owner.moveCard(attachment, 'discard pile');
=======
    getTotalPower() {
        var power = this.cardsInPlay.reduce((memo, card) => {
            return memo + card.getPower();
        }, this.faction.power);

        return power;
    }

    removeAttachment(attachment, allowSave = true) {
        attachment.isBeingRemoved = true;
        if(attachment.isTerminal()) {
            attachment.owner.moveCard(attachment, 'discard pile', { allowSave: allowSave }, () => {
                attachment.isBeingRemoved = false;
            });
        } else {
            attachment.owner.moveCard(attachment, 'hand', { allowSave: allowSave }, () => {
                attachment.isBeingRemoved = false;
            });
        }
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
    }

    selectDeck(deck) {
        this.deck.selected = false;
        this.deck = deck;
        this.deck.selected = true;

        /*this.outfit.cardData = deck.outfit;
        this.outfit.cardData.name = deck.outfit.name;
        this.outfit.cardData.code = deck.outfit.code;
        this.outfit.cardData.type_code = 'outfit';*/
        //this.outfit.cardData.strength = 0;
    }

    moveCard(card, targetLocation, options = {}, callback) {
        let targetPile = this.getSourceList(targetLocation);

        options = _.extend({ allowSave: false, bottom: false, isDupe: false }, options);

        if(!targetPile) {
<<<<<<< HEAD
            return;
        }

        if(targetPile.contains(card) && card.location !== 'play area') {
=======
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
            return;
        }

        if(card.owner !== this && targetLocation !== 'play area') {
            card.owner.moveCard(card, targetLocation, options, callback);
            return;
        }

<<<<<<< HEAD
            if(targetLocation !== 'play area') {

                var params = {
                    player: this,
                    card: card
                };

                this.game.raiseMergedEvent('onCardLeftPlay', params, event => {
                    card.attachments.each(attachment => {
                        this.removeAttachment(attachment, false);
                    });

                    event.card.leavesPlay();

                    if(event.card.parent) {
                        event.card.parent.removeAttachment(event.card);
                    }

                    card.moveTo(targetLocation);
                });
            }
=======
        if(card.location === 'play area') {
            var params = {
                player: this,
                card: card,
                allowSave: options.allowSave,
                automaticSaveWithDupe: true
            };

            this.game.raiseEvent('onCardLeftPlay', params, () => {
                this.synchronousMoveCard(card, targetLocation, options);

                if(callback) {
                    callback();
                }
            });
            return;
        }

        this.synchronousMoveCard(card, targetLocation, options);
        if(callback) {
            callback();
        }
    }

    synchronousMoveCard(card, targetLocation, options = {}) {
        this.removeCardFromPile(card);

        let targetPile = this.getSourceList(targetLocation);

        if(!targetPile || targetPile.contains(card)) {
            return;
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
        }

        if(card.location === 'play area') {
            card.attachments.each(attachment => {
                this.removeAttachment(attachment, false);
            });

            if(!card.dupes.isEmpty()) {
                this.discardCards(card.dupes.toArray(), false);
            }
        }

<<<<<<< HEAD
        if(card.location !== 'play area') {
            card.moveTo(targetLocation);
        }

        if(targetLocation === 'draw deck' && !options.bottom) {
=======
        if(['play area', 'active plot'].includes(card.location)) {
            card.leavesPlay();
        }

        if(card.location === 'active plot') {
            this.game.raiseEvent('onCardLeftPlay', { player: this, card: card });
        }

        card.moveTo(targetLocation);

        if(targetLocation === 'active plot') {
            this.activePlot = card;
        } else if(targetLocation === 'draw deck' && !options.bottom) {
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
            targetPile.unshift(card);
        } else {
            targetPile.push(card);
        }

<<<<<<< HEAD
        if(targetLocation === 'hand') {
            this.game.raiseEvent('onCardEntersHand', card);
        }

        if(targetLocation === 'draw hand') {
            this.game.raiseEvent('onCardEntersDrawHand', card);
        }

        if(['boothill pile', 'discard pile'].includes(targetLocation)) {
            this.game.raiseMergedEvent('onCardPlaced', { card: card, location: targetLocation, player: this });
=======
        if(['dead pile', 'discard pile', 'revealed plots'].includes(targetLocation)) {
            this.game.raiseEvent('onCardPlaced', { card: card, location: targetLocation, player: this });
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
        }
    }

    bootCard(card) {
        if(card.booted) {
            return;
        }

        this.game.applyGameAction('boot', card, card => {
            card.booted = true;

<<<<<<< HEAD
            this.game.raiseEvent('onCardBooted', this, card);
=======
            this.game.raiseEvent('onCardKneeled', { player: this, card: card });
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
        });
    }

    unbootCard(card) {
        if(!card.booted) {
            return;
        }

        this.game.applyGameAction('unboot', card, card => {
            card.booted = false;

<<<<<<< HEAD
            this.game.raiseEvent('onCardUnbooted', this, card);
=======
            this.game.raiseEvent('onCardStood', { player: this, card: card });
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
        });
    }

    removeCardFromPile(card) {
        if(card.controller !== this) {
            card.controller.removeCardFromPile(card);
            card.controller = card.owner;
            return;
        }

        if(card.parent) {
            card.parent.removeChildCard(card);
            card.parent = undefined;
        }

        var originalLocation = card.location;
        var originalPile = this.getSourceList(originalLocation);

        if(originalPile) {
            originalPile = this.removeCardByUuid(originalPile, card.uuid);
            this.updateSourceList(originalLocation, originalPile);
        }
    }

    /*
    getTotalIncome() {
        if(!this.activePlot) {
            return 0;
        }

        return this.activePlot.getIncome();
    }


    getTotalReserve() {
        if(!this.activePlot) {
            return 0;
        }

        let totalReserve = Math.max(this.activePlot.getReserve(), this.minReserve);
        if(_.isNaN(totalReserve) || _.isUndefined(totalReserve)) {
            let payload = {
                minReserve: this.minReserve,
                baseReserve: this.activePlot.cardData.reserve,
                reserveModifier: this.activePlot.reserveModifier
            };

            logger.error('RESERVE BUG: ', payload);
        }

        return Math.max(this.activePlot.getReserve(), this.minReserve);
    }

    getClaim() {
        return this.activePlot ? this.activePlot.getClaim() : 0;
    }
    */

    /*
    isBelowReserve() {
        return this.hand.size() <= this.getTotalReserve();
    }*/

    isRival(opponent) {
        if(!this.title) {
            return false;
        }

        return this.title.isRival(opponent.title);
    }

    isSupporter(opponent) {
        if(!this.title) {
            return false;
        }

        return this.title.isSupporter(opponent.title);
    }

    setSelectedCards(cards) {
        this.promptState.setSelectedCards(cards);
    }

    clearSelectedCards() {
        this.promptState.clearSelectedCards();
    }

    setSelectableCards(cards) {
        this.promptState.setSelectableCards(cards);
    }

    clearSelectableCards() {
        this.promptState.clearSelectableCards();
    }

    getSummaryForCardList(list, activePlayer, hideWhenFaceup) {
        return list.map(card => {
            return card.getSummary(activePlayer, hideWhenFaceup);
        });
    }

    getCardSelectionState(card) {
        return this.promptState.getCardSelectionState(card);
    }

    currentPrompt() {
        return this.promptState.getState();
    }

    setPrompt(prompt) {
        this.promptState.setPrompt(prompt);
    }

    cancelPrompt() {
        this.promptState.cancelPrompt();
    }

    getGameElementType() {
        return 'player';
    }

    getStats(isActivePlayer) {
        return {
            claim: this.getClaim(),
            gold: !isActivePlayer && this.phase === 'setup' ? 0 : this.gold,
            reserve: this.getTotalReserve(),
            totalPower: this.getTotalPower()
        };
    }

    showHandtoSpectators(player) {
        return this.game.isSpectator(player) && this.game.showHand;
    }

    getState(activePlayer) {
        let isActivePlayer = activePlayer === this;
        let promptState = isActivePlayer ? this.promptState.getState() : {};
        let fullDiscardPile = this.discardPile.toArray().concat(this.beingPlayed.toArray());
        let state = {
            activePlot: this.activePlot ? this.activePlot.getSummary(activePlayer) : undefined,
<<<<<<< HEAD
            additionalPiles: _.mapObject(this.additionalPiles, pile => ({
                isPrivate: pile.isPrivate,
                cards: this.getSummaryForCardList(pile.cards, activePlayer, pile.isPrivate)
            })),
            legend: this.legend ? this.legend.getSummary(activePlayer) : undefined,
            //bannerCards: this.getSummaryForCardList(this.bannerCards, activePlayer),
            cardsInPlay: this.getSummaryForCardList(this.cardsInPlay, activePlayer),
            //claim: this.getClaim(),
            boothillPile: this.getSummaryForCardList(this.boothillPile, activePlayer),
            discardPile: this.getSummaryForCardList(this.discardPile, activePlayer),
=======
            agenda: this.agenda ? this.agenda.getSummary(activePlayer) : undefined,
            cardPiles: {
                bannerCards: this.getSummaryForCardList(this.bannerCards, activePlayer),
                cardsInPlay: this.getSummaryForCardList(this.cardsInPlay, activePlayer),
                conclavePile: this.getSummaryForCardList(this.conclavePile, activePlayer, true),
                deadPile: this.getSummaryForCardList(this.deadPile, activePlayer).reverse(),
                discardPile: this.getSummaryForCardList(fullDiscardPile, activePlayer).reverse(),
                hand: this.getSummaryForCardList(this.hand, activePlayer, !this.showHandtoSpectators(activePlayer)),
                outOfGamePile: this.getSummaryForCardList(this.outOfGamePile, activePlayer, false),
                plotDeck: this.getSummaryForCardList(this.plotDeck, activePlayer, true),
                plotDiscard: this.getSummaryForCardList(this.plotDiscard, activePlayer),
                schemePlots: this.getSummaryForCardList(this.schemePlots, activePlayer, true)
            },
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
            disconnected: this.disconnected,
            drawHand: this.getSummaryForCardList(this.drawHand, activePlayer, true),
            outfit: this.outfit.getSummary(activePlayer),
            firstPlayer: this.firstPlayer,
<<<<<<< HEAD
            ghostrock: this.ghostrock,
            hand: this.getSummaryForCardList(this.hand, activePlayer, true),
            handRank: this.handRank,
=======
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
            id: this.id,
            keywordSettings: this.keywordSettings,
            left: this.left,
            locations: this.locations,
            numDrawCards: this.drawDeck.size(),
            name: this.name,
            phase: this.phase,
<<<<<<< HEAD
            promptedActionWindows: this.promptedActionWindows,
            //reserve: this.getTotalReserve(),
            totalControl: this.getTotalControl(),
=======
            plotSelected: !!this.selectedPlot,
            promptedActionWindows: this.promptedActionWindows,
            stats: this.getStats(isActivePlayer),
            timerSettings: this.timerSettings,
            title: this.title ? this.title.getSummary(activePlayer) : undefined,
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
            user: _.omit(this.user, ['password', 'email'])
        };

        if(this.showDeck) {
            state.showDeck = true;
            state.cardPiles.drawDeck = this.getSummaryForCardList(this.drawDeck, activePlayer);
        }

        return _.extend(state, promptState);
    }
}

module.exports = Player;
