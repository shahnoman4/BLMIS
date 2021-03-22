import React from 'react'
import {DataContext, Redirect} from '../../Common'
import Grid from '../../Grid'

export default class SubBranches extends React.Component{
    constructor(props){
        super(props);
        
        this.state = {
            busy: false,
            data: []
        }

        this.options = {
            grid: {
                table: {props: {className: "table table-striped"}},
                thead: {props: {className: "thead-dark"}},
                th: {props: {scope: "col"}},
                columns: [
                    {field: "id", title: "SR.#"},
                    // {
                    //     field: "local_sponsor.location.city", title: "BRANCH NAME", template: (value)=>{
                    //         return value ? value + ' Office' : '';
                    //     }
                    // },
                    {
                        field: "desired_location", title: "INTENDED LOCATION(S)", template: (value)=>{
                            return value ? value + ' Office' : '';
                        }
                    },
                    // {field: "company.name", title: "COMPANY NAME", template: ()=>_.get(this.company, 'name', '')},
                    {
                        field: "status_id", title: "STATUS", template: (value)=>{
                            return __app.LOOKUP.text('ApplicationStatus', value)
                        }
                    },
                    {
                        title: "ACTIONS", template: (vlaue, data)=>{
                            let history = this.props.history;
                            return <button className="btn btn-outline-primary" onClick={()=>{
                                history.push("/sub-branch/" + data.id);
                            }}>View</button>
                        }
                    },
                ]
            }
        }
    }
    componentDidMount(){
        if(this.branch && this.branch.status_id !== __app.LOOKUP.ApplicationStatus.PAYMENT_PENDING){
            this.fetchData();
        }
    }
    fetchData(){
        this.setState({busy: true});
        api.get('/sub-branches').then((res)=>{
            this.setState({busy: false, data: res});
        });
    }
    addNewApp(){
        this.props.history.push('/sub-branch/apply');
    }
    render(){
        return(
            <DataContext.Consumer>
            {(company)=>{
                this.company = company;
                if(!company.branch){
                    return <Redirect to='/' />;
                }
                let {branch, ...rest} = company;
                this.branch = branch;
                branch.company = rest;
                let ApplicationStatus = __app.LOOKUP.ApplicationStatus;
                if(branch.status_id === ApplicationStatus.PAYMENT_PENDING){
                    return <Redirect to='/branch/renew' />
                }

                return(
                    <React.Fragment>
                        <div className='form-group'>
                          <h5> New Applications
                        { branch.status_id == ApplicationStatus.APPROVED ?
                            <button className='btn btn-success float-right' onClick={this.addNewApp.bind(this)}>NEW APPLICATION</button>
                            : null
                        }
                         </h5>
                        </div>
                        <div className='clearfix'></div>
                        <div className="widget info-table">
                            <div className="d-flex">
                                <div className="col font-weight-bold">Company Name</div>
                                <div className="col">{_.get(company, 'name')}</div>
                                <div className="col font-weight-bold">Branch Name</div>
                                <div className="col">{_.get(company, 'branch.local_sponsor.location.city', '')}</div>
                            </div>
                            <div className="d-flex">
                                <div className="col font-weight-bold">Contract Period</div>
                                <div className="col">{_.get(company, 'branch.contract.valid_for_years', '0')} years</div>
                                <div className="col font-weight-bold">Status</div>
                                <div className="col">{__app.LOOKUP.text('ApplicationStatus', _.get(company, 'branch.status_id'))}</div>
                            </div>
                        </div>
                        <div className="widget company-action">
                            {/* <button className="btn btn-outline-primary">Add New Contract</button> */}
                        </div>
                        
                        <div className={'data-table data-branches' + (this.state.busy ? ' busy' : '')}>
                            <Grid options={this.options.grid} data={this.state.data} />
                        </div>

                    </React.Fragment>
                );
            }}
            </DataContext.Consumer>
        );
    }
}