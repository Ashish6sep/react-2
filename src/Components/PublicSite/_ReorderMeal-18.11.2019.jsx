import React, { PureComponent } from 'react';
import { AJAX_REQUEST, SET_STORAGE, GET_STORAGE } from "../../Constants/AppConstants";
import history from '../../history';
import { connect } from "react-redux";

class ReorderMeal extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            order_id: this.props.match.params.order_id,
            meals: {
                plan_id: 0,
                item_count: 0,
                item_add_count: 0,
                plan_name: "",
                quantity: 1,
                shipping_cost: 0,
                subscription: 'yes',
                subscription_save_percentage: 0,
                items: [],
                is_continue: false
            },
        }
    }

    componentDidMount() {
        SET_STORAGE('meal_subscription', 'yes');
        let data = { order_id: this.state.order_id }
        AJAX_REQUEST("POST", "meal/orderDetails", data).then(results => {
            if (parseInt(results.response.code) === 1000) {
                SET_STORAGE('meals', JSON.stringify(results.response.data.meal_details));
                this.setState({
                    meals: results.response.data.meal_details,
                });
                this.props.addMealToCart();
                history.push('/meals/' + this.state.meals.plan_id);
            } else {
                history.push('/');
            }
        });
    }

    render() {
        return (
            <div className="loading container full_page_loader"></div>
        );
    }
}

const mapDispachToProps = dispach => {
    return {
        addMealToCart: () => dispach({ type: "ADD_MEAL_TO_CART", value: JSON.parse(GET_STORAGE("meals")) })
    };
};

export default connect(null, mapDispachToProps)(ReorderMeal);