import React, { Fragment, PureComponent } from 'react';
import { NavLink } from "react-router-dom";
import ReactImageFallback from "react-image-fallback";
import { CURRENCY_FORMAT } from '../../Constants/AppConstants';

class SingleProductNotAvailable extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() { 

        const product = this.props.product;
        
        return ( 
            <Fragment>
                <div className="refer_produc_wrapper">
                    <div className="refer-img-wrapper">
                        <a className="text-center refer-img-thumb" onClick={()=>product.notAvailablePopup(product.slug)} href="#">
                            {/* <span className="onsale">Sale!</span>  */}
                            <ReactImageFallback
                                src={(this.props.type=='bundle')?product.main_image : product.list_image}
                                fallbackImage={require('../../Assets/images/preloader.gif')}
                                initialImage={require('../../Assets/images/preloader.gif')}
                                alt={product.hasOwnProperty('title')?product.title:''}
                                className="img-fluid" />
                        </a>
                        <div className="product_quick_view">
                            <div className="refer_product_select_option_wrapper">
                                <a  onClick={()=>product.notAvailablePopup(product.slug)} className="refer_product_select_option cursor-pointer" data-target="#producNotAvailableView" data-toggle="modal">Select Options</a>
                            </div>
                            <div className="refer_product_quickview_wrapper">
                                <a onClick={()=>product.quickView(product.product_id)} href="#" className="refer_product_quickview" data-toggle="modal" data-target="#productQucikView">Quickview</a>
                            </div>
                        </div>
                    </div>
                    <div className="refer_product_short_desc">
                        <h3 className="product_title">{product.hasOwnProperty('title')?product.title:''}</h3>
                        <span className="product_price">{product.hasOwnProperty('start_price')? CURRENCY_FORMAT(product.start_price):''}</span>
                    </div>
                </div> 
            </Fragment>
         );
    }
}
 
export default SingleProductNotAvailable;