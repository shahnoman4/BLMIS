import React from 'react'
import {Validateable, Input, ContextForm} from '../../../Common.js'

export default class BranchAppSection6 extends Validateable{
    constructor(props){
        super(props);
        this.state = {
            model: {},
            errors: this.props.errors,
            busy: false
        };

        _.forEach(['PartnerCompanies'], (key)=>{
            this.state.model[key] = _.get(this.props.model, key) || {};
        });

        this.page = React.createRef();
    }
    submit(){        
        this.setState({busy: true});
        api.put('/branch/' + this.props.model.Branch.id, {...this.state.model, section: 'partner_companies'}).then((res)=>{
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
            {model.PartnerCompanies.map((item, key)=>(
            <React.Fragment key={key}>
            <div className="row">
                <div className="col">
                    <div className="form-group">
                        <label htmlFor="company_name">Company Name<span className="required-mark">
                                *</span></label>
                        <div className="">
                            <Input type="text" autoComplete="off" id="company_name" name={"PartnerCompanies."+ key +".full_name"} className="form-control required" placeholder="@companyName" />
                        </div>

                    </div>
                </div>
                <div className="col">
                    <div className="form-group">
                        <label htmlFor="lease-agreement">Lease Agreement Of Local Office*</label>
                        <div className="custom-file">
                            <Input type="file" as="tempUpload" className="custom-file-input" id="lease-agreement" name={"PartnerCompanies."+ key +".lease_agreement"} />
                            <label className="custom-file-label" htmlFor="lease-agreement">{_.get(this.state.model, 'PartnerCompanies.'+ key +'.lease_agreement.filename', '')}</label>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <div className="form-group">
                        <label htmlFor="company_name">Company Address</label>
                        <div className="">
                            <Input type="text" autoComplete="off" id="company_address" name={"PartnerCompanies."+ key +".Location.address_line1"} className="form-control required" placeholder="@Hrant Madoyan St.14 Building, Gegharkunik Marz" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <div className="form-group">
                        <label htmlFor="country">Country</label>
                        <div className="">
                            <Input as="select" lookup='Country' className="custom-select" id="country" name={"PartnerCompanies."+ key +".Location.country"}>
                                <option value="">-- Select --</option>
                            </Input>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="form-group">
                        <label htmlFor="city">City</label>
                        <div className="">
                            <Input as="select" lookup='City' filterBy={{cc: _.get(this.state.model, 'PartnerCompanies.'+ key +'.Location.country')}} className="custom-select" id="city" name={"PartnerCompanies."+ key +".Location.city"}>
                                <option value="">-- Select --</option>
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
                            <Input type="text" autoComplete="off" id="postal_zip_code" name={"PartnerCompanies."+ key +".Location.zip"} className="form-control required" placeholder="AR091H" />
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="form-group">
                        <label htmlFor="company_phone">Company Phone Number</label>
                        <div className="">
                            <Input type="text" autoComplete="off" id="company_phone" name={"PartnerCompanies."+ key +".office_phone"} className="form-control required" placeholder="098265478320" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col">
                    <div className="form-group">
                        <label htmlFor="company_fax">Company Fax Number</label>
                        <div className="">
                            <Input type="text" autoComplete="off" id="company_fax" name={"PartnerCompanies."+ key +".office_fax"} className="form-control" placeholder="03123123" />
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="form-group">
                        <label htmlFor="company_email">Company Email Address</label>
                        <div className="">
                            <Input type="email" id="company_email" name={"PartnerCompanies."+ key +".office_email"} className="form-control required" placeholder="email@domainName.com" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <div className="form-group">
                        <label htmlFor="SECP-Certificate">SECP Certificate copy<span className="required-mark"> *</span></label>
                        <div className="custom-file">
                            <Input type="file" as="tempUpload" className="custom-file-input" id="SECP-Certificate" name={"PartnerCompanies."+ key +".secp_certificate"} />
                            <label className="custom-file-label" htmlFor="SECP-Certificate">{_.get(this.state.model, 'PartnerCompanies.'+ key +'.secp_certificate.filename', '')}</label>
                        </div>
                    </div>
                </div>
                <div className="col">

                </div>
            </div>
            {/* <!-- Local Complany/ Partner Contact Person --> */}
            <div className="form-group">
                <h3>Local Company/Partner Contact Person</h3>

                <div>
                    <span className="float-left text-muted small"></span>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <div className="form-group">
                        <label htmlFor="full_name">Full Name</label>
                        <div className="">
                            <Input type="text" autoComplete="off" id="full_name" name={"PartnerCompanies."+ key +".Contact.full_name"} className="form-control required" placeholder="@fullName" />
                        </div>

                    </div>
                </div>
                <div className="col">
                    <div className="form-group">
                        <label htmlFor="company_email">Email</label>
                        <div className="">
                            <Input type="email" id="company_email" name={"PartnerCompanies."+ key +".Contact.primary_email"} className="form-control required" placeholder="@email" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <div className="form-group">
                        <label htmlFor="contact-no">Contact Number</label>
                        <div className="">
                            <Input type="text" autoComplete="off" id="contact-no" name={"PartnerCompanies."+ key +".Contact.primary_phone"} className="form-control required" placeholder="@contactNumber" />
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="form-group">
                        <label htmlFor="cnic-no">CNIC No</label>
                        <div className="">
                            <Input type="text" autoComplete="off" id="cnic-no" name={"PartnerCompanies."+ key +".Contact.nic_no"} className="form-control required" placeholder="@nNational Card No" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <div className="form-group">
                        <label htmlFor="cnic-copy">CNIC copy</label>
                        <div className="custom-file">
                            <Input type="file" as="tempUpload" className="custom-file-input" id="cnic-copy" name={"PartnerCompanies."+ key +".Contact.nic_copy"} />
                            <label className="custom-file-label" htmlFor="company_registration">{_.get(this.state.model, 'PartnerCompanies.'+ key +'.Contact.nic_copy.filename', '')}</label>
                        </div>
                    </div>
                </div>
                <div className="col">

                </div>
            </div>
            </React.Fragment>
            ))}
            <div className="row">
                <div className="col">
                    {/* <button type="button" className="btn btn-primary" onClick={this.addPartner.bind(this)}>Add New Partner Details</button> */}
                </div>
                <div className="col">

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