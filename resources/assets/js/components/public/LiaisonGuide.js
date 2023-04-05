import React from "react";
import ListComponent from "./commonComponent/listComponent";
import GuideList from "./commonComponent/guideLinks";
import {Link} from 'react-router-dom'


class LiaisonGuide extends React.Component{

    constructor(props){
        super(props);
        
        this.secondlist=[
            "Copy of Registration of Company duly attested by respective Pak Embassy",
            "Copy of Article of Memorandum of Association duly attested by respective Pak Embassy",
            "Copy of Resolution /Authority letter of the company to establish Branch/Liaison Office in Pakistan ",
            "Company Profile",
            "CV of Designated person   authorized to act on behalf of the company + copies of Passport & NIC",
            "Original Receipt of processing fee of 2000US$ of Liaison Office"
        ]

    }

    render(){
        return(
        <div className="home-page-wrappwers">
            <div className="container">
             <div className="row">
                <div className="col-md-8">

                    <div className="content-wraper">
                        <h2>Information and Required Documents for Permission of Liaison Office</h2>
                        <ListComponent list={this.secondlist} />

                        <Link to="/login" className="btn btn-primary">Apply Now</Link>
                    </div>

                   <div className="content-wraper margin-top-40">
                          <h2> Disclaimer</h2>
                      {__app.DISCLAIMER ?  
                        <p>
                            This site, and any contents or web pages attached, contains confidential information that is intended
                             for the exclusive use of Board of Investment and authorized departments of the Government of Pakistan 
                             for the purpose of Branch/Liaison Office Permission. The submission of confidential information is the 
                             sole responsibility of the applicant. No liability will be accepted for any loss or damage arising from
                              or in reliance upon the contents of this website.This website may 
                            contain links to other independent third-party websites. These linked websites are provided solely as a 
                            convenience to the applicants.</p>
                       : 
                         <p>
                          Only authorized employees of Board of Investment and authorized departments of the Government of Pakistan are permitted to access this system and any unauthorized use of this system is unlawful. The authrized employees agree to not share their username and password with anyone, including other members of their office, family, friends or with anyone else. In order to maintain the security of this system, each individual must register separately.
                          
                          By accessing this database, you agree to keep all materials confidential. You agree not to disseminate or otherwise provide any material obtained from the system to any person not currently an "Authorized User" as defined under this Agreement.
                          All Authorized employees must cease use of this system, destroy any materials they have already obtained from this website, and immediately notify Board of Investment at <a href="mailto:atamustafa@invest.gov.pk">atamustafa@invest.gov.pk</a>, if you cease work as an Authorized employee.
                          This System is provided to you on an as-is and as-available basis. Board of Investment makes no warranty of any kind, either express or implied.
                          The information and material contained on this site is confidential, and all authorized persons accessing the material have an obligation of confidentiality. If you are not an authorized employees of Board of Investment or authorized department of the Government of Pakistan, you are hereby notified that any entry into this site or disclosure, generation of attack, hacking attempt, copying, distribution or use of any of the information contained in or attached to this site is strictly prohibited. If you have any knowledge of attempts to enter this site wrongfully, you are advised in your own interest to please immediately notify us via e-mail at  <a href="mailto:atamustafa@invest.gov.pk">atamustafa@invest.gov.pk</a>. All access to this system is monitored and may be used as an evidence in the court of law. If you are uncertain of your authorization status, please contact us via email at  <a href="mailto:atamustafa@invest.gov.pk">atamustafa@invest.gov.pk</a>.
                          You acknowledge that you have read and understood the aforesaid Policy as well as Governance Policies for the Branch / Liaison Management Information System.</p>

                      }
                  </div>

                 </div>
                 <div className="col-md-4">
                    <div className="content-wraper">
                        <h2>Help Items</h2>
                        <GuideList heading="How to apply" paragraph = "Learn how to apply for Branch/Liaison" icon='images/info.png' href="/how-to-apply"/>
                        <GuideList heading="PHOTOGRAPH GUIDE" paragraph = "How to upload photo" icon="images/camera.png" href="photograph-guide"/>
                        <GuideList heading="DOCUMENTS GUIDE" paragraph = "How to upload documents" icon="images/doc.png" href="document-guide"/>
                        <GuideList heading="APPLICATION GUIDE" paragraph = "Detailed guide for the application" icon="images/search-icon.png" href="application-guide"/>
                         
                    </div>
                 </div>
             </div>
          </div>
        </div>
        );
    }
}

export default LiaisonGuide;