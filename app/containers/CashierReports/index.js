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
import Card from 'components/Card';
import ActionBar from 'components/ActionBar';
import PrintIcon from '@material-ui/icons/Print';
import SidebarCashier from 'components/Sidebar/SidebarCashier';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import Main from 'components/Main';
import Table from 'components/Table';
import Pagination from 'react-js-pagination';
import TextInput from 'components/TextInput';
import Popup from 'components/Popup';
import Button from 'components/Button';
import ReactToPrint from 'react-to-print';
import Row from 'components/Row';
import Col from 'components/Col';
import Footer from 'components/Footer';
import FormGroup from 'components/FormGroup';

import { API_URL, CURRENCY, STATIC_URL } from '../App/constants';

import 'react-toastify/dist/ReactToastify.css';
import { getDayOfYear } from 'date-fns';

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
var today = new Date(new Date().setDate(new Date().getDate() + 1));
//var today =new Date();
today.setHours(0, 0, 0, 0);
today = today.getTime();




export default class CashierDashboard extends Component {
  constructor() {
    super();
    this.state = {
      token,
      toggle: 'report',
      bankName: localStorage.getItem('bankName'),
      bankLogo: localStorage.getItem('bankLogo'),
      branchName: localStorage.getItem('branchName'),
      partnerName: localStorage.getItem('partnerName'),
      cashierName: localStorage.getItem('cashierName'),
      formDate: new Date(),
      startDate: new Date(),
      endDate: new Date(),
      otpEmail: email,
      otpMobile: mobile,
      agree: false,
      showPending: false,
      loading:true,
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
      perPage: 20,
      totalCount: 100,
      allhistory: {},
      DR:{},
      CR:{},
      activePage: 1,
      active: 'Active',
      trans_from: '',
      trans_to: '',
      transcount_from: '',
      sendMoneyNwtNw: [],
      sendMoneyNwtW: [],
      sendMoneyNwtM: [],
      sendMoneyNwtO: [],
      sendMoneyWtNw: [],
      total1: 0,
      total2: 0,
      total3: 0,
      total4: 0,
      total5: 0,
      total6: 0,
      reports: [],
      datereport: [],
      history: [],
      filter: '',
    };
    this.success = this.success.bind(this);
    this.error = this.error.bind(this);
    this.warn = this.warn.bind(this);
    this.componentRef = React.createRef();

    this.child = React.createRef();
  }

  success = () => toast.success(this.state.notification);

  error = () => toast.error(this.state.notification);

  warn = () => toast.warn(this.state.notification);

  
  getHistory = async(after,before) => {
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
      if (res.status == 200) {
        return ({
          sendMoneyNwtNw:res.data.transactions.filter(trans => trans.txType === "Non Wallet To Non Wallet" ),
          sendMoneyNwtW: res.data.transactions.filter(trans => trans.txType === "Non Wallet to Wallet" ),
          sendMoneyNwtM: res.data.transactions.filter(trans => trans.txType === "Non Wallet to Merchant" ),
          sendMoneyNwtO: res.data.transactions.filter(trans => trans.txType === "Non Wallet to Operational"),
          sendMoneyWtNw:res.data.transactions.filter(trans => trans.txType === "Wallet To Non Wallet"),
        });
      }
    } catch (err){
      console.log(err);
    }
    
      
  };

  getReport = async(after,before) => {
    try{
      const res = await axios.post(`${API_URL}/partnerCashier/getDailyReport`, {
        token: token,
        start:after,
        end: before,
      });
      if (res.status == 200) {
        return ({
         result:res.data,
         loading: false,
        });
      }
    } catch (err){
      console.log(err);
    }
    
      
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
          var closingTime = res.data.closingTime;

          if (closingTime != undefined && closingTime != null) {
            closingTime = new Date(closingTime);
            closingTime.setHours(0, 0, 0, 0);
            closingTime = closingTime.getTime();
            if (res.data.isClosed && closingTime < today) {
              closingTime = true;
            } else {
              closingTime = false;
            }
          } else if (!res.data.transactionStarted) {
            closingTime = true;
          }
          this.setState(
            {
              tomorrow: closingTime,
              closingTime: res.data.closingTime,
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

  

  handlePageChange = pageNumber => {
    this.setState({ activePage: pageNumber });
    this.showHistory();
  };

  getBranchByName = () => {
    try{
      const res = axios.post(`${API_URL}/getBranchByName`, {
        name: this.props.match.params.bank,
      })
      if(res.status == 200) {
        return res.data.banks; 
      }
    }catch(err){
      console.log(res);
    }
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
    return (
      {
        date: d + ' ' + mlong + ' ' + y,
        time: h + ':' + mi,
      }
    )
  };

  getData = async() => {
    this.setState(
      {
        loading:true,
      }
    );
    const after = new Date(this.state.formDate);
    const before = new Date(this.state.formDate);
    after.setHours(0,0,0,0);
    before.setHours(23,59,59,0);
    const branch=await this.getBranchByName();
    this.getStats();
    const allHistory = await this.getHistory(after,before);
    const report = await this.getReport(after,before);
    console.log(report.result);
    this.setState(
      {
        datereport: report.result.reports,
        branchDetails:branch,
        total1: (allHistory.sendMoneyNwtNw.reduce(
          function(a, b){
            return a + (b.childTx[0].transaction.amount);
          }, 0)),
        total2: (allHistory.sendMoneyNwtW.reduce(
          function(a, b){
            return a + (b.childTx[0].transaction.amount);
          }, 0)),
        total3: (allHistory.sendMoneyNwtM.reduce(
          function(a, b){
            return a + (b.childTx[0].transaction.amount);
          }, 0)),
        total4: (allHistory.sendMoneyNwtO.reduce(
          function(a, b){
            return a + (b.childTx[0].transaction.amount);
          }, 0)),
        total5: (allHistory.sendMoneyWtNw.reduce(
          function(a, b){
            return a + (b.childTx[0].transaction.amount);
          }, 0)),
        sendMoneyNwtNw: allHistory.sendMoneyNwtNw.reverse(),
        sendMoneyNwtW: allHistory.sendMoneyNwtW.reverse(),
        sendMoneyNwtM: allHistory.sendMoneyNwtM.reverse(),
        sendMoneyNwtO: allHistory.sendMoneyNwtO.reverse(),
        sendMoneyWtNw: allHistory.sendMoneyWtNw.reverse(),
        loading:false,
      }
    );

  };

  getDailyReport = async() => {
    this.setState(
      {
        loading:true,
      }
    );
    const after = new Date(this.state.startDate);
    const before = new Date(this.state.endDate);
    after.setHours(0,0,0,0);
    before.setHours(23,59,59,0);
    const branch = await this.getBranchByName();
    const report = await this.getReport(after,before);
    console.log(report.result);
    this.setState(
      {
        branchDetails:branch,
        reports:report.result.reports,
        loading:false,
      }
    );

  };

  componentDidMount= async() => {
    this.getData();
    
  };

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

    var tempDate = new Date();
    var date =
      tempDate.getDate() +
      '-' +
      (tempDate.getMonth() + 1) +
      '-' +
      tempDate.getFullYear()
    const currDate = this.formatDate(tempDate);
    return (
      <Wrapper from="branch">
        <Helmet>
          <meta charSet="utf-8" />
          <title>Dashboard | CASHIER | E-WALLET</title>
        </Helmet>
        <CashierHeader
          active="reports"
          bankName={this.props.match.params.bank}
          bankLogo={STATIC_URL + logo}
          from="cashier"
        />
        <Container verticalMargin>
        <div
                style={{
                  justifyContent: 'left',
                  marginTop: '10px',
                  marginBottom: '10px',
                }}
              >
                <Row>
                  <Col cW="10%">
                      <Button
                        className={this.state.toggle === 'report' ? 'active' : ''}
                        onClick={()=>{this.setState({
                          toggle:'report'
                        })}}
                        style={{marginLeft:'5px'}}
                      >
                      Transaction Report
                    </Button>
                  </Col>
                  <Col cW="10%">
                      <Button
                        className={this.state.toggle === 'discrepancy' ? 'active' : ''}
                        onClick={()=>{this.setState({
                          toggle:'discrepancy'
                        })}}
                        style={{marginLeft:'5px'}}
                      >
                       Daily Report
                      </Button>
                  </Col>
                  <Col cW="80%"></Col>
                </Row>
              </div>
          
        <ActionBar
              marginBottom="15px"
              marginTop="15px"
              inputWidth="calc(100% - 241px)"
              className="clr"
            >
              {this.state.toggle === 'report' ? (
              <div>
                <h4 style={{color:"green"}}><b>Date</b></h4>
                  <Row>
                    <Col cW='35%'>
                      <FormGroup>
                      <MuiPickersUtilsProvider
                       utils={DateFnsUtils}
                                                >
                        <KeyboardDatePicker
                        id="date-picker-dialog"
                        size="small"
                        maxDate={new Date()}
                        fullWidth
                        inputVariant="outlined"
                        format="dd/MM/yyyy"
                        required
                        InputLabelProps={{
                        shrink: true,
                        }}
                        value={
                          this.state.formDate
                          }
                        onChange={date =>
                        this.setState({
                          formDate: date,
                        })
                        }
                         KeyboardButtonProps={{
                        'aria-label': 'change date',
                                                    }}
                        />
                      </MuiPickersUtilsProvider>
                      </FormGroup>
                    </Col>
                    <Col cw='25%'>
                      <Button 
                        style={{padding:'9px', color:'white', backgroundColor:'#417505'}}
                        onClick={()=>this.getData()}
                      >
                        Get Report
                      </Button>
                    </Col>
                    <Col cW='40%'></Col>
                  </Row>
              </div>
              ) : (
                <div>
                  <h4 style={{color:"green"}}><b>Date Range</b></h4>
                  <Row>
                    <Col cW='25%'>
                      <FormGroup>
                      <MuiPickersUtilsProvider
                       utils={DateFnsUtils}
                                                >
                        <KeyboardDatePicker
                        id="date-picker-dialog"
                        size="small"
                        maxDate={new Date()}
                        fullWidth
                        inputVariant="outlined"
                        format="dd/MM/yyyy"
                        required
                        InputLabelProps={{
                        shrink: true,
                        }}
                        value={
                          this.state.startDate
                          }
                        onChange={date =>
                        this.setState({
                          startDate: date,
                        })
                        }
                         KeyboardButtonProps={{
                        'aria-label': 'change date',
                                                    }}
                        />
                      </MuiPickersUtilsProvider>
                      </FormGroup>
                    </Col>
                    <Col cW='2%'> to </Col>
                    <Col cW='25%'>
                      <FormGroup>
                      <MuiPickersUtilsProvider
                       utils={DateFnsUtils}
                                                >
                        <KeyboardDatePicker
                        id="date-picker-dialog"
                        size="small"
                        maxDate={new Date()}
                        fullWidth
                        inputVariant="outlined"
                        format="dd/MM/yyyy"
                        required
                        InputLabelProps={{
                        shrink: true,
                        }}
                        value={
                          this.state.endDate
                          }
                        onChange={date =>
                        this.setState({
                          endDate: date,
                        })
                        }
                         KeyboardButtonProps={{
                        'aria-label': 'change date',
                                                    }}
                        />
                      </MuiPickersUtilsProvider>
                      </FormGroup>
                    </Col>
                    <Col cw='25%'>
                      <Button 
                        style={{padding:'9px', color:'white', backgroundColor:'#417505'}}
                        onClick={()=>this.getDailyReport()}
                      >
                        Get Report
                      </Button>
                    </Col>
                    <Col cW='13%'></Col>
                  </Row>


                </div>
              )}
        </ActionBar>
        <Card marginBottom="20px" buttonMarginTop="5px" smallValue style={{height:'80px'}}>
        <Row>
        <Col>
          <h4 style={{color:"green",marginBottom:"20px" }}><b>Bank Name : </b>{this.state.bankName} </h4> 
          </Col>
          <Col>
          <h4 style={{color:"green",marginBottom:"20px" }}><b>Partner Name : </b>{this.state.partnerName}</h4> 
          </Col>
          </Row>
          <Row>
          <Col>
          <h4 style={{color:"green", marginBottom:"20px"}}><b>Branch Name : </b>{this.state.branchName}</h4>      
          </Col>
          <Col>
          <h4 style={{color:"green", marginBottom:"20px"}}><b>Cashier Name : </b>{this.state.cashierName}</h4> 
             
          </Col>
          </Row>
          {/* <Row>
          <Button style={{float:'right'}}>Download as CSV</Button>
          </Row> */}
      </Card>

      <ReactToPrint
        trigger={() => <Button ><PrintIcon/>  Print</Button>}
        content={() => this.componentRef.current}
      />
      <div ref={this.componentRef}>
      {this.state.toggle === 'report' ? (
      <div>
        <div className="clr">
          <Row style={{backgroundColor:"lightgray"}}>
            <Col >
            <Card
                horizontalMargin="7px"
                cardWidth="-webkit-fill-available"
                h4FontSize="16px"
                smallValue
                textAlign="center"
                col
                style={{backgroundColor:"lightgray"}}
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
                cardWidth="-webkit-fill-available"
                h4FontSize="16px"
                smallValue
                textAlign="center"
                col
                style={{
                  backgroundColor:"lightgray",
                  borderStyle:"hidden hidden hidden solid",
                  borderColor:"grey"
                }}
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
                cardWidth="-webkit-fill-available"
                h4FontSize="16px"
                smallValue
                textAlign="center"
                col
                style={{
                  backgroundColor:"lightgray",
                  borderStyle:"hidden hidden hidden solid",
                  borderColor:"grey"
                }}
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
                cardWidth="-webkit-fill-available"
                smallValue
                h4FontSize="16px"
                textAlign="center"
                col
                style={{
                  backgroundColor:"lightgray",
                  borderStyle:"hidden hidden hidden solid",
                  borderColor:"grey"
                }}
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
                cardWidth="-webkit-fill-available"
                smallValue
                h4FontSize="16px"
                textAlign="center"
                col
                style={{
                  backgroundColor:"lightgray",
                  borderStyle:"hidden hidden hidden solid",
                  borderColor:"grey"
                }}
              >
                <h4>Commision</h4>
                <div className="cardValue">
                  {CURRENCY}  {this.state.commissionGenerated.toFixed(2)}
                </div>
              </Card>
            </Col>
          </Row>
          <Row style={{backgroundColor:"lightgray", marginTop:'20px'}}>
            <Col >
            <Card
                horizontalMargin="7px"
                cardWidth="-webkit-fill-available"
                h4FontSize="16px"
                smallValue
                textAlign="center"
                col
                style={{backgroundColor:"lightgray"}}
              >
                <h4>Closing Balance</h4>
                <div className="cardValue">
                  {
                    <span> {CURRENCY} {this.state.datereport.length > 0 ? this.state.datereport[0].closing_balance : "-"}</span>
                  }
                </div>
              </Card>
            </Col>
            <Col>
            <Card
                horizontalMargin="7px"
                cardWidth="-webkit-fill-available"
                h4FontSize="16px"
                smallValue
                textAlign="center"
                col
                style={{
                  backgroundColor:"lightgray",
                  borderStyle:"hidden hidden hidden solid",
                  borderColor:"grey"
                }}
              >
                <h4>Closing Time</h4>
                <div className="cardValue">
                {
                    <span>{this.state.datereport.length > 0 ? `${new Date(this.state.datereport[0].closing_time).getHours()}:${new Date(this.state.datereport[0].closing_time).getMinutes()}` : "-:--"}</span>
                }
                </div>
              </Card>
            </Col>
            <Col>
            <Card
                horizontalMargin="7px"
                cardWidth="-webkit-fill-available"
                h4FontSize="16px"
                smallValue
                textAlign="center"
                col
                style={{
                  backgroundColor:"lightgray",
                  borderStyle:"hidden hidden hidden solid",
                  borderColor:"grey"
                }}
              >
                <h4>Report Date</h4>
                <div className="cardValue">
                 {`${new Date().getDate()}/${new Date().getMonth()-1}/${new Date().getFullYear()}`}
                </div>
              </Card>
            </Col>
            <Col>
            <Card
                horizontalMargin="7px"
                cardWidth="-webkit-fill-available"
                smallValue
                h4FontSize="16px"
                textAlign="center"
                col
                style={{
                  backgroundColor:"lightgray",
                  borderStyle:"hidden hidden hidden solid",
                  borderColor:"grey"
                }}
              >
                <h4>Opening Time</h4>
                <div className="cardValue">
                {
                    <span>{this.state.datereport.length > 0 ? `${new Date(this.state.datereport[0].opening_time).getHours()}:${new Date(this.state.datereport[0].opening_time).getMinutes()}` : "-:--"}</span>
                }
                </div>
              </Card>
            </Col>
            
          </Row>
         
         </div>

            <Card style={{ marginTop: '50px' }}>
            <div>
                <h3 style={{color:"green"}}>Send Money (Cash to Cash)</h3>
                <Table
                  marginTop="34px"
                  marginBottom="34px"
                  smallTd
                  textAlign="left"
                >
                  <thead>
                        <tr><th>Date</th><th>Transaction ID</th> <th>Description</th><th>Transaction Status</th><th>Debit</th><th>Credit</th></tr>
                      </thead>
                      <tbody>
                      {this.state.sendMoneyNwtNw.length > 0
                          ? this.state.sendMoneyNwtNw.map( (b,i) => {
                            var fulldate = dis.formatDate(b.createdAt);
                            
                            return (
                            <tr key={i} >
                              <td style={{textAlign:"center"}}>
                                <div className="labelGrey">{fulldate.date}</div>
                              </td>
                              <td style={{textAlign:"center"}}>
                                <div className="labelGrey">{b.childTx[0].transaction.master_code}</div>
                              </td>
                              <td style={{textAlign:"center"}}>
                                <div className="labelGrey">
                                  Transfered From {b.childTx[0].transaction.from_name} to {b.childTx[0].transaction.to_name}
                                </div>
                              </td>
                              <td style={{textAlign:"center"}}>
                                <div className="labelGrey">Completed</div>
                              </td>
                              <td style={{textAlign:"center"}}>
                                <div className="labelGrey">-</div>
                              </td>
                              <td style={{textAlign:"center"}}> 
                                <div className="labelGrey">XOF {b.childTx[0].transaction.amount}</div>
                              </td>
                            </tr>
                            )
                          })
                          : null
                        }
                        <tr>
                          <td style={{textAlign:"center", color:'green'}}><b>Total</b></td>
                          <td style={{textAlign:"center"}}></td>
                          <td style={{textAlign:"center"}}> </td>
                          <td style={{textAlign:"center"}}> </td>
                          <td style={{textAlign:"center"}}> </td>
                          <td style={{textAlign:"center"}}> 
                            <div className="labelGrey" style={{textAlign:"center", color:'green'}}><b>XOF {this.state.total1}</b></div>
                          </td>
                        </tr>
                    </tbody>
                </Table>
            </div>
            </Card>
            <Card style={{ marginTop: '50px' }}>
            <div>
                <h3 style={{color:"green"}}>Send Money (Cash to Wallet)</h3>
                <Table
                  marginTop="34px"
                  marginBottom="34px"
                  smallTd
                  textAlign="left"
                >
                  <thead>
                        <tr><th>Date</th><th>Transaction ID</th> <th>Description</th><th>Transaction Status</th><th>Debit</th><th>Credit</th></tr>
                      </thead>
                      <tbody>
                      {this.state.sendMoneyNwtW.length > 0
                          ? this.state.sendMoneyNwtW.map( (b,i) => {
                            var fulldate = dis.formatDate(b.createdAt);
                            return (
                            <tr key={i} >
                              <td style={{textAlign:"center"}}>
                                <div className="labelGrey">{fulldate.date}</div>
                              </td>
                              <td style={{textAlign:"center"}}>
                                <div className="labelGrey">{b.childTx[0].transaction.master_code}</div>
                              </td>
                              <td style={{textAlign:"center"}}>
                                <div className="labelGrey">
                                  Transfered From {b.childTx[0].transaction.from_name} to {b.childTx[0].transaction.to_name}
                                </div>
                              </td>
                              <td style={{textAlign:"center"}}>
                                <div className="labelGrey">Completed</div>
                              </td>
                              <td style={{textAlign:"center"}}>
                                <div className="labelGrey">-</div>
                              </td>
                              <td style={{textAlign:"center"}}> 
                                <div className="labelGrey">XOF {b.childTx[0].transaction.amount}</div>
                              </td>
                            </tr>
                            )
                          })
                          : null
                        }
                        <tr>
                          <td style={{textAlign:"center", color:'green'}}><b>Total</b></td>
                          <td style={{textAlign:"center"}}></td>
                          <td style={{textAlign:"center"}}> </td>
                          <td style={{textAlign:"center"}}> </td>
                          <td style={{textAlign:"center"}}> </td>
                          <td style={{textAlign:"center"}}> 
                            <div className="labelGrey" style={{textAlign:"center", color:'green'}}><b>XOF {this.state.total2}</b></div>
                          </td>
                        </tr>
                    </tbody>
                </Table>
            </div>
            </Card>
            
            <Card style={{ marginTop: '50px' }}>
            <div>
                <h3 style={{color:"green"}}>Send Money (Cash bill payment to Merchant)</h3>
                <Table
                  marginTop="34px"
                  marginBottom="34px"
                  smallTd
                  textAlign="left"
                >
                  <thead>
                        <tr><th>Date</th><th>Transaction ID</th> <th>Description</th><th>Transaction Status</th><th>Debit</th><th>Credit</th></tr>
                      </thead>
                      <tbody>
                      {this.state.sendMoneyNwtM.length > 0
                          ? this.state.sendMoneyNwtM.map( (b,i) => {
                            var fulldate = dis.formatDate(b.createdAt);
                            return (
                            <tr key={i} >
                              <td style={{textAlign:"center"}}>
                                <div className="labelGrey">{fulldate.date}</div>
                              </td>
                              <td style={{textAlign:"center"}}>
                                <div className="labelGrey">{b.childTx[0].transaction.master_code}</div>
                              </td>
                              <td style={{textAlign:"center"}}>
                                <div className="labelGrey">
                                  Transfered From {b.childTx[0].transaction.from_name} to {b.childTx[0].transaction.to_name}
                                </div>
                              </td>
                              <td style={{textAlign:"center"}}>
                                <div className="labelGrey">Completed</div>
                              </td>
                              <td style={{textAlign:"center"}}>
                                <div className="labelGrey">-</div>
                              </td>
                              <td style={{textAlign:"center"}}> 
                                <div className="labelGrey">XOF {b.childTx[0].transaction.amount}</div>
                              </td>
                            </tr>
                            )
                          })
                          : null
                        }
                        <tr>
                          <td style={{textAlign:"center", color:'green'}}><b>Total</b></td>
                          <td style={{textAlign:"center"}}></td>
                          <td style={{textAlign:"center"}}> </td>
                          <td style={{textAlign:"center"}}> </td>
                          <td style={{textAlign:"center"}}> </td>
                          <td style={{textAlign:"center"}}> 
                            <div className="labelGrey" style={{textAlign:"center", color:'green'}}><b>XOF {this.state.total3}</b></div>
                          </td>
                        </tr>
                    </tbody>
                </Table>
            </div>
            </Card>
          
            <Card style={{ marginTop: '50px' }}>
            <div>
                <h3 style={{color:"green"}}>Send Money (Cash to Operational wallet)</h3>
                <Table
                  marginTop="34px"
                  marginBottom="34px"
                  smallTd
                  textAlign="left"
                >
                  <thead>
                        <tr><th>Date</th><th>Transaction ID</th> <th>Description</th><th>Transaction Status</th><th>Debit</th><th>Credit</th></tr>
                      </thead>
                      <tbody>
                      {this.state.sendMoneyNwtO.length > 0
                          ? this.state.sendMoneyNwtO.map( (b,i) => {
                            var fulldate = dis.formatDate(b.createdAt);
                            return (
                            <tr key={i} >
                              <td style={{textAlign:"center"}}>
                                <div className="labelGrey">{fulldate.date}</div>
                              </td>
                              <td style={{textAlign:"center"}}>
                                <div className="labelGrey">{b.childTx[0].transaction.master_code}</div>
                              </td>
                              <td style={{textAlign:"center"}}>
                                <div className="labelGrey">
                                  Transfered From {b.childTx[0].transaction.from_name} to {b.childTx[0].transaction.to_name}
                                </div>
                              </td>
                              <td style={{textAlign:"center"}}>
                                <div className="labelGrey">Completed</div>
                              </td>
                              <td style={{textAlign:"center"}}>
                                <div className="labelGrey">XOF {b.childTx[0].transaction.amount}</div>
                              </td>
                              <td style={{textAlign:"center"}}> 
                                <div className="labelGrey">-</div>
                              </td>
                            </tr>
                            )
                          })
                          : null
                        }
                         <tr>
                          <td style={{textAlign:"center", color:'green'}}><b>Total</b></td>
                          <td style={{textAlign:"center"}}></td>
                          <td style={{textAlign:"center"}}> </td>
                          <td style={{textAlign:"center"}}> </td>
                          <td style={{textAlign:"center"}}> </td>
                          <td style={{textAlign:"center"}}> 
                            <div className="labelGrey" style={{textAlign:"center", color:'green'}}><b>XOF {this.state.total4}</b></div>
                          </td>
                        </tr>
                    </tbody>
                </Table>
            </div>
            </Card>
            <Card style={{ marginTop: '50px' }}>
            <div>
                <h3 style={{color:"green"}}>Claim Money (Cash to Cash)</h3>
                <Table
                  marginTop="34px"
                  marginBottom="34px"
                  smallTd
                  textAlign="left"
                >
                  <thead>
                        <tr><th>Date</th><th>Transaction ID</th> <th>Description</th><th>Transaction Status</th><th>Debit</th><th>Credit</th></tr>
                      </thead>
                      <tbody>
                      {this.state.sendMoneyNwtNw.length > 0
                          ? this.state.sendMoneyNwtNw.map( (b,i) => {
                            var fulldate = dis.formatDate(b.createdAt);
                            var child = b.childTx.filter(c=>c.transaction.note === "Cashier claim Money");
                            if(child.length>0){
                              return (
                            <tr key={i} >
                              <td style={{textAlign:"center"}}>
                                <div className="labelGrey">{fulldate.date}</div>
                              </td>
                              <td style={{textAlign:"center"}}>
                                <div className="labelGrey">{child[0].transaction.master_code}</div>
                              </td>
                              <td style={{textAlign:"center"}}>
                                <div className="labelGrey">
                                  Transfered From {child[0].transaction.from_name} to {child[0].transaction.to_name}
                                </div>
                              </td>
                              <td style={{textAlign:"center"}}>
                                <div className="labelGrey">Completed</div>
                              </td>
                              <td style={{textAlign:"center"}}>
                                <div className="labelGrey">XOF {child[0].transaction.amount}</div>
                              </td>
                              <td style={{textAlign:"center"}}> 
                                <div className="labelGrey">-</div>
                              </td>
                            </tr>
                            )
                            }
                          })
                          : null
                        }
                         <tr>
                          <td style={{textAlign:"center", color:'green'}}><b>Total</b></td>
                          <td style={{textAlign:"center"}}></td>
                          <td style={{textAlign:"center"}}> </td>
                          <td style={{textAlign:"center"}}> </td>
                          <td style={{textAlign:"center"}}>
                          <div className="labelGrey" style={{textAlign:"center", color:'green'}}><b>XOF {this.state.total1}</b></div>
                          </td>
                          <td style={{textAlign:"center"}}> </td>
                        </tr>
                    </tbody>
                </Table>
            </div>
            </Card>
          
            <Card style={{ marginTop: '50px' }}>
            <div>
                <h3 style={{color:"green"}}>Claim Money from Wallet</h3>
                <Table
                  marginTop="34px"
                  marginBottom="34px"
                  smallTd
                  textAlign="left"
                >
                  <thead>
                        <tr><th>Date</th><th>Transaction ID</th> <th>Description</th><th>Transaction Status</th><th>Debit</th><th>Credit</th></tr>
                      </thead>
                      <tbody>
                      {this.state.sendMoneyWtNw.length > 0
                          ? this.state.sendMoneyWtNw.map( (b,i) => {
                            var fulldate = dis.formatDate(b.createdAt);
                            var child = b.childTx.filter(c=>c.transaction.note === "Cashier claim Money");
                            return (
                            <tr key={i} >
                              <td style={{textAlign:"center"}}>
                                <div className="labelGrey">{fulldate.date}</div>
                              </td>
                              <td style={{textAlign:"center"}}>
                                <div className="labelGrey">{child[0].transaction.master_code}</div>
                              </td>
                              <td style={{textAlign:"center"}}>
                                <div className="labelGrey">
                                  Transfered From {child[0].transaction.from_name} to {child[0].transaction.to_name}
                                </div>
                              </td>
                              <td style={{textAlign:"center"}}>
                                <div className="labelGrey">Completed</div>
                              </td>
                              <td style={{textAlign:"center"}}>
                                <div className="labelGrey">XOF {child[0].transaction.amount}</div>
                              </td>
                              <td style={{textAlign:"center"}}> 
                                <div className="labelGrey">-</div>
                              </td>
                            </tr>
                            )
                          })
                          : null
                        }
                        <tr>
                          <td style={{textAlign:"center", color:'green'}}><b>Total</b></td>
                          <td style={{textAlign:"center"}}></td>
                          <td style={{textAlign:"center"}}> </td>
                          <td style={{textAlign:"center"}}> </td>
                          <td style={{textAlign:"center"}}>
                            <div className="labelGrey" style={{textAlign:"center", color:'green'}}><b>XOF {this.state.total5}</b></div>
                          </td>
                          <td style={{textAlign:"center"}}></td>
                        </tr>
                    </tbody>
                </Table>
            </div>
            </Card>
      </div>
      ):(
        <Card style={{ marginTop: '50px' }}>
            <div>
                <h3 style={{color:"green"}}>Daily Report</h3>
                <Table
                  marginTop="34px"
                  marginBottom="34px"
                  smallTd
                  textAlign="left"
                >
                  <thead>
                        <tr><th>Date</th><th>Opening Time</th> <th>Opening Balance</th><th>Denomination</th><th>Closing Balance</th><th>Discripency</th><th>Note</th><th>Closing Time</th></tr>
                      </thead>
                      <tbody>
                      {this.state.reports.length > 0
                          ? this.state.reports.map( (b,i) => {
                            var fulldate = dis.formatDate(b.created_at);
                             return (
                            <tr key={i} >
                              <td style={{textAlign:"center"}}>
                                <div className="labelGrey">{fulldate.date}</div>
                              </td>
                              <td style={{textAlign:"center"}}>
                                <div className="labelGrey">{b.opening_time ? `${new Date(b.opening_time).getHours()}:${new Date(b.opening_time).getMinutes()}` : '0:00'}</div>
                              </td>
                              <td style={{textAlign:"center"}}>
                                <div className="labelGrey">
                                  {b.opening_balance ? b.opening_balance.toFixed(2) : 0}
                                </div>
                              </td>
                              <td style={{textAlign:"center"}}>
                                <div className="labelGrey">
                                {b.denomination ?
                                b.denomination.map(
                                  (d) => {
                                    return(`${d.val} X ${d.num==="" ? "0" : d.num}, `)
                                  }
                                ) :""}
                                </div>
                              </td>
                              <td style={{textAlign:"center"}}>
                                <div className="labelGrey">
                                  {b.closing_balance ? b.closing_balance.toFixed(2) : 0}
                                </div>
                              </td>
                              <td style={{textAlign:"center"}}> 
                                <div className="labelGrey">
                                {b.descripency ? b.descripency.toFixed(2) : 0}
                                </div>
                              </td>
                              <td style={{textAlign:"center"}}> 
                               <div className="labelGrey">
                                {b.note ? b.note : 0}
                               </div>
                             </td>
                             <td style={{textAlign:"center"}}>
                                <div className="labelGrey">{b.closing_time ? `${new Date(b.closing_time).getHours()}:${new Date(b.closing_time).getMinutes()}` : '-:--'}</div>
                              </td>
                            </tr>
                            )
                            
                          })
                          : null
                        }
                    </tbody>
                </Table>
            </div>
            </Card>
      )}
      </div>    
      </Container>
      <Footer bankname={this.state.bankName} banklogo={this.state.bankLogo}/>
      </Wrapper>
    );
  }
}
