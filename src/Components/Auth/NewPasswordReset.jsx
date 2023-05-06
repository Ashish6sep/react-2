import React, { PureComponent, Fragment } from 'react';
import PropTypes from "prop-types";
import { connect } from 'react-redux';
import history from '../../history';
import { logout } from '../../Store/actions/loginActions';
import { newPasswordResetRequest } from '../../Store/actions/newPasswordResetActions';
import { addFlashMessage } from '../../Store/actions/flashMessages';

import NewPasswordResetForm from './NewPasswordResetForm';

import { AJAX_REQUEST } from '../../Constants/AppConstants';

class NewPasswordReset extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            loading: true
        }
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
        document.title = "Change Password - Prestige Labs";
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
        const { newPasswordResetRequest, addFlashMessage } = this.props;
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
                                                <div className="montserrat page-title">Change Password</div>
                                                <NewPasswordResetForm newPasswordResetRequest={newPasswordResetRequest} addFlashMessage={addFlashMessage} />
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

NewPasswordReset.propTypes = {
    newPasswordResetRequest: PropTypes.func.isRequired,
    addFlashMessage: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    logout: PropTypes.func.isRequired,
}

function mapStateToProps(state) {
    return {
        isAuthenticated: state.auth.isAuthenticated
    }
}

export default connect(mapStateToProps, { newPasswordResetRequest, addFlashMessage, logout })(NewPasswordReset);