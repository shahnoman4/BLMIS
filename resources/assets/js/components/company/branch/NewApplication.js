import React from "react";

import { newApplicationModel as tempModel } from "./application/data";
import Step1 from "./application/ApplicationS1";
import Step2 from "./application/ApplicationS2";
import Step3 from "./application/ApplicationS3";
import Step4 from "./application/ApplicationS4";
import Step5 from "./Renewal";
import Preview from "./Profile";
import Fees from "./Fees";
import { DataContext, Redirect } from "../../Common";
import api from "../../../config/app";
import { isMainBranch, isBranch } from "../../../helper/common";

export default class BranchApplication extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 1,
      model: {}
      // model: tempModel,
    };
    this.steps();
    if (this.props.convert) {
      this.state.model.convert = true;
    }
  }
  componentDidMount() {
    api.get("state/branch").then(res => {
      if (!_.isEmpty(res)) {
        let { step, fee, ...model } = res;
        if (model.convert && !this.props.convert) {
          return;
        }
        if ((this.doRenew && step >= 5) || (!this.doRenew && step >= 4)) {
          this.state.review = model;
          this.state.fee = fee;
        }
        this.steps(model.Branch.service_type_id);
        let ServiceType = __app.LOOKUP.ServiceType;
        this.setState({
          step:
            (model.Branch.service_type_id == ServiceType.LIAISON ||
              model.Branch.service_type_id == ServiceType.SUB_LIAISON) &&
            step === 2
              ? step + 2
              : step + 1,
          model
        });
      }
    });
  }
  onTypeChange(e) {
    this.steps(e.target.value);
    this.forceUpdate();
  }
  steps(serviceType) {
    let ServiceType = __app.LOOKUP.ServiceType;
    if (
      serviceType == ServiceType.LIAISON ||
      serviceType == ServiceType.SUB_LIAISON
    ) {
      this.__steps = this.doRenew ? [1, 2, 4, 5] : [1, 2, 4];
      this.__skipS3 = true;
    } else {
      this.__steps = this.doRenew ? [1, 2, 3, 4, 5] : [1, 2, 3, 4];
      this.__skipS3 = false;
    }
  }
  next(model) {
    if (this.state.step === 2 && this.__skipS3) {
      this.state.step++;
    }
    this.setState({ step: this.state.step + 1, model });
  }
  back(errors, model) {
    if (this.state.step === 4 && this.__skipS3) {
      this.state.step--;
    }
    this.setState({ step: this.state.step - 1, errors, model, review: null });
  }

  submit(model, res) {
    console.log("NEW SUBMIT -- >", res);
    if (!this.company.branch || this.props.convert) {
      this.company.branch = res.data;
      if (!this.props.convert && this.company.was_permitted) {
        location.href = url("/branch/renew");
        return;
      }
    }
    this.props.history.push("/branch/fees/" + res.data.id);
  }
  beforeSubmit(model, res) {
    console.log("BS-->", model, res);
    this.setState({
      review: model,
      fee: res.fee,
      model,
      step: this.state.step + 1
    });
  }
  render() {
    console.log("PROPS #104 -->", this);
    return (
      <DataContext.Consumer>
        {company => {
          let ServiceType = __app.LOOKUP.ServiceType;
          let doCovert = company.branch && this.props.convert;
          this.company = company;
          this.doRenew = this.company.was_permitted && !this.company.branch;
          if (company.status_id !== __app.LOOKUP.ApplicationStatus.APPROVED) {
            return <Redirect to="/branch" />;
          }
          if (doCovert) {
            if (isBranch(company.branch)) {
              this.steps(ServiceType.LIAISON);
            } else {
              this.steps(ServiceType.BRANCH);
            }
          } else if (company.branch) {
            return <Redirect to="/branch" />;
            this.steps(company.branch.service_type_id);
          } else if (this.doRenew) {
            this.steps(_.get(this.state.model, "Branch.service_type_id"));
          }
          return (
            <div className="container-fluid container-light">
              <div className="container">
                <div className="content-container">
                  <div className="section progress-section">
                    <div className="section-inner">
                      <div className="widget widget-progress">
                        <div className="widget-inner">
                          <ul
                            className={
                              "progress-steps steps-" + this.__steps.length
                            }
                          >
                            {this.__steps.map($i => {
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
                            <Step1
                              model={this.state.model}
                              company={company}
                              errors={this.state.errors}
                              onNext={this.next.bind(this)}
                              onTypeChange={this.onTypeChange.bind(this)}
                              convert={doCovert}
                              doRenew={this.doRenew}
                            />
                          );
                        }
                        if (this.state.step == 2) {
                          return (
                            <Step2
                              model={this.state.model}
                              company={company}
                              onNext={this.next.bind(this)}
                              onBack={this.back.bind(this)}
                              onSubmit={this.submit.bind(this)}
                            />
                          );
                        }
                        if (this.state.step == 3) {
                          return (
                            <Step3
                              model={this.state.model}
                              onNext={this.next.bind(this)}
                              onBack={this.back.bind(this)}
                            />
                          );
                        }
                        if (this.state.step == 4) {
                          return (
                            <Step4
                              model={this.state.model}
                              hasNext={this.doRenew}
                              onBack={this.back.bind(this)}
                              onBeforeSubmit={this.beforeSubmit.bind(this)}
                            />
                          );
                        }
                        if (this.state.step == 5 && this.doRenew) {
                          return (
                            <Step5
                              wizard={{ model: this.state.model }}
                              model={this.state.model.Renewal}
                              onBack={() => {
                                this.back(null, this.state.model);
                              }}
                              onBeforeSubmit={model => {
                                this.state.model.Renewal = model;
                                this.beforeSubmit(this.state.model, {
                                  fee: this.state.fee
                                });
                              }}
                            />
                          );
                        }
                        if (this.state.review) {
                          return (
                            <PreviewModel
                              uid={this.company.uid && this.company.uid}
                              application={this.state.review}
                              fee={this.state.fee}
                              onBack={() => {
                                this.setState({ review: null });
                                this.back(null, this.state.model);
                              }}
                            />
                          );
                        }
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        }}
      </DataContext.Consumer>
    );
  }
}

class PreviewModel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      proceedToPayment: false,
      busy: false
    };
  }
  back() {
    this.props.onBack();
  }
  submit() {
    console.log("NEW APPLICATION PROPS ---> ", this.props);
    console.log("NEW APPLICATION STATE ---> ", this.state);
    if (this.props.fee) {
      console.log("IF FEE ---> ", this.props.fee);
      this.setState({ proceedToPayment: true });
    } else {
      this.setState({ busy: true });
      console.log("ELSE FEE ---> ", this.props.application);
      api.post("/branch/before-submit", this.props.application).then(res => {
        console.log("ELSE FEE API ---> ", res);
        this.fee = res.fee;
        this.setState({ busy: false, proceedToPayment: true });
      });
    }
  }
  submitManualPayment(data, onSuccess, onError) {
    this.props.application.Payment = data;
    api.post("/branch/after-review", this.props.application).then(res => {
      if (res.success) {
        onSuccess && onSuccess();
      } else {
        if (res.errors && res.errors.Payment) {
          onError && onError(res.errors.Payment);
        }
      }
    });
  }
  componentDidMount() {
    document.getElementById("app").scrollTop = 0;
  }
  render() {
    console.log("PROPS NEW UID -->", this);
    if (this.state.proceedToPayment) {
      return (
        <Fees
          uid={this.props.uid}
          preview={true}
          payment={this.props.fee || this.fee}
          branch={this.props.application.Branch}
          onBack={() => {
            this.setState({ proceedToPayment: false });
          }}
          onManualPayment={this.submitManualPayment.bind(this)}
        />
      );
    }
    return (
      <div className="preview">
        <h3 className="text-primary">Review Application Before Submit</h3>
        <Preview application={this.props.application} preview={true} />

        <div className="form-footer">
          <div className="form-group float-left">
            <button
              type="button"
              className="btn btn-light"
              onClick={this.back.bind(this)}
            >
              <i className="fas fa-long-arrow-alt-left"></i> Back
            </button>
          </div>
          <div className="form-group float-right">
            <button
              type="button"
              className={"btn btn-primary" + (this.state.busy ? " busy" : "")}
              disabled={this.state.busy}
              onClick={this.submit.bind(this)}
            >
              Proceed to Payment <i className="fas fa-long-arrow-alt-right"></i>
            </button>
          </div>
        </div>
      </div>
    );
  }
}
