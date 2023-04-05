import React from 'react';
import {Link} from 'react-router-dom'

const GuideList = (props) => {
  const {heading,paragraph,icon,href="#" } = props;
    return ( 
        <div className="help-guide-link">
          <Link  to={href}>
           <div className="icons-wrap">
              <img src={asset(icon)}></img>
            </div>
           <div className="links-content">
              <h2>{heading}</h2>
              <span>{paragraph}</span>
           </div>
         </Link>
    </div>
     );
}
 
export default GuideList;