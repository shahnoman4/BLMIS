import React from 'react'

import {ContextForm, Input} from '../Common'

export default class PasswordReset extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            busy: false,
            model: {},
        };
    }
    submit(){
        this.setState({busy: true});
        api.put('/company/password', this.state.model).then((res)=>{
            this.setState({busy: false});
            if(res.success){
                notify.success('Password updated successfully.');
                this.setState({model: {}, errors: {}});
            }
            else{
                this.setState({errors: res.errors});
            }
        });
    }
    render() {
        return (
            <ContextForm target={this}>
                <div className="needs-validation">
                    {/* <!-- Business Information --> */}
                    <div className="form-group">
                        <h3>Password Reset</h3>
                        <div>
                            <span className="float-left text-muted small">Note: Incomplete form will not be entertained</span>
                            <span className="float-right text-danger small">All fields are required</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-6">
                            <div className="form-group">
                                <label htmlFor="currentPassword">Current Password</label>
                                <div className="">
                                    <Input type="password" id="currentPassword" name="current_password" className="form-control required" placeholder="@Current Password" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-6">
                            <div className="form-group">
                                <label htmlFor="newPassword">New Password</label>
                                <div className="">
                                    <Input type="password" id="newPassword" name="password" className="form-control required" placeholder="@New Password" />
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="form-group">
                                <label htmlFor="reTypePassword">Re-type New Password</label>
                                <div className="">
                                    <Input type="password" id="reTypePassword" name="password_confirmation" className="form-control required" placeholder="@New Password" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="form-footer">
                        <div className="form-group float-right">
                            <button className={"btn btn-primary" + (this.state.busy ? " busy" : "")} disabled={this.state.busy} onClick={this.submit.bind(this)}> UPDATE </button>
                        </div>
                    </div>
                </div>
            </ContextForm>
        );
    }
}