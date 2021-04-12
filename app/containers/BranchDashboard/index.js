/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 */
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet';

import { toast } from 'react-toastify';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import Wrapper from 'components/Wrapper';
import A from 'components/A';
import BranchHeader from 'components/Header/BranchHeader';
import PartnerHeader from 'components/Header/PartnerHeader';
import Container from 'components/Container';
import Loader from 'components/Loader';
import Nav from 'components/Header/Nav';
import Welcome from 'components/Header/Welcome';
import SidebarBranch from 'components/Sidebar/SidebarBranch';
import Main from 'components/Main';
import ActionBar from 'components/ActionBar';
import Card from 'components/Card';
import Button from 'components/Button';
import Table from 'components/Table';
import BranchOperationalWallet from 'components/Sidebar//BranchOperationalWallet';
import BranchMasterWallet from 'components/Sidebar//BranchMasterWallet';
import MiniPopUp from 'components/MiniPopUp';
import FormGroup from 'components/FormGroup';
import TextInput from 'components/TextInput';
import Footer from 'components/Footer';
import Row from 'components/Row';
import Col from 'components/Col';
import Popup from 'components/Popup';
import SelectInput from 'components/SelectInput';
import history from 'utils/history.js';
import { API_URL, STATIC_URL, CURRENCY } from '../App/constants';

import 'react-toastify/dist/ReactToastify.css';
toast.configure({
  position: 'bottom-right',
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
});

const Sidebar = styled.aside `
width: 260px;
float:left;
margin-right: ${props => props.marginRight ? '33px' : '0' };
`;

const token = localStorage.getItem('branchLogged');
const bid = localStorage.getItem('branchId');
const logo = localStorage.getItem('bankLogo');
const bankId = localStorage.getItem('bankid');
const email = localStorage.getItem('branchEmail');
const mobile = localStorage.getItem('branchMobile');
const name = localStorage.getItem('branchName');

export default class BranchDashboard extends Component {
  constructor(props) {
    super();
    this.state = {
      token: props.apitype === 'partner' ? localStorage.getItem('partnerLogged') : localStorage.getItem('branchLogged'),
      bid: props.apitype === 'partner' ? props.match.params.id : localStorage.getItem('branchId'),
      bankId: props.apitype === 'partner' ?  localStorage.getItem('partnerId')  : localStorage.getItem('bankid'),
      branchName: props.apitype === 'partner' ?   JSON.parse(localStorage.getItem('selectedBranch')).name  : '',
      apiType:props.apitype,
      otpEmail: email,
      bankName: localStorage.getItem('bankName'),
      bankLogo: localStorage.getItem('bankLogo'),
      otpMobile: mobile,
      feeGenerated: 0,
      openingBalance: 0,
      pendingtransStatus:'',
      commissionGenerated: 0,
      invoicePaid:0,
      amountPaid:0,
      cashPaid: 0,
      pending: 0,
      accepted: 0,
      cancelled: 0,
      cashReceived: 0,
      totalCashier: 0,
      cashInHand: 0,
      perPage: 20,
      totalCount: 100,
      allhistory: [],
      activePage: 1,
      active: 'Active',
      trans_from: '',
      trans_to: '',
      transcount_from: '',
      history: [],
      filter: '',
    };
    this.success = this.success.bind(this);
    this.error = this.error.bind(this);
    this.warn = this.warn.bind(this);

    this.onChange = this.onChange.bind(this);
    this.fileUpload = this.fileUpload.bind(this);
  }

  success = () => toast.success(this.state.notification);

  error = () => toast.error(this.state.notification);

  warn = () => toast.warn(this.state.notification);

  handleInputChange = event => {
    const { value, name } = event.target;
    this.setState({
      [name]: value,
    });
  };
  showHistoryPop = v => {
    this.setState({
      historyPop: true,
      historyLoading: true,
      popmaster: v.master_code,
    });
    this.getTransHistory(v.master_code);
  };

  showPending = v => {
    console.log(v);
    this.setState({
      selectedCashier: v,
      pendingPop: true,
      historyLoading: true
    });
    this.getPendingHistory(v);
  };
  showPopup = () => {
    this.setState({ popup: true });
  };
  showEditPopup = v => {
    this.setState({
      editPopup: true,
      name: v.name,
      bcode: v.bcode,
      working_from: v.working_from,
      working_to: v.working_to,
      per_trans_amt: v.per_trans_amt,
      max_trans_amt: v.max_trans_amt,
      max_trans_count: v.max_trans_count,
      cashier_id: v._id,
    });
  };

  showPendingDetails = (id, items,type,interbank,status) => {

    var dis = this;
    for (var key in items) {
      if (items.hasOwnProperty(key)) {
        console.log(key + " -> " + items[key]);
        this.setState({
          [key]: items[key]
        });

      }
      this.setState({
        type : type,
        interbank : interbank,
        pendingtransStatus: status,
      });
    }
    this.setState({
      selectedId: id,
      popupClaimMoney: true
    });
  };
  closePopup = () => {
    this.setState({
      popup: false,
      editPopup: false,
      assignPop: false,
      historyPop: false,
      pendingPop: false,
      popupClaimMoney: false,
      name: '',
      address1: '',
      state: '',
      zip: '',
      bcode: '',
      country: '',
      email: '',
      mobile: '',
      credit_limit: '',
      otp: '',
      showOtp: false,
      showEditOtp: false,
    });
  };
  showMiniPopUp = (b, r) => {
    this.setState({
      popname: b.name,
      poptype: b.trans_type,
      sid: b._id,
      popup: true,
      html: r,
    });
    //this.props.history.push('/createfee/'+this.state.branch_id);
  };

  closeMiniPopUp = () => {
    this.setState({
      popup: false,
    });
  };
  countryChange = event => {
    const { value, name } = event.target;
    const title = event.target.options[event.target.selectedIndex].title;

    this.setState({
      [name]: value,
      ccode: title,
    });
  };

  logout = () => {
    localStorage.removeItem('logged');
    localStorage.removeItem('name');
    this.setState({ redirect: true });
  };

  addBranch = event => {
    event.preventDefault();

    this.setState({
      addBranchLoading: true,
    });

    axios
      .post(`${API_URL}/addBranch`, {
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
        token,
      })
      .then(res => {
        if (res.status == 200) {
          if (res.data.status === 0) {
            throw res.data.message;
          } else {
            this.setState({
              notification: 'Branch added successfully!',
            });
            this.success();
            this.closePopup();
            //this.getBanks();
          }
        } else {
          const error = new Error(res.data.error);
          throw error;
        }
        this.setState({
          addBranchLoading: false,
        });
      })
      .catch(err => {
        this.setState({
          notification: err.response ? err.response.data.error : err.toString(),
          addBranchLoading: false,
        });
        this.error();
      });
  };

  showAssignPopup = v => {
    this.setState({
      assignPop: true,
      name: v.name,
      code: v.code,
      working_from: v.working_from,
      working_to: v.working_to,
      per_trans_amt: v.per_trans_amt,
      max_trans_amt: v.max_trans_amt,
      max_trans_count: v.max_trans_count,
      cashier_id: v._id,
      bank_user_id: v.bank_user_id,
    });
  };

  editCashier = event => {
    event.preventDefault();

    this.setState(
      {
        showEditOtp: true,
        otpOpt: 'editCashier',
        otpTxt: 'Your OTP to edit Cashier is ',
      },
      () => {
        this.generateOTP();
      },
    );
  };
  startTimer = () => {
    var dis = this;
    var timer = setInterval(function () {
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
        type: 'branch',
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
      verifyEditOTPLoading: false,
    });
    event.preventDefault();
    axios
      .post(`${API_URL}/editCashier`, this.state)
      .then(res => {
        if (res.status == 200) {
          if (res.data.error) {
            throw res.data.error;
          } else {
            this.setState(
              {
                notification: 'Cashier updated successfully!',
              },
              function () {
                this.success();
                this.closePopup();
                this.getBranches();
              },
            );
          }
        } else {
          const error = new Error(res.data.error);
          throw error;
        }
        this.setState({
          verifyEditOTPLoading: false,
        });
      })
      .catch(err => {
        this.setState({
          notification: err.response ? err.response.data.error : err.toString(),
          verifyEditOTPLoading: false,
        });
        this.error();
      });
  };


  approveTransfer = event => {
    this.setState({
      claimMoneyLoading: false,
    });
    event.preventDefault();
    axios
      .post(`${API_URL}/partnerBranch/updateCashierTransferStatus`, { token: this.state.token, cashier_id: this.state.selectedCashier, transfer_id: this.state.selectedId, status: 1 })
      .then(res => {
        if (res.status == 200) {
          if (res.data.status===0) {
            throw res.data.message;
          } else {
            this.setState(
              {
                notification: 'Transfer updated successfully!',
              },
              function () {
                this.success();
                 this.closePopup();
                this.getCashiers();
              },
            );
          }
        } else {
          const error = new Error(res.data.error);
          throw error;
        }
        this.setState({
          claimMoneyLoading: false,
        });
      })
      .catch(err => {
        this.setState({
          notification: err.response ? err.response.data.error : err.toString(),
          claimMoneyLoading: false,
        });
        this.error();
      });
  };

  rejectTransfer = event => {
    this.setState({
      claimMoneyLoading: false,
    });
    event.preventDefault();
    axios
      .post(`${API_URL}/partnerBranch/updateCashierTransferStatus`, { token: this.state.token, cashier_id: this.state.selectedCashier, transfer_id: this.state.selectedId, status: -1 })
      .then(res => {
        if (res.status == 200) {
          if (res.data.error) {
            throw res.data.error;
          } else {
            this.setState(
              {
                notification: 'Transfer updated successfully!',
              },
              function () {
                this.success();
                this.closePopup();
                this.getCashiers();
              },
            );
          }
        } else {
          const error = new Error(res.data.error);
          throw error;
        }
        this.setState({
          claimMoneyLoading: false,
        });
      })
      .catch(err => {
        this.setState({
          notification: err.response ? err.response.data.error : err.toString(),
          claimMoneyLoading: false,
        });
        this.error();
      });
  };

  blockBranch = (e, s) => {
    var dis = this;
    axios
      .post(`${API_URL}/updateStatus`, {
        token,
        type_id: e,
        status: s,
        page: 'partnerCashier',
        type: 'partnerBranch'
      })
      .then(res => {
        if (res.status == 200) {
          if (res.data.error) {
            throw res.data.error;
          } else {
            var n = (s == 1) ? 'Unblocked' : 'Blocked';
            this.setState({
              notification: 'Cashier ' + n
            });
            this.success();
            this.getCashiers();
          }
        } else {
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

  assignUser = event => {
    event.preventDefault();

    this.setState({
      assignLoading: true,
    });

    axios
      .post(`${API_URL}/partnerBranch/updateCashierUser`, {
        cashier_id: this.state.cashier_id,
        user_id: this.state.bank_user_id,
        token: token,
      })
      .then(res => {
        if (res.status == 200) {
          if (res.data.error) {
            throw res.data.error;
          } else {
            this.setState({
              notification: 'User Assigned successfully!',
              assignLoading: false,
            });
            this.success();
            this.closePopup();
            this.getCashiers();
          }
        } else {
          const error = new Error(res.data.error);
          throw error;
        }
      })
      .catch(err => {
        this.setState({
          notification: err.response ? err.response.data.error : err.toString(),
          assignLoading: false,
        });
        this.error();
      });
  };

  approve = event => {
    this.setState({
      approveLoading: true,
    });
    event.preventDefault();
    axios
      .post(`${API_URL}/approveFee`, {
        id: this.state.sid,
        token,
      })
      .then(res => {
        if (res.status == 200) {
          if (res.data.error) {
            throw res.data.error;
          } else {
            this.setState(
              {
                notification: 'Approved',
              },
              () => {
                this.success();
                this.closeMiniPopUp();
                this.getCashiers();
              },
            );
          }
        } else {
          const error = new Error(res.data.error);
          throw error;
        }
        this.setState({
          approveLoading: false,
        });
      })
      .catch(err => {
        this.setState({
          notification: err.response ? err.response.data.error : err.toString(),
          approveLoading: false,
        });
        this.error();
      });
  };

  decline = event => {
    this.setState({
      declineLoading: true,
    });
    event.preventDefault();
    axios
      .post(`${API_URL}/declineFee`, {
        id: this.state.sid,
        token,
      })
      .then(res => {
        if (res.status == 200) {
          if (res.data.error) {
            throw res.data.error;
          } else {
            this.setState(
              {
                notification: 'Declined',
              },
              () => {
                this.success();
                this.closeMiniPopUp();
                this.getCashiers();
              },
            );
          }
        } else {
          const error = new Error(res.data.error);
          throw error;
        }
        this.setState({
          declineLoading: false,
        });
      })
      .catch(err => {
        this.setState({
          notification: err.response ? err.response.data.error : err.toString(),
          declineLoading: false,
        });
        this.error();
      });
  };

  showWallet = event => {
    event.preventDefault();
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
      this.fileUpload(e.target.files[0], e.target.getAttribute('data-key'));
    }
  }

  fileUpload(file, key) {
    const formData = new FormData();
    //  formData.append('token',token);
    formData.append('file', file);
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    };

    axios
      .post(`${API_URL}/fileUpload?token=${token}`, formData, config)
      .then(res => {
        if (res.status == 200) {
          if (res.data.error) {
            throw res.data.error;
          } else {
            this.setState({
              [key]: res.data.name,
            });
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
  }
  getTransHistory = master_code => {
    axios
      .post(`${API_URL}/getTransHistory`, {
        token: token,
        master_code: master_code,
      })
      .then(res => {
        if (res.status == 200) {
          // var result = res.data.history1.concat(res.data.history2);
          // result.sort(function(a, b) {
          //     return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()// implicit conversion in number
          // });
          // var l = result.length;
          const history = res.data.result.reverse();
          this.setState({
            popresult: history,
            historyLoading: false,
            popmaster: master_code,
          });
        }
      })
      .catch(err => { });
  };

  getPendingHistory = id => {
    axios
      .post(`${API_URL}/getAll`, {
        token: token,
        type: 'partnerBranch',
        page: 'cashierpending',
        where: { cashier_id: id }
      })
      .then(res => {
        if (res.status == 200) {
          // var result = res.data.history1.concat(res.data.history2);
          // result.sort(function(a, b) {
          //     return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()// implicit conversion in number
          // });
          // var l = result.length;
          const perndingHistory = res.data.rows.reverse();
          this.setState({
            pendingCashierHistory: perndingHistory,
            historyLoading: false
          });
        }
      })
      .catch(err => { });
  };

  filterData = e => {
    this.setState({ filter: e });
  };
  getBanks = () => { };

  getBranches = () => {
    axios
      .post(`${API_URL}/getAll`, {
        page: 'cashier',
        type: 'branch',
        token: token,
      })
      .then(res => {
        if (res.status == 200) {
          console.log(res.data);
          this.setState({ loading: false, branches: res.data.rows });
        }
      })
      .catch(err => { });
  };
  getStats = () => {
    axios
      .post(`${API_URL}/${this.state.apiType}/getBranchDashStats`, {
        token: this.state.token,
        branch_id: this.state.bid,
      })
      .then(res => {
        if (res.status == 200) {
          let received =
            res.data.cashReceived == null ? 0 : res.data.cashReceived;
          let paid = res.data.cashPaid == null ? 0 : res.data.cashPaid;
          let total = res.data.totalCashier == null ? 0 : res.data.totalCashier;
          this.setState({
            loading: false,
            totalCashier: total,
            cashReceived: received.toFixed(2),
            cashPaid: paid.toFixed(2),
            invoicePaid: res.data.invoicePaid,
            amountPaid: res.data.amountPaid,
            cashInHand: res.data.cashInHand.toFixed(2),
            feeGenerated:res.data.feeGenerated.toFixed(2),
            commissionGenerated:res.data.commissionGenerated.toFixed(2),
            openingBalance:res.data.openingBalance.toFixed(2),
            pending: res.data.pending,
            accepted: res.data.accepted,
            cancelled: res.data.cancelled,
          },
          () => {
            var dis = this;
            setTimeout(function () {
              dis.getStats();
            }, 10000);
          },
          );
        }
      })
      .catch(err => {
        var dis = this;
        setTimeout(function () {
          dis.getStats();
        }, 10000);
      });
  };
  formatDate = date => {
    var months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    var isoformat = date;

    var readable = new Date(isoformat);
    var m = readable.getMonth(); // returns 6
    var d = readable.getDate(); // returns 15
    var y = readable.getFullYear();
    var h = readable.getHours();
    var mi = readable.getMinutes();
    var mlong = months[m];
    return d + ' ' + mlong + ' ' + y + ' ' + h + ':' + mi;
  };


  getCashiers = () => {
    let apiType = "";
    if (this.props.apitype === 'partner'){
      if( localStorage.getItem('admin')){
        apiType = 'partnerUser';
      }else{
        apiType = 'partner';
      }
    }else{
      apiType = this.props.apitype;
    }
    axios
      .post(`${API_URL}/${apiType}/getAll`, {
        page: 'partnerCashier',
        token: this.state.token,
        where: { branch_id: this.state.bid },
      })
      .then(res => {
        if (res.status == 200) {
          console.log(res.data);
          this.setState({ loading: false, cashiers: res.data.rows });
        }
      })
      .catch(err => { });
  };

  getUsers = () => {
    let apiType = "";
    if (this.props.apitype === 'partner'){
      if( localStorage.getItem('admin')){
        apiType = 'partnerUser';
      }else{
        apiType = 'partner';
      }
    }else{
      apiType = this.props.apitype;
    }
    axios
      .post(`${API_URL}/${apiType}/getAll`, {
        page: 'partnerUser',
        type: 'partnerBranch',
        token: this.state.token,
        where: {partner_id:bankId},
      })
      .then(res => {
        if (res.status == 200) {
          this.setState({ loading: false, users: res.data.rows });
        }
      })
      .catch(err => {
        
      });
  };

  componentDidMount() {

    this.getCashiers();
    this.getUsers();
    this.getStats()
  }

  render() {
    console.log(this.props);
    function inputFocus(e) {
      const { target } = e;
      target.parentElement.querySelector('label').classList.add('focused');
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
      <Wrapper from="branch">
        <Helmet>
          <meta charSet="utf-8" />
          <title>Dashboard | BRANCH | E-WALLET</title>
        </Helmet>
        {this.state.apiType === 'partner' ?   (
          <PartnerHeader />
        ) : (
          <BranchHeader
          active="dashboard"
          bankName={this.props.match.params.bank}
          bankLogo={STATIC_URL + logo}
        />

        )}
         {this.state.apiType === 'partner' ? (
        <Card >
          <div style={{display:'flex'}}>
            <button  style={{border:"none",width:"100px",marginLeft:"150px"}} onClick={() => {
                history.push(`/dashboard`);
              }}>
                <A>
                  Back
              </A>
            </button>
            <button style={{border:"none",width:"100px"}} onClick={() => {
              history.push(`/partner/branch/reports/${this.state.bid}`);
            }}>
                <A>
                  Reports
                </A>
            </button>
            <button style={{border:"none",width:"100px"}} onClick={() => {
                history.goBack();
              }}>
                <A>
                  <u>DashBoard</u>
              </A>
            </button>
          <h2 style={{color:"green", marginLeft:"220px" }}><b>{this.state.branchName}</b> </h2> 
          
          </div>
        </Card>
      ):''}
       
        <Container verticalMargin>
        {this.state.apiType === 'partner' ? (
          <Sidebar marginRight>
             <BranchOperationalWallet branchId={this.state.bid} bankName={this.props.bankName}/>
            <BranchMasterWallet branchId={this.state.bid} bankName={this.props.bankName}/>
          </Sidebar>
        ) : (
          <SidebarBranch bankName={this.props.match.params.bank} />
        )}
         
         
          <Main>
            <Row>
              <Col  cW='33%'>
                <Card
                  style={{height:'120px'}}
                  marginBottom="10px"
                  textAlign="center"
                  buttonMarginTop="32px"
                  bigPadding
                  smallValue
                >
                  <h4>Number of Cashier</h4>
                  <div className="cardValue">{this.state.totalCashier}</div>
                </Card>
              </Col>
              <Col  cW='33%'>
                <Card
                  style={{height:'120px'}}
                  marginBottom="10px"
                  buttonMarginTop="32px"
                  textAlign="center"
                  bigPadding
                  smallValue
                >
                  <h4>Opening Balance</h4>
                  <div className="cardValue">{CURRENCY}: {this.state.openingBalance}</div>
                </Card>
              </Col>
              <Col  cW='33%'>
                <Card
                   style={{height:'120px'}}
                  marginBottom="10px"
                  buttonMarginTop="32px"
                  textAlign="center"
                  bigPadding
                  smallValue
                >
                  <h4>Paid in Cash</h4>
                  <div className="cardValue">{CURRENCY}: {this.state.cashPaid}</div>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col  cW='33%'>
                <Card
                   style={{height:'120px'}}
                  marginBottom="10px"
                  buttonMarginTop="32px"
                  textAlign="center"
                  bigPadding
                  smallValue
                >
                  <h4>Cash Recieved</h4>

                  <div className="cardValue">{CURRENCY}: {this.state.cashReceived}</div>
                </Card>
                </Col>
              <Col  cW='33%'>
                <Card
                   style={{height:'120px'}}
                  marginBottom="10px"
                  buttonMarginTop="32px"
                  textAlign="center"
                  bigPadding
                  smallValue
                >
                  <h4>Cash in Hand</h4>

                  <div className="cardValue">{CURRENCY}: {this.state.cashInHand}</div>
                </Card>
              </Col>
              <Col cW='33%'>
                <Card
                  style={{height:'120px'}}
                  marginBottom="10px"
                  buttonMarginTop="32px"
                  textAlign="center"
                  bigPadding
                  smallValue
                >
                  <h4>Invoices Paid</h4>
                  <Row>
                    <Col style={{textAlign:'center'}}>
                      <h5>Number</h5>
                      <div className="cardValue">{this.state.invoicePaid}</div>
                    </Col>
                    <Col style={{textAlign:'center'}}>
                      <h5>Amount</h5>
                      <div className="cardValue">{CURRENCY}: {this.state.amountPaid}</div>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
            <Row >
              
              <Col cW='50%'>
              <Card
                  style={{height:'120px'}}
                  marginBottom="10px"
                  buttonMarginTop="32px"
                  textAlign="center"
                  bigPadding
                  smallValue
                >
                  <h4>Revenue Collected</h4>
                  <Row>
                    <Col style={{textAlign:'center'}}>
                      <h5>Fee</h5>
                      <div className="cardValue">{CURRENCY}: {this.state.feeGenerated}</div>
                    </Col>
                    <Col style={{textAlign:'center'}}>
                      <h5>Commission</h5>
                      <div className="cardValue">{CURRENCY}: {this.state.commissionGenerated}</div>
                    </Col>
                    <Col style={{textAlign:'center'}}>
                      <h5>Total</h5>
                      <div className="cardValue">{CURRENCY}: {parseInt(this.state.commissionGenerated, 10)+parseInt(this.state.feeGenerated, 10)}</div>
                    </Col>
                  </Row>
                </Card>
              </Col>
              <Col cW='50%'>
              <Card
                   style={{height:'120px'}}
                  marginBottom="10px"
                  buttonMarginTop="32px"
                  bigPadding
                  textAlign="center"
                  smallValue
                >
                  <h4>Authorisation Requests</h4>
                  <Row>
                    <Col style={{textAlign:'center'}}>
                      <h5>Approved</h5>
                      <div className="cardValue">{this.state.accepted}</div>
                    </Col>
                    <Col style={{textAlign:'center'}}>
                      <h5>Declined</h5>
                      <div className="cardValue">{this.state.cancelled}</div>
                    </Col>
                    <Col style={{textAlign:'center'}}>
                      <h5>Pending</h5>
                      <div className="cardValue">{this.state.pending}</div>
                    </Col>
                  </Row>
                  
                </Card>
              </Col>
            </Row>
          </Main>
          <Main fullWidth>  
            <Card bigPadding>
              <div className="cardHeader">
                <div className="cardHeaderLeft">
                  <i className="material-icons">playlist_add_check</i>
                </div>
                <div className="cardHeaderRight">
                  <h3>Cashier's Activity</h3>
                  <h5>Daily activity</h5>
                </div>
              </div>
              <div className="cardBody">
                <Table marginTop="34px" smallTd>
                  <thead>
                    <tr>
                      <th>Cashier Name</th>
                      <th>Assigned to</th>
                      <th>Opening Time</th>
                      <th>Opening Balance</th>
                      <th>Paid In Cash</th>
                      <th>Cash Received</th>
                      <th>Revenue Generated</th>
                      <th>Cash in Hand</th>
                      <th>Closing Time</th>
                      <th>Closing Balance</th>
                      <th>Discripancy</th>
                      <th>Pending Transaction</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.cashiers && this.state.cashiers.length > 0 && this.state.users
                      ? this.state.cashiers.map(b => {
                        return (
                          <tr key={b._id}>
                             <td style={{display:"inline-flex"}}>
                                  <FiberManualRecordIcon  fontSize="small" color={b.is_closed ? "secondary" : "primary"}/>
                                {b.name}
                              </td>
                              <td>
                                {this.state.users.filter(
                                  u => u._id == b.partner_user_id,
                                )[0]
                                  ? this.state.users.filter(
                                    u => u._id == b.partner_user_id,
                                  )[0].name
                                  : ''}
                              </td>
                              <td>
                                {`${new Date(b.opening_time).getHours()}:${new Date(b.opening_time).getMinutes()}`}
                              </td>
                              <td className="tac">
                                {b.opening_balance.toFixed(2)}
                              </td>
                              <td>
                                {b.cash_paid.toFixed(2)}
                              </td>
                              <td>
                                {b.cash_received.toFixed(2)}
                              </td>
                              <td>
                                {(b.fee_generated+b.commission_generated).toFixed(2)}
                              </td>
                              <td className="tac">
                                {b.cash_in_hand.toFixed(2)}
                              </td>
                              <td>
                                {`${new Date(b.closing_time).getHours()}:${new Date(b.closing_time).getMinutes()}`}
                              </td>
                              <td className="tac">
                                {b.closing_balance.toFixed(2)}
                              </td>
                              <td>
                                {(b.closing_balance-b.cash_in_hand).toFixed(2)}
                              </td>

                            <td className="tac bold green">
                              <span onClick={() => this.showPending(b._id)}> {b.pending_trans}</span>

                            </td>
                            {this.state.apiType === 'partner' ? (
                              <td className="tac bold green">
                                 <Button
                                className="sendMoneyButton"
                                style ={{marginRight:"10px"}} 
                              >
                                {/* <A
                                  href={
                                    '/branch/' +
                                    dis.props.match.params.bank +
                                    '/cashier/' +
                                    b._id
                                  }
                                >
                                  View
                                </A> */}
                                <A
                                  href={
                                    '/partner/branch/cashier/reports/' +
                                    b._id
                                  }
                                >
                                  Reports
                                </A>
                            </Button>

                              </td>

                              ) : (
                              <td className="tac bold green">
                              <Button
                                className="sendMoneyButton"
                                style ={{marginRight:"10px"}} 
                              >
                                {/* <A
                                  href={
                                    '/branch/' +
                                    dis.props.match.params.bank +
                                    '/cashier/' +
                                    b._id
                                  }
                                >
                                  View
                                </A> */}
                                <A
                                  href={
                                    '/branch/' +
                                    dis.props.match.params.bank +
                                    '/cashier/reports/' +
                                    b._id
                                  }
                                >
                                  Reports
                                </A>
                            </Button>
                            <span style ={{marginLeft:"10px"}} className="absoluteMiddleRight primary popMenuTrigger">
                              <i className="material-icons ">more_vert</i>
                              <div className="popMenu">
                                <span onClick={() => dis.showEditPopup(b)}>
                                  Edit
                                  </span>
                                <span
                                  onClick={() => dis.showAssignPopup(b)}
                                >
                                  Assign User
                                  </span>
                                {/* {b.is_closed ? (
                                  <span
                                    onClick={() => dis.releaseCashier(b._id)}
                                  >
                                    Re-open Access
                                  </span>
                                ) : null} */}
                                {b.status == -1 ? (
                                  <span
                                    onClick={() =>
                                      dis.blockBranch(b._id, 1)
                                    }
                                  >
                                    Unblock
                                  </span>
                                ) : (
                                    <span
                                      onClick={() =>
                                        dis.blockBranch(b._id, -1)
                                      }
                                    >
                                      Block
                                    </span>
                                  )}
                              </div>
                            </span>
                          </td>

                            )}
                           

                          </tr>
                        );
                      })
                      : null}
                  </tbody>
                </Table>
              </div>
            </Card>
          </Main>
        </Container>
        {this.state.popup ? (
          <Popup close={this.closePopup.bind(this)} accentedH1>
            {this.state.showOtp ? (
              <div>
                <h1>
                  <FormattedMessage {...messages.verify} />
                </h1>
                <form action="" method="post" onSubmit={this.verifyOTP}>
                  <FormGroup>
                    <label>
                      <FormattedMessage {...messages.otp} />*
                    </label>
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
                  {this.state.verifyOTPLoading ? (
                    <Button filledBtn marginTop="50px" disabled>
                      <Loader />
                    </Button>
                  ) : (
                      <Button filledBtn marginTop="50px">
                        <span>
                          <FormattedMessage {...messages.verify} />
                        </span>
                      </Button>
                    )}

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
            ) : (
                <div>
                  <h1>Add Branch</h1>
                  <form action="" method="post" onSubmit={this.addBranch}>
                    <FormGroup>
                      <label>Branch Name*</label>
                      <TextInput
                        type="text"
                        name="name"
                        onFocus={inputFocus}
                        onBlur={inputBlur}
                        value={this.state.name}
                        onChange={this.handleInputChange}
                        required
                      />
                    </FormGroup>
                    <FormGroup>
                      <label>Branch ID*</label>
                      <TextInput
                        type="text"
                        name="bcode"
                        onFocus={inputFocus}
                        onBlur={inputBlur}
                        value={this.state.bcode}
                        onChange={this.handleInputChange}
                        required
                      />
                    </FormGroup>
                    <FormGroup>
                      <label>Branch Admin: User ID*</label>
                      <TextInput
                        type="text"
                        name="username"
                        onFocus={inputFocus}
                        onBlur={inputBlur}
                        value={this.state.username}
                        onChange={this.handleInputChange}
                        required
                      />
                    </FormGroup>

                    <FormGroup>
                      <label>Credit Limit</label>
                      <TextInput
                        type="text"
                        name="credit_limit"
                        onFocus={inputFocus}
                        onBlur={inputBlur}
                        value={this.state.credit_limit}
                        onChange={this.handleInputChange}
                      />
                    </FormGroup>
                    <FormGroup>
                      <label>Address*</label>
                      <TextInput
                        type="text"
                        name="address1"
                        onFocus={inputFocus}
                        onBlur={inputBlur}
                        value={this.state.address1}
                        onChange={this.handleInputChange}
                        required
                      />
                    </FormGroup>

                    <Row>
                      <Col>
                        <FormGroup>
                          <label>
                            <FormattedMessage {...messages.popup3} />*
                        </label>
                          <TextInput
                            type="text"
                            name="state"
                            onFocus={inputFocus}
                            onBlur={inputBlur}
                            value={this.state.state}
                            onChange={this.handleInputChange}
                            required
                          />
                        </FormGroup>
                      </Col>
                      <Col>
                        <FormGroup>
                          <label>
                            <FormattedMessage {...messages.popup4} />*
                        </label>
                          <TextInput
                            type="text"
                            name="zip"
                            onFocus={inputFocus}
                            onBlur={inputBlur}
                            value={this.state.zip}
                            onChange={this.handleInputChange}
                            required
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <FormGroup>
                          <SelectInput
                            type="text"
                            name="country"
                            value={this.state.country}
                            onChange={this.countryChange}
                            required
                          >
                            <option title="" value="">
                              Select Country*
                          </option>
                            <option title="+213">Algeria</option>
                            <option title="+376">Andorra</option>
                            <option title="+244">Angola</option>
                            <option title="+1264">Anguilla</option>
                            <option title="+1268">Antigua &amp; Barbuda</option>
                            <option title="+54">Argentina</option>
                            <option title="+374">Armenia</option>
                            <option title="+297">Aruba</option>
                            <option title="+61">Australia</option>
                            <option title="+43">Austria</option>
                            <option title="+994">Azerbaijan</option>
                            <option title="+1242">Bahamas</option>
                            <option title="+973">Bahrain</option>
                            <option title="+880">Bangladesh</option>
                            <option title="+1246">Barbados</option>
                            <option title="+375">Belarus</option>
                            <option title="+32">Belgium</option>
                            <option title="+501">Belize</option>
                            <option title="+229">Benin</option>
                            <option title="+1441">Bermuda</option>
                            <option title="+975">Bhutan</option>
                            <option title="+591">Bolivia</option>
                            <option title="+387">Bosnia Herzegovina</option>
                            <option title="+267">Botswana</option>
                            <option title="+55">Brazil</option>
                            <option title="+673">Brunei</option>
                            <option title="+359">Bulgaria</option>
                            <option title="+226">Burkina Faso</option>
                            <option title="+257">Burundi</option>
                            <option title="+855">Cambodia</option>
                            <option title="+237">Cameroon</option>
                            <option title="+1">Canada</option>
                            <option title="+238">Cape Verde Islands</option>
                            <option title="+1345">Cayman Islands</option>
                            <option title="+236">Central African Republic</option>
                            <option title="+56">Chile</option>
                            <option title="+86">China</option>
                            <option title="+57">Colombia</option>
                            <option title="+269">Comoros</option>
                            <option title="+242">Congo</option>
                            <option title="+682">Cook Islands</option>
                            <option title="+506">Costa Rica</option>
                            <option title="+385">Croatia</option>
                            <option title="+53">Cuba</option>
                            <option title="+90392">Cyprus North</option>
                            <option title="+357">Cyprus South</option>
                            <option title="+42">Czech Republic</option>
                            <option title="+45">Denmark</option>
                            <option title="+253">Djibouti</option>
                            <option title="+1809">Dominica</option>
                            <option title="+1809">Dominican Republic</option>
                            <option title="+593">Ecuador</option>
                            <option title="+20">Egypt</option>
                            <option title="+503">El Salvador</option>
                            <option title="+240">Equatorial Guinea</option>
                            <option title="+291">Eritrea</option>
                            <option title="+372">Estonia</option>
                            <option title="+251">Ethiopia</option>
                            <option title="+500">Falkland Islands</option>
                            <option title="+298">Faroe Islands</option>
                            <option title="+679">Fiji</option>
                            <option title="+358">Finland</option>
                            <option title="+33">France</option>
                            <option title="+594">French Guiana</option>
                            <option title="+689">French Polynesia</option>
                            <option title="+241">Gabon</option>
                            <option title="+220">Gambia</option>
                            <option title="+7880">Georgia</option>
                            <option title="+49">Germany</option>
                            <option title="+233">Ghana</option>
                            <option title="+350">Gibraltar</option>
                            <option title="+30">Greece</option>
                            <option title="+299">Greenland</option>
                            <option title="+1473">Grenada</option>
                            <option title="+590">Guadeloupe</option>
                            <option title="+671">Guam</option>
                            <option title="+502">Guatemala</option>
                            <option title="+224">Guinea</option>
                            <option title="+245">Guinea - Bissau</option>
                            <option title="+592">Guyana</option>
                            <option title="+509">Haiti</option>
                            <option title="+504">Honduras</option>
                            <option title="+852">Hong Kong</option>
                            <option title="+36">Hungary</option>
                            <option title="+354">Iceland</option>
                            <option title="+91">India</option>
                            <option title="+62">Indonesia</option>
                            <option title="+98">Iran</option>
                            <option title="+964">Iraq</option>
                            <option title="+353">Ireland</option>
                            <option title="+972">Israel</option>
                            <option title="+39">Italy</option>
                            <option title="+1876">Jamaica</option>
                            <option title="+81">Japan</option>
                            <option title="+962">Jordan</option>
                            <option title="+7">Kazakhstan</option>
                            <option title="+254">Kenya</option>
                            <option title="+686">Kiribati</option>
                            <option title="+850">Korea North</option>
                            <option title="+82">Korea South</option>
                            <option title="+965">Kuwait</option>
                            <option title="+996">Kyrgyzstan</option>
                            <option title="+856">Laos</option>
                            <option title="+371">Latvia</option>
                            <option title="+961">Lebanon</option>
                            <option title="+266">Lesotho</option>
                            <option title="+231">Liberia</option>
                            <option title="+218">Libya</option>
                            <option title="+417">Liechtenstein</option>
                            <option title="+370">Lithuania</option>
                            <option title="+352">Luxembourg</option>
                            <option title="+853">Macao</option>
                            <option title="+389">Macedonia</option>
                            <option title="+261">Madagascar</option>
                            <option title="+265">Malawi</option>
                            <option title="+60">Malaysia</option>
                            <option title="+960">Maldives</option>
                            <option title="+223">Mali</option>
                            <option title="+356">Malta</option>
                            <option title="+692">Marshall Islands</option>
                            <option title="+596">Martinique</option>
                            <option title="+222">Mauritania</option>
                            <option title="+269">Mayotte</option>
                            <option title="+52">Mexico</option>
                            <option title="+691">Micronesia</option>
                            <option title="+373">Moldova</option>
                            <option title="+377">Monaco</option>
                            <option title="+976">Mongolia</option>
                            <option title="+1664">Montserrat</option>
                            <option title="+212">Morocco</option>
                            <option title="+258">Mozambique</option>
                            <option title="+95">Myanmar</option>
                            <option title="+264">Namibia</option>
                            <option title="+674">Nauru</option>
                            <option title="+977">Nepal</option>
                            <option title="+31">Netherlands</option>
                            <option title="+687">New Caledonia</option>
                            <option title="+64">New Zealand</option>
                            <option title="+505">Nicaragua</option>
                            <option title="+227">Niger</option>
                            <option title="+234">Nigeria</option>
                            <option title="+683">Niue</option>
                            <option title="+672">Norfolk Islands</option>
                            <option title="+670">Northern Marianas</option>
                            <option title="+47">Norway</option>
                            <option title="+968">Oman</option>
                            <option title="+680">Palau</option>
                            <option title="+507">Panama</option>
                            <option title="+675">Papua New Guinea</option>
                            <option title="+595">Paraguay</option>
                            <option title="+51">Peru</option>
                            <option title="+63">Philippines</option>
                            <option title="+48">Poland</option>
                            <option title="+351">Portugal</option>
                            <option title="+1787">Puerto Rico</option>
                            <option title="+974">Qatar</option>
                            <option title="+262">Reunion</option>
                            <option title="+40">Romania</option>
                            <option title="+7">Russia</option>
                            <option title="+250">Rwanda</option>
                            <option title="+378">San Marino</option>
                            <option title="+239">Sao Tome &amp; Principe</option>
                            <option title="+966">Saudi Arabia</option>
                            <option title="+221">Senegal</option>
                            <option title="+381">Serbia</option>
                            <option title="+248">Seychelles</option>
                            <option title="+232">Sierra Leone</option>
                            <option title="+65">Singapore</option>
                            <option title="+421">Slovak Republic</option>
                            <option title="+386">Slovenia</option>
                            <option title="+677">Solomon Islands</option>
                            <option title="+252">Somalia</option>
                            <option title="+27">South Africa</option>
                            <option title="+34">Spain</option>
                            <option title="+94">Sri Lanka</option>
                            <option title="+290">St. Helena</option>
                            <option title="+1869">St. Kitts</option>
                            <option title="+1758">St. Lucia</option>
                            <option title="+249">Sudan</option>
                            <option title="+597">Suriname</option>
                            <option title="+268">Swaziland</option>
                            <option title="+46">Sweden</option>
                            <option title="+41">Switzerland</option>
                            <option title="+963">Syria</option>
                            <option title="+886">Taiwan</option>
                            <option title="+7">Tajikstan</option>
                            <option title="+66">Thailand</option>
                            <option title="+228">Togo</option>
                            <option title="+676">Tonga</option>
                            <option title="+1868">Trinidad &amp; Tobago</option>
                            <option title="+216">Tunisia</option>
                            <option title="+90">Turkey</option>
                            <option title="+7">Turkmenistan</option>
                            <option title="+993">Turkmenistan</option>
                            <option title="+1649">
                              Turks &amp; Caicos Islands
                          </option>
                            <option title="+688">Tuvalu</option>
                            <option title="+256">Uganda</option>
                            <option title="+44">UK</option>
                            <option title="+380">Ukraine</option>
                            <option title="+971">United Arab Emirates</option>
                            <option title="+598">Uruguay</option>
                            <option title="+1">USA</option>
                            <option title="+7">Uzbekistan</option>
                            <option title="+678">Vanuatu</option>
                            <option title="+379">Vatican City</option>
                            <option title="+58">Venezuela</option>
                            <option title="+84">Vietnam</option>
                            <option title="+84">Virgin Islands - British</option>
                            <option title="+84">Virgin Islands - US</option>
                            <option title="+681">Wallis &amp; Futuna</option>
                            <option title="+969">Yemen</option>
                            <option title="+967">Yemen</option>
                            <option title="+260">Zambia</option>
                            <option title="+263">Zimbabwe</option>
                          </SelectInput>
                        </FormGroup>
                      </Col>

                      <Col>
                        <FormGroup>
                          <label>
                            <FormattedMessage {...messages.popup8} />*
                        </label>
                          <TextInput
                            type="email"
                            name="email"
                            onFocus={inputFocus}
                            onBlur={inputBlur}
                            value={this.state.email}
                            onChange={this.handleInputChange}
                            required
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col cW="20%" mR="2%">
                        <FormGroup>
                          <TextInput
                            type="text"
                            name="ccode"
                            readOnly
                            value={this.state.ccode}
                            onChange={this.handleInputChange}
                            required
                          />
                        </FormGroup>
                      </Col>
                      <Col cW="78%">
                        <FormGroup>
                          <label>
                            <FormattedMessage {...messages.popup7} />*
                        </label>
                          <TextInput
                            type="text"
                            pattern="[0-9]{10}"
                            title="10 Digit numeric value"
                            name="mobile"
                            onFocus={inputFocus}
                            onBlur={inputBlur}
                            value={this.state.mobile}
                            onChange={this.handleInputChange}
                            required
                          />
                        </FormGroup>
                      </Col>
                    </Row>

                    {this.state.addBranchLoading ? (
                      <Button filledBtn marginTop="10px" disabled>
                        <Loader />
                      </Button>
                    ) : (
                        <Button filledBtn marginTop="10px">
                          <span>Add Branch</span>
                        </Button>
                      )}
                  </form>
                </div>
              )}
          </Popup>
        ) : null}

        {this.state.editPopup ? (
          <Popup close={this.closePopup.bind(this)} accentedH1>
            {this.state.showEditOtp ? (
              <div>
                <h1>
                  <FormattedMessage {...messages.verify} />
                </h1>
                <form action="" method="post" onSubmit={this.verifyEditOTP}>
                  <FormGroup>
                    <label>
                      <FormattedMessage {...messages.otp} />*
                    </label>
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
                  {this.verifyEditOTPLoading ? (
                    <Button filledBtn marginTop="50px" disabled>
                      <Loader />
                    </Button>
                  ) : (
                      <Button filledBtn marginTop="50px">
                        <span>
                          <FormattedMessage {...messages.verify} />
                        </span>
                      </Button>
                    )}

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
            ) : (
                <div>
                  <h1>Edit Cashier</h1>
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
                        name="code"
                        onFocus={inputFocus}
                        onBlur={inputBlur}
                        value={this.state.code}
                        onChange={this.handleInputChange}
                        required
                      />
                    </FormGroup>
                    <label>Working Hours</label>
                    <Row>
                      <Col cW="30%" mR="2%">
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
                    <FormGroup>
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
                    </FormGroup>
                    {this.state.editBranchLoading ? (
                      <Button filledBtn marginTop="50px" disabled>
                        <Loader />
                      </Button>
                    ) : (
                        <Button filledBtn marginTop="50px">
                          <span>Update Cashier</span>
                        </Button>
                      )}
                  </form>
                </div>
              )}
          </Popup>
        ) : null}

        {this.state.historyPop ? (
          <Popup close={this.closePopup.bind(this)} accentedH1 bigBody>
            <div>
              <h1>Transaction Details ({this.state.popmaster})</h1>
              {this.state.historyLoading ? (
                <Button filledBtn disabled>
                  <Loader />
                </Button>
              ) : (
                  <Table marginTop="34px" smallTd textAlign="left">
                    <tbody>
                      {this.state.popresult && this.state.popresult.length > 0
                        ? this.state.popresult.map(function (b) {
                          var isoformat = new Date(
                            b.tx_data.tx_timestamp.seconds * 1000,
                          ).toISOString();
                          var fulldate = dis.formatDate(isoformat);

                          return dis.state.filter == b.tx_data.tx_type ||
                            dis.state.filter == '' ? (
                              <tr key={b.tx_data.tx_id}>
                                <td>
                                  <div className="labelGrey">{fulldate}</div>
                                </td>
                                <td>
                                  <div className="labelBlue">
                                    {b.tx_data.tx_details}
                                  </div>{' '}
                                  <div className="labelSmallGrey">Completed</div>
                                </td>
                                <td className="right">
                                  <div className="labelGrey">
                                    {b.tx_data.tx_type == 'DR' ? (
                                      <span>
                                        {CURRENCY} -{b.amount}
                                      </span>
                                    ) : (
                                        <span>
                                          {CURRENCY} {b.amount}
                                        </span>
                                      )}
                                  </div>
                                </td>
                                <td>{b.tx_data.child_id}</td>
                              </tr>
                            ) : null;
                        })
                        : null}
                    </tbody>
                  </Table>
                )}
            </div>
          </Popup>
        ) : null}

        {this.state.pendingPop ? (
          <Popup close={this.closePopup.bind(this)} accentedH1 bigBody>
            <div>
              <h1>Pending Transactions</h1>
              {this.state.historyLoading ? (
                <Button filledBtn disabled>
                  <Loader />
                </Button>
              ) : (
                  <Table marginTop="34px" smallTd textAlign="left">
                    <tbody>
                      {

                        this.state.pendingCashierHistory && this.state.pendingCashierHistory.length > 0
                          ? this.state.pendingCashierHistory.map(function (b) {

                            var fulldate = dis.formatDate(b.created_at);
                            return <tr key={b._id}>
                              <td>
                                <div className="labelGrey">{fulldate}</div>
                              </td>
                              <td>
                                <div
                                  className="labelBlue"
                                >

                                  <span onClick={() => dis.showPendingDetails(b._id, JSON.parse(b.transaction_details),b.trans_type,b.interbank,b.status)}>
                                    Cash sent from{' '}
                                    {b.sender_name}{' '}
                                      to{' '}
                                    {b.receiver_name}
                                  </span>

                                </div>
                                <div className="labelSmallGrey">
                                  {b.status == 1 ?
                                    <span>Approved</span>
                                    :
                                    b.status == 0 ?
                                      <span>Pending</span>

                                      :

                                      <span className="red">Rejected</span>
                                  }
                                </div>
                              </td>
                              <td>
                                <div className="labelGrey">
                                  {'XOF'}
                                  {b.amount}
                                </div>
                              </td>
                            </tr>
                          })
                          : null
                      }
                    </tbody>
                  </Table>
                )}
            </div>
          </Popup>
        ) : null}


        {this.state.popupClaimMoney ? (
          <Popup bigBody close={this.closePopup.bind(this)} accentedH1>

            <div>
              <h1>Transaction Details</h1>

              <Container>
                <Row vAlign="flex-start">
                  <Col sm="12" md="4">
                    <div
                      style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        padding: '13px 0px',
                        color: '#417505',
                      }}
                    >
                      Sender's Info
                          </div>
                    <Row>
                      <Col className="popInfoLeft">Mobile Number</Col>
                      <Col className="popInfoRight">
                        {this.state.mobile}
                      </Col>
                    </Row>
                    <Row>
                      <Col className="popInfoLeft">Given Name</Col>
                      <Col className="popInfoRight">
                        {this.state.givenname}
                      </Col>
                    </Row>
                    <Row>
                      <Col className="popInfoLeft">Family Name</Col>
                      <Col className="popInfoRight">
                        {this.state.familyname}
                      </Col>
                    </Row>
                    <Row>
                      <Col className="popInfoLeft">Address</Col>
                      <Col className="popInfoRight">
                        {this.state.address1}
                      </Col>
                    </Row>
                    <Row>
                      <Col className="popInfoLeft">State</Col>
                      <Col className="popInfoRight">
                        {this.state.state}
                      </Col>
                    </Row>
                    <Row>
                      <Col className="popInfoLeft">Zip Code</Col>
                      <Col className="popInfoRight">{this.state.zip}</Col>
                    </Row>
                    <Row>
                      <Col className="popInfoLeft">Country</Col>
                      <Col className="popInfoRight">
                        {this.state.country}
                      </Col>
                    </Row>
                    <Row>
                      <Col className="popInfoLeft">Email ID</Col>
                      <Col className="popInfoRight">
                        {this.state.email}
                      </Col>
                    </Row>
                    <Row>
                      <Col className="popInfoLeft">Notes</Col>
                      <Col className="popInfoRight">
                        {this.state.note}
                      </Col>
                    </Row>
                  </Col>
                  <Col sm="12" md="4">
                    <div
                      style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        padding: '13px 0px',
                        color: '#417505',
                      }}
                    >
                      Receiver's Info
                          </div>
                    <Row>
                      <Col className="popInfoLeft">Mobile Number</Col>
                      <Col className="popInfoRight">
                        {this.state.receiverMobile}
                      </Col>
                    </Row>
                    <Row>
                      <Col className="popInfoLeft">Given Name</Col>
                      <Col className="popInfoRight">
                        {this.state.receiverGivenName}
                      </Col>
                    </Row>
                    <Row>
                      <Col className="popInfoLeft">Family Name</Col>
                      <Col className="popInfoRight">
                        {this.state.receiverFamilyName}
                      </Col>
                    </Row>
                    <Row>
                      <Col className="popInfoLeft">Country</Col>
                      <Col className="popInfoRight">
                        {this.state.receiverCountry}
                      </Col>
                    </Row>
                    <Row>
                      <Col className="popInfoLeft">Email ID</Col>
                      <Col className="popInfoRight">
                        {this.state.receiverEmail}
                      </Col>
                    </Row>
                    <Row /> <Row /> <Row />
                  </Col>
                  <Col sm="12" md="4">
                    <div
                      style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        padding: '13px 0px',
                        color: '#417505',
                      }}
                    >
                      &nbsp;
                          </div>
                    <Row>
                      <Col className="popInfoLeft">Amount</Col>
                      <Col className="popInfoRight">
                        {this.state.receiverIdentificationAmount}
                      </Col>
                    </Row>
                    <Row>
                            <Col className="popInfoLeft">Transaction Type</Col>
                            <Col className="popInfoRight">
                              {this.state.type}
                            </Col>
                          </Row>
                          <Row>
                            <Col className="popInfoLeft">Interbank Transaction ?</Col>
                            <Col className="popInfoRight">
                              {this.state.interbank ? "Yes" : "No"}
                            </Col>
                          </Row>
                    <Row>
                      <Col className="popInfoLeft">ID required</Col>
                      <Col className="popInfoRight">
                        {this.state.withoutID ? 'No' : 'Yes'}
                      </Col>
                    </Row>
                    <Row>
                      <Col className="popInfoLeft">OTP required</Col>
                      <Col className="popInfoRight">
                        {this.state.requireOTP ? 'Yes' : 'No'}
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row vAlign="flex-start">
                  <Col>
                    <div
                      style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        padding: '13px 0px',
                      }}
                    >
                      Sender's Identification
                          </div>
                    <Row>
                      <Col className="popInfoLeft">Country</Col>
                      <Col className="popInfoRight">
                        {this.state.senderIdentificationCountry}
                      </Col>
                    </Row>
                    <Row>
                      <Col className="popInfoLeft">Type</Col>
                      <Col className="popInfoRight">
                        {this.state.senderIdentificationType}
                      </Col>
                    </Row>
                    <Row>
                      <Col className="popInfoLeft">Number</Col>
                      <Col className="popInfoRight">
                        {this.state.senderIdentificationNumber}
                      </Col>
                    </Row>
                    <Row>
                      <Col className="popInfoLeft">Valid till</Col>
                      <Col className="popInfoRight">
                        {this.state.senderIdentificationValidTill}
                      </Col>
                    </Row>
                  </Col>
                  <Col>
                    <div
                      style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        padding: '13px 0px',
                      }}
                    >
                      Receiver's Identification
                          </div>
                    <Row>
                      <Col className="popInfoLeft">Country</Col>
                      <Col className="popInfoRight">
                        {this.state.receiverIdentificationCountry}
                      </Col>
                    </Row>
                    <Row>
                      <Col className="popInfoLeft">Type</Col>
                      <Col className="popInfoRight">
                        {this.state.receiverIdentificationType}
                      </Col>
                    </Row>
                    <Row>
                      <Col className="popInfoLeft">Number</Col>
                      <Col className="popInfoRight">
                        {this.state.receiverIdentificationNumber}
                      </Col>
                    </Row>
                    <Row>
                      <Col className="popInfoLeft">Valid till</Col>
                      <Col className="popInfoRight">
                        {this.state.receiverIdentificationValidTill}
                      </Col>
                    </Row>
                  </Col>
                  <Col>
                  {this.state.pendingtransStatus === 0 ? (
                       
                    <Row>
                      <Col cW="49%" mR="2%">
                        {this.state.claimMoneyLoading ? (
                          <Button filledBtn marginTop="20px" disabled>
                            <Loader />
                          </Button>
                        ) : (
                            <Button type="button" filledBtn marginTop="20px" onClick={this.approveTransfer}>
                              <span>
                                Approve
                              </span>
                            </Button>
                          )}
                      </Col>
                      <Col cW="49%">
                        {this.state.claimMoneyLoading ? (
                          <Button filledBtn marginTop="20px" disabled style={{ backgroundColor: '#111111' }} >
                            <Loader />
                          </Button>
                        ) : (
                            <Button type="button" filledBtn marginTop="20px" style={{ backgroundColor: '#111111' }} onClick={this.rejectTransfer}>
                              <span>
                                Reject
                              </span>
                            </Button>
                          )}
                      </Col>
                    </Row>
                  ): null}

                    <br />
                    {/* <p className="note">
                      <span style={{ color: 'red' }}>* </span>
                      Total fee $200 will be charged
                    </p> */}
                  </Col>
                </Row>
              </Container>

            </div>

          </Popup>
        ) : null}
        {this.state.assignPop ? (
          <Popup close={this.closePopup.bind(this)} accentedH1>
            <h1>Assign User</h1>
            <form action="" method="post" onSubmit={this.assignUser}>
              <FormGroup>
                <label>Cashier Name*</label>
                <TextInput
                  type="text"
                  name="name"
                  onFocus={inputFocus}
                  onBlur={inputBlur}
                  value={this.state.name}
                  readOnly
                  autoFocus
                  onChange={this.handleInputChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <label>Cashier Code*</label>
                <TextInput
                  type="text"
                  name="code"
                  autoFocus
                  onFocus={inputFocus}
                  onBlur={inputBlur}
                  value={this.state.code}
                  onChange={this.handleInputChange}
                  readOnly
                  required
                />
              </FormGroup>
              <FormGroup>
                <label>Assign User*</label>
                <SelectInput
                  onFocus={inputFocus}
                  autoFocus
                  onChange={this.handleInputChange}
                  onBlur={inputBlur}
                  value={this.state.bank_user_id}
                  name="bank_user_id"
                  placeholder="Assign User*"
                  required
                >
                  <option value="">Select User</option>
                  {this.state.users.map(function (b) {
                    return <option value={b._id}>{b.name}</option>;
                  })}
                </SelectInput>
              </FormGroup>

              {this.state.assignLoading ? (
                <Button filledBtn marginTop="50px" disabled>
                  <Loader />
                </Button>
              ) : (
                  <Button filledBtn marginTop="50px">
                    <span>Assign User</span>
                  </Button>
                )}
            </form>
          </Popup>
        ) : null}
          <Footer bankname={this.state.bankName} banklogo={this.state.bankLogo}/>
      </Wrapper>
    );
  }
}
