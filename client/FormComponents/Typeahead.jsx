import Typeahead from 'react-bootstrap-typeahead';
import React from 'react';
import PropTypes from 'prop-types';

class Input extends React.Component {
    render() {
        return (
            <div className='form-group'>
                <label htmlFor={ this.props.name } className={ this.props.labelClass + ' control-label'}>{ this.props.label }</label>
                <div className={ this.props.fieldClass }>
                    <Typeahead ref={ this.props.name }
                        options={ this.props.options }
                        labelKey={ this.props.labelKey }
                        onChange={ this.props.onChange } />
                    { this.props.validationMessage ? <span className='help-block'>{ this.props.validationMessage} </span> : null }
                </div>
                { this.props.children }
            </div>
        );
    }
}

Input.displayName = 'TypeAhead';
Input.propTypes = {
    children: PropTypes.object,
    fieldClass: PropTypes.string,
    label: PropTypes.string,
    labelClass: PropTypes.string,
    labelKey: PropTypes.string,
    name: PropTypes.string,
    onChange: PropTypes.func,
    options: PropTypes.array,
    validationMessage: PropTypes.string,
    value: PropTypes.string
};

export default Input;
