import React, { Fragment, PureComponent } from "react";
import Parser from "html-react-parser";
import { connect } from "react-redux";
import PropTypes, { func } from "prop-types";
import ReactImageFallback from "react-image-fallback";
import history from "../../history";
import $ from "jquery";
import { NavLink } from "react-router-dom";
import { AJAX_PUBLIC_REQUEST, AJAX_REQUEST, SET_STORAGE, GET_STORAGE, CURRENCY_FORMAT, SAVE_PERCENTAGE, CUSTOMER_URL, DESTROY_CART, REMOVE_STORAGE } from "../../Constants/AppConstants";
import SingleMealProductModal from "./SingleMealProductModal";
import SingleMealProductList from "./SingleMealProductList";
import { forOfStatement } from "@babel/types";
// import ShippingSchedule from "./ShippingSchedule";

class Meals extends PureComponent {
    constructor(props) {
        super(props);
        let subscription = GET_STORAGE("meal_subscription") ? GET_STORAGE("meal_subscription") : "yes";
        let duration_id = GET_STORAGE("duration_id") ? GET_STORAGE("duration_id") : "";
        let duration_text = GET_STORAGE("duration_text") ? GET_STORAGE("duration_text") : "";
        // Check Tax
        let settings = '';
        if (GET_STORAGE('settings')) {
            settings = JSON.parse(GET_STORAGE('settings'));
        }
        this.state = {
            loading: true,
            please_wait: false,
            taxStatus: settings ? settings.tax_status : 0,
            plan_id: parseInt(this.props.match.params.id),
            planDetails: {},
            totalItem: 0,
            perPage: 0,
            mealList: [],
            mealItemDetails: {},
            planItemLimit: 0,
            mealCount: 0,
            forceRender: false, // Use for force render state don't remove this state
            subscription: subscription,
            meals: {
                plan_id: parseInt(this.props.match.params.id),
                item_count: 0,
                item_add_count: 0,
                plan_name: "",
                quantity: 1,
                shipping_cost: 0,
                subscription: subscription,
                duration_id: duration_id,
                duration_text: duration_text,
                items: [],
                is_continue: false
            },
            cartSideFixed: false,
            cartBottomFixed: false,
            item_search: '',
            subscription_id: null,
            mobileCartShow: false,
            settings: settings,

            subscription_meal_tax_amount: 0,
            subscription_meal_tax_info: '',
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
            if (currentScroll > (document.body.scrollHeight - 1075)) {
                this.setState({ cartBottomFixed: true })
            } else {
                this.setState({ cartBottomFixed: false })
            }
        }.bind(this);

        // Update meals subscription id
        const url = new URL(window.location.href);
        let subscription_id = url.searchParams.get("subscription_id");
        if (subscription_id != null) {
            this.setState({
                subscription_id,
                existingMeals: JSON.parse(GET_STORAGE('existingMeals'))
            })
        }
    }

    getPlanDetails = () => {
        AJAX_PUBLIC_REQUEST("POST", "meal/getPlanList", { code: GET_STORAGE('meal_menu_access_code'), plan_id: parseInt(this.props.match.params.id) }).then(results => {
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
        AJAX_PUBLIC_REQUEST("POST", "meal/getList", { code: GET_STORAGE('meal_menu_access_code'), plan_id: parseInt(this.props.match.params.id) }).then(results => {
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
    }

    getMealDetails = () => {

        if (this.state.mealList.length > 0) {
            const planDetails = this.state.planDetails;
            const planItemLimit = planDetails.hasOwnProperty('plan_item_count') ? parseInt(planDetails.plan_item_count) : 0;
            const item_count = planItemLimit;
            const plan_name = planDetails.hasOwnProperty('title') ? planDetails.title : '';
            const shipping_cost = planDetails.hasOwnProperty('shipping_cost') ? parseInt(planDetails.shipping_cost) : 0;
            const meals = {
                plan_id: parseInt(this.state.plan_id),
                item_count: item_count,
                item_add_count: 0,
                plan_name: plan_name,
                quantity: 1,
                shipping_cost: shipping_cost,
                subscription: this.state.meals.subscription,
                duration_id: this.state.meals.duration_id,
                duration_text: this.state.meals.duration_text,
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
        // Update meals subscription
        this.setState({ please_wait: true })
        if (this.state.subscription_id != null) {
            this.getTax();
        } else {
            let meals = this.state.meals;
            meals.is_continue = true;
            this.setState({ meals });
            SET_STORAGE("meals", JSON.stringify(meals));
            this.props.addMealToCart();
            history.push("/cart");
        }
    };

    mealCount = () => {
        let count = 0;
        this.state.meals.items.forEach(function (item, key) {
            count = Number(count) + Number(item.meal_quantity);
        });
        return count;
    };

    addItem = (item, quantity, variation, subscription = null) => {
        subscription = (subscription) ? subscription : this.state.subscription;
        let data = [];
        let meal_price = 0;
        if (subscription == 'yes') {
            // meal_price = (variation.sale_price > 0) ? SAVE_PERCENTAGE(variation.sale_price, item.subscription_save_percentage) : SAVE_PERCENTAGE(variation.regular_price, item.subscription_save_percentage);
            meal_price = parseFloat(variation.subscription_price);
        } else {
            meal_price = parseFloat((variation.sale_price > 0) ? variation.sale_price : variation.regular_price);
        }
        let newItem = {
            meal_id: item.meal_id,
            meal_variation_id: parseInt(variation.variation_id),
            meal_name: item.title,
            meal_quantity: quantity,
            meal_size: variation.variation_name + ' - ' + variation.term_name,
            meal_price: meal_price,
            meal_thumb_image: item.thumb_image,
            variation: variation,
            subscription_save_percentage: parseFloat(item.subscription_save_percentage),
        };

        if (this.state.meals.items.length > 0) {
            let exMealItems = this.state.meals.items;
            if (exMealItems.length > 0) {
                exMealItems.forEach(function (exItem, key) {
                    if (parseInt(exItem.meal_variation_id) == parseInt(variation.variation_id)) {
                        exItem.meal_variation_id = parseInt(variation.variation_id);
                        exItem.meal_quantity = quantity;
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
            meals.items = meals.items.filter(el => parseInt(el.meal_variation_id) !== parseInt(item.variation.variation_id));
            this.props.addMealToCart();
            meals.item_add_count = this.mealCount();
            let mealCount = this.mealCount();
            this.setState({
                meals: meals,
                mealCount: mealCount
            });
            // if (mealCount <= 0) {
            //     this.setState({ mobileCartShow: !this.state.mobileCartShow })
            // }
        }
    };

    quickView = (mealItemDetails) => {
        this.setState({ mealItemDetails: mealItemDetails });
    };

    itemSearch = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    // Get and calculate tax if applicable
    getTax = () => {
        this.setState({
            subscription_meal_tax_amount: 0,
            subscription_meal_tax_info: '',
        })
        if (this.state.taxStatus == 1 && this.state.subscription_id != null) {
            let address = this.state.existingMeals.billing_address;
            let taxData = {
                address_1: address.street_address,
                postcode: address.zip,
                city: address.city,
                state: address.state,
                country: address.country,
                shipping_cost: this.props.meals.shipping_cost,
                meals: this.state.meals
            }
            AJAX_REQUEST("POST", "order/getTax", taxData).then(results => {
                if (parseInt(results.response.code) === 1000 && results.response.data != '') {
                    let data = results.response.data;
                    this.setState({
                        subscription_meal_tax_amount: (data.subscription_meal_tax_amount) ? data.subscription_meal_tax_amount : 0,
                        subscription_meal_tax_info: data.subscription_meal_tax_info,
                    });
                    this.changeMealslItem();
                }
            });
        }
    }
    changeMealslItem = () => {
        let data = {
            subscription_id: this.state.subscription_id,
            subscription_meal_tax_amount: this.state.subscription_meal_tax_amount,
            subscription_meal_tax_info: this.state.subscription_meal_tax_info,
            meals: this.state.meals,
        }
        AJAX_REQUEST("POST", "subscription/updateMealItem", data).then(results => {
            if (parseInt(results.response.code) === 1000) {
                DESTROY_CART();
                window.location.href = `${CUSTOMER_URL}serviceLogin?token=${this.props.auth.user.token}&redirect=/my-account/related-subscription/${this.state.subscription_id}?is_subscription_orders_page=1`;
            } else if (parseInt(results.response.code) === 4004) {
                history.push('/meals');
            }
        });
    }

    changeSubscription = () => {
        let meals = this.state.meals;
        if (document.getElementById('msubscription').checked) {
            this.changeDuration();
        } else {
            meals.subscription = "no";
            meals.duration_id = "";
            meals.duration_text = "";

            SET_STORAGE("meal_subscription", "no");
            REMOVE_STORAGE("duration_id", "");
            REMOVE_STORAGE("duration_text", "");

            this.setState({
                meals,
                subscription: "no",
            });
        }
        // Reset meals
        if (meals.items.length > 0) {
            meals.items.forEach(function (item, key) {
                this.addItem(item, item.meal_quantity, item.variation, GET_STORAGE('meal_subscription'));
            }.bind(this));
        }
    }
    changeDuration = () => {
        let meals = this.state.meals;
        const durationId = document.getElementById('duration').value;
        const durationText = document.getElementById(`durationText${durationId}`).text;

        SET_STORAGE("meal_subscription", "yes");
        SET_STORAGE("duration_id", durationId);
        SET_STORAGE("duration_text", durationText);

        meals.subscription = "yes";
        meals.duration_id = durationId;
        meals.duration_text = durationText;

        this.setState({
            meals,
            subscription: "yes",
            forceRender: !this.state.forceRender,
        });
    }

    mobileCartShow = () => {
        this.setState({ mobileCartShow: !this.state.mobileCartShow })
    }

    existingMealsTotal = () => {
        let total = 0;
        const existingMealsItems = this.state.existingMeals.meals.items;
        if (existingMealsItems.length > 0) {
            existingMealsItems.map(function (item, key) {
                total = Number(total) + Number(item.meal_price * item.meal_quantity);
            }.bind(this))
            return total
        } else {
            return total;
        }
    }

    render() {
        let mealSubtotal = 0;
        let mealShipping = this.state.meals.shipping_cost;

        let options = [];
        for (let i = 1; i <= this.state.meals.item_count; i++) {
            if (i <= this.state.meals.item_add_count) {
                options.push(<span key={Math.random()} className="active" />);
            } else {
                options.push(<span key={Math.random()} className="" />);
            }
        }

        let sidebar_class = "";
        if (this.state.cartSideFixed) {
            // sidebar_class = "selected_meal selected_meal-custom selected_meal_fixed";
            sidebar_class = "selected_meal selected_meal-custom ";
        } else {
            sidebar_class = "selected_meal selected_meal-custom";
        }
        if (this.state.cartBottomFixed) {
            sidebar_class += " selected_meal-bottom-fixed";
        }
        if (this.state.subscription_id != null) {
            // sidebar_class += ' existing-subscription';
        }

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
                                                            {
                                                                (this.state.subscription_id == null) ?
                                                                    <div className="view-controls-wrapper">
                                                                        <p className="pull-left"> Showing {this.state.perPage} of {this.state.totalItem} results </p>
                                                                        {/* <form className="pull-right orderby_meal_search" method="get" >
                                                                            <select name="filter_by" className="roboto_condensed orderby" >
                                                                                <option value="popular"> Sort by popularity </option>
                                                                                <option value="latest">Sort by latest</option>
                                                                            </select>
                                                                        </form> */}
                                                                        <div className="clearfix" />
                                                                    </div>
                                                                    :
                                                                    <Fragment>
                                                                        {
                                                                            (this.state.subscription_id != null) ?
                                                                                <div className="view-controls-wrapper">
                                                                                    <ul className="order_details_list existing-subscription-list">
                                                                                        <li> Subscription: <strong> {this.state.subscription_id} </strong></li>
                                                                                        <li> Plan Name: <strong> {this.state.existingMeals.meals.plan_name} </strong></li>
                                                                                        <li> Total:  <strong> {CURRENCY_FORMAT(this.existingMealsTotal())} </strong></li>
                                                                                    </ul>
                                                                                </div>
                                                                                : ""
                                                                        }
                                                                    </Fragment>
                                                            }
                                                        </div>
                                                    </div>

                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <div className={(this.state.mobileCartShow) ? 'mobile-cart-visible' : 'mobile-cart-hide'}>
                                                                <div className={sidebar_class}>
                                                                    <h2 className="montserrat selected_meal_title">
                                                                        {this.state.meals.item_add_count} <span> of </span> {this.state.meals.item_count} Selected.
                                                                    </h2>
                                                                    <button onClick={this.mobileCartShow} className={(this.state.meals.item_add_count > 0) ? "mob-cart-show" : "mob-cart-hide"}>{(this.state.mobileCartShow) ? 'Hide' : 'Show'}</button>
                                                                    {
                                                                        (this.state.meals.items.length <= 0) ? "" :
                                                                            <Fragment>
                                                                                <ul className="selected-meal-qnt">
                                                                                    {

                                                                                        this.state.meals.items.map(function (meal_items_single, key) {
                                                                                            mealSubtotal = Number(mealSubtotal) + Number(meal_items_single.meal_quantity * meal_items_single.meal_price);
                                                                                            return (
                                                                                                <li key={meal_items_single.meal_variation_id} >
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
                                                                                <div className="selected_meal_thumb_title_qnt meal_list_qnt selected_meal_thumb_title_qnt-2">
                                                                                    {options}
                                                                                </div>
                                                                            </Fragment>
                                                                    }

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
                                                                                    <div className="selectedMealPrice" hidden={this.state.subscription_id == null}>
                                                                                        <div className="pull-left selectedMealPriceLabel"><span>Tax</span></div>
                                                                                        <div className="pull-right selectedMealPriceBold"> {CURRENCY_FORMAT(this.state.subscription_meal_tax_amount)} </div>
                                                                                    </div>
                                                                                    <div className="selectedMealPrice">
                                                                                        <div className="pull-left selectedMealPriceLabel">Meals Total</div>
                                                                                        <div className="pull-right selectedMealPriceBold"> <strong>{CURRENCY_FORMAT(Number(mealSubtotal) + Number(mealShipping) + Number(this.state.subscription_meal_tax_amount))}</strong> </div>
                                                                                    </div>
                                                                                    <div className="mealSubscription">
                                                                                        <div className="selectedMealPrice">
                                                                                            <div className="pull-left form-check">
                                                                                                <input disabled={this.state.subscription_id != null} type="checkbox" className="form-check-input" id="msubscription" onChange={this.changeSubscription} defaultChecked={this.state.meals.subscription === "yes" ? true : false} />
                                                                                                <label className="form-check-label" htmlFor="msubscription">Weekly</label>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="selectedMealPrice" hidden={(this.state.subscription == "no") || (this.state.planDetails.durations.length <= 0)}>
                                                                                            <select onChange={this.changeDuration} className="form-control" id="duration" value={this.state.meals.duration_id}>
                                                                                                {
                                                                                                    this.state.planDetails.durations.map(function (duration, key) {
                                                                                                        return (
                                                                                                            <option key={Math.random()} value={duration.id} id={`durationText${duration.id}`}>{duration.text}</option>
                                                                                                        )
                                                                                                    }.bind(this))
                                                                                                }
                                                                                            </select>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </Fragment>
                                                                    }
                                                                    <div className="montserrat add_1_meal_to_continue_btn">
                                                                        {
                                                                            (this.state.meals.item_add_count < this.state.meals.item_count) ?
                                                                                <a href="javascript:void(0)" className="montserrat meal-disble" > {(this.state.subscription_id == null) ? 'CONTINUE' : 'CONFIRM'} </a>
                                                                                :
                                                                                <a onClick={e => this.addMealToCart(e)} href="javascript:void(0)" className="montserrat meal-continue">
                                                                                    {
                                                                                        (this.state.please_wait) ? "Please Wait..."
                                                                                            :
                                                                                            (this.state.subscription_id == null) ? 'CONTINUE' : 'CONFIRM'
                                                                                    }
                                                                                </a>
                                                                        }
                                                                    </div>


                                                                </div>
                                                                <div className="clearfix"></div>

                                                                {/* <ShippingSchedule /> */}

                                                            </div>

                                                            <div className="selected_meal_container">
                                                                <div className="selected_meal_container-inner">
                                                                    <div className="selected_meal_container-inner-link meals2-itemSearch-block">

                                                                        <div className="meals2-itemSearch">
                                                                            <input onChange={(e) => this.itemSearch(e)} className="meal_search_box" type="text" name="item_search" value={this.state.item_search} placeholder="Search" />
                                                                        </div>

                                                                        <div className="meals2-itemSearch-right">
                                                                            {
                                                                                (this.state.mealList.length <= 0) ? this.state.error :
                                                                                    this.state.mealList.map(function (meal_term, index) {
                                                                                        return (
                                                                                            <Fragment key={index}>
                                                                                                <a href={`#mt${meal_term.term_id}`}>{meal_term.term_name}</a> &nbsp;
                                                                                        </Fragment>
                                                                                        )
                                                                                    }.bind(this))
                                                                            }
                                                                        </div>

                                                                    </div>

                                                                    {
                                                                        (this.state.mealList.length <= 0) ? this.state.error :
                                                                            this.state.mealList.map(function (meal_term, index) {
                                                                                return (
                                                                                    <Fragment key={`mi` + meal_term.term_id}>
                                                                                        <h6 id={`mt` + meal_term.term_id} className="meal-category-type-header"> {meal_term.term_name} </h6>
                                                                                        <ul>
                                                                                            {
                                                                                                (meal_term.meal_items.length <= 0) ? "" :
                                                                                                    meal_term.meal_items.map(function (item, index) {
                                                                                                        // Added item quickviewer
                                                                                                        item.quickView = this.quickView;
                                                                                                        return (
                                                                                                            <Fragment key={`item${item.meal_id}`}>
                                                                                                                {
                                                                                                                    (this.state.item_search == '' || item.title.toUpperCase().includes(this.state.item_search.toUpperCase())) ?
                                                                                                                        <SingleMealProductList
                                                                                                                            key={item.meal_id}
                                                                                                                            item={item}
                                                                                                                            plan={this.state.planDetails}
                                                                                                                            planItemLimit={this.state.planItemLimit}
                                                                                                                            mealCount={this.state.mealCount}
                                                                                                                            meals={this.state.meals}
                                                                                                                            addItem={this.addItem}
                                                                                                                            subscription={this.state.subscription}
                                                                                                                        />
                                                                                                                        : ""
                                                                                                                }
                                                                                                            </Fragment>
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
                                                subscription={this.state.subscription}
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
        auth: state.auth,
        meals: state.meals
    };
}

const mapDispachToProps = dispach => {
    return {
        addMealToCart: () => dispach({ type: "ADD_MEAL_TO_CART", value: JSON.parse(GET_STORAGE("meals")) })
    };
};

export default connect(mapStateToProps, mapDispachToProps)(Meals);