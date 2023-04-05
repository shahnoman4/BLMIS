import React from 'react'
import {Validateable, Input, ContextForm} from '../../../Common.js'

export default class BranchAppSection4 extends Validateable{
    constructor(props){
        super(props);
        this.state = {
            model: {},
            errors: this.props.errors,
            busy: false
        };

        _.forEach(['Contract'], (key)=>{
            this.state.model[key] = _.get(this.props.model, key) || {};
        });

        this.page = React.createRef();
    }
    submit(){        
        this.setState({busy: true});
		let data = _.cloneDeep(this.state.model);
		let contractStartDate = _.get(data, 'Contract.start_date');
		if(contractStartDate){
			let date = moment(contractStartDate, 'MM/DD/YYYY', true);
			if(date.isValid()){
				data.Contract.start_date = date.format('YYYY-MM-DD');
			}
		}
        api.put('/branch/' + this.props.model.Branch.id, {...data, section: 'contract'}).then((res)=>{
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
                        <label htmlFor="contract">Title of Contract<span className="required-mark"> *</span></label>
                        <div className="">
                            <Input type="text" autoComplete="off" id="contract" name="Contract.title" className="form-control required" placeholder="@projectName" />
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="form-group">
                        <label htmlFor="agreement">Contract Agreement copy<span className="required-mark"> *</span></label>
                        <div className="custom-file">
                            <Input type="file" as="tempUpload" className="custom-file-input" id="agreement" name="Contract.agreement_letter" />
                            <label className="custom-file-label" htmlFor="agreement">{_.get(this.state.model, 'Contract.agreement_letter.filename', '')}</label>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-6">
                    <div className="form-group">
                        <label htmlFor="starting-date">Starting Date<span className="required-mark"> *</span></label>
                        <div className="">
                            <Input as="datepicker" type="text" autoComplete="off" dateFormat="MM/dd/yyyy" id="starting-date" name="Contract.start_date" className="form-control required" placeholder="@StartingDate" />
                        </div>
                        {/* datepicker widget cause a problem to show error messages with Input
                        show message manually */}
                        {(()=>{
                            let err = _.get(this.state.errors, "Contract.start_date.0", '');
                            if(err){
                                return <div className="invalid-feedback" style={{display: 'block'}}>{err}</div>
                            }
                        })()}
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="page-num">Page Number</label>
                        <div className="">
                            <Input type="text" autoComplete="off" id="page-num" name="Contract.start_page" className="form-control required" placeholder="Page #" />
                        </div>
                    </div>

                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="clause-num">Clause Number</label>
                        <div className="">
                            <Input type="text" autoComplete="off" id="clause-num" name="Contract.start_clause" className="form-control required" placeholder="Clause #" />
                        </div>
                    </div>

                </div>
            </div>
            <div className="row">
                <div className="col-md-6">
                    <div className="form-group">
                        <label htmlFor="period">Validity Period<span className="required-mark"> *</span></label>
                        <div className="">
                            <Input as="select" className="custom-select" id="period" name="Contract.valid_for_years">
                            <option value="">-- Select --</option>
                                {[1,2,3,4,5,6,7,8,9,10].map((val, key)=>(
                                    <option key={key} value={val}>{val} years</option>
                                ))}
                            </Input>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="page_num">Page Number</label>
                        <div className="">
                            <Input type="text" autoComplete="off" id="page_num" name="Contract.end_page" className="form-control required" placeholder="Page #" />
                        </div>
                    </div>

                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="clause-num">Clause Number</label>
                        <div className="">
                            <Input type="text" autoComplete="off" id="clause-num" name="Contract.end_clause" className="form-control required" placeholder="Clause #" />
                        </div>
                    </div>

                </div>
            </div>
            <div className="row">
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="month">Defect Period From</label>
                        <div className="">
                            <Input as="select" data={months()} className="custom-select" id="month" name="Contract.defect_start_month">
                            <option value="">Month</option>
                            </Input>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="year"></label>
                        <div className="year-one">
                            <Input as="select" data={years()} className="custom-select" id="year" name="Contract.defect_start_year">
                            <option value="">Year</option>
                            </Input>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="period">Defect Period To</label>
                        <div className="">
                            <Input as="select" data={months()} className="custom-select" id="period" name="Contract.defect_end_month">
                            <option value="">Month</option>
                            </Input>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="year"></label>
                        <div className="year-two">
                            <Input as="select" data={years()} className="custom-select" id="year" name="Contract.defect_end_year">
                            <option value="">Year</option>
                            </Input>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-group">
                        <label htmlFor="cost-project">Cost of Project (US$)<span className="required-mark"> *</span></label>
                        <div className="">
                            <Input type="text" autoComplete="off" id="cost-project" name="Contract.project_cost" className="form-control required" placeholder="@costofproject" />
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