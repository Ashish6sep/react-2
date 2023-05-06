import React, { Fragment, PureComponent } from "react";
import { NavLink, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import $ from "jquery";
import { connect } from "react-redux";
import { GET_STORAGE, USER, CUSTOMER_URL, AJAX_PUBLIC_REQUEST, DISTRIBUTOR_URL, AJAX_REQUEST } from "../../Constants/AppConstants";
import { logout } from '../../Store/actions/loginActions';
import CartList from "./CartList";
import Parser from "html-react-parser";
import history from "../../history";

class Header extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            user: JSON.parse(GET_STORAGE(USER)),
            page: "",
            menus: [],
            showusermenu: false
        };

        setInterval(
            function () {
                if (this.props.auth) {
                    if (this.props.auth.user) {
                        if (this.props.auth.user.remember) {
                            AJAX_REQUEST("POST", "user/updateAccessToken", {}).then(results => {
                                if (parseInt(results.response.code) === 1000) {
                                    // console.log(results.response.code);
                                }
                            });
                        }
                    }
                }
            }.bind(this),
            540000
        );
    }

    logout = (e) => {
        e.preventDefault();
        AJAX_REQUEST("POST", "user/logout", {}).then(results => {
            if (parseInt(results.response.code) === 1000) { } else {
                // console.log(results.response.message);
            }
        });
        this.props.logout();
    }

    onCliclActiveMob = e => {
        const elements = document.querySelectorAll(".mob_site_content ul li");
        [].forEach.call(elements, function (el) {
            el.classList.remove("active");
        });
        e.currentTarget.classList.add("active");
        document.getElementById("scrollTop").scrollIntoView();
    };

    onClickActive = e => {
        const elements = document.querySelectorAll(".menu-main-menu-container ul li");
        [].forEach.call(elements, function (el) {
            el.classList.remove("active");
        });
        e.currentTarget.classList.add("active");
        document.getElementById("scrollTop").scrollIntoView();
    };

    showMenu = () => {
        this.setState({
            showusermenu: this.state.showusermenu ? false : true
        });
    };

    showMobSideMenu = () => {
        $("body").toggleClass("current", 1000);
    };

    componentDidMount() {
        AJAX_PUBLIC_REQUEST("POST", "menu/getMenuInfo", { type: "primary" }).then(results => {
            if (parseInt(results.response.code) === 1000) {
                this.setState({
                    menus: results.response.data
                });
            }
        });
        AJAX_PUBLIC_REQUEST("POST", "page/getContactInfo", {}).then(results => {
            if (parseInt(results.response.code) === 1000) {
                this.setState({
                    page: results.response.data
                });
            }
        });
    }

    render() {
        const user = this.state.user;
        const is_meal_available = this.props.meals.length > 0 && this.props.meals[0] ? true : false;
        let cart_count = 0;
        if (this.props.cart[0]) {
            cart_count = Number(cart_count) + Number(this.props.cart[0].length);
        }
        if (is_meal_available) {
            if (this.props.meals && this.props.meals.items && this.props.meals[0].items.length > 0) {
                cart_count = Number(cart_count) + Number(this.props.meals[0].items.length);
            }
        }

        const email = this.state.page.hasOwnProperty('email') ? Parser(this.state.page.email) : '';
        const phone = this.state.page.hasOwnProperty('phone') ? Parser(this.state.page.phone) : '';

        let meal_menu_access = GET_STORAGE('meal_menu_access');
        if (!meal_menu_access) {
            meal_menu_access = 'false';
        }

        // let meal_menu_active = false;
        // if(this.props){
        //     if(this.props.auth){
        //         if(this.props.auth.user){
        //             if(this.props.auth.user.meal_menu_activated){
        //                 meal_menu_active = true;
        //             }
        //         }
        //     }
        // }

        let settings = null;
        if (GET_STORAGE("settings")) {
            settings = JSON.parse(GET_STORAGE("settings"));
        }

        let meal_menu_active = false;
        let enable_new_signup = false;
        if(settings && settings.enable_new_signup == "yes"){
            enable_new_signup = true;
        }
        if(settings && settings.meal_menu_public == "yes"){
            meal_menu_active = true;
        } else {
            if (this.props) {
                if (this.props.auth) {
                    if (this.props.auth.user) {
                        if (this.props.auth.user.meal_menu_activated) {
                            meal_menu_active = true;
                        }
                    }
                }
            }
        }

        return (
            <React.Fragment>
                <header className="montserrat site-header">
                    <div className="mob_menu_wrapper d-sm-block d-md-none">
                        <div className="site_menu_wrapper_inner">
                            <div className="mob_site_menu" onClick={this.showMobSideMenu}>
                                <ul className="mob_site_content">
                                    {this.state.menus.length <= 0
                                        ? null
                                        : this.state.menus.map(function (menu, key) {
                                            if (menu.type === "external") {
                                                return (
                                                    <li key={"ddm" + key}>
                                                        <a
                                                            className={`menu_item${
                                                                history.location.pathname === menu.url
                                                                    ? " active"
                                                                    : ""
                                                                }`}
                                                            href={menu.url}
                                                        >
                                                            <span>{menu.label}</span>
                                                        </a>
                                                    </li>
                                                );
                                            } else {
                                                if (menu.url == "/meals") {
                                                    if (meal_menu_active) {
                                                        return (
                                                            <li key={"ddm" + key}>
                                                                <NavLink
                                                                    activeClassName="active"
                                                                    className="menu_item"
                                                                    to={menu.url}
                                                                    exact
                                                                >
                                                                    <span>{menu.label}</span>
                                                                </NavLink>
                                                            </li>
                                                        );
                                                    } else {
                                                        return null
                                                    }
                                                } else {
                                                    return (
                                                        <li key={"ddm" + key}>
                                                            <NavLink
                                                                activeClassName="active"
                                                                className="menu_item"
                                                                to={menu.url}
                                                                exact
                                                            >
                                                                <span>{menu.label}</span>
                                                            </NavLink>
                                                        </li>
                                                    );
                                                }
                                            }
                                        })}
                                    
                                    {
                                        enable_new_signup && !this.props.auth.isAuthenticated ?
                                        <li key={Math.random()}>
                                            <a className="menu_item" href={DISTRIBUTOR_URL+'login'}><span>Bacome An Affiliate</span></a>
                                        </li>
                                        :''
                                    }

                                    {
                                        this.props.auth.isAuthenticated ?
                                            <Fragment>
                                                {
                                                    this.props.auth.user.activate_meal ?
                                                        <li key={Math.random()}>
                                                            <NavLink
                                                                className="menu_item"
                                                                to="/activate-meal"
                                                                exact
                                                            >
                                                                <span>Activate Meal</span>
                                                            </NavLink>
                                                        </li>
                                                        : ''
                                                }
                                                <li key={Math.random()}>
                                                    <NavLink
                                                        activeClassName="active"
                                                        className="menu_item"
                                                        to="/my-account"
                                                        exact
                                                    >
                                                        <span>{enable_new_signup?'My Orders':'My Account'}</span>
                                                    </NavLink>
                                                </li>
                                                <li key={Math.random()}>
                                                    <a
                                                        onClick={this.logout}
                                                        className="menu_item"
                                                        href="#"
                                                    >
                                                        <span>Logout</span>
                                                    </a>
                                                </li>
                                            </Fragment>
                                            :
                                            <Fragment>
                                                <li key={Math.random()}>
                                                    <NavLink
                                                        activeClassName="active"
                                                        className="menu_item"
                                                        to="/login"
                                                        exact
                                                    >
                                                        <span>Login</span>
                                                    </NavLink>
                                                </li>
                                            </Fragment>
                                    }
                                </ul>
                            </div>
                            <div className="mob_main_user" onClick={this.showMenu} />
                            <NavLink to="/cart" activeClassName="active">
                                <div className="mob_main_cart" />
                            </NavLink>
                        </div>

                        <div className="clearfix" />
                        {this.state.showusermenu ? (
                            <div className="mob_main_user_wrapper">
                                <ul>
                                    <li>
                                        <NavLink activeClassName="active" to="/cart">
                                            Cart
                                        </NavLink>
                                    </li>
                                    {
                                        enable_new_signup && !this.props.auth.isAuthenticated ?
                                        <li key={Math.random()}>
                                            <a className="menu_item" href={DISTRIBUTOR_URL+'login'}><span>Bacome An Affiliate</span></a>
                                        </li>
                                        :''
                                    }
                                    {
                                        this.props.auth.isAuthenticated ?
                                            <Fragment>
                                                <li>
                                                    <NavLink activeClassName="active" to="/my-account">
                                                    {enable_new_signup?'My Orders':'My Account'}
                                                    </NavLink>
                                                </li>
                                                <li>
                                                    <a onClick={this.logout} href="#">
                                                        Logout
                                            </a>
                                                </li>
                                            </Fragment>
                                            :
                                            <Fragment>
                                                <li>
                                                    <NavLink activeClassName="active" to="/login">
                                                        Login
                                            </NavLink>
                                                </li>
                                            </Fragment>
                                    }
                                </ul>
                            </div>
                        ) : (
                                <p className="mob_text_order topemailphonecolor">
                                    Reach us at <a href={`mailto:${email}`}>{email}</a> or <a href={`tel:${phone}`}>{phone}</a>
                                </p>
                            )}
                        <div className="mob_header_logo">
                            <NavLink to="/" exact>
                                <img src={require("../../Assets/images/prestigelabs-logo.png")} alt="Prestige Labs" />
                            </NavLink>
                        </div>
                        <div className="clearfix" />
                    </div>

                    <div className="hide_small_screen">
                        <div className="container">
                            <div className="row">
                                <div className="col-md-12">

                                    <div className="logo-wrapper">
                                        <div className="row">
                                            <div className="col-md-4">
                                                <div className="site-logo">
                                                    <NavLink to="/" exact>
                                                        <img
                                                            src={require("../../Assets/images/prestigelabs-logo.png")}
                                                            alt="Prestige Labs"
                                                        />
                                                    </NavLink>
                                                </div>
                                            </div>
                                            <div className="col-md-8">
                                                <div className="header-top">
                                                    <div className="top-widgets-right">
                                                        <div className="textwidget roboto topemailphonecolor">
                                                            Reach us at <a href={`mailto:${email}`}>{email}</a> or <a href={`tel:${phone}`}>{phone}</a>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="top-header">
                                                    <div className="wrapper-top-cart text-right">
                                                        <div className="top-cart">
                                                            <span className="icon">&nbsp;</span>
                                                            <a href="javascript:void(0)" id="cartToggle">
                                                                <span className="first">Shopping Cart</span>
                                                                <span id="cartCount">
                                                                    <span className="cart-contents">
                                                                        <span className="count">{cart_count}</span>
                                                                    </span>
                                                                </span>
                                                            </a>
                                                            <div className="widget_shopping_cart_content">
                                                                <CartList />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <section id="scrollTop">
                            <div className="site_menu">
                                <div className="header-logo-fix">
                                    <NavLink to="/" exact>
                                        <img src={require("../../Assets/images/logo_fix.png")} alt="Prestige Labs" />
                                    </NavLink>
                                </div>
                                <div className="container">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <nav className="primary-nav">
                                                <div className="menu-main-menu-container">
                                                    <ul id="menu-main-menu" className="menu">
                                                        {this.state.menus.length <= 0
                                                            ? null
                                                            : this.state.menus.map(function (menu, key) {
                                                                if (menu.type === "external") {
                                                                    return (
                                                                        <li key={"dm" + key}>
                                                                            <a
                                                                                className={`menu_item${
                                                                                    history.location.pathname ===
                                                                                        menu.url
                                                                                        ? " active"
                                                                                        : ""
                                                                                    }`}
                                                                                href={menu.url}
                                                                            >
                                                                                {menu.label}
                                                                            </a>
                                                                        </li>
                                                                    );
                                                                } else {
                                                                    if (menu.url == "/meals") {
                                                                        if (meal_menu_active) {
                                                                            return (
                                                                                <li key={"dm" + key}>
                                                                                    <NavLink
                                                                                        activeClassName="active"
                                                                                        className="menu_item"
                                                                                        to={menu.url}
                                                                                        exact
                                                                                    >
                                                                                        {menu.label}
                                                                                    </NavLink>
                                                                                </li>
                                                                            );
                                                                        } else {
                                                                            return null;
                                                                        }
                                                                    } else {
                                                                        return (
                                                                            <li key={"dm" + key}>
                                                                                <NavLink
                                                                                    activeClassName="active"
                                                                                    className="menu_item"
                                                                                    to={menu.url}
                                                                                    exact
                                                                                >
                                                                                    {menu.label}
                                                                                </NavLink>
                                                                            </li>
                                                                        );
                                                                    }
                                                                }
                                                            })}

                                                        {
                                                            this.props.auth.isAuthenticated ?
                                                                <Fragment>
                                                                    <li className="pull-right" key={Math.random()}>
                                                                        <a onClick={this.logout} style={{ marginRight: '0' }} className="menu_item" href="#"> Logout</a>
                                                                    </li>
                                                                    <li className="pull-right" key={Math.random()}>
                                                                        <NavLink activeClassName="active" className="menu_item" to="/my-account" exact > {enable_new_signup?'My Orders':'My Account'}</NavLink>
                                                                    </li>
                                                                    {
                                                                        this.props.auth.user.activate_meal ?
                                                                            <li className="pull-right" key={Math.random()}>
                                                                                <NavLink className="menu_item" to="/activate-meal" exact > Activate Meal</NavLink>
                                                                            </li>
                                                                            : ''
                                                                    }
                                                                </Fragment>
                                                                :
                                                                <Fragment>
                                                                    <li className="pull-right" key={Math.random()}>
                                                                        <NavLink activeClassName="active" style={{ marginRight: '0' }} className="menu_item" to="/login" exact > Login</NavLink>
                                                                    </li>
                                                                </Fragment>
                                                        }

                                                        {
                                                            enable_new_signup && !this.props.auth.isAuthenticated ?
                                                            <li className="pull-right" key={Math.random()}>
                                                                <a className="menu_item" href={DISTRIBUTOR_URL+'login'}><span>Bacome An Affiliate</span></a>
                                                            </li>
                                                            :''
                                                        }
                                                    </ul>
                                                </div>
                                            </nav>
                                        </div>
                                    </div>
                                </div>
                                <div className="header-logo-cart">
                                    <span className="icon">&nbsp;</span>
                                    <div className="widget_shopping_cart_content">
                                        <CartList />
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </header>
            </React.Fragment>
        );
    }
}

Header.propTypes = {
    logout: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        auth: state.auth,
        cart: state.cart,
        meals: state.meals
    };
}

export default withRouter(
    connect(
        mapStateToProps,
        { logout }
    )(Header)
);
