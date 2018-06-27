import _ from 'underscore';
import React from 'react';
import PropTypes from 'prop-types';

import {tryParseJSON} from '../util.js';

class Hand extends React.Component {
    constructor() {
        super();

        this.onDragDrop = this.onDragDrop.bind(this);

        this.state = {
            showMenu: false
        };
    }

    onHandClick(event) {
        event.preventDefault();

        if(this.props.menu) {
            this.setState({ showMenu: !this.state.showMenu });
            return;
        }
    }

    getMenu() {
        var menuIndex = 0;

        var menu = _.map(this.props.menu, item => {
            return <div key={(menuIndex++).toString()} onClick={this.onMenuItemClick.bind(this, item)}>{item.text}</div>;
        });

        return (
            <div className='panel menu'>
                {menu}
            </div>);
    }

    onMenuItemClick(menuItem) {
        if(menuItem.showPopup) {
            this.setState({ showPopup: !this.state.showPopup });
        }

        menuItem.handler();
    }

    onDragDrop(event, target) {
        event.stopPropagation();
        event.preventDefault();

        var card = event.dataTransfer.getData('Text');

        if(!card) {
            return;
        }

        var dragData = tryParseJSON(card);

        if(!dragData) {
            return;
        }

        if(this.props.onDragDrop) {
            this.props.onDragDrop(dragData.card, dragData.source, target);
        }
    }


    render() {

        let handClass = this.props.className;
        let hand = this.props.hand;
        let name = this.props.name;
        let lower = name.toLowerCase();

        return (
        <div className={handClass} onDragLeave={this.props.onDragLeave(event)} onDrop={this.props.onDragDrop(event, lower)} onDragOver={this.props.onDragOver(event)} onClick={this.onHandClick(event)}>
            <div className='panel-header'>
                {name + ' (' + hand.length + ')'}
            </div>
            {hand}
        </div>
        ); 
    }
}

Hand.displayName = 'Hand';
Hand.propTypes = {
    className: PropTypes.string,
    hand: PropTypes.array.isRequired,
    menu: PropTypes.array,
    name: PropTypes.string,
    onDragDrop: PropTypes.func,
    onDragLeave: PropTypes.func,
    onDragOver: PropTypes.func  
};

export default Hand;
