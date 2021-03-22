import React from "react";
import Grid from "../Grid";
import api from "../../config/app";
import { TextSearch } from "../Common";

export default class SignUps extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      busy: {
        signups: false,
        stats: false
      },
      data: {
        signups: { data: [] },
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
          { field: "name", title: "COMPANY NAME" },
          { field: "contact.primary_email", title: "EMAIL" },
          { field: "contact.office_phone", title: "PHONE" },
          {
            field: "status_id",
            title: "STATUS",
            template: value => {
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
                      "/application/signup/" +
                        applicationStatusName(data.status_id).toLowerCase() +
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
    let type = _.get(this.props, "match.params.type");
    this.grid && this.grid.read();
    type == "all" && this.fetchStats();
  }
  fetchData(params) {
    let { busy, data } = this.state;
    let type = _.get(this.props, "match.params.type");
    busy.signups = true;
    this.setState({ busy });
    api.get("/application/signup/" + type, { 
                        params: _.extend(
                          {
                            search_item:this.state.searchCompany,
                          },
                          params
                        )
    }).then(res => {
      busy.signups = false;
      data.signups = res;
      this.setState({ busy, data });
    });
  }
  fetchStats() {
    let { busy, data } = this.state;
    busy.stats = true;
    this.setState({ busy });
    api.get("/application/signup/stats").then(res => {
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
                          <p>NEW SIGNUPS</p>
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
                    <div className="col infographic">
                      <div className="card bg-danger">
                        <div className="card-body">
                          <p>REJECTED SIGNUPS</p>
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
                          <p>APPROVED SIGNUPS</p>
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
          className={`widget widget-data${
            this.state.busy.signups ? " busy" : ""
          }`}
        >
          <div className="widget-inner">
            <div className="data-heading">
              <div className="d-flex">
                <div className="mr-auto">
                  <h5>{type.toUpperCase()} SIGNUPS</h5>
                </div>
            
                <div class="form-group mb-3 col-6">
                  <input
                    style={{ height: "30px" }}
                    type="text"
                    class="form-control"
                    placeholder="Search by Company Name"
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
                          search_item: this.state.searchCompany
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
                          <option value="rejected">Rejected</option>
                          <option value="approved">Approved</option>
                        </select>
                      </div>
                    );
                  }
                })()}
              </div>
            </div>
            <div className={`data-table data-signups ${type}`}>
              <Grid
                options={this.options.grid}
                data={this.state.data.signups}
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
