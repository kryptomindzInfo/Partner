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

import Wrapper from 'components/Wrapper';
import CashierHeader from 'components/Header/CashierHeader';
import Container from 'components/Container';
import Loader from 'components/Loader';
import Row from 'components/Row';
import Col from 'components/Col';
import Card from 'components/Card';
import ActionBar from 'components/ActionBar';
import SidebarCashier from 'components/Sidebar/SidebarCashier';
import Main from 'components/Main';
import Table from 'components/Table';
import Popup from 'components/Popup';
import Button from 'components/Button';
import Footer from 'components/Footer';
import endOfDay from 'date-fns/endOfDay';
import startOfDay from 'date-fns/startOfDay';
import { API_URL, CURRENCY, STATIC_URL } from '../App/constants';
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
const bid = localStorage.getItem('cashierId');
const logo = localStorage.getItem('bankLogo');
const email = localStorage.getItem('cashierEmail');
const mobile = localStorage.getItem('cashierMobile');
const bankId = localStorage.getItem('bankId');
//enable the following line and disable the next line to test for tomorrow
var today =new Date(new Date().setDate(new Date().getDate()+1));
//var today =new Date();
today.setHours(0, 0, 0, 0);
today = today.getTime();
console.log(today);



export default class CashierDashboard extends Component {
  constructor() {
    super();
    this.state = {
      token,
      bankName: localStorage.getItem('bankName'),
      bankLogo: localStorage.getItem('bankLogo'),
      otpEmail: email,
      otpMobile: mobile,
      agree:false,
      historyPop: false,
      tomorrow: false,
      trans_type: '',
      cashReceived: 0,
      openingBalance: 0,
      closingBalance: 0,
      cashPaid: 0,
      feeGenerated: 0,
      commissionGenerated: 0,
      closingTime: null,
      pending:[],
      filter: '',
      loading: false,
      sentRow: [],
      receivedRow: [],
      allRow: [],
      selectedRow: [],
    };
    this.success = this.success.bind(this);
    this.error = this.error.bind(this);
    this.warn = this.warn.bind(this);

    this.showHistory = this.showHistory.bind(this);
    this.child = React.createRef();
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
      historyPop: false,
      openCashierPopup: false,
      showOpeningOTP: false,
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
    this.setState({
      showPending: true
    });

  };


proceed = (items,type,interbank) => {
  this.child.current.proceed(items,type,interbank);
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

handleCheckbox = event => {
    const { value, name } = event.target;
    if(value == "true"){
      var v = false;
    }else{
      var v = true;
    }
    this.setState({
      [name]: v,
    });
};

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
      .catch(err => {});
};

showHistory = () => {
    this.setState({ history: [] }, () => {
      var out = [];
      var start = (this.state.activePage - 1) * this.state.perPage;
      var end = this.state.perPage * this.state.activePage;
      if (end > this.state.totalCount) {
        end = this.state.totalCount;
      }
      for (var i = start; i < end; i++) {
        out.push(this.state.allhistory[i]);
      }
      this.setState({ history: out }, () => {
        let dis = this;
        setTimeout(function() {
          dis.getHistory();
        }, 3000);
      });
    });
};

getHistory = () => {
    axios
      .post(`${API_URL}/partnerCashier/getHistory`, {
        token: token,
        where: { cashier_id: bid },
        from: 'operational',
        page: this.state.activePage,
        offset: this.state.perPage,
      })
      .then(res => {
        if (res.status == 200) {
          const pendingHistory = res.data.pending.reverse();
          this.setState(
            {
              pending: pendingHistory,
              loading: false,
            },
            () => {
              // this.showHistory();
            },
          );
        }
      })
      .catch(err => {});
};

getTransactions = async(after,before) => {
    console.log(after);
    try{
      const res = await axios.post(`${API_URL}/partnerCashier/queryTransactionStates`, {
        token: token,
        bank_id: bankId,
        status: "2",
        date_after: after,
        date_before: before,
        page_start: 0,
        limit: 100
      });
      if (res.status === 200) {
        if (res.data.status === 0) {
          return { data: {}, loading: false };
        }
        return { data: res.data.transactions, loading: false };
      }
      return { data: {}, loading: false };
    } catch (err) {
      return { data: {}, loading: false };
    }
  };

  getStats = () => {
    axios
      .post(`${API_URL}/partnerCashier/getDashStats`, {
        token: token
      })
      .then(res => {
        console.log(res);
        if (res.status == 200) {
          let received = res.data.cashReceived == null ? 0 : res.data.cashReceived;
          let paid = res.data.cashPaid == null ? 0 : res.data.cashPaid;
          var closingTime = res.data.closingTime;

          if(closingTime != undefined && closingTime != null){
             closingTime  = new Date(closingTime);
                          closingTime.setHours(0, 0, 0, 0);
              closingTime = closingTime.getTime();
              if(res.data.isClosed && closingTime < today ){
                closingTime = true;
              }else{
                closingTime = false;
              }
          }else if(!res.data.transactionStarted){
            closingTime = true;
          }
          this.setState(
            {
              tomorrow: closingTime,
              closingTime:  res.data.closingTime,
              loading: false,
              openingBalance: res.data.openingBalance,
              closingBalance: res.data.closingBalance,
              cashReceived: received,
              cashPaid: paid,
              feeGenerated: res.data.feeGenerated,
              commissionGenerated: res.data.commissionGenerated,
              isClosed: res.data.isClosed
            },
            () => {
              var dis = this;
              setTimeout(function() {
                dis.getStats();
              }, 10000);
            },
          );
        }
      })
      .catch(err => {
        var dis = this;
              setTimeout(function() {
                dis.getStats();
              }, 10000);
      });
  };

  filterData = (type) => {
    if ( type === 'all' ) {
      this.setState({ selectedRow: this.state.allRow });
    }else if ( type === 'sent') {
      this.setState({ selectedRow: this.state.sentRow });
    }else{
      console.log(this.state.receivedRow);
      this.setState({ selectedRow: this.state.receivedRow });
    }
  };

  getData = async() => {
    this.setState({loading: true});
    const after = new Date();
    const before = new Date();
    after.setHours(0,0,0,0);
    before.setHours(23,59,59,0);
    const transactions = await this.getTransactions(after,before);
    console.log(transactions);
    this.setState({
      selectedRow: transactions.data.reverse(),
      allRow: transactions.data,
      receivedRow: transactions.data.filter(val=> val.txType === 'Non Wallet To Non Wallet'),
      sentRow: transactions.data.filter(val=> val.txType === 'Non Wallet to Wallet' || val.txType === 'Non Wallet To Non Wallet'),
      loading: transactions.loading,
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
    return  h + ':' + mi;
    // return d + ' ' + mlong + ' ' + y + ' ' + h + ':' + mi;
  };

  componentDidMount() {
    this.getStats();
    this.getData();
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

    var tempDate = new Date();
    var date =
      tempDate.getDate() +
      '-' +
      (tempDate.getMonth() + 1) +
      '-' +
      tempDate.getFullYear()
    const currDate = this.formatDate(tempDate);

    if (this.state.loading) {
      return <Loader fullPage />;
    }

    return (
      <Wrapper from="branch">
        <Helmet>
          <meta charSet="utf-8" />
          <title>Dashboard | CASHIER | E-WALLET</title>
        </Helmet>
        <CashierHeader
          active="dashboard"
          bankName={this.props.match.params.bank}
          bankLogo={STATIC_URL + logo}
          from="cashier"
        />
        <Container verticalMargin>
          <SidebarCashier refresh={this.getData.bind(this)}  bankName={this.props.match.params.bank} branchName={this.props.match.params.bank} ref={this.child} />
          <Main>

            <div className="clr">
              <Row>
                <Col>
                  <Card
                    horizontalMargin="7px"
                    cardWidth="170px"
                    h4FontSize="16px"
                    smallValue
                    textAlign="center"
                    col
                  >
                    <h4>Opening Balance</h4>
                    <div className="cardValue">
                    {
                      <span> {CURRENCY} {this.state.openingBalance.toFixed(2)}</span>
                    }
                    </div>
                  </Card>
                </Col>
                <Col>
                  <Card
                    horizontalMargin="7px"
                    cardWidth="170px"
                    h4FontSize="16px"
                    smallValue
                    textAlign="center"
                    col
                  >
                    <h4>Cash Received</h4>
                    <div className="cardValue">
                      {CURRENCY} {this.state.cashReceived.toFixed(2)}
                    </div>
                  </Card>
                </Col>
                <Col>
                 <Card
                    horizontalMargin="7px"
                    cardWidth="170px"
                    h4FontSize="16px"
                    smallValue
                    textAlign="center"
                    col
                  >
                    <h4>Paid in Cash</h4>
                    <div className="cardValue">
                      {CURRENCY} {this.state.cashPaid.toFixed(2)}
                    </div>
                  </Card>
                </Col>
                <Col>
                  <Card
                    horizontalMargin="7px"
                    cardWidth="170px"
                    smallValue
                    h4FontSize="16px"
                    textAlign="center"
                    col
                  >
                    <h4>Fee</h4>
                    <div className="cardValue">
                      {CURRENCY} {this.state.feeGenerated.toFixed(2)}
                    </div>
                  </Card>
                </Col>
                <Col>
                  <Card
                    horizontalMargin="7px"
                    cardWidth="170px"
                    smallValue
                    h4FontSize="16px"
                    textAlign="center"
                    col
                  >
                    <h4>Commision</h4>
                    <div className="cardValue">
                      {CURRENCY}  {this.state.commissionGenerated.toFixed(2)}
                    </div>
                  </Card>
                </Col>
              </Row>
            </div>

            <Card bigPadding style={{marginTop: '50px'}}>
              <div className="cardHeader">
                <div className="cardHeaderLeft">
                  <i className="material-icons">playlist_add_check</i>
                </div>
                <div className="cardHeaderRight">
                  <h3>Today's Activity</h3>
                  <h5>E-wallet activity</h5>
                </div>
              </div>
              <div className="cardBody">
                <div className="clr">
                  <div className="menuTabs" onClick={() => this.filterData('all')}>
                    All
                  </div>
                  <div
                    className="menuTabs"
                    onClick={() => this.filterData('sent')}
                  >
                    Payment Sent
                  </div>
                  <div
                    className="menuTabs"
                    onClick={() => this.filterData('received')}
                  >
                    Payment Received
                  </div>
                  <div
                    className="menuTabs"
                    onClick={() => this.filterData('received')}
                  >
                    Invoices Paid
                  </div>
                  {/* <div
                    className="menuTabs"
                    onClick={() => this.showPending()}
                  >
                    Transaction Pending
                  </div> */}
                </div>

                <Table
                  marginTop="34px"
                  marginBottom="34px"
                  smallTd
                  textAlign="left"
                >
                {
                  this.state.showPending ?
                 <tbody>
                {

                      this.state.pending.length > 0
                      ? this.state.pending.map(function(b) {

                        var fulldate = dis.formatDate(b.created_at);
                        return  <tr key={b._id}>
                              <td>
                                <div className="labelGrey">{fulldate}</div>
                              </td>
                              <td>
                                <div
                                  className="labelBlue"
                                >

                                    <span>
                                      Cash sent from{' '}
                                      {b.sender_name}{' '}
                                      to{' '}
                                      {b.receiver_name}
                                    </span>

                                </div>
                                <div className="labelSmallGrey">
                                  {b.status == 1 ?
                                    <div>
                                    <span>Approved</span>
                                    <br />
                                    <Button style={{marginTop: '10px'}} onClick={() => dis.proceed(JSON.parse(b.transaction_details),b.trans_type,b.interbank)}>Proceed</Button>
                                    </div>
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
                :
                  <tbody>
                      {this.state.selectedRow.length > 0
                          ? this.state.selectedRow.map( (b,i) => {
                            var fulldate = dis.formatDate(b.createdAt);
                            let child = [];
                            if (this.state.selectedRow === this.state.receivedRow){
                              child = b.childTx.filter(c=>c.transaction.note === "Cashier claim Money");
                              console.log(child);
                            }else{
                              child = b.childTx;
                            }
                            if(child.length>0){
                            return (
                            <tr key={i} >
                              <td style={{textAlign:"center"}}>
                                <div className="labelGrey">{fulldate}</div>
                              </td>
                              <td style={{textAlign:"center"}}>
                                <div className="labelGrey">
                                  Transfered From {child[0].transaction.from_name} to {child[0].transaction.to_name}
                                </div>
                              </td>
                              <td style={{textAlign:"center"}}>
                                <div className="labelGrey">{b.txType}</div>
                              </td>
                              <td style={{textAlign:"center"}}>
                                <div className="labelGrey">Completed</div>
                              </td>
                              <td style={{textAlign:"center"}}> 
                                <div className="labelGrey">XOF {child[0].transaction.amount}</div>
                              </td>
                              <td className="tac bold green">
                              <span className="absoluteMiddleRight primary popMenuTrigger">
                                <i className="material-icons ">more_vert</i>
                                <div className="popMenu">
                                  <span >
                                    Receipt
                                  </span>
                                </div>
                              </span>
                            </td>

                            </tr>
                            )
                            }
                          })
                          : null
                      }
                    </tbody>
                  
                }
                </Table>
              </div>
            </Card>
          </Main>
        </Container>
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
                      ? this.state.popresult.map(function(b) {
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

      <Footer bankname={this.state.bankName} banklogo={this.state.bankLogo}/>
      </Wrapper>
    );
  }
}
