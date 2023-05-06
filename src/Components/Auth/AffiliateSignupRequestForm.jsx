import React, { PureComponent, Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import { API_KEY, GET_COOKIE, GET_STORAGE, DELETE_COOKIE, AJAX_PUBLIC_REQUEST, AJAX_REQUEST_WITH_FILE, DISTRIBUTOR_URL,USER, SET_LOGIN_COOKIE, SET_STORAGE } from '../../Constants/AppConstants';

import classnames from 'classnames';
import Parser from 'html-react-parser';

import distValidateSignup from '../../Validations/distRegistration';
import AlertWrapper from '../Common/AlertWrapper';
import AlertWrapperSuccess from '../Common/AlertWrapperSuccess';
import history from '../../history';

class DistributorSignup extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            // page: '',
            affiliate_code: GET_COOKIE('af'),
            site: GET_COOKIE('site'),
            // countryList: [],
            // stateList: [],
            first_name: '',
            last_name: '',
            username: '',
            password: '',
            confirm_password: '',
            phone: '',
            // business_name: '',            
            // country: '',
            // street: '',
            // city: '',
            // state: '',
            // postcode: '',            
            // facebook_profile_url: '',
            // instagram_profile_url: '',
            // twitter_profile_url: '',
            // have_fitness_business: 'yes',
            // business_type: 'Fitness Facility Owner',
            // other_business_type: '',
            // fitness_industry_year: '',
            // hear_about_us: 'Social Media',
            // other_hear_about_us: '',
            // gymlaunch_hybrid_model: 'yes',
            // why_interested: '',
            // improve_client_health: 'yes',
            // current_customers_no: '',
            // monthly_gross_revenue: '',
            terms_of_service_agree: '',
            errors: {},
            isValid: false,
            isLoading: false,
            isFormValid: true,
            server_message: '',
            success_alert_wrapper_show: false,
        }
    }

    componentDidMount() {
        document.querySelector("body").scrollIntoView();
        // this.getPageContent();
        // this.getCountryList();
        this.setState({
            // loading: false
        });
        window.location.href = DISTRIBUTOR_URL+'login?af='+GET_COOKIE('af')+'&site='+GET_COOKIE('site');
    }

    // getPageContent = (e) => {
    //     document.querySelector("body").scrollIntoView();
    //     AJAX_PUBLIC_REQUEST("POST", "page/getContents", {page_slug:this.props.match.params.slug}).then(results => {
    //         if(parseInt(results.response.code)===1000) {
    //             this.setState({
    //                 page: results.response.data,
    //                 loading:false,
    //             });	
    //             document.title = results.response.data.title;	
    //         } else {
    //             this.setState({ 
    //                 error: Parser("<p className='text-danger'>"+results.response.message+"</p>"),
    //                 loading:false,
    //             })
    //         }            
    //     });
    // }

    changeHandler = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    // getCountryList = () => {
    //     AJAX_PUBLIC_REQUEST("POST", "user/getCountry", {}).then(results => {
    //         if (parseInt(results.response.code) === 1000) {
    //             this.setState({ countryList: results.response.data });
    //         }
    //     });
    // }

    // getStateList = (countryId) => {
    //     let data = { country_id: countryId };
    //     AJAX_PUBLIC_REQUEST("POST", "user/getState", data).then(results => {
    //         if (parseInt(results.response.code) === 1000) {
    //             this.setState({ stateList: results.response.data });
    //         } else {
    //             this.setState({ stateList: [] })
    //         }
    //     });
    // }

    // onChangeCountry = (e) => {
    //     let countryId = e.target.value;
    //     if (countryId != "") {
    //         this.setState({ [e.target.name]: countryId })
    //     } else {
    //         this.setState({ [e.target.name]: countryId, billing_state: '' })
    //     }
    //     this.getStateList(countryId);
    // }

    changeAcceptHandler = (e) => {
        if (document.getElementById("terms_of_service_agree").checked) {
            this.setState({
                terms_of_service_agree: 'checked'
            });
        } else {
            this.setState({
                terms_of_service_agree: ''
            });
        }
    }

    timeOut = (timedata) => {
        setTimeout(function () {
            this.setState({
                success_alert_wrapper_show: false
            });
        }.bind(this), timedata);
    }

    onSubmit = (e) => {
        e.preventDefault();
        const val_return = distValidateSignup(this.state);
        this.setState(val_return);
        if (val_return.isValid) {

            let data = new FormData();
            data.append('api_key', API_KEY);
            data.append('affiliate_code', this.state.affiliate_code);
            data.append('site', this.state.site);
            data.append('first_name', this.state.first_name);
            data.append('last_name', this.state.last_name);
            // data.append('business_name', this.state.business_name);
            data.append('username', this.state.username);
            data.append('password', this.state.password);
            data.append('confirm_password', this.state.confirm_password);
            data.append('phone', this.state.phone);
            // data.append('country', this.state.country);
            // data.append('street', this.state.street);
            // data.append('city', this.state.city);
            // data.append('state', this.state.state);
            // data.append('postcode', this.state.postcode);            
            // data.append('facebook_profile_url', this.state.facebook_profile_url);
            // data.append('instagram_profile_url', this.state.instagram_profile_url);
            // data.append('twitter_profile_url', this.state.twitter_profile_url);
            // data.append('have_fitness_business', this.state.have_fitness_business);
            // data.append('business_type', this.state.business_type);
            // data.append('other_business_type', this.state.other_business_type);
            // data.append('fitness_industry_year', this.state.fitness_industry_year);
            // data.append('hear_about_us', this.state.hear_about_us);
            // data.append('other_hear_about_us', this.state.other_hear_about_us);
            // data.append('gymlaunch_hybrid_model', this.state.gymlaunch_hybrid_model);
            // data.append('why_interested', this.state.why_interested);
            // data.append('improve_client_health', this.state.improve_client_health);
            // data.append('current_customers_no', this.state.current_customers_no);
            // data.append('monthly_gross_revenue', this.state.monthly_gross_revenue);

            this.setState({ errors: {}, isLoading: true });

            AJAX_REQUEST_WITH_FILE("POST", "distributor/signup_request_new", data).then(results => {
                const response = results.response;
                if (parseInt(results.response.code) === 1000) {
                    SET_STORAGE(USER,JSON.stringify(response.data));
                    SET_LOGIN_COOKIE(JSON.stringify(response.data));
                    window.location.href = DISTRIBUTOR_URL+'serviceLogin?token='+response.data.token;

                    this.setState({
                        isLoading: false,
                        isFormValid: true,
                        server_message: response.message,
                        success_alert_wrapper_show: true,
                        // countryList: [],
                        // stateList: [],
                        first_name: '',
                        last_name: '',
                        // business_name: '',
                        username: '',
                        password: '',
                        confirm_password: '',
                        // country: '',
                        // street: '',
                        // city: '',
                        // state: '',
                        // postcode: '',
                        phone: '',
                        // facebook_profile_url: '',
                        // instagram_profile_url: '',
                        // twitter_profile_url: '',
                        // have_fitness_business: 'yes',
                        // business_type: 'Fitness Facility Owner',
                        // other_business_type: '',
                        // fitness_industry_year: '',
                        // hear_about_us: '',
                        // other_hear_about_us: '',
                        // gymlaunch_hybrid_model: '',
                        // why_interested: '',
                        // improve_client_health: '',
                        // current_customers_no: '',
                        // monthly_gross_revenue: '',
                    });
                    this.timeOut(5000);
                    DELETE_COOKIE('af');
                    DELETE_COOKIE('site');
                    document.querySelector("body").scrollIntoView();
                } else {
                    this.setState({
                        server_message: response.message,
                        isLoading: false,
                        isFormValid: false,
                        success_alert_wrapper_show: false,
                    });
                    document.querySelector("body").scrollIntoView();
                }
            });
        } else {
            document.querySelector("body").scrollIntoView();
        }
    }

    render() {
        const { errors, server_message } = this.state;

        const errors_data = server_message;
        return (
            <Fragment>
                {
                    this.state.loading ?
                        <div className="loading container full_page_loader"></div>
                        :
                        <React.Fragment>
                            <div className="container">
                                <div className="rows">
                                    <main className="site-content">
                                        {/* <div className="page-content entry-content">
                                        <div className="montserrat page-title">{ this.state.page.hasOwnProperty('title')? Parser(this.state.page.title) : this.state.error }</div>
                                        { this.state.page.hasOwnProperty('contents')? Parser(this.state.page.contents) : this.state.error }
                                    </div> */}
                                        <div className="page-content entry-content user_registration">
                                            <div className="page-title">Affiliate Registration Form</div>
                                            <div className="registration-form">
                                                <AlertWrapper errors_data={errors_data} isFormValid={this.state.isFormValid} />
                                                <AlertWrapperSuccess errors_data={errors_data} success_alert_wrapper_show={this.state.success_alert_wrapper_show} />
                                                <form onSubmit={this.onSubmit} method="post" id="registration_Form" className="register action_form" encType="multipart/form-data">
                                                    <div className="form-group pull-left name_field has-error">
                                                        <label className={classnames(null, { 'pl_error_label': errors.first_name })} htmlFor="reg_sr_first_name">First Name <span className="required">*</span></label>
                                                        <input type="text" className={classnames("cus_field", { 'pl_error_input': errors.first_name })} name="first_name" id="reg_sr_first_name" value={this.state.first_name} onChange={this.changeHandler} />
                                                    </div>
                                                    <div className="form-group pull-right name_field">
                                                        <label className={classnames(null, { 'pl_error_label': errors.last_name })} htmlFor="reg_sr_last_name">Last Name <span className="required">*</span></label>
                                                        <input type="text" className={classnames("cus_field", { 'pl_error_input': errors.last_name })} name="last_name" id="reg_sr_last_name" value={this.state.last_name} onChange={this.changeHandler} />
                                                    </div>
                                                    <div className="form-group">
                                                        <label className={classnames(null, { 'pl_error_label': errors.username })} htmlFor="reg_username">Username (email address) <span className="required">*</span></label>
                                                        <input type="text" className={classnames("cus_field", { 'pl_error_input': errors.username })} name="username" id="reg_username" value={this.state.username} onChange={this.changeHandler} />
                                                    </div>
                                                    <div className="form-group pull-left name_field has-error">
                                                        <label className={classnames(null, { 'pl_error_label': errors.password })} htmlFor="reg_password">Password <span className="required">*</span></label>
                                                        <input type="password" className={classnames("cus_field", { 'pl_error_input': errors.password })} name="password" id="reg_password" value={this.state.password} onChange={this.changeHandler} />
                                                    </div>
                                                    <div className="form-group pull-right name_field has-error">
                                                        <label className={classnames(null, { 'pl_error_label': errors.confirm_password })} htmlFor="reg_confirm_password">Confirm Password <span className="required">*</span></label>
                                                        <input type="password" className={classnames("cus_field", { 'pl_error_input': errors.confirm_password })} name="confirm_password" id="reg_confirm_password" value={this.state.confirm_password} onChange={this.changeHandler} />
                                                    </div>
                                                    <div className="clearfix"></div>
                                                    <div className="form-group">
                                                        <label className="">Phone Number (must include area code) <span className="required">*</span> </label>
                                                        <input onChange={this.changeHandler} value={this.state.phone} type="text" className={classnames("cus_field", { 'pl_error_input': errors.phone })} name="phone" placeholder="" />
                                                    </div>
                                                    {/* <div className="form-group">
                                                        <label>Business Name </label>
                                                        <input type="text" className={classnames("cus_field", { 'pl_error_input': errors.business_name })} name="business_name" id="" onChange={this.changeHandler} value={this.state.business_name} />
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Country <span className="required">*</span></label>
                                                        <select onChange={this.onChangeCountry} value={this.state.country} name="country" className={classnames("cus_field", { 'pl_error_input': errors.country })}>
                                                            <option value="">Select a Country…</option>
                                                            {
                                                                (this.state.countryList.length <= 0) ? null :
                                                                    this.state.countryList.map(function (country, key) {
                                                                        return (
                                                                            <option key={key} value={country.id}>{country.name}</option>
                                                                        )
                                                                    }.bind(this))
                                                            }
                                                        </select>
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Street <span className="required">*</span></label>
                                                        <input type="text" className={classnames("cus_field", { 'pl_error_input': errors.street })} name="street" id="" onChange={this.changeHandler} value={this.state.street} />
                                                    </div>
                                                    <div className="form-group">
                                                        <label>City <span className="required">*</span></label>
                                                        <input type="text" className={classnames("cus_field", { 'pl_error_input': errors.city })} name="city" id="" onChange={this.changeHandler} value={this.state.city} />
                                                    </div>
                                                    <div className="form-group">
                                                        <label>State or Province  <span className="required">*</span></label>
                                                        <select onChange={this.changeHandler} value={this.state.state} name="state" className={classnames("cus_field", { 'pl_error_input': errors.state })}>
                                                            <option value="">Select a state...</option>
                                                            {
                                                                (this.state.stateList.length <= 0) ? null :
                                                                    this.state.stateList.map(function (state, key) {
                                                                        return (
                                                                            <option key={key} value={state.code}>{state.name}</option>
                                                                        )
                                                                    }.bind(this))
                                                            }
                                                        </select>
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Postal Code <span className="required">*</span></label>
                                                        <input type="text" className={classnames("cus_field", { 'pl_error_input': errors.postcode })} name="postcode" id="" onChange={this.changeHandler} value={this.state.postcode} />
                                                    </div> */}

                                                    {/* <div className="form-group">
                                                        <label>Facebook Profile URL <span className="required">*</span></label>
                                                        <input type="text" className={classnames("cus_field", { 'pl_error_input': errors.facebook_profile_url })} name="facebook_profile_url" id="" onChange={this.changeHandler} value={this.state.facebook_profile_url} />
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Instagram Profile URL </label>
                                                        <input type="text" className={classnames("cus_field", { 'pl_error_input': errors.instagram_profile_url })} name="instagram_profile_url" id="" onChange={this.changeHandler} value={this.state.instagram_profile_url} />
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Twitter Profile URL </label>
                                                        <input type="text" className={classnames("cus_field", { 'pl_error_input': errors.twitter_profile_url })} name="twitter_profile_url" id="" onChange={this.changeHandler} value={this.state.twitter_profile_url} />
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Do you currently own or run a fitness business? <span className="required">*</span></label>
                                                        <select onChange={this.changeHandler} value={this.state.have_fitness_business} name="have_fitness_business" className={classnames("cus_field", { 'pl_error_input': errors.have_fitness_business })}>
                                                            <option value="yes">YES</option>
                                                            <option value="no">NO</option>
                                                            <option value="future_plane">FUTURE PLANNED</option>
                                                        </select>
                                                    </div> */}
                                                    {
                                                        this.state.have_fitness_business === "future_plane" ?
                                                            <Fragment>
                                                                {/* <div className="form-group">
                                                        <label>What type of business? <span className="required">*</span></label>
                                                        <input type="text" className={classnames("cus_field", { 'pl_error_input': errors.business_type })} name="business_type" id="" onChange={this.changeHandler} value={this.state.business_type}/>
                                                    </div> */}
                                                                {/* <div className="form-group">
                                                                    <label>What type of business? <span className="required">*</span></label>
                                                                    <select onChange={this.changeHandler} value={this.state.business_type} name="business_type" className={classnames("cus_field", { 'pl_error_input': errors.business_type })}>
                                                                        <option value="Fitness Facility Owner">Fitness Facility Owner</option>
                                                                        <option value="Personal trainer at a Fitness Facility">Personal trainer at a Fitness Facility</option>
                                                                        <option value="Online Personal Trainer">Online Personal Trainer</option>
                                                                        <option value="other_business_type">Other</option>
                                                                    </select>
                                                                </div>
                                                                {
                                                                    this.state.business_type === "other_business_type" ?
                                                                        <div className="form-group">
                                                                            <input type="text" className={classnames("cus_field", { 'pl_error_input': errors.other_business_type })} name="other_business_type" id="" onChange={this.changeHandler} value={this.state.other_business_type} />
                                                                        </div>
                                                                        : ''
                                                                } */}
                                                            </Fragment>
                                                            :
                                                            ''
                                                    }

                                                    {
                                                        this.state.have_fitness_business === "yes" ?
                                                            <Fragment>
                                                                {/* <div className="form-group">
                                                        <label>What type of business? <span className="required">*</span></label>
                                                        <input type="text" className={classnames("cus_field", { 'pl_error_input': errors.business_type })} name="business_type" id="" onChange={this.changeHandler} value={this.state.business_type}/>
                                                    </div> */}
                                                                {/* <div className="form-group">
                                                                    <label>What type of business? <span className="required">*</span></label>
                                                                    <select onChange={this.changeHandler} value={this.state.business_type} name="business_type" className={classnames("cus_field", { 'pl_error_input': errors.business_type })}>
                                                                        <option value="Fitness Facility Owner">Fitness Facility Owner</option>
                                                                        <option value="Personal trainer at a Fitness Facility">Personal trainer at a Fitness Facility</option>
                                                                        <option value="Online Personal Trainer">Online Personal Trainer</option>
                                                                        <option value="other_business_type">Other</option>
                                                                    </select>
                                                                </div>
                                                                {
                                                                    this.state.business_type === "other_business_type" ?
                                                                        <div className="form-group">
                                                                            <input type="text" className={classnames("cus_field", { 'pl_error_input': errors.other_business_type })} name="other_business_type" id="" onChange={this.changeHandler} value={this.state.other_business_type} />
                                                                        </div>
                                                                        : ''
                                                                }
                                                                <div className="form-group">
                                                                    <label>How many years have you been in the Fitness industry? </label>
                                                                    <input type="text" className={classnames("cus_field", { 'pl_error_input': errors.fitness_industry_year })} name="fitness_industry_year" id="" onChange={this.changeHandler} value={this.state.fitness_industry_year} />
                                                                </div>
                                                                <div className="form-group">
                                                                    <label>How many customers do you currently have? <span className="required">*</span></label>
                                                                    <input type="text" className={classnames("cus_field", { 'pl_error_input': errors.current_customers_no })} name="current_customers_no" id="" onChange={this.changeHandler} value={this.state.current_customers_no} />
                                                                </div>
                                                                <div className="form-group">
                                                                    <label>How much is your monthly gross revenue? <span className="required">*</span></label>
                                                                    <input type="text" className={classnames("cus_field", { 'pl_error_input': errors.monthly_gross_revenue })} name="monthly_gross_revenue" id="" onChange={this.changeHandler} value={this.state.monthly_gross_revenue} />
                                                                </div> */}
                                                            </Fragment>
                                                            :
                                                            ''
                                                    }

                                                    {/* <div className="form-group">
                                                        <label>How did you hear about us? </label>
                                                        <select onChange={this.changeHandler} value={this.state.hear_about_us} name="hear_about_us" className={classnames("cus_field", { 'pl_error_input': errors.hear_about_us })}>
                                                            <option value="Social Media">Social Media</option>
                                                            <option value="Referral">Referral</option>
                                                            <option value="Google Search">Google Search</option>
                                                            <option value="other_hear_about_us">Other</option>
                                                        </select>
                                                    </div>
                                                    {
                                                        this.state.hear_about_us === "other_hear_about_us" ?
                                                            <div className="form-group">
                                                                <input type="text" className={classnames("cus_field", { 'pl_error_input': errors.other_hear_about_us })} name="other_hear_about_us" id="" onChange={this.changeHandler} value={this.state.other_hear_about_us} />
                                                            </div>
                                                            : ''
                                                    }
                                                    <div className="form-group">
                                                        <label>Have you implemented the cutting-edge Gym Launch Hybrid model? <span className="required">*</span></label>
                                                        <select onChange={this.changeHandler} value={this.state.gymlaunch_hybrid_model} name="gymlaunch_hybrid_model" className={classnames("cus_field", { 'pl_error_input': errors.gymlaunch_hybrid_model })}>
                                                            <option value="yes">YES</option>
                                                            <option value="no">NO</option>
                                                        </select>
                                                    </div>
                                                    {
                                                        this.state.gymlaunch_hybrid_model === "no" ?
                                                            <Fragment>
                                                                <div className="form-group">
                                                                    <label>Would you be better off making an extra $15k per year by improving your client’s health? </label>
                                                                    <select onChange={this.changeHandler} value={this.state.improve_client_health} name="improve_client_health" className={classnames("cus_field", { 'pl_error_input': errors.improve_client_health })}>
                                                                        <option value="yes">YES</option>
                                                                        <option value="no">NO</option>
                                                                    </select>
                                                                </div>
                                                                <div className="form-group">
                                                                    <label>Why are you interested in becoming a Prestige Labs Affiliate? <span className="required">*</span></label>
                                                                    <input type="text" className={classnames("cus_field", { 'pl_error_input': errors.why_interested })} name="why_interested" id="" onChange={this.changeHandler} value={this.state.why_interested} />
                                                                </div>
                                                            </Fragment>
                                                            : ''
                                                    } */}

                                                    <div className="clearfix"></div>
                                                    <div className="form-group">
                                                        <label className={classnames(null, { 'pl_error_checkbox': errors.terms_of_service_agree })}>
                                                            <input className={classnames(null, { 'pl_error': errors.terms_of_service_agree })} name="terms_of_service_agree" type="checkbox" id="terms_of_service_agree" value={this.state.terms_of_service_agree} onChange={this.changeAcceptHandler} />
                                                            <span>  I agree to be contacted by Prestige Labs and Gym Launch Secrets via the number and email provided about my application as well as offers and deals, including through the use of automated technology. I understand that consent is not a condition to purchase anything.
                                                    </span>
                                                        </label>
                                                    </div>
                                                    <div className="form-group">
                                                        <button type="submit" disabled={this.state.isLoading} className="cus_button" name="login">{this.state.isLoading ? 'Please Wait...' : 'Submit'}</button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </main>
                                </div>
                            </div>
                        </React.Fragment>
                }
            </Fragment>
        );
    }
}

export default DistributorSignup;