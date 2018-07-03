import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Avatar from '../Avatar.jsx';

import * as actions from '../actions';

export class InnerPlayerStats extends React.Component {
    constructor() {
        super();

        this.sendUpdate = this.sendUpdate.bind(this);
    }

    sendUpdate(type, direction) {
        this.props.sendGameMessage('changeStat', type, direction === 'up' ? 1 : -1);
    }

    render() {
        var playerAvatar = this.props.user ? (
                    <div className='player-avatar' key={this.props.user.id}>
                        <Avatar emailHash={this.props.user.emailHash} /><b>{this.props.user.username}</b>
                    </div>) : null;

        return (
            <div className='panel player-stats'>
                { this.props.isMe ? null : playerAvatar }
                <div className='values'>
                    <div className='state'>
                        <img src='/img/Control.png' title='Control' alt='Control' height='26' width='26' />
                        <div className='value'>{this.props.control}</div>
                    </div>
                    <div className='state'>
                        <img src='/img/Influence.png' title='Influence' alt='Influence' height='26' width='26' />
                        <div className='value'>{this.props.influence}</div>
                    </div>
                    <div className='state'>
                        <img src='/img/GhostRock.png' title='Ghost Rock' alt='Ghost Rock' height='26' width='26'/> 
                        <div className='value'>{this.props.ghostrock}</div>
                        {this.props.isMe ?
                            <div className='pull-right'>
                                <button className='btn btn-stat' onClick={this.sendUpdate.bind(this, 'ghostrock', 'down')}><img src='/img/Minus.png' title='-' alt='-' /></button>
                                <button className='btn btn-stat' onClick={this.sendUpdate.bind(this, 'ghostrock', 'up')}><img src='/img/Plus.png' title='+' alt='+' /></button>
                            </div> :
                            null}
                    </div>
                </div>
                { this.props.isMe ? playerAvatar : null }
            </div>
        );
    }
}

InnerPlayerStats.displayName = 'PlayerStats';
InnerPlayerStats.propTypes = {
    claim: PropTypes.number,
    control: PropTypes.number,
    ghostrock: PropTypes.number,
    influence: PropTypes.number,
    isMe: PropTypes.bool,
    playerName: PropTypes.string,
    sendGameMessage: PropTypes.func,
    user: PropTypes.object
};

function mapStateToProps() {
    return {};
}

const PlayerStats = connect(mapStateToProps, actions)(InnerPlayerStats);

export default PlayerStats;
