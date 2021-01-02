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

import Wrapper from 'components/Wrapper';
import A from 'components/A';
import BranchHeader from 'components/Header/BranchHeader';
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
import MiniPopUp from 'components/MiniPopUp';
import FormGroup from 'components/FormGroup';
import TextInput from 'components/TextInput';
import UploadArea from 'components/UploadArea';
import Row from 'components/Row';
import Col from 'components/Col';
import Popup from 'components/Popup';
import SelectInput from 'components/SelectInput';

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

const token = localStorage.getItem('branchLogged');
const bid = localStorage.getItem('branchId');
const logo = localStorage.getItem('bankLogo');
const email = localStorage.getItem('branchEmail');
const mobile = localStorage.getItem('branchMobile');
const partnerid = localStorage.getItem('bankid');

export default class BranchCashierList extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      otp: '',
      total: 0,
      popup: false,
      showOtp: false,
      assignPop: false,
      token,
      otpEmail: email,
      otpMobile: mobile,
      copybranches: []
    };
    this.success = this.success.bind(this);
    this.error = this.error.bind(this);
    this.warn = this.warn.bind(this);
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

  handleAmountChange = event => {
    const { value, name } = event.target;
    this.setState(
      {
        [name]: value,
      },
      () => {
        this.calculateTotal();
      },
    );
  };

  calculateTotal = () => {
    var total = 0;
    this.state.denom10 ? this.state.denom10 : 0;

    total += Number(this.state.denom10 ? this.state.denom10 : 0) * 10;
    total += Number(this.state.denom20 ? this.state.denom20 : 0) * 20;
    total += Number(this.state.denom50 ? this.state.denom50 : 0) * 50;
    total += Number(this.state.denom100 ? this.state.denom100 : 0) * 100;
    total += Number(this.state.denom1000 ? this.state.denom1000 : 0) * 1000;
    total += Number(this.state.denom2000 ? this.state.denom2000 : 0) * 2000;

    this.setState({
      total: total,
    });
  };

  selectInputChange = selectedOption => {
    this.setState({ bank_user_id: selectedOption });
  };

  showPopup = () => {
    this.setState({ popup: true });
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
  showEditPopup = v => {
    this.setState({
      editPopup: true,
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
  showOpeningPopup = v => {
    this.setState({ openingPopup: true, cashier_id: v._id });
  };

  closePopup = () => {
    this.setState({
      popup: false,
      editPopup: false,
      assignPop: false,
      openingPopup: false,
      name: '',
      code: '',
      working_from: '',
      working_to: '',
      per_trans_amt: '',
      max_trans_amt: '',
      max_trans_count: '',
      mobile: '',
      credit_limit: '',
      otp: '',
      showOtp: false,
      showEditOtp: false,
      showOpeningOTP: false,
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
  addBranch = event => {
    event.preventDefault();

    this.setState({
      addBranchLoading: true,
    });

    axios
      .post(`${API_URL}/addBranchCashier`, this.state)
      .then(res => {
        if (res.status == 200) {
          if (res.data.error) {
            throw res.data.error;
          } else {
            this.setState({
              notification: 'Cashier added successfully!',
            });
            this.success();
            this.closePopup();
            this.getCashiers();
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

  addOpeningBalance = event => {
    event.preventDefault();
    if (this.state.total == '' || this.state.total == 0) {
      this.setState(
        {
          notification: 'You need to enter atleast one denomination',
        },
        () => {
          this.error();
        },
      );
    } else {
      this.setState(
        {
          showOpeningOTP: true,
          otpOpt: 'openingBalance',
          otpTxt: 'Your OTP to add opening balance is ',
        },
        () => {
          this.generateOTP();
        },
      );
    }
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
      .post(`${API_URL}/partnerBranch/editCashier`, this.state)
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
                this.getCashiers();
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

  verifyOpeningOTP = event => {
    this.setState({
      verifyEditOTPLoading: false,
    });
    event.preventDefault();
    axios
      .post(`${API_URL}/addOpeningBalance`, this.state)
      .then(res => {
        if (res.status == 200) {
          if (res.data.error) {
            throw res.data.error;
          } else {
            this.setState(
              {
                notification: 'Opening balance submitted successfully!',
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

  releaseCashier = (id) => {
    console.log(id);
    axios
      .put(`${API_URL}/updateOne`, { page: "cashier", token: token, type: "branch", page_id: id, updateData: { is_closed: false } })
      .then(res => {
        if (res.status == 200) {
          if (res.data.error) {
            throw res.data.error;
          } else {
            this.setState(
              {
                notification: 'Cashier Access Re-opened!',
              },
              function () {
                this.success();
                this.getCashiers();
              },
            );
          }
        } else {
          const error = new Error(res.data.error);
          throw error;
        }
      })
      .catch(err => {
        this.setState({
          notification: err.response ? err.response.data.error : err.toString(),
          verifyEditOTPLoading: false,
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

  getUsers = () => {
    axios
      .post(`${API_URL}/partnerBranch/getAll`, {
        page: 'partnerUser',
        token: token,
        where: { partner_id: partnerid },
      })
      .then(res => {
        if (res.status == 200) {
          this.setState({ loading: false, users: res.data.rows });
        }
      })
      .catch(err => { });
  };

  getCashiers = () => {
    axios
      .post(`${API_URL}/partnerBranch/getAll`, {
        page: 'partnerCashier',
        token: token,
        where: { branch_id: bid },
      })
      .then(res => {
        if (res.status == 200) {
          console.log(res.data);
          this.setState({ loading: false, branches: res.data.rows, copybranches: res.data.rows });
        }
      })
      .catch(err => { });
  };

  componentDidMount() {
    this.getCashiers();
    this.getUsers();
  }

  searchlistfunction = (value) => {
    console.log(value)
    // console.log(this.state.searchrules)
    const newfilterdata = this.state.copybranches.filter(element =>
      element.name.toLowerCase().includes(value.toLowerCase()),
    );

    this.setState({ branches: newfilterdata })

  }

  render() {
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
      <Wrapper from="bank">
        <Helmet>
          <meta charSet="utf-8" />
          <title>Cashiers | BANK | E-WALLET</title>
        </Helmet>
        <BranchHeader
          active="cashier"
          bankName={this.props.match.params.bank}
          bankLogo={STATIC_URL + logo}
        />
        <Container verticalMargin>
          <SidebarBranch bankName={this.props.match.params.bank} />
          <Main>
            <ActionBar
              marginBottom="33px"
              inputWidth="calc(100% - 241px)"
              className="clr"
            >
              <div className="iconedInput fl">
                <i className="material-icons">search</i>
                <input type="text" placeholder="Search Cashier" onChange={(e) => {
                  this.searchlistfunction(e.target.value)
                }} />
              </div>

              {/*<Button className="addBankButton" flex onClick={this.showPopup}>
                <i className="material-icons">add</i>
                <span>Create Cashier</span>
                </Button>*/}
            </ActionBar>
            <Card bigPadding>
              <div className="cardHeader">
                <div className="cardHeaderLeft">
                  <i className="material-icons">supervised_user_circle</i>
                </div>
                <div className="cardHeaderRight">
                  <h3>Cashier List</h3>
                  <h5>List of your cashier</h5>
                </div>
              </div>
              <div className="cardBody">
                <Table marginTop="34px" smallTd>
                  <thead>
                    <tr>
                      <th>Cashier Name</th>
                      <th>Cash in Hand</th>
                      {/* <th>Transaction limit ({CURRENCY})</th> */}
                      <th>Assigned to</th>
                      <th>Status</th>
                      <th>Transaction Count</th>

                    </tr>
                  </thead>
                  <tbody>
                    {this.state.branches && this.state.branches.length > 0 && this.state.users
                      ? this.state.branches.map(b => {
                        return (
                          <tr key={b._id}>
                            <td>{b.name}</td>
                            <td className="tac">
                              {CURRENCY}{' '}
                              {(
                                b.opening_balance +
                                (b.cash_received - b.cash_paid)
                              ).toFixed(2)}
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
                            <td style={{ color: b.is_closed ? 'red' : 'green' }}>
                              {b.is_closed ?
                                "Closed"
                                : "Opened"}
                            </td>
                            <td className="tac bold green">
                              {b.total_trans}
                              <span className="absoluteMiddleRight primary popMenuTrigger">
                                <i className="material-icons ">more_vert</i>
                                <div className="popMenu">
                                  <A
                                    href={
                                      '/branch/' +
                                      dis.props.match.params.bank +
                                      '/cashier/' +
                                      b._id
                                    }
                                  >
                                    Cashier Info
                                    </A>
                                  <span onClick={() => dis.showEditPopup(b)}>
                                    Edit
                                    </span>
                                  <span
                                    onClick={() => dis.showAssignPopup(b)}
                                  >
                                    Assign User
                                    </span>
                                  {b.is_closed ? (
                                    <span
                                      onClick={() => dis.releaseCashier(b._id)}
                                    >
                                      Re-open Access
                                    </span>
                                  ) : null
                                  }
                                  {/*b.opening_balance > 0 ? null : (
                                      <span
                                        onClick={() => dis.showOpeningPopup(b)}
                                      >
                                        Enter Opening Balance
                                      </span>
                                    )*/}

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
                  <h1>Create Cashier</h1>
                  <form action="" method="post" onSubmit={this.addBranch}>
                    <FormGroup>
                      <label>Cashier Name*</label>
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
                      <label>Cashier Code*</label>
                      <TextInput
                        type="text"
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
                        onChange={this.handleInputChange}
                        required
                      />
                    </FormGroup>

                    {this.state.addBranchLoading ? (
                      <Button filledBtn marginTop="50px" disabled>
                        <Loader />
                      </Button>
                    ) : (
                        <Button filledBtn marginTop="50px">
                          <span>Create Cashier</span>
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

        {this.state.openingPopup ? (
          <Popup close={this.closePopup.bind(this)} accentedH1>
            {this.state.showOpeningOTP ? (
              <div>
                <h1>
                  <FormattedMessage {...messages.verify} />
                </h1>
                <form action="" method="post" onSubmit={this.verifyOpeningOTP}>
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
                  <h1>Enter your opening balance</h1>
                  <form action="" method="post" onSubmit={this.addOpeningBalance}>
                    <FormGroup>
                      <Row>
                        <Col cW="15%" textAlign="right">
                          <strong>{CURRENCY} 10</strong>
                        </Col>
                        <Col cW="20%" textAlign="center">
                          X
                      </Col>
                        <Col cW="35%">
                          <TextInput
                            marginTop
                            type="text"
                            name="denom10"
                            autoFocus
                            value={this.state.denom10}
                            onChange={this.handleAmountChange}
                          />
                        </Col>
                      </Row>
                    </FormGroup>

                    <FormGroup>
                      <Row>
                        <Col cW="15%" textAlign="right">
                          <strong>{CURRENCY} 20</strong>
                        </Col>
                        <Col cW="20%" textAlign="center">
                          X
                      </Col>
                        <Col cW="35%">
                          <TextInput
                            marginTop
                            type="text"
                            name="denom20"
                            autoFocus
                            value={this.state.denom20}
                            onChange={this.handleAmountChange}
                          />
                        </Col>
                      </Row>
                    </FormGroup>

                    <FormGroup>
                      <Row>
                        <Col cW="15%" textAlign="right">
                          <strong>{CURRENCY} 50</strong>
                        </Col>
                        <Col cW="20%" textAlign="center">
                          X
                      </Col>
                        <Col cW="35%">
                          <TextInput
                            marginTop
                            type="text"
                            name="denom50"
                            autoFocus
                            value={this.state.denom50}
                            onChange={this.handleAmountChange}
                          />
                        </Col>
                      </Row>
                    </FormGroup>

                    <FormGroup>
                      <Row>
                        <Col cW="15%" textAlign="right">
                          <strong>{CURRENCY} 100</strong>
                        </Col>
                        <Col cW="20%" textAlign="center">
                          X
                      </Col>
                        <Col cW="35%">
                          <TextInput
                            marginTop
                            type="text"
                            name="denom100"
                            autoFocus
                            value={this.state.denom100}
                            onChange={this.handleAmountChange}
                          />
                        </Col>
                      </Row>
                    </FormGroup>

                    <FormGroup>
                      <Row>
                        <Col cW="15%" textAlign="right">
                          <strong>{CURRENCY} 1000</strong>
                        </Col>
                        <Col cW="20%" textAlign="center">
                          X
                      </Col>
                        <Col cW="35%">
                          <TextInput
                            marginTop
                            type="text"
                            name="denom1000"
                            autoFocus
                            value={this.state.denom1000}
                            onChange={this.handleAmountChange}
                          />
                        </Col>
                      </Row>
                    </FormGroup>

                    <FormGroup>
                      <Row>
                        <Col cW="15%" textAlign="right">
                          <strong>{CURRENCY} 2000</strong>
                        </Col>
                        <Col cW="20%" textAlign="center">
                          X
                      </Col>
                        <Col cW="35%">
                          <TextInput
                            marginTop
                            type="text"
                            name="denom2000"
                            autoFocus
                            value={this.state.denom2000}
                            onChange={this.handleAmountChange}
                          />
                        </Col>
                      </Row>
                    </FormGroup>

                    <Row>
                      <Col cW="15%" textAlign="right">
                        <strong>TOTAL</strong>
                      </Col>
                      <Col cW="20%" textAlign="center">
                        =
                    </Col>
                      <Col cW="35%">{this.state.total}</Col>
                    </Row>

                    {this.state.editBranchLoading ? (
                      <Button filledBtn marginTop="50px" disabled>
                        <Loader />
                      </Button>
                    ) : (
                        <Button filledBtn marginTop="50px">
                          <span>Submit</span>
                        </Button>
                      )}
                  </form>
                </div>
              )}
          </Popup>
        ) : null}
      </Wrapper>
    );
  }
}
