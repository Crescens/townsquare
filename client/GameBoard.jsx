import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'underscore';
import $ from 'jquery';
import { toastr } from 'react-redux-toastr';
import { bindActionCreators } from 'redux';

import PlayerStats from './GameComponents/PlayerStats.jsx';
import PlayerRow from './GameComponents/PlayerRow.jsx';
import ActivePlayerPrompt from './GameComponents/ActivePlayerPrompt.jsx';
import CardZoom from './GameComponents/CardZoom.jsx';
<<<<<<< HEAD
import Messages from './GameComponents/Messages.jsx';
import CardCollection from './GameComponents/CardCollection.jsx';
import PlayerStreet from './GameComponents/PlayerStreet.jsx';
import GameLocation from './GameComponents/GameLocation.jsx';
import DropZone from './GameComponents/DropZone.jsx';
import ActionWindowsMenu from './GameComponents/ActionWindowsMenu.jsx';
import {tryParseJSON} from './util.js';
=======
import PlayerBoard from './GameComponents/PlayerBoard.jsx';
import GameChat from './GameComponents/GameChat.jsx';
import PlayerPlots from './GameComponents/PlayerPlots.jsx';
import GameConfigurationModal from './GameComponents/GameConfigurationModal.jsx';
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9

import * as actions from './actions';

const placeholderPlayer = {
    activePlot: null,
    agenda: null,
    cardPiles: {
        bannerCards: [],
        cardsInPlay: [],
        conclavePile: [],
        deadPile: [],
        discardPile: [],
        hand: [],
        outOfGamePile: [],
        plotDeck: [],
        plotDiscard: []
    },
    faction: null,
    firstPlayer: false,
    numDrawCards: 0,
    plotSelected: false,
    stats: null,
    title: null,
    user: null
};

export class InnerGameBoard extends React.Component {
    constructor() {
        super();

        this.onMouseOut = this.onMouseOut.bind(this);
        this.onMouseOver = this.onMouseOver.bind(this);
        this.onDrawClick = this.onDrawClick.bind(this);
        this.onDragDrop = this.onDragDrop.bind(this);
        this.onCardClick = this.onCardClick.bind(this);
        this.onCommand = this.onCommand.bind(this);
        this.onConcedeClick = this.onConcedeClick.bind(this);
        this.onLeaveClick = this.onLeaveClick.bind(this);
        this.onShuffleClick = this.onShuffleClick.bind(this);
        this.onMenuItemClick = this.onMenuItemClick.bind(this);
<<<<<<< HEAD
        this.onOutfitCardClick = this.onOutfitCardClick.bind(this);
=======
        this.sendChatMessage = this.sendChatMessage.bind(this);
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9

        this.state = {
            cardToZoom: undefined,
            showDrawDeck: false,
            spectating: true,
            showActionWindowsMenu: false,
            showCardMenu: {}
        };
    }

    componentDidMount() {
        this.updateContextMenu(this.props);
    }

    componentWillReceiveProps(props) {
        this.updateContextMenu(props);
    }

    updateContextMenu(props) {
        if(!props.currentGame) {
            return;
        }

        let thisPlayer = props.currentGame.players[props.username];

        if(thisPlayer) {
            this.setState({ spectating: false });
        } else {
            this.setState({ spectating: true });
        }

        if(thisPlayer && thisPlayer.selectCard) {
            $('body').addClass('select-cursor');
        } else {
            $('body').removeClass('select-cursor');
        }

        let menuOptions = [
            { text: 'Leave Game', onClick: this.onLeaveClick }
        ];

        if(props.currentGame && props.currentGame.started) {
            if(_.find(props.currentGame.players, p => {
                return p.name === props.username;
            })) {
                menuOptions.unshift({ text: 'Concede', onClick: this.onConcedeClick });
            }

            let spectators = _.map(props.currentGame.spectators, spectator => {
                return <li key={ spectator.id }>{ spectator.name }</li>;
            });

            let spectatorPopup = (
                <ul className='spectators-popup absolute-panel'>
                    { spectators }
                </ul>
            );

            menuOptions.unshift({ text: 'Spectators: ' + props.currentGame.spectators.length, popup: spectatorPopup });

            this.setContextMenu(menuOptions);
        } else {
            this.setContextMenu([]);
        }
    }

    setContextMenu(menu) {
        if(this.props.setContextMenu) {
            this.props.setContextMenu(menu);
        }
    }

    onConcedeClick() {
        this.props.sendGameMessage('concede');
    }

    isGameActive() {
        if(!this.props.currentGame) {
            return false;
        }

        if(this.props.currentGame.winner) {
            return false;
        }

        let thisPlayer = this.props.currentGame.players[this.props.username];
        if(!thisPlayer) {
            thisPlayer = _.toArray(this.props.currentGame.players)[0];
        }

        let otherPlayer = _.find(this.props.currentGame.players, player => {
            return player.name !== thisPlayer.name;
        });

        if(!otherPlayer) {
            return false;
        }

        if(otherPlayer.disconnected || otherPlayer.left) {
            return false;
        }

        return true;
    }

    onLeaveClick() {
        if(!this.state.spectating && this.isGameActive()) {
            toastr.confirm('Your game is not finished, are you sure you want to leave?', {
                onOk: () => {
                    this.props.sendGameMessage('leavegame');
                    this.props.closeGameSocket();
                }
            });

            return;
        }

        this.props.sendGameMessage('leavegame');
        this.props.closeGameSocket();
    }

    onMouseOut() {
        this.props.clearZoom();
    }

    onMouseOver(card) {
        this.props.zoomCard(card);
    }

    onCardClick(card) {
        this.props.sendGameMessage('cardClicked', card.uuid);
    }

<<<<<<< HEAD
    onOutfitCardClick() {
        this.props.sendGameMessage('outfitCardClicked');
    }

=======
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
    onDrawClick() {
        this.props.sendGameMessage('showDrawDeck');

        this.setState({ showDrawDeck: !this.state.showDrawDeck });
    }

    sendChatMessage(message) {
        this.props.sendGameMessage('chat', message);
    }

    onShuffleClick() {
        this.props.sendGameMessage('shuffleDeck');
    }

    onDragDrop(card, source, target) {
        this.props.sendGameMessage('drop', card.uuid, source, target);
    }

<<<<<<< HEAD
    onCardDragStart(event, card, source) {
        var dragData = { card: card, source: source };
        event.dataTransfer.setData('Text', JSON.stringify(dragData));
    }

    getLegend(player, isMe, popupLocation) {
        if(!player || !player.legend || player.legend.code === '') {
            return <div className='legend card-pile vertical panel' />;
        }

        let cards = [];
        let disablePopup = false;
        let title;

        /*
        // Alliance
        if(player.agenda.code === '06018') {
            cards = player.bannerCards;
        } else if(player.agenda.code === '09045') {
            let pile = player.additionalPiles['conclave'];
            cards = pile.cards;
            title = 'Conclave';
            disablePopup = !isMe;
        }*/

        disablePopup = disablePopup || cards.length === 0;

        return (
            <CardCollection className='legend'
                cards={ cards }
                disablePopup={ disablePopup }
                onCardClick={ this.onCardClick }
                onMenuItemClick={ this.onMenuItemClick }
                onMouseOut={ this.onMouseOut }
                onMouseOver={ this.onMouseOver }
                popupLocation={ popupLocation }
                source='legend'
                title={ title }
                topCard={ player.legend } />
        );
    }

    /*
    getSchemePile(player, isMe) {
        let schemePile = player && player.additionalPiles['scheme plots'];

        if(!schemePile) {
            return;
        }

        return (
            <AdditionalCardPile
                className='plot'
                isMe={isMe}
                onMouseOut={this.onMouseOut}
                onMouseOver={this.onMouseOver}
                pile={schemePile}
                spectating={this.state.spectating}
                title='Schemes' />
        );
    }*/
=======
    getPlots(thisPlayer, otherPlayer) {
        let commonProps = {
            cardSize: this.props.user.settings.cardSize,
            onCardClick: this.onCardClick,
            onCardMouseOut: this.onMouseOut,
            onCardMouseOver: this.onMouseOver,
            onDragDrop: this.onDragDrop,
            onMenuItemClick: this.onMenuItemClick
        };
        return (<div className='plots-pane'>
            <PlayerPlots
                { ...commonProps }
                activePlot={ otherPlayer.activePlot }
                agenda={ otherPlayer.agenda }
                direction='reverse'
                isMe={ false }
                plotDeck={ otherPlayer.cardPiles.plotDeck }
                plotDiscard={ otherPlayer.cardPiles.plotDiscard }
                plotSelected={ otherPlayer.plotSelected }
                schemePlots={ otherPlayer.cardPiles.schemePlots } />
            <PlayerPlots
                { ...commonProps }
                activePlot={ thisPlayer.activePlot }
                agenda={ thisPlayer.agenda }
                direction='default'
                isMe
                plotDeck={ thisPlayer.cardPiles.plotDeck }
                plotDiscard={ thisPlayer.cardPiles.plotDiscard }
                plotSelected={ thisPlayer.plotSelected }
                schemePlots={ thisPlayer.cardPiles.schemePlots } />
        </div>);
    }
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9

    onCommand(command, arg, method) {
        let commandArg = arg;

        this.props.sendGameMessage(command, commandArg, method);
    }

    onMenuItemClick(card, menuItem) {
        this.props.sendGameMessage('menuItemClick', card.uuid, menuItem);
    }

    onPromptedActionWindowToggle(option, value) {
        this.props.sendGameMessage('togglePromptedActionWindow', option, value);
    }

    onTimerSettingToggle(option, value) {
        this.props.sendGameMessage('toggleTimerSetting', option, value);
    }

    onKeywordSettingToggle(option, value) {
        this.props.sendGameMessage('toggleKeywordSetting', option, value);
    }

    onTimerExpired() {
        this.props.sendGameMessage('menuButton', null, 'pass');
    }

    onSettingsClick() {
        $('#settings-modal').modal('show');
    }

    render() {
        if(!this.props.currentGame) {
            return <div>Waiting for server...</div>;
        }

        let thisPlayer = this.props.currentGame.players[this.props.username];
        if(!thisPlayer) {
            thisPlayer = _.toArray(this.props.currentGame.players)[0];
        }

        if(!thisPlayer) {
            return <div>Waiting for game to have players or close...</div>;
        }

        let otherPlayer = _.find(this.props.currentGame.players, player => {
            return player.name !== thisPlayer.name;
<<<<<<< HEAD
        });
=======
        }) || placeholderPlayer;

        let boundActionCreators = bindActionCreators(actions, this.props.dispatch);
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9

        return (
            <div className='game-board'>
                <GameConfigurationModal
                    id='settings-modal'
                    keywordSettings={ thisPlayer.keywordSettings }
                    onKeywordSettingToggle={ this.onKeywordSettingToggle.bind(this) }
                    onPromptedActionWindowToggle={ this.onPromptedActionWindowToggle.bind(this) }
                    onTimerSettingToggle={ this.onTimerSettingToggle.bind(this) }
                    promptedActionWindows={ thisPlayer.promptedActionWindows }
                    timerSettings={ thisPlayer.timerSettings } />
                <div className='player-stats-row'>
                    <PlayerStats stats={ otherPlayer.stats }
                        user={ otherPlayer.user } firstPlayer={ otherPlayer.firstPlayer } />
                </div>
                <div className='main-window'>
<<<<<<< HEAD
                    <div className='left-side'>
                        <div className='player-info'>
                            <PlayerStats ghostrock={otherPlayer ? otherPlayer.ghostrock : 0}
                                         influence={otherPlayer ? otherPlayer.influence : 0}
                                         control={otherPlayer ? otherPlayer.totalControl : 0}
                                         user={otherPlayer ? otherPlayer.user : null} />
                            <div className='deck-info'>
                                <div className='deck-type'>
                                    { this.getLegend(otherPlayer, false, 'bottom') }
                                </div>
                                { otherPlayer ? <div className={'first-player-indicator ' + (!thisPlayer.firstPlayer ? '' : 'hidden')}>Winner</div> : ''}
                            </div>
                        </div>
                        <div className='middle'>
                            <div className='middle-right'>
=======
                    { this.getPlots(thisPlayer, otherPlayer) }
                    <div className='board-middle'>
                        <div className='player-home-row'>
                            <PlayerRow
                                agenda={ otherPlayer.agenda }
                                bannerCards={ otherPlayer.cardPiles.bannerCards }
                                conclavePile={ otherPlayer.cardPiles.conclavePile }
                                faction={ otherPlayer.faction }
                                hand={ otherPlayer.cardPiles.hand } isMe={ false }
                                isMelee={ this.props.currentGame.isMelee }
                                numDrawCards={ otherPlayer.numDrawCards }
                                discardPile={ otherPlayer.cardPiles.discardPile }
                                deadPile={ otherPlayer.cardPiles.deadPile }
                                onCardClick={ this.onCardClick }
                                onMouseOver={ this.onMouseOver }
                                onMouseOut={ this.onMouseOut }
                                outOfGamePile={ otherPlayer.cardPiles.outOfGamePile }
                                showHand={ this.props.currentGame.showHand }
                                spectating={ this.state.spectating }
                                title={ otherPlayer.title }
                                cardSize={ this.props.user.settings.cardSize } />
                        </div>
                        <div className='board-inner'>
                            <div className='prompt-area'>
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
                                <div className='inset-pane'>
                                    <ActivePlayerPrompt title={ thisPlayer.menuTitle }
                                        buttons={ thisPlayer.buttons }
                                        controls={ thisPlayer.controls }
                                        promptTitle={ thisPlayer.promptTitle }
                                        onButtonClick={ this.onCommand }
                                        onMouseOver={ this.onMouseOver }
                                        onMouseOut={ this.onMouseOut }
                                        user={ this.props.user }
                                        onTimerExpired={ this.onTimerExpired.bind(this) }
                                        phase={ thisPlayer.phase } />
                                </div>
                            </div>
<<<<<<< HEAD
                        </div>
                        <div className='player-info our-side'>
                            <PlayerStats ghostrock={thisPlayer.ghostrock || 0} influence={thisPlayer.influence || 0}
                                        control={thisPlayer.totalControl} isMe={!this.state.spectating} user={thisPlayer.user} />
                            <div className='deck-info'>
                                <div className={'first-player-indicator ' + (thisPlayer.firstPlayer ? '' : 'hidden')}>Winner</div>
                                <div className='deck-type'>
                                    { this.getLegend(thisPlayer, !this.state.spectating, 'top') }
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='center'>
                        <PlayerRow
                            additionalPiles={otherPlayer ? otherPlayer.additionalPiles : {}}
                            hand={otherPlayer ? otherPlayer.hand : []} isMe={false}
                            drawHand={otherPlayer ? otherPlayer.drawHand : []} isMe={false}
                            numDrawCards={otherPlayer ? otherPlayer.numDrawCards : 0}
                            discardPile={otherPlayer ? otherPlayer.discardPile : []}
                            boothillPile={otherPlayer ? otherPlayer.boothillPile : []}
                            onCardClick={this.onCardClick}
                            onMouseOver={this.onMouseOver}
                            onMouseOut={this.onMouseOut}
                            />
                        <div className='play-area' onDragOver={this.onDragOver} >

                            <div className='player-street'>
                                <PlayerStreet onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut} onClick={this.onCardClick}
                                    owner={otherPlayer} otherPlayer={otherPlayer} thisPlayer={thisPlayer}/>
                            </div>

                            <GameLocation location={{uuid:'townsquare', name:'Town Square'}}
                                cardLocation='townsquare' className='townsquare'
                                onMouseOver={this.onMouseOver}
                                onMouseOut={this.onMouseOut}
                                onDragDrop={this.onDragDrop}
                                onClick={this.onCardClick}
                                otherPlayer={otherPlayer}
                                thisPlayer={thisPlayer}/>

                            <div className='player-street'>
                                <DropZone zone='street-left' onDragDrop={this.onDragDrop} onDragDropEvent={this.onDragDropEvent}/>
                                <PlayerStreet onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut} onClick={this.onCardClick}
                                    owner={thisPlayer} otherPlayer={otherPlayer} thisPlayer={thisPlayer}/>
                                <DropZone zone='street-right' onDragDrop={this.onDragDrop} onDragDropEvent={this.onDragDropEvent}/>
                            </div>

                        </div>
                        <PlayerRow isMe={!this.state.spectating}
                            additionalPiles={thisPlayer.additionalPiles}
                            hand={thisPlayer.hand}
                            handrank={thisPlayer.handrank}
                            drawHand={thisPlayer.drawHand}
                            onCardClick={this.onCardClick}
                            onMouseOver={this.onMouseOver}
                            onMouseOut={this.onMouseOut}
                            numDrawCards={thisPlayer.numDrawCards}
                            onDrawClick={this.onDrawClick}
                            onShuffleClick={this.onShuffleClick}
                            showDrawDeck={this.state.showDrawDeck}
                            drawDeck={thisPlayer.drawDeck}
                            onDragDrop={this.onDragDrop}
                            discardPile={thisPlayer.discardPile}
                            deadPile={thisPlayer.deadPile}
                            spectating={this.state.spectating}
                            onMenuItemClick={this.onMenuItemClick}/>
                    </div>
                </div>
                <div className='right-side'>
                    <CardZoom imageUrl={this.props.cardToZoom ? '/img/cards/' + this.props.cardToZoom.code + '.jpg' : ''}
                        orientation={this.props.cardToZoom ? this.props.cardToZoom.type === 'plot' ? 'horizontal' : 'vertical' : 'vertical'}
                        show={!!this.props.cardToZoom} cardName={this.props.cardToZoom ? this.props.cardToZoom.name : null} />
                    <div className='chat'>
                        <div className='messages panel' ref='messagePanel' onScroll={this.onScroll}>
                            <Messages messages={this.props.currentGame.messages} onCardMouseOver={this.onMouseOver} onCardMouseOut={this.onMouseOut} />
                        </div>
                        <form>
                            <input className='form-control' placeholder='Chat...' onKeyPress={this.onKeyPress} onChange={this.onChange}
                                value={this.state.message} />
                        </form>
=======
                            <div className='play-area'>
                                <PlayerBoard
                                    cardsInPlay={ otherPlayer.cardPiles.cardsInPlay }
                                    onCardClick={ this.onCardClick }
                                    onMenuItemClick={ this.onMenuItemClick }
                                    onMouseOut={ this.onMouseOut }
                                    onMouseOver={ this.onMouseOver }
                                    rowDirection='reverse'
                                    user={ this.props.user } />
                                <PlayerBoard
                                    cardsInPlay={ thisPlayer.cardPiles.cardsInPlay }
                                    onCardClick={ this.onCardClick }
                                    onDragDrop={ this.onDragDrop }
                                    onMenuItemClick={ this.onMenuItemClick }
                                    onMouseOut={ this.onMouseOut }
                                    onMouseOver={ this.onMouseOver }
                                    rowDirection='default'
                                    user={ this.props.user } />
                            </div>
                        </div>
                        <div className='player-home-row our-side'>
                            <PlayerRow isMe={ !this.state.spectating }
                                agenda={ thisPlayer.agenda }
                                bannerCards={ thisPlayer.cardPiles.bannerCards }
                                conclavePile={ thisPlayer.cardPiles.conclavePile }
                                faction={ thisPlayer.faction }
                                hand={ thisPlayer.cardPiles.hand }
                                isMelee={ this.props.currentGame.isMelee }
                                onCardClick={ this.onCardClick }
                                onMouseOver={ this.onMouseOver }
                                onMouseOut={ this.onMouseOut }
                                numDrawCards={ thisPlayer.numDrawCards }
                                onDrawClick={ this.onDrawClick }
                                onShuffleClick={ this.onShuffleClick }
                                outOfGamePile={ thisPlayer.cardPiles.outOfGamePile }
                                showDrawDeck={ this.state.showDrawDeck }
                                drawDeck={ thisPlayer.cardPiles.drawDeck }
                                onDragDrop={ this.onDragDrop }
                                discardPile={ thisPlayer.cardPiles.discardPile }
                                deadPile={ thisPlayer.cardPiles.deadPile }
                                showHand={ this.props.currentGame.showHand }
                                spectating={ this.state.spectating }
                                title={ thisPlayer.title }
                                onMenuItemClick={ this.onMenuItemClick }
                                cardSize={ this.props.user.settings.cardSize } />
                        </div>
                    </div>
                    <div className='right-side'>
                        <CardZoom imageUrl={ this.props.cardToZoom ? '/img/cards/' + this.props.cardToZoom.code + '.png' : '' }
                            orientation={ this.props.cardToZoom ? this.props.cardToZoom.type === 'plot' ? 'horizontal' : 'vertical' : 'vertical' }
                            show={ !!this.props.cardToZoom } cardName={ this.props.cardToZoom ? this.props.cardToZoom.name : null } />
                        <GameChat
                            messages={ this.props.currentGame.messages }
                            onCardMouseOut={ this.onMouseOut }
                            onCardMouseOver={ this.onMouseOver }
                            onSendChat={ this.sendChatMessage } />
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
                    </div>
                </div>
                <div className='player-stats-row'>
                    <PlayerStats { ...boundActionCreators } stats={ thisPlayer.stats } showControls={ !this.state.spectating } user={ thisPlayer.user }
                        firstPlayer={ thisPlayer.firstPlayer } onSettingsClick={ this.onSettingsClick.bind(this) } />
                </div>
            </div>);
    }
}

InnerGameBoard.displayName = 'GameBoard';
InnerGameBoard.propTypes = {
    cardToZoom: PropTypes.object,
    clearZoom: PropTypes.func,
    closeGameSocket: PropTypes.func,
    currentGame: PropTypes.object,
<<<<<<< HEAD
    sendGameMessage: PropTypes.func,
    setContextMenu: PropTypes.func,
    socket: PropTypes.object,
=======
    dispatch: PropTypes.func,
    sendGameMessage: PropTypes.func,
    setContextMenu: PropTypes.func,
    socket: PropTypes.object,
    user: PropTypes.object,
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
    username: PropTypes.string,
    zoomCard: PropTypes.func
};

function mapStateToProps(state) {
    return {
        cardToZoom: state.cards.zoomCard,
        currentGame: state.lobby.currentGame,
        socket: state.lobby.socket,
        user: state.auth.user,
        username: state.auth.username
    };
}

function mapDispatchToProps(dispatch) {
    let boundActions = bindActionCreators(actions, dispatch);
    boundActions.dispatch = dispatch;

    return boundActions;
}

const GameBoard = connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(InnerGameBoard);

export default GameBoard;
