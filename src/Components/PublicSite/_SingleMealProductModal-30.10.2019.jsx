import React, { Fragment, PureComponent } from "react";
import ReactImageFallback from "react-image-fallback";
import Parser from "html-react-parser";

class SingleMealProductModal extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: true
        };
    }

    componentDidUpdate(nextProps, nextState) {
        if (nextProps !== this.props) {
            this.setState({
                loading: false
            });
        }
    }

    render() {
        const mealItemDetails = this.props.mealItemDetails;

        return (
            <Fragment>
                <div
                    className="modal fade mob_modal"
                    id="mealProductQucikView"
                    tabIndex="-1"
                    role="dialog"
                    aria-labelledby="exampleModalLongTitle"
                    aria-hidden="true"
                >
                    <div className="modal-dialog modal-dialog-centered product-view-modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal_close">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="modal_product_view">
                                    <div className="modal_product_view_img">
                                        <ReactImageFallback
                                            src={
                                                mealItemDetails.hasOwnProperty("big_image")
                                                    ? mealItemDetails.big_image
                                                    : ""
                                            }
                                            fallbackImage={require("../../Assets/images/preloader.gif")}
                                            initialImage={require("../../Assets/images/preloader.gif")}
                                            alt={mealItemDetails.hasOwnProperty("title") ? mealItemDetails.title : ""}
                                            className="img-fluid"
                                        />
                                        {/* <img src={mealItemDetails.big_image} alt="" title="" /> */}
                                    </div>
                                    <div className="modal_product_view_desc">
                                        <h3>{mealItemDetails.hasOwnProperty("title") ? mealItemDetails.title : ""}</h3>
                                        <div className="nutritional-facts">
                                            <h3 className="meals_sub_title">Nutritional Facts</h3>
                                            <ul className="nutritional-facts__summary">
                                                {mealItemDetails.hasOwnProperty("nutritional_facts") &&
                                                mealItemDetails.nutritional_facts.length > 0
                                                    ? mealItemDetails.nutritional_facts.map(
                                                          function(nutritional_facts_single, key) {
                                                              return (
                                                                  <li key={Math.random()}>
                                                                      <label>{nutritional_facts_single.fact}</label>
                                                                      <span className="pull-right">
                                                                          {nutritional_facts_single.value}
                                                                      </span>
                                                                  </li>
                                                              );
                                                          }.bind(this)
                                                      )
                                                    : ""}
                                            </ul>
                                        </div>
                                        <div className="">
                                            <h3 className="meals_sub_title">Description</h3>
                                            {mealItemDetails.hasOwnProperty("description")
                                                ? Parser(mealItemDetails.description)
                                                : ""}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default SingleMealProductModal;
