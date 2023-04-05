import React from "react";
import { Validateable, Input, ContextForm } from "../../../Common.js";

export default class BranchAppStep4 extends Validateable {
  constructor(props) {
    let rules = {
      "Investment.proposal_info": {
        required: "This field is required",
        custom_para: "Only alphabets, numbers, spaces and .,-_ allowed"
      },
      "Investment.annual_expenses": {
        required: "This field is required",
        numbers: "Only numbers allowed"
      },
      //"Investment.expenses_copy": {required: "This field is required", custom_para:"Only alphabets, numbers, spaces and .,-_ allowed"},
      //"Investment.investment_info": {required: "This field is required", 	custom_para:"Only alphabets, numbers, spaces and .,-_ allowed"},
      /*  "Investment.pk_bank": {
        required: "This field is required",
        alpha_spaces: "Only A-Z,a-z and space allowed"
      }, */
      "Investment.designated_person": {
        required: "This field is required",
        alpha_spaces: "Only A-Z,a-z and space allowed"
      },
      // "Investment.comments": {required: "This field is required", custom_para:"Only alphabets, numbers, spaces and .,-_ allowed"},
      "SecurityAgency.security_required": {
        required: "This field is required"
      },
      "SecurityAgency.name": {
        required: "This field is required",
        custom_para: "Only alphabets, numbers, spaces and .,-_ allowed"
      },
      "SecurityAgency.ntn": { required: "This field is required" },
      "SecurityAgency.is_pk_based": { required: "This field is required" },
      "SecurityAgency.has_foreign_consultant": {
        required: "This field is required"
      },
      "SecurityAgency.is_extension": { required: "This field is required" },
      /* "SecurityAgency.extension_info": {
        required: "This field is required",
        custom_para: "Only alphabets, numbers, spaces and .,-_ allowed"
      }, */
      "SecurityAgency.Contact.Location.address_line1": {
        required: "This field is required",
        custom_para: "Only alphabets, numbers, spaces and .,-_ allowed"
      },
      "SecurityAgency.Contact.Location.country": {
        required: "This field is required"
      },
      "SecurityAgency.Contact.Location.city": {
        required: "This field is required"
      },
      "SecurityAgency.Contact.office_phone": {
        required: "This field is required",
        phone: "Incorrect number format. Correct format is +420 000 000000"
      },
      // "SecurityAgency.Contact.office_fax":{required: "This field is required", phone:"Incorrect number format. Correct format is +420 000 000 000"},
      "SecurityAgency.Contact.office_email": {
        required: "This field is required",
        email: "Please enter valid email address"
      },
      "SecurityAgency.Contact.Location.zip": {
        required: "This field is required"
      }
    };
    super(props, rules);
    this.validateOnBlur = true;
    this.state = {
      model: this.props.model,
      errors: this.props.errors,
      busy: false,
      visibleChecks: false
    };

    if (!this.state.model.Investment) {
      this.state.model.Investment = {};
    }

    if (!this.state.model.SecurityAgency) {
      this.state.model.SecurityAgency = {};
    }

    this.page = React.createRef();
  }
  submit() {
    this.setState({ busy: true });
    api
      .post("/branch/before-submit", { ...this.state.model, step: 4 })
      .then(res => {
        if (res.success) {
          this.props.onBeforeSubmit(this.state.model, res);
        } else {
          this.setState({ busy: false });
          let errors = res.errors;
          if (_.has(errors, "Investment") || _.has(errors, "SecurityAgency")) {
            this.setState({ errors: errors });
            $(".is-invalid:first").focus();
          } else {
            this.props.onBack(errors, this.state.model);
          }
        }
      });
  }

  handleNewChange(e) {
    let nVal = e.target.value;
    if (nVal === "1") {
      this.setState({ visibleChecks: true });
    } else {
      this.setState({ visibleChecks: false });
    }
  }

  back() {
    this.props.onBack(null, this.state.model);
  }
  render() {
    let model = this.state.model;
    return (
      <ContextForm target={this}>
        <div className="widget widget-form" ref={this.page}>
          <div className="widget-inner">
            <form className="needs-validation" noValidate>
              {/* <!-- Investment Information --> */}
              <div className="form-group">
                <h3>Investment Information</h3>

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
                      Investment proposed to be made in detail foreign / local
                      <span className="required-mark text-danger"> *</span>
                    </label>
                    <Input
                      as="textarea"
                      className="form-control"
                      name="Investment.proposal_info"
                      placeholder="Investment detail foreign/local"
                    ></Input>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="expenses">
                      Annual recurring expenses of office (USD)
                      <span className="required-mark text-danger"> *</span>
                    </label>
                    <div className="">
                      <Input
                        type="text"
                        autoComplete="off"
                        id="expenses"
                        name="Investment.annual_expenses"
                        className="form-control required"
                        placeholder="1000"
                      />
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="agreement">
                      Copy of investment proposal
                    </label>
                    <div className="custom-file">
                      <Input
                        type="file"
                        as="tempUpload"
                        className="custom-file-input"
                        id="agreement"
                        name="Investment.expenses_copy"
                      />
                      <label
                        className="custom-file-label blank-label"
                        htmlFor="agreement"
                      >
                        {_.get(
                          this.state.model,
                          "Investment.expenses_copy.filename",
                          ""
                        )}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              {this.props.model.convert && (
                <React.Fragment>
                  <div className="row">
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="valid_permission_rewnal">
                          Copy of valid permission/rewnal letter of boi
                        </label>
                        <div className="custom-file">
                          <Input
                            type="file"
                            as="tempUpload"
                            className="custom-file-input"
                            id="valid_permission_rewnal"
                            name="Investment.valid_permission_rewnal"
                          />
                          <label
                            className="custom-file-label blank-label"
                            htmlFor="valid_permission_rewnal"
                          >
                            {_.get(
                              this.state.model,
                              "Investment.valid_permission_rewnal.filename",
                              ""
                            )}
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="board_resolution">
                          Board resolution
                        </label>
                        <div className="custom-file">
                          <Input
                            type="file"
                            as="tempUpload"
                            className="custom-file-input"
                            id="board_resolution"
                            name="Investment.board_resolution"
                          />
                          <label
                            className="custom-file-label blank-label"
                            htmlFor="board_resolution"
                          >
                            {_.get(
                              this.state.model,
                              "Investment.board_resolution.filename",
                              ""
                            )}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              )}

              <div className="row">
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="organization">
                      State program to establish investment project in Pakistan,
                      if so nature of the same
                    </label>
                    <Input
                      as="textarea"
                      className="form-control"
                      name="Investment.investment_info"
                      placeholder="State programe to establish investment project in pakistan"
                    ></Input>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="bank">Name of bank in Pakistan</label>
                    <div className="">
                      <Input
                        type="text"
                        autoComplete="off"
                        id="bank"
                        name="Investment.pk_bank"
                        className="form-control "
                        placeholder="Name of Bank in Pakistan"
                      />
                    </div>
                  </div>
                </div>
                <div className="col"></div>
              </div>
              <div className="row">
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="Designated-person">
                      Designated person authorized to act on behalf of company
                      <span className="required-mark text-danger"> *</span>
                    </label>
                    <div className="">
                      <Input
                        type="text"
                        autoComplete="off"
                        id="Designated-person"
                        name="Investment.designated_person"
                        className="form-control required"
                        placeholder="Designated person authorized"
                      />
                    </div>
                  </div>
                </div>
                <div className="col"></div>
              </div>
              <div className="row">
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="deemed-info">
                      Any other information which is deemed appropriate of
                      consideration of request
                    </label>
                    <div className="">
                      <Input
                        as="textarea"
                        id="deemed-info"
                        name="Investment.comments"
                        className="form-control required"
                        placeholder="Any other information which is deemed appropriate of consideration of request"
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* <!-- Security Information --> */}
              <div className="form-group">
                <h3>Security information</h3>

                <div>
                  <span className="float-left text-muted small">
                    Note: Incomplete form will not be entertained
                  </span>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="Services">
                      Is services needed
                      <span className="required-mark text-danger"> *</span>
                    </label>
                    <div className="">
                      <Input
                        as="select"
                        className="custom-select"
                        id="Services"
                        name="SecurityAgency.security_required"
                      >
                        <option value="">-- Select --</option>
                        <option value="1">Yes</option>
                        <option value="0">No</option>
                      </Input>
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "col" +
                    (_.get(
                      this.state.model,
                      "SecurityAgency.security_required"
                    ) == "0"
                      ? " hidden"
                      : "")
                  }
                >
                  <div className="form-group">
                    <label htmlFor="Registered">
                      Registered name of security company
                      <span className="required-mark text-danger">*</span>
                    </label>
                    <div className="">
                      <Input
                        type="text"
                        autoComplete="off"
                        id="Registered"
                        name="SecurityAgency.name"
                        className="form-control required"
                        placeholder="Security Company Registered Name"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={
                  _.get(this.state.model, "SecurityAgency.security_required") ==
                  "0"
                    ? "hidden"
                    : ""
                }
              >
                <div className="row">
                  <div className="col">
                    <div className="form-group">
                      <label htmlFor="ntn">
                        Is the security company registered with SECP ?
                        <span className="required-mark text-danger"> *</span>
                      </label>
                      <div className="">
                        <Input
                          as="select"
                          className="custom-select"
                          id="ntn"
                          name="SecurityAgency.ntn"
                        >
                          <option value="">-- Select --</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </Input>
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="form-group">
                      <label htmlFor="Certificate">
                        SECP registration certificate
                      </label>
                      <div className="custom-file">
                        <Input
                          type="file"
                          as="tempUpload"
                          className="custom-file-input"
                          id="Certificate"
                          name="SecurityAgency.secp_certificate"
                        />
                        <label
                          className="custom-file-label"
                          htmlFor="agreement"
                        >
                          {_.get(
                            this.state.model,
                            "SecurityAgency.secp_certificate.filename",
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
                      <label htmlFor="security">
                        Please check if the security company hired is purely
                        Pakistani based
                        <span className="required-mark text-danger"> *</span>
                      </label>
                      <div className="">
                        <Input
                          onChange={this.handleNewChange.bind(this)}
                          as="select"
                          className="custom-select"
                          id="security"
                          name="SecurityAgency.is_pk_based"
                        >
                          <option value="">-- Select --</option>
                          <option value="1">Yes</option>
                          <option value="0">No</option>
                        </Input>
                      </div>
                    </div>
                  </div>
                  <div className="col"></div>
                </div>

                {this.state.visibleChecks ? (
                  <React.Fragment>
                    <div className="row">
                      <div className="col">
                        <div className="checkbox">
                          <label>
                            <Input
                              type="checkbox"
                              name="SecurityAgency.has_foreign_consultant"
                              value="1"
                            />{" "}
                            Has it hired services of foreign
                            consultant/nationals, in any form or manner
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col">
                        <div className="checkbox">
                          <label>
                            <Input
                              type="checkbox"
                              name="SecurityAgency.is_extension"
                              value="1"
                            />{" "}
                            Is it a Pakistani chapter/partnership/extension of a
                            foreign security company? If yes give details
                            <span className="required-mark text-danger">
                              {" "}
                              *
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col">
                        <div className="form-group">
                          <Input
                            as="textarea"
                            className="form-control"
                            name="SecurityAgency.extension_info"
                            placeholder="Please Enter Details"
                          ></Input>
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                ) : null}

                <div className="row">
                  <div className="col">
                    <div className="form-group">
                      <label htmlFor="address">
                        Address
                        <span className="required-mark text-danger"> *</span>
                      </label>
                      <div className="">
                        <Input
                          type="text"
                          autoComplete="off"
                          id="address"
                          name="SecurityAgency.Contact.Location.address_line1"
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
                          name="SecurityAgency.Contact.Location.country"
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
                              "SecurityAgency.Contact.Location.country"
                            )
                          }}
                          className="custom-select"
                          id="city"
                          name="SecurityAgency.Contact.Location.city"
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
                      <label htmlFor="Cell-Number">
                        Telephone no
                        <span className="required-mark text-danger">*</span>
                      </label>
                      <div className="">
                        <Input
                          type="text"
                          as="phoneNumber"
                          autoComplete="off"
                          id="telephone-no"
                          name="SecurityAgency.Contact.office_phone"
                          className="form-control required"
                          placeholder="@Telephone-No"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="form-group">
                      <label htmlFor="Fax-number">Fax no</label>
                      <div className="">
                        <Input
                          type="text"
                          as="phoneNumber"
                          autoComplete="off"
                          id="Fax-number"
                          name="SecurityAgency.Contact.office_fax"
                          className="form-control"
                          placeholder="@Fax No"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <div className="form-group">
                      <label htmlFor="company_email">
                        Email address
                        <span className="required-mark text-danger">*</span>
                      </label>
                      <div className="">
                        <Input
                          type="email"
                          id="company_email"
                          name="SecurityAgency.Contact.office_email"
                          className="form-control required"
                          placeholder="@Email Address"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="form-group">
                      <label htmlFor="postal_zip_code">
                        Postal code/zip code
                        <span className="required-mark text-danger">*</span>
                      </label>
                      <div className="">
                        <Input
                          type="text"
                          autoComplete="off"
                          id="postal_zip_code"
                          name="SecurityAgency.Contact.Location.zip"
                          className="form-control required"
                          placeholder="AR091H"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

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
                    onClick={this.submit.bind(this)}
                    disabled={this.state.busy}
                  >
                    {this.props.hasNext ? "Next" : "Submit"}{" "}
                    <i className="fas fa-long-arrow-alt-right"></i>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </ContextForm>
    );
  }
}
