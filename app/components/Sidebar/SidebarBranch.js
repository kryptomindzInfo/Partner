import React, { Component } from "react";
import BranchOperationalWallet from './BranchOperationalWallet';
import BranchMasterWallet from './BranchMasterWallet';
import BranchCreditLimit from './BranchCreditLimit';
import styled from 'styled-components';

const Sidebar = styled.aside `
width: 260px;
float:left;
margin-right: ${props => props.marginRight ? '33px' : '0' };
`;

class SidebarBank extends Component {
  render() {
    return (
        <Sidebar marginRight>
            <BranchOperationalWallet bankName={this.props.bankName}/>
            <BranchMasterWallet bankName={this.props.bankName}/>
            {/* <BranchCreditLimit bankName={this.props.bankName}/> */}
        </Sidebar>
    );
  }
}

export default SidebarBank;
