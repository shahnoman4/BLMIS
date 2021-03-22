import React from 'react'
import Grid from '../Grid'

export default class PaymentDetail extends React.Component{
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
                    {field: "company_name", title: "COMPANY NAME"},
                    {
                        field: "service_type_id", title: "TYPE", template: function(typeId){
                            return __app.LOOKUP.text('ServiceType', typeId);
                        }
                    },
                    {field: "usd_amount", title: "USD Amount"},
                    {field: "pkr_rate", title: "PKR Rate"},
                    {field: "retreival_ref_no", title: "Retreival Ref No"},
                    {field: "pp_txn_ref_no", title: "Challan No"},
                    {field: "pp_response_code", title: "Response Code"},
                    {field: "created_at", title: "Date"},
                    
                    
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
        api.get('/report/paymentdetail', {params: params}).then((res)=>{
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
                                     <h5>Payment Detail Report</h5>
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