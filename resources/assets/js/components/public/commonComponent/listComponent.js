import React from 'react';
const ListComponent = ({list,type}) => {
    console.log(type)
    return (  
        <ul>
            {list.map((t, i) =>
                    t.child ?
                    <React.Fragment key={i}>
                         {
                        t.child.img ? 
                           <React.Fragment>
                               {t.child.img.map((p, i3) => <p key={i3}><img  src={p} /></p>)}
                            </React.Fragment>
                         : 
                         <li key={i}>
                            <ul>
                                {t.child.map((m, i2) => <li key={i2}>{m}</li>)}
                            </ul>
                         </li>
                        }
                    </React.Fragment>:
                     <li key={i}>{t}</li>
             )
            }
        </ul>
    );
}
 
export default ListComponent;