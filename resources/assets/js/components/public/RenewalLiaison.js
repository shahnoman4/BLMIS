import React from "react";
import ListComponent from "./commonComponent/listComponent";
import GuideList from "./commonComponent/guideLinks";
import {Link} from 'react-router-dom'


class RenewalLiaison extends React.Component{

    constructor(props){
        super(props);

        this.istlist=[
            'Online request through “Branch / Liaison Management Information System (BLMIS)”',        
            "Performance activity report for the last permitted period,",        
            "Receipt and Payment statement or Copy of latest Audited Accounts,",        
            "Proof of fees paid,",        
            "Proceeds Realization Certificate issued by concerned Bank Authorities, where Bank Account of the Company is maintained.",        
            "Copy of Securities and Exchange Commission of Pakistan (SECP) certificate for filing of documents",        
            "Copy of Income Tax return,",        
            "Any other relevant document/paper if called by Board of Investment, in support of processing the case."       
            ];

       
      
      

    }

    render(){
        return(
        <div className="home-page-wrappwers">
            <div className="container">
             <div className="row">
                <div className="col-md-12">
                    <div className="content-wraper">
                        <h2>Liaison Renewal of Permission </h2>
                        <p>The request for renewal shall be accompanied by the following documents:</p>
                        <ListComponent list={this.istlist} />
                    </div>
                    
                 </div>
             </div>
          </div>
        </div>
        );
    }
}

export default RenewalLiaison;