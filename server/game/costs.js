const _ = require('underscore');
const ChooseCost = require('./costs/choosecost.js');

const Costs = {
    /**
     * Cost that aggregates a list of other costs.
     */
    all: function(...costs) {
        return {
            canPay: function(context) {
                return _.all(costs, cost => cost.canPay(context));
            },
            pay: function(context) {
                _.each(costs, cost => cost.pay(context));
            }
        };
    },
    /**
     * Cost that allows the player to choose between multiple costs. The
     * `choices` object should have string keys representing the button text
     * that will be used to prompt the player, with the values being the cost
     * associated with that choice.
     */
    choose: function(choices) {
        return new ChooseCost(choices);
    },
    /**
     * Cost that will boot the card that initiated the ability.
     */
    bootSelf: function() {
        return {
            canPay: function(context) {
                return !context.source.booted;
            },
            pay: function(context) {
                context.source.controller.bootCard(context.source);
            },
            canUnpay: function(context) {
                return context.source.booted;
            },
            unpay: function(context) {
                context.source.controller.standCard(context.source);
            }
        };
    },
    /**
     * Cost that will boot the parent card the current card is attached to.
     */
    bootParent: function() {
        return {
            canPay: function(context) {
                return !!context.source.parent && !context.source.parent.booted;
            },
            pay: function(context) {
                context.source.parent.controller.bootCard(context.source.parent);
            }
        };
    },
    /**
     * Cost that will boot the player's outfit card.
     */
    bootOutfitCard: function() {
        return {
            canPay: function(context) {
                return !context.player.outfit.booted;
            },
            pay: function(context) {
                context.player.bootCard(context.player.outfit);
            }
        };
    },
    /**
     * Cost that requires booting a card that matches the passed condition
     * predicate function.
     */
    boot: function(condition) {
        var fullCondition = (card, context) => (
            !card.booted &&
            card.location === 'play area' &&
            card.controller === context.player &&
            condition(card)
        );
        return {
            canPay: function(context) {
                return context.player.anyCardsInPlay(card => fullCondition(card, context));
            },
            resolve: function(context, result = { resolved: false }) {
                context.game.promptForSelect(context.player, {
                    cardCondition: card => fullCondition(card, context),
                    activePromptTitle: 'Select card to boot',
                    source: context.source,
                    onSelect: (player, card) => {
                        context.bootingCostCard = card;
                        result.value = true;
                        result.resolved = true;

                        return true;
                    },
                    onCancel: () => {
                        result.value = false;
                        result.resolved = true;
                    }
                });

                return result;
            },
            pay: function(context) {
                context.player.bootCard(context.bootingCostCard);
            }
        };
    },
    /**
     * Cost that requires booting a certain number of cards that match the
     * passed condition predicate function.
     */
    bootMultiple: function(number, condition) {
        var fullCondition = (card, context) => (
            !card.booted &&
            card.location === 'play area' &&
            card.controller === context.player &&
            condition(card)
        );
        return {
            canPay: function(context) {
                return context.player.getNumberOfCardsInPlay(card => fullCondition(card, context)) >= number;
            },
            resolve: function(context, result = { resolved: false }) {
                context.game.promptForSelect(context.player, {
                    cardCondition: card => fullCondition(card, context),
                    activePromptTitle: 'Select ' + number + ' cards to boot',
                    numCards: number,
                    multiSelect: true,
                    source: context.source,
                    onSelect: (player, cards) => {
                        if(cards.length !== number) {
                            return false;
                        }

                        context.bootingCostCards = cards;
                        result.value = true;
                        result.resolved = true;

                        return true;
                    },
                    onCancel: () => {
                        result.value = false;
                        result.resolved = true;
                    }
                });

                return result;
            },
            pay: function(context) {
                _.each(context.bootingCostCards, card => {
                    context.player.bootCard(card);
                });
            }
        };
    },
    /**
     * Cost that will sacrifice the card that initiated the ability.
     */
    sacrificeSelf: function() {
        return {
            canPay: function() {
                return true;
            },
            pay: function(context) {
                context.source.controller.sacrificeCard(context.source);
            }
        };
    },
    /**
     * Cost that requires sacrificing a card that matches the passed condition
     * predicate function.
     */
    sacrifice: function(condition) {
        var fullCondition = (card, context) => (
            card.location === 'play area' &&
            card.controller === context.player &&
            condition(card)
        );
        return {
            canPay: function(context) {
                return context.player.anyCardsInPlay(card => fullCondition(card, context));
            },
            resolve: function(context, result = { resolved: false }) {
                context.game.promptForSelect(context.player, {
                    cardCondition: card => fullCondition(card, context),
                    activePromptTitle: 'Select card to sacrifice',
                    source: context.source,
                    onSelect: (player, card) => {
                        context.sacrificeCostCard = card;
                        result.value = true;
                        result.resolved = true;

                        return true;
                    },
                    onCancel: () => {
                        result.value = false;
                        result.resolved = true;
                    }
                });

                return result;
            },
            pay: function(context) {
                context.player.sacrificeCard(context.sacrificeCostCard);
            }
        };
    },
    /**
     * Cost that will put into play the card that initiated the ability.
     */
    putSelfIntoPlay: function() {
        return {
            canPay: function(context) {
                return context.source.controller.canPutIntoPlay(context.source);
            },
            pay: function(context) {
                context.source.controller.putIntoPlay(context.source);
            }
        };
    },
    /**
     * Cost that will remove from game the card that initiated the ability.
     */
    removeSelfFromGame: function() {
        return {
            canPay: function() {
                return true;
            },
            pay: function(context) {
                context.source.controller.moveCard(context.source, 'out of game');
            }
        };
    },
    /**
     * Cost that requires you return a card matching the condition to the
     * player's hand.
     */
    returnToHand: function(condition) {
        var fullCondition = (card, context) => (
            card.location === 'play area' &&
            card.controller === context.player &&
            condition(card)
        );
        return {
            canPay: function(context) {
                return context.player.anyCardsInPlay(card => fullCondition(card, context));
            },
            resolve: function(context, result = { resolved: false }) {
                context.game.promptForSelect(context.player, {
                    cardCondition: card => fullCondition(card, context),
                    activePromptTitle: 'Select card to return to hand',
                    source: context.source,
                    onSelect: (player, card) => {
                        context.costs.returnedToHandCard = card;
                        result.value = true;
                        result.resolved = true;

                        return true;
                    },
                    onCancel: () => {
                        result.value = false;
                        result.resolved = true;
                    }
                });

                return result;
            },
            pay: function(context) {
                context.player.returnCardToHand(context.costs.returnedToHandCard, false);
            }
        };
    },
    /**
     * Cost that will return to hand the card that initiated the ability.
     */
    returnSelfToHand: function() {
        return {
            canPay: function() {
                return true;
            },
            pay: function(context) {
                context.source.controller.returnCardToHand(context.source, false);
            }
        };
    },
    /**
     * Cost that requires revealing a certain number of cards in hand that match
     * the passed condition predicate function.
     */
    revealCards: function(number, condition) {
        var fullCondition = (card, context) => (
            card.location === 'hand' &&
            card.controller === context.player &&
            condition(card)
        );
        return {
            canPay: function(context) {
                let potentialCards = context.player.findCards(context.player.hand, card => fullCondition(card, context));
                return _.size(potentialCards) >= number;
            },
            resolve: function(context, result = { resolved: false }) {
                context.game.promptForSelect(context.player, {
                    cardCondition: card => fullCondition(card, context),
                    activePromptTitle: 'Select ' + number + ' cards to reveal',
                    numCards: number,
                    multiSelect: true,
                    source: context.source,
                    onSelect: (player, cards) => {
                        if(cards.length !== number) {
                            return false;
                        }

                        context.revealingCostCards = cards;
                        result.value = true;
                        result.resolved = true;

                        return true;
                    },
                    onCancel: () => {
                        result.value = false;
                        result.resolved = true;
                    }
                });

                return result;
            },
            pay: function(context) {
                context.game.addMessage('{0} reveals {1} from their hand', context.player, context.revealingCostCards);
            }
        };
    },
    /**
     * Cost that will stand the card that initiated the ability (e.g.,
     * Barristan Selmy (TS)).
     */
    standSelf: function() {
        return {
            canPay: function(context) {
                return context.source.booted;
            },
            pay: function(context) {
                context.source.controller.standCard(context.source);
            }
        };
    },
    /**
     * Cost that will place the played event card in the player's discard pile.
     */
    expendEvent: function() {
        return {
            canPay: function(context) {
                return context.player.isCardInPlayableLocation(context.source, 'play') && context.source.canBePlayed();
            },
            pay: function(context) {
                context.source.controller.moveCard(context.source, 'discard pile');
            }
        };
    },
    /**
     * Cost that requires discarding a card from hand matching the passed
     * condition predicate function.
     */
    discardFromHand: function(condition = () => true) {
        var fullCondition = (card, context) => (
            card.location === 'hand' &&
            card.controller === context.player &&
            condition(card)
        );
        return {
            canPay: function(context) {
                return context.player.allCards.any(card => fullCondition(card, context));
            },
            resolve: function(context, result = { resolved: false }) {
                context.game.promptForSelect(context.player, {
                    cardCondition: card => fullCondition(card, context),
                    activePromptTitle: 'Select card to discard',
                    source: context.source,
                    onSelect: (player, card) => {
                        context.discardCostCard = card;
                        result.value = true;
                        result.resolved = true;

                        return true;
                    },
                    onCancel: () => {
                        result.value = false;
                        result.resolved = true;
                    }
                });

                return result;
            },
            pay: function(context) {
                context.player.discardCard(context.discardCostCard);
            }
        };
    },
    /**
     * Cost that will pay the reduceable ghostrock cost associated with an event card
     * and place it in discard.
     */
    playEvent: function() {
        return Costs.all(
            Costs.payReduceableGhostRockCost('play'),
            Costs.expendEvent(),
            Costs.playLimited(),
            Costs.playMax()
        );
    },
    /**
     * Cost that will discard a ghostrock from the card. Used mainly by cards
     * having the bestow keyword.
     */
    discardGhostRock: function() {
        return {
            canPay: function(context) {
                return context.source.hasToken('ghostrock');
            },
            pay: function(context) {
                context.source.removeToken('ghostrock', 1);
            }
        };
    },
    /**
     * Cost that will discard a fixed amount of control from the current card.
     */
    discardControlFromSelf: function(amount = 1) {
        return {
            canPay: function(context) {
                return context.source.control >= amount;
            },
            pay: function(context) {
                context.source.modifyControl(-amount);
            }
        };
    },
    /**
     * Cost that will discard a fixed amount of a passed type token from the current card.
     */
    discardTokenFromSelf: function(type, amount = 1) {
        return {
            canPay: function(context) {
                return context.source.tokens[type] >= amount;
            },
            pay: function(context) {
                context.source.removeToken(type, amount);
            }
        };
    },
    /**
     * Cost that will discard outfit control matching the passed amount.
     */
    /*
    discardOutfitControl: function(amount) {
        return {
            canPay: function(context) {
                return context.player.outfit.control >= amount;
            },
            pay: function(context) {
                context.source.game.addControl(context.player, -amount);
            }
        };
    },
    */
    /**
     * Cost that requires discarding a control from a card that matches the passed condition
     * predicate function.
     */
    discardControl: function(amount, condition) {
        var fullCondition = (card, context) => (
            card.getControl() >= amount &&
            card.location === 'play area' &&
            card.controller === context.player &&
            condition(card)
        );
        return {
            canPay: function(context) {
                return context.player.anyCardsInPlay(card => fullCondition(card, context));
            },
            resolve: function(context, result = { resolved: false }) {
                context.game.promptForSelect(context.player, {
                    cardCondition: card => fullCondition(card, context),
                    activePromptTitle: 'Select card to discard ' + amount + ' control from',
                    source: context.source,
                    onSelect: (player, card) => {
                        context.discardControlCostCard = card;
                        result.value = true;
                        result.resolved = true;

                        return true;
                    },
                    onCancel: () => {
                        result.value = false;
                        result.resolved = true;
                    }
                });

                return result;
            },
            pay: function(context) {
                context.discardControlCostCard.modifyControl(-amount);
            }
        };
    },
    /**
     * Cost that ensures that the player can still play a Limited card this
     * round.
     */
    playLimited: function() {
        return {
            canPay: function(context) {
                return !context.source.isLimited() || context.player.limitedPlayed < context.player.maxLimited;
            },
            pay: function(context) {
                if(context.source.isLimited()) {
                    context.player.limitedPlayed += 1;
                }
            }
        };
    },
    /**
     * Cost that ensures that the player has not exceeded the maximum usage for
     * an ability.
     */
    playMax: function() {
        return {
            canPay: function(context) {
                return !context.player.isAbilityAtMax(context.source.name);
            },
            pay: function(context) {
                context.player.incrementAbilityMax(context.source.name);
            }
        };
    },
    /**
     * Cost that will pay the exact printed ghostrock cost for the card.
     */
    payPrintedGhostRockCost: function() {
        return {
            canPay: function(context) {
                var hasDupe = context.player.getDuplicateInPlay(context.source);
                if(hasDupe) {
                    return true;
                }

                return context.player.ghostrock >= context.source.getCost();
            },
            pay: function(context) {
                var hasDupe = context.player.getDuplicateInPlay(context.source);
                if(hasDupe) {
                    return;
                }

                context.player.ghostrock -= context.source.getCost();
            }
        };
    },
    /**
     * Cost that will pay the printed ghostrock cost on the card minus any active
     * reducer effects the play has activated. Upon playing the card, all
     * matching reducer effects will expire, if applicable.
     */
    payReduceableGhostRockCost: function(playingType) {
        return {
            canPay: function(context) {
                var hasDupe = context.player.getDuplicateInPlay(context.source);
                if(hasDupe && playingType === 'marshal') {
                    return true;
                }

                return context.player.ghostrock >= context.player.getReducedCost(playingType, context.source);
            },
            pay: function(context) {
                var hasDupe = context.player.getDuplicateInPlay(context.source);
                context.costs.isDupe = !!hasDupe;
                if(hasDupe && playingType === 'marshal') {
                    context.costs.ghostrock = 0;
                } else {
                    context.costs.ghostrock = context.player.getReducedCost(playingType, context.source);
                    context.player.ghostrock -= context.costs.ghostrock;
                    context.player.markUsedReducers(playingType, context.source);
                }
            }
        };
    },
    /**
     * Cost in which the player must pay a fixed, non-reduceable amount of ghostrock.
     */
    payGhostRock: function(amount) {
        return {
            canPay: function(context) {
                return context.player.ghostrock >= amount;
            },
            pay: function(context) {
                context.game.addGhostRock(context.player, -amount);
            }
        };
    }
};

module.exports = Costs;
