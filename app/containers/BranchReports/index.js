/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 */
import React, { Component } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import endOfDay from 'date-fns/endOfDay';
import startOfDay from 'date-fns/startOfDay';
import { toast } from 'react-toastify';
import Wrapper from 'components/Wrapper';
import BranchHeader from 'components/Header/BranchHeader';
import Container from 'components/Container';
import Loader from 'components/Loader';
import Card from 'components/Card';
import ActionBar from 'components/ActionBar';
import FormGroup from 'components/FormGroup';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import SelectInput from 'components/SelectInput';
import Main from 'components/Main';
import Table from 'components/Table';
import Button from 'components/Button';
import Row from 'components/Row';
import Col from 'components/Col';

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

const token = localStorage.getItem('branchLogged');
const bid = localStorage.getItem('branchId');
const logo = localStorage.getItem('bankLogo');
const email = localStorage.getItem('cashierEmail');
const mobile = localStorage.getItem('cashierMobile');
const bankId = localStorage.getItem('bankId');
//enable the following line and disable the next line to test for tomorrow
var today = new Date(new Date().setDate(new Date().getDate() + 1));
//var today =new Date();
today.setHours(0, 0, 0, 0);
today = today.getTime();




export default class BranchReports extends Component {
  constructor() {
    super();
    this.state = {
      token,
      cashiers:[],
      selectedCashierDetails: {},
      datearray:[],
      cancelled: 0,
      pending: 0,
      datestats: [],
      accepted: 0,
      from:new Date(),
      selectedCashier:'',
      to:new Date(),
      otpEmail: email,
      otpMobile: mobile,
      agree: false,
      showPending: false,
      loading:false,
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
      history: [],
      datelist: [],
      filter: '',
    };
    this.success = this.success.bind(this);
    this.error = this.error.bind(this);
    this.warn = this.warn.bind(this);


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

  getCashiers = async() => {
    try {
      const res = await axios.post(`${API_URL}/getAll`, {
        page: 'partnerCashier',
        type: 'partnerBranch',
        token: token,
        where: { branch_id: bid },
      })
      if (res.status === 200){
        return ({
          cashiers: res.data.rows
        });
      } 
    }catch(err){
      console.log(err);
    }
  };

  getCashierDetails = async(id) => {
    try {
      const res = await axios.post(`${API_URL}/partnerBranch/getCashierDetails`, {
        cashier_id: id,
        token: token,
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

  getCashierDailyReport = async(after,before,cashier) => {
    try{
      const res = await axios.post(`${API_URL}/partnerBranch/getCashierDailyReport`, {
        token: token,
        cashier_id: cashier._id,
        start:after,
        end: before,
      });
      if (res.status == 200) {
        return ({
          cashier:cashier,
          reports:res.data.reports,
        });
      }
    } catch (err){
      console.log(err);
    }
    
      
  };
  

  getCashierStatsByDate = async(date,clist) => {
    const stats = clist.map(async (cashier) => {
      const after = new Date(date);
      const before = new Date(date);
      after.setHours(0,0,0,0);
      before.setHours(23,59,59,0);
      const cashiedatestats = await this.getCashierDailyReport(after,before,cashier);
      return ({
        date:date,
        cashiedatestats:cashiedatestats,
      });
    });
    const result= await Promise.all(stats);
    return(result);
  }

  getDateStats = async(dlist,clist) => {
    const stats = dlist.map(async (date) => {
      const cashiedatestats = await this.getCashierStatsByDate(date,clist);
      return cashiedatestats;
  });
  const result= await Promise.all(stats);
  return({res:result, loading:false});
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
    const cashiers = await this.getCashiers();
    const start = startOfDay(new Date(this.state.from));
    const end = endOfDay(new Date(this.state.to));
    const datelist = await this.getDatesBetweenDates(start, end);
    const datestats =  await this.getDateStats(datelist,cashiers.cashiers);
    console.log(datestats.res);
    this.setState(
      {
        cashiers: cashiers.cashiers,
        datelist: datelist,
        datestats: datestats.res,
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
        <BranchHeader
          active="reports"
          bankName={this.props.match.params.bank}
          bankLogo={STATIC_URL + logo}
        />
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
                        minDate={new Date()}
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
                    {/* <Col cw='30%'>
                    <FormGroup>
                        <SelectInput
                          style={{marginTop:'17px'}}
                          type="text"
                          name="country"
                          // value={this.state.country}
                          onChange={this.cashierChange}
                          required
                          autoFocus
                        >
                          <option title="" value="">Select Cashier*</option>
                          {this.state.cashiers.length>0 ?(
                            this.state.cashiers.map((c,i)=>{
                              return(
                                <option title="" value={c._id}>{c.name}</option>
                              );
                            })
                          ):null}
                        </SelectInput>
                        </FormGroup>
                    </Col> */}
                    <Col cW='17%'></Col>
                    <Col cw='50%'>
                      <Button style={{padding:'9px'}} onClick={()=>this.getData()}>Get Report</Button>
                    </Col>
                    <Col cw='25%'></Col>

                  </Row>
                   
                
            </ActionBar>
              <div className="clr">
              <Row>
                <Col>
                <Card
                horizontalMargin="7px"
                cardWidth="151px"
                h4FontSize="16px"
                smallValue
                textAlign="center"
                col
              >
                <h4>Paid in cash</h4>
                <div className="cardValue">
                  {
                    <span> {CURRENCY} 0</span>
                  }
                </div>
              </Card>

                </Col>
                <Col>
                <Card
                  horizontalMargin="7px"
                  cardWidth="125px"
                  h4FontSize="16px"
                  smallValue
                  textAlign="center"
                  col
                >
                  <h4>Cash Received</h4>
                  <div className="cardValue">
                    {CURRENCY} 1224.80
                  </div>
                  </Card>
                </Col>
                <Col>
                <Card
                horizontalMargin="7px"
                cardWidth="125px"
                h4FontSize="16px"
                smallValue
                textAlign="center"
                col
              >
                <h4>Fee Generated</h4>
                <div className="cardValue">
                  {CURRENCY} 2.10
                </div>
              </Card>

                </Col>
                <Col>
                <Card
                horizontalMargin="7px"
                cardWidth="125px"
                smallValue
                h4FontSize="16px"
                textAlign="center"
                col
              >
                <h4>Commission Generated</h4>
                <div className="cardValue">
                  {CURRENCY} 3.14
                </div>
              </Card>

                </Col>
                <Col>
                <Card
                horizontalMargin="7px"
                cardWidth="125px"
                smallValue
                h4FontSize="16px"
                textAlign="center"
                col
              >
                <h4>Revenue Generated</h4>
                <div className="cardValue">
                  
                    <div>
                     {CURRENCY} 5.24
                    </div>
                 
                 
                </div>
              </Card>
                </Col>
                <Col>
                <Card
                  marginBottom="54px"
                  buttonMarginTop="32px"
                  smallValue
                  style={{display:'contents'}}
                >
                  <h4>Authorisation Requests</h4>
                  <Row>
                    <Col>
                      <h5>Approve</h5>
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
                </Col>
              </Row>
            </div>
        {this.state.datelist.length > 0 
            ? this.state.datelist.map( (date,i) => {
              return(
              <Card style={{ marginTop: '50px' }}>
              
                <h3 style={{color:'green'}}><b>{`${new Date(date).getDate()}/${new Date(date).getMonth()-1}/${new Date(date).getFullYear()}`}</b></h3>
                <Table
                marginTop="34px"
                marginBottom="34px"
                smallTd
                textAlign="left"
              >
                <thead>
                      <tr>
                        <th>Cashier</th>
                        <th>Opening Balance</th>
                        <th>Cash in Hand</th>
                        <th>Paid in cash</th>
                        <th>Cash Received</th>
                        <th>Fee Generated</th>
                        <th>Commission Generated</th>
                        <th>Revenue Generated</th>
                        <th>Requests Approved</th>
                        <th>Requests Declined</th>
                        <th>Requests Pending</th></tr>
                    </thead>
                    <tbody>
                    {this.state.datestats[i].length > 0 
                        ? this.state.datestats[i].map( (b, index) => {
                          return (
                          <tr key={i} >
                            
                            <td style={{textAlign:"center"}}>
                              <div className="labelGrey">{b.cashiedatestats.cashier.name}</div>
                            </td>
                            <td style={{textAlign:"center"}}>
                              <div className="labelGrey">{b.cashiedatestats.reports.length > 0 ? b.cashiedatestats.reports[0].opening_balance.toFixed(2) : "-"}</div>
                            </td>
                            <td style={{textAlign:"center"}}>
                              <div className="labelGrey">{b.cashiedatestats.reports.length > 0 ? b.cashiedatestats.reports[0].cash_in_hand.toFixed(2) : "-"}</div>
                            </td>
                            <td style={{textAlign:"center"}}>
                              <div className="labelGrey">{b.cashiedatestats.reports.length > 0 ? b.cashiedatestats.reports[0].paid_in_cash.toFixed(2) : "-"}</div>
                            </td>
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
                              <div className="labelGrey">0</div>
                            </td>
                            <td style={{textAlign:"center"}}>
                              <div className="labelGrey">0</div>
                            </td>
                            <td style={{textAlign:"center"}}>
                              <div className="labelGrey">0</div>
                            </td>
                            
                          </tr>
                          )
                        })
                        : null
                      }
                  </tbody>
              
              </Table>
        
                
            </Card>
              )  
          })
          :'ef'}

           
        </Container>

      </Wrapper>
    );
  }
}
