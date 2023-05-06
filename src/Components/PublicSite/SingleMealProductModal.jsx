import React, { Fragment, PureComponent } from "react";
import ReactImageFallback from "react-image-fallback";
import Parser from "html-react-parser";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import { CURRENCY_FORMAT, SAVE_PERCENTAGE, GET_STORAGE } from "../../Constants/AppConstants";

class SingleMealProductModal extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            mounted:true
        };
    }

    componentDidUpdate(nextProps, nextState) {
        if (nextProps !== this.props) {
            this.setState({
                loading: false,
                mounted:!this.state.mounted
            });
        }
    }

    render() {
        const mealItemDetails = this.props.mealItemDetails;
        return (
            <Fragment>
                <div
                    className="modal fade mob_modal"
                    id="mealProductQucikView"
                    tabIndex="-1"
                    role="dialog"
                    aria-labelledby="exampleModalLongTitle"
                    aria-hidden="true"
                >
                    <div className="modal-dialog modal-dialog-centered product-view-modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal_close">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="modal_product_view modal_meal_product_view">
                                    <div className="modal_product_view_img">
                                        <div className="flexslider">
                                            {
                                                mealItemDetails && mealItemDetails.hasOwnProperty('images') && mealItemDetails.images.length>0?
                                                <Fragment>
                                                    <Carousel autoPlay>
                                                        {
                                                            (!mealItemDetails.hasOwnProperty('images')) ? <ReactImageFallback
                                                            src={mealItemDetails.hasOwnProperty("main_image") ? mealItemDetails.main_image : ""}
                                                            fallbackImage={require("../../Assets/images/preloader.gif")}
                                                            initialImage={require("../../Assets/images/preloader.gif")}
                                                            alt={mealItemDetails.hasOwnProperty("title") ? mealItemDetails.title : ""}
                                                            className="img-fluid"
                                                        /> :
                                                        mealItemDetails.images.map(function (image, key) {
                                                                return (
                                                                    <Fragment key={'modal'+key}>
                                                                        <img src={image.main_image} className="img-fluid" />
                                                                    </Fragment>
                                                                )
                                                            }.bind(this))
                                                        }
                                                    </Carousel>
                                                </Fragment>
                                                :
                                                <ReactImageFallback
                                                    src={mealItemDetails.hasOwnProperty("main_image") ? mealItemDetails.main_image : ""}
                                                    fallbackImage={require("../../Assets/images/preloader.gif")}
                                                    initialImage={require("../../Assets/images/preloader.gif")}
                                                    alt={mealItemDetails.hasOwnProperty("title") ? mealItemDetails.title : ""}
                                                    className="img-fluid"
                                                />
                                            }
                                        </div>
                                    </div>
                                    <div className="modal_product_view_desc">
                                        <h3>{mealItemDetails.hasOwnProperty("title") ? mealItemDetails.title : ""}<br />
                                            {
                                                mealItemDetails.hasOwnProperty("allergen") ?
                                                    <span className="meal-allergen">Allergen: <span>{Parser(mealItemDetails.allergen)}</span></span>
                                                    : ""
                                            }
                                        </h3>
                                        <div className="nutritional-facts">
                                            <ul className="nutritional-facts__summary">
                                                {
                                                    (mealItemDetails.hasOwnProperty("variations") && mealItemDetails.variations.length > 0) ?
                                                        mealItemDetails.variations.map(function (variation, key) {

                                                            let meal_price = parseFloat((variation.sale_price > 0) ? variation.sale_price : variation.regular_price);
                                                            if (this.props.subscription == 'yes') {
                                                                meal_price = parseFloat(variation.subscription_price);
                                                            }

                                                            return (
                                                                <Fragment key={variation.variation_id}>
                                                                    <li>
                                                                        <label>{variation.variation_name}</label>
                                                                        <span className="pull-right">
                                                                            {
                                                                                CURRENCY_FORMAT(meal_price)
                                                                                // (this.props.subscription == 'yes') ?
                                                                                //     CURRENCY_FORMAT(SAVE_PERCENTAGE(meal_price, mealItemDetails.subscription_save_percentage))
                                                                                //     :
                                                                                //     CURRENCY_FORMAT(meal_price)
                                                                            }
                                                                        </span>
                                                                        <ul className="modal-variation-list">
                                                                            {
                                                                                (variation.hasOwnProperty("options") && variation.options.length > 0) ?
                                                                                    variation.options.map(function (option, key) {
                                                                                        return (
                                                                                            <Fragment key={option.option_id}>
                                                                                                <li className="montserrat">
                                                                                                    <label>{option.option_name}</label>
                                                                                                    <span className="pull-right">
                                                                                                        {option.option_value}
                                                                                                    </span>
                                                                                                </li>
                                                                                            </Fragment>
                                                                                        );
                                                                                    }.bind(this))
                                                                                    : ""}
                                                                        </ul>
                                                                    </li>
                                                                </Fragment>
                                                            );
                                                        }.bind(this))
                                                        : ""}
                                            </ul>
                                        </div>
                                        <div className="meal_details_view_desc">
                                            {mealItemDetails.description ? Parser(mealItemDetails.description) : ''}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default SingleMealProductModal;