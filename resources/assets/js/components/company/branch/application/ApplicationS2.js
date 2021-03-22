import React from "react";
import { Validateable, Input, ContextForm } from "../../../Common.js";
const ServiceType = __app.LOOKUP.ServiceType;

export default class BranchAppStep2 extends Validateable {
  constructor(props) {
    let rules = {
      /* "Agent.full_name": { required: "This field is required", alpha_spaces: "Only A-Z,a-z and space allowed" },
			"Agent.contact_category_id": { required: "This field is required" },
			"Agent.mobile_phone": { required: "This field is required", phone: "Incorrect number format. Correct format is +420 000 000 000" },
			"Agent.primary_email": { required: "This field is required", email: "Please enter valid email address" },
			"Agent.Location.address_line1": { required: "This field is required", custom_para: "Only alphabets, numbers, spaces and .,-_ allowed" },
			"Agent.Location.country": { required: "This field is required" },
			"Agent.Location.city": { required: "This field is required" }, */
    };
    if (_.get(props, "model.Branch.service_type_id") == ServiceType.BRANCH) {
      _.extend(rules, {
        "Contract.title": {
          required: "This field is required",
          custom_para: "Only alphabets, numbers, spaces and .,-_ allowed"
        },
        "Contract.agreement_letter": { required: "This field is required" },
        "Contract.start_date": { required: "This field is required" },
        "Contract.start_page": { required: "This field is required" },
        "Contract.valid_for_years": { required: "This field is required" },
        "Contract.end_page": { required: "This field is required" },
        "Contract.project_cost": {
          required: "This field is required",
          numbers: "Only numbers allowed"
        }
      });
    }
    if (props.subBranch) {
      rules = null; //readonly
    }
    super(props, rules);
    this.validateOnBlur = true;
    this.state = {
      model: this.props.model,
      errors: this.props.errors,
      busy: false
    };
    if (!props.subBranch) {
      if (!this.props.contractOnly) {
        if (!this.state.model.Company) {
          this.state.model.Company = {};
        }

        if (!this.state.model.Agent) {
          this.state.model.Agent = { Location: { country: "" } };
        }
      }
      if (
        _.get(this.state.model, "Branch.service_type_id") == ServiceType.BRANCH
      ) {
        if (!this.state.model.Contract) {
          console.log("STARTE DATE-->", this.state.model);

          this.state.model.Contract = {
            start_date: moment().format("MM/DD/YYYY")
          };
        }
      } else {
        _.unset(this.state.model, "Contract");
      }
    }

    this.page = React.createRef();
  }
  next() {
    if (this.props.subBranch) {
      return this.props.onNext(this.state.model);
    }
    this.setState({ busy: true });
    let data = _.cloneDeep(this.state.model);
    let contractStartDate = _.get(data, "Contract.start_date");
    let contractEndDate = _.get(data, "Contract.valid_for_years");
    let contractPeriodFrom = _.get(data, "Contract.defect_start_month");
    let contractPeriodTo = _.get(data, "Contract.defect_end_month");

    console.log("DATA -- >", data);
    if (contractStartDate) {
      console.log("STARTE DATE data-->", data);
      let date = moment(contractStartDate, "MM/DD/YYYY", true);
      if (date.isValid()) {
        data.Contract.start_date = date.format("YYYY-MM-DD");
      }
    }
    if (contractEndDate) {
      console.log("STARTE DATE data 1-->", data);
      let date = moment(contractEndDate, "MM/DD/YYYY", true);
      if (date.isValid()) {
        data.Contract.valid_for_years = date.format("YYYY-MM-DD");
      }
    }
    if (contractPeriodFrom) {
      console.log("STARTE DATE data 2-->", data);
      let date = moment(contractPeriodFrom, "MM/DD/YYYY", true);
      if (date.isValid()) {
        data.Contract.defect_start_month = date.format("YYYY-MM-DD");
      }
    }
    if (contractPeriodTo) {
      console.log("STARTE DATE data 3-->", data);
      let date = moment(contractPeriodTo, "MM/DD/YYYY", true);
      if (date.isValid()) {
        data.Contract.defect_end_month = date.format("YYYY-MM-DD");
      }
    }
    api.post("/validate/branch", { ...data, step: 2 }).then(res => {
      this.setState({ busy: false });
      console.log("RESPONSE -->", res);
      if (res.success) {
        if (contractStartDate) {
          console.log("STARTE DATE data 1 -->", data);
          this.state.model.Contract.start_date = data.Contract.start_date;
          this.state.model.Contract.valid_for_years =
            data.Contract.valid_for_years;
          this.state.model.Contract.defect_start_month =
            data.Contract.defect_start_month;
          this.state.model.Contract.defect_end_month =
            data.Contract.defect_end_month;
        }
        if (this.props.contractOnly && this.props.isLiaison) {
          this.props.submit(this.state.model);
        } else {
          this.props.onNext(this.state.model);
        }
      } else {
        let errors = res.errors;
        if (
          _.has(errors, "Company") ||
          _.has(errors, "Agent") ||
          _.has(errors, "Contract")
        ) {
          this.setState({ errors: errors });
          $(".is-invalid:first").focus();
        } else {
          console.log("STARTE DATE data 2-->", data);
          /*  let modal = this.state.modal;
          console.log({
            ...(modal.Contract.start_date = data.Contract.start_date)
		  }); */
          if (
            _.get(this.state.model, "Branch.service_type_id") ==
            ServiceType.BRANCH
          ) {
            this.state.model.Contract.start_date = data.Contract.start_date;
            this.state.model.Contract.valid_for_years =
              data.Contract.valid_for_years;
            this.state.model.Contract.defect_start_month =
              data.Contract.defect_start_month;
            this.state.model.Contract.defect_end_month =
              data.Contract.defect_end_month;
          }

          /* modal = {
            ...modal,
            modal: (modal.Contract.startDate = data.Contract.start_date)
          };
          this.setState({
            modal
          }); */
          this.props.onNext(this.state.model);
        }
      }
    });
  }
  back() {
    this.props.onBack(null, this.state.model);
  }
  render() {
    return (
      <ContextForm target={this}>
        <div className="widget widget-form" ref={this.page}>
          <div className="widget-inner">
            <form className="needs-validation" noValidate>
              {(() => {
                if (this.props.contractOnly) {
                  return renderContractForm.call(this);
                } else if (this.props.subBranch) {
                  return renderContracteeForm.call(this);
                } else {
                  return (
                    <React.Fragment>
                      {renderContracteeForm.call(this)}
                      {renderAgentForm.call(this)}
                      {_.get(this.state.model, "Branch.service_type_id") ==
                      ServiceType.BRANCH
                        ? renderContractForm.call(this)
                        : null}
                    </React.Fragment>
                  );
                }
              })()}

              {(() => {
                if (this.props.contractOnly) {
                  if (this.props.isLiaison) {
                    return (
                      <div className="form-footer">
                        <div className="form-group float-right">
                          <button
                            type="button"
                            className={
                              "btn btn-primary" +
                              (this.state.busy ? " busy" : "")
                            }
                            onClick={this.next.bind(this)}
                            disabled={this.state.busy}
                          >
                            Submit{" "}
                            <i className="fas fa-long-arrow-alt-right"></i>
                          </button>
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div className="form-footer">
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
                } else {
                  return (
                    <div className="form-footer">
                      {this.props.onBack ? (
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
                      ) : null}
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
                }
              })()}
            </form>
          </div>
        </div>
      </ContextForm>
    );
  }
}

function renderContracteeForm() {
  return (
    <React.Fragment>
      {/* <!-- Contractee Information --> */}
      <div className="form-group">
        <h3>Contractee Information</h3>
        <div>
          <span className="float-left text-muted small">
            Note: Incomplete form will not be entertained
          </span>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <div className="form-group">
            <label htmlFor="company_name">Company name</label>
            <div className="">
              <div disabled className="form-control">
                {_.get(this.props, "company.name")}
              </div>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="form-group">
            <label htmlFor="company_sector">Company sector</label>
            <div className="">
              <div disabled className="form-control">
                {__app.LOOKUP.text(
                  "Sector",
                  _.get(this.props, "company.sector_id")
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div className="form-group">
            <label htmlFor="company_name">Company address</label>
            <div className="">
              <div disabled className="form-control">
                {_.get(this.props, "company.contact.location.address_line1")}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div className="form-group">
            <label htmlFor="country">Country</label>
            <div className="">
              <div disabled className="form-control">
                {__app.LOOKUP.text(
                  "Country",
                  _.get(this.props, "company.contact.location.country")
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="form-group">
            <label htmlFor="city">City</label>
            <div className="">
              <div disabled className="form-control">
                {__app.LOOKUP.text(
                  "City",
                  _.get(this.props, "company.contact.location.city")
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <div className="form-group">
            <label htmlFor="postal_zip_code">Postal code/zip code</label>
            <div className="">
              <div disabled className="form-control">
                {_.get(this.props, "company.contact.location.zip")}
              </div>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="form-group">
            <label htmlFor="company_phone">Company phone number</label>
            <div className="">
              <div disabled className="form-control">
                {_.get(this.props, "company.contact.office_phone")}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <div className="form-group">
            <label htmlFor="company_fax">Company fax number</label>
            <div className="">
              <div disabled className="form-control">
                {_.get(this.props, "company.contact.office_fax")}
              </div>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="form-group">
            <label htmlFor="company_email">Company email address</label>
            <div className="">
              <div disabled className="form-control">
                {_.get(this.props, "company.contact.office_email")}
              </div>
            </div>
          </div>
        </div>
      </div>
      {this.props.subBranch ? null : (
        <React.Fragment>
          <div className="row">
            <div className="col">
              <div className="form-group">
                <label htmlFor="company_registration">
                  Copy of company registration
                  <span className="required-mark text-danger"> *</span>
                </label>
                <div className="custom-file">
                  <Input
                    type="file"
                    as="tempUpload"
                    className="custom-file-input"
                    id="company_registration"
                    name="Company.registration_letter"
                  />
                  <label
                    className="custom-file-label"
                    htmlFor="company_registration"
                  >
                    {_.get(
                      this.state.model,
                      "Company.registration_letter.filename",
                      ""
                    )}
                  </label>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <label htmlFor="Memorandum">
                  Memorandum of association
                  <span className="required-mark text-danger"> *</span>
                </label>
                <div className="custom-file">
                  <Input
                    type="file"
                    as="tempUpload"
                    className="custom-file-input"
                    id="permission_letter"
                    name="Company.memorandum_article"
                  />
                  <label className="custom-file-label" htmlFor="pMemorandum">
                    {_.get(
                      this.state.model,
                      "Company.memorandum_article.filename",
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
                <label htmlFor="Memorandum">
                  Artical of association
                  <span className="required-mark text-danger"> *</span>
                </label>
                <div className="custom-file">
                  <Input
                    type="file"
                    as="tempUpload"
                    className="custom-file-input"
                    id="permission_letter"
                    name="Company.article_association"
                  />
                  <label className="custom-file-label" htmlFor="pMemorandum">
                    {_.get(
                      this.state.model,
                      "Company.article_association.filename",
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
                <label htmlFor="resolution_letter">
                  Copy of resolution/authority letter
                  <span className="required-mark text-danger"> *</span>
                </label>
                <div className="custom-file">
                  <Input
                    type="file"
                    as="tempUpload"
                    className="custom-file-input"
                    id="resolution_letter"
                    name="Company.authority_letter"
                  />
                  <label
                    className="custom-file-label"
                    htmlFor="resolution_letter"
                  >
                    {_.get(
                      this.state.model,
                      "Company.authority_letter.filename",
                      ""
                    )}
                  </label>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <label htmlFor="compnay-profile">
                  Company profile
                  <span className="required-mark text-danger"> *</span>
                </label>
                <div className="custom-file">
                  <Input
                    type="file"
                    as="tempUpload"
                    className="custom-file-input"
                    id="compnay-profile"
                    name="Company.org_profile"
                  />
                  <label
                    className="custom-file-label"
                    htmlFor="compnay-profile"
                  >
                    {_.get(
                      this.state.model,
                      "Company.org_profile.filename",
                      ""
                    )}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

function renderAgentForm() {
  return (
    <React.Fragment>
      {/* <!-- Agent Information --> */}
      <div className="form-group">
        <h3>Agent Information</h3>

        <div>
          <span className="float-left text-muted small">
            Note: Optional Information{" "}
          </span>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div className="form-group">
            <label htmlFor="full_name">Full name</label>
            <div className="">
              <Input
                type="text"
                autoComplete="off"
                id="full_name"
                name="Agent.full_name"
                className="form-control required"
                placeholder="@fullName"
              />
            </div>
          </div>
        </div>
        <div className="col">
          <div className="form-group">
            <label htmlFor="type-law">Type</label>
            <div className="">
              <Input
                as="select"
                lookup="AgentType"
                className="custom-select"
                id="type-law"
                name="Agent.contact_category_id"
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
            <label htmlFor="cell-no">Cell phone number</label>
            <div className="">
              <Input
                type="text"
                autoComplete="off"
                id="cell-no"
                name="Agent.mobile_phone"
                className="form-control required"
                placeholder="+422 222 222222"
              />
            </div>
          </div>
        </div>
        <div className="col">
          <div className="form-group">
            <label htmlFor="company_email">Email</label>
            <div className="">
              <Input
                type="email"
                id="company_email"
                name="Agent.primary_email"
                className="form-control required"
                placeholder="user@email.com"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div className="form-group">
            <label htmlFor="company_name">Address</label>
            <div className="">
              <Input
                type="text"
                autoComplete="off"
                id="company_address"
                name="Agent.Location.address_line1"
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
            <label htmlFor="country">Country</label>
            <div className="">
              <Input
                as="select"
                lookup="Country"
                className="custom-select"
                id="country"
                name="Agent.Location.country"
              >
                <option value="">-- Select --</option>
              </Input>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="form-group">
            <label htmlFor="city">City</label>
            <div className="">
              <Input
                as="select"
                lookup="City"
                filterBy={function(data) {
                  let cc = _.get(this.state.model, "Agent.Location.country");

                  return data.filter(
                    e => e.cc == cc || (e.cc == "OTHER" && cc)
                  );
                }.bind(this)}
                className="custom-select"
                id="city"
                name="Agent.Location.city"
              >
                <option value="">-- Select --</option>
              </Input>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

function renderContractForm() {
  return (
    <React.Fragment>
      {/* <!-- Contract Information --> */}
      <div className="form-group">
        <h3>Contract Information</h3>

        <div>
          <span className="float-left text-muted small">
            Note: Incomplete form will not be entertained
          </span>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div className="form-group">
            <label htmlFor="contract">
              Title of contract
              <span className="required-mark text-danger"> *</span>
            </label>
            <div className="">
              <Input
                type="text"
                autoComplete="off"
                id="contract"
                name="Contract.title"
                className="form-control required"
                placeholder="@projectName"
              />
            </div>
          </div>
        </div>
        <div className="col">
          <div className="form-group">
            <label htmlFor="agreement">
              Contract agreement copy
              <span className="required-mark text-danger"> *</span>
            </label>
            <div className="custom-file">
              <Input
                type="file"
                as="tempUpload"
                className="custom-file-input"
                id="agreement"
                name="Contract.agreement_letter"
              />
              <label className="custom-file-label" htmlFor="agreement">
                {_.get(
                  this.state.model,
                  "Contract.agreement_letter.filename",
                  ""
                )}
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="starting-date">
              Starting date<span className="required-mark text-danger"> *</span>
            </label>
            <div className="">
              <Input
                as="datepicker"
                type="text"
                autoComplete="off"
                dateFormat="MM/dd/yyyy"
                id="starting-date"
                name="Contract.start_date"
                className="form-control required"
                placeholder="MM/DD/YYYY"
              />
            </div>
            {/* datepicker widget cause a problem to show error messages with Input
					show message manually */}
            {(() => {
              let err = _.get(this.state.errors, "Contract.start_date.0", "");
              if (err) {
                return (
                  <div
                    className="invalid-feedback"
                    style={{ display: "block" }}
                  >
                    {err}
                  </div>
                );
              }
            })()}
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-group">
            <label htmlFor="page-num">Page number</label>
            <div className="">
              <Input
                type="text"
                autoComplete="off"
                id="page-num"
                name="Contract.start_page"
                className="form-control required"
                placeholder="Page #"
              />
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-group">
            <label htmlFor="clause-num">Clause number</label>
            <div className="">
              <Input
                type="text"
                autoComplete="off"
                id="clause-num"
                name="Contract.start_clause"
                className="form-control required"
                placeholder="Clause #"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="period">
              End date
              <span className="required-mark text-danger"> *</span>
            </label>

            <div className="">
              <Input
                as="datepicker"
                type="text"
                autoComplete="off"
                dateFormat="MM/dd/yyyy"
                id="period"
                name="Contract.valid_for_years"
                className="form-control required"
                placeholder="MM/DD/YYYY"
              />
              {/*  <Input
                as="select"
                className="custom-select"
                id="period"
                name="Contract.valid_for_years"
              >
                <option value="">-- Select --</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val, key) => (
                  <option key={key} value={val}>
                    {val} years
                  </option>
                ))}
              </Input> */}
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-group">
            <label htmlFor="page_num">
              Page number<span className="required-mark text-danger"> *</span>
            </label>
            <div className="">
              <Input
                type="text"
                autoComplete="off"
                id="page_num"
                name="Contract.end_page"
                className="form-control required"
                placeholder="Page #"
              />
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-group">
            <label htmlFor="clause-num">
              Clause number<span className="required-mark text-danger"> *</span>
            </label>
            <div className="">
              <Input
                type="text"
                autoComplete="off"
                id="clause-num"
                name="Contract.end_clause"
                className="form-control required"
                placeholder="Clause #"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="form-group">
        <h4>Defect notification / warranty</h4>
      </div>
      <div className="row">
        <div className="col-md-3">
          <div className="form-group">
            <label htmlFor="month">Period from</label>
            <div className="">
              <Input
                as="datepicker"
                type="text"
                autoComplete="off"
                dateFormat="MM/dd/yyyy"
                id="month"
                name="Contract.defect_start_month"
                className="form-control"
                placeholder="MM/DD/YYYY"
              />
              {/* <Input
                as="select"
                data={months()}
                className="custom-select"
                id="month"
                name="Contract.defect_start_month"
              >
                <option value="">Month</option>
              </Input> */}
            </div>
          </div>
        </div>
        <div className="col-md-3">
          {/* <div className="form-group">
            <label htmlFor="year">&nbsp;</label>
            <div className="year-one">
              <Input
                as="select"
                data={years()}
                className="custom-select"
                id="year"
                name="Contract.defect_start_year"
              >
                <option value="">Year</option>
              </Input>
            </div>
          </div> */}
        </div>
        <div className="col-md-3">
          <div className="form-group">
            <label htmlFor="period">Period to</label>
            <div className="">
              <Input
                as="datepicker"
                type="text"
                autoComplete="off"
                dateFormat="MM/dd/yyyy"
                id="period"
                name="Contract.defect_end_month"
                className="form-control"
                placeholder="MM/DD/YYYY"
              />
              {/* <Input
                as="select"
                data={months()}
                className="custom-select"
                id="period"
                name="Contract.defect_end_month"
              >
                <option value="">Month</option>
              </Input> */}
            </div>
          </div>
        </div>
        <div className="col-md-3">
          {/* <div className="form-group">
            <label htmlFor="year">&nbsp;</label>
            <div className="year-two">
              <Input
                as="select"
                data={years()}
                className="custom-select"
                id="year"
                name="Contract.defect_end_year"
              >
                <option value="">Year</option>
              </Input>
            </div>
          </div> */}
        </div>
        <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="cost-project">
              Cost of project (US$)
              <span className="required-mark text-danger"> *</span>
            </label>
            <div className="">
              <Input
                type="text"
                autoComplete="off"
                id="cost-project"
                name="Contract.project_cost"
                className="form-control"
                placeholder="1000"
              />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
