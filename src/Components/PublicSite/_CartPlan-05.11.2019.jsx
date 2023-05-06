import React, { Fragment, PureComponent } from 'react';
import { CURRENCY_FORMAT, GET_STORAGE, SET_STORAGE } from "../../Constants/AppConstants";
import ReactImageFallback from "react-image-fallback";

class CartPlan extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {}
    }

    changeHandler = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    componentDidMount() {
        let plan = this.props.plan;
        if (this.state.quantity) {
            this.setState({ quantity: this.state.quantity })
        } else {
            this.setState({ quantity: plan.quantity })
        }
    }

    quantityIncrement = (e) => {
        let quantity = Number(this.state.quantity) + 1;
        this.setState({ quantity: quantity })
    }

    quantityDecrement = (e) => {
        let quantity = Number(this.state.quantity) - 1;
        this.setState({ quantity: quantity });
    }

    render() {

        let plan = this.props.plan;

        return (
            <Fragment>
                <tr className="cart_page_data_list">
                    <td data-title="Remove" className="cart_product_remove">
                        <a onClick={(e) => this.props.deleteMeal(e)} href="javascript:void(0)" className="remove"><i className="fa fa-times" aria-hidden="true"></i></a>
                    </td>
                    <td data-title="Product" className="product-thumbnail">
                        <div className="cart_page_product_img distributor_cart_product">
                            {
                                (plan.image) ?
                                    <div className="cart_page_product_img distributor_cart_product">
                                        <ReactImageFallback
                                            src={plan.image}
                                            fallbackImage={require('../../Assets/images/preloader.gif')}
                                            initialImage={require('../../Assets/images/preloader.gif')}
                                            alt=''
                                            className="cart_product_img" />
                                    </div>
                                    : ""
                            }
                        </div>
                        <div className="cart_product_details distributor_cart_details mob_left_right_none">
                            <a href="#"> {plan.product_name} </a>
                            {
                                (plan.items.length <= 0) ? null :
                                    plan.items.map(function (item, key) {
                                        return (
                                            <Fragment key={Math.random()}>
                                                <br /><span style={{ fontSize: "10px" }}> <i className="fa fa-circle" aria-hidden="true"></i> {item.meal_name} x {item.meal_quantity}</span>
                                            </Fragment>
                                        )
                                    }.bind(this))
                            }
                            {
                                (plan.premium == "yes") ?
                                    <p style={{ marginBottom: "0px" }}><span>Premium (+{plan.premium_amount})</span></p>
                                    : <br />
                            }
                            {
                                (plan.subscription == "yes") ?
                                    <dl className="variation">
                                        <dt className="variation-Every1Months"> Every week: </dt>
                                        <dd className="variation-Every1Months"><p>{CURRENCY_FORMAT(plan.discount_price)} each</p></dd>
                                    </dl>
                                    : ""
                            }
                        </div>

                    </td>
                    <td data-title="Price" className="cart_product_price">
                        <span className="Price-currencySymbol">
                            {
                                (plan.subscription == "yes") ?
                                    CURRENCY_FORMAT(plan.discount_price)
                                    :
                                    CURRENCY_FORMAT(plan.sale_price)
                            }
                        </span>
                    </td>
                    <td data-title="Quantity" className="cart_product_number">
                        <button type="button" onClick={this.quantityDecrement} disabled={this.state.quantity <= 1 ? "disabled" : ""} className="decrement btn btn-sm">-</button>
                        <input onChange={this.changeHandler} value={this.state.quantity} key={Math.random()} name="plan_quantity" id="plan_quantity" type="text" readOnly className="input-text qty text" step="1" min="0" max="" title="Qty" size="4" pattern="[0-9]*" inputMode="numeric" />
                        <button type="button" onClick={this.quantityIncrement} className="increment btn btn-sm">+</button>
                    </td>
                    <td data-title="Total" className="cart-product-subtotal">
                        <span className="Price-currencySymbol">
                            {
                                (plan.subscription == "yes") ?
                                    CURRENCY_FORMAT(plan.discount_price * plan.quantity)
                                    :
                                    CURRENCY_FORMAT(plan.sale_price * plan.quantity)
                            }
                        </span>
                    </td>
                </tr>
            </Fragment>
        );
    }
}

export default CartPlan;