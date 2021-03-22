import React from 'react'

import {newApplicationModel as tempModel} from './application/data'
import Step1 from './application/ApplicationS2'
import Step2 from './application/ApplicationS3'
import {DataContext, Redirect} from '../../Common'
import { notify } from '../../../helper/common';

export default class NewContract extends React.Component{
    constructor(props){
        let __tempModel = {Contract: tempModel.Contract, PartnerCompanies: tempModel.PartnerCompanies};
        super(props);
        this.state = {
            busy: false,
            step: 1,
            model: {},
            // model: __tempModel,
        };
    }
    next(model){
        this.setState({step: this.state.step + 1, model});
    }
    back(errors, model){
        this.setState({step: this.state.step - 1, errors, model});
    }
    submit(model){
        let id = _.get(this.props, 'history.location.state.contractId');
        console.log(id);
        this.setState({busy: true});
        let branchId = _.get(this.props, 'match.params.id');
        (
            id ? api.put("/contract/" + id, this.state.model) :
            api.post("/branch/" + branchId + "/contract", this.state.model)
        )
        .then((res)=>{
            this.setState({busy: false});
            if(res.success){
                if(id){
                    notify.success('Contract extended successfully.');
                }
                else{
                    notify.success('Contract added successfully.');
                }
                if(this.company.branch && this.company.branch.id == id){
                    this.company.branch.contract_history.push(res.data);
                }
                this.props.history.push('/branch');
            }
        });
    }
    componentDidMount(){
        let id = _.get(this.props, 'history.location.state.contractId');
        if(this.props.location.pathname == '/extend-contract' && !id){
            this.props.history.push('/branch');
        }
    }
    render() {
        return (
            <DataContext.Consumer>
                {(company)=>{
                    this.company = company;
                    if(company.status_id !== __app.LOOKUP.ApplicationStatus.APPROVED || !company.branch || company.branch.status_id != __app.LOOKUP.ApplicationStatus.APPROVED){
                        return <Redirect to="/branch" />;
                    }
                    let isLiaison = company.branch.service_type_id == __app.LOOKUP.ServiceType.LIAISON;
                    return(
                    <div className={"container-fluid container-light" + (this.state.busy ? " busy" : "")}>
                        <div className="container">        
                            <div className="content-container">
                                <div className="section progress-section">
                                    <div className="section-inner">
                                        {isLiaison ? null : (<div className="widget widget-progress">
                                            <div className="widget-inner">
                                                <ul className="progress-steps steps-2">
                                                {[1, 2].map(($i)=>{
                                                    return <li key={$i} className={this.state.step == $i ? 'active' : (this.state.step > $i ? 'done' : 'disabled')}><a href="#">{$i}</a></li>
                                                })}
                                                </ul>
                                            </div>
                                        </div>)}
                                        {(()=>{
                                            if(this.state.step == 1){
                                                return <Step1 model={this.state.model} contractOnly={true} isLiaison={isLiaison} onNext={this.next.bind(this)} submit={this.submit.bind(this)} />;
                                            }
                                            if(this.state.step == 2){
                                                return <Step2 model={this.state.model} contractOnly={true} onBack={this.back.bind(this)} submit={this.submit.bind(this)} />;
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