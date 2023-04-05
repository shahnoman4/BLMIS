import React from "react";
import Grid from "../Grid";

export default class BranchGrid extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      busy: {
        apps: false,
        stats: false
      },
      data: {
        apps: { data: [] },
        stats: []
      },
      searchType: "company_name"
    };

    this.options = {
      grid: {
        pageable: {
          buttonCount: 5,
          pageSizes: [5, 10, 25, 50, 100],
          pageSize: 10
        },
        read: this.fetchData.bind(this),
        table: { props: { className: "table table-striped" } },
        thead: { props: { className: "thead-dark" } },
        th: { props: { scope: "col" } },
        columns: [
          { field: "id", title: "SR.#" },
          { field: "file_no", title: "File No" },
          { field: "company.name", title: "COMPANY NAME" },
          {
            field: "service_type_id",
            title: "SERVICE TYPE",
            template: function(typeId) {
              return __app.LOOKUP.text("ServiceType", typeId);
            }
          },
          { field: "local_contact.full_name", title: "FOCAL PERSON" },
          {
            field: "status_id",
            title: "STATUS",
            template: (value, data) => {
              if (
                value == __app.LOOKUP.ApplicationStatus.REJECTED &&
                data.attempts >= 2
              ) {
                return "Completely Rejected";
              }
              return __app.LOOKUP.text("ApplicationStatus", value);
            }
          },
          {
            title: "ACTIONS",
            template: (vlaue, data) => {
              let history = this.props.history;
              return (
                <button
                  className="btn btn-outline-primary"
                  onClick={() => {
                    history.push(
                      "/application/" +
                        (data.converted_from ? "converted-" : "") +
                        (isBranchType(data) ? "branch" : "liaison") +
                        "/" +
                        applicationStatusName(
                          data.status_id,
                          data.attempts
                        ).toLowerCase() +
                        "/" +
                        data.id
                    );
                  }}
                >
                  View Details
                </button>
              );
            }
          }
        ]
      }
    };
  }
  componentDidUpdate(oldProps) {
    let type = _.get(this.props, "match.params.type", "");
    if (type != _.get(oldProps, "match.params.type")) {
      this.grid && this.grid.read({ page: 1 });
    }
  }
  componentDidMount() {
    console.log("THIS GRID", this.grid);
    this.grid && this.grid.read();
  }
  fetchData(params) {
    let { busy, data } = this.state;
    let type = _.get(this.props, "match.params.type");
    busy.apps = true;
    this.setState({ busy });
    api
      .get("/application/branch/" + type, {
        params: _.extend(
          {
            service_type: this.props.serviceType,
            search_item:this.state.searchCompany,
            search_type:this.state.searchType,
            converted: this.props.converted
          },
          params
        )
      })
      .then(res => {
        busy.apps = false;
        data.apps = res;
        this.setState({ busy, data });
      });

    type == "all" && this.fetchStats();
  }
  fetchStats() {
    let { busy, data } = this.state;
    busy.stats = true;
    this.setState({ busy });
    api
      .get(
        "/application/branch/stats" +
          (this.props.serviceType
            ? "?service_type=" + this.props.serviceType
            : "")
      )
      .then(res => {
        busy.stats = false;
        data.stats = res;
        this.setState({ busy, data });
      });
  }
  render() {
    let type = _.get(this.props, "match.params.type", "");
    return (
      <div className="col p3040">
        {(() => {
          if (type == "all") {
            return (
              <div
                className={`widget widget-infographics${
                  this.state.busy.stats ? " busy" : ""
                }`}
              >
                <div className="widget-inner">
                  <div className="row infographics-items">
                    <div className="col infographic">
                      <div className="card bg-warning">
                        <div className="card-body">
                          <p>NEW APPLICATIONS</p>
                          <h1>
                            {_.padStart(
                              (
                                _.find(this.state.data.stats, {
                                  status_id: __app.LOOKUP.ApplicationStatus.NEW
                                }) || { count: 0 }
                              ).count,
                              2,
                              0
                            )}
                          </h1>
                          <i className="fas fa-newspaper"></i>
                        </div>
                      </div>
                    </div>
                    {(() => {
                      if (__app.user.is_admin) {
                        return (
                          <div className="col infographic">
                            <div className="card bg-primary">
                              <div className="card-body">
                                <p>CIRCULATED APPLICATIONS</p>
                                <h1>
                                  {_.padStart(
                                    (
                                      _.find(this.state.data.stats, {
                                        status_id:
                                          __app.LOOKUP.ApplicationStatus
                                            .CIRCULATED
                                      }) || { count: 0 }
                                    ).count,
                                    2,
                                    0
                                  )}
                                </h1>
                                <i className="fas fa-star"></i>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    })()}
                    <div className="col infographic">
                      <div className="card bg-danger">
                        <div className="card-body">
                          <p>REJECTED APPLICATIONS</p>
                          <h1>
                            {_.padStart(
                              (
                                _.find(this.state.data.stats, {
                                  status_id:
                                    __app.LOOKUP.ApplicationStatus.REJECTED
                                }) || { count: 0 }
                              ).count,
                              2,
                              0
                            )}
                          </h1>
                          <i className="fas fa-times-circle"></i>
                        </div>
                      </div>
                    </div>
                    <div className="col infographic">
                      <div className="card bg-success">
                        <div className="card-body">
                          <p>APPROVED APPLICATIONS</p>
                          <h1>
                            {_.padStart(
                              (
                                _.find(this.state.data.stats, {
                                  status_id:
                                    __app.LOOKUP.ApplicationStatus.APPROVED
                                }) || { count: 0 }
                              ).count,
                              2,
                              0
                            )}
                          </h1>
                          <i className="fas fa-book"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          }
        })()}
        <div
          className={`widget widget-data${this.state.busy.apps ? " busy" : ""}`}
        >
          <div className="widget-inner">
            <div className="data-heading">
              <div className="d-flex">
                <div className="mr-auto">
                  <h5>
                    {type == "reviewable"
                      ? "REJECTED"
                      : type == "rejected"
                      ? "COMPLETELY REJECTED"
                      : type.toUpperCase()}{" "}
                    APPLICATIONS
                  </h5>
                </div>
                <div
                  class="form-group"
                  style={{
                    height: "30px",
                    marginBottom: "0px"
                  }}
                >
                  <select
                    class="form-control"
                    value={this.state.searchType}
                    style={{ marginRight: "0px" }}
                    onChange={e => {
                      {
                        this.setState({ searchType: e.target.value });
                      }
                    }}
                    id="sel1"
                  >
                    <option value="company_name">Company Name</option>
                    <option value="file_no">File No</option>
                  </select>
                </div>
                <div class="input-group mb-3 col-4">
                  <input
                    style={{ height: "30px" }}
                    type="text"
                    class="form-control"
                    placeholder="Search"
                    onChange={e => {
                      this.setState({ searchCompany: e.target.value });
                    }}
                  />
                  <div class="input-group-append">
                    <button
                      class="btn btn-primary"
                      type="submit"
                      onClick={() => {
                        console.log("DATA", this.state.searchCompany);
                        this.grid.filter({
                          search_item: this.state.searchCompany,
                          search_type: this.state.searchType
                        });
                      }}
                    >
                      Go
                    </button>
                  </div>
                </div>
                {(() => {
                  if (type == "all") {
                    return (
                      <div className="ml-auto">
                        {/* <TextSearch placeholder="Search here" className="form-control" onSearch={(q)=>{this.grid.filter({q: q})}} /> */}
                        <select
                          className="custom-select"
                          onChange={e => {
                            this.grid.filter({ app_type: e.target.value });
                          }}
                          style={{ minWidth: 130 }}
                        >
                          <option value="all">All</option>
                          <option value="new">New</option>
                          <option value="circulated">Circulated</option>
                          <option value="rejected">Rejected</option>
                          <option value="approved">Approved</option>
                          <option value="matured">Matured</option>
                        </select>
                      </div>
                    );
                  }
                })()}
              </div>
            </div>
            <div className={`data-table data-branches ${type}`}>
              {console.log("HOLD--->", this)}
              <Grid
                options={this.options.grid}
                data={this.state.data.apps}
                init={grid => {
                  this.grid = grid;
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
