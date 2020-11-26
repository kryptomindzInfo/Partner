import React, { useState } from 'react';
import Popup from 'components/Popup';
import Loader from 'components/Loader';
import Button from 'components/Button';
import axios from 'axios';
import Row from 'components/Row';
import Col from 'components/Col';
import FormGroup from 'components/FormGroup';
import TextInput from 'components/TextInput';
import { toast } from 'react-toastify';
import { API_URL} from 'containers/App/constants';
import OtpPopup from './OtpPopup';

toast.configure({
  position: 'bottom-right',
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
});

function SendMoneyToOperationalPopup(props) {
  const [amount, setAmount] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [showOtp, setShowOtp] = React.useState(false);

  const haldleOtpClick = () => {
    setShowOtp(true);
  };

  const inputFocus = (e) => {
    const { target } = e;
    target.parentElement.querySelector('label').classList.add('focused');
  };

  const inputBlur = (e) => {
    const { target } = e;
    if (target.value == '') {
      target.parentElement.querySelector('label').classList.remove('focused');
    }
  };

  const handleInputChange = (e) => {
    setAmount(e.target.value);
  };

  const sendMoney = async(values) => {
    setLoading(true);
    try{
      const res = await axios.post(`${API_URL}/${props.type}/transferMasterToOp`, {
        amount: values,
        token: props.token,
      });
      if (res.status === 200) {
        if (res.data.status === 0) {
          toast.error(res.data.message);
          props.close();
        } else {
          toast.success(res.data.message);
          props.close();
        }
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error('Something went wrong');
    }
  };

  return (
    <Popup close={props.close}>
      {showOtp ? (
        <OtpPopup
          values={amount}
          execute={sendMoney}
          close={props.close}
        />
      ) : (
      <div>
        <h1> Send Money To Operational Wallet</h1>
        <form
          action=""
          method="post"
          onSubmit={haldleOtpClick}
        >
          <p>&nbsp;</p>
          <Row>
            <Col cW="10%">
              <h4>XOF</h4>
            </Col>
            <Col cW="90%">
              <FormGroup>
                <label>Amount*</label>
                <TextInput
                type="text"
                name="amount"
                onFocus={inputFocus}
                onBlur={inputBlur}
                onChange={handleInputChange}
                required
                />
                </FormGroup>
            </Col>
          </Row>
          {loading ? (
            <Button
              filledBtn
              marginTop="50px"
              marginBottom="50px"
              disabled
            >
              <Loader />
            </Button>
          ) : (
            <Button filledBtn marginTop="50px" marginBottom="50px">
              <span>Send Money</span>
            </Button>
          )}
        </form>
      </div>
      )}
    </Popup>
  );
}

export default SendMoneyToOperationalPopup;