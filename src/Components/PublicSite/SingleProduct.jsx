import React, { Fragment, PureComponent } from 'react';
import { NavLink } from "react-router-dom";
import ReactImageFallback from "react-image-fallback";
import { CURRENCY_FORMAT } from '../../Constants/AppConstants';

class SingleProduct extends PureComponent {
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
                        <NavLink className="text-center refer-img-thumb" to={`/product/${product.slug}`}>
                            {/* <span className="onsale">Sale!</span>  */}
                            <ReactImageFallback
                                src={(this.props.type=='bundle')?product.main_image : product.list_image}
                                fallbackImage={require('../../Assets/images/preloader.gif')}
                                initialImage={require('../../Assets/images/preloader.gif')}
                                alt={product.hasOwnProperty('title')?product.title:''}
                                className="img-fluid" />
                        </NavLink>
                        <div className="product_quick_view">
                            <div className="refer_product_select_option_wrapper">
                                <NavLink to={`/product/${product.slug}`} className="refer_product_select_option">Select Options</NavLink>
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
 
export default SingleProduct;