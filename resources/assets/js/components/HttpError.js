import React from "react"
import {Redirect } from './Common'

class HttpError extends React.Component{
    render(){
        return <Redirect to='/login' />;
        return(
            <React.Fragment>
            <h1>{this.props.code || 404}</h1>
            <h3>{this.props.message || "Page Not Found"}</h3>
            </React.Fragment>
        );
    }
}

export default HttpError;