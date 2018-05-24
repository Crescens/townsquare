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

    render() {
        return (
            <div className='hand-ranks' style={this.props.style} >
                {this.props.handRank}
            </div>
        );

    }
}

HandRank.displayName = 'HandRank';
HandRank.propTypes = {
    //Leaving unimplemented properties for extension thoughts
    className: PropTypes.string,
    handRank: PropTypes.number,
    name: PropTypes.string,
    onClick: PropTypes.func,
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func,
    sendGameMessage: PropTypes.func,
    style: PropTypes.object
};

export default HandRank;
