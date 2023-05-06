import React, { Fragment, PureComponent } from 'react';
import Parser from "html-react-parser";
import { AJAX_PUBLIC_REQUEST, GET_STORAGE } from "../../Constants/AppConstants";

class ShippingSchedule extends PureComponent {
    constructor(props) {
        super(props);
        let settings = '';
        if (GET_STORAGE('settings')) {
            settings = JSON.parse(GET_STORAGE('settings'));
        }
        this.state = {
            loading: true,
            shippingSchedule: {},
            meal_shipping_schedule_show: (settings.hasOwnProperty('meal_shipping_schedule_show')) ? settings.meal_shipping_schedule_show : 'no',
        }
    }

    componentDidMount() {
        if (this.state.meal_shipping_schedule_show == 'yes') {
            this.getShippingSchedule();
        } else {
            this.setState({ loading: false, })
        }
    }

    getShippingSchedule = () => {
        AJAX_PUBLIC_REQUEST("POST", "meal/shippingSchedule", {}).then(results => {
            if (parseInt(results.response.code) === 1000) {
                this.setState({
                    loading: false,
                    shippingSchedule: results.response.data,
                });
            } else {
                this.setState({
                    error: Parser("<p className='text-danger'>" + results.response.message + "</p>"),
                    loading: false,
                });
            }
        });
    }

    render() {
        return (
            <Fragment>
                {
                    (this.state.loading) ?
                        <div className="loading container full_page_loader"></div>
                        :
                        <Fragment>
                            {
                                (this.state.meal_shipping_schedule_show == 'yes') ?
                                    <div className="meal-shipping-shedule">
                                        <h2 className="title">{this.state.shippingSchedule.title}</h2>
                                        <h3 className="sub-title">{this.state.shippingSchedule.note}</h3>
                                        <div className="meal-shipping-shedule-order-day">
                                            <div className="order-before">
                                                <h3>
                                                    {
                                                        (this.state.shippingSchedule.hasOwnProperty('heading') && this.state.shippingSchedule.heading[0]) ?
                                                            this.state.shippingSchedule.heading[0].before_time
                                                            : ""
                                                    }
                                                </h3>
                                                <ul>
                                                    {
                                                        (this.state.shippingSchedule.hasOwnProperty('schedule') && this.state.shippingSchedule.schedule.length > 0) ?
                                                            this.state.shippingSchedule.schedule.map(function (schedule, index) {
                                                                return (
                                                                    <li>{schedule.before_time}</li>
                                                                )
                                                            }.bind(this))
                                                            : ""
                                                    }
                                                </ul>
                                            </div>
                                            <div className="arraival-date">
                                                <h3>
                                                    {
                                                        (this.state.shippingSchedule.hasOwnProperty('heading') && this.state.shippingSchedule.heading[0]) ?
                                                            this.state.shippingSchedule.heading[0].arrival_time
                                                            : ""
                                                    }
                                                </h3>
                                                <ul>
                                                    {
                                                        (this.state.shippingSchedule.hasOwnProperty('schedule') && this.state.shippingSchedule.schedule.length > 0) ?
                                                            this.state.shippingSchedule.schedule.map(function (schedule, index) {
                                                                return (
                                                                    <li>{schedule.arrival_time}</li>
                                                                )
                                                            }.bind(this))
                                                            : ""
                                                    }
                                                </ul>
                                            </div>
                                        </div>
                                        <span className="note">{this.state.shippingSchedule.text}</span>
                                        
                                    </div>
                                    
                                    : ""
                            }
                        </Fragment>
                }
            </Fragment>

        );
    }
}

export default ShippingSchedule;