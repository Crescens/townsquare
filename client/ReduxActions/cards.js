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
<<<<<<< HEAD
}

export function loadOutfits() {
    return {
        types: ['REQUEST_OUTFITS', 'RECEIVE_OUTFITS'],
        shouldCallAPI: (state) => {
            return !state.cards.outfits;
        },
        callAPI: () => $.ajax('/api/outfit', { cache: false })
    };
=======
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
}

export function loadLegends() {
    return {
        types: ['REQUEST_LEGENDS', 'RECEIVE_LEGENDS'],
        shouldCallAPI: (state) => {
<<<<<<< HEAD
            return !state.cards.legends;
=======
            return !state.cards.factions;
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
        },
        callAPI: () => $.ajax('/api/legend', { cache: false })
    };
}
