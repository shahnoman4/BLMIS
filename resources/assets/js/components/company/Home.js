import React from "react";
import Detail from './profile/CompanyDetails'
import Contact from './profile/Contact'
import PO from './profile/PO'
import Director from './profile/Director'
import api from '../../config/app'
import {DataContext, Redirect} from '../Common'
import { isBranch } from "../../helper/common";

export default class Home extends React.Component {
    constructor(props){
        super(props);
        this.state = {busy: false};
    }
    addBranch(){
        this.props.history.push('/branch/apply')
    }
    renewBranch(){
        this.props.history.push('/branch/renew')
    }
    convertBranch(){
        this.props.history.push('/branch/convert')
    }
    reviewBranch(){
        this.setState({busy: true});
        api.post('/branch/' + this.profile.branch.id + '/review').then((res)=>{
            this.setState({busy: false});
            if(res.success){
                this.profile.branch.attempts += 1;
                this.profile.branch.locked = true;
                this.profile.branch.status_id = res.data.status_id;
                notify.success('Application submitted for review.');
                this.props.history.push('/branch');
            }
            else if(res.message){
                notify.error(res.message);
            }
        });
    }
    render() {
        return (
            <DataContext.Consumer>
                {(profile)=>{
                    this.profile = profile;
                    if(profile.status_id === __app.LOOKUP.ApplicationStatus.NEW){
                        return(
                        <div className="alert alert-warning" role="alert">
                            <p>Dear { profile.contact.full_name }</p>
                            <p>Your application for company registration under process.</p>
                        </div>
                        );
                    }
                    else if(profile.status_id === __app.LOOKUP.ApplicationStatus.APPROVED){
                        if(!profile.branch){
                            if(profile.was_permitted){
                                //company already has permission letter
                                //show renewal message but take user to new branch page and then redirect to renew page
                                return(
                                <React.Fragment>
                                    <div className="alert alert-warning" role="alert">
                                        <p>Greetings</p>
                                        <p>Please choose below to renew your Branch/Liaison permission.</p>
                                    </div>
                                    <button className='btn btn-success' onClick={this.addBranch.bind(this)}>RENEW BRANCH/LIAISON PERMISSION</button>
                                </React.Fragment>
                                );

                            }
                            return(
                            <React.Fragment>
                                <div className="alert alert-warning" role="alert">
                                    <p>Dont have any permission yet?</p>
                                    <p>Please choose below to continue Branch/Liaison permission.</p>
                                </div>
                                <button className='btn btn-success' onClick={this.addBranch.bind(this)}>APPLY FOR BRANCH/LIAISON PERMISSION</button>
                            </React.Fragment>
                            );
                        }
                        if(profile.branch.status_id === __app.LOOKUP.ApplicationStatus.PAYMENT_PENDING){
                            return <Redirect to='/branch/renew' />
                        }
                        if(profile.branch.status_id === __app.LOOKUP.ApplicationStatus.REVERTED){
                           return( 
                            <React.Fragment>
                                <div className="alert alert-warning" role="alert">
                                    <p>Greetings</p>
                                    <p className="text-info">Your application for {isBranch(profile.branch) ? 'Branch' : 'Liaison'} permission has been reverted.</p>
                                    <p>Please choose below to review your application for {isBranch(profile.branch) ? 'Branch' : 'Liaison'} permission and submit again.</p>
                                </div>
                                <button className={'btn btn-primary' + (this.state.busy ? ' busy' : '')} disabled={this.state.busy} onClick={()=>{
                                    this.props.history.push('/branch')
                                }}>REVIEW {isBranch(profile.branch) ? 'BRANCH' : 'LIAISON'} APPLICATION</button>
                            </React.Fragment>
                           );
                        }
                        else if(profile.branch.status_id === __app.LOOKUP.ApplicationStatus.APPROVED){
                            return(
                            <React.Fragment>
                                <div className="alert alert-warning" role="alert">
                                    <p>Greetings</p>
                                    <p>Please choose below to renew your {isBranch(profile.branch) ? 'Branch' : 'Liaison'} permission.</p>
                                </div>
                                <div className='row'>
                                    <div className='col-sm-auto'>
                                        <button className='btn btn-success' onClick={this.renewBranch.bind(this)}>RENEW {isBranch(profile.branch) ? 'BRANCH' : 'LIAISON'} PERMISSION</button>
                                    </div>
                                    <div className='col-sm-auto'>
                                        <button className='btn btn-primary' onClick={this.convertBranch.bind(this)}>CONVERT TO {isBranch(profile.branch) ? 'LIAISON' : 'BRANCH'}</button>
                                    </div>
                                </div>
                            </React.Fragment>
                            );
                        }
                        else if(profile.branch.status_id === __app.LOOKUP.ApplicationStatus.REJECTED){
                            if(profile.branch.attempts > 1){
                                return (
                                <div className="alert alert-warning" role="alert">
                                    <p>Greetings</p>
                                    <p className="text-danger">Your application for {isBranch(profile.branch) ? 'Branch' : 'Liaison'} permission could not be approved.</p>
                                </div>
                                );
                            }
                            return(
                            <React.Fragment>
                                <div className="alert alert-warning" role="alert">
                                    <p>Greetings</p>
                                    <p className="text-danger">Your application for {isBranch(profile.branch) ? 'Branch' : 'Liaison'} permission could not be approved.</p>
                                    <p>Please choose below to submit your application for {isBranch(profile.branch) ? 'Branch' : 'Liaison'} permission for review.</p>
                                </div>
                                <button className={'btn btn-success' + (this.state.busy ? ' busy' : '')} disabled={this.state.busy} onClick={this.reviewBranch.bind(this)}>SUBMIT {isBranch(profile.branch) ? 'BRANCH' : 'LIAISON'} APPLICATION FOR REVIEW</button>
                            </React.Fragment>
                            );
                        }
                        else{
                            return (
                                <div className="alert alert-warning" role="alert">
                                    <p>Greetings</p>
                                    <p>Your application for {isBranch(profile.branch) ? 'Branch' : 'Liaison'} office permission is in progress.</p>
                                </div>
                            );
                        }
                    }
                    else if(profile.status_id === __app.LOOKUP.ApplicationStatus.REJECTED){
                        return (
                            <div className="alert alert-warning" role="alert">
                                <p className="text-danger">Your application for company registration is rejected.</p>
                            </div>
                        );
                    }
                }}
            </DataContext.Consumer>
        );
    }
}