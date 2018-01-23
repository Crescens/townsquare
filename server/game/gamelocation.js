//const _ = require('underscore');
const uuid = require('uuid');
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
/**
 * Base class representing a location on the game board.
 */
class GameLocation {
    constructor(location, order) {
        //Passed in location for construction. Card uuid is main identifier.
        this.uuid = location;
        this.adjacencyMap = new Map();
        //this.cards = _([]);
        this.cardLocation = true;
        /*Keeps track of location order on player street
          for flexbox order parameter info
          0 === outfit (on street) or townsquare
          >=1 === right of outfit
          <=-1 === left of outfit
        */
        this.order = order;

        if(!UUID.test(location)) {
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

    setOrder(order) {
        this.order = order;
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

    /* Considering removing card state and mapping only between some identifier
       and each card's card.location parameter

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
    }*/

}

/**
 * Singleton class representing the Town Square.
 * Generates with its own ID and at order 0 in the
 * central game flex box
 */
class TownSquare extends GameLocation {
    constructor() {
        super(uuid.v1(), 0);

        this.key = 'townsquare';
    }

    north() {
        for(var [key,value] of this.adjacencyMap.entries()) {
            if(value === 'north') {
                return key;
            }
        }
    }

    south() {
        for(var [key,value] of this.adjacencyMap.entries()) {
            if(value === 'south') {
                return key;
            }
        }
    }
}


module.exports = { GameLocation, TownSquare };
