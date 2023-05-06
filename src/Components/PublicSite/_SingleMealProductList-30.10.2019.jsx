import React, { Fragment, PureComponent, Component } from "react";
import Parser from "html-react-parser";
import ReactImageFallback from "react-image-fallback";

class SingleMealProductList extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            value: 0,
            selectQuantity: 0,
            meals: this.props.meals,
            item: this.props.item,
            plan: this.props.plan,
            planItemLimit: this.props.planItemLimit,
            mealCount: this.props.mealCount
        };
    }

    addItem = (quantity, item) => {
        this.props.addItem(quantity, item);
    };

    render() {
        const item = this.props.item;
        let options = [];
        let meal_item_current_qty = 0;
        if (this.props.meals.items.length > 0) {
            this.props.meals.items.forEach(function (item_single, key) {
                if (item_single.meal_id === item.meal_id) {
                    meal_item_current_qty = item_single.meal_quantity;
                }
            });
        }
        for (let i = 1; i <= this.state.planItemLimit; i++) {
            if (meal_item_current_qty > 0) {
                if (i <= meal_item_current_qty) {
                    options.push(
                        <span
                            key={`p${this.props.plan.product_id}m${item.meal_id}i${i}`}
                            id={`p${this.props.plan.product_id}m${item.meal_id}i${i}`}
                            onClick={e => this.addItem(i, item)}
                            className="active"
                        />
                    );
                } else {
                    const remaining_diff = this.props.planItemLimit - this.props.mealCount;
                    if (i <= remaining_diff + meal_item_current_qty) {
                        options.push(
                            <span
                                key={`p${this.props.plan.product_id}m${item.meal_id}i${i}`}
                                id={`p${this.props.plan.product_id}m${item.meal_id}i${i}`}
                                onClick={e => this.addItem(i, item)}
                                className=""
                            />
                        );
                    } else {
                        options.push(
                            <span
                                key={`p${this.props.plan.product_id}m${item.meal_id}i${i}`}
                                id={`p${this.props.plan.product_id}m${item.meal_id}i${i}`}
                                className="meal-item-disble"
                            />
                        );
                    }
                }
            } else {
                if (i <= this.props.planItemLimit - this.props.mealCount) {
                    options.push(
                        <span
                            key={`p${this.props.plan.product_id}m${item.meal_id}i${i}`}
                            id={`p${this.props.plan.product_id}m${item.meal_id}i${i}`}
                            onClick={e => this.addItem(i, item)}
                            className=""
                        />
                    );
                } else {
                    options.push(
                        <span
                            key={`p${this.props.plan.product_id}m${item.meal_id}i${i}`}
                            id={`p${this.props.plan.product_id}m${item.meal_id}i${i}`}
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
                            {/* <span>{item.hasOwnProperty("short_desc") ? Parser(item.short_desc) : ""}</span> */}
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
