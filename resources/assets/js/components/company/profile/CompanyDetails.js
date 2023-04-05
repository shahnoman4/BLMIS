import React from 'react'
import {Validateable, Input, ContextForm} from '../../Common.js'
import {block, unblock} from '../../../helper/common.js'
import api from '../../../config/app'

export default class CompanyDetails extends Validateable{
    constructor(props){
        super(props);
        this.state = {
            model: {},
            busy: false
        };
        if(props.profile && props.profile.Company){
            this.state.model.Company = props.profile.Company;
            this.state.model.Contact = props.profile.Contact;
        }
        if(!this.state.model.Company){
            this.state.model.Company = { };
        }
        if(!this.state.model.Contact){
            this.state.model.Contact = {};
        }
    }
    submit(){
        this.setState({busy: true});
        api.put('/company', {...this.state.model, section: 'company'}).then((res)=>{
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
    render(){
        return (
        <ContextForm target={this}>
        <div className="card-body">
            <form className="needs-validation" noValidate>
                <div className="row">
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="already_premitted">Is your company already permitted?</label>
                            <div className="">
                                <Input as="select" className="custom-select" id="already_premitted" name="Company.was_permitted" onChange={()=>{_.unset(this.state.model, 'Company.permission_letter'); this.setState({model: this.state.model});}}>
                                    <option value="">-- Select --</option>
                                    <option value="1">Yes</option>
                                    <option value="0">No</option>
                                </Input>
                            </div>
                        </div>
                    </div>
                    <div className={`col${this.state.model.Company.was_permitted == 0 ? ' hidden' : ''}`}>
                        <div className="form-group">
                            <label htmlFor="permission_letter">Last Permission/Renewal Letter</label>
                            <div className="custom-file">
                                <Input as="tempUpload" type="file" className="custom-file-input form-control" id="permission_letter" name="Company.permission_letter" />
                                <label className="custom-file-label" htmlFor="permission_letter">{_.get(this.state.model, 'Company.permission_letter.filename', '')}</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="company_name">Company Name</label>
                            <div className="">
                                <Input type="text" autoComplete="off" id="company_name" name="Company.name" className="form-control required" placeholder="@companyName"/>    
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="company_sector">Company Sector</label>
                            <div className="">
                                <Input as="select" lookup="Sector" className="custom-select" id="company_sector" name="Company.sector_id">
                                    <option value="0">-- Select --</option>
                                </Input>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="company_name">Company Address</label>
                            <div className="">
                                <Input type="text" autoComplete="off" id="company_address" name="Contact.Location.address_line1" className="form-control required" placeholder="@Hrant Madoyan St.14 Building, Gegharkunik Marz"/>    
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="country">Country</label>
                            <div className="">
                                <Input as="select" lookup="Country" className="custom-select" id="country" name="Contact.Location.country">
                                    <option value="0">-- Select --</option>
                                </Input>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="city">City</label>
                            <div className="">
                                <Input as="select" lookup="City" className="custom-select" id="city" name="Contact.Location.city">
                                    <option value="0">-- Select --</option>
                                </Input>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="postal_zip_code">Postal Code/Zip Code</label>
                            <div className="">
                                <Input type="text" autoComplete="off" id="postal_zip_code" name="Contact.Location.zip" className="form-control required" placeholder="AR091H"/>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="company_phone">Company Phone Number</label>
                            <div className="">
                                <Input type="text" autoComplete="off" id="company_phone" name="Contact.office_phone" className="form-control required" placeholder="098265478320"/>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="company_fax">Company Fax Number</label>
                            <div className="">
                                <Input type="text" autoComplete="off" id="company_fax" name="Contact.office_fax" className="form-control required" placeholder="03123123"/>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="company_email">Company Email Address</label>
                            <div className="">
                                <Input type="email" id="company_email" name="Contact.office_email" className="form-control required" placeholder="email@domainName.com"/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="form-footer">
                    <div className="form-group float-right">
                        <button type="button" className="btn btn-primary" disabled={this.state.busy} onClick={this.submit.bind(this)}>UPDATE</button>
                    </div>
                </div>
            </form>
        </div>
        </ContextForm>
        );
    }
}