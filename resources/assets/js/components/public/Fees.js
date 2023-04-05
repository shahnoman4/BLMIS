import React from "react";
import ListComponent from "./commonComponent/listComponent";

export default class Fees extends React.Component {
    constructor(props){
        super(props); 
        this.istlist=[
            "Fees 3000/2000 US $ for Branch/Liaison office respectively for initial period of one year.1500 US $ for Sub-Office of Branch Office and 1000 US$ for Sub-Office of Liaison Office.The amount (US$ or equivalent in Pak Rupees) shall be deposited in the Board of Investment Account being maintained with National Bank of Pakistan, Main Branch, Civic Centre, Islamabad. ",
            "Details of Account are:-",
            {
                child:[
                       "Title of Account: Board of Investment",
                       "Account No. 3035205436",
                       "Branch Code - 0341",
                       "Swift Code- NBPAPKKA02I",
                       "IBAN – PK07NBPA0341003035205436" 
                ]
                 
            }, 
           
        ];
 
    }
    render() {
        return (
            <div className="container-fluid container-light">
                <div className="container">
                    <div className="content-container">
                        <div className="section section-signup">
                            <div className="section-inner pricing-table-wrap">
                                <h2>Branch and Liaison Office Fee</h2>
                                <div className="data-table">
                                    <table className="table table-striped">
                                        <thead className="thead-dark">
                                            <tr>
                                                <th scope="col" >BRANCH TYPE</th>
                                                <th scope="col">FEE AMOUNT</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Branch Office</td>
                                                <td>$3000 - Yearly</td>
                                            </tr>
                                            <tr>
                                                <td>Sub-Branch Office</td>
                                                <td>$1500 - One time fee</td>
                                            </tr>
                                            <tr>
                                                <td>Liaison Office</td>
                                                <td>$2000 - Yearly</td>
                                            </tr>
                                            <tr>
                                                <td>Sub-Liaison Office</td>
                                                <td>$1000 - One time fee</td>
                                            </tr>
                                            <tr>
                                                <td>Renewal of Branch Office</td>
                                                <td> $1000 - Yearly</td>
                                            </tr>
                                            <tr>
                                                <td>Renewal of Liaison Office</td>
                                                <td>  $500 - Yearly</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <ListComponent list={this.istlist} />
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

