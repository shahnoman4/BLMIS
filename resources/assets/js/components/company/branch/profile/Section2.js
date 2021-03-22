import React from 'react'
import {Validateable, Input, ContextForm} from '../../../Common.js'

export default class BranchAppSection2 extends Validateable{
    constructor(props){
        super(props);
        this.state = {
            model: {},
            errors: this.props.errors,
            busy: false
        };

        _.forEach(['Company'], (key)=>{
            this.state.model[key] = _.get(this.props.model, key) || {};
        });

        this.page = React.createRef();
    }
    submit(){        
        this.setState({busy: true});
        api.put('/branch/' + this.props.model.Branch.id, {...this.state.model, section: 'company'}).then((res)=>{
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
                        <label htmlFor="company_name">Company Name</label>
                        <div className="">
                            <div disabled className="form-control">{_.get(this.props, 'company.name')}</div>
                        </div>

                    </div>
                </div>
                <div className="col">
                    <div className="form-group">
                        <label htmlFor="company_sector">Company Sector</label>
                        <div className="">
                            <div disabled className="form-control">{__app.LOOKUP.text('Sector', _.get(this.props, 'company.sector_id'))}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <div className="form-group">
                        <label htmlFor="company_name">Company Address</label>
                        <div className="">
                            <div disabled className="form-control">{_.get(this.props, 'company.contact.location.address_line1')}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <div className="form-group">
                        <label htmlFor="country">Country</label>
                        <div className="">
                            <div disabled className="form-control">{__app.LOOKUP.text('Country', _.get(this.props, 'company.contact.location.country'))}</div>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="form-group">
                        <label htmlFor="city">City</label>
                        <div className="">
                            <div disabled className="form-control">{__app.LOOKUP.text('City', _.get(this.props, 'company.contact.location.city'))}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col">
                    <div className="form-group">
                        <label htmlFor="postal_zip_code">Postal Code/Zip Code</label>
                        <div className="">
                            <div disabled className="form-control">{_.get(this.props, 'company.contact.location.zip')}</div>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="form-group">
                        <label htmlFor="company_phone">Company Phone Number</label>
                        <div className="">
                            <div disabled className="form-control">{_.get(this.props, 'company.contact.office_phone')}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col">
                    <div className="form-group">
                        <label htmlFor="company_fax">Company Fax Number</label>
                        <div className="">
                            <div disabled className="form-control">{_.get(this.props, 'company.contact.office_fax')}</div>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="form-group">
                        <label htmlFor="company_email">Company Email Address</label>
                        <div className="">
                            <div disabled className="form-control">{_.get(this.props, 'company.contact.office_email')}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <div className="form-group">
                        <label htmlFor="company_registration">Copy of Company Registration<span className="required-mark"> *</span></label>
                        <div className="custom-file">
                            <Input type="file" as="tempUpload" className="custom-file-input" id="company_registration" name="Company.registration_letter" />
                            <label className="custom-file-label" htmlFor="company_registration">{_.get(this.state.model, 'Company.registration_letter.filename', '')}</label>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="form-group">
                        <label htmlFor="Memorandum">Copy of Article of Memorandum<span className="required-mark"> *</span></label>
                        <div className="custom-file">
                            <Input type="file" as="tempUpload" className="custom-file-input" id="permission_letter" name="Company.memorandum_article" />
                            <label className="custom-file-label" htmlFor="pMemorandum">{_.get(this.state.model, 'Company.memorandum_article.filename', '')}</label>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <div className="form-group">
                        <label htmlFor="resolution_letter">Copy of Resolution/Authority letter<span className="required-mark"> *</span></label>
                        <div className="custom-file">
                            <Input type="file" as="tempUpload" className="custom-file-input" id="resolution_letter" name="Company.authority_letter" />
                            <label className="custom-file-label" htmlFor="resolution_letter">{_.get(this.state.model, 'Company.authority_letter.filename', '')}</label>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="form-group">
                        <label htmlFor="compnay-profile">Company Profile<span className="required-mark"> *</span></label>
                        <div className="custom-file">
                            <Input type="file" as="tempUpload" className="custom-file-input" id="compnay-profile" name="Company.org_profile" />
                            <label className="custom-file-label" htmlFor="compnay-profile">{_.get(this.state.model, 'Company.org_profile.filename', '')}</label>
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