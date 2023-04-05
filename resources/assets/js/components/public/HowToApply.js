import React from 'react';
import ListComponent from "./commonComponent/listComponent";

class HowToApply extends React.Component{
    constructor(props){
        super(props); 
        this.istlist=[
            "Click the Browse button",
            {
                child:{ 
                    img:[
                        asset('images/browse.png'), 
                    ]
                }
            },
            "Copy of Registration of Company duly attested by respective Pak Embassy",
            "A pop-up will show you the computer directory",
            "Navigate through it to search for the appropriate/relevant document  e.g Downloads/RenewalLetter.pdf",
            "Select the file on the computer ",
            "Click open or choose depending upon your browser",
            "Wait for the file to be completely uploaded"
           
        ];


        this.secondlist=[
            "Click the Browse button",
            {
                child:{ 
                    img:[
                        asset('images/browse2.png'), 
                    ]
                }
            },
            "A pop-up will show you the computer directory",
            "Navigate through it to search for the appropriate/relevant file e.g Downloads/NIC.pdf",
            "Select the file on the computer",
            "Click open or choose depending upon your browser",
            "Wait for the file to be completely uploaded",
             
           
        ];


        this.thirdlist=[
            "Click the Browse button",
            {
                child:{ 
                    img:[
                        asset('images/browse3.png'), 
                    ]
                }
            },
            "A pop-up will show you the computer directory",
            "Navigate through it to search for the appropriate/relevant file e.g Downloads/NIC.pdf",
            "Select the file on the computer",
            "Click open or choose depending upon your browser",
            "Wait for the file to be completely uploaded",
             
           
        ];
     
    }
    render(){
    return ( 
    <div className="container">
        <div className="guide-link">
            
            <p>Following are the steps that are to be followed when uploading a Last Permission/Renewal Letter:</p>
            <ListComponent list={this.istlist} />
        
            <p>Note: The appropriate format of the file must be in PDF format.</p>
            <p>Following are the steps that are to be followed when uploading a National Identity Card copy:</p>
            
            <ListComponent list={this.secondlist} />
            <p>Note: The National Identity Card must be valid not expired. The file must be in PDF format.</p>

             <p>Following are the steps to be followed when uploading a Passport Copy:</p>
             <ListComponent list={this.thirdlist} />
              
             <p>The Passport Copy must be in PDF format. In addition, the passport must be valid not expired. </p>
        </div>
    </div>
     );
    }
}   
 
export default HowToApply;