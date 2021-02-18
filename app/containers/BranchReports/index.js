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
import Pagination from 'react-js-pagination';
import TextInput from 'components/TextInput';
import Popup from 'components/Popup';
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
      accepted: 0,
      from:today,
      selectedCashier:'',
      to:today,
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
        console.log(res.data.cashier);
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
    console.log(to,from);
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
    const res=await getdates();
    this.setState({
      datearray:res,
    })
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

  componentDidMount= async() => {
    this.setState(
      {
        loading:true,
      }
    );
    const cashiers = await this.getCashiers();
    console.log(cashiers);
    // const branch=await this.getBranchByName();
    // this.getStats();
    // const allHistory = await this.getHistory();
    this.setState(
      {
        cashiers: cashiers.cashiers,
        // branchDetails:branch,
        // sendMoneyNwtNw: allHistory.sendMoneyNwtNw.reverse(),
        // sendMoneyNwtW: allHistory.sendMoneyNwtW.reverse(),
        // sendMoneyNwtM: allHistory.sendMoneyNwtM.reverse(),
        // sendMoneyNwtO: allHistory.sendMoneyNwtO.reverse(),
        // sendMoneyWtNw: allHistory.sendMoneyWtNw.reverse(),
        loading:false,
      }
    );
    
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
                <Col>
                  <Row>
                    <Col cW='35%'>
                      <FormGroup>
                      <MuiPickersUtilsProvider
                       utils={DateFnsUtils}
                                                >
                        <KeyboardDatePicker
                        id="date-picker-dialog"
                        label="From"
                        size="small"
                        minDate={date}
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
                    <Col  cW='2%'>-</Col>
                    <Col cW='35%'>
                      <FormGroup>
                      <MuiPickersUtilsProvider
                       utils={DateFnsUtils}
                                                >
                        <KeyboardDatePicker
                        id="date-picker-dialog"
                        label="To"
                        size="small"
                        minDate={date}
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
                    <Col  cW='3%'></Col>
                    <Col cw='25%'>
                      <Button style={{padding:'9px'}} onClick={()=>this.getdays(this.state.from,this.state.to)}>Get Report</Button>
                    </Col>
                  </Row>
                      
                </Col>
                <Col>
                  <Row>
                    <Col cw='50%'>
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
                    </Col>
                    <Col cw='50%'>
                      <Button style={{padding:'9px'}} onClick={()=>this.getCashierDetails(this.state.selectedCashier)}>Filter</Button>
                    </Col>

                  </Row>
                </Col>
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
                    <span> {CURRENCY} {this.state.selectedCashierDetails.cash_paid}</span>
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
                    {CURRENCY} {this.state.selectedCashierDetails.cash_received}
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
                  {CURRENCY} {this.state.selectedCashierDetails.fee_generated}
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
                  {CURRENCY} {this.state.selectedCashierDetails.commission_generated}
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
                  {this.state.selectedCashierDetails.commission_generated ? (
                    <div>
                     {CURRENCY} {parseInt(this.state.selectedCashierDetails.commission_generated,10) + parseInt(this.state.selectedCashierDetails.fee_generated,10)}
                    </div>
                  ):"XOF"}
                 
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

            

            <Card style={{ marginTop: '50px' }}>
            <div>
                <Table
                marginTop="34px"
                marginBottom="34px"
                smallTd
                textAlign="left"
              >
                <thead>
                      <tr>
                        <th>Date</th>
                        <th>User</th>
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
                    {this.state.datearray.length > 0 && this.state.selectedCashierDetails.name
                        ? this.state.datearray.map( (b,i) => {
                          var fulldate = dis.formatDate(b);
                          return (
                          <tr key={i} >
                            <td style={{textAlign:"center"}}>
                              <div className="labelGrey">{fulldate.date}</div>
                            </td>
                            <td style={{textAlign:"center"}}>
                              <div className="labelGrey">{this.state.selectedCashierDetails.name}</div>
                            </td>
                            <td style={{textAlign:"center"}}>
                              <div className="labelGrey">{this.state.selectedCashierDetails.opening_balance}</div>
                            </td>
                            <td style={{textAlign:"center"}}>
                              <div className="labelGrey">{this.state.selectedCashierDetails.cash_in_hand}</div>
                            </td>
                            <td style={{textAlign:"center"}}>
                              <div className="labelGrey">{this.state.selectedCashierDetails.cash_paid}</div>
                            </td>
                            <td style={{textAlign:"center"}}>
                              <div className="labelGrey">{this.state.selectedCashierDetails.cash_received}</div>
                            </td>
                            <td style={{textAlign:"center"}}>
                              <div className="labelGrey">{this.state.selectedCashierDetails.fee_generated}</div>
                            </td>
                            <td style={{textAlign:"center"}}>
                              <div className="labelGrey">{this.state.selectedCashierDetails.commission_generated}</div>
                            </td>
                            <td style={{textAlign:"center"}}>
                              <div className="labelGrey">{parseInt(this.state.selectedCashierDetails.commission_generated,10) + parseInt(this.state.selectedCashierDetails.fee_generated,10)}</div>
                            </td>
                            <td style={{textAlign:"center"}}>
                              <div className="labelGrey">{this.state.accepted}</div>
                            </td>
                            <td style={{textAlign:"center"}}>
                              <div className="labelGrey">{this.state.cancelled}</div>
                            </td>
                            <td style={{textAlign:"center"}}>
                              <div className="labelGrey">{this.state.pending}</div>
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
           
        </Container>

      </Wrapper>
    );
  }
}
