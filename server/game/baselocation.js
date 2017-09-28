const _ = require('underscore');

/**
 * Base class representing a location on the game board.
 */
class BaseLocation {
    constructor() {
        this.one = _([]);
        this.two = _([]);
    }

    isAdjacent(location) {
        return;
    }

    makeAdjacent(one, two) {
        var obj1 = {};
        var obj2 = {};
        obj1[one] = two;
        obj2[two] = one;
        this.one.push(obj1);
        this.two.push(obj2);
    }

    adjacentLocations() {
        return this.adjacency;
    }
}

module.exports = BaseLocation;
