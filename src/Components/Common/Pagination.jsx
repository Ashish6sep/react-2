import React, { Component, Fragment } from 'react';

class Pagination extends Component {
    constructor(props){
        super(props)
        this.state = {}
    }

    render() {
        
        const total_records       =parseInt(this.props.total_records);
        const total_page          =parseInt(this.props.total_page);
        const per_page            =parseInt(this.props.per_page);
        const pagenum             =parseInt(this.props.pagenum);

        let ignore_3 = false;
        let first_button = '';
        let middle_button = '';
        let last_button = '';
        let previous_button = '';
        let next_button = '';

        if((pagenum === 1) && (total_page===2)){
            ignore_3 = true;
            previous_button = (<li className="page-item disabled">
                                    <span className="page-link" aria-label="Previous" >
                                        <span aria-hidden="true">&laquo;</span>
                                        <span className="sr-only">Previous</span>
                                    </span>
                                </li>);
            first_button = (<li className="page-item active">
                                <span className="page-link">{pagenum}</span>
                            </li>);
            middle_button = (<li data-page={pagenum+1} onClick={(e) => this.props.pagenationHandle(e.currentTarget.dataset.page)} className="page-item">
                                <span className="page-link">{pagenum+1}</span>
                            </li>);
            next_button = (<li className="page-item">
                                <span  data-page={total_page} onClick={(e) => this.props.pagenationHandle(e.currentTarget.dataset.page)} className="page-link" aria-label="Next">
                                    <span aria-hidden="true">&raquo;</span>
                                    <span className="sr-only">Next</span>
                                </span>
                            </li>);
        }else if((pagenum === 2) && (total_page===2)){
            ignore_3 = true; 
            previous_button = (<li className="page-item">
                                    <span className="page-link" aria-label="Previous" data-page={1} onClick={(e) => this.props.pagenationHandle(e.currentTarget.dataset.page)}>
                                        <span aria-hidden="true">&laquo;</span>
                                        <span className="sr-only">Previous</span>
                                    </span>
                                </li>);
            first_button = (<li data-page={pagenum-1} onClick={(e) => this.props.pagenationHandle(e.currentTarget.dataset.page)} className="page-item">
                                <span className="page-link">{pagenum-1}</span>
                            </li>); 
            middle_button = (<li className="page-item active">
                                <span className="page-link">{pagenum}</span>
                            </li>);
            next_button = (<li className="page-item disabled">
                                <span className="page-link" aria-label="Next">
                                    <span aria-hidden="true">&raquo;</span>
                                    <span className="sr-only">Next</span>
                                </span>
                            </li>);
        }else if(pagenum === total_page){ 
            previous_button = (<li className="page-item">
                                    <span className="page-link" aria-label="Previous" data-page={1} onClick={(e) => this.props.pagenationHandle(e.currentTarget.dataset.page)}>
                                        <span aria-hidden="true">&laquo;</span>
                                        <span className="sr-only">Previous</span>
                                    </span>
                                </li>);
            first_button = (<li data-page={pagenum-2} onClick={(e) => this.props.pagenationHandle(e.currentTarget.dataset.page)} className="page-item">
                                <span className="page-link">{pagenum-2}</span>
                            </li>); 
            middle_button = (<li data-page={pagenum-1} onClick={(e) => this.props.pagenationHandle(e.currentTarget.dataset.page)} className="page-item">
                                <span className="page-link">{pagenum-1}</span>
                            </li>); 
            last_button = (<li className="page-item active">
                                <span className="page-link">{pagenum}</span>
                            </li>);
            next_button = (<li className="page-item disabled">
                                <span className="page-link" aria-label="Next">
                                    <span aria-hidden="true">&raquo;</span>
                                    <span className="sr-only">Next</span>
                                </span>
                            </li>);
        }else if((pagenum === 1) && (total_page >=3)){
            previous_button = (<li className="page-item disabled">
                                <span className="page-link" aria-label="Previous">
                                    <span aria-hidden="true">&laquo;</span>
                                    <span className="sr-only">Previous</span>
                                </span>
                            </li>);
            first_button = (<li className="page-item active">
                                <span className="page-link">{pagenum}</span>
                            </li>);
            middle_button = (<li data-page={pagenum+1} onClick={(e) => this.props.pagenationHandle(e.currentTarget.dataset.page)} className="page-item">
                                <span className="page-link">{pagenum+1}</span>
                            </li>);
            last_button = (<li data-page={pagenum+2} onClick={(e) => this.props.pagenationHandle(e.currentTarget.dataset.page)} className="page-item">
                                <span className="page-link">{pagenum+2}</span>
                            </li>);
            next_button = (<li className="page-item">
                                <span  data-page={total_page} onClick={(e) => this.props.pagenationHandle(e.currentTarget.dataset.page)} className="page-link" aria-label="Next">
                                    <span aria-hidden="true">&raquo;</span>
                                    <span className="sr-only">Next</span>
                                </span>
                            </li>);
        }else{
            previous_button = (<li className="page-item">
                                    <span className="page-link" aria-label="Previous" data-page={1} onClick={(e) => this.props.pagenationHandle(e.currentTarget.dataset.page)}>
                                        <span aria-hidden="true">&laquo;</span>
                                        <span className="sr-only">Previous</span>
                                    </span>
                                </li>); 
            first_button = (<li data-page={pagenum-1} onClick={(e) => this.props.pagenationHandle(e.currentTarget.dataset.page)} className="page-item">
                                <span className="page-link">{pagenum-1}</span>
                            </li>); 
            middle_button = (<li className="page-item active">
                                <span className="page-link">{pagenum}</span>
                            </li>);
            last_button = (<li data-page={pagenum+1} onClick={(e) => this.props.pagenationHandle(e.currentTarget.dataset.page)} className="page-item">
                                <span className="page-link">{pagenum+1}</span>
                            </li>);
            next_button = (<li className="page-item">
                                <span  data-page={total_page} onClick={(e) => this.props.pagenationHandle(e.currentTarget.dataset.page)} className="page-link" aria-label="Next">
                                    <span aria-hidden="true">&raquo;</span>
                                    <span className="sr-only">Next</span>
                                </span>
                            </li>);
        }

        if(total_page > 1){
            return (
                <Fragment>
                    <div className="tablenav">
                        <div className="tablenav-pages">
                            <nav  className="text-center">
                                <ul className="pagination cus_pagination">
                                    {
                                        ignore_3 ? 
                                            <Fragment>
                                                {previous_button}
                                                {first_button}
                                                {middle_button}
                                                {next_button}
                                            </Fragment>
                                        :
                                            <Fragment>
                                                {previous_button}
                                                {first_button}
                                                {middle_button}
                                                {last_button}
                                                {next_button}
                                            </Fragment>
                                    }
                                </ul>
                            </nav>
                        </div>
                    </div>
                </Fragment>
            );
        }else{
            return null;
        }
    }
}
 
export default Pagination;