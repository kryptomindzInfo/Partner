/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 */
import React, { Component } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet';

import { toast } from 'react-toastify';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

import Wrapper from 'components/Wrapper';
import CashierHeader from 'components/Header/CashierHeader';
import CashierWallets from 'components/Sidebar/CashierWallets';
import Container from 'components/Container';
import Popup from 'components/Popup';
import CashierSidebarInfo from 'components/Sidebar/CashierSidebarInfo';
import Main from 'components/Main';
import ActionBar from 'components/ActionBar';
import A from 'components/A';
import Card from 'components/Card';
import Button from 'components/Button';
import FormGroup from 'components/FormGroup';
import TextInput from 'components/TextInput';
import SelectInput from 'components/SelectInput';
import UploadArea from 'components/UploadArea';
import Row from 'components/Row';
import Col from 'components/Col';
import Loader from 'components/Loader';

import { API_URL, STATIC_URL, CONTRACT_URL, CURRENCY } from '../App/constants';

import 'react-toastify/dist/ReactToastify.css';
toast.configure({
  position: 'bottom-right',
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
});

const Tab = styled.div`
background: #417505;
width: 194px;
padding: 15px;
float:left;
border: 1px solid  #417505;
color: #fff;
font-size: 20px;
`;
const Tab2 = styled.div`
float:left;
width: 194px;
border: 1px solid  #417505;
color: #417505;
font-size: 20px;
padding: 15px;
`;

const token = localStorage.getItem('cashierLogged');
const bid = localStorage.getItem('cashierId');
const logo = localStorage.getItem('bankLogo');
const email = localStorage.getItem('cashierEmail');
const mobile = localStorage.getItem('cashierMobile');
const cashierId = localStorage.getItem('cashierId');
export default class CashierInfo extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      otp: '',
      popup: false,
      showOtp: false,
      token,
      otpEmail: email,
      otpMobile: mobile
    };
    this.success = this.success.bind(this);
    this.error = this.error.bind(this);
    this.warn = this.warn.bind(this);
    this.showMiniPopUp = this.showMiniPopUp.bind(this);

    this.onChange = this.onChange.bind(this);
    this.fileUpload = this.fileUpload.bind(this);
  }

  success = () => toast.success(this.state.notification);

  error = () => toast.error(this.state.notification);

  warn = () => toast.warn(this.state.notification);

  countryChange = event => {
    const { value, name } = event.target;
    const title = event.target.options[event.target.selectedIndex].title;

    this.setState({
      [name]: value,
      ccode: title
    });
  };
  handleInputChange = event => {
    const { value, name } = event.target;
    this.setState({
      [name]: value,
    });
  };


  editBank = event => {

    event.preventDefault();
    if(this.state.logo == null || this.state.logo == ''){
      this.setState({
        notification: "You need to upload a logo"
      }, () =>{
        this.error();
      });
    }
    else if(this.state.contract == null || this.state.contract == ''){
      this.setState({
        notification: "You need to upload a contract"
      }, () =>{
        this.error();
      });
    }
    else{
      this.setState({
        editBankLoading: true
      });
      this.setState({
        showOtp: true
      }, () =>{
        this.generateOTP();
        this.setState({
          editBankLoading: false
        });
      });
    }
  };
  showEditPopup = (v) => {
    this.setState({ editPopup: true });
  };
  blockBranch = () =>{
    if(this.state.status == 1){
      var s = -1;
    }else{
      var s = 1;
    }
    var dis = this;
    axios
    .post(`${API_URL  }/updateStatus`, {
      token,
      type_id: this.state.cashier_id,
      status : s,
      page: 'cashier',
      type: 'bank'
    })
    .then(res => {
      if(res.status == 200){
        if(res.data.error){
          throw res.data.error;
        }else{
          var n = (s == 1) ? 'Unblocked' : 'Blocked';
          this.setState({
            notification: 'Cashier ' + n
          });
          this.success();
          this.getBranches();
        }
      }else{
        const error = new Error(res.data.error);
        throw error;
      }
    })
    .catch(err => {
      this.setState({
        notification: (err.response) ? err.response.data.error : err.toString()
      });
      this.error();
    });

  };
  editCashier = event => {
    event.preventDefault();

      this.setState(
        {
          showEditOtp: true,
          otpOpt: 'editCashier',
          otpTxt: 'Your OTP to edit Cashier is '
        },
        () => {
          this.generateOTP();
        },
      );

  };
  startTimer = () => {
    var dis = this;
    var timer = setInterval(function() {
      if (dis.state.timer <= 0) {
        clearInterval(timer);
        dis.setState({ resend: true });
      } else {
        var time = Number(dis.state.timer) - 1;
        dis.setState({ timer: time });
      }
    }, 1000);
  };

  generateOTP = () => {
    this.setState({ resend: false, timer: 30 });

    axios
      .post(`${API_URL}/sendOTP`, {
        email: this.state.otpEmail,
        mobile: this.state.otpMobile,
        page: this.state.otpOpt,
        type: 'cashier',
        txt: this.state.otpTxt,
        token,
      })
      .then(res => {
        if (res.status == 200) {
          if (res.data.error) {
            throw res.data.error;
          } else {
            this.setState({
              otpId: res.data.id,
              showEditOtp: true,
              notification: 'OTP Sent',
            });
            this.startTimer();
            this.success();
          }
        } else {
          throw res.data.error;
        }
      })
      .catch(err => {
        this.setState({
          notification: err.response ? err.response.data.error : err.toString(),
        });
        this.error();
      });
  };
  verifyEditOTP = event => {
    this.setState({
      verifyEditOTPLoading: false
    });
    event.preventDefault();
    axios
      .post(`${API_URL  }/editCashier`, this.state)
      .then(res => {
        if(res.status == 200){
          if(res.data.error){
            throw res.data.error;
          }else{
            this.setState({
              notification: "Cashier updated successfully!",
            }, function(){
              this.success();
              this.closePopup();
              this.getBranches();
            });
          }
        }else{
          const error = new Error(res.data.error);
          throw error;
        }
        this.setState({
          verifyEditOTPLoading: false
        });
      })
      .catch(err => {
        this.setState({
          notification: (err.response) ? err.response.data.error : err.toString(),
          verifyEditOTPLoading:false
        });
        this.error();
      });
  };

  closePopup = () => {
    this.setState({
      editPopup: false,
      showEditOtp: false
    });
  };

  editBranch = event => {
    this.setState({
      editBranchLoading: true
    });
    event.preventDefault();
    axios
      .post(`${API_URL  }/editBranch`, {
        name: this.state.name,
        bcode: this.state.bcode,
        username: this.state.username,
        credit_limit: this.state.credit_limit,
        address1: this.state.address1,
        state: this.state.state,
        zip: this.state.zip,
        country: this.state.country,
        ccode: this.state.ccode,
        email: this.state.email,
        mobile: this.state.mobile,
        cashier_id: this.state.cashier_id,
        token,
      })
      .then(res => {
        if(res.status == 200){
          if(res.data.error){
            throw res.data.error;
          }else{
            this.setState({
              notification: "Bank updated successfully!",
            }, function(){
              this.success();
              this.closePopup();
              this.getBranches();
            });
          }
        }else{
          const error = new Error(res.data.error);
          throw error;
        }
        this.setState({
          editBranchLoading: false
        });
      })
      .catch(err => {
        this.setState({
          notification: (err.response) ? err.response.data.error : err.toString(),
          editBranchLoading:false
        });
        this.error();
      });
  };

  showMiniPopUp = event => {
    this.setState({ popup: true });
    var id = event.target.getAttribute("data-id");
    var d =  event.target.getAttribute("data-d");
    console.log(id);
    var dd = d.split("^");
    this.setState({ popname: dd[0], poptype: dd[1], poprange: dd[2], poppercent: dd[3], sid: id });
    //this.props.history.push('/createfee/'+this.state.bank_id);
  };

  closeMiniPopUp = () => {
    this.setState({
      popup: false,
      name: '',
      address1: '',
      state: '',
      zip: '',
      ccode: '',
      country: '',
      email: '',
      mobile: '',
      logo: null,
      contract: null,
      otp: '',
      showOtp: false
    });
  };

  logout = () => {
    // event.preventDefault();
    // axios.post(API_URL+'/logout', {token: token})
    // .then(res => {
    //    if(res.status == 200){
    localStorage.removeItem("logged");
    localStorage.removeItem("name");
    this.setState({ redirect: true });
    //     }else{
    //       const error = new Error(res.data.error);
    //       throw error;
    //     }
    // })
    // .catch(err => {
    //   alert('Login to continue');
    //   this.setState({ redirect: true });
    // });
  };


  showWallet = event => {
    event.preventDefault();

  };

  verifyOTP = event => {
    event.preventDefault();
    axios
      .post(`${API_URL  }/addBank`, {
        name: this.state.name,
        address1: this.state.address1,
        state: this.state.state,
        zip: this.state.zip,
        country: this.state.country,
        ccode: this.state.ccode,
        email: this.state.email,
        mobile: this.state.mobile,
        logo: this.state.logo,
        contract: this.state.contract,
        otp: this.state.otp,
        token,
      })
      .then(res => {
        if(res.status == 200){
          if(res.data.error){
            throw res.data.error;
          }else{
            this.setState({
              notification: "Bank added successfully!",
            });
            this.success();
            this.closeMiniPopUp();
            this.getBranches();
          }
        }else{
          const error = new Error(res.data.error);
          throw error;
        }
      })
      .catch(err => {
        this.setState({
          notification: (err.response) ? err.response.data.error : err.toString()
        });
        this.error();
      });
  };


  removeFile = key => {
    this.setState({
      [key]: null,
    });
  };

  triggerBrowse = inp => {
    const input = document.getElementById(inp);
    input.click();
  };

  onChange(e) {
    if (e.target.files && e.target.files[0] != null) {
      this.fileUpload(e.target.files[0], e.target.getAttribute("data-key"));
    }
  }

  fileUpload(file, key) {
    this.setState({
      [key] : 'main/loader.gif'
    });
    const formData = new FormData();
    //  formData.append('token',token);
    formData.append('file', file);
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      },
    };
    var method = "fileUpload";
    if(key == 'contract'){
      method = "ipfsUpload";
    }
    axios
      .post(`${API_URL  }/${method}?token=${  token}`, formData, config)
      .then(res => {
        if(res.status == 200){
          if(res.data.error){
            throw res.data.error;
          }else{
            this.setState({
              [key] : res.data.name
            });
          }
        }else{
          throw res.data.error;
        }
      })
      .catch(err => {
        this.setState({
          notification: (err.response) ? err.response.data.error : err.toString(),
          [key] : ''
        });
        this.error();
      });
  }


  getBranches = () => {
    axios
      .post(`${API_URL}/partnerCashier/getDetails`, {token:token })
      .then(res => {
        if(res.status == 200){
          console.log(res);
          this.setState({ loading: false, banks: res.data.cashier, name: res.data.cashier.name, bcode: res.data.cashier.code, working_from: res.data.cashier.working_from, working_to: res.data.cashier.working_to, per_trans_amt: res.data.cashier.per_trans_amt, max_trans_count: res.data.cashier.max_trans_count, max_trans_amt: res.data.cashier.max_trans_amt, cashier_id: res.data.cashier._id, mobile: res.data.user.mobile, username: res.data.user.username, ccode: res.data.user.ccode, email: res.data.user.email, });
        }
      })
      .catch(err => {

      });
  };

  getRules = () => {
    axios
      .post(`${API_URL  }/getBankRules`, { bank_id: this.state.bank })
      .then(res => {
        if(res.status == 200){

          this.setState({ loading: false, rules: res.data.rules });
        }
      })
      .catch(err => {

      });
  };
  edit = () => {
    console.log("edit triggered");
  };
  block = () => {
    console.log("block triggered");
  };
  showPopup = () => {
    //, name: res.data.row.name, address1: res.data.row.address1, state: res.data.row.state, zip: res.data.row.zip, country: res.data.row.country, ccode: res.data.row.ccode, mobile: res.data.row.mobile, email: res.data.row.email, logo: res.data.row.logo, contract: res.data.row.contract, username: res.data.row.username, bank_id: res.data.row._id
    this.setState({ popup: true});
  };



  componentDidMount() {
    this.setState({ cashier_id: cashierId }, () => {
        this.getBranches();
    });

  }


  render() {
    console.log(this.props);
    function inputFocus(e) {
      const { target } = e;
      target.parentElement.querySelector("label").classList.add("focused");
    }

    function inputBlur(e) {
      const { target } = e;
      if (target.value == '') {
        target.parentElement.querySelector('label').classList.remove('focused');
      }
    }

    const { loading, redirect } = this.state;
    if (loading) {
      return <Loader fullPage />;
    }
    if (redirect) {
      return null;
    }
    const dis = this;
    return (

      <Wrapper  from="bank">
        <Helmet>
          <meta charSet="utf-8" />
          <title>Partner | CASHIERS | E-WALLET</title>
        </Helmet>
        <CashierHeader active="cashier" middleTitle={this.state.name} page="branch" goto={"/cashier/"+this.props.match.params.bank+"/dashboard"} bankName={this.props.match.params.bank} bankLogo={STATIC_URL+logo} />
        <Container verticalMargin>

          <CashierSidebarInfo active="info" blockTxt={this.state.status} edit={this.showEditPopup.bind(this)} block={this.blockBranch.bind(this)} bankName={this.props.match.params.bank}/>
          <Main>

            <CashierWallets limit={Number(this.state.banks.max_trans_amt)-Number(this.state.banks.cash_paid)+Number(this.state.banks.cash_received)} paid={this.state.banks.cash_paid} received={this.state.banks.cash_received}  inHand={this.state.banks.cash_in_hand} />

          <Card bigPadding bordered>

            <div className="cardBody">
              <Row>
                <Col className="infoLeft">
                Cashier Name
                </Col>
                <Col className="infoRight">
                {this.state.name}
                </Col>
              </Row>

              <Row>
                <Col className="infoLeft">
                Cashier Code
                </Col>
                <Col className="infoRight">
                {this.state.bcode}
                </Col>
              </Row>

              <Row>
                <Col className="infoLeft">
                Cashier User ID
                </Col>
                <Col className="infoRight">
                {this.state.username}
                </Col>
              </Row>

              <Row>
                <Col className="infoLeft">
                Country Code
                </Col>
                <Col className="infoRight">
                {this.state.ccode}
                </Col>
              </Row>

              <Row>
                <Col className="infoLeft">
                Email
                </Col>
                <Col className="infoRight">
                {this.state.email}
                </Col>
              </Row>

              <Row>
                <Col className="infoLeft">
                Phone Number
                </Col>
                <Col className="infoRight">
                {this.state.mobile}
                </Col>
              </Row>



            </div>
          </Card>
          </Main>
        </Container>
        { this.state.editPopup ?
          <Popup close={this.closePopup.bind(this)} accentedH1>
            {
              this.state.showEditOtp ?
              <div>
              <h1 ><FormattedMessage {...messages.verify} /></h1>
            <form action="" method="post" onSubmit={this.verifyEditOTP} >
              <FormGroup>
                <label><FormattedMessage {...messages.otp} />*</label>
                <TextInput
                  type="text"
                  name="otp"
                  onFocus={inputFocus}
                  onBlur={inputBlur}
                  value={this.state.otp}
                  onChange={this.handleInputChange}
                  required
                />
              </FormGroup>
              {
                this.verifyEditOTPLoading ?
                <Button filledBtn marginTop="50px" disabled>
                  <Loader />
                </Button>
                :
                <Button filledBtn marginTop="50px">
                  <span><FormattedMessage {...messages.verify} /></span>
                </Button>
              }

              <p className="resend">
                Wait for <span className="timer">{this.state.timer}</span>{' '}
                to{' '}
                {this.state.resend ? (
                  <span className="go" onClick={this.generateOTP}>
                    Resend
                  </span>
                ) : (
                  <span>Resend</span>
                )}
              </p>
              </form>
              </div>
              :
              <div>
            <h1 >Edit Cashier</h1>
            <form action="" method="post" onSubmit={this.editCashier}>
            <FormGroup>
                <label>Cashier Name*</label>
                <TextInput
                  type="text"
                  name="name"
                  onFocus={inputFocus}
                  onBlur={inputBlur}
                  autoFocus
                  value={this.state.name}
                  onChange={this.handleInputChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <label>Cashier Code*</label>
                <TextInput
                  type="text"
                  autoFocus
                  name="bcode"
                  onFocus={inputFocus}
                  onBlur={inputBlur}
                  value={this.state.bcode}
                  onChange={this.handleInputChange}
                  required
                />
              </FormGroup>
              <label>Working Hours</label>
              <Row>

                <Col  cW="30%" mR="2%">

                <FormGroup>
                <label>From*</label>
                  <TextInput
                    type="text"
                    autoFocus
                    name="working_from"
                    onFocus={inputFocus}
                    onBlur={inputBlur}
                    value={this.state.working_from}
                    onChange={this.handleInputChange}
                    required
                  />
                  </FormGroup>

                </Col>
                <Col cW="68%">
                <FormGroup>
                  <label>To*</label>
                  <TextInput
                    type="text"
                    autoFocus
                    title="10 Digit numeric value"
                    name="working_to"
                    onFocus={inputFocus}
                    onBlur={inputBlur}
                    value={this.state.working_to}
                    onChange={this.handleInputChange}
                    required
                  />
                  </FormGroup>

                </Col>
                </Row>
              <FormGroup>
                <label>Maximum per transaction amount*</label>
                <TextInput
                  type="text"
                  name="per_trans_amt"
                  autoFocus
                  onFocus={inputFocus}
                  onBlur={inputBlur}
                  value={this.state.per_trans_amt}
                  onChange={this.handleInputChange}
                  required
                />
              </FormGroup>
              {/* <FormGroup>
                <label>Maximum daily transaction amount*</label>
                <TextInput
                  type="text"
                  name="max_trans_amt"
                  onFocus={inputFocus}
                  onBlur={inputBlur}
                  autoFocus
                  value={this.state.max_trans_amt}
                  onChange={this.handleInputChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <label>Maximum daily transaction count*</label>
                <TextInput
                  type="text"
                  name="max_trans_count"
                  onFocus={inputFocus}
                  onBlur={inputBlur}
                  value={this.state.max_trans_count}
                  autoFocus
                  onChange={this.handleInputChange}
                  required
                />
              </FormGroup> */}
                    {
                      this.state.editBranchLoading ?
                      <Button filledBtn marginTop="50px" disabled>
                        <Loader />
                      </Button>
                      :
                      <Button filledBtn marginTop="50px">
                      <span>Update Cashier</span>
                    </Button>
                    }

            </form>
            </div>
            }
          </Popup>
          : null }
      </Wrapper>
    );
  }
}
