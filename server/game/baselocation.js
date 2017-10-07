const _ = require('underscore');

/**
 * Base class representing a location on the game board.
 */
class BaseLocation {
    constructor(location) {
        //Passed in location for construction. Card object or string e.g."townsquare"
        this.represents = location;
        this.adjacencyMap = new Map();
        this.cards = _([]);
        this.cardLocation = true;

        if(typeof(location) === 'string') {
            this.cardLocation = false;
            this.represents = { code: location }; //All represents now objects for React UI
        }
    }

    isAdjacent(location) {
        for(var key of this.adjacencyMap.keys()) {
            if(location === key) {
                return true;
            }
        }

        return false;
    }

    isCardLocation() {
        return this.cardLocation;
    }

    attach(location, direction) {
        this.adjacencyMap.set(location, direction);
    }

    detach(location) {
        this.adjacencyMap.delete(location);
    }

    adjacentLocations() {
        return this.adjacencyMap;
    }

    get() {
        return this.represents;
    }

    left() {
        for(var [key,value] of this.adjacencyMap.entries()) {
            if(value === 'left') {
                return key;
            }
        }
    }

    right() {
        for(var [key,value] of this.adjacencyMap.entries()) {
            if(value === 'right') {
                return key;
            }
        }
    }

    addCard(card) {
        if(!card) {
            return;
        }

        this.cards.push(card);
    }

    removeCard(card) {
        if(!card || !this.cards.includes(card)) {
            return;
        }

        this.cards = _(this.cards.reject(c => c === card));
    }

    cards() {
        return this.cards;
    }

}

module.exports = BaseLocation;
