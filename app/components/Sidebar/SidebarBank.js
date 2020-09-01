import React, { Component } from "react";
import BankOperationalWallet from './BankOperationalWallet';
import BankMasterWallet from './BankMasterWallet';
import EscrowWallet from './EscrowWallet';
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
            <BankOperationalWallet activateNeeded />
            {/* <EscrowWallet activateNeeded />
            <BankMasterWallet /> */}
        </Sidebar>
    );
  }
}
 
export default SidebarBank;