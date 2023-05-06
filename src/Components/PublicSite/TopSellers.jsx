import React, { Fragment, PureComponent } from 'react';
import Parser from 'html-react-parser';
import {NavLink} from 'react-router-dom';
import { AJAX_PUBLIC_REQUEST } from '../../Constants/AppConstants';
import SingleProductListGrid from './SingleProductListGrid';
import SingleProductModal from './SingleProductModal';

class TopSellers extends PureComponent {
    constructor(props) {
        super(props);
        this.state = { 
            loading: true,
            products: [],
            productDetails:{},
            filter_by: 'popular',
            totalProduct: 0,
            listView: false,
         }
         document.title = "Top Sellers -Prestige Labs";
    }

    componentDidMount() {
        document.querySelector("body").scrollIntoView();
        this.getProducts(this.state.filter_by);
    }

    gridListView = (e) => {
        this.setState({ listView: !this.state.listView })
    }

    filterBy = (e) => {
        let filter_by = e.target.value;
        this.setState({ 
            loading: true,
            [e.target.name]: filter_by 
        })
        this.getProducts(filter_by);
    }

    getProducts = (filterBy) => {
        const data = { filter_by: filterBy, type: 'single' }
		AJAX_PUBLIC_REQUEST("POST", "product/getList", data).then(results => {
            if(parseInt(results.response.code)===1000) {
                this.setState({
                    products: results.response.data,
                    totalProduct: results.response.data.length,
                    loading:false,
                });		
            } else {
                this.setState({ 
                    error: Parser("<p className='text-danger'>"+results.response.message+"</p>"),
                    loading:false,
                })
            }            
        });
    }

    quickView = (productId) => {
        this.setState({productDetails:{}})
        const data = { 
            product_id: productId,
        }
		AJAX_PUBLIC_REQUEST("POST", "product/getDetails", data).then(results => {
            if(parseInt(results.response.code)===1000) {
                this.setState({
                    productDetails: results.response.data,
                });		
            } else {
                this.setState({ 
                    error: Parser("<p className='text-danger'>"+results.response.message+"</p>"),
                })
            }            
        });
    }

    render() { 

        const quickView = this.quickView;

        return ( 
            <Fragment>
                {
                    (this.state.loading)?
                    <div className="loading container full_page_loader"></div>
                    :
                    <Fragment>
                        <div className="site-wrapper">
                            <div className="container">
                                <div className="row">
                                    <div className="col-md-12">
                                        <main className="athletes_list_wrapper">    
                                            <nav aria-label="breadcrumb">
                                                <ol className="breadcrumb cus_breadcrumb">
                                                    <li className="breadcrumb-item"><NavLink to="/">Home</NavLink></li>
                                                    <li className="breadcrumb-item active" aria-current="page">Top Sellers</li>
                                                </ol>
                                            </nav>

                                            <h3 className="montserrat page-title">Top Sellers</h3>

                                            <div className="view-controls-wrapper">
                                                <p className="pull-left"> Showing all {this.state.totalProduct} results</p>
                                                <div className="pull-left list-grid-switcher">
                                                    <span onClick={this.gridListView} className={ !this.state.listView? 'active' : '' } title="Grid View"><i className="fa fa-th" aria-hidden="true"></i></span>
                                                    <span onClick={this.gridListView} className={ this.state.listView? 'list active' : 'list' } title="List View"><i className="fa fa-th-list" aria-hidden="true"></i></span>
                                                </div>

                                                <div className="pull-right paginator">
                                                    <span className="shop-label">Filter By</span>
                                                    <form className="product-pager" method="get">
                                                    <select onChange={this.filterBy} value={this.state.filter_by} name="filter_by" className="roboto_condensed orderby">
                                                        <option value="popular">Sort by popularity</option>
                                                        <option value="latest">Sort by latest</option>
                                                        <option value="price_low">Sort by price: low to high</option>
                                                        <option value="price_heigh">Sort by price: high to low</option>
                                                    </select>
                                                    </form>
                                                </div>
                                                <div className="clearfix"></div>
                                            </div>

                                            <div className="row">
                                                {
                                                    (this.state.products.length <= 0 )? this.state.error :
                                                    this.state.products.map(function(product, key) {
                                                        // Added product quickviewer
                                                        product.quickView = this.quickView
                                                        return (
                                                            (this.state.topSellerShow <= key) ? ''
                                                            :
                                                            <div key={Math.random()} className={ this.state.listView? 'col-xs-12 col-sm-4 col-md-4 col-lg-3 list_view' : 'col-xs-12 col-sm-4 col-md-4 col-lg-3' }>
                                                                <SingleProductListGrid key={key} product={product} />
                                                            </div>                                                         
                                                        )                    
                                                    }.bind(this))
                                                }        
                                                
                                            </div>
                                        </main>
                                    </div>
                                </div>
                                <SingleProductModal product={this.state.productDetails} />
                            </div>
                        </div>
                    </Fragment>
                }
            </Fragment>
         );
    }
}
 
export default TopSellers;