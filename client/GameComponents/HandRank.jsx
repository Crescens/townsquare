import React from 'react';
import PropTypes from 'prop-types';
import 'jquery-nearest';

class HandRank extends React.Component {
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

    render() {
        return (
            <div className='hand-ranks' style={this.props.style} >
                {this.getBestHand()}
                {this.getNextHand()}
            </div>
        );

    }
}

HandRank.displayName = 'HandRank';
HandRank.propTypes = {
    className: PropTypes.string,
    name: PropTypes.string,
    onClick: PropTypes.func,
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func,
    sendGameMessage: PropTypes.func,
    style: PropTypes.object
};

export default HandRank;
