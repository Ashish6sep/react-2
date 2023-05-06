import React, { Fragment, PureComponent } from "react";
import Parser from "html-react-parser";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import history from "../../history";
import $ from "jquery";
import { NavLink } from "react-router-dom";
import { AJAX_PUBLIC_REQUEST, SET_STORAGE, GET_STORAGE, CURRENCY_FORMAT } from "../../Constants/AppConstants";
import SingleMealProductModal from "./SingleMealProductModal";
import SingleMealProductList from "./SingleMealProductList";
import Pagination from "../Common/Pagination";

class Meals extends PureComponent {
    constructor(props) {
        super(props);
        this.child = React.createRef();
        this.state = {
            loading: true,
            paginationLoading: false,
            product_id: this.props.match.params.id,
            product_details: {},
            subscription: GET_STORAGE("meal_subscription") ? GET_STORAGE("meal_subscription") : "no",
            premium: "no",
            premium_amount: 0,
            // premium: GET_STORAGE("premium") ? GET_STORAGE("premium") : "no",
            // premium_amount: GET_STORAGE("premium_amount") ? GET_STORAGE("premium_amount") : 0,
            meal_items: [],
            mealItemDetails: {},

            planItemLimit: 0,
            mealCount: 0,
            meals: {
                product_id: this.props.match.params.id,
                variation_id: 0,
                item_count: 0,
                item_add_count: 0,
                product_name: "",
                quantity: 1,
                shipping_cost: 0,
                subscription_shipping_cost: 0,
                subscription: GET_STORAGE("meal_subscription"),
                sale_price: 0,
                display_sale_price: 0,
                discount_price: 0,
                display_discount_price: 0,
                items: [],
                image: null,
                premium: "no",
                premium_amount: 0,
                // premium: GET_STORAGE("premium"),
                // premium_amount: GET_STORAGE("premium_amount"),
                is_continue: false
            },

            filter_by: "popular",
            // Pagination Config
            item_count: 0,
            total_records: 0,
            total_page: 0,
            per_page: 0,
            pagenum: 1
        };
        document.title = "Meals - Prestige Labs";
    }

    addMealToCart = () => {
        let meals = this.state.meals;
        meals.is_continue = true;
        meals.subscription = GET_STORAGE('meal_subscription');
        this.setState({
            meals
        });
        SET_STORAGE("meals", JSON.stringify(meals));
        this.props.addMealToCart();
        history.push("/cart");
    };

    componentDidMount() {
        document.querySelector("body").scrollIntoView();
        AJAX_PUBLIC_REQUEST("POST", "meal/getDetails", { product_id: this.props.match.params.id }).then(results => {
            if (results.response.code === 1000) {
                //check old value
                if (this.props.meals.length > 0 && this.props.meals[0]) {
                    const old_meals = this.props.meals[0];
                    if (old_meals.product_id == parseInt(this.props.match.params.id)) {
                        SET_STORAGE("meals", JSON.stringify(old_meals));
                        this.setState({
                            meals: old_meals,
                            product_details: results.response.data.plans,
                            planItemLimit: parseInt(results.response.data.plans.item_count),
                            mealCount: old_meals.item_add_count,
                            premium: old_meals.premium,
                            premium_amount: old_meals.premium_amount,
                        });
                    } else {
                        const price =
                            parseFloat(results.response.data.plans.sale_price) > 0
                                ? parseFloat(results.response.data.plans.sale_price)
                                : parseFloat(results.response.data.plans.regular_price);
                        const discount_price =
                            price -
                            (price * parseFloat(results.response.data.plans.subscription_save_percentage)) / 100;
                        const meals = {
                            product_id: parseInt(this.props.match.params.id),
                            variation_id: parseInt(results.response.data.plans.variation_id),
                            item_count: parseInt(results.response.data.plans.item_count),
                            item_add_count: 0,
                            product_name: results.response.data.plans.title,
                            image: results.response.data.plans.image,
                            quantity: 1,
                            shipping_cost: parseFloat(results.response.data.plans.shipping_cost),
                            subscription_shipping_cost: parseFloat(results.response.data.plans.shipping_cost),
                            subscription: GET_STORAGE("meal_subscription") ? GET_STORAGE("meal_subscription") : "no",
                            sale_price: price,
                            display_sale_price: price,
                            discount_price: discount_price,
                            display_discount_price: discount_price,
                            items: [],
                            is_continue: false,
                            premium: "no",
                            premium_amount: results.response.data.plans.hasOwnProperty('premium_amount') ? results.response.data.plans.premium_amount : 0
                        };
                        // if(results.response.data.plans.hasOwnProperty('premium') && (results.response.data.plans.premium ==="yes")){
                        //     meals.premium = results.response.data.plans.premium;
                        //     meals.premium_amount = results.response.data.plans.premium_amount;
                        // }else{
                        //     meals.premium = "no";
                        //     meals.premium_amount = 0;
                        // }
                        SET_STORAGE("meals", JSON.stringify(meals));
                        this.setState({
                            product_details: results.response.data.plans,
                            meals: meals,
                            planItemLimit: parseInt(results.response.data.plans.item_count)
                        });
                    }
                } else {
                    const price =
                        parseFloat(results.response.data.plans.sale_price) > 0
                            ? parseFloat(results.response.data.plans.sale_price)
                            : parseFloat(results.response.data.plans.regular_price);
                    const discount_price =
                        price - (price * parseFloat(results.response.data.plans.subscription_save_percentage)) / 100;
                    const meals = {
                        product_id: parseInt(this.props.match.params.id),
                        variation_id: parseInt(results.response.data.plans.variation_id),
                        item_count: parseInt(results.response.data.plans.item_count),
                        item_add_count: 0,
                        product_name: results.response.data.plans.title,
                        image: results.response.data.plans.image,
                        quantity: 1,
                        shipping_cost: parseFloat(results.response.data.plans.shipping_cost),
                        subscription_shipping_cost: parseFloat(results.response.data.plans.shipping_cost),
                        subscription: GET_STORAGE("meal_subscription") ? GET_STORAGE("meal_subscription") : "no",
                        sale_price: price,
                        display_sale_price: price,
                        discount_price: discount_price,
                        display_discount_price: discount_price,
                        items: [],
                        is_continue: false,
                        premium: "no",
                        premium_amount: results.response.data.plans.hasOwnProperty('premium_amount') ? results.response.data.plans.premium_amount : 0
                    };
                    // if(results.response.data.plans.hasOwnProperty('premium') && (results.response.data.plans.premium==="yes")){
                    //     meals.premium = results.response.data.plans.premium;
                    //     meals.premium_amount = results.response.data.plans.premium_amount;
                    // }else{
                    //     meals.premium = "no";
                    //     meals.premium_amount = 0;
                    // }
                    SET_STORAGE("meals", JSON.stringify(meals));
                    this.setState({
                        product_details: results.response.data.plans,
                        meals: meals,
                        planItemLimit: parseInt(results.response.data.plans.item_count)
                    });
                }
            } else {
                history.push("/meals");
            }
        });

        this.getMealProducts(this.state.filter_by, this.state.pagenum);
    }

    mealCount = () => {
        let count = 0;
        this.state.meals.items.forEach(function (item, key) {
            count = Number(count) + Number(item.meal_quantity);
        });
        return count;
    };

    addItem = (quantity, item) => {
        let data = [];
        let newItem = {
            meal_id: item.meal_id,
            meal_name: item.title,
            meal_quantity: quantity,
            meal_thumb_image: item.thumb_image,
            meal_short_desc: item.short_desc
        };
        if (this.state.meals.items.length > 0) {
            let meal = this.state.meals.items;

            if (meal.length > 0) {
                meal.forEach(function (exItem, key) {
                    if (exItem.meal_id == item.meal_id) {
                        exItem.meal_quantity = quantity;
                        data.push(exItem);
                        newItem = null;
                    } else {
                        data.push(exItem);
                    }
                });
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
                mealCount: mealCount
            });
        } else {
            data.push(newItem);
            let meals = this.state.meals;
            meals.items = data;

            let mealCount = this.mealCount();
            meals.item_add_count = mealCount;

            this.setState({
                meals: meals,
                mealCount: mealCount
            });
        }
    };

    deleteItem = item => {
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

    //meal script end

    pagenationHandle = pageNumber => {
        this.setState({ paginationLoading: true });
        this.getMealProducts(this.state.filter_by, pageNumber);
    };

    filterBy = e => {
        let filter_by = e.target.value;
        this.setState({
            paginationLoading: true,
            [e.target.name]: filter_by
        });
        this.getMealProducts(filter_by, 1);
    };

    getMealProducts = (filterBy, pageNumber) => {
        const data = {
            filter_by: filterBy,
            pagenum: parseInt(pageNumber)
        };
        AJAX_PUBLIC_REQUEST("POST", "meal/getItems", data).then(results => {
            if (results.response.code === 1000) {
                this.setState({
                    meal_items: results.response.data.meal_items,
                    loading: false,
                    paginationLoading: false,
                    // Pagination Config
                    item_count: parseInt(results.response.data.meal_items.length),
                    total_records: parseInt(results.response.total_records),
                    total_page: parseInt(results.response.total_page),
                    per_page: parseInt(results.response.per_page),
                    pagenum: parseInt(results.response.pagenum)
                });
            } else {
                this.setState({
                    error: Parser("<p className='text-danger'>" + results.response.message + "</p>"),
                    loading: false,
                    paginationLoading: false,
                    // Pagination Config
                    item_count: 0,
                    total_records: 0,
                    total_page: 0,
                    per_page: 0,
                    pagenum: 1
                });
            }
        });
    };

    quickView = meal_id => {
        this.setState({ mealItemDetails: {} });
        this.state.meal_items.filter(
            function (value, index) {
                if (value.meal_id == meal_id) {
                    this.setState({
                        mealItemDetails: value
                    });
                }
            }.bind(this)
        );
    };

    // changePremium = () => {
    //     let meals = this.state.meals;
    //     if (document.getElementById('exampleCheck1').checked) {
    //         meals.premium = "yes";
    //         this.setState({
    //             meals,
    //             premium: "yes",
    //         })
    //     } else {
    //         meals.premium = "no";
    //         this.setState({
    //             meals,
    //             premium: "no",
    //         })
    //     }
    // }

    changePremium = () => {
        let meals = this.state.meals;
        let productDetails = this.state.product_details;

        const sale_price = parseFloat(productDetails.sale_price) > 0 ? parseFloat(productDetails.sale_price) : parseFloat(productDetails.regular_price);
        const discount_price = sale_price - (sale_price * parseFloat(productDetails.subscription_save_percentage)) / 100;

        if (document.getElementById('exampleCheck1').checked) {

            if (meals.premium == 'no') {
                meals.premium = "yes";
                meals.discount_price = Number(discount_price) + Number(productDetails.premium_amount);
                meals.sale_price = Number(sale_price) + Number(productDetails.premium_amount);
            }
            this.setState({
                meals,
                premium: "yes",
            })

        } else {

            if (meals.premium == 'yes') {
                meals.premium = "no";
                meals.discount_price = discount_price;
                meals.sale_price = sale_price;
            }
            this.setState({
                meals,
                premium: "no",
            })

        }
    }

    changeSubscription = () => {
        let meals = this.state.meals;
        if (document.getElementById('msubscription').checked) {
            meals.subscription = "yes";
            SET_STORAGE("meal_subscription", "yes");
            this.setState({
                meals,
                subscription: "yes"
            });
        } else {
            meals.subscription = "no";
            SET_STORAGE("meal_subscription", "no");
            this.setState({
                meals,
                subscription: "no"
            });
        }
    }

    render() {
        return (
            <Fragment>
                {this.state.loading ? (
                    <div className="loading container full_page_loader" />
                ) : (
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

                                                <Fragment>
                                                    <section className="package_select_list">
                                                        <div className="row">
                                                            <div className="col-md-12">
                                                                <div className="view-controls-wrapper">
                                                                    <p className="pull-left">
                                                                        Showing &nbsp;
                                                                    {this.state.pagenum <= 1
                                                                            ? this.state.pagenum +
                                                                            "-" +
                                                                            this.state.item_count
                                                                            : (this.state.pagenum - 1) *
                                                                            this.state.per_page +
                                                                            Number(1) +
                                                                            "-" +
                                                                            ((this.state.pagenum - 1) *
                                                                                this.state.per_page +
                                                                                Number(this.state.item_count))}
                                                                        &nbsp; of {this.state.total_records} results
                                                                </p>
                                                                    <form
                                                                        className="pull-right orderby_meal_search"
                                                                        method="get"
                                                                    >
                                                                        <select
                                                                            onChange={this.filterBy}
                                                                            value={this.state.filter_by}
                                                                            name="filter_by"
                                                                            className="roboto_condensed orderby"
                                                                        >
                                                                            <option value="popular">
                                                                                Sort by popularity
                                                                        </option>
                                                                            <option value="latest">Sort by latest</option>
                                                                        </select>
                                                                    </form>
                                                                    <div className="clearfix" />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="row">
                                                            <div className="col-md-12">
                                                                <div className="selected_meal">
                                                                    <h2 className="montserrat selected_meal_title">
                                                                        {this.state.meals.item_add_count}
                                                                        <span> of </span>
                                                                        {this.state.meals.item_count} Selected
                                                                </h2>
                                                                    <ul>
                                                                        {this.state.meals.items.length > 0
                                                                            ? this.state.meals.items.map(
                                                                                function (meal_items_single, key) {
                                                                                    return (
                                                                                        <li
                                                                                            key={
                                                                                                meal_items_single.meal_id
                                                                                            }
                                                                                        >
                                                                                            <div className="selected_meal_img">
                                                                                                <img
                                                                                                    src={
                                                                                                        meal_items_single.meal_thumb_image
                                                                                                    }
                                                                                                    alt={
                                                                                                        meal_items_single.meal_name
                                                                                                    }
                                                                                                    title={
                                                                                                        meal_items_single.meal_name
                                                                                                    }
                                                                                                />
                                                                                            </div>
                                                                                            <div className="selected_meal_short_info">
                                                                                                <span className="montserrat">
                                                                                                    {
                                                                                                        meal_items_single.meal_quantity
                                                                                                    }
                                                                                                </span>
                                                                                                <h3 className="montserrat">
                                                                                                    {
                                                                                                        meal_items_single.meal_name
                                                                                                    }
                                                                                                </h3>
                                                                                                {/* <h4 className="montserrat">
                                                                                                    {Parser(
                                                                                                        meal_items_single.meal_short_desc
                                                                                                    )}
                                                                                                </h4> */}
                                                                                            </div>
                                                                                            <span
                                                                                                onClick={() =>
                                                                                                    this.deleteItem(
                                                                                                        meal_items_single
                                                                                                    )
                                                                                                }
                                                                                                className="selected_meal_remove"
                                                                                            >
                                                                                                <img
                                                                                                    src={require("../../Assets/images/icon/close.png")}
                                                                                                    alt="Remove"
                                                                                                    title="Remove"
                                                                                                />
                                                                                            </span>
                                                                                        </li>
                                                                                    );
                                                                                }.bind(this)
                                                                            )
                                                                            : ""}
                                                                    </ul>
                                                                    <div className="montserrat add_1_meal_to_continue">
                                                                        {this.state.meals.item_add_count <
                                                                            this.state.meals.item_count ? (
                                                                                <span>
                                                                                    Please add&nbsp;
                                                                            {this.state.meals.item_count -
                                                                                        this.state.meals.item_add_count}
                                                                                    &nbsp;meal to continue
                                                                        </span>
                                                                            ) : (
                                                                                ""
                                                                            )}
                                                                    </div>
                                                                    <div className="montserrat selectedMealPricewrapper">
                                                                        {
                                                                            (this.state.product_details.hasOwnProperty('premium') && (this.state.product_details.premium === "yes")) ?
                                                                                <Fragment>
                                                                                    <div className="selectedMealPrice">
                                                                                        <div className="pull-left selectedMealPriceLabel">Price</div>
                                                                                        <div className="pull-right selectedMealPrice selectedMealPriceBold">
                                                                                            {
                                                                                                (this.state.subscription == 'yes') ?
                                                                                                    CURRENCY_FORMAT(this.state.meals.display_discount_price)
                                                                                                    :
                                                                                                    CURRENCY_FORMAT(this.state.meals.display_sale_price)
                                                                                            }
                                                                                        </div>
                                                                                        <div className="clearfix"></div>
                                                                                    </div>

                                                                                    <div className="selectedMealCtg">
                                                                                        <div className="pull-left form-check">
                                                                                            <input type="checkbox" className="form-check-input" id="exampleCheck1" onClick={this.changePremium} defaultChecked={this.state.meals.premium === "yes" ? true : false} />
                                                                                            <label className="form-check-label" htmlFor="exampleCheck1">Premium</label>
                                                                                        </div>
                                                                                        <div className="pull-right selectedMealCtgPrice selectedMealPriceBold">{CURRENCY_FORMAT(this.state.meals.premium_amount)}</div>
                                                                                        <div className="clearfix"></div>
                                                                                    </div>
                                                                                    <hr className="meal_cart_hr" />
                                                                                </Fragment>
                                                                                :
                                                                                ''
                                                                        }

                                                                        <div className="selectedMealPriceTotal">
                                                                            <div className="pull-left form-check">
                                                                                <input type="checkbox" className="form-check-input" id="msubscription" onClick={this.changeSubscription} defaultChecked={this.state.meals.subscription === "yes" ? true : false} />
                                                                                <label className="form-check-label" htmlFor="msubscription">Subscription</label>
                                                                            </div>
                                                                            <div className="pull-right">
                                                                                <span>TOTAL</span>
                                                                                <span className="selectedMealPriceBold">
                                                                                    {
                                                                                        (this.state.product_details.hasOwnProperty('premium') && (this.state.product_details.premium === "yes")) ?
                                                                                            <Fragment>
                                                                                                {
                                                                                                    (this.state.meals.premium == 'yes') ?
                                                                                                        this.state.subscription === "yes" ?
                                                                                                            CURRENCY_FORMAT(Number(this.state.meals.display_discount_price) + Number(this.state.meals.premium_amount))
                                                                                                            :
                                                                                                            CURRENCY_FORMAT(Number(this.state.meals.display_sale_price) + Number(this.state.meals.premium_amount))
                                                                                                        :
                                                                                                        this.state.subscription === "yes" ?
                                                                                                            CURRENCY_FORMAT(this.state.meals.display_discount_price)
                                                                                                            :
                                                                                                            CURRENCY_FORMAT(this.state.meals.display_sale_price)
                                                                                                }
                                                                                            </Fragment>
                                                                                            :
                                                                                            <Fragment>
                                                                                                {
                                                                                                    this.state.subscription === "yes" ?
                                                                                                        CURRENCY_FORMAT(this.state.meals.display_discount_price)
                                                                                                        :
                                                                                                        CURRENCY_FORMAT(this.state.meals.display_sale_price)
                                                                                                }
                                                                                            </Fragment>
                                                                                    }
                                                                                </span>
                                                                            </div>
                                                                            <div className="clearfix"></div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="montserrat add_1_meal_to_continue_btn">
                                                                        {this.state.meals.item_add_count <
                                                                            this.state.meals.item_count ? (
                                                                                <a
                                                                                    href="javascript:void(0)"
                                                                                    className="montserrat meal-disble"
                                                                                >
                                                                                    CONTINUE
                                                                        </a>
                                                                            ) : (
                                                                                <a
                                                                                    onClick={e => this.addMealToCart(e)}
                                                                                    href="javascript:void(0)"
                                                                                    className="montserrat meal-continue"
                                                                                >
                                                                                    CONTINUE
                                                                        </a>
                                                                            )}
                                                                    </div>
                                                                </div>
                                                                <div className="selected_meal_container">
                                                                    {this.state.paginationLoading ? (
                                                                        <div className="loading" />
                                                                    ) : (
                                                                            <ul>
                                                                                {this.state.meal_items.length <= 0
                                                                                    ? this.state.error
                                                                                    : this.state.meal_items.map(
                                                                                        function (meal_items_single, key) {
                                                                                            // Added meal_items_single quickviewer
                                                                                            meal_items_single.quickView = this.quickView;
                                                                                            return (
                                                                                                <SingleMealProductList
                                                                                                    key={
                                                                                                        meal_items_single.meal_id
                                                                                                    }
                                                                                                    item={meal_items_single}
                                                                                                    plan={
                                                                                                        this.state
                                                                                                            .product_details
                                                                                                    }
                                                                                                    planItemLimit={
                                                                                                        this.state
                                                                                                            .planItemLimit
                                                                                                    }
                                                                                                    mealCount={
                                                                                                        this.state.mealCount
                                                                                                    }
                                                                                                    meals={this.state.meals}
                                                                                                    addItem={this.addItem}
                                                                                                    ref={this.child}
                                                                                                />
                                                                                            );
                                                                                        }.bind(this)
                                                                                    )}
                                                                            </ul>
                                                                        )}
                                                                </div>

                                                                <div className="clearfix" />
                                                                <Pagination
                                                                    pagenationHandle={this.pagenationHandle}
                                                                    total_records={this.state.total_records}
                                                                    total_page={this.state.total_page}
                                                                    per_page={this.state.per_page}
                                                                    pagenum={this.state.pagenum}
                                                                />
                                                            </div>
                                                        </div>
                                                    </section>
                                                </Fragment>
                                            </main>
                                        </div>
                                    </div>
                                    <SingleMealProductModal mealItemDetails={this.state.mealItemDetails} />
                                </div>
                            </div>
                        </Fragment>
                    )}
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

export default connect(
    mapStateToProps,
    mapDispachToProps
)(Meals);
