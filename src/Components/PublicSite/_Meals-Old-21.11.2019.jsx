import React, { Fragment, PureComponent } from "react";
import Parser from "html-react-parser";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import ReactImageFallback from "react-image-fallback";
import history from "../../history";
import $ from "jquery";
import { NavLink } from "react-router-dom";
import { AJAX_PUBLIC_REQUEST, SET_STORAGE, GET_STORAGE, CURRENCY_FORMAT, SAVE_PERCENTAGE } from "../../Constants/AppConstants";
import SingleMealProductModal from "./SingleMealProductModal";
import SingleMealProductList from "./SingleMealProductList";

class Meals extends PureComponent {
    constructor(props) {
        super(props);
        let subscription = GET_STORAGE("meal_subscription") ? GET_STORAGE("meal_subscription") : "no";
        this.state = {
            loading: true,
            plan_id: parseInt(this.props.match.params.id),
            planDetails: {},
            totalItem: 0,
            perPage: 0,
            mealList: [],
            mealItemDetail: {},
            planItemLimit: 0,
            mealCount: 0,
            forceRender: false, // Use for force render state don't remove this state
            meals: {
                plan_id: parseInt(this.props.match.params.id),
                item_count: 0,
                item_add_count: 0,
                plan_name: "",
                quantity: 1,
                shipping_cost: 0,
                subscription: subscription,
                subscription_save_percentage: 0,
                items: [],
                is_continue: false
            },
            cartSideFixed: false,
        };
        document.title = "Meals - Prestige Labs";
    }

    componentDidMount() {
        this.getPlanDetails();
        this.getMealList();
        document.querySelector("body").scrollIntoView();

        // Fixed cart sidebar
        window.onscroll = function () {
            let currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
            if (currentScroll > 300 && currentScroll <= (document.body.scrollHeight - 1075)) {
                this.setState({ cartSideFixed: true })
            } else {
                this.setState({ cartSideFixed: false })
            }
        }.bind(this);
    }

    getPlanDetails = () => {
        AJAX_PUBLIC_REQUEST("POST", "meal/getPlanList", {}).then(results => {
            if (parseInt(results.response.code) === 1000) {
                let plans = results.response.data;
                let planDetails = plans.filter(plan => plan.plan_id == this.state.plan_id);
                this.setState({ planDetails: planDetails[0] });
            } else {
                this.setState({
                    error: Parser("<p className='text-danger'>" + results.response.message + "</p>"),
                });
            }
        });
    }

    getMealList = () => {
        AJAX_PUBLIC_REQUEST("POST", "meal/getList", {}).then(results => {
            if (parseInt(results.response.code) === 1000) {
                this.setState({
                    loading: false,
                    mealList: results.response.data,
                    totalItem: results.response.total_item,
                    perPage: results.response.per_page,
                });
                this.getMealDetails();
            } else {
                this.setState({
                    error: Parser("<p className='text-danger'>" + results.response.message + "</p>"),
                    loading: false,
                });
            }
        });
    };

    getMealDetails = () => {
        if (this.state.mealList.length > 0) {
            const planDetails = this.state.planDetails;
            const planItemLimit = planDetails.hasOwnProperty('plan_item_count') ? parseInt(planDetails.plan_item_count) : 0;
            const item_count = planItemLimit;
            const plan_name = planDetails.hasOwnProperty('title') ? planDetails.title : '';
            const shipping_cost = planDetails.hasOwnProperty('shipping_cost') ? parseInt(planDetails.shipping_cost) : 0;
            const subscription_save_percentage = planDetails.hasOwnProperty('subscription_save_percentage') ? parseInt(planDetails.subscription_save_percentage) : 0;
            const meals = {
                plan_id: parseInt(this.state.plan_id),
                item_count: item_count,
                item_add_count: 0,
                plan_name: plan_name,
                quantity: 1,
                shipping_cost: shipping_cost,
                subscription: this.state.meals.subscription,
                subscription_save_percentage: subscription_save_percentage,
                items: [],
                is_continue: false,
            };
            // check old value
            if (this.props.meals.length > 0 && this.props.meals[0]) {
                let old_meals = JSON.parse(GET_STORAGE('meals'));
                old_meals.subscription = this.state.meals.subscription;
                if (old_meals.plan_id == this.state.plan_id) {
                    SET_STORAGE("meals", JSON.stringify(old_meals));
                    this.setState({
                        planDetails: planDetails,
                        meals: old_meals,
                        planItemLimit: planItemLimit,
                        mealCount: old_meals.item_add_count,
                    });
                } else {
                    SET_STORAGE("meals", JSON.stringify(meals));
                    this.setState({
                        planDetails: planDetails,
                        meals: meals,
                        planItemLimit: planItemLimit,
                    });
                }
            } else {
                SET_STORAGE("meals", JSON.stringify(meals));
                this.setState({
                    planDetails: planDetails,
                    meals: meals,
                    planItemLimit: planItemLimit,
                });
            }
        } else {
            history.push("/meals");
        }
    }

    addMealToCart = () => {
        let meals = this.state.meals;
        meals.is_continue = true;
        this.setState({ meals });
        SET_STORAGE("meals", JSON.stringify(meals));
        this.props.addMealToCart();
        history.push("/cart");
    };

    mealCount = () => {
        let count = 0;
        this.state.meals.items.forEach(function (item, key) {
            count = Number(count) + Number(item.meal_quantity);
        });
        return count;
    };

    addItem = (item, quantity, variation) => {
        let data = [];
        let meal_price = 0;
        if (this.state.meals.subscription == 'yes') {
            meal_price = (variation.sale_price > 0) ? SAVE_PERCENTAGE(variation.sale_price, this.state.meals.subscription_save_percentage) : SAVE_PERCENTAGE(variation.regular_price, this.state.meals.subscription_save_percentage);
        } else {
            meal_price = (variation.sale_price > 0) ? variation.sale_price : variation.regular_price;
        }
        let newItem = {
            meal_id: item.meal_id,
            meal_variation_id: parseInt(variation.variation_id),
            meal_name: item.title,
            meal_quantity: quantity,
            meal_size: variation.variation_name,
            meal_price: meal_price,
            meal_thumb_image: item.thumb_image,
            variation: variation,
        };

        if (this.state.meals.items.length > 0) {
            let exMealItems = this.state.meals.items;
            if (exMealItems.length > 0) {
                exMealItems.forEach(function (exItem, key) {
                    if (exItem.meal_id == item.meal_id) {
                        exItem.meal_variation_id = parseInt(variation.variation_id);
                        exItem.meal_quantity = quantity;
                        exItem.meal_size = variation.variation_name;
                        exItem.meal_price = meal_price;
                        exItem.variation = variation;
                        data.push(exItem);
                        newItem = null;
                    } else {
                        data.push(exItem);
                    }
                }.bind(this));
                if (newItem != null) {
                    data.push(newItem);
                }
            } else {
                data.push(newItem);
            }

            let meals = this.state.meals;
            meals.items = data;

            let mealCount = this.mealCount();
            meals.item_add_count = mealCount;

            this.setState({
                meals: meals,
                mealCount: mealCount,
                forceRender: !this.state.forceRender, // Use for force render state don't remove this state
            });

        } else {
            data.push(newItem);
            let meals = this.state.meals;
            meals.items = data;

            let mealCount = this.mealCount();
            meals.item_add_count = mealCount;

            this.setState({
                meals: meals,
                mealCount: mealCount,
                forceRender: !this.state.forceRender, // Use for force render state don't remove this state
            });
        }
    };

    deleteItem = (item) => {
        if (this.state.meals.items.length > 0) {
            let meals = this.state.meals;
            meals.items = meals.items.filter(el => el.meal_id !== item.meal_id);
            meals.item_add_count = this.mealCount();
            let mealCount = this.mealCount();
            this.setState({
                meals: meals,
                mealCount: mealCount
            });
        }
    };

    quickView = (meal_id) => {
        this.setState({ mealItemDetails: {} });
        if (this.state.mealList.length > 0) {
            this.state.mealList.map(function (mealCategory, index) {
                if (mealCategory.meal_items.length > 0) {
                    mealCategory.meal_items.map(function (item, key) {
                        if (item.meal_id == meal_id) {
                            this.setState({ mealItemDetails: item })
                        }
                    }.bind(this))
                }
            }.bind(this));
        }
    };

    render() {
        let mealSubtotal = 0;
        let mealShipping = this.state.meals.shipping_cost;
        return (
            <Fragment>
                {
                    (this.state.loading) ?
                        <div className="loading container full_page_loader" />
                        :
                        <Fragment>
                            <div className="site-wrapper">
                                <div className="container">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <main className="athletes_list_wrapper">
                                                <nav aria-label="breadcrumb">
                                                    <ol className="breadcrumb cus_breadcrumb">
                                                        <li className="breadcrumb-item">
                                                            <NavLink to="/">Home</NavLink>
                                                        </li>
                                                        <li className="breadcrumb-item">
                                                            <NavLink to="/meals">Plans</NavLink>
                                                        </li>
                                                        <li className="breadcrumb-item active" aria-current="page">
                                                            Meals
                                                        </li>
                                                    </ol>
                                                </nav>
                                                <section className="package_select_list">
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <div className="view-controls-wrapper">
                                                                <p className="pull-left"> Showing {this.state.perPage} of {this.state.totalItem} results </p>
                                                                <form className="pull-right orderby_meal_search" method="get" >
                                                                    <select name="filter_by" className="roboto_condensed orderby" >
                                                                        <option value="popular"> Sort by popularity </option>
                                                                        <option value="latest">Sort by latest</option>
                                                                    </select>
                                                                </form>
                                                                <div className="clearfix" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <div className={(this.state.cartSideFixed) ? "selected_meal selected_meal-custom selected_meal_fixed" : "selected_meal selected_meal-custom"}>
                                                                <h2 className="montserrat selected_meal_title">
                                                                    {this.state.meals.item_add_count} <span> of </span> {this.state.meals.item_count} Selected.
                                                                </h2>
                                                                <ul className={(this.state.meals.items.length >= 4) ? 'selected-meal-qnt' : ''}>
                                                                    {
                                                                        (this.state.meals.items.length <= 0) ? "" :
                                                                            this.state.meals.items.map(function (meal_items_single, key) {
                                                                                mealSubtotal = Number(mealSubtotal) + Number(meal_items_single.meal_quantity * meal_items_single.meal_price);
                                                                                return (
                                                                                    <li key={meal_items_single.meal_id} >
                                                                                        <div className="selected_meal_img">
                                                                                            <div className="selected_meal_img-box">
                                                                                                <ReactImageFallback
                                                                                                    src={meal_items_single.meal_thumb_image}
                                                                                                    fallbackImage={require("../../Assets/images/preloader.gif")}
                                                                                                    initialImage={require("../../Assets/images/preloader.gif")}
                                                                                                    alt={meal_items_single.meal_name}
                                                                                                    title={meal_items_single.meal_name}
                                                                                                    className=""
                                                                                                />
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="selected_meal_short_info">
                                                                                            <h3 className="montserrat">
                                                                                                {meal_items_single.meal_name}
                                                                                            </h3>
                                                                                            <div className="clearfix"></div>
                                                                                            <span>{meal_items_single.meal_size}</span>
                                                                                        </div>
                                                                                        <div className="selected_meal_input-custom">
                                                                                            <ul>
                                                                                                <li>
                                                                                                    <button onClick={() => this.addItem(meal_items_single, Number(meal_items_single.meal_quantity) - 1, meal_items_single.variation)} disabled={(meal_items_single.meal_quantity <= 1) ? true : false} type="button" className="btn">
                                                                                                        <i className="fa fa-minus" aria-hidden="true"></i>
                                                                                                    </button>
                                                                                                </li>
                                                                                                <li>
                                                                                                    <input type="text" value={meal_items_single.meal_quantity} className="form-control-add" readOnly />
                                                                                                </li>
                                                                                                <li>
                                                                                                    <button onClick={() => this.addItem(meal_items_single, Number(meal_items_single.meal_quantity) + 1, meal_items_single.variation)} disabled={(this.state.meals.item_add_count >= this.state.meals.item_count) ? true : false} type="button" className="btn">
                                                                                                        <i className="fa fa-plus" aria-hidden="true"></i>
                                                                                                    </button>
                                                                                                </li>
                                                                                            </ul>
                                                                                            <div className="clearfix"></div>
                                                                                            <span>{CURRENCY_FORMAT(meal_items_single.meal_quantity * meal_items_single.meal_price)}</span>
                                                                                        </div>
                                                                                        <span onClick={() => this.deleteItem(meal_items_single)} className="selected_meal_remove" >
                                                                                            <img src={require("../../Assets/images/icon/close.png")} alt="Remove" title="Remove" />
                                                                                        </span>
                                                                                    </li>
                                                                                );
                                                                            }.bind(this))
                                                                    }
                                                                </ul>
                                                                <div className="montserrat add_1_meal_to_continue">
                                                                    {
                                                                        (this.state.meals.item_add_count < this.state.meals.item_count) ?
                                                                            <span>
                                                                                Please add {this.state.meals.item_count - this.state.meals.item_add_count} meal to continue.
                                                                                </span>
                                                                            : ""
                                                                    }
                                                                </div>
                                                                {
                                                                    (this.state.meals.items.length <= 0) ? "" :
                                                                        <Fragment>
                                                                            <div className="montserrat selectedMealPricewrapper selectedMealPricewrapper-custom">
                                                                                <div className="selectedMealPrice">
                                                                                    <div className="pull-left selectedMealPriceLabel">Meals Subtotal</div>
                                                                                    <div className="pull-right selectedMealPriceBold">{CURRENCY_FORMAT(mealSubtotal)}</div>
                                                                                </div>

                                                                                <div className="selectedMealPrice">
                                                                                    <div className="pull-left selectedMealPriceLabel">
                                                                                        <span>Shipping</span>
                                                                                    </div>
                                                                                    <div className="pull-right selectedMealPriceBold">
                                                                                        {
                                                                                            (mealShipping > 0) ?
                                                                                                CURRENCY_FORMAT(mealShipping)
                                                                                                : <small>Free Shipping</small>
                                                                                        }
                                                                                    </div>
                                                                                </div>
                                                                                <div className="selectedMealPrice">
                                                                                    <div className="pull-left selectedMealPriceLabel">Meals Total</div>
                                                                                    <div className="pull-right selectedMealPriceBold"> <strong>{CURRENCY_FORMAT(mealSubtotal + mealShipping)}</strong> </div>
                                                                                </div>
                                                                            </div>
                                                                        </Fragment>
                                                                }
                                                                <div className="montserrat add_1_meal_to_continue_btn">
                                                                    {
                                                                        (this.state.meals.item_add_count < this.state.meals.item_count) ?
                                                                            <a href="javascript:void(0)" className="montserrat meal-disble" > CONTINUE </a>
                                                                            :
                                                                            <a onClick={e => this.addMealToCart(e)} href="javascript:void(0)" className="montserrat meal-continue"> CONTINUE </a>
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className="selected_meal_container">
                                                                <div className="selected_meal_container-inner">
                                                                    {
                                                                        (this.state.mealList.length <= 0) ? this.state.error :
                                                                            this.state.mealList.map(function (meal_term, index) {
                                                                                return (
                                                                                    <Fragment key={`mi` + meal_term.term_id}>
                                                                                        <h6 className="meal-category-type-header"> {meal_term.term_name} </h6>
                                                                                        <ul>
                                                                                            {
                                                                                                (meal_term.meal_items.length <= 0) ? "" :
                                                                                                    meal_term.meal_items.map(function (item, index) {
                                                                                                        // Added item quickviewer
                                                                                                        item.quickView = this.quickView;
                                                                                                        return (
                                                                                                            <SingleMealProductList
                                                                                                                key={item.meal_id}
                                                                                                                item={item}
                                                                                                                plan={this.state.planDetails}
                                                                                                                planItemLimit={this.state.planItemLimit}
                                                                                                                mealCount={this.state.mealCount}
                                                                                                                meals={this.state.meals}
                                                                                                                addItem={this.addItem}
                                                                                                            />
                                                                                                        )
                                                                                                    }.bind(this))
                                                                                            }
                                                                                        </ul>
                                                                                    </Fragment>
                                                                                );
                                                                            }.bind(this))
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className="clearfix" />
                                                        </div>
                                                    </div>
                                                </section>
                                            </main>
                                        </div>
                                    </div>
                                    {
                                        (this.state.mealItemDetails) ?
                                            <SingleMealProductModal
                                                mealItemDetails={this.state.mealItemDetails}
                                                subscription={this.state.meals.subscription}
                                                subscription_save_percentage={this.state.meals.subscription_save_percentage}
                                            />
                                            : ""
                                    }
                                </div>
                            </div>
                        </Fragment>
                }
            </Fragment>
        );
    }
}

Meals.propTypes = {
    meals: PropTypes.array.isRequired
};

function mapStateToProps(state) {
    return {
        meals: state.meals
    };
}

const mapDispachToProps = dispach => {
    return {
        addMealToCart: () => dispach({ type: "ADD_MEAL_TO_CART", value: JSON.parse(GET_STORAGE("meals")) })
    };
};

export default connect(mapStateToProps, mapDispachToProps)(Meals);