import React from "react";
import { Validateable, Input, ContextForm, arrowStyle } from "../Common.js";
import MultiSelect from "react-multi-select-component";

export default class SignUpS1 extends Validateable {
  constructor(props) {
    let rules = {
      "User.user_name": {
        required: "Username is required",
        string: "Username can only be alpha-numeric(a-z,A-Z,0-9)"
      },
      "User.email": {
        required: "Email is required",
        email: "Email must be a valid email address"
      },
      "Company.was_permitted": { required: "This field is required" },
      "Company.name": {
        required: "This field is required",
        alpha_special_charaters: "Only A-Z,a-z and space allowed"
      },
      "Company.permission_letter": {
        required_if: function(model) {
          return _.get(model, "Company.was_permitted") == 1;
        },
        message: "This field is required"
      },
      "Company.sector_id": { required: "Please select company sector" },
      "Contact.Location.address_line1": { required: "This field is required" },
      "Contact.Location.country": { required: "Please select country" },
      "Contact.Location.city": { required: "Please select city" },
      "Contact.Location.zip": { required: "This field is required" },
      "Contact.office_phone": {
        required: "This field is required",
        phone: "Incorrect number format. Correct format is +420 000 000000"
      },
      //"Contact.office_fax":{required:"This field is required", phone:"Incorrect number format. Correct format is +420 000 000 000"},
      "Contact.office_email": {
        required: "Email is required",
        email: "Email must be a valid email address"
      },
      "Contact.full_name": {
        required: "This field is required",
        alpha_spaces: "Only A-Z,a-z and space allowed"
      },
      "Contact.primary_email": {
        required: "This field is required",
        email: "Email must be a valid email address"
      },
      "Contact.primary_phone": {
        required: "This field is required",
        phone: "Incorrect number format. Correct format is +420 000 000000"
      },
      // "Contact.nic_no":{required:"This field is required"},
      // "Contact.nic_copy":{required:"This field is required"},
      "Contact.passport_no": { required: "This field is required" },
      "Contact.passport_copy": { required: "This field is required" }
    };
    super(props, rules);
    this.validateOnBlur = true;
    this.state = {
      model: this.props.model,
      errors: this.props.errors,
      busy: false,
      sector: [],
      selectedSector: []
    };
    this.setSelected = this.setSelected.bind(this);
    if (!this.state.model.User) {
      this.state.model.User = {};
    }

    if (!this.state.model.Company) {
      this.state.model.Company = {};
    }

    if (!this.state.model.Contact) {
      this.state.model.Contact = {};
    }

    this.page = React.createRef();
  }
  componentDidMount() {
    console.log("PROPS 1-->", this.props.model);
    let sector = this.state.sector;
    window.__app.LOOKUP.Sector.data.map(data => {
      sector = [...sector, { label: data.text, value: data.value }];
    });
    console.log("SECTOR-->", sector);
    this.setState({
      sector,
      model: this.props.model
    });
    console.log("LOD DATA-->", window.__app.LOOKUP.Sector.data);
  }
  next() {
    if (this.validator.validate()) {
      this.setState({ busy: true });
      api.post("/validate/register", this.state.model).then(res => {
        if (res.success) {
          this.props.onNext(this.state.model);
        } else {
          this.setState({ busy: false });
          let errors = res.errors;
          if (
            _.has(errors, "User") ||
            _.has(errors, "Company") ||
            _.has(errors, "Contact")
          ) {
            this.setState({ errors: errors });
            $(".is-invalid:first").focus();
          } else {
            this.props.onNext(this.state.model);
          }
        }
      });
    }
  }
  setSelected(data) {
    const { model } = this.state;
    // model = { ...model, ...model.Company, sector_id: data };
    // let md = {...model.Company, sector_id : data}
    console.log("MODAL DATA-->", this.state);
    this.state.model.Company.sector_id = data;
    this.setState(
      {
        selectedSector: data
        /* model */
      },
      () => {
        console.log("SETSTAET->", this.state.selectedSector);
      }
    );
    console.log("EE->", data, " -->", this.state.model);
  }
  render() {
    let model = this.state.model;
    const options = [
      { label: "Grapes ", value: "grapes" },
      { label: "Mango ", value: "mango" },
      { label: "Strawberry", value: "strawberry" }
    ];
    console.log("STATE-->", this.state);

    return (
      <ContextForm target={this}>
        <div className="widget widget-form" ref={this.page}>
          <div className="widget-inner">
            <form className="needs-validation" noValidate>
              <div className="form-heading">
                <h4>Account Details</h4>
                <div className="d-flex justify-content-between">
                  <span className="float-left text-muted small">
                    Note: incomplete form will note be entertained
                  </span>
                  <span className="float-right text-danger small">
                    All fields are required
                  </span>
                </div>
              </div>
              <div className="clearfix"></div>

              <div className="row">
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="off_email">
                      Business email ID <span className="text-danger"> *</span>
                    </label>
                    <div className="">
                      <Input
                        type="email"
                        autoComplete="off"
                        id="off_email"
                        autoFocus
                        name="User.email"
                        className="form-control required"
                        placeholder="@Email Address"
                        maxLength="255"
                      />
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="owner_uname">
                      Username <span className="text-danger"> *</span>
                    </label>
                    <div className="">
                      <Input
                        type="text"
                        autoComplete="off"
                        id="owner_uname"
                        name="User.user_name"
                        className="form-control required"
                        placeholder="@userName"
                        maxLength="255"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-heading">
                <h4>Foreign Company details</h4>
              </div>

              <div className="row">
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="already_premitted">
                      Is your company already permitted?
                      <span className="text-danger"> *</span>
                    </label>
                    <div className="">
                      <Input
                        as="select"
                        className="custom-select"
                        id="already_premitted"
                        name="Company.was_permitted"
                        onChange={() => {
                          _.unset(
                            this.state.model,
                            "Company.permission_letter"
                          );
                          this.setState({ model: this.state.model });
                        }}
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
                    (_.get(this.state.model, "Company.was_permitted") == 0 ||
                    _.get(this.state.model, "Company.was_permitted") == null
                      ? " hidden"
                      : "")
                  }
                >
                  <div className="form-group">
                    <label htmlFor="permission_letter">
                      Last permission/renewal letter
                      <span className="text-danger"> *</span>
                    </label>
                    <div className="custom-file">
                      <Input
                        as="tempUpload"
                        type="file"
                        className="custom-file-input form-control"
                        id="permission_letter"
                        name="Company.permission_letter"
                        placeholder="lastRenewal.pdf"
                      />
                      <label
                        className="custom-file-label"
                        htmlFor="permission_letter"
                      >
                        {_.get(
                          this.state.model,
                          "Company.permission_letter.filename",
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
                      Company name<span className="text-danger"> *</span>
                    </label>
                    <div className="">
                      <Input
                        type="text"
                        autoComplete="off"
                        id="company_name"
                        name="Company.name"
                        className="form-control required"
                        placeholder="@companyName"
                        maxLength="255"
                      />
                    </div>
                  </div>
                </div>
                {/* <div className="col">
                  <div className="form-group">
                    <label htmlFor="company_sector">
                      Company sector<span className="text-danger"> *</span>
                    </label>
                    <div className="">
                      <Input
                        as="select"
                        lookup="Sector"
                        className={"custom-select "}
                        id="company_sector"
                        name="Company.sector_id"
                      >
                        <option value="">-- Select --</option>
                      </Input>
                    </div>
                  </div>
                </div> */}
                <div className="col-6">
                  <div className="form-group">
                    <label htmlFor="company_sector">
                      Company sector<span className="text-danger"> *</span>
                    </label>
                    <div className="">
                      <MultiSelect
                        hasSelectAll={false}
                        disableSearch={false}
                        options={this.state.sector}
                        value={this.state.selectedSector}
                        onChange={this.setSelected}
                        labelledBy={"Select"}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="company_name">
                      Company address<span className="text-danger"> *</span>
                    </label>
                    <div className="">
                      <Input
                        type="text"
                        autoComplete="off"
                        id="company_address"
                        name="Contact.Location.address_line1"
                        className="form-control required"
                        placeholder="@Hrant Madoyan St.14 Building, Gegharkunik Marz"
                        maxLength="255"
                      />
                      <div className="valid-feedback">Valid.</div>
                      <div className="invalid-feedback">
                        {_.get(
                          this.state.errors,
                          "Contact.Location.address_line1",
                          ""
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="country">
                      Country<span className="text-danger"> *</span>
                    </label>
                    <div className="">
                      <Input
                        as="select"
                        lookup="Country"
                        lookupDrop={["PAK"]}
                        className="custom-select"
                        id="country"
                        name="Contact.Location.country"
                      >
                        <option value="">-- Select --</option>
                      </Input>
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="city">
                      Please include other in city
                      <span className="text-danger"> *</span>
                    </label>
                    <div className="">
                      <Input
                        as="select"
                        lookup="City"
                        filterBy={function(data) {
                          let cc = _.get(
                            this.state.model,
                            "Contact.Location.country"
                          );

                          return data.filter(
                            e => e.cc == cc || (e.cc == "OTHER" && cc)
                          );
                        }.bind(this)}
                        className="custom-select"
                        id="city"
                        name="Contact.Location.city"
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
                      Postal code <span className="text-danger"> *</span>
                    </label>
                    <div className="">
                      <Input
                        type="text"
                        autoComplete="off"
                        id="postal_zip_code"
                        name="Contact.Location.zip"
                        className="form-control required"
                        placeholder="@postalCode"
                        maxLength="20"
                      />
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="company_phone">
                      Phone number <span className="text-danger"> *</span>
                    </label>
                    <div className="">
                      <Input
                        type="text"
                        as="phoneNumber"
                        autoComplete="off"
                        id="company_phone"
                        name="Contact.office_phone"
                        className="form-control required"
                        placeholder="+420 000 000000"
                        maxLength="20"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="company_fax">Fax number</label>
                    <div className="">
                      <Input
                        type="text"
                        as="phoneNumber"
                        autoComplete="off"
                        id="company_fax"
                        name="Contact.office_fax"
                        className="form-control"
                        placeholder="+420 000 000000"
                        maxLength="20"
                      />
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="company_email">
                      Company email address
                      <span className="text-danger"> *</span>
                    </label>
                    <div className="">
                      <Input
                        type="email"
                        id="company_email"
                        name="Contact.office_email"
                        className="form-control required"
                        placeholder="email@domainName.com"
                        maxLength="255"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-heading">
                <h4>Foreign Company contact person</h4>
              </div>

              <div className="row">
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="poc_name">
                      Full name<span className="text-danger"> *</span>
                    </label>
                    <div className="">
                      <Input
                        type="text"
                        autoComplete="off"
                        id="poc_name"
                        name="Contact.full_name"
                        className="form-control required"
                        placeholder="@fullName"
                        maxLength="255"
                      />
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="poc_email">
                      Email address<span className="text-danger"> *</span>
                    </label>
                    <div className="">
                      <Input
                        type="email"
                        id="poc_email"
                        name="Contact.primary_email"
                        className="form-control required"
                        placeholder="email@domainName.com"
                        maxLength="255"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="poc_phone">
                      Contact number<span className="text-danger"> *</span>
                    </label>
                    <div className="">
                      <Input
                        type="text"
                        as="phoneNumber"
                        autoComplete="off"
                        id="poc_phone"
                        name="Contact.primary_phone"
                        className="form-control"
                        placeholder="+420 000 000000"
                        maxLength="20"
                      />
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="poc_nid">
                      National identification card number
                    </label>
                    <div className="">
                      <Input
                        type="text"
                        autoComplete="off"
                        id="poc_nid"
                        name="Contact.nic_no"
                        className="form-control "
                        placeholder="@National Card Number"
                        maxLength="20"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="poc_nic_copy">
                      National identification card
                    </label>
                    <div className="custom-file">
                      <Input
                        as="tempUpload"
                        type="file"
                        className="custom-file-input form-control"
                        id="poc_nic_copy"
                        name="Contact.nic_copy"
                        placeholder="nationalCardCopy.pdf"
                      />
                      <label
                        className="custom-file-label"
                        htmlFor="poc_nic_copy"
                      >
                        {_.get(
                          this.state.model,
                          "Contact.nic_copy.filename",
                          ""
                        )}
                      </label>
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="poc_passport">
                      Passport number<span className="text-danger"> *</span>
                    </label>
                    <div className="">
                      <Input
                        type="text"
                        autoComplete="off"
                        id="poc_passport"
                        name="Contact.passport_no"
                        className="form-control required"
                        placeholder="@Passport Number"
                        maxLength="20"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="poc_passport_copy">
                      Passport copy<span className="text-danger"> *</span>
                    </label>
                    <div className="custom-file">
                      <Input
                        as="tempUpload"
                        type="file"
                        className="custom-file-input form-control"
                        id="poc_passport_copy"
                        name="Contact.passport_copy"
                        placeholder="passportCopy.pdf"
                      />
                      <label
                        className="custom-file-label"
                        htmlFor="poc_passport_copy"
                      >
                        {_.get(
                          this.state.model,
                          "Contact.passport_copy.filename",
                          ""
                        )}
                      </label>
                    </div>
                  </div>
                </div>
                <div className="col">&nbsp;</div>
              </div>
              <div className="form-footer">
                <div className="form-group float-right">
                  <button
                    style={arrowStyle}
                    type="button"
                    className={
                      "btn btn-primary" + (this.state.busy ? " busy" : "")
                    }
                    onClick={this.next.bind(this)}
                    disabled={this.state.busy}
                  >
                    NEXT
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
