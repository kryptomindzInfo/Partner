/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 */
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet';

import { toast } from 'react-toastify';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

import Wrapper from '../../components/Wrapper';
import PartnerHeader from '../../components/Header/PartnerHeader';
import Container from '../../components/Container';
import Icon from 'components/Icon';
import Loader from '../../components/Loader';
import Welcome from '../../components/Header/Welcome';
import SidebarBank from 'components/Sidebar/SidebarBank';
import Main from '../../components/Main';
import ActionBar from '../../components/ActionBar';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Table from '../../components/Table';
import Popup from '../../components/Popup';
import FormGroup from '../../components/FormGroup';
import TextInput from '../../components/TextInput';
import SelectInput from '../../components/SelectInput';
import UploadArea from '../../components/UploadArea';
import Row from '../../components/Row';
import Col from '../../components/Col';

import { API_URL, STATIC_URL, CONTRACT_URL } from '../App/constants';

import 'react-toastify/dist/ReactToastify.css';

toast.configure({
  position: 'bottom-right',
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
});

var options = {
  First: false,
  Second: false,
  Third: true,
};
const token = localStorage.getItem('partnerLogged');
const mobile = localStorage.getItem('partnerPhone');
console.log(localStorage);
export default class PartnerUser extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      partner_id: localStorage.getItem('partnerId'),
      address1: '',
      verifyaccess:localStorage.getItem('verifyUserAccess'),
      admin: localStorage.getItem('admin'),
      state: '',
      otpMobile: mobile,
      zip: '',
      username: '',
      role:'user',
      password: '',
      mobile: '',
      email: '',
      logo: '',
      profile_id: '',
      user_id: '',
      contract: '',
      loading: true,
      redirect: false,
      verify_user_access:false,
      totalBanks: 0,
      notification: 'Welcome',
      popup: false,
      editPopup: false,
      profile_popup_edit: false,
      profile_popup: false,
      pro_name: '',
      pro_description: '',
      pro_permissions: {
        create_bank: false,
        edit_bank: false,
        create_fee: false,
      },
      create_bank: false,
      edit_bank: false,
      create_fee: false,
      user_id: token,
      otpId: '',
      banks: [],
      users: [],
      copyusers: [],
      roles: [],
      profiles: [],
      otp: '',
      showOtp: false,
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

  handleInputChange = event => {
    const { value, name } = event.target;
    if (name === 'name') {
      this.setState({
        [name]: value.trim(),
      });
    } else {
      this.setState({
        [name]: value,
      });
    }
  };

  handleVerifyChange = event => {
    console.log(event.target.checked);
      this.setState({
        verify_user_access: event.target.checked,
      });
    
  };

  showPopup = () => {
    this.setState({ popup: true });
  };
  showEditPopup = v => {
    this.setState({
      editPopup: true,
      name: v.name,
      verify_user_access: v.verify_user_access,
      otpEmail: v.email,
      otpMobile: v.mobile,
      email: v.email,
      mobile: v.mobile,
      user_id: v._id,
      username: v.username,
      password: v.password,
      ccode: v.ccode,
      branch_id: v.branch_id,
      logo: v.logo,
    });
  };

  closePopup = () => {
    this.setState({
      popup: false,
      editPopup: false,
      showEditOtp: false,
      profile_popup: false,
      profile_popup_edit: false,
      pro_name: '',
      pro_description: '',
      pro_permissions: [],
      name: '',
      address1: '',
      username: '',
      password: '',
      state: '',
      zip: '',
      profile_id: '',
      create_bank: false,
      edit_bank: false,
      create_fee: false,
      ccode: '',
      country: '',
      email: '',
      mobile: '',
      logo: null,
      contract: null,
      otp: '',
      showOtp: false,
    });
  };

  verifyOTP = event => {
    event.preventDefault();
    this.setState({
      addUserLoading: true,
    });
    axios
      .post(`${API_URL}/partner/addUser`, {
        name: this.state.name,
        email: this.state.email,
        role: this.state.role,
        verify_user_access: this.state.verify_user_access,
        mobile: this.state.mobile,
        username: this.state.username,
        password: this.state.password,
        ccode: this.state.ccode,
        branch_id: this.state.branch_id,
        logo: this.state.logo,
        token,
      })
      .then(res => {
        if (res.status == 200) {
          if (res.data.status === 0) {
            throw res.data.message;
          } else {
            this.setState(
              {
                notification: 'User added successfully!',
              },
              () => {
                this.success();
                this.closePopup();
                this.getUsers();
              },
            );
          }
        } else {
          const error = new Error(res.data.error);
          throw error;
        }
        this.setState({
          addUserLoading: false,
        });
      })
      .catch(err => {
        this.setState({
          notification: err.response
            ? err.response.data.error
            : err.toString(),
          addUserLoading: false,
        });
        this.error();
      });

  };

  editUser = event => {
    event.preventDefault();
    if (this.state.logo == null || this.state.logo == '') {
      this.setState(
        {
          notification: 'You need to upload a profile photo',
        },
        () => {
          this.error();
        },
      );
    } else {
      this.setState(
        {
          showEditOtp: true,
          otpOpt: 'editUser',
          otpTxt: 'Your OTP to edit Bank User is ',
        },
        () => {
          this.generateOTP();
        },
      );
    }
  };

  addUser = event => {
    event.preventDefault();
    console.log(this.state.logo);
    if (this.state.logo == null || this.state.logo == '') {
      this.setState(
        {
          notification: 'You need to upload a profile photo',
        },
        () => {
          this.error();
        },
      );
    } else {
      this.setState(
        {
          showOtp: true,
          otpOpt: 'editUser',
          otpTxt: 'Your OTP to add Bank User is ',
        },
        () => {
          this.generateOTP();
        },
      );
    }
  };
  startTimer = () => {
    var dis = this;
    var timer = setInterval(function () {
      if (dis.state.timer <= 0) {
        clearInterval(timer);
        dis.setState({ resend: true });
      } else {
        var time = Number(dis.state.timer) - 1;
        dis.setState({ timer: time });
      }
    }, 1000);
  };

  generateOTP = () => {
    this.setState({ resend: false, timer: 30 });

    axios
      .post(`${API_URL}/sendOTP`, {
        email: this.state.otpEmail,
        mobile: this.state.otpMobile,
        page: this.state.otpOpt,
        type: 'bank',
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

  verifyEditOTP = event => {
    this.setState({
      verifyEditOTPLoading: true,
    });
    event.preventDefault();
    axios
      .post(`${API_URL}/partner/editUser`, {
        name: this.state.name,
        verify_user_access: this.state.verify_user_access,
        email: this.state.email,
        role: this.state.role,
        mobile: this.state.mobile,
        ccode: this.state.ccode,
        username: this.state.username,
        password: this.state.password,
        branch_id: this.state.branch_id,
        user_id: this.state.user_id,
        logo: this.state.logo,
        token,
      })
      .then(res => {
        if (res.status == 200) {
          if (res.data.error) {
            throw res.data.error;
          } else {
            this.setState(
              {
                notification: 'Bank User updated successfully!',
              },
              function () {
                this.success();
                this.closePopup();
                this.getUsers();
              },
            );
          }
        } else {
          const error = new Error(res.data.error);
          throw error;
        }
        this.setState({
          verifyEditOTPLoading: false,
        });
      })
      .catch(err => {
        this.setState({
          notification: err.response ? err.response.data.error : err.toString(),
          verifyEditOTPLoading: false,
        });
        this.error();
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
    this.setState({
      [key]: 'main/loader.gif',
    });
    const formData = new FormData();
    //  formData.append('token',token);
    formData.append('file', file);
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    };

    axios
      .post(`${API_URL}/partner/imageUpload?token=${token}`, formData, config)
      .then(res => {
        console.log('res');
        console.log('res', res);
        if (res.status == 200) {
          if (res.data.error) {
            throw res.data.error;
          } else {
            this.setState({
              [key]: res.data.name,
            });
          }
        } else {
          throw res.data.error;
        }
      })
      .catch(err => {
        this.setState({
          notification: err.response ? err.response.data.error : err.toString(),
          [key]: '',
        });
        this.error();
      });
  }

  getUsers = () => {
    axios
      .post(`${API_URL}/partner/listUsers`, { token, partner_id:this.state.partner_id  })
      .then(res => {
        if (res.status == 200) {
          this.setState({ loading: false, users: res.data.users, copyusers: res.data.users });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  getBranches = () => {
    axios
      .post(`${API_URL}/partner/listBranches`, { token, partner_id:this.state.partner_id })
      .then(res => {
        if (res.status == 200) {
          this.setState({ branches: res.data.branches });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  checkBtn = event => {
    const target = event.target;
    const tid = target.getAttribute('data-id');
    if (target.classList.contains('active')) {
      target.classList.remove('active');
      this.setState({
        [tid]: false,
      });
    } else {
      target.classList.add('active');
      this.setState({
        [tid]: true,
      });
    }

    console.log();
  };

  componentDidMount() {
    if (token !== undefined && token !== null) {
      this.getUsers();
      this.getBranches();
    } else {
      // alert('Login to continue');
      // this.setState({loading: false, redirect: true });
    }
  }

  searchlistfunction = (value) => {
    console.log(value)
    // console.log(this.state.searchrules)
    const newfilterdata = this.state.copyusers.filter(element =>
      element.name.toLowerCase().includes(value.toLowerCase()),
    );

    this.setState({ users: newfilterdata })

  }

  render() {
    const ep = this;
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

    const { loading, redirect } = this.state;
    if (loading) {
      return <Loader fullPage />;
    }
    if (redirect) {
      return <Redirect to="/" />;
    }
    const dis = this;

    return (
      <Wrapper from="bank">
        <Helmet>
          <meta charSet="utf-8" />
          <title>Users | PARTNER | E-WALLET</title>
        </Helmet>
        <PartnerHeader active="bankusers" />
        <Container verticalMargin>
          <SidebarBank />
          <Main>
            <ActionBar
              marginBottom="33px"
              inputWidth="calc(100% - 241px)"
              className="clr"
              style={{ display: this.state.admin === true ? 'none' : ''}}
            >
              <div className="iconedInput fl">
                <i className="material-icons">search</i>
                <input type="text" placeholder="Search Partner User" onChange={(e) => {
                  this.searchlistfunction(e.target.value)
                }} />
              </div>

              <Button className="addBankButton" flex onClick={this.showPopup}>
                <i className="material-icons">add</i>
                <span>Add User</span>
              </Button>
            </ActionBar>
            <div className="cardBody clr">
              {this.state.users && this.state.users.length > 0
                ? this.state.users.map(function (b) {
                  if (!b.isAdmin) {
                    var pic =
                      b.logo && b.logo != '' && b.logo != undefined
                        ? STATIC_URL + b.logo
                        : CONTRACT_URL + 'main/default-profile.png';
                    return (
                      <Card
                        key={b._id}
                        col
                        horizontalMargin="10px"
                        cardWidth="192px"
                      >
                        <div className="profile">
                          <img src={pic} />
                        </div>
                        <Row>
                          <Col cW="80%">
                            <h4 className="hh">{b.name}</h4>
                          </Col>
                          <Col cW="20%">
                            <Button
                              noMin
                              style={{ display: dis.state.admin === true ? 'none' : ''}}
                              className="fr"
                              onClick={() => ep.showEditPopup(b)}
                            >
                              Edit
                              </Button>
                          </Col>
                        </Row>
                      </Card>
                    );
                  }
                })
                : null}
            </div>
          </Main>
        </Container>
        {this.state.popup ? (
          <Popup close={this.closePopup.bind(this)} accentedH1>
            {this.state.showOtp ? (
              <div>
                <h1 ><FormattedMessage {...messages.verify} /></h1>
                <form action="" method="post" onSubmit={this.verifyOTP} >
                  <FormGroup>
                    <label><FormattedMessage {...messages.otp} />*</label>
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
                  {
                    this.state.addBranchLoading ?
                      <Button filledBtn marginTop="50px" disabled>
                        <Loader />
                      </Button>
                      :
                      <Button filledBtn marginTop="50px">
                        <span><FormattedMessage {...messages.verify} /></span>
                      </Button>
                  }


                  <p className="resend">Wait for <span className="timer">{this.state.timer}</span> to {this.state.resend ? <span className="go" onClick={this.generateOTP}>Resend</span> : <span>Resend</span>}</p>


                </form>
              </div>
            ) : (
                <div>
                  <h1>Create User</h1>
                  <form action="" method="post" onSubmit={this.addUser}>
                    <FormGroup>
                      <label>
                        <FormattedMessage {...messages.popup1} />*
                    </label>
                      <TextInput
                        type="text"
                        name="name"
                        pattern=".{4,15}"
                        title="Minimum 4 characters"
                        onFocus={inputFocus}
                        onBlur={inputBlur}
                        value={this.state.name}
                        onChange={this.handleInputChange}
                        required
                      />
                    </FormGroup>
                    <FormGroup>
                      <label>Email*</label>
                      <TextInput
                        type="email"
                        name="email"
                        onFocus={inputFocus}
                        onBlur={inputBlur}
                        value={this.state.email}
                        onChange={this.handleInputChange}
                        required
                      />
                    </FormGroup>
                    <FormGroup mR="10%" mL="10%">
                      <label className="focused">Role*</label>
                      <SelectInput
                        type="text"
                        name="role"
                        value={this.state.role}
                        onFocus={inputFocus}
                        onBlur={inputBlur}
                        onChange={this.handleInputChange}
                        required
                      >

                        <option value="user">User</option>
                        <option value="partnerAdmin">Partner Admin</option>
                        <option value="branchAdmin">Branch Admin</option>
                      </SelectInput>
                    </FormGroup>

                    <Row>
                      <Col cW="30%" mR="2%">
                        <FormGroup>
                          <label>
                            Country Code*
                        </label>
                          <TextInput
                            type="text"
                            name="ccode"

                            onFocus={inputFocus}
                            onBlur={inputBlur}
                            value={this.state.ccode}
                            onChange={this.handleInputChange}
                            required
                          />
                        </FormGroup>
                      </Col>
                      <Col cW="68%">
                        <FormGroup>
                          <label>
                            <FormattedMessage {...messages.popup7} />*
                        </label>
                          <TextInput
                            type="text"
                            pattern="[0-9]{10}"
                            title="10 Digit numeric value"
                            name="mobile"

                            onFocus={inputFocus}
                            onBlur={inputBlur}
                            value={this.state.mobile}
                            onChange={this.handleInputChange}
                            required
                          />
                        </FormGroup>
                      </Col>
                    </Row>

                    <FormGroup>
                      <label>User Id*</label>
                      <TextInput
                        type="text"
                        name="username"
                        pattern=".{4,15}"
                        title="Minimum 4 characters"
                        onFocus={inputFocus}
                        onBlur={inputBlur}
                        value={this.state.username}
                        onChange={this.handleInputChange}
                        required
                      />
                    </FormGroup>

                    <FormGroup>
                      <label>Temporary Password*</label>
                      <TextInput
                        type="password"
                        pattern=".{8,}"
                        title="Minimum 8 Characters"
                        name="password"
                        onFocus={inputFocus}
                        onBlur={inputBlur}
                        value={this.state.password}
                        onChange={this.handleInputChange}
                        required
                      />
                    </FormGroup>
                    {this.state.role !== 'partnerAdmin' ? (
                      <FormGroup>
                        <SelectInput
                          type="text"
                          name="branch_id"
                          value={this.state.branch_id}
                          onChange={this.handleInputChange}
                          required
                        >
                          <option value="">Select Branch*</option>
                          {this.state.branches && this.state.branches.length > 0
                            ? this.state.branches.map(function (b) {
                              return <option value={b._id} key={b._id}>{b.name}</option>;
                            })
                            : null}
                        </SelectInput>
                      </FormGroup>
                    ):''}
                    
                    <FormGroup>
                      {/* <UploadedFile>

                      <i className="material-icons" onClick={() => this.removeFile('logo')}>close</i>
                    </UploadedFile>
                  : */}
                      <UploadArea bgImg={STATIC_URL + this.state.logo}>
                        {this.state.logo ? (
                          <a
                            className="uploadedImg"
                            href={STATIC_URL + this.state.logo}
                            target="_BLANK"
                          />
                        ) : (
                            ' '
                          )}
                        <div
                          className="uploadTrigger"
                          onClick={() => this.triggerBrowse('logo')}
                        >
                          <input
                            type="file"
                            id="logo"
                            onChange={this.onChange}
                            data-key="logo"
                          />
                          {!this.state.logo ? (
                            <i className="material-icons">cloud_upload</i>
                          ) : (
                              ' '
                            )}
                          <label>
                            {this.state.logo == '' ? (
                              <span>Profile Photo</span>
                            ) : (
                                <span>Change Profile Photo</span>
                              )}
                          *
                        </label>
                        </div>
                      </UploadArea>
                    </FormGroup>
                    {this.state.verifyaccess === true || this.state.verifyaccess==='true'? (
                      <FormGroup mR="10%" mL="10%">
                      <Row>
                            <Col cW="4%">
                                <TextInput
                                  type="checkbox"
                                  value={this.state.verify_user_access}
                                  checked={this.state.verify_user_access}
                                  name="verify_user_access"
                                  style={{ margin: 'revert', height:"20px", width:"20px" }}
                                  onClick={(e)=>{this.handleVerifyChange(e)}}
                                />
                            </Col>
                            <Col cW="1%"></Col>
                            <Col cW="95%">Verify User Access</Col>
                      </Row>
                    </FormGroup>
                    ):''}
                    
                    <Icon className="material-icons">fingerprint</Icon>
                    {this.state.addUserLoading ? (
                      <Button filledBtn marginTop="20px" disabled>
                        <Loader />
                      </Button>
                    ) : (
                        <Button filledBtn marginTop="20px">
                          <span>Add User</span>
                        </Button>
                      )}
                  </form>
                </div>
              )}
          </Popup>
        ) : null}

        {this.state.editPopup ? (
          <Popup close={this.closePopup.bind(this)} accentedH1>
            {this.state.showEditOtp ? (
              <div>
                <h1>
                  <FormattedMessage {...messages.verify} />
                </h1>
                <form action="" method="post" onSubmit={this.verifyEditOTP}>
                  <FormGroup>
                    <label>
                      <FormattedMessage {...messages.otp} />*
                    </label>
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
                  {this.verifyEditOTPLoading ? (
                    <Button filledBtn marginTop="50px" disabled>
                      <Loader />
                    </Button>
                  ) : (
                      <Button filledBtn marginTop="50px">
                        <span>
                          <FormattedMessage {...messages.verify} />
                        </span>
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
            ) : (
                <div>
                  <h1>Edit User</h1>
                  <form action="" method="post" onSubmit={this.editUser}>
                    <FormGroup>
                      <label>
                        <FormattedMessage {...messages.popup1} />*
                    </label>
                      <TextInput
                        type="text"
                        name="name"
                        pattern=".{4,15}"
                        title="Minimum 8 Characters"
                        onFocus={inputFocus}
                        autoFocus
                        onBlur={inputBlur}
                        value={this.state.name}
                        onChange={this.handleInputChange}
                        required
                      />
                    </FormGroup>
                    <FormGroup>
                      <label>Email*</label>
                      <TextInput
                        type="email"
                        name="email"
                        onFocus={inputFocus}
                        onBlur={inputBlur}
                        autoFocus
                        value={this.state.email}
                        onChange={this.handleInputChange}
                        required
                      />
                    </FormGroup>
                    <FormGroup mR="10%" mL="10%">
                      <label className="focused">Role*</label>
                      <SelectInput
                        type="text"
                        name="role"
                        onFocus={inputFocus}
                        onBlur={inputBlur}
                        value={this.state.role}
                        onChange={this.handleInputChange}
                        required
                      >

                        {/* <option value="">Select Role*</option> */}
                        <option value="user">User</option>
                        <option value="partnerAdmin">Partner Admin</option>
                        <option value="branchAdmin">Branch Admin</option>
                      </SelectInput>
                    </FormGroup>
                    <Row>
                      <Col cW="30%" mR="2%">
                        <FormGroup>
                          <label>
                            Country Code*
                        </label>
                          <TextInput
                            type="text"
                            name="ccode"
                            autoFocus
                            onFocus={inputFocus}
                            onBlur={inputBlur}
                            value={this.state.ccode}
                            onChange={this.handleInputChange}
                            required
                          />
                        </FormGroup>
                      </Col>
                      <Col cW="68%">
                        <FormGroup>
                          <label>
                            <FormattedMessage {...messages.popup7} />*
                        </label>
                          <TextInput
                            type="text"
                            pattern="[0-9]{10}"
                            title="10 Digit numeric value"
                            name="mobile"
                            autoFocus
                            onFocus={inputFocus}
                            onBlur={inputBlur}
                            value={this.state.mobile}
                            onChange={this.handleInputChange}
                            required
                          />
                        </FormGroup>
                      </Col>
                    </Row>

                    <FormGroup>
                      <label>User Id*</label>
                      <TextInput
                        type="text"
                        pattern=".{4,15}"
                        title="Minimum 4 Characters"
                        name="username"
                        onFocus={inputFocus}
                        autoFocus
                        onBlur={inputBlur}
                        value={this.state.username}
                        onChange={this.handleInputChange}
                        required
                      />
                    </FormGroup>

                    <FormGroup>
                      <label>Temporary Password*</label>
                      <TextInput
                        type="password"
                        pattern=".{8,}"
                        title="Minimum 8 Characters"
                        name="password"
                        onFocus={inputFocus}
                        autoFocus
                        onBlur={inputBlur}
                        value={this.state.password}
                        onChange={this.handleInputChange}
                        required
                      />
                    </FormGroup>
                    {this.state.role !== 'partnerAdmin' ? (
                    <FormGroup>
                      <SelectInput
                        type="text"
                        name="branch_id"
                        value={this.state.branch_id}
                        onChange={this.handleInputChange}
                        required
                      >
                        <option value="">Select Branch*</option>
                        {this.state.branches && this.state.branches.length > 0
                          ? this.state.branches.map(function (b) {
                            return <option value={b._id} key={b._id}>{b.name}</option>;
                          })
                          : null}
                      </SelectInput>
                    </FormGroup>
                    ):''}
                    <FormGroup>
                      {/* <UploadedFile>

                      <i className="material-icons" onClick={() => this.removeFile('logo')}>close</i>
                    </UploadedFile>
                  : */}
                      <UploadArea bgImg={STATIC_URL + this.state.logo}>
                        {this.state.logo ? (
                          <a
                            className="uploadedImg"
                            href={STATIC_URL + this.state.logo}
                            target="_BLANK"
                          />
                        ) : (
                            ' '
                          )}
                        <div
                          className="uploadTrigger"
                          onClick={() => this.triggerBrowse('logo')}
                        >
                          <input
                            type="file"
                            id="logo"
                            onChange={this.onChange}
                            data-key="logo"
                          />
                          {!this.state.logo ? (
                            <i className="material-icons">cloud_upload</i>
                          ) : (
                              ' '
                            )}
                          <label>
                            {this.state.logo == '' ? (
                              <span>Profile Photo</span>
                            ) : (
                                <span>Change Profile Photo</span>
                              )}
                          *
                        </label>
                        </div>
                      </UploadArea>
                    </FormGroup>
                    {this.state.verifyaccess === true || this.state.verifyaccess==='true'? (
                      <FormGroup mR="10%" mL="10%">
                      <Row>
                            <Col cW="4%">
                                <TextInput
                                  type="checkbox"
                                  value={this.state.verify_user_access}
                                  checked={this.state.verify_user_access}
                                  name="verify_user_access"
                                  style={{ margin: 'revert', height:"20px", width:"20px" }}
                                  onClick={(e)=>{this.handleVerifyChange(e)}}
                                />
                            </Col>
                            <Col cW="1%"></Col>
                            <Col cW="95%">Verify User Access</Col>
                      </Row>
                    </FormGroup>
                    ):''}
                    <Icon className="material-icons">fingerprint</Icon>

                    <Button filledBtn marginTop="20px">
                      <span>Update User</span>
                    </Button>
                  </form>
                </div>
              )}
          </Popup>
        ) : null}
      </Wrapper>
    );
  }
}
