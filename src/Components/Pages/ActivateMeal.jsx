import React, { Component } from 'react';
import Parser from 'html-react-parser';
import history from '../../history';
import { SET_STORAGE, AJAX_REQUEST, BASE_URL } from '../../Constants/AppConstants';

class ActivateMeal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            downtime_message: '<h3>Activate Meal</h3><p>Enter your activation code to activate meal features</p>'
        }
    }

    submitAccessCodeForm = (e) => {
        e.preventDefault();
        const access_code = document.getElementById('access_code').value;
        AJAX_REQUEST("POST", "meal/codeVerify", { code: access_code }).then(results => {
            if (parseInt(results.response.code) === 1000) {
                SET_STORAGE('meal_menu_access','true');
                SET_STORAGE('meal_menu_access_code',access_code);
                window.location.href = BASE_URL+'meals';
            }else{
                alert(results.response.message);
            }
        });
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="activate_meal_container">
                            {Parser(this.state.downtime_message)}
                            <form id="access_code_form" onSubmit={this.submitAccessCodeForm}>
                                <p>Access Code : <input type="text" name="access_code" id="access_code" required /> <button type="submit">Submit</button></p>
                            </form>
                        </div>
                    </div>
                    <div className="clearfix"></div>
                </div>
            </div>

        );
    }
}

export default ActivateMeal;