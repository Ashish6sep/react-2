import React, { Component } from 'react';
import { SET_COOKIE, COOKIE_EXP_DAY } from '../Constants/AppConstants';
import { connect } from 'react-redux';
import { addFlashMessage } from '../Store/actions/flashMessages';
import history from '../history';
import PropTypes from 'prop-types';
import { logout } from '../Store/actions/loginActions';

export default function (ComposedComponent){
    class Authenticate extends Component {
        componentDidMount(){
            
            // Save master affiliate refered code
            const refCode = this.props.location.search.substring(4);
            if(refCode) {
                SET_COOKIE('af', refCode, COOKIE_EXP_DAY);
            }            

            if(!this.props.isAuthenticated){
                // this.props.addFlashMessage({
                //     type:'error',
                //     text: 'You need to login to access this page'
                // });
                history.push('/login');
            }else{
                if(this.props.user.roles != undefined){
                    if(Object.values(this.props.user.roles).includes('distributor')){

                    }else{
                        this.props.logout();
                    }
                }else{
                    this.props.logout();
                }
                // if(!(this.props.user.role === 'distributor')){
                //     this.props.logout();
                // }
            }
        }

        componentDidUpdate(nextProps){
            if(!nextProps.isAuthenticated){
                history.push('/login');
            }
        }

        render() { 
            return (
                <ComposedComponent {...this.props} />
            );
        }
    }

    Authenticate.propTypes = {
        isAuthenticated: PropTypes.bool.isRequired,
        user: PropTypes.object.isRequired,
        addFlashMessage: PropTypes.func.isRequired,
        logout:PropTypes.func.isRequired
    }

    function mapStateToProps(state) {
        return{
            isAuthenticated: state.auth.isAuthenticated,
            user: state.auth.user
        }
    }
    
    return connect(mapStateToProps, { addFlashMessage, logout })(Authenticate);
}
