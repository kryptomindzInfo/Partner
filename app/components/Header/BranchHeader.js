import React, { Component } from 'react';
// import Logo from './Logo';
import BranchNav from './BranchNav';
import TopBar from './TopBar';
import Welcome from './Welcome';
import Container from 'components/Container';
import A from 'components/A';
import Logo from 'components/Header/Logo';
import axios from 'axios';
import styled from 'styled-components';

import {
  API_URL,
  STATIC_URL,
  CONTRACT_URL,
} from '../../../app/containers/App/constants';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

const NavTag = styled.nav`
  float: left;
  
`;

const Link = styled.span`
    color: #fff;
    font-size: 18px;
    margin: 0 40px 0 0;
    padding-bottom: 7px;
    display: block;
    font-weight: normal;
    border-radius: 8px;
    border: solid 2px #ffffff;
    padding: 5px 20px;
`;
const Link1 = styled.span`
    color: #fff;
    font-size: 18px;
    // margin: 0 40px 0 0;
    padding-bottom: 7px;
    display: block;
    font-weight: normal;
   
    padding: 5px 15px;
`;



var permissions = localStorage.getItem('permissions');
if (permissions != 'all' && permissions != '') {
  permissions = JSON.parse(permissions);
}

class BranchHeader extends Component {
  constructor() {
    super();
    this.state = {
      logo: null,
      name: '',
    };
  }


  componentDidMount() {

  }

  // componentWillUnmount() {

  // }

  render() {
    const name = localStorage.getItem('name');
    const page = this.props.page;
    return (
      <TopBar>
        <Welcome from="branch" bankName={this.props.bankName} />
        <Container>
          {
            page == 'branch' ?
              <A href={this.props.goto} float="left">
                <Link>
                  Back
            </Link>
              </A>
              :
              null
          }

          <A href={"/branch/" + this.props.bankName + "/dashboard"} float="left">
            <div className="bankLogo">
              <img src={this.props.bankLogo} />
            </div>
            <h2>{this.props.bankName.toUpperCase()}</h2>
            {/* <Logo><FormattedMessage {...messages.logo} /></Logo> */}
          </A>
          {
            this.props.middleTitle ?
              <div className="middleTitle">{this.props.middleTitle}</div>
              :
              null
          }
          {
            page == 'branch' ?
              <NavTag>
                <A href={"/branch/" + this.props.bankName + "/cashiers"}>
                  <Link1 >
                    Cashier
                  </Link1>
                </A>
                <A >
                  <Link1 >
                    Reports
                  </Link1>
                </A>
              </NavTag>


              :
              null
          }
          {
            page == 'branch' ?
              null
              :
              <BranchNav active={this.props.active} bankName={this.props.bankName} />
          }

        </Container>
      </TopBar>
    );
  }
}

export default BranchHeader;
