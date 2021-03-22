import React from "react";
import { Validateable, Input, ContextForm } from "../../../Common.js";

export default class BranchAppStep3 extends Validateable {
  constructor(props) {
    let rules = {
      "PartnerCompanies.0.full_name": {
        required: "This field is required",
        alpha_spaces: "Only A-Z,a-z and space allowed"
      },
      "PartnerCompanies.0.lease_agreement": {
        required: "This field is required"
      },
      "PartnerCompanies.0.Location.address_line1": {
        required: "This field is required",
        custom_para: "Only alphabets, numbers, spaces and .,-_ allowed"
      },
      "PartnerCompanies.0.Location.country": {
        required: "This field is required"
      },
      "PartnerCompanies.0.Location.city": {
        required: "This field is required",
        custom_para: "Only alphabets, numbers, spaces and .,-_ allowed"
      },
      "PartnerCompanies.0.Location.zip": { required: "This field is required" },
      "PartnerCompanies.0.office_phone": {
        required: "This field is required",
        phone: "Incorrect number format. Correct format is +420 000 000000"
      },
      //"PartnerCompanies.0.office_fax": {required: "This field is required", phone:"Incorrect number format. Correct format is +420 000 000 000"},
      "PartnerCompanies.0.office_email": {
        required: "This field is required",
        email: "Please enter valid email address"
      },
      "PartnerCompanies.0.Contact.full_name": {
        required: "This field is required",
        alpha_spaces: "Only A-Z,a-z and space allowed"
      },
      "PartnerCompanies.0.Contact.primary_email": {
        required: "This field is required",
        email: "Please enter valid email address"
      },
      "PartnerCompanies.0.Contact.primary_phone": {
        required: "This field is required",
        phone: "Incorrect number format. Correct format is +420 000 000000"
      },
      /* "PartnerCompanies.0.Contact.nic_no": {
        required: "This field is required"
      },
      "PartnerCompanies.0.Contact.nic_copy": {
        required: "This field is required"
      } */
    };
    super(props, rules);
    this.validateOnBlur = true;
    this.state = {
      model: this.props.model,
      errors: this.props.errors,
      busy: false
    };

    if (!this.state.model.PartnerCompanies) {
      this.state.model.PartnerCompanies = [{ Location: { country: "" } }];
    }

    this.page = React.createRef();
  }
  addPartner() {
    let model = this.state.model;
    model.PartnerCompanies.push({ Location: { country: "" } });
    this.setState({ model });
  }
  next() {
    console.log("LOG DATA-->", { ...this.state.model, step: 3 });
    this.setState({ busy: true });
    api.post("/validate/branch", { ...this.state.model, step: 3 }).then(res => {
      if (res.success) {
        if (this.props.contractOnly) {
          this.props.submit(this.state.model);
        } else {
          this.props.onNext(this.state.model);
        }
      } else {
        this.setState({ busy: false });
        let errors = res.errors;
        if (_.has(errors, "PartnerCompanies")) {
          this.setState({ errors: errors });
          $(".is-invalid:first").focus();
        } else if (!this.props.contractOnly) {
          this.props.onNext(this.state.model);
        }
      }
    });
  }
  back() {
    this.props.onBack(null, this.state.model);
  }
  render() {
    let model = this.state.model;
    let key = 0;
    return (
      <ContextForm target={this}>
        <div className="widget widget-form" ref={this.page}>
          <div className="widget-inner">
            <form className="needs-validation" noValidate>
              {this.state.model.PartnerCompanies.map((item, key) => (
                <React.Fragment key={key}>
                  {/* <!-- Local Company/ Partner Details --> */}
                  <div className="form-group">
                    <h3>Local Company/ Partner Details</h3>
                    {this.state.model.PartnerCompanies.length > 1 ? (
                      <span
                        className="btn btn-outline-primary btn-xs"
                        style={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          cursor: "pointer",
                          fontSize: "30px"
                        }}
                        title="Remove local company information"
                        onClick={() => {
                          this.state.model.PartnerCompanies.splice(key, 1);
                          this.forceUpdate();
                        }}
                      >
                        &times;
                      </span>
                    ) : null}
                    <div>
                      <span className="float-left text-muted small">
                        Note: Incomplete form will not be entertained
                      </span>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="company_name">
                          Company name
                          <span className="required-mark text-danger">*</span>
                        </label>
                        <div className="">
                          <Input
                            type="text"
                            autoComplete="off"
                            id="company_name"
                            name={"PartnerCompanies." + key + ".full_name"}
                            className="form-control required"
                            placeholder="@companyName"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="lease-agreement">
                          Lease agreement of local office
                          <span className="required-mark text-danger"> *</span>
                        </label>
                        <div className="custom-file">
                          <Input
                            type="file"
                            as="tempUpload"
                            className="custom-file-input"
                            id="lease-agreement"
                            name={
                              "PartnerCompanies." + key + ".lease_agreement"
                            }
                          />
                          <label
                            className="custom-file-label"
                            htmlFor="lease-agreement"
                          >
                            {_.get(
                              this.state.model,
                              "PartnerCompanies." +
                                key +
                                ".lease_agreement.filename",
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
                        <label htmlFor="company_name">
                          Company address
                          <span className="required-mark text-danger"> *</span>
                        </label>
                        <div className="">
                          <Input
                            type="text"
                            autoComplete="off"
                            id="company_address"
                            name={
                              "PartnerCompanies." +
                              key +
                              ".Location.address_line1"
                            }
                            className="form-control required"
                            placeholder="@Hrant Madoyan St.14 Building, Gegharkunik Marz"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="country">
                          Country
                          <span className="required-mark text-danger"> *</span>
                        </label>
                        <div className="">
                          <Input
                            as="select"
                            lookup="Country"
                            className="custom-select"
                            id="country"
                            name={
                              "PartnerCompanies." + key + ".Location.country"
                            }
                          >
                            <option value="">-- Select --</option>
                          </Input>
                        </div>
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="city">
                          City
                          <span className="required-mark text-danger"> *</span>
                        </label>
                        <div className="">
                          <Input
                            as="select"
                            lookup="City"
                            filterBy={{
                              cc: _.get(
                                this.state.model,
                                "PartnerCompanies." + key + ".Location.country"
                              )
                            }}
                            className="custom-select"
                            id="city"
                            name={"PartnerCompanies." + key + ".Location.city"}
                          >
                            <option value="">-- Select --</option>
                          </Input>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="postal_zip_code">
                          Postal code/zip code
                          <span className="required-mark text-danger"> *</span>
                        </label>
                        <div className="">
                          <Input
                            type="text"
                            autoComplete="off"
                            id="postal_zip_code"
                            name={"PartnerCompanies." + key + ".Location.zip"}
                            className="form-control required"
                            placeholder="AR091H"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="company_phone">
                          Company phone number{" "}
                          <span className="required-mark text-danger"> *</span>
                        </label>
                        <div className="">
                          <Input
                            type="text"
                            as="phoneNumber"
                            autoComplete="off"
                            id="company_phone"
                            name={"PartnerCompanies." + key + ".office_phone"}
                            className="form-control required"
                            placeholder="+422 222 222222"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="company_fax">Company fax number </label>
                        <div className="">
                          <Input
                            type="text"
                            as="phoneNumber"
                            autoComplete="off"
                            id="company_fax"
                            name={"PartnerCompanies." + key + ".office_fax"}
                            className="form-control"
                            placeholder="+422 222 222222"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="company_email">
                          Company email address
                          <span className="required-mark text-danger"> *</span>
                        </label>
                        <div className="">
                          <Input
                            type="email"
                            id="company_email"
                            name={"PartnerCompanies." + key + ".office_email"}
                            className="form-control required"
                            placeholder="user@example.com"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="SECP-Certificate">
                          SECP certificate (In case of private company)
                          
                        </label>
                        <div className="custom-file">
                          <Input
                            type="file"
                            as="tempUpload"
                            className="custom-file-input"
                            id="SECP-Certificate"
                            name={
                              "PartnerCompanies." + key + ".secp_certificate"
                            }
                          />
                          <label
                            className="custom-file-label"
                            htmlFor="SECP-Certificate"
                          >
                            {_.get(
                              this.state.model,
                              "PartnerCompanies." +
                                key +
                                ".secp_certificate.filename",
                              ""
                            )}
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="col"></div>
                  </div>
                  {/* <!-- Local Complany/ Partner Contact Person --> */}
                  <div className="form-group">
                    <h3>
                      Local Company/Partner Contact Person
                    </h3>

                    <div>
                      <span className="float-left text-muted small"></span>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="full_name">
                          Full name
                          <span className="required-mark text-danger"> *</span>
                        </label>
                        <div className="">
                          <Input
                            type="text"
                            autoComplete="off"
                            id="full_name"
                            name={
                              "PartnerCompanies." + key + ".Contact.full_name"
                            }
                            className="form-control required"
                            placeholder="@fullName"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="company_email">
                          Email
                          <span className="required-mark text-danger"> *</span>
                        </label>
                        <div className="">
                          <Input
                            type="email"
                            id="company_email"
                            name={
                              "PartnerCompanies." +
                              key +
                              ".Contact.primary_email"
                            }
                            className="form-control required"
                            placeholder="user@example.com"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="contact-no">
                          Contact number
                          <span className="required-mark text-danger"> *</span>
                        </label>
                        <div className="">
                          <Input
                            type="text"
                            as="phoneNumber"
                            autoComplete="off"
                            id="contact-no"
                            name={
                              "PartnerCompanies." +
                              key +
                              ".Contact.primary_phone"
                            }
                            className="form-control required"
                            placeholder="+422 222 222222"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="cnic-no">
                          CNIC no
                          
                        </label>
                        <div className="">
                          <Input
                            type="text"
                            autoComplete="off"
                            id="cnic-no"
                            name={"PartnerCompanies." + key + ".Contact.nic_no"}
                            className="form-control"
                            placeholder="@National Card No"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="cnic-copy">
                          CNIC copy
                        </label>
                        <div className="custom-file">
                          <Input
                            type="file"
                            as="tempUpload"
                            className="custom-file-input"
                            id="cnic-copy"
                            name={
                              "PartnerCompanies." + key + ".Contact.nic_copy"
                            }
                          />
                          <label
                            className="custom-file-label"
                            htmlFor="company_registration"
                          >
                            {_.get(
                              this.state.model,
                              "PartnerCompanies." +
                                key +
                                ".Contact.nic_copy.filename",
                              ""
                            )}
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="col"></div>
                  </div>
                </React.Fragment>
              ))}
              <div className="row">
                <div className="col">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={this.addPartner.bind(this)}
                  >
                    Add New Partner Details
                  </button>
                </div>
                <div className="col"></div>
              </div>
              {(() => {
                if (this.props.contractOnly) {
                  return (
                    <div className="form-footer">
                      <div className="form-group float-left">
                        <button
                          type="button"
                          className="btn btn-light"
                          onClick={this.back.bind(this)}
                          disabled={this.state.busy}
                        >
                          <i className="fas fa-long-arrow-alt-left"></i> Back
                        </button>
                      </div>
                      <div className="form-group float-right">
                        <button
                          type="button"
                          className={
                            "btn btn-primary" + (this.state.busy ? " busy" : "")
                          }
                          onClick={this.next.bind(this)}
                          disabled={this.state.busy}
                        >
                          Submit <i className="fas fa-long-arrow-alt-right"></i>
                        </button>
                      </div>
                    </div>
                  );
                }
                return (
                  <div className="form-footer">
                    <div className="form-group float-left">
                      <button
                        type="button"
                        className="btn btn-light"
                        onClick={this.back.bind(this)}
                        disabled={this.state.busy}
                      >
                        <i className="fas fa-long-arrow-alt-left"></i> Back
                      </button>
                    </div>
                    <div className="form-group float-right">
                      <button
                        type="button"
                        className={
                          "btn btn-primary" + (this.state.busy ? " busy" : "")
                        }
                        onClick={this.next.bind(this)}
                        disabled={this.state.busy}
                      >
                        Next <i className="fas fa-long-arrow-alt-right"></i>
                      </button>
                    </div>
                  </div>
                );
              })()}
            </form>
          </div>
        </div>
      </ContextForm>
    );
  }
}
