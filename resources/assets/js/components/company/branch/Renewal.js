import React from 'react'

import {data as tempModel} from './application/data-renewal'
import {DataContext, Redirect, ContextForm} from '../../Common'
import BranchRenewalForm from './BranchRenewalForm'
import LiaisonRenewalForm from './LiaisonRenewalForm'

export default class Renewal extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            model: props.model || {},
            // model: props.model || tempModel,
        };
    }
    submit(){
        if(this.props.wizard){
            this.beforeSubmit();
        }
        else{
            this.setState({busy: true});
            this.state.model.service_type_id = this.branch.service_type_id;
            api.post('/branch/' + this.branch.id + '/renew', this.state.model).then((res)=>{
                this.setState({busy: false});
                if(res.success){
                    this.branch.status_id = __app.LOOKUP.ApplicationStatus.PAYMENT_PENDING;
                    this.props.history.push('/branch/fees/' + this.branch.id);
                }
                else{
                    this.setState({errors: res.errors});
                }
            });
        }
    }
    beforeSubmit(){
        this.setState({busy: true});
        this.state.model.service_type_id = this.props.wizard.model.Branch.service_type_id;
        api.post('/branch/validate-renew', this.state.model).then((res)=>{
            this.setState({busy: false});
            if(res.success){
                this.props.onBeforeSubmit(this.state.model, res);
            }
            else{
                this.setState({errors: res.errors});
            }
        });
        
    }
    render() {
        return (
            <DataContext.Consumer>
                {(company)=>{
                    if(!this.props.wizard){
                        if(!company.branch || (company.branch.status_id !== __app.LOOKUP.ApplicationStatus.APPROVED && company.branch.status_id !== __app.LOOKUP.ApplicationStatus.PAYMENT_PENDING)){
                            return <Redirect to="/branch" />;
                        }
                    }
                    this.company = company;
                    if(this.props.wizard){
                        this.branch = this.props.wizard.model.Branch;
                    }
                    else{
                        this.branch = company.branch;
                    }
                    if(this.props.location.state.editRenewal){

                        return(
                        <ContextForm target={this}>                            
                            <div className="form-footer">
                                <div className="form-group float-right">
                                    <button type="button" className={"btn btn-primary" + (this.state.busy ? " busy" : "")} disabled={this.state.busy} onClick={this.submit.bind(this)}>Submit <i className="fas fa-long-arrow-alt-right"></i></button>
                                </div>
                            </div>
                        </ContextForm>
                       );
                    }else
                    if(this.branch.status_id === __app.LOOKUP.ApplicationStatus.PAYMENT_PENDING && !this.state.payment){
                        return <Redirect to={"/branch/fees/" + this.branch.id} />;
                    }
                    return(
                        <ContextForm target={this}>
                            {this.branch.service_type_id == __app.LOOKUP.ServiceType.BRANCH ? BranchRenewalForm.call(this) : LiaisonRenewalForm.call(this)}
                            
                            <div className="form-footer">
                                {this.props.wizard ? (
                                    <div className="form-group float-left">
                                        <button type="button" className="btn btn-light" onClick={this.props.onBack}><i className="fas fa-long-arrow-alt-left"></i> Back</button>
                                    </div>
                                ) : null}
                                <div className="form-group float-right">
                                    <button type="button" className={"btn btn-primary" + (this.state.busy ? " busy" : "")} disabled={this.state.busy} onClick={this.submit.bind(this)}>Submit <i className="fas fa-long-arrow-alt-right"></i></button>
                                </div>
                            </div>
                        </ContextForm>
                    );
                }}
            </DataContext.Consumer>
        );
    }
}