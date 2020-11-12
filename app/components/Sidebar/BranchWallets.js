import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import axios from 'axios';
import Card from 'components/Card';
import Row from 'components/Row';
import Col from 'components/Col';
import BranchOperationalWallet from './BranchOperationalWallet';
import BranchMasterWallet from './BranchMasterWallet';
import BranchCreditLimit from './BranchCreditLimit';
import Popup from 'components/Popup';
import TextInput from 'components/TextInput';
import TextArea from 'components/TextArea';
import FormGroup from 'components/FormGroup';
import Button from 'components/Button';
import A from 'components/A';
import { API_URL, STATIC_URL, CURRENCY } from 'containers/App/constants';


class BranchWallets extends Component {
  constructor() {
    super();
        this.state = {
        balance: 0,
        withoutID: false,
        requireOTP: false,
        livefee : 0,
        showSendMoneyOTP: false
    }

  }

  componentDidMount() {
  };

  render() {

    return (
      <Row>
        <Col>
          <Card marginBottom="54px" buttonMarginTop="32px" bigPadding bordered>
            <BranchOperationalWallet bankName={this.props.bankName}/>
          </Card>
        </Col>
      <Col>
        <Card marginBottom="54px" buttonMarginTop="32px" bigPadding bordered>
          <BranchMasterWallet bankName={this.props.bankName}/>
        </Card>
      </Col>
      <Col>
        <Card marginBottom="54px" buttonMarginTop="32px" bigPadding  bordered>
          <BranchCreditLimit bankName={this.props.bankName}/>
        </Card>
      </Col>
      </Row>

    );
  }
}

export default BranchWallets
