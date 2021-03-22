import React from "react";
import { Modal } from "react-bootstrap";
import api from "../../config/app";
import { Input, TargetContext, ContextForm } from "../Common";
import TimeLine from "./ActivityLog";

export default class Detail extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      command: null,
      busy: false,
      profile: null,
      logs: null,
      isPasswordChanged: false,
      model: {}
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
    api.get("/application/signup/" + id).then(data => {
      this.setState({ busy: false, profile: data });
    });
  }
  fetchLogs() {
    let type = _.get(this.props, "match.params.type", "");
    let id = _.get(this.props, "match.params.id", "");
    api.get("/application/signup/logs/" + id).then(data => {
      this.setState({ logs: data });
    });
  }
  downloadAttachments() {
    openWindowWithPost(
      __app.baseURL +
        "/api/application/signup/" +
        this.state.profile.id +
        "/attachments"
    );
  }
  downloadPdf() {
    let getOrigin = window.location.origin;
    let url =
      getOrigin +
      "" +
      __app.baseURL +
      "/application/pdfSignup/" +
      this.state.profile.id;
    window.location.href = url;
  }
  handleCommandSubmit(command, data) {
    this.setState({ busy: true });
    api
      .post(
        "/application/signup/" + command + "/" + this.state.profile.id,
        data
      )
      .then(res => {
        this.setState({ busy: false });
        if (res.success) {
          this.setState({ command: null });
          if (res.data) {
            let lookup = __app.LOOKUP.ApplicationStatus;
            let statusId = res.data.status_id;
            if (statusId == lookup.APPROVED || statusId == lookup.REJECTED) {
              this.props.history.push(
                "/application/signup/" +
                  (statusId == lookup.APPROVED ? "approved" : "rejected") +
                  "/" +
                  this.state.profile.id
              );
            } else {
              res.data.is_admin = true;
              this.state.logs.push(res.data);
              this.forceUpdate();
            }
          }
        }
      });
  }
  handleCommandClose() {
    this.setState({ command: null });
  }
  renderCommands() {
    if (!this.state.profile) {
      return null;
    }
    let lookup = __app.LOOKUP.ApplicationStatus;
    let statusId = _.get(this.state.profile, "status_id");
    if (statusId == lookup.APPROVED || statusId == lookup.REJECTED) {
      return (
        <React.Fragment>
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
              Reject
            </button>
          ) : null}
          {statusId == lookup.REJECTED ? (
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
            <i className="far fa-file-pdf"></i>
          </button>
        </React.Fragment>
      );
    }
    return (
      <React.Fragment>
        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={this.downloadAttachments.bind(this)}
        >
          Download attachments
        </button>
        <button
          type="button"
          className="btn btn-success"
          onClick={() => {
            this.setState({ command: "approve" });
          }}
        >
          Approve
        </button>
        <button
          type="button"
          className="btn btn-light"
          onClick={() => {
            this.setState({ command: "reject" });
          }}
        >
          Reject
        </button>
        <button
          onClick={this.downloadPdf.bind(this)}
          type="button"
          className="btn btn-outline-danger"
        >
          <i className="far fa-file-pdf"></i>
        </button>
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
      </React.Fragment>
    );
  }
  updatePassword() {
    console.log("UPDATE PASSWORD");
    this.setState({ busy: true });
    let model = this.state.model;
    model = { ...model, id: _.get(this.props, "match.params.id", "") };
    console.log("ID", model);
    api.post("/admin/company/password", model).then(res => {
      this.setState({ busy: false });
      if (res.success) {
        notify.success("Password updated successfully.");
        this.setState({ model: {}, errors: {} });
      } else {
        this.setState({ errors: res.errors });
      }
    });
  }
  render() {
    let type = _.get(this.props, "match.params.type", "");
    let id = _.get(this.props, "match.params.id", "");
    let uid = _.get(this.state.profile, "uid") || "";
    console.log("CONSOLE 1", this.state);
    let signUpDate = "";
    if (!_.isEmpty(this.state.profile)) {
      if (
        this.state.profile.subscribed_at != undefined ||
        this.state.profile.subscribed_at != null
      ) {
        signUpDate = this.state.profile.subscribed_at.split(" ")[0];
      }
    }
    console.log("SIGN UP DATE-->", this.state);
    return (
      <React.Fragment>
        <div className={`col p3040${this.state.busy ? " busy" : ""}`}>
          <div className="widget widget-data">
            <div className="widget-inner">
              <div className="data-heading">
                <div className="d-flex">
                  <div className="mr-auto">
                    <h5>
                      SIGNUP DETAILS
                      {(() => {
                        if (
                          _.get(this.state.profile, "status_id", "") ===
                          __app.LOOKUP.ApplicationStatus.APPROVED
                        ) {
                          return (
                            <span className="badge badge-success">
                              Approved
                            </span>
                          );
                        }
                        if (
                          _.get(this.state.profile, "status_id", "") ===
                          __app.LOOKUP.ApplicationStatus.REJECTED
                        ) {
                          return (
                            <span className="badge badge-danger">Rejected</span>
                          );
                        }
                      })()}
                    </h5>
                    <span className="subtitle">
                      ID # {uid.substr(0, 3) + uid.substr(uid.length - 3)}{" "}
                      {` - Registered On: ${
                        _.isString(signUpDate) ? signUpDate : ""
                      }`}
                    </span>
                  </div>
                  <div className="ml-auto">{this.renderCommands()}</div>
                </div>
              </div>
              <ProfileContent profile={this.state.profile} />
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  onChange={() => {
                    this.setState(
                      {
                        isPasswordChanged: this.state.isPasswordChanged
                          ? false
                          : true
                      },
                      () => {
                        console.log(
                          "ISPASSWORDCHANGED -->",
                          this.state.isPasswordChanged
                        );
                      }
                    );
                  }}
                  id="exampleCheck1"
                />
                <label htmlFor="exampleCheck1" style={{ fontSize: "12px" }}>
                  Change Password
                </label>
              </div>
              {this.state.isPasswordChanged && (
                <div>
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
                            <div className="form-group">
                              <h3>Password Reset</h3>
                              <div>
                                <span className="float-left text-muted small">
                                  Note: Incomplete form will not be entertained
                                </span>
                                <span className="float-right text-danger small">
                                  All fields are required
                                </span>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-sm-6">
                                <div className="form-group">
                                  <label htmlFor="newPassword">
                                    New Password
                                  </label>
                                  <div className="">
                                    <Input
                                      type="password"
                                      id="newPassword"
                                      name="password"
                                      className="form-control required"
                                      placeholder="@New Password"
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="col-sm-6">
                                <div className="form-group">
                                  <label htmlFor="reTypePassword">
                                    Re-type New Password
                                  </label>
                                  <div className="">
                                    <Input
                                      type="password"
                                      id="reTypePassword"
                                      name="password_confirmation"
                                      className="form-control required"
                                      placeholder="@New Password"
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
                                  onClick={this.updatePassword.bind(this)}
                                >
                                  {" "}
                                  UPDATE{" "}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ContextForm>
                </div>
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
  render() {
    console.log("SECTOR LOGIN 1--> ", __app.LOOKUP.Sector.data);

    // console.log("filter -",filter)

    let sectorId = !_.isEmpty(this.props.profile)
      ? this.props.profile.sector_id.split(",")
      : [];
    console.log("sectorId-->", sectorId);
    let filterSection = [];
    let arraySection;
    if (!_.isEmpty(sectorId)) {
      sectorId.map((value, key) => {
        arraySection = _.filter(__app.LOOKUP.Sector.data, data => {
          return data.value == value;
        });
        filterSection = [...filterSection, arraySection[0].text];
      });
    }
    return (
      <div id="accordion">
        <div className="card">
          <div className="card-header">
            <a
              className={
                "card-link" + (this.props.collapseAll ? " collapsed" : "")
              }
              data-toggle="collapse"
              href="#collapseOne"
            >
              Foreign Company Details
            </a>
          </div>
          <div
            id="collapseOne"
            className={"collapse" + (this.props.collapseAll ? "" : " show")}
            data-parent="#accordion"
          >
            <div className="card-body">
              <div className="data-table data-details">
                <table className="table table-striped table-hover">
                  <tbody>
                    <tr>
                      <th scope="row">Company Name</th>
                      <td>
                        {_.isString(_.get(this.props.profile, "name", ""))
                          ? _.get(this.props.profile, "name", "")
                          : ""}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Company Sector</th>

                      <td>
                        {!_.isEmpty(filterSection)
                          ? filterSection.map((data, key) => {
                              return (
                                <span key={key}>
                                  {data}{" "}
                                  {filterSection.length - 1 === key ? "" : ", "}
                                </span>
                              );
                            })
                          : ""}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Company Address</th>
                      <td>
                        {_.get(
                          this.props.profile,
                          "contact.location.address_line1",
                          ""
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Country</th>
                      <td>
                        {__app.LOOKUP.text(
                          "Country",
                          _.get(this.props.profile, "contact.location.country")
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">City</th>
                      <td>
                        {__app.LOOKUP.text(
                          "City",
                          _.get(this.props.profile, "contact.location.city")
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Postal Code / Zip Code</th>
                      <td>
                        {_.get(this.props.profile, "contact.location.zip", "")}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Company Telephone No</th>
                      <td>
                        {_.get(this.props.profile, "contact.office_phone", "")}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Company Fax No</th>
                      <td>
                        {_.get(this.props.profile, "contact.office_fax", "")}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Company Email</th>
                      <td>
                        {_.get(this.props.profile, "contact.office_email", "")}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <a
              className="collapsed card-link"
              data-toggle="collapse"
              href="#collapseTwo"
            >
              Foreign Company Contact Person
            </a>
          </div>
          <div id="collapseTwo" className="collapse" data-parent="#accordion">
            <div className="card-body">
              <div className="data-table data-details">
                <table className="table table-striped table-hover">
                  <tbody>
                    <tr>
                      <th scope="row">Full Name</th>
                      <td>
                        {_.get(this.props.profile, "contact.full_name", "")}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Email Address</th>
                      <td>
                        {_.get(this.props.profile, "contact.primary_email", "")}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Contact No</th>
                      <td>
                        {_.get(this.props.profile, "contact.primary_phone", "")}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">National Card</th>
                      <td>{_.get(this.props.profile, "contact.nic_no", "")}</td>
                    </tr>
                    <tr>
                      <th scope="row">Passport Number</th>
                      <td>
                        {_.get(this.props.profile, "contact.passport_no", "")}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <a
              className="collapsed card-link"
              data-toggle="collapse"
              href="#collapseThree"
            >
              Principal Officer Information
            </a>
          </div>
          <div id="collapseThree" className="collapse" data-parent="#accordion">
            <div className="card-body">
              <div className="data-table data-details">
                <table className="table table-striped table-hover">
                  <tbody>
                    <tr>
                      <th scope="row">Full Name</th>
                      <td>
                        {_.get(
                          this.props.profile,
                          "principal_officer.full_name",
                          ""
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">National Card</th>
                      <td>
                        {_.get(
                          this.props.profile,
                          "principal_officer.nic_no",
                          ""
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Passport Number</th>
                      <td>
                        {_.get(
                          this.props.profile,
                          "principal_officer.passport_no",
                          ""
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        {(() => {
          let directors = _.get(this.props.profile, "directors");
          if (directors) {
            return (
              <div className="card">
                <div className="card-header">
                  <a
                    className="collapsed card-link"
                    data-toggle="collapse"
                    href="#collapseFour"
                  >
                    Director Information
                  </a>
                </div>
                <div
                  id="collapseFour"
                  className="collapse"
                  data-parent="#accordion"
                >
                  <div className="card-body">
                    {directors.map((director, key) => {
                      return (
                        <div className="data-table data-details" key={key}>
                          <table className="table table-striped table-hover">
                            <tbody>
                              <tr>
                                <th scope="row">Full Name</th>
                                <td>{_.get(director, "full_name", "")}</td>
                              </tr>
                              <tr>
                                <th scope="row">National Card</th>
                                <td>{_.get(director, "nic_no", "")}</td>
                              </tr>
                              <tr>
                                <th scope="row">Passport Number</th>
                                <td>{_.get(director, "passport_no", "")}</td>
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
        })()}
      </div>
    );
  }
}

class CommandModal extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      model: {
        comments: ""
      }
    };
    this.input = React.createRef();
    this.handleUploads = this.handleUploads.bind(this);
  }
  close() {
    this.props.onClose();
  }
  submit() {
    this.setState({ busy: true });
    this.props.onSubmit(this.props.command, this.state.model, {
      error: err => {
        this.setState({ errors: err });
      }
    });
  }
  handleUploads(media) {
    _.unset(this.state.model, "uploads");
    this.state.model.attachments = [media];
    this.setState({ model: this.state.model });
  }
  render() {
    let props = this.props,
      command = props.command;
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
            Signup{" "}
            {command == "approve"
              ? "Approved"
              : command == "reject"
              ? "Rejected"
              : "Comments"}
          </h4>
          {/* <!-- <button type="button" className="close" data-dismiss="modal">&times;</button> --> */}
        </div>
        <TargetContext.Provider value={this}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="comment-approve">
                {command == "reject"
                  ? "Please write reason of rejection"
                  : "Comments"}
              </label>
              <div className="">
                <Input
                  as="textarea"
                  eref={this.input}
                  placeholder="Type your comments here"
                  name="comments"
                  className="form-control"
                  rows="5"
                />
                <div className="valid-feedback">Valid.</div>
                <div className="invalid-feedback">Invalid</div>
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
              disabled={!this.state.model.comments.trim() || this.state.busy}
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
