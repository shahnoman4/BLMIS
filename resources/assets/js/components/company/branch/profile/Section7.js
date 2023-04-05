import React from 'react'
import {Validateable, Input, ContextForm} from '../../../Common.js'

export default class BranchAppSection7 extends Validateable{
    constructor(props){
        super(props);
        this.state = {
            model: {},
            errors: this.props.errors,
            busy: false
        };

        _.forEach(['Investment'], (key)=>{
            this.state.model[key] = _.get(this.props.model, key) || {};
        });

        this.page = React.createRef();
    }
    submit(){        
        this.setState({busy: true});
        api.put('/branch/' + this.props.model.Branch.id, {...this.state.model, section: 'investment'}).then((res)=>{
            this.setState({busy: false});
            if(res.success){
                this.props.onUpdate(res.data.log);
            }
            else{
                this.setState({errors: res.errors});
                $('.is-invalid:first').focus();
            }
        });
    }
    render() {
        let model = this.state.model;
        return(
            <ContextForm target={this}>
            <div className="row">
                <div className="col">
                    <div className="form-group">
                        <label htmlFor="company_name">Investment proposed to be made in detail
                            foreign/local<span className="required-mark"> *</span></label>
                        <Input as="textarea" className="form-control" name="Investment.proposal_info" placeholder="Investment detail foreign/local"></Input>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <div className="form-group">
                        <label htmlFor="expenses">Annual Recurring expenses of office (USD)<span className="required-mark"> *</span></label>
                        <div className="">
                            <Input type="text" autoComplete="off" id="expenses" name="Investment.annual_expenses" className="form-control required" placeholder="@expenses" />
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="form-group">
                        <label htmlFor="agreement">&nbsp;</label>
                        <div className="custom-file">
                            <Input type="file" as="tempUpload" className="custom-file-input" id="agreement" name="Investment.expenses_copy" />
                            <label className="custom-file-label blank-label" htmlFor="agreement">{_.get(this.state.model, 'Investment.expenses_copy.filename', '')}</label>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <div className="form-group">
                        <label htmlFor="organization">State programe to establish investment project in
                            pakistan, if so nature of the same</label>
                        <Input as="textarea" className="form-control" name="Investment.investment_info" placeholder="State programe to establish investment project in pakistan"></Input>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <div className="form-group">
                        <label htmlFor="bank">Name of Bank in Pakistan<span className="required-mark">
                                *</span></label>
                        <div className="">
                            <Input type="text" autoComplete="off" id="bank" name="Investment.pk_bank" className="form-control required" placeholder="Name of Bank in Pakistan" />
                        </div>
                    </div>
                </div>
                <div className="col">
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <div className="form-group">
                        <label htmlFor="Designated-person">Designated person authorized to act on behalf
                            of company<span className="required-mark"> *</span></label>
                        <div className="">
                            <Input type="text" autoComplete="off" id="Designated-person" name="Investment.designated_person" className="form-control required" placeholder="Designated person authorized" />
                        </div>
                    </div>
                </div>
                <div className="col">
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <div className="form-group">
                        <label htmlFor="deemed-info">Any other information which is deemed appropriate
                            of consideration of request</label>
                        <div className="">
                            <Input as="textarea" id="deemed-info" name="Investment.comments" className="form-control required" placeholder="Any other information which is deemed appropriate of consideration of request" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="form-footer">
                <div className="form-group float-right">
                    <button className={"btn btn-primary" + (this.state.busy ? " loading" : "")} disabled={this.state.busy} onClick={this.submit.bind(this)}>UPDATE</button>
                </div>
            </div>
            </ContextForm>
        );
    }
}