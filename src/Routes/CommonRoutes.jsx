import React, { Component, Fragment } from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import { SET_COOKIE, ENABLE_MEAL } from "../Constants/AppConstants";
import requireCustAuth from "../Utils/requireCustAuth";
import Login from "../Components/Auth/Login";
import ServiceLogin from "../Components/Auth/ServiceLogin";
import PasswordReset from "../Components/Auth/PasswordReset";
import NewPasswordReset from "../Components/Auth/NewPasswordReset";

// PublicSite Start
import Home from "../Components/PublicSite/Home";
import Products from "../Components/PublicSite/Products";
import TopSellers from "../Components/PublicSite/TopSellers";
import BundleProduct from "../Components/PublicSite/BundleProduct";
import ProductDetails from "../Components/PublicSite/ProductDetails";
import CartPage from "../Components/PublicSite/CartPage";
import CheckOut from "../Components/PublicSite/CheckOut";
import OrderReceived from "../Components/PublicSite/OrderReceived";
import Athletes from "../Components/Pages/Athletes";
import GetInTouch from "../Components/Pages/GetInTouch";
import MyAccount from "../Components/PublicSite/Account/MyAccount";
import Page from "../Components/Pages/Page";
import CancellationProcess from "../Components/Pages/CancellationProcess";
import PageNotFound from "../Components/Pages/PageNotFound";
import Meals from "../Components/PublicSite/Meals";
import Plans from "../Components/PublicSite/Plans";
import AffiliateSignupRequest from "../Components/Auth/AffiliateSignupRequest";
import AffiliateSignupRequestForm from "../Components/Auth/AffiliateSignupRequestForm";
import Reorder from "../Components/PublicSite/Reorder";
import Downtime from "../Components/Pages/Downtime";
import ActivateMeal from "../Components/Pages/ActivateMeal";

class CommonRoutes extends Component {
    constructor(props) {
        super(props);

        const url = new URL(window.location.href);
        const af = url.searchParams.get("af");
        if (af) {
            SET_COOKIE("af", af);
        }
        const site = url.searchParams.get("site");
        if (site) {
            SET_COOKIE("site", site);
        }
    }

    render() {
        return (
            <Switch>
                <Route path="/login" component={Login} exact strict />
                <Route path="/serviceLogin" component={ServiceLogin} exact strict />
                <Route path="/password-reset" component={PasswordReset} exact strict />
                <Route path="/password-reset/:code" component={NewPasswordReset} exact strict />
                <Route path="/" component={Home} exact strict />
                <Route path="/products" component={Products} exact strict />
                <Route path="/top-sellers" component={TopSellers} exact strict />
                <Route path="/bundle-product" component={BundleProduct} exact strict />
                <Route path="/product/:slug" component={ProductDetails} exact strict />
                <Route path="/meals" component={Plans} exact strict />
                <Route path="/meals/:id" component={Meals} exact strict />
                <Route path="/cart" component={CartPage} exact strict />
                <Route path="/checkout" component={requireCustAuth(CheckOut)} exact strict />
                <Route path="/order-received/:order_id" component={requireCustAuth(OrderReceived)} exact strict />
                <Route path="/athletes" component={Athletes} exact strict />
                <Route path="/contact" component={GetInTouch} exact strict />
                <Route path="/reorder/:order_id" component={Reorder} exact strict />
                <Route path='/cancellation-process' component={CancellationProcess} exact strict />
                <Route path="/page/:slug" component={Page} exact strict />
                <Route path="/my-account" component={MyAccount} exact strict />
                <Route path="/my-account/" component={MyAccount} exact strict />
                <Route path="/affiliate-signup-request" component={AffiliateSignupRequest} exact strict />
                <Route path="/affiliate-signup-request-form" component={AffiliateSignupRequestForm} exact strict />
                <Route path="/error" component={Downtime} exact strict />
                <Route path="/activate-meal" component={ActivateMeal} exact strict />
                <Route component={PageNotFound} exact strict />
            </Switch>
        );
    }
}

export default withRouter(CommonRoutes);