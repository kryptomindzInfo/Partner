import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { FormattedMessage } from 'react-intl';
import axios from 'axios';
import Card from 'components/Card';
import Popup from 'components/Popup';
import TextInput from 'components/TextInput';
import Label from 'components/Label';
import FormGroup from 'components/FormGroup';
import Button from 'components/Button';
import CountrySelectBox from 'components/Form/CountrySelectBox';
import Row from 'components/Row';
import Col from 'components/Col';
import Container from 'components/Container';
import UploadArea from 'components/UploadArea';
import Loader from 'components/Loader';
import MuiCheckbox from '@material-ui/core/Checkbox';
import CashierToOperationalForm from './CashiertoOperationalForm';

import { API_URL, CONTRACT_URL, CURRENCY, STATIC_URL } from 'containers/App/constants';

import 'react-toastify/dist/ReactToastify.css';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import Blur from '../Blur';
import CashierToWalletForm from './CashierToWalletForm';
import CashierPopupToggle from './CashierPopupToggle';
import messages from './messages';
import TypeSelectBox from '../Form/TypeSelectBox';
import getCountryDialCode from '../../utils/CountryUtil';

toast.configure({
  position: 'bottom-right',
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
});

const token = localStorage.getItem('cashierLogged');
const email = localStorage.getItem('cashierEmail');
const mobile = localStorage.getItem('cashierMobile');
const date = new Date();

class CashierTransactionLimit extends Component {
  constructor() {
    super();
    this.state = {
      balance: 0,
      closingTime: null,
      withoutID: false,
      requireOTP: false,
      sendtooperationalpopup: false,
      token,
      proceed: false,
      livefee: 0,
      receiverIdentificationAmount: '',
      receiverIdentificationCountry: 'Senegal',
      senderIdentificationCountry: 'Senegal',
      country: 'Senegal',
      receiverCountry: 'Senegal',
      showSendMoneyOTP: false,
      isWallet: false,
      toWalletFormValues: {},
      isValidFee: true,
      isInclusive: false,
      interbank: true,
      interbankclaim: true,
    };
    this.success = this.success.bind(this);
    this.error = this.error.bind(this);
    this.warn = this.warn.bind(this);

    this.onChange = this.onChange.bind(this);
    this.fileUpload = this.fileUpload.bind(this);
  }

  success = () => toast.success(this.state.notification);

  error = () => toast.error(this.state.notification);

  warn = () => toast.warn(this.state.notification);

  openOperationalPopup = () => {
    this.setState({
      sendtooperationalpopup: true,
    });
  };

  closeOperationalPopup = () => {
    this.setState({
      sendtooperationalpopup: false,
    });
  };

  handleInputChange = event => {
    const { value, name } = event.target;
    this.setState({
      [name]: value,
    });
  };

  proceed = items => {
    const dis = this;
    for (const key in items) {
      if (items.hasOwnProperty(key)) {
        this.setState({
          [key]: items[key],
        });
      }
    }

    this.setState({
      proceed: true,
      popupSendMoney: true,
    });
  };

  removeFile = key => {
    this.setState({
      [key]: null,
    });
  };

  triggerBrowse = inp => {
    const input = document.getElementById(inp);
    input.click();
  };

  onChange(e) {
    if (e.target.files && e.target.files[0] != null) {
      this.fileUpload(e.target.files[0], e.target.getAttribute('data-key'));
    }
  }

  fileUpload(file, key) {
    const formData = new FormData();
    //  formData.append('token',token);
    formData.append('file', file);
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    };
    let method = 'fileUpload';

    if (key == 'proof') {
      method = 'ipfsUpload';
    }

    axios
      .post(`${API_URL}/${method}?token=${token}`, formData, config)
      .then(res => {
        if (res.status == 200) {
          if (res.data.error) {
            throw res.data.error;
          } else {
            this.setState({
              [key]: res.data.hash,
            });
          }
        } else {
          throw res.data.error;
        }
      })
      .catch(err => {
        this.setState({
          notification: err.response ? err.response.data.error : err.toString(),
        });
        this.error();
      });
  }

  closePopup = () => {
    this.setState({
      popup: false,
    });
  };

  showPopupSendMoney = () => {
    if (this.state.balance > 0) {
      this.setState(
        { popupSendMoney: true, proceed: false, isWallet: false },
        () => this.getLiveFee(45, this.state.isWallet),
      );
    } else {
      this.setState(
        {
          notification: 'You have already used your limit for today',
        },
        () => {
          this.error();
        },
      );
    }
  };

  setToWalletFormValues = values => {
    this.setState({
      toWalletFormValues: values,
      isWallet: false,
      showSendMoneyToWalletOTP: true,
      popupSendMoney: true,
    });
  };

  showClaimMoneyPopup = () => {
    // if (this.state.cashInHand >= this.state.receiverIdentificationAmount) {
    this.setState({ popupClaimMoney: true });
    // } else {
    //   this.setState(
    //     {
    //       notification: 'You do not have enough cash in hand to claim this amount',
    //     },
    //     () => {
    //       this.error();
    //     },
    //   );
    // }
  };

  toggleIdentificationBlock = () => {
    if (!this.state.withoutID) {
      this.setState({
        withoutID: true,
      });
    } else {
      this.setState({
        withoutID: false,
      });
    }
  };

  checkboxChange = () => {
    if (!this.state.requireOTP) {
      this.setState({
        requireOTP: true,
      });
    } else {
      this.setState({
        requireOTP: false,
      });
    }
  };

  showEditPopupSendMoney = v => {
    this.setState({
      editPopup: true,
      name: v.name,
      bcode: v.bcode,
      address1: v.address1,
      state: v.state,
      zip: v.zip,
      country: v.country,
      ccode: v.ccode,
      mobile: v.mobile,
      email: v.email,
      logo: v.logo,
      proof: v.proof,
      username: v.username,
      bank_id: v._id,
      receiverMobile: v.receiverMobile,
      receiverccode: v.receiverccode,
      receiverGivenName: v.receiverGivenName,
      receiverFamilyName: v.receiverFamilyName,
      receiverCountry: v.receiverCountry,
      receiverEmail: v.receiverEmail,
    });
  };

  closePopupSendMoney = () => {
    this.setState({
      proceed: false,
      showSendMoneyOTP: false,
      showConfirmPending: false,
      showClaimMoneyDetails: false,
      popupClaimMoney: false,
      showVerifyClaimMoney: false,
      showVerifyClaimOTPMoney: false,
      transferCode: '',
      givenname: '',
      familyname: '',
      note: '',
      senderIdentificationCountry: '',
      senderIdentificationType: '',
      senderIdentificationNumber: '',
      senderIdentificationValidTill: '',
      address1: '',
      state: '',
      zip: '',
      ccode: '',
      country: '',
      email: '',
      mobile: '',
      otp: '',
      withoutID: false,
      requireOTP: false,
      receiverMobile: '',
      receiverccode: '',
      receiverGivenName: '',
      receiverFamilyName: '',
      receiverCountry: '',
      receiverEmail: '',
      receiverIdentificationCountry: '',
      receiverIdentificationType: '',
      receiverIdentificationNumber: '',
      receiverIdentificationValidTill: '',
      receiverIdentificationAmount: '',
      isWallet: false,
      interbank: true,
      livefee: 0,
      interbankclaim: true,
      showSendMoneyToWalletOTP: false,
      verifySendMoneyOTPLoading: false,
      popupSendMoney: false,
    });
  };

  closePopupClaimMoney = () => {
    this.setState({
      popupClaimMoney: false,
    });
  };

  countryChange = event => {
    const { value, name } = event.target;
    const { title } = event.target.options[event.target.selectedIndex];
    const ccode = event.target.getAttribute('data-change');
    this.setState({
      [name]: value,
      [ccode]: title,
    });
  };

  typeChange = event => {
    const { value, name } = event.target;
    this.setState({
      [name]: value,
    });
  };

  startTimer = () => {
    const dis = this;
    var timer = setInterval(function() {
      if (dis.state.timer <= 0) {
        clearInterval(timer);
        dis.setState({ resend: true });
      } else {
        const time = Number(dis.state.timer) - 1;
        dis.setState({ timer: time });
      }
    }, 1000);
  };

  handleDateChange = (date, field) => {
    const formattedDate = new Date(date).toLocaleDateString();
    this.setState({
      [field]: formattedDate,
    });
  };

  generateOTP = () => {
    this.setState({ resend: false, timer: 30 });
    axios
      .post(`${API_URL}/partnerCashier/sendOTP`, {
        email: this.state.otpEmail,
        mobile: this.state.otpMobile,
        page: this.state.otpOpt,
        type: 'cashier',
        txt: this.state.otpTxt,
        token,
      })
      .then(res => {
        if (res.status == 200) {
          if (res.data.error) {
            throw res.data.error;
          } else {
            this.setState({
              otpId: res.data.id,
              showEditOtp: true,
              notification: 'OTP Sent',
            });
            this.startTimer();
            this.success();
          }
        } else {
          throw res.data.error;
        }
      })
      .catch(err => {
        this.setState({
          notification: err.response ? err.response.data.error : err.toString(),
        });
        this.error();
      });
  };

  amountChange = event => {
    if (this.state.receiverIdentificationAmount != '') {
      axios
      .post(
        this.state.interbank
          ? `${API_URL}/partnerCashier/interBank/checkFee`
          : `${API_URL}/partnerCashier/checkFee`,
        {
          amount: this.state.receiverIdentificationAmount,
          type: "IBNWNW",
          trans_type: "Non Wallet to Non Wallet",
          token,
        })
        .then(res => {
          if (res.status == 200) {
            if (res.data.status==0) {
              this.setState(
                {
                  isValidFee: false,
                },
                function() {},
              );
            } else {
              this.setState(
                {
                  livefee: parseFloat(res.data.fee),
                },
                function() {},
              );
            }
          }
        });
    } else {
      this.setState({
        livefee: 0,
      });
    }
  };

  getClaimMoney = event => {
    event.preventDefault();
    this.setState({
      claimMoneyLoading: true,
    });
    axios
      .post(`${API_URL}/partnerCashier/getClaimMoney`, {
        transferCode: this.state.transferCode,
        token,
      })
      .then(res => {
        if (res.status == 200) {
          if (res.data.status === 0) {
            throw res.data.message;
          } else {
            const o = res.data.row;
            if (o.sender_id) {
              const senderid = JSON.parse(o.sender_id);
              this.setState({
                sender_id: senderid,
                senderIdentificationCountry: senderid.country || '',
                senderIdentificationType: senderid.type || '',
                senderIdentificationNumber: senderid.number || '',
                senderIdentificationValidTill: senderid.valid || '',
              });
            }
            const sender = JSON.parse(o.sender_info);
            const receiver = JSON.parse(o.receiver_info);
            const receiverid = JSON.parse(o.receiver_id);

            o.without_id = o.without_id == 1;
            o.require_otp = o.require_otp == 1;
            this.setState({
              mobile: sender.mobile,
              email: sender.email,
              givenname: sender.givenname,
              familyname: sender.familyname,
              address1: sender.address1,
              state: sender.state,
              zip: sender.zip,
              country: sender.country,
              note: sender.note,

              receiverMobile: receiver.mobile,
              receiverEmail: receiver.email,
              receiverGivenName: receiver.givenname,
              receiverFamilyName: receiver.familyname,
              receiverCountry: receiver.country,

              receiverIdentificationCountry: receiverid.country,
              receiverIdentificationType: receiverid.type,
              receiverIdentificationNumber: receiverid.number,
              receiverIdentificationValidTill: receiverid.valid,

              receiverIdentificationAmount: o.amount,
              withoutID: o.without_id,
              requireOTP: o.require_otp,
              dateClaimMoney: new Date(o.created_at).toDateString(),
              master_code: o.master_code,
              interbankclaim: o.is_inter_bank === 0 ? false : true,
              showClaimMoneyDetails: true,
            });
          }
        } else {
          const { error } = res.data;
        }
        this.setState({
          claimMoneyLoading: false,
        });
      })
      .catch(err => {
        this.setState({
          notification: err.response
            ? err.response.data.error.toString()
            : err.toString(),
          verifySendMoneyOTPLoading: false,
        });
        this.error();
        this.setState({
          claimMoneyLoading: false,
        });
      });
  };

  cancelPending = event => {
    event.preventDefault();
    this.setState({
      showConfirmPending: false,
    });
  };

  confirmPending = event => {
    event.preventDefault();
    this.setState({
      verifySendMoneyOTPLoading: true,
    });
    axios
      .post(`${API_URL}/partnerCashier/sendMoneyPending`, this.state)
      .then(res => {
        if (res.status == 200) {
          if (res.data.error) {
            throw res.data.error;
          } else {
            this.setState({
              notification: 'Transaction Successfully Submitted for Aproval',
            });
            this.success();
            this.closePopupSendMoney();
            this.props.refresh();
          }
        } else {
          throw res.data.error;
        }
        this.setState({
          verifySendMoneyOTPLoading: false,
        });
      })
      .catch(err => {
        this.setState(
          {
            notification: err.response
              ? err.response.data.error.toString()
              : err.toString(),
            verifySendMoneyOTPLoading: false,
          },
          () => {
            this.error();
          },
        );
      });
  };

  sendMoney = event => {
    event.preventDefault();
    if (
      !this.state.proceed &&
      this.state.receiverIdentificationAmount > this.state.balance
    ) {
      // this.setState({
      //   notification: 'Amount has to be lesser than transaction limit',
      // });
      // this.error();
      this.setState({
        showConfirmPending: true,
      });
    } else {
      this.setState(
        {
          showSendMoneyOTP: true,
          otpOpt: 'cashierSendMoney',
          otpEmail: email,
          otpMobile: mobile,
          otpTxt: 'Your OTP to add send money is ',
        },
        () => {
          this.generateOTP();
        },
      );
    }
  };

  claimMoney = event => {
    event.preventDefault();
    if (this.state.cashInHand >= this.state.receiverIdentificationAmount) {
      this.setState(
        {
          showVerifyClaimMoney: true,
          otpOpt: 'cashierClaimMoney',
          otpEmail: email,
          otpMobile: mobile,
          otpTxt: 'Your OTP to add claim money is ',
        },
        () => {
          this.generateOTP();
        },
      );
    } else {
      this.setState(
        {
          notification:
            'You do not have enough cash in hand to claim this amount',
        },
        () => {
          this.error();
        },
      );
    }
  };

  verifyClaimMoney = event => {
    event.preventDefault();
    this.setState({
      claimMoneyLoading: true,
    });
    axios
      .post(`${API_URL}/partnerCashier/verifyClaim`, {
        token,
        otp: this.state.otp,
        otpId: this.state.otpId,
      })
      .then(res => {
        console.log(res);
        if (res.status == 200) {
          if (res.data.error) {
            throw res.data.error;
          } else if (this.state.requireOTP) {
            this.setState({
              showOTPClaimMoney: true,
              otp: '',
              notification: 'OTP verified successfully',
            });
            this.success();
            this.startClaiming();
          } else {
            this.startClaiming();
          }
        } else {
          const error = new Error(res.data.error);
          throw error;
        }
      })
      .catch(err => {
        this.setState({
          notification: err.response ? err.response.data.error : err.toString(),
        });
        this.error();
      });
  };

  verifyOTPClaimMoney = event => {
    event.preventDefault();
    this.setState({
      claimMoneyLoading: true,
    });
    axios
      .post(`${API_URL}/cashierVerifyOTPClaim`, {
        token,
        otp: this.state.otp,
        transferCode: this.state.transferCode,
      })
      .then(res => {
        if (res.status == 200) {
          if (res.data.error) {
            throw res.data.error;
          } else {
            this.setState({
              notification: 'OTP verified successfully',
            });
            this.success();
            this.startClaiming();
          }
        } else {
          const error = new Error(res.data.error);
          throw error;
        }
      })
      .catch(err => {
        this.setState({
          notification: err.response ? err.response.data.error : err.toString(),
        });
        this.error();
      });
  };

  startClaiming = event => {
    this.setState({
      claimMoneyLoading: true,
    });
    let API = "";
    if (this.state.interbankclaim){
      API = 'partnerCashier/interBank/claimMoney';
    } else {
      API = 'partnerCashier/claimMoney';
    }
    axios
      .post(`${API_URL}/${API}`, this.state)
      .then(res => {
        console.log(res);
        if (res.status == 200) {
          if (res.data.error) {
            throw res.data.error;
          } else {
            this.setState({
              notification: 'Transaction Successfully Done',
              showVerifyClaimMoney: false,
              popupClaimMoney: false,
              showClaimMoneyDetails: false,
              transferCode: '',
            });
            this.success();
            this.props.refresh();
          }
        } else {
          this.closePopupSendMoney();
          this.props.refresh();
          throw res.data.error;
        }
        this.setState({
          claimMoneyLoading: false,
        });
      })
      .catch(err => {
        this.closePopupSendMoney();
        this.props.refresh();
        this.setState(
          {
            notification: err.response
              ? err.response.data.error.toString()
              : err.toString(),
            claimMoneyLoading: false,
          },
          () => {
            this.error();
          },
        );
      });
  };

  verifySendMoney = async event => {
    event.preventDefault();
    this.setState({
      verifySendMoneyOTPLoading: true,
    });
    let API = '';
    if (this.state.interbank){
      API = 'partnerCashier/interBank/sendMoneyToNonWallet'
    } else {
      API = 'partnerCashier/sendMoney'
    }
    axios
      .post(`${API_URL}/${API}`, this.state)
      .then(res => {
        if (res.status == 200) {
          if (res.data.error) {
            throw res.data.error;
          } else {
            this.setState({
              notification: 'Transaction Successfully Done',
            });
            this.success();
            this.closePopupSendMoney();
            this.props.refresh();
          }
        } else {
          throw res.data.error;
        }
        this.setState({
          verifySendMoneyOTPLoading: false,
        });
      })
      .catch(err => {
        this.setState(
          {
            notification: err.response
              ? err.response.data.error.toString()
              : err.toString(),
            verifySendMoneyOTPLoading: false,
          },
          () => {
            this.error();
          },
        );
      });
  };

  verifySendMoneyToWallet = event => {
    event.preventDefault();
    const { toWalletFormValues } = this.state;
    this.setState({
      verifySendMoneyOTPLoading: true,
    });
    toWalletFormValues.token = token;
    let API = '';
    if(toWalletFormValues.interbank){
      API = 'partnerCashier/interBank/sendMoneyToWallet'
    } else {
      API = 'partnerCashier/sendMoneyToWallet';
    }
    axios
      .post(`${API_URL}/${API}`, toWalletFormValues)
      .then(res => {
        if (res.status === 200) {
          if (res.data.error) {
            throw res.data.error;
          } else {
            this.setState({
              notification: 'Transaction Successfully Done',
            });
            this.success();
            this.closePopupSendMoney();
            this.props.refresh();
          }
        } else {
          throw res.data.error;
        }
        this.setState({
          verifySendMoneyOTPLoading: false,
        });
      })
      .catch(err => {
        this.setState(
          {
            notification: err.response
              ? err.response.data.error.toString()
              : err.toString(),
            verifySendMoneyOTPLoading: false,
          },
          () => {
            this.error();
          },
        );
      });
  };

  getTransLimit = () => {
    axios
      .post(`${API_URL}/partnerCashier/getCashierTransLimit`, { token })
      .then(res => {
        if (res.status == 200) {
          if (res.data.error) {
            throw res.data.error;
          } else {
            this.setState(
              {
                balance: Number(res.data.limit),
                closingTime: res.data.closingTime,
                cashInHand: res.data.cashInHand,
                transactionStarted: res.data.transactionStarted,
                isClosed: res.data.isClosed,
              },
              () => {
                const dis = this;
                setTimeout(function() {
                  dis.getTransLimit();
                }, 3000);
              },
            );
          }
        } else {
          this.setState(
            {
              balance: Number(res.data.limit),
              closingTime: res.data.closingTime,
              transactionStarted: res.data.transactionStarted,
              isClosed: res.data.isClosed,
            },
            () => {
              const dis = this;
              setTimeout(function() {
                dis.getTransLimit();
              }, 3000);
            },
          );
        }
      })
      .catch(err => {
        const dis = this;
        setTimeout(function() {
          dis.getTransLimit();
        }, 3000);
      });
  };

  componentDidMount() {
    this.getTransLimit();
  }

  getLiveFee = (amount, isWallet) => {
    this.setState({
      isValidFee: true,
    });
    if (amount !== '') {
      axios
        .post(`${API_URL}/partnerCashier/checkFee`,
          {
            token,
            amount,
            trans_type: `${isWallet ? 'Non Wallet to Non Wallet' : 'Non Wallet to Wallet'}`,
          },
        )
        .then(res => {
          if (res.status === 200) {
            if (res.data.error) {
              this.setState({
                notification: res.data.error,
                isValidFee: false,
              });
              this.error();
            } else {
              this.setState({
                isValidFee: true,
              });
            }
          }
        })
        .catch(err => {
          this.setState({
            notification: err.response.data.error,
            isValidFee: false,
          });
          this.error();
        });
    }
  };

  handleToggleChange = value => {
    this.setState(
      {
        isWallet: value,
      },
      this.getLiveFee(45, value),
    );
  };

  handleFeeTypeChange = event => {
    this.setState({ [event.target.name]: !event.target.checked }, ()=>this.amountChange());
  };

  handleBankingTypeChange = event => {
    this.setState({ [event.target.name]: event.target.checked }, ()=>this.amountChange());
  };

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
    const getSenderUser = value => {
      if (value) {
        if (value.length === 10) {
          axios
            .post(`${API_URL}/partnerCashier/getUserByMobile`, {
              mobile: value,
              token,
            })
            .then(res => {
              if (res.data.error || res.data.status !== 1) {
                toast.error(res.data.error);
              } else {
                this.setState({
                  mobile: res.data.data.mobile || '',
                  givenname: res.data.data.name || '',
                  familyname: res.data.data.last_name || '',
                  note: '',
                  senderIdentificationCountry: res.data.data.country || '',
                  senderIdentificationType: res.data.data.id_type || '',
                  senderIdentificationNumber: res.data.data.id_number || '',
                  senderIdentificationValidTill: res.data.data.valid_till || '',
                  address1: res.data.data.address || '',
                  state: res.data.data.state || '',
                  zip: res.data.data.zip || '',
                  ccode: getCountryDialCode(res.data.data.country),
                  country: res.data.data.country || '',
                  email: res.data.data.email || '',
                });
              }
            })
            .catch(err => {
              toast.error('something went wrong');
            });
        }
      }
    };
    return (
      <Card marginBottom="54px" buttonMarginTop="32px" bigPadding>
        <h3>Max. Daily Cash Out Amount</h3>
        <h5>
          <FormattedMessage {...messages.available} />
        </h5>
        <div className="cardValue">
          {CURRENCY} {this.state.balance.toFixed(2)}
        </div>

        <Row>
          <Col>
            {this.state.transactionStarted && !this.state.isClosed ? (
              <Button
                className="sendMoneybutton"
                noMin
                onClick={this.showPopupSendMoney}
              >
                <i className="material-icons">send</i> {/* Send Money */}
                <FormattedMessage {...messages.sendmoney} />
              </Button>
            ) : (
              <Button className="sendMoneybutton" noMin disabled>
                <i className="material-icons">send</i> {/* Send Money */}
                <FormattedMessage {...messages.sendmoney} />
              </Button>
            )}
          </Col>
          <Col>
            {this.state.transactionStarted && !this.state.isClosed ? (
              <Button
                noMin
                className="sendMoneybutton"
                onClick={this.showClaimMoneyPopup}
              >
                <i className="material-icons">send</i> Claim Money
              </Button>
            ) : (
              <Button noMin className="sendMoneybutton" disabled>
                <i className="material-icons">send</i> Claim Money
              </Button>
            )}
          </Col>
        </Row>
        <Row>
          <Col style={{width:'100%', marginTop:'5px'}} cw="100%">
            {this.state.transactionStarted && !this.state.isClosed ? (
              <Button
                className="sendMoneybutton"
                noMin
                onClick={this.openOperationalPopup}
              >
                <i className="material-icons">send</i> {/* Send Money */}
                Send Money to Operational
              </Button>
            ) : (
              <Button className="sendMoneybutton" noMin disabled>
                <i className="material-icons">send</i> {/* Send Money */}
                Send Money to Operational
              </Button>
            )}
          </Col>
        </Row>

        {this.state.sendtooperationalpopup ? (
          <CashierToOperationalForm
          close={() => this.closeOperationalPopup()}
        />
        ): null}

        {this.state.popupClaimMoney ? (
          <Popup bigBody close={this.closePopupSendMoney.bind(this)} accentedH1>
            {this.state.showClaimMoneyDetails ? (
              this.state.showVerifyClaimMoney ? (
                this.state.showOTPClaimMoney ? (
                  <div>
                    <h1>Verify OTP</h1>
                    <form
                      action=""
                      method="post"
                      onSubmit={this.verifyOTPClaimMoney}
                    >
                      <p>&nbsp;</p>
                      <FormGroup>
                        <label>OTP*</label>
                        <TextInput
                          type="text"
                          name="otp"
                          onFocus={inputFocus}
                          onBlur={inputBlur}
                          value={this.state.otp}
                          onChange={this.handleInputChange}
                          required
                        />
                      </FormGroup>
                      {this.state.claimMoneyLoading ? (
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
                          <span>Verify</span>
                        </Button>
                      )}
                    </form>
                  </div>
                ) : (
                  <div>
                    <h1>Verify OTP</h1>
                    <form
                      action=""
                      method="post"
                      onSubmit={this.verifyClaimMoney}
                    >
                      <p>&nbsp;</p>
                      <FormGroup>
                        <label>OTP*</label>
                        <TextInput
                          type="text"
                          name="otp"
                          onFocus={inputFocus}
                          onBlur={inputBlur}
                          value={this.state.otp}
                          onChange={this.handleInputChange}
                          required
                        />
                      </FormGroup>
                      {this.state.claimMoneyLoading ? (
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
                          <span>Verify</span>
                        </Button>
                      )}

                      <p className="resend">
                        Wait for{' '}
                        <span className="timer">{this.state.timer}</span> to{' '}
                        {this.state.resend ? (
                          <span className="go" onClick={this.generateOTP}>
                            Resend
                          </span>
                        ) : (
                          <span>Resend</span>
                        )}
                      </p>
                    </form>
                  </div>
                )
              ) : (
                <div>
                  <h1>Claim Money</h1>
                  <form action="" method="post" onSubmit={this.claimMoney}>
                    <Container>
                      <Row>
                        <Col md="4" />
                        <Col sm="12" md="4">
                          <FormGroup>
                            <label>
                              Enter the transfer code
                              {/* <FormattedMessage {...messages.popup1} />* */}
                            </label>
                            <TextInput
                              type="text"
                              name="transferCode"
                              pattern=".{3,12}"
                              // title="Minimum 3 characters"
                              onFocus={inputFocus}
                              onBlur={inputBlur}
                              value={this.state.transferCode}
                              onChange={this.handleInputChange}
                              required
                            />
                          </FormGroup>
                        </Col>
                        <Col md="4" />
                      </Row>
                    </Container>
                    <Container>
                      <Row vAlign="flex-start">
                        <Col
                          sm="12"
                          md="4"
                          style={{
                            display: this.state.sender_id ? 'block' : 'none',
                          }}
                        >
                          <div
                            style={{
                              fontSize: '24px',
                              fontWeight: 'bold',
                              padding: '13px 0px',
                              color: '#417505',
                            }}
                          >
                            Sender's Info
                          </div>
                          <Row>
                            <Col className="popInfoLeft">Mobile Number</Col>
                            <Col className="popInfoRight">
                              {this.state.mobile}
                            </Col>
                          </Row>
                          <Row>
                            <Col className="popInfoLeft">Given Name</Col>
                            <Col className="popInfoRight">
                              {this.state.givenname}
                            </Col>
                          </Row>
                          <Row>
                            <Col className="popInfoLeft">Family Name</Col>
                            <Col className="popInfoRight">
                              {this.state.familyname}
                            </Col>
                          </Row>
                          <Row>
                            <Col className="popInfoLeft">Address</Col>
                            <Col className="popInfoRight">
                              {this.state.address1}
                            </Col>
                          </Row>
                          <Row>
                            <Col className="popInfoLeft">State</Col>
                            <Col className="popInfoRight">
                              {this.state.state}
                            </Col>
                          </Row>
                          <Row>
                            <Col className="popInfoLeft">Zip Code</Col>
                            <Col className="popInfoRight">{this.state.zip}</Col>
                          </Row>
                          <Row>
                            <Col className="popInfoLeft">Country</Col>
                            <Col className="popInfoRight">
                              {this.state.country}
                            </Col>
                          </Row>
                          <Row>
                            <Col className="popInfoLeft">Email ID</Col>
                            <Col className="popInfoRight">
                              {this.state.email}
                            </Col>
                          </Row>
                          <Row>
                            <Col className="popInfoLeft">Notes</Col>
                            <Col className="popInfoRight">
                              {this.state.note}
                            </Col>
                          </Row>
                        </Col>
                        <Col sm="12" md="4">
                          <div
                            style={{
                              fontSize: '24px',
                              fontWeight: 'bold',
                              padding: '13px 0px',
                              color: '#417505',
                            }}
                          >
                            Receiver's Info
                          </div>
                          <Row>
                            <Col className="popInfoLeft">Mobile Number</Col>
                            <Col className="popInfoRight">
                              {this.state.receiverMobile}
                            </Col>
                          </Row>
                          <Row>
                            <Col className="popInfoLeft">Given Name</Col>
                            <Col className="popInfoRight">
                              {this.state.receiverGivenName}
                            </Col>
                          </Row>
                          <Row>
                            <Col className="popInfoLeft">Family Name</Col>
                            <Col className="popInfoRight">
                              {this.state.receiverFamilyName}
                            </Col>
                          </Row>
                          <Row>
                            <Col className="popInfoLeft">Country</Col>
                            <Col className="popInfoRight">
                              {this.state.receiverCountry}
                            </Col>
                          </Row>
                          <Row>
                            <Col className="popInfoLeft">Email ID</Col>
                            <Col className="popInfoRight">
                              {this.state.receiverEmail}
                            </Col>
                          </Row>
                          <Row /> <Row /> <Row />
                        </Col>
                        <Col sm="12" md="4">
                          <div
                            style={{
                              fontSize: '24px',
                              fontWeight: 'bold',
                              padding: '13px 0px',
                              color: '#417505',
                            }}
                          >
                            &nbsp;
                          </div>
                          <Row>
                            <Col className="popInfoLeft">Amount</Col>
                            <Col className="popInfoRight">
                              {this.state.receiverIdentificationAmount}
                            </Col>
                          </Row>
                          <Row>
                            <Col className="popInfoLeft">Date</Col>
                            <Col className="popInfoRight">
                              {this.state.dateClaimMoney}
                            </Col>
                          </Row>
                          <Row>
                            <Col className="popInfoLeft">Transaction ID</Col>
                            <Col className="popInfoRight">
                              {this.state.master_code}
                            </Col>
                          </Row>
                          <Row>
                            <Col className="popInfoLeft">ID required</Col>
                            <Col className="popInfoRight">
                              {this.state.withoutID ? 'No' : 'Yes'}
                            </Col>
                          </Row>
                          <Row>
                            <Col className="popInfoLeft">OTP required</Col>
                            <Col className="popInfoRight">
                              {this.state.requireOTP ? 'Yes' : 'No'}
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                      <Row vAlign="flex-start">
                        <Col
                          style={{
                            display: this.state.sender_id ? 'block' : 'none',
                          }}
                        >
                          <div
                            style={{
                              fontSize: '24px',
                              fontWeight: 'bold',
                              padding: '13px 0px',
                            }}
                          >
                            Sender's Identification
                          </div>
                          <Row>
                            <Col className="popInfoLeft">Country</Col>
                            <Col className="popInfoRight">
                              {this.state.senderIdentificationCountry}
                            </Col>
                          </Row>
                          <Row>
                            <Col className="popInfoLeft">Type</Col>
                            <Col className="popInfoRight">
                              {this.state.senderIdentificationType}
                            </Col>
                          </Row>
                          <Row>
                            <Col className="popInfoLeft">Number</Col>
                            <Col className="popInfoRight">
                              {this.state.senderIdentificationNumber}
                            </Col>
                          </Row>
                          <Row>
                            <Col className="popInfoLeft">Valid till</Col>
                            <Col className="popInfoRight">
                              {this.state.senderIdentificationValidTill}
                            </Col>
                          </Row>
                        </Col>
                        <Col>
                          <div
                            style={{
                              fontSize: '24px',
                              fontWeight: 'bold',
                              padding: '13px 0px',
                            }}
                          >
                            Receiver's Identification
                          </div>
                          <Row>
                            <Col className="popInfoLeft">Country</Col>
                            <Col className="popInfoRight">
                              {this.state.receiverIdentificationCountry}
                            </Col>
                          </Row>
                          <Row>
                            <Col className="popInfoLeft">Type</Col>
                            <Col className="popInfoRight">
                              {this.state.receiverIdentificationType}
                            </Col>
                          </Row>
                          <Row>
                            <Col className="popInfoLeft">Number</Col>
                            <Col className="popInfoRight">
                              {this.state.receiverIdentificationNumber}
                            </Col>
                          </Row>
                          <Row>
                            <Col className="popInfoLeft">Valid till</Col>
                            <Col className="popInfoRight">
                              {this.state.receiverIdentificationValidTill}
                            </Col>
                          </Row>
                        </Col>
                        <Col>
                          {this.state.withoutID ? null : (
                            <FormGroup>
                              <UploadArea
                                bgImg={`${STATIC_URL}main/pdf-icon.png`}
                              >
                                {this.state.proof ? (
                                  <a
                                    className="uploadedImg"
                                    href={CONTRACT_URL + this.state.proof}
                                    target="_BLANK"
                                  />
                                ) : (
                                  ' '
                                )}
                                <div
                                  className="uploadTrigger"
                                  onClick={() => this.triggerBrowse('proof')}
                                >
                                  <input
                                    type="file"
                                    id="proof"
                                    onChange={this.onChange}
                                    data-key="proof"
                                    accept=".pdf"
                                  />
                                  {!this.state.proof ? (
                                    <i className="material-icons">
                                      cloud_upload
                                    </i>
                                  ) : (
                                    ' '
                                  )}

                                  <label>
                                    <div className="tooltip">
                                      <i
                                        className="fa fa-info-circle"
                                        style={{ margin: '5px' }}
                                      />
                                      <span className="tooltiptext">
                                        This proof will be uploaded on
                                        Blockchain.
                                      </span>
                                    </div>
                                    {!this.state.proof ? (
                                      <span>Upload</span>
                                    ) : (
                                      // <FormattedMessage {...messages.popup10} />
                                      <span>Change Proof</span>
                                    )}
                                    *
                                    <p>
                                      <span style={{ color: 'red' }}>* </span>
                                      Only PDF allowed
                                    </p>
                                  </label>
                                </div>
                              </UploadArea>
                            </FormGroup>
                          )}
                          {this.state.claimMoneyLoading ? (
                            <Button filledBtn marginTop="20px" disabled>
                              <Loader />
                            </Button>
                          ) : (
                            <Button filledBtn marginTop="20px">
                              <span>
                                Proceed
                                {/* <FormattedMessage {...messages.addbank} /> */}
                              </span>
                            </Button>
                          )}

                          <br />
                          {/* <p className="note">
                      <span style={{ color: 'red' }}>* </span>
                      Total fee $200 will be charged
                    </p> */}
                        </Col>
                      </Row>
                    </Container>
                  </form>
                </div>
              )
            ) : (
              <div>
                <h1>Claim Money</h1>
                <form
                  action=""
                  method="post"
                  onSubmit={this.getClaimMoney}
                  style={{ marginTop: '20px' }}
                >
                  <Container>
                    <Row>
                      <Col md="4" />
                      <Col sm="12" md="4">
                        <FormGroup>
                          <label>
                            Enter the transfer code
                            {/* <FormattedMessage {...messages.popup1} />* */}
                          </label>
                          <TextInput
                            type="text"
                            name="transferCode"
                            pattern=".{3,12}"
                            // title="Minimum 3 characters"
                            onFocus={inputFocus}
                            onBlur={inputBlur}
                            value={this.state.transferCode}
                            onChange={this.handleInputChange}
                            required
                          />
                        </FormGroup>
                      </Col>
                      <Col md="4" />
                    </Row>
                  </Container>
                  <Container>
                    <Row>
                      <Col md="4" />
                      <Col sm="12" md="4">
                        <FormGroup>
                          {this.state.claimMoneyLoading ? (
                            <Button filledBtn marginTop="20px" disabled>
                              <Loader />
                            </Button>
                          ) : (
                            <Button filledBtn marginTop="20px">
                              <span>Proceed</span>
                            </Button>
                          )}
                        </FormGroup>
                      </Col>
                      <Col md="4" />
                    </Row>
                  </Container>
                </form>
              </div>
            )}
          </Popup>
        ) : null}

        {this.state.popupSendMoney ? (
          <Popup bigBody close={this.closePopupSendMoney.bind(this)} accentedH1>
            {this.state.showSendMoneyOTP ? (
              <div>
                <h1>Verify OTP</h1>
                <form action="" method="post" onSubmit={this.verifySendMoney}>
                  <p>&nbsp;</p>
                  <FormGroup>
                    <label>OTP*</label>
                    <TextInput
                      type="text"
                      name="otp"
                      onFocus={inputFocus}
                      onBlur={inputBlur}
                      value={this.state.otp}
                      onChange={this.handleInputChange}
                      required
                    />
                  </FormGroup>
                  {this.state.verifySendMoneyOTPLoading ? (
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
                      <span>Verify</span>
                    </Button>
                  )}

                  <p className="resend">
                    Wait for <span className="timer">{this.state.timer}</span>{' '}
                    to{' '}
                    {this.state.resend ? (
                      <span className="go" onClick={this.generateOTP}>
                        Resend
                      </span>
                    ) : (
                      <span>Resend</span>
                    )}
                  </p>
                </form>
              </div>
            ) : this.state.showSendMoneyToWalletOTP ? (
              <div>
                <h1>Verify OTP</h1>
                <form
                  action=""
                  method="post"
                  onSubmit={this.verifySendMoneyToWallet}
                >
                  <p>&nbsp;</p>
                  <FormGroup>
                    <label>OTP*</label>
                    <TextInput
                      type="text"
                      name="otp"
                      onFocus={inputFocus}
                      onBlur={inputBlur}
                      value={this.state.otp}
                      onChange={this.handleInputChange}
                      required
                    />
                  </FormGroup>
                  {this.state.verifySendMoneyOTPLoading ? (
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
                      <span>Verify</span>
                    </Button>
                  )}

                  <p className="resend">
                    Wait for <span className="timer">{this.state.timer}</span>{' '}
                    to{' '}
                    {this.state.resend ? (
                      <span className="go" onClick={this.generateOTP}>
                        Resend
                      </span>
                    ) : (
                      <span>Resend</span>
                    )}
                  </p>
                </form>
              </div>
            ) : this.state.showConfirmPending ? (
              <div>
                <h1>Confirm </h1>

                <p>&nbsp;</p>
                <FormGroup>
                  <p style={{ textAlign: 'center', fontSize: '20px' }}>
                    You need Manager approval for execute this transaction. Do
                    you want to send for approval ?
                  </p>
                </FormGroup>
                <Row>
                  <Col cW="49%" mR="2%">
                    {this.state.verifySendMoneyOTPLoading ? (
                      <Button
                        filledBtn
                        marginTop="50px"
                        marginBottom="50px"
                        disabled
                      >
                        <Loader />
                      </Button>
                    ) : (
                      <Button
                        filledBtn
                        marginTop="50px"
                        marginBottom="50px"
                        onClick={this.confirmPending}
                      >
                        <span>Yes</span>
                      </Button>
                    )}
                  </Col>
                  <Col cW="49%">
                    <Button
                      style={{ backgroundColor: '#111111' }}
                      filledBtn
                      marginTop="50px"
                      marginBottom="50px"
                      onClick={this.cancelPending}
                    >
                      <span>No</span>
                    </Button>
                  </Col>
                </Row>
              </div>
            ) : (
              <div>
                <h1>Send Money</h1>
                <form action="" method="post" onSubmit={this.sendMoney}>
                  {this.state.proceed ? (
                    <div>
                      <Container>
                        <Row vAlign="flex-start">
                          <Col sm="12" md="4">
                            <div
                              style={{
                                fontSize: '24px',
                                fontWeight: 'bold',
                                padding: '13px 0px',
                                color: '#417505',
                              }}
                            >
                              Sender's Info
                            </div>
                            <Row>
                              <Col className="popInfoLeft">Mobile Number</Col>
                              <Col className="popInfoRight">
                                {this.state.mobile}
                              </Col>
                            </Row>
                            <Row>
                              <Col className="popInfoLeft">Given Name</Col>
                              <Col className="popInfoRight">
                                {this.state.givenname}
                              </Col>
                            </Row>
                            <Row>
                              <Col className="popInfoLeft">Family Name</Col>
                              <Col className="popInfoRight">
                                {this.state.familyname}
                              </Col>
                            </Row>
                            <Row>
                              <Col className="popInfoLeft">Address</Col>
                              <Col className="popInfoRight">
                                {this.state.address1}
                              </Col>
                            </Row>
                            <Row>
                              <Col className="popInfoLeft">State</Col>
                              <Col className="popInfoRight">
                                {this.state.state}
                              </Col>
                            </Row>
                            <Row>
                              <Col className="popInfoLeft">Zip Code</Col>
                              <Col className="popInfoRight">
                                {this.state.zip}
                              </Col>
                            </Row>
                            <Row>
                              <Col className="popInfoLeft">Country</Col>
                              <Col className="popInfoRight">
                                {this.state.country}
                              </Col>
                            </Row>
                            <Row>
                              <Col className="popInfoLeft">Email ID</Col>
                              <Col className="popInfoRight">
                                {this.state.email}
                              </Col>
                            </Row>
                            <Row>
                              <Col className="popInfoLeft">Notes</Col>
                              <Col className="popInfoRight">
                                {this.state.note}
                              </Col>
                            </Row>
                          </Col>
                          <Col sm="12" md="4">
                            <div
                              style={{
                                fontSize: '24px',
                                fontWeight: 'bold',
                                padding: '13px 0px',
                                color: '#417505',
                              }}
                            >
                              Receiver's Info
                            </div>
                            <Row>
                              <Col className="popInfoLeft">Mobile Number</Col>
                              <Col className="popInfoRight">
                                {this.state.receiverMobile}
                              </Col>
                            </Row>
                            <Row>
                              <Col className="popInfoLeft">Given Name</Col>
                              <Col className="popInfoRight">
                                {this.state.receiverGivenName}
                              </Col>
                            </Row>
                            <Row>
                              <Col className="popInfoLeft">Family Name</Col>
                              <Col className="popInfoRight">
                                {this.state.receiverFamilyName}
                              </Col>
                            </Row>
                            <Row>
                              <Col className="popInfoLeft">Country</Col>
                              <Col className="popInfoRight">
                                {this.state.receiverCountry}
                              </Col>
                            </Row>
                            <Row>
                              <Col className="popInfoLeft">Email ID</Col>
                              <Col className="popInfoRight">
                                {this.state.receiverEmail}
                              </Col>
                            </Row>
                            <Row /> <Row /> <Row />
                          </Col>
                          <Col sm="12" md="4">
                            <div
                              style={{
                                fontSize: '24px',
                                fontWeight: 'bold',
                                padding: '13px 0px',
                                color: '#417505',
                              }}
                            >
                              &nbsp;
                            </div>
                            <Row>
                              <Col className="popInfoLeft">Amount</Col>
                              <Col className="popInfoRight">
                                {this.state.receiverIdentificationAmount}
                              </Col>
                            </Row>
                            <Row>
                              <Col className="popInfoLeft">Date</Col>
                              <Col className="popInfoRight">
                                {this.state.dateClaimMoney}
                              </Col>
                            </Row>
                            <Row>
                              <Col className="popInfoLeft">Transaction ID</Col>
                              <Col className="popInfoRight">
                                {this.state.transferCode}
                              </Col>
                            </Row>
                            <Row>
                              <Col className="popInfoLeft">ID required</Col>
                              <Col className="popInfoRight">
                                {this.state.withoutID ? 'No' : 'Yes'}
                              </Col>
                            </Row>
                            <Row>
                              <Col className="popInfoLeft">OTP required</Col>
                              <Col className="popInfoRight">
                                {this.state.requireOTP ? 'Yes' : 'No'}
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                        <Row vAlign="flex-start">
                          <Col>
                            <div
                              style={{
                                fontSize: '24px',
                                fontWeight: 'bold',
                                padding: '13px 0px',
                              }}
                            >
                              Sender's Identification
                            </div>
                            <Row>
                              <Col className="popInfoLeft">Country</Col>
                              <Col className="popInfoRight">
                                {this.state.senderIdentificationCountry}
                              </Col>
                            </Row>
                            <Row>
                              <Col className="popInfoLeft">Type</Col>
                              <Col className="popInfoRight">
                                {this.state.senderIdentificationType}
                              </Col>
                            </Row>
                            <Row>
                              <Col className="popInfoLeft">Number</Col>
                              <Col className="popInfoRight">
                                {this.state.senderIdentificationNumber}
                              </Col>
                            </Row>
                            <Row>
                              <Col className="popInfoLeft">Valid till</Col>
                              <Col className="popInfoRight">
                                {this.state.senderIdentificationValidTill}
                              </Col>
                            </Row>
                          </Col>
                          <Col>
                            <div
                              style={{
                                fontSize: '24px',
                                fontWeight: 'bold',
                                padding: '13px 0px',
                              }}
                            >
                              Receiver's Identification
                            </div>
                            <Row>
                              <Col className="popInfoLeft">Country</Col>
                              <Col className="popInfoRight">
                                {this.state.receiverIdentificationCountry}
                              </Col>
                            </Row>
                            <Row>
                              <Col className="popInfoLeft">Type</Col>
                              <Col className="popInfoRight">
                                {this.state.receiverIdentificationType}
                              </Col>
                            </Row>
                            <Row>
                              <Col className="popInfoLeft">Number</Col>
                              <Col className="popInfoRight">
                                {this.state.receiverIdentificationNumber}
                              </Col>
                            </Row>
                            <Row>
                              <Col className="popInfoLeft">Valid till</Col>
                              <Col className="popInfoRight">
                                {this.state.receiverIdentificationValidTill}
                              </Col>
                            </Row>
                          </Col>
                          <Col>
                            {this.state.claimMoneyLoading ? (
                              <Button filledBtn marginTop="20px" disabled>
                                <Loader />
                              </Button>
                            ) : (
                              <Button filledBtn marginTop="20px">
                                <span>
                                  Proceed
                                  {/* <FormattedMessage {...messages.addbank} /> */}
                                </span>
                              </Button>
                            )}

                            <br />
                            {/* <p className="note">
                      <span style={{ color: 'red' }}>* </span>
                      Total fee $200 will be charged
                    </p> */}
                          </Col>
                        </Row>
                      </Container>
                    </div>
                  ) : (
                    <div style={{ width: '100%', height: '100%' }}>
                      <CashierPopupToggle
                        handleToggleChange={value =>
                          this.handleToggleChange(value)
                        }
                      />
                      {this.state.isWallet ? (
                        <Blur isValidFee={this.state.isValidFee}>
                          <CashierToWalletForm
                            isValidFee={this.state.isValidFee}
                            onClose={() => this.closePopupSendMoney()}
                            formValues={values =>
                              this.setToWalletFormValues(values)
                            }
                          />
                        </Blur>
                      ) : (
                        <Blur isValidFee={this.state.isValidFee}>
                          <Container>
                            <Row>
                              <Col sm="12" md="5" cW="49%">
                                <div
                                  style={{
                                    fontSize: '24px',
                                    fontWeight: 'bold',
                                    padding: '13px 0px',
                                    color: '#417505',
                                  }}
                                >
                                  Sender's Info
                                </div>

                                <Row>
                                  <Col cW="20%" mR="2%">
                                    <FormGroup>
                                      <TextField
                                        size="small"
                                        InputLabelProps={{
                                          shrink: true,
                                        }}
                                        style={{
                                          marginTop: '6px',
                                          marginBottom: '6px',
                                        }}
                                        fullWidth
                                        variant="outlined"
                                        type="text"
                                        name="ccode"
                                        readOnly
                                        placeholder="+221"
                                        value={this.state.ccode}
                                        disabled
                                        onChange={this.handleInputChange}
                                      />
                                    </FormGroup>
                                  </Col>
                                  <Col cW="78%">
                                    <FormGroup>
                                      <TextField
                                        size="small"
                                        InputLabelProps={{
                                          shrink: true,
                                        }}
                                        label="Mobile"
                                        style={{
                                          marginTop: '6px',
                                          marginBottom: '6px',
                                        }}
                                        fullWidth
                                        variant="outlined"
                                        type="text"
                                        name="mobile"
                                        onBlur={() =>
                                          getSenderUser(this.state.mobile)
                                        }
                                        value={this.state.mobile}
                                        onChange={this.handleInputChange}
                                        required
                                      />
                                    </FormGroup>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col>
                                    <FormGroup>
                                      <TextField
                                        size="small"
                                        InputLabelProps={{
                                          shrink: true,
                                        }}
                                        label="Given Name"
                                        style={{
                                          marginTop: '6px',
                                          marginBottom: '6px',
                                        }}
                                        fullWidth
                                        variant="outlined"
                                        type="text"
                                        name="givenname"
                                        value={this.state.givenname}
                                        onChange={this.handleInputChange}
                                        required
                                      />
                                    </FormGroup>
                                  </Col>
                                  <Col>
                                    <FormGroup>
                                      <TextField
                                        size="small"
                                        InputLabelProps={{
                                          shrink: true,
                                        }}
                                        label="Family Name"
                                        style={{
                                          marginTop: '6px',
                                          marginBottom: '6px',
                                        }}
                                        fullWidth
                                        variant="outlined"
                                        type="text"
                                        name="familyname"
                                        title="Minimum 3 characters"
                                        value={this.state.familyname}
                                        onChange={this.handleInputChange}
                                        required
                                      />
                                    </FormGroup>
                                  </Col>
                                </Row>

                                <FormGroup>
                                  <TextField
                                    size="small"
                                    InputLabelProps={{
                                      shrink: true,
                                    }}
                                    label="Address"
                                    style={{
                                      marginTop: '6px',
                                      marginBottom: '6px',
                                    }}
                                    fullWidth
                                    variant="outlined"
                                    type="text"
                                    name="address1"
                                    value={this.state.address1}
                                    onChange={this.handleInputChange}
                                    required
                                  />
                                </FormGroup>

                                <Row>
                                  <Col>
                                    <FormGroup>
                                      <TextField
                                        size="small"
                                        InputLabelProps={{
                                          shrink: true,
                                        }}
                                        label="State"
                                        style={{
                                          marginTop: '6px',
                                          marginBottom: '6px',
                                        }}
                                        fullWidth
                                        variant="outlined"
                                        type="text"
                                        name="state"
                                        value={this.state.state}
                                        onChange={this.handleInputChange}
                                        required
                                      />
                                    </FormGroup>
                                  </Col>
                                  <Col>
                                    <FormGroup>
                                      <TextField
                                        size="small"
                                        InputLabelProps={{
                                          shrink: true,
                                        }}
                                        label="Zip"
                                        style={{
                                          marginTop: '6px',
                                          marginBottom: '6px',
                                        }}
                                        fullWidth
                                        variant="outlined"
                                        type="text"
                                        name="zip"
                                        value={this.state.zip}
                                        onChange={this.handleInputChange}
                                      />
                                    </FormGroup>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col>
                                    <FormGroup>
                                      <CountrySelectBox
                                        type="text"
                                        name="country"
                                        value={this.state.country}
                                        onChange={this.countryChange}
                                        data-change="ccode"
                                        required
                                      />
                                    </FormGroup>
                                  </Col>

                                  <Col>
                                    <FormGroup>
                                      <TextField
                                        size="small"
                                        InputLabelProps={{
                                          shrink: true,
                                        }}
                                        label="Email"
                                        style={{
                                          marginTop: '6px',
                                          marginBottom: '6px',
                                        }}
                                        fullWidth
                                        variant="outlined"
                                        type="email"
                                        name="email"
                                        onInput={e =>
                                          e.target.setCustomValidity('')
                                        }
                                        onInvalid={e =>
                                          e.target.setCustomValidity(
                                            'Enter a valid email address',
                                          )
                                        }
                                        value={this.state.email}
                                        onChange={this.handleInputChange}
                                        required
                                      />
                                    </FormGroup>
                                  </Col>
                                  {/* <form.Group controlId="exampleForm.ControlTextarea1">
                        <form.Label>Example textarea</form.Label>
                        <form.Control as="textarea" rows="3" />
                      </form.Group> */}
                                </Row>
                                <FormGroup>
                                  <TextField
                                    size="small"
                                    InputLabelProps={{
                                      shrink: true,
                                    }}
                                    label="Note"
                                    style={{
                                      marginTop: '6px',
                                      marginBottom: '6px',
                                    }}
                                    fullWidth
                                    variant="outlined"
                                    multiline
                                    rows="4"
                                    type="text"
                                    name="note"
                                    value={this.state.note}
                                    onChange={this.handleInputChange}
                                  />
                                </FormGroup>
                                <div
                                  style={{
                                    fontSize: '24px',
                                    fontWeight: 'bold',
                                    padding: '10px 0px',
                                  }}
                                >
                                  Sender's Identification
                                </div>
                                <Row>
                                  <Col>
                                    <FormGroup>
                                      <CountrySelectBox
                                        type="text"
                                        name="senderIdentificationCountry"
                                        value={
                                          this.state.senderIdentificationCountry
                                        }
                                        onChange={this.countryChange}
                                        data-change="ccc"
                                        required
                                      />
                                    </FormGroup>
                                  </Col>
                                  <Col>
                                    <FormGroup>
                                      <TypeSelectBox
                                        type="text"
                                        name="senderIdentificationType"
                                        value={
                                          this.state.senderIdentificationType
                                        }
                                        onChange={this.typeChange}
                                        required
                                      />
                                    </FormGroup>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col>
                                    <FormGroup>
                                      <TextField
                                        size="small"
                                        InputLabelProps={{
                                          shrink: true,
                                        }}
                                        label="Id Number"
                                        style={{
                                          marginTop: '6px',
                                          marginBottom: '6px',
                                        }}
                                        fullWidth
                                        variant="outlined"
                                        type="text"
                                        name="senderIdentificationNumber"
                                        value={
                                          this.state.senderIdentificationNumber
                                        }
                                        onChange={this.handleInputChange}
                                        required
                                      />
                                    </FormGroup>
                                  </Col>
                                  <Col>
                                    <FormGroup>
                                      <MuiPickersUtilsProvider
                                        utils={DateFnsUtils}
                                      >
                                        <KeyboardDatePicker
                                          id="date-picker-dialog"
                                          label="Valid Till"
                                          size="small"
                                          fullWidth
                                          minDate= {date}
                                          inputVariant="outlined"
                                          format="dd/MM/yyyy"
                                          required
                                          InputLabelProps={{
                                            shrink: true,
                                          }}
                                          value={
                                            this.state
                                              .senderIdentificationValidTill
                                          }
                                          onChange={date =>
                                            this.handleDateChange(
                                              date,
                                              'senderIdentificationValidTill',
                                            )
                                          }
                                          KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                          }}
                                        />
                                      </MuiPickersUtilsProvider>
                                    </FormGroup>
                                  </Col>
                                </Row>
                              </Col>
                              <Col sm="12" md="2" cW="2%" />
                              <Col sm="12" md="5" cW="49%">
                                <div
                                  style={{
                                    fontSize: '24px',
                                    fontWeight: 'bold',
                                    padding: '13px 0px',
                                    color: '#417505',
                                  }}
                                >
                                  Receiver's Info
                                </div>
                                <Row>
                                  <Col cW="20%" mR="2%">
                                    <FormGroup>
                                      <TextField
                                        size="small"
                                        InputLabelProps={{
                                          shrink: true,
                                        }}
                                        style={{
                                          marginTop: '6px',
                                          marginBottom: '6px',
                                        }}
                                        fullWidth
                                        variant="outlined"
                                        type="text"
                                        placeholder="+221"
                                        name="receiverccode"
                                        readOnly
                                        value={this.state.receiverccode}
                                        onChange={this.handleInputChange}
                                        disabled
                                      />
                                    </FormGroup>
                                  </Col>
                                  <Col cW="78%">
                                    <FormGroup>
                                      <TextField
                                        size="small"
                                        InputLabelProps={{
                                          shrink: true,
                                        }}
                                        label="Mobile"
                                        style={{
                                          marginTop: '6px',
                                          marginBottom: '6px',
                                        }}
                                        fullWidth
                                        variant="outlined"
                                        type="text"
                                        title="10 Digit numeric value"
                                        name="receiverMobile"
                                        value={this.state.receiverMobile}
                                        onChange={this.handleInputChange}
                                        required
                                      />
                                    </FormGroup>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col>
                                    <FormGroup>
                                      <TextField
                                        size="small"
                                        InputLabelProps={{
                                          shrink: true,
                                        }}
                                        label="Given Name"
                                        style={{
                                          marginTop: '6px',
                                          marginBottom: '6px',
                                        }}
                                        fullWidth
                                        variant="outlined"
                                        type="text"
                                        name="receiverGivenName"
                                        title="Minimum 3 characters"
                                        value={this.state.receiverGivenName}
                                        onChange={this.handleInputChange}
                                        required
                                      />
                                    </FormGroup>
                                  </Col>
                                  <Col>
                                    <FormGroup>
                                      <TextField
                                        size="small"
                                        InputLabelProps={{
                                          shrink: true,
                                        }}
                                        label="Family Name"
                                        style={{
                                          marginTop: '6px',
                                          marginBottom: '6px',
                                        }}
                                        fullWidth
                                        variant="outlined"
                                        type="text"
                                        name="receiverFamilyName"
                                        title="Minimum 3 characters"
                                        value={this.state.receiverFamilyName}
                                        onChange={this.handleInputChange}
                                        required
                                      />
                                    </FormGroup>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col>
                                    <FormGroup>
                                      <CountrySelectBox
                                        type="text"
                                        name="receiverCountry"
                                        value={this.state.receiverCountry}
                                        onChange={this.countryChange}
                                        data-change="receiverccode"
                                        required
                                      />
                                    </FormGroup>
                                  </Col>

                                  <Col>
                                    <FormGroup>
                                      <TextField
                                        size="small"
                                        InputLabelProps={{
                                          shrink: true,
                                        }}
                                        label="Email"
                                        style={{
                                          marginTop: '6px',
                                          marginBottom: '6px',
                                        }}
                                        fullWidth
                                        variant="outlined"
                                        type="email"
                                        name="receiverEmail"
                                        onInput={e =>
                                          e.target.setCustomValidity('')
                                        }
                                        onInvalid={e =>
                                          e.target.setCustomValidity(
                                            'Enter a valid email address',
                                          )
                                        }
                                        value={this.state.receiverEmail}
                                        onChange={this.handleInputChange}
                                        required
                                      />
                                    </FormGroup>
                                  </Col>
                                  {/* <form.Group controlId="exampleForm.ControlTextarea1">
                        <form.Label>Example textarea</form.Label>
                        <form.Control as="textarea" rows="3" />
                      </form.Group> */}
                                </Row>
                                <Label mT="20px">
                                  <input
                                    type="checkbox"
                                    onChange={this.toggleIdentificationBlock}
                                    value="1"
                                    checked={this.state.withoutID}
                                  />{' '}
                                  Pay without requesting physical id
                                  <input
                                    style={{ marginLeft: '20px' }}
                                    type="checkbox"
                                    onChange={this.checkboxChange}
                                    value="1"
                                    checked={this.state.requireOTP}
                                  />{' '}
                                  Require OTP
                                </Label>
                                {this.state.withoutID ? null : (
                                  <div>
                                    <div
                                      style={{
                                        fontSize: '24px',
                                        fontWeight: 'bold',
                                        padding: '13px 0px',
                                      }}
                                    >
                                      Receiver's Identification
                                    </div>
                                    <Row>
                                      <Col>
                                        <FormGroup>
                                          <CountrySelectBox
                                            type="text"
                                            name="receiverIdentificationCountry"
                                            value={
                                              this.state
                                                .receiverIdentificationCountry
                                            }
                                            onChange={this.countryChange}
                                            data-change="ccc"
                                            required
                                          />
                                        </FormGroup>
                                      </Col>
                                      <Col>
                                        <FormGroup>
                                          <TypeSelectBox
                                            type="text"
                                            name="receiverIdentificationType"
                                            value={
                                              this.state
                                                .receiverIdentificationType
                                            }
                                            onChange={this.typeChange}
                                            required
                                          />
                                        </FormGroup>
                                      </Col>
                                    </Row>
                                    <Row>
                                      <Col>
                                        <FormGroup>
                                          <TextField
                                            size="small"
                                            InputLabelProps={{
                                              shrink: true,
                                            }}
                                            label="Id Number"
                                            style={{
                                              marginTop: '6px',
                                              marginBottom: '6px',
                                            }}
                                            fullWidth
                                            variant="outlined"
                                            type="text"
                                            name="receiverIdentificationNumber"
                                            value={
                                              this.state
                                                .receiverIdentificationNumber
                                            }
                                            onChange={this.handleInputChange}
                                            required
                                          />
                                        </FormGroup>
                                      </Col>
                                      <Col>
                                        <FormGroup>
                                          <MuiPickersUtilsProvider
                                            utils={DateFnsUtils}
                                          >
                                            <KeyboardDatePicker
                                              id="date-picker-dialog"
                                              label="Valid Till"
                                              size="small"
                                              fullWidth
                                              minDate= {date}
                                              inputVariant="outlined"
                                              format="dd/MM/yyyy"
                                              required
                                              InputLabelProps={{
                                                shrink: true,
                                              }}
                                              value={
                                                this.state
                                                  .receiverIdentificationValidTill
                                              }
                                              onChange={date =>
                                                this.handleDateChange(
                                                  date,
                                                  'receiverIdentificationValidTill',
                                                )
                                              }
                                              KeyboardButtonProps={{
                                                'aria-label': 'change date',
                                              }}
                                            />
                                          </MuiPickersUtilsProvider>
                                        </FormGroup>
                                      </Col>
                                    </Row>
                                  </div>
                                )}
                                <FormGroup>
                                  <TextField
                                    size="small"
                                    InputLabelProps={{
                                      shrink: true,
                                    }}
                                    label="Amount"
                                    style={{
                                      marginTop: '6px',
                                      marginBottom: '6px',
                                    }}
                                    fullWidth
                                    variant="outlined"
                                    type="number"
                                    //
                                    name="receiverIdentificationAmount"
                                    value={
                                      this.state.receiverIdentificationAmount
                                    }
                                    onChange={event => {
                                      this.setState({
                                        receiverIdentificationAmount:
                                          event.target.value,
                                      });
                                    }}
                                    onBlur={this.amountChange}
                                    required
                                  />
                                </FormGroup>
                                <div>
                                  <FormControlLabel
                                    control={
                                      <MuiCheckbox
                                        checked={!this.state.isInclusive}
                                        onChange={event =>
                                          this.handleFeeTypeChange(event)
                                        }
                                        name="isInclusive"
                                        color="primary"
                                      />
                                    }
                                    label="Sender pays transaction fees"
                                  />
                                </div>
                                <div>
                                  <FormControlLabel
                                    control={
                                      <MuiCheckbox
                                        checked={this.state.interbank}
                                        onChange={event =>
                                          this.handleBankingTypeChange(event)
                                        }
                                        name="interbank"
                                        color="primary"
                                      />
                                    }
                                    label="Receiver can recieve from any bank"
                                  />
                                </div>
                                <Typography
                                  style={{
                                    color: 'rgb(53, 153, 51)',
                                    fontSize: '14px',
                                  }}
                                >
                                  {CURRENCY} {this.state.livefee} will be
                                  charged as fee and {CURRENCY}{' '}
                                  {this.state.isInclusive
                                    ? this.state.receiverIdentificationAmount
                                      ? this.state
                                        .receiverIdentificationAmount -
                                        this.state.livefee
                                      : '0'
                                    : this.state.receiverIdentificationAmount
                                    ? this.state.receiverIdentificationAmount
                                    : '0'}{' '}
                                  will be sent to the receiver
                                </Typography>
                                <Button filledBtn marginTop="20px">
                                  <span>
                                    <Typography variant="h6">
                                      {this.state.receiverIdentificationAmount
                                        ? 'Collect '
                                        : ''}
                                      {this.state.receiverIdentificationAmount
                                        ? this.state.isInclusive
                                          ? `${
                                              this.state
                                                .receiverIdentificationAmount
                                            } and `
                                          : `${parseFloat(
                                            this.state
                                              .receiverIdentificationAmount,
                                          ) +
                                              parseFloat(
                                                this.state.livefee,
                                              )} and `
                                        : ''}
                                      Proceed
                                    </Typography>
                                  </span>
                                </Button>
                              </Col>
                            </Row>
                          </Container>
                        </Blur>
                      )}
                    </div>
                  )}
                </form>
              </div>
            )}
          </Popup>
        ) : null}
      </Card>
    );
  }
}

export default CashierTransactionLimit;
