import React from 'react'
import {Validateable, Input, ContextForm} from '../Common'
import Grid from '../Grid'
import { notify } from '../../helper/common';

let statuses = __app.LOOKUP.ProfileStatus.data;

export default class DataGrid extends React.Component{
    constructor(...args){
        super(...args);
        this.state = {
            currentModel: null, // currently in edit mode
            data: []
        };
        this.options = {
            grid: {
                read: this.fetchData.bind(this),
                table: {props: {className: "table table-striped"}},
                thead: {props: {className: "thead-dark"}},
                th: {props: {scope: "col"}},
                columns: [
                    // {field: "id", title: "SR.#"},
                    {field: "full_name", title: "USER NAME"},
                    {field: "email", title: "EMAIL"},
                    {field: "role.name", title: "ROLE"},
                    {
                        field: "status_id", title: "STATUS", values: statuses
                    },
                    {
                        title: "ACTIONS", template: (vlaue, data)=>{
                            let history = this.props.history;
                            return (
                                <React.Fragment>
                                <button className="btn btn-outline-primary" onClick={()=>{
                                    this.setState({currentModel: data});
                                }}>Edit</button>

                                </React.Fragment>
                            );
                        }
                    },
                ]
            }
        };
    }
    componentDidMount(){
        this.fetchData();
    }
    fetchData(params){
        this.setState({busy: true});
        api.get('/user', {params: params}).then((data)=>{
            this.setState({data, busy: false});
        });
    }
    render(){
        if(this.state.currentModel){
            return <UserForm
                model={this.state.currentModel}
                onBack={()=>{
                    this.setState({currentModel: null});
                    document.getElementById("app").scrollTo(0, 0);
                }}
                onUpdate={()=>{this.setState({currentModel: null})}}
            />
        }
        return(
            <div className="col p3040">
                <div className={"widget widget-data" + (this.state.busy ? " busy" : "")}>
                    <div className="widget-inner">
                        <div className="data-heading">
                            <div className="d-flex">
                                <div className="mr-auto">
                                    <h5>ALL USERS</h5>
                                </div>
                                <div className="ml-auto">
                                    <select className="custom-select" onChange={(e)=>{this.grid.filter({status: e.target.value})}} style={{minWidth: 130}}>
                                        <option value='all'>All</option>
                                        <option value='active'>Active</option>
                                        <option value='blocked'>Blocked</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="data-table">
                            <Grid options={this.options.grid} data={this.state.data} init={(grid)=>{this.grid = grid;}} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

export class UserForm extends Validateable{
    constructor(...args){
        super(...args);
        this.state = {
            busy: false,
            model: this.props.model || {},
            roles: []
        };
        this.pristine = _.cloneDeep(this.props.model);
    }
    submit(){
        this.setState({busy: true});
        api[this.state.model.id ? 'put' : 'post']('/user' + (this.state.model.id ? '/' + this.state.model.id : ''), this.state.model).then((res)=>{
            this.setState({busy: false});
            if(res.success){
                this.state.model.password = "";
                this.setState({errors: null});
                if(!this.state.model.id){
                    notify.success('User created successfully.');
                    this.props.onCreate && this.props.onCreate(res.data);
                    this.setState({model: {}});
                }
                else{
                    notify.success('User updated successfully.');
                    this.props.onUpdate && this.props.onUpdate(res.data);
                }
            }
            else{
                this.setState({errors: res.errors});
                $('.is-invalid:first').focus();
            }
        });
    }
    cancel(){
        _.forEach(this.pristine, (val, key)=>{
            this.state.model[key] = val;
        });
        this.props.onBack();
    }
    componentDidMount(){
        api.get('/role').then((data)=>{
            let roles = data.map((item)=>{
                return {text: item.name, value: item.id};
            });
            this.setState({roles});
        });
    }
    render(){
        return(
            <ContextForm target={this}>
            <div className="col p3040">
                <div className="widget widget-data">
                    <div className="widget-inner">
                        <div className="data-heading">
                            <div className="d-flex">
                                <div className="mr-auto">
                                    <h5>{this.state.model.id ? "EDIT USER" : "ADD NEW USER"}</h5>
                                </div>
                            </div>
                        </div>
                        <div className="admin-form">
                            <div className="row">
                                <div className="col">
                                    <div className="form-group">
                                        <label htmlFor="user-full-name">Full Name</label>
                                        <div className="">
                                            <Input type="text" id="user-full-name" autoComplete="off" name="full_name" className="form-control required" placeholder="@Full Name" />

                                        </div>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="form-group">
                                        <label htmlFor="user-u-name">User Name</label>
                                        <div className="">
                                            <Input type="text" id="user-u-name" autoComplete="off" name="user_name" className="form-control required" placeholder="@User Name" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className="form-group">
                                        <label htmlFor="user-email">Email</label>
                                        <div className="">
                                            <Input type="text" id="user-email" autoComplete="off" name="email" className="form-control required" placeholder="@Email" />
                                        </div>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="form-group">
                                        <label htmlFor="user-u-name">Password</label>
                                        <div className="">
                                            <Input type="password" id="user-password" autoComplete="off" name="password" className="form-control required" placeholder="@password" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className="form-group">
                                        <label htmlFor="user-status">Status</label>
                                        <div className="">
                                            <Input as='select' dataType="number" data={statuses} className="custom-select form-control" id="user-status" name="status_id">
                                                <option value="">Select</option>
                                            </Input>
                                        </div>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="form-group">
                                        <label htmlFor="group-status">Select Role</label>
                                        <div className="">
                                            <Input as='select' dataType="number" data={this.state.roles} className={"custom-select form-control" + (_.isEmpty(this.state.roles ? " busy" : ""))} id="user-role" name="role_id">
                                                <option value="">Select</option>
                                            </Input>
                                            {_.isEmpty(this.state.roles) ? <small className="form-text text-danger">Please make sure that at least one role exists</small> : null}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="form-footer">
                                <div className="form-group">
                                    {this.state.model.id ? <button className="btn btn-light" onClick={this.cancel.bind(this)}><i className="fa fa-back"></i> Back</button> : null}
                                    <button className={"btn btn-primary" + (this.state.busy ? " busy" : "")} disabled={this.state.busy} onClick={this.submit.bind(this)}>{this.state.model.id ? "Update User" : "Create User"}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        
            </ContextForm>
        );
    }
}