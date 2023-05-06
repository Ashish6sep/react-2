import React,{PureComponent,Fragment} from 'react';
import Parser from 'html-react-parser';
import { NavLink } from 'react-router-dom';
import { AJAX_PUBLIC_REQUEST, PUBLIC_URL } from '../../Constants/AppConstants';

class CancellationProcess extends PureComponent {
    constructor(props){
        super(props)
        this.state = {
            loading:true,
        }
    }

    componentDidMount() {
        this.setState({
            loading:false,
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
                                                <div className="montserrat page-title">Cancellation Information</div>
                                                <p><strong>SUBSCRIPTION PLAN, AUTOMATIC PAYMENT, AND CANCELLATION</strong></p>



<p>When visiting the Website, you may have the option of purchasing a product one time or through Prestige Labs’ subscription plan where the payment card you provide at the time of enrollment is automatically charged each month until you cancel. &nbsp;</p>



<p>IF YOU ENROLL IN THE PRESTIGE LABS’ SUBSCRIPTION PLAN, THE PAYMENT CARD YOU PROVIDE AT YOUR INITIAL PURCHASE WILL BE AUTOMATICALLY BILLED AND THE PRODUCT SHIPPED EVERY 30 DAYS FROM THE DATE OF YOUR INITIAL ENROLLMENT UNLESS YOU CANCEL. &nbsp;IF YOU WISH TO CANCEL YOUR SUBSCRIPTION, YOU MAY DO SO AT ANY TIME, HOWEVER, YOU MUST CANCEL YOUR SUBSCRIPTION&nbsp;<strong>14 DAYS PRIOR TO THE SHIPMENT OF YOUR NEXT SCHEDULED ORDER</strong>. TO CANCEL YOUR SUBSCRIPTION, PLEASE LOG INTO YOUR PRESTIGE LABS ACCOUNT AT&nbsp;<a href={`${PUBLIC_URL}my-account`} target="_blank">PRESTIGELABS.COM/MY-ACOUNT</a>. IF YOU HAVE ANY ISSUES SIMPLY EMAIL US AT&nbsp;<a href="mailto:support@prestigelabs.com">SUPPORT@PRESTIGELABS.COM</a>.</p>



<p>If you choose to enroll in Prestige Labs’ subscription plan using a credit card and your credit card fails to process for a subsequent shipment, you agree that we may continue attempting to process your payment as well as contact you on any phone number (including a cell phone number) or e-mail address provided by you for alternate payment information. &nbsp;If you fail to pay for any product or service received, your account may be sent for collection. In the event we start collection processes of any type, you will be liable for all collection costs, including legal fees and expenses, as provided in Section 17&nbsp;below.&nbsp;</p>
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

export default CancellationProcess;