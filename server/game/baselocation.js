const _ = require('underscore');

/**
 * Base class representing a location on the game board.
 */
class BaseLocation {
    constructor(location) {
        //Passed in location for construction. Card object or string "townsquare"
        this.represents = location;
        this.adjacencyMap = new Map();
    }

    isAdjacent(location) {
        for(var key of this.adjacencyMap.keys()) {
            if(location === key) {
                return true;
            }
        }

        return false;
    }

    Attach(location, direction) {
        this.adjacencyMap.set(location, direction);
    }

    Detach(location) {
        this.adjacencyMap.delete(location);
    }

    adjacentLocations() {
        return this.adjacencyMap;
    }

    Represents() {
        return this.represents;
    }

    Left() {
        for(var [key,value] of this.adjacencyMap.entries()) {
            if(value === 'left') {
                return key;
            }
        }
    }

    Right() {
        for(var [key,value] of this.adjacencyMap.entries()) {
            if(value === 'right') {
                return key;
            }
        }
    }
}

module.exports = BaseLocation;
