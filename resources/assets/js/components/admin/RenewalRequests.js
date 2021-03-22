import React from 'react'
import Grid from '../Grid'
import { isBranchType } from '../../helper/common';

export default class RenewalRequests extends React.Component{
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
                pageable: {
                    buttonCount: 5,
                    pageSizes: [5, 10, 25, 50, 100],
                    pageSize: 10
                },
                read: this.fetchData.bind(this),
                table: {props: {className: "table table-striped"}},
                thead: {props: {className: "thead-dark"}},
                th: {props: {scope: "col"}},
                columns: [
                    {field: "id", title: "SR.#"},
                    {field: "company.name", title: "COMPANY NAME"},
                    {
                        field: "service_type_id", title: "SERVICE TYPE", template: function(typeId){
                            return __app.LOOKUP.text('ServiceType', typeId);
                        }
                    },
                    {field: "local_contact.full_name", title: "FOCAL PERSON"},
                    {
                        field: "renewal_period", title: "DURATION", template: (value)=>{
                            return value + (value == 1 ?  'Year' : ' Years');
                        }
                    },
                    {
                        title: "ACTIONS", template: (vlaue, data)=>{
                            let history = this.props.history;
                            return <button className="btn btn-outline-primary" onClick={()=>{
                                history.push("/application/"+ (isBranchType(data) ? "branch" : "liaison") +"/" + applicationStatusName(data.status_id).toLowerCase() + "/" + data.id);
                            }}>View Details</button>
                        }
                    },
                ]
            }
        }
    }
    componentDidMount(){
        this.grid && this.grid.read();
    }
    fetchData(params){
        let {busy, data} = this.state;
        busy.apps = true;
        this.setState({busy});
        api.get('/application/renewal', {params: params}).then((res)=>{
            busy.apps = false;
            data.apps = res;
            this.setState({busy, data});
        });
    }
    render(){
        let type = _.get(this.props, 'match.params.type', "");
        return (
            <div className="col p3040">
                <div className={`widget widget-data${this.state.busy.apps ? " busy" : ""}`}>
                    <div className="widget-inner">
                        <div className="data-heading">
                            <div className="d-flex">
                                <div className="mr-auto">
                                    <h5>Renewal Requests</h5>
                                </div>
                                {(()=>{
                                    return(
                                    <div className="ml-auto">
                                        <select className="custom-select" onChange={(e)=>{this.grid.filter({app_type: e.target.value})}} style={{minWidth: 150}}>
                                            <option value='all'>All</option>
                                            <option value='branch'>Branch Office</option>
                                            <option value='liaison'>Liaison Office</option>
                                        </select>
                                    </div>
                                    );
                                })()}
                            </div>
                        </div>
                        <div className={`data-table data-branches ${type}`}>
                            <Grid options={this.options.grid} data={this.state.data.apps} init={(grid)=>{this.grid = grid;}} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}