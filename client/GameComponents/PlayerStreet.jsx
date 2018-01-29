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
                                    onMouseOver={this.props.onMouseOver}
                                    onMouseOut={this.props.onMouseOut}
                                    onDragDrop={this.props.onDragDrop}
                                    otherPlayer={this.props.otherPlayer}
                                    thisPlayer={this.props.thisPlayer}/>
                                );
                    }
                });
            });
        }

        if(onStreet.length === 0) {
            onStreet.push(<GameLocation key='empty' location={{facedown:true}}/>);
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
    onClick: PropTypes.func,
    onDragDrop: PropTypes.func,
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func,
    otherPlayer: PropTypes.object,
    style: PropTypes.object,
    thisPlayer: PropTypes.object
};

export default PlayerStreet;
