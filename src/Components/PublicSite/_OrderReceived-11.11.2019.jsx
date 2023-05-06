import React, { PureComponent, Fragment } from "react";
import Parser from 'html-react-parser';
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import history from '../../history';
import { AJAX_REQUEST, CURRENCY_FORMAT, GET_STORAGE } from "../../Constants/AppConstants";
import ReactImageFallback from "react-image-fallback";

class OrderReceived extends PureComponent {
    constructor(props) {
        super(props);
        // Check Tax
        let settings = '';
        if (GET_STORAGE('settings')) {
            settings = JSON.parse(GET_STORAGE('settings'));
        }

        this.state = {
            loading: true,
            error: '',
            orderReceived: [],
            taxStatus: settings ? settings.tax_status : 0,
        }
        document.title = "Order Recieved -Prestige Labs";
    }

    timeOut = (timedata) => {
        setTimeout(function () {
            history.push('/');
        }.bind(this), timedata);
    }

    componentDidMount() {
        document.querySelector("body").scrollIntoView();
        this.getOrderDetails();
        this.props.addToCart();
        this.props.addMealToCart();
        this.timeOut(5000);
    }

    getOrderDetails = () => {
        const data = {
            order_id: this.props.match.params.order_id,
            is_order_received_page: 1,
        }
        AJAX_REQUEST("POST", "order/getReceived", data).then(results => {
            if (parseInt(results.response.code) === 1000) {
                this.setState({
                    loading: false,
                    orderReceived: results.response.data,
                });
            } else {
                this.setState({
                    loading: false,
                    error: results.response.message,
                });
            }
        });
    }

    render() {

        let orders = this.state.orderReceived;

        return (
            <Fragment>
                {
                    (this.state.loading) ?
                        <div className='loading container full_page_loader'></div>
                        :
                        <Fragment>
                            <div className="container">
                                <div className="row">
                                    <div className="col-md-12">
                                        <main className="order_receiver_wrapper">
                                            <div className="page-content entry-content"></div>
                                            <div className="page-title">Order Received</div>
                                            {
                                                (orders.length < 0) ? '' :
                                                    orders.map(function (order, key) {
                                                        return (
                                                            <Fragment key={key}>
                                                                <div className="woocommerce">
                                                                    <div className="woocommerce-order">
                                                                        {
                                                                            (key !== 0) ? "" :
                                                                                <Fragment>
                                                                                    <p className="woocommerce-notice woocommerce-notice--success woocommerce-thankyou-order-received"><i className="fa fa-check-circle" aria-hidden="true"></i> {order.hasOwnProperty('success_message') ? Parser(order.success_message) : null} </p>
                                                                                    <p className="woocommerce-notice woocommerce-notice--success woocommerce-thankyou-order-received"><i className="fa fa-info-circle" aria-hidden="true"></i> {order.hasOwnProperty('payment_message') ? Parser(order.payment_message) : null} </p>
                                                                                </Fragment>
                                                                        }
                                                                        <ul className="order_details_list">
                                                                            <li> Order Number: <strong> {order.hasOwnProperty("order_id") ? order.order_id : null} </strong></li>
                                                                            <li> Date: <strong> {order.hasOwnProperty("created_at") ? order.created_at : null} </strong></li>
                                                                            <li> Total:  <strong> {order.hasOwnProperty("total") ? CURRENCY_FORMAT(order.total) : null} </strong></li>
                                                                            <li> Payment Method: <strong> {order.hasOwnProperty("payment_method") ? order.payment_method : null} </strong></li>
                                                                            <li> Order Type: <strong> {(order.order_type == 'supplement') ? "Product" : "Meal"} </strong></li>
                                                                        </ul>
                                                                        <div className="row">
                                                                            <div className="col-xs-12 col-md-4">
                                                                                <section className="woocommerce-order-details">
                                                                                    <h2 className="checkout_title">Order Details</h2>
                                                                                    <table className="receive_order_details">
                                                                                        <thead>
                                                                                            <tr>
                                                                                                <th className="text-center" width="60%">{(order.order_type == 'supplement') ? "Product" : "Plan"}</th>
                                                                                                <th className="text-center">Total</th>
                                                                                            </tr>
                                                                                        </thead>
                                                                                        <tbody>
                                                                                            {
                                                                                                (!order.hasOwnProperty("products")) ? null :
                                                                                                    order.products.map(function (product, key) {
                                                                                                        return (
                                                                                                            <Fragment key={key}>
                                                                                                                <tr>
                                                                                                                    <td>
                                                                                                                        <a href="javascript:void(0)">
                                                                                                                            {
                                                                                                                                (product.product_thumbnail && order.order_type == 'supplement') ?
                                                                                                                                    <ReactImageFallback
                                                                                                                                        src={product.product_thumbnail}
                                                                                                                                        fallbackImage={require('../../Assets/images/preloader.gif')}
                                                                                                                                        initialImage={require('../../Assets/images/preloader.gif')}
                                                                                                                                        alt=''
                                                                                                                                        className="" />
                                                                                                                                    : ''
                                                                                                                            }
                                                                                                                            <span className="order_receive_product_name"> {product.hasOwnProperty("name_with_variants") ? product.name_with_variants : null} × {product.hasOwnProperty("quantity") ? product.quantity : null} </span>
                                                                                                                        </a>

                                                                                                                    </td>
                                                                                                                    <td>{product.hasOwnProperty("total_price") ? CURRENCY_FORMAT(product.total_price) : null} </td>
                                                                                                                </tr>
                                                                                                            </Fragment>
                                                                                                        )
                                                                                                    }.bind(this))
                                                                                            }
                                                                                        </tbody>
                                                                                        <tfoot>
                                                                                            <tr>
                                                                                                <td scope="row">Subtotal:</td>
                                                                                                <td><strong> {order.hasOwnProperty("subtotal") ? CURRENCY_FORMAT(order.subtotal) : null} </strong> </td>
                                                                                            </tr>
                                                                                            {
                                                                                                (order.discounts && order.discounts.length > 0) ?
                                                                                                    order.discounts.map(function (discount, key) {
                                                                                                        return (
                                                                                                            <Fragment key={key}>
                                                                                                                <tr>
                                                                                                                    <td scope="row">{discount.hasOwnProperty("label") ? discount.label : null}</td>
                                                                                                                    <td>{discount.hasOwnProperty("amount") ? CURRENCY_FORMAT(discount.amount) : null} </td>
                                                                                                                </tr>
                                                                                                            </Fragment>
                                                                                                        )
                                                                                                    }.bind(this))
                                                                                                    : null
                                                                                            }
                                                                                            <tr>
                                                                                                <td scope="row">Shipping:</td>
                                                                                                <td>
                                                                                                    {order.hasOwnProperty("shipping_cost") ? CURRENCY_FORMAT(order.shipping_cost) : null} &nbsp;
                                                                                                <small className="shipped_via"> {order.hasOwnProperty("shipping") ? order.shipping : null} </small>
                                                                                                </td>
                                                                                            </tr>
                                                                                            {
                                                                                                (this.state.taxStatus == 1) ?
                                                                                                    <Fragment>
                                                                                                        <tr>
                                                                                                            <td scope="row">Tax:</td>
                                                                                                            <td>
                                                                                                                {order.hasOwnProperty("tax_amount") ? CURRENCY_FORMAT(order.tax_amount) : null}
                                                                                                            </td>
                                                                                                        </tr>
                                                                                                    </Fragment>
                                                                                                    : null
                                                                                            }
                                                                                            <tr>
                                                                                                <td scope="row">Payment Method:</td>
                                                                                                <td><span>{order.hasOwnProperty("payment_method") ? order.payment_method : null} </span></td>
                                                                                            </tr>
                                                                                            <tr>
                                                                                                <td scope="row">Total:</td>
                                                                                                <td>
                                                                                                    <strong> {order.hasOwnProperty("total") ? CURRENCY_FORMAT(order.total) : null} </strong>
                                                                                                </td>
                                                                                            </tr>
                                                                                            <tr>
                                                                                                <td>Note:</td>
                                                                                                <td>
                                                                                                    <div className="note">
                                                                                                        {order.hasOwnProperty("order_note") ? order.order_note : null}
                                                                                                    </div>
                                                                                                </td>
                                                                                            </tr>

                                                                                        </tfoot>
                                                                                    </table>
                                                                                </section>
                                                                                <br />
                                                                                <section className="woocommerce-order-details">
                                                                                    <table className="receive_order_details">
                                                                                        <tbody>
                                                                                            {
                                                                                                (order.order_type == 'meal' && order.meals.length > 0) ?
                                                                                                    <Fragment>
                                                                                                        <tr>
                                                                                                            <th className="text-center" width="60%">Meal Name</th>
                                                                                                            <th className="text-center">Quantity</th>
                                                                                                        </tr>
                                                                                                        {
                                                                                                            order.meals.map(function (meal, key) {
                                                                                                                return (
                                                                                                                    <Fragment>
                                                                                                                        <tr>
                                                                                                                            <td>
                                                                                                                                <a href="javascript:void(0)">
                                                                                                                                    {
                                                                                                                                        (meal.meal_thumbnail) ?
                                                                                                                                            <ReactImageFallback
                                                                                                                                                src={meal.meal_thumbnail}
                                                                                                                                                fallbackImage={require('../../Assets/images/preloader.gif')}
                                                                                                                                                initialImage={require('../../Assets/images/preloader.gif')}
                                                                                                                                                alt=''
                                                                                                                                                className="" />
                                                                                                                                            : ''
                                                                                                                                    }
                                                                                                                                    <span className="order_receive_product_name"> {meal.hasOwnProperty("meal_name") ? meal.meal_name : null} </span>
                                                                                                                                </a>

                                                                                                                            </td>
                                                                                                                            <td className="text-center"><strong> {meal.hasOwnProperty("quantity") ? meal.quantity : null} </strong> </td>
                                                                                                                        </tr>
                                                                                                                    </Fragment>
                                                                                                                )
                                                                                                            }.bind(this))
                                                                                                        }
                                                                                                    </Fragment>
                                                                                                    : ''
                                                                                            }
                                                                                        </tbody>
                                                                                    </table>
                                                                                </section>
                                                                            </div>

                                                                            <div className="col-xs-12 col-md-8">

                                                                                {
                                                                                    (order.related_subscription && order.related_subscription.length > 0) ?
                                                                                        <Fragment>
                                                                                            <div className="woocommerce-order-details">
                                                                                                <h2 className="checkout_title">Related Subscriptions</h2>
                                                                                                <table className="my_account_orders shop_table_responsive">
                                                                                                    <thead>
                                                                                                        <tr>
                                                                                                            <th className="order-number"><span className="nobr">Subscription</span></th>
                                                                                                            <th className="order-date"><span className="nobr">Status</span></th>
                                                                                                            <th className="order-status"><span className="nobr">Next Payment</span></th>
                                                                                                            <th className="order-total"><span className="nobr">Total</span></th>
                                                                                                            <th className="order-actions">&nbsp;</th>
                                                                                                        </tr>
                                                                                                    </thead>
                                                                                                    <tbody>
                                                                                                        {
                                                                                                            (!order.hasOwnProperty("related_subscription")) ? null :
                                                                                                                order.related_subscription.map(function (subscription, key) {
                                                                                                                    return (
                                                                                                                        <Fragment key={key}>
                                                                                                                            <tr className="order">
                                                                                                                                <td data-title="Subscription"><span>#{subscription.hasOwnProperty("subscription_id") ? subscription.subscription_id : null} </span></td>
                                                                                                                                <td data-title="Status"> <span className="note"> {subscription.hasOwnProperty("status") ? subscription.status : null} </span> </td>
                                                                                                                                <td data-title="Next Payment"><span className="note"> {subscription.hasOwnProperty("next_payment_date") ? subscription.next_payment_date : null} </span></td>
                                                                                                                                <td data-title="Total">
                                                                                                                                    <span className="note">
                                                                                                                                        {subscription.hasOwnProperty("total") ? CURRENCY_FORMAT(subscription.total) : null}
                                                                                                                                        / {subscription.hasOwnProperty("duration") ? subscription.duration : null}
                                                                                                                                    </span>
                                                                                                                                </td>
                                                                                                                                <td data-title="">
                                                                                                                                    {/* <NavLink className="wc-forward" to={`/my-account/subscription-order-view/${subscription.subscription_id}`}>View</NavLink> */}
                                                                                                                                </td>
                                                                                                                            </tr>
                                                                                                                        </Fragment>
                                                                                                                    )
                                                                                                                }.bind(this))
                                                                                                        }

                                                                                                    </tbody>
                                                                                                </table>
                                                                                            </div>
                                                                                        </Fragment>
                                                                                        : null

                                                                                }

                                                                                <section className="woocommerce-customer-details">
                                                                                    <div className="pull-left billing_address_container">
                                                                                        <h2 className="checkout_title">Billing Address</h2>
                                                                                        <address className="shipping-address">
                                                                                            {
                                                                                                (!order.hasOwnProperty("billing_address")) ? null :
                                                                                                    <Fragment>
                                                                                                        {order.billing_address.hasOwnProperty("name") ? order.billing_address.name : null} <br />
                                                                                                        {order.billing_address.hasOwnProperty("street_address") ? order.billing_address.street_address : null} <br />
                                                                                                        {order.billing_address.hasOwnProperty("city") ? order.billing_address.city : null} <br />
                                                                                                        {order.billing_address.hasOwnProperty("state") ? order.billing_address.state : null} <br />
                                                                                                        {order.billing_address.hasOwnProperty("zip") ? order.billing_address.zip : null}
                                                                                                        <p><i className="fa fa-phone" aria-hidden="true"></i> {order.billing_address.hasOwnProperty("phone") ? order.billing_address.phone : null}</p>
                                                                                                        <p><i className="fa fa-envelope-o" aria-hidden="true"></i> {order.billing_address.hasOwnProperty("email") ? order.billing_address.email : null}</p>
                                                                                                    </Fragment>
                                                                                            }
                                                                                        </address>
                                                                                    </div>
                                                                                    <div className="pull-right billing_address_container">
                                                                                        <h2 className="checkout_title">Shipping Address</h2>
                                                                                        <address className="shipping-address">
                                                                                            {
                                                                                                (!order.hasOwnProperty("shipping_address")) ? null :
                                                                                                    <Fragment>
                                                                                                        {order.shipping_address.hasOwnProperty("name") ? order.shipping_address.name : null} <br />
                                                                                                        {order.shipping_address.hasOwnProperty("street_address") ? order.shipping_address.street_address : null} <br />
                                                                                                        {order.shipping_address.hasOwnProperty("city") ? order.shipping_address.city : null} <br />
                                                                                                        {order.shipping_address.hasOwnProperty("state") ? order.shipping_address.state : null} <br />
                                                                                                        {order.shipping_address.hasOwnProperty("zip") ? order.shipping_address.zip : null}
                                                                                                    </Fragment>
                                                                                            }
                                                                                        </address>
                                                                                    </div>
                                                                                    <div className="clearfix"></div>
                                                                                </section>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <br />
                                                            </Fragment>
                                                        )
                                                    }.bind(this))
                                            }
                                        </main>
                                    </div>
                                </div>
                            </div>
                        </Fragment>
                }
            </Fragment>
        );
    }
}

OrderReceived.propTypes = {
    auth: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        auth: state.auth
    }
}

const mapDispachToProps = (dispach) => {
    return {
        addToCart: () => dispach({ type: 'ADD_TO_CART', value: JSON.parse(GET_STORAGE('cart')) }),
        addMealToCart: () => dispach({ type: "ADD_MEAL_TO_CART", value: JSON.parse(GET_STORAGE("meals")) })
    }
}

export default connect(mapStateToProps, mapDispachToProps)(OrderReceived);

