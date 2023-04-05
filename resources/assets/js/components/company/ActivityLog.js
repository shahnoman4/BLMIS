import React from 'react'

import {Input, ContextForm} from '../Common.js'
import api from '../../config/app';

export default class TimeLine extends React.Component{
    constructor(...args){
        super(...args);
        this.state = {
            model: {
                attachments: []
            },
            errors: {},
            busy: false
        }
        this.handleUploads = this.handleUploads.bind(this);
    }
    handleUploads(media){
        _.unset(this.state.model, 'uploads');
        this.state.model.attachments = [media]; 
        this.setState({model: this.state.model});
    }
    postComment(){
        this.setState({busy: true});
        api.post(this.props.postURL, this.state.model).then((res)=>{
            this.setState({busy: false});
            if(res.success){
                this.props.onComment && this.props.onComment(res.data);
                this.setState({model: {attachments: []}});
            }
            else{
                this.setState({errors: res.errors});
            }
        });
    }
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
        <div className="timeline">
            {_.isArray(logs) && logs.map((item, key)=>{
                let meta = logMeta(item);
                return(
                <div className="timeline-nodes" key={key}>
                    <div className={"row no-gutters justify-content-end justify-content-md-around align-items-start" + (item.is_admin ? " reverse" : "")}>
                        <div className="col-10 col-md-5 order-3 order-md-1 timeline-content">
                            <p className="font-weight-bold text-primary">{item.is_admin ? "Admin" : "You (" + item.org_name + ")"}</p>
                            <span className={meta.textClass}>{item.status_id == lookup.COMMENTED ? item.comments : lang('action.' + item.entity_type + '.' + item.status_id + (meta.section ? ("." + meta.section) : ""))}</span>
                            {!_.isEmpty(item.attachments) ? <div className="download-attachments"><span className="link" onClick={()=>{this.downloadAttachments(item.id)}} title="Download Attachments"><span className="fa fa-download text-dark"></span></span></div> : null}
                            <time title={date.format(item.performed_at, 'MMM, DD Y hh:mm A')}>{date.format(item.performed_at, 'MMM, DD Y hh:mm A')}</time>
                        </div>
                        {(()=>{
                            if(item.is_admin){
                                return(
                                <div className="col-2 col-sm-1 px-md-3 order-2 text-md-center">
                                    <div className="timeline-image admin">
                                        <i className="fas fa-user"></i>
                                    </div>
                                </div>
                                );
                            }
                            else{
                                return (
                                <div className="col-2 col-sm-1 px-md-3 order-2 text-md-center">
                                    <div className="timeline-image">
                                        <img src={asset('media/company_logo.png')} className="img-fluid" alt="img" />
                                    </div>
                                </div>
                                );
                            }
                        })()}
                        <div className="col-10 col-md-5 order-1 order-md-3 py-3 timeline-date">
                            &nbsp;
                        </div>
                    </div>
                    {(()=>{
                        if(item.status_id !== lookup.COMMENTED && item.comments){
                            return (
                                <div className={"row no-gutters justify-content-end justify-content-md-around align-items-start" + (item.is_admin ? " reverse" : "")}>
                                    <div className="col-10 col-md-5 order-3 order-md-1 timeline-content">
                                        <span>{item.comments}</span>
                                    </div>
                                    <div className="col-2 col-sm-1 px-md-3 order-2 text-md-center">
                                        <div className={"timeline-image " + meta.iconClass}>
                                            {meta.image ? <img src={asset('media/' + meta.image)}  alt="img" className="img-fluid" /> : (meta.icon ? <i className={meta.icon}></i> : null)}
                                        </div>
                                    </div>
                                    <div className="col-10 col-md-5 order-1 order-md-3 py-3 timeline-date">
                                        &nbsp;
                                    </div>
                                </div>
                            );
                        }
                    })()}
                </div>
                );
            })}
        </div>
        {(()=>{
            if(this.props.commentable){
                return (
                    <ContextForm target={this}>
                    <div className="widget-attach">
                        <div className="row">
                            <div className="col">
                                <div className="form-group">
                                    <Input as="textarea" className="form-control" name="comments" placeholder="Type your comments here..."></Input>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <div className="form-group">
                                    <label htmlFor="attachments">Attachments</label>
                                    <div className="custom-file">
                                        <Input type="file" as="tempUpload" onUpload={this.handleUploads} className="custom-file-input" id="attachments" name="uploads" />
                                        <label className="custom-file-label blank-label" htmlFor="attachments">
                                        { 
                                             (this.state.model.attachments && this.state.model.attachments.length) ?
                                             this.state.model.attachments.map((item, key) => (
                                                  <React.Fragment key={key}>
                                                    {item.filename}
                                                        </React.Fragment>
                                                                ))
                                                                :
                                                                'Choose File'
                                                   }

                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="col">

                            </div>
                        </div>
                        {/* {(()=>{
                            if(this.state.model.attachments && this.state.model.attachments.length){
                                return this.state.model.attachments.map((item, key)=>(
                                    <div className="row" key={key}>
                                        <div className="col">{item.filename}</div>
                                    </div>
                                ));
                            }
                        })()} */}
                        <div className="form-footer">
                            <div className="form-group float-left">
                                <button type="button" className="btn btn-primary" onClick={this.postComment.bind(this)} disabled={this.state.busy}>Submit <i className="fas fa-long-arrow-alt-right"></i></button>
                            </div>
                        </div>
                    </div>
                    </ContextForm>
                );
            }
        })()}
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