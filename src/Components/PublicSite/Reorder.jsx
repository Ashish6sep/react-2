import React, { PureComponent } from 'react';
import { AJAX_REQUEST, SET_STORAGE, GET_STORAGE } from "../../Constants/AppConstants";
import history from '../../history';
import { connect } from "react-redux";

class Reorder extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            order_id: this.props.match.params.order_id,
            reorder_data: [],
        }
    }

    componentDidMount() {
        let data = {
            order_id: this.state.order_id
        }
        AJAX_REQUEST("POST", "order/getReOrderData", data).then(results => {
            if (parseInt(results.response.code) === 1000) {
                let data = results.response.data;
                if (data.supplement) {
                    SET_STORAGE('cart', JSON.stringify(data.supplement));
                    this.props.addToCart();
                }
                if (data.meals) {
                    SET_STORAGE('meals', JSON.stringify(data.meals));
                    this.props.addMealToCart();
                }
                history.push('/cart');
            } else {
                history.push('/my-account/view-order');
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
        addToCart: () => dispach({ type: 'ADD_TO_CART', value: JSON.parse(GET_STORAGE('cart')) }),
        addMealToCart: () => dispach({ type: "ADD_MEAL_TO_CART", value: JSON.parse(GET_STORAGE("meals")) })
    }
};

export default connect(null, mapDispachToProps)(Reorder);