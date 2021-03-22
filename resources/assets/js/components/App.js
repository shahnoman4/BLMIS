import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Theme from "./Theme"
import {ThemeContext} from './Common'
import ReactNotification from "react-notifications-component";
// Import css files
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      theme: __app._theme,
      menus: __app.menus,
      routes: __app.routes,
      user: __app.user
    };
    this.notifier = React.createRef();
  }
  theme(name){
    this.setState({theme: name});
  }
  notify(message, type, title, duration) {
    this.notifier.current.addNotification({
      title,
      message,
      type,
      insert: "top",
      container: "top-right",
      // animationIn: ["animated", "zoomIn"],
      // animationOut: ["animated", "zoomOut"],
      dismiss: { duration: duration || 2000 },
      dismissable: { click: true },
    });
  }

  render () {
    return (
      <ThemeContext.Provider value={this.state.theme}>
        <ReactNotification ref={this.notifier} />
        <Theme name={this.state.theme} menus={this.state.menus} routes={this.state.routes} user={this.state.user} />
      </ThemeContext.Provider>
    );
  }
}

__app.__c = ReactDOM.render(<App />, document.getElementById('app'));
