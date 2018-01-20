import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import $ from 'jquery';
import {connect} from 'react-redux';

import Input from './FormComponents/Input.jsx';
import Select from './FormComponents/Select.jsx';
import Typeahead from './FormComponents/Typeahead.jsx';
import TextArea from './FormComponents/TextArea.jsx';

import * as actions from './actions';

class InnerDeckEditor extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            cardList: '',
            deck: this.copyDeck(props.deck),
            numberToAdd: 1,
            showLegends: props.deck.legends,
            validation: {
                deckname: '',
                cardToAdd: ''
            }
        };
    }

    componentWillMount() {
        if(!this.props.deck.outfit && this.props.outfits) {
            let deck = this.copyDeck(this.state.deck);

            //deck.outfit = {};

            this.setState({ deck: deck });
            this.props.updateDeck(deck);
        }

        let cardList = '';

        if(this.props.deck && (this.props.deck.drawCards || this.props.deck.plotCards)) {
            _.each(this.props.deck.drawCards, card => {
                cardList += '*'.repeat(card.starting) + card.count + ' ' + card.card.title + '\n';
            });

            this.setState({ cardList: cardList });
        }
    }

    // XXX One could argue this is a bit hacky, because we're updating the innards of the deck object, react doesn't update components that use it unless we change the reference itself
    copyDeck(deck) {
        if(!deck) {
            return { name: 'New Deck' };
        }

        return {
            _id: deck._id,
            name: deck.name,
            plotCards: deck.plotCards,
            drawCards: deck.drawCards,
            outfit: deck.outfit,
            legend: deck.legend,
            validation: deck.validation
        };
    }

    onChange(field, event) {
        let deck = this.copyDeck(this.state.deck);

        deck[field] = event.target.value;

        this.setState({ deck: deck });
        this.props.updateDeck(deck);
    }

    onNumberToAddChange(event) {
        this.setState({ numberToAdd: event.target.value });
    }

    onOutfitChange(selectedOutfit) {
        let deck = this.copyDeck(this.state.deck);

        deck.outfit = selectedOutfit;

        this.setState({ deck: deck });
        this.props.updateDeck(deck);
    }

    onLegendChange(selectedLegend) {
        let deck = this.copyDeck(this.state.deck);

        deck.legend = selectedLegend;

        this.setState({ deck: deck, showLegends: deck.legend });
        this.props.updateDeck(deck);
    }

    addCardChange(selectedCards) {
        this.setState({ cardToAdd: selectedCards[0] });
    }

    onAddCard(event) {
        event.preventDefault();

        if(!this.state.cardToAdd || !this.state.cardToAdd.title) {
            return;
        }

        let cardList = this.state.cardList;
        cardList += this.state.numberToAdd + ' ' + this.state.cardToAdd.title + '\n';

        this.addCard(this.state.cardToAdd, parseInt(this.state.numberToAdd));
        this.setState({ cardList: cardList });
        let deck = this.state.deck;

        deck = this.copyDeck(deck);

        this.props.updateDeck(deck);
    }

    onCardListChange(event) {
        let deck = this.state.deck;

        let split = event.target.value.split('\n');

        let headerMark = _.findIndex(split, line => line.match(/^Packs:/));
        if(headerMark >= 0) { // DB-style deck header found
                              // extract deck title, outfit, legend
            let header = _.filter(_.first(split, headerMark), line => line !== '');
            split = _.rest(split, headerMark);

            if(header.length >= 2) {
                deck.name = header[0];

                let outfit = _.find(this.props.outfits, outfit => outfit.name === header[1].trim());
                if(outfit) {
                    deck.outfit = outfit;
                }

                header = _.rest(header, 2);

                if(header.length >= 1) {
                    let rawLegend;

                    rawLegend = header[0].trim();

                    let legend = _.find(this.props.legends, legend => legend.name === rawLegend);
                    if(legend) {
                        deck.legend = legend;
                    }

                }
            }
        }

        deck.plotCards = [];
        deck.drawCards = [];

        _.each(split, line => {
            line = line.trim();

            let starting = 0;
            let quantity = line.split(' ', 1).pop();
            let cardName = line.replace(quantity, '').trim();

            starting = (quantity.match(/\*/g) || []).length;

            quantity = quantity.replace('*', '');

            if(!$.isNumeric(quantity[0])) {
                return;
            }

            let num = parseInt(quantity[0]);

            let card = _.find(this.props.cards, (card) => {

                /* -- Pack Data is not included in DTDB data. Parens are used for Experienced and Joker

                if(pack) {
                    return card.title.toLowerCase() === cardName.toLowerCase() || card.title.toLowerCase() === (cardName + ' (' + pack.code + ')').toLowerCase();
                }
                */

                return card.title.toLowerCase() === cardName.toLowerCase();
            });

            if(card) {
                this.addCard(card, num, starting);
            }
        });

        deck = this.copyDeck(deck);

        this.setState({ cardList: event.target.value, deck: deck, showLegends: deck.legend });
        this.props.updateDeck(deck);
    }

    addCard(card, number, starting) {
        let deck = this.copyDeck(this.state.deck);
        //let plots = deck.plotCards;
        let draw = deck.drawCards;

        let list;

        list = draw;

        if(list[card.code]) {
            list[card.code].count += number;
        } else {
            list.push({ count: number, card: card, starting: starting });
        }
    }

    onSaveClick(event) {
        event.preventDefault();

        if(this.props.onDeckSave) {
            this.props.onDeckSave(this.props.deck);
        }
    }

    render() {
        if(!this.props.deck || this.props.loading) {
            return <div>Waiting for deck...</div>;
        }

        return (
            <div className='col-sm-6'>
                <h2>Deck Editor</h2>
                <h4>Either type the cards manually into the box below, add the cards one by one using the card box and autocomplete or for best results, copy and paste a decklist from DTDB into the box below.</h4>
                <form className='form form-horizontal'>
                    <Input name='deckName' label='Deck Name' labelClass='col-sm-3' fieldClass='col-sm-9' placeholder='Deck Name'
                        type='text' onChange={this.onChange.bind(this, 'name')} value={ this.state.deck.name } />
                    <Select name='outfit' label='Outfit' labelClass='col-sm-3' fieldClass='col-sm-9' options={ _.toArray(this.props.outfits) }
                        onChange={ this.onOutfitChange.bind(this) } value={ this.state.deck.outfit ? this.state.deck.outfit.title : undefined }
                        valueKey='code' nameKey='title' blankOption={ { title: '- Select -', code: '' } } />
                    <Select name='legend' label='Legend' labelClass='col-sm-3' fieldClass='col-sm-9' options={ _.toArray(this.props.legends) }
                        onChange={ this.onLegendChange.bind(this) } value={ this.state.deck.legend ? this.state.deck.legend.title : undefined }
                        valueKey='code' nameKey='title' blankOption={ { title: '- Select -', code: '' } } />

                    {/* this.state.showLegends */}

                    <Typeahead label='Card' labelClass={'col-sm-3'} fieldClass='col-sm-4' labelKey={'title'} options={ _.toArray(this.props.cards) }
                        onChange={ this.addCardChange.bind(this) }>
                        <Input name='numcards' type='text' label='Num' labelClass='col-sm-1' fieldClass='col-sm-2'
                            value={ this.state.numberToAdd.toString() } onChange={ this.onNumberToAddChange.bind(this) }>
                            <div className='col-sm-1'>
                                <button className='btn btn-default' onClick={ this.onAddCard.bind(this) }>Add</button>
                            </div>
                        </Input>
                    </Typeahead>
                    <TextArea label='Cards' titleClass='col-sm-3' fieldClass='col-sm-9' rows='25' value={ this.state.cardList }
                        onChange={ this.onCardListChange.bind(this) } />
                    <div className='form-group'>
                        <div className='col-sm-offset-3 col-sm-8'>
                            <button ref='submit' type='submit' className='btn btn-primary' onClick={ this.onSaveClick.bind(this) }>{ this.props.mode }</button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

InnerDeckEditor.displayName = 'DeckEditor';
InnerDeckEditor.propTypes = {
    cards: PropTypes.object,
    deck: PropTypes.object,
    legends: PropTypes.object,
    loading: PropTypes.bool,
    mode: PropTypes.string,
    onDeckSave: PropTypes.func,
    outfits: PropTypes.object,
    packs: PropTypes.array,
    updateDeck: PropTypes.func
};

function mapStateToProps(state) {
    return {
        apiError: state.api.message,
        legends: state.cards.legends,
        cards: state.cards.cards,
        deck: state.cards.selectedDeck,
        decks: state.cards.decks,
        outfits: state.cards.outfits,
        loading: state.api.loading,
        packs: state.cards.packs
    };
}

const DeckEditor = connect(mapStateToProps, actions)(InnerDeckEditor);

export default DeckEditor;
