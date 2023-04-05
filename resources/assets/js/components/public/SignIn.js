import React from "react";
import { Validateable, Input, ContextForm } from "../Common.js";

export default class SignIn extends Validateable {
  constructor(props) {
    super(props);
    this.state = {
      hasAcc: true,
      model: {}
    };
    this.page = React.createRef();
    this.submit = this.submit.bind(this);
    this.onPressEnter = this.submit;
    this.captcha = React.createRef();
  }
  switchView() {
    this.props.history.push("/signup");
  }
  submit() {
    this.setState({ busy: true });
    let hasAcc = this.state.hasAcc;
    if (hasAcc) {
      api.login(this.state.model).then(res => {
        if (res.success) {
          // location.replace(__app.baseURL);
        } else {
          if (this.state.model.gr_token) {
            this.state.model.gr_token = "";
            this.captcha && this.captcha.reset();
          }
          this.setState({ busy: false, errors: res.errors });
        }
      });
    } else {
      api.post("/password/email", this.state.model).then(res => {
        if (res.success) {
          this.setState({ busy: false, model: {}, hasAcc: true });
          notify.success(res.message);
        } else {
          this.setState({ busy: false, errors: res.errors });
        }
      });
    }
  }
  // resetPassword(){
  //     this.setState({busy: true});
  //     api.post('/password/email', this.state.model).then((res)=>{
  //         if(res.success){
  //             this.setState({busy: false, model: {}, hasAcc: true});
  //             notify.success(res.message);
  //         }
  //         else{
  //             this.setState({busy: false, errors: res.errors});
  //         }
  //     });
  // }
  render() {
    return (
      <div className="container login">
        <div className="content-container">
          <div className="section">
            <div className="section-inner">
              <div className="row d-flex">
                <div className="col-sm-7 align-self-center p-2">
                  <div className="widget widget-sideTitle">
                    <h1
                      dangerouslySetInnerHTML={{ __html: this.props.heading }}
                    />
                  </div>
                </div>
                <ContextForm target={this}>
                  {this.state.hasAcc
                    ? renderLoginForm.call(this)
                    : renderForgotForm.call(this)}
                </ContextForm>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function renderLoginForm() {
  return (
    <div className="col-sm-5">
      <div className="widget widget-login float-right">
        <div className="widget-inner">
          <form className="needs-validation" noValidate>
            <div className="form-group">
              <label htmlFor="user_name">User Name</label>
              <div className="input-group-prepend relative">
                <span className="input-group-text">
                  <i className="fas fa-user"></i>
                </span>
                <Input
                  type="text"
                  id="user_name"
                  autoFocus
                  name="user_name"
                  className="form-control required"
                  placeholder="@userName"
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="user_pass">Password</label>
              <div className="input-group-prepend relative">
                <span className="input-group-text">
                  <i className="fas fa-lock"></i>
                </span>
                <Input
                  type="password"
                  autoComplete="off"
                  id="user_pass"
                  name="password"
                  className="form-control required"
                  placeholder="*******"
                />
              </div>
              <small
                id="forgot_pass"
                className="form-text text-muted text-right"
              >
                <span
                  className="link"
                  onClick={() => {
                    this.setState({ hasAcc: false, model: {}, errors: {} });
                  }}
                >
                  Forgot password?
                </span>
              </small>
            </div>
            {__app.G_CAPTCHA ? (<div className="form-group">
              <ReCaptcha
                widget={captcha => {
                  this.captcha = captcha;
                }}
                onChange={token => {
                  this.state.model.gr_token = token;
                  _.unset(this.state, "errors.gr_token");
                  this.forceUpdate();
                }}
                onExpire={() => {
                  this.state.model.gr_token = "";
                }}
              />
              {(() => {
                let err = _.get(this.state, "errors.gr_token");
                if (err) {
                  return (
                    <div
                      className="invalid-feedback"
                      style={{ display: "block" }}
                    >
                      {err}
                    </div>
                  );
                }
              })()}
            </div>) : null}
            <div className="form-group">
              <button
                type="button"
                className={
                  "btn btn-primary btn-block" + (this.state.busy ? " busy" : "")
                }
                disabled={this.state.busy}
                onClick={this.submit}
              >
                Submit
              </button>
            </div>
          </form>
          <div className="">
            Don't have account?{" "}
            <span
              className="link"
              onClick={() => {
                this.props.history.push("signup");
              }}
            >
              Click here
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function renderForgotForm() {
  return (
    <div className="col-sm-5">
      <div className="widget widget-login float-right">
        <div className="widget-inner">
          <div className="needs-validation">
            <div className="form-group">
              <label htmlFor="user_name">User Name</label>
              <div className="input-group-prepend">
                <span className="input-group-text">
                  <i className="fas fa-user"></i>
                </span>
                <Input
                  type="text"
                  id="user_name"
                  name="user_name"
                  className="form-control required"
                  placeholder="@userName"
                />
              </div>
            </div>
            <div className="form-group">
              <button
                type="button"
                className={
                  "btn btn-primary btn-block" + (this.state.busy ? " busy" : "")
                }
                disabled={this.state.busy}
                onClick={this.submit.bind(this)}
              >
                Submit
              </button>
            </div>
            <div >
            <span
                  className="link"
                  onClick={() => {
                    this.setState({ hasAcc: true, model: {}, errors: {} });
                  }}
                >
                 Back to LOGIN
                </span>
            </div>
          </div>
          {/* <div className="">
            Don't have account?{" "}
            <span
              className="link"
              onClick={() => {
                this.props.history.push("signup");
              }}
            >
              Click here
            </span>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export class ReCaptcha extends React.Component {
  constructor(...args) {
    super(...args);
    this.elem = React.createRef();
  }
  componentDidMount() {
    if (window.grecaptcha && grecaptcha.render) {
      this.renderWidget();
    } else {
      this.intervalId = setInterval(() => {
        if (window.grecaptcha && grecaptcha.render) {
          this.renderWidget();
          clearInterval(this.intervalId);
          this.intervalId = null;
        }
      }, 100);
    }
  }
  componentWillUnmount() {
    this.intervalId && clearInterval(this.intervalId);
  }
  renderWidget() {
    if (!__app.G_CAPTCHA_KEY) {
      notify.error(
        "Please let site administrator know to set Google Re-Captcha configurations.",
        "ALERT",
        20000
      );
      this.elem.current.innerHTML =
        "<div class='text-danger'>Google Re-Captcha key is missing.</div>";
      return;
    }
    this.captchaId && grecaptcha.reset(this.captchaId);
    this.elem.current.innerHTML = "";
    this.captchaId = grecaptcha.render(this.elem.current, {
      sitekey: __app.G_CAPTCHA_KEY,
      callback: token => {
        this.props.onChange && this.props.onChange(token);
      },
      "expired-callback": (...args) => {
        this.props.onExpire && this.props.onExpire(...args);
      }
    });
    this.props.widget &&
      this.props.widget({
        reset: () => {
          grecaptcha.reset(this.captchaId);
        }
      });
  }
  render() {
    return (
      <div className="g-recaptcha" ref={this.elem}>
        <div className="busy" style={{ width: "100%", height: "80px" }}></div>
      </div>
    );
  }
}
