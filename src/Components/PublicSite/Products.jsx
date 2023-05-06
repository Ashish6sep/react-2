import React, { Fragment, PureComponent } from 'react';
import Parser from 'html-react-parser';
import {NavLink} from 'react-router-dom';
import { AJAX_PUBLIC_REQUEST } from '../../Constants/AppConstants';
import SingleProductListGrid from './SingleProductListGrid';
import SingleProductModal from './SingleProductModal';
import Pagination from '../Common/Pagination';
import SingleProductNotAvailableModal from './SingleProductNotAvailableModal';
import SingleProductNotAvailable from './SingleProductNotAvailable'


class Products extends PureComponent {
    constructor(props) {
        super(props);
        this.state = { 
            loading: true,
            products: [],
            productDetails:{},
            filter_by: 'popular',
            listView: false,
            ProductLink:'',
            productNotAvailable:["Bulletproof Vitality For Her","Women's Ultimate","Women's Immune Booster"],
            // productNotAvailable:[],
            // Pagination Config
            item_count      :0,
            total_records   :0,
            total_page      :0,
            per_page        :0,
            pagenum         :1,
         }
         document.title = "Products -Prestige Labs";
    }

    componentDidMount() {
        document.querySelector("body").scrollIntoView();
        this.getProducts(this.state.filter_by, this.state.pagenum);
    }

    pagenationHandle= (pageNumber)=>{
        this.setState({ loading:true });
        this.getProducts(this.state.filter_by, pageNumber);        
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
        this.getProducts(filter_by, 1);
    }

    getProducts = (filterBy, pageNumber) => {
        const data = { 
            filter_by: filterBy,
            pagenum : parseInt(pageNumber)
        }
		AJAX_PUBLIC_REQUEST("POST", "product/getList", data).then(results => {
            if(results.response.code===1000) {
                this.setState({
                    products: results.response.data,
                    loading:false,
                    // Pagination Config
                    item_count      :parseInt(results.response.data.length),
                    total_records   :parseInt(results.response.total_records),
                    total_page      :parseInt(results.response.total_page),
                    per_page        :parseInt(results.response.per_page),
                    pagenum         :parseInt(results.response.pagenum),
                });		
            } else {
                this.setState({ 
                    error: Parser("<p className='text-danger'>"+results.response.message+"</p>"),
                    loading:false,
                    // Pagination Config
                    item_count      :0,
                    total_records   :0,
                    total_page      :0,
                    per_page        :0,
                    pagenum         :1,
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

    notAvailablePopup=(link)=>{
        this.setState({
            ProductLink: link,
        });
    }

    render() { 

        const quickView = this.quickView;
        const notAvailablePopup=this.notAvailablePopup;

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
                                                    <li className="breadcrumb-item active" aria-current="page">Shop</li>
                                                </ol>
                                            </nav>

                                            <h3 className="montserrat page-title">SHOP</h3>

                                            <div className="view-controls-wrapper">
                                                <p className="pull-left"> 
                                                    Showing &nbsp;
                                                    {
                                                        (this.state.pagenum <= 1)?
                                                        this.state.pagenum +"-"+ this.state.item_count
                                                        :
                                                        (((this.state.pagenum - 1) * this.state.per_page) + Number(1)) +"-"+ (((this.state.pagenum - 1) * this.state.per_page) + Number(this.state.item_count))
                                                    }
                                                    &nbsp; of {this.state.total_records} results
                                                </p>
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
                                                        product.notAvailablePopup = this.state.productNotAvailable.includes(product.title)?this.notAvailablePopup:"";
                                                        // Added product quickviewer
                                                        product.quickView = this.quickView
                                                        return (
                                                            (this.state.topSellerShow <= key) ? ''
                                                            :
                                                            (this.state.productNotAvailable.includes(product.title))?
                                                            <div key={Math.random()} className={ this.state.listView? 'col-xs-12 col-sm-4 col-md-4 col-lg-3 list_view' : 'col-xs-12 col-sm-4 col-md-4 col-lg-3' }>
                                                                    <SingleProductNotAvailable product={product} type='topSeller' />
                                                                </div>:
                                                            <div key={Math.random()} className={ this.state.listView? 'col-xs-12 col-sm-4 col-md-4 col-lg-3 list_view' : 'col-xs-12 col-sm-4 col-md-4 col-lg-3' }>
                                                                <SingleProductListGrid key={key} product={product} />
                                                            </div>                                                         
                                                        )                    
                                                    }.bind(this))
                                                }        
                                                
                                            </div>
                                            <Pagination
                                                pagenationHandle    ={this.pagenationHandle}
                                                total_records       ={this.state.total_records}
                                                total_page          ={this.state.total_page}
                                                per_page            ={this.state.per_page}
                                                pagenum             ={this.state.pagenum}
                                            />
                                        </main>
                                    </div>                                    
                                </div>
                                <SingleProductModal product={this.state.productDetails} />
                                <SingleProductNotAvailableModal productLink={this.state.ProductLink} />
                            </div>
                        </div>
                    </Fragment>
                }
            </Fragment>
         );
    }
}
 
export default Products;