import React from 'react'
import { Modal } from 'react-bootstrap'
import { Input, TargetContext } from '../Common'
import TimeLine from './ActivityLog'
import {ProfileContent} from './BranchDetail'

export default class ContractDetail extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            command: null,
            busy: false,
            profile: null,
            logs: null
        }
    }
    componentWillMount() {
        this.fetchData();
        __app.user.is_admin && this.fetchLogs();
    }
    fetchData() {
        let id = _.get(this.props, 'match.params.id', "");
        this.setState({ busy: true });
        api.get('/application/contract/' + id).then((data) => {
            this.setState({ busy: false, profile: data });
        })
    }
    fetchLogs() {
        let type = _.get(this.props, 'match.params.type', "");
        let id = _.get(this.props, 'match.params.id', "");
        api.get('/application/contract/logs/' + id).then((data) => {
            this.setState({ logs: data });
        });
    }
    downloadAttachments() {
        openWindowWithPost(__app.baseURL + '/api/application/contract/' + this.state.profile.id + '/attachments');
    }
    viewApplication(){
        this.props.history.push({pathname: "/application/"+ (isBranchType(this.state.profile.branch) ? "branch" : "liaison") +"/all/" + this.state.profile.branch_id});
    }
    handleCommandSubmit(command, data) {
        this.setState({ busy: true });
        api.post('/application/contract/' + command + '/' + this.state.profile.id, data)
            .then((res) => {
                this.setState({ busy: false });
                if (res.success) {
                    this.setState({ command: null });
                    if (res.data) {
                        let lookup = __app.LOOKUP.ApplicationStatus;
                        let statusId = res.data.status_id;
                        if (statusId == lookup.APPROVED || statusId == lookup.REJECTED) {
                            this.props.history.push('/application/contract');
                        }
                        else {
                            if (statusId == lookup.SHARED) {
                                this.state.profile.shared_at = res.data.performed_at;
                            }
                            res.data.is_admin = __app.user.is_admin;
                            res.data.is_sh_admin = __app.user.is_sh_admin;
                            this.state.logs.push(res.data);
                            this.forceUpdate();
                        }
                    }

                }
            })
    }
    handleCommandClose() {
        this.setState({ command: null });
    }
    renderCommands() {
        if (!this.state.profile || !this.state.profile.id) {
            return null;
        }
        let lookup = __app.LOOKUP.ApplicationStatus;
        let statusId = _.get(this.state.profile, 'status_id');
        if (statusId == lookup.APPROVED || statusId == lookup.REJECTED || this.state.profile.branch.status_id != lookup.APPROVED || !__app.user.is_admin) {
            // return null;
            return <button type="button" className="btn btn-info" onClick={this.viewApplication.bind(this)}>View Application</button>
        }
        return (
            <React.Fragment>
                <button type="button" className="btn btn-info" onClick={this.viewApplication.bind(this)}>View Application</button>
                {(() => {
                    if ((!statusId || statusId == lookup.NEW) && __app.user.is_admin) {
                        return (
                            <React.Fragment>
                                {__app.user.is_admin ? <button type="button" className="btn btn-success" onClick={() => { this.setState({ command: "approve" }) }}>Approve</button> : null}
                                {__app.user.is_admin ? <button type="button" className="btn btn-light" onClick={() => { this.setState({ command: "reject" }) }}>Reject</button> : null}
                            </React.Fragment>
                        );
                    }
                })()}
                {__app.user.is_admin && !this.state.profile.shared_at ? <button type="button" className="btn btn-primary" onClick={() => { this.setState({ command: "share" }) }}>Send Copy For Information</button> : null}
                {(() => {
                    if (!this.state.logs || this.state.logs.length <= 1) {
                        return <button type="button" className="btn btn-primary" onClick={() => { this.setState({ command: "comment" }) }}>Add Comment</button>
                    }
                })()}
            </React.Fragment>
        );
    }
    render() {
        let data;
        if(this.state.profile){
            let {branch, partner_companies, ...contract} = this.state.profile;
            branch.contract = contract;
            branch.partner_companies = partner_companies;
            data = branch;
        }
        
        return (
            <React.Fragment>
                <div className={`col p3040${this.state.busy ? " busy" : ""}`}>
                    <div className="widget widget-data">
                        <div className="widget-inner">
                            <div className="data-heading">
                                <div className="d-flex">
                                    <div className="mr-auto">
                                        <h5>CONTRACT DETAILS
                                            {(() => {
                                                if (_.get(this.state.profile, 'status_id', '') === __app.LOOKUP.ApplicationStatus.APPROVED) {
                                                    return <span className="badge badge-success">Approved</span>
                                                }
                                                if (_.get(this.state.profile, 'status_id', '') === __app.LOOKUP.ApplicationStatus.REJECTED) {
                                                    return <span className="badge badge-danger">Rejected</span>
                                                }
                                            })()}
                                            </h5>
                                    </div>
                                    <div className="ml-auto">
                                        {this.renderCommands()}
                                    </div>
                                </div>
                            </div>
                            <ProfileContent profile={data} contractOnly={true} expanded="contract" />
                            <div className="data-heading">
                                <div className="d-flex">
                                    <div className="ml-auto">
                                        {this.renderCommands()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {this.state.command ? <CommandModal command={this.state.command} onSubmit={this.handleCommandSubmit.bind(this)} onClose={this.handleCommandClose.bind(this)} /> : null}
                </div>
                {(() => {
                    if (this.state.logs && this.state.logs.length > 1) {
                        return (
                            <div className="col widget widget-activity">
                                <div className="admin-activity">
                                    <div className="activity-action">
                                        <div className="d-flex">
                                            <div className="mr-auto">
                                                <h4>APPLICATION ACTIVITY</h4>
                                            </div>
                                            <div className="ml-auto">
                                                <button className="btn btn-primary" onClick={() => { this.setState({ command: "comment" }) }}>Add Comments</button>
                                            </div>
                                        </div>
                                    </div>
                                    <TimeLine logs={this.state.logs} />
                                </div>
                            </div>
                        );
                    }
                })()}
            </React.Fragment>
        );
    }
}

class CommandModal extends React.Component {
    constructor(...args) {
        super(...args);
        this.state = {
            model: {
                comments: ""
            }
        };
        this.input = React.createRef();
    }
    close() {
        this.props.onClose();
    }
    submit() {
        this.setState({ busy: true });
        this.props.onSubmit(this.props.command, this.state.model, {
            error: (err) => {
                this.setState({ errors: err });
            }
        });
    }
    componentDidMount() {
        if (this.props.command == 'circulate') {
            this.fetchRoles();
        }
    }
    fetchRoles() {
        this.setState({ busy: true });
        api.get('/role').then((data) => {
            this.setState({ roles: data, busy: false });
        });

    }
    title() {
        switch (this.props.command) {
            case 'share': return 'Send Copy For Information';
            case 'reject': return 'Application Rejected';
            case 'approve': return 'Application Approved';
            case 'comment': return 'Application Comments';
        }
        throw new Error('Unknow command "' + this.props.command + '"');
    }
    render() {
        let props = this.props, command = props.command;
        return (
            <Modal show onHide={this.close.bind(this)} onShow={() => { this.input.current.focus() }} className={"command " + command} size="lg" backdrop="static">
                <div className="modal-header">
                    <h4 className="modal-title">{this.title()}</h4>
                    {/* <!-- <button type="button" className="close" data-dismiss="modal">&times;</button> --> */}
                </div>
                <TargetContext.Provider value={this}>
                    <div className="modal-body">
                        {command == 'circulate' ? renderRoles.call(this) : null}
                        <div className="form-group">
                            <label htmlFor="comment-approve">{command == "reject" ? "Please write reason of rejection" : "Comments"}</label>
                            <div className="">
                                <Input as="textarea" eref={this.input} placeholder="Type your comments here" name="comments" className="form-control" rows="5" />
                            </div>
                        </div>
                    </div>
                </TargetContext.Provider>

                <div className="modal-footer">
                    <div className="mr-auto">
                        <button type="button" className={`btn btn-primary${this.state.busy ? " busy" : ""}`} onClick={this.submit.bind(this)} disabled={!this.state.model.comments.trim() || this.state.busy || (command == 'circulate' && _.isEmpty(this.state.model.role))}>Submit</button>
                    </div>
                    <div className="ml-auto">
                        <button type="button" className="btn btn-light" onClick={this.close.bind(this)}>Close</button>
                    </div>
                </div>
            </Modal>
        );
    }
}
