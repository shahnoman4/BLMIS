import React from 'react'
import {Validateable, Input, ContextForm} from '../../../Common.js'

export default class BranchAppSection8 extends Validateable{
    constructor(props){
        super(props);
        this.state = {
            model: {},
            errors: this.props.errors,
            busy: false
        };

        _.forEach(['SecurityAgency'], (key)=>{
            this.state.model[key] = _.get(this.props.model, key) || {};
        });

        this.page = React.createRef();
    }
    submit(){        
        this.setState({busy: true});
        api.put('/branch/' + this.props.model.Branch.id, {...this.state.model, section: 'security_agency'}).then((res)=>{
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
                        <label htmlFor="Services">Is Services Needed*</label>
                        <div className="">
                            <Input as="select" className="custom-select" id="Services" name="SecurityAgency.security_required">
                                <option value="">-- Select --</option>
                                <option value="0">No</option>
                                <option value="1">Yes</option>
                            </Input>
                        </div>
                    </div>
                </div>
                <div className={"col" + (_.get(this.state.model, 'SecurityAgency.security_required') == '0' ? " hidden" : "")}>
                    <div className="form-group">
                        <label htmlFor="Registered">Registered Name<span className="required-mark">
                                *</span></label>
                        <div className="">
                            <Input type="text" autoComplete="off" id="Registered" name="SecurityAgency.name" className="form-control required" placeholder="Security Company Registered Name" />
                        </div>
                    </div>
                </div>
            </div>
            <div className={_.get(this.state.model, 'SecurityAgency.security_required') == '0' ? "hidden" : ""}>

                <div className="row">
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="ntn">Company NTN No<span className="required-mark"> *</span></label>
                            <div className="">
                                <Input type="text" autoComplete="off" id="ntn" name="SecurityAgency.ntn" className="form-control required" placeholder="@Company NTN No" />
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="Certificate">Certificate</label>
                            <div className="custom-file">
                                <Input type="file" as="tempUpload" className="custom-file-input" id="Certificate" name="SecurityAgency.secp_certificate" />
                                <label className="custom-file-label" htmlFor="agreement">{_.get(this.state.model, 'SecurityAgency.secp_certificate.filename', '')}</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="security">Is the security company purely pakistani
                                based*</label>
                            <div className="">
                                <Input as="select" className="custom-select" id="security" name="SecurityAgency.is_pk_based">
                                    <option value="">-- Select --</option>
                                    <option value="0">No</option>
                                    <option value="1">Yes</option>
                                </Input>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="checkbox">
                            <label><Input type="checkbox" name="SecurityAgency.has_foreign_consultant" value='1' /> Has it hired services of foreign
                                consultant/nationals, in any form or manner</label>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="checkbox">
                            <label><Input type="checkbox" name="SecurityAgency.is_extension" value='1' /> Is it a Pakistani
                                chapter/partnership/extension of a foreign security company? If yes give
                                details</label>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="form-group">
                            <Input as="textarea" className="form-control" name="SecurityAgency.extension_info" placeholder="Type here"></Input>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="address">Address*</label>
                            <div className="">
                                <Input type="text" autoComplete="off" id="address" name="SecurityAgency.Contact.Location.address_line1" className="form-control required" placeholder="@Hrant Madoyan St.14 Building, Gegharkunik Marz" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="country">Country<span className="required-mark"> *</span></label>
                            <div className="">
                                <Input as="select" lookup='Country' className="custom-select" id="country" name="SecurityAgency.Contact.Location.country">
                                    <option value="">-- Select --</option>
                                </Input>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="city">City<span className="required-mark"> *</span></label>
                            <div className="">
                                <Input as="select" lookup='City' filterBy={{cc: _.get(this.state.model, 'SecurityAgency.Contact.Location.country')}} className="custom-select" id="city" name="SecurityAgency.Contact.Location.city">
                                    <option value="">-- Select --</option>
                                </Input>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="Cell-Number">Telephone No<span className="required-mark">
                                    *</span></label>
                            <div className="">
                                <Input type="text" autoComplete="off" id="telephone-no" name="SecurityAgency.Contact.office_phone" className="form-control required" placeholder="@Telephone-No" />
                            </div>

                        </div>
                    </div>
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="Fax-number">Fax No</label>
                            <div className="">
                                <Input type="text" autoComplete="off" id="Fax-number" name="SecurityAgency.Contact.office_fax" className="form-control required" placeholder="@Fax No" />
                            </div>

                        </div>
                    </div>

                </div>
                <div className="row">

                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="company_email">Email Address<span className="required-mark">
                                    *</span></label>
                            <div className="">
                                <Input type="email" id="company_email" name="SecurityAgency.Contact.office_email" className="form-control required" placeholder="@Email Address" />
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="postal_zip_code">Postal Code/Zip Code</label>
                            <div className="">
                                <Input type="text" autoComplete="off" id="postal_zip_code" name="SecurityAgency.Contact.Location.zip" className="form-control required" placeholder="AR091H" />
                            </div>
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