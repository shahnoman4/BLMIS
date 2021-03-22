import React from "react";
import ListComponent from "./commonComponent/listComponent";
import GuideList from "./commonComponent/guideLinks";
import {Link} from 'react-router-dom'


class Conversion extends React.Component{

    constructor(props){
        super(props);

        this.istlist=[
            'Prescribed Application Form through “Branch/Liaison Office Management Information System (BLMIS)”.',        
            "Board Resolution.",        
            "Processing fee of US$3000 for Branch Office and US$2000 for Liaison Office.",        
            "Copy of latest Valid Permission/Renewal letter of Board of Investment.",        
            "Copy of Contract Agreement, in case of conversion from Liaison Office to Branch Office.",        
            ];

       
      
      

    }

    render(){
        return(
        <div className="home-page-wrappwers">
            <div className="container">
             <div className="row">
                <div className="col-md-12">
                    <div className="content-wraper">
                        <h2>Conversion of Liaison Office to Branch Office or Branch Office to Liaison Office </h2>
                        <p>Following documents will be required.</p>
                        <ListComponent list={this.istlist} />
                    </div>
                    
                 </div>
             </div>
          </div>
        </div>
        );
    }
}

export default Conversion;