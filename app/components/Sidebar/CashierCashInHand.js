import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import axios from 'axios';
import Card from 'components/Card';
import Popup from 'components/Popup';
import TextInput from 'components/TextInput';
import FormGroup from 'components/FormGroup';
import Button from 'components/Button';
import Row from 'components/Row';
import Col from 'components/Col';
import Loader from 'components/Loader';
import SelectInput from 'components/SelectInput';
import Table from 'components/Table';

import { API_URL, CURRENCY } from 'containers/App/constants';

import 'react-toastify/dist/ReactToastify.css';

toast.configure({
  position: 'bottom-right',
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
});
const token = localStorage.getItem('cashierLogged');
const cid = localStorage.getItem('cashierId');
const email = localStorage.getItem('cashierEmail');
const mobile = localStorage.getItem('cashierMobile');
const cashierName = localStorage.getItem('cashierName');

class CashierCashInHand extends Component {
  constructor() {
    super();
    this.state = {
      balance: 0,
      incoming: []
    }
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

  closePopup = () => {
    this.setState({
      popupSendMoney: false,
      showSendMoneyOTP: false,
      showAcceptOtp: false,
      showCancelOtp: false,
      amount: '',
      cashier_id: '',
      otp: '',
      popresult: [],
      historyPop: false,
      incomingPop: false
    });
  };

  showPopupSendMoney = () => {
    if (this.state.balance > 0) {
      this.setState({ popupSendMoney: true });
    } else {
      this.setState({
        notification: "You have no cash in hand to transfer",
      }, () => {
        this.error();
      });
    }
  };

  cancelTransfer = (i) => {
    event.preventDefault();
    this.setState(
      {
        cancelId: i._id,
        showCancelOtp: true,
        otp: '',
        otpOpt: 'cashierCancelTransfer',
        otpEmail: email,
        otpMobile: mobile,
        otpTxt: 'Your OTP to add cancel the transfer '
      },
      () => {
        this.generateOTP();
      },
    );
  };

  verifyCancel = event => {

    event.preventDefault();

    this.setState({
      verifySendMoneyOTPLoading: true,
    });
    axios
      .post(`${API_URL}/partnerCashier/cancelTransfer`, {
        otpId: this.state.otpId,
        otp: this.state.otp,
        token,
        transfer_id: this.state.cancelId
      })
      .then(res => {
        if (res.status == 200) {
          if (res.data.error) {
            throw res.data.error;
          } else {
            console.log(res.data.status);
            this.setState({
              notification: 'Transfer Cancelled!',
            });
            this.success();
            this.closePopup();
            this.props.refresh();
          }
        } else {
          throw res.data.error;
        }
        this.setState({
          verifySendMoneyOTPLoading: false,
        });
      })
      .catch(err => {
        this.setState({
          notification: err.response ? err.response.data.error.toString() : err.toString(),
          verifySendMoneyOTPLoading: false,
        }, () => {
          this.error();
        });

      });
  };

  verifyAccept = event => {

    event.preventDefault();

    this.setState({
      verifySendMoneyOTPLoading: true,
    });
    axios
      .post(`${API_URL}/partnerCashier/acceptIncoming`, {
        otpId: this.state.otpId,
        otp: this.state.otp,
        token,
        item: this.state.acceptId
      })
      .then(res => {
        if (res.status == 200) {
          if (res.data.error) {
            throw res.data.error;
          } else {
            console.log(res.data.status);
            this.setState({
              notification: 'Transfer Accepted!',
            });
            this.success();
            this.closePopup();
            this.props.refresh();
          }
        } else {
          throw res.data.error;
        }
        this.setState({
          verifySendMoneyOTPLoading: false,
        });
      })
      .catch(err => {
        this.setState({
          notification: err.response ? err.response.data.error.toString() : err.toString(),
          verifySendMoneyOTPLoading: false,
        }, () => {
          this.error();
        });

      });
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

  sendMoney = event => {
    if (this.state.amount > this.state.balance) {
      this.setState({
        notification: "Amount has to be lesser  than or equal to cash in hand"
      });
      this.success();
    } else {
      event.preventDefault();
      this.setState(
        {
          showSendMoneyOTP: true,
          otp: '',
          otpOpt: 'cashierTransferMoney',
          otpEmail: email,
          otpMobile: mobile,
          otpTxt: 'Your OTP to add transfer money is '
        },
        () => {
          this.generateOTP();
        },
      );
    }

  };

  verifySendMoney = event => {

    event.preventDefault();
    let receiver = this.state.receiver_id.split(":");
    this.setState({
      verifySendMoneyOTPLoading: true,
    });
    axios
      .post(`${API_URL}/partnerCashier/transferMoney`, {
        otpId: this.state.otpId,
        otp: this.state.otp,
        token,
        amount: this.state.amount,
        sender_id: cid,
        sender_name: cashierName,
        receiver_id: receiver[0],
        receiver_name: receiver[1]
      })
      .then(res => {
        if (res.status == 200) {
          if (res.data.error) {
            throw res.data.error;
          } else {
            console.log(res.data.status);
            this.setState({
              notification: 'Transaction Successfully Done',
            });
            this.success();
            this.closePopup();
            this.props.refresh();
          }
        } else {
          throw res.data.error;
        }
        this.setState({
          verifySendMoneyOTPLoading: false,
        });
      })
      .catch(err => {
        this.setState({
          notification: err.response ? err.response.data.error.toString() : err.toString(),
          verifySendMoneyOTPLoading: false,
        }, () => {
          this.error();
        });

      });
  };

  accept = (i) => {
    event.preventDefault();
    this.setState(
      {
        acceptId: i,
        showAcceptOtp: true,
        otp: '',
        otpOpt: 'cashierAcceptTransfer',
        otpEmail: email,
        otpMobile: mobile,
        otpTxt: 'Your OTP to accept the transfer '
      },
      () => {
        this.generateOTP();
      },
    );
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
  showHistory = () => {
    this.setState({
      historyPop: true,
      historyLoading: true
    });
    this.getTransHistory();
  };

  showIncoming = () => {
    this.setState({
      incomingPop: true
    });
  };

  getTransHistory = () => {
    axios
      .post(`${API_URL}/getCashierTransfers`, {
        token: token
      })
      .then(res => {
        if (res.status == 200) {
          const history = res.data.history.reverse();
          this.setState({
            popresult: history,
            historyLoading: false
          });
        }
      })
      .catch(err => { });
  };

  getStats = () => {
    axios
      .post(`${API_URL}/partnerCashier/getDashStats`, {
        token: token
      })
      .then(res => {
        if (res.status == 200) {
          let received = res.data.cashReceived == null ? 0 : res.data.cashReceived;
          let paid = res.data.cashPaid == null ? 0 : res.data.cashPaid;
          let ob = res.data.openingBalance == null ? 0 : res.data.openingBalance;
          let dd = res.data.lastdate == null ? null : this.formatDate(res.data.lastdate);

          this.setState({

            lastdate: dd,
            transactionStarted: res.data.transactionStarted,
            loading: false,
            branch_id: res.data.branchId,
            balance: res.data.cashInHand,
            isClosed: res.data.isClosed
          }, () => {
            var dis = this;
            setTimeout(function () {
              dis.getStats();
            }, 3000);

          });
        }
      })
      .catch(err => {
        var dis = this;
        setTimeout(function () {
          dis.getStats();
        }, 3000);
      });
  };

  getIncoming = () => {
    axios
      .post(`${API_URL}/partnerCashier/getIncomingTransfer`, {
        token: token
      })
      .then(res => {
        if (res.status == 200) {
          const history = res.data.result.reverse();
          this.setState({
            incoming: history
          }, () => {

            var dis = this;
            setTimeout(function () {
              dis.getIncoming();
            }, 3000);
          });
        }
      })
      .catch(err => {
        var dis = this;
        setTimeout(function () {
          dis.getIncoming();
        }, 3000);
      });
  };

  getCashiers = () => {
    axios
      .post(`${API_URL}/partnerCashier/getAll`, {
        token: token,
        page: "partnerCashier",
        where: {
          branch_id: this.state.branch_id,
          _id: { $ne: cid },
          is_closed: false
        }
      })
      .then(res => {
        if (res.status == 200) {
          this.setState({
            cashiers: res.data.rows
          });
        }
      })
      .catch(err => {

      });
  };
  componentDidMount() {
    this.setState({
      bank: this.props.historyLink
    });

    this.getCashiers();
    this.getIncoming();
    this.getStats();

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
    var dis = this;
    return (
      <Card marginBottom="54px" buttonMarginTop="32px" bigPadding>
        <h3> Cash in Hand </h3>
        <h5>
          <FormattedMessage {...messages.available} />
        </h5>
        <div className="cardValue">
          {CURRENCY}
        </div>
        <h3>
          {
            this.state.transactionStarted && !this.state.isClosed ?
              <span style={{ float: "right", position: "relative", color: "#555", marginRight: '-20px',cursor: "pointer", right: '141px', fontSize: '16px' }} onClick={this.showIncoming}>
                 <span>Pending</span>
                <span style={{
                  fontSize: "16px",
                  color: "#ff1818",
                  fontWeight: "bold",
                  marginLeft: '10px',
                }}>{this.state.incoming.length}</span>
                {/* <i class="material-icons">notifications</i> */}

              </span>
              :
              <span style={{ float: "right", position: "relative", color: "#555", marginRight: '-20px', cursor: "pointer", right: '141px', fontSize: '16px' }} disabled>
                <span>Pending</span>
                 <span style={{
                   fontSize: "16px",
                   color: "#ff1818",
                   fontWeight: "bold",
                   marginLeft: '10px',
                 }}>{this.state.incoming.length}</span>
                {/* <i class="material-icons">notifications</i> */}

              </span>
          }

        </h3>
        <div className="cardValue">
         {this.state.balance.toFixed(2)}
        </div>
        {
          this.state.transactionStarted && !this.state.isClosed ?
            <Button
              className="sendMoneybutton"
              noMin
              onClick={this.showPopupSendMoney}

            >
              <i className="material-icons">send</i> Cashier to Cashier Transfer
            </Button>
            :
            <Button
              disabled
              className="sendMoneybutton"
              noMin

            >
              <i className="material-icons">send</i> Cashier to Cashier Transfer
            </Button>
        }

        <span
          className="anchor history"
          onClick={this.showHistory}
          style= {{right: '30px', bottom: '60px'}}
        >
          History
                      </span>
        {this.state.popupSendMoney ? (

          <Popup

            close={this.closePopup.bind(this)}
            accentedH1
          >
            {this.state.showSendMoneyOTP ?
              <div>
                <h1 >Verify OTP</h1>
                <form action="" method="post" onSubmit={this.verifySendMoney} >
                  <p>&nbsp;</p>
                  <FormGroup>
                    <label>OTP*</label>
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
                    this.state.verifySendMoneyOTPLoading ?
                      <Button filledBtn marginTop="50px" marginBottom="50px" disabled>
                        <Loader />
                      </Button>
                      :
                      <Button filledBtn marginTop="50px" marginBottom="50px">
                        <span>Verify</span>
                      </Button>
                  }


                  <p className="resend">Wait for <span className="timer">{this.state.timer}</span> to {this.state.resend ? <span className="go" onClick={this.generateOTP}>Resend</span> : <span>Resend</span>}</p>


                </form>
              </div>
              :
              <div>
                <h1>
                  Transfer Money
              </h1>
                <form
                  action=""
                  method="post"
                  onSubmit={this.sendMoney}
                >
                  <FormGroup>
                    <SelectInput
                      type="text"
                      name="receiver_id"
                      value={this.state.receiver_id}
                      onChange={this.handleInputChange}
                      required
                    >
                      <option value="">
                        Select Cashier
                              </option>
                      {
                        this.state.cashiers && this.state.cashiers.length > 0 ?
                          this.state.cashiers.map(function (v) {
                            return <option value={v._id + ":" + v.name} >{v.name}</option>
                          })
                          :
                          null
                      }
                    </SelectInput>
                  </FormGroup>
                  <FormGroup>
                    <label>Amount*</label>
                    <TextInput
                      type="number"
                      name="amount"
                      min="1"
                      onFocus={inputFocus}
                      onBlur={inputBlur}
                      value={this.state.amount}
                      onChange={this.handleInputChange}
                      required
                    />
                  </FormGroup>
                  <Button filledBtn marginTop="20px">
                    <span>
                      Proceed
                        </span>
                  </Button>


                </form>
              </div>
            }
          </Popup>
        ) : null}

        {this.state.historyPop ? (
          <Popup close={this.closePopup.bind(this)} accentedH1 bigBody>
            {this.state.showCancelOtp ?
              <div>
                <h1 >Verify OTP</h1>
                <form action="" method="post" onSubmit={this.verifyCancel} >
                  <p>&nbsp;</p>
                  <FormGroup>
                    <label>OTP*</label>
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
                    this.state.verifySendMoneyOTPLoading ?
                      <Button filledBtn marginTop="50px" marginBottom="50px" disabled>
                        <Loader />
                      </Button>
                      :
                      <Button filledBtn marginTop="50px" marginBottom="50px">
                        <span>Verify</span>
                      </Button>
                  }


                  <p className="resend">Wait for <span className="timer">{this.state.timer}</span> to {this.state.resend ? <span className="go" onClick={this.generateOTP}>Resend</span> : <span>Resend</span>}</p>


                </form>
              </div>
              :
              <div>
                <h1>Cashier to Cashier Transfer History</h1>
                {this.state.historyLoading ? (
                  <Button filledBtn disabled>
                    <Loader />
                  </Button>
                ) : (
                    <Table marginTop="34px" smallTd textAlign="center">
                      <thead>
                        <tr><th>Date & Time</th> <th>Details</th><th>Status</th></tr>
                      </thead>

                      <tbody>
                        {this.state.popresult && this.state.popresult.length > 0
                          ? this.state.popresult.map(function (b) {
                            var isoformat = b.created_at;
                            var fulldate = dis.formatDate(isoformat);

                            return <tr key={b._id}>
                              <td>
                                <div className="labelGrey">{fulldate}</div>
                              </td>
                              <td>
                                <div className="labelBlue">
                                  {
                                    b.sender_id == cid ?
                                      <span>Transfered {CURRENCY} {b.amount} to {b.receiver_name}</span>
                                      :
                                      <span>Received {CURRENCY} {b.amount} from {b.sender_name}</span>
                                  }  </div></td>
                              <td className="right">
                                <div className="labelGrey" >
                                  {b.status == 0 ? (
                                    <Button onClick={() => dis.cancelTransfer(b)} style={{ float: "right" }}>
                                      Cancel
                                    </Button>
                                  ) : (
                                      b.status == -1 ?
                                        <span>
                                          Cancelled
                                    </span>
                                        :
                                        <span>
                                          Completed
                                    </span>
                                    )}
                                </div>
                              </td>
                            </tr>

                          })
                          : null}
                      </tbody>
                    </Table>
                  )}
              </div>
            }
          </Popup>
        ) : null}

        {this.state.incomingPop ? (
          <Popup close={this.closePopup.bind(this)} accentedH1 bigBody>
            {this.state.showCancelOtp ?
              <div>
                <h1 >Verify OTP</h1>
                <form action="" method="post" onSubmit={this.verifyCancel} >
                  <p>&nbsp;</p>
                  <FormGroup>
                    <label>OTP*</label>
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
                    this.state.verifySendMoneyOTPLoading ?
                      <Button filledBtn marginTop="50px" marginBottom="50px" disabled>
                        <Loader />
                      </Button>
                      :
                      <Button filledBtn marginTop="50px" marginBottom="50px">
                        <span>Verify</span>
                      </Button>
                  }


                  <p className="resend">Wait for <span className="timer">{this.state.timer}</span> to {this.state.resend ? <span className="go" onClick={this.generateOTP}>Resend</span> : <span>Resend</span>}</p>


                </form>
              </div>
              :
              this.state.showAcceptOtp ?
                <div>
                  <h1 >Verify OTP</h1>
                  <form action="" method="post" onSubmit={this.verifyAccept} >
                    <p>&nbsp;</p>
                    <FormGroup>
                      <label>OTP*</label>
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
                      this.state.verifySendMoneyOTPLoading ?
                        <Button filledBtn marginTop="50px" marginBottom="50px" disabled>
                          <Loader />
                        </Button>
                        :
                        <Button filledBtn marginTop="50px" marginBottom="50px">
                          <span>Verify</span>
                        </Button>
                    }


                    <p className="resend">Wait for <span className="timer">{this.state.timer}</span> to {this.state.resend ? <span className="go" onClick={this.generateOTP}>Resend</span> : <span>Resend</span>}</p>


                  </form>
                </div>
                :
                <div>
                  <h1>Incoming Transfers</h1>

                  <Table marginTop="34px" smallTd textAlign="center">
                    <thead>
                      <tr><th>Date & Time</th> <th>Details</th><th></th></tr>
                    </thead>

                    <tbody>
                      {this.state.incoming && this.state.incoming.length > 0
                        ? this.state.incoming.map(function (b) {
                          var isoformat = b.created_at;
                          var fulldate = dis.formatDate(isoformat);

                          return <tr key={b._id}>
                            <td>
                              <div className="labelGrey">{fulldate}</div>
                            </td>
                            <td>
                              <div className="labelBlue">
                                {
                                  <span>Recived {CURRENCY} {b.amount} from {b.sender_name}</span>
                                }  </div></td>
                            <td className="right">
                              <div className="labelGrey">
                                {b.status == 0 ? (
                                  <div>
                                    <Row>
                                      <Col>
                                        <Button onClick={() => dis.accept(b)}>Accept</Button></Col><Col>
                                        <Button onClick={() => dis.cancelTransfer(b)}>Cancel</Button></Col>
                                    </Row>
                                  </div>
                                ) : (
                                    b.status == -1 ?
                                      <span>
                                        Cancelled
                                    </span>
                                      :
                                      <span>
                                        Completed
                                    </span>
                                  )}
                              </div>
                            </td>
                          </tr>

                        })
                        : null}
                    </tbody>
                  </Table>

                </div>
            }
          </Popup>
        ) : null}
      </Card>
    );
  }
}

export default CashierCashInHand;
