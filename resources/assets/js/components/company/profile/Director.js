import React from 'react'
import {Validateable, Input, ContextForm} from '../../Common.js'
import {block, unblock} from '../../../helper/common.js'
import api from '../../../config/app'

export default class Director extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            model: {},
            busy: false
        };
        if(props.profile && props.profile.Directors){
            this.state.model.Directors = props.profile.Directors;
            this.state.index = props.index;
        }
        if(!this.state.model.Directors){
            this.state.model.Directors = [{
                full_name: "", nic_no: "", passport_no: "",
            }];
        }
    }
    submit(){
        this.setState({busy: true});
        api.put('/company', {...this.state.model, section: 'directors'}).then((res)=>{
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
        {this.state.model.Directors.map((director, key)=>{
            return(
            <div className="card-body" key={key}>
                <div className="row">
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="dir_name0">Director Name</label>
                            <div className="">
                                <Input type="text" autoComplete="off" id="dir_name0" name={`Directors[${key}].full_name`} className="form-control required" placeholder="@fullName"/>    
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="dir_photo0">Director Photo</label>
                            <div className="custom-file">
                                <Input as="tempUploadImage" type="file" className="custom-file-input form-control" id="dir_photo0" name={`Directors[${key}].dp`} />
                                <label className="custom-file-label" htmlFor="dir_photo0">{_.get(this.state.model, `Directors[${key}].dp.filename`, '')}</label>
                            </div>

                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="dir_cv0">Director CV</label>
                            <div className="custom-file">
                                <Input as="tempUpload" type="file" className="custom-file-input form-control" id="dir_cv0" name={`Directors[${key}].cv`} />
                                <label className="custom-file-label" htmlFor="dir_cv0">{_.get(this.state.model, `Directors[${key}].cv.filename`, '')}</label>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="dir_cover0">Director Cover Letter</label>
                            <div className="custom-file">
                                <Input as="tempUpload" type="file" className="custom-file-input form-control" id="dir_cover0" name={`Directors[${key}].cover_letter`} />
                                <label className="custom-file-label" htmlFor="dir_cover0">{_.get(this.state.model, `Directors[${key}].cover_letter.filename`, '')}</label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="dir_nid0">Director NIC Number</label>
                            <div className="">
                                <Input type="text" autoComplete="off" id="dir_nid0" name={`Directors[${key}].nic_no`} className="form-control required" placeholder="@National Card Number"/>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="dir_nic_copy0">Director NIC Copy</label>
                            <div className="custom-file">
                                <Input as="tempUpload" type="file" className="custom-file-input form-control" id="dir_nic_copy0" name={`Directors[${key}].nic_copy`} />
                                <label className="custom-file-label" htmlFor="dir_nic_copy0">{_.get(this.state.model, `Directors[${key}].nic_copy.filename`, '')}</label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="dir_passport0">Director Passport Number</label>
                            <div className="">
                                <Input type="text" autoComplete="off" id="dir_passport0" name={`Directors[${key}].passport_no`} className="form-control required" placeholder="@National Card Number"/>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="dir_passport_copy0">Passport Copy</label>
                            <div className="custom-file">
                                <Input as="tempUpload" type="file" className="custom-file-input form-control" id="dir_passport_copy0" name={`Directors[${key}].passport_copy`} />
                                <label className="custom-file-label" htmlFor="dir_passport_copy0">{_.get(this.state.model, `Directors[${key}].passport_copy.filename`, '')}</label>
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
            );
        })}
        </ContextForm>
        );
    }
}