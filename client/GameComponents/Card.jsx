import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import $ from 'jquery';
//import 'jquery-migrate'; -- Removed due to errors with webpack and I can't figure out why this is still needed
import 'jquery-nearest';
import 'react-logger';

import CardMenu from './CardMenu.jsx';
import CardCounters from './CardCounters.jsx';

class Card extends React.Component {
    constructor() {
        super();

        this.onMouseOver = this.onMouseOver.bind(this);
        this.onMouseOut = this.onMouseOut.bind(this);
        this.onMenuItemClick = this.onMenuItemClick.bind(this);

        this.state = {
            showMenu: false
        };

        this.shortNames = {
            stand: 'T',
            poison: 'O',
            gold: 'G',
            valarmorghulis: 'V',
            betrayal: 'B',
            vengeance: 'N',
            ear: 'E',
            venom: 'M',
            kiss: 'K'
        };
    }

    onMouseOver(card) {
        if(this.props.onMouseOver) {
            this.props.onMouseOver(card);
        }
    }

    onMouseOut() {
        if(this.props.onMouseOut) {
            this.props.onMouseOut();
        }
    }

    onCardDragStart(event, card, source) {
        var dragData = { card: card, source: source };

        event.dataTransfer.setData('Text', JSON.stringify(dragData));
    }

    onTouchMove(event) {
        event.preventDefault();
        var touch = event.targetTouches[0];

        event.currentTarget.style.left = touch.pageX - 32 + 'px';
        event.currentTarget.style.top = touch.pageY - 42 + 'px';
        event.currentTarget.style.position = 'fixed';
    }

    getReactComponentFromDOMNode(dom) {
        for(var key in dom) {
            if(key.indexOf('__reactInternalInstance$') === 0) {
                var compInternals = dom[key]._currentElement;
                var compWrapper = compInternals._owner;
                var comp = compWrapper._instance;
                return comp;
            }
        }

        return null;
    }

    onTouchStart(event) {
        this.setState({ touchStart: $(event.currentTarget).position() });
    }

    onTouchEnd(event) {
        var target = $(event.currentTarget);
        var nearestLocation = target.nearest('.location');
        var nearestPile = target.nearest('.card-pile, .hand, .player-board, .left-side');

        var pilePosition = nearestPile.position();
        var cardPosition = target.position();

        if(cardPosition.left + target.width() > pilePosition.left - 10 && cardPosition.left < pilePosition.left + nearestPile.width() + 10) {
            var dropTarget = '';

            if(_.includes(nearestPile.attr('class'), 'hand')) {
                dropTarget = 'hand';
            } else if(_.includes(nearestPile.attr('class'), 'player-board')) {
                dropTarget = nearestLocation;
            } else if(_.includes(nearestPile.attr('class'), 'left-side')) {
                dropTarget = nearestLocation;
            } else {
                var component = this.getReactComponentFromDOMNode(nearestPile[0]);
                dropTarget = component.props.source;
            }

            if(dropTarget && this.props.onDragDrop) {
                this.props.onDragDrop(this.props.card, this.props.source, dropTarget);
            }
        }

        target.css({left: this.state.touchStart.left + 'px', top: this.state.touchStart.top + 'px'});
        event.currentTarget.style.position = 'initial';
    }

    isAllowedMenuSource() {
        return this.props.source === 'play area' || this.props.source === 'legend' || this.props.source === 'revealed plots';
    }

    onClick(event, card) {
        event.preventDefault();
        event.stopPropagation();

        if(this.isAllowedMenuSource() && !_.isEmpty(this.props.card.menu)) {
            this.setState({showMenu: !this.state.showMenu});

            return;
        }

        if(this.props.onClick) {
            this.props.onClick(card);
        }
    }

    onMenuItemClick(menuItem) {
        if(this.props.onMenuItemClick) {
            this.props.onMenuItemClick(this.props.card, menuItem);
            this.setState({showMenu: !this.state.showMenu});
        }
    }

    getCountersForCard(card) {
        let counters = {};

        
        if(card.shooter === 'Draw') {
            counters['card-bullets-draw'] = card.bullets ? { count: card.bullets, fade: card.type === 'attachment', shortName: 'D' } : undefined;
        } else if(card.shooter === 'Stud') {
            counters['card-bullets-stud'] = card.bullets ? { count: card.bullets, fade: card.type === 'attachment', shortName: 'S' } : undefined;
        }
        
        counters['card-control'] = card.control ? { count: card.control, fade: card.type === 'attachment', shortName: 'C' } : undefined;
        counters['card-influence'] = card.influence ? { count: card.influence, fade: card.type === 'attachment', shortName: 'I' } : undefined;
        counters['card-bounty'] = card.bounty ? { count: card.bounty, fade: card.type === 'attachment', shortName: 'B' } : undefined;
        
        _.map(card.iconsAdded, icon => {
            counters[icon] = { count: 0, cancel: false };
        });

        _.map(card.iconsRemoved, icon => {
            counters[icon] = { count: 0, cancel: true };
        });

        _.each(card.tokens, (token, key) => {
            counters[key] = { count: token, fade: card.type === 'attachment', shortName: this.shortNames[key] };
        });

        _.each(card.attachments, attachment => {
            _.extend(counters, this.getCountersForCard(attachment));
        });

        var filteredCounters = _.omit(counters, counter => {
            return _.isUndefined(counter) || _.isNull(counter) || counter < 0;
        });

        return filteredCounters;
    }

    getAttachments() {
        if(this.props.source !== 'play area') {
            return null;
        }

        var index = 1;
        var attachments = _.map(this.props.card.attachments, attachment => {
            var returnedAttachment = (<Card key={attachment.uuid} source={this.props.source} card={attachment} className={'attachment attachment-' + index} wrapped={false}
                            onMouseOver={this.props.disableMouseOver ? null : this.onMouseOver.bind(this, attachment)}
                            onMouseOut={this.props.disableMouseOver ? null : this.onMouseOut}
                            onClick={this.props.onClick}
                            onMenuItemClick={this.props.onMenuItemClick}
                            onDragStart={ev => this.onCardDragStart(ev, attachment, this.props.source)} />);

            index += 1;

            return returnedAttachment;
        });

        return attachments;
    }

    getCardOrder() {
        if(!this.props.card.order) {
            return null;
        }

        return (<div className='card-order'>{this.props.card.order}</div>);
    }

    showMenu() {
        if(!this.isAllowedMenuSource()) {
            return false;
        }

        if(!this.props.card.menu || !this.state.showMenu) {
            return false;
        }

        return true;
    }

    showCounters() {
        if(this.props.source !== 'play area') {
            return false;
        }

        if(this.props.card.facedown || this.props.card.type === 'attachment') {
            return false;
        }

        return true;
    }

    isFacedown() {
        return this.props.card.facedown || !this.props.card.code;
    }

    getCard() {
        var cardClass = 'card';
        var imageClass = 'card-image';

        if(!this.props.card) {
            return <div />;
        }

        cardClass += ' card-type-' + this.props.card.type;

        if(this.props.orientation === 'booted' || this.props.card.booted || this.props.orientation === 'horizontal' && this.props.card.type !== 'plot') {
            cardClass += ' horizontal';
            imageClass += ' vertical booted';
        } else if(this.props.orientation === 'horizontal') {
            cardClass += ' horizontal';
            imageClass += ' horizontal';
        } else {
            cardClass += ' vertical';
            imageClass += ' vertical';
        }

        if(this.props.card.unselectable) {
            cardClass += ' unselectable';
        }

        if(this.props.card.selected) {
            cardClass += ' selected';
        } else if(this.props.card.selectable) {
            cardClass += ' selectable';
        } else if(this.props.card.inDanger) {
            cardClass += ' in-danger';
        } else if(this.props.card.saved) {
            cardClass += ' saved';
        } else if(this.props.card.inChallenge) {
            cardClass += ' challenge';
        } else if(this.props.card.stealth) {
            cardClass += ' stealth';
        } else if(this.props.card.controlled) {
            cardClass += ' controlled';
        } else if(this.props.card.new) {
            cardClass += ' new';
        }

        if(this.props.className) {
            cardClass += ' ' + this.props.className;
        }

        return (
                <div className='card-frame' ref='cardFrame'
                    onTouchMove={ev => this.onTouchMove(ev)}
                    onTouchEnd={ev => this.onTouchEnd(ev)}
                    onTouchStart={ev => this.onTouchStart(ev)}>
                    {this.getCardOrder()}
                    <div className={cardClass}
                        onMouseOver={this.props.disableMouseOver ? null : this.onMouseOver.bind(this, this.props.card)}
                        onMouseOut={this.props.disableMouseOver ? null : this.onMouseOut}
                        onClick={ev => this.onClick(ev, this.props.card)}
                        onDragStart={ev => this.onCardDragStart(ev, this.props.card, this.props.source)}
                        draggable>
                            <span className='card-name'>{this.props.card.name}</span>
                            <img className={imageClass} src={'/img/cards/' + (!this.isFacedown() ? (this.props.card.code + '.jpg') : 'cardback.jpg')} />
                        { this.showCounters() ? <CardCounters counters={ this.getCountersForCard(this.props.card) } /> : null }
                    </div>
                    { this.showMenu() ? <CardMenu menu={ this.props.card.menu } onMenuItemClick={ this.onMenuItemClick } /> : null }
                </div>);
    }

    render() {
        if(this.props.wrapped) {
            return (
                    <div className='card-wrapper' style={this.props.style}>
                        {this.getCard()}
                        {this.getAttachments()}
                    </div>);
        }

        return this.getCard();
    }
}

Card.displayName = 'Card';
Card.propTypes = {
    card: PropTypes.shape({
        attached: PropTypes.bool,
        attachments: PropTypes.array,
        baseStrength: PropTypes.number,
        booted: PropTypes.bool,
        bullets: PropTypes.number,
        code: PropTypes.string,
        cost: PropTypes.number,
        controlled: PropTypes.bool,
        dupes: PropTypes.array,
        facedown: PropTypes.bool,
        gamelocation: PropTypes.string,
        iconsAdded: PropTypes.array,
        iconsRemoved: PropTypes.array,
        inChallenge: PropTypes.bool,
        inDanger: PropTypes.bool,
        menu: PropTypes.array,
        name: PropTypes.string,
        new: PropTypes.bool,
        order: PropTypes.number,
        power: PropTypes.number,
        production: PropTypes.number,
        saved: PropTypes.bool,
        selectable: PropTypes.bool,
        selected: PropTypes.bool,
        stealth: PropTypes.bool,
        strength: PropTypes.number,
        tokens: PropTypes.object,
        type: PropTypes.string,
        unselectable: PropTypes.bool
    }).isRequired,
    className: PropTypes.string,
    disableMouseOver: PropTypes.bool,
    onClick: PropTypes.func,
    onDragDrop: PropTypes.func,
    onMenuItemClick: PropTypes.func,
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func,
    orientation: PropTypes.oneOf(['horizontal', 'booted', 'vertical']),
    source: PropTypes.oneOf(['hand', 'discard pile', 'play area', 'boothill pile', 'draw deck', 'draw hand', 'attachment', 'legend', 'outfit', 'additional']).isRequired,
    style: PropTypes.object,
    wrapped: PropTypes.bool
};
Card.defaultProps = {
    orientation: 'vertical',
    wrapped: true
};

export default Card;
