import React from 'react'
import Detail from './profile/CompanyDetails'
import Contact from './profile/Contact'
import PO from './profile/PO'
import Director from './profile/Director'
import api from '../../config/app'
import {DataContext} from '../Common'
import TimeLine from './ActivityLog'
import {ProfileContent as ReadOnlyProfile} from '../admin/SignUpDetail'
import { notify } from '../../helper/common';

export default class Profile extends React.Component{
    constructor(...args){
        super(...args);
        this.state = {
            logs: []
        }
        this.onUpdate = this.onUpdate.bind(this);
    }
    parseProfile(data){
        let {contact, directors, principal_officer, ...rest} = data;
        let profile = {
            Company: rest,
            Contact: (()=>{
                let {location, ...rest} = contact;
                return {Location: location, ...rest};
            })(),
            Directors: directors,
            PO: principal_officer
        };
        return profile;
    }
    onComment(log) {
        log.org_name = this.profile.name;
        this.state.logs.push(log);
        this.setState({ logs: this.state.logs });
    }
    onUpdate(log){
        if(log){
            notify.success('Application for signup is updated successfully.');
            this.profile.locked = true;
            log.org_name = this.profile.name;
            this.state.logs.push(log);
            this.setState({logs: this.state.logs});
        }
    }
    getLogs(){
        api.get('/company/logs').then((data)=>{
            this.setState({logs: data});
        })
    }
    componentDidMount(){
        this.getLogs();
    }
    render(){
        return (
            <DataContext.Consumer>
                {(profile)=>{
                    this.profile = profile;
                    this.formData = this.parseProfile(_.cloneDeep(profile));
                    let ApplicationStatus = __app.LOOKUP.ApplicationStatus;
                    return(
                        <React.Fragment>
                         
                        <ul className="nav nav-tabs">
                            <li className="nav-item"><a className="active" data-toggle="tab" href="#profile_edit" role="tab">Company Information</a></li>
                            <li className="nav-item"><a data-toggle="tab" href="#profile_activity" role="tab">Application Activity</a></li>
                        </ul>
                        <div className="tab-content">
                            <div className={"tab-pane active" + ((this.profile.locked || this.profile.status_id == ApplicationStatus.APPROVED) ? " locked" : "")} id="profile_edit">
                                {(this.profile.locked || this.profile.status_id == ApplicationStatus.APPROVED) ? <ReadOnlyProfile profile={this.profile} collapseAll={true} /> : renderDetailContent.call(this)}

                            <div>
                                <span className="text-muted small">Note: If you want to update your company profile,please raise the request through comment section.</span>
                            </div>

                            </div>
                            <div className="tab-pane" id="profile_activity">
                                <TimeLine logs={this.state.logs} onComment={this.onComment.bind(this)} commentable={true} postURL={'/company/comment'} />
                            </div>
                        </div>
                        </React.Fragment>
                        )
                }}
            </DataContext.Consumer>
        );
    }
}

function  renderDetailContent(){
    return(
    <div id="accordion">
        <div className="card">
            <div className="card-header">
                <a className="card-link collapsed" data-toggle="collapse" href="#org_detail">
                    Foreign Company Details
                </a>
            </div>
            <div id="org_detail" className="collapse" data-parent="#accordion">
                <Detail profile={this.formData} onUpdate={this.onUpdate} />
            </div>
        </div>
        <div className="card">
            <div className="card-header">
                <a className="card-link collapsed" data-toggle="collapse" href="#org_contact">
                    Foreign Company Contact Person
                </a>
            </div>
            <div id="org_contact" className="collapse" data-parent="#accordion">
                <Contact profile={this.formData} onUpdate={this.onUpdate} />
            </div>
        </div>
        <div className="card">
            <div className="card-header">
                <a className="card-link collapsed" data-toggle="collapse" href="#org_po">
                    Principal Officer Information
                </a>
            </div>
            <div id="org_po" className="collapse" data-parent="#accordion">
                <PO profile={this.formData} onUpdate={this.onUpdate} />
            </div>
        </div>
        <div className="card">
            <div className="card-header">
                <a className="card-link collapsed" data-toggle="collapse" href={`#org_director`}>
                    Director Information
                </a>
            </div>
            <div id={`org_director`} className="collapse" data-parent="#accordion">
                {this.formData.Directors.map((director, key)=>{
                    return <Director key={key} profile={{Directors: [director]}} index={key}  onUpdate={this.onUpdate} />
                })}
                {/* <div className="row">
                    <button type="button" className="btn btn-outline-primary">Add Director Information</button>
                </div> */}
            </div>
        </div>
       {/*  <div>
            <span className="text-muted small">Note: If you want to update your company profile,please raise the request through comment section.</span>
        </div> */}
    </div>
    );
}