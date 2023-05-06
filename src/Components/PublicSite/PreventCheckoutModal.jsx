import React, { Fragment, PureComponent } from 'react';
import { CURRENCY_FORMAT } from '../../Constants/AppConstants';
import $ from 'jquery';
import Parser from 'html-react-parser';

import ReactDOM from 'react-dom';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';

class PreventCheckoutModal extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            regularPriceDisplay: false,
            regularPrice: 0,
            salePrice: 0,
            monthId: '',
            flavorId: '',
        }
    }

    // componentDidUpdate(prevProps, prevState) {
    //     this.setState({ loading: false })
    // }

   

    render() {
        return (
            <Fragment>
                <div className="modal fade show" id="preventcheckoutmodal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered product_quick_view_modal" role="document">
                        <div className="modal-content">
                            <div className="modal-header cus-modal-header">
                                
                            </div>
                            
                                <div className="modal-body">
                                    <div class="SingleProductNotAvailableModal">
                                        <p>EFA is currently unable to ship to canada, we apologize for any inconvenience.</p>
                                        <p>In order to checkout, pleased remove EFA from the basket and replace with another item for bundles, we recommend Fast Result as an alternative.</p>
                                        <p>-Prestige Labs</p>
                                        <a href="#" class="btn btn-info">Back To Cart</a>
                                    </div>
                                </div>
                              
                        </div>
                    </div>
                </div>
                <div class="modal-backdrop fade show"></div>
            </Fragment>
            
        );
    }
}

export default PreventCheckoutModal;