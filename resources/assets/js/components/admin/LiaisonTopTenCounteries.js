import React from 'react'
import Grid from '../Grid'
import {Bar} from 'react-chartjs-2'

let countries = __app.LOOKUP.Country.data;

export default class LiaisonTopTenCounteries extends React.Component{

        
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
                      label: 'No of Companies',
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
        api.get('/report/liaisontoptencountries')
             .then(response=>{
                    busy.apps = false;
                    data.apps = response.all;
                    graph.labels = response.country;
                    graph.datasets[0].data = response.total;
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
                      text:'Top Ten Countries Graph',
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
                                    <h5>Top Ten Countries</h5>
                                </div>
                            </div>
                        </div>
                        <div className='data-table data-contracts'>
                            <table className="table">
                              <thead className="thead-dark">
                                <tr>
                                  <th scope="col">Country Name</th>
                                  <th scope="col">No of Companies</th>
                                  <th scope="col">From Date</th>
                                  <th scope="col">To Date</th>
                                </tr>
                              </thead>
                              <tbody>

                                   {
                                      this.state.reports &&  this.state.reports.map((report,index)=>{
                                            return(
                                                    <tr key={index}>
                                                      <td>{__app.LOOKUP.text('Country',report.country)}</td>
                                                      <td>{report.total}</td>
                                                      <td>{report.fromdate}</td>
                                                      <td>{report.todate}</td>
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