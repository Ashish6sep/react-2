import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addFlashMessage } from '../Store/actions/flashMessages';
import history from '../history';
import PropTypes from 'prop-types';

export default function (ComposedComponent){
    class Authenticate extends Component {
        componentDidMount(){
            if(!this.props.isAuthenticated){
                // this.props.addFlashMessage({
                //     type:'error',
                //     text: 'You need to login to access this page'
                // });
                history.push('/login');
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
        addFlashMessage: PropTypes.func.isRequired
    }

    function mapStateToProps(state) {
        return{
            isAuthenticated: state.auth.isAuthenticated
        }
    }
    
    return connect(mapStateToProps, { addFlashMessage })(Authenticate);
}
