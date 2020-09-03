/*
 * BranchSetup
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
import TextInput from 'components/TextInput';
import PrimaryBtn from 'components/PrimaryBtn';
import BackBtn from 'components/BackBtn';
import A from 'components/A';
import Loader from 'components/Loader';
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

const token = localStorage.getItem('branchLogged');
// console.log(token);
const username = localStorage.getItem('branchUserName');
export default class BranchSetup extends Component {
  constructor() {
    super();
    this.state = {
      username,
      password: '',
      confirm: '',
      notification: '',
      loading: true,
      redirect: false,
      token: token
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

  setupUpdate = event => {

    event.preventDefault();
    if(this.state.password != this.state.confirm){
      this.setState({
        notification: 'Passwords do not match'
      }, () => {
        this.error();
    });

    }else{
      this.setState({
        setupLoading: true
      });
    axios
      .post(`${API_URL}/partnerBranch/setupUpdate`, this.state )
      .then(res => {
        if (res.status == 200) {
            localStorage.removeItem('branchLogged');
            localStorage.removeItem('branchName');
            localStorage.removeItem('branchUserName');
            this.setState({
              notification: 'Details updated, you will be redirected to the login screen'
            }, () => {
              this.success();
              let history = this.props.history;
              let bankName = this.props.match.params.bank;
              setTimeout(function(){
                history.push('/branch/'+bankName);
              }, 3000);
          });
        } else {
          throw res.data.error;
        }
        this.setState({
          setupLoading: false
        });
      })
      .catch(err => {
        this.setState({
          notification: err.response ? err.response.data.error : err.toString(),
          setupLoading: false
        }, () => {
          this.error();
      });
      });
    }
  };

  componentDidMount() {
    axios
      .post(`${API_URL}/getPartnerByName`, {name: this.props.match.params.bank})
      .then(res => {
        if (res.status == 200) {
          this.setState({ bank: res.data, loading:false });
        } else {
          throw res.data.error;
        }
      })
      .catch(err => {
        this.history.push("/");
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
    if (redirect) {
      return <Redirect to="/dashboard" />;
    }
    return (
      <Wrapper>
        <Helmet>
          <meta charSet="utf-8" />
          <title>E-WALLET | BANK | HOME</title>
        </Helmet>
        <FrontLeftSection from="branch" title={this.state.bank.name} logo={STATIC_URL+this.state.bank.logo}></FrontLeftSection>

        <FrontRightSection>
          <LoginHeader>
            <A href={"/branch/"+this.state.bank.name+"/otp"} float="left">
          <BackBtn className="material-icons">
            keyboard_backspace
          </BackBtn>
          </A>
            <FormattedMessage {...messages.pagetitle} /></LoginHeader>
          <FrontFormTitle><FormattedMessage {...messages.title} /></FrontFormTitle>
          <form action="" method="POST" onSubmit={this.setupUpdate}>
            <InputsWrap>

              <FormGroup>
                <label><FormattedMessage {...messages.newpass} />*</label>
                <TextInput
                  type="password"
                  name="password"
                  pattern=".{8,}"
                  title= "Minimum 8 Characters"
                  onFocus={inputFocus}
                  onBlur={inputBlur}
                  value={this.state.password}
                  onChange={this.handleInputChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <label><FormattedMessage {...messages.confirm} />*</label>
                <TextInput
                  type="password"
                  name="confirm"
                  pattern=".{8,}"
                  title= "Minimum 8 Characters"
                  onFocus={inputFocus}
                  onBlur={inputBlur}
                  value={this.state.confirm}
                  onChange={this.handleInputChange}
                  required
                />
              </FormGroup>
            </InputsWrap>
            {
              this.state.setupLoading ?
              <PrimaryBtn disabled><Loader /></PrimaryBtn>
              :
              <PrimaryBtn><FormattedMessage {...messages.update} /></PrimaryBtn>
            }

          </form>       </FrontRightSection>
      </Wrapper>
    );
  }
}
