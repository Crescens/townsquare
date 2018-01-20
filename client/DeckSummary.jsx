import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';

import StatusPopOver from './StatusPopOver.jsx';

class DeckSummary extends React.Component {
    constructor() {
        super();

        this.onCardMouseOut = this.onCardMouseOut.bind(this);
        this.onCardMouseOver = this.onCardMouseOver.bind(this);

        this.state = {
            cardToShow: ''
        };
    }

    onCardMouseOver(event) {
        var cardToDisplay = _.filter(this.props.cards, card => {
            return event.target.innerText === card.title;
        });

        this.setState({ cardToShow: cardToDisplay[0] });
    }

    onCardMouseOut() {
        this.setState({ cardToShow: undefined });
    }

    getCardsToRender() {
        var cardsToRender = [];
        var groupedCards = {};
        var combinedCards = this.props.deck.drawCards;

        _.each(combinedCards, (card) => {
            if(!groupedCards[card.card.type]) {
                groupedCards[card.card.type] = [card];
            } else {
                groupedCards[card.card.type].push(card);
            }
        });

        _.each(groupedCards, (cardList, key) => {
            var cards = [];
            var count = 0;
            var startingString = '*';

            _.each(cardList, card => {
                cards.push(<div key={ card.card.code }><span>{ startingString.repeat(card.starting) }{card.count + 'x '}</span><span className='card-link' onMouseOver={ this.onCardMouseOver } onMouseOut={ this.onCardMouseOut }>{ card.card.title }</span></div>);
                count += parseInt(card.count);
            });

            cardsToRender.push(<div key={ key } className='card-group'><h4>{ key + ' (' + count.toString() + ')' }</h4>{ cards }</div>);
        });

        return cardsToRender;
    }

    render() {
        if(!this.props.deck) {
            return <div>Waiting for selected deck...</div>;
        }

        var cardsToRender = this.getCardsToRender();

        return (
            <div>
                { this.state.cardToShow ? <img className='hover-image' src={ '/img/cards/' + this.state.cardToShow.code + '.jpg' } /> : null }
                <h3>{ this.props.deck.name }</h3>
                <div className='decklist'>
                    { this.props.deck.outfit ? <img className='pull-left' src={ '/img/cards/' + this.props.deck.outfit.code + '.jpg' } /> : null }
                    { this.props.deck.legend && this.props.deck.legend.code ? <img className='pull-right' src={ '/img/cards/' + this.props.deck.legend.code + '.jpg' } /> : null }
                    <div>
                        <h4>{ this.props.deck.outfit ? this.props.deck.outfit.title : null }</h4>
                        <div ref='legend'>Legend: { this.props.deck.legend && this.props.deck.legend.title ? <span className='card-link' onMouseOver={ this.onCardMouseOver }
                            onMouseOut={ this.onCardMouseOut }>{ this.props.deck.legend.title }</span> : <span>None</span> }</div>

                         <div ref='drawCount'>Draw deck: { this.props.deck.validation.drawCount } cards</div>
                        <div className={ this.props.deck.validation.status === 'Valid' ? 'text-success' : 'text-danger' }>
                            <StatusPopOver status={ this.props.deck.validation.status } list={ this.props.deck.validation.extendedStatus }
                                            show={ this.props.deck.validation.status !== 'Valid' } />
                        </div>
                    </div>
                </div>
                <div className='cards'>
                    { cardsToRender }
                </div>
            </div>);
    }
}

DeckSummary.displayName = 'DeckSummary';
DeckSummary.propTypes = {
    cards: PropTypes.object,
    deck: PropTypes.object
};

export default DeckSummary;
