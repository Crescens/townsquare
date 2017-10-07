import React from 'react';
import PropTypes from 'prop-types';
//import _ from 'underscore';
//import $ from 'jquery';
import 'jquery-nearest';

class Location extends React.Component {

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
                            <img className={imageClass} src={'/img/cards/' + (this.props.location.code + '.jpg')} />
                        </div>
                    </div>
                </div>);
    }

    getCards() {

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

Location.displayName = 'Location';
Location.propTypes = {
    cardLocation: PropTypes.bool.isRequired,
    cards: PropTypes.array,
    className: PropTypes.string,
    location: PropTypes.object.isRequired,
    name: PropTypes.string,
    style: PropTypes.object
};
Location.defaultProps = {
//    orientation: 'vertical',
//    wrapped: true
};

export default Location;
