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

import { Grid, Typography, TextField } from '@material-ui/core';

import MaterialTable from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import MaterialButton from '@material-ui/core/Button';
import classNames from 'classnames';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import Wrapper from 'components/Wrapper';
import BankHeader from 'components/Header/BankHeader';
import BankSidebarTwo from 'components/Sidebar/BankSidebarTwo';
import Container from 'components/Container';
import Loader from 'components/Loader';
import Main from 'components/Main';
import ActionBar from 'components/ActionBar';
import Card from 'components/Card';
import Button from 'components/Button';
import Table from 'components/Table';
import A from 'components/A';
import MiniPopUp from 'components/MiniPopUp';
import Row from 'components/Row';
import Col from 'components/Col';
import FormGroup from 'components/FormGroup';

import { API_URL, STATIC_URL, CURRENCY } from '../App/constants';

import 'react-toastify/dist/ReactToastify.css';
import { withStyles } from '@material-ui/core';
toast.configure({
  position: 'bottom-right',
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
});

const Tab = styled.div`
  background: ${props => props.theme.primary};
  width: 194px;
  padding: 15px;
  float: left;
  border: 1px solid ${props => props.theme.primary};
  color: #fff;
  font-size: 20px;
`;
const Tab2 = styled.div`
  float: left;
  width: 194px;
  border: 1px solid ${props => props.theme.primary};
  color: ${props => props.theme.primary};
  font-size: 20px;
  padding: 15px;
`;

const token = localStorage.getItem('bankLogged');
const bid = localStorage.getItem('bankId');

const styles = theme => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  dense: {
    marginTop: 16,
  },
  table: {
    minWidth: 700,
  },
  bankBranches: {
    padding: '3%',
    fontWeight: 600,
  },
});

let id = 0;
function createData(name, calories, fat, carbs, protein) {
  id += 1;
  return { id, name, calories, fat, carbs, protein };
}
const rows = [
  createData('AA11', 'AXIS', 'Submit'),
  createData('AA11', 'AXIS', 'Submit'),
];

export class BankFees extends Component {
  constructor() {
    super();
    this.state = {
      sid: '',
      bank: bid,
      name: '',
      address1: '',
      html: '',
      popname: '',
      poprange: '',
      poptype: '',
      poppercent: '',
      state: '',
      zip: '',
      country: '',
      ccode: '',
      mobile: '',
      email: '',
      logo: null,
      contract: null,
      loading: true,
      redirect: false,
      totalBanks: 0,
      notification: 'Welcome',
      popup: false,
      user_id: token,
      banks: [],
      rules: [],
      otp: '',
      showOtp: false,
      isInfraFeeVisible: true,
      revenueRuleDistributionPage: false,
      percentage: '',
      bankBranchesTable: true,
      bankPartnersTable: false,
      bankMerchantsTable: false,
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

  goBankEdit = (b, i) => {
    this.props.history.push('/bank/edit-fee/' + b + '/' + i);
  };

  showMiniPopUp = (b, r) => {
    this.setState({
      popname: b.name,
      poptype: b.trans_type,
      sid: b._id,
      popup: true,
      html: r,
    });
    //this.props.history.push('/createfee/'+this.state.bank_id);
  };

  closeMiniPopUp = () => {
    this.setState({
      popup: false,
    });
  };

  logout = () => {
    // event.preventDefault();
    // axios.post(API_URL+'/logout', {token: token})
    // .then(res => {
    //    if(res.status == 200){
    localStorage.removeItem('logged');
    localStorage.removeItem('name');
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

  addBank = event => {
    event.preventDefault();
    axios
      .post(`${API_URL}/generateOTP`, {
        name: this.state.name,
        mobile: this.state.mobile,
        page: 'addBank',
        token,
      })
      .then(res => {
        if (res.status == 200) {
          if (res.data.error) {
            throw res.data.error;
          } else {
            this.setState({
              showOtp: true,
              notification: 'OTP Sent',
            });
            this.success();
          }
        } else {
          const error = new Error(res.data.error);
          throw error;
        }
      })
      .catch(err => {
        this.setState({
          notification: err.response ? err.response.data.error : err.toString(),
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
                this.getRules();
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
                this.getRules();
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

  verifyOTP = event => {
    event.preventDefault();
    axios
      .post(`${API_URL}/addBank`, {
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
        if (res.status == 200) {
          if (res.data.error) {
            throw res.data.error;
          } else {
            this.setState({
              notification: 'Bank added successfully!',
            });
            this.success();
            this.closeMiniPopUp();
            this.getBanks();
          }
        } else {
          const error = new Error(res.data.error);
          throw error;
        }
      })
      .catch(err => {
        this.setState({
          notification: err.response ? err.response.data.error : err.toString(),
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

  getRules = () => {
    axios
      .post(`${API_URL}/getBankRules`, { bank_id: this.state.bank })
      .then(res => {
        if (res.status == 200) {
          console.log(res.data);
          this.setState({ rules: res.data.rules });
        }
      })
      .catch(err => {});
  };

  getBankRules = () => {
    axios
      .post(`${API_URL}/getAll`, {
        type: 'bank',
        token: token,
        page: 'bankfee',
      })
      .then(res => {
        if (res.status == 200) {
          console.log(res.data);
          this.setState({ loading: false, bankRules: res.data.rows });
        }
      })
      .catch(err => {});
  };

  componentDidMount() {
    // this.setState({ bank: this.state.bank_id });
    if (token !== undefined && token !== null) {
      this.getRules();
      this.getBankRules();
    } else {
      // alert('Login to continue');
      // this.setState({loading: false, redirect: true });
    }
  }

  showInfraFeeView = () => {
    console.log('working!!');
    this.setState({ isInfraFeeVisible: true });
  };
  showBankFeeView = () => {
    console.log('working bank!!');
    this.setState({ isInfraFeeVisible: false });
  };

  showPopup = () => {
    this.setState({ popup: true });
  };
  closePopup = () => {
    this.setState({
      popup: false,
      // editPopup: false,
      // name: '',
      // address1: '',
      // state: '',
      // zip: '',
      // bcode: '',
      // country: '',
      // email: '',
      // mobile: '',
      // logo: null,
      // contract: null,
      // otp: '',
      // showOtp: false,
      // showEditOtp: false,
    });
  };

  showRevenueRuleDistributionPage = () => {
    this.setState({ revenueRuleDistributionPage: 'true' });
  };

  showBankBranches = () => {
    this.setState({
      bankBranchesTable: true,
      bankPartnersTable: false,
      bankMerchantsTable: false,
    });
  };
  showBankPartners = () => {
    this.setState({
      bankBranchesTable: false,
      bankPartnersTable: true,
      bankMerchantsTable: false,
    });
  };

  render() {
    const { classes } = this.props;

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

    // function showInfraFeeView() {
    //   console.log('working!!')
    // }

    // function showBankFeeView() {}

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
          <title>Banks | INFRA | E-WALLET</title>
        </Helmet>
        <BankHeader />
        <Container verticalMargin>
          <BankSidebarTwo active="fees" />
          <Main
            style={{
              display: `${
                this.state.revenueRuleDistributionPage ? 'none' : 'block'
              }`,
            }}
          >
            <ActionBar
              marginBottom="33px"
              inputWidth="calc(100% - 241px)"
              className="clr"
            >
              <div className="clr">
                <div
                  className={`${
                    this.state.isInfraFeeVisible ? 'ActiveTab' : 'InactiveTab'
                  }`}
                  onClick={this.showInfraFeeView}
                >
                  Bank and Infra
                </div>
                <div
                  className={`${
                    this.state.isInfraFeeVisible ? 'InactiveTab' : 'ActiveTab'
                  }`}
                  onClick={this.showBankFeeView}
                >
                  Bank and Users
                </div>
              </div>
            </ActionBar>
            <Card
              bigPadding
              style={{
                display: `${this.state.isInfraFeeVisible ? 'block' : 'none'}`,
              }}
            >
              <div className="cardHeader">
                <div className="cardHeaderLeft">
                  <i className="material-icons">supervised_user_circle</i>
                </div>
                <div className="cardHeaderRight">
                  <h3>Revenue Sharing Rules</h3>
                  <h5>Fees created by the infra</h5>
                </div>
              </div>
              <div className="cardBody">
                <Table marginTop="34px" smallTd>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Transaction Type</th>
                      <th>Ranges</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.rules && this.state.rules.length > 0
                      ? this.state.rules.map((b, i) => {
                          var r1 = JSON.parse(b.editedRanges);
                          var r = r1.ranges;
                          return (
                            <tr key={b._id}>
                              <td>
                                {b.edit_status == 0 ? (
                                  <span>{r1.name}</span>
                                ) : (
                                  <span>{b.name}</span>
                                )}
                              </td>
                              <td className="tac">
                                {b.edit_status == 0 ? (
                                  <span>{r1.trans_type}</span>
                                ) : (
                                  <span>{b.trans_type}</span>
                                )}
                              </td>

                              <td>
                                {r.map(v => {
                                  return (
                                    <div>
                                      Count:{' '}
                                      <span className="green">
                                        {v.trans_from} - {v.trans_to}
                                      </span>
                                      , Fixed:{' '}
                                      <span className="green">
                                        {CURRENCY + ' ' + v.fixed_amount}
                                      </span>
                                      , Percentage:{' '}
                                      <span className="green">
                                        {v.percentage}
                                      </span>
                                    </div>
                                  );
                                })}
                              </td>
                              <td className="tac bold">
                                {b.active == 'Inactive' ? (
                                  <span className="absoluteMiddleRight primary popMenuTrigger">
                                    <i className="material-icons ">block</i>
                                  </span>
                                ) : (
                                  <Button
                                    className="addBankButton"
                                    onClick={() =>
                                      dis.goBankEdit(
                                        this.state.bankRules[i]._id,
                                        b._id,
                                      )
                                    }
                                  >
                                    {b.edit_status == 0
                                      ? 'Pending'
                                      : b.edit_status == 2
                                      ? 'Declined'
                                      : 'Approved'}
                                  </Button>
                                )

                                // b.edit_status != 0 ? (
                                //   b.edit_status == 1 ? (
                                //     // <a className="text-light">approved</a>
                                //     <button onClick={() => dis.goBankEdit(this.state.bankRules[i]._id, b._id)}>edit</button>
                                //   ) : (
                                //     <a className="text-accent">declined</a>
                                //   )
                                // ) : (
                                //   <Button
                                //     onClick={() => dis.showMiniPopUp(b, r)}
                                //     className="addBankButton"
                                //   >
                                //     <span>Approvec</span>
                                //   </Button>
                                //   // <span>Peding approval</span>
                                // )
                                }
                              </td>
                            </tr>
                          );
                        })
                      : null}
                  </tbody>
                </Table>
              </div>
            </Card>
            <div
              style={{
                display: `${this.state.isInfraFeeVisible ? 'none' : 'block'}`,
              }}
            >
              <ActionBar
                marginBottom="33px"
                inputWidth="calc(100% - 241px)"
                className="clr"
              >
                <div className="iconedInput fl">
                  <i className="material-icons">search</i>
                  <input type="text" placeholder="Search" />
                </div>

                <A href="/bank/create-fee" float="right">
                  <Button className="addBankButton" flex onClick={this.try}>
                    <i className="material-icons">add</i>
                    <span>
                      <span>Create Fee</span>
                    </span>
                  </Button>
                </A>
              </ActionBar>
              <Card bigPadding>
                <div className="cardHeader">
                  <div className="cardHeaderLeft">
                    <i className="material-icons">supervised_user_circle</i>
                  </div>
                  <div className="cardHeaderRight">
                    <h3>Fee Rules</h3>
                    <h5>Fees created by the bank</h5>
                  </div>
                </div>
                <div className="cardBody">
                  <Table marginTop="34px" smallTd>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Transaction Type</th>
                        <th>Transaction Range</th>
                        <th>Transaction Count</th>
                        <th />
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.bankRules && this.state.bankRules.length > 0
                        ? this.state.bankRules.map((b, i) => {
                            var r = JSON.parse(b.editedRanges);

                            return (
                              <tr key={b._id}>
                                <td>{b.name}</td>
                                <td className="tac">{b.trans_type}</td>
                                <td className="tac">
                                  {CURRENCY}{' '}
                                  <span className="green">{b.trans_from}</span>{' '}
                                  - {CURRENCY}{' '}
                                  <span className="green">{b.trans_to}</span>{' '}
                                </td>
                                {/* <td className="tac green">{CURRENCY} {b.trans_from} - {CURRENCY} {b.trans_to}</td>
                          <td  className="tac"> {b.transcount_from} -  {b.transcount_to}</td><td  className="tac">{b.fixed_amount}</td> */}
                                <td>
                                  {r.map(v => {
                                    return (
                                      <div>
                                        Count:{' '}
                                        <span className="green">
                                          {v.trans_from} - {v.trans_to}
                                        </span>
                                        , Fixed:{' '}
                                        <span className="green">
                                          {CURRENCY + ' ' + v.fixed_amount}
                                        </span>
                                        , Percentage:{' '}
                                        <span className="green">
                                          {v.percentage}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </td>
                                <td className="tac bold">
                                  {b.status == 0 ? (
                                    <span className="material-icons">
                                      block
                                    </span>
                                  ) : (
                                    <Button
                                      className="addBankButton"
                                      onClick={() =>
                                        dis.goBankEdit(
                                          b._id,
                                          this.state.rules[i]._id,
                                        )
                                      }
                                      className="pointer"
                                    >
                                      Edit
                                    </Button>
                                  )}
                                </td>
                                <td>
                                  <Button
                                    onClick={
                                      this.showRevenueRuleDistributionPage
                                    }
                                  >
                                    Edit Revenue
                                  </Button>
                                </td>
                              </tr>
                            );
                          })
                        : null}
                    </tbody>
                  </Table>
                </div>
              </Card>
            </div>
          </Main>
          {this.state.revenueRuleDistributionPage ? (
            // <div style={{ border: '1px solid grey' }}>
            <Grid container style={{ width: '74%', border: '1px solid grey' }}>
              <Grid
                container
                style={{ textAlign: 'center', background: '#f5a623' }}
              >
                <Typography
                  variant="h4"
                  style={{ margin: '1% 0 1% 22%', color: 'white' }}
                >
                  Revenue Rule Distribution (Fee Rule)
                </Typography>
              </Grid>
              <Grid
                style={{
                  margin: '2%',
                  border: '1px solid #d0d6d1',
                  paddingTop: '3%',
                }}
                container
              >
                <Grid item md={12}>
                  <Typography
                    variant="subtitle1"
                    style={{ paddingLeft: '3%', color: '#417505' }}
                  >
                    Revenue with Infra
                  </Typography>
                </Grid>

                <Grid style={{ margin: '0 0 2% 2%' }} item md={3}>
                  <TextField
                    id="outlined-dense"
                    label="Percentage"
                    className={classNames(classes.textField, classes.dense)}
                    margin="dense"
                    variant="outlined"
                    name="percentageRevenueRuleDistribution"
                    value={this.state.percentageRevenueRuleDistribution}
                  />
                </Grid>
                <Grid item md={1}>
                  <Typography
                    style={{ paddingTop: '40%', textAlign: 'center' }}
                  >
                    and
                  </Typography>
                </Grid>
                <Grid item md={3}>
                  <TextField
                    id="outlined-dense"
                    label="Fixed"
                    className={classNames(classes.textField, classes.dense)}
                    margin="dense"
                    variant="outlined"
                    name="fixedAmtRevenueRuleDistribution"
                    value={this.state.fixedAmtRevenueRuleDistribution}
                  />
                </Grid>
                <Grid item md={3}>
                  <MaterialButton
                    variant="contained"
                    color="primary"
                    style={{
                      height: '40%',
                      marginTop: '23px',
                      marginLeft: '13%',
                    }}
                    className={classes.button}
                  >
                    Send for Approval
                  </MaterialButton>
                </Grid>
              </Grid>
              <Grid
                style={{
                  margin: '2%',
                  border: '1px solid #d0d6d1',
                  paddingTop: '3%',
                }}
                container
              >
                <Grid item md={12}>
                  <span
                    className={`${
                      this.state.bankBranchesTable ? 'ActiveTab' : 'InactiveTab'
                    } `}
                    // className={classes.bankBranches}
                    onClick={this.showBankBranches}
                  >
                    Bank Branches
                  </span>
                  <span
                    className={`${
                      this.state.bankPartnersTable ? 'ActiveTab' : 'InactiveTab'
                    } `}
                    onClick={this.showBankPartners}
                  >
                    Bank Partner
                  </span>
                  <span
                    className={`${
                      this.state.bankMerchantsTable
                        ? 'ActiveTab'
                        : 'InactiveTab'
                    } `}
                    onClick={this.showBankMerchants}
                  >
                    Bank Merchants
                  </span>
                </Grid>
                <MaterialTable
                  style={{
                    display: `${
                      this.state.bankBranchesTable ? 'block' : 'none'
                    }`,
                  }}
                  className={classes.table}
                >
                  <Grid
                    style={{
                      marginTop: '1%',
                      border: '1px solid #d0d6d1',
                      paddingTop: '3%',
                    }}
                    container
                  >
                    <Grid item md={10}>
                      <Typography
                        variant="subtitle1"
                        style={{ paddingLeft: '3%', color: '#417505' }}
                      >
                        Standard Revenue Sharing with Branches
                      </Typography>
                    </Grid>

                    <Grid style={{ margin: '0 0 2% 2%' }} item md={3}>
                      <TextField
                        id="outlined-dense"
                        label="Claim Percentage"
                        className={classNames(classes.textField, classes.dense)}
                        margin="dense"
                        variant="outlined"
                        name="claimRevenueRuleDistribution"
                        value={this.state.claimRevenueRuleDistribution}
                      />
                    </Grid>
                    <Grid item md={1}>
                      <Typography
                        style={{ paddingTop: '40%', textAlign: 'center' }}
                      >
                        and
                      </Typography>
                    </Grid>
                    <Grid item md={3}>
                      <TextField
                        id="outlined-dense"
                        label="Send Percentage"
                        className={classNames(classes.textField, classes.dense)}
                        margin="dense"
                        variant="outlined"
                        name="sendRevenueRuleDistribution"
                        value={this.state.sendRevenueRuleDistribution}
                      />
                    </Grid>
                    <Grid item md={3}>
                      <MaterialButton
                        variant="contained"
                        color="primary"
                        style={{
                          height: '40%',
                          marginTop: '23px',
                          marginLeft: '13%',
                        }}
                        className={classes.button}
                      >
                        Update
                      </MaterialButton>
                    </Grid>
                  </Grid>
                  <TableHead>
                    <TableRow>
                      <TableCell>Branch ID</TableCell>
                      <TableCell align="right">Branch Name</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map(row => (
                      <TableRow key={row.id}>
                        <TableCell component="th" scope="row">
                          {row.name}
                        </TableCell>
                        <TableCell align="right">{row.calories}</TableCell>
                        <TableCell align="right">{row.fat}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </MaterialTable>
                <MaterialTable
                  style={{
                    display: `${
                      this.state.bankPartnersTable ? 'block' : 'none'
                    }`,
                  }}
                  className={classes.table}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell align="right">Name</TableCell>
                      <TableCell align="right"></TableCell>
                     
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map(row => (
                      <TableRow key={row.id}>
                        <TableCell component="th" scope="row">
                          {row.name}
                        </TableCell>
                        <TableCell align="right">{row.calories}</TableCell>
                        <TableCell align="right">{row.fat}</TableCell>
                        
                      </TableRow>
                    ))}
                  </TableBody>
                </MaterialTable>
              </Grid>
            </Grid>
          ) : // </div>
          null}
        </Container>

        {/* {this.state.popup ? (
         
          <div>
            <Main style={{ display: 'none' }} />
            <Card bigPadding>hiiiiiii</Card>
          </div>
        ) : null} */}
        {this.state.popup ? (
          <MiniPopUp close={this.closeMiniPopUp.bind(this)}>
            {this.state.showOtp ? (
              <div>
                <h1>
                  <FormattedMessage {...messages.verify} />
                </h1>
                <form>
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
                  <Button filledBtn marginTop="50px">
                    <span>
                      <FormattedMessage {...messages.verify} />
                    </span>
                  </Button>
                </form>
              </div>
            ) : (
              <div>
                <form>
                  <p>
                    <span id="popname">{this.state.popname}</span>
                  </p>
                  <p>
                    {' '}
                    Sending from <span id="poptype">{this.state.poptype}</span>
                  </p>
                  {this.state.html.map(function(v) {
                    return (
                      <div>
                        Count:{' '}
                        <span className="green">
                          {v.trans_from} - {v.trans_to}
                        </span>
                        , Fixed:{' '}
                        <span className="green">
                          {CURRENCY + ' ' + v.fixed_amount}
                        </span>
                        , Percentage:{' '}
                        <span className="green">{v.percentage}</span>
                      </div>
                    );
                  })}

                  <Row>
                    <Col>
                      <FormGroup>
                        {this.state.declineLoading ? (
                          <Button
                            filledBtn
                            marginTop="50px"
                            accentedBtn
                            onClick={this.decline}
                            disabled
                          >
                            <Loader />
                          </Button>
                        ) : (
                          <Button
                            filledBtn
                            marginTop="50px"
                            accentedBtn
                            onClick={this.decline}
                          >
                            <span>Decline</span>
                          </Button>
                        )}
                      </FormGroup>
                    </Col>
                    <Col>
                      <FormGroup>
                        {this.state.approveLoading ? (
                          <Button
                            filledBtn
                            marginTop="50px"
                            onClick={this.approve}
                            disabled
                          >
                            <Loader />
                          </Button>
                        ) : (
                          <Button
                            filledBtn
                            marginTop="50px"
                            onClick={this.approve}
                          >
                            <span>Approve</span>
                          </Button>
                        )}
                      </FormGroup>
                    </Col>
                  </Row>
                </form>
              </div>
            )}
          </MiniPopUp>
        ) : null}
      </Wrapper>
    );
  }
}

export default withStyles(styles)(BankFees);
