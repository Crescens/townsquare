import React from 'react';
import { connect } from 'react-redux';

import DeckSummary from './DeckSummary.jsx';
import DeckEditor from './DeckEditor.jsx';
import AlertPanel from './SiteComponents/AlertPanel.jsx';

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

    componentWillUpdate() {
        if(this.props.deckSaved) {
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
                <DeckEditor mode='Add' onDeckSave={ this.onAddDeck } />
                <DeckSummary className='col-sm-6 right-pane' cards={ this.props.cards } deck={ this.props.deck } />
            </div>);
        }

        return content;
    }
}

InnerAddDeck.displayName = 'InnerAddDeck';
InnerAddDeck.propTypes = {
    addDeck: React.PropTypes.func,
    apiError: React.PropTypes.string,
    cards: React.PropTypes.object,
    deck: React.PropTypes.object,
    deckSaved: React.PropTypes.bool,
    legends: React.PropTypes.object,
    loading: React.PropTypes.bool,
    navigate: React.PropTypes.func,
    outfits: React.PropTypes.object,
    saveDeck: React.PropTypes.func
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
        socket: state.socket.socket
    };
}

const AddDeck = connect(mapStateToProps, actions)(InnerAddDeck);

export default AddDeck;
