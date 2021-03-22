import React from 'react'
import {Validateable, Input, ContextForm, submitStyle, backStyle} from '../Common.js'
import {ReCaptcha} from './SignIn'

export default class SignUpS2 extends Validateable {
    constructor(props) {
        let rules = {
            "PO.full_name": {required: "This field is required", alpha_spaces: "Only A-Z,a-z and space allowed"},
            //"PO.nic_no": {required: "This field is required"},
            //"PO.passport_no": {required: "This field is required"},
            "Directors.*.full_name": {required: "This field is required", alpha_spaces: "Only A-Z,a-z and space allowed"},
        };
        super(props, rules);
        this.validateOnBlur = true;
        this.state = {
            model: this.props.model,
            errors: this.props.errors,
            busy: false
        };

        if (!this.state.model.PO) {
            this.state.model.PO = {};
        }

        if (!this.state.model.Directors) {
            this.state.model.Directors = [];
        }
        if(!this.state.model.G){ //contains google recaptcha token
            this.state.model.G = {};
        }
        this.page = React.createRef();
    }
    addDirector() {
        this.state.model.Directors.push({});
        this.forceUpdate();
    }
    switchView(errMsgs, successMsgs) {
        this.props.history.push("/login");
    }
    back() {
        this.props.onBack(null, this.state.model);
    }
    submit() {
        if(this.validator.validate()){
            this.setState({ busy: true });
            api.post("/register", this.state.model).then((res) => {
                if (res.success) {
                    console.log(res);
                    let uid = res.data.uid
                    console.log("NEW UID-->", uid)
                    this.props.onSubmit(this.state.model, uid);
                }
                else{
                    
                    if(this.state.model.G.gr_token){
                        this.state.model.G.gr_token = "";
                        this.captcha && this.captcha.reset();
                    }
                    this.setState({busy: false});
                    let errors =  res.errors;
                    if(_.has(errors, 'User') || _.has(errors, 'Company') || _.has(errors, 'Contact')){
                        this.setState({errors: errors});
                        this.props.onBack(errors, this.state.model);
                    }
                    else {
                        this.setState({ errors: errors });
                        $('.is-invalid:first').focus();
                    }
                }
            });
        }
    }
    render() {
        return (
            <ContextForm target={this}>
                <div className="widget widget-form" ref={this.page}>
                    <div className="widget-inner">
                        <form className="needs-validation" noValidate>
                            <div className="form-heading">
                                <h4>Principal Officer Information</h4>
                                <div className="d-flex  justify-content-between">
                                    <span className="float-left text-muted small">Note: incomplete form will note be entertained</span>
                                </div>
                            </div>
                            <div className="clearfix"></div>

                            <div className="row">
                                <div className="col">
                                    <div className="form-group">
                                        <label htmlFor="po_name">Principal Officer Name<span className="text-danger"> *</span></label>
                                        <div className="">
                                            <Input type="text" autoComplete="off" id="po_name" autoFocus name="PO.full_name" className="form-control required" placeholder="@fullName" maxLength="255" />
                                        </div>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="form-group">
                                        <label htmlFor="po_photo">Photo of Principal Officer<span className="text-danger"> *</span></label>
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
                                        <label htmlFor="po_cv">Principal Officer CV<span className="text-danger"> *</span></label>
                                        <div className="custom-file">
                                            <Input as="tempUpload" type="file" className="custom-file-input form-control" id="po_cv" name="PO.cv" />
                                            <label className="custom-file-label" htmlFor="po_cv">{_.get(this.state.model, 'PO.cv.filename', '')}</label>
                                        </div>

                                    </div>
                                </div>
                                <div className="col">
                                    <div className="form-group">
                                        <label htmlFor="po_cover">Principal Officer Cover Letter<span className="text-danger"> *</span></label>
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
                                            <Input type="text" autoComplete="off" id="po_nid" name="PO.nic_no" className="form-control " placeholder="@National Card Number" maxLength="20" />
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
                                            <Input type="text" autoComplete="off" id="po_passport" name="PO.passport_no" className="form-control " placeholder="@Passport Number" maxLength="20" />
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
                            {this.renderDirectors()}
                            <div className="row">
                                <div className="col">
                                    <button type="button" className="btn btn-outline-primary" onClick={this.addDirector.bind(this)}>Add Director Information</button>
                                </div>
                            </div>

                            {__app.G_CAPTCHA ? (<div className="relative" style={{marginTop: 25}}>
                                <ReCaptcha
                                    widget={(captcha)=>{this.captcha = captcha;}}
                                    onChange={(token)=>{
                                        this.state.model.G.gr_token = token;
                                        _.unset(this.state, 'errors.G.gr_token');
                                        this.forceUpdate();
                                    }}
                                    onExpire={()=>{
                                        this.state.model.G.gr_token = "";
                                    }}
                                />
                                {(()=>{
                                    let err = _.get(this.state, 'errors.G.gr_token');
                                    if(err){
                                        return <div className="invalid-feedback" style={{display: 'block'}}>{err}</div>;
                                    }
                                })()}
                            </div>) : null}
                            <div className="form-footer">
                                <div className="form-group float-left">
                                    <button style={backStyle} type="button" className="btn btn-secondary" onClick={this.back.bind(this)}>BACK</button>
                                </div>
                                <div className="form-group float-right">
                                    <button style={submitStyle} type="button" className={"btn btn-primary" + (this.state.busy ? " busy" : "")} onClick={this.submit.bind(this)} disabled={this.state.busy}>SUBMIT</button>
                                </div>
                            </div>

                        </form>
                    </div>
                </div>
            </ContextForm>
        );
    }
    renderDirectors() {
        if (!this.state.model.Directors) return null;
        return this.state.model.Directors.map((director, key) => {
            return (
                <React.Fragment key={key}>
                <div className="form-heading relative">
                    <h4>Director Information ({key + 1})</h4>
                    <span
                        className="btn btn-outline-primary btn-xs"
                        style={{position: 'absolute', top: 0, right: 0, cursor: 'pointer', fontSize: '30px'}}
                        title='Remove director information'
                        onClick={()=>{
                            this.state.model.Directors.splice(key, 1);
                            this.forceUpdate();
                        }}
                    >&times;</span>
                </div>
                <div className="clearfix"></div>

                    <div className="row">
                        <div className="col">
                            <div className="form-group">
                                <label htmlFor="dir_name0">Director Name<span className="text-danger"> *</span></label>
                                <div className="">
                                    <Input type="text" autoComplete="off" id="dir_name0" name={`Directors[${key}].full_name`} className="form-control required" placeholder="@fullName" maxLength="255" />
                                    <div className="valid-feedback">Valid.</div>
                                    <div className="invalid-feedback">{_.get(this.state.errors, `Directors[${key}].full_name`, '')}</div>
                                </div>
                            </div>
                        </div>
                        <div className="col">
                            <div className="form-group">
                                <label htmlFor="dir_photo0">Director Photo<span className="text-danger"> *</span></label>
                                <div className="custom-file">
                                    <Input as="tempUploadImage" type="file" className="custom-file-input form-control" id="dir_photo0" name={`Directors[${key}].dp`} />
                                    <label className="custom-file-label" htmlFor="dir_photo0">{_.get(this.state.model, `Directors[${key}].dp.filename`, '')}</label>
                                    <div className="valid-feedback">Valid.</div>
                                    <div className="invalid-feedback">{_.get(this.state.errors, `Directors[${key}].dp`, '')}</div>
                                </div>

                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col">
                            <div className="form-group">
                                <label htmlFor="dir_cv0">Director CV<span className="text-danger"> *</span></label>
                                <div className="custom-file">
                                    <Input as="tempUpload" type="file" className="custom-file-input form-control" id="dir_cv0" name={`Directors[${key}].cv`} />
                                    <label className="custom-file-label" htmlFor="dir_cv0">{_.get(this.state.model, `Directors[${key}].cv.filename`, '')}</label>
                                    <div className="valid-feedback">Valid.</div>
                                    <div className="invalid-feedback">{_.get(this.state.errors, `Directors[${key}].cv`, '')}</div>
                                </div>
                            </div>
                        </div>
                        <div className="col">
                            <div className="form-group">
                                <label htmlFor="dir_cover0">Director Cover Letter<span className="text-danger"> *</span></label>
                                <div className="custom-file">
                                    <Input as="tempUpload" type="file" className="custom-file-input form-control" id="dir_cover0" name={`Directors[${key}].cover_letter`} />
                                    <label className="custom-file-label" htmlFor="dir_cover0">{_.get(this.state.model, `Directors[${key}].cover_letter.filename`, '')}</label>
                                    <div className="valid-feedback">Valid.</div>
                                    <div className="invalid-feedback">{_.get(this.state.errors, `Directors[${key}].cover_letter`, '')}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col">
                            <div className="form-group">
                                <label htmlFor="dir_nid0">Director NIC Number</label>
                                <div className="">
                                    <Input type="text" autoComplete="off" id="dir_nid0" name={`Directors[${key}].nic_no`} className="form-control" placeholder="@National Card Number" maxLength="20" />
                                    <div className="valid-feedback">Valid.</div>
                                    <div className="invalid-feedback">{_.get(this.state.errors, `Directors[${key}].nic_no`, '')}</div>
                                </div>
                            </div>
                        </div>
                        <div className="col">
                            <div className="form-group">
                                <label htmlFor="dir_nic_copy0">Director NIC Copy</label>
                                <div className="custom-file">
                                    <Input as="tempUpload" type="file" className="custom-file-input form-control" id="dir_nic_copy0" name={`Directors[${key}].nic_copy`} />
                                    <label className="custom-file-label" htmlFor="dir_nic_copy0">{_.get(this.state.model, `Directors[${key}].nic_copy.filename`, '')}</label>
                                    <div className="valid-feedback">Valid.</div>
                                    <div className="invalid-feedback">{_.get(this.state.errors, `Directors[${key}].nic_copy`, '')}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col">
                            <div className="form-group">
                                <label htmlFor="dir_passport0">Director Passport Number</label>
                                <div className="">
                                    <Input type="text" autoComplete="off" id="dir_passport0" name={`Directors[${key}].passport_no`} className="form-control " placeholder="@Passport Number" maxLength="20" />
                                    <div className="valid-feedback">Valid.</div>
                                    <div className="invalid-feedback">{_.get(this.state.errors, `Directors[${key}].passport_no`, '')}</div>
                                </div>
                            </div>
                        </div>
                        <div className="col">
                            <div className="form-group">
                                <label htmlFor="dir_passport_copy0">Passport Copy</label>
                                <div className="custom-file">
                                    <Input as="tempUpload" type="file" className="custom-file-input form-control" id="dir_passport_copy0" name={`Directors[${key}].passport_copy`} />
                                    <label className="custom-file-label" htmlFor="dir_passport_copy0">{_.get(this.state.model, `Directors[${key}].passport_copy.filename`, '')}</label>
                                    <div className="valid-feedback">Valid.</div>
                                    <div className="invalid-feedback">{_.get(this.state.errors, `Directors[${key}].passport_copy`, '')}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </React.Fragment>
            );
        });
    }
}