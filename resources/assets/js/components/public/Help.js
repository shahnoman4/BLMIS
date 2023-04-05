import React from "react";
import ListComponent from "./commonComponent/listComponent";

export default class Help extends React.Component {
    constructor(props){
        super(props); 
        this.istlist=[
            "(duly filled in and signed with stamp).",
            "Copy of registration of company duly attested by respective Pak Embassy.",
           "Copy of Article of Memorandum of Association duly attested by Pak Embassy.",
           "Copy of Resolution/Authority letter of the company to establish Branch/Liaison Office in Pakistan.",
           "Company Profile.",
           "CV of Designated person authorized to act on behalf of the company + Passport copy/CNIC.",
           "Copy of contract agreement (in case of Branch office only).",
           "One original set and five copies are requested of all above documents",
           "Fees 3000/2000 US $ for Branch/Liaison office respectively for initial period of one year. 1500 US $ for Sub-Office of Branch Office and 1000 US$ for Sub-Office of Liaison Office. The amount (US$ or equivalent in Pak Rupees) shall be deposited in the Board of Investment Account being maintained with National Bank of Pakistan, Main Branch, Civic Centre, Islamabad. Details of Account are:-",
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
                   <div className="help-page">
                       <h2 className="page-title"></h2>
                       <div className="help-content">
                          <h2>Foreign company</h2>
                         <p>Foreign company means any company or body corporate incorporated outside Pakistan. However, it would by no mean include International Non-Governmental Organization (INGO) or NGO, Non-Profit Organization (NPO), Association of Persons (AoP), trading company or banking organization, and media houses.</p>

                         <h2>Branch Office</h2> 
                        <p>(i)    Branch office means an office of any foreign company established for the purpose to fulfill contractual obligations made with any Public or Private entity in Pakistan and activity shall be restricted the work mentioned in the agreement between the foreign company and local entity,</p>

                        <p>(ii)   No commercial activity i.e. activity aimed at making profit(s) shall be performed by the branch office of foreign company.</p>

                        <h2>Liaison Office</h2>
                       <p>(i) Liaison Office means an office of any foreign company established for promotion of products(s), provision of technical advice & assistance, exploring the possibility of joint collaboration and export promotion.</p>
                       <p>(ii)  No commercial activity i.e. activity aimed at making profit(s) shall be performed by the liaison office of foreign company.</p>

                       <h2>Procedure to submit application for opening of Branch Office:</h2> 
                       <p>(i)   The foreign company shall submit its request to Board of Investment online through “Branch / Liaison Management Information System (BLMIS)” for opening of Branch Office and shall ensure that all formalities and fees being charged for the said purpose have been completed.</p>
                       <p>(ii)  The application shall be made on letter head of the company by company, legal firms, lawyers, chartered accountants or consultants (duly appointed by the company).</p>

                      <h2>(a)     Documents Required: </h2>
                      <p>1.  Application form for Branch Office as prescribed by Board of Investment.</p>
                      <p>2.  Copy of registration of foreign company or certificate of incorporation in its  own Country duly attested by respective Pak Embassy/High  commission/Consulate General.</p>
                      <p>3.  Copy of Article of Memorandum and Article of Association duly attested by   respective Pak Embassy/High commission/Consulate General.</p>
                      <p>4.  Copy of Resolution/Authority letter of the company to establish Branch  Office in Pakistan.</p>
                      <p>5.  Copy of Contract Agreement made by foreign company with Public or Private   Entity in Pakistan.</p>
                      <p>6.  Company Profile of foreign company.</p>
                      <p>7.  Copy of CNIC/ Passport and Curriculum Vitae (CV) of the designated person   authorized to act on behalf of the company,</p>
                      <p>8.  Fees as prescribed by Board of Investment.</p>
                      <p>9.  Any other document deemed important by Board of Investment can be   requested from the Company.</p>

                      <h2>Procedure to submit application for opening of Liaison Office;</h2>
                      <p>(i) The foreign company shall submit its request to Board of Investment in writing or online as the case may be, for opening of Liaison Office and shall ensure that all formalities and fees being charged for the said purpose have been completed.</p>
                      <p>(ii)  The application shall be made on letter head of the Company by Company, Legal Firms, Lawyers, Chartered Accountants or Consultants (duly appointed by the Company)</p>

                      <h2>(b)   Documents Required. </h2>
                      <p>1.  Application form for Liaison Office (duly filled in and signed with stamp) as     prescribed by Board of Investment.</p>
                      <p>2.  Copy of registration of company or certificate of incorporation in its own  country duly attested by respective Pak Embassy/ High Commission/   Consulate General.</p>
                      <p>3.  Copy of Article of Memorandum and Article of Association duly attested by   respective Pak Embassy.</p>
                      <p>4.  Copy of Resolution/Authority letter of the company to establish Liaison   Office in Pakistan.</p>
                      <p>5.  Company Profile.</p>
                      <p>6.  Copy of CNIC/ Passport and Curriculum Vitae (CV) of the designated person   authorized to act on  behalf of the company,</p>
                      <p>7.  Fees as prescribed by Board of Investment.</p>
                      <p>8.  Any other document deemed important by Board of Investment can be   requested from the Company.</p>

                      <h2>Return of documents.</h2>
                      <p>(i) The application / documents shall be returned to the company online through “Branch/Liaison Office Management Information System (BLMIS)” and will appear in the user account, if found incomplete or in case of any query. The application can be re-submitted with the provision of requisite information.</p>
                      <p>(ii)  Board of Investment shall reject applications containing wrong information, incorrect data, fictitious address and, in such cases fees paid by the company shall not be refunded.</p>
                      <h2>Processing.</h2>
                      <p>(i) In case of cancellation/withdrawal of permission or rejection of application for Branch or Liaison office on any reason, the fees paid by the company shall be forfeited, and no claim of refund shall be entertained. In such case, Branch or Liaison Office shall have to be closed.</p>
                      <p>(ii)  The foreign company being aggrieved with the decision of Board of Investment, may file review application within 30 days of such decision to Board of Investment.</p>
                      <p>(iii) The permission shall be granted for a period maximum upto one year with immediate effect after due processing of the case in accordance with the provisions of Investment Policy, 2013.</p>
                      <p>(iv)  Board of Investment shall examine the review application of the company and convey its final decision to the company.</p>
                      <p>(v) The foreign company shall submit certain documents to Securities and Exchange Commission of Pakistan (SECP) as required under Companies Act, 2017, within 30 days of the permission issued by Board of Investment, and shall receive acknowledgement certificate of such documents from Securities and Exchange Commission of Pakistan (SECP).</p>
                      <p>(vi)  A certificate with regard to submission of such documents issued by Securities and Exchange Commission of Pakistan (SECP) shall be submitted to Board of Investment, before application for renewal of permission is submitted.</p>
                      <p>(vii) The company shall register with local Tax Authorities and other relevant departments wherever it is applicable.</p>

                      <h2>Conversion of Liaison Office to Branch Office or Branch Office to Liaison Office</h2>
                      <p>Following documents will be required.</p>
                      <p>(i) Prescribed Application Form through “Branch/Liaison Office Management Information System (BLMIS)”.</p>
                      <p>(ii)  Board Resolution.</p>
                      <p>(iii) Processing fee of US$3000 for Branch Office and US$2000 for Liaison Office.</p>
                      <p>(iv)  Copy of latest Valid Permission/Renewal letter of Board of Investment.</p>
                      <p>(v) Copy of Contract Agreement, in case of conversion from Liaison Office to Branch Office.</p>

                      <h2>Renewal of Permission</h2> 
                      <p>The request for renewal shall be accompanied by the following documents:</p>
                       
                      <h2>(a)  Branch Office</h2> 
                      <p>i.  Online request through “Branch / Liaison Management Information System (BLMIS)”</p>
                      <p>ii. Copy of valid Contract Agreement,</p>
                      <p>iii.  Copy of latest Audited Accounts,</p>
                      <p>iv. Proof of fees paid.</p>
                      <p>v.  Proceeds Realization Certificate issued by concerned bank authorities, where Bank Account of the company is maintained.</p>
                      <p>vi. Copy of Securities and Exchange Commission of Pakistan (SECP) certificate for filing of documents</p>
                      <p>vii.  Copy of Income tax return,</p>
                      <p>viii. Any other relevant document/paper if called by Board of Investment, in support of processing the case.</p>

                      <h2>(b)  Liaison Office</h2> 

                      <p>(i) Online request through “Branch / Liaison Management Information System (BLMIS)”</p>
                      <p>(ii)  Performance activity report for the last permitted period,</p>
                      <p>(iii) Receipt and Payment statement or Copy of latest Audited Accounts,</p>
                      <p>(iv)  Proof of fees paid, </p>
                      <p>(v) Proceeds Realization Certificate issued by concerned Bank Authorities, where Bank Account of the Company is maintained.</p>
                      <p>(vi)  Copy of Securities and Exchange Commission of Pakistan (SECP) certificate for filing of documents</p>
                      <p>(vii) Copy of Income Tax return,</p>
                      <p>(viii)  Any other relevant document/paper if called by Board of Investment, in support of processing the case.</p>

                      <h2>Change of Address</h2>
                      <p>The request for change of address of the company's Branch or Liaison Office or sub office shall be processed and notified to stakeholders; in case of any negative remarks from any of concerned stakeholders the request for change of address shall be reconsidered.</p>

                      <h2>Change of Company's Authorized Representative</h2>
                      <p>The request for change of company's Authorized Representative shall be received and processed subject to provision of concerned Board of Director’s resolution in the matter.</p>




                      <h2>Closure of Office</h2>
                      <p>The request for closure of the Branch or Liaison Office shall be submitted to Board of Investment, which shall be accompanied by:</p>

                      <p>i.  Request letter for closure.</p>
                      <p>ii. Copy of Board Resolution for closure of Office in Pakistan</p>
                      <p>iii.  Activity report, proceeds realization certificate, and copy of audited accounts for the last permitted period.</p>
                      <p>iv. Copies of press clipping regarding closure of office published in main Urdu and English newspapers, respectively.</p>
                      <p>v.  Confirmation from Tax Authorities that all assessments are finalized, and no amount of Tax is outstanding.</p>
                      <p>vi. Legal Liability Affidavit.</p>
                       
                      <h2>Opening of sub office at any station other than main office</h2> 

                      <p>(i)           The application for expanding network of the Branch or Liaison Office within Pakistan shall be received and processed subject to fulfillment of all required formalities. The stakeholder will be informed accordingly.</p>
                      <p>(ii)      One-time fee for each sub office shall be charged separately, as prescribed by Board of Investment from time to time.</p>
                       
                      <h2>Regularization of missing period</h2>
                      <p>The company shall apply for regularization of its missing period, if failed to get its permission renewed within due date by providing any solid reason and justification of delay occurred. However, Board of Investment reserve the right to reject or regularize the said missing period on charging required fees as prescribed from time to time.</p>

                      <h2>General</h2>
                                    <p>(i)      Board of Investment shall declare as "Blacklist" all those companies which shall not be performing their functions in accordance with the contents in application form or permission letter provided to Board of Investment, or violate any of provision of aforesaid instructions and they shall be ineligible to open their office for a period of five (05) years. However, such company can make an appeal to Board of Investment.</p>

                          
                       </div>
                   </div>
                </div>
            </div>
        );
    }
}

