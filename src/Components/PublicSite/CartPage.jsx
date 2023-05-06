import React, { Fragment, PureComponent } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import history from "../../history";
import AlertWrapper from "../Common/AlertWrapper";
import AlertWrapperSuccess from "../Common/AlertWrapperSuccess";
import classnames from "classnames";
import { AJAX_PUBLIC_REQUEST, CURRENCY_FORMAT, CART_TOTAL_CURRENCY_FORMAT, ITEM_COUNT, MEAL_COUNT, COUNT_SUBSCRIPTION, SET_STORAGE, GET_STORAGE, REMOVE_STORAGE, CHECK_STORAGE, NEXT_MONTH, NEXT_WEEK, MEAL_SUB_TOTAL, MEAL_TOTAL, CART_SUB_TOTAL, RECURRING_CART_SUB_TOTAL, COUPON_TOTAL } from "../../Constants/AppConstants";
import { NavLink } from "react-router-dom";
import $ from "jquery";
import CartProductList from "./CartProductList";
import CartPlan from './CartPlan';
import ShippingSchedule from "./ShippingSchedule";

class CartPage extends PureComponent {
    constructor(props) {
        // Check Tax Applicable
        let settings = "";
        if (GET_STORAGE("settings")) {
            settings = JSON.parse(GET_STORAGE("settings"));
        }

        super(props);
        this.state = {
            loading: true,
            taxStatus: settings ? settings.tax_status : 0,
            taxAmount: 0,
            products: [],
            meals: [],
            shippingMethods: [],
            couponList: [],
            coupon_code: "",
            freeShipping: 0,
            cartShippingCost: 0,
            recurringCartShippingCost: 0,
            mealShippingCostStatus: true,

            errors: {},
            isValid: false,
            isLoading: false,
            isFormValid: true,
            server_message: "",
            success_alert_wrapper_show: false,
            coupon_loading: false,
            success_alert_wrapper_show_coupon: false,
        };
        document.title = "Cart-Prestige Labs";
    }

    componentDidMount() {
        document.querySelector("body").scrollIntoView();
        this.reApplyCoupon();
        this.getCart();
        if (GET_STORAGE('cart')) {
            this.getAllShippingMethods();
        } else {
            this.setState({ loading: false });
        }

        // Redirect to checkout
        var url = new URL(window.location.href);
        var redirect = url.searchParams.get("redirect");
        if (redirect == 'checkout') {
            history.push('/checkout');
        }
    }

    timeOut = (timedata) => {
        setTimeout(function () {
            this.setState({
                success_alert_wrapper_show: false,
                success_alert_wrapper_show_coupon: false,
                isFormValid: true,
                server_message: ''
            });
        }.bind(this), timedata);
    };

    changeHandler = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    getCart = () => {
        if ((ITEM_COUNT() === 0) && (MEAL_COUNT() === 0)) {
            history.push("/");
        }
        CHECK_STORAGE();

        if (GET_STORAGE("cart")) {
            this.setState({ products: JSON.parse(GET_STORAGE("cart")) });
        } else {
            this.setState({ products: [] });
        }
        if (GET_STORAGE("meals")) {
            this.setState({ meals: JSON.parse(GET_STORAGE("meals")) });
        } else {
            this.setState({ meals: [] });
        }
        if (GET_STORAGE("coupon")) {
            this.setState({ couponList: JSON.parse(GET_STORAGE("coupon")) });
        } else {
            this.setState({ couponList: [] });
        }
        this.props.addToCart();
        this.props.addMealToCart();
    };

    deleteItem = (e, row_id) => {
        e.preventDefault();
        if (window.confirm("Are you sure want to delete item?")) {
            let cart = JSON.parse(GET_STORAGE("cart"));
            if (cart.splice(row_id, 1)) {
                this.setState({
                    success_alert_wrapper_show: true,
                    server_message: "Item removed from cart successfully"
                });
                SET_STORAGE("cart", JSON.stringify(cart));
                this.props.addToCart();
                this.reApplyCoupon();
                this.getCart();
                this.timeOut(5000);
            }
        }
    };

    updateCart = e => {
        e.preventDefault();

        // Item start
        let updateQuantity = [];
        $('input[name^="quantity"]').each(function (key) {
            updateQuantity[key] = $(this).val();
        });

        let cart = [];
        let data = [];
        cart = JSON.parse(GET_STORAGE("cart"));

        if (cart) {
            cart.forEach(function (item, key) {
                item.quantity = updateQuantity[key];
                data.push(item);
            });
        }
        SET_STORAGE("cart", JSON.stringify(data));
        // Item end

        this.setState({
            products: JSON.parse(GET_STORAGE('cart')),
            meals: JSON.parse(GET_STORAGE('meals')),
            server_message: "Cart Update Successfully",
            success_alert_wrapper_show_coupon: false,
            success_alert_wrapper_show: true
        });

        document.querySelector("body").scrollIntoView();
        this.timeOut(5000);
        this.props.addToCart();
        this.props.addMealToCart();
        this.reApplyCoupon();
        this.getCart();
    };

    getAllShippingMethods = () => {
        AJAX_PUBLIC_REQUEST("POST", "order/getShippingMethodList", {}).then(results => {
            if (parseInt(results.response.code) === 1000) {
                let method = results.response.data;
                this.setState({
                    loading: false,
                    shippingMethods: method,
                    cartMethodId: method[0].id,
                    cartShippingCost: method[0].cost,
                    recurringCartMethodId: method[0].id,
                    recurringCartShippingCost: method[0].cost
                });
                SET_STORAGE("cartMethodId", method[0].id);
                SET_STORAGE("recurringCartMethodId", method[0].id);
            } else {
                this.setState({
                    loading: false,
                    error: results.response.message
                });
            }
        });
    };

    changeCartShippingMethod = e => {
        this.setState({
            cartMethodId: e.target.getAttribute("cid"),
            cartShippingCost: e.target.getAttribute("price")
        });
        SET_STORAGE("cartMethodId", e.target.getAttribute("cid"));
    };
    changeRecurringCartShippingMethod = e => {
        this.setState({
            recurringCartMethodId: e.target.getAttribute("rid"),
            recurringCartShippingCost: e.target.getAttribute("price")
        });
        SET_STORAGE("recurringCartMethodId", e.target.getAttribute("rid"));
    };

    applyCoupon = e => {
        e.preventDefault();
        let couponCode = this.state.coupon_code.trim();

        this.setState({
            isFormValid: true,
            coupon_loading: true,
            success_alert_wrapper_show_coupon: false
        });

        if (couponCode == "" || couponCode == null) {
            this.setState({
                server_message: "The coupon code field is required.",
                isLoading: false,
                coupon_loading: false,
                isFormValid: false
            });
        } else {
            let couponExists = false;
            let exCouponList = [];
            if (!GET_STORAGE("coupon")) {
                SET_STORAGE("coupon", JSON.stringify(exCouponList));
            }
            exCouponList = JSON.parse(GET_STORAGE("coupon"));

            if (exCouponList.length > 0) {
                exCouponList.forEach(function (exCoupon, key) {
                    if (exCoupon.coupon_code.toUpperCase() === couponCode.toUpperCase()) {
                        couponExists = true;
                    }
                });
            }

            if (!couponExists) {
                let applyCouponCode = [];
                if (exCouponList.length > 0) {
                    exCouponList.forEach(function (couponData, key) {
                        applyCouponCode.push(couponData.coupon_code);
                    });
                }
                applyCouponCode.push(couponCode);

                let data = {
                    coupon_code: applyCouponCode,
                    cart_items: JSON.parse(GET_STORAGE("cart")),
                    meals: JSON.parse(GET_STORAGE("meals")),
                };

                AJAX_PUBLIC_REQUEST("POST", "coupon/applyCoupon", data).then(results => {
                    if (parseInt(results.response.code) === 1000) {
                        this.setState({
                            success_alert_wrapper_show_coupon: true,
                            coupon_loading: false,
                            coupon_code: "",
                            server_message: results.response.message
                        });

                        let couponResponse = results.response.data;
                        if (couponResponse || couponResponse != "") {
                            exCouponList = [];
                            couponResponse.forEach(function (couponData, key) {
                                exCouponList.push(couponData);
                            });
                        }

                        SET_STORAGE("coupon", JSON.stringify(exCouponList));
                        this.getCart();
                    } else {
                        this.setState({
                            server_message: results.response.message,
                            isLoading: false,
                            coupon_loading: false,
                            isFormValid: false,
                            error: results.response.message
                        });
                    }
                    this.timeOut(5000);
                });
            } else {
                this.setState({
                    server_message: "The coupon code already applied.",
                    isLoading: false,
                    coupon_loading: false,
                    isFormValid: false
                });
            }
        }
    };

    reApplyCoupon = () => {
        if (GET_STORAGE("coupon")) {
            let exCouponList = JSON.parse(GET_STORAGE("coupon"));
            let coupon_code = [];
            exCouponList.forEach(function (couponData, key) {
                coupon_code.push(couponData.coupon_code);
            });
            let data = {
                coupon_code: coupon_code,
                cart_items: JSON.parse(GET_STORAGE("cart")),
                meals: JSON.parse(GET_STORAGE("meals")),
            };
            AJAX_PUBLIC_REQUEST("POST", "coupon/applyCoupon", data).then(results => {
                if (parseInt(results.response.code) === 1000) {
                    SET_STORAGE("coupon", JSON.stringify(results.response.data));
                } else if (parseInt(results.response.code) === 4000) {
                    REMOVE_STORAGE('coupon')
                }
                this.getCart();
            });
        }
    };

    deleteCoupon = (e, row_id) => {
        e.preventDefault();
        if (window.confirm("Are you sure want to delete coupon?")) {
            let coupon = JSON.parse(GET_STORAGE("coupon"));
            if (coupon.splice(row_id, 1)) {
                SET_STORAGE("coupon", JSON.stringify(coupon));
                this.setState({
                    freeShipping: 0,
                    mealShippingCostStatus: true,
                    server_message: "The coupon code successfully removed.",
                    success_alert_wrapper_show_coupon: true,
                    coupon_code: "",
                    success_alert_wrapper_show: false
                });
                document.querySelector("body").scrollIntoView();
                this.timeOut(5000);
                this.reApplyCoupon();
                this.getCart();
                this.getAllShippingMethods();
            }
        }
    };

    deleteMeal = (e) => {
        e.preventDefault();
        if (window.confirm("Are you sure want to delete meal?")) {
            SET_STORAGE("meals", JSON.stringify([]));
            REMOVE_STORAGE('meal_subscription');
            this.setState({
                meals: [],
                server_message: 'Meal Delete Successfully',
                success_alert_wrapper_show_coupon: false,
                success_alert_wrapper_show: true
            });
            this.props.addMealToCart();
            this.reApplyCoupon();
            this.getCart();
        }
    }

    // Meal end

    render() {
        const {
            errors,
            server_message,
            success_alert_wrapper_show,
            success_alert_wrapper_show_coupon,
            coupon_loading
        } = this.state;
        const errors_data = server_message;

        let duration_id = 1;
        let duration_text = "Every 1 week";
        if (this.state.meals && this.state.meals.duration_id) {
            duration_id = parseInt(this.state.meals.duration_id);
        }
        if (this.state.meals && this.state.meals.duration_text) {
            duration_text = this.state.meals.duration_text;
        }

        return (
            <Fragment>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            {
                                (this.state.loading) ?
                                    <div className="loading container full_page_loader" /> :
                                    <Fragment>
                                        <main>
                                            <form onSubmit={this.updateCart} id="cartForm">
                                                <div className="page-title">Cart</div>
                                                <div className="cart_wrapper">
                                                    <div className="steps-wrapper">
                                                        <span className="cart cart_active">
                                                            <i className="fa fa-cart-arrow-down" aria-hidden="true" />
                                                            Shopping bag
                                                        </span>
                                                        <span className="checkout">
                                                            <i className="fa fa-align-justify" aria-hidden="true" />Checkout
                                                            details
                                                        </span>
                                                        <span className="order">
                                                            <i className="fa fa-check" aria-hidden="true" />Order complete
                                                        </span>
                                                    </div>

                                                    <AlertWrapperSuccess
                                                        errors_data={errors_data}
                                                        success_alert_wrapper_show={success_alert_wrapper_show}
                                                    />

                                                    <div className="table-responsive">
                                                        <table className="table cart_table my_account_orders distributor_cart_table shop_table_responsive">
                                                            <colgroup>
                                                                <col width="5%" />
                                                                <col width="40%" />
                                                                <col width="20%" />
                                                                <col width="20%" />
                                                                <col width="30%" />
                                                            </colgroup>
                                                            <thead>
                                                                <tr>
                                                                    <th>&nbsp;</th>
                                                                    <th className="text-center">Product</th>
                                                                    <th>Price</th>
                                                                    <th>Quantity</th>
                                                                    <th>Total</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {/* Start cart list*/}
                                                                {
                                                                    (this.state.products.length <= 0) ? null :
                                                                        this.state.products.map(function (product, key) {
                                                                            // Added item delete and reApplyCoupon methos
                                                                            product.deleteItem = this.deleteItem;
                                                                            product.row_id = key;
                                                                            return (
                                                                                <CartProductList key={product.cart_variation_id} product={product} />
                                                                            );
                                                                        }.bind(this))
                                                                }
                                                                {/* End cart list */}

                                                                {/* Meal start */}
                                                                {
                                                                    (this.state.meals != null && this.state.meals != '' && this.state.meals.items.length > 0) ?
                                                                        <Fragment>
                                                                            <tr>
                                                                                <td data-title="Remove" className="cart_product_remove" rowSpan={parseInt(this.state.meals.items.length) + 1}>
                                                                                    <a onClick={(e) => this.deleteMeal(e)} href="javascript:void(0)" className="remove"><i className="fa fa-times" aria-hidden="true"></i></a>
                                                                                </td>
                                                                            </tr>
                                                                            {
                                                                                this.state.meals.items.map(function (item, index) {
                                                                                    return (
                                                                                        <Fragment key={item.meal_id}>
                                                                                            < CartPlan item={item} />
                                                                                        </Fragment>
                                                                                    )
                                                                                }.bind(this))
                                                                            }
                                                                        </Fragment>
                                                                        : ""
                                                                }
                                                                {/* Meal end */}

                                                                {/* Start coupon */}
                                                                <tr className="">
                                                                    <td colSpan="6" className="actions border-left-none cart_page_product_action" >
                                                                        <AlertWrapperSuccess errors_data={errors_data} success_alert_wrapper_show={success_alert_wrapper_show_coupon} />
                                                                        <AlertWrapper errors_data={errors_data} isFormValid={this.state.isFormValid} />
                                                                        <div className="pull-left coupon cart_page_product_coupon">
                                                                            <Fragment>
                                                                                <input onChange={this.changeHandler} onBlur={this.changeHandler} value={this.state.coupon_code} type="text" className="input-text" name="coupon_code" placeholder="Coupon code" autoComplete="off" />
                                                                                <input onClick={this.applyCoupon} type="submit" className="button cus_button" value={coupon_loading ? "Please Wait..." : "Apply coupon"} />
                                                                            </Fragment>
                                                                        </div>
                                                                        <div className="pull-right countinue_shop">
                                                                            <input type="submit" className="button link-to-shop update_cart" name="update" value="Update cart" />
                                                                            <NavLink className="button link-to-shop" to={(ITEM_COUNT() > 0) ? '/' : '/meals'}> Back to Shop </NavLink>
                                                                        </div>
                                                                        <div className="clearfix" />
                                                                    </td>
                                                                </tr>
                                                                {/* End coupon */}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    <div className="clearfix" />

                                                    <div className="cart-shedule-table">
                                                        {
                                                            (this.state.meals != null && this.state.meals != '' && this.state.meals.items.length > 0) ?
                                                                <ShippingSchedule />
                                                                : ""
                                                        }
                                                    </div>
                                                    <Fragment>
                                                        {
                                                            (this.state.meals != null && this.state.meals != '' && this.state.meals.items.length > 0) ?
                                                            <p class="text-center"><strong>*Due to COVID19 we are unable to ship meals to Hawaii or Alaska.</strong> </p>
                                                            :""
                                                        }
                                                    </Fragment>
                                                    <div className="cart-collaterals">
                                                        <h2 className="inner_title">Cart Totals</h2>
                                                        <div className="cart_totals">
                                                            <table cellSpacing="0" className="shop_table shop_table_responsive" >
                                                                <tbody>
                                                                    <tr className="cart-subtotal">
                                                                        <td className="no_display_mobile">Subtotal</td>
                                                                        <td data-title="Subtotal">
                                                                            <span className="woocommerce-Price-amount amount">
                                                                                <span className="woocommerce-Price-currencySymbol">
                                                                                    <strong> {CURRENCY_FORMAT(CART_SUB_TOTAL() + MEAL_SUB_TOTAL())} </strong>
                                                                                </span>
                                                                            </span>
                                                                        </td>
                                                                    </tr>
                                                                    {// Start coupon list
                                                                        (this.state.couponList.length <= 0) ? "" :
                                                                            this.state.couponList.map(function (coupon, key) {

                                                                                if (coupon.free_shipping == 1 && coupon.coupon_type == "product") {
                                                                                    this.setState({
                                                                                        freeShipping: 1,
                                                                                        cartShippingCost: 0
                                                                                    });
                                                                                } else if (coupon.free_shipping == 1 && coupon.coupon_type == "meal") {
                                                                                    this.setState({
                                                                                        mealShippingCostStatus: false
                                                                                    });
                                                                                } else if (coupon.free_shipping == 1 && coupon.coupon_type == "any") {
                                                                                    this.setState({
                                                                                        freeShipping: 1,
                                                                                        cartShippingCost: 0,
                                                                                        mealShippingCostStatus: false
                                                                                    });
                                                                                }

                                                                                return (
                                                                                    <Fragment key={key}>
                                                                                        <tr className="cart-subtotal">
                                                                                            <td> COUPON: {coupon.coupon_code} </td>
                                                                                            <td data-title="COUPON">
                                                                                                <span className="woocommerce-Price-amount amount">
                                                                                                    <span className="woocommerce-Price-currencySymbol">
                                                                                                        {CURRENCY_FORMAT(coupon.discount_amount)}
                                                                                                        [ <a onClick={e => this.deleteCoupon(e, key)} href="#" > Remove </a> ]
                                                                                                        </span>
                                                                                                </span>
                                                                                            </td>
                                                                                        </tr>
                                                                                    </Fragment>
                                                                                );
                                                                            }.bind(this))
                                                                        // End coupon list
                                                                    }

                                                                    {
                                                                        (this.state.products.length <= 0) ? '' :
                                                                            <Fragment>
                                                                                <tr className="woocommerce-shipping-totals shipping">
                                                                                    <td className="no_display_mobile">Shipping Cost</td>
                                                                                    <td data-title="Shipping Cost">
                                                                                        <div id="shipping_method" className="shipping-methods" >
                                                                                            {// Start cart shipping
                                                                                                (this.state.freeShipping == 0) ?
                                                                                                    <Fragment>
                                                                                                        {
                                                                                                            (this.state.shippingMethods.length <= 0) ? null :
                                                                                                                this.state.shippingMethods.map(function (shipping, key) {
                                                                                                                    if (shipping.allow_for_coupon == 0) {
                                                                                                                        return (
                                                                                                                            <Fragment key={key} >
                                                                                                                                <label> {shipping.label}
                                                                                                                                    :
                                                                                                                                    <span className="woocommerce-Price-amount amount">
                                                                                                                                        <span className="woocommerce-Price-currencySymbol"> {CURRENCY_FORMAT(shipping.cost)} </span>
                                                                                                                                    </span>
                                                                                                                                    {
                                                                                                                                        (this.state.cartMethodId == shipping.id) ?
                                                                                                                                            <input onChange={this.changeHandler} onClick={this.changeCartShippingMethod} price={shipping.cost} cid={shipping.id} defaultChecked="checked" type="radio" name="orderShippingMethod" />
                                                                                                                                            :
                                                                                                                                            <input onChange={this.changeHandler} onClick={this.changeCartShippingMethod} price={shipping.cost} cid={shipping.id} type="radio" name="orderShippingMethod" />
                                                                                                                                    }
                                                                                                                                </label>
                                                                                                                                <br />
                                                                                                                            </Fragment>
                                                                                                                        );
                                                                                                                    }
                                                                                                                }.bind(this))
                                                                                                        }
                                                                                                    </Fragment>
                                                                                                    :
                                                                                                    <Fragment>
                                                                                                        {
                                                                                                            (this.state.shippingMethods.length <= 0) ? null :
                                                                                                                this.state.shippingMethods.map(function (shipping, key) {
                                                                                                                    if (shipping.allow_for_coupon == 1) {
                                                                                                                        SET_STORAGE("cartMethodId", shipping.id);
                                                                                                                        return (
                                                                                                                            <Fragment key={key} >
                                                                                                                                <label>
                                                                                                                                    {shipping.label}
                                                                                                                                    :
                                                                                                                                        <span className="woocommerce-Price-amount amount">
                                                                                                                                        <span className="woocommerce-Price-currencySymbol"> {CURRENCY_FORMAT(shipping.cost)} </span>
                                                                                                                                    </span>
                                                                                                                                    <input onChange={this.changeHandler} onClick={this.changeCartShippingMethod} price={shipping.cost} defaultChecked="checked" type="radio" name="orderShippingMethod" />
                                                                                                                                </label>
                                                                                                                                <br />
                                                                                                                            </Fragment>
                                                                                                                        );
                                                                                                                    }
                                                                                                                }.bind(this))
                                                                                                        }
                                                                                                    </Fragment>
                                                                                                // End cart shipping
                                                                                            }
                                                                                        </div>
                                                                                    </td>
                                                                                </tr>
                                                                            </Fragment>
                                                                    }
                                                                    {/* Start meal shipping cost for total */}
                                                                    {
                                                                        (this.state.meals != null && this.state.meals != '' && this.state.meals.items.length > 0) ?
                                                                            <Fragment>
                                                                                <tr className="woocommerce-shipping-totals shipping">
                                                                                    <td className="no_display_mobile">Meal Shipping Cost</td>
                                                                                    <td data-title="Shipping Cost">
                                                                                        <div id="shipping_method" className="shipping-methods">
                                                                                            <Fragment>
                                                                                                <label>
                                                                                                    {
                                                                                                        (this.state.meals.shipping_cost > 0 && this.state.mealShippingCostStatus) ?
                                                                                                            CURRENCY_FORMAT(this.state.meals.shipping_cost)
                                                                                                            : "Free Shipping"
                                                                                                    }
                                                                                                </label>
                                                                                            </Fragment>
                                                                                        </div>
                                                                                    </td>
                                                                                </tr>
                                                                            </Fragment>
                                                                            : ''
                                                                    }
                                                                    {/* End meal shipping cost for total */}

                                                                    {
                                                                        (this.state.taxStatus == 0) ? "" :
                                                                            <Fragment>
                                                                                <tr className="woocommerce-shipping-totals shipping">
                                                                                    <td className="no_display_mobile">Tax</td>
                                                                                    <td data-title="Tax">
                                                                                        <span className="woocommerce-Price-amount amount">
                                                                                            <span className="woocommerce-Price-currencySymbol"> {CURRENCY_FORMAT(this.state.taxAmount)} </span>
                                                                                        </span>
                                                                                    </td>
                                                                                </tr>
                                                                            </Fragment>
                                                                    }
                                                                    <tr className="sub-order-total">
                                                                        <td className="no_display_mobile">Total</td>
                                                                        <td data-title="Total" className="sub-order-total-usd" >
                                                                            <strong>
                                                                                <span className="woocommerce-Price-amount amount">
                                                                                    <span className="woocommerce-Price-currencySymbol">
                                                                                        {
                                                                                            (this.state.products.length > 0) ?
                                                                                                (this.state.meals != null && this.state.meals != '' && this.state.meals.items.length > 0 && this.state.mealShippingCostStatus) ?
                                                                                                    CURRENCY_FORMAT(CART_TOTAL_CURRENCY_FORMAT(Number(CART_SUB_TOTAL()) + Number(MEAL_TOTAL()) + Number(this.state.cartShippingCost) - Number(COUPON_TOTAL())))
                                                                                                    :
                                                                                                    CURRENCY_FORMAT(CART_TOTAL_CURRENCY_FORMAT(Number(CART_SUB_TOTAL()) + Number(MEAL_SUB_TOTAL()) + Number(this.state.cartShippingCost) - Number(COUPON_TOTAL())))
                                                                                                :
                                                                                                (this.state.meals != null && this.state.meals != '' && this.state.meals.items.length > 0 && this.state.mealShippingCostStatus) ?
                                                                                                    CURRENCY_FORMAT(CART_TOTAL_CURRENCY_FORMAT(Number(MEAL_TOTAL()) - Number(COUPON_TOTAL())))
                                                                                                    :
                                                                                                    CURRENCY_FORMAT(CART_TOTAL_CURRENCY_FORMAT(Number(MEAL_SUB_TOTAL()) - Number(COUPON_TOTAL())))
                                                                                        }
                                                                                    </span>
                                                                                </span>
                                                                            </strong>
                                                                        </td>
                                                                    </tr>

                                                                    {/* Recurring cart area start */}

                                                                    {
                                                                        (COUNT_SUBSCRIPTION() == 0) ? null :
                                                                            <Fragment>
                                                                                <tr>
                                                                                    <td colSpan="2" className="recurring_totals_title" > Recurring Totals </td>
                                                                                </tr>
                                                                                <tr className="cart-subtotal recurring-total">
                                                                                    <td rowSpan="1">Subtotal</td>
                                                                                    <td className="subtotal">
                                                                                        <span className="woocommerce-Price-amount amount">
                                                                                            <span className="woocommerce-Price-currencySymbol" />
                                                                                            {CURRENCY_FORMAT(RECURRING_CART_SUB_TOTAL())} </span> / month
                                                                                    </td>
                                                                                </tr>
                                                                                <tr className="">
                                                                                    <td>SHIPPING COST</td>
                                                                                    <td className="subtotal">
                                                                                        {// Start recurring cart shipping
                                                                                            (this.state.shippingMethods.length <= 0) ? null :
                                                                                                this.state.shippingMethods.map(function (shipping, key) {
                                                                                                    if (shipping.allow_for_coupon == 0) {
                                                                                                        return (
                                                                                                            <Fragment key={key} >
                                                                                                                <label>
                                                                                                                    {shipping.label} :
                                                                                                                        <span className="woocommerce-Price-amount amount">
                                                                                                                        <span className="woocommerce-Price-currencySymbol"> {CURRENCY_FORMAT(shipping.cost)} </span>
                                                                                                                    </span>
                                                                                                                    {
                                                                                                                        (this.state.recurringCartMethodId == shipping.id) ?
                                                                                                                            <input onChange={this.changeRecurringCartShippingMethod} price={shipping.cost} rid={shipping.id} defaultChecked="checked" type="radio" name="recurringOrderShippingMethod" />
                                                                                                                            :
                                                                                                                            <input onChange={this.changeRecurringCartShippingMethod} price={shipping.cost} rid={shipping.id} type="radio" name="recurringOrderShippingMethod" />
                                                                                                                    }
                                                                                                                </label>
                                                                                                                <br />
                                                                                                            </Fragment>
                                                                                                        );
                                                                                                    }
                                                                                                }.bind(this)
                                                                                                )
                                                                                            // End recurring cart shipping
                                                                                        }
                                                                                    </td>
                                                                                </tr>
                                                                                {
                                                                                    (this.state.taxStatus == 0) ? "" :
                                                                                        <Fragment>
                                                                                            <tr className="woocommerce-shipping-totals shipping">
                                                                                                <td className="no_display_mobile"> Tax </td>
                                                                                                <td data-title="Tax">
                                                                                                    <span className="woocommerce-Price-amount amount">
                                                                                                        <span className="woocommerce-Price-currencySymbol">
                                                                                                            {CURRENCY_FORMAT(this.state.taxAmount)}
                                                                                                        </span>
                                                                                                    </span>
                                                                                                </td>
                                                                                            </tr>
                                                                                        </Fragment>
                                                                                }
                                                                                <tr className="order-total">
                                                                                    <td rowSpan="1" className="recurring_total_text" > Recurring Total </td>
                                                                                    <td className="recurring_total">
                                                                                        <div className="total_per_month">
                                                                                            <span>
                                                                                                <span className="woocommerce-Price-currencySymbol">
                                                                                                    {CURRENCY_FORMAT(Number(RECURRING_CART_SUB_TOTAL()) + Number(this.state.recurringCartShippingCost))}
                                                                                                </span>
                                                                                            </span> / month
                                                                                    </div>
                                                                                        <div className="first-payment-date">
                                                                                            <small>
                                                                                                First renewal: {NEXT_MONTH()}
                                                                                            </small>
                                                                                        </div>
                                                                                    </td>
                                                                                </tr>
                                                                            </Fragment>
                                                                    }

                                                                    {/* Recurring cart area end */}

                                                                    {/* Meal Recurring cart area start */}

                                                                    {
                                                                        (this.state.meals.length <= 0 || this.state.meals.subscription == 'no') ? "" :
                                                                            <Fragment>
                                                                                <tr>
                                                                                    <td colSpan="2" className="recurring_totals_title">Meal Recurring Totals</td>
                                                                                </tr>
                                                                                <tr className="cart-subtotal recurring-total">
                                                                                    <td rowSpan="1">Subtotal</td>
                                                                                    <td className="subtotal">
                                                                                        <span className="woocommerce-Price-amount amount"><span className="woocommerce-Price-currencySymbol"></span>{CURRENCY_FORMAT(MEAL_SUB_TOTAL())}</span> / {duration_text}
                                                                                    </td>
                                                                                </tr>
                                                                                <tr className="woocommerce-shipping-totals shipping">
                                                                                    <td className="no_display_mobile">Meal Shipping Cost</td>
                                                                                    <td data-title="Shipping Cost">
                                                                                        <div id="shipping_method" className="shipping-methods">
                                                                                            <Fragment>
                                                                                                <label>
                                                                                                    {
                                                                                                        (this.state.meals.shipping_cost > 0) ?
                                                                                                            CURRENCY_FORMAT(this.state.meals.shipping_cost)
                                                                                                            : "Free Shipping"
                                                                                                    }
                                                                                                </label>
                                                                                            </Fragment>
                                                                                        </div>
                                                                                    </td>
                                                                                </tr>
                                                                                {
                                                                                    (this.state.taxStatus == 0) ? '' :
                                                                                        <Fragment>
                                                                                            <tr className="woocommerce-shipping-totals shipping">
                                                                                                <td className="no_display_mobile">Tax</td>
                                                                                                <td data-title="Tax">
                                                                                                    <span className="woocommerce-Price-amount amount">
                                                                                                        <span className="woocommerce-Price-currencySymbol"> {CURRENCY_FORMAT(this.state.taxAmount)} </span>
                                                                                                    </span>
                                                                                                </td>
                                                                                            </tr>
                                                                                        </Fragment>
                                                                                }
                                                                                <tr className="order-total">
                                                                                    <td rowSpan="1" className="recurring_total_text">Meal Recurring Total</td>
                                                                                    <td className="recurring_total">
                                                                                        <div className="total_per_month">
                                                                                            <span><span className="woocommerce-Price-currencySymbol">
                                                                                                {
                                                                                                    CURRENCY_FORMAT(MEAL_TOTAL())
                                                                                                }
                                                                                            </span></span> / {duration_text}
                                                                                        </div>
                                                                                        <div className="first-payment-date">
                                                                                            <small>
                                                                                                First renewal: {NEXT_WEEK(duration_id)}
                                                                                            </small>
                                                                                        </div>
                                                                                    </td>
                                                                                </tr>
                                                                            </Fragment>
                                                                    }

                                                                    {/* Meal Recurring cart area end */}

                                                                </tbody>
                                                            </table>
                                                            <div className="wc-proceed-to-checkout">
                                                                <NavLink to="/checkout" className="wc-forward">
                                                                    Proceed to checkout
                                                            </NavLink>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </main>
                                    </Fragment>
                            }
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}

CartPage.propTypes = {
    auth: PropTypes.object.isRequired,
    meals: PropTypes.array.isRequired
};

function mapStateToProps(state) {
    return {
        auth: state.auth,
        meals: state.meals
    };
}

const mapDispachToProps = dispach => {
    return {
        addToCart: () => dispach({ type: "ADD_TO_CART", value: JSON.parse(GET_STORAGE("cart")) }),
        addMealToCart: () => dispach({ type: "ADD_MEAL_TO_CART", value: JSON.parse(GET_STORAGE("meals")) })
    };
};

export default connect(mapStateToProps, mapDispachToProps)(CartPage);