import React, { Component } from 'react';
import classnames from 'classnames';
import Parser from 'html-react-parser';

class AlertWrapperWarning extends Component {
    constructor (props){
        super(props)
    }
    render() {
        if(this.props.warning_wrapper_show){
            return (
                <div className={classnames("warning_alert_wrapper alert-wrapper alert-warning", { 'warning_wrapper_show': this.props.warning_wrapper_show })} >
                    <ul className="">
                        <li><i className="fa fa-info-circle"></i> {Parser(this.props.errors_data)}</li>
                    </ul>
                </div>
            );
        }else{
            return (
                <React.Fragment></React.Fragment>
            );
        }
        
    }
}
 
export default AlertWrapperWarning;