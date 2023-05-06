import React, { Fragment, PureComponent, Component } from "react";
import Parser from "html-react-parser";
import { connect } from "react-redux";
import ReactImageFallback from "react-image-fallback";
import { CURRENCY_FORMAT, SAVE_PERCENTAGE } from "../../Constants/AppConstants";
import { copyFile } from "fs";

class SingleMealProductList extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            mealVariationId: null,
            mealVariation: null,
            subscription_save_percentage: this.props.plan.subscription_save_percentage
        };
    }

    componentDidMount() {

    }

    addItem = (quantity) => {
        let item = this.props.item;
        let mealVariation = this.state.mealVariation;
        if (this.state.mealVariationId == null && this.state.mealVariation == null) {
            mealVariation = this.props.item.variations[0];
            this.setState({
                mealVariationId: this.props.item.variations[0].variation_id,
                mealVariation: this.props.item.variations[0],
            })
        }
        this.props.addItem(item, quantity, mealVariation);
    };

    changeVariation = (quantity, newMealVariation) => {
        this.setState({
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
        let meal_item_current_qty = 0;
        if (this.props.meals.items.length > 0) {
            this.props.meals.items.forEach(function (item_single, key) {
                if (item_single.meal_id === item.meal_id) {
                    meal_item_current_qty = item_single.meal_quantity;
                    // select existing size
                    this.setState({
                        mealVariationId: item_single.meal_variation_id,
                        mealVariation: item_single.variation,
                    })
                    document.getElementById(`v${item_single.meal_variation_id}`).checked = true;
                }
            }.bind(this));
        }
        for (let i = 1; i <= this.props.planItemLimit; i++) {
            if (meal_item_current_qty > 0) {
                if (i <= meal_item_current_qty) {
                    options.push(
                        <span
                            key={`p${this.props.plan.meal_id}m${item.meal_id}i${i}`}
                            id={`p${this.props.plan.meal_id}m${item.meal_id}i${i}`}
                            onClick={e => this.addItem(i)}
                            className="active"
                        />
                    );
                } else {
                    const remaining_diff = this.props.planItemLimit - this.props.mealCount;
                    if (i <= remaining_diff + meal_item_current_qty) {
                        options.push(
                            <span
                                key={`p${this.props.plan.meal_id}m${item.meal_id}i${i}`}
                                id={`p${this.props.plan.meal_id}m${item.meal_id}i${i}`}
                                onClick={e => this.addItem(i)}
                                className=""
                            />
                        );
                    } else {
                        options.push(
                            <span
                                key={`p${this.props.plan.meal_id}m${item.meal_id}i${i}`}
                                id={`p${this.props.plan.meal_id}m${item.meal_id}i${i}`}
                                className="meal-item-disble"
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
                            className=""
                        />
                    );
                } else {
                    options.push(
                        <span
                            key={`p${this.props.plan.meal_id}m${item.meal_id}i${i}`}
                            id={`p${this.props.plan.meal_id}m${item.meal_id}i${i}`}
                            className="meal-item-disble"
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
                        onClick={() => item.quickView(item.meal_id)}
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
                            data-toggle="modal"
                            data-target="#mealProductQucikView"
                            onClick={() => item.quickView(item.meal_id)}
                        >
                            {item.hasOwnProperty("title") ? Parser(item.title) : ""}
                            <span>{item.hasOwnProperty("short_description") ? Parser(item.short_description) : ""}</span>
                        </div>
                        {
                            (item.options.length <= 0) ? "" :
                                <Fragment>
                                    <div className="selected_meal-protein">
                                        <ul>
                                            {
                                                (item.options.length <= 0) ? "" :
                                                    item.options.map(function (option, index) {
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

                        <div className="selected_meal-radio-block">
                            {
                                (item.variations.length <= 0) ? "" :
                                    item.variations.map(function (variation, index) {
                                        let meal_price = (variation.sale_price > 0) ? variation.sale_price : variation.regular_price;
                                        return (
                                            <Fragment key={variation.variation_id}>
                                                <label className="selected_meal-radio">
                                                    <small>
                                                        {variation.variation_name} <br />
                                                        ({
                                                            (this.props.meals.subscription == 'yes') ?
                                                                CURRENCY_FORMAT(SAVE_PERCENTAGE(meal_price, this.state.subscription_save_percentage))
                                                                :
                                                                CURRENCY_FORMAT(meal_price)
                                                        })
                                                    </small>
                                                    <input onClick={() => this.changeVariation(meal_item_current_qty, variation)} value={variation.variation_id} type="radio" name={`variation${item.meal_id}`} id={`v${variation.variation_id}`} />
                                                    <span className="checkmark"></span>
                                                </label>
                                            </Fragment>
                                        )
                                    }.bind(this))
                            }
                        </div>
                        <div className="selected_meal_thumb_title_qnt meal_list_qnt" id={`m${item.meal_id}`}>
                            {options}
                        </div>
                    </div>
                </li>
            </Fragment>
        );
    }
}

export default SingleMealProductList;
