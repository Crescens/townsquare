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

    onCardClick(card) {
        this.props.sendGameMessage('cardClicked', card.uuid);
    }

    onMouseOut() {
        this.props.clearZoom();
    }

    onMouseOver(card) {
        this.props.zoomCard(card);
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

    getCardsHere(player) {
        if(!player) {
            return [];
        }

        var playerCardsHere = [];
        var cardsByLocation = [];

        _.each(player.findCards, (cards) => {
            var cardsInPlay = _.map(cards, (card) => {
                if(card.getLocation() === this.location.getKey()) {
                    return (<Card key={card.uuid} source='play area' card={card} disableMouseOver={card.facedown && !card.code} onMenuItemClick={this.onMenuItemClick}
                                  onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut} onClick={this.onCardClick} onDragDrop={this.onDragDrop} />);
                }
            });
            cardsByLocation.push(cardsInPlay);
        });

        for(var i = cardsByLocation.length; i < 2; i++) {
            playerCardsHere.push(<div className='card-row' key={'this-empty' + i} />);
        }

        return playerCardsHere;
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

    render() {

        return (
            <div className='location-wrapper' style={this.props.style}>
                {this.getCardsHere(this.props.otherPlayer)}
                {this.getLocation()}
                {this.getCardsHere(this.props.thisPlayer)}
            </div>
        );

    }
}

InnerGameLocation.displayName = 'GameLocation';
InnerGameLocation.propTypes = {
    cardLocation: PropTypes.bool.isRequired,
    cards: PropTypes.array,
    className: PropTypes.string,
    clearZoom: PropTypes.func,
    location: PropTypes.object.isRequired,
    name: PropTypes.string,
    onClick: PropTypes.func,
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func,
<<<<<<< Updated upstream
    order: PropTypes.number,
    otherPlayer: PropTypes.object,
=======
    order: PropTypes.int,
>>>>>>> Stashed changes
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

const GameLocation = connect(mapStateToProps, actions, null, { withRef: true})(InnerGameLocation);

export default GameLocation;
