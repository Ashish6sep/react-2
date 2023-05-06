import React, { Fragment, PureComponent } from 'react';
import { CURRENCY_FORMAT } from "../../Constants/AppConstants";
import ReactImageFallback from "react-image-fallback";

class CartPlan extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
    }

    render() {

        let item = this.props.item;

        return (
            <Fragment>
                <tr className="cart_page_data_list">
                    <td data-title="Product" className="product-thumbnail" style={{ borderLeft: '1px solid #e1e1e1' }}>
                        <div className="cart_page_product_img distributor_cart_product">
                            <div className="cart_page_product_img distributor_cart_product">
                                <ReactImageFallback
                                    src={item.meal_thumb_image}
                                    fallbackImage={require('../../Assets/images/preloader.gif')}
                                    initialImage={require('../../Assets/images/preloader.gif')}
                                    alt=''
                                    className="cart_product_img" />
                            </div>
                        </div>
                        <div className="cart_product_details distributor_cart_details mob_left_right_none">
                            <p className="variation-Every1Months"><a href="#"> {item.meal_name} </a><br />
                                <span> {item.meal_size} </span>
                            </p>
                        </div>
                    </td>
                    <td data-title="Price" className="cart_product_price">
                        <span className="Price-currencySymbol">
                            {CURRENCY_FORMAT(item.meal_price)}
                        </span>
                    </td>
                    <td data-title="Quantity" className="cart_product_number">
                        <button type="button" disabled className="decrement btn btn-sm">-</button>
                        <input value={item.meal_quantity} key={Math.random()} name="plan_quantity" id="plan_quantity" type="text" disabled className="input-text qty text" />
                        <button type="button" disabled className="increment btn btn-sm">+</button>
                    </td>
                    <td data-title="Total" className="cart-product-subtotal">
                        <span className="Price-currencySymbol">
                            {CURRENCY_FORMAT(item.meal_price * item.meal_quantity)}
                        </span>
                    </td>
                </tr>
            </Fragment>
        );
    }
}

export default CartPlan;