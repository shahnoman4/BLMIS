import React from 'react'
import {Validateable, Input, ContextForm} from '../../../Common.js'

export default class BranchAppSection1 extends Validateable{
    constructor(props){
        super(props);
        this.state = {
            model: {},
            errors: this.props.errors,
            busy: false
        };

        _.forEach(['LocalSponsor', 'LocalContact'], (key)=>{
            this.state.model[key] = _.get(this.props.model, key) || {};
        });

        this.page = React.createRef();
    }
    submit(){        
        this.setState({busy: true});
        api.put('/branch/' + this.props.model.Branch.id, {...this.state.model, section: 'localSponsor'}).then((res)=>{
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
    render() {
        let model = this.state.model;
        return(
            <ContextForm target={this}>
                {/* <!-- Company local sponsor --> */}
                <div className="form-group">
                    <div>
                        <span className="float-left text-muted small">Note: Incomplete form will not be entertained</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="location">Location<span className="text-danger"> *</span></label>
                            <div className="">
                                <Input type="text" autoComplete="off" id="location" name="LocalSponsor.Location.address_line1" className="form-control required" placeholder="@Hrant Madoyan St.14 Building, Gegharkunik Marz" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="city">City<span className="text-danger"> *</span></label>
                            <div className="">
                                <Input as="select" lookup='City' filterBy={{cc: 'PAK'}} className="custom-select" id="city" name="LocalSponsor.Location.city">
                                    <option value="">-- Select --</option>
                                </Input>
                            </div>

                        </div>
                    </div>

                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="Telephone">Telephone number<span className="text-danger"> *</span></label>
                            <div className="">
                                <Input type="text" autoComplete="off" id="Telephone" name="LocalSponsor.office_phone" className="form-control required" placeholder="@Telephone" />
                            </div>

                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="Cell-Number">Cell Number<span className="text-danger"> *</span></label>
                            <div className="">
                                <Input type="text" autoComplete="off" id="Cell-Number" name="LocalSponsor.mobile_phone" className="form-control required" placeholder="@Cell-Number" />
                            </div>

                        </div>
                    </div>
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="Fax-number">Fax number</label>
                            <div className="">
                                <Input type="text" autoComplete="off" id="Fax-number" name="LocalSponsor.office_fax" className="form-control required" placeholder="@Fax-number" />
                            </div>

                        </div>
                    </div>

                </div>
                <div className="row">

                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="company_email">Email address<span className="text-danger"> *</span></label>
                            <div className="">
                                <Input type="email" id="company_email" name="LocalSponsor.office_email" className="form-control required" placeholder="@Email address" />
                            </div>
                        </div>
                    </div>
                    <div className="col">

                    </div>
                </div>
                {/* <!-- Company's complete local address --> */}
                <div className="form-group">
                    <h3>Company's complete local address</h3>

                    <div>
                        <span className="float-left text-muted small">Note: Incomplete form will not be entertained</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="location">Location<span className="text-danger"> *</span></label>
                            <div className="">
                                <Input type="text" autoComplete="off" id="location" name="LocalContact.Location.address_line1" className="form-control required" placeholder="@Hrant Madoyan St.14 Building, Gegharkunik Marz" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="Telephone">Telephone number<span className="text-danger"> *</span></label>
                            <div className="">
                                <Input type="text" autoComplete="off" id="Telephone" name="LocalContact.office_phone" className="form-control required" placeholder="@Telephone" />
                            </div>

                        </div>
                    </div>
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="Cell-Number">Cell Number<span className="text-danger"> *</span></label>
                            <div className="">
                                <Input type="text" autoComplete="off" id="Cell-Number" name="LocalContact.mobile_phone" className="form-control required" placeholder="@Cell-Number" />
                            </div>

                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="Fax-number">Fax number</label>
                            <div className="">
                                <Input type="text" autoComplete="off" id="Fax-number" name="LocalContact.office_fax" className="form-control required" placeholder="@Fax-number" />
                            </div>

                        </div>
                    </div>
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="company_email">Email address<span className="text-danger"> *</span></label>
                            <div className="">
                                <Input type="email" id="company_email" name="LocalContact.office_email" className="form-control required" placeholder="@Email address" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="perosn">Contact Person Name<span className="text-danger"> *</span></label>
                            <div className="">
                                <Input type="email" id="perosn" name="LocalContact.full_name" className="form-control required" placeholder="@perosn name" />
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="person">Contact Person Number<span className="text-danger"> *</span></label>
                            <div className="">
                                <Input type="email" id="person" name="LocalContact.primary_phone" className="form-control required" placeholder="@person num" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="form-footer">
                    <div className="form-group float-right">
                        <button className={"btn btn-primary" + (this.state.busy ? " loading" : "")} disabled={this.state.busy} onClick={this.submit.bind(this)}>UPDATE</button>
                    </div>
                </div>
            </ContextForm>
        );
    }
}