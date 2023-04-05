import React from 'react';
import ListComponent from "./commonComponent/listComponent";

const PhotographGuide = () => { 

   var istlist=[
        "No more than six months old",
        "In sharp focus and clear plain light colored background ",
        "Taken in full-face view directly facing the camera ",
        "Your full face must be visible, and there must not be any shadow"
        
    ]

    
   var secondlist=[
    "The format of the photo must be in JPEG",
    "The size of the photo must be less than 240 kilobytes (kB)",
    "Photo size: 35x45mm."
    ]


    return ( 
    <div className="container">
        <div className="guide-link">
               <p>
                Your photo is a vital part of our application process. To learn more, Please review the information provided below before submission. 
                The photograph submission must meet specific set criteria for processing by approved authorities. 
                </p>
                <p>The photography must:</p>
                <ListComponent list={istlist} />
            
                <p>Note:</p>
                <ListComponent list={secondlist} />
        </div>
    </div>
     );
}   
 
export default PhotographGuide;