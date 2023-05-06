import React, { PureComponent, Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import CustSideMenuLink from '../Customer/Layouts/CustSideMenuLink';
import DistSideMenuLink from '../Distributor/Layouts/DistSideMenuLink';
import MasterAffSideMenuLink from '../MasterAffiliate/Layouts/MasterAffSideMenuLink';
import TeamSideMenuLink from '../TeamMember/Layouts/TeamSideMenuLink';
import { logout } from '../../Store/actions/loginActions';
import { AJAX_REQUEST } from '../../Constants/AppConstants';

class Sidebar extends PureComponent {
    constructor(props){
        super(props)
        this.state = {
          
        }
    }

    logout = (e) => {
        e.preventDefault();
        AJAX_REQUEST("POST", "user/logout", {}).then(results => {
            if(parseInt(results.response.code)===1000){}else{
                // console.log(results.response.message);
            }
        });
        this.props.logout();
    }

    render() { 
        const { user } = this.props.auth;
        return ( 
            <Fragment>
                <nav className="left_menu">
                    <ul>
                        {((user.roles != undefined) && Object.values(user.roles).includes('customer')) && 
                            <CustSideMenuLink />
                        }
                        <li className="">
                            <a onClick={this.logout} href="#"><i className="fa fa-sign-out" aria-hidden="true"></i> Logout</a>
                        </li>
                    </ul>
                </nav>
            </Fragment>
         );
    }
}

Sidebar.propTypes = {
    logout:PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        auth: state.auth
    };
}

export default connect(mapStateToProps, { logout })(Sidebar);