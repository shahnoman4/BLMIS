import React from 'react'
import Grid from '../Grid'
import {Bar} from 'react-chartjs-2'

export default class LiaisonTopTenProjects extends React.Component{

        
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
                      label: 'Annual Expenses',
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
        api.get('/report/liaisontoptenprojects')
             .then(response=>{
                    busy.apps = false;
                    data.apps = response.all;
                    graph.labels = response.project;
                    graph.datasets[0].data = response.annual_expenses;
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
                      text:'Top 10 projects with respect to cost Graph',
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
                                    <h5>Top 10 projects with respect to cost</h5>
                                </div>
                            </div>
                        </div>
                        <div className='data-table data-contracts'>
                            <table className="table">
                              <thead className="thead-dark">
                                <tr>
                                  <th scope="col">Project</th>
                                  <th scope="col">Annual Expenses</th>
                                  <th scope="col">Create At</th>
                                </tr>
                              </thead>
                              <tbody>

                                   {
                                      this.state.reports &&  this.state.reports.map((report,index)=>{
                                            return(
                                                    <tr key={index}>
                                                      <td>{report.project}</td>
                                                      <td>{report.annual_expenses}</td>
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