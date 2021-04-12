import React, { Component } from 'react';
import { API_URL, STATIC_URL, CURRENCY } from 'containers/App/constants';
import { FormattedMessage } from 'react-intl';
import { toast } from 'react-toastify';
import messages from './messages';
import axios from 'axios';
import A from 'components/A';
import Button from 'components/Button';
import Row from 'components/Row';
import Col from 'components/Col';
import SendToOperationalPopup from './SendToOperationalPopup';
import history from 'utils/history.js';
import Card from 'components/Card';
import 'react-toastify/dist/ReactToastify.css';
toast.configure({
  position: 'bottom-right',
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
});

const token = localStorage.getItem('partnerLogged');

class BankMasterWallet extends Component {
  constructor() {
    super();
    this.state = {
      popup: false,
      balance:0,
    };

    this.success = this.success.bind(this);
    this.error = this.error.bind(this);
    this.warn = this.warn.bind(this);
  };

  success = () => toast.success(this.state.notification);

  error = () => toast.error(this.state.notification);

  warn = () => toast.warn(this.state.notification);

  handlePopupOpen = () => {
    this.setState({
      popup: true,
    });
  };

  handlePopupClose = () => {
    this.setState({
      popup: false,
    });
  };

  getBalance = () => {
    axios
      .post(
        `${API_URL}/partner/getWalletBalance?token=${token}&page=master&wallet_id=`,
      )
      .then(res => {
        console.log(res);
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
      .catch(err => {
  
      });
  };

  componentDidMount() {
    this.getBalance();
  };

  render() {
    return (
      <Card buttonMarginTop="32px" bigPadding>
        <h3>
          <FormattedMessage {...messages.master} />
        </h3>
        <div className="cardValue">{CURRENCY} {this.state.balance? this.state.balance.toFixed(2):0}</div>
        <Row>
          <Col style={{ width: '100%', marginTop: '5px' }} cw="100%">
            <Button
              dashBtn
              onClick={this.handlePopupOpen}
            >
              Transfer from Master to Operational
            </Button>
          </Col>
        </Row>
        <Row>
          <Col style={{ width: '100%', marginTop: '5px' }} cw="100%">
              <Button
                smallDashBtn
                onClick={()=>{history.push('/partner/masterHistory')}}
              >
                  History
              </Button>
          </Col>
        </Row>
       
        
        {this.state.popup ? (
          <SendToOperationalPopup
            close={this.handlePopupClose}
            token={token}
            type='partner'
          />
        ) : null}
      </Card>
    );
  }
}

export default BankMasterWallet;