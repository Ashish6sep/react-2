import React, { Fragment, PureComponent } from 'react';
import ReactImageFallback from "react-image-fallback";
import Parser from 'html-react-parser';
import { AJAX_PUBLIC_REQUEST } from '../../Constants/AppConstants';
import SingleProduct from './SingleProduct';
import SingleProductNotAvailable from './SingleProductNotAvailable'
import SingleProductModal from './SingleProductModal';
import SingleProductNotAvailableModal from './SingleProductNotAvailableModal';

class Home extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            error: '',
            topSellerShow: 4,
            bundleShow: 3,
            ProductLink:'',
            banners: [],
            topSellerProduct: [],
            bundleProduct: [],
            productDetails: {},
            productNotAvailable:["Bulletproof Vitality For Her","Women's Ultimate","Women's Immune Booster"],
            // productNotAvailable:[],
            
        }
        document.title = "Prestige Labs";
    }

    componentDidMount() {
        document.querySelector("body").scrollIntoView();
        this.getBanners();
        this.getTopSellerProduct();
        this.getBundleProduct();
    }

    topSellerShow = () => {
        this.setState({
            topSellerShow: Number(this.state.topSellerShow) + 4
        })
    }

    bundleShow = () => {
        this.setState({
            bundleShow: Number(this.state.bundleShow) + 3
        })
    }

    getBanners = () => {
        AJAX_PUBLIC_REQUEST("POST", "user/getBanners", {}).then(results => {
            if (parseInt(results.response.code) === 1000) {
                this.setState({
                    banners: results.response.data.sliders,
                    loading: false,
                });
            } else {
                this.setState({
                    error: Parser("<p className='text-danger'>" + results.response.message + "</p>"),
                    loading: false,
                })
            }
        });
    }

    getTopSellerProduct = () => {
        const data = { type: 'single' }
        AJAX_PUBLIC_REQUEST("POST", "product/getList", data).then(results => {
            if (parseInt(results.response.code) === 1000) {
                this.setState({
                    topSellerProduct: results.response.data,
                    loading: false,
                });
            } else {
                this.setState({
                    error: Parser("<p className='text-danger'>" + results.response.message + "</p>"),
                    loading: false,
                })
            }
        });
    }

    getBundleProduct = () => {
        const data = { type: 'bundle' }
        AJAX_PUBLIC_REQUEST("POST", "product/getList", data).then(results => {
            if (parseInt(results.response.code) === 1000) {
                this.setState({
                    bundleProduct: results.response.data,
                    loading: false,
                });
            } else {
                this.setState({
                    error: Parser("<p className='text-danger'>" + results.response.message + "</p>"),
                    loading: false,
                })
            }
        });
    }

    quickView = (productId) => {
        this.setState({ productDetails: {} })
        const data = {
            product_id: productId,
            site: 'refer',
        }
        AJAX_PUBLIC_REQUEST("POST", "product/getDetails", data).then(results => {
            if (parseInt(results.response.code) === 1000) {
                this.setState({
                    productDetails: results.response.data,
                });
            } else {
                this.setState({
                    error: Parser("<p className='text-danger'>" + results.response.message + "</p>"),
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
                    (this.state.loading) ?
                        <div className="loading container full_page_loader"></div>
                        :
                        <Fragment>
                            <div className="site-wrapper">
                                <section className="slider">
                                    <div id="carouselControls" className="carousel slide carousel-fade refer_slider" data-ride="carousel">
                                        <div className="carousel-inner">
                                            {
                                                (this.state.banners.length <= 0) ? this.state.error :
                                                    this.state.banners.map(function (banner, key) {
                                                        return (
                                                            <div className={key == 0 ? "carousel-item active" : "carousel-item"} key={Math.random()}>
                                                                <ReactImageFallback
                                                                    src={banner.image_url}
                                                                    fallbackImage={require('../../Assets/images/banner-loader.gif')}
                                                                    initialImage={require('../../Assets/images/banner-loader.gif')}
                                                                    alt='Banner image'
                                                                    className="d-block w-100" />
                                                            </div>
                                                        )
                                                    }.bind(this))
                                            }
                                        </div>
                                        <a className="carousel-control-prev" href="#carouselControls" role="button" data-slide="prev">
                                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                            <span className="sr-only">Previous</span>
                                        </a>
                                        <a className="carousel-control-next" href="#carouselControls" role="button" data-slide="next">
                                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                            <span className="sr-only">Next</span>
                                        </a>
                                    </div>
                                </section>

                                {/* <!-- Top seller --> */}
                                <section className="top_seller_product">
                                    <div className="container">
                                        <div className="row top-product-list">
                                            <div className="col-md-12">
                                                <div className="title-wrapper">
                                                    <h3 className="montserrat shortcode-title">TOP SELLERS</h3>
                                                </div>
                                            </div>
                                            {
                                                (this.state.topSellerProduct.length <= 0) ? this.state.error :
                                                    this.state.topSellerProduct.map(function (product, key) {
                                                        product.notAvailablePopup = this.state.productNotAvailable.includes(product.title)?this.notAvailablePopup:"";
                                                        // Added product quickviewer
                                                        product.quickView = this.quickView
                                                        return (
                                                            (this.state.topSellerShow <= key) ? ''
                                                                :
                                                                (this.state.productNotAvailable.includes(product.title))?
                                                                <div key={Math.random()} className="col-xs-12 col-sm-4 col-md-4 col-lg-3 show_top_product product-item">
                                                                    <SingleProductNotAvailable product={product} type='topSeller' />
                                                                </div>:
                                                                <div key={Math.random()} className="col-xs-12 col-sm-4 col-md-4 col-lg-3 show_top_product product-item">
                                                                   
                                                                    <SingleProduct key={key} product={product} type='topSeller' />
                                                                    
                                                                </div>
                                                        )
                                                    }.bind(this))
                                            }
                                            <div className="infinite-scrolling-homepage">
                                                {
                                                    (this.state.topSellerShow >= this.state.topSellerProduct.length) ?
                                                        <a className="refer_product_select_option disabled" id="showmore" href="javascript:void(0)">No More Product</a>
                                                        :
                                                        <a onClick={this.topSellerShow} className="refer_product_select_option" id="showmore" href="javascript:void(0)">Show More</a>
                                                }

                                            </div>
                                        </div>
                                    </div>
                                </section>
                                {/* <!-- EnD Top seller --> */}

                                {/* <!-- Bundle Product --> */}
                                <section className="bundle_product">
                                    <div className="container">
                                        <div className="row top_bundle_product">
                                            <div className="col-md-12">
                                                <div className="title-wrapper">
                                                    <h3 className="montserrat shortcode-title">BUNDLE PRODUCTS</h3>
                                                </div>
                                            </div>
                                            {
                                                (this.state.bundleProduct.length <= 0) ? this.state.error :
                                                    this.state.bundleProduct.map(function (product, key) {
                                                        product.notAvailablePopup = this.state.productNotAvailable.includes(product.title)?this.notAvailablePopup:"";
                                                        // Added product quickviewer
                                                        product.quickView = this.quickView
                                                        return (
                                                            (this.state.bundleShow <= key) ? ''
                                                                :
                                                                (this.state.productNotAvailable.includes(product.title))?
                                                                <div key={Math.random()} className="col-xs-12 col-sm-4 col-md-6 col-lg-4 product-bundle-item">
                                                                    <SingleProductNotAvailable product={product} type='bundle' />
                                                                </div>:
                                                                <div key={Math.random()} className="col-xs-12 col-sm-4 col-md-6 col-lg-4 product-bundle-item">
                                                                   
                                                                    <SingleProduct key={key} product={product} type='bundle' />
                                                                    
                                                                </div>
                                                        )
                                                    }.bind(this))
                                            }
                                            <div className="infinite-scrolling-homepage">
                                                {
                                                    (this.state.bundleShow >= this.state.bundleProduct.length) ?
                                                        <a className="refer_product_select_option disabled" id="showmorebundleproduc" href="javascript:void(0)">No More Product</a>
                                                        :
                                                        <a onClick={this.bundleShow} className="refer_product_select_option" id="showmorebundleproduc" href="javascript:void(0)">Show More</a>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </section>
                                {/* <!-- EnD Bundle Product --> */}
                            </div>

                            <SingleProductModal product={this.state.productDetails} />
                            <SingleProductNotAvailableModal productLink={this.state.ProductLink} />

                        </Fragment>
                }
            </Fragment>
        );
    }
}

export default Home;