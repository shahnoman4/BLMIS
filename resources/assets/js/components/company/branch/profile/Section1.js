import React from 'react'
import {Validateable, Input, ContextForm} from '../../../Common.js'

export default class BranchAppSection1 extends Validateable{
    constructor(props){
        super(props);
        this.state = {
            model: {},
            errors: this.props.errors,
            busy: false
        };

        _.forEach(['Branch'], (key)=>{
            this.state.model[key] = _.get(this.props.model, key) || {};
        });

        this.page = React.createRef();
    }
    submit(){        
        this.setState({busy: true});
        api.put('/branch/' + this.props.model.Branch.id, {...this.state.model, section: 'branch'}).then((res)=>{
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
                            <label htmlFor="Servies">Type of Servies<span className="text-danger"> *</span></label>
                            <div className="">
                                <div className='form-control' disabled>
                                {__app.LOOKUP.text('ServiceType', _.get(this.state.model, 'Branch.service_type_id'))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="Origin">Country of Origin<span className="text-danger"> *</span></label>
                            <div className="">
                                <Input as="select" lookup="Country" className="custom-select" id="Origin" name="Branch.original_country">
                                    <option value="">-- Select --</option>
                                </Input>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="company_name">Present Business Activities<span className="text-danger"> *</span></label>
                            <Input as="textarea" rows='5' className="form-control" name="Branch.primary_info" placeholder="Present Business Activities"></Input>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="organization">State if your company is subsidiary of any other Principal / Organization<span className="text-danger"> *</span></label>
                            <Input as="textarea" rows='5' className="form-control" name="Branch.other_org_info" placeholder="Other Organization"></Input>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="venture">Detail Of Project / Ventures in other Countries<span className="text-danger"> *</span></label>
                            <Input as="textarea" rows='5' className="form-control" name="Branch.other_country_info" placeholder="Other Organization"></Input>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="country">Existing Branch/Liaison Office in other Country<span className="text-danger"> *</span></label>
                            <div className="">
                                <Input as="select" lookup='Country' className="custom-select" id="country" name="Branch.current_country">
                                    <option value="">-- Select --</option>
                                </Input>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="city">City where project is underway<span className="text-danger"> *</span></label>
                            <div className="">
                                <Input as="select" lookup='City' filterBy={{cc: _.get(this.state.model, 'Branch.current_country')}} className="custom-select" id="city" name="Branch.current_city">
                                    <option value="">-- Select --</option>
                                </Input>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="location">Location/place where permission is required to establish Liaison/branch office in Pakistan<span className="text-danger"> *</span></label>
                            <div className="">
                                <Input type="text" autoComplete="off" id="location" name="Branch.desired_location" className="form-control required" placeholder="@Hrant Madoyan St.14 Building, Gegharkunik Marz" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="Proposed address">Proposed address in Pakistan also indicates places if more than one<span className="text-danger"> *</span></label>
                            <div className="">
                                <Input type="text" autoComplete="off" id="Proposed address" name="Branch.desired_places" className="form-control required" placeholder="@Hrant Madoyan St.14 Building, Gegharkunik Marz" />
                            </div>
                            <p className="text-muted small">Note: Use [;] for multiple values</p>
                        </div>
                    </div>

                </div>
                <div className="row">
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="Intended">Intended Business Activities in Pakistan<span className="text-danger"> *</span></label>
                            <Input as="textarea" rows='5' className="form-control" name="Branch.business_info" placeholder="Intended Field of Business Activities in Pakistan"></Input>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="project">Projects/Details of work in Pakistan</label>
                            <Input as="textarea" rows='5' className="form-control" name="Branch.project_info" placeholder="Projects/Details of work in Pakistan"></Input>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="NoOfEmployee">Number of Personnel <span className="text-danger"> *</span></label>
                            <div className="">
                                <Input as="select" className="custom-select" id="NoOfEmployee" name="Branch.no_of_personnel_employee">
                                    <option value="">-- Select --</option>
                                    {[...Array(200)].map((item, index) => ( <option key={index} value={index+1}>{index+1}</option>))}
                                     <option value="200++">200++</option>
                                </Input>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="firm_for_capital">Details of foreign firm for capital<span className="text-danger"> *</span></label>
                            <div className="">
                                <Input type="text" autoComplete="off" id="firm_for_capital" name="Branch.firm_for_capital" className="form-control required" placeholder="@Details of foreign firm for capital" />
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="firm_for_profit">Details of foreign firm for profit<span className="text-danger"> *</span></label>
                            <div className="">
                                <Input type="text" autoComplete="off" id="firm_for_profit" name="Branch.firm_for_profit" className="form-control required" placeholder="@Details of foreign firm for profit" />
                                    
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="company_name">State if repatriation facilities are required by the foreign firm for Capital and Profit</label>
                            <Input as="textarea" rows='5' className="form-control" name="Branch.repatriation_info" placeholder="State if repatriation facilities are required by foreign firm for capital and profit"></Input>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="associated-investment">State if any Pakistani Co/individual is associated in the Co. with details of investment (% Share)</label>
                            <Input as="textarea" rows='5' className="form-control" name="Branch.local_associate_info" placeholder="State if repatriation facilities are required by foreign firm for capital and profit"></Input>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="month">Permission Period From</label>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="">
                                        <Input as="select" data={months()} className="custom-select" id="month" name="Branch.start_month">
                                            <option value="">-- Month --</option>
                                        </Input>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="year-one">
                                        <Input as="select" data={years()} className="custom-select" id="year" name="Branch.start_year">
                                            <option value="">-- Year --</option>
                                        </Input>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="permission_period">Permission Period</label>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="">
                                        <Input as="select" className="custom-select" id="permission_period" name="Branch.permission_period">
                                            <option value="">-- Select --</option>
                                            <option value="1">1 Year</option>
                                            <option value="2">2 Years</option>
                                            <option value="3">3 Years</option>
                                            <option value="4">4 Years</option>
                                            <option value="5">5 Years</option>
                                        </Input>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="Background">Detail Background</label>
                            <Input as="textarea" rows='5' className="form-control" name="Branch.background_info" placeholder="History of the Foreign Company  "></Input>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="purpose">Purpose for Opening </label>
                            <Input as="textarea" rows='5' className="form-control" name="Branch.purpose_info" placeholder="Purpose of Opening Office in Pakistan"></Input>
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