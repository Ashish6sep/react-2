import React, { PureComponent } from 'react';
import { API_KEY } from '../../Constants/AppConstants';
import history from "../../history";

import PropTypes from "prop-types";
import classnames from 'classnames';

import validatePasswordReset from '../../Validations/PasswordReset';
import FlashMessagesList from '../FlashMessages/FlashMessagesList';
import AlertWrapper from '../Common/AlertWrapper';

class PasswordResetForm extends PureComponent {
    constructor (props){
        super(props)
        this.state = {
            api_key: API_KEY,
            user_login: '',
            errors: {},
            isValid:false,
            isLoading:false,
            isFormValid:true,
            server_message:''
        }
    }

    changeHandler = (e) => {
        this.setState({
            [e.target.name]:e.target.value
        });
    }

    onSubmit = (e) => {
        e.preventDefault();
        const val_return = validatePasswordReset(this.state);
        this.setState(val_return);
        if(val_return.isValid){
            this.setState({errors: {}, isLoading: true});
            this.props.passwordResetRequest(this.state).then
            (results => {
                if(results.response.code===1000) {
                    this.props.addFlashMessage({
                        type:"success",
                        text: results.response.message
                    });
                    this.setState({
                        isLoading:false
                    });	
                    // history.push('/password-reset/'+results.response.data.code);
                } else {                    
                    this.setState({
                        server_message: results.response.message,
                        isLoading:false,
                        isFormValid:false
                    });	
                }            
            }
            );
        }
    }

    render() { 
        const { errors, server_message } = this.state;
        const errors_data = server_message;
        return (
            <div className="">
                <AlertWrapper errors_data={errors_data} isFormValid={this.state.isFormValid}/>
                <FlashMessagesList />
                <form method="post" className="lost_reset_password" onSubmit={this.onSubmit}>
                    <p>Lost your password? Please enter your username or email address. You will receive a link to create a new password via email.</p>
                    <p className="user_name_email_field">
                        <label className={classnames(null, { 'pl_error_label': errors.user_login })} htmlFor="user_login">Username or email <span className="required">*</span></label>
                        <input className={classnames("cus_field", { 'pl_error_input': errors.user_login })} type="text" name="user_login" id="user_login" onChange={this.changeHandler} autoComplete="username" />
                    </p>
                    <div className="clearfix"></div>
                    <p className="">
                        <button type="submit" disabled={this.state.isLoading} className="roboto_condensed cus_button" value="Reset password">{this.state.isLoading?'Please Wait...':'Reset password'}</button>
                    </p>
                </form>
            </div>
        );
    }
}

PasswordResetForm.propTypes = {
    passwordResetRequest:PropTypes.func.isRequired,
    addFlashMessage:PropTypes.func.isRequired
}
 
export default PasswordResetForm;