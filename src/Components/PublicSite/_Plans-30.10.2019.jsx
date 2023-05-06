import React, { Fragment, PureComponent } from "react";
import Parser from "html-react-parser";
// import { connect } from "react-redux";
// import PropTypes from "prop-types";
import classnames from "classnames";
import { NavLink } from "react-router-dom";
import history from "../../history";
import { AJAX_PUBLIC_REQUEST, CURRENCY_FORMAT, SET_STORAGE, GET_STORAGE } from "../../Constants/AppConstants";

class Plans extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            plans: [],
            error: ""
        };
        document.title = "Plans - Prestige Labs";
    }

    componentDidMount() {
        document.querySelector("body").scrollIntoView();
        AJAX_PUBLIC_REQUEST("POST", "meal/getList", {}).then(results => {
            if (results.response.code === 1000) {
                this.setState({
                    plans: results.response.data.plans,
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

    goToMealPage = meal_id => {
        const subs_data = document.getElementById("meal_subscription" + meal_id).value;
        SET_STORAGE("meal_subscription", subs_data);
        // if (GET_STORAGE("meals")) {
        //     let meal_storage = JSON.parse(GET_STORAGE("meals"));
        //     meal_storage.subscription = subs_data;
        //     SET_STORAGE("meals", JSON.stringify(meal_storage));
        //     this.props.addMealToCart();
        // }
        const got_url = "/meals/" + meal_id;
        history.push(got_url);
    };

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
                                                    <li className="breadcrumb-item active" aria-current="page">
                                                        Plans
                                                    </li>
                                                </ol>
                                            </nav>

                                            <h3 className="montserrat page-title">PLANS</h3>

                                            <div className="packege__wrapper">
                                                <h5 className="montserrat packege_title">
                                                    Choose a Plan to Get Started
                                                </h5>

                                                {this.state.plans.length <= 0 ? (
                                                    <div className="text-center">No Meals Plan Found!</div>
                                                ) : (
                                                    this.state.plans.map(
                                                        function(plan, key) {
                                                            return (
                                                                <div
                                                                    className={classnames("package_ctg", {
                                                                        package_ctg_popular: plan.is_popular == "yes"
                                                                    })}
                                                                    key={plan.product_id}
                                                                >
                                                                    {plan.is_popular == "yes" ? (
                                                                        <h2 className="package_ctg_popular_title">
                                                                            POPULAR
                                                                        </h2>
                                                                    ) : (
                                                                        ""
                                                                    )}
                                                                    <h3 className="montserrat package_title">
                                                                        <i className="fa fa-truck" aria-hidden="true" />
                                                                        {parseFloat(plan.shipping_cost) > 0 ? (
                                                                            <span>
                                                                                {" "}
                                                                                Shipping{" "}
                                                                                {CURRENCY_FORMAT(plan.shipping_cost)}
                                                                            </span>
                                                                        ) : (
                                                                            <span> Free Shipping</span>
                                                                        )}
                                                                    </h3>
                                                                    <span className="montserrat package_meal_qnt">
                                                                        {plan.item_count}
                                                                    </span>
                                                                    <div className="montserrat package_meal_qnt_per_week">
                                                                        <span className="package_ctg_per_week">
                                                                            {plan.product_name}
                                                                        </span>
                                                                        <span className="package_ctg_per_week_rate">
                                                                            {parseFloat(plan.sale_price) > 0 ? (
                                                                                <span>
                                                                                    {CURRENCY_FORMAT(plan.sale_price)}
                                                                                </span>
                                                                            ) : (
                                                                                <span>
                                                                                    {CURRENCY_FORMAT(
                                                                                        plan.regular_price
                                                                                    )}
                                                                                </span>
                                                                            )}
                                                                            <span>/</span>
                                                                            {plan.duration}
                                                                        </span>
                                                                    </div>
                                                                    {plan.subscription == "yes" ? (
                                                                        <select
                                                                            className="form-control"
                                                                            id={`meal_subscription${plan.product_id}`}
                                                                        >
                                                                            <option value="yes">Subscription</option>
                                                                            <option value="no">Non-Subscription</option>
                                                                        </select>
                                                                    ) : (
                                                                        ""
                                                                    )}

                                                                    <button
                                                                        onClick={() =>
                                                                            this.goToMealPage(plan.product_id)
                                                                        }
                                                                        className="package_ctg_select"
                                                                    >
                                                                        select
                                                                    </button>
                                                                </div>
                                                            );
                                                        }.bind(this)
                                                    )
                                                )}
                                            </div>
                                        </main>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Fragment>
                )}
            </Fragment>
        );
    }
}

export default Plans;
// Plans.propTypes = {
//     meals: PropTypes.array.isRequired
// };

// function mapStateToProps(state) {
//     return {
//         meals: state.meals
//     };
// }

// const mapDispachToProps = dispach => {
//     return {
//         addMealToCart: () => dispach({ type: "ADD_MEAL_TO_CART", value: JSON.parse(GET_STORAGE("meals")) })
//     };
// };

// export default connect(
//     mapStateToProps,
//     mapDispachToProps
// )(Plans);
