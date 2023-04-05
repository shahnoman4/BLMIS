import React from "react";
import ListComponent from "./commonComponent/listComponent";
import GuideList from "./commonComponent/guideLinks";
import {Link} from 'react-router-dom'


class NewLiaison extends React.Component{

    constructor(props){
        super(props);

        this.istlist=[
            "The foreign company shall submit its request to Board of Investment in writing or online as the case may be, for opening of Liaison Office and shall ensure that all formalities and fees being charged for the said purpose have been completed.",
            "The application shall be made on letter head of the Company by Company, Legal Firms, Lawyers, Chartered Accountants or Consultants (duly appointed by the Company)."
        ];

        this.istlist2=[
            "Application form for Liaison Office (duly filled in and signed with stamp) as prescribed by Board of Investment.",
            "Copy of registration of company or certificate of incorporation in its own country duly attested by respective Pak Embassy/ High Commission/ Consulate General.",
            "Copy of Article of Memorandum and Article of Association duly attested by respective Pak Embassy.",
            "Copy of Resolution/Authority letter of the company to establish Liaison Office in Pakistan.",
            "Company Profile.",
            "Copy of CNIC/ Passport and Curriculum Vitae (CV) of the designated person authorized to act on  behalf of the company,",
            "Fees as prescribed by Board of Investment.",
            "Any other document deemed important by Board of Investment can be requested from the Company.",
        ];
      
      

    }

    render(){
        return(
        <div className="home-page-wrappwers">
            <div className="container">
             <div className="row">
                <div className="col-md-12">
                    <div className="content-wraper">
                        <h2>Procedure to submit application for opening of Liaison Office;</h2>
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

export default NewLiaison;