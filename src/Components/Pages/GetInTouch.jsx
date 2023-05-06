import React,{PureComponent,Fragment} from 'react';
import $ from 'jquery';
import Parser from 'html-react-parser';
import classnames from 'classnames';
import AlertWrapper from '../Common/AlertWrapper';
import AlertWrapperSuccess from '../Common/AlertWrapperSuccess';
import validateContactForm from '../../Validations/validateContactForm';
import { AJAX_PUBLIC_REQUEST } from '../../Constants/AppConstants';
import "../../Assets/css/captcha.css";

class Contact extends PureComponent {

    constructor(props) {
        super(props)
        this.state = {
            page: '',
            name            : '',
            email           : '',
            subject         : '',
            message         : '',
            captchaCode     :'Loading...',
            captcha_input   :'',
            success_alert_wrapper_show: false,
            loading: true,
            action_btn_label : false,
            errors: {},
            isValid:false,
            isLoading:false,
            isFormValid:true,
            server_message:'',
        }
        document.title = "Get In Touch - Prestige Labs";
    }

    componentDidMount() {
        document.querySelector("body").scrollIntoView();
        AJAX_PUBLIC_REQUEST("POST", "page/getContactInfo", {}).then(results => {
            if(parseInt(results.response.code)===1000) {
                this.setState({
                    page: results.response.data,
                    loading:false,
                });
                this.Captcha();
            }else {
                this.setState({
                    server_message : results.response.message,
                    isFormValid:false,
                    loading:false,
                });
                this.Captcha();
            }
        });
    }

    changeHandler = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
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
            captchaCode:code
        });
    }

    timeOut = (timedata) => {
        setTimeout(function(){
            this.setState({
                success_alert_wrapper_show: false
            });
        }.bind(this),timedata);
    }

    onSubmitHandler = (e) => {
        e.preventDefault();
        const val_return = validateContactForm(this.state);
        this.setState(val_return);
        if(val_return.isValid){
            this.setState({errors: {}, isLoading: true,action_btn_label: true,server_message:''});
            const data = { 
                name        : this.state.name, 
                email       : this.state.email, 
                subject     : this.state.subject, 
                message     : this.state.message
            }
            AJAX_PUBLIC_REQUEST("POST", "page/contactSubmit", data).then(results => {
                if(parseInt(results.response.code)===1000) {
                    this.setState({
                        server_message: results.response.message,
                        name        : '', 
                        email       : '', 
                        subject     : '', 
                        message     : '',
                        captcha_input:'',
                        isFormValid:true,
                        isLoading:false,
                        action_btn_label: false,
                        success_alert_wrapper_show: true
                    });
                    document.querySelector("body").scrollIntoView();
                    this.timeOut(5000);
                } else {
                    this.setState({
                        server_message: results.response.message,
                        isFormValid:false,
                        isLoading:false,
                        action_btn_label: false,
                        success_alert_wrapper_show: false
                    });
                    document.querySelector("body").scrollIntoView();
                }            
            });
        }else{
            document.querySelector("body").scrollIntoView();
        }
    }

    render() {
        const { server_message, success_alert_wrapper_show, errors, isLoading, captchaCode } = this.state;
        const errors_data = server_message;
        return (
                <Fragment>
                    {
                        (this.state.loading)?
                        <div className="loading container full_page_loader"></div>
                        :
                        <Fragment>
                            <div className="container">
                                <div className="row">
                                    <div className="col-md-12">
                                        <main className="get_in_touch">
                                            <div className="pull-left col-md-6">
                                                <h3 className="montserrat page-title">Get In Touch</h3>
                                                <AlertWrapper errors_data={errors_data} isFormValid={this.state.isFormValid}/>
                                                <AlertWrapperSuccess errors_data={errors_data} success_alert_wrapper_show={success_alert_wrapper_show}/>
                                                <form id="contact-form" className="action_form" onSubmit={this.onSubmitHandler}>
                                                    <div className="form-group">
                                                        <label>Your Name <span className="required">*</span></label>
                                                        <input type="text" className={classnames("cus_field", { 'pl_error_input': errors.name })} name="name" id="name" onChange={this.changeHandler} value={this.state.name} />
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Your Email <span className="required">*</span></label>
                                                        <input className={classnames("cus_field", { 'pl_error_input': errors.email })} type="text" name="email" id="email" onChange={this.changeHandler} value={this.state.email} />
                                                    </div>
                                                    <div className="form-group">
                                                    <label>Subject <span className="required">*</span></label>
                                                        <input className={classnames("cus_field", { 'pl_error_input': errors.subject })} type="text" name="subject" id="subject" onChange={this.changeHandler} value={this.state.subject} />
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Your Message</label>
                                                        <textarea className={classnames("cus_field", { 'pl_error_input': errors.message })} onChange={this.changeHandler} name="message" id="message" rows="3" value={this.state.message}></textarea>
                                                    </div>
                                                    <div className="form-group">
                                                        <div className="captcha_container">
                                                            <h2 type="text" id="mainCaptcha">{captchaCode}</h2>
                                                            <input type="hidden" id="captchaCode" name="captchaCode" defaultValue={captchaCode}/>
                                                            <input className={classnames("cus_field", { 'pl_error_input': errors.captcha_input })} name="captcha_input" id="captcha_input" onChange={this.changeHandler} type="text" value={this.state.captcha_input} />
                                                            <button type="button" id="refresh" className="roboto_condensed cus_button cus_button" name="login" onClick={this.Captcha}><i className="fa fa-refresh" aria-hidden="true" ></i></button>
                                                        </div>
                                                    </div>
                                                    <div className="form-group">
                                                        <button type="submit" disabled={isLoading} id="submit-contact" className="roboto_condensed cus_button" name="login">{this.state.action_btn_label?"Please Wait...":"Submit Contact"}</button>
                                                    </div>
                                                </form>
                                            </div>
                                            <div className="pull-left col-md-2"></div>
                                            <div className="pull-left col-md-4">
                                                <h3 className="montserrat page-title">PLEASE DO GET IN TOUCH!</h3>
                                                <div className="get_in_touch_address">
                                                    <p>
                                                        Contact us:
                                                        <a className="techextension-click-to-call" title={Parser(this.state.page.phone)}>
                                                        { this.state.page.hasOwnProperty('phone')? Parser(this.state.page.phone) : '' }
                                                        </a><br />
                                                        Email: { this.state.page.hasOwnProperty('email')? Parser(this.state.page.email) : '' }
                                                    </p>
                                                    <p>{ this.state.page.hasOwnProperty('address')? Parser(this.state.page.address) : '' }</p>
                                                </div>
                                            </div>
                                        </main>
                                    </div>
                                </div>
                            </div>
                        </Fragment>
                    }
                </Fragment>
        );
    }
}

export default Contact;