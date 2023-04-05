import React from 'react';
import ListComponent from "./commonComponent/listComponent";


const DocumentGuide = () => { 
  var  istlist=[
        "Copy of registration of Company duly attested by Pakistan Embassy",
        "Copy of Article of Memorandum of Association (MoA) duly attested by Pakistan Embassy ",
        "Copy of Resolution/Authority letter of company ( Note: For establishment of branch/liaison office in Pakistan)",
        "Company profile (background, scope of project, expertise, pictures, 300 words)",
        "Curriculum Vitae (CV), Passport Copy/National Identity Card of the authorized person acting on behalf of the company.",
        "Incase of Branch office, a copy of Contract Agreement is to be submitted",
        "One original set with five copies of the above listed documents are to be submitted ",
        `For Branch Liaison office a processing fee of $3000/2000 is to be deposited for a initial period   of one year. For a Sub-office of Branch office a total processing fee of $1500 is to be deposited. 
        For a Sub-office of Liaison office a total processing fee of $1000 is to be deposited. The respective amount (US $ or equivalent in Pakistani Rupees) is to be deposited in the Board of Investment Account, which is being 
        maintained by National Bank of Punjab. Following are mentioned the official account details;`,
        {
            child:[
                "Title of Account: Board of Investment",
                "Account No. 3035205436",
                "Branch Code - 0341",
                "Swift Code- NBPAPKKA02I",
                "IBAN – PK07NBPA0341003035205436"
            ]
        }
       ];

      var secondlist=[
        "A pop-up will show you the computer directory",
        "Navigate through it to search for the appropriate/relevant file e.g Downloads/NIC.pdf",
        "Select the file on the computer",
        "Click open or choose depending upon your browser",
        "Wait for the file to be completely uploaded"
       
        ];


    return ( 
    <div className="container">
        <div className="guide-link">
            
            <p>Along with the application, you should upload the copies of the following supporting document to 
                complete the submission process and avoid delays. Inorder to get your company registered in the
                 Branch Liaison Management Information System.Following are the guidelines that are to be followed while submitting of the form;</p>
            <p>
            Note:  The Company is required to submit one original and five copies of the required documents mentioned below. 
            In addition, a soft copy is to be sent via email at <a href="mailto:registration@pakboi.gov.pk">registration@pakboi.gov.pk</a>:
            </p>
            <ListComponent list={istlist} />
              {/* <p>Note: The appropriate format of the file should be in PDF format.</p>
            <p>Following are the steps that are to be followed when uploading a National Identity Card copy:</p>
            <ListComponent list={secondlist} /> */}

            <p>Note: Incomplete application will not be entertained, 
            if any of the required documents are missing, or photocopies are not clear, 
            your application will not be processed further.</p>
        </div>
    </div>
     );
}   
 
export default DocumentGuide;