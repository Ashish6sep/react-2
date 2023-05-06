import React, { Fragment, PureComponent } from 'react';
import { NavLink } from "react-router-dom";
import { connect } from 'react-redux';
import PropTypes from "prop-types";
import { AJAX_PUBLIC_REQUEST, CURRENCY_FORMAT, SET_STORAGE, GET_STORAGE, NEXT_MONTH, ITEM_COUNT } from '../../Constants/AppConstants';
import Parser from 'html-react-parser';
import ReactImageFallback from "react-image-fallback";
import $ from 'jquery';
import history from "../../history";

import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';

import OutOfStockButton from './OutOfStockButton';

import 'react-photoswipe/lib/photoswipe.css';
import { PhotoSwipe } from 'react-photoswipe';

let item_data = [];

let img = '';
let lens = '';
let result = '';
let cx = '';
let cy = '';

function moveLens(e) {
    var pos, x, y;
    e.preventDefault();
    pos = getCursorPos(e);
    x = pos.x - (lens.offsetWidth / 2);
    y = pos.y - (lens.offsetHeight / 2);
    if (x > img.width - lens.offsetWidth) { x = img.width - lens.offsetWidth; }
    if (x < 0) { x = 0; }
    if (y > img.height - lens.offsetHeight) { y = img.height - lens.offsetHeight; }
    if (y < 0) { y = 0; }
    lens.style.left = x + "px";
    lens.style.top = y + "px";
    document.getElementById('mkn-img-zoom-result').style.backgroundPosition = "-" + (x * cx) + "px -" + (y * cy) + "px";
}

function getCursorPos(e) {
    var a, x = 0, y = 0;
    e = e || window.event;
    a = img.getBoundingClientRect();
    x = e.pageX - a.left;
    y = e.pageY - a.top;
    x = x - window.pageXOffset;
    y = y - window.pageYOffset;
    return { x: x, y: y };
}

$(document).on({
    mousemove: function (e) {
        const imgurl = $(this).children('img').attr('largesrc');
        lens = this.childNodes[0];
        img = this.childNodes[1];
        result = document.getElementById('mkn-img-zoom-result');
        cx = result.offsetWidth / lens.offsetWidth;
        cy = result.offsetHeight / lens.offsetHeight;
        result.style.backgroundImage = "url('" + imgurl + "')";
        result.style.backgroundSize = (img.width * cx) + "px " + (img.height * cy) + "px";
        moveLens(e);
    }
}, '.mkn-img-container');

$(document).on({ mouseover: function () { $('#mkn-img-zoom-result').show(); } }, '.mkn-img-container');
$(document).on({ mouseout: function () { $('#mkn-img-zoom-result').hide(); } }, '.mkn-img-container');

class ProductDrtails extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            addToCart: "Add to Cart",
            product_id: this.props.match.params.slug,
            productDetails: {},
            subsDisplay: true,
            alertMsg: false,
            items: [],
            options: {},
            isOpen: false
        }
        document.title = "Order Details -Prestige Labs";
    }

    componentDidMount() {

        document.querySelector("body").scrollIntoView();

        const data = {
            product_id: this.state.product_id,
        }

        AJAX_PUBLIC_REQUEST("POST", "product/getDetails", data).then(results => {
            if (parseInt(results.response.code) === 1000) {
                const product = results.response.data;
                document.title = product.title + " - Prestige Labs";
                product.images.map(function (image, key) {
                    item_data.push({
                        src: image.large_image,
                        w: 1200,
                        h: 900,
                        title: product.title
                    });
                }.bind(this));

                this.setState({
                    productDetails: product,
                    items: item_data,
                    loading: false,
                });

                if (product.flavors) {
                    this.setState({
                        variationId: product.first_month + "_" + product.flavors[0].id,
                        monthId: product.first_month,
                        flavorId: product.flavors[0].id
                    })
                } else {
                    this.setState({
                        variationId: product.first_month,
                        monthId: product.first_month,
                    })
                }
                this.variation(this.state.variationId);

            } else if (parseInt(results.response.code) === 4004) {
                history.push("/");
            } else {
                this.setState({
                    error: Parser("<p className='text-danger'>" + results.response.message + "</p>"),
                    loading: false,
                })
            }
        });
    }

    variation = (variationKey) => {
        const product = this.state.productDetails;
        const variation = product.variations[variationKey];
        if (variation) {

            let regularPriceDisplay = false;
            let regular_price = 0;
            let sale_price = 0;
            if (parseFloat(variation.sale_price) > 0) {
                regularPriceDisplay = true;
                regular_price = variation.regular_price;
                sale_price = variation.sale_price;
            } else {
                regular_price = variation.regular_price;
                sale_price = variation.regular_price;
            }

            this.setState({
                productId: product.product_id,
                productName: product.title,
                image: product.thumb_image,
                variationId: variation.variation_id,
                variationName: variation.variation_name,
                regularPriceDisplay: regularPriceDisplay,
                regularPrice: regular_price,
                salePrice: sale_price,
                subscription: 'no',
                subscriptionMsg: 'Every 1 Month(s)',
                discountPrice: ((sale_price - (sale_price * product.subscription_save_percentage) / 100)),
                stockStatus: variation.stock_status,
                inStock: parseInt(variation.quantity),
                quantity: 1,
            })
        } else {
            this.setState({
                regularPriceDisplay: false,
                regularPrice: 0,
                salePrice: 0,
            })
        }
    }
    changeMonth = (e) => {
        const month_id = e.target.getAttribute('month_id');
        this.setState({
            monthId: month_id,
            subscription: 'no',
        })

        if (this.state.productDetails.flavors) {
            this.variation(month_id + "_" + this.state.flavorId)
        } else {
            this.variation(month_id)
        }

        if (month_id == this.state.productDetails.first_month) {
            this.setState({ subsDisplay: true });
        } else {
            this.setState({ subsDisplay: false });
        }
    }
    changeFlavor = (e) => {
        const flavor_id = e.target.getAttribute('flavor_id');
        this.setState({ flavorId: flavor_id })
        let variationKey = this.state.monthId + "_" + flavor_id;
        this.variation(variationKey);
    }

    addToCart = (e) => {

        let cart = [];
        let data = [];

        if (!GET_STORAGE("cart")) {
            SET_STORAGE("cart", JSON.stringify(cart));
        }
        cart = JSON.parse(GET_STORAGE("cart"));

        let newItem = {
            cart_product_id: e.target.getAttribute('cart_product_id'),
            cart_product_name: e.target.getAttribute('cart_product_name'),
            cart_image: e.target.getAttribute('cart_image'),
            cart_variation_id: e.target.getAttribute('cart_variation_id'),
            cart_variation_name: e.target.getAttribute('cart_variation_name'),
            cart_sale_price: e.target.getAttribute('cart_sale_price'),
            subscription: e.target.getAttribute('subscription'),
            cart_subscription_msg: e.target.getAttribute('cart_subscription_msg'),
            cart_discount_price: e.target.getAttribute('cart_discount_price'),
            quantity: parseInt(e.target.getAttribute('quantity')),
            in_stock: parseInt(e.target.getAttribute('in_stock')),
        }

        if (cart.length > 0) {
            cart.forEach(function (item, key) {
                if ((item.cart_variation_id == e.target.getAttribute('cart_variation_id')) && (item.subscription.toLowerCase() == e.target.getAttribute('subscription').toLowerCase())) {
                    if (parseInt(item.quantity) >= parseInt(e.target.getAttribute('in_stock'))) {
                        alert("Out Of Stock") // Check product quantity
                    } else {
                        item.quantity = Number(item.quantity) + Number(newItem.quantity);
                    }
                    data.push(item);
                    newItem = null;
                } else {
                    data.push(item);
                }
            });
            if (newItem != null) {
                data.push(newItem);
            }
        } else {
            data.push(newItem);
        }

        SET_STORAGE("cart", JSON.stringify(data));
        this.addToCartLabelChange();
        this.props.addToCart();
        document.querySelector("body").scrollIntoView();
    }

    addToCartLabelChange = (e) => {
        this.setState({
            alertMsg: true,
            addToCart: "Adding..."
        })

        setTimeout(function () {
            this.setState({
                addToCart: "Thank You"
            })
        }.bind(this), 1000)

        setTimeout(function () {
            this.setState({
                addToCart: "Add More ..."
            })
        }.bind(this), 2000)

        setTimeout(function () {
            this.setState({
                alertMsg: false,
            })
        }.bind(this), 5000)
    }

    isSubscription = (e) => {
        this.setState({ subscription: "yes" });
    }
    noSubscription = (e) => {
        this.setState({ subscription: "no" });
    }

    quantityIncrement = (e) => {
        this.setState({ quantity: Number(this.state.quantity) + 1 })
    }

    quantityDecrement = (e) => {
        this.setState({ quantity: Number(this.state.quantity) - 1 })
    }

    handleClose = () => {
        this.setState({ isOpen: false });
    }

    openGallery = () => {
        this.setState({ isOpen: true });
    }

    render() {

        const product = this.state.productDetails;

        return (
            <Fragment>
                {
                    (this.state.loading) ?
                        <div className="loading container full_page_loader"></div>
                        :
                        <Fragment>
                            <div className="site-wrapper">
                                <div className="container">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <main className="athletes_list_wrapper">
                                                <nav aria-label="breadcrumb">
                                                    <ol className="breadcrumb cus_breadcrumb">
                                                        <li className="breadcrumb-item"><NavLink to="/">Home</NavLink></li>
                                                        <li className="breadcrumb-item">
                                                            {
                                                                (product.is_bundle == 0) ?
                                                                    <NavLink to="/top-sellers">Top Sellers</NavLink>
                                                                    :
                                                                    <NavLink to="/bundle-product">Bundle Product</NavLink>
                                                            }
                                                        </li>
                                                        <li className="breadcrumb-item active" aria-current="page">{product.hasOwnProperty('title') ? product.title : ''}</li>
                                                    </ol>
                                                </nav>
                                                {
                                                    (!this.state.alertMsg) ? ''
                                                        :
                                                        <Fragment>
                                                            <div className="alert-wrapper">
                                                                <i className="fa fa-check-circle" aria-hidden="true"></i>
                                                                <span>{this.state.productName} has been added to your cart.</span>
                                                                <NavLink to="/cart" className="wc-forward">View cart</NavLink>
                                                            </div>
                                                        </Fragment>
                                                }
                                                <div className="row modal-body">
                                                    <div className="col-md-5">

                                                        <PhotoSwipe isOpen={this.state.isOpen} items={this.state.items} options={this.state.options} onClose={this.handleClose} />

                                                        <Carousel autoPlay onClickItem={this.openGallery}>
                                                            {
                                                                (!product.hasOwnProperty('images')) ? this.state.error :
                                                                    product.images.map(function (image, key) {
                                                                        return (
                                                                            <div key={key} className="mkn-img-container">
                                                                                <div className="mkn-img-zoom-lens"></div>
                                                                                <img src={image.main_image} largesrc={image.large_image} className="img-responsive" />
                                                                            </div>
                                                                        )
                                                                    }.bind(this))
                                                            }
                                                        </Carousel>

                                                    </div>
                                                    <div className="col-md-7">
                                                        <div className="refer_product_summery refer_product_details">
                                                            <div id="mkn-img-zoom-result" className="mkn-img-zoom-result"></div>
                                                            <h1 className="montserrat product_title">{product.hasOwnProperty('title') ? product.title : ''}</h1>
                                                            <div className="sample-vendor">Prestige Labs</div>
                                                            <div className="product-infor">
                                                                <ul>
                                                                    <li>
                                                                        <label>Availability  </label>
                                                                        <span>
                                                                            {
                                                                                (this.state.inStock > 0) ?
                                                                                    "In stock"
                                                                                    :
                                                                                    "Stockout"
                                                                            }
                                                                        </span>
                                                                    </li>
                                                                    <li>
                                                                        <label>Vendor </label>
                                                                        <span>Prestige Labs</span>
                                                                    </li>
                                                                </ul>
                                                                <div className="short-description">
                                                                    {product.hasOwnProperty('description') ? Parser(product.description) : ''}
                                                                    <div className="clearfix"></div>
                                                                </div>
                                                                <div className="variations">
                                                                    {
                                                                        (!product.hasOwnProperty('flavors')) ? '' :
                                                                            <Fragment>
                                                                                <div className="swatch_block_header"> Flavors</div>
                                                                                <div className="swatch_block">
                                                                                    {
                                                                                        product.flavors.map(function (flavor, key) {
                                                                                            return (
                                                                                                <Fragment key={Math.random()}>
                                                                                                    <div>
                                                                                                        <input type="radio" name="attribute_flavors" defaultValue={flavor.hasOwnProperty('id') ? flavor.id : ''} checked={(this.state.flavorId == flavor.id) ? "checked" : ""} readOnly />
                                                                                                        <label onClick={this.changeFlavor} flavor_id={flavor.hasOwnProperty('id') ? flavor.id : ''} htmlFor={flavor.hasOwnProperty('value') ? flavor.value : ''}>{flavor.hasOwnProperty('value') ? flavor.value : ''}</label>
                                                                                                    </div>
                                                                                                </Fragment>
                                                                                            )
                                                                                        }.bind(this))
                                                                                    }
                                                                                </div>
                                                                            </Fragment>
                                                                    }

                                                                    <div className="swatch_block_header"> Months</div>
                                                                    <div className="swatch_block">
                                                                        <div>
                                                                            <input type="radio" name="attribute_months" defaultValue={product.hasOwnProperty('first_month') ? product.first_month : ''} checked={(this.state.monthId == product.first_month) ? "checked" : ""} readOnly />
                                                                            <label onClick={this.changeMonth} month_id={product.hasOwnProperty('first_month') ? product.first_month : ''} htmlFor={product.hasOwnProperty('title') ? product.title : ''}>1 Month</label>
                                                                        </div>
                                                                        {
                                                                            (!product.hasOwnProperty('months')) ? '' :
                                                                                <Fragment>
                                                                                    {
                                                                                        product.months.map(function (month, key) {
                                                                                            return (
                                                                                                <Fragment key={Math.random()}>
                                                                                                    <div>
                                                                                                        <input type="radio" name="attribute_months" defaultValue={month.hasOwnProperty('id') ? month.id : ''} checked={(this.state.monthId == month.id) ? "checked" : ""} readOnly />
                                                                                                        <label onClick={this.changeMonth} month_id={month.hasOwnProperty('id') ? month.id : ''} htmlFor={month.hasOwnProperty('value') ? month.value : ''}>{month.hasOwnProperty('value') ? month.value : ''}</label>
                                                                                                    </div>
                                                                                                </Fragment>
                                                                                            )
                                                                                        }.bind(this))
                                                                                    }
                                                                                </Fragment>
                                                                        }
                                                                    </div>
                                                                    <div className="product-variation-price">
                                                                        {
                                                                            (this.state.regularPriceDisplay) ?
                                                                                <span className="discoutn_price">
                                                                                    <del>{CURRENCY_FORMAT(this.state.regularPrice)}</del>
                                                                                </span>
                                                                                : ""
                                                                        }
                                                                        <span className="price-amount">
                                                                            {(this.state.salePrice) ? CURRENCY_FORMAT(this.state.salePrice) : ''}
                                                                        </span>
                                                                    </div>
                                                                    <div className="variation-availability">
                                                                        <span>
                                                                            {
                                                                                (this.state.inStock > 0) ?
                                                                                    "In stock"
                                                                                    :
                                                                                    "Stockout"
                                                                            }
                                                                        </span>
                                                                    </div>

                                                                    <div className="quantity_block_wrap">
                                                                        <span>Quantity:</span>
                                                                        <div className="input-group refer_product_input_group">
                                                                            <div className="input-group-prepend">
                                                                                <button onClick={this.quantityDecrement} disabled={(this.state.quantity <= 1) ? "disabled" : ""} className="btn btn-sm" id="minus-btn"><i className="fa fa-minus"></i></button>
                                                                            </div>
                                                                            <input defaultValue={this.state.quantity} type="number" id="qty_input" className="text-center form-control form-control-sm product_quantity_content refer_product_quantity_content" readOnly />
                                                                            <div className="input-group-prepend">
                                                                                <button onClick={this.quantityIncrement} disabled={(this.state.quantity >= this.state.inStock) ? "disabled" : ""} className="btn btn-sm" id="plus-btn"><i className="fa fa-plus"></i></button>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="refer-total-price">
                                                                        <label><b>Subtotal</b>:</label>
                                                                        <span>{CURRENCY_FORMAT(this.state.salePrice * this.state.quantity)}</span>
                                                                    </div>

                                                                    <div className="subscribe_container">
                                                                        {
                                                                            (!this.state.subsDisplay || product.subscription == 'no') ? ''
                                                                                :
                                                                                <Fragment>
                                                                                    <div className="recurring-title">
                                                                                        Subscribe and Save!
                                                                            </div>
                                                                                    <div className={this.state.subscription == 'no' ? 'subscribe_save_set active' : 'subscribe_save_set'}>
                                                                                        <label onClick={this.noSubscription}>
                                                                                            <input type="radio" defaultValue="simple" defaultChecked="checked" name="purchase_type" className="" />
                                                                                            <span>Purchase just this product </span>
                                                                                        </label>
                                                                                    </div>
                                                                                    <div className={this.state.subscription == 'yes' ? 'subscribe_save_set active' : 'subscribe_save_set'}>
                                                                                        <label onClick={this.isSubscription}>
                                                                                            <input defaultValue="subscription" name="purchase_type" className="" type="radio" />
                                                                                            <span>Subscribe  &amp; Save {product.subscription_save_percentage} % ({CURRENCY_FORMAT(this.state.discountPrice * this.state.quantity)}) </span>
                                                                                        </label>
                                                                                        {
                                                                                            (this.state.subscription == 'no') ? ''
                                                                                                :
                                                                                                <span className="subscribe_save_note">Order will ship every: 1 Month(s)</span>
                                                                                        }
                                                                                    </div>
                                                                                </Fragment>
                                                                        }

                                                                        {
                                                                            (this.state.inStock <= 0) ?
                                                                                <OutOfStockButton />
                                                                                :
                                                                                <Fragment>
                                                                                    <input
                                                                                        onClick={this.addToCart}
                                                                                        cart_product_id={this.state.productId}
                                                                                        cart_product_name={this.state.productName}
                                                                                        cart_image={this.state.image}
                                                                                        cart_variation_id={this.state.variationId}
                                                                                        cart_variation_name={this.state.variationName}
                                                                                        cart_sale_price={this.state.salePrice}
                                                                                        subscription={this.state.subscription}
                                                                                        cart_subscription_msg={this.state.subscriptionMsg}
                                                                                        cart_discount_price={this.state.discountPrice}
                                                                                        quantity={this.state.quantity}
                                                                                        in_stock={this.state.inStock}
                                                                                        defaultValue={this.state.addToCart} name="addToCart" className="cart_add_product_btn" type="button" />
                                                                                </Fragment>
                                                                        }
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </main>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Fragment>
                }
            </Fragment>
        );
    }
}

const mapDispachToProps = (dispach) => {
    return {
        addToCart: () => dispach({ type: 'ADD_TO_CART', value: JSON.parse(GET_STORAGE('cart')) })
    }
}

export default connect(null, mapDispachToProps)(ProductDrtails);