import React from 'react';
import PropTypes from 'prop-types';

class AlertPanel extends React.Component {
    render() {
        var icon = 'glyphicon';
        var alertClass = 'alert fade in';

        switch(this.props.type) {
            case 'warning':
                icon += ' glyphicon-warning-sign';
                alertClass += ' alert-warning';
                break;
            case 'error':
                icon += ' glyphicon-exclamation-sign';
                alertClass += ' alert-danger';
                break;
            case 'info':
                icon += ' glyphicon-info-sign';
                alertClass += ' alert-info';
                break;
            case 'success':
                icon += ' glyphicon-ok-sign';
                alertClass += ' alert-success';
                break;
        }

<<<<<<< HEAD
        return (<div className={ alertClass } ref='alertPanel' role='alert'>
                    <span className={ icon } aria-hidden='true' />
                    <span className='sr-only'>{ this.props.title }</span>
                    &nbsp;{ this.props.message }
                    &nbsp;{ this.props.children }
                </div>);
=======
        return (<div ref='alertPanel' className={ alertClass } role='alert'>
            { this.props.noIcon ? null : <span className={ icon } aria-hidden='true' /> }
            { this.props.title ? <span className='sr-only'>{ this.props.title }</span> : null }
            { this.props.message ? <span>&nbsp;{ this.props.message }</span> : null }
            { this.props.children }
        </div>);
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
    }
}

AlertPanel.displayName = 'AlertPanel';
AlertPanel.propTypes = {
    children: PropTypes.any,
    message: PropTypes.string,
<<<<<<< HEAD
=======
    noIcon: PropTypes.bool,
>>>>>>> 27157a1f57e87fc5b5fd66e3b83a355747e605f9
    title: PropTypes.string,
    type: PropTypes.oneOf(['warning', 'info', 'success', 'error'])
};

export default AlertPanel;
