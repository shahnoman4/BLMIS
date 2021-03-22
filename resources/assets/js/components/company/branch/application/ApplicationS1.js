import React from "react";
import { Validateable, Input, ContextForm, Redirect } from "../../../Common.js";
import { years, isBranch } from "../../../../helper/common.js";
import moment from "moment";
let ServiceType = __app.LOOKUP.ServiceType;
import MultiSelect from "react-multi-select-component";
import PopupModal from "../../../PopupModal.js";

export default class BranchAppStep1 extends Validateable {
  constructor(props) {
    super(props);
    let rules =
      this.props.company.was_permitted === 1
        ? {
            "Branch.service_type_id": { required: "This field is required" },
            "Branch.original_country": { required: "This field is required" },
            "Branch.primary_info": {
              required: "This field is required",
              custom_para: "Only alphabets, numbers, spaces and .,-_ allowed",
            },
            "Branch.other_org_info": {
              required: "This field is required",
              custom_para: "Only alphabets, numbers, spaces and .,-_ allowed",
            },
            "Branch.other_country_info": {
              required: "This field is required",
              custom_para: "Only alphabets, numbers, spaces and .,-_ allowed",
            },
            /* "Branch.current_country": {required: "This field is required"},
            "Branch.current_city": {required: "This field is required"}, */
            "Branch.desired_location": {
              required: "This field is required",
              custom_para: "Only alphabets, numbers, spaces and .,-_ allowed",
            },
            "Branch.desired_places": {
              required: "This field is required",
              custom_para: "Only alphabets, numbers, spaces and .,-_ allowed",
            },
            "Branch.business_info": {
              required: "This field is required",
              custom_para: "Only alphabets, numbers, spaces and .,-_ allowed",
            },
            "Branch.project_info": {
              required: "This field is required",
              custom_para: "Only alphabets, numbers, spaces and .,-_ allowed",
            },
            "Branch.repatriation_info": {
              required: "This field is required",
              custom_para: "Only alphabets, numbers, spaces and .,-_ allowed",
            },
            "Branch.local_associate_info": {
              required: "This field is required",
              custom_para: "Only alphabets, numbers, spaces and .,-_ allowed",
            },
            "Branch.start_month": { required: "This field is required" },
            "Branch.start_year": { required: "This field is required" },
            "Branch.no_of_personnel_employee": {
              required: "This field is required",
            },
            "Branch.firm_for_capital": { required: "This field is required" },
            "Branch.firm_for_profit": { required: "This field is required" },
            "Branch.background_info": {
              required: "This field is required",
              custom_para: "Only alphabets, numbers, spaces and .,-_ allowed",
            },
            "Branch.purpose_info": {
              required: "This field is required",
              custom_para: "Only alphabets, numbers, spaces and .,-_ allowed",
            },
            "LocalContact.Location.address_line1": {
              required: "This field is required",
              custom_para: "Only alphabets, numbers, spaces and .,-_ allowed",
            },
            "LocalContact.office_phone": {
              required: "This field is required",
              phone:
                "Incorrect number format. Correct format is +420 000 000000",
            },
            "LocalContact.mobile_phone": {
              required: "This field is required",
              phone:
                "Incorrect number format. Correct format is +420 000 000000",
            },
            // "LocalContact.office_fax": {required: "This field is required", phone:"Incorrect number format. Correct format is +420 000 000 000"},
            "LocalContact.office_email": {
              required: "This field is required",
              email: "Please enter valid email address",
            },
            "LocalContact.full_name": { required: "This field is required" },
            "LocalContact.primary_phone": {
              required: "This field is required",
              phone:
                "Incorrect number format. Correct format is +420 000 000000",
            },
            /* "LocalSponsor.Location.address_line1": {
        required: "This field is required",
        custom_para: "Only alphabets, numbers, spaces and .,-_ allowed"
      },
      "LocalSponsor.Location.city": { required: "This field is required" },
      "LocalSponsor.office_phone": {
        required: "This field is required",
        phone: "Incorrect number format. Correct format is +420 000 000 000"
      },
      "LocalSponsor.mobile_phone": {
        required: "This field is required",
        phone: "Incorrect number format. Correct format is +420 000 000 000"
      },
      "LocalSponsor.mobioffice_faxle_phone": {
        required: "This field is required",
        phone: "Incorrect number format. Correct format is +420 000 000 000"
      },
      "LocalSponsor.office_email": {
        required: "This field is required",
        email: "Please enter valid email address"
      } */
          }
        : {
            "Branch.service_type_id": { required: "This field is required" },
            "Branch.original_country": { required: "This field is required" },
            "Branch.primary_info": {
              required: "This field is required",
              custom_para: "Only alphabets, numbers, spaces and .,-_ allowed",
            },
            "Branch.other_org_info": {
              required: "This field is required",
              custom_para: "Only alphabets, numbers, spaces and .,-_ allowed",
            },
            "Branch.other_country_info": {
              required: "This field is required",
              custom_para: "Only alphabets, numbers, spaces and .,-_ allowed",
            },
            /* "Branch.current_country": {required: "This field is required"},
          "Branch.current_city": {required: "This field is required"}, */
            "Branch.desired_location": {
              required: "This field is required",
              custom_para: "Only alphabets, numbers, spaces and .,-_ allowed",
            },
            "Branch.desired_places": {
              required: "This field is required",
              custom_para: "Only alphabets, numbers, spaces and .,-_ allowed",
            },
            "Branch.business_info": {
              required: "This field is required",
              custom_para: "Only alphabets, numbers, spaces and .,-_ allowed",
            },
            "Branch.project_info": {
              required: "This field is required",
              custom_para: "Only alphabets, numbers, spaces and .,-_ allowed",
            },
            "Branch.repatriation_info": {
              required: "This field is required",
              custom_para: "Only alphabets, numbers, spaces and .,-_ allowed",
            },
            "Branch.local_associate_info": {
              required: "This field is required",
              custom_para: "Only alphabets, numbers, spaces and .,-_ allowed",
            },
            "Branch.start_month": { required: "This field is required" },
            "Branch.start_year": { required: "This field is required" },
            "Branch.no_of_personnel_employee": {
              required: "This field is required",
            },
            "Branch.firm_for_capital": { required: "This field is required" },
            "Branch.firm_for_profit": { required: "This field is required" },
            "Branch.background_info": {
              required: "This field is required",
              custom_para: "Only alphabets, numbers, spaces and .,-_ allowed",
            },
            "Branch.purpose_info": {
              required: "This field is required",
              custom_para: "Only alphabets, numbers, spaces and .,-_ allowed",
            },
          };

    super(props, rules);
    this.setCountry = this.setCountry.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.validateOnBlur = true;
    this.state = {
      model: this.props.model,
      errors: this.props.errors,
      busy: false,
      subApplicaton: this.props.company.was_permitted === 1 ? true : false,
      selectedCountry: [],
      countryList: [],
      show: true,
      requiredDocumentsList:
        !this.props.convert && !this.props.doRenew
          ? [
              {
                titleList: "Branch Office",
                list: [
                  "Copy of Registration of Company duly attested by respective Pak Embassy",
                  "Copy of Article of Memorandum of Association duly attested by respective Pak Embassy",
                  "Copy of Resolution /Authority letter of the company to establish Branch/Liaison Office in Pakistan",
                  "Company Profile",
                  "CV of Designated person authorized to act on behalf of the company + copies of Passport & NIC",
                  "Copy of Contract/Agreement with following information clearly indicating in the document & duly flagged/annexed",
                  "Contract Agreement",
                  "Original Receipt of processing fee of 3000US$ of Branch Office",
                ],
              },
              {
                titleList: "Liaison Office",
                list: [
                  "Copy of Registration of Company duly attested by respective Pak Embassy",
                  "Copy of Article of Memorandum of Association duly attested by respective Pak Embassy",
                  "Copy of Resolution /Authority letter of the company to establish Branch/Liaison Office in Pakistan",
                  "Company Profile",
                  "CV of Designated person authorized to act on behalf of the company + copies of Passport & NIC",
                  "Original Receipt of processing fee of 2000US$ of Liaison Office",
                ],
              },
            ]
          : this.props.doRenew
          ? [
              {
                titleList: "Renewal application of Branch Office",
                list: [
                  "Processing Fee of US$ 1000 per annum for Branch Office",
                  "Income Tax Returns for the last three years",
                  "Copy of Filing of documents with SECP",
                  "Proceed Realization Certificate (PRCs) from Bank (duly signed / stamped)",
                  "Audited Financial Statement for the last year",
                  "Copy of Contract/Agreement ( for Branch Office only) with following information clearly indicating in the document & duly flagged/annexed",
                  "Contract Agreement",
                ],
              },
              {
                titleList: "Renewal application of Liaison Office ",
                list: [
                  "Processing Fee of US$ 500 per annum for Branch Office",
                  "Income Tax Returns for the last three years",
                  "Copy of Filing of documents with SECP ",
                  "Proceed Realization Certificate (PRCs) from Bank (duly signed / stamped)",
                  "Audited Financial Statement or Detailed Payment / Receipts Statement  for the last year",
                  "Activity Report of Liaison Office",
                ],
              },
            ]
          : [
              {
                titleList: "Conversion of Liaison Office into Branch Office",
                list: [
                  "Prescribed Application Form (duly filled-in)",
                  "Board Resolution",
                  "Copy of Valid Permission/Renewal letter of BOI",
                  "Copy of Valid Contract Agreement",
                  "Original receipt of processing fee of 3000 US$",
                ],
              },
              {
                titleList: "Conversion of Branch Office into Liaison Office ",
                list: [
                  "Prescribed Application Form (duly filled-in)",
                  "Board Resolution",
                  "Copy of Valid Permission/Renewal letter of BOI",
                  "Original receipt of processing fee of 2000 US$",
                ],
              },
            ],
    };
    if (!this.state.model.Branch) {
      this.state.model.Branch = {};
    }

    if (this.props.convert) {
      if (isBranch(this.props.company.branch)) {
        this.state.model.Branch.service_type_id = ServiceType.LIAISON;
      } else {
        this.state.model.Branch.service_type_id = ServiceType.BRANCH;
      }
    }

    if (this.props.company.authority_letter && !this.state.model.isRenew) {
      this.state.model.isRenew = true;
    }

    if (!this.state.model.LocalContact) {
      this.state.model.LocalContact = {};
    }

    if (!this.state.model.LocalSponsor) {
      this.state.model.LocalSponsor = {};
    }

    this.page = React.createRef();
  }
  componentDidMount() {
    console.log("LOG APP -->", __app.LOOKUP.Country);
    let countryList = this.state.countryList;
    __app.LOOKUP.Country.data.map((data) => {
      countryList = [...countryList, { label: data.text, value: data.value }];
    });
    let selectedCountry =
      this.props.model.Branch.current_country != undefined
        ? this.props.model.Branch.current_country
        : [];
    console.log("COUNTRY LIST -->", selectedCountry);
    this.setState({
      countryList,
      selectedCountry,
    });
  }
  next() {
    this.setState({ busy: true });
    api
      .post("/validate/branch", { ...this.state.model, step: 1 })
      .then((res) => {
        if (res.success) {
          this.props.onNext(this.state.model);
        } else {
          this.setState({ busy: false });
          let errors = res.errors;
          if (
            _.has(errors, "Branch") ||
            _.has(errors, "LocalContact") ||
            _.has(errors, "LocalSponsor")
          ) {
            this.setState({ errors: errors });
            $(".is-invalid:first").focus();
          } else {
            this.props.onNext(this.state.model);
          }
        }
      });
  }
  handleClose() {
    this.setState({
      show: false,
    });
  }
  setCountry(data) {
    console.log(" COUNTRY MODAL DATA-->", this.state.model);
    this.state.model.Branch.current_country = data;
    this.setState({ selectedCountry: data });
  }
  render() {
    let model = this.state.model;
    let company = this.props.company;
    let _serviceTypes;
    if (!company.branch) {
      _serviceTypes = [
        {
          text: "Branch Office",
          value: ServiceType.BRANCH,
        },
        {
          text: "Liaison Office",
          value: ServiceType.LIAISON,
        },
      ];
    } else {
      if (this.props.convert) {
        if (isBranch(company.branch)) {
          _serviceTypes = [
            {
              text: "Liaison Office",
              value: ServiceType.LIAISON,
            },
          ];
        } else {
          _serviceTypes = [
            {
              text: "Branch Office",
              value: ServiceType.BRANCH,
            },
          ];
        }
      } else {
        if (company.branch.service_type_id === ServiceType.BRANCH) {
          _serviceTypes = [
            {
              text: "Sub-Branch Office",
              value: ServiceType.SUB_BRANCH,
            },
          ];
        } else {
          _serviceTypes = [
            {
              text: "Sub-Liaison Office",
              value: ServiceType.SUB_LIAISON,
            },
          ];
        }
      }
    }
    console.log("WINDOW LOOKUP-->", window.__app);
    console.log(" AS1 PROPS-->", this.props);
    console.log(" AS1 STATE-->", this.state);
    return (
      <ContextForm target={this}>
        <PopupModal
          show={this.state.show}
          title={"Required Documents"}
          handleClose={this.handleClose}
          list={this.state.requiredDocumentsList}
        />
        <div className="widget widget-form" ref={this.page}>
          <div className="widget-inner">
            <form className="needs-validation" noValidate>
              {/* <!-- Business Information --> */}
              <div className="form-group">
                <h3>Business Information</h3>

                <div>
                  <span className="float-left text-muted small">
                    Note: Incomplete form will not be entertained
                  </span>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="Servies">
                      Type of offices<span className="text-danger"> *</span>
                    </label>
                    <div className="">
                      <Input
                        as="select"
                        data={_serviceTypes}
                        className="custom-select"
                        id="Servies"
                        name="Branch.service_type_id"
                        onChange={this.props.onTypeChange}
                        disabled={this.props.convert}
                      >
                        <option value="">-- Select --</option>
                      </Input>
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="Origin">
                      Country of origin<span className="text-danger"> *</span>
                    </label>
                    <div className="">
                      <Input
                        as="select"
                        lookup="Country"
                        className="custom-select"
                        id="Origin"
                        name="Branch.original_country"
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
                    <label htmlFor="company_name">
                      Present business activities
                      <span className="text-danger"> *</span>
                    </label>
                    <Input
                      as="textarea"
                      rows="5"
                      className="form-control"
                      name="Branch.primary_info"
                      placeholder="Present Business Activities"
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="organization">
                      State if your company is subsidiary of any other principal
                      / organization<span className="text-danger"> *</span>
                    </label>
                    <Input
                      as="textarea"
                      rows="5"
                      className="form-control"
                      name="Branch.other_org_info"
                      placeholder="Other Organization"
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="venture">
                      Detail of project / ventures in other countries
                      <span className="text-danger"> *</span>
                    </label>
                    <Input
                      as="textarea"
                      rows="5"
                      className="form-control"
                      name="Branch.other_country_info"
                      placeholder="Other Organization"
                    />
                  </div>
                </div>
              </div>
              {this.state.subApplicaton ? (
                <div className="row">
                  <div className="col">
                    <div className="form-group">
                      <label htmlFor="month">
                        Initial permission period
                        <span className="text-danger"> *</span>
                      </label>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="">
                            <Input
                              as="select"
                              data={months()}
                              className="custom-select"
                              id="month"
                              name="Branch.start_month"
                            >
                              <option value="">-- Month --</option>
                            </Input>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="year-one">
                            <Input
                              as="select"
                              data={years(-72, 74)}
                              className="custom-select"
                              id="year"
                              name="Branch.start_year"
                            >
                              <option value="">-- Year --</option>
                            </Input>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="row">
                {/* <div className="col">
                  <div className="form-group">
                    <label htmlFor="country">
                      Existing branch/liaison office in other country
                    </label>
                    <div className="">
                      <Input
                        as="select"
                        lookup="Country"
                        className="custom-select"
                        id="country"
                        name="Branch.current_country"
                      >
                        <option value="">-- Select --</option>
                      </Input>
                    </div>
                  </div>
                </div> */}
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="company_sector">
                      Existing branch/liaison office in other country
                    </label>
                    <div className="">
                      <MultiSelect
                        hasSelectAll={false}
                        disableSearch={false}
                        options={this.state.countryList}
                        value={
                          _.isArray(this.state.selectedCountry)
                            ? this.state.selectedCountry
                            : []
                        }
                        onChange={this.setCountry}
                        labelledBy={"Select"}
                      />
                    </div>
                  </div>
                </div>
                {/* <div className="col">
                                    <div className="form-group">
                                        <label htmlFor="city">City where project is underway<span className="text-danger"> *</span></label>
                                        <div className="">
                                        
                                            <Input as="select" lookup='City' filterBy={(function(data){
                                                    let cc = _.get(this.state.model, 'Branch.current_country');
                                                    
                                                   return data.filter(e=>e.cc == cc || (e.cc=='OTHER' && cc) );
                                                }).bind(this)}  className="custom-select" id="city" name="Branch.current_city">
                                                <option value="">-- Select --</option>
                                            </Input>
                                        </div>
                                    </div>
                                </div> */}
              </div>
              <div className="row">
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="location">
                      Location/place where permission is required to establish
                      Liaison/branch office in Pakistan
                      <span className="text-danger"> *</span>
                    </label>
                    <div className="">
                      <Input
                        type="text"
                        autoComplete="off"
                        id="location"
                        name="Branch.desired_location"
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
                    <label htmlFor="Proposed address">
                      Proposed address in Pakistan also indicates places if more
                      than one<span className="text-danger"> *</span>
                    </label>
                    <div className="">
                      <Input
                        type="text"
                        autoComplete="off"
                        id="Proposed address"
                        name="Branch.desired_places"
                        className="form-control required"
                        placeholder="@Hrant Madoyan St.14 Building, Gegharkunik Marz"
                      />
                    </div>
                    <p className="text-muted small">
                      Note: Use [;] for multiple values
                    </p>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="Intended">
                      Intended business activities in Pakistan
                      <span className="text-danger"> *</span>
                    </label>
                    <Input
                      as="textarea"
                      rows="5"
                      className="form-control"
                      name="Branch.business_info"
                      placeholder="Intended Field of Business Activities in Pakistan"
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="project">
                      Projects/details of work in Pakistan
                      <span className="text-danger"> *</span>
                    </label>
                    <Input
                      as="textarea"
                      rows="5"
                      className="form-control"
                      name="Branch.project_info"
                      placeholder="Projects/Details of work in Pakistan"
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="NoOfEmployee">
                      Number of personnel{" "}
                      <span className="text-danger"> *</span>
                    </label>
                    <div className="">
                      <Input
                        as="select"
                        className="custom-select"
                        id="NoOfEmployee"
                        name="Branch.no_of_personnel_employee"
                      >
                        <option value="">-- Select --</option>
                        {[...Array(200)].map((item, index) => (
                          <option key={index} value={index + 1}>
                            {index + 1}
                          </option>
                        ))}
                        <option value="200+">200+</option>
                      </Input>
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="firm_for_capital">
                      Details of foreign company for capital
                      <span className="text-danger"> *</span>
                    </label>
                    <div className="">
                      <Input
                        type="text"
                        autoComplete="off"
                        id="firm_for_capital"
                        name="Branch.firm_for_capital"
                        className="form-control required"
                        placeholder="@Details of foreign firm for capital"
                      />
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="firm_for_profit">
                      Details of foreign company for profit
                      <span className="text-danger"> *</span>
                    </label>
                    <div className="">
                      <Input
                        type="text"
                        autoComplete="off"
                        id="firm_for_profit"
                        name="Branch.firm_for_profit"
                        className="form-control required"
                        placeholder="@Details of foreign firm for profit"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="company_name">
                      State if repatriation facilities are required by the
                      foreign company for capital and profit
                      <span className="text-danger"> *</span>
                    </label>
                    <Input
                      as="textarea"
                      rows="5"
                      className="form-control"
                      name="Branch.repatriation_info"
                      placeholder="State if repatriation facilities are required by foreign firm for capital and profit"
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="associated-investment">
                      State if any Pakistani co/individual is associated in the
                      co. with details of investment (% Share)
                      <span className="text-danger"> *</span>
                    </label>
                    <Input
                      as="textarea"
                      rows="5"
                      className="form-control"
                      name="Branch.local_associate_info"
                      placeholder="State if repatriation facilities are required by foreign firm for capital and profit"
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="Background">
                      Detailed background<span className="text-danger"> *</span>
                    </label>
                    <Input
                      as="textarea"
                      rows="5"
                      className="form-control"
                      name="Branch.background_info"
                      placeholder="History of the Foreign Company  "
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="purpose">
                      Purpose for opening<span className="text-danger"> *</span>
                    </label>
                    <Input
                      as="textarea"
                      rows="5"
                      className="form-control"
                      name="Branch.purpose_info"
                      placeholder="Purpose of Opening Office in Pakistan"
                    />
                  </div>
                </div>
              </div>
              {/* <!-- Company's complete local address   --> */}
              {this.state.subApplicaton ? (
                <React.Fragment>
                  <div className="form-group">
                    <h3>Company's complete local address</h3>
                    <div>
                      <span className="float-left text-muted small">
                        Note: Incomplete form will not be entertained
                      </span>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="location">
                          Location<span className="text-danger"> *</span>
                        </label>
                        <div className="">
                          <Input
                            type="text"
                            autoComplete="off"
                            id="location"
                            name="LocalContact.Location.address_line1"
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
                        <label htmlFor="Telephone">
                          Telephone number
                          <span className="text-danger"> *</span>
                        </label>
                        <div className="">
                          <Input
                            type="text"
                            as="phoneNumber"
                            autoComplete="off"
                            id="Telephone"
                            name="LocalContact.office_phone"
                            className="form-control required"
                            placeholder="+422 222 222222"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="Cell-Number">
                          Cell number<span className="text-danger"> *</span>
                        </label>
                        <div className="">
                          <Input
                            type="text"
                            as="phoneNumber"
                            autoComplete="off"
                            id="Cell-Number"
                            name="LocalContact.mobile_phone"
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
                        <label htmlFor="Fax-number">Fax number</label>
                        <div className="">
                          <Input
                            type="text"
                            as="phoneNumber"
                            autoComplete="off"
                            id="Fax-number"
                            name="LocalContact.office_fax"
                            className="form-control required"
                            placeholder="+422 222 222222"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="company_email">
                          Email address<span className="text-danger"> *</span>
                        </label>
                        <div className="">
                          <Input
                            type="email"
                            id="company_email"
                            name="LocalContact.office_email"
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
                        <label htmlFor="perosn">
                          Contact person name
                          <span className="text-danger"> *</span>
                        </label>
                        <div className="">
                          <Input
                            type="text"
                            id="perosn"
                            name="LocalContact.full_name"
                            className="form-control required"
                            placeholder="@perosn name"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="person">
                          Contact person number
                          <span className="text-danger"> *</span>
                        </label>
                        <div className="">
                          <Input
                            type="text"
                            as="phoneNumber"
                            id="person"
                            name="LocalContact.primary_phone"
                            className="form-control required"
                            placeholder="+422 222 222222"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <div className="form-group">
                    <h3>Company's complete local address</h3>
                    <div>
                      <span className="float-left text-muted small">
                        Note: Optional Information
                      </span>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="location">Location</label>
                        <div className="">
                          <Input
                            type="text"
                            autoComplete="off"
                            id="location"
                            name="LocalContact.Location.address_line1"
                            className="form-control"
                            placeholder="@Hrant Madoyan St.14 Building, Gegharkunik Marz"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="Telephone">Telephone number</label>
                        <div className="">
                          <Input
                            type="text"
                            as="phoneNumber"
                            autoComplete="off"
                            id="Telephone"
                            name="LocalContact.office_phone"
                            className="form-control "
                            placeholder="+422 222 222222"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="Cell-Number">Cell number</label>
                        <div className="">
                          <Input
                            type="text"
                            as="phoneNumber"
                            autoComplete="off"
                            id="Cell-Number"
                            name="LocalContact.mobile_phone"
                            className="form-control"
                            placeholder="+422 222 222222"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="Fax-number">Fax number</label>
                        <div className="">
                          <Input
                            type="text"
                            as="phoneNumber"
                            autoComplete="off"
                            id="Fax-number"
                            name="LocalContact.office_fax"
                            className="form-control required"
                            placeholder="+422 222 222222"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="company_email">Email address</label>
                        <div className="">
                          <Input
                            type="email"
                            id="company_email"
                            name="LocalContact.office_email"
                            className="form-control "
                            placeholder="user@example.com"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="perosn">Contact person name</label>
                        <div className="">
                          <Input
                            type="text"
                            id="perosn"
                            name="LocalContact.full_name"
                            className="form-control "
                            placeholder="@perosn name"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="person">Contact person number</label>
                        <div className="">
                          <Input
                            type="text"
                            as="phoneNumber"
                            id="person"
                            name="LocalContact.primary_phone"
                            className="form-control "
                            placeholder="+422 222 222222"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              )}
              {/* <!-- Company local sponsor --> */}
              <div className="form-group">
                <h3>Company's local sponsor</h3>

                <div>
                  <span className="float-left text-muted small">
                    Note: Optional Information
                  </span>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="location">Location</label>
                    <div className="">
                      <Input
                        type="text"
                        autoComplete="off"
                        id="location"
                        name="LocalSponsor.Location.address_line1"
                        className="form-control"
                        placeholder="@Hrant Madoyan St.14 Building, Gegharkunik Marz"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="city">City</label>
                    <div className="">
                      <Input
                        as="select"
                        lookup="City"
                        filterBy={{ cc: "PAK" }}
                        className="custom-select"
                        id="city"
                        name="LocalSponsor.Location.city"
                      >
                        <option value="">-- Select --</option>
                      </Input>
                    </div>
                  </div>
                </div>

                <div className="col">
                  <div className="form-group">
                    <label htmlFor="Telephone">Telephone number</label>
                    <div className="">
                      <Input
                        type="text"
                        as="phoneNumber"
                        autoComplete="off"
                        id="Telephone"
                        name="LocalSponsor.office_phone"
                        className="form-control"
                        placeholder="+422 222 222222"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="Cell-Number">Cell number</label>
                    <div className="">
                      <Input
                        type="text"
                        as="phoneNumber"
                        autoComplete="off"
                        id="Cell-Number"
                        name="LocalSponsor.mobile_phone"
                        className="form-control "
                        placeholder="+422 222 222222"
                      />
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="Fax-number">Fax number</label>
                    <div className="">
                      <Input
                        type="text"
                        as="phoneNumber"
                        autoComplete="off"
                        id="Fax-number"
                        name="LocalSponsor.office_fax"
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
                    <label htmlFor="company_email">Email address</label>
                    <div className="">
                      <Input
                        type="email"
                        id="company_email"
                        name="LocalSponsor.office_email"
                        className="form-control"
                        placeholder="user@example.com"
                      />
                    </div>
                  </div>
                </div>
                <div className="col" />
              </div>

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
                    Next <i className="fas fa-long-arrow-alt-right" />
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

export class SubBranchForm extends Validateable {
  constructor(props) {
    let rules = {
      "Branch.desired_location": {
        required: "This field is required",
        custom_para: "Only alphabets, numbers, spaces and .,-_ allowed",
      },
      "Branch.desired_places": {
        required: "This field is required",
        custom_para: "Only alphabets, numbers, spaces and .,-_ allowed",
      },
      "Branch.business_info": {
        required: "This field is required",
        custom_para: "Only alphabets, numbers, spaces and .,-_ allowed",
      },
      "RP.full_name": {
        required: "This field is required",
        custom_para: "Only alphabets, numbers, spaces and .,-_ allowed",
      },
      "RP.nic_no": {
        required: "This field is required",
        custom_para: "Only alphabets, numbers, spaces and .,-_ allowed",
      },
      "RP.passport_no": {
        required: "This field is required",
        custom_para: "Only alphabets, numbers, spaces and .,-_ allowed",
      },
    };

    super(props, rules);

    this.validateOnBlur = true;
    this.handleClose = this.handleClose.bind(this);
    this.state = {
      model: this.props.model,
      errors: this.props.errors,
      busy: false,
      show: true,
      requiredDocumentsList: [
        {
          titleList: "Sub Branch Office",
          list: [
            "Prescribed Application Form (duly filled-in)",
            "Copy of Valid Permission/Renewal letter of BOI",
            "Copy of Valid Contract Agreement",
            "Copy of SECP Certificate",
            "CV/CNIC/Passport copies of Representative for Sub-Office",
            "Original receipt of processing fee 1500 US$",
          ],
        },
        {
          titleList: "Sub Liaison Office",
          list: [
            "Prescribed Application Form (duly filled-in/stamped)",
            "Copy of Valid Permission/Renewal letter of BOI",
            "Copy of SECP Certificate",
            "CV/CNIC/Passport copies of Representative for Sub-Office",
            "Original receipt of processing fee 1000 US$",
          ],
        },
      ],
    };
    if (!this.state.model.Branch) {
      this.state.model.Branch = {};
    }

    this.page = React.createRef();
  }
  back() {
    this.props.onBack(null, this.state.model);
  }
  submit() {
    this.setState({ busy: true });
    api
      .post("/sub-branch/before-submit", { ...this.state.model })
      .then((res) => {
        this.setState({ busy: false });
        if (res.success) {
          this.props.onBeforeSubmit(this.state.model, res);
        } else {
          let errors = res.errors;
          if (_.has(errors, "Branch")) {
            this.setState({ errors: errors });
            $(".is-invalid:first").focus();
          }
        }
      });
  }
  handleClose() {
    this.setState({
      show: false,
    });
  }
  render() {
    console.log("LOOKUP SERVICE--> ", __app.LOOKUP.ServiceType);
    let serviceTypeSubBranch = __app.LOOKUP.ServiceType.SUB_BRANCH;
    let serviceTypeBranch = __app.LOOKUP.ServiceType.BRANCH;
    console.log(
      "BOOLLL--->>",
      serviceTypeBranch === __app.LOOKUP.ServiceType.BRANCH
    );
    console.log(serviceTypeBranch, this.props.company.branch.service_type_id);

    console.log("PROPS-->", this.props.company.branch.service_type_id);
    console.log("STATE-->", this.state);
    return (
      <ContextForm target={this}>
        <PopupModal
          show={this.state.show}
          title={"Required Documents"}
          handleClose={this.handleClose}
          list={this.state.requiredDocumentsList}
        />
        <div className="widget widget-form" ref={this.page}>
          <div className="widget-inner">
            <form className="needs-validation" noValidate>
              {/* <!-- Business Information --> */}
              <div className="form-group">
                <h3>Business information</h3>

                <div>
                  <span className="float-left text-muted small">
                    Note: Incomplete form will not be entertained
                  </span>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="location">
                      Location/place where permission is required to establish
                      sub office of Liaison/branch in Pakistan
                      <span className="text-danger"> *</span>
                    </label>
                    <div className="">
                      <Input
                        type="text"
                        autoComplete="off"
                        id="location"
                        name="Branch.desired_location"
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
                    <label htmlFor="Proposed address">
                      Proposed address in Pakistan also indicates places if more
                      than one<span className="text-danger"> *</span>
                    </label>
                    <div className="">
                      <Input
                        type="text"
                        autoComplete="off"
                        id="Proposed address"
                        name="Branch.desired_places"
                        className="form-control required"
                        placeholder="@Hrant Madoyan St.14 Building, Gegharkunik Marz"
                      />
                    </div>
                    <p className="text-muted small">
                      Note: Use [;] for multiple values
                    </p>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="Intended">
                      Intended business activities in Pakistan
                      <span className="text-danger"> *</span>
                    </label>
                    <Input
                      as="textarea"
                      rows="5"
                      className="form-control"
                      name="Branch.business_info"
                      placeholder="Intended Field of Business Activities in Pakistan"
                    />
                  </div>
                </div>
              </div>
              <div className="form-group">
                <h3>Representative of sub office information</h3>
                <div>
                  <span className="float-left text-muted small">
                    Note: Incomplete form will not be entertained
                  </span>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="rp_name">
                      Representative Officer Name
                      <span className="text-danger"> *</span>
                    </label>
                    <div className="">
                      <Input
                        type="text"
                        autoComplete="off"
                        id="branch_name"
                        autoFocus
                        name="RP.full_name"
                        className="form-control required"
                        placeholder="@fullName"
                        maxLength="255"
                      />
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="rp_photo">
                      Photo of Representative Officer
                      <span className="text-danger"> *</span>
                    </label>
                    <div className="custom-file">
                      <Input
                        as="tempUploadImage"
                        type="file"
                        className="custom-file-input form-control"
                        id="rp_photo"
                        name="RP.rp_dp"
                      />
                      <label className="custom-file-label" htmlFor="rp_photo">
                        {_.get(this.state.model, "RP.rp_dp.filename", "")}
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="rp_cv">
                      Representative Officer CV
                      <span className="text-danger"> *</span>
                    </label>
                    <div className="custom-file">
                      <Input
                        as="tempUpload"
                        type="file"
                        className="custom-file-input form-control"
                        id="rp_cv"
                        name="RP.rp_cv"
                      />
                      <label className="custom-file-label" htmlFor="rp_cv">
                        {_.get(this.state.model, "RP.rp_cv.filename", "")}
                      </label>
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="rp_cover">
                      Representative Officer Cover Letter
                      <span className="text-danger"> *</span>
                    </label>
                    <div className="custom-file">
                      <Input
                        as="tempUpload"
                        type="file"
                        className="custom-file-input form-control"
                        id="rp_cover"
                        name="RP.rp_cover_letter"
                      />
                      <label className="custom-file-label" htmlFor="rp_cover">
                        {_.get(
                          this.state.model,
                          "RP.rp_cover_letter.filename",
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
                    <label htmlFor="rp_nid">
                      Representative Officer NIC Number
                    </label>
                    <div className="">
                      <Input
                        type="text"
                        autoComplete="off"
                        id="rp_nid"
                        name="RP.nic_no"
                        className="form-control required"
                        placeholder="@National Card Number"
                        maxLength="20"
                      />
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="rp_nic_copy">
                      Representative Officer NIC Copy
                    </label>
                    <div className="custom-file">
                      <Input
                        as="tempUpload"
                        type="file"
                        className="custom-file-input form-control"
                        id="rp_nic_copy"
                        name="RP.rp_nic_copy"
                      />
                      <label
                        className="custom-file-label"
                        htmlFor="rp_nic_copy"
                      >
                        {_.get(this.state.model, "RP.rp_nic_copy.filename", "")}
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="rp_passport">
                      Representative Officer Passport Number
                    </label>
                    <div className="">
                      <Input
                        type="text"
                        autoComplete="off"
                        id="rp_passport"
                        name="RP.passport_no"
                        className="form-control required"
                        placeholder="@Passport Number"
                        maxLength="20"
                      />
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="rp_passport_copy">
                      Representative Officer Passport Copy
                    </label>
                    <div className="custom-file">
                      <Input
                        as="tempUpload"
                        type="file"
                        className="custom-file-input form-control"
                        id="rp_passport_copy"
                        name="RP.rp_passport_copy"
                      />
                      <label
                        className="custom-file-label"
                        htmlFor="rp_passport_copy"
                      >
                        {_.get(
                          this.state.model,
                          "RP.rp_passport_copy.filename",
                          ""
                        )}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-6">
                  <div className="form-group">
                    <label htmlFor="rp_passport">Lease Agreement</label>
                    <div className="">
                      <div className="custom-file">
                        <Input
                          as="tempUpload"
                          type="file"
                          className="custom-file-input form-control"
                          id="rp_lease_agreement"
                          name="RP.rp_lease_agreement"
                        />
                        <label
                          className="custom-file-label"
                          htmlFor="rp_passport_copy"
                        >
                          {_.get(
                            this.state.model,
                            "RP.rp_lease_agreement.filename",
                            ""
                          )}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                {(serviceTypeBranch ===
                  this.props.company.branch.service_type_id ||
                  serviceTypeSubBranch ===
                    this.props.company.branch.service_type_id) && (
                  <div className="col-6">
                    <div className="form-group">
                      <label htmlFor="rp_passport">Contract agreement</label>
                      <div className="">
                        <div className="custom-file">
                          <Input
                            as="tempUpload"
                            type="file"
                            className="custom-file-input form-control"
                            id="rp_lease_agreement"
                            name="RP.rp_contract_agreement"
                          />
                          <label
                            className="custom-file-label"
                            htmlFor="rp_passport_copy"
                          >
                            {_.get(
                              this.state.model,
                              "RP.rp_contract_agreement.filename",
                              ""
                            )}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="form-footer">
                {this.props.onBack ? (
                  <div className="form-group float-left">
                    <button
                      type="button"
                      className="btn btn-light"
                      onClick={this.back.bind(this)}
                      disabled={this.state.busy}
                    >
                      <i className="fas fa-long-arrow-alt-left" /> Back
                    </button>
                  </div>
                ) : null}
                <div className="form-group float-right">
                  <button
                    type="button"
                    className={
                      "btn btn-primary" + (this.state.busy ? " busy" : "")
                    }
                    onClick={this.submit.bind(this)}
                    disabled={this.state.busy}
                  >
                    Submit <i className="fas fa-long-arrow-alt-right" />
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
