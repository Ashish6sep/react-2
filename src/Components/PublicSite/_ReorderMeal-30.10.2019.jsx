import React, { PureComponent } from 'react';
import { AJAX_REQUEST, SET_STORAGE, GET_STORAGE } from "../../Constants/AppConstants";
import history from '../../history';
import { connect } from "react-redux";

class ReorderMeal extends PureComponent {
    constructor(props){
        super(props)
        this.state = {
            order_id:this.props.match.params.order_id,
            meals: {
                product_id: 0,
                variation_id: 0,
                item_count: 0,
                item_add_count: 0,
                product_name: "",
                quantity: 1,
                shipping_cost: 0,
                subscription_shipping_cost: 0,
                subscription: 'no',
                sale_price: 0,
                display_sale_price: 0,
                discount_price: 0,
                display_discount_price: 0,
                items: [],
                image: null,
                premium: "no",
                premium_amount: 0,
                is_continue: true
            },
        }
    }

    componentDidMount() {
        SET_STORAGE('meal_subscription','no');
        let data = {
            order_id: this.state.order_id
        }
        AJAX_REQUEST("POST", "meal/orderDetails", data).then(results => {
            if (parseInt(results.response.code) === 1000) {
                SET_STORAGE('meals',JSON.stringify(results.response.data.meal_details));
                this.setState({
                    meals: results.response.data.meal_details,
                });
                this.props.addMealToCart();
                history.push('/meals/'+this.state.meals.product_id);
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

export default connect(
    null,
    mapDispachToProps
)(ReorderMeal);
 
// export default Reorder;