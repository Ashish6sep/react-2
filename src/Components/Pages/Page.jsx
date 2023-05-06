import React,{PureComponent,Fragment} from 'react';
import Parser from 'html-react-parser';
import { AJAX_PUBLIC_REQUEST } from '../../Constants/AppConstants';

class Page extends PureComponent {
    constructor(props){
        super(props)
        this.state = {
            loading:true,
            page: '',
        }
    }

    componentDidMount() {
        this.getPageContent();
    }

    componentDidUpdate(nextProps, nextState) {
        if(nextProps !== this.props) {
            this.getPageContent();
        }        
    }

    getPageContent = (e) => {
        this.setState({ loading:true });
        document.querySelector("body").scrollIntoView();
        AJAX_PUBLIC_REQUEST("POST", "page/getContents", {page_slug:this.props.match.params.slug}).then(results => {
            if(parseInt(results.response.code)===1000) {
                this.setState({
                    page: results.response.data,
                    loading:false,
                });	
                document.title = results.response.data.title;	
            } else {
                this.setState({ 
                    error: Parser("<p className='text-danger'>"+results.response.message+"</p>"),
                    loading:false,
                })
            }            
        });
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
                                    <div className="col-md-12">
                                        <main className="site-content terms_and_condition">
                                            <div className="page-content entry-content">
                                                {/* <TestPage page_slug={this.props.match.params.slug} /> */}
                                                <div className="montserrat page-title">{ this.state.page.hasOwnProperty('title')? Parser(this.state.page.title) : this.state.error }</div>
                                                { this.state.page.hasOwnProperty('contents')? Parser(this.state.page.contents) : this.state.error }
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

export default Page;