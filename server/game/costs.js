const _ = require('underscore');
const ChooseCost = require('./costs/choosecost.js');
const CostBuilders = require('./costs/CostBuilders.js');
const KneelCost = require('./costs/KneelCost.js');
const XValuePrompt = require('./costs/XValuePrompt.js');
const SelfCost = require('./costs/SelfCost.js');
const StandCost = require('./costs/StandCost.js');
const MoveTokenFromSelfCost = require('./costs/MoveTokenFromSelfCost.js');

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
<<<<<<< HEAD
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
=======
    kneelSelf: function() {
        let action = new KneelCost();
        let unpayAction = new StandCost();
        return new SelfCost(action, unpayAction);
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
    },
    /**
     * Cost that will boot the parent card the current card is attached to.
     */
<<<<<<< HEAD
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
=======
    kneelParent: () => CostBuilders.kneel.parent(),
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
    /**
     * Cost that will boot the player's outfit card.
     */
<<<<<<< HEAD
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
=======
    kneelFactionCard: () => CostBuilders.kneel.faction(),
    /**
     * Cost that kneels a specific card passed into the function
     */
    kneelSpecific: cardFunc => CostBuilders.kneel.specific(cardFunc),
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
    /**
     * Cost that requires booting a card that matches the passed condition
     * predicate function.
     */
<<<<<<< HEAD
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
=======
    kneel: condition => CostBuilders.kneel.select(condition),
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
    /**
     * Cost that requires booting a certain number of cards that match the
     * passed condition predicate function.
     */
<<<<<<< HEAD
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
=======
    kneelMultiple: (amount, condition) => CostBuilders.kneel.selectMultiple(amount, condition),
    /**
     * Cost that requires kneeling any number of cards that match the
     * passed condition predicate function.
     */
    kneelAny: (condition) => CostBuilders.kneel.selectAny(condition),
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
    /**
     * Cost that will sacrifice the card that initiated the ability.
     */
    sacrificeSelf: () => CostBuilders.sacrifice.self(),
    /**
     * Cost that requires sacrificing a card that matches the passed condition
     * predicate function.
     */
    sacrifice: condition => CostBuilders.sacrifice.select(condition),
    /**
     * Cost that will kill the card that initiated the ability.
     */
    killSelf: () => CostBuilders.kill.self(),
    /**
     * Cost that will put into play the card that initiated the ability.
     */
    putSelfIntoPlay: () => CostBuilders.putIntoPlay.self(),
    /**
     * Cost that will remove from game the card that initiated the ability.
     */
    removeSelfFromGame: () => CostBuilders.removeFromGame.self(),
    /**
     * Cost that requires you return a card matching the condition to the
     * player's hand.
     */
    returnToHand: condition => CostBuilders.returnToHand.select(condition),
    /**
     * Cost that will return to hand the card that initiated the ability.
     */
    returnSelfToHand: () => CostBuilders.returnToHand.self(),
    /**
     * Cost that reveals a specific card passed into the function
     */
    revealSpecific: cardFunc => CostBuilders.reveal.specific(cardFunc),
    /**
     * Cost that requires revealing a certain number of cards in hand that match
     * the passed condition predicate function.
     */
    revealCards: (number, condition) => CostBuilders.reveal.selectMultiple(number, condition),
    /**
     * Cost that will stand the card that initiated the ability (e.g.,
     * Barristan Selmy (TS)).
     */
<<<<<<< HEAD
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
=======
    standSelf: () => CostBuilders.stand.self(),
    /**
     * Cost that will stand the parent card the current card is attached to.
     */
    standParent: () => CostBuilders.stand.parent(),
    /**
     * Cost that will remove the parent card the current card is attached to from the challenge.
     */
    removeParentFromChallenge: () => CostBuilders.removeFromChallenge.parent(),
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
    /**
     * Cost that will place the played event card in the player's discard pile.
     */
    expendEvent: function() {
        return {
            canPay: function(context) {
                return context.player.isCardInPlayableLocation(context.source, 'play') && context.player.canPlay(context.source, 'play');
            },
            pay: function(context) {
                // Events become in a "state of being played" while they resolve
                // and are not placed in discard until after resolution / cancel
                // of their effects.
                // Ruling: http://www.cardgamedb.com/forums/index.php?/topic/35981-the-annals-of-castle-black/
                context.source.controller.moveCard(context.source, 'being played');
            }
        };
    },
    /**
     * Cost that requires discarding a card from hand matching the passed
     * condition predicate function.
     */
    discardFromHand: condition => CostBuilders.discardFromHand.select(condition),
    /**
     * Cost that requires discarding multiple cards from hand matching the passed
     * condition predicate function.
     */
    discardMultipleFromHand: (number, condition) => CostBuilders.discardFromHand.selectMultiple(number, condition),
    /**
     * Cost that will pay the reduceable ghostrock cost associated with an event card
     * and place it in discard.
     */
    playEvent: function() {
        return Costs.all(
            Costs.payReduceableGhostRockCost('play'),
            Costs.expendEvent(),
            Costs.playMax()
        );
    },
    /**
     * Cost that will discard a ghostrock from the card. Used mainly by cards
     * having the bestow keyword.
     */
<<<<<<< HEAD
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
=======
    discardGold: amount => CostBuilders.discardToken('gold', amount).self(),
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
    /**
     * Cost that will discard a fixed amount of control from the current card.
     */
<<<<<<< HEAD
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
=======
    discardPowerFromSelf: amount => CostBuilders.discardPower(amount).self(),
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
    /**
     * Cost that will discard a fixed amount of a passed type token from the current card.
     */
    discardTokenFromSelf: (type, amount) => CostBuilders.discardToken(type, amount).self(),
    /**
     * Cost that will move a fixed amount of a passed type token from the current card to a
     * destination card matching the passed condition predicate function.
     */
    moveTokenFromSelf: (type, amount, condition) => new MoveTokenFromSelfCost(type, amount, condition),
    /**
     * Cost that will discard outfit control matching the passed amount.
     */
<<<<<<< HEAD
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
=======
    discardFactionPower: amount => CostBuilders.discardPower(amount).faction(),
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
    /**
     * Cost that requires discarding a control from a card that matches the passed condition
     * predicate function.
     */
<<<<<<< HEAD
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
=======
    discardPower: (amount, condition) => CostBuilders.discardPower(amount).select(condition),
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
    /**
     * Cost that ensures that the player can still play a Limited card this
     * round.
     */
    /*playLimited: function() {
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
    },*/
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
                return context.player.ghostrock >= context.source.getCost();
            },
            pay: function(context) {
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
                if(playingType === 'marshal') {
                    return true;
                }

                return context.player.ghostrock >= context.player.getReducedCost(playingType, context.source);
            },
            pay: function(context) {
                context.costs.ghostrock = context.player.getReducedCost(playingType, context.source);
                context.player.ghostrock -= context.costs.ghostrock;
                context.player.markUsedReducers(playingType, context.source);

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
    },
    /**
     * Reducable cost where the player gets prompted to pay from a passed minimum up to the lesser of two values:
     * the passed maximum and either the player's or his opponent's gold.
     * Used by Ritual of R'hllor, Loot, The Things I Do For Love and Melee at Bitterbridge.
     */
    payXGold: function(minFunc, maxFunc, opponentFunc) {
        return {
            canPay: function(context) {
                let reduction = context.player.getCostReduction('play', context.source);
                let opponentObj = opponentFunc && opponentFunc(context);

                if(!opponentObj) {
                    return context.player.gold >= minFunc(context) - reduction;
                }
                return opponentObj.gold >= minFunc(context) - reduction;
            },
            resolve: function(context, result = { resolved: false }) {
                let reduction = context.player.getCostReduction('play', context.source);
                let opponentObj = opponentFunc && opponentFunc(context);
                let gold = opponentObj ? opponentObj.gold : context.player.gold;
                let max = _.min([maxFunc(context), gold + reduction]);

                context.game.queueStep(new XValuePrompt(minFunc(context), max, context, reduction));

                result.value = true;
                result.resolved = true;
                return result;
            },
            pay: function(context) {
                let opponentObj = opponentFunc && opponentFunc(context);
                if(!opponentObj) {
                    context.game.addGold(context.player, -context.goldCost);
                } else {
                    context.game.addGold(opponentObj, -context.goldCost);
                }
                context.player.markUsedReducers('play', context.source);
            }
        };
    },
    /**
     * Cost where the player gets prompted to discard gold from the card from a passed minimum up to the lesser of two values:
     * the passed maximum and the amount of gold on the source card.
     * Used by The House of Black and White, Stormcrows and Devan Seaworth.
     */
    discardXGold: function(minFunc, maxFunc) {
        return {
            canPay: function(context) {
                return context.source.tokens.gold >= minFunc(context);
            },
            resolve: function(context, result = { resolved: false }) {
                let max = _.min([maxFunc(context), context.source.tokens.gold]);
                
                context.game.queueStep(new XValuePrompt(minFunc(context), max, context));
                
                result.value = true;
                result.resolved = true;
                return result;
            },
            pay: function(context) {
                context.source.modifyToken('gold', -context.xValue);
            }
        };
    }
};

module.exports = Costs;
