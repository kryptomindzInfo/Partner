/*
 * BankActivate
 *
 * This is the first thing users see of our App, at the '/' route
 *
 */

import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import { toast } from 'react-toastify';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

import Wrapper from 'components/Wrapper';
import FrontLeftSection from 'components/FrontLeftSection';
import FrontRightSection from 'components/FrontRightSection';
import LoginHeader from 'components/LoginHeader';
import FrontFormTitle from 'components/FrontFormTitle';
import InputsWrap from 'components/InputsWrap';
import FormGroup from 'components/FormGroup';
import BackBtn from 'components/BackBtn';
import PrimaryBtn from 'components/PrimaryBtn';
import Button from 'components/Button';
import A from 'components/A';
import Loader from 'components/Loader';
import { API_URL, STATIC_URL, CONTRACT_URL } from '../App/constants';

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
const username = localStorage.getItem('partnerUserName');
const contract = localStorage.getItem('partnerContract');
const logo = localStorage.getItem('partnerLogo');

export default class PartnerActivate extends Component {
  constructor() {
    super();
    this.state = {
      confirm: '',
      token: token,
      loading: true,
      redirect: false,
      token: token,
    };
    this.error = this.error.bind(this);
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

  activateAccount = event => {
    this.setState({
      activeLoading: true
    });
    event.preventDefault();

    axios
      .post(`${API_URL}/partner/activate`, { token: token })
      .then(res => {
        if (res.status == 200) {
          this.setState(
            {
              notification: 'Account activated!' + res.data.walletStatus,
            },
            () => {
              this.success();
              let history = this.props.history;
              setTimeout(function() {
                history.push('/dashboard');
              }, 1000);
            },
          );
        } else {
          throw res.data.error;
        }
        this.setState({
          activeLoading: false
        });
      })
      .catch(err => {
        this.setState(
          {
            notification: err.response
              ? err.response.data.error
              : err.toString(),
          },
          () => {
            this.error();
          },
        );
      });
  };

  componentDidMount() {
    // if (token !== undefined && token !== null) {
    //   this.setState({ loading: false, redirect: true });
    // } else {
    this.setState({ loading: false });
    // }
    // document.getElementById('username').focus();
  }

  openPDF = event => {
    document.getElementById('pdfdown').click();
  };

  render() {
    function inputFocus(e) {
      const { target } = e;
      console.log(target);
      // target.parentElement.querySelector('label').classList.add('focused');
    }

    function inputBlur(e) {
      const { target } = e;
      if (target.value == '') {
        // target.parentElement.querySelector('label').classList.remove('focused');
      }
    }

    const { loading, redirect } = this.state;
    if (loading) {
      return <Loader fullPage />
    }
    if (redirect) {
      return <Redirect to="/dashboard" />;
    }
    return (
      <Wrapper>
        <Helmet>
          <meta charSet="utf-8" />
          <title>E-WALLET | BANK | HOME</title>
        </Helmet>
        <FrontLeftSection from="partner" logo={STATIC_URL + logo} />
        <FrontRightSection>
          <LoginHeader>
            <A href="/" float="left">
              <BackBtn className="material-icons">keyboard_backspace</BackBtn>
            </A>
            <FormattedMessage {...messages.pagetitle} />
          </LoginHeader>

          <FrontFormTitle>
            <FormattedMessage {...messages.title} />
          </FrontFormTitle>
          {/* <div className="bankLogoActivate">
          <img src={STATIC_URL+logo} />
          </div> */}
          <form action="" method="POST" onSubmit={this.activateAccount}>
            <InputsWrap>
              <FormGroup>
                <iframe
                  src={CONTRACT_URL + contract}
                  width="100%"
                  height="500px"
                />
                <Button
                  onClick={this.openPDF}
                  type="button"
                  accentedBtn
                  bottomRight
                >
                  <FormattedMessage {...messages.btn1} />
                </Button>
                <a
                  target="_BLANK"
                  href={CONTRACT_URL + contract}
                  download="Contract"
                  id="pdfdown"
                  className="hide"
                >
                  click me
                </a>
              </FormGroup>

              <FormGroup className="checkbox">
                <input
                  type="checkbox"
                  name="confirm"
                  onFocus={inputFocus}
                  onBlur={inputBlur}
                  value={this.state.confirm}
                  onChange={this.handleInputChange}
                  required
                />{' '}
                <FormattedMessage {...messages.confirm} />
              </FormGroup>
            </InputsWrap>
            <p className="note">
              <span style={{ color: 'red', paddingRight: '7px', paddingTop: '5px' }}>*</span>
              Please approve the revenue policy and revenue rule to activate the
              transaction
            </p>
            <PrimaryBtn>
              <FormattedMessage {...messages.btn2} />
            </PrimaryBtn>
          </form>
        </FrontRightSection>
      </Wrapper>
    );
  }
}
