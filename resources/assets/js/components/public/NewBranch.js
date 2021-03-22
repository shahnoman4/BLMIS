import React from "react";
import ListComponent from "./commonComponent/listComponent";
import GuideList from "./commonComponent/guideLinks";
import {Link} from 'react-router-dom'


class NewBranch extends React.Component{

    constructor(props){
        super(props);

        this.istlist=[
            "The foreign company shall submit its request to Board of Investment online through “Branch / Liaison Management Information System (BLMIS)” for opening of Branch Office and shall ensure that all formalities and fees being charged for the said purpose have been completed.",
            "The application shall be made on letter head of the company by company, legal firms, lawyers, chartered accountants or consultants (duly appointed by the company)."
        ];

        this.istlist2=[
            "Application form for Branch Office as prescribed by Board of Investment.",
            "Copy of registration of foreign company or certificate of incorporation in its  own   Country duly attested by respective Pak Embassy/High  commission/Consulate  General.",
            "Copy of Article of Memorandum and Article of Association duly attested by   respective Pak Embassy/High commission/Consulate General.",
            "Copy of Resolution/Authority letter of the company to establish Branch  Office  in Pakistan.",
            "Copy of Contract Agreement made by foreign company with Public or Private   Entity in Pakistan.",
            "Company Profile of foreign company.",
            "Copy of CNIC/ Passport and Curriculum Vitae (CV) of the designated person   authorized to act on behalf of the company,",
            "Fees as prescribed by Board of Investment.",
            "Any other document deemed important by Board of Investment can be   requested from the Company.",
        ];
      
      

    }

    render(){
        return(
        <div className="home-page-wrappwers">
            <div className="container">
             <div className="row">
                <div className="col-md-12">
                    <div className="content-wraper">
                        <h2>Procedure to submit application for opening of Branch Office:</h2>
                        <ListComponent list={this.istlist} />
                    </div>
                    <div className="content-wraper">
                        <h2>Documents Required:</h2>
                        <ListComponent list={this.istlist2} />
                    </div>
                 </div>
             </div>
          </div>
        </div>
        );
    }
}

export default NewBranch;