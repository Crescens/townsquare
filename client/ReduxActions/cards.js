import $ from 'jquery';

export function loadCards() {
    return {
        types: ['REQUEST_CARDS', 'RECEIVE_CARDS'],
        shouldCallAPI: (state) => {
            return !state.cards.cards;
        },
        callAPI: () => $.ajax('/api/cards', { cache: false })
    };
}

export function loadPacks() {
    return {
        types: ['REQUEST_PACKS', 'RECEIVE_PACKS'],
        shouldCallAPI: (state) => {
            return !state.cards.packs;
        },
        callAPI: () => $.ajax('/api/packs', { cache: false })
    };
}

export function loadOutfits() {
    return {
        types: ['REQUEST_OUTFITS', 'RECEIVE_OUTFITS'],
        shouldCallAPI: (state) => {
            return !state.cards.outfits;
        },
        callAPI: () => $.ajax('/api/outfit', { cache: false })
    };
}

export function loadLegends() {
    return {
        types: ['REQUEST_LEGENDS', 'RECEIVE_LEGENDS'],
        shouldCallAPI: (state) => {
            return !state.cards.legends;
        },
        callAPI: () => $.ajax('/api/legend', { cache: false })
    };
}
