import React from 'react'
import { Validateable, Input, ContextForm, DataContext, Redirect } from '../../Common.js'
import api from '../../../config/app.js';
import Section1 from './profile/Section1'
import Section1_1 from './profile/Section1_1'
import Section2 from './profile/Section2'
import Section3 from './profile/Section3'
import Section4 from './profile/Section4'
// import Section5 from './profile/Section5'
import Section6 from './profile/Section6'
import Section7 from './profile/Section7'
import Section8 from './profile/Section8'
import TimeLine from '../ActivityLog'
import { ProfileContent as ReadOnlyProfile } from '../../admin/BranchDetail'
import Error from '../../HttpError';
import { isMainBranch, isSubBranch, isSubLiaison, isBranchType, isLiaisonType, isBranch } from '../../../helper/common.js';
let ServiceType = __app.LOOKUP.ServiceType;

export default class BranchApplication extends React.Component {
    constructor(...args) {
        super(...args);
        this.state = {
            busy: false
        }
        this.onUpdate = this.onUpdate.bind(this);
    }
    getLogs(id) {
        api.get('/branch/logs' + (id ? '/' + id : '')).then((data) => {
            this.setState({ logs: data });
        })
    }
    getProfile(id) {
        this.setState({ busy: true });
        api.get('/branch/' + id).then((data) => {
            if (isSubBranch(data, true)) {
                let subBranchInfo = {};
                _.forEach(data, (val, key) => {
                    if (val !== null) {
                        subBranchInfo[key] = val;
                    }
                });
                data = _.cloneDeep(this.company.branch);
                data = { ...data, ...subBranchInfo };
            }
            this.setState({ busy: false, profile: data });
        });
    }
    reviewBranch(){
        this.setState({busy: true});
        api.post('/branch/' + this.state.profile.id + '/review').then((res)=>{
            this.setState({busy: false});
            if(res.success){
                this.state.profile.attempts += 1;
                this.state.profile.locked = true;
                this.state.profile.status_id = res.data.status_id;
                notify.success('Application submitted for review.');
                this.forceUpdate();
            }
            else if(res.message){
                notify.error(res.message);
            }
        });
    }
    onComment(log) {
        log.org_name = this.company.name;
        this.state.logs.push(log);
        this.setState({ logs: this.state.logs });
    }
    onUpdate(log) {
        if (log) {
            notify.success('Application for branch permission is updated successfully.');
            this.state.profile.locked = true;
            if(this.state.profile.status_id === __app.LOOKUP.ApplicationStatus.REVERTED){
                this.state.profile.status_id = __app.LOOKUP.ApplicationStatus.NEW;
            }
            this.state.profile.status_id = true;
            log.org_name = this.company.name;
            this.state.logs.push(log);
            this.setState({ logs: this.state.logs });
        }
        else{
            notify.info('No modificaton detected.');
        }
    }
    componentDidMount() {
        if(this.props.preview){
            return;
        }
        if (!this.state.profile || this.state.profile.status_id !== __app.LOOKUP.ApplicationStatus.PAYMENT_PENDING) {
            let id = _.get(this.props, 'match.params.id', "");
            if (id) {
                this.getProfile(id);
            }
            if(this.company.branch || id){
                this.getLogs(id);
            }
        }
    }

    downloadPdf(){ 
        let getOrigin =  window.location.origin;
        let url = getOrigin+''+__app.baseURL+'/application/pdfBranch/'+this.state.profile.id;
        window.location.href = url;
    }
    parseProfile(data) {
        if (!data) {
            return null;
        }
        if (this.props.subBranch || isSubBranch(data, true)) {
            let subBranchInfo = {};
            _.forEach(data, (val, key) => {
                if (val !== null) { 
                    subBranchInfo[key] = val;
                }
            });
            data = _.cloneDeep(this.company.branch);
            data = { ...data, ...subBranchInfo };
            if (!data.company) { 
                data.company = this.company;
            }
        }
        else { 
            data =  _.cloneDeep(data);
        }
        let { local_contact, local_sponsor, agent, partner_companies, investment, contract, contract_history, security_agency, ...rest } = data;
        let { company, ...branch } = rest;
        if (!branch || !branch.id) {
            return null;
        }
        let profile = {
            Branch: branch,
            Company: (() => {
                let { registration_letter, memorandum_article, authority_letter, org_profile } = company;
                return { registration_letter, memorandum_article, authority_letter, org_profile };
            })(),
            LocalContact: (() => {
                let { location, ...rest } = local_contact;
                return { ...rest, Location: location };
            })(),
            LocalSponsor: (() => {
                let { location, ...rest } = local_sponsor;
                return { ...rest, Location: location };
            })(),
            Agent: (() => {
                let { location, ...rest } = agent;
                return { ...rest, Location: location };
            })(),
            PartnerCompanies: (() => {
                let res = [];
                _.forEach(partner_companies, (item) => {
                    res.push((() => {
                        let { location, contact, ...rest } = item;
                        return { ...rest, Location: location, Contact: contact };
                    })());
                });
                return res;
            })(),
            Investment: investment,
            Contract: contract,
            SecurityAgency: (() => {
                if (!security_agency) return { security_required: 0 };
                let { contact, ...agency } = security_agency;
                agency.security_required = branch.security_required;
                return {
                    ...agency, Contact: (() => {
                        let { location, ...rest } = contact;
                        return { ...rest, Location: location };
                    })()
                };
            })()
        };
        console.log("PROFILE JS 172-->",profile);
        return profile;

    }
    parseModel(data) {
        if (!data) {
            return null;
        }
        if (this.props.subBranch || isSubBranch(data, true)) {
            let subBranchInfo = data.Branch;
            data = _.cloneDeep(this.company.branch);
            data.company = this.company;
            return { ...data, ...subBranchInfo, service_type_id: isBranch(this.company.branch) ? ServiceType.SUB_BRANCH : ServiceType.SUB_LIAISON };
        }
        else { 
            data =  _.cloneDeep(data);
        }
        let { Branch, LocalContact, LocalSponsor, Agent, PartnerCompanies, Investment, Contract, SecurityAgency, Renewal } = data;
        Branch.security_required = +SecurityAgency.security_required;
        Branch.start_month = +Branch.start_month;
        Branch.service_type_id = +Branch.service_type_id;
        return {
            ...Branch,
            company: this.company,
            local_contact: (() => {
                let { Location, ...rest } = LocalContact;
                return { ...rest, location: Location };
            })(),
            local_sponsor: (() => {
                let { Location, ...rest } = LocalSponsor;
                return { ...rest, location: Location };
            })(),
            agent: (() => {
                Agent.contact_category_id = +Agent.contact_category_id;
                let { Location, ...rest } = Agent;
                return { ...rest, location: Location };
            })(),
            partner_companies: (() => {
                let res = [];
                _.forEach(PartnerCompanies, (item) => {
                    res.push((() => {
                        let { Location, Contact, ...rest } = item;
                        return { ...rest, location: Location, contact: Contact };
                    })());
                });
                return res;
            })(),
            investment: Investment,
            contract: Contract,
            security_agency: (() => {
                let { Contact, ...agency } = SecurityAgency;
                return {
                    ...agency, contact: (() => {
                        if(Contact){
                            let { Location, ...rest } = Contact;
                            return { ...rest, location: Location };
                        }
                    })()
                };
            })(),
            renewal: Renewal
        };

    }
    render() {
        let id = _.get(this.props, 'match.params.id', "");
        return (
            <DataContext.Consumer>
                {(company) => {
                    let canAddContract;
                    let canSubmitForReview;
                    this.company = company;
                    let ApplicationStatus = __app.LOOKUP.ApplicationStatus;
                    if(this.props.preview){
                        return <ReadOnlyProfile profile={this.parseModel(this.props.application)} collapseAll={true} />;
                    }
          
                    if (!company.branch && !id) {
                        return <Redirect to='/' />;
                    }
                    let { branch, ...rest } = company;
                    if (!id) {
                        this.state.profile = branch;
                    }
                    let profile = this.state.profile;
                    if (profile && profile.status_id === __app.LOOKUP.ApplicationStatus.PAYMENT_PENDING) {
                        return <Redirect to={'/branch/fees/' + profile.id} />
                    }
                    if (profile) {
                        profile.company = rest;
                        this.formData = this.parseProfile(profile);
                        if (!this.formData) {
                            return <Error />;
                        }
                        if (isBranch(profile)) {
                            if (profile.status_id == __app.LOOKUP.ApplicationStatus.APPROVED) {
                                canAddContract = true;
                            }
                        }
                        else if(isSubBranch(profile) || isSubLiaison(profile)){
                            if (profile.status_id == __app.LOOKUP.ApplicationStatus.REJECTED && profile.attempts < 2) {
                                canSubmitForReview = true;
                            }
                        }
                    }
                    return (
                        <div className={this.state.busy ? "busy" : ""}>
                            <div className="widget info-table">
                                <div className="d-flex">
                                    <div className="col font-weight-bold">Company Name</div>
                                    <div className="col">{_.get(company, 'name')}</div>
                                    <div className="col font-weight-bold">Status</div>
                                    <div className="col">{__app.LOOKUP.text('ApplicationStatus', _.get(profile, 'status_id'))}</div>
                                </div>
                                <div className="d-flex">
                                    <div className="col font-weight-bold">Permission Validity</div>
                                    <div className="col">{_.padStart(_.get(profile, 'start_month', ''), 2, '0') + '/' + (+_.get(profile, 'start_year', '') + +_.get(profile, 'permission_period', ''))}</div>
                                    <div className="col font-weight-bold">Contract Period</div>
                                    <div className="col">{_.get(profile, 'contract.valid_for_years', '0')} years</div>
                                </div>
                            </div>
                            <div className="widget company-action">
                                {canAddContract ? <button className="btn btn-outline-primary" onClick={() => { this.props.history.push('/branch/' + profile.id + '/add-contract') }}>Add New Contract</button> : null}
                                {canSubmitForReview ? <button className="btn btn-outline-primary" onClick={this.reviewBranch.bind(this)}>Submit Application For Review</button> : null}

                            <button  onClick={this.downloadPdf.bind(this)} type="button" className="btn btn-outline-danger float-right"><i className="far fa-file-pdf"></i></button>    
                            </div>
                            <ul className="nav nav-tabs">
                                <li className="nav-item"><a className="active show" data-toggle="tab" href="#profile_edit" role="tab">Branch Information</a></li>
                                {isBranch(profile || {}) ? <li className="nav-item"><a data-toggle="tab" href="#profile-contracts" role="tab">Contract History</a></li> : null}
                                <li className="nav-item"><a data-toggle="tab" href="#profile-activity" role="tab">Application Activity</a></li>
                            </ul>




                            {profile ? (<div className="tab-content">
                                <div className={"tab-pane active" + ((profile.locked || profile.status_id == ApplicationStatus.APPROVED) ? " locked" : "")} id="profile_edit">
                                    {(profile.locked || profile.status_id == ApplicationStatus.APPROVED || (profile.status_id == ApplicationStatus.REJECTED && profile.attempts >= 2)) ? <ReadOnlyProfile profile={profile} collapseAll={true} /> : renderDetailContent.call(this, profile, company)}
                            
                                </div>
                                {isBranch(profile) ? (<div className="tab-pane" id="profile-contracts">
                                    {renderContractHistory.call(this, profile)}
                                </div>) : null}

                                <div className="tab-pane" id="profile-activity">
                                    {!id || profile ? <TimeLine logs={this.state.logs} onComment={this.onComment.bind(this)} commentable={true} postURL={'/branch/comment/' + profile.id} /> : null}
                                </div>
                            </div>) : null}

                        </div>
                    );
                }}
            </DataContext.Consumer>
        );
    }
}

function renderContractHistory(profile) {
    return (
        <div className="data-table data-details">
            <table className="table table-striped table-hover">
                {/* <thead>
                    <tr>
                        <th>SR.#</th>
                        <th>Contract Name</th>
                    </tr>
                </thead> */}
                <tbody>
                {(profile.contract_history || []).map((item, key) => {
                    return (
                        <tr key={key}>
                        {/*<td>{item.id}</td>*/}
                        <td>Contract Year {item.defect_start_year} - {item.defect_end_year}</td>
                        <td>
                            <button
                                className="btn btn-outline-primary float-right"
                                onClick={()=>{
                                    openWindowWithPost(__app.baseURL + '/api/application/contract/' + item.id + '/attachments');
                                }}
                            >Download</button>
                            {item.status_id == __app.LOOKUP.ApplicationStatus.APPROVED ? (<button
                                className="btn btn-outline-info float-right mr-3"
                                onClick={()=>{
                                    this.props.history.push('/extend-contract', {contractId: item.id});
                                }}
                            >Extend</button>) : null}
                        </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>

        </div>
    );
}


function renderDetailContent(profile, company) {
    return (
        <div id="accordion">
            <div className="card">
                <div className="card-header">
                    <a className="collapsed card-link" data-toggle="collapse" href="#collapseOne">
                        Business Information
                    </a>
                </div>
                <div id="collapseOne" className="collapse" data-parent="#accordion">
                    <div className="card-body"><Section1 model={this.formData} onUpdate={this.onUpdate} /></div>
                </div>
            </div>
            <div className="card">
                <div className="card-header">
                    <a className="collapsed card-link" data-toggle="collapse" href="#collapseOne_one">
                        Company's Local Sponsor
                    </a>
                </div>
                <div id="collapseOne_one" className="collapse" data-parent="#accordion">
                    <div className="card-body"><Section1_1 model={this.formData} onUpdate={this.onUpdate} /></div>
                </div>
            </div>
            <div className="card">
                <div className="card-header">
                    <a className="collapsed card-link" data-toggle="collapse" href="#collapseTwo">
                        Contractee Information
                </a>
                </div>
                <div id="collapseTwo" className="collapse" data-parent="#accordion">
                    <div className="card-body"><Section2 model={this.formData} onUpdate={this.onUpdate} company={company} /></div>
                </div>
            </div>
            <div className="card">
                <div className="card-header">
                    <a className="collapsed card-link" data-toggle="collapse" href="#collapseThree">
                        Agent Information
                </a>
                </div>
                <div id="collapseThree" className="collapse" data-parent="#accordion">
                    <div className="card-body"><Section3 model={this.formData} onUpdate={this.onUpdate} /></div>
                </div>
            </div>
            {isBranchType(this.formData.Branch) ? (<div className="card">
                <div className="card-header">
                    <a className="collapsed card-link" data-toggle="collapse" href="#collapseFour">
                        Contract Information
                </a>
                </div>
                <div id="collapseFour" className="collapse" data-parent="#accordion">
                    <div className="card-body"><Section4 model={this.formData} onUpdate={this.onUpdate} /></div>
                </div>
            </div>) : null}
            {isBranchType(this.formData.Branch) ? (<div className="card">
                <div className="card-header">
                    <a className="collapsed card-link" data-toggle="collapse" href="#collapseSix">
                        Local Company/ Partner Details
                </a>
                </div>
                <div id="collapseSix" className="collapse" data-parent="#accordion">
                    <div className="card-body"><Section6 model={this.formData} onUpdate={this.onUpdate} /></div>
                </div>
            </div>) : null}
            <div className="card">
                <div className="card-header">
                    <a className="collapsed card-link" data-toggle="collapse" href="#collapseSeven">
                        Investment Information
                </a>
                </div>
                <div id="collapseSeven" className="collapse" data-parent="#accordion">
                    <div className="card-body"><Section7 model={this.formData} onUpdate={this.onUpdate} /></div>
                </div>
            </div>
            <div className="card">
                <div className="card-header">
                    <a className="collapsed card-link" data-toggle="collapse" href="#collapseEight">
                        Security Information
                </a>
                </div>
                <div id="collapseEight" className="collapse" data-parent="#accordion">
                    <div className="card-body"><Section8 model={this.formData} onUpdate={this.onUpdate} /></div>
                </div>
            </div>
        </div>

    );
}