import React from 'react';
import PropTypes from 'prop-types';
<<<<<<< HEAD
import { connect } from 'react-redux';
=======
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9

import Avatar from '../Avatar.jsx';

export class PlayerStats extends React.Component {
    constructor() {
        super();

        this.sendUpdate = this.sendUpdate.bind(this);
    }

    sendUpdate(type, direction) {
        this.props.sendGameMessage('changeStat', type, direction === 'up' ? 1 : -1);
    }

    getStatValueOrDefault(stat) {
        if(!this.props.stats) {
            return 0;
        }

        return this.props.stats[stat] || 0;
    }

    getButton(stat, name, statToSet = stat) {
        return (
            <div className='state'>
                <span><img src={ '/img/' + name + '.png' } title={ name } alt={ name } /></span>
                { this.props.showControls ? <button className='btn btn-stat' onClick={ this.sendUpdate.bind(this, statToSet, 'down') }>
                    <img src='/img/Minus.png' title='-' alt='-' />
                </button> : null }

                <span>{ this.getStatValueOrDefault(stat) }</span>
                { this.props.showControls ? <button className='btn btn-stat' onClick={ this.sendUpdate.bind(this, statToSet, 'up') }>
                    <img src='/img/Plus.png' title='+' alt='+' />
                </button> : null }
            </div>
        );
    }

    onSettingsClick(event) {
        event.preventDefault();

        if(this.props.onSettingsClick) {
            this.props.onSettingsClick();
        }
    }

    render() {
        var playerAvatar = (
            <div className='player-avatar'>
                <Avatar emailHash={ this.props.user ? this.props.user.emailHash : 'unknown' } />
                <b>{ this.props.user ? this.props.user.username : 'Noone' }</b>
            </div>);

        return (
            <div className='panel player-stats'>
<<<<<<< HEAD
                {playerAvatar}
                <div className='state'>
                    <span><img src='/img/GhostRock.png' title='Ghost Rock' alt='Ghost Rock' height='26' width='26'/> {this.props.ghostrock}</span>
                    {this.props.isMe ?
                        <div className='pull-right'>
                            <button className='btn btn-stat' onClick={this.sendUpdate.bind(this, 'ghostrock', 'down')}><img src='/img/Minus.png' title='-' alt='-' /></button>
                            <button className='btn btn-stat' onClick={this.sendUpdate.bind(this, 'ghostrock', 'up')}><img src='/img/Plus.png' title='+' alt='+' /></button>
                        </div> :
                        null}
                </div>
                <div className='state'>
                    <span><img src='/img/Control.png' title='Control' alt='Control' height='26' width='26' /> {this.props.control}</span>
                </div>
                <div className='state'>
                    <span><img src='/img/Influence.png' title='Influence' alt='Influence' height='26' width='26' /> {this.props.influence}</span>
                </div>
=======
                { playerAvatar }

                { this.getButton('gold', 'Gold') }
                { this.getButton('totalPower', 'Power', 'power') }
                { this.getButton('reserve', 'Reserve') }
                { this.getButton('claim', 'Claim') }

                { this.props.firstPlayer ? <div className='state'><div className='first-player'>First player</div></div> : null }

                { this.props.showControls ? <div className='state'>
                    <button className='btn btn-transparent' onClick={ this.onSettingsClick.bind(this) }><span className='glyphicon glyphicon-cog' />Settings</button>
                </div> : null }
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
            </div>
        );
    }
}

<<<<<<< HEAD
InnerPlayerStats.displayName = 'PlayerStats';
InnerPlayerStats.propTypes = {
    claim: PropTypes.number,
    control: PropTypes.number,
    ghostrock: PropTypes.number,
    influence: PropTypes.number,
    isMe: PropTypes.bool,
    playerName: PropTypes.string,
    sendGameMessage: PropTypes.func,
=======
PlayerStats.displayName = 'PlayerStats';
PlayerStats.propTypes = {
    firstPlayer: PropTypes.bool,
    onSettingsClick: PropTypes.func,
    playerName: PropTypes.string,
    sendGameMessage: PropTypes.func,
    showControls: PropTypes.bool,
    stats: PropTypes.object,
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
    user: PropTypes.object
};

export default PlayerStats;
