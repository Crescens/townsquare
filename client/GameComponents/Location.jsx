import React from 'react';
import PropTypes from 'prop-types';
//import _ from 'underscore';
//import $ from 'jquery';
import 'jquery-nearest';

class Location extends React.Component {

    render() {

        return (
            <div className='location-wrapper' style={this.props.style}>
                {this.getLocation()}
                {this.getCards()}
            </div>);

    }
}

Location.displayName = 'Location';
Location.propTypes = {
    /*className: PropTypes.string,
    disableMouseOver: PropTypes.bool,
    location: PropTypes.shape({
        attached: PropTypes.bool,
        attachments: PropTypes.array,
        baseStrength: PropTypes.number,
        code: PropTypes.string,
        controlled: PropTypes.bool,
        dupes: PropTypes.array,
        facedown: PropTypes.bool,
        iconsAdded: PropTypes.array,
        iconsRemoved: PropTypes.array,
        inChallenge: PropTypes.bool,
        inDanger: PropTypes.bool,
        booted: PropTypes.bool,
        menu: PropTypes.array,
        name: PropTypes.string,
        new: PropTypes.bool,
        order: PropTypes.number,
        power: PropTypes.number,
        saved: PropTypes.bool,
        selectable: PropTypes.bool,
        selected: PropTypes.bool,
        stealth: PropTypes.bool,
        strength: PropTypes.number,
        tokens: PropTypes.object,
        type: PropTypes.string,
        unselectable: PropTypes.bool
    }).isRequired,
    onClick: PropTypes.func,
    onDragDrop: PropTypes.func,
    onMenuItemClick: PropTypes.func,
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func,
    orientation: PropTypes.oneOf(['horizontal', 'booted', 'vertical']),
    source: PropTypes.oneOf(['hand', 'discard pile', 'play area', 'dead pile', 'draw deck', 'plot deck', 'revealed plots', 'selected plot', 'attachment', 'agenda', 'faction', 'additional']).isRequired,

    wrapped: PropTypes.bool
    */
    style: PropTypes.object
};
Location.defaultProps = {
//    orientation: 'vertical',
//    wrapped: true
};

export default Location;
