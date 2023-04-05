import React from "react";
import SignUpS1 from "./SignUpS1";
import SignUpS2 from "./SignUpS2";
import { signUpData as tempModel } from "./data";

export default class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: "",
      step: 1,
      model: {}
      // model: tempModel,
    };
  }
  switchView(errMsgs, successMsgs) {
    this.props.history.push("/login");
  }
  next(model) {
    this.setState({ step: 2, model });
  }
  back(errors, model) {
    this.setState({ step: 1, errors, model });
  }
  submit(model, uid) {
    this.setState({ step: 3, model, uid });
  }
  login() {
    this.props.history.push("/login");
  }
  render() {
    const { uid } = this.state;
    console.log("MY PROPS-->", this.props);
    console.log("MY state-->", this.state);
    console.log("MY ID-->", this);
    return (
      <div className="container-fluid container-light">
        <div className="container">
          <div className="content-container">
            <div className="section section-signup">
              <div className="section-inner">
                <div className="widget widget-progress">
                  <div className="widget-inner">
                    <ul className="progress-steps steps-2">
                      {[1, 2].map($i => {
                        return (
                          <li
                            key={$i}
                            className={
                              this.state.step == $i
                                ? "active"
                                : this.state.step > $i
                                ? "done"
                                : "disabled"
                            }
                          >
                            <a href="#">{$i}</a>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
                {(() => {
                  if (this.state.step == 1) {
                    return (
                      <SignUpS1
                        model={this.state.model}
                        state={this.state}
                        errors={this.state.errors}
                        onNext={this.next.bind(this)}
                      />
                    );
                  }
                  if (this.state.step == 2) {
                    return (
                      <SignUpS2
                        model={this.state.model}
                        onBack={this.back.bind(this)}
                        onSubmit={this.submit.bind(this)}
                      />
                    );
                  }
                  return <Congrats onLogin={this.login.bind(this)} uid={uid} />;
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function Congrats(props) {
  const { uid } = props;
  return (
    <div className="widget widget-postForm text-success m-auto text-center">
      <div className="widget-inner">
        <div className="postForm-title">
          <h1>Congratulations</h1>
        </div>
        <div className="postForm-icon">
          <span>
            <i className="far fa-check-circle"></i>
          </span>
        </div>
        <div className="postForm-msg">
          <p>
            Your request for company registration against application ID{" "}
            {uid ? uid.substr(0, 3) + uid.substr(uid.length - 3) : ""} has been
            submitted successfully.
          </p>
        </div>
        <div className="postForm-action">
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={props.onLogin}
          >
            LOGIN
          </button>
        </div>
      </div>
    </div>
  );
}
