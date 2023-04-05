import React from "react";

import {
  DataContext,
  Redirect,
  ContextForm,
  Input,
  Validateable
} from "../../Common";
import Error from "../../HttpError";
import api from "../../../config/app";
let ApplicationStatus = __app.LOOKUP.ApplicationStatus;
export default class Fees extends Validateable {
  constructor(props) {
    super(props, {
      challanNo: { required: "This field is required" },
      challanCopy: { required: "This field is required" }
    });
    this.state = {
      step: 1,
      model: {},
      redirectToBranch: false
      // model: tempModel,
    };
    // this.iframe = React.createRef();
    this.handleWinMessage = this.handleWinMessage.bind(this);
    window.addEventListener("message", this.handleWinMessage, false);
  }

 renewBranch(){
        this.setState({redirectToBranch:true});
        //this.props.history.push('/branch/renew')
    }
    
  handleWinMessage(e) {
    if (e.data.view === "payment") {
      if (e.data.status === "opened") {
        setTimeout(() => {
          // this.iframe.current.getElementsByTagName('iframe')[0].contentDocument.body.innerHTML = '<h3 style="padding: 15px;">Loading...</h3>';
          document.body.classList.add("busy");
          //  document.getElementById('app').scrollTop = 0;
          //  this.iframe.current.classList.add("popped-out");
          //  this.iframe.current.classList.remove("minimized");
        }, 0);
      } else {
        document.body.classList.remove("busy");
        if (e.data.status === "success") {
          window.removeEventListener("message", this.handleWinMessage, false);
          if (
            this.company &&
            this.company.branch &&
            this.company.branch.status_id == ApplicationStatus.PAYMENT_PENDING
          ) {
            this.company.branch.status_id = ApplicationStatus.New;
          }
          this.setState({ status: "success" });
        } else if (e.data.status === "paid") {
          window.removeEventListener("message", this.handleWinMessage, false);
          // this.props.history.push('/');
        }
      }
    }
  }
  componentWillUnmount() {
    window.removeEventListener("message", this.handleWinMessage, false);
  }
  next() {
    this.setState({ step: this.state.step + 1 });
  }
  /* fetchPaymentDetail() {
    let id = _.get(this.props, "match.params.id", "");
    console.log("ID_->", id);
    api.get("/branch/" + id).then(res => {
      if (res.status_id == ApplicationStatus.APPROVED) {
        console.log("RESPONSE", res);
        console.log("this.props.history", this.props.history);
        //return this.props.history.goBack();
      }
    //   this.setState({ payment: res });
    });
  } */
  fetchPaymentDetail() {
    let id = _.get(this.props, "match.params.id", "");
    api.get("/branch/" + id + "/payment").then(res => {
      if (res.status_id == ApplicationStatus.APPROVED) {
        // return this.props.history.goBack();
      }
      this.setState({ payment: res.payment,branch: res.data,attachment: res.attachment });
    });
  }
  showPaymentPopup() {
    if (this.props.preview) {
      popupWindow(
        url(
          "/checkout/" +
            (this.props.subBranch ? "sub-" : "") +
            "branch/after-review"
        ),
        "BLMIS Fee Payment",
        1200,
        600
      );
    } else {
      let id = _.get(this.props, "match.params.id", "");
      popupWindow(
        url("/checkout/payment/branch/" + id),
        "BLMIS Fee Payment",
        1200,
        600
      );
    }
  }
  handleManualPayment() {
    if (this.validator.validate()) {
      console.log("FEES L# 76");
      if (this.props.preview) {
        if (this.props.onManualPayment) {
          console.log("FEES L# 76");
          document.body.classList.add("busy");
          this.props.onManualPayment(
            this.state.model,
            () => {
              //success callback
              document.body.classList.remove("busy");
              this.setState({ status: "success" });
            },
            errors => {
              //error callback
              this.setState({ errors });
              document.body.classList.remove("busy");
            }
          );
        }
      } else {
        console.log("FEES L# 93 ELSE");
        document.body.classList.add("busy");
        let id = _.get(this.props, "match.params.id", "");
        api.post("payment/branch/" + id, { ...this.state.model }).then(res => {
          document.body.classList.remove("busy");
          if (res.success) {
            console.log("FEES L# 99");
            console.log("RES DATA,", res);
            if (
              this.company &&
              this.company.branch &&
              this.company.branch.status_id == ApplicationStatus.PAYMENT_PENDING
            ) {
              this.company.branch.status_id = ApplicationStatus.New;
            }
            this.setState({ status: "success" });
          } else {
            this.setState({ errors: res.errors });
          }
        });
      }
    }
  }
  render() {

    let {redirectToBranch} = this.state;
    if(redirectToBranch) {
      //this.props.history.push('/branch/renew')
      return <Redirect to={{pathname:`/branch/renew`, state: { editRenewal:true,attachment: this.state.attachment }}}/>;
    }

    console.log("DATA NEW-->", this);
    console.log("DATA NEW PROPS-->", this.props);
    console.log("DATA NEW STATE-->", this.state);
    console.log("this.state.payment -->", this.state.payment);
    console.log("this.props.preview -->", this.props.payment);
    if (!this.state.payment && !this.props.preview) {
      console.log("this.state.payment -->", this.state.payment);
      console.log("this.props.preview -->", this.props.payment);
      this.fetchPaymentDetail();
      return null;
    }
    if (this.state.status === "success") {
       console.log("OLDs COMPANTY-->>",this.props.profile);
          if (this.props.uid) {
              return (
                <Congrats
                  //test data
                    //id={this.props.uid}
                    id={this.props.uid}
                    name ={this.props.payment.entity_type}
                    branch ={this.props.branch}
                />
                );
            }else if (this.props.subBranch) {
              return (
                <Congrats
                  //test data
                    id=''
                    name ='branch'
                    branch ={this.props.subBranch}
                />
                );
            }else if (this.state.payment.uid) {
              return (
                <Congrats
                  //test data
                    id={this.state.branch.uid}
                    name ={this.state.payment.entity_type}
                    branch ={this.state.branch}
                />
                );
            }else {
              return (
                <Congrats
                  //test data
                    id={this.props.profile.company.uid}
                />
                );
          }
    } else {
      return (
        <DataContext.Consumer>
          {company => {
            this.company = company;
            return PayFee.call(this, {
              payment: this.state.payment || this.props.payment,
              preview: this.props.preview,
              onBack: this.props.onBack
            });
          }}
        </DataContext.Consumer>
      );
    }
  }
}

function PayFee(props) {
  let id = _.get(this.props, "match.params.id", "");
  if (!props.payment.entity_id && !props.preview) {
    return <Error />;
  }
  if (
    props.payment.status_id == ApplicationStatus.APPROVED ||
    props.payment.status_id == ApplicationStatus.SUBMITTED
  ) {
    return <Redirect to="/" />;
  }
  return (
    <div className="iframe-container">
      <div className="iframe-outer">
        <div className="form-heading  officer-heading">
          <h3>Payment Information</h3>
          <div>
            <span className="float-left text-muted small">
              Pay with debit and credit card
            </span>
          </div>
        </div>
        <div className="jumbotron">
          <p className="jumbotron-text">TOTAL FEE FOR ONE YEAR OF</p>
          <h1>
            {props.payment.entity_type == "renewal" ? "Renewal" : "Permission"}{" "}
            <span className="float-right">
              US$ {props.payment.usd_amount || props.payment.usd}
            </span>
          </h1>
          <h4>
            <span className="float-right">
              Estimated Equivalent value in PKR{" "}
              {props.payment.pkr_amount || props.payment.pkr}
            </span>
          </h4>
        </div>
      </div>

      <ul className="nav nav-tabs">
        <li className="nav-item">
          <a
            className=""
            data-toggle="tab"
            href="#pay-manual"
            role="tab"
            aria-selected="false"
          >
            Pay in Bank Account
          </a>
        </li>
      </ul>

      <div className="tab-content tab-content-front form-group">
        <div className="tab-pane" id="pay-creditcard">
          <div className="row">
            <div className="col">
              {props.preview ? (
                <div className="form-group">
                  <div className="form-group float-left">
                    <button
                      type="button"
                      className="btn btn-light"
                      onClick={props.onBack}
                    >
                      <i className="fas fa-long-arrow-alt-left"></i> Back
                    </button>
                  </div>
                  <div className="form-group float-right">
                    <button
                      className="btn btn-primary"
                      onClick={this.showPaymentPopup.bind(this)}
                    >
                      Pay
                    </button>
                  </div>
                </div>
              ) : (
                <div className="form-group">
                  <button
                    className="btn btn-primary"
                    onClick={this.showPaymentPopup.bind(this)}
                  >
                    Pay
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <ContextForm target={this}>
          <div className="tab-pane active" id="pay-manual">
            <div className="row">
              <div className="col">
                <div className="form-group">
                  <label htmlFor="challanNo">
                    Bank Challan Number{" "}
                    <span className="required-mark text-danger"> *</span>
                  </label>
                  <div className="">
                    <Input
                      type="text"
                      autoComplete="off"
                      id="challanNo"
                      name="challanNo"
                      className="form-control required"
                      placeholder="123456"
                    />
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="form-group">
                  <label htmlFor="challan_copy">
                    Orignal receipt of processing fee{" "}
                    <span className="required-mark text-danger"> *</span>
                  </label>
                  <div className="custom-file">
                    <Input
                      as="tempUpload"
                      type="file"
                      className="custom-file-input"
                      id="challan_copy"
                      name="challanCopy"
                    />
                    <label className="custom-file-label" htmlFor="challan_copy">
                      {_.get(this.state.model, "challanCopy.filename", "")}
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {props.preview ? (
              <div className="form-group">
                <div className="form-group float-left">
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={props.onBack}
                  >
                    <i className="fas fa-long-arrow-alt-left"></i> Back
                  </button>
                </div>
                <div className="form-group float-right">
                  <button
                    className="btn btn-primary"
                    onClick={this.handleManualPayment.bind(this)}
                  >
                    Submit
                  </button>
                </div>
              </div>
            ) : (
              <div className="form-group">
                <div className="form-group float-left">                  
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={this.renewBranch.bind(this)}
                  >
                    <i className="fas fa-long-arrow-alt-left"></i> Back
                  </button>
                </div>
                <div className="form-group float-right">
                  <button
                    className="btn btn-primary"
                    onClick={this.handleManualPayment.bind(this)}
                  >
                    Submit
                  </button>
                </div>
              </div>
            )}
          </div>
        </ContextForm>
      </div>

      {/* <div className="iframe-wrapper minimized" ref={this.iframe}>
                <iframe src={url('/checkout/payment/branch/' + id)}></iframe>
            </div> */}
    </div>
  );
}

function Congrats(props) {
   const { id, name, branch } = props;
  //console.log("ID", id.substr(0, 3) + id.substr(id.length - 3))
  console.log("Branch noman ",branch);
  let type = '';
  if(branch.service_type_id==4){
     type = 'Liaison Office';
  }else if(branch.service_type_id==1){
     type = 'Branch Office';
  }else if(branch==true){
     type = 'Sub Branch/Liaison Office';
  }else if(branch.service_type_id==3){
     type = 'Branch Office';
  }else if(branch.service_type_id==5){
     type = 'Sub-Liaison Office';
  }else if(branch.service_type_id==6){
     type = 'Liaison Office';
  }else{
      type = 'Liaison Office'; 
  }

  if(branch.renewal_request && name=='renewal'){
     
    return (
    <div className="widget widget-postForm text-success m-auto text-center">
      <div className="widget-inner__">
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
            Your request for {name} of {type} for period of 
              {` ${branch.renewal_request.renewal_period} `} years against application ID{" "}
            <span className="subtitle">
              {id ? id.substr(0, 3) + id.substr(id.length - 3) : ""}{" "}
            </span> has been submitted successfully.
            
          </p>
        </div>
        <div className="postForm-action form-group">
          <a className="btn btn-primary btn-lg" href={url("/branch")}>
            My {type} 
          </a>
        </div>
      </div>
    </div>
  );

  }else if(branch==true){
     
    return (
    <div className="widget widget-postForm text-success m-auto text-center">
      <div className="widget-inner__">
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
            Your request for {`${type} `}  
               registration has been submitted successfully.
          </p>
        </div>
        <div className="postForm-action form-group">
          <a className="btn btn-primary btn-lg" href={url("/sub-branch")}>
            My {type} 
          </a>
        </div>
      </div>
    </div>
  );

  }else{

     return (
    <div className="widget widget-postForm text-success m-auto text-center">
      <div className="widget-inner__">
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
            Your request for {`${type} `} against application ID{" "}
            <span className="subtitle">
              {id ? id.substr(0, 3) + id.substr(id.length - 3) : ""}{" "}
            </span>
            registration has been submitted successfully.
          </p>
        </div>
        <div className="postForm-action form-group">
          <a className="btn btn-primary btn-lg" href={url("/branch")}>
            My {type} 
          </a>
        </div>
      </div>
    </div>
  );
  }
}
