import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'underscore';
import 'jquery-nearest';

import Card from './Card.jsx';

import * as actions from '../actions';

export class InnerGameLocation extends React.Component {
    constructor() {
        super();

        this.onMouseOut = this.onMouseOut.bind(this);
        this.onMouseOver = this.onMouseOver.bind(this);
        this.onCardClick = this.onCardClick.bind(this);
    }

    getLocation() {
        var locationClass = 'location';
        var imageClass = 'location-image';

        if(!this.props.location) {
            return <div />;
        }

        if(this.props.className) {
            locationClass += ' ' + this.props.className;
        }

        return (
                <div className='location-frame' ref='locationFrame'>
                    <div className={locationClass} >
                        <div>
                            <span className='location-name'>{this.props.location.name}</span>
                            { this.cardLocation ? this.getCardLocation(this.props.location) : this.getImageLocation(imageClass) }
                        </div>
                    </div>
                </div>);
    }

    onCardClick(card) {
        this.props.sendGameMessage('cardClicked', card.uuid);
    }

    onMouseOut() {
        this.props.clearZoom();
    }

    onMouseOver(card) {
        this.props.zoomCard(card);
    }

    getCards() {

        var thisPlayerCards = [];

        var index = 0;

        var thisCardsAtLocation = this.getCardsAtLocation(this.props.thisPlayer, true);
        _.each(thisCardsAtLocation, cards => {
            thisPlayerCards.push(<div className='card-row' key={'this-loc' + index++}>{cards}</div>);
        });

        var otherPlayerCards = [];

        if(this.props.otherPlayer) {
            _.each(this.getCardsAtLocation(this.props.otherPlayer, false), cards => {
                otherPlayerCards.push(<div className='card-row' key={'other-loc' + index++}>{cards}</div>);
            });
        }

        for(var i = thisPlayerCards.length; i < 2; i++) {
            thisPlayerCards.push(<div className='card-row' key={'this-empty' + i} />);
        }

        for(i = otherPlayerCards.length; i < 2; i++) {
            thisPlayerCards.push(<div className='card-row' key={'other-empty' + i} />);
        }
    }

    getCardsAtLocation(player, isMe) {
        if(!player) {
            return [];
        }

        var sortedCards = _.sortBy(player.cardsInPlay, card => {
            return card.type;
        });

        if(!isMe) {
            // we want locations on the bottom, other side wants locations on top
            sortedCards = sortedCards.reverse();
        }

        var cardsByType = _.groupBy(sortedCards, card => {
            return card.type;
        });

        var cardsByLocation = [];

        _.each(cardsByType, cards => {
            var cardsInPlay = _.map(cards, card => {
                return (<Card key={card.uuid} source='play area' card={card} disableMouseOver={card.facedown && !card.code} onMenuItemClick={this.onMenuItemClick}
                                    onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut} onClick={this.onCardClick} onDragDrop={this.onDragDrop} />);
            });
            cardsByLocation.push(cardsInPlay);
        });

        return cardsByLocation;
    }

    getImageLocation(imageClass) {
        return (<img className={imageClass} src={'/img/' + (this.props.location.code + '.jpg')} />);
    }

    getCardLocation(card) {
        return (
            <Card key={card.uuid} source='play area' card={card} disableMouseOver={card.facedown && !card.code} onMenuItemClick={this.onMenuItemClick}
                                onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut} onClick={this.onCardClick} onDragDrop={this.onDragDrop} />
        );
    }

    render() {

        return (
            <div className='location-wrapper' style={this.props.style}>
                {this.getLocation()}
                {this.getCards()}
            </div>
        );

    }
}

InnerGameLocation.displayName = 'Location';
InnerGameLocation.propTypes = {
    cardLocation: PropTypes.bool.isRequired,
    cards: PropTypes.array,
    className: PropTypes.string,
    clearZoom: PropTypes.func,
    currentGame: PropTypes.object,
    location: PropTypes.object.isRequired,
    name: PropTypes.string,
    onClick: PropTypes.func,
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func,
    otherPlayer: PropTypes.object,
    sendGameMessage: PropTypes.func,
    style: PropTypes.object,
    thisPlayer: PropTypes.object,
    username: PropTypes.string,
    zoomCard: PropTypes.func
};

function mapStateToProps(state) {
    return {
        cardToZoom: state.cards.zoomCard,
        username: state.auth.username
    };
}

const GameLocation = connect(mapStateToProps, actions, null, { withRef: true })(InnerGameLocation);

export default GameLocation;
