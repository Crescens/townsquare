import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
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
        return;
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
    location: PropTypes.object.isRequired,
    name: PropTypes.string,
    onClick: PropTypes.func,
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func,
    sendGameMessage: PropTypes.func,
    style: PropTypes.object,
    zoomCard: PropTypes.func
};

function mapStateToProps(state) {
    return {
        cardToZoom: state.cards.zoomCard
    };
}

const GameLocation = connect(mapStateToProps, actions, null, { withRef: true})(InnerGameLocation);

export default GameLocation;
