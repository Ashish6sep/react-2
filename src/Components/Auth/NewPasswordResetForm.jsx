import React, { PureComponent } from 'react';
import { API_KEY, API_URL } from '../../Constants/AppConstants';
import history from "../../history";
import { matchPath } from 'react-router';
import $ from "jquery";

import PropTypes from "prop-types";
import classnames from 'classnames';

import newValidatePasswordReset from '../../Validations/NewPasswordReset';
import FlashMessagesList from '../FlashMessages/FlashMessagesList';
import AlertWrapper from '../Common/AlertWrapper';

class NewPasswordResetForm extends PureComponent {
    constructor (props){
        super(props)
        this.state = {
            api_key: API_KEY,
            code: '',
            password: '',
            confirm_password: '',
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

    componentDidMount() {
        const match = matchPath(history.location.pathname, {
            path: '/password-reset/:code',
            exact: true,
            strict: false
        })
        this.setState({ code: match.params.code })
        // Check code validaty
        $.ajax({
            type: "POST",
            url: API_URL + "user/checkResetCode",
            data: {api_key: API_KEY, code: match.params.code}
        }).then (results => {
            if(results.response.code===4000) {
                this.setState({
                    server_message: results.response.message,
                    isLoading:false,
                    isFormValid:false
                });	
                history.push("/password-reset")                  
            }
        }
        );
    }

    onSubmit = (e) => {
        e.preventDefault();
        const val_return = newValidatePasswordReset(this.state);
        this.setState(val_return);
        if(val_return.isValid){
            this.setState({errors: {}, isLoading: true});
            this.props.newPasswordResetRequest(this.state).then
            (results => {
                if(results.response.code===1000) {
                    this.props.addFlashMessage({
                        type:"success",
                        text: results.response.message
                    });
                    history.push('/login');                    
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
                    <p>Please enter your new password and confirm password</p>
                    <p className="user_name_email_field">
                        <label className={classnames(null, { 'pl_error_label': errors.password })} htmlFor="password">New Password <span className="required">*</span></label>
                        <input className={classnames("cus_field", { 'pl_error_input': errors.password })} type="password" name="password" id="password" onChange={this.changeHandler} autoComplete="New password" />
                    </p>
                    <p className="user_name_email_field">
                        <label className={classnames(null, { 'pl_error_label': errors.confirm_password })} htmlFor="confirm_password">Confirm Password <span className="required">*</span></label>
                        <input className={classnames("cus_field", { 'pl_error_input': errors.confirm_password })} type="password" name="confirm_password" id="confirm_password" onChange={this.changeHandler} autoComplete="Confirm password" />
                    </p>
                    <div className="clearfix"></div>
                    <p className="">
                        <button type="submit" disabled={this.state.isLoading} className="roboto_condensed cus_button" value="Reset password">{this.state.isLoading?'Please Wait...':'Update Password'}</button>
                    </p>
                </form>
            </div>
        );
    }
}

NewPasswordResetForm.propTypes = {
    newPasswordResetRequest:PropTypes.func.isRequired,
    addFlashMessage:PropTypes.func.isRequired
}
 
export default NewPasswordResetForm;