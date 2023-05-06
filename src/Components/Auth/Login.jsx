import React, { PureComponent, Fragment } from 'react';
import PropTypes from "prop-types";
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import classnames from 'classnames';
import history from '../../history';
import { logout } from '../../Store/actions/loginActions';
import validateLogin from '../../Validations/Login';
import validateSignup from '../../Validations/Registration';
import { userLoginRequest } from '../../Store/actions/loginActions';
import { userSignupRequest } from '../../Store/actions/signupActions';
import AlertWrapper from '../Common/AlertWrapper';
import AlertWrapperSuccess from '../Common/AlertWrapperSuccess';
import AlertWrapperWarning from '../Common/AlertWrapperWarning';
import "../../Assets/css/captcha.css";

import { ECOM_URL, AJAX_REQUEST, CUSTOMER_URL, REFER_URL, REMOVE_STORAGE, USER, GET_COOKIE, GET_STORAGE, MEAL_COUNT, ITEM_COUNT } from '../../Constants/AppConstants';


class Login extends PureComponent {
    constructor(props) {
        super(props);

        let settings = '';
        if (GET_STORAGE('settings')) {
            settings = JSON.parse(GET_STORAGE('settings'));
        }

        this.state = {
            privacy_policy: settings ? (settings.internal_pages ? settings.internal_pages.privacy_policy : "/") : "/",
            user_login: '',
            password: '',
            reg_email: '',
            reg_password: '',
            role: 'customer',
            remember: '',
            redirect_url: '',
            captchaCode: 'Loading...',
            captcha_input: '',
            // affiliate_code: GET_COOKIE('af'),
            loading: true,
            success_alert_wrapper_show: false,
            errors: {},
            isValid: false,
            isLoading: false,
            isFormValid: true,
            isLoadingR: false,
            server_message: '',
            warning_wrapper_show: true
        }
        document.title = "Login - Prestige Labs";
    }

    changeHandler = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    changeRememberHandler = (e) => {
        if (document.getElementById("remember").checked) {
            this.setState({
                remember: 'checked'
            });
        } else {
            this.setState({
                remember: ''
            });
        }
    }

    Captcha = () => {
        let alpha = new Array('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
            'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
            '0', '1', '2', '3', '4', '5', '6', '7', '8', '9');
        let i = 0;
        let a = '';
        let b = '';
        let c = '';
        let d = '';
        let e = '';
        let f = '';
        let g = '';
        for (i = 0; i < 6; i++) {
            a = alpha[Math.floor(Math.random() * alpha.length)];
            b = alpha[Math.floor(Math.random() * alpha.length)];
            c = alpha[Math.floor(Math.random() * alpha.length)];
            d = alpha[Math.floor(Math.random() * alpha.length)];
            e = alpha[Math.floor(Math.random() * alpha.length)];
            f = alpha[Math.floor(Math.random() * alpha.length)];
            g = alpha[Math.floor(Math.random() * alpha.length)];
        }
        let code = a + ' ' + b + ' ' + ' ' + c + ' ' + d + ' ' + e + ' ' + f + ' ' + g;
        this.setState({
            captchaCode: code
        });
    }

    componentDidMount() {
        document.querySelector("body").scrollIntoView();
        this.Captcha();
        this.setState({
            loading: false
        });
    }

    onSubmit = (e) => {
        e.preventDefault();
        const val_return = validateLogin(this.state);
        this.setState(val_return);
        if (val_return.isValid) {
            this.setState({ errors: {}, isLoading: true });
            this.props.userLoginRequest(this.state).then(results => {
                if (results.response.code === 1000) {
                    if (Object.values(results.response.data.roles).includes('customer')) {

                        let settings = null;
                        if (GET_STORAGE("settings")) {
                            settings = JSON.parse(GET_STORAGE("settings"));
                        }

                        let meal_menu_active = false;
                        if (settings && settings.meal_menu_public == "yes") {
                            meal_menu_active = true;
                        } else {
                            if (results.response.data.meal_menu_activated) {
                                meal_menu_active = true;
                            }
                        }

                        if (results.response.data.hasOwnProperty('site')) {
                            if (results.response.data.site == 'refer') {
                                if (meal_menu_active) {
                                    window.location.href = REFER_URL + 'serviceLogin?token=' + results.response.data.token + '&redirect=meals';
                                } else {
                                    window.location.href = REFER_URL + 'serviceLogin?token=' + results.response.data.token;
                                }
                            } else {
                                if (Number(MEAL_COUNT()) + Number(ITEM_COUNT()) > 0) {
                                    history.push('/checkout');
                                } else {
                                    if (meal_menu_active) {
                                        history.push('/meals');
                                    } else {
                                        history.push('/');
                                    }
                                }
                            }
                        } else {
                            if (Number(MEAL_COUNT()) + Number(ITEM_COUNT()) > 0) {
                                history.push('/checkout');
                            } else {
                                if (meal_menu_active) {
                                    history.push('/meals');
                                } else {
                                    history.push('/');
                                }
                            }
                        }

                        // if(history.goBack(1)){
                        //     history.goBack(1);
                        // }else{
                        // history.push('/');
                        // }
                        // }else if(results.response.data.role === 'customer'){
                        //     window.location.href = CUSTOMER_URL+'serviceLogin?token='+results.response.data.token;
                    } else {
                        this.props.logout();
                        REMOVE_STORAGE(USER);
                        this.setState({
                            // server_message: results.response.message,
                            server_message: "Unauthorized Access",
                            isLoading: false,
                            isFormValid: false
                        });
                    }
                } else {
                    this.setState({
                        server_message: results.response.message,
                        isLoading: false,
                        isFormValid: false
                    });
                }
            }
            );
        }
    }

    onSubmitR = (e) => {
        e.preventDefault();
        const val_return = validateSignup(this.state);
        this.setState(val_return);

        if (val_return.isValid) {
            if (this.state.affiliate_code !== '') {
                let data = {
                    email: this.state.reg_email,
                    password: this.state.reg_password,
                    role: this.state.role,
                    affiliate_code: this.state.affiliate_code
                };
                // data.append('email', this.state.reg_email);
                // data.append('password', this.state.reg_password);
                // data.append('role', this.state.role);

                this.setState({ errors: {}, isLoadingR: true });
                this.props.userSignupRequest(data).then(results => {
                    if (results.response.code === 1000) {
                        this.setState({
                            server_message: results.response.message,
                            isLoadingR: false,
                            isFormValid: false,
                            captcha_input: ''
                        });
                        history.push('/checkout');
                    } else {
                        this.setState({
                            server_message: results.response.message,
                            isLoadingR: false,
                            isFormValid: false
                        });
                    }
                }
                );
            } else {
                this.setState({
                    server_message: '<strong>Sorry</strong> You are not allowed to make any purchase on this site. To be able purchase, you must use the referral link from any of our affiliate.',
                    isLoadingR: false,
                    isFormValid: false
                });
            }
        }
    }

    render() {
        const { server_message, success_alert_wrapper_show, errors, isLoading, warning_wrapper_show, captchaCode } = this.state;
        const errors_data = server_message;

        if (this.props.isAuthenticated) {
            history.push('/');
        }

        return (
            <Fragment>
                {
                    this.state.loading ?
                        <div className="loading"></div>
                        :
                        <React.Fragment>
                            <div className="container">
                                <div className="row">
                                    <div className="col-md-12">
                                        <main className="my_account">
                                            {/* <h3 className="montserrat page-title">MY ACCOUNT</h3> */}
                                            {
                                                Number(MEAL_COUNT()) + Number(ITEM_COUNT()) > 0 ?
                                                    <AlertWrapperWarning errors_data="Please log in or register to complete your purchase." warning_wrapper_show={warning_wrapper_show} />
                                                    :
                                                    ''
                                            }
                                            <AlertWrapper errors_data={errors_data} isFormValid={this.state.isFormValid} />
                                            <AlertWrapperSuccess errors_data={errors_data} success_alert_wrapper_show={success_alert_wrapper_show} />

                                            <div className="pull-left refer_login">
                                                <h3 className="montserrat page-title inner_page_title">Login</h3>
                                                <form className="action_form" onSubmit={this.onSubmit}>
                                                    <div className="form-group">
                                                        <label className={classnames(null, { 'pl_error_label': errors.user_login })} htmlFor="user_login">Username or email address <span className="required">*</span></label>
                                                        <input type="text" className={classnames("cus_field", { 'pl_error_input': errors.user_login })} name="user_login" id="user_login" value={this.state.user_login} onChange={this.changeHandler} />

                                                    </div>
                                                    <div className="form-group">
                                                        <label className={classnames(null, { 'pl_error_label': errors.password })} htmlFor="password">Password <span className="required">*</span></label>
                                                        <input className={classnames("cus_field", { 'pl_error_input': errors.password })} type="password" name="password" id="password" value={this.state.password} onChange={this.changeHandler} />
                                                    </div>
                                                    <div className="form-group">
                                                        <button type="submit" disabled={this.state.isLoading} className="cus_button" name="login" value="Login">{this.state.isLoading ? 'Please Wait...' : 'Login'}</button>

                                                        <div className="inline_checkbox custom-control custom-checkbox">
                                                            <input onChange={this.changeRememberHandler} type="checkbox" className={classnames('custom-control-input', { 'pl_error_checkbox': errors.remember })} id="remember" name="remember" />
                                                            <label className="custom-control-label" htmlFor="remember">Remember me</label>
                                                        </div>
                                                    </div>
                                                    <div className="lost_password">
                                                        <NavLink activeClassName='active' to="/password-reset"> Lost your password?</NavLink>
                                                    </div>
                                                </form>
                                            </div>
                                            <div className="pull-right refer_login">
                                                <h3 className="montserrat page-title inner_page_title">Register</h3>
                                                <form className="action_form" onSubmit={this.onSubmitR}>
                                                    <div className="form-group">
                                                        <div className="form-group">
                                                            <label className={classnames(null, { 'pl_error_label': errors.reg_email })} htmlFor="reg_email">Email address <span className="required">*</span></label>
                                                            <input type="email" className={classnames("cus_field", { 'pl_error_input': errors.reg_email })} name="reg_email" id="reg_email" value={this.state.reg_email} onChange={this.changeHandler} />
                                                        </div>
                                                        <div className="form-group">
                                                            <label className={classnames(null, { 'pl_error_label': errors.reg_password })} htmlFor="reg_password">Password <span className="required">*</span></label>
                                                            <input type="password" className={classnames("cus_field", { 'pl_error_input': errors.reg_password })} name="reg_password" id="reg_password" value={this.state.reg_password} onChange={this.changeHandler} />
                                                        </div>
                                                        <div className="form-group">
                                                            <label className={classnames(null, { 'pl_error_label': errors.captcha_input })} htmlFor="captcha_input">Please verify captcha <span className="required">*</span></label>
                                                            <div className="captcha_container">
                                                                <h2 type="text" id="mainCaptcha">{captchaCode}</h2>
                                                                <input type="hidden" id="captchaCode" name="captchaCode" defaultValue={captchaCode} />
                                                                <input className={classnames("cus_field", { 'pl_error_input': errors.captcha_input })} name="captcha_input" id="captcha_input" onChange={this.changeHandler} type="text" value={this.state.captcha_input} />
                                                                <button type="button" id="refresh" className="roboto_condensed cus_button cus_button" name="login" onClick={this.Captcha}><i className="fa fa-refresh" aria-hidden="true" ></i></button>
                                                            </div>
                                                        </div>
                                                        <div className="woocommerce-privacy-policy-text">
                                                            <p>Your personal data will be used to support your experience throughout this website, to manage access to your account, and for other purposes described in our <NavLink to={`${this.state.privacy_policy}`} className="woocommerce-privacy-policy-link" target="_blank">privacy policy</NavLink>.
                                                    </p>
                                                        </div>
                                                        <div className="form-group">
                                                            <button disabled={this.state.isLoadingR} type="submit" className="roboto_condensed cus_button" >{this.state.isLoadingR ? 'Please Wait...' : 'Register'}</button>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                            <div className="clearfix"></div>
                                        </main>
                                    </div>
                                </div>
                            </div>
                        </React.Fragment>
                }
            </Fragment>
        );
    }
}

Login.propTypes = {
    userLoginRequest: PropTypes.func.isRequired,
    userSignupRequest: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    logout: PropTypes.func.isRequired,
}

function mapStateToProps(state) {
    return {
        isAuthenticated: state.auth.isAuthenticated
    }
}

// export default connect(mapStateToProps, { logout })(Login);

export default connect(mapStateToProps, { userLoginRequest, userSignupRequest, logout })(Login);