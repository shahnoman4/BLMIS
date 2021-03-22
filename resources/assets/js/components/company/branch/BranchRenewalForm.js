import React from 'react'

import {Input} from '../../Common'

export default function Form(){
    return (

    <React.Fragment>
        {/* <!-- Business Information --> */}
        <div className="form-group">
            <h3>Branch Office Renewal</h3>
            <div>
                <span className="float-left text-muted small">Note: Incomplete form will not be entertained</span>
            </div>
        </div>
        <div className="row">
            <div className="col">
                <div className="form-group">
                    <label htmlFor="contractDuration">Previous contract duration <span className="text-danger"> *</span></label>
                    <div className="">
                        <Input as="select" className="custom-select" id="Servies" name="contract_duration">
                            <option value="">-- Select --</option>
                            <option value="1">1 Year</option>
                            <option value="2">2 Years</option>
                            <option value="3">3 Years</option>
                            <option value="4">4 Years</option>
                            <option value="5">5 Years</option>
                            <option value="More">More</option>
                        </Input>
                    </div>
                </div>
            </div>
            <div className="col">
                <div className="form-group">
                    <label htmlFor="contract_agreement">Contract agreement <span className="required-mark text-danger"> *</span></label>
                    <div className="custom-file">
                        <Input as="tempUpload" type="file" name='contract_agreement' className="custom-file-input" id="contract_agreement" />
                        <label className="custom-file-label" htmlFor="contract_agreement">{_.get(this.state.model, 'contract_agreement.filename', '')}</label>
                    </div>
                </div>
            </div>
        </div>
        <div className="row">
            <div className="col">
                <div className="form-group">
                    <label htmlFor="tax_return">Income tax return for last 03 years <span className="required-mark text-danger"> *</span></label>
                    <div className="custom-file">
                        <Input as="tempUpload" type="file" className="custom-file-input" id="tax_return" name="tax_return" />
                        <label className="custom-file-label" htmlFor="tax_return">{_.get(this.state.model, 'tax_return.filename', '')}</label>
                    </div>
                </div>
            </div>
            <div className="col">
                <div className="form-group">
                    <label htmlFor="financial_statement">Latest financial statement <span className="required-mark text-danger"> *</span></label>
                    <div className="custom-file">
                        <Input as="tempUpload" type="file" className="custom-file-input" id="financial_statement" name="financial_statement" />
                        <label className="custom-file-label" htmlFor="financial_statement">{_.get(this.state.model, 'financial_statement.filename', '')}</label>
                    </div>
                </div>
            </div>
        </div>

        <div className="row">
            <div className="col">
                <div className="form-group">
                    <label htmlFor="realization_certificate">Proceed realization certificate (PRC) <span className="required-mark text-danger"> *</span></label>
                    <div className="custom-file">
                        <Input as="tempUpload" type="file" className="custom-file-input" id="realization_certificate" name="realization_certificate" />
                        <label className="custom-file-label" htmlFor="realization_certificate">{_.get(this.state.model, 'realization_certificate.filename', '')}</label>
                    </div>
                </div>
            </div>
            <div className="col">
                <div className="form-group">
                    <label htmlFor="audit_accounts">Latest audit accounts details <span className="required-mark text-danger"> *</span></label>
                    <div className="custom-file">
                        <Input as="tempUpload" type="file" className="custom-file-input" id="audit_accounts" name="audit_report" />
                        <label className="custom-file-label" htmlFor="audit_accounts">{_.get(this.state.model, 'audit_report.filename', '')}</label>
                    </div>
                </div>
            </div>
        </div>

        <div className="row">
            <div className="col">
                <div className="form-group">
                    <label htmlFor="scep_certificate">SECP certificate <span className="required-mark text-danger"> *</span></label>
                    <div className="custom-file">
                        <Input as="tempUpload" type="file" className="custom-file-input" id="scep_certificate" name="scep_certificate" />
                        <label className="custom-file-label" htmlFor="scep_certificate">{_.get(this.state.model, 'scep_certificate.filename', '')}</label>
                    </div>
                </div>
            </div>
            <div className="col">
                <div className="form-group">
                    <label htmlFor="other_doc">Other documents </label>
                    <div className="custom-file">
                        <Input as="tempUpload" type="file" className="custom-file-input" id="other_doc" name="other_doc" />
                        <label className="custom-file-label" htmlFor="other_doc">{_.get(this.state.model, 'other_doc.filename', '')}</label>
                    </div>
                </div>
            </div>
        </div>

        <div className="row">
            <div className="col">
            <div className="form-group">
                    <label htmlFor="renewal_period">Renewal period <span className="text-danger"> *</span></label>
                    <div className="">
                        <Input as="select" className="custom-select" id="renewal_period" name="renewal_period">
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
            <div className="col">
                &nbsp;
            </div>
        </div>
    </React.Fragment>
    );
}