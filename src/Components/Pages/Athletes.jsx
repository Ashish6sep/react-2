import React,{ Fragment, PureComponent} from 'react';
import ReactImageFallback from "react-image-fallback";
import Parser from 'html-react-parser';
import { AJAX_PUBLIC_REQUEST } from '../../Constants/AppConstants';

import Masonry from 'react-masonry-component';
const masonryOptions = { transitionDuration: 0 }; 
const imagesLoadedOptions = { background: '.loading' }

class Athletes extends PureComponent {
    constructor(props){
        super(props)
        this.state = {
            loading:true,
            athletes: [],
        }
        document.title = "Athletes -Prestige Labs";
    }

    componentDidMount() {
        document.querySelector("body").scrollIntoView();
        this.getAthletes();
    }

    getAthletes = () => {
		AJAX_PUBLIC_REQUEST("POST", "page/getAthletesfo", {}).then(results => {
            if(parseInt(results.response.code)===1000) {
                this.setState({
                    athletes: results.response.data
                });
                setTimeout(function(){
                    this.setState({
                        loading:false,
                    });
                }.bind(this),3000);
            } else {
                this.setState({ 
                    error: Parser("<p className='text-danger'>"+results.response.message+"</p>"),
                    loading:false,
                })
            }            
        });
    }

    render() {

        return(
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
                                            <h3 className="montserrat page-title">ATHLETES</h3>
                                            <div className="grid">
                                            
                                                <Masonry
                                                    className={'my-gallery-class'} // default ''
                                                    elementType={'ul'} // default 'div'
                                                    options={masonryOptions} // default {}
                                                    disableImagesLoaded={false} // default false
                                                    updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
                                                    imagesLoadedOptions={imagesLoadedOptions} // default {}
                                                >
                                                    {
                                                        (this.state.athletes.length <= 0 )? this.state.error :
                                                        this.state.athletes.map(function(image, key) {
                                                            return (
                                                                <Fragment key={Math.random()}>
                                                                    <li className="grid-item">
                                                                        <div className="thumbnail">
                                                                            <img src={ image.hasOwnProperty('image_url')? image.image_url : '' } alt={ image.hasOwnProperty('title')? image.title : '' } />
                                                                            {/* <ReactImageFallback
                                                                                src={ image.hasOwnProperty('image_url')? image.image_url : '' }
                                                                                fallbackImage={require('../../Assets/images/preloader.gif')}
                                                                                initialImage={require('../../Assets/images/preloader.gif')}
                                                                                alt={ image.hasOwnProperty('title')? image.title : '' }
                                                                                /> */}
                                                                            <div className="caption">
                                                                                <h3>{ image.hasOwnProperty('title')? image.title : '' }</h3>
                                                                            </div>
                                                                        </div>
                                                                    </li> 
                                                                </Fragment>                                                      
                                                            )                    
                                                        }.bind(this))
                                                    }
                                                </Masonry>                                    

                                            </div>
                                        </main>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Fragment>
                }                
            </Fragment>
        )
    }

}
 
export default Athletes;