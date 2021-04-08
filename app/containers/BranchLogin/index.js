/*
 * BranchLogin
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
import messages from '../HomePage/messages';

import Wrapper from 'components/Wrapper';
import FrontLeftSection from 'components/FrontLeftSection';
import FrontRightSection from 'components/FrontRightSection';
import LoginHeader from 'components/LoginHeader';
import FrontFormTitle from 'components/FrontFormTitle';
import FrontFormSubTitle from 'components/FrontFormSubTitle';
import InputsWrap from 'components/InputsWrap';
import FormGroup from 'components/FormGroup';
import TextInput from 'components/TextInput';
import PrimaryBtn from 'components/PrimaryBtn';
import Row from 'components/Row';
import Col from 'components/Col';
import A from 'components/A';
import Loader from 'components/Loader';
import history from 'utils/history';
import CloseIcon from '@material-ui/icons/Visibility';
import OpenIcon from '@material-ui/icons/VisibilityOff';
import TextField from '@material-ui/core/TextField';

import { API_URL, STATIC_URL } from '../App/constants';

import 'react-toastify/dist/ReactToastify.css';
toast.configure({
  position: 'bottom-right',
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
});

// localStorage.removeItem('bankLogged');
// const token = localStorage.getItem('bankLogged');

export default class BranchLogin extends Component {
  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
      notification: '',
      loading: true,
      redirect: false,
      visiblity: false
    };
    this.error = this.error.bind(this);
  }

  success = () => toast.success(this.state.notification);

  error = () => toast.error(this.state.notification);

  warn = () => toast.warn(this.state.notification);

  handleInputChange = event => {
    const { value, name } = event.target;
    this.setState({
      [name]: value.trim(),
    });
  };

  loginRequest = event => {
    this.setState({
      loginLoading: true
    });
    event.preventDefault();
    axios
      .post(`${API_URL}/partnerBranch/login`, this.state)
      .then(res => {
        if (res.status == 200) {
          console.log(res);
          localStorage.setItem('branchLogged', res.data.token);
          localStorage.setItem('branchName', res.data.name);
          localStorage.setItem('partnerName', res.data.partner_name);
          localStorage.setItem('bankName', res.data.bank_name);
          localStorage.setItem('bankLogo', res.data.bank_logo);
          localStorage.setItem('branchLimit', res.data.credit_limit);
          localStorage.setItem('branchUserName', res.data.username);
          localStorage.setItem('branchId', res.data.id);
          localStorage.setItem('bankLogo', res.data.logo);
          localStorage.setItem('branchEmail', res.data.email);
          localStorage.setItem('branchMobile', res.data.mobile);
          localStorage.setItem('bankid', res.data.partner_id);
          console.log(res);
          if (res.data.status == 0 && res.data.message === "Incorrect username or password") {
            throw res.data.message;
          }
          else if (res.data.status == 0 && res.data.message === "Your account has been blocked, pls contact the admin!") {
            throw res.data.message;
          }
          else if (res.data.initial_setup) {
            window.location.href = '/branch/' + this.props.match.params.bank + '/dashboard';
          } else {
            window.location.href = '/branch/' + this.props.match.params.bank + '/setup';
          }
        } else {
          throw res.data.error;
        }
        this.setState({
          loginLoading: false
        });
      })
      .catch(err => {
        this.setState({
          notification: err.response ? err.response.data.error : err.toString(),
          loginLoading: false
        });
        this.error();
      });
  };

  componentDidMount() {
    axios
      .post(`${API_URL}/getPartnerByName`, { name: this.props.match.params.bank })
      .then(res => {
        if (res.status == 200) {
          console.log(res);
          this.setState({ bank: res.data, loading: false });
        } else {
          throw res.data.error;
        }
      })
      .catch(err => {
        history.push("/");
      });
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
    return (
      <Wrapper>
        <Helmet>
          <meta charSet="utf-8" />
          <title>E-WALLET | BRANCH | LOGIN</title>
        </Helmet>
        <FrontLeftSection from="branch" title={this.state.bank.name} logo={STATIC_URL + this.state.bank.logo}></FrontLeftSection>
        <FrontRightSection>
          <LoginHeader>
            <FormattedMessage {...messages.pagetitle} />
          </LoginHeader>
          <FrontFormTitle><FormattedMessage {...messages.title} /></FrontFormTitle>
          <FrontFormSubTitle><FormattedMessage {...messages.subtitle2} /></FrontFormSubTitle>
          <form action="" method="POST" onSubmit={this.loginRequest}>
            <InputsWrap>
              <FormGroup>
                <label><FormattedMessage {...messages.userid} />*</label>
                <TextInput
                  type="text"
                  name="username"
                  onFocus={inputFocus}
                  onBlur={inputBlur}
                  value={this.state.username}
                  onChange={this.handleInputChange}
                  required
                />
              </FormGroup>
              {/* <FormGroup>
                <label><FormattedMessage {...messages.password} />*</label>
                <TextInput
                  type="password"
                  name="password"
                  onFocus={inputFocus}
                  onBlur={inputBlur}
                  value={this.state.password}
                  onChange={this.handleInputChange}
                  required
                />
              </FormGroup> */}
              <FormGroup>
                <div style={{ backgroundColor: "" }}>
                  <TextField
                    name="password"
                    label="Password"
                    style={{ width: "100%" }}
                    value={this.state.password}
                    type={this.state.visiblity ? 'text' : 'password'}
                    margin="normal"
                    variant="outlined"
                    onChange={this.handleInputChange}
                    required
                  />
                  <span
                    onClick={() => {
                      this.setState({ visiblity: !this.state.visiblity })
                    }}

                    style={{
                      position: 'relative',
                      top: '-40px',
                      left: "90%",

                    }}
                  >
                    <i>
                      {/* < CloseIcon /> */}
                      {this.state.visiblity ? (
                        < CloseIcon />
                      ) : (
                          <OpenIcon />
                        )}
                    </i>
                  </span>
                </div>
              </FormGroup>
            </InputsWrap>
            {
              this.loginLoading ?
                <PrimaryBtn disabled><Loader /></PrimaryBtn>
                :
                <PrimaryBtn><FormattedMessage {...messages.pagetitle} /></PrimaryBtn>
            }

          </form>
          <Row marginTop>
            <Col />
            <Col textRight>
              <A href={"/branch/" + this.props.match.params.bank + "/forgot-password"}><FormattedMessage {...messages.forgotpassword} /></A>
            </Col>
          </Row>
        </FrontRightSection>
      </Wrapper>
    );
  }
}
