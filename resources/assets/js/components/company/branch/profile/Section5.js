import React from 'react'
import {Validateable, Input, ContextForm} from '../../../Common.js'

export default class BranchAppSection5 extends Validateable{
    constructor(props){
        super(props);
        this.state = {
            model: this.props.model,
            errors: this.props.errors,
            busy: false
        };

        this.page = React.createRef();
    }
    submit(){
    }
    render() {
        let model = this.state.model;
        let key = 0;
        return(
            <ContextForm target={this}>
            </ContextForm>
        );
    }
}