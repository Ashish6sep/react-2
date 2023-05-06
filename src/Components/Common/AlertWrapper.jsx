import React, { Component } from 'react';
import Parser from 'html-react-parser';

class AlertWrepper extends Component {
    constructor (props){
        super(props)
    }
    render() {
        if(this.props.isFormValid){
            return (
                <React.Fragment></React.Fragment>
            );
        }else{
            if(this.props.errors_data !== ''){
                return (
                    <div className="alert-wrapper alert-error">
                        <ul className="alert-error">
                            <li><i className="fa fa-times-circle" aria-hidden="true"></i> <strong>Error:</strong> {Parser(this.props.errors_data)}</li>
                        </ul>
                    </div>
                );
            }else{
                return (
                    <div className="alert-wrapper alert-error">
                        <ul className="alert-error">
                            <li><i className="fa fa-times-circle" aria-hidden="true"></i> <strong>Error:</strong> Please fix the following error(s).</li>
                        </ul>
                    </div>
                );
            }
            
        }
        
    }
}
 
export default AlertWrepper;