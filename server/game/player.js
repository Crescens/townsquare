const _ = require('underscore');

const Spectator = require('./spectator.js');
const Deck = require('./deck.js');
const HandRank = require('./handrank.js');
const GameLocation = require('./gamelocation.js');
const AttachmentPrompt = require('./gamesteps/attachmentprompt.js');
//const BestowPrompt = require('./gamesteps/bestowprompt.js');
//const ChallengeTracker = require('./challengetracker.js');
//const PlayableLocation = require('./playablelocation.js');
const PlayActionPrompt = require('./gamesteps/playactionprompt.js');
const PlayerPromptState = require('./playerpromptstate.js');

const StartingHandSize = 5;
//const DrawPhaseCards = 2;

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const TOWNSQUARE = /townsquare/i;

class Player extends Spectator {
    constructor(id, user, owner, game) {
        super(id, user);

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
        this.additionalPiles = {};

        this.owner = owner;
        //this.takenMulligan = false;
        this.game = game;

        this.deck = {};
        //this.challenges = new ChallengeTracker();
        this.minReserve = 0;
        this.costReducers = [];
        this.readyToRevealDrawHand = false;
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

    findCardByUuidInAnyList(uuid) {
        return this.findCardByUuid(this.allCards, uuid);
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
        return this.allCards.any(card => card.location === 'play area' && predicate(card));
    }

    filterCardsInPlay(predicate) {
        return this.allCards.filter(card => card.location === 'play area' && predicate(card));
    }

    getNumberOfCardsInPlay(predicate) {
        return this.allCards.reduce((num, card) => {
            if(card.location === 'play area' && predicate(card)) {
                return num + 1;
            }

            return num;
        }, 0);
    }

    isCardInPlayableLocation(card, playingType) {
        return _.any(this.playableLocations, location => location.playingType === playingType && location.contains(card));
    }

    discardDrawHand() {
        this.discardCards(this.drawHand._wrapped, false, () => {
            //callback(discarded);
        });

        this.drawHandRevealed = false;
    }

    revealDrawHand() {
        this.drawHand.each((card) => {
            card.facedown = false;
        });

        this.drawHandRevealed = true;
    }

    drawCardsToHand(target, numCards) {

        if(target !== 'hand' && target !== 'draw hand') {
            return false;
        }

        var remainder = 0;

        if(numCards > this.drawDeck.size()) {
            remainder = numCards - this.drawDeck.size();
            numCards = this.drawDeck.size();
        }

        var cards = this.drawDeck.first(numCards);

        if(!cards)
        {
            return;
        }

        _.each(cards, card => {
            this.moveCard(card, target);
        });

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
            this.discardPile.each(card => {
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
            /*if(this.drawDeck.size() === 0) {

                var otherPlayer = this.game.getOtherPlayer(this);

                if(otherPlayer) {
                    this.game.addMessage('{0}\'s draw deck is empty', this);
                    this.game.addMessage('{0} wins the game', otherPlayer);
                }

            }*/
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

    /*
    canInitiateChallenge(challengeType) {
        return !this.challenges.isAtMax(challengeType);
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

    setCannotInitiateChallengeForType(type, value) {
        this.challenges.setCannotInitiateForType(type, value);
    }
    */

    initDrawDeck() {
        this.hand.each(card => {
            card.moveTo('draw deck');
            this.drawDeck.push(card);
        });
        this.hand = _([]);
    }

    prepareDecks() {
        var deck = new Deck(this.deck);
        var preparedDeck = deck.prepare(this);
        //this.plotDeck = _( /"dDeck.plotCards);
        this.legend = preparedDeck.legend;
        this.outfit = preparedDeck.outfit;
        this.drawDeck = _(preparedDeck.drawCards);
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

        this.shuffleDrawDeck();
        this.drawCardsToHand('hand', StartingHandSize);
    }

    /*
    mulligan() {
        if(this.takenMulligan) {
            return false;
        }

        this.initDrawDeck();
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

    getReducedCost(playingType, card) {
        var baseCost = playingType === 'ambush' ? card.getAmbushCost() : card.getCost();
        var matchingReducers = _.filter(this.costReducers, reducer => reducer.canReduce(playingType, card));
        var reducedCost = _.reduce(matchingReducers, (cost, reducer) => cost - reducer.getAmount(card), baseCost);
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

        var context = {
            game: this.game,
            player: this,
            source: card
        };
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

    canPutIntoPlay(card) {
        let owner = card.owner;

        if(!card.isUnique()) {
            return true;
        }

        if(this.cannotMarshalOrPutIntoPlayByTitle.includes(card.name)) {
            return false;
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

    putIntoPlay(card, playingType = 'play', target = '') {
        if(!this.canPutIntoPlay(card)) {
            return;
        }

        if(card.isAttachment()) {
            this.promptForAttachment(card, playingType);
            return;
        }

        let originalLocation = card.location;

        card.facedown = this.game.currentPhase === 'setup';
        card.new = true;

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
        }
        card.controller = this;

        card.applyPersistentEffects();

        this.game.raiseMergedEvent('onCardEntersPlay', { card: card, playingType: playingType, originalLocation: originalLocation });
    }

    putPosseInPlay() {
        /*if(this.hand.size() < StartingHandSize) {
            this.drawCardsToHand(StartingHandSize - this.hand.size());
        }*/


    }

    drawPhase() {
        this.game.addMessage('{0} draws {1} cards for the draw phase', this, this.drawPhaseCards);
        this.drawCardsToHand(this.drawPhaseCards);
    }

    beginMarshal() {
        this.game.addGold(this, this.getTotalIncome());

        this.game.raiseMergedEvent('onIncomeCollected', { player: this });

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

    attach(player, attachment, card, playingType) {
        if(!card || !attachment) {
            return;
        }

        if(!this.canAttach(attachment, card)) {
            return;
        }

        let originalLocation = attachment.location;
        let originalParent = attachment.parent;

        attachment.owner.removeCardFromPile(attachment);
        if(originalParent) {
            originalParent.removeAttachment(attachment);
        }
        attachment.moveTo('play area', card);
        card.attachments.push(attachment);

        this.game.queueSimpleStep(() => {
            attachment.applyPersistentEffects();
        });

        if(originalLocation !== 'play area') {
            this.game.raiseMergedEvent('onCardEntersPlay', { card: attachment, playingType: playingType, originalLocation: originalLocation });
        }

        this.game.raiseMergedEvent('onCardAttached', { card: attachment, parent: card });
    }

    showDrawDeck() {
        this.showDeck = true;
    }

    isValidDropCombination(source, target) {
        /*
        if(source === 'plot deck' && target !== 'revealed plots') {
            return false;
        }

        if(source === 'revealed plots' && target !== 'plot deck') {
            return false;
        }

        if(target === 'plot deck' && source !== 'revealed plots') {
            return false;
        }

        if(target === 'revealed plots' && source !== 'plot deck') {
            return false;
        }*/
        return source !== target;
    }

    getSourceList(source) {
        switch(source) {
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
    updateSourceList(source, targetList) {
        switch(source) {
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
            default:
                if(this.additionalPiles[source]) {
                    this.additionalPiles[source].cards = targetList;
                }
        }
    }

    startPosse() {
        _.each(this.hand.value(), (card) => {
            this.drop(card.uuid, 'hand', this.outfit.uuid);
            this.ghostrock -= card.cost;
        });
        
        this.posse = true;
        this.readyToStart = true;

        let processedCards = _([]);

        this.cardsInPlay.each(card => {
            card.facedown = false;

            processedCards.push(card);
        });

        this.cardsInPlay = processedCards;
    }

    receiveProduction() {
        let memo = 0;
        let producers = this.findCards(this.cardsInPlay, (card) => (card.production > 0));
        let production = _.reduce(producers, (memo, card) => {
            return(memo += card.production);
        }, memo);

        this.ghostrock += production;
        return production;
    }


    payUpkeep() {
        this.upkeepPaid = true;

        let memo = 0;
        let upkeepCards = this.findCards(this.cardsInPlay, (card) => (card.upkeep > 0));
        let upkeep = _.reduce(upkeepCards, (memo, card) => {
            return(memo += card.upkeep);
        }, memo);

        this.ghostrock -= upkeep;
        return upkeep;
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

        if(!card) {
            if(source === 'play area') {
                var otherPlayer = this.game.getOtherPlayer(this);

                if(!otherPlayer) {
                    return false;
                }

                card = otherPlayer.findCardInPlayByUuid(cardId);

                if(!card) {
                    return false;
                }
            } else {
                return false;
            }
        }

        if(card.controller !== this) {
            return false;
        }

        if(target === 'discard pile') {
            this.discardCard(card, false);
            return true;
        }

        if(this.inPlayLocation(target)) {
            this.putIntoPlay(card, 'play', target);
        } else {
            this.moveCard(card, target);
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

    initiateChallenge(challengeType) {
        this.challenges.perform(challengeType);
    }

    winChallenge(challengeType, wasAttacker) {
        this.challenges.won(challengeType, wasAttacker);
    }

    loseChallenge(challengeType, wasAttacker) {
        this.challenges.lost(challengeType, wasAttacker);
    }

    resetForChallenge() {
        this.cardsInPlay.each(card => {
            card.resetForChallenge();
        });
    }

    sacrificeCard(card) {
        this.game.applyGameAction('sacrifice', card, card => {
            this.game.raiseEvent('onSacrificed', this, card, () => {
                this.moveCard(card, 'discard pile');
            });
        });
    }

    discardCard(card, allowSave = true) {

        this.discardCards([card], allowSave);
    }

    discardCards(cards, allowSave = true, callback = () => true) {
        this.game.applyGameAction('discard', cards, cards => {
            var params = {
                player: this,
                cards: cards,
                allowSave: allowSave,
                originalLocation: cards[0].location
            };
            this.game.raiseMergedEvent('onCardsDiscarded', params, event => {
                _.each(event.cards, card => {
                    this.doSingleCardDiscard(card, allowSave);
                });
                this.game.queueSimpleStep(() => {
                    callback(event.cards);
                });
            });
        });
    }

    doSingleCardDiscard(card, allowSave = true) {
        var params = {
            player: this,
            card: card,
            allowSave: allowSave,
            originalLocation: card.location
        };
        this.game.raiseMergedEvent('onCardDiscarded', params, event => {
            this.moveCard(event.card, 'discard pile');
        });
    }

    returnCardToHand(card) {
        this.game.applyGameAction('returnToHand', card, card => {
            this.moveCard(card, 'hand');
        });
    }


    getTotalControl() {
        var control = this.cardsInPlay.reduce((memo, card) => {
            return memo + card.getControl();
        }, 0);

        return control;
    }

    getTotalInfluence() {
        var influence = this.cardsInPlay.reduce((memo, card) => {
            return memo + card.getInfluence();
        }, 0);

        return influence;
    }

    removeAttachment(attachment) {
        return attachment.owner.moveCard(attachment, 'discard pile');
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

    moveCard(card, targetLocation, options = {}) {
        this.removeCardFromPile(card);

        var targetPile = this.getSourceList(targetLocation);

        if(!targetPile) {
            return;
        }

        if(targetPile.contains(card) && card.location !== 'play area') {
            return;
        }

        if(card.location === 'play area') {
            if(card.owner !== this) {
                card.owner.moveCard(card, targetLocation);
                return;
            }

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
        }

        if(card.location === 'hand') {
            this.game.raiseEvent('onCardLeftHand', card);
        }

        if(card.location !== 'play area') {
            card.moveTo(targetLocation);
        }

        if(targetLocation === 'draw deck' && !options.bottom) {
            targetPile.unshift(card);
        } else {
            targetPile.push(card);
        }

        if(targetLocation === 'hand') {
            this.game.raiseEvent('onCardEntersHand', card);
        }

        if(targetLocation === 'draw hand') {
            this.game.raiseEvent('onCardEntersDrawHand', card);
        }

        if(['boothill pile', 'discard pile'].includes(targetLocation)) {
            this.game.raiseMergedEvent('onCardPlaced', { card: card, location: targetLocation, player: this });
        }
    }

    bootCard(card) {
        if(card.booted) {
            return;
        }

        this.game.applyGameAction('boot', card, card => {
            card.booted = true;

            this.game.raiseEvent('onCardBooted', this, card);
        });
    }

    unbootCard(card) {
        if(!card.booted) {
            return;
        }

        this.game.applyGameAction('unboot', card, card => {
            card.booted = false;

            this.game.raiseEvent('onCardUnbooted', this, card);
        });
    }

    removeCardFromPile(card) {
        if(card.controller !== this) {
            card.controller.removeCardFromPile(card);

            card.controller = card.owner;

            return;
        }

        var originalLocation = card.location;
        var originalPile = this.getSourceList(originalLocation);

        if(originalPile) {
            originalPile = this.removeCardByUuid(originalPile, card.uuid);
            this.updateSourceList(originalLocation, originalPile);
        }
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

    getState(activePlayer) {
        let isActivePlayer = activePlayer === this;
        let promptState = isActivePlayer ? this.promptState.getState() : {};
        let state = {
            activePlot: this.activePlot ? this.activePlot.getSummary(activePlayer) : undefined,
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
            disconnected: this.disconnected,
            drawHand: (this.drawHandRevealed) ? this.getSummaryForCardList(this.drawHand, activePlayer) : this.getSummaryForCardList(this.drawHand, activePlayer, true),
            outfit: this.outfit.getSummary(activePlayer),
            firstPlayer: this.firstPlayer,
            ghostrock: this.ghostrock,
            hand: this.getSummaryForCardList(this.hand, activePlayer, true),
            handRank: this.handRank,
            id: this.id,
            left: this.left,
            locations: this.locations,
            numDrawCards: this.drawDeck.size(),
            name: this.name,
            phase: this.phase,
            promptedActionWindows: this.promptedActionWindows,
            //reserve: this.getTotalReserve(),
            totalControl: this.getTotalControl(),
            totalInfluence: this.getTotalInfluence(),
            user: _.omit(this.user, ['password', 'email'])
        };

        if(this.showDeck) {
            state.showDeck = true;
            state.drawDeck = this.getSummaryForCardList(this.drawDeck, activePlayer);
        }

        return _.extend(state, promptState);
    }
}

module.exports = Player;
