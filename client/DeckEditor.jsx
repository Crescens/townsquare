import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import $ from 'jquery';
import { connect } from 'react-redux';

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

        if(this.props.deck && (this.props.deck.drawCards)) {
            _.each(this.props.deck.drawCards, card => {

                //cardList += '*'.repeat(card.starting) + card.count + ' ' + card.card.title + '\n';
                cardList += this.formatCardListItem(card) + '\n';
            });

            this.setState({ cardList: cardList });
        }
    }

    formatCardListItem(card) {
        if(card.card.custom) {
            return card.count + ' Custom ' + card.card.type_name + ' - ' + card.card.name;
        }

        return card.count + ' ' + card.card.label;
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
<<<<<<< HEAD

        deck.legend = selectedLegend;
=======
        deck.agenda = selectedAgenda;

        let isAlliance = deck.agenda && deck.agenda.code === '06018';

        this.setState({ deck: deck, showBanners: isAlliance });

        if(!isAlliance) {
            deck.bannerCards = [];
        }

        this.props.updateDeck(deck);
    }

    onBannerChange(selectedBanner) {
        this.setState({ selectedBanner: selectedBanner });
    }

    onAddBanner(event) {
        event.preventDefault();

        if(!this.state.selectedBanner || !this.state.selectedBanner.code) {
            return;
        }

        if(!this.state.deck.bannerCards) {
            this.state.deck.bannerCards = [];
        }

        if(_.size(this.state.deck.bannerCards) >= 2) {
            return;
        }

        if(_.any(this.state.deck.bannerCards, banner => {
            return banner.code === this.state.selectedBanner.code;
        })) {
            return;
        }

        let deck = this.copyDeck(this.state.deck);
        deck.bannerCards.push(this.state.selectedBanner);

        this.setState({ deck: deck });
        this.props.updateDeck(deck);
    }

    onRemoveBanner(banner) {
        let deck = this.copyDeck(this.state.deck);

        deck.bannerCards = _.reject(deck.bannerCards, card => {
            return card.code === banner.code;
        });
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9

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
<<<<<<< HEAD
        if(headerMark >= 0) { // DB-style deck header found
                              // extract deck title, outfit, legend
=======
        if(headerMark >= 0) { // ThronesDB-style deck header found
            // extract deck title, faction, agenda, and banners
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
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

            let index = cardName.lastIndexOf('(');
            if (!(cardName.toLowerCase().endsWith('(black)') || cardName.toLowerCase().endsWith('(red)'))) {
                cardName = cardName.slice(0, index).trim();
            }


            starting = (cardName.match(/\*/g) || []).length;

            while(cardName.endsWith('*')) {
                cardName = cardName.replace('*', '');
            }

<<<<<<< HEAD
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
=======
            let card = this.lookupCard(line, index);
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9

            if(card) {
                this.addCard(card, num, starting);
            }
        });

        deck = this.copyDeck(deck);

        this.setState({ cardList: event.target.value, deck: deck, showLegends: deck.legend });
        this.props.updateDeck(deck);
    }

<<<<<<< HEAD
    addCard(card, number, starting) {
=======
    lookupCard(line, index) {
        let packOffset = line.indexOf('(');
        let cardName = line.substr(index, packOffset === -1 ? line.length : packOffset - index - 1).trim();
        let packName = line.substr(packOffset + 1, line.length - packOffset - 2);

        if(cardName.startsWith('Custom ')) {
            return this.createCustomCard(cardName);
        }

        let pack = _.find(this.props.packs, function(pack) {
            return pack.code.toLowerCase() === packName.toLowerCase() || pack.name.toLowerCase() === packName.toLowerCase();
        });

        return _.find(this.props.cards, function(card) {
            if(pack) {
                return card.label.toLowerCase() === cardName.toLowerCase() || card.label.toLowerCase() === (cardName + ' (' + pack.code + ')').toLowerCase();
            }

            return card.label.toLowerCase() === cardName.toLowerCase();
        });
    }

    createCustomCard(cardName) {
        let match = /Custom (.*) - (.*)/.exec(cardName);
        if(!match) {
            return null;
        }

        let type = match[1].toLowerCase();
        let name = match[2];

        return {
            claim: 0,
            code: 'custom_' + type,
            cost: 0,
            custom: true,
            faction_code: 'neutral',
            income: 0,
            initiative: 0,
            is_intrigue: true,
            is_loyal: false,
            is_military: true,
            is_power: true,
            is_unique: name.includes('*'),
            label: name + ' (Custom)',
            name: name,
            pack_code: 'Custom',
            pack_name: 'Custom',
            reserve: 0,
            strength: 0,
            text: 'Custom',
            traits: '',
            type_code: type,
            type_name: match[1]
        };
    }

    addCard(card, number) {
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
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

<<<<<<< HEAD
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
=======
    getBannerList() {
        if(_.size(this.props.deck.bannerCards) === 0) {
            return null;
        }

        return _.map(this.props.deck.bannerCards, card => {
            return (<div key={ card.code }>
                <span key={ card.code } className='card-link col-sm-10'>{ card.label }</span>
                <span className='glyphicon glyphicon-remove icon-danger btn col-sm-1' aria-hidden='true' onClick={ this.onRemoveBanner.bind(this, card) } />
            </div>);
        });
    }

    render() {
        let banners = this.getBannerList();

        return (
            <div>
                <h4>Either type the cards manually into the box below, add the cards one by one using the card box and autocomplete or for best results, copy and paste a decklist from <a href='http://thronesdb.com' target='_blank'>Thrones DB</a> into the box below.</h4>
                <form className='form form-horizontal'>
                    <Input name='deckName' label='Deck Name' labelClass='col-sm-3' fieldClass='col-sm-9' placeholder='Deck Name'
                        type='text' onChange={ this.onChange.bind(this, 'name') } value={ this.state.deck.name } />
                    <Select name='faction' label='Faction' labelClass='col-sm-3' fieldClass='col-sm-9' options={ _.toArray(this.props.factions) }
                        onChange={ this.onFactionChange.bind(this) } value={ this.state.deck.faction ? this.state.deck.faction.value : undefined } />
                    <Select name='agenda' label='Agenda' labelClass='col-sm-3' fieldClass='col-sm-9' options={ _.toArray(this.props.agendas) }
                        onChange={ this.onAgendaChange.bind(this) } value={ this.state.deck.agenda ? this.state.deck.agenda.code : undefined }
                        valueKey='code' nameKey='label' blankOption={ { label: '- Select -', code: '' } } />

                    { this.state.showBanners &&
                        <div>
                            <Select name='banners' label='Banners' labelClass='col-sm-3' fieldClass='col-sm-9' options={ this.props.banners }
                                onChange={ this.onBannerChange.bind(this) } value={ this.state.selectedBanner ? this.state.selectedBanner.code : undefined }
                                valueKey='code' nameKey='label'
                                blankOption={ { label: '- Select -', code: '' } } button={ { text: 'Add', onClick: this.onAddBanner.bind(this) } } />
                            <div className='col-sm-9 col-sm-offset-3 banner-list'>
                                { banners }
                            </div>
                        </div>
                    }
                    <Typeahead label='Card' labelClass={ 'col-sm-3' } fieldClass='col-sm-4' labelKey={ 'label' } options={ _.toArray(this.props.cards) }
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
                        onChange={ this.addCardChange.bind(this) }>
                        <Input name='numcards' type='text' label='Num' labelClass='col-sm-1' fieldClass='col-sm-2'
                            value={ this.state.numberToAdd.toString() } onChange={ this.onNumberToAddChange.bind(this) }>
                            <div className='col-sm-1'>
                                <button className='btn btn-primary' onClick={ this.onAddCard.bind(this) }>Add</button>
                            </div>
                        </Input>
                    </Typeahead>
<<<<<<< HEAD
                    <TextArea label='Cards' titleClass='col-sm-3' fieldClass='col-sm-9' rows='25' value={ this.state.cardList }
=======
                    <TextArea label='Cards' labelClass='col-sm-3' fieldClass='col-sm-9' rows='10' value={ this.state.cardList }
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
                        onChange={ this.onCardListChange.bind(this) } />
                    <div className='form-group'>
                        <div className='col-sm-offset-3 col-sm-8'>
                            <button ref='submit' type='submit' className='btn btn-primary' onClick={ this.onSaveClick.bind(this) }>Save</button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

InnerDeckEditor.displayName = 'DeckEditor';
InnerDeckEditor.propTypes = {
<<<<<<< HEAD
    cards: PropTypes.object,
    deck: PropTypes.object,
    legends: PropTypes.object,
    loading: PropTypes.bool,
    mode: PropTypes.string,
    onDeckSave: PropTypes.func,
    outfits: PropTypes.object,
=======
    agendas: PropTypes.object,
    banners: PropTypes.array,
    cards: PropTypes.object,
    deck: PropTypes.object,
    factions: PropTypes.object,
    onDeckSave: PropTypes.func,
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
    packs: PropTypes.array,
    updateDeck: PropTypes.func
};

function mapStateToProps(state) {
    return {
<<<<<<< HEAD
        apiError: state.api.message,
        legends: state.cards.legends,
=======
        agendas: state.cards.agendas,
        banners: state.cards.banners,
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
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
