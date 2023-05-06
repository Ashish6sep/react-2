import React, { Fragment, PureComponent } from 'react';
import { CURRENCY_FORMAT, AJAX_REQUEST } from "../../Constants/AppConstants";
import ReactImageFallback from "react-image-fallback";

class CartProductList extends PureComponent {
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
        let product = this.props.product;
        if (this.state.quantity) {
            this.setState({ quantity: parseInt(this.state.quantity) })
        } else {
            this.setState({ quantity: parseInt(product.quantity) })
        }
    }

    quantityIncrement = (e) => {
        this.setState({ quantity: parseInt(Number(this.state.quantity) + 1) })
    }

    quantityDecrement = (e) => {
        this.setState({ quantity: parseInt(Number(this.state.quantity) - 1) });
    }

    render() {

        let product = this.props.product;

        return (
            <Fragment>
                <tr key={product.row_id} className="cart_page_data_list">
                    <td data-title="Remove" className="cart_product_remove">
                        <a onClick={(e) => product.deleteItem(e, product.row_id)} href="#" className="remove"><i className="fa fa-times" aria-hidden="true"></i></a>
                    </td>
                    <td data-title="Product" className="product-thumbnail">
                        <div className="cart_page_product_img distributor_cart_product">
                            <ReactImageFallback
                                src={product.cart_image}
                                fallbackImage={require('../../Assets/images/preloader.gif')}
                                initialImage={require('../../Assets/images/preloader.gif')}
                                alt=''
                                className="cart_product_img" />
                        </div>
                        <div className="cart_product_details distributor_cart_details mob_left_right_none">
                            <a href="#">
                                {product.cart_product_name} - &nbsp;
                                {product.cart_variation_name}
                            </a>
                            {
                                (product.subscription == "yes") ?
                                    <dl className="variation">
                                        <dt className="variation-Every1Months"> {product.cart_subscription_msg}: </dt>
                                        <dd className="variation-Every1Months"><p>{CURRENCY_FORMAT(product.cart_discount_price)} each</p></dd>
                                    </dl>
                                    : null
                            }
                        </div>
                    </td>
                    <td data-title="Price" className="cart_product_price">
                        <span className="Price-currencySymbol">
                            {
                                (product.subscription == "yes") ?
                                    CURRENCY_FORMAT(product.cart_discount_price)
                                    :
                                    CURRENCY_FORMAT(product.cart_sale_price)
                            }
                        </span>
                    </td>
                    <td data-title="Quantity" className="cart_product_number">
                        <button type="button" onClick={this.quantityDecrement} disabled={(this.state.quantity <= 1) ? "disabled" : ""} className="decrement btn btn-sm">-</button>
                        <input onChange={this.changeHandler} value={this.state.quantity} key={Math.random()} name="quantity[]" type="text" readOnly className="input-text qty text" step="1" min="0" max="" title="Qty" size="4" pattern="[0-9]*" inputMode="numeric" />
                        <button type="button" onClick={this.quantityIncrement} disabled={(parseInt(this.state.quantity) >= parseInt(product.in_stock)) ? "disabled" : ""} className="increment btn btn-sm">+</button>
                    </td>
                    <td data-title="Total" className="cart-product-subtotal">
                        <span className="Price-currencySymbol">
                            {
                                (product.subscription == "yes") ?
                                    CURRENCY_FORMAT(product.cart_discount_price * product.quantity)
                                    :
                                    CURRENCY_FORMAT(product.cart_sale_price * product.quantity)
                            }
                        </span>
                    </td>
                </tr>
            </Fragment>
        );
    }
}

export default CartProductList;