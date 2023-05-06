import React, { PureComponent } from 'react';
import { NavLink } from 'react-router-dom';
import classnames from 'classnames';
import Parser from 'html-react-parser';
import { AJAX_PUBLIC_REQUEST, IS_DEMO_SITE, DEMO_SITE_WARNING_TEXT } from '../../Constants/AppConstants';
import moment from 'moment';

class Footer extends PureComponent {
    state = {
        page: '',
        footer_menu: '',
        is_demo_active: true
    }

    componentDidMount() {
        AJAX_PUBLIC_REQUEST("POST", "menu/getFooterInfo", {}).then(results => {
            if (parseInt(results.response.code) === 1000) {
                this.setState({
                    footer_menu: results.response.data,
                });
            }
        });
        AJAX_PUBLIC_REQUEST("POST", "page/getContactInfo", {}).then(results => {
            if (parseInt(results.response.code) === 1000) {
                this.setState({
                    page: results.response.data,
                });
            }
        });

        const script = document.createElement("script");
    
        script.src = "//cdn.iubenda.com/cs/iubenda_cs.js";
        script.async = true;
        script.charset="UTF-8";
    
        document.body.appendChild(script);
        var se = document.createElement('script');
            se.setAttribute('type', 'text/javascript');
            se.appendChild(document.createTextNode('var _iub = _iub || []; _iub.csConfiguration = {"consentOnContinuedBrowsing":false,"whitelabel":false,"lang":"en","siteId":1943478,"cookiePolicyId":69020087, "banner":{ "acceptButtonDisplay":true,"customizeButtonDisplay":true,"position":"float-top-center" }};'));
            document.getElementsByTagName('body').item(0).appendChild(se);
        
    //     var feedbackScript = document.createElement('script');
    //     feedbackScript.setAttribute('type', 'text/javascript');
    //     feedbackScript.appendChild(document.createTextNode(`Userback = window.Userback || {};
    // Userback.access_token = '9512|18246|HjiUP9ydSiQ1vTRIczTjfXiyPrR8Xecn8QKof4kP4lNK4Yi7jd';
    // (function(id) {
    //     var s = document.createElement('script');
    //     s.async = 1;s.src = 'https://static.userback.io/widget/v1.js';
    //     var parent_node = document.head || document.body;parent_node.appendChild(s);
    // })('userback-sdk');`));
    //         document.getElementsByTagName('body').item(0).appendChild(feedbackScript);

    }


    //GA Script
    // componentDidMount () {
    //     const script = document.createElement("script");
    
    //     script.src = "https://www.googletagmanager.com/gtag/js?id=UA-121630810-3";
    //     script.async = true;
    //     script.charset="UTF-8";
    
    //     document.body.appendChild(script);
    //     var ga = document.createElement('script');
    //         ga.setAttribute('type', 'text/javascript');
    //         ga.appendChild(document.createTextNode(`window.dataLayer = window.dataLayer || [];
    //         function gtag(){dataLayer.push(arguments);}
    //         gtag('js', new Date());
          
    //         gtag('config', 'UA-121630810-3');`));
    //         document.getElementsByTagName('body').item(0).appendChild(ga);
    // }

    scrollToTop = (e) => {
        e.preventDefault();
        document.querySelector("body").scrollIntoView();
    }

    onCliclActive = (e) => {
        const elements = document.querySelectorAll('.menu-main-menu-container ul li');
        [].forEach.call(elements, function (el) {
            el.classList.remove("active");
        });
        e.currentTarget.classList.add('active');
        document.getElementById("scrollTop").scrollIntoView();
    }

    DemoSiteWarningActive = () => {
        this.setState({
            is_demo_active: true
        })
    }

    DemoSiteWarningInactive = () => {
        this.setState({
            is_demo_active: false
        })
    }

    render() {
        return (
            <React.Fragment>
                <footer className="site-footer">
                    <aside className="footer-widgets col-xs-12">
                        <div className="container">
                            <div className="row footer-top">
                                <div className="col-xs-12 col-sm-3 col-md-3 col-lg-3">
                                    <section className="widget widget_text">
                                        <h3 className="montserrat">{this.state.footer_menu.col1 ? this.state.footer_menu.col1.title : ''}</h3>
                                        <div className="textwidget">
                                            {this.state.footer_menu.col1 ? Parser(this.state.footer_menu.col1.content) : ''}
                                        </div>
                                    </section>
                                </div>
                                <div className="col-xs-12 col-sm-3 col-md-3 col-lg-3">
                                    <section className="widget widget_nav_menu">
                                        <h3 className="montserrat">{this.state.footer_menu.col2 ? this.state.footer_menu.col2.title : ''}</h3>
                                        <div className="menu-footer-menu-c2-container">
                                            <ul className="menu">
                                                {
                                                    this.state.footer_menu.col2 ?
                                                        this.state.footer_menu.col2.content.map(function (content_menu, key) {
                                                            if (content_menu.type === "external") {
                                                                return (<li className="menu-item menu-item-type-post_type menu-item-object-page" key={Math.random()}><a target={(content_menu.open_new_tab == 'yes') ? "_blank" : ""} href={content_menu.url}>{content_menu.label}</a></li>)
                                                            } else {
                                                                return (<li className="menu-item menu-item-type-post_type menu-item-object-page" key={Math.random()}><NavLink to={content_menu.url}>{content_menu.label}</NavLink></li>)
                                                            }
                                                        })
                                                        : null
                                                }
                                            </ul>
                                        </div>
                                    </section>
                                </div>
                                <div className="col-xs-12 col-sm-3 col-md-3 col-lg-3  ">
                                    <section className="widget widget_nav_menu">
                                        <h3 className="montserrat">{this.state.footer_menu.col3 ? this.state.footer_menu.col3.title : ''}</h3>
                                        <div className="menu-footer-menu-c3-container">
                                            <ul className="menu">
                                                {
                                                    this.state.footer_menu.col3 ?
                                                        this.state.footer_menu.col3.content.map(function (content_menu2, key) {
                                                            if (content_menu2.type === "external") {
                                                                return (<li key={Math.random()}><a target={(content_menu2.open_new_tab == 'yes') ? "_blank" : ""} href={content_menu2.url}>{content_menu2.label}</a></li>)
                                                            } else {
                                                                return (<li key={Math.random()}><NavLink to={content_menu2.url}>{content_menu2.label}</NavLink></li>)
                                                            }
                                                        })
                                                        : null
                                                }
                                            </ul>
                                        </div>
                                    </section>
                                </div>
                                <div className="col-xs-12 col-sm-3 col-md-3 col-lg-3">
                                    <section id="text-4" className="widget widget_text">
                                        <h3 className="">{this.state.footer_menu.col4 ? this.state.footer_menu.col4.title : ''}</h3>
                                        <div className="textwidget">
                                            {this.state.footer_menu.col4 ? Parser(this.state.footer_menu.col4.content) : ''}
                                        </div>
                                    </section>
                                </div>
                            </div>
                            <div className="row footer-top">
                                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                    <div className="footer-bottom">
                                        <div className="copyright">Copyright &copy; {moment().format('Y')} Prestige Labs,  All Rights Reserved.</div>
                                        <div id="payment-methods">
                                            <span className="payment-method">
                                                <a href="#" title="Visa">
                                                    <img src={require("../../Assets/images/icon-cc-visa.png")} alt="visa" />
                                                </a>
                                            </span>
                                            <span className="payment-method">
                                                <a href="#" title="American express">
                                                    <img src={require("../../Assets/images/icon-cc-american-express.png")} alt="american-express" />
                                                </a>
                                            </span>
                                            <span className="payment-method">
                                                <a href="#" title="Discover">
                                                    <img src={require("../../Assets/images/icon-cc-discover.png")} alt="discover" />
                                                </a>
                                            </span>
                                            <span className="payment-method">
                                                <a href="#" title="Mastercard">
                                                    <img src={require("../../Assets/images/icon-cc-mastercard.png")} alt="mastercard" />
                                                </a>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>
                </footer>
                <a href="#" onClick={this.scrollToTop} className="scrollup"><i className="fa fa-angle-up" aria-hidden="true"></i></a>
                {
                    IS_DEMO_SITE ?
                        <div className={classnames('siteNoteWrapper', { 'active': !this.state.is_demo_active })}>
                            <span className="siteNoteWrapperShow" onClick={this.DemoSiteWarningActive}><i className="fa fa-info" aria-hidden="true"></i></span>
                            <div className="montserrat siteNote" >
                                <span>{DEMO_SITE_WARNING_TEXT}</span>
                                <span className="siteNoteClose" onClick={this.DemoSiteWarningInactive}>Dismiss</span>
                            </div>
                            <div className="clearfix"></div>
                        </div>
                        : ''
                }
            </React.Fragment>
        );
    }
    
}

export default Footer;