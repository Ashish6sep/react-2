import React, { PureComponent, Fragment } from 'react';
import PropTypes from "prop-types";
import { connect } from 'react-redux';

import { passwordResetRequest } from '../../Store/actions/passwordResetActions';
import { addFlashMessage } from '../../Store/actions/flashMessages';
import { logout } from '../../Store/actions/loginActions';
import history from '../../history';
import PasswordResetForm from './PasswordResetForm';
import { AJAX_REQUEST } from '../../Constants/AppConstants';

class PasswordReset extends PureComponent {
    constructor(props) {
        super(props)
        if (this.props.isAuthenticated) {
            AJAX_REQUEST("POST", "user/details", {}).then(results => {
                const response = results.response;
                if (parseInt(response.code) === 1000) {
                    history.push('/');
                } else {
                    this.props.logout();
                }
            });
        }
        this.state = {
            loading: true
        }
        document.title = "Password Reset - Prestige Labs";
    }

    changeHandler = (e) => {
        [e.target.name] = e.target.value;
    }

    componentDidMount() {
        document.querySelector("body").scrollIntoView();
        this.setState({
            loading: false
        });
    }

    render() {
        const { passwordResetRequest, addFlashMessage } = this.props;
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
                                        <main>
                                            <div className="page-content entry-content">
                                                <div className="montserrat page-title">Lost password</div>
                                                <PasswordResetForm passwordResetRequest={passwordResetRequest} addFlashMessage={addFlashMessage} />
                                            </div>
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

PasswordReset.propTypes = {
    passwordResetRequest: PropTypes.func.isRequired,
    addFlashMessage: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired
}

function mapStateToProps(state) {
    return {
        isAuthenticated: state.auth.isAuthenticated
    }
}

export default connect(mapStateToProps, { passwordResetRequest, addFlashMessage, logout })(PasswordReset);