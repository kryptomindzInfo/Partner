import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import axios from 'axios';
import Card from 'components/Card';
import Row from 'components/Row';
import Col from 'components/Col';
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

getBalance = () => {
console.log(this.props);
      axios
      .get(
        `${API_URL}/getWalletBalance?wallet_id=${this.props.bCode}_operational@${this.props.bankName}`,
      )
      .then(res => {
        if (res.status == 200) {
          if (res.data.error) {
            throw res.data.error;
          } else {
            this.setState({
              balance: res.data.balance,
            }, () => {
              var dis =this;
              setTimeout(function(){
                dis.getBalance();
              }, 3000);
            });

          }
        }
      })
      .catch(err => {});
  };

  componentDidMount() {
        this.getBalance();
  };

  render() {

    return (
      <Row>
      <Col>
      <Card marginBottom="54px" buttonMarginTop="32px" bigPadding bordered>
        <h3>
          <FormattedMessage {...messages.operational} />
        </h3>
        <h5>
          <FormattedMessage {...messages.available} />
        </h5>
        <div className="cardValue">
          {CURRENCY} {this.state.balance.toFixed(2)}
        </div>
        {
          this.props.historyLink ?
          <A href={this.props.historyLink} float="right">
          <span className="history">History</span>
        </A>
          :
          null
        }
        
      </Card>
      </Col>
      <Col>
      <Card marginBottom="54px" buttonMarginTop="32px" bigPadding bordered>
        <h3>
          Master Wallet
        </h3>
        <h5>
          <FormattedMessage {...messages.available} />
        </h5>
        <div className="cardValue">
          {CURRENCY} 0
        </div>
        {/*<A href={'/operationalHistory/' + this.props.historyLink} float="right">
          <span className="history">History</span>
        </A>*/}
      </Card>
      </Col>
      <Col>
      <Card marginBottom="54px" buttonMarginTop="32px" bigPadding  bordered>
        <h3>
          Credit Limit
        </h3>
        <Row>
        <Col><h5>
          <FormattedMessage {...messages.available} />
        </h5>
        <div className="cardValue">
          {CURRENCY} 0
        </div></Col>
        <Col><h5>
          Total
        </h5>
        <div className="cardValue">
          {CURRENCY} 0
        </div></Col>
        </Row>

        <A href={'/operationalHistory/' + this.props.historyLink} float="right">&nbsp;</A>
      </Card>
      </Col>
      </Row>

    );
  }
}

export default BranchWallets
