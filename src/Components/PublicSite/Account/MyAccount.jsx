import React, { PureComponent, Fragment } from 'react';
import { CUSTOMER_URL, DISTRIBUTOR_URL, AJAX_SERVICE_LOGIN_REQUEST } from "../../../Constants/AppConstants";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import history from '../../../history';
import { logout } from '../../../Store/actions/loginActions';

class MyAccount extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            loading: true
        }
        document.title = "My Account -Prestige Labs";
    }

    componentDidMount() {
        document.querySelector("body").scrollIntoView();
        if (this.props.auth) {
            if (this.props.auth.isAuthenticated) {
                AJAX_SERVICE_LOGIN_REQUEST("POST", "user/updateAccessToken", { user_token: this.props.auth.user.token }).then(results => {
                    if (parseInt(results.response.code) === 1000) {
                        if ((this.props.auth.user.roles != undefined) && Object.values(this.props.auth.user.roles).includes('customer')) {
                            window.location.href = CUSTOMER_URL + 'serviceLogin?token=' + this.props.auth.user.token;
                        } else {
                            window.location.href = DISTRIBUTOR_URL + 'serviceLogin?token=' + this.props.auth.user.token + '&redirect=' + DISTRIBUTOR_URL + 'my-account';
                        }
                    } else {
                        this.props.logout();
                        history.push('/login');
                    }
                });
            } else {
                history.push('/login');
            }
        } else {
            history.push('/login');
        }
    }

    render() {
        return (
            <Fragment>
                {
                    this.state.loading ?
                        <div className="loading container"></div>
                        :
                        <Fragment>
                            <div>My Account</div>
                        </Fragment>
                }
            </Fragment>
        );
    }
}

MyAccount.propTypes = {
    auth: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired,
}

function mapStateToProps(state) {
    return {
        auth: state.auth
    };
}

export default connect(mapStateToProps, { logout })(MyAccount);