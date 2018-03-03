import React from 'react';
import PropTypes from 'prop-types';

class Input extends React.Component {
    render() {
        const inputControl = (
            <div>
                <label htmlFor={ this.props.name } className={ this.props.labelClass + ' control-label' }>{ this.props.label }</label>
                <div className={ this.props.fieldClass }>
                    <input name={ this.props.name } type={ this.props.type } className='form-control' id={ this.props.name }
                        placeholder={ this.props.placeholder } value={ this.props.value } onChange={ this.props.onChange } onBlur={ this.props.onBlur }
                        { ...this.props.validationAttributes } />
                    <span className='text-danger' data-valmsg-replace='true' data-valmsg-for={ this.props.name } />
                </div>
                { this.props.children }
            </div>
        );

        if(this.props.noGroup) {
            return inputControl;
        }

        return (
            <div className='form-group'>
                { inputControl }
            </div>
        );
    }
}

Input.displayName = 'Input';
Input.propTypes = {
    children: PropTypes.object,
    fieldClass: PropTypes.string,
    label: PropTypes.string,
    labelClass: PropTypes.string,
    name: PropTypes.string,
<<<<<<< HEAD
=======
    noGroup: PropTypes.bool,
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    type: PropTypes.oneOf(['text', 'password']),
<<<<<<< HEAD
    validationMessage: PropTypes.string,
=======
    validationAttributes: PropTypes.object,
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
    value: PropTypes.string
};

export default Input;
