import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'underscore';
import 'jquery-nearest';
import {tryParseJSON} from '../util.js';

import Card from './Card.jsx';

import * as actions from '../actions';

export class InnerGameLocation extends React.Component {
    constructor() {
        super();

        this.onMouseOut = this.onMouseOut.bind(this);
        this.onMouseOver = this.onMouseOver.bind(this);
        this.onCardClick = this.onCardClick.bind(this);
        this.onDragDrop = this.onDragDrop.bind(this);
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

    onDragDropEvent(event, target) {
        event.stopPropagation();
        event.preventDefault();

        var card = event.dataTransfer.getData('Text');
        if(!card) {
            return;
        }

        var dragData = tryParseJSON(card);

        if(!dragData) {
            return;
        }

        this.onDragDrop(dragData.card, dragData.source, target);
    }

    onDragDrop(card, source, target) {
        this.props.sendGameMessage('drop', card.uuid, source, target);
    }

    /*
    getCards(thisPlayer, otherPlayer) {
        var thisPlayerCards = [];

        var index = 0;

        var thisCardsInPlay = this.getCardsHere(thisPlayer, true);
        _.each(thisCardsInPlay, cards => {
            thisPlayerCards.push(<div className='card-row' key={'this-loc' + index++}>{cards}</div>);
        });
        var otherPlayerCards = [];

        if(otherPlayer) {
            _.each(this.getCardsHere(otherPlayer, false), cards => {
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
    */

    cardsHereByPlayer(player) {
        if(!player) {
            return <div className='card-row'/>;
        }

        var cardRow = _.map(player.cardsInPlay, (card) => {
            if(card.gamelocation === this.props.location.uuid) {
                return (<Card key={card.uuid} source='play area' card={card} disableMouseOver={card.facedown && !card.code} onMenuItemClick={this.onMenuItemClick}
                              onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut} onClick={this.onCardClick} onDragDrop={this.onDragDrop} />);
            }
        });

        return <div className='card-row'>{cardRow}</div>;
    }

    getImageLocation(imageClass) {
        return (<img className={imageClass} src={'/img/' + (this.props.location.key + '.jpg')} />);
    }

    getCardLocation(card) {
        return (
            <Card key={card.uuid} source='play area' card={card} disableMouseOver={card.facedown && !card.code} onMenuItemClick={this.onMenuItemClick}
                                onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut} onClick={this.onCardClick} onDragDrop={this.onDragDrop} />
        );
    }

    getLocation() {
        var locationClass = 'location';
        var imageClass = 'location-image';
        var frameClass = 'location-frame';

        var cardRegEx = /\d{5}/;
        var isCard = cardRegEx.test(this.props.location.code);

        if(!this.props.location) {
            return <div />;
        }

        if(this.props.className) {
            locationClass += ' ' + this.props.className;
        }

        if(isCard) {
            frameClass += ' ' + this.props.location.type;
        }

        return (
                <div className={frameClass} ref='locationFrame'>
                    <div className={locationClass} >
                        <span className='location-name'>{this.props.location.name}</span>
                        { isCard ? this.getCardLocation(this.props.location) : this.getImageLocation(imageClass) }
                    </div>
                </div>);
    }

    render() {

        return (
            <div className='location-wrapper' style={this.props.style} onDrop={event => this.onDragDropEvent(event, this.props.location.uuid)}>
                {this.cardsHereByPlayer(this.props.otherPlayer)}
                {this.getLocation()}
                {this.cardsHereByPlayer(this.props.thisPlayer)}
            </div>
        );

    }
}

InnerGameLocation.displayName = 'GameLocation';
InnerGameLocation.propTypes = {
    cardLocation: PropTypes.string.isRequired,
    cards: PropTypes.array,
    className: PropTypes.string,
    clearZoom: PropTypes.func,
    location: PropTypes.object.isRequired,
    name: PropTypes.string,
    onClick: PropTypes.func,
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func,
    order: PropTypes.number,
    otherPlayer: PropTypes.object,
    sendGameMessage: PropTypes.func,
    style: PropTypes.object,
    thisPlayer: PropTypes.object,
    zoomCard: PropTypes.func
};

function mapStateToProps(state) {
    return {
        cardToZoom: state.cards.zoomCard
    };
}

const GameLocation = connect(mapStateToProps, actions, null, {withRef: true})(InnerGameLocation);

export default GameLocation;
