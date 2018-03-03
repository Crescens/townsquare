import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import DeckSummary from './DeckSummary';
import DeckEditor from './DeckEditor';
import AlertPanel from './SiteComponents/AlertPanel';
import Panel from './SiteComponents/Panel';

import * as actions from './actions';

export class InnerAddDeck extends React.Component {
    constructor() {
        super();

        this.state = {
            error: '',
            outfit: {}
        };

        this.onAddDeck = this.onAddDeck.bind(this);
    }

    componentWillMount() {
        this.props.addDeck();
    }

    componentWillUpdate(props) {
        if(props.deckSaved) {
            this.props.navigate('/decks');

            return;
        }
    }

    onAddDeck(deck) {
        this.props.saveDeck(deck);
    }

    render() {
        let content;

        if(this.props.loading) {
            content = <div>Loading decks from the server...</div>;
        } else if(this.props.apiError) {
            content = <AlertPanel type='error' message={ this.props.apiError } />;
        } else {
            content = (
                <div>
                    <div className='col-sm-6'>
                        <Panel title='Deck Editor'>
                            <DeckEditor onDeckSave={ this.onAddDeck } />
                        </Panel>
                    </div>
                    <div className='col-sm-6'>
                        <Panel title={ this.props.deck ? this.props.deck.name : 'New Deck' }>
                            <DeckSummary cards={ this.props.cards } deck={ this.props.deck } />
                        </Panel>
                    </div>
                </div>);
        }

        return content;
    }
}

InnerAddDeck.displayName = 'InnerAddDeck';
InnerAddDeck.propTypes = {
    addDeck: PropTypes.func,
    apiError: PropTypes.string,
    cards: PropTypes.object,
    deck: PropTypes.object,
    deckSaved: PropTypes.bool,
    legends: PropTypes.object,
    loading: PropTypes.bool,
    navigate: PropTypes.func,
    outfits: PropTypes.object,
    saveDeck: PropTypes.func
};

function mapStateToProps(state) {
    return {
        apiError: state.api.message,
        cards: state.cards.cards,
        deck: state.cards.selectedDeck,
        deckSaved: state.cards.deckSaved,
        legends: state.cards.legends,
        loading: state.api.loading,
        outfits: state.cards.outfits,
        socket: state.lobby.socket
    };
}

const AddDeck = connect(mapStateToProps, actions)(InnerAddDeck);

export default AddDeck;
