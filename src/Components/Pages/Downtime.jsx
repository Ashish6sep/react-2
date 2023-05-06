import React, { Component } from 'react';
import Parser from 'html-react-parser';
import { NavLink } from 'react-router-dom';
import history from '../../history';
import { GET_STORAGE, DOWNTIME_ACCESS_CODE, SET_STORAGE } from '../../Constants/AppConstants';

class Downtime extends Component {
    constructor(props) {
        super(props);

        let settings = '';
        if (GET_STORAGE('settings')) {
            settings = JSON.parse(GET_STORAGE('settings'));
            if (settings) {
                if (settings.downtime_access_validity === 'valid') {
                    history.push('/');
                }
            }
        }

        this.state = {
            downtime_message: (settings && settings.downtime_message) ? settings.downtime_message : '<h3>Down for maintenance</h3><p>Site is temporarily unavailable due to planned maintenance.</p>'
        }
    }

    submitAccessCodeForm = (e) => {
        e.preventDefault();
        const access_code = document.getElementById('access_code').value;
        if (DOWNTIME_ACCESS_CODE === access_code) {
            if (GET_STORAGE('settings')) {
                let settings = JSON.parse(GET_STORAGE('settings'));
                settings.downtime_access_validity = 'valid';
                settings.server_down = 0;
                settings.downtime_status = 0;
                SET_STORAGE('settings', JSON.stringify(settings));
            }
            this.props.disableDowntime();
            // const redirect = window.location.origin;
            // window.location.href = redirect;
        } else {
            alert('Invalid Access Code');
        }
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-6">
                        <main className="error404Img">
                            <img className="" src={require('../../Assets/images/404.png')} />
                        </main>
                    </div>
                    <div className="col-md-6">
                        <div className="sitedown_container">
                            {/* <NavLink to="/"><img className="" src={require('../../Assets/images/prestigelabs-logo.png')} /></NavLink> */}
                            {Parser(this.state.downtime_message)}
                            <form id="access_code_form" onSubmit={this.submitAccessCodeForm}>
                                <p>Access Code : <input type="password" name="access_code" id="access_code" required /> <button type="submit">Submit</button></p>
                            </form>
                        </div>
                    </div>
                    <div className="clearfix"></div>
                </div>
            </div>

        );
    }
}

export default Downtime;