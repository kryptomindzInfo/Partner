import React, { Component } from 'react';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import A from 'components/A';
import messages from './messages';

const NavTag = styled.nav`
  float: left;
  margin: 8px 27px;
`;

const Link = styled.span`
  color: #fff;
  font-size: 18px;
  margin: 0 12px;
  padding-bottom: 7px;
  font-weight: normal;
  border-bottom: ${props => (props.active == 'true' ? '1px solid white' : '0')};
`;

class PartnerNav extends Component {
  render() {
    const dashboard = this.props.active == 'dashboard' ? 'true' : '';
    const branches = this.props.active == 'branches' ? 'true' : '';
    const cashier = this.props.active == 'cashier' ? 'true' : '';
    const merchants = this.props.active == 'merchants' ? 'true' : '';
    const users = this.props.active == 'users' ? 'true' : '';
    const bankusers = this.props.active == 'bankusers' ? 'true' : '';
    const reports = this.props.active == 'reports' ? 'true' : '';

    return (
      <React.Fragment>
        <NavTag>
          <A href="/dashboard">
            <Link
              active={dashboard}
              // style={`${props => props.theme.secondary}`}
            >
              <FormattedMessage {...messages.menu1} />
            </Link>
          </A>
          {/* <A href="/branches">
            <Link active={branches}>
              <FormattedMessage {...messages.bmenu1} />
            </Link>
          </A> */}
          <A href="/users">
            <Link active={bankusers}>Users</Link>
          </A>
          <A href="/reports">
            <Link active={reports}>
              <FormattedMessage {...messages.menu4} />
            </Link>
          </A>
        </NavTag>
      </React.Fragment>
    );
  }
}

export default PartnerNav;
