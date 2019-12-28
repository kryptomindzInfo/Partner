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

import { FormattedMessage } from 'react-intl';
import messages from './messages';

import Wrapper from 'components/Wrapper';
import TopBar from 'components/Header/TopBar';
import Container from 'components/Container';
import Logo from 'components/Header/Logo';
import Nav from 'components/Header/Nav';
import Welcome from 'components/Header/Welcome';
import SidebarOne from 'components/Sidebar/SidebarOne';
import Main from 'components/Main';
import ActionBar from 'components/ActionBar';
import Card from 'components/Card';
import Button from 'components/Button';
import Table from 'components/Table';
import Popup from 'components/Popup';
import FormGroup from 'components/FormGroup';
import TextInput from 'components/TextInput';
import SelectInput from 'components/SelectInput';
import Pagination from "react-js-pagination";
import Row from 'components/Row';
import A from 'components/A';
import styled from 'styled-components';

import { API_URL, STATIC_URL } from '../App/constants';

import 'react-toastify/dist/ReactToastify.css';

const H4 = styled.h4 `
 > span{
   font-size: 13px;
   color: #666;
 }
`;
toast.configure({
  position: 'bottom-right',
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
});

const token = localStorage.getItem('logged');

export default class OperationalHistory extends Component {
  constructor() {
    super();
    this.state = {
      bank_id: '',
      bank: '',
      logo: null,
      contract: null,
      loading: true,
      redirect: false,
      name: '',
      trans_type: '',
      perPage: 5,
      totalCount: 100,
      allhistory: [],
      activePage: 1,
      active: 'Active',
      trans_from: '',
      trans_to: '',
      transcount_from: '',
      history: [],
      filter: '',
      transcount_to: '',
      fixed_amount: '',
      percentage: '',
      notification: '',
      popup: false,
      user_id: token,
      banks: [],
      otp: '',
      showOtp: false,
      token
    };

    this.success = this.success.bind(this);
    this.error = this.error.bind(this);
    this.warn = this.warn.bind(this);

    this.onChange = this.onChange.bind(this);
    this.fileUpload = this.fileUpload.bind(this);
    this.showHistory = this.showHistory.bind(this);
  }

  success = () => toast.success(this.state.notification);

  error = () => toast.error(this.state.notification);

  warn = () => toast.warn(this.state.notification);

  handleInputChange = event => {
    console.log(event);
    const { value, name } = event.target;
    this.setState({
      [name]: value,
    });
  };

  showPopup = () => {
    // this.setState({ popup: true });
    this.props.history.push(`/createfee/${this.props.match.params.bank}`);
  };

  closePopup = () => {
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
      showOtp: false,
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

  createRules = event => {
    event.preventDefault();
    if (
      (this.state.fixed_amount == '' && this.state.percentage == '') ||
      (this.state.fixed_amount != '' && this.state.percentage != '')
    ) {
      this.setState(
        {
          notification: 'Fill either fixed amount or percentage',
        },
        () => {
          this.error();
      });
    } else {
      axios
        .post(`${API_URL  }/createRules`, this.state)
        .then(res => {
          if(res.status == 200){
            if(res.data.error){
              throw res.data.error;
            }else{
              // console.log(res.data);
              this.setState({
                notification: 'Rule added'
              }, () => {
                  this.success();
                  const ba = this.state.bank;
                  let {history} = this.props;
                setTimeout(function(){
                  history.push(`/fees/${ba}`);
                }, 1000);
              });
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
    }
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
            this.closePopup();
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

  getBanks = () => {
    axios
      .post(`${API_URL}/getBank`, {
        token: token,
        bank_id: this.props.match.params.bank,
      })
      .then(res => {
        if (res.status == 200) {
          this.setState({
            loading: false,
            banks: res.data.banks,
            logo: res.data.banks.logo,
            bank_id: this.props.match.params.bank,
          });
        }
      })
      .catch(err => {});
  };

  showHistory = () => {
    this.setState({ history: [] }, () => {
      let out = [];
      let start = (this.state.activePage - 1) * this.state.perPage;
      let end = this.state.perPage * this.state.activePage;
      if (end > this.state.totalCount) {
        end = this.state.totalCount;
      }
      for (var i = start; i < end; i++) {
        out.push(this.state.allhistory[i]);
      }
      this.setState({ history: out });
    });
  };

  getHistory = () => {
    axios
      .post(`${API_URL}/getInfraHistory`, {
        token: token,
        from: 'operational',
        bank_id: this.props.match.params.bank,
        page: this.state.activePage,
        offset: this.state.perPage,
      })
      .then(res => {
        if (res.status == 200) {
          // console.log(res.data);
          this.setState(
            {
              loading: false,
              allhistory: res.data.history,
              totalCount: res.data.history.length,
            },
            () => {
              this.showHistory();
            },
          );
        }
      })
      .catch(err => {});
  };

  getHistoryTotal = () => {
    axios
      .post(`${API_URL}/getInfraHistoryTotal`, {
        token: token,
        from: 'operational',
        bank_id: this.props.match.params.bank,
      })
      .then(res => {
        if (res.status == 200) {
          console.log(res.data);
          this.setState({ loading: false, totalCount: res.data.total }, () => {
              this.getHistory();
            });
        }
      })
      .catch(err => {});
  };

  filterData = e => {
    this.setState({ filter: e });
  };

  handlePageChange = pageNumber => {
    console.log(`active page is ${pageNumber}`);
    this.setState({ activePage: pageNumber });
    this.showHistory();
  };

  componentDidMount() {
    this.setState({ bank: this.props.match.params.bank });
    if (token !== undefined && token !== null) {
      this.setState({ loading: false });
      this.getBanks();
      this.getHistory();
    } else {
      // alert('Login to continue');
      // this.setState({loading: false, redirect: true });
    }
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

    function onChange(event) {
      console.log(event);
      // this.setState({
      //   trans_type: event.target.value
      // });
    }

    const { loading, redirect } = this.state;
    if (loading) {
      return null;
    }
    if (redirect) {
      return <Redirect to="/" />;
    }
    let months = [
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
    let dis = this;
    return (
      <Wrapper>
        <Helmet>
          <meta charSet="utf-8" />
          <title>Create Fee | INFRA | E-WALLET</title>
        </Helmet>
        <TopBar>
          <Welcome infraNav/>
          <Container>
            <A href="/dashboard" float="left">
              <div className="headerNavDash">
              Main Dashboard
              </div>
            </A>
            <div className="bankLogo">
              <img src={STATIC_URL+this.state.logo}/>
            </div>

            <h2>{this.state.banks.name}</h2>
          </Container>
        </TopBar>
        <Container verticalMargin>
          <SidebarOne bankId={this.state.bank}/>
          <Main>
            {/* <ActionBar marginBottom="33px" inputWidth="calc(100% - 344px)" className="clr">
              <div className="iconedInput fl small">
                <i className="material-icons">search</i>
                <input type="text" placeholder="Search"  />
              </div>
              <TextInput
              className="fr dateinput"
              placeholder="To Date"
              list="l1"
              />
              <datalist id="l1">
                <option>Select</option>
              </datalist>
              <TextInput
              className="fr dateinput"
              placeholder="From Date"
              list="l2"
              />
              <datalist id="l2">
                <option>Select</option>
              </datalist>

            </ActionBar> */}
            <Card bigPadding>
              <div className="cardHeader" >
                <div className="cardHeaderLeft">
                  <i className="material-icons">playlist_add_check</i>
                </div>
                <div className="cardHeaderRight">
                  <h3>Transactions</h3>
                  <h5>E-wallet activity</h5>
                </div>
              </div>
              <div className="cardBody">
                <div className="clr">
                  <div className="menuTabs" onClick={() => this.filterData("")}>All</div>
                  <div className="menuTabs" onClick={() => this.filterData("DR")}>Payment Sent</div>
                  <div className="menuTabs" onClick={() => this.filterData("CR")}>Payment Recieved</div> 
                </div>
                <Table marginTop="34px" smallTd>
                  <tbody>
                    {
                      
                      this.state.history && this.state.history.length > 0
                      ? this.state.history.map(function(b) {
                          let isoformat = b.Timestamp;
                          let readable = new Date(isoformat);
                          let m = readable.getMonth(); // returns 6
                          let d = readable.getDay(); // returns 15
                          let y = readable.getFullYear();
                          let h = readable.getHours();
                          let mi = readable.getMinutes();
                          let mlong = months[m];
                          let fulldate =
                            d + ' ' + mlong + ' ' + y + ' ' + h + ':' + mi;

                          return dis.state.filter == b.Value.tx_data.tx_type ||
                            dis.state.filter == '' ? (
                            <tr key={b.TxId}>
                            <td><div className="labelGrey">{fulldate}</div></td>
                            <td><div className="labelBlue">{b.Value.tx_data.tx_details}</div> <div className="labelSmallGrey">Completed</div></td>
                            <td><div className="labelGrey">XOF {b.Value.amount}</div></td>
                          </tr>
                            :
                            null
                            </tr>
                          ) : null;
                        })
                      : null}
                  </tbody>
                </Table>
                <div>
                  <Pagination
                    activePage={this.state.activePage}
                    itemsCountPerPage={this.state.perPage}
                    totalItemsCount={this.state.totalCount}
                    pageRangeDisplayed={5}
                    onChange={this.handlePageChange}
                  />
                </div>
              </div>
            </Card>
          </Main>
        </Container>
      </Wrapper>
    );
  }
}
