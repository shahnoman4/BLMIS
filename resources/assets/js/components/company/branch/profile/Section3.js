import React from 'react'
import {Validateable, Input, ContextForm} from '../../../Common.js'

export default class BranchAppSection3 extends Validateable{
    constructor(props){
        super(props);
        this.state = {
            model: {},
            errors: this.props.errors,
            busy: false
        };

        _.forEach(['Agent'], (key)=>{
            this.state.model[key] = _.get(this.props.model, key) || {};
        });

        this.page = React.createRef();
    }
    submit(){        
        this.setState({busy: true});
        api.put('/branch/' + this.props.model.Branch.id, {...this.state.model, section: 'agent'}).then((res)=>{
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
                        <label htmlFor="full_name">Full Name</label>
                        <div className="">
                            <Input type="text" autoComplete="off" id="full_name" name="Agent.full_name" className="form-control required" placeholder="@fullName" />
                        </div>

                    </div>
                </div>
                <div className="col">
                    <div className="form-group">
                        <label htmlFor="type-law">Type</label>
                        <div className="">
                            <Input as="select" lookup='AgentType' className="custom-select" id="type-law" name="Agent.contact_category_id">
                                <option value="">-- Select --</option>
                            </Input>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <div className="form-group">
                        <label htmlFor="cell-no">Cell No</label>
                        <div className="">
                            <Input type="text" autoComplete="off" id="cell-no" name="Agent.mobile_phone" className="form-control required" placeholder="@Cell No" />
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="form-group">
                        <label htmlFor="company_email">Email</label>
                        <div className="">
                            <Input type="email" id="company_email" name="Agent.primary_email" className="form-control required" placeholder="@email" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <div className="form-group">
                        <label htmlFor="company_name">Address</label>
                        <div className="">
                            <Input type="text" autoComplete="off" id="company_address" name="Agent.Location.address_line1" className="form-control required" placeholder="@Hrant Madoyan St.14 Building, Gegharkunik Marz" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <div className="form-group">
                        <label htmlFor="country">Country</label>
                        <div className="">
                            <Input as="select" lookup='Country' className="custom-select" id="country" name="Agent.Location.country">
                            <option value="">-- Select --</option>
                            </Input>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="form-group">
                        <label htmlFor="city">City</label>
                        <div className="">
                            <Input as="select" lookup='City' filterBy={{cc: _.get(this.state.model, 'Agent.Location.country')}} className="custom-select" id="city" name="Agent.Location.city">
                            <option value="">-- Select --</option>
                            </Input>
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