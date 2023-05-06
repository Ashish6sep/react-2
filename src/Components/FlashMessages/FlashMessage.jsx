import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

class FlashMessage extends Component {
    constructor(props){
        super(props)
    }
    onClick = () => {
        this.props.deleteFlashMessage(this.props.message.id);
    }

    render() { 
        const {id, type, text} = this.props.message;
        return (
            <div className={classnames('alert', {
                'alert-success': type === 'success',
                'alert-danger': type === 'error'
            })}>
                {text}
                <button onClick={this.onClick} className="close"><span>&times;</span></button>
            </div>
        );
    }
}

FlashMessage.propTypes = {
    message:PropTypes.object.isRequired,
    deleteFlashMessage:PropTypes.func.isRequired
}
 
export default FlashMessage;