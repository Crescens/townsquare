import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';

import Counter from './Counter.jsx';

class CardCounters extends React.Component {
    render() {
        if(_.size(this.props.counters) === 0) {
            return null;
        }

        let countersClass = 'counters ignore-mouse-events';

<<<<<<< HEAD
        var counterDivs = _.map(this.props.counters, (counter, key) => {
            return (<Counter key={ key }
                            name={ key }
                            value={ counter.count }
                            fade={ counter.fade }
                            cancel={ counter.cancel }
                            shortName={ counter.shortName } />);
=======
        let counterDivs = _.map(this.props.counters, (counter, key) => {
            return (<Counter key={ key }
                name={ counter.name }
                value={ counter.count }
                fade={ counter.fade }
                cancel={ counter.cancel }
                shortName={ counter.shortName } />);
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
        });

        if(_.size(this.props.counters) > 3) {
            countersClass += ' many-counters';
        }

        return (
            <div className={ countersClass }>
                { counterDivs }
            </div>
        );
    }
}

CardCounters.displayName = 'CardCounters';
CardCounters.propTypes = {
<<<<<<< HEAD
    counters: PropTypes.object.isRequired
=======
    counters: PropTypes.array.isRequired
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
};

export default CardCounters;
