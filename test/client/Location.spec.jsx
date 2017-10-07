/* global describe, it, expect, beforeEach, afterEach jasmine */
/* eslint camelcase: 0, no-invalid-this: 0 */

import Location from '../../client/GameComponents/Location.jsx';
import ReactDOM from 'react-dom';
import React from 'react';
import TestUtils from 'react-addons-test-utils';

describe('the <Location /> component', function() {
    beforeEach(function() {
        this.node = document.createElement('div');

        this.location = {
            code: 'townsquare',
            name: 'Town Square'
        };

        //this.spy = jasmine.createSpyObj('spy', ['onMouseOver', 'onMouseOut', 'onClick']);

        this.component = ReactDOM.render(<Location location={this.location} />, this.node);
    });


    describe('when rendering a new component', function() {
        it('should show the source image and name', function () {
            var locationImage = TestUtils.findRenderedDOMComponentWithTag(this.component, 'img');
            var locationLabel = TestUtils.findRenderedDOMComponentWithClass(this.component, 'location-name');

            expect(locationImage.src.indexOf('/img/cards/townsquare.jpg')).not.toBe(-1);
            expect(locationLabel.innerText).toBe(this.location.name);
        });
    });

    /*
    describe('when rendered with a cardLocation', function() {
        beforeEach(function() {
            this.component = ReactDOM.render(<Location card={this.card} />, this.node);
        });

        it('should show the source image and name', function() {
            var cardImage = TestUtils.findRenderedDOMComponentWithTag(this.component, 'img');
            var cardLabel = TestUtils.findRenderedDOMComponentWithClass(this.component, 'card-name');

            expect(cardImage.src.indexOf('/img/cards/00001.jpg')).not.toBe(-1);
            expect(cardLabel.innerText).toBe(this.card.name);
        });
    });
    */
});
