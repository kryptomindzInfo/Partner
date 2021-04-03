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

class CashierNav extends Component {
  render() {
    const dashboard = this.props.active == 'dashboard' ? 'true' : '';
    const cashier = this.props.active == 'cashier' ? 'true' : '';
    const merchants = this.props.active == 'merchants' ? 'true' : '';
    const users = this.props.active == 'users' ? 'true' : '';
    const reports = this.props.active == 'reports' ? 'true' : '';
    const bills = this.props.active == 'bills' ? 'true' : '';
    const { bankName } = this.props;
    return (
      <React.Fragment>
        <NavTag>
          <A href={`/cashier/${bankName}/dashboard`}>
            <Link
              active={dashboard}
              // style={`${props => props.theme.secondary}`}
            >
              <FormattedMessage {...messages.menu1} />
            </Link>
          </A>
          {/* <A >
            <Link active={merchants}>
              <FormattedMessage {...messages.menu3} />
            </Link>
          </A> */}
          {/* <A href={`/cashier/${bankName}/pay-bills`}>
            <Link active={bills}>
              <span> Pay Bills </span>
            </Link>
          </A> */}
          <A href={`/cashier/${bankName}/reports`}>
            <Link active={reports}>
              <FormattedMessage {...messages.menu4} />
            </Link>
          </A>
        </NavTag>
      </React.Fragment>
    );
  }
}

export default CashierNav;
