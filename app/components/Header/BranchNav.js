import React, { Component } from 'react';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import A from 'components/A';

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

class BranchNav extends Component {
  render() {
    const dashboard = this.props.active == 'dashboard' ? 'true' : '';
    const cashier = this.props.active == 'cashier' ? 'true' : '';
    // const merchants = this.props.active == 'merchants' ? 'true' : '';
    // const users = this.props.active == 'users' ? 'true' : '';
    const reports = this.props.active == 'reports' ? 'true' : '';
    const bankName = this.props.bankName;
    return (
      <React.Fragment>
        <NavTag>
          <A href={"/branch/" + bankName + "/dashboard"}>
            <Link
              active={dashboard}
            // style={`${props => props.theme.secondary}`}
            >
              <FormattedMessage {...messages.menu1} />
            </Link>
          </A>
          <A href={"/branch/" + bankName + "/cashiers"}>
            <Link active={cashier}>
              Cashier
            </Link>
          </A>
          {/* <A >
            <Link active={merchants}>
              <FormattedMessage {...messages.menu3} />
            </Link>
          </A>
          <A >
            <Link active={users}>
              <FormattedMessage {...messages.bmenu3} />
            </Link>
          </A> */}
          <A >
            <Link active={reports}>
              <FormattedMessage {...messages.menu4} />
            </Link>
          </A>
        </NavTag>
      </React.Fragment>
    );
  }
}

export default BranchNav;
