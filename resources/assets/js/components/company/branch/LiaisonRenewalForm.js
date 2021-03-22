import React from "react";

import { Input } from "../../Common";

export default function Form() {
  return (
    <React.Fragment>
      {/* <!-- Business Information --> */}
      <div className="form-group">
        <h3>Liaison Office Renewal</h3>
        <div>
          <span className="float-left text-muted small">
            Note: Incomplete form will not be entertained
          </span>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div className="form-group">
            <label htmlFor="contractDuration">
              Previous contract duration <span className="text-danger"> *</span>
            </label>
            <div className="">
              <Input
                as="select"
                className="custom-select"
                id="Servies"
                name="contract_duration"
              >
                <option value="">-- Select --</option>
                <option value="1">1 Year</option>
                <option value="2">2 Years</option>
                <option value="3">3 Years</option>
                <option value="4">4 Years</option>
                <option value="5">5 Years</option>
                <option value="more">More</option>
              </Input>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="form-group">
            <label htmlFor="realization_certificate">
              Realization certificate{" "}
              <span className="required-mark text-danger"> *</span>
            </label>
            <div className="custom-file">
              <Input
                as="tempUpload"
                type="file"
                className="custom-file-input"
                id="realization_certificate"
                name="realization_certificate"
              />
              <label
                className="custom-file-label"
                htmlFor="realization_certificate"
              >
                {_.get(
                  this.state.model,
                  "realization_certificate.filename",
                  ""
                )}
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div className="form-group">
            <label htmlFor="last_year_report">
              Report for last permitted year{" "}
              <span className="required-mark text-danger"> *</span>
            </label>
            <div className="custom-file">
              <Input
                as="tempUpload"
                type="file"
                className="custom-file-input"
                id="last_year_report"
                name="annual_report"
              />
              <label className="custom-file-label" htmlFor="last_year_report">
                {_.get(this.state.model, "annual_report.filename", "")}
              </label>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="form-group">
            <label htmlFor="paid_fee">
              Proof of paid fee <span className="required-mark"> *</span>
            </label>
            <div className="custom-file">
              <Input
                as="tempUpload"
                type="file"
                className="custom-file-input"
                id="paid_fee"
                name="receipt"
              />
              <label className="custom-file-label" htmlFor="paid_fee">
                {_.get(this.state.model, "receipt.filename", "")}
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <div className="form-group">
            <label htmlFor="scep_certificate">
              SECP certificate{" "}
              <span className="required-mark text-danger"> *</span>
            </label>
            <div className="custom-file">
              <Input
                as="tempUpload"
                type="file"
                className="custom-file-input"
                id="scep_certificate"
                name="scep_certificate"
              />
              <label className="custom-file-label" htmlFor="scep_certificate">
                {_.get(this.state.model, "scep_certificate.filename", "")}
              </label>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="form-group">
            <label htmlFor="other_doc">Other document </label>
            <div className="custom-file">
              <Input
                as="tempUpload"
                type="file"
                className="custom-file-input"
                id="other_doc"
                name="other_doc"
              />
              <label className="custom-file-label" htmlFor="other_doc">
                {_.get(this.state.model, "other_doc.filename", "")}
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <div className="form-group">
            <label htmlFor="renewal_period">
              Renewal period <span className="text-danger"> *</span>
            </label>
            <div className="">
              <Input
                as="select"
                className="custom-select"
                id="renewal_period"
                name="renewal_period"
              >
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
        <div className="col">&nbsp;</div>
      </div>
    </React.Fragment>
  );
}
