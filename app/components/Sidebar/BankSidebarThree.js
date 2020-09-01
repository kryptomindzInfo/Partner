import React, { Component } from "react";
import Card from '../Card';
import styled from 'styled-components';
import A from 'components/A';
const Sidebar = styled.aside `
width: 260px;
float:left;
margin-right: ${props => props.marginRight ? '33px' : '0' };
.anchor{
  display:block;
}
`;

const H3 = styled.h3 `
font-size: 11px;
  font-weight: bold;
  color: #323c47;
`;

const H1 = styled.h1 `
font-size: 28px;
font-weight: normal;
font-stretch: normal;
font-style: normal;
line-height: normal;
letter-spacing: normal;
color: #417505;
text-align: center;
`;

class BankSidebarThree extends Component {
  editSignal = event => {
      this.props.edit();
  };
  blockSignal = event => {
      this.props.block();
  };
  render() {
    const cashier = this.props.active == 'cashier' ? true : false;
    const info = this.props.active == 'info' ? true : false;
    const reports = this.props.active == 'reports' ? true : false;
    const edit = this.props.active == 'edit' ? true : false;
    const block = this.props.active == 'block' ? true : false;
    const bt = this.props.blockTxt == 1 ? 'Block' : 'Unblock';
    return (
        <Sidebar marginRight>
            
            <A href={"/partner/branch/"+this.props.branchId}>
            <Card rounded selected={info} className="sideNav">
                <i className="material-icons">person_add</i>
                <h3>Branch Info</h3>
            </Card >
            </A>
            <A href={"/partner/cashiers/"+this.props.branchId}>
            <Card rounded selected={cashier} className="sideNav">
            <i className="material-icons">folder</i>
                <h3>Cashier</h3>
            </Card>
            </A>
            <A href="/reports/">
            <Card rounded selected={reports} className="sideNav">
            <i className="material-icons">insert_chart_outlined</i>
                <h3>Reports</h3>
            </Card>
            </A>

            <Card rounded selected={edit} className="sideNav" onClick={this.editSignal}>
                <i className="material-icons">edit</i>
                <h3>Edit</h3>
            </Card>

            <Card rounded selected={block} className="sideNav" onClick={this.blockSignal}>
                <i className="material-icons">block</i>
                <h3>{bt}</h3>
            </Card>

        </Sidebar>
    );
  }
}

export default BankSidebarThree;
