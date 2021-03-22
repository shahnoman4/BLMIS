import React from 'react'
import {Validateable, Input, ContextForm} from '../../Common.js'
import {block, unblock} from '../../../helper/common.js'
import api from '../../../config/app'


export default class Contact extends Validateable{
    constructor(props){
        super(props);
        this.state = {
            model: {},
            busy: false
        };
        if(props.profile && props.profile.Contact){
			this.state.model.Contact = props.profile.Contact;
        }
        if(!this.state.model.Contact){
            this.state.model.Contact = { };
        }
    }
    submit(){
        this.setState({busy: true});
        api.put('/company', {...this.state.model, section: 'contact'}).then((res)=>{
            this.setState({busy: false});
            if(res.success){
                this.props.onUpdate(res.data.log);
            }
            else{
                this.setState({errors: res.errors});
                $('.is-invalid:first').focus();
            }
        });
    }
    render(){
        return (
		<ContextForm target={this}>
        <div className="card-body">
			<div className="row">
				<div className="col">
					<div className="form-group">
						<label htmlFor="poc_name">Full Name</label>
						<div className="">
							<Input type="text" autoComplete="off" id="poc_name" name="Contact.full_name" className="form-control required" placeholder="@fullName"/>    
						</div>
					</div>
				</div>
				<div className="col">
					<div className="form-group">
						<label htmlFor="poc_email">Email Address</label>
						<div className="">
							<Input type="email" id="poc_email" name="Contact.primary_email" className="form-control required" placeholder="email@domainName.com"/>
						</div>
					</div>
				</div>
			</div>

			<div className="row">
				<div className="col">
					<div className="form-group">
						<label htmlFor="poc_phone">Contact Number</label>
						<div className="">
							<Input type="text" autoComplete="off" id="poc_phone" name="Contact.primary_phone" className="form-control required" placeholder="098265478320"/>
						</div>
					</div>
				</div>
				<div className="col">
					<div className="form-group">
						<label htmlFor="poc_nid">National Card</label>
						<div className="">
							<Input type="text" autoComplete="off" id="poc_nid" name="Contact.nic_no" className="form-control required" placeholder="@National Card Number"/>
						</div>
					</div>
				</div>
			</div>

			<div className="row">
				<div className="col">
					<div className="form-group">
						<label htmlFor="poc_nic_copy">National Card Copy</label>
						<div className="custom-file">
							<Input as="tempUpload" type="file" className="custom-file-input form-control" id="poc_nic_copy" name="Contact.nic_copy" />
							<label className="custom-file-label" htmlFor="poc_nic_copy">{_.get(this.state.model, 'Contact.nic_copy.filename', '')}</label>
						</div>
						
					</div>
				</div>
				<div className="col">
					<div className="form-group">
						<label htmlFor="poc_passport">Passport Number</label>
						<div className="">
							<Input type="text" autoComplete="off" id="poc_passport" name="Contact.passport_no" className="form-control required" placeholder="@National Card Number"/>
						</div>
					</div>
				</div>
			</div>

			<div className="row">
				<div className="col">
					<div className="form-group">
						<label htmlFor="poc_passport_copy">Passport Copy</label>
						<div className="custom-file">
							<Input as="tempUpload" type="file" className="custom-file-input form-control" id="poc_passport_copy" name="Contact.passport_copy" />
							<label className="custom-file-label" htmlFor="poc_passport_copy">{_.get(this.state.model, 'Contact.passport_copy.filename', '')}</label>
						</div>
						
					</div>
				</div>
			</div>
			<div className="form-footer">
				<div className="form-group float-right">
					<button type="button" className="btn btn-primary" disabled={this.state.busy} onClick={this.submit.bind(this)}>UPDATE</button>
				</div>
			</div>
		</div>
		</ContextForm>
        );
    }
}