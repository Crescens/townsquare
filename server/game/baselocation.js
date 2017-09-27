const _ = require('underscore');

/**
 * Base class representing a location on the game board.
 */
class BaseLocation {
    constructor() {
        this.adjacent = _([]);
        this.outOfTown = false;
    }

    isAdjacent(location) {
        return !!this.adjacent[location];
    }

    addAdjacent(location) {
        this.adjacent.push(location);
    }
}

module.exports = BaseLocation;
