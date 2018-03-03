import React from 'react';
import PropTypes from 'prop-types';
<<<<<<< HEAD
import _ from 'underscore';
import $ from 'jquery';

import AdditionalCardPile from './AdditionalCardPile.jsx';
import Card from './Card.jsx';
import CardCollection from './CardCollection.jsx';
import HandRank from './HandRank.jsx';
import {tryParseJSON} from '../util.js';
=======

import CardPile from './CardPile.jsx';
import PlayerHand from './PlayerHand.jsx';
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9

class PlayerRow extends React.Component {
    constructor() {
        super();

        this.onDrawClick = this.onDrawClick.bind(this);
        this.onShuffleClick = this.onShuffleClick.bind(this);
        this.onShowDeckClick = this.onShowDeckClick.bind(this);
        this.onCloseClick = this.onCloseClick.bind(this);
        this.onCloseAndShuffleClick = this.onCloseAndShuffleClick.bind(this);

        this.state = {
            showDrawMenu: false
        };
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

<<<<<<< HEAD
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

=======
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
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
        let pile = this.props.outOfGamePile;

        if(pile.length === 0) {
            return;
        }

        return (
            <CardPile
                cards={ pile }
                className='additional-cards'
                onCardClick={ this.props.onCardClick }
                onDragDrop={ this.props.onDragDrop }
                onMenuItemClick={ this.props.onMenuItemClick }
                onMouseOut={ this.props.onMouseOut }
                onMouseOver={ this.props.onMouseOver }
                orientation='kneeled'
                popupLocation={ this.props.isMe || this.props.spectating ? 'top' : 'bottom' }
                source='out of game'
                title='Out of Game'
                size={ this.props.cardSize } />
        );
    }

    getAgenda() {
        if(!this.props.agenda || this.props.agenda.code === '') {
            return <div className={ `agenda ${this.props.cardSize === 'medium' ? '' : this.props.cardSize} card-pile vertical panel` } />;
        }

        let cards = [];
        let disablePopup = false;
        let title;
        let source = 'agenda';

        // Alliance
        if(this.props.agenda.code === '06018') {
            cards = this.props.bannerCards;
            title = 'Banners';
        } else if(this.props.agenda.code === '09045') {
            cards = this.props.conclavePile;
            source = 'conclave';
            title = 'Conclave';
            disablePopup = !this.props.isMe;
        }

        disablePopup = disablePopup || !cards || cards.length === 0;

        return (
            <CardPile className='agenda'
                cards={ cards }
                disablePopup={ disablePopup }
                onCardClick={ this.props.onCardClick }
                onDragDrop={ this.props.onDragDrop }
                onMenuItemClick={ this.props.onMenuItemClick }
                onMouseOut={ this.props.onMouseOut }
                onMouseOver={ this.props.onMouseOver }
                popupLocation={ this.props.isMe ? 'top' : 'bottom' }
                source={ source }
                title={ title }
                topCard={ this.props.agenda }
                size={ this.props.cardSize } />
        );
    }

    getTitleCard() {
        if(!this.props.isMelee) {
            return;
        }

<<<<<<< HEAD
        var hand = this.getHand(this.props.hand, needsSquish);
        var drawHand = this.getHand(this.props.drawHand, needsSquish);
=======
        return (
            <CardPile className='title'
                cards={ [] }
                disablePopup
                onMouseOut={ this.props.onMouseOut }
                onMouseOver={ this.props.onMouseOver }
                source='title'
                topCard={ this.props.title }
                size={ this.props.cardSize } />
        );
    }
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9

    render() {
        var drawDeckMenu = this.props.isMe && !this.props.spectating ? [
            { text: 'Show', handler: this.onShowDeckClick, showPopup: true },
            { text: 'Shuffle', handler: this.onShuffleClick }
        ] : null;

        var drawDeckPopupMenu = [
            { text: 'Close and Shuffle', handler: this.onCloseAndShuffleClick }
        ];

        return (
<<<<<<< HEAD
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
=======
            <div className='player-home-row-container'>
                <CardPile className='faction' source='faction' cards={ [] } topCard={ this.props.faction }
                    onMouseOver={ this.onMouseOver } onMouseOut={ this.onMouseOut } disablePopup
                    onCardClick={ this.props.onCardClick }
                    size={ this.props.cardSize } />
                { this.getAgenda() }
                { this.getTitleCard() }
                <PlayerHand
                    cards={ this.props.hand }
                    isMe={ this.props.isMe }
                    onCardClick={ this.props.onCardClick }
                    onDragDrop={ this.props.onDragDrop }
                    onMouseOut={ this.props.onMouseOut }
                    onMouseOver={ this.props.onMouseOver }
                    showHand={ this.props.showHand }
                    spectating={ this.props.spectating }
                    cardSize={ this.props.cardSize } />
                <CardPile className='draw' title='Draw' source='draw deck' cards={ this.props.drawDeck }
                    onMouseOver={ this.props.onMouseOver } onMouseOut={ this.props.onMouseOut }
                    onCardClick={ this.props.isMe && !this.props.spectating ? this.props.onCardClick : null }
                    popupLocation='top' onDragDrop={ this.props.onDragDrop } disablePopup={ this.props.spectating || !this.props.isMe }
                    menu={ drawDeckMenu } hiddenTopCard cardCount={ this.props.numDrawCards } popupMenu={ drawDeckPopupMenu }
                    onCloseClick={ this.onCloseClick.bind(this) }
                    size={ this.props.cardSize } />
                <CardPile className='discard' title='Discard' source='discard pile' cards={ this.props.discardPile }
                    onMouseOver={ this.props.onMouseOver } onMouseOut={ this.props.onMouseOut } onCardClick={ this.props.onCardClick }
                    popupLocation={ this.props.isMe || this.props.spectating ? 'top' : 'bottom' } onDragDrop={ this.props.onDragDrop }
                    size={ this.props.cardSize } />
                <CardPile className='dead' title='Dead' source='dead pile' cards={ this.props.deadPile }
                    onMouseOver={ this.props.onMouseOver } onMouseOut={ this.props.onMouseOut } onCardClick={ this.props.onCardClick }
                    popupLocation={ this.props.isMe || this.props.spectating ? 'top' : 'bottom' } onDragDrop={ this.props.onDragDrop }
                    orientation='kneeled' size={ this.props.cardSize } />
                { this.getOutOfGamePile() }
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
            </div>
        );
    }
}

PlayerRow.displayName = 'PlayerRow';
PlayerRow.propTypes = {
<<<<<<< HEAD
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
=======
    agenda: PropTypes.object,
    bannerCards: PropTypes.array,
    cardSize: PropTypes.string,
    conclavePile: PropTypes.array,
    deadPile: PropTypes.array,
    discardPile: PropTypes.array,
    drawDeck: PropTypes.array,
    faction: PropTypes.object,
    hand: PropTypes.array,
    isMe: PropTypes.bool,
    isMelee: PropTypes.bool,
    numDrawCards: PropTypes.number,
    onCardClick: PropTypes.func,
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
    onDragDrop: PropTypes.func,
    onDrawClick: PropTypes.func,
    onMenuItemClick: PropTypes.func,
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func,
    onShuffleClick: PropTypes.func,
<<<<<<< HEAD
    //plotDeck: PropTypes.array,
    showDrawDeck: PropTypes.bool,
    spectating: PropTypes.bool
=======
    outOfGamePile: PropTypes.array,
    plotDeck: PropTypes.array,
    power: PropTypes.number,
    showDrawDeck: PropTypes.bool,
    showHand: PropTypes.bool,
    spectating: PropTypes.bool,
    title: PropTypes.object
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
};

export default PlayerRow;
