import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import axios from 'axios';
import Card from 'components/Card';
import Popup from 'components/Popup';
import TextInput from 'components/TextInput';
import TextArea from 'components/TextArea';
import FormGroup from 'components/FormGroup';
import Button from 'components/Button';
import A from 'components/A';
import Row from 'components/Row';
import Col from 'components/Col';


import { API_URL, STATIC_URL, CURRENCY } from 'containers/App/constants';

import 'react-toastify/dist/ReactToastify.css';
toast.configure({
  position: 'bottom-right',
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
});
const token = localStorage.getItem('branchLogged');
const limit = localStorage.getItem('branchLimit');

class BranchCreditLimit extends Component {
  constructor() {
    super();
    this.state = {
      bank: '',
      popup: false,
      from: '',
      to: '',
      amount: '',
      notification: '',
      balance: 0,
      note: '',
      token,
    };

    this.success = this.success.bind(this);
    this.error = this.error.bind(this);
    this.warn = this.warn.bind(this);
  }

  success = () => toast.success(this.state.notification);

  error = () => toast.error(this.state.notification);

  warn = () => toast.warn(this.state.notification);

  getBalance = () => {
    const headers = {
      'Authorization': token
    }
    axios
      .post(
        `${API_URL}/partnerBranch/getWalletBalance?partner=${this.props.bankName}&token=${token}&page=operational&wallet_id=`,
      )
      .then(res => {
        if (res.status == 200) {
          if (res.data.error) {
            throw res.data.error;
          } else {
            this.setState(
              {
                balance: res.data.balance,
              },
              () => {
                var dis = this;
                setTimeout(function() {
                  dis.getBalance();
                }, 3000);
              },
            );
          }
        }
      })
      .catch(err => {});
  };

  componentDidMount() {
    this.setState(
      {
        bank: this.props.historyLink,
      },
      () => {
        this.getBalance();
      },
    );
  }

  render() {
    function inputFocus(e) {
      const { target } = e;
      target.parentElement.querySelector('label').classList.add('focused');
    }

    function inputBlur(e) {
      const { target } = e;
      if (target.value == '') {
        target.parentElement.querySelector('label').classList.remove('focused');
      }
    }
    return (
      <Card marginBottom="54px" buttonMarginTop="32px" bigPadding smallValue>
        <h3>
          Credit Limit
        </h3>
        <Row>
        <Col><h3 className="miniTitle">Maximum</h3><div className="cardValue">
          {CURRENCY} {limit}
        </div></Col>
        <Col><h3 className="miniTitle">Remaining</h3><div className="cardValue">
          {CURRENCY} {this.state.balance > 0 ? limit : limit+this.state.balance  }
        </div></Col>
        </Row>

        {this.state.popup ? (
          <Popup close={this.closePopup.bind(this)} roundedCorner>
            <h1 className="normalH1">Transfer the amount</h1>
            <form action="" method="post" onSubmit={this.submitMoney}>
              <FormGroup>
                <label>From*</label>
                <TextInput
                  readOnly
                  id="popfrom"
                  type="text"
                  name="from"
                  onFocus={inputFocus}
                  onBlur={inputBlur}
                  value={this.state.from}
                  onChange={this.handleInputChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <label>To*</label>
                <TextInput
                  readOnly
                  id="popto"
                  type="text"
                  name="to"
                  onFocus={inputFocus}
                  onBlur={inputBlur}
                  value={this.state.to}
                  onChange={this.handleInputChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <label>Amount*</label>
                <TextInput
                  type="text"
                  name="amount"
                  onFocus={inputFocus}
                  onBlur={inputBlur}
                  value={this.state.amount}
                  onChange={this.handleInputChange}
                  required
                />
              </FormGroup>
              <p className="note">
                Total available {CURRENCY} {this.state.balance}
              </p>
              <FormGroup>
                <label>Note*</label>
                <TextArea
                  type="text"
                  name="note"
                  onFocus={inputFocus}
                  onBlur={inputBlur}
                  value={this.state.note}
                  onChange={this.handleInputChange}
                  required
                />
              </FormGroup>
              <p className="note">
                * I have read the <a>Terms and Conditions</a>
              </p>


              <Button filledBtn marginTop="50px">
                <span>Proceed</span>
              </Button>
              {/* <p className="note">Total Fee {CURRENCY}200 will be charges</p> */}
            </form>
          </Popup>
        ) : null}
      </Card>
    );
  }
}

export default BranchCreditLimit;
