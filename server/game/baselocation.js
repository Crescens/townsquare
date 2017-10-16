const _ = require('underscore');

const TownSquare = {
    code: 'townsquare',
    name: 'Town Square'
};

/**
 * Base class representing a location on the game board.
 */
class BaseLocation {
    constructor(location) {
        //Passed in location for construction. Card uuid or string e.g."townsquare"
        this.represents = location;
        this.adjacencyMap = new Map();
        this.cards = _([]);
        this.cardLocation = true;

        var uuidmatch = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

        if(!uuidmatch.test(location)) {
            this.cardLocation = false;
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
        return this;
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
