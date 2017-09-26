import React from 'react';
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
                {playerAvatar}
                <div className='state'>
                    <span><img src='/img/ghostrock.png' title='Ghost Rock' alt='Ghost Rock' height='26' width='26'/> {this.props.ghostrock}</span>
                    {this.props.isMe ?
                        <div className='pull-right'>
                            <button className='btn btn-stat' onClick={this.sendUpdate.bind(this, 'ghostrock', 'down')}><img src='/img/Minus.png' title='-' alt='-' /></button>
                            <button className='btn btn-stat' onClick={this.sendUpdate.bind(this, 'ghostrock', 'up')}><img src='/img/Plus.png' title='+' alt='+' /></button>
                        </div> :
                        null}
                </div>
                <div className='state'>
                    <span><img src='/img/control.png' title='Control' alt='Control' height='26' width='26' /> {this.props.control}</span>
                    {this.props.isMe ?
                        <div className='pull-right'>
                            <span className='btn btn-stat' onClick={this.sendUpdate.bind(this, 'control', 'down')}><img src='/img/Minus.png' title='-' alt='-' /></span>
                            <span className='btn btn-stat' onClick={this.sendUpdate.bind(this, 'control', 'up')}><img src='/img/Plus.png' title='+' alt='+' /></span>
                        </div> :
                        null}
                </div>
                <div className='state'>
                    <span><img src='/img/Influence.png' title='Influence' alt='Influence' height='26' width='26' /> {this.props.influence}</span>
                    {this.props.isMe ?
                        <div className='pull-right'>
                            <span className='btn btn-stat' onClick={this.sendUpdate.bind(this, 'influence', 'down')}><img src='/img/Minus.png' title='-' alt='-' /></span>
                            <span className='btn btn-stat' onClick={this.sendUpdate.bind(this, 'influence', 'up')}><img src='/img/Plus.png' title='+' alt='+' /></span>
                        </div> :
                        null}
                </div>
                <div className='state'>
                    <span><img src='/img/Claim.png' title='Claim' alt='Claim' /> {this.props.claim}</span>
                    {this.props.isMe ?
                        <div className='pull-right'>
                            <span className='btn btn-stat' onClick={this.sendUpdate.bind(this, 'claim', 'down')}><img src='/img/Minus.png' title='-' alt='-' /></span>
                            <span className='btn btn-stat' onClick={this.sendUpdate.bind(this, 'claim', 'up')}><img src='/img/Plus.png' title='+' alt='+' /></span>
                        </div> :
                        null}
                </div>
            </div>
        );
    }
}

InnerPlayerStats.displayName = 'PlayerStats';
InnerPlayerStats.propTypes = {
    claim: React.PropTypes.number,
    gold: React.PropTypes.number,
    isMe: React.PropTypes.bool,
    playerName: React.PropTypes.string,
    power: React.PropTypes.number,
    reserve: React.PropTypes.number,
    sendGameMessage: React.PropTypes.func,
    user: React.PropTypes.object
};

function mapStateToProps() {
    return {};
}

const PlayerStats = connect(mapStateToProps, actions)(InnerPlayerStats);

export default PlayerStats;
