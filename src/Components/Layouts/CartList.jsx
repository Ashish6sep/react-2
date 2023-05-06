import React, { Fragment, PureComponent } from "react";
import { NavLink } from "react-router-dom";
import { SET_STORAGE, GET_STORAGE, CURRENCY_FORMAT, MEAL_SUB_TOTAL, CART_SUB_TOTAL } from "../../Constants/AppConstants";
import { connect } from "react-redux";
import history from "../../history";
import ReactImageFallback from "react-image-fallback";

class CartList extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
        this.props.addToCart();
        this.props.addMealToCart();
    }
    deleteItem = (e, row_id) => {
        e.preventDefault();
        if (window.confirm("Are you sure want to delete item?")) {
            let cart = JSON.parse(GET_STORAGE("cart"));
            cart.splice(row_id, 1);
            SET_STORAGE("cart", JSON.stringify(cart));
            this.props.addToCart();
            if (history.location.pathname === "/cart" || history.location.pathname === "/checkout") {
                const redirect_url = window.location.href;
                window.location.href = redirect_url;
            }
        }
    };

    deleteMealItem = e => {
        e.preventDefault();
        if (window.confirm("Are you sure want to delete item?")) {
            SET_STORAGE("meals", JSON.stringify([]));
            let meals = JSON.parse(GET_STORAGE("meals"));
            SET_STORAGE("meals", JSON.stringify(meals));
            this.props.addMealToCart();
            history.push("/meals");
        }
    };

    onClickGoTop = () => {
        window.scrollTo(0, 0);
    };

    render() {
        const is_meal_available = (this.props.meals.length > 0 && this.props.meals[0]) ? true : false;
        const products = (this.props.cart[0]) ? this.props.cart[0] : [];
        const meals = (is_meal_available) ? this.props.meals[0] : [];
        return (
            <Fragment>
                {
                    (products.length > 0 || (is_meal_available && meals.items.length > 0)) ?
                        <Fragment>
                            <ul className="menu_cart_product">
                                {
                                    products.map(function (product, key) {
                                        return (
                                            <Fragment key={Math.random()}>
                                                <li className="">
                                                    <a className="menu_cart_product_img" href="#">
                                                        <ReactImageFallback
                                                            src={product.cart_image}
                                                            fallbackImage={require("../../Assets/images/preloader.gif")}
                                                            initialImage={require("../../Assets/images/preloader.gif")}
                                                            alt=""
                                                            className=""
                                                        />
                                                    </a>
                                                    <span className="menu_cart_product_name">
                                                        {product.cart_product_name} - {product.cart_variation_name}
                                                    </span>
                                                    <a
                                                        onClick={e => this.deleteItem(e, key)}
                                                        href="#"
                                                        className="pull-right remove_from_cart_button"
                                                    >
                                                        <i className="fa fa-times" aria-hidden="true" />
                                                    </a>
                                                </li>
                                            </Fragment>
                                        );
                                    }.bind(this))
                                }
                                {
                                    (meals.hasOwnProperty('items')) ?
                                        meals.items.map(function (item, key) {
                                            return (
                                                <Fragment key={Math.random()}>
                                                    <li className="">
                                                        <a className="menu_cart_product_img" href="#">
                                                            <ReactImageFallback
                                                                src={item.meal_thumb_image}
                                                                fallbackImage={require("../../Assets/images/preloader.gif")}
                                                                initialImage={require("../../Assets/images/preloader.gif")}
                                                                alt=""
                                                                className=""
                                                            />
                                                        </a>
                                                        <span className="menu_cart_product_name">
                                                            {item.meal_name} - {item.meal_size}
                                                        </span>
                                                        {/* <a onClick={(e) => this.deleteMealItem(e)} href="#" className="pull-right remove_from_cart_button" >
                                                        <i className="fa fa-times" aria-hidden="true" />
                                                    </a> */}
                                                    </li>
                                                </Fragment>
                                            );
                                        }.bind(this))
                                        : ""
                                }
                            </ul>
                            <div className="menu_cart_price_total">
                                <span className="pull-left">Subtotal:</span>
                                <span className="pull-right">
                                    <strong>{CURRENCY_FORMAT(Number(CART_SUB_TOTAL()) + Number(MEAL_SUB_TOTAL()))}</strong>
                                </span>
                                <div className="clearfix" />
                            </div>
                            <div className="mini_cart_buttons">
                                <NavLink onClick={this.onClickGoTop} to="/cart" className="button wc-forward">
                                    View Cart
                            </NavLink>
                                <NavLink onClick={this.onClickGoTop} to="/cart?redirect=checkout" className="button checkout wc-forward">
                                    Checkout
                            </NavLink>
                            </div>
                        </Fragment>
                        :
                        <Fragment>
                            <span className="pull-left"> No products in the cart. </span>
                        </Fragment>
                }
            </Fragment>
        );
    }
}

const mapDispachToProps = dispach => {
    return {
        addToCart: () => dispach({ type: "ADD_TO_CART", value: JSON.parse(GET_STORAGE("cart")) }),
        addMealToCart: () => dispach({ type: "ADD_MEAL_TO_CART", value: JSON.parse(GET_STORAGE("meals")) })
    };
};

function mapStateToProps(state) {
    return {
        cart: state.cart,
        meals: state.meals
    };
}

export default connect(mapStateToProps, mapDispachToProps)(CartList);