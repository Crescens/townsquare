import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';

import CardCollection from './CardCollection.jsx';

class AdditionalCardPile extends React.Component {
    render() {
        var topCard = _.last(this.props.pile.cards);
        if(this.props.pile.isPrivate) {
            topCard = { facedown: true, booted: true };
        } else if(topCard.facedown) {
            topCard.booted = true;
        }

        return (
            <CardCollection
                className={this.props.className}
                title={this.props.title}
                source='additional'
                cards={this.props.pile.cards}
                topCard={topCard}
                onMouseOver={this.props.onMouseOver}
                onMouseOut={this.props.onMouseOut}
                popupLocation={this.props.isMe || this.props.spectating ? 'top' : 'bottom'}
                disablePopup={this.props.pile.isPrivate && !(this.props.isMe || this.props.spectating)}
                orientation='horizontal' />
        );
    }
}

AdditionalCardPile.displayName = 'AdditionalCardPile';
AdditionalCardPile.propTypes = {
    className: PropTypes.string,
    isMe: PropTypes.bool,
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func,
    pile: PropTypes.object,
    spectating: PropTypes.bool,
    title: PropTypes.string
};

export default AdditionalCardPile;
