import React from 'react'
import {Validateable, Input, ContextForm} from '../Common'
import Grid from '../Grid'

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
                    {field: "id", title: "SR.#"},
                    {field: "name", title: "ROLE NAME"},
                    {field: "group.name", title: "USER GROUP"},
                    {
                        field: "status_id", title: "STATUS", values: statuses, type: "number"
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
        api.get('/role', {params}).then((data)=>{
            this.setState({data, busy: false});
        });
    }
    render(){
        if(this.state.currentModel){
            return <RoleForm
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
                                    <h5>ADD USER GROUPS</h5>
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

export class RoleForm extends Validateable{
    constructor(...args){
        super(...args);
        this.state = {
            busy: false,
            model: this.props.model || {
                authorization_id: __app.LOOKUP.Authorization.SUPER_ADMIN
            }
        };
        this.pristine = _.cloneDeep(this.props.model);
        // this.handleHeaderCheckbox = this.handleHeaderCheckbox.bind(this);
    }
    submit(){
        this.setState({busy: true});
        let {bits, group, ...data} = this.state.model;
        let components = _.get(bits, 'a_' + data['authorization_id']);
        let perms = [];
        _.forEach(components, (bits, key)=>{
            if(!_.isEmpty(bits)){
                perms.push({component_id: +(key.match(/c_([0-9]+)/)[1]), permission_bit: _.sum(bits)});
            }
        });
        data.bits = perms;
        api[this.state.model.id ? 'put' : 'post']('/role' + (this.state.model.id ? '/' + this.state.model.id : ''), data).then((res)=>{
            this.setState({busy: false});
            if(res.success){
                this.setState({errors: null});
                if(!this.state.model.id){
                    notify.success('Role created successfully.');
                    this.props.onCreate && this.props.onCreate(res.data);
                    this.setState({model: {authorization_id: __app.LOOKUP.Authorization.SUPER_ADMIN}});
                }
                else{
                    notify.success('Role updated successfully.');
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
        api.get('/user-group').then((data)=>{
            let groups = data.map((item)=>{
                return {text: item.name, value: item.id};
            });
            this.setState({groups});
        });
        if(this.state.model.id){
            this.setState({busy: true});
            api.get('/role/' + this.state.model.id + '/permissions').then((data)=>{
                this.setState({busy: false});
                let bits = {};
                let perms = bits['a_' + this.state.model.authorization_id] = {};
                _.forEach(data, function(perm){
                    if(!perms['c_' + perm.component_id]){
                        perms['c_' + perm.component_id] = []
                    }
                    _.forEach(__app.permissions, function(item){
                        if(item.bit&perm.permission_bit){
                            perms['c_' + perm.component_id].push(item.bit);
                        }
                    });
                });
                let model = this.state.model;
                model.bits = bits;
                this.setState({model});
            });
        }
    }
    handleHeaderCheckbox(component, e){
        let bits = this.state.model.bits['a_'+this.state.model.authorization_id];
        let checked = e.target.checked;
        if(component.components){
            _.forEach(component.components, (c)=>{
                if(checked){
                    let perms = [];
                    _.forEach(__app.permissions, (p)=>{
                        if((!c.authorization_id || c.authorization_id === this.state.model.authorization_id) && p.bit & c.permission_bit){
                            perms.push(p.bit);
                        }
                    });
                    bits['c_' + c.id] = perms;
                }
                else{
                    bits['c_' + c.id] = [];
                }
            });
        }
    }
    render(){
        let isSA = this.state.model.authorization_id == __app.LOOKUP.Authorization.SUPER_ADMIN;
        return(
        <ContextForm target={this}>
        <div className="col p3040">
            <div className="widget widget-data">
                <div className="widget-inner">
                    <div className="data-heading">
                        <div className="d-flex">
                            <div className="mr-auto">
                                    <h5>{this.state.model.id ? "EDIT ROLE" : "ADD NEW ROLE"}</h5>
                            </div>
                        </div>
                    </div>
                    <div className="admin-form">
                        <div className="row">
                            <div className="col">
                                <div className="form-group">
                                    <label htmlFor="user-role-name">Role name</label>
                                    <div className="">
                                        <Input type="text" id="user-role-name" autoComplete="off" name="name" className="form-control required" placeholder="Chairman" />
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="form-group">
                                    <label htmlFor="role-status">Status</label>
                                    <div className="">
                                        <Input as="select" dataType="number" data={statuses} className="custom-select form-control" id="role-status" name="status_id">
                                            <option value="">Select</option>
                                        </Input>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <div className="form-group">
                                    <label htmlFor="user-role-group">User Group</label>
                                    <div className={(_.isEmpty(this.state.groups) ? "busy" : "")}>
                                        <Input as="select" dataType="number" data={this.state.groups} className="custom-select form-control" id="user-role-group" name="group_id">
                                            <option value="">Select</option>
                                        </Input>
                                        {_.isEmpty(this.state.groups) ? <small className="form-text text-danger">Please make sure that at least one user group exists</small> : null}
                                    </div>
                                </div>
                            </div>
                            <div className="col">&nbsp;
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <label>Select Role</label>
                                {_.get(this.state.errors, 'bits') ? <small className="form-text text-danger is-invalid">{_.get(this.state.errors, 'bits')}</small> : null}
                            </div>
                        </div>
                        
                        
                        <ul className="nav nav-tabs">
                            <li className="nav-item" onClick={()=>{
                                if(this.state.model.authorization_id != __app.LOOKUP.Authorization.SUPER_ADMIN){
                                    this.state.model.authorization_id = __app.LOOKUP.Authorization.SUPER_ADMIN;
                                    this.state.model.bits = [];
                                    this.forceUpdate();
                                }
                                }}>
                                <a className={isSA ? "active show" : ""} data-toggle="tab" href="#user-role-admin" role="tab">Admin</a>
                            </li>
                            <li className="nav-item" onClick={()=>{
                                if(this.state.model.authorization_id != __app.LOOKUP.Authorization.ADMIN){
                                    this.state.model.authorization_id = __app.LOOKUP.Authorization.ADMIN;
                                    this.state.model.bits = [];
                                    this.forceUpdate();
                                }
                                }}>
                                <a className={isSA ? "" : "active show"} data-toggle="tab" href="#user-role-stakeholder" role="tab">Stakeholder</a>
                            </li>
                        </ul>
        
                        <div className="tab-content form-group">
                            {(()=>{
                                let lookup = __app.LOOKUP.Authorization;
                                return [
                                    {authId: lookup.SUPER_ADMIN, tabId: "user-role-admin", active: isSA},
                                    {authId: lookup.ADMIN, tabId: "user-role-stakeholder", active: !isSA}
                                ].map((elem, elemKey)=>(
                                    <div className={"tab-pane" + (elem.active ? " active" : "")} id={elem.tabId} key={elemKey}>
                                        <div id={"accordion-" + elem.tabId} className="accordion accordion-checkbox">
                                            {(()=>{
                                                function renderPermission(component, isNewSection, idx){
                                                    if(isNewSection){
                                                        let props = {className: "card-link collapsed"};
                                                        let collapseId = "collapse-" + component.name + "-" + elem.tabId;
                                                        if(component.components){
                                                            props = {className:"card-link collapsed", 'data-toggle':"collapse", 'data-target':"#" + collapseId};
                                                        }
                                                        return (
                                                        <div className="card" key={idx}>
                                                            <div className="card-header">
                                                                <span {...props}>
                                                                    
                                                                </span>
                                                                <div className="custom-control custom-checkbox">
                                                                        <Input 
                                                                            type="checkbox" as="checkList" dataType="number" name={'bits.a_' + elem.authId +'.c_'+ component.id} className="custom-control-input" value={component.permission_bit || 1} id={'cb-' + collapseId}
                                                                            onChange={this.handleHeaderCheckbox.bind(this, component)}
                                                                         />
                                                                        <label className="custom-control-label" htmlFor={'cb-' + collapseId}>
                                                                            {component.title}
                                                                        </label>
                                                                    </div>
                                                            </div>
                                                            {(()=>{
                                                                if(component.components){
                                                                    return(
                                                                        <div id={collapseId} className="collapse" data-parent={"#accordion-" + elem.tabId}>
                                                                            <div className="card-body">
                                                                                <div className="data-table">
                                                                                    <table className="table table-striped">
                                                                                        <tbody>
                                                                                        {component.components.map((c, idx)=>{
                                                                                            if(!c.authorization_id || c.authorization_id === elem.authId){
                                                                                                return(
                                                                                                    <tr key={idx}>
                                                                                                        <th scope="row">{c.title}</th>
                                                                                                        {(()=>{
                                                                                                            let perms = [];
                                                                                                            _.forEach(__app.permissions, (p)=>{
                                                                                                                if(p.bit & c.permission_bit){
                                                                                                                    perms.push(
                                                                                                                    <td key={p.bit}>
                                                                                                                        <div className="custom-control custom-checkbox  custom-control-inline">
                                                                                                                            <Input type="checkbox" as="checkList" dataType="number" name={'bits.a_' + elem.authId +'.c_'+ c.id} className="custom-control-input" value={p.bit} id={c.name + '-' + p.name} id={'cb-' + elem.tabId + '-' + c.name + '-' + p.name} />
                                                                                                                            <label className="custom-control-label" htmlFor={'cb-' + elem.tabId + '-' + c.name + '-' + p.name}>
                                                                                                                                {p.title}
                                                                                                                            </label>
                                                                                                                        </div>
                                                                                                                    </td>  
                                                                                                                    );
                                                                                                                }
                                                                                                            });
                                                                                                            return perms;
                                                                                                        })()}
                                                                                                    </tr>
                                                                                                );
                                                                                            }
                                                                                        })}
                                                                                        </tbody>
                                                                                    </table>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                }
                                                            })()}
                                                        </div>
                                                        );
                                                    }
                                                }
                                                
                                                return __app.components.map((c, cIdx) => {
                                                    if(!c.authorization_id || c.authorization_id === elem.authId){
                                                        return renderPermission.call(this, c, true, cIdx);
                                                    }
                                                    return null;
                                                });
                                            })()}
                                
                                        </div>
                                    </div>
                                ));
                            })()}
        
                        </div>
                        <div className="form-group">
                            {this.state.model.id ? <button className="btn btn-light" onClick={this.cancel.bind(this)}><i className="fa fa-back"></i> Back</button> : null}
                            <button className={"btn btn-primary" + (this.state.busy ? " busy" : "")} disabled={this.state.busy} onClick={this.submit.bind(this)}>{this.state.model.id ? "Update Role" : "Add Role"}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </ContextForm>
        );
    }
}