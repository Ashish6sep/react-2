import React, { Fragment, PureComponent } from "react";
import Parser from "html-react-parser";
import { connect } from "react-redux";
import classnames from "classnames";
import { NavLink } from "react-router-dom";
import history from "../../history";
import ReactImageFallback from "react-image-fallback";
import { AJAX_PUBLIC_REQUEST, AJAX_REQUEST, CURRENCY_FORMAT, SET_STORAGE, GET_STORAGE, REMOVE_STORAGE } from "../../Constants/AppConstants";

class Plans extends PureComponent {
    constructor(props) {
        super(props);

        let settings = '';
        if (GET_STORAGE('settings')) {
            settings = JSON.parse(GET_STORAGE('settings'));
        }

        this.state = {
            loading: true,
            plans: [],
            error: "",
            settings: settings,
            show_banner: 'no',
            banner_url: '',
        };
        document.title = "Plans - Prestige Labs";
    }

    componentDidMount() {
        document.querySelector("body").scrollIntoView();
        // Check existing subscription only for change subscription item
        const url = new URL(window.location.href);
        let subscription_id = url.searchParams.get("subscription_id");
        if (subscription_id != null) {
            let data = {
                subscription_id: subscription_id
            }
            AJAX_REQUEST("POST", "subscription/getExistingMeals", data).then(results => {
                if (parseInt(results.response.code) === 1000) {
                    let existingMeals = results.response.data;
                    SET_STORAGE('existingMeals', JSON.stringify(existingMeals));
                    SET_STORAGE('meals', JSON.stringify(existingMeals.meals));
                    SET_STORAGE("meal_subscription", 'yes');
                    SET_STORAGE("duration_id", existingMeals.meals.duration_id);
                    SET_STORAGE("duration_text", existingMeals.meals.duration_text);
                    this.props.addMealToCart();
                    history.push(`/meals/${existingMeals.meals.plan_id}?subscription_id=${subscription_id}`);
                } else {
                    this.getPlanList();
                }
            });
        } else {
            this.getPlanList();
        }

    }

    getPlanList = () => {
        AJAX_PUBLIC_REQUEST("POST", "meal/getPlanList", { code: GET_STORAGE('meal_menu_access_code') }).then(results => {
            if (results.response.code === 1000) {
                this.setState({
                    plans: results.response.data,
                    show_banner: results.response.show_banner,
                    banner_url: results.response.banner_url,
                    loading: false
                });
            } else {
                this.setState({
                    error: Parser("<p className='text-danger'>" + results.response.message + "</p>"),
                    loading: false
                });
            }
        });
    }

    goToMealPage = (planId) => {
        const subs_data = document.getElementById("meal_subscription" + planId).value;
        SET_STORAGE("meal_subscription", subs_data);
        REMOVE_STORAGE('meals');

        if (subs_data == null || subs_data == '') {
            const element = document.getElementById("meal_subscription" + planId);
            element.classList.add("plan-select-error");
        } else {
            if (subs_data == 'yes') {
                const durationId = document.getElementById(`plan${planId}`).value;
                SET_STORAGE("duration_id", durationId);
                SET_STORAGE("duration_text", document.getElementById(`duration${planId}_${durationId}`).text);
            } else {
                REMOVE_STORAGE('duration_id');
                REMOVE_STORAGE('duration_text');
            }
            this.props.addMealToCart();
            history.push(`/meals/${planId}`);
        }

    };

    changeSubscription = (planId) => {
        const element = document.getElementById(`meal_subscription${planId}`);
        element.classList.remove("plan-select-error");
        let subscription = element.value;
        if (subscription == 'yes') {
            document.getElementById(`plan${planId}`).hidden = false;
        } else {
            document.getElementById(`plan${planId}`).hidden = true;
        }
    }

    render() {
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

                                                {
                                                    (this.state.show_banner == 'yes') ?
                                                        <div style={{ margin: '-30px 0 25px 0' }}>
                                                            <ReactImageFallback
                                                                src={this.state.banner_url}
                                                                fallbackImage={require('../../Assets/images/banner-loader.gif')}
                                                                initialImage={require('../../Assets/images/banner-loader.gif')}
                                                                alt='Banner image'
                                                                className="d-block w-100" />
                                                        </div>
                                                        : ""
                                                }

                                                <nav aria-label="breadcrumb">
                                                    <ol className="breadcrumb cus_breadcrumb">
                                                        <li className="breadcrumb-item">
                                                            <NavLink to="/">Home</NavLink>
                                                        </li>
                                                        <li className="breadcrumb-item active" aria-current="page">
                                                            Plans
                                                        </li>
                                                    </ol>
                                                </nav>
                                                <h3 className="montserrat page-title">PLANS</h3>
                                                <div className="packege__wrapper text-center">
                                                    <h5 className="montserrat packege_title"> Choose a Plan to Get Started </h5>
                                                    {
                                                        (this.state.plans.length <= 0) ?
                                                            <Fragment>
                                                                <div className="text-center">No Meals Plan Found!</div>
                                                            </Fragment> :
                                                            <Fragment>
                                                                {
                                                                    this.state.plans.map(function (plan, index) {
                                                                        return (
                                                                            <Fragment key={Math.random()}>
                                                                                <div className={classnames("package_ctg", { package_ctg_popular: (plan.is_popular == "yes"), 'package_ctg_text_top': (plan.top_text != '') })} key={plan.plan_id} >
                                                                                    {
                                                                                        (plan.top_text) ?
                                                                                            <h2 className="plan_top_text">{plan.top_text}</h2>
                                                                                            : ""
                                                                                    }
                                                                                    {
                                                                                        (plan.is_popular == "yes") ?
                                                                                            <h2 className="package_ctg_popular_title"> POPULAR </h2>
                                                                                            : ""
                                                                                    }
                                                                                    <h3 className="montserrat package_title">
                                                                                        <i className="fa fa-truck" aria-hidden="true" />
                                                                                        {
                                                                                            (parseFloat(plan.shipping_cost) > 0) ?
                                                                                                <span> Shipping {CURRENCY_FORMAT(plan.shipping_cost)} </span>
                                                                                                : <span> Free Shipping</span>
                                                                                        }
                                                                                    </h3>
                                                                                    <span className="montserrat package_meal_qnt">
                                                                                        {plan.plan_item_count}
                                                                                    </span>
                                                                                    <div className="montserrat package_meal_qnt_per_week">
                                                                                        <span className="package_ctg_per_week">
                                                                                            {plan.title}
                                                                                        </span>
                                                                                        {
                                                                                            (plan.starting_sale_price) ?
                                                                                                <Fragment>
                                                                                                    <span className="package_ctg_per_week_rate">
                                                                                                        <span>
                                                                                                            <span style={{ fontSize: '14px', display: 'block', textAlign: 'center' }}>
                                                                                                                {plan.pricing_label}&nbsp;
                                                                                                                <span className="package_ctg_public_starting_price compair-price">{plan.starting_price}</span>
                                                                                                                <span> {plan.starting_sale_price} </span>
                                                                                                            </span>
                                                                                                        </span>
                                                                                                    </span>
                                                                                                </Fragment>
                                                                                                :
                                                                                                <Fragment>
                                                                                                    <span className="package_ctg_per_week_rate">
                                                                                                        <span style={{ fontSize: '14px', display: 'block', textAlign: 'center' }}>
                                                                                                            {plan.pricing_label} {plan.starting_price}
                                                                                                        </span>
                                                                                                    </span>
                                                                                                </Fragment>
                                                                                        }
                                                                                    </div>
                                                                                    <div className="changeSubscription-select">
                                                                                        {
                                                                                            (plan.subscription == "yes") ?
                                                                                                <select onChange={() => this.changeSubscription(parseInt(plan.plan_id))} defaultValue='' className="form-control" id={`meal_subscription${plan.plan_id}`} >
                                                                                                    {
                                                                                                        (plan.delivery_frequency_options) ?
                                                                                                            <Fragment>
                                                                                                                <option value="">{plan.delivery_frequency_options.default}</option>
                                                                                                                <option value="no">{plan.delivery_frequency_options.no}</option>
                                                                                                                <option value="yes">{plan.delivery_frequency_options.yes}</option>
                                                                                                            </Fragment>
                                                                                                            : ''
                                                                                                    }
                                                                                                </select>
                                                                                                :
                                                                                                <input type="hidden" id={`meal_subscription${plan.plan_id}`} value="no" />
                                                                                        }
                                                                                        {

                                                                                            <Fragment>
                                                                                                <select className="form-control" id={`plan${parseInt(plan.plan_id)}`} style={{ marginTop: '10px' }} hidden={true}>
                                                                                                    {
                                                                                                        plan.durations.map(function (duration, key) {
                                                                                                            return (
                                                                                                                <option key={Math.random()} value={duration.id} id={`duration${plan.plan_id}_${duration.id}`} >{duration.text}</option>
                                                                                                            )
                                                                                                        }.bind(this))
                                                                                                    }
                                                                                                </select>
                                                                                            </Fragment>

                                                                                        }
                                                                                    </div>

                                                                                    <button onClick={() => this.goToMealPage(plan.plan_id)} className="package_ctg_select" > select </button>
                                                                                </div>

                                                                            </Fragment>
                                                                        )
                                                                    }.bind(this))

                                                                }
                                                            </Fragment>
                                                    }
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

export default connect(mapStateToProps, mapDispachToProps)(Plans);