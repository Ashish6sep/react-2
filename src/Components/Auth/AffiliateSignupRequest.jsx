import React, { PureComponent, Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import { API_KEY, GET_COOKIE, AJAX_PUBLIC_REQUEST } from '../../Constants/AppConstants';
import Parser from 'html-react-parser';

class DistributorSignup extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            loading:true,
            page: '',
            api_key: API_KEY,
            registration_link:"/affiliate-signup-request-form"
        }
    }

    componentDidMount(){
        document.querySelector("body").scrollIntoView();
        if(GET_COOKIE("af") != "" && GET_COOKIE("site") != ""){
            this.setState({
                registration_link:"/affiliate-signup-request-form?af="+GET_COOKIE("af")+'&site='+GET_COOKIE("site")
            })
        }else if(GET_COOKIE("af") === "" && GET_COOKIE("site") != ""){
            this.setState({
                registration_link:'/affiliate-signup-request-form?site='+GET_COOKIE("site")
            })
        }else if(GET_COOKIE("af") != "" && GET_COOKIE("site") === ""){
            this.setState({
                registration_link:"/affiliate-signup-request-form?af="+GET_COOKIE("af")
            })
        }else{
            this.setState({
                registration_link:"/affiliate-signup-request-form"
            })
        }
        this.getPageContent();       
    }

    getPageContent = (e) => {
        document.querySelector("body").scrollIntoView();
        AJAX_PUBLIC_REQUEST("POST", "page/getAffiliateSignUpContents", {}).then(results => {
            if(parseInt(results.response.code)===1000) {
                this.setState({
                    page: results.response.data,
                    loading:false,
                });	
                document.title = results.response.data.title;	
            } else {
                this.setState({ 
                    error: Parser("<p className='text-danger'>"+results.response.message+"</p>"),
                    loading:false,
                })
            }            
        });
    }

    render() {
        return (
            <Fragment>
                {
                        this.state.loading ? 
                        <div className="loading container full_page_loader"></div>
                        :
                    <React.Fragment>
                        <div className="container-fluid">
                            <div className="rows">
                                <main className="site-content">
                                    <div className="page-content entry-content">
                                        {/* <div className="montserrat page-title">{ this.state.page.hasOwnProperty('title')? Parser(this.state.page.title) : this.state.error }</div> */}
                                        { this.state.page.hasOwnProperty('contents')? Parser(this.state.page.contents) : this.state.error }
                                    </div>
                                    {/* <div className="page-content entry-content">
                                        <div className="montserrat page-title">Affiliate Registration</div>
                                        <div>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc,</div>
                                        <br />
                                        <NavLink to={this.state.registration_link} className="roboto_condensed cus_button signup-form" >Apply Now</NavLink>
                                    </div> */}
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