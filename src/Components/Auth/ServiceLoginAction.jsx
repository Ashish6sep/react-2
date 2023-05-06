import React, { Component } from 'react';
import PropTypes from "prop-types";
import { API_KEY, USER, GET_STORAGE, DISTRIBUTOR_URL } from '../../Constants/AppConstants';
import history from '../../history';

class ServiceLoginAction extends Component {
    constructor(props) {
        super(props)
        this.state = {
            api_key: API_KEY,
            token: ''
        }
    }

    componentDidMount() {
        var url = new URL(window.location.href);
        var token = url.searchParams.get("token");
        this.setState({
            token
        });
        this.makeLoad(token);
    }

    checkToken = (token) => {
        let data = {
            'user_token': token
        };
        // let data = new FormData();
        // data.append('api_key', this.state.api_key);
        // data.append('user_token', token);
        this.props.serviceLoginRequest(data).then(results => {
            if (results.response.code === 1000) {
                const url = new URL(window.location.href);
                const redirect = url.searchParams.get("redirect");
                if (Object.values(results.response.data.roles).includes('customer')) {
                    if (redirect) {
                        window.location.href = redirect;
                    } else {
                        history.push('/');
                    }
                } else {
                    this.props.serviceLogout();
                    if (redirect) {
                        window.location.href = DISTRIBUTOR_URL + 'serviceLogin?token=' + results.response.data.token + '&redirect=' + redirect;
                    } else {
                        window.location.href = DISTRIBUTOR_URL + 'serviceLogin?token=' + results.response.data.token;
                    }
                }
            } else {
                history.push('/login');
            }
        }
        );
    }

    makeLoad = (token) => {
        const local_data = JSON.parse(GET_STORAGE(USER));
        if (local_data) {
            if (local_data.token === token) {
                const url = new URL(window.location.href);
                const redirect = url.searchParams.get("redirect");
                // if(local_data.role === 'customer'){
                if (Object.values(local_data.roles).includes('customer')) {
                    if (redirect) {
                        window.location.href = redirect;
                    } else {
                        history.push('/');
                    }
                } else {
                    this.props.serviceLogout();
                    if (redirect) {
                        window.location.href = DISTRIBUTOR_URL + 'serviceLogin?token=' + local_data.token + '&redirect=' + redirect;
                    } else {
                        window.location.href = DISTRIBUTOR_URL + 'serviceLogin?token=' + local_data.token;
                    }
                }
            } else {
                this.props.serviceLogout();
                this.checkToken(token);
            }
        } else {
            this.checkToken(token);
        }
    }

    render() {
        return (<div className="loading"></div>);
    }
}

ServiceLoginAction.propTypes = {
    serviceLoginRequest: PropTypes.func.isRequired,
    serviceLogout: PropTypes.func.isRequired
}

export default ServiceLoginAction;