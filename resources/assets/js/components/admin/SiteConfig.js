import React from 'react'

import {ContextForm, Input} from '../Common'

export default class SiteConfig extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            busy: false,
            model: {},
            data:[],
        };
    }

    
    submit(){
        this.setState({busy: true});
        api.post('/admin/siteConfig', this.state.model).then((res)=>{
            this.setState({busy: false});
            if(res.success){
                notify.success('Data updated successfully.');
                this.setState({model: {}, errors: {},data: res.data});
                //this.props(res.data)
            }
            else{
                this.setState({errors: res.errors});
            }
        });
    }

    componentDidMount(){
        api.get('admin/siteConfig').then(res => {
          this.setState({ data: res});
        })
        .catch(function (error) {
          console.log(error);
        })
    }

    render() {

           this.state.model=this.state.data;
           
        return (
            <ContextForm target={this}>
            <div className="col p3040">
                <div className={`widget widget-data${this.state.busy.apps ? " busy" : ""}`}>
                    <div className="widget-inner">
                        <div className="needs-validation">
                            
                            <div className="form-group">
                                <h3>Site Config</h3>
                                <div>
                                    <span className="float-right text-danger small">All fields are required</span>
                                </div>
                            </div>
                            
                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <label htmlFor="notes">Notes</label>
                                        <div className="">
                                            <Input type="text" id="notes" name="notes" className="form-control required" placeholder="@Notes" />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <label htmlFor="video_link">Video Link</label>
                                        <div className="">
                                            <Input type="text" id="video_link"  name="video_link"  className="form-control required" placeholder="@Video Link" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <label htmlFor="title_1">Heading</label>
                                        <div className="">
                                            <Input type="text" id="title_1"  name="title_1"  className="form-control required" placeholder="@Heading" />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <label htmlFor="description">Description</label>
                                        <div className="">
                                        <Input
                                          as="textarea"
                                          rows="5"
                                          className="form-control required"
                                          name="description"
                                          placeholder="@Description"
                                        />
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
                    </div>
                </div>
            </div>
            </ContextForm>
        );
    }
}