import React from "react"
import { BrowserRouter, Route, Switch, NavLink, withRouter, Link } from 'react-router-dom'
import AppRoute from "./AppRoute"
import { DataContext, Notifications } from './Common'

class ScrollToTop extends React.Component {
    componentDidUpdate(prevProps) {
        if (this.props.location.pathname !== prevProps.location.pathname) {
            document.getElementById("app").scrollTop = 0;
            document.getElementById("app").scrollLeft = 0;
        }
    }

    render() {
        return this.props.children;
    }
}
const ScrollToTopWithRouter = withRouter(ScrollToTop);
export { ScrollToTopWithRouter }

class CollapsibleMenu extends React.Component {
    render() {
        let menus = this.props.menus;
        return (
            <ul className="list-unstyled components">
                {menus.map((item, key) => {
                    if (item.menus) {
                        let isSelected = _.startsWith(this.props.location.pathname, item.to);
                        return (
                            <li key={key}>
                                <a href={`#${item.htmlId}`} data-toggle="collapse" aria-expanded={isSelected ? "true" : "false"} className={`bg-dark${!isSelected ? " collapsed" : ""}`}>{item.label}</a>
                                <ul className={`collapse list-unstyled${isSelected ? " show" : ""}`} id={`${item.htmlId}`}>
                                    {item.menus.map((item, idx) => {
                                        return (
                                            <li key={idx}>
                                                <NavLink className="bg-dark" to={item.to} exact={item.exact}>{item.label}</NavLink>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </li>
                        );
                    }
                    else {
                        return (
                            <li key={key}>
                                <NavLink className="bg-dark" to={item.to} exact={item.exact}>{item.label}</NavLink>
                            </li>
                        );
                    }
                })}
                {this.props.children}
            </ul>
        );
    }
}
const CollapsibleMenuWithRouter = withRouter(CollapsibleMenu);
export { CollapsibleMenuWithRouter }


export default class Theme extends React.Component {
    constructor(props) {
        super(props);
        this.user = this.props.user;
    }
    // logout() {
    //     api.logout();
    // }
    async logout() {
        await api.logout();
    }
    componentWillMount() {
        if (this.props.name == "company") {
            block(document.body);
            api.get("/company/profile").then((data) => {
                this.profile = data;
                this.forceUpdate();
                unblock(document.body);
            });
        }
    }
    render() {
        return (
            <BrowserRouter basename={__app.routeBaseURL}>
                <ScrollToTopWithRouter>
                    {(() => {
                        switch (this.props.name) {
                            case "public": return renderPublicTheme.call(this);
                            case "company": return renderCompanyTheme.call(this);
                            case "admin": return renderAdminTheme.call(this);
                            default: return <div></div>;
                        }
                    })()}
                </ScrollToTopWithRouter>
            </BrowserRouter>
        );
    }
}


function renderPublicTheme() {
    let { menus, routes } = this.props;
    return (
        // <BrowserRouter basename={__app.routeBaseURL}>
        <React.Fragment>
            <div className="container-fluid container-light relative">
                <Switch>
                    {routes.map((route, key) => {
                        if (route.bgImage) {
                            let style = { backgroundImage: 'url(' + __app.baseURL + route.bgImage + ')' };
                            if (route.bgContent) {
                                style.minHeight = "100vh";
                            }
                            return (
                                <Route
                                    key={key}
                                    exact={route.exact}
                                    path={route.path}
                                    render={props => {
                                        return <div className="bg-img" style={style}></div>
                                    }}
                                />
                            );
                        }
                        return null;
                    })}
                </Switch>
                <div className="bg-overlay relative">
                    <div className="container">
                        <div className="content-container">
                            <nav className="navbar navbar-expand-lg navbar-dark">
                                <Link className="navbar-brand" to={"/"}><img src={asset('media/logo.PNG')} /><img src={asset('media/logo-boi.png')} /></Link>
                                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
                                    <span className="navbar-toggler-icon"></span>
                                </button>

                                <div className="collapse navbar-collapse  my-2 my-lg-0" id="navbarTogglerDemo02">
                                    <ul className="navbar-nav ml-auto">
                                        {menus.map((item, i) => (
                                            <li className="nav-item" key={i}>
                                            {
                                                item.to === "/contact-us" ?
                                                <a target="_blank" href="https://invest.gov.pk/contact-us" className="nav-link">
                                                {item.label}
                                                </a>
                                                :
                                                 <NavLink className="nav-link" to={item.to} exact={item.exact}>{item.label}</NavLink>

                                            }
                                           
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </nav>

                            <Switch>
                                {routes.map((route, key) => {
                                    if (route.heading) {
                                        return (
                                            <Route
                                                key={key}
                                                exact={route.exact}
                                                path={route.path}
                                                render={props => {
                                                    return (
                                                        <div key={key} className="widget widget-heading">
                                                            <div className="widget-inner">
                                                                <h1 dangerouslySetInnerHTML={{ __html: route.heading }} />
                                                            </div>
                                                        </div>
                                                    );
                                                }}
                                            />
                                        );
                                    }
                                    return null;
                                })}
                            </Switch>
                        </div>
                    </div>

                    <Switch>
                        {AppRoute(routes, "bgContent")}
                    </Switch>

                </div>
            </div>
            <Switch>
                {AppRoute(routes, "content")}
            </Switch>
            <div className="footer">
                <div className="footer-inner">
                    <div className="container">
                        <div className="d-flex">
                            <div className="float-left">
                                <img className="footer-logo" src={asset('media/logo-footer.png')} />
                            </div>
                            <div className="col footer-desc">
                                <p>Copyright &copy; 2019 Board of Investment. All rights reserved.</p>
                                <p>Designed and Developed by: Evamp & Saanga</p>
                            </div>
                            <div className="float-right">
                                <div className="social-icons">
                                    &nbsp;
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </React.Fragment>
        // </BrowserRouter>
    );
}

function renderCompanyTheme() {
    if (!this.profile) {
        return null;
    }
    let { menus, routes } = this.props;
    let Notification = withRouter(Notifications);
    return (
        <DataContext.Provider value={this.profile}>
            <div className="container-fluid container-light relative">
                <Switch>
                    {routes.map((route, key) => {
                        if (route.bgImage) {
                            let style = { backgroundImage: 'url(' + __app.baseURL + route.bgImage + ')' };
                            if (route.bgContent) {
                                style.minHeight = "100vh";
                            }
                            return (
                                <Route
                                    key={key}
                                    exact={route.exact}
                                    path={route.path}
                                    render={props => {
                                        return <div className="bg-img" style={style}></div>
                                    }}
                                />
                            );
                        }
                        return null;
                    })}
                </Switch>
                <div className="bg-overlay relative">
                    <div className="container">
                        <div className="content-container">
                            <nav className="navbar navbar-expand-lg navbar-dark">
                                <a className="navbar-brand" href={__app.routeBaseURL}><img src={asset('media/logo.PNG')} /><img src={asset('media/logo-boi.png')} /></a>
                                <div className="ml-auto" id="">
                                    <div className="user-bar">
                                        <Notification/>
                                        <div className="widget widget-userInfo">
                                            <span className="userInfo float-left text-right"><span className="text-warning">WELCOME</span><span>{this.profile.contact.full_name}</span></span>
                                            <span className="user-icon float-right"><i className="fas fa-user-tie"></i></span>
                                        </div>
                                    </div>
                                </div>
                            </nav>

                            <Switch>
                                {routes.map((route, key) => {
                                    if (route.heading || route.path == "/") {
                                        return (
                                            <Route
                                                key={key}
                                                exact={route.exact}
                                                path={route.path}
                                                render={props => {
                                                    return (
                                                        <div key={key} className="widget widget-heading">
                                                            <div className="widget-inner">
                                                                {(() => {
                                                                    if (route.path == "/") {
                                                                        return <h1>Welcome<br />{this.profile.contact.full_name}</h1>
                                                                    }
                                                                    else {
                                                                        return <h1 dangerouslySetInnerHTML={{ __html: route.heading }} />
                                                                    }
                                                                })()}
                                                            </div>
                                                        </div>
                                                    );
                                                }}
                                            />
                                        );
                                    }
                                    return null;
                                })}
                            </Switch>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-fluid container-light">
                <div className="container">
                    <div className="content-container">
                        <div className="section mt-5">
                            <div className="section-inner">
                                <div className="row">
                                    <div className="col-md-auto">
                                        <div className="widget widget-leftNav">
                                            <div className="widget-inner">
                                                <ul className="leftNav">
                                                    {menus.map((item, i) => {
                                                        if (item.active === false) {
                                                            return <li key={i}><a className="disabled">{item.label}</a></li>
                                                        }
                                                        return <li key={i}><NavLink to={item.to} exact={item.exact}>{item.label}</NavLink></li>
                                                    })}
                                                    <li><a href={url('/')} onClick={this.logout}>Logout</a></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="widget widget-content">
                                            <div className="widget-inner">
                                                <Switch>
                                                    {AppRoute(routes, "content")}
                                                </Switch>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DataContext.Provider>
    );
}

function renderAdminTheme() {
    let { menus, routes } = this.props;
    let Notification = withRouter(Notifications);
    return (
        // <BrowserRouter basename={__app.routeBaseURL}>
        <div className="admin-portal">
            <div className="container-fluid container-dark relative">
                <div className="bg-overlay">
                    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                        <a className="navbar-brand" href={__app.routeBaseURL}><img src={asset('media/logo.PNG')} /><img src={asset('media/logo-boi.png')} /></a>
                        <div className="ml-auto" id="">
                            <div className="user-bar">
                                <Notification/>
                                <div className="widget widget-userInfo">
                                    <span className="userInfo float-left text-right"><span className="text-warning">WELCOME</span><span>{this.user.full_name}</span></span>
                                    <span className="user-icon float-right"><i className="fas fa-user-tie"></i></span>
                                </div>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
            <div className="container-fluid">
                <div className="row d-flex">
                    <div className="col widget widget-sidebar">
                        <div className="">
                            <nav id='sidebar'>
                                <CollapsibleMenuWithRouter menus={menus}>
                                    <li><a href={url('/')} className="bg-dark" onClick={this.logout}>Logout</a></li>
                                </CollapsibleMenuWithRouter>
                            </nav>
                        </div>
                    </div>

                    <Switch>
                        {AppRoute(routes, "content")}
                    </Switch>
                </div>
            </div>
        </div>
        // </BrowserRouter>
    );
}

export { ScrollToTop }