import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import GameLocation from './GameLocation.jsx';
import 'jquery-nearest';

class PlayerStreet extends React.Component {
    constructor() {
        super();

        this.onMouseOut = this.onMouseOut.bind(this);
        this.onMouseOver = this.onMouseOver.bind(this);
    }

    onMouseOut() {
        //this.props.clearZoom();
    }

    onMouseOver() {
        //this.props.zoomCard(card);
    }

    getBestHand() {

    }

    getNextHand() {

    }

    buildStreet(player) {
        var onStreet = [];

        if(player) {
            _.each(player.locations, (location) => {
                _.map(player.cardsInPlay, (card) => {
                    if(card.uuid === location.uuid) {
                        onStreet.push(<GameLocation key={location.uuid}
                                    location={card}
                                    onMouseOver={this.onMouseOver}
                                    onMouseOut={this.onMouseOut}
                                    onDragDrop={this.onDragDrop}
                                    onClick={this.onCardClick}
                                    otherPlayer={this.otherPlayer}
                                    thisPlayer={this.thisPlayer}/>
                                );
                    }
                });
            });
        }

        return <div className='in-town'>{onStreet}</div>;
    }

    render() {
        return (
            <div className='player-street' style={this.props.style} >
                {this.buildStreet(this.props.thisPlayer)}
            </div>
        );

    }
}

PlayerStreet.displayName = 'PlayerStreet';
PlayerStreet.propTypes = {
    className: PropTypes.string,
    otherPlayer: PropTypes.object,
    style: PropTypes.object,
    thisPlayer: PropTypes.object
};

export default PlayerStreet;
