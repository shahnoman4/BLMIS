import React from "react"
import { Route, Redirect } from 'react-router-dom'


function route(route, key, match, componentType){
    let [path, componentName] = route[componentType].split(":");
    let Component = require("./" + path)[componentName || "default"];
    return (
        <Route
            key={key}
            exact={route.exact}
            path={route.path ? (match ? match.path : "") + route.path : route.path}
            render={props => {
                if(route.public && __app.authorized){
                    console.log("Redirect to dashborad")
                    return <Redirect to="dashboard" key={key} exact={route.exact}/>
                }
                else if(route.public === false && !__app.authorized){
                    console.log("Redirect to home page")
                    return <Redirect to="/" key={key}/>
                }
                else if(route.redirect){
                    if(route.redirect.if){
                        try{
                            let predicate = new Function('state', route.redirect.if);
                            if(predicate(this || {})){
                                console.log("Redirect to " + route.redirect.to);
                                return <Redirect to={route.redirect.to} key={key}/>
                            }
                        }catch(e){

                        }
                    }
                    else{
                        console.log("Redirect to " + route.redirect.to);
                        return <Redirect to={route.redirect.to} key={key}/>
                    }
                }
                // pass the sub-routes down to keep nesting
                return <Component {...props} routes={route.routes} {...route.props} />

            }}
        />
    );
}

export default function AppRoute(routes, componentType, match){
    let __routes = [];
    routes.forEach((item, key)=>{
        if(item[componentType]){
            __routes.push(route(item, key, match, componentType))
        }
    })
    return __routes;
}