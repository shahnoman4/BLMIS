import React from 'react'

export default class TimeLine extends React.Component{
    downloadAttachments(logId) {
        openWindowWithPost(__app.baseURL + '/api/application/log/' + logId + '/attachments');
    }
    render(){
        let {logs} = this.props;
        let lookup = __app.LOOKUP.ApplicationStatus;
        if(_.isEmpty(logs)){
            return null;
        }
        return(
        <React.Fragment>
            {_.isArray(logs) && logs.map((item, key)=>{
                let meta = logMeta(item);
                item.status_id == lookup.COMMENTED
                console.log("status =>", item.status_id);
                console.log("item =>",item);
                console.log("meta =>",meta);
                return(
                    <div className="activity-nodes" key={key}>
                        <div className="row flex-d">
                            {(()=>{
                                if(item.is_admin){
                                    return(
                                    <div className="col activity-image admin">
                                        <i className="fas fa-user"></i>
                                    </div>
                                    );
                                }
                                else if(item.is_sh_admin){
                                    return(
                                    <div className="col activity-image">
                                        <i className="fas fa-user"></i>
                                    </div>
                                    );
                                }
                                else{
                                    return(
                                    <div className="col activity-image admin">
                                        <img src={asset('media/company_logo.png')} alt="img" />
                                    </div>
                                    );
                                }
                            })()}

                            {(() => {
                                    if (item.is_sh_admin && item.status_id==6) {
                                      return (
                                       <div className="col activity-content">
                                            <h5 className="font-weight-bold text-primary" title={item.is_sh_admin ? item.user_name : ''}>{item.is_admin ? "Admin" : (item.is_sh_admin ? ("Stakeholder (" + item.user_name + ")") : item.org_name)}</h5>
                                            <p className={meta.textClass}>Application recommended for branch/liaison office permission.</p>
                                            {!_.isEmpty(item.attachments) ? <div className="download-attachments"><span className="link" onClick={()=>{this.downloadAttachments(item.id)}} title="Download Attachments"><span className="fa fa-download text-dark"></span></span></div> : null}
                                            <time title={date.format(item.performed_at, 'MMM, DD Y hh:mm A')}>{date.format(item.performed_at, 'MMM, DD Y hh:mm A')}</time>
                                        </div>
                                      )
                                    }else if (item.is_sh_admin && item.status_id==7) {
                                      return (
                                       <div className="col activity-content">
                                            <h5 className="font-weight-bold text-primary" title={item.is_sh_admin ? item.user_name : ''}>{item.is_admin ? "Admin" : (item.is_sh_admin ? ("Stakeholder (" + item.user_name + ")") : item.org_name)}</h5>
                                            <p className={meta.textClass}>Application not recommended for branch/liaison office permission.</p>
                                            {!_.isEmpty(item.attachments) ? <div className="download-attachments"><span className="link" onClick={()=>{this.downloadAttachments(item.id)}} title="Download Attachments"><span className="fa fa-download text-dark"></span></span></div> : null}
                                            <time title={date.format(item.performed_at, 'MMM, DD Y hh:mm A')}>{date.format(item.performed_at, 'MMM, DD Y hh:mm A')}</time>
                                        </div>
                                      )
                                    }  else {
                                      return (
                                            <div className="col activity-content">
                                                <h5 className="font-weight-bold text-primary" title={item.is_sh_admin ? item.user_name : ''}>{item.is_admin ? "Admin" : (item.is_sh_admin ? ("Stakeholder (" + item.user_name + ")") : item.org_name)}</h5>
                                                <p className={meta.textClass}>{item.status_id == lookup.COMMENTED ? item.comments : lang('action.' + item.entity_type + '.' + item.status_id + (meta.section ? ("." + meta.section) : ""))}</p>
                                                {!_.isEmpty(item.attachments) ? <div className="download-attachments"><span className="link" onClick={()=>{this.downloadAttachments(item.id)}} title="Download Attachments"><span className="fa fa-download text-dark"></span></span></div> : null}
                                                <time title={date.format(item.performed_at, 'MMM, DD Y hh:mm A')}>{date.format(item.performed_at, 'MMM, DD Y hh:mm A')}</time>
                                            </div>
                                      )
                                    }
                            })()}
                            
                        </div>
                        
                        {(()=>{
                            if(item.status_id !== lookup.COMMENTED && item.comments){
                                return (
                                <div className="row flex-d">
                                    <div className={"col activity-image " + meta.iconClass}>
                                        {meta.image ? <img src={asset('media/' + meta.image)}  alt="img" /> : (meta.icon ? <i className={meta.icon}></i> : null)}
                                    </div>
                                    <div className="col activity-content">
                                        <p>{item.comments}</p>
                                    </div>
                                </div>
                                );
                            }
                        })()}
                    </div>
                );
            })}
        </React.Fragment>
        );

    }
}

function logMeta(log){
    let lookup = __app.LOOKUP.ApplicationStatus;
    if(log.status_id == lookup.APPROVED){
        return {
            iconClass: "approve",
            textClass: "text-success",
            image: "check.png"
        }
    }
    if(log.status_id == lookup.REJECTED){
        return {
            iconClass: "reject",
            textClass: "text-danger",
            image: "reject.png"
        }
    }
    if(log.status_id == lookup.CIRCULATED){
        return {
            iconClass: "circulate",
            textClass: "",
            icon: "fas fa-comment"
        }
    }
    if(log.status_id == lookup.UPDATED){
        return {
            section: _.get(log, 'payload.section') || 'all'
        };
    }
    return {

    };
}