import React from "react";
import { Modal } from "react-bootstrap";
import api from "../../config/app";
import { Input, TargetContext, ContextForm } from "../Common";
import TimeLine from "./ActivityLog";
import {
  applicationStatusName,
  isBranchType,
  isMainBranch,
} from "../../helper/common";

export default class Detail extends React.Component {
  constructor(props) {
    super(props);
    console.log(this);
    this.state = {
      command: null,
      busy: false,
      profile: null,
      logs: null,
      model: {},
    };
  }
  componentDidUpdate(oldProps) {
    let type = _.get(this.props, "match.params.type", "");
    let id = _.get(this.props, "match.params.id", "");
    if (
      type != _.get(oldProps, "match.params.type") ||
      id != _.get(oldProps, "match.params.id")
    ) {
      this.fetchData();
      this.fetchLogs();
    }
  }
  componentWillMount() {
    this.fetchData();
    this.fetchLogs();
  }
  fetchData() {
    let type = _.get(this.props, "match.params.type", "");
    let id = _.get(this.props, "match.params.id", "");
    this.setState({ busy: true });
    api
      .get(
        "/application/branch/" +
          id +
          (this.props.serviceType
            ? "?service_type=" + this.props.serviceType
            : "")
      )
      .then((data) => {
        this.setState({ busy: false, profile: data });
      });
  }
  fetchLogs() {
    let type = _.get(this.props, "match.params.type", "");
    let id = _.get(this.props, "match.params.id", "");
    api.get("/application/branch/logs/" + id).then((data) => {
      this.setState({ logs: data });
    });
  }
  downloadAttachments() {
    openWindowWithPost(
      __app.baseURL +
        "/api/application/branch/" +
        this.state.profile.id +
        "/attachments"
    );
  }
  viewContractHistory() {
    this.props.history.push(
      "/application/" +
        (isBranchType(this.state.profile) ? "branch" : "liaison") +
        "/" +
        (isMainBranch(this.state.profile)
          ? this.state.profile.id
          : this.state.profile.parent_id) +
        "/contracts"
    );
  }
  downloadPdf() {
    let getOrigin = window.location.origin;
    let url =
      getOrigin +
      "" +
      __app.baseURL +
      "/application/pdfBranch/" +
      this.state.profile.id;
    window.location.href = url;
  }

   downloadReceipt() {
    let getOrigin = window.location.origin;
    let url =
      getOrigin +
      "" +
      __app.baseURL +
      "/application/receiptBranch/" +
      this.state.profile.id;
    window.location.href = url;
  }

  RenewalReceipt() {
    let getOrigin = window.location.origin;
    let url =
      getOrigin +
      "" +
      __app.baseURL +
      "/application/receiptRenewal/" +
      this.state.profile.id;
    window.location.href = url;
  }
  handleCommandSubmit(command, data) {
    this.setState({ busy: true });
    api
      .post(
        "/application/branch/" + command + "/" + this.state.profile.id,
        data
      )
      .then((res) => {
        this.setState({ busy: false });
        if (res.success) {
          this.setState({ command: null });
          if (res.data) {
            let lookup = __app.LOOKUP.ApplicationStatus;
            let statusId = res.data.status_id;
            if (
              statusId == lookup.APPROVED ||
              statusId == lookup.REJECTED ||
              statusId == lookup.CIRCULATED
            ) {
              this.props.history.push(
                "/application/" +
                  (this.state.profile.converted_from ? "converted-" : "") +
                  (isBranchType(this.state.profile) ? "branch" : "liaison") +
                  "/" +
                  applicationStatusName(statusId, this.state.profile.attempts) +
                  "/" +
                  this.state.profile.id
              );
            } else {
              if (statusId == lookup.REVERTED || statusId == lookup.HELD) {
                this.state.profile.status_id = statusId;
              }
              if (statusId != lookup.HELD) {
                res.data.is_admin = __app.user.is_admin;
                res.data.is_sh_admin = __app.user.is_sh_admin;
                this.state.logs.push(res.data);
              }
              this.forceUpdate();
            }
          }
        }
      });
  }
  hold() {
    this.handleCommandSubmit("hold");
  }
  handleCommandClose() {
    this.setState({ command: null });
  }
  renderCommands() {
    if (!this.state.profile || !this.state.profile.id) {
      return null;
    }
    let lookup = __app.LOOKUP.ApplicationStatus;
    let statusId = _.get(this.state.profile, "status_id");
    let attempts = _.get(this.state.profile, "attempts");
    let servicetypeId = _.get(this.state.profile, "service_type_id");
    let isRenewal = _.get(this.state.profile, "is_renewal");
    let BranchServiceId = 1;
    console.log(servicetypeId == BranchServiceId);

    if (statusId == lookup.APPROVED || statusId == lookup.REJECTED) {
      return (
        <React.Fragment>
          {servicetypeId == 1 || servicetypeId == 2 ? (
            <button
              type="button"
              className="btn btn-info"
              onClick={this.viewContractHistory.bind(this)}
            >
              Contract History
            </button>
          ) : null}

          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={this.downloadAttachments.bind(this)}
          >
            Download attachments
          </button>
          {statusId != lookup.REJECTED ? (
            <button
              type="button"
              className="btn btn-light"
              onClick={() => {
                this.setState({ command: "reject" });
              }}
            >
               {!__app.user.is_admin ? ("Not Recommend") : "Reject"}
            </button>
          ) : attempts <= 2 &&
            __app.user.is_admin &&
            _.get(this.state.profile, "is_approvable") ||
            (this.state.profile &&
              _.get(
                this.state.profile.company,
                "was_permitted"
              ) === 1) ? (
            <button
              type="button"
              className="btn btn-success"
              onClick={() => {
                this.setState({ command: "approve" });
              }}
            >
              Approve
            </button>
          ) : null}
          <button
            onClick={this.downloadPdf.bind(this)}
            type="button"
            className="btn btn-outline-danger"
          >
            <i className="far fa-file-pdf" />
          </button>
          <button
            onClick={this.downloadReceipt.bind(this)}
            type="button"
            className="btn btn-outline-danger"
          >
            Download Receipt
          </button>
          {isRenewal === 1 ? (
            <button
            onClick={this.RenewalReceipt.bind(this)}
            type="button"
            className="btn btn-outline-danger"
          >
            Renewal Receipt
          </button>
           ) : null}
          
        </React.Fragment>
      );
    }
    return (
      <React.Fragment>
        {servicetypeId == 1 || servicetypeId == 2 ? (
          <button
            type="button"
            className="btn btn-info"
            onClick={this.viewContractHistory.bind(this)}
          >
            Contract History
          </button>
        ) : null}
        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={this.downloadAttachments.bind(this)}
        >
          Download attachments
        </button>
        {(() => {
          if (statusId == lookup.NEW && __app.user.is_admin) {
            return (
              <React.Fragment>
                {/* <button type="button" className="btn btn-success" onClick={() => { this.setState({ command: "approve" }) }}>Approve</button> */}
                
                 {this.state.profile &&
                    _.get(
                      this.state.profile.company,
                      "was_permitted"
                    ) === 1?(

                      <button type="button" className="btn btn-success" onClick={() => { this.setState({ command: "approve" }) }}>Approve</button>
                    ) : null}


                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    this.setState({ command: "circulate" });
                  }}
                >
                  Circulate
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => {
                    this.setState({ command: "revert" });
                  }}
                >
                  Revert
                </button>
              </React.Fragment>
            );
          } else if (
            (statusId == lookup.SUBMITTED &&
            __app.user.is_admin &&
            this.state.profile.attempts > 1) || (this.state.profile &&
              _.get(
                this.state.profile.company,
                "was_permitted"
              ) === 1)
          )  {
            return (
              <React.Fragment>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={() => {
                    this.setState({ command: "approve" });
                  }}
                >
                   {!__app.user.is_admin ? ("Recommend") : "Approve"}
                </button>
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={() => {
                    this.setState({ command: "reject" });
                  }}
                >
                 {!__app.user.is_admin ? ("Not Recommend") : "Reject"}
                </button>
              </React.Fragment>
            );
          } else if (statusId != lookup.REVERTED) {
            return (
              <React.Fragment>
                {!__app.user.is_admin ||
                _.get(this.state.profile, "is_approvable") || (this.state.profile &&
                  _.get(
                    this.state.profile.company,
                    "was_permitted"
                  ) === 1) ? (
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={() => {
                      this.setState({ command: "approve" });
                    }}
                  >
                    Recommend
                  </button>
                ) : null}
                {!__app.user.is_admin ||
                _.get(this.state.profile, "is_rejectable") ? (
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={() => {
                      this.setState({ command: "reject" });
                    }}
                  >
                    Not Recommend
                  </button>
                ) : null}
                {!__app.user.is_admin && statusId == lookup.NEW ? (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={this.hold.bind(this)}
                  >
                    Hold
                  </button>
                ) : null}
              </React.Fragment>
            );
          }
        })()}
        {(() => {
          if (!this.state.logs || this.state.logs.length <= 1) {
            return (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  this.setState({ command: "comment" });
                }}
              >
                Add Comment
              </button>
            );
          }
        })()}
        <button
          onClick={this.downloadPdf.bind(this)}
          type="button"
          className="btn btn-outline-danger"
        >
          <i className="far fa-file-pdf" />
        </button>
        <button
            onClick={this.downloadReceipt.bind(this)}
            type="button"
            className="btn btn-outline-danger"
          >
            Download Receipt
          </button>
          {isRenewal === 1 ? (
            <button
            onClick={this.RenewalReceipt.bind(this)}
            type="button"
            className="btn btn-outline-danger"
          >
            Renewal Receipt
          </button>
           ) : null}
      </React.Fragment>
    );
  }
  fileSubmit() {
    this.setState({ busy: true });
    let model = this.state.model;
    let profile = this.state.profile;
    model = { ...model, id: _.get(this.props, "match.params.id", "") };
    api.post("/application/branch/assignFileNo", model).then((res) => {
      this.setState({
        busy: false,
        profile: { ...profile, file_no: model.file_no },
      });
      if (res.success) {
        notify.success("File No successfully.");
        this.setState({ model: {}, errors: {} });
      } else {
        this.setState({ errors: res.errors });
      }
    });
    console.log("FILE SUBMIT", this.state);
  }
  render() {
    let type = _.get(this.props, "match.params.type", "");
    let id = _.get(this.props, "match.params.id", "");
    let uid = _.get(this.state.profile, "uid") || "";
    console.log(
      "CONSOLE 1",
      this.state.profile && _.get(this.state.profile.company, "was_permitted")
    );
    let submitedAt = "";
    if (!_.isEmpty(this.state.profile)) {
      if (
        this.state.profile.created_at != undefined ||
        this.state.profile.created_at != null
      ) {
        submitedAt = this.state.profile.created_at.split(" ")[0];
      }
    }
    return (
      <React.Fragment>
        <div className={`col p3040${this.state.busy ? " busy" : ""}`}>
          <div className="widget widget-data">
            <div className="widget-inner">
              <div className="data-heading">
                <div className="d-flex">
                  <div className="mr-auto">
                    <h5>
                      APPLICATION DETAILS
                      {(() => {
                        if (
                          _.get(this.state.profile, "status_id", "Nill") ===
                          __app.LOOKUP.ApplicationStatus.REVERTED
                        ) {
                          return (
                            <span className="badge badge-info">Reverted</span>
                          );
                        }
                        if (
                          _.get(this.state.profile, "status_id", "Nill") ===
                          __app.LOOKUP.ApplicationStatus.APPROVED
                        ) {
                          return (
                            <span className="badge badge-success">
                               {!__app.user.is_admin ? ("Recommended") : "Approved"}
                            </span>
                          );
                        }
                        if (
                          _.get(this.state.profile, "status_id", "") ===
                          __app.LOOKUP.ApplicationStatus.REJECTED
                        ) {
                          return (
                            <span className="badge badge-danger">
                            {!__app.user.is_admin ? ("Not Recommended") : "Rejected"}
                            </span>
                          );
                        }
                        if (
                          _.get(this.state.profile, "status_id", "") ===
                          __app.LOOKUP.ApplicationStatus.HELD
                        ) {
                          return <span className="badge badge-info">Held</span>;
                        }
                        if (
                          _.get(this.state.profile, "status_id", "") ===
                          __app.LOOKUP.ApplicationStatus.CIRCULATED
                        ) {
                          return (
                            <span className="badge badge-info">Circulated</span>
                          );
                        }
                      })()}
                    </h5>
                    <span className="subtitle">
                      ID # {uid}{" "}
                      {` - Submited On: ${
                        _.isString(submitedAt) ? submitedAt : ""
                      }`}{" "}
                      {` - File no: ${
                        !_.isEmpty(this.state.profile) ||
                        this.state.profile != undefined
                          ? this.state.profile.file_no
                          : "-"
                      }`}
                    </span>
                  </div>
                  <div className="ml-auto">{this.renderCommands()}</div>
                </div>
              </div>
              <ProfileContent
                profile={this.state.profile}
                {..._.get(this.props, "location.state.profileProps")}
              />
              {__app.user.is_admin && (
                <React.Fragment>
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      onChange={() => {
                        this.setState(
                          {
                            addFileNo: this.state.addFileNo ? false : true,
                          },
                          () => {
                            console.log("addFileNo -->", this.state.addFileNo);
                          }
                        );
                      }}
                      id="fileNoCheck"
                    />
                    <label htmlFor="fileNoCheck" style={{ fontSize: "12px" }}>
                      Add File
                    </label>
                  </div>
                  {this.state.addFileNo && (
                    <ContextForm target={this}>
                      <div className="col p3040">
                        <div
                          className={`widget widget-data${
                            this.state.busy ? " busy" : ""
                          }`}
                        >
                          <div className="widget-inner">
                            <div className="needs-validation">
                              {/* <!-- Business Information --> */}
                              <div className="row">
                                <div className="col-sm-6">
                                  <div className="form-group">
                                    <label htmlFor="fileNo">File No</label>
                                    <div className="">
                                      <Input
                                        type="text"
                                        id="file_no"
                                        name="file_no"
                                        className="form-control required"
                                        placeholder="@File No"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="form-footer">
                                <div className="form-group float-right">
                                  <button
                                    className={
                                      "btn btn-primary" +
                                      (this.state.busy ? " busy" : "")
                                    }
                                    disabled={this.state.busy}
                                    onClick={this.fileSubmit.bind(this)}
                                  >
                                    {" "}
                                    ADD{" "}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </ContextForm>
                  )}
                </React.Fragment>
              )}

              <div className="data-heading">
                <div className="d-flex">
                  <div className="ml-auto">{this.renderCommands()}</div>
                </div>
              </div>
            </div>
          </div>

          {this.state.command ? (
            <CommandModal
              stackRole={
                !_.isEmpty(this.state.profile) ? this.state.profile.roles : []
              }
              command={this.state.command}
              onSubmit={this.handleCommandSubmit.bind(this)}
              onClose={this.handleCommandClose.bind(this)}
            />
          ) : null}
        </div>
        {(() => {
          if (this.state.logs && this.state.logs.length > 1) {
            return (
              <div className="col widget widget-activity">
                <div className="admin-activity">
                  <div className="activity-action">
                    <div className="d-flex">
                      <div className="mr-auto">
                        <h4>APPLICATION ACTIVITY</h4>
                      </div>
                      <div className="ml-auto">
                        <button
                          className="btn btn-primary"
                          onClick={() => {
                            this.setState({ command: "comment" });
                          }}
                        >
                          Add Comments
                        </button>
                      </div>
                    </div>
                  </div>
                  <TimeLine logs={this.state.logs} />
                </div>
              </div>
            );
          }
        })()}
      </React.Fragment>
    );
  }
}

export class ProfileContent extends React.Component {
  renderBusinessInfo() {
    let expanded = this.expanded == "buisiness";
    let filterCountry = [];
    if (this.props.profile != null && this.props.profile != undefined) {
      console.log(" BRANCH DETAIL L#455 PROPS-- >", this.props);
      console.log(
        "CURRENT COUNTRY -- >",
        _.get(this.props.profile, "current_country")
      );
      console.log(_.get(this.props.profile, "current_country"));
      console.log("CC: ", this.props.profile.current_country);

      let countryCode =
        _.get(this.props.profile, "current_country") != undefined &&
        !Array.isArray(_.get(this.props.profile, "current_country"))
          ? _.get(this.props.profile, "current_country").split(",")
          : [];
      console.log("--->", __app.LOOKUP.Country.data);
      console.log("CC --->", countryCode);

      countryCode.map((code) => {
        let codeData = _.filter(__app.LOOKUP.Country.data, (country) => {
          return country.value === code;
        });

        filterCountry = [...filterCountry, codeData[0]];
      });
      console.log("filterCountry --->", filterCountry);
      console.log("LOOK UPS-->", __app);
    }
    return (
      <div className="card">
        <div className="card-header">
          <a
            className={"card-link" + (expanded ? "" : " collapsed")}
            data-toggle="collapse"
            href="#collapseOne"
          >
            Business Information
          </a>
        </div>
        <div
          id="collapseOne"
          className={"collapse" + (expanded ? " show" : "")}
          data-parent="#accordion"
        >
          <div className="card-body">
            <div className="data-table data-details">
              <table className="table table-striped table-hover">
                <tbody>
                  <tr>
                    <th scope="row">Type of Services</th>
                    <td>
                      {__app.LOOKUP.text(
                        "ServiceType",
                        _.get(this.props.profile, "service_type_id")
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Country of Origin</th>
                    <td>
                      {__app.LOOKUP.text(
                        "Country",
                        _.get(this.props.profile, "original_country")
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Present Business Activities</th>
                    <td>{_.get(this.props.profile, "primary_info", "")}</td>
                  </tr>
                  <tr>
                    <th scope="row">
                      Detail of Proposed Company is Subsidiary of any Other
                      Organization
                    </th>
                    <td>{_.get(this.props.profile, "other_org_info", "")}</td>
                  </tr>
                  <tr>
                    <th scope="row">
                      Detail Of Project / Ventures in other Countries
                    </th>
                    <td>
                      {_.get(this.props.profile, "other_country_info", "")}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">
                      Existing B/L Office in other Country/Countries
                    </th>
                    <td>
                      {Array.isArray(
                        _.get(this.props.profile, "current_country")
                      )
                        ? _.get(this.props.profile, "current_country") !=
                            undefined &&
                          _.get(this.props.profile, "current_country").map(
                            (countryName, key) => {
                              console.log("LABEL", countryName.label);
                              return (
                                <span key={key}>
                                  {countryName.label}
                                  {key ===
                                  _.get(this.props.profile, "current_country")
                                    .length -
                                    1
                                    ? ""
                                    : ", "}
                                </span>
                              );
                            }
                          )
                        : filterCountry.map((countryData, key) => {
                            return (
                              <span key={key}>
                                
                                {key === filterCountry.length - 1 ? "" : ", "}
                              </span>
                            );
                          })}
                      {/* {_.get(this.props.profile, "current_country") !=
                        undefined &&
                        _.get(this.props.profile, "current_country")
                          .split(",")
                          .map((countryName, key) => {
                            console.log("LABEL", countryName);
                            return (
                              <span key={key}>
                                {countryName}
                                {key ===
                                _.get(this.props.profile, "current_country")
                                  .length -
                                  1
                                  ? ""
                                  : ", "}
                              </span>
                            );
                          })} */}
                      {/* {__app.LOOKUP.text(
                        "Country",
                        _.get(this.props.profile, "current_country")
                      )} */}
                    </td>
                  </tr>
                  {/* <tr>
                    <th scope="row">City where project is underway</th>
                    <td>
                      {__app.LOOKUP.text(
                        "City",
                        _.get(this.props.profile, "current_city")
                      )}
                    </td>
                  </tr> */}
                  <tr>
                    <th scope="row">
                      Location where permission is required to establish office
                      in pakistan
                    </th>
                    <td>{_.get(this.props.profile, "desired_location")}</td>
                  </tr>
                  <tr>
                    <th scope="row">
                      Proposed address in Pakistan also indicates places if more
                      than one
                    </th>
                    <td>{_.get(this.props.profile, "desired_places")}</td>
                  </tr>

                  <tr>
                    <th scope="row">
                      Intended Business Activities in Pakistan
                    </th>
                    <td>{_.get(this.props.profile, "business_info", "")}</td>
                  </tr>
                  <tr>
                    <th scope="row">Projects/Details of work in Pakistan</th>
                    <td>{_.get(this.props.profile, "project_info", "")}</td>
                  </tr>
                  {/* <tr>
                    <th scope="row">
                      No. of Personnel to be employed giving details of foreign
                      firm for capital and profit
                    </th>
                    <td>{_.get(this.props.profile, "personnel_info", "")}</td>
                  </tr> */}
                  <tr>
                    <th scope="row">Number of Personnel</th>
                    <td>
                      {_.get(
                        this.props.profile,
                        "no_of_personnel_employee",
                        ""
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Details of foreign firm for capital</th>
                    <td>{_.get(this.props.profile, "firm_for_capital", "")}</td>
                  </tr>
                  <tr>
                    <th scope="row">Details of foreign firm for profit</th>
                    <td>{_.get(this.props.profile, "firm_for_profit", "")}</td>
                  </tr>
                  <tr>
                    <th scope="row">
                      State if repatriation facilities are required by the
                      foreign firm for Capital and Profit
                    </th>
                    <td>
                      {_.get(this.props.profile, "repatriation_info", "")}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">
                      State if any Pakistani Co/individual is associated in the
                      Co. with details of investment (% Share)
                    </th>
                    <td>
                      {_.get(this.props.profile, "local_associate_info", "")}
                    </td>
                  </tr>

                  <tr>
                    <th scope="row">Permission Period From</th>
                    <td>
                      {__app.LOOKUP.text(
                        "Month",
                        _.get(this.props.profile, "start_month", "")
                      )}
                      , {_.get(this.props.profile, "start_year", "")}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Permission Period To</th>
                    <td>
                      {__app.LOOKUP.text(
                        "Month",
                        _.get(this.props.profile, "start_month", "")
                      )}
                      ,{" "}
                      {+_.get(this.props.profile, "start_year", "") +
                        +_.get(this.props.profile, "permission_period", "")}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Detail Background</th>
                    <td>{_.get(this.props.profile, "background_info", "")}</td>
                  </tr>
                  <tr>
                    <th scope="row">Purpose for Opening</th>
                    <td>{_.get(this.props.profile, "purpose_info", "")}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
  renderLocalSponsorInfo() {
    let expanded = this.expanded == "localSponsor";
    return (
      <div className="card">
        <div className="card-header">
          <a
            className={"card-link" + (expanded ? "" : " collapsed")}
            data-toggle="collapse"
            href="#collapseTwo"
          >
            Company's Local Sponsor
          </a>
        </div>
        <div
          id="collapseTwo"
          className={"collapse" + (expanded ? " show" : "")}
          data-parent="#accordion"
        >
          <div className="card-body">
            <div className="data-table data-details">
              <table className="table table-striped table-hover">
                <tbody>
                  <tr>
                    <th scope="row">Location</th>
                    <td>
                      {_.get(
                        this.props.profile,
                        "local_sponsor.location.address_line1",
                        ""
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">City</th>
                    <td>
                      {__app.LOOKUP.text(
                        "City",
                        _.get(
                          this.props.profile,
                          "local_sponsor.location.city",
                          ""
                        )
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Telephone Number</th>
                    <td>
                      {_.get(
                        this.props.profile,
                        "local_sponsor.office_phone",
                        ""
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Cell Number</th>
                    <td>
                      {_.get(
                        this.props.profile,
                        "local_sponsor.mobile_phone",
                        ""
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Fax Number</th>
                    <td>
                      {_.get(
                        this.props.profile,
                        "local_sponsor.office_fax",
                        ""
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Email Address</th>
                    <td>
                      {_.get(
                        this.props.profile,
                        "local_sponsor.office_email",
                        ""
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <h6 className="card-link">Company's Complete Local Address</h6>
            <div className="data-table data-details">
              <table className="table table-striped table-hover">
                <tbody>
                  <tr>
                    <th scope="row">Location</th>
                    <td>
                      {_.get(
                        this.props.profile,
                        "local_contact.location.address_line1",
                        ""
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Telephone number</th>
                    <td>
                      {_.get(
                        this.props.profile,
                        "local_contact.office_phone",
                        ""
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Cell Number</th>
                    <td>
                      {_.get(
                        this.props.profile,
                        "local_contact.mobile_phone",
                        ""
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Fax number</th>
                    <td>
                      {_.get(
                        this.props.profile,
                        "local_contact.office_fax",
                        ""
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Email address</th>
                    <td>
                      {_.get(
                        this.props.profile,
                        "local_contact.office_email",
                        ""
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Contact Person Name</th>
                    <td>
                      {_.get(this.props.profile, "local_contact.full_name", "")}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Contact Person Number</th>
                    <td>
                      {_.get(
                        this.props.profile,
                        "local_contact.primary_phone",
                        "Nill"
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
  renderContracteeInfo() {
    let expanded = this.expanded == "contractee";
    return (
      <div className="card">
        <div className="card-header">
          <a
            className={"card-link" + (expanded ? "Nill" : " collapsed")}
            data-toggle="collapse"
            href="#collapseTwob"
          >
            Contractee Information
          </a>
        </div>
        <div
          id="collapseTwob"
          className={"collapse" + (expanded ? " show" : "")}
          data-parent="#accordion"
        >
          <div className="card-body">
            <div className="data-table data-details">
              <table className="table table-striped table-hover">
                <tbody>
                  <tr>
                    <th scope="row">Company Name</th>
                    <td>{_.get(this.props.profile, "company.name", "Nill")}</td>
                  </tr>
                  <tr>
                    <th scope="row">Company Sector</th>
                    <td>
                      {console.log(
                        "SECTOR",
                        __app.LOOKUP.text(
                          "Sector",
                          _.get(this.props.profile, "company.sector_id", "Nill")
                        )
                      )}
                      {__app.LOOKUP.text(
                        "Sector",
                        _.get(this.props.profile, "company.sector_id", "Nill")
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Company Address</th>
                    <td>
                      {_.get(
                        this.props.profile,
                        "company.contact.location.address_line1",
                        "Nill"
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Country</th>
                    <td>
                      {__app.LOOKUP.text(
                        "Country",
                        _.get(
                          this.props.profile,
                          "company.contact.location.country"
                        )
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">City</th>
                    <td>
                      {__app.LOOKUP.text(
                        "City",
                        _.get(
                          this.props.profile,
                          "company.contact.location.city"
                        )
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Postal Code/Zip Code</th>
                    <td>
                      {_.get(
                        this.props.profile,
                        "company.contact.location.zip",
                        "Nill"
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Company Phone Number</th>
                    <td>
                      {_.get(
                        this.props.profile,
                        "company.contact.office_phone",
                        "Nill"
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Company Fax Number</th>
                    <td>
                      {_.get(
                        this.props.profile,
                        "company.contact.office_fax",
                        "Nill"
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Company Email Address</th>
                    <td>
                      {_.get(
                        this.props.profile,
                        "company.contact.office_email",
                        "Nill"
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
  renderAgentInfo() {
    let expanded = this.expanded == "agent";
    return (
      <div className="card">
        <div className="card-header">
          <a
            className={"card-link" + (expanded ? "" : " collapsed")}
            data-toggle="collapse"
            href="#collapseThree"
          >
            Agent Information
          </a>
        </div>
        <div
          id="collapseThree"
          className={"collapse" + (expanded ? " show" : "")}
          data-parent="#accordion"
        >
          <div className="card-body">
            <div className="data-table data-details">
              <table className="table table-striped table-hover">
                <tbody>
                  <tr>
                    <th scope="row">Full Name</th>
                    <td>
                      {_.get(this.props.profile, "agent.full_name", "Nill")}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Type</th>
                    <td>
                      {__app.LOOKUP.text(
                        "AgentType",
                        _.get(
                          this.props.profile,
                          "agent.contact_category_id",
                          "Nill"
                        )
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Cell No</th>
                    <td>
                      {_.get(this.props.profile, "agent.mobile_phone", "Nill")}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Email</th>
                    <td>
                      {_.get(this.props.profile, "agent.primary_email", "Nill")}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Address</th>
                    <td>
                      {_.get(
                        this.props.profile,
                        "agent.location.address_line1",
                        "Nill"
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Country</th>
                    <td>
                      {__app.LOOKUP.text(
                        "Country",
                        _.get(this.props.profile, "agent.location.country")
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">City</th>
                    <td>
                      {__app.LOOKUP.text(
                        "City",
                        _.get(this.props.profile, "agent.location.city")
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
  renderContractInfo() {
    let expanded = this.expanded == "contract";
    return (
      <div className="card">
        <div className="card-header">
          <a
            className={"card-link" + (expanded ? "" : " collapsed")}
            data-toggle="collapse"
            href="#collapseFour"
          >
            Contract Information
          </a>
        </div>
        <div
          id="collapseFour"
          className={"collapse" + (expanded ? " show" : "")}
          data-parent="#accordion"
        >
          <div className="card-body">
            <div className="data-table data-details">
              <table className="table table-striped table-hover">
                <tbody>
                  <tr>
                    <th scope="row">Title of Contract</th>
                    <td>
                      {_.get(this.props.profile, "contract.title", "Nill")}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Starting Date</th>
                    <td>
                      {date.format(
                        _.get(this.props.profile, "contract.start_date", "Nill")
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Page Number</th>
                    <td>
                      {_.get(this.props.profile, "contract.start_page", "Nill")}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Clause Number</th>
                    <td>
                      {_.get(
                        this.props.profile,
                        "contract.start_clause",
                        "Nill"
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Validity Period</th>
                    <td>
                      {_.get(
                        this.props.profile,
                        "contract.valid_for_years",
                        "Nill"
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Defects Period From</th>
                    <td>
                      {_.padStart(
                        _.get(
                          this.props.profile,
                          "contract.defect_start_month",
                          "Nill"
                        ),
                        2,
                        "0"
                      )}
                      /
                      {_.get(
                        this.props.profile,
                        "contract.defect_start_year",
                        "Nill"
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Defects Period To</th>
                    <td>
                      {_.padStart(
                        _.get(
                          this.props.profile,
                          "contract.defect_end_month",
                          "Nill"
                        ),
                        2,
                        "0"
                      )}
                      /
                      {_.get(
                        this.props.profile,
                        "contract.defect_end_year",
                        "Nill"
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Cost of Project</th>
                    <td>
                      {_.get(
                        this.props.profile,
                        "contract.project_cost",
                        "Nill"
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
  renderPartnersInfo() {
    let expanded = this.expanded == "partners";
    let partnerCompanies = _.get(this.props.profile, "partner_companies");
    if (partnerCompanies) {
      return (
        <div className="card">
          <div className="card-header">
            <a
              className={"card-link" + (expanded ? "" : " collapsed")}
              data-toggle="collapse"
              href="#collapseFourB"
            >
              Local Company/ Partner Details
            </a>
          </div>
          <div
            id="collapseFourB"
            className={"collapse" + (expanded ? " show" : "")}
            data-parent="#accordion"
          >
            <div className="card-body">
              {partnerCompanies.map((partnerCompany, key) => {
                return (
                  <div className="data-table data-details" key={key}>
                    <table className="table table-striped table-hover">
                      <tbody>
                        <tr>
                          <th scope="row">Full Name</th>
                          <td>{_.get(partnerCompany, "full_name", "Nill")}</td>
                        </tr>
                        <tr>
                          <th scope="row">Company Address</th>
                          <td>
                            {_.get(
                              partnerCompany,
                              "location.address_line1",
                              "Nill"
                            )}
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">Country</th>
                          <td>
                            {__app.LOOKUP.text(
                              "Country",
                              _.get(partnerCompany, "location.country")
                            )}
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">City</th>
                          <td>
                            {__app.LOOKUP.text(
                              "City",
                              _.get(partnerCompany, "location.city")
                            )}
                          </td>
                        </tr>

                        <tr>
                          <th scope="row">Postal Code/Zip Code</th>
                          <td>{_.get(partnerCompany, "location.zip")}</td>
                        </tr>

                        <tr>
                          <th scope="row">Company Phone Number</th>
                          <td>{_.get(partnerCompany, "office_phone")}</td>
                        </tr>
                        <tr>
                          <th scope="row">Company Fax Number</th>
                          <td>{_.get(partnerCompany, "office_fax")}</td>
                        </tr>
                        <tr>
                          <th scope="row">Company Email Address</th>
                          <td>{_.get(partnerCompany, "office_email")}</td>
                        </tr>
                      </tbody>
                    </table>
                    <h6 className="card-link">
                      Local Company/Partner Contact Person
                    </h6>
                    <table className="table table-striped table-hover">
                      <tbody>
                        <tr>
                          <th scope="row">Full Name</th>
                          <td>{_.get(partnerCompany, "contact.full_name")}</td>
                        </tr>
                        <tr>
                          <th scope="row">Email</th>
                          <td>
                            {_.get(partnerCompany, "contact.primary_email")}
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">Contact Number</th>
                          <td>
                            {_.get(partnerCompany, "contact.primary_phone")}
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">CNIC No</th>
                          <td>{_.get(partnerCompany, "contact.nic_no")}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    }
  }
  renderInvestmentInfo() {
    let expanded = this.expanded == "investment";
    return (
      <div className="card">
        <div className="card-header">
          <a
            className={"card-link" + (expanded ? "" : " collapsed")}
            data-toggle="collapse"
            href="#collapseFive"
          >
            Investment Information
          </a>
        </div>
        <div
          id="collapseFive"
          className={"collapse" + (expanded ? " show" : "")}
          data-parent="#accordion"
        >
          <div className="card-body">
            <div className="data-table data-details">
              <table className="table table-striped table-hover">
                <tbody>
                  <tr>
                    <th scope="row">
                      Investment proposed to be made in detail foreign/local
                    </th>
                    <td>
                      {_.get(
                        this.props.profile,
                        "investment.proposal_info",
                        "Nill"
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Annual Recurring expenses of office</th>
                    <td>
                      {_.get(
                        this.props.profile,
                        "investment.annual_expenses",
                        "Nill"
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">
                      State programe to establish investment project in
                      pakistan, if so nature of the same
                    </th>
                    <td>
                      {_.get(
                        this.props.profile,
                        "investment.investment_info",
                        "Nill"
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Name of Bank in Pakistan</th>
                    <td>
                      {_.get(this.props.profile, "investment.pk_bank", "Nill")}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Designated person</th>
                    <td>
                      {_.get(
                        this.props.profile,
                        "investment.designated_person",
                        "Nill"
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">other information</th>
                    <td>
                      {_.get(this.props.profile, "investment.comments", "Nill")}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
  renderSecurityAgencyInfo() {
    let expanded = this.expanded == "securityAgency";
    return (
      <div className="card">
        <div className="card-header">
          <a
            className={"card-link" + (expanded ? "" : " collapsed")}
            data-toggle="collapse"
            href="#collapseSix"
          >
            Security Information
          </a>
        </div>
        <div
          id="collapseSix"
          className={"collapse" + (expanded ? " show" : "")}
          data-parent="#accordion"
        >
          <div className="card-body">
            <div className="data-table data-details">
              <table className="table table-striped table-hover">
                <tbody>
                  <tr>
                    <th scope="row">Is Services Needed</th>
                    <td>
                      {strBool(
                        _.get(this.props.profile, "security_required", "Nill")
                      )}
                    </td>
                  </tr>
                  {(() => {
                    if (
                      !_.get(this.props.profile, "security_required", "Nill")
                    ) {
                      return null;
                    }
                    return (
                      <React.Fragment>
                        <tr>
                          <th scope="row">Registered Name</th>
                          <td>
                            {_.get(
                              this.props.profile,
                              "security_agency.name",
                              "Nill"
                            )}
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">Company NTN No</th>
                          <td>
                            {_.get(
                              this.props.profile,
                              "security_agency.ntn",
                              "Nill"
                            )}
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">
                            Is the security company purely pakistani based
                          </th>
                          <td>
                            {strBool(
                              _.get(
                                this.props.profile,
                                "security_agency.is_pk_based",
                                "Nill"
                              )
                            )}
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">
                            Has it hired services of foreign
                            consultant/nationals, in any form or manner
                          </th>
                          <td>
                            {strBool(
                              _.get(
                                this.props.profile,
                                "security_agency.has_foreign_consultant",
                                "Nill"
                              )
                            )}
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">
                            Is it a Pakistani chapter/partnership/extension of a
                            foreign security company? If yes give details
                          </th>
                          <td>
                            {strBool(
                              _.get(
                                this.props.profile,
                                "security_agency.is_extension",
                                "Nill"
                              )
                            )}
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">Address</th>
                          <td>
                            {_.get(
                              this.props.profile,
                              "security_agency.contact.location.address_line1",
                              "Nill"
                            )}
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">Country</th>
                          <td>
                            {__app.LOOKUP.text(
                              "Country",
                              _.get(
                                this.props.profile,
                                "security_agency.contact.location.country"
                              )
                            )}
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">City</th>
                          <td>
                            {__app.LOOKUP.text(
                              "City",
                              _.get(
                                this.props.profile,
                                "security_agency.contact.location.city"
                              )
                            )}
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">Telephone Number</th>
                          <td>
                            {_.get(
                              this.props.profile,
                              "security_agency.contact.office_phone",
                              "Nill"
                            )}
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">Fax Number</th>
                          <td>
                            {_.get(
                              this.props.profile,
                              "security_agency.contact.office_fax",
                              "Nill"
                            )}
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">Email Address</th>
                          <td>
                            {_.get(
                              this.props.profile,
                              "security_agency.contact.office_email",
                              "Nill"
                            )}
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">Postal Code/Zip Code</th>
                          <td>
                            {_.get(
                              this.props.profile,
                              "security_agency.contact.location.zip",
                              "Nill"
                            )}
                          </td>
                        </tr>
                      </React.Fragment>
                    );
                  })()}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
  renderPaymentInfo() {
    let expanded = this.expanded == "payment";
    console.log("PROPS --> ", this.props);
    return (
      <div className="card">
        <div className="card-header">
          <a
            className={"card-link" + (expanded ? "" : " collapsed")}
            data-toggle="collapse"
            href="#collapseEight"
          >
            Payment Information
          </a>
        </div>
        <div
          id="collapseEight"
          className={"collapse" + (expanded ? " show" : "")}
          data-parent="#accordion"
        >
          <div className="card-body">
            <div className="data-table data-details">
              <table className="table table-striped table-hover">
                <tbody>
                  <tr>
                    <th scope="row">USD Amount</th>
                    <td>
                      {_.get(this.props.profile, "payment.usd_amount", "Nill")}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">PKR Rate</th>
                    <td>
                      {_.get(this.props.profile, "payment.pkr_rate", "Nill")}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Challan No</th>
                    <td>
                      {_.get(
                        this.props.profile,
                        "payment.pp_txn_ref_no",
                        "Nill"
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
  renderRenewalInfo() {
    let expanded = this.expanded == "renewal";
    let data = _.get(this.props.profile, "renewal");
    if (!data) {
      return null;
    }
    return (
      <div className="card">
        <div className="card-header">
          <a
            className={"card-link" + (expanded ? "" : " collapsed")}
            data-toggle="collapse"
            href="#collapseSeven"
          >
            Branch Office Renewal
          </a>
        </div>
        <div
          id="collapseSeven"
          className={"collapse" + (expanded ? " show" : "")}
          data-parent="#accordion"
        >
          <div className="card-body">
            <div className="data-table data-details">
              <table className="table table-striped table-hover">
                <tbody>
                  <tr>
                    <th scope="row">Contract Duration</th>
                    <td>{data.contract_duration} Year(s)</td>
                  </tr>
                  <tr>
                    <th scope="row">Renewal Period</th>
                    <td>{data.renewal_period} Year(s)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
  render() {
    this.expanded = this.props.collapseAll
      ? null
      : this.props.expanded || "buisiness";

    console.log(this);
    if (this.props.contractOnly) {
      return (
        <div id="accordion">
          {_.get(this.props.profile, "contract")
            ? this.renderContractInfo()
            : null}
          {_.get(this.props.profile, "partner_companies.length")
            ? this.renderPartnersInfo()
            : null}
        </div>
      );
    }
    return (
      <div id="accordion">
        {this.renderBusinessInfo()}
        {this.renderLocalSponsorInfo()}
        {this.renderContracteeInfo()}
        {this.renderAgentInfo()}
        {_.get(this.props.profile, "contract")
          ? this.renderContractInfo()
          : null}
        {_.get(this.props.profile, "partner_companies.length")
          ? this.renderPartnersInfo()
          : null}
        {this.renderInvestmentInfo()}
        {this.renderSecurityAgencyInfo()}
        {this.renderPaymentInfo()}
        {this.renderRenewalInfo()}
      </div>
    );
  }
}

class CommandModal extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      model: {
        comments: "",
      },
      isStackHolder: false,
    };
    this.input = React.createRef();
    this.handleUploads = this.handleUploads.bind(this);
  }
  close() {
    this.props.onClose();
  }
  submit() {
    this.setState({ busy: true });
    /*  let model = this.state.model;
    model = { ...model, isStackHolder: this.state.isStackHolder };
    this.setState({
      model
    }); */
    this.props.onSubmit(this.props.command, this.state.model, {
      error: (err) => {
        this.setState({ errors: err });
      },
    });
  }
  componentDidMount() {
    if (this.props.command == "circulate") {
      this.fetchRoles();
    }
  }
  fetchRoles() {
    this.setState({ busy: true });
    api.get("/role").then((data) => {
      this.setState({ roles: data, busy: false });
    });
  }
  handleUploads(media) {
    _.unset(this.state.model, "uploads");
    this.state.model.attachments = [media];
    this.setState({ model: this.state.model });
  }
  title() {
    switch (this.props.command) {
      case "circulate":
        return "Application Circulate";
      case "revert":
        return "Application Reverted";
      case "reject":
        return "Application Rejected";
      case "approve":
        return "Application Approved";
      case "comment":
        return "Application Comments";
    }
    throw new Error('Unknow command "' + this.props.command + '"');
  }
  render() {
    let props = this.props,
      command = props.command;
    console.log("stackRole -->", this.props.stackRole);

    return (
      <Modal
        show
        onHide={this.close.bind(this)}
        onShow={() => {
          this.input.current.focus();
        }}
        className={"command " + command}
        size="lg"
        backdrop="static"
      >
        <div className="modal-header">
          <h4 className="modal-title">

              {(() => {
                    if (this.title()=="Application Approved" && (!__app.user.is_admin)) {
                      return (
                        <div>Application Recommended </div>
                      )
                    } else if (this.title()=="Application Rejected" && (!__app.user.is_admin)) {
                      return (
                        <div>Application Not Recommended</div>
                      )
                    } else {
                      return (
                        <div>{this.title()}</div>
                      )
                    }
                  })()}
          

          </h4>
          {/* <!-- <button type="button" className="close" data-dismiss="modal">&times;</button> --> */}
        </div>
        <TargetContext.Provider value={this}>
          <div className="modal-body">
            {console.log(command)}
            {/*  {(__app.user.is_admin && command === "comment") && (
              <React.Fragment>
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    onChange={() => {
                      this.setState({
                        isStackHolder: this.state.isStackHolder ? false : true
                      });
                    }}
                    id="exampleCheck1"
                  />
                  <label htmlFor="exampleCheck1" style={{ fontSize: "12px" }}>
                    Comment to stackholder
                  </label>
                </div>
                
                {this.state.isStackHolder && (
                  <div className="form-group">
                    <label htmlFor="Origin">
                      Roles<span className="text-danger"> *</span>
                    </label>
                    <div className="">
                      <Input
                        as="select"
                        className="custom-select"
                        id="role_id"
                        name="role_id"
                      >
                        <option value="">-- Select --</option>
                        {!_.isEmpty(this.props.stackRole)
                          ? this.props.stackRole.map((role, key) => {
                              return (
                                <option key={key} value={role.id}>
                                  {role.name}
                                </option>
                              );
                            })
                          : null}
                      </Input>
                    </div>
                  </div>
                )}
              </React.Fragment>
            )} */}
            {command == "circulate" ? renderRoles.call(this) : null}
            <div className="form-group">
              
              {(() => {
                    if (command == "reject" && (!__app.user.is_admin)) {
                      return (
                       <label htmlFor="comment-approve"> Please write reason of not recommended</label>
                      )
                    } else if (command == "reject" && (!__app.user.is_admin)) {
                      return (
                        <label htmlFor="comment-approve">Please write reason of rejection</label>
                      )
                    } else {
                      return (
                       <label htmlFor="comment-approve"> Comments</label>
                      )
                    }
              })()}


              
              <div className="">
                <Input
                  as="textarea"
                  eref={this.input}
                  placeholder="Type your comments here"
                  name="comments"
                  className="form-control"
                  rows="5"
                />
              </div>
            </div>
            {(() => {
              if (command === "comment") {
                return (
                  <div className="form-group">
                    <label>Attachments</label>
                    <div className="custom-file">
                      <Input
                        type="file"
                        as="tempUpload"
                        onUpload={this.handleUploads}
                        className="custom-file-input"
                        name="uploads"
                        id="dashboard-attachments"
                      />
                      <label
                        className="custom-file-label"
                        htmlFor="dashboard-attachments"
                      >
                        {_.map(this.state.model.attachments, "filename").join(
                          " | "
                        )}
                      </label>
                    </div>
                  </div>
                );
              }
            })()}
          </div>
        </TargetContext.Provider>

        <div className="modal-footer">
          <div className="mr-auto">
            <button
              type="button"
              className={`btn btn-primary${this.state.busy ? " busy" : ""}`}
              onClick={this.submit.bind(this)}
              disabled={
                !this.state.model.comments.trim() ||
                this.state.busy ||
                (command == "circulate" && _.isEmpty(this.state.model.role))
              }
            >
              Submit
            </button>
          </div>
          <div className="ml-auto">
            <button
              type="button"
              className="btn btn-light"
              onClick={this.close.bind(this)}
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    );
  }
}

function renderRoles() {
  let groups = _.uniqBy(_.map(_.get(this.state, "roles", []), "group"), "id");
  let statuses = __app.LOOKUP.ProfileStatus;
  let selectedGroups = _.get(this.state, "model.group", []);
  let roles = _.filter(_.get(this.state, "roles", []), (role) => {
    return (
      role.authorization_id == __app.LOOKUP.Authorization.ADMIN &&
      selectedGroups.indexOf(role.group.id) !== -1
    );
  });
  return (
    <div
      className={
        "row" + (this.state.busy && _.isEmpty(this.state.roles) ? " busy" : "")
      }
    >
      <div className="col col-4">
        <label>Select Group</label>
        <div className="group-box">
          {groups.map((group, key) => (
            <div className="custom-control custom-checkbox" key={key}>
              <Input
                type="checkbox"
                as="checkList"
                name="group"
                className="custom-control-input"
                value={group.id}
                id={"group_" + group.id}
                disabled={group.status_id == statuses.BLOCKED}
                onChange={(e) => {
                  if (!e.target.checked) {
                    let selectedRoles = _.get(this.state, "model.role");
                    if (!_.isEmpty(selectedRoles)) {
                      selectedRoles = _.filter(selectedRoles, (val) => {
                        return (
                          this.state.model.group.indexOf(
                            _.find(roles, { id: val }).group.id
                          ) !== -1
                        );
                      });
                    }
                    this.state.model.role = selectedRoles;
                  }
                }}
              />
              <label
                className="custom-control-label"
                htmlFor={"group_" + group.id}
              >
                {group.name}
              </label>
            </div>
          ))}
        </div>
      </div>
      <div className="col">
        <label>Assign To</label>
        <div className="group-box">
          {roles.map((role, key) => (
            <div className="custom-control custom-checkbox" key={key}>
              <Input
                type="checkbox"
                as="checkList"
                name="role"
                className="custom-control-input"
                value={role.id}
                id={"role_" + role.id}
                disabled={role.status_id == statuses.BLOCKED}
              />
              <label
                className="custom-control-label"
                htmlFor={"role_" + role.id}
              >
                {role.name}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
