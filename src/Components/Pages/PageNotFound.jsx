import React,{PureComponent, Fragment} from 'react';
import Parser from 'html-react-parser';

class PageNotFound extends PureComponent {
    constructor(props){
        super(props)
        this.state = { loading:true, }
        document.title = "Page Not Found -Prestige Labs";
    }

    componentDidMount() {
        this.setState({ loading: false });
        document.querySelector("body").scrollIntoView();
    }
    
    render() { 
        return ( 
            <Fragment>
                {
                    this.state.loading ? 
                    <div className="loading container full_page_loader"></div>
                    :
                    <Fragment>
                        <div className="site-main">   
                            <div className="container">
                                <div className="row">
                                    <div className="col-md-6">
                                        <main className="error404Img">
                                            <img className="" src={require('../../Assets/images/404.png')} />
                                        </main>
                                    </div>
                                    <div className="col-md-6">
                                        <main className="error404">
                                            <div className="page-content entry-content">
                                                <h1 className="page-title">It's a 404</h1>
                                                <span className="subtitle">This page is not found</span>
                                                <p>Sorry, but the page you are looking for is not found. Please, make sure you have typed the correct URL.</p>
                                            </div>
                                        </main>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Fragment>
                }
            </Fragment>
         );
    }
}

export default PageNotFound;