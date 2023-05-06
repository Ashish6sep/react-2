import React, { Fragment, Component,useEffect   } from "react";
import { AJAX_PUBLIC_REQUEST, SET_STORAGE, GET_STORAGE, APP_VERSION } from "./Constants/AppConstants";
import { Route } from "react-router-dom";
import TagManager from 'react-gtm-module';
import ReactGA from 'react-ga';

import "font-awesome/css/font-awesome.min.css";
import "./Assets/css/bootstrap.min-v4.1.3.css";
import "./Assets/css/jquery.fancybox.min.css";
import "./Assets/css/lib/css/photoswipe.min.css";
import "./Assets/css/styles.css";
import "./Assets/css/custom.css";
import "./Assets/css/responsive.css";
import "./Assets/css/button.css";
import "./Assets/css/masonry.css";
import "./Assets/css/meal.css";
import "./Assets/css/meal_responsive.css";

import $ from "jquery";

import "popper.js";
import "bootstrap/dist/js/bootstrap.min.js";

import Downtime from "./Components/Pages/Downtime";
import Header from "./Components/Layouts/Header";
import Footer from "./Components/Layouts/Footer";
import CommonRoutes from "./Routes/CommonRoutes";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            downtime: false,
            downtime_msg:
                "<h3>Down for maintenance</h3><p>Site is temporarily unavailable due to planned maintenance.</p>"
        };
        console.log('App Version: '+APP_VERSION);
        ReactGA.initialize('UA-121630810-3');
        ReactGA.pageview(window.location.pathname + window.location.search);
    }
    
    componentDidMount() {
        //set setting data
        AJAX_PUBLIC_REQUEST("POST", "user/getSettings", {}).then(results => {
            if (parseInt(results.response.code) === 1000) {
                let response = results.response.data;
                const tagManagerArgs = {
                    gtmId: response.gtm_code
                }
                if(response.gtm_code && (response.gtm_code.trim() != '')){
                    TagManager.initialize(tagManagerArgs);
                }
                
                // response.server_down = 0;
                // response.downtime_access_validity = "invalid";

                // if (GET_STORAGE("settings")) {
                //     const settings_data_validity = JSON.parse(GET_STORAGE("settings"));
                //     if (settings_data_validity.downtime_access_validity) {
                //         if (settings_data_validity.downtime_access_validity === "valid") {
                //             response.downtime_access_validity = "valid";
                //             response.downtime_status = 0;
                //         }
                //     }
                // }

                SET_STORAGE("settings", JSON.stringify(response));
                if (parseInt(results.response.data.downtime_status) === 1) {
                    if (GET_STORAGE("settings")) {
                        const settings_data = JSON.parse(GET_STORAGE("settings"));
                        if (settings_data.downtime_access_validity) {
                            if (settings_data.downtime_access_validity === "valid") {
                                this.setState({
                                    loading: false,
                                    downtime_msg: results.response.data.downtime_message,
                                    downtime: false
                                });
                            } else {
                                this.setState({
                                    loading: false,
                                    downtime_msg: results.response.data.downtime_message,
                                    downtime: true
                                });
                            }
                        } else {
                            this.setState({
                                loading: false,
                                downtime_msg: results.response.data.downtime_message,
                                downtime: true
                            });
                        }
                    } else {
                        this.setState({
                            loading: false,
                            downtime_msg: results.response.data.downtime_message,
                            downtime: true
                        });
                    }
                } else {
                    if (GET_STORAGE("settings")) {
                        let set_settings = JSON.parse(GET_STORAGE("settings"));
                        set_settings.downtime_access_validity = "valid";
                        set_settings.server_down = 0;
                        set_settings.downtime_status = 0;
                        SET_STORAGE("settings", JSON.stringify(set_settings));
                    }
                    this.setState({ loading: false });
                }
            } else if (parseInt(results.response.code) === 4444) {
                this.setState({ loading: false, downtime: true });
            } else {
                this.setState({ loading: false });
            }
        });

        $(window).scroll(function() {
            if ($(window).scrollTop() >= 150) {
                $(".site_menu").addClass("fixed-header");
            } else {
                $(".site_menu").removeClass("fixed-header");
            }
        });

        $(window).scroll(function() {
            if ($(this).scrollTop() > 100) {
                $(".scrollup").show();
            } else {
                $(".scrollup").hide();
            }
        });

        $(".scrollup").click(function() {
            $("html, body").animate(
                {
                    scrollTop: 0
                },
                600
            );
            return false;
        });

        $(".mob_site_menu").on("click", function() {
            $("body").toggleClass("current", 1000);
        });
        this.setState({ loading: false });
    }

    disableDowntime = () => {
        this.setState({ downtime: false })
    }

    render() {
        const cur_url = window.location.href;
        return (
            <Fragment>
                {this.state.downtime ? (
                    <Downtime downtime_msg={this.state.downtime_msg} disableDowntime={this.disableDowntime} />
                ) : (
                    <Fragment>
                        {this.state.loading ? (
                            <div className="home-loading" />
                        ) : (
                            <Fragment>
                                {/* {cur_url.match(/error/g) ? (
                                    <Route path="/error" component={Downtime} exact strict />
                                ) : ( */}
                                    <Fragment>
                                        <Header />
                                        <div className="site-wrapper">
                                            <CommonRoutes />
                                        </div>
                                        <Footer />
                                    </Fragment>
                                {/* )} */}
                            </Fragment>
                        )}
                    </Fragment>
                )}
            </Fragment>
        );
    }
}

export default App;
