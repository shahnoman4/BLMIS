import React from 'react'
import {Validateable, Input, ContextForm} from '../../Common.js'
import {block, unblock} from '../../../helper/common.js'
import api from '../../../config/app'

export default class PrincipalOfficer extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            model: {},
            busy: false
        };
        if(props.profile && props.profile.PO){
			this.state.model.PO = props.profile.PO;
        }
        if(!this.state.model.PO){
            this.state.model.PO = {
                full_name: "", nic_no: "", passport_no: "",
            };
        }
    }
    submit(){
        this.setState({busy: true});
        api.put('/company', {...this.state.model, section: 'po'}).then((res)=>{
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
        return(
        <ContextForm target={this}>
        <div className="card-body">
            <div className="row">
                <div className="col">
                    <div className="form-group">
                        <label htmlFor="po_name">Principal Officer Name</label>
                        <div className="">
                            <Input type="text" autoComplete="off" id="po_name" autoFocus name="PO.full_name" className="form-control required" placeholder="@fullName"/>    
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="form-group">
                        <label htmlFor="po_photo">Principal Officer Photo</label>
                        <div className="custom-file">
                            <Input as="tempUploadImage" type="file" className="custom-file-input form-control" id="po_photo" name="PO.dp" />
                            <label className="custom-file-label" htmlFor="po_photo">{_.get(this.state.model, 'PO.dp.filename', '')}</label>
                        </div>

                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col">
                    <div className="form-group">
                        <label htmlFor="po_cv">Principal Officer CV</label>
                        <div className="custom-file">
                            <Input as="tempUpload" type="file" className="custom-file-input form-control" id="po_cv" name="PO.cv" />
                            <label className="custom-file-label" htmlFor="po_cv">{_.get(this.state.model, 'PO.cv.filename', '')}</label>
                        </div>

                    </div>
                </div>
                <div className="col">
                    <div className="form-group">
                        <label htmlFor="po_cover">Principal Officer Cover Letter</label>
                        <div className="custom-file">
                            <Input as="tempUpload" type="file" className="custom-file-input form-control" id="po_cover" name="PO.cover_letter" />
                            <label className="custom-file-label" htmlFor="po_cover">{_.get(this.state.model, 'PO.cover_letter.filename', '')}</label>
                        </div>

                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col">
                    <div className="form-group">
                        <label htmlFor="po_nid">Principal Officer NIC Number</label>
                        <div className="">
                            <Input type="text" autoComplete="off" id="po_nid" name="PO.nic_no" className="form-control required" placeholder="@National Card Number"/>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="form-group">
                        <label htmlFor="po_nic_copy">Principal Officer NIC Copy</label>
                        <div className="custom-file">
                            <Input as="tempUpload" type="file" className="custom-file-input form-control" id="po_nic_copy" name="PO.nic_copy" />
                            <label className="custom-file-label" htmlFor="po_nic_copy">{_.get(this.state.model, 'PO.nic_copy.filename', '')}</label>
                        </div>

                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col">
                    <div className="form-group">
                        <label htmlFor="po_passport">Principal Officer Passport Number</label>
                        <div className="">
                            <Input type="text" autoComplete="off" id="po_passport" name="PO.passport_no" className="form-control required" placeholder="@National Card Number"/>
                            <div className="valid-feedback">Valid.</div>
                            <div className="invalid-feedback">{_.get(this.state.errors, 'PO.passport_no', '')}</div>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="form-group">
                        <label htmlFor="po_passport_copy">Principal Officer Passport Copy</label>
                        <div className="custom-file">
                            <Input as="tempUpload" type="file" className="custom-file-input form-control" id="po_passport_copy" name="PO.passport_copy" />
                            <label className="custom-file-label" htmlFor="po_passport_copy">{_.get(this.state.model, 'PO.passport_copy.filename', '')}</label>
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