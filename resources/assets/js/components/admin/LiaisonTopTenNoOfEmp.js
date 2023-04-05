import React from 'react'
import Grid from '../Grid'
import {Bar} from 'react-chartjs-2'


export default class LiaisonTopTenNoOfEmp extends React.Component{

        
        constructor(){
            super();
            this.state = {
                busy: {
                    apps: false,
                    stats: false
                },
                data: {
                    apps: {data: []},
                    stats: []
                },
                reports:[],
                graph:{
                  labels: [],
                  datasets: [
                    {
                      label: 'No of Employees',
                      backgroundColor: 'rgba(75,192,192,1)',
                      borderColor: 'rgba(0,0,0,1)',
                      borderWidth: 2,
                      data: []
                    }
                  ]
                }
            }      
        }
        
   
    componentDidMount(){
        let {busy, data, graph} = this.state;
        busy.apps = true;
        this.setState({busy});
        api.get('/report/liaisontoptenNoOfEmp')
             .then(response=>{
                    busy.apps = false;
                    data.apps = response.all;
                    graph.labels = response.company_name;
                    graph.datasets[0].data = response.total_employee;
                    this.setState({reports:data.apps,graph});
             });
    }
    
    render(){
        return (

            <div className="col p3040">
                <Bar
                  data={this.state.graph}
                  options={{
                    title:{
                      display:true,
                      text:'Top 10 liaison with respect to number of personal to be employed Graph',
                      fontSize:20
                    },
                    legend:{
                      display:true,
                      position:'right'
                    }
                  }}
                />
                <div>
                    <div className="widget-inner">
                        <div className="data-heading">
                            <div className="d-flex">
                                <div className="mr-auto">
                                    <h5>Top 10 liaison with respect to number of personal to be employed
                                    </h5>
                                </div>
                            </div>
                        </div>
                        <div className='data-table data-contracts'>
                            <table className="table">
                              <thead className="thead-dark">
                                <tr>
                                  <th scope="col">Company Name</th>
                                  <th scope="col">Total Employees</th>
                                  <th scope="col">Created At</th>
                                </tr>
                              </thead>
                              <tbody>

                                   {
                                      this.state.reports &&  this.state.reports.map((report,index)=>{
                                            return(
                                                    <tr key={index}>
                                                      <td>{report.company_name}</td>
                                                      <td>{report.total_employee}</td>
                                                      <td>{report.created_at}</td>
                                                    </tr>
                                                )
                                        })
                                    }
                        
                              </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}