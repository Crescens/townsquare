import { Typeahead } from 'react-bootstrap-typeahead';
import React from 'react';
import PropTypes from 'prop-types';

class Input extends React.Component {
    clear() {
        this.refs.typeahead.getInstance().clear();
    }

    render() {
        let label = this.props.label ? <label htmlFor={ this.props.name } className={ this.props.labelClass + ' control-label' }>{ this.props.label }</label> : null;
        return (
            <div className='form-group'>
                { label }
                <div className={ this.props.fieldClass }>
                    <Typeahead ref='typeahead' options={ this.props.options } labelKey={ this.props.labelKey } emptyLabel={ this.props.emptyLabel }
                        onChange={ this.props.onChange } placeholder={ this.props.placeholder } autoFocus={ this.props.autoFocus } dropup={ this.props.dropup }
                        minLength={ this.props.minLength } onInputChange={ this.props.onInputChange }
                        submitFormOnEnter={ this.props.submitFormOnEnter } onKeyDown={ this.props.onKeyDown } disabled={ this.props.disabled }/>
                    { this.props.validationMessage ? <span className='help-block'>{ this.props.validationMessage } </span> : null }
                </div>
                { this.props.children }
            </div>
        );
    }
}

Input.displayName = 'TypeAhead';
Input.propTypes = {
<<<<<<< HEAD
    children: PropTypes.object,
=======
    autoFocus: PropTypes.bool,
    children: PropTypes.object,
    disabled: PropTypes.bool,
    dropup: PropTypes.bool,
    emptyLabel: PropTypes.string,
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
    fieldClass: PropTypes.string,
    label: PropTypes.string,
    labelClass: PropTypes.string,
    labelKey: PropTypes.string,
<<<<<<< HEAD
    name: PropTypes.string,
    onChange: PropTypes.func,
    options: PropTypes.array,
=======
    minLength: PropTypes.number,
    name: PropTypes.string,
    onChange: PropTypes.func,
    onInputChange: PropTypes.func,
    onKeyDown: PropTypes.func,
    options: PropTypes.array,
    placeholder: PropTypes.string,
    submitFormOnEnter: PropTypes.bool,
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
    validationMessage: PropTypes.string,
    value: PropTypes.string
};

export default Input;
