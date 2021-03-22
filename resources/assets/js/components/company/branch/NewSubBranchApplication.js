import React from 'react'

import {newApplicationModel as tempModel} from './application/data'
import CompanyInfo from './application/ApplicationS2'
import { SubBranchForm as SubBranchInfo } from './application/ApplicationS1'
import Preview from './Profile'
import Fees from './Fees'
import {DataContext, Redirect} from '../../Common'
import api from '../../../config/app';
import { isMainBranch, isBranch } from '../../../helper/common'

export default class SubBranchApplication extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            step: 1,
            model: {},
            // model: {Branch: {desired_location: 'Loc', desired_places: 'Place', business_info: 'Info'}},
        };
        this.__steps = [1,2];
    }
    next(model){
        this.setState({step: this.state.step + 1, model});
    }
    back(errors, model){
        this.setState({step: this.state.step - 1, errors, model, review: null});
    }
    beforeSubmit(model, res){
        this.setState({review: model, fee: res.fee, model, step: this.state.step + 1});
    }
    render() {
        return (
            <DataContext.Consumer>
                {(company)=>{
                    let ServiceType = __app.LOOKUP.ServiceType;
                    let doCovert = company.branch && this.props.convert;
                    this.company = company;
                    this.doRenew = this.company.was_permitted && !this.company.branch;
                    if(company.status_id !== __app.LOOKUP.ApplicationStatus.APPROVED){
                        return <Redirect to="/" />;
                    }
                    if(!company.branch || company.branch.status_id !== __app.LOOKUP.ApplicationStatus.APPROVED){
                        return <Redirect to="/branch" />;
                    }
                    return(
                    <div className="container-fluid container-light">
                        <div className="container">        
                            <div className="content-container">
                                <div className="section progress-section">
                                    <div className="section-inner">
                                        <div className="widget widget-progress">
                                            <div className="widget-inner">
                                                <ul className={"progress-steps steps-" + this.__steps.length}>
                                                {this.__steps.map(($i)=>{
                                                    return <li key={$i} className={this.state.step == $i ? 'active' : (this.state.step > $i ? 'done' : 'disabled')}><a href="#">{$i}</a></li>
                                                })}
                                                </ul>
                                            </div>
                                        </div>
                                        {(()=>{
                                            if(this.state.step == 1){
                                               return <CompanyInfo model={this.state.model} company={company} onNext={this.next.bind(this)} subBranch={true} />;
                                            }
                                            if(this.state.step == 2){
                                                return <SubBranchInfo model={this.state.model} company={company} onBeforeSubmit={this.beforeSubmit.bind(this)} onBack={this.back.bind(this)} />;
                                            }
                                            if(this.state.review){
                                                return <PreviewModel company={company} application={this.state.review} fee={this.state.fee} onBack={()=>{this.setState({review: null}); this.back(null, this.state.model)}}/>
                                            }
                                        })()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    );
                }}
            </DataContext.Consumer>
        );
    }
}

class PreviewModel extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            proceedToPayment: false,
            busy: false
        };
    }
    back(){
        this.props.onBack();
    }
    submit(){
        if(this.props.fee){
            this.setState({proceedToPayment: true});
        }
        else{
            this.setState({busy: true});
            api.post('/sub-branch/before-submit', this.props.application).then((res)=>{
                this.fee = res.fee;
                this.setState({busy: false, proceedToPayment: true});
            });
        }
    }
    submitManualPayment(data, onSuccess, onError){
        this.props.application.Payment = data;
        api.post('/sub-branch/after-review', this.props.application).then((res)=>{
            if(res.success){
                onSuccess && onSuccess();
            }
            else{
                if(res.errors && res.errors.Payment){
                    onError && onError(res.errors.Payment);
                }
            }
        });
    }
    componentDidMount(){
        document.getElementById("app").scrollTop = 0;
    }
    render(){
        if(this.state.proceedToPayment){
            return <Fees preview={true} payment={this.props.fee || this.fee} 
                subBranch={true}
                branch={this.state.branch}
                onBack={()=>{this.setState({proceedToPayment: false})}}
                onManualPayment={this.submitManualPayment.bind(this)}
            />;
        }
        return (
            <div className="preview">
                <h3 className="text-primary">Review Application Before Submit</h3>
                <Preview application={this.props.application} preview={true} subBranch={true}/>
					
                <div className="form-footer">
                    <div className="form-group float-left">
                        <button type="button" className="btn btn-light" onClick={this.back.bind(this)}><i className="fas fa-long-arrow-alt-left"></i> Back</button>
                    </div>
                    <div className="form-group float-right">
                        <button type="button" className={"btn btn-primary" + (this.state.busy ? ' busy' : '')} disabled={this.state.busy} onClick={this.submit.bind(this)} >Proceed to Payment <i className="fas fa-long-arrow-alt-right"></i></button>
                    </div>
                </div>
            </div>
        );
    }
}