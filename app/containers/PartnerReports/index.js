/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 */
import React, { Component } from 'react';
import axios from 'axios';
import PrintIcon from '@material-ui/icons/Print';
import ReactToPrint from 'react-to-print';
import { Helmet } from 'react-helmet';
import endOfDay from 'date-fns/endOfDay';
import startOfDay from 'date-fns/startOfDay';
import { toast } from 'react-toastify';
import PartnerHeader from 'components/Header/PartnerHeader';
import Wrapper from 'components/Wrapper';
import BranchHeader from 'components/Header/BranchHeader';
import Container from 'components/Container';
import Loader from 'components/Loader';
import Card from 'components/Card';
import ActionBar from 'components/ActionBar';
import FormGroup from 'components/FormGroup';
import A from 'components/A';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import Footer from 'components/Footer';
import Main from 'components/Main';
import Table from 'components/Table';
import Button from 'components/Button';
import Row from 'components/Row';
import Col from 'components/Col';
import history from 'utils/history.js';

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
//enable the following line and disable the next line to test for tomorrow
var today = new Date(new Date().setDate(new Date().getDate() + 1));
//var today =new Date();
today.setHours(0, 0, 0, 0);
today = today.getTime();




export default class PartnerReports extends Component {
  constructor(props) {
    super();
    this.state = {
      token: localStorage.getItem('partnerLogged'),
      bankName: localStorage.getItem('bankName'),
      bankLogo: localStorage.getItem('bankLogo'),
      cashiers:[],
      partnerName: localStorage.getItem('partnerName'),
      selectedCashierDetails: {},
      datearray:[],
      cancelled: 0,
      pending: 0,
      datestats: [],
      accepted: 0,
      from:new Date(),
      to:new Date(),
      cashReceived: 0,
      openingBalance: 0,
      paidInCash:0,
      closingBalance: 0,
      cashPaid: 0,
      feeGenerated: 0,
      cashInhand: 0,
      pending: 0,
      accepted: 0,
      declined: 0,
      invoicePaid: 0,
      invoiceAmount:0,
      commissionGenerated: 0,
      closingTime: null,
      history: [],
      datelist: [],
      branches:[],
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

  cashierChange = (event) => {
    this.setState(
      {
        selectedCashier: event.target.value,
      }
    );
  }

  getBranches = async() => {
    try {
      const res = await axios.post(`${API_URL}/partner/listBranches`, { token:this.state.token });
      if (res.status == 200) {
        return ({branches:res.data.branches,loading:false});
      }
    } catch(err){
      console.log(err);
    }
  }

  getCashierDetails = async(id) => {
    try {
      const res = await axios.post(`${API_URL}/${this.state.apiType}/getCashierDetails`, {
        cashier_id: id,
        token: this.state.token,
      })
      if (res.status === 200){
        this.setState({
          selectedCashierDetails: res.data.cashier,
          accepted:res.data.accepted,
          pending:res.data.pending,
          cancelled:res.data.cancelled,
        });
      } 
    }catch(err){
      console.log(err);
    }
  };

  getdays = async(from,to) => {
    function addDays(date, days) {
      var result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    }
    function getdates(){
      var dateArray = new Array();
      var currentDate = from;
      while (currentDate <= to) {
          dateArray.push(new Date (currentDate));
          currentDate = addDays(currentDate, 1);
      }
      return dateArray;
    }
    const res = await getdates();
    return res;
  };
  
  getDatesBetweenDates = (startDate, endDate) => {
    let dates = []
    //to avoid modifying the original date
    const theDate = new Date(startDate)
    while (theDate < endDate) {
      dates = [...dates, new Date(theDate)]
      theDate.setDate(theDate.getDate() + 1)
    }
    return dates;
  };

  getBranchDailyReport = async(after,before,branch) => {
    try{
      const res = await axios.post(`${API_URL}/partner/getBranchDailyReport`, {
        token: this.state.token,
        branch_id: branch._id,
        start:after,
        end: before,
      });
      if (res.status == 200) {
        return ({
          branch: branch,
          reports: res.data.reports,
          accepted: res.data.accepted,
          pending: res.data.pending,
          declined: res.data.decline,
          paid: res.data.invoicePaid,
          amountpaid : res.data.amountPaid,
        });
      }
    } catch (err){
      console.log(err);
    }
    
      
  };
  

  getBranchStatsByDate = async(date,blist) => {
    const stats = blist.map(async (branch) => {
      const after = new Date(date);
      const before = new Date(date);
      after.setHours(0,0,0,0);
      before.setHours(23,59,59,0);
      const cashiedatestats = await this.getBranchDailyReport(after,before,branch);
      return ({cashiedatestats:cashiedatestats});
    });
    const result= await Promise.all(stats);
    return(result);
  }

  getDateStats = async(dlist,blist) => {
    const stats = dlist.map(async (date) => {
      const cashiedatestats = await this.getBranchStatsByDate(date,blist);
      console.log(cashiedatestats);
      return ({
        cashiedatestats: cashiedatestats,
        totalCih: cashiedatestats.reduce(
          (a, b) => a + (b.cashiedatestats.reports.length > 0 ? b.cashiedatestats.reports[0].cash_in_hand : 0), 0
        ).toFixed(2),
        totalOb: cashiedatestats.reduce(
          (a, b) => a + (b.cashiedatestats.reports.length > 0 ? b.cashiedatestats.reports[0].opening_balance : 0), 0
        ).toFixed(2),
        totalCb: cashiedatestats.reduce(
          (a, b) => a + (b.cashiedatestats.reports.length > 0 ? b.cashiedatestats.reports[0].closing_balance : 0), 0
        ).toFixed(2),
        // totalDis: cashiedatestats.reduce(
        //   (a, b) => a + (b.cashiedatestats.reports.length > 0 ? b.cashiedatestats.reports[0].descripency : 0), 0
        // ).toFixed(2),
        totalCr: cashiedatestats.reduce(
          (a, b) => a + (b.cashiedatestats.reports.length > 0 ? b.cashiedatestats.reports[0].cash_received : 0), 0
        ).toFixed(2),
        totalCb: cashiedatestats.reduce(
          (a, b) => a + (b.cashiedatestats.reports.length > 0 ? b.cashiedatestats.reports[0].closing_balance : 0), 0
        ).toFixed(2),
        // totalDis: cashiedatestats.reduce(
        //   (a, b) => a + (b.cashiedatestats.reports.length > 0 ? b.cashiedatestats.reports[0].descripency : 0), 0
        // ).toFixed(2),
        totalFee: cashiedatestats.reduce(
          (a, b) => a + (b.cashiedatestats.reports.length > 0 ? b.cashiedatestats.reports[0].fee_generated : 0), 0
        ).toFixed(2),
        totalComm: cashiedatestats.reduce(
          (a, b) => a + (b.cashiedatestats.reports.length > 0 ? b.cashiedatestats.reports[0].comm_generated : 0), 0
        ).toFixed(2),
        // totalPic: cashiedatestats.reduce(
        //   (a, b) => a + (b.cashiedatestats.reports.length > 0 ? b.cashiedatestats.reports[0].paid_in_cash : 0), 0
        // ),
        totalRa: cashiedatestats.reduce(
          (a, b) => a + b.cashiedatestats.accepted, 0
        ),
        totalRp: cashiedatestats.reduce(
          (a, b) => a + b.cashiedatestats.pending, 0
        ),
        totalRd: cashiedatestats.reduce(
          (a, b) => a + b.cashiedatestats.declined, 0
        ),
        totalInvoice:  cashiedatestats.reduce(
          (a, b) => a + b.cashiedatestats.paid, 0
        ),
        totalInvoiceAmount:  cashiedatestats.reduce(
          (a, b) => a + b.cashiedatestats.amountpaid, 0
        ),
      })
    });
    const result= await Promise.all(stats);
    return({
      res:result,
      loading:false,
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
    const branches = await this.getBranches();
    const start = startOfDay(new Date(this.state.from));
    const end = endOfDay(new Date(this.state.to));
    const datelist = await this.getDatesBetweenDates(start, end);
    const datestats =  await this.getDateStats(datelist,branches.branches);
    console.log(datestats);
    this.setState(
      {
        branches: branches.branches,
        datelist: datelist,
        datestats: datestats.res,
        openingBalance: datestats.res.reduce(
          (a, b) => a + parseInt(b.totalOb), 0
        ),
        closingBalance: datestats.res.reduce(
          (a, b) => a + parseInt(b.totalCb), 0
        ),
        paidInCash: datestats.res.reduce(
          (a, b) => a + parseInt(b.totalPic), 0
        ),
        cashReceived: datestats.res.reduce(
          (a, b) => a + parseInt(b.totalCr), 0
        ),
        cashInhand: datestats.res.reduce(
          (a, b) => a + parseInt(b.totalCih), 0
        ),
        feeGenerated: datestats.res.reduce(
          (a, b) => a + parseInt(b.totalFee), 0
        ),
        commissionGenerated: datestats.res.reduce(
          (a, b) => a + parseInt(b.totalComm), 0
        ),
        pending : datestats.res.reduce(
          (a, b) => a + parseInt(b.totalRp), 0
        ),
        accepted: datestats.res.reduce(
          (a, b) => a + parseInt(b.totalRa), 0
        ),
        declined: datestats.res.reduce(
          (a, b) => a + parseInt(b.totalRd), 0
        ),
        invoicePaid: datestats.res.reduce(
          (a, b) => a + parseInt(b.totalInvoice), 0
        ),
        invoiceAmount:datestats.res.reduce(
          (a, b) => a + parseInt(b.totalInvoiceAmount), 0
        ),
        loading:datestats.loading,
      }
    );
  }

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
          <title>Reports | AGENCY | E-WALLET</title>
        </Helmet>
       
          <PartnerHeader />
        <Container verticalMargin>
        <ActionBar
              marginBottom="15px"
              marginTop="15px"
              inputWidth="calc(100% - 241px)"
              className="clr"
              // style={{ display: 'none' }}
            >
              <h4 style={{color:"green"}}><b>Select Date for report</b></h4>
                  <Row>
                    <Col cW='20%'>
                      <FormGroup>
                      <MuiPickersUtilsProvider
                       utils={DateFnsUtils}
                                                >
                        <KeyboardDatePicker
                        id="date-picker-dialog"
                        label="From"
                        size="small"
                        maxDate={this.state.to}
                        fullWidth
                        inputVariant="outlined"
                        format="dd/MM/yyyy"
                        required
                        InputLabelProps={{
                        shrink: true,
                        }}
                        value={
                          this.state.from
                          }
                        onChange={date =>
                        this.setState({
                              from: date,
                        })
                        }
                         KeyboardButtonProps={{
                        'aria-label': 'change date',
                                                    }}
                        />
                      </MuiPickersUtilsProvider>
                      </FormGroup>
                    </Col>
                    <Col  cW='2%'>To</Col>
                    <Col cW='20%'>
                      <FormGroup>
                      <MuiPickersUtilsProvider
                       utils={DateFnsUtils}
                                                >
                        <KeyboardDatePicker
                        id="date-picker-dialog"
                        label="To"
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
                          this.state.to
                          }
                        onChange={date =>
                          this.setState({
                                to: date,
                          })
                          }
                         KeyboardButtonProps={{
                        'aria-label': 'change date',
                                                    }}
                        />
                      </MuiPickersUtilsProvider>
                      </FormGroup>
                    </Col>
                    <Col  cW='58%'></Col>
                    {/* <Col cw='25%'>
                      <Button style={{padding:'9px'}} onClick={()=>this.getdays(this.state.from,this.state.to)}>Get Report</Button>
                    </Col> */}
                  </Row>
                  <Row style={{marginTop:'12px'}}>
                    <Col cW='17%'></Col>
                    <Col cw='50%'>
                      <Button style={{padding:'9px'}} onClick={()=>this.getData()}>Get Report</Button>
                    </Col>
                    <Col cw='25%'></Col>

                  </Row>
                  <Row>
                    <Col cW='90%'></Col>
                    <Col cW='10%'>
                      <ReactToPrint
                        style={{float:'right'}}
                      trigger={() => <Button ><PrintIcon/>  Print</Button>}
                      content={() => this.componentRef.current}
                    />
                    </Col>
                  </Row>
            </ActionBar>
           <div ref={this.componentRef}>
            <Card marginBottom="20px" buttonMarginTop="5px" smallValue style={{height:'90px'}}>
              <Row>
                <Col>
                  <h4 style={{color:"green",marginBottom:"20px" }}><b>Bank Name : </b>{this.state.bankName} </h4> 
                </Col>
                <Col>
                  <h4 style={{color:"green",marginBottom:"20px" }}><b>Partner Name : </b>{this.state.partnerName}</h4> 
                </Col>
              </Row>
      
      </Card>
            <div className="clr">
            <Row>
              <Col>
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
              <Col>
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
              <Col>
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
              <Col>
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
            </Row>
          <Row style={{marginTop:'5px',marginBottom:'0px'}}>
          <Col cW='40%'>
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
                      <div className="cardValue">{CURRENCY}: {this.state.invoiceAmount}</div>
                    </Col>
                  </Row>
                </Card>
              </Col>   
              <Col cW='60%'>
              <Card
                  style={{height:'140px'}}
                  marginBottom="10px"
                  buttonMarginTop="32px"
                  textAlign="center"
                  bigPadding
                  smallValue
                >
                  <h4>Revenue Collected</h4>
                  <Row>
                    <Col>
                      <h5>Fee</h5>
                      <div className="cardValue">{CURRENCY}: {this.state.feeGenerated}</div>
                    </Col>
                    <Col>
                      <h5>Commission</h5>
                      <div className="cardValue">{CURRENCY}: {this.state.commissionGenerated}</div>
                    </Col>
                    <Col>
                      <h5>Total</h5>
                      <div className="cardValue">{CURRENCY}: {parseInt(this.state.commissionGenerated, 10)+parseInt(this.state.feeGenerated, 10)}</div>
                    </Col>
                  </Row>
                </Card>
              </Col>
              {/* <Col cW='30%'>
              <Card
                   style={{height:'140px'}}
                  marginBottom="10px"
                  buttonMarginTop="32px"
                  bigPadding
                  textAlign="center"
                  smallValue
                >
                  <h4>Authorisation Requests</h4>
                  <Row>
                    <Col>
                      <h5>Approved</h5>
                      <div className="cardValue">{this.state.accepted}</div>
                    </Col>
                    <Col>
                      <h5>Declined</h5>
                      <div className="cardValue">{this.state.cancelled}</div>
                    </Col>
                    <Col>
                      <h5>Pending</h5>
                      <div className="cardValue">{this.state.pending}</div>
                    </Col>
                  </Row>
                  
                </Card>
              </Col> */}
            </Row>
            
            </div>
        {this.state.datelist.length > 0 
            ? this.state.datelist.map( (date,i) => {
              return(
              <Card style={{ marginTop: '10px' }}>
              
                <h3 style={{color:'green'}}><b>{`${new Date(date).getDate()}/${new Date(date).getMonth()-1}/${new Date(date).getFullYear()}`}</b></h3>
                <Table
                marginTop="34px"
                marginBottom="34px"
                smallTd
                textAlign="left"
              >
                <thead>
                      <tr>
                        <th>Branch</th>
                        <th>Opening Balance</th>
                        <th>Cash in Hand</th>
                        <th>Cash Received</th>
                        <th>Fee Generated</th>
                        <th>Commission Generated</th>
                        <th>Revenue Generated</th>
                        <th>Closing Balance</th>
                        {/* <th>Requests Approved</th>
                        <th>Requests Declined</th>
                        <th>Requests Pending</th> */}
                      </tr>
                    </thead>
                    <tbody>
                    {this.state.datestats[i].cashiedatestats.length > 0 
                        ? this.state.datestats[i].cashiedatestats.map( (b, index) => {
                          return (
                          <tr key={index} >
                            
                            <td style={{textAlign:"center"}}>
                              <div className="labelGrey">{b.cashiedatestats.branch.name}</div>
                            </td>
                            <td style={{textAlign:"center"}}>
                              <div className="labelGrey">{b.cashiedatestats.reports.length > 0 ? b.cashiedatestats.reports[0].opening_balance.toFixed(2) : "-"}</div>
                            </td>
                            <td style={{textAlign:"center"}}>
                              <div className="labelGrey">{b.cashiedatestats.reports.length > 0 ? b.cashiedatestats.reports[0].cash_in_hand.toFixed(2) : "-"}</div>
                            </td>
                            {/* <td style={{textAlign:"center"}}>
                              <div className="labelGrey">{b.cashiedatestats.reports.length > 0 ? b.cashiedatestats.reports[0].paid_in_cash.toFixed(2) : "-"}</div>
                            </td> */}
                            <td style={{textAlign:"center"}}>
                              <div className="labelGrey">{b.cashiedatestats.reports.length > 0 ? b.cashiedatestats.reports[0].cash_received.toFixed(2) : "-"}</div>
                            </td>
                            <td style={{textAlign:"center"}}>
                              <div className="labelGrey">{b.cashiedatestats.reports.length > 0 ? b.cashiedatestats.reports[0].fee_generated.toFixed(2) : "-"}</div>
                            </td>
                            <td style={{textAlign:"center"}}>
                              <div className="labelGrey">{b.cashiedatestats.reports.length > 0 ? b.cashiedatestats.reports[0].comm_generated.toFixed(2) : "-"}</div>
                            </td>
                            <td style={{textAlign:"center"}}>
                              <div className="labelGrey">{b.cashiedatestats.reports.length > 0 ? (b.cashiedatestats.reports[0].fee_generated + b.cashiedatestats.reports[0].comm_generated).toFixed(2) : ""}</div>
                            </td>
                            <td style={{textAlign:"center"}}>
                              <div className="labelGrey">{b.cashiedatestats.reports.length > 0 ? b.cashiedatestats.reports[0].closing_balance.toFixed(2) : "-"}</div>
                            </td>
                            {/* <td style={{textAlign:"center"}}>
                              <div className="labelGrey">{b.cashiedatestats.accepted}</div>
                            </td>
                            <td style={{textAlign:"center"}}>
                              <div className="labelGrey">{b.cashiedatestats.declined}</div>
                            </td>
                            <td style={{textAlign:"center"}}>
                              <div className="labelGrey">{b.cashiedatestats.pending}</div>
                            </td> */}
                            
                          </tr>
                          )
                        })

                        : null
                      }
                      <tr style={{textAlign:"center", backgroundColor:'green'}}>
                          <td style={{textAlign:"center", color:'white'}}><b>Total</b></td>
                          <td style={{textAlign:"center"}}>
                            <div className="labelGrey" style={{textAlign:"center", color:'white'}}><b>XOF {this.state.datestats[i].totalOb}</b></div>
                          </td>
                          <td style={{textAlign:"center"}}>
                            <div className="labelGrey" style={{textAlign:"center", color:'white'}}><b>XOF {this.state.datestats[i].totalCih}</b></div>
                          </td>
                          {/* <td style={{textAlign:"center"}}>
                            <div className="labelGrey" style={{textAlign:"center", color:'white'}}><b>XOF {this.state.datestats[i].totalPic}</b></div>
                          </td> */}
                          <td style={{textAlign:"center"}}>
                            <div className="labelGrey" style={{textAlign:"center", color:'white'}}><b>XOF {this.state.datestats[i].totalCr}</b></div>
                          </td>
                          <td style={{textAlign:"center"}}>
                            <div className="labelGrey" style={{textAlign:"center", color:'white'}}><b>XOF {this.state.datestats[i].totalFee}</b></div>
                          </td>
                          <td style={{textAlign:"center"}}>
                            <div className="labelGrey" style={{textAlign:"center", color:'white'}}><b>XOF {this.state.datestats[i].totalComm}</b></div>
                          </td>
                          <td style={{textAlign:"center"}}>
                            <div className="labelGrey" style={{textAlign:"center", color:'white'}}><b>XOF {parseInt(this.state.datestats[i].totalComm) + parseInt(this.state.datestats[i].totalFee)}</b></div>
                          </td>
                          <td style={{textAlign:"center"}}>
                            <div className="labelGrey" style={{textAlign:"center", color:'white'}}><b>XOF {this.state.datestats[i].totalCb}</b></div>
                          </td>
                          {/* <td style={{textAlign:"center"}}>
                            <div className="labelGrey" style={{textAlign:"center", color:'white'}}><b>{this.state.datestats[i].totalRa}</b></div>
                          </td>
                          <td style={{textAlign:"center"}}>
                            <div className="labelGrey" style={{textAlign:"center", color:'white'}}><b>{this.state.datestats[i].totalRd}</b></div>
                          </td>
                          <td style={{textAlign:"center"}}>
                            <div className="labelGrey" style={{textAlign:"center", color:'white'}}><b>{this.state.datestats[i].totalRp}</b></div>
                          </td> */}
                        </tr>
                  </tbody>
              
              </Table>
        
                
            </Card>
              )  
          })
          :'ef'}

          </div> 
        </Container>
        <Footer bankname={this.state.bankName} banklogo={this.state.bankLogo}/>
      </Wrapper>
    );
  }
}
