import React from 'react'
import Grid from '../Grid'

export default class Dashboard extends React.Component{
    constructor(props){
        super(props);
        
        this.state = {
            busy: {
                apps: false,
                stats: false
            },
            data: {
                apps: {data: []},
                stats: []
            }
        }

        this.options = {
            grid: {
                pageable: true,
                table: {props: {className: "table table-striped"}},
                thead: {props: {className: "thead-dark"}},
                th: {props: {scope: "col"}},
                columns: [
                    {field: "id", title: "SR.#"},
                    {field: "file_no", title: "File No"},
                    {field: "company.name", title: "COMPANY NAME"},
                    {
                        field: "service_type_id", title: "SERVICE TYPE", template: function(typeId){
                            return __app.LOOKUP.text('ServiceType', typeId);
                        }
                    },
                    {field: "local_contact.full_name", title: "FOCAL PERSON"},
                    {
                        field: "status_id", title: "STATUS", template: (value)=>{
                            return __app.LOOKUP.text('ApplicationStatus', value)
                        }
                    },
                    {
                        title: "ACTIONS", template: (vlaue, data)=>{
                            let history = this.props.history;
                            return <button className="btn btn-outline-primary" onClick={()=>{
                                history.push("/application/branch/" + applicationStatusName(data.status_id).toLowerCase() + "/" + data.id);
                            }}>View Details</button>
                        }
                    },
                ]
            }
        }
    }
    componentDidMount(){
        this.fetchData();
    }
    fetchData(){
        let {busy, data} = this.state;
        busy.apps = true;
        this.setState({busy});
        api.get('/application/branch/recent').then((res)=>{
            busy.apps = false;
            data.apps = res;
            this.setState({busy, data});
        });

        this.fetchStats();
    }
    fetchStats(){
        let {busy, data} = this.state;
        busy.stats = true;
        this.setState({busy});
        api.get('/application/all/stats').then((res)=>{
            busy.stats = false;
            data.stats = res;
            console.log("DATA -->>", data)
            this.setState({busy, data});
        });
    }
    render(){
        let type = _.get(this.props, 'match.params.type', "");
        return (
            <div className="col p3040">
                <div className={`widget widget-infographics${this.state.busy.stats ? " busy" : ""}`}>
                    <div className="widget-inner">
                        <div className="row infographics-items">
                            <div className="col infographic">
                                <div className="card bg-success">
                                    <div className="card-body">
                                        <p>COMPANY APPLICATIONS</p>
                                        <h1>{ _.padStart((_.find(this.state.data.stats, {type: 'company'}) || {count: 0}).count, 2, 0)}</h1>
                                        <i className="fas fa-newspaper"></i>
                                    </div>
                                </div>
                            </div>
                            {(()=>{
                                if(__app.user.is_admin){
                                    return (
                                        <div className="col infographic">
                                            <div className="card bg-primary">
                                                <div className="card-body">
                                                    <p>BRANCH APPLICATIONS</p>
                                                    <h1>{ _.padStart((_.find(this.state.data.stats, {type: 'branch'}) || {count: 0}).count, 2, 0)}</h1>
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
                                        <p>LIAISON APPLICATIONS</p>
                                        <h1>{ _.padStart((_.find(this.state.data.stats, {type: 'liaison'}) || {count: 0}).count, 2, 0)}</h1>
                                        <i className="fas fa-times-circle"></i>
                                    </div>
                                </div>
                            </div>
                            <div className="col infographic">
                                <div className="card bg-warning">
                                    <div className="card-body">
                                        <p>RENEWAL APPLICATIONS</p>
                                        <h1>{ _.padStart((_.find(this.state.data.stats, {type: 'renewal'}) || {count: 0}).count, 2, 0)}</h1>
                                        <i className="fas fa-book"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`widget widget-data${this.state.busy.apps ? " busy" : ""}`}>
                    <div className="widget-inner">
                        <div className="data-heading">
                            <div className="d-flex">
                                <div className="mr-auto">
                                    <h5>RECENT UPDATES</h5>
                                </div>
                                {/* <div className="ml-auto">
                                    <input type="text" name="" placeholder="Search here" className="form-control" />
                                    <select className="custom-select">
                                        <option value='0'>All</option>
                                        <option value='0'>New</option>
                                        <option value='0'>Circulated</option>
                                        <option value='0'>Rejected</option>
                                        <option value='0'>Approved</option>
                                    </select>
                                </div> */}
                            </div>
                        </div>
                        <div className={`data-table data-branches`}>
                            <Grid options={this.options.grid} data={this.state.data.apps} isDashbord={true} />
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}