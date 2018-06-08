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

    handRankName(handRank) {

        let rankName = '';

        switch(handRank) {
            case 1:
                rankName = 'High Card';
                break;
            case 2:
                rankName = 'One Pair';
                break;
            case 3:
                rankName = 'Two Pair';
                break;
            case 4:
                rankName = 'Three of a Kind';
                break;
            case 5:
                rankName = 'Straight';
                break;
            case 6:
                rankName = 'Flush';
                break;
            case 7:
                rankName = 'Full House';
                break;
            case 8:
                rankName = 'Four of a Kind';
                break;
            case 9:
                rankName = 'Straight Flush';
                break;
            case 10:
                rankName = 'Five of a Kind';
                break;
            case 11:
                rankName = 'Dead Man\'s Hand';
                break;  
            default:
                break;
        }

        return rankName;
    }

    render() {

        let rank = this.props.handRank;

        return (
            <div className='hand-ranks' style={this.props.style} >
                <div className='rank'>{(rank > 0) ? rank : ''}</div>
                <div className='rank-name'>{this.handRankName(rank)}</div>
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
