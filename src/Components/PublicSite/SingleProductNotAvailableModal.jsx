import React, { Fragment, PureComponent } from 'react';
import { CURRENCY_FORMAT } from '../../Constants/AppConstants';
import $ from 'jquery';
import Parser from 'html-react-parser';

import ReactDOM from 'react-dom';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';

class SingleProductNotAvailableModal extends PureComponent {
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
        console.log("props",this.props);
        return (
            <Fragment>
                <div className="modal fade" id="producNotAvailableView" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered product_quick_view_modal" role="document">
                        <div className="modal-content">
                            <div className="modal-header cus-modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            
                                <div className="modal-body">
                                    <div class="SingleProductNotAvailableModal">
                                        <p>Bulletproof Vitality for Her is temporarily out of stock. Please hit continue to place your pre-order. Bulletproof Vitality for Her will automatically ship once back in stock.</p> <p class="font-italic">*All bundles will ship without the Bulletproof Vitality for Her and it will ship separately once back in stock.</p>
                                        <a href={`/product/${this.props.productLink}`} class="btn btn-info">Continue</a>
                                    </div>
                                </div>
                              
                        </div>
                    </div>
                </div>
            </Fragment>
            
        );
    }
}

export default SingleProductNotAvailableModal;