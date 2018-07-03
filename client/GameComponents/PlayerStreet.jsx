import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import GameLocation from './GameLocation.jsx';
import 'jquery-nearest';

class PlayerStreet extends React.Component {
    buildStreet(player) {
        let onStreet = [];

        let className = this.props.className;

        className = 'in-town ' + className;

        if(player) {
            let filteredLocations = _.filter(player.locations, (location) => location.order !== null);
            let sortedLocations = _.sortBy(filteredLocations, 'order');
            _.each(sortedLocations, (location) => {
                _.map(player.cardsInPlay, (card) => {
                    if(card.uuid === location.uuid) {
                        onStreet.push(<GameLocation key={location.uuid}
                                    location={card}
                                    onMenuItemClick={this.props.onMenuItemClick}
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

        return <div className={className}>{onStreet}</div>;
    }

    render() {
        return (
            <div style={this.props.style} >
                {this.buildStreet(this.props.owner)}
            </div>
        );

    }
}

PlayerStreet.displayName = 'PlayerStreet';
PlayerStreet.propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func,
    onDragDrop: PropTypes.func,
    onMenuItemClick: PropTypes.func,
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func,
    otherPlayer: PropTypes.object,
    owner: PropTypes.object,
    style: PropTypes.object,
    thisPlayer: PropTypes.object
};

export default PlayerStreet;
