import React, { Component } from 'react';
import styled from 'styled-components';
import LanguageSwitch from 'components/LanguageSwitch';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import SubNav from './SubNav';
import A from 'components/A';
import history from 'utils/history';

const WelcomeWrap = styled.div`
  float: right;
  margin: 7px 0;
  display: block;
  color: #fff;
  font-size: 18px;
  font-weight: normal;
  line-height: 26px;
`;

const Name = styled.div`
  float: left;
  margin-left: 10px;
  margin-right: 50px;
`;

const Icon = styled.i`
  float: left;
  margin-left: 10px;
`;

class Welcome extends Component {
  logoutInfra = () => {
    localStorage.removeItem('logged');
    localStorage.removeItem('name');
    history.push('/');
    //this.props.history.push('/');
  };

  logoutBank = () => {
    localStorage.removeItem('partnerLogged');
    localStorage.removeItem('PartnerName');
    history.push('/');
    //this.props.history.push('/bank');
  };

  logoutBranch = () => {
    localStorage.removeItem('branchLogged');
    localStorage.removeItem('branchName');
    history.push('/branch/' + this.props.bankName);
    //this.props.history.push('/bank');
  };

  logoutCashier = () => {
    localStorage.removeItem('cashierLogged');
    history.push('/cashier/' + this.props.bankName);
    //this.props.history.push('/bank');
  };

  render() {
    let name = '';
    let isAdmin = false;
    if (this.props.from == 'bank') {
      name = localStorage.getItem('partnerName');
    } else if (this.props.from == 'branch') {
      name = localStorage.getItem('branchName');
    } else if (this.props.from == 'cashier') {
      name = localStorage.getItem('cashierName');
    } else {
      isAdmin = localStorage.getItem('isAdmin');
      name = localStorage.getItem('name');
    }
    var tempDate = new Date();
    var date =
    tempDate.getDate() +
    '-' +
    (tempDate.getMonth() + 1) +
    '-' +
    tempDate.getFullYear() + ' '
      // tempDate.getHours() +
      // ':' +
      // tempDate.getMinutes() +
      // ':' +
      // tempDate.getSeconds();
    const currDate = '' + date;

    const bankName = this.props.bankName;
    return (
      <>

        <WelcomeWrap className="clr">
        <span style={{paddingRight: '7px'}}>{currDate}</span>
        <Icon className="material-icons fl">notifications</Icon>
          <div className="dropdown fl">
           
            {/* <Name>
            <FormattedMessage {...messages.welcome} /> {name}
          </Name> */}
            {this.props.infraNav ? (
              <>
                <Name>
                  <span>INFRA:</span> {name}
                </Name>
                <SubNav className="infraSubNav">
                  {/* { isAdmin ?  */}
                  <A href="/profile">Settings</A>
                  {/* //  : null } */}
                  <span onClick={this.logoutInfra}>Logout</span>
                </SubNav>
              </>
            ) : this.props.from == 'branch' ? (
              <>
                <Name>
                  <span>BRANCH:</span> {name}
                </Name>
                <SubNav className="infraSubNav">
                  {/* { isAdmin ?  */}
                  <A href={'/branch/' + bankName + '/info'}>Settings</A>
                  {/* //  : null } */}
                  <span onClick={this.logoutBranch}>Logout</span>
                </SubNav>
              </>
            ) : this.props.from == 'cashier' ? (
              <>
                <Name>
                  <span>CASHIER:</span> {name}
                </Name>
                <SubNav className="infraSubNav">
                  {/* { isAdmin ?  */}
                  <A href={'/cashier/' + bankName + '/info'}>Profile</A>
                  {/* //  : null } */}
                  <span onClick={this.logoutCashier}>Logout</span>
                </SubNav>
              </>
            ) : (
              <>
                <Name>
                  <span>Partner:</span> {name}
                </Name>
                <SubNav className="bankSubNav">
                  <A href="/bank/info">Settings</A>
                  <span onClick={this.logoutBank}>Logout</span>
                </SubNav>
              </>
            )}
          </div>
          <LanguageSwitch />
        </WelcomeWrap>
      </>
    );
  }
}

export default Welcome;
