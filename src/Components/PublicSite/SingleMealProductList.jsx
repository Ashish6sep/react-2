import React, { Fragment, PureComponent, Component } from "react";
import Parser from "html-react-parser";
import { connect } from "react-redux";
import ReactImageFallback from "react-image-fallback";
import { CURRENCY_FORMAT, SAVE_PERCENTAGE, TITLE } from "../../Constants/AppConstants";
import { copyFile } from "fs";

class SingleMealProductList extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            mealVariationId: null,
            mealVariation: null,
            currentQuantity: 0,
        };
    }

    componentDidMount() {

    }

    addItem = (quantity) => {
        let item = this.props.item;
        let mealVariationId = this.state.mealVariationId;
        let mealVariation = this.state.mealVariation;

        if (mealVariationId != null && mealVariation != null) {
            this.props.addItem(item, quantity, mealVariation);
            this.setState({
                currentQuantity: quantity,
                mealVariationId: null,
                mealVariation: null,
            })
            if (mealVariationId) {
                setTimeout(function () {
                    document.getElementById(`v${mealVariationId}`).checked = false;
                }.bind(this), 1000);
            }
        }
    };

    changeVariation = (quantity, newMealVariation) => {
        this.setState({
            currentQuantity: 0,
            mealVariationId: newMealVariation.variation_id,
            mealVariation: newMealVariation,
        })

        if (quantity != null && quantity != 0) {
            let mealVariation = newMealVariation
            let item = this.props.item;
            this.props.addItem(item, quantity, mealVariation);
        }
    }

    render() {
        const item = this.props.item;
        let options = [];
        let meal_item_current_qty = this.state.currentQuantity;
        for (let i = 1; i <= this.props.planItemLimit; i++) {
            if (meal_item_current_qty > 0) {
                if (i <= meal_item_current_qty) {
                    options.push(
                        <span
                            key={`p${this.props.plan.meal_id}m${item.meal_id}i${i}`}
                            id={`p${this.props.plan.meal_id}m${item.meal_id}i${i}`}
                            onClick={e => this.addItem(i)}
                            className="animation-class"
                        >
                            <span className="animationAdded active bounceOut animated">{i}</span>
                        </span>
                    );
                } else {
                    const remaining_diff = this.props.planItemLimit - this.props.mealCount;
                    if (i <= remaining_diff + meal_item_current_qty) {
                        options.push(
                            <span
                                key={`p${this.props.plan.meal_id}m${item.meal_id}i${i}`}
                                id={`p${this.props.plan.meal_id}m${item.meal_id}i${i}`}
                                onClick={e => this.addItem(i)}
                                className="animation-class"
                            />
                        );
                    } else {
                        options.push(
                            <span
                                key={`p${this.props.plan.meal_id}m${item.meal_id}i${i}`}
                                id={`p${this.props.plan.meal_id}m${item.meal_id}i${i}`}
                                className="animation-class meal-item-disble"
                            />
                        );
                    }
                }
            } else {
                if (i <= this.props.planItemLimit - this.props.mealCount) {
                    options.push(
                        <span
                            key={`p${this.props.plan.meal_id}m${item.meal_id}i${i}`}
                            id={`p${this.props.plan.meal_id}m${item.meal_id}i${i}`}
                            onClick={e => this.addItem(i)}
                            className="animation-class"
                        />
                    );
                } else {
                    options.push(
                        <span
                            key={`p${this.props.plan.meal_id}m${item.meal_id}i${i}`}
                            id={`p${this.props.plan.meal_id}m${item.meal_id}i${i}`}
                            className="animation-class meal-item-disble"
                        />
                    );
                }
            }
        }

        return (
            <Fragment>
                <li>
                    <div
                        className="selected_meal_thumb_img"
                        data-toggle="modal"
                        data-target="#mealProductQucikView"
                        onClick={() => item.quickView(item)}
                    >
                        <ReactImageFallback
                            src={item.hasOwnProperty("list_image") ? item.list_image : ""}
                            fallbackImage={require("../../Assets/images/preloader.gif")}
                            initialImage={require("../../Assets/images/preloader.gif")}
                            alt={item.hasOwnProperty("title") ? item.title : ""}
                            className="img-fluid"
                        />
                    </div>
                    <div className="selected_meal_container_short_details">
                        <div
                            className="montserrat selected_meal_thumb_title"

                        >
                            <strong data-toggle="modal"
                                data-target="#mealProductQucikView"
                                title={item.title}
                                onClick={() => item.quickView(item)}
                            >{item.hasOwnProperty("title") ? TITLE(item.title) : ""}</strong>
                            {
                                item.hasOwnProperty("allergen") ?
                                    <span className="meal-allergen">Allergen: <span>{Parser(item.allergen)}</span></span>
                                    : ""
                            }
                        </div>
                        <div className="selected_meal-radio-block selected_meal-radio-block-2">
                            {
                                (item.variations.length <= 0) ? "" :
                                    item.variations.map(function (variation, index) {

                                        let meal_price = parseFloat((variation.sale_price > 0) ? variation.sale_price : variation.regular_price);
                                        if (this.props.subscription == 'yes') {
                                            meal_price = parseFloat(variation.subscription_price);
                                        }

                                        return (
                                            <Fragment key={variation.variation_id}>
                                                <div className="variation-new-system">
                                                    <label className="selected_meal-radio">
                                                        <small>
                                                            <span>{variation.variation_name} &nbsp;</span>
                                                            {
                                                                (variation.price_difference) ?
                                                                    `${variation.price_difference}`
                                                                    : ""
                                                            }
                                                            {/* ({
                                                                CURRENCY_FORMAT(meal_price)
                                                                // (this.props.subscription == 'yes') ?
                                                                //     CURRENCY_FORMAT(SAVE_PERCENTAGE(meal_price, item.subscription_save_percentage))
                                                                //     :
                                                                //     CURRENCY_FORMAT(meal_price)
                                                            }) */}
                                                        </small>
                                                        <input onClick={() => this.changeVariation(0, variation)} value={variation.variation_id} type="radio" name={`variation${item.meal_id}`} id={`v${variation.variation_id}`} className="variation-id" />
                                                        <span className="checkmark"></span>
                                                    </label>
                                                    <Fragment>
                                                        {
                                                            (variation.options.length <= 0) ? "" :
                                                                <Fragment>
                                                                    <div className="selected_meal-protein">
                                                                        <ul>
                                                                            {
                                                                                variation.options.map(function (option, index) {
                                                                                    return (
                                                                                        <Fragment key={option.option_id}>
                                                                                            <li>
                                                                                                <strong>{option.option_name}</strong>
                                                                                                <span>{option.option_value}</span>
                                                                                            </li>
                                                                                        </Fragment>
                                                                                    )
                                                                                }.bind(this))
                                                                            }
                                                                        </ul>
                                                                    </div>
                                                                </Fragment>
                                                        }
                                                    </Fragment>
                                                </div>
                                            </Fragment>
                                        )
                                    }.bind(this))
                            }
                        </div>
                        <div className="selected_meal_thumb_title_qnt meal_list_qnt meal_list_qnt-2" id={`m${item.meal_id}`}>
                            {options}
                        </div>
                    </div>
                </li>
            </Fragment>
        );
    }
}

export default SingleMealProductList;