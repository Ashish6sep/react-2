import React, { Fragment, PureComponent } from 'react';
import { CURRENCY_FORMAT } from '../../Constants/AppConstants';
import $ from 'jquery';
import Parser from 'html-react-parser';

import ReactDOM from 'react-dom';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';

class SingleProductModal extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            regularPriceDisplay: false,
            regularPrice: 0,
            salePrice: 0,
            monthId: '',
            flavorId: '',
        }
    }

    // componentDidUpdate(prevProps, prevState) {
    //     this.setState({ loading: false })
    // }

    componentDidUpdate(nextProps, nextState) {
        if (nextProps !== this.props) {
            this.setState({
                loading: false,
                regularPriceDisplay: false,
                regularPrice: 0,
                salePrice: 0,
                monthId: '',
                flavorId: '',
            })
        }
    }

    variation = (monthFlabourId) => {
        const variation = this.props.product.variations[monthFlabourId];
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
                regularPriceDisplay: regularPriceDisplay,
                regularPrice: regular_price,
                salePrice: sale_price,
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
        this.setState({ monthId: e.target.value })
        if (this.props.product.flavors) {
            this.variation(e.target.value + "_" + this.state.flavorId)
        } else {
            this.variation(e.target.value)
        }
    }
    changeFlavor = (e) => {
        this.setState({ flavorId: e.target.value })
        let monthFlabourId = this.state.monthId + "_" + e.target.value;
        this.variation(monthFlabourId);
    }

    render() {

        const product = this.props.product;

        return (
            <Fragment>
                <div className="modal fade" id="productQucikView" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered product_quick_view_modal" role="document">
                        <div className="modal-content">
                            <div className="modal-header cus-modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            {
                                (this.state.loading) ?
                                    <div className='loading'></div>
                                    :
                                    <Fragment>
                                        <div className="modal-body">
                                            <div className="container">
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div className="flexslider">
                                                            <Carousel autoPlay>
                                                                {
                                                                    (!product.hasOwnProperty('images')) ? this.state.error :
                                                                        product.images.map(function (image, key) {
                                                                            return (
                                                                                <Fragment key={key}>
                                                                                    <img src={image.main_image} className="img-responsive" />
                                                                                </Fragment>
                                                                            )
                                                                        }.bind(this))
                                                                }
                                                            </Carousel>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="product_quick_view_details">
                                                            <h1 className="montserrat product_title">{product.hasOwnProperty('title') ? product.title : ''}</h1>
                                                            <span className="price-amount">{product.hasOwnProperty('start_price') ? CURRENCY_FORMAT(product.start_price) : ''}</span>
                                                            <div className="short-description">
                                                                {product.hasOwnProperty('description') ? Parser(product.description) : ''}
                                                                <div className="clearfix"></div>
                                                            </div>
                                                            <div className="quick_view_product_option">
                                                                <label htmlFor="months">Months</label>
                                                                <select onChange={this.changeMonth} value={this.state.monthId} id="monthId" className="cus_field" name="monthId">
                                                                    <option value="">Choose an option</option>
                                                                    <option value={product.first_month}>1 Month</option>
                                                                    {
                                                                        (!product.hasOwnProperty('months')) ? this.state.error :
                                                                            product.months.map(function (month, key) {
                                                                                return (
                                                                                    <option key={Math.random()} value={month.id}>{month.value}</option>
                                                                                )
                                                                            }.bind(this))
                                                                    }
                                                                </select>
                                                            </div>
                                                            {
                                                                (!product.hasOwnProperty('flavors')) ? '' :
                                                                    <Fragment>
                                                                        <div className="quick_view_product_option">
                                                                            <label htmlFor="months">Flavors</label>
                                                                            <select onChange={this.changeFlavor} value={this.state.flavorId} id="flavorId" className="cus_field" name="flavorId">
                                                                                <option value="">Choose an option</option>
                                                                                {
                                                                                    product.flavors.map(function (flavor, key) {
                                                                                        return (
                                                                                            <option key={Math.random()} value={flavor.id}>{flavor.value}</option>
                                                                                        )
                                                                                    }.bind(this))
                                                                                }
                                                                            </select>
                                                                        </div>
                                                                    </Fragment>
                                                            }
                                                            <p>
                                                                {
                                                                    (this.state.regularPriceDisplay) ?
                                                                        <span className='text-danger'><strike>{CURRENCY_FORMAT(this.state.regularPrice)}</strike>&nbsp;</span>
                                                                        : ""
                                                                }
                                                                {(this.state.salePrice) ? CURRENCY_FORMAT(this.state.salePrice) : ''}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="clearfix"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </Fragment>
                            }
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default SingleProductModal;