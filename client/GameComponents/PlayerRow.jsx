import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import $ from 'jquery';

import AdditionalCardPile from './AdditionalCardPile.jsx';
import Card from './Card.jsx';
import CardCollection from './CardCollection.jsx';
import HandRank from './HandRank.jsx';
import {tryParseJSON} from '../util.js';

class PlayerRow extends React.Component {
    constructor() {
        super();

        this.onDrawClick = this.onDrawClick.bind(this);
        this.onShuffleClick = this.onShuffleClick.bind(this);
        this.onShowDeckClick = this.onShowDeckClick.bind(this);
        this.onCloseClick = this.onCloseClick.bind(this);
        this.onCloseAndShuffleClick = this.onCloseAndShuffleClick.bind(this);
        this.onDragDrop = this.onDragDrop.bind(this);

        this.state = {
            showDrawMenu: false
        };
    }

    onDragOver(event) {
        $(event.target).addClass('highlight-panel');
        event.preventDefault();
    }

    onDragLeave(event) {
        $(event.target).removeClass('highlight-panel');
    }

    onDragDrop(event, target) {
        event.stopPropagation();
        event.preventDefault();

        $(event.target).removeClass('highlight-panel');

        var card = event.dataTransfer.getData('Text');

        if(!card) {
            return;
        }

        var dragData = tryParseJSON(card);
        if(!dragData) {
            return;
        }

        if(this.props.onDragDrop) {
            this.props.onDragDrop(dragData.card, dragData.source, target);
        }
    }

    onCloseClick() {
        if(this.props.onDrawClick) {
            this.props.onDrawClick();
        }
    }

    onCloseAndShuffleClick() {
        if(this.props.onDrawClick) {
            this.props.onDrawClick();
        }

        if(this.props.onShuffleClick) {
            this.props.onShuffleClick();
        }
    }

    onDiscardedCardClick(event, cardId) {
        event.preventDefault();
        event.stopPropagation();

        if(this.props.onDiscardedCardClick) {
            this.props.onDiscardedCardClick(cardId);
        }
    }

    getHand(target, needsSquish) {
        var cardIndex = 0;
        var handLength = target ? target.length : 0;
        var requiredWidth = handLength * 64;
        var overflow = requiredWidth - 342;
        var offset = overflow / (handLength - 1);

        var hand = _.map(target, card => {
            var left = (64 - offset) * cardIndex++;

            var style = {};
            if(needsSquish) {
                style = {
                    left: left + 'px'
                };
            }

            return (<Card key={card.uuid} card={card} style={style} disableMouseOver={!this.props.isMe} source={(target === this.props.hand) ? 'hand' : 'draw hand'}
                         onMouseOver={this.props.onMouseOver}
                         onMouseOut={this.props.onMouseOut}
                         onClick={this.props.onCardClick}
                         onDragDrop={this.props.onDragDrop} />);
        });

        return hand;
    }

    getDrawDeck() {
        var drawDeckPopup = undefined;

        if(this.props.showDrawDeck && this.props.drawDeck) {
            var drawDeck = _.map(this.props.drawDeck, card => {
                return (<Card key={card.uuid} card={card} source='draw deck'
                             onMouseOver={this.props.onMouseOver}
                             onMouseOut={this.props.onMouseOut}
                             onClick={this.props.onCardClick} />);
            });

            drawDeckPopup = (
                <div className='popup panel' onClick={event => event.stopPropagation() }>
                    <div>
                        <a onClick={this.onCloseClick}>Close</a>
                        <a onClick={this.onCloseAndShuffleClick}>Close and shuffle</a>
                    </div>
                    <div className='inner'>
                        {drawDeck}
                    </div>
                </div>);
        }

        return drawDeckPopup;
    }

    onDrawClick() {
        this.setState({ showDrawMenu: !this.state.showDrawMenu });
    }

    onShuffleClick() {
        if(this.props.onShuffleClick) {
            this.props.onShuffleClick();
        }
    }

    onShowDeckClick() {
        if(this.props.onDrawClick) {
            this.props.onDrawClick();
        }
    }

    getOutOfGamePile() {
        let pile = this.props.additionalPiles['out of game'];

        if(!pile || pile.cards.length === 0) {
            return;
        }

        return (
            <AdditionalCardPile
                className='additional-cards'
                isMe={this.props.isMe}
                onMouseOut={this.props.onMouseOut}
                onMouseOver={this.props.onMouseOver}
                pile={pile}
                spectating={this.props.spectating}
                title='Out of Game' />
        );
    }

    render() {
        var className = 'panel hand';
        var needsSquish = this.props.hand && this.props.hand.length * 64 > 342;

        if(needsSquish) {
            className += ' squish';
        }

        var hand = this.getHand(this.props.hand, needsSquish);
        var drawHand = this.getHand(this.props.drawHand, needsSquish);

        var drawDeckMenu = [
            { text: 'Show', handler: this.onShowDeckClick, showPopup: true },
            { text: 'Shuffle', handler: this.onShuffleClick}
        ];

        var drawDeckPopupMenu = [
            { text: 'Close', handler: this.onCloseClick},
            { text: 'Close and Shuffle', handler: this.onCloseAndShuffleClick}
        ];

        return (
            <div className='player-home-row'>
                <div className='deck-cards'>
                    <div className={className} onDragLeave={this.onDragLeave} onDragOver={this.onDragOver} onDrop={(event) => this.onDragDrop(event, 'hand')}>
                        <div className='panel-header'>
                            {'Hand (' + hand.length + ')'}
                        </div>
                        {hand}
                    </div>

                <CardCollection className='draw' title='Draw' source='draw deck' cards={this.props.drawDeck}
                                onMouseOver={this.props.onMouseOver} onMouseOut={this.props.onMouseOut} onCardClick={this.props.onCardClick}
                                popupLocation={this.props.isMe || this.props.spectating ? 'top' : 'bottom'} onDragDrop={this.props.onDragDrop}
                                menu={drawDeckMenu} hiddenTopCard cardCount={this.props.numDrawCards} popupMenu={drawDeckPopupMenu} />
                <CardCollection className='discard' title='Discard' source='discard pile' cards={this.props.discardPile}
                                onMouseOver={this.props.onMouseOver} onMouseOut={this.props.onMouseOut} onCardClick={this.props.onCardClick}
                                popupLocation={this.props.isMe || this.props.spectating ? 'top' : 'bottom'} onDragDrop={this.props.onDragDrop} />
                <CardCollection className='boothill' title='Boot Hill' source='boothill pile' cards={this.props.boothillPile}
                                onMouseOver={this.props.onMouseOver} onMouseOut={this.props.onMouseOut} onCardClick={this.props.onCardClick}
                                popupLocation={this.props.isMe || this.props.spectating ? 'top' : 'bottom'} onDragDrop={this.props.onDragDrop} orientation='booted' />
                  {this.getOutOfGamePile()}

                  <HandRank onMouseOver={this.props.onMouseOver} onMouseOut={this.props.onMouseOut} handrank={this.props.handrank} />

                  <div className={className} onDragLeave={this.onDragLeave} onDragOver={this.onDragOver} onDrop={(event) => this.onDragDrop(event, 'hand')}>
                      <div className='panel-header'>
                          {'Draw Hand (' + drawHand.length + ')'}
                      </div>
                      {drawHand}
                  </div>
                </div>
            </div>
        );
    }
}

PlayerRow.displayName = 'PlayerRow';
PlayerRow.propTypes = {
    additionalPiles: PropTypes.object,
    boothillPile: PropTypes.array,
    control: PropTypes.number,
    discardPile: PropTypes.array,
    drawDeck: PropTypes.array,
    drawHand: PropTypes.array,
    hand: PropTypes.array,
    handrank: PropTypes.number,
    isMe: PropTypes.bool,
    numDrawCards: PropTypes.number,
    onCardClick: PropTypes.func,
    onDiscardedCardClick: PropTypes.func,
    onDragDrop: PropTypes.func,
    onDrawClick: PropTypes.func,
    onMenuItemClick: PropTypes.func,
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func,
    onShuffleClick: PropTypes.func,
    //plotDeck: PropTypes.array,
    showDrawDeck: PropTypes.bool,
    spectating: PropTypes.bool
};

export default PlayerRow;
