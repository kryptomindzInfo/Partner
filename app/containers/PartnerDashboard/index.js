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
import PartnerHeader from 'components/Header/PartnerHeader';
import Container from 'components/Container';
import A from 'components/A';
import Loader from 'components/Loader';
import Main from 'components/Main';
import Card from 'components/Card';
import SidebarBank from 'components/Sidebar/SidebarBank';
import { API_URL } from '../App/constants';

import 'react-toastify/dist/ReactToastify.css';
toast.configure({
  position: 'bottom-right',
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
});

const token = localStorage.getItem('partnerLogged');

export default class PartnerDashboard extends Component {

  constructor() {
    super();
    this.state = {
      otp: '',
      showOtp: false,
      loading: false,
      redirect: false,
      totalBanks: 0,
      notification: '',
      popup: false,
    };

    this.success = this.success.bind(this);
    this.error = this.error.bind(this);
    this.warn = this.warn.bind(this);
  }

  success = () => toast.success(this.state.notification);

  error = () => toast.error(this.state.notification);

  warn = () => toast.warn(this.state.notification);


  componentDidMount() {
    axios
      .post(`${API_URL}/partner/dashStats`, { token })
      .then(res => {
        console.log(res);
        if (res.status == 200) {
          this.setState({ loading: false, totalBranches: res.data.totalBranches, totalUsers: res.data.totalUsers, totalCashiers: res.data.totalCashiers });
        }
      })
      .catch(err => {
        this.setState({
          notification: err.response
            ? err.response.data.error.toString()
            : err.toString(),
        });
        this.error();
      });
  }




  render() {
    const { loading, redirect, popup } = this.state;
    if (loading) {
      return <Loader fullPage />;
    }
    // if (redirect) {
    //   return <Redirect to="/" />;
    // }
    return (
      <Wrapper from="bank">
        <Helmet>
          <meta charSet="utf-8" />
          <title>Dashboard | PARTNER | E-WALLET</title>
        </Helmet>
        <PartnerHeader active="dashboard" />
        <Container verticalMargin>
          <SidebarBank />
          <Main>
            <div className="clr">
              <A href="/branches" float="left">
                <Card
                  horizontalMargin="7px"
                  cardWidth="151px"
                  textAlign="center"
                  col
                >
                  <h4><FormattedMessage {...messages.bbox1} /></h4>
                  <div className="cardValue">{this.state.totalBranches}</div>
                </Card>
              </A>
              <Card
                horizontalMargin="7px"
                cardWidth="151px"
                textAlign="center"
                col
              >
                <h4><FormattedMessage {...messages.box3} /></h4>
                <div className="cardValue">{this.state.totalUsers}</div>
              </Card>
              <Card
                horizontalMargin="7px"
                cardWidth="151px"
                textAlign="center"
                col
              >
                <h4><FormattedMessage {...messages.box4} /></h4>
                <div className="cardValue">{this.state.totalCashiers}</div>
              </Card>
            </div>
          </Main>
        </Container>
      </Wrapper>
    );
  }
}
