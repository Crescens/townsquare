import React from 'react';
import PropTypes from 'prop-types';
import 'jquery-nearest';


class DropZone extends React.Component {
    render() {
        return (
            <div className={this.props.zone} style={this.props.style} onDrop={event => this.props.onDragDropEvent(event, this.props.zone)} />
        );

    }
}

DropZone.displayName = 'DropZone';
DropZone.propTypes = {
    className: PropTypes.string,
    onDragDrop: PropTypes.func,
    onDragDropEvent: PropTypes.func,
    style: PropTypes.object,
    zone: PropTypes.string
};

export default DropZone;
