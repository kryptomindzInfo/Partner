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
import CashierHeader from 'components/Header/CashierHeader';
import Container from 'components/Container';
import Loader from 'components/Loader';
import Card from 'components/Card';
import ActionBar from 'components/ActionBar';
import SidebarCashier from 'components/Sidebar/SidebarCashier';
import Main from 'components/Main';
import Table from 'components/Table';
import Pagination from 'react-js-pagination';

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


const token = localStorage.getItem('cashierLogged');
const bid = localStorage.getItem('cashierId');
const logo = localStorage.getItem('bankLogo');
const email = localStorage.getItem('cashierEmail');
const mobile = localStorage.getItem('cashierMobile');

export default class CashierDashboard extends Component {
  constructor() {
    super();
    this.state = {
      token,
      otpEmail: email,
      otpMobile: mobile,
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
    };
    this.success = this.success.bind(this);
    this.error = this.error.bind(this);
    this.warn = this.warn.bind(this);

this.showHistory = this.showHistory.bind(this);
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

  showHistory = () => {
    console.log(this.state.allhistory);
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
      console.log(out);
      this.setState({ history: out }, ( ) => {
        console.log(this.state.history);
      });
    });
  };

  getHistory = () => {
    axios
      .post(`${API_URL}/getCashierHistory`, {
        token: token,
        where: { status: 1, cashier_id : bid},
        from: 'cashier',
        page: this.state.activePage,
        offset: this.state.perPage,
      })
      .then(res => {
        if (res.status == 200) {

          var result = res.data.history1.concat(res.data.history2);
          result.sort(function(a, b) {
              return a.created_at - b.created_at // implicit conversion in number
          });

          this.setState(
            {
              result: result,
              loading: false,
              allhistory: result,
              totalCount: result.length,
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
      .post(`${API_URL}/getHistoryTotal`, {
        token: token,
        where: { cashier_id : bid},
        from: 'cashier'
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
    axios
      .post(`${API_URL}/getBranchByName`, {
        name: this.props.match.params.bank
      })
      .then(res => {
        if (res.status == 200) {
          console.log(res.data);
          this.setState({ loading: false, branchDetails: res.data.banks}, () => {
            this.getHistory();
          });
        }
      })
      .catch(err => {});
    
  }

  render() {


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
    return (

      <Wrapper  from="branch">
        <Helmet>
          <meta charSet="utf-8" />
          <title>Dashboard | CASHIER | E-WALLET</title>
        </Helmet>
        <CashierHeader active="dashboard" bankName={this.props.match.params.bank} bankLogo={STATIC_URL+logo} from="cashier" />
        <Container verticalMargin>

        <SidebarCashier />
          <Main>
            <div className="clr">
            <Card
                horizontalMargin="7px"
                cardWidth="151px"
                h4FontSize="16px"
                textAlign="center"
                col
              >
                <h4>
                Opening Balance
                </h4>
                <div className="cardValue">0</div>
              </Card>
              <Card
                horizontalMargin="7px"
                cardWidth="151px"
                h4FontSize="16px"
                textAlign="center"
                col
              >
                <h4>
                Cash Received
                </h4>
                <div className="cardValue">0</div>
              </Card>
              <Card
                horizontalMargin="7px"
                cardWidth="151px"
                h4FontSize="16px"
                textAlign="center"
                col
              >
                <h4>
                Paid in Cash
                </h4>
                <div className="cardValue">0</div>
              </Card>
              <Card
                horizontalMargin="7px"
                cardWidth="151px"
                h4FontSize="16px"
                textAlign="center"
                col
              >
                <h4>
                Fee Generated
                </h4>
                <div className="cardValue">0</div>
              </Card>
            </div>
            <ActionBar
              marginBottom="15px"
              marginTop="15px"
              inputWidth="calc(100% - 241px)"
              className="clr"
            >
              <p className="notification"><strong>Congrats</strong> You have received {CURRENCY} 200.00 from <strong>Test User</strong> on 27th December 2019</p>
            </ActionBar>

            <Card bigPadding>
              <div className="cardHeader">
                <div className="cardHeaderLeft">
                  <i className="material-icons">playlist_add_check</i>
                </div>
                <div className="cardHeaderRight">
                  <h3>Recent Activity</h3>
                  <h5>E-wallet activity</h5>
                </div>
              </div>
              <div className="cardBody">
                <div className="clr">
                  <div className="menuTabs" onClick={() => this.filterData('')}>
                    All
                  </div>
                  <div
                    className="menuTabs"
                    onClick={() => this.filterData('DR')}
                  >
                    Payment Sent
                  </div>
                  <div
                    className="menuTabs"
                    onClick={() => this.filterData('CR')}
                  >
                    Payment Received
                  </div>
                </div>
                <Table marginTop="34px" marginBottom="34px" smallTd textAlign="left">
                  <tbody>
                    {this.state.history && this.state.history.length > 0
                      ? this.state.history.map(function(b) {
                        
                          var isoformat = b.created_at;
                          var readable = new Date(isoformat);
                          var m = readable.getMonth(); // returns 6
                          var d = readable.getDay(); // returns 15
                          var y = readable.getFullYear();
                          var h = readable.getHours();
                          var mi = readable.getMinutes();
                          var mlong = months[m];
                          var fulldate =
                            d + ' ' + mlong + ' ' + y + ' ' + h + ':' + mi;
                          return  (dis.state.filter == 'CR' &&  b.sender_info) || (dis.state.filter == 'DR' &&  !b.sender_info)  ||
                            dis.state.filter == ''  ?  (
                            <tr key={b._id}>
                              <td>
                                <div className="labelGrey">{fulldate}</div>
                              </td>
                              <td>
                                <div className="labelBlue">
                                  {
                                    b.sender_info ?
                                    <span>Transfered to  escrow@{dis.state.branchDetails.name}</span>
                                    :
                                    <span>Claimed from {dis.state.branchDetails.bcode}_operational@{dis.state.branchDetails.name}</span>
                                  }
                                </div>
                                <div className="labelSmallGrey">Completed</div>
                              </td>
                              <td>
                                <div className="labelGrey">
                                 {b.transaction_code == 'DR' ? '-XOF' : 'XOF'}{b.amount}
                                </div>
                              </td>
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
