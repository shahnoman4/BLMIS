import React from 'react'
import Grid from '../Grid'

export default class DailyCurrencyRate extends React.Component{
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
                    {field: "rate", title: "Rate"},
                    {field: "Timestamp", title: "Timestamp"},                    
                ]
            }
        }
    }
    componentDidMount(){
        this.grid && this.grid.read();
    }
    fetchData(params){
        let {busy, data} = this.state;
        let id = _.get(this.props, 'match.params.id', "");
        busy.apps = true;
        if(id){
            params = params || {};
            params.application_id = id;
        }
        this.setState({busy});
        api.get('/report/dailycurrencyrate', {params: params}).then((res)=>{
            busy.apps = false;
            data.apps = res;
            this.setState({busy, data});
        });
    }
    render(){
        let id = _.get(this.props, 'match.params.id', "");
        return (
            <div className="col p3040">
                <div className={`widget widget-data${this.state.busy.apps ? " busy" : ""}`}>
                    <div className="widget-inner">
                        <div className="data-heading">
                            <div className="d-flex">
                                <div className="mr-auto">
                                     <h5>Daily Currency Rate</h5>
                                </div>
                            </div>
                        </div>
                        <div className='data-table data-contracts'>
                            <Grid options={this.options.grid} data={this.state.data.apps} init={(grid)=>{this.grid = grid;}} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}