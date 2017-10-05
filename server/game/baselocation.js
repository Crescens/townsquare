const _ = require('underscore');

/**
 * Base class representing a location on the game board.
 */
class BaseLocation {
    constructor(location) {
        //Passed in location for construction. Card object or string "townsquare"
        this.represents = location;
        this.adjacencyMap = new Map();
        this.cards = _([]);
    }

    isAdjacent(location) {
        for(var key of this.adjacencyMap.keys()) {
            if(location === key) {
                return true;
            }
        }

        return false;
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

    describe() {
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

}

module.exports = BaseLocation;
