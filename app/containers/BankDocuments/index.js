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
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

import Wrapper from 'components/Wrapper';
import PartnerHeader from 'components/Header/PartnerHeader';
import Container from 'components/Container';
import BankSidebarTwo from 'components/Sidebar/BankSidebarTwo';
import Main from 'components/Main';
import Card from 'components/Card';
import Button from 'components/Button';
import MiniPopUp from 'components/MiniPopUp';
import FormGroup from 'components/FormGroup';
import TextInput from 'components/TextInput';
import Row from 'components/Row';
import Loader from 'components/Loader';
import Col from 'components/Col';

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

const Tab = styled.div`
background: ${props => props.theme.primary};
width: 194px;
padding: 15px;
float:left;
border: 1px solid  ${props => props.theme.primary};
color: #fff;
font-size: 20px;
`;
const Tab2 = styled.div`
float:left;
width: 194px;
border: 1px solid  ${props => props.theme.primary};
color: ${props => props.theme.primary};
font-size: 20px;
padding: 15px;
`;

// const ActiveTab = styled.div`
// background: ${props => props.theme.primary};
// width: 194px;
// padding: 15px;
// float:left;
// border: 1px solid  ${props => props.theme.primary};
// color: #fff;
// font-size: 20px;
// `;

const token = localStorage.getItem('bankLogged');
const bid = localStorage.getItem('bankId');
console.log(bid);
export default class BankDocuments extends Component {
  constructor() {
    super();
    this.state = {
      sid: '',
      bank: bid,
      bank_id: bid,
      name: '',
      address1: '',
      popname: '',
      poprange: '',
      poptype: '',
      poppercent: '',
      state: '',
      zip: '',
      country: '',
      ccode: '',
      mobile: '',
      email: '',
      logo: null,
      contract: null,
      loading: true,
      redirect: false,
      totalBanks: 0,
      notification: 'Welcome',
      popup: false,
      user_id: token,
      banks: [],
      rules: [],
      docs: [],
      
      otp: '',
      showOtp: false
    };
    this.success = this.success.bind(this);
    this.error = this.error.bind(this);
    this.warn = this.warn.bind(this);
    this.showMiniPopUp = this.showMiniPopUp.bind(this);

    this.onChange = this.onChange.bind(this);
    this.fileUpload = this.fileUpload.bind(this);
  }

  success = () => toast.success(this.state.notification);

  error = () => toast.error(this.state.notification);

  warn = () => toast.warn(this.state.notification);

  handleInputChange = event => {
    const { value, name } = event.target;
    this.setState({
      [name]: value,
    });
  };

  showMiniPopUp = event => {
    this.setState({ popup: true });
    var id = event.target.getAttribute("data-id");
    var d =  event.target.getAttribute("data-d");
    console.log(id);
    var dd = d.split("^");
    this.setState({ popname: dd[0], poptype: dd[1], poprange: dd[2], poppercent: dd[3], sid: id });
    //this.props.history.push('/createfee/'+this.state.bank_id);
  };

  closeMiniPopUp = () => {
    this.setState({
      popup: false,
      name: '',
      address1: '',
      state: '',
      zip: '',
      ccode: '',
      country: '',
      email: '',
      mobile: '',
      logo: null,
      contract: null,
      otp: '',
      showOtp: false
    });
  };

  logout = () => {
    // event.preventDefault();
    // axios.post(API_URL+'/logout', {token: token})
    // .then(res => {
    //    if(res.status == 200){
    localStorage.removeItem("logged");
    localStorage.removeItem("name");
    this.setState({ redirect: true });
    //     }else{
    //       const error = new Error(res.data.error);
    //       throw error;
    //     }
    // })
    // .catch(err => {
    //   alert('Login to continue');
    //   this.setState({ redirect: true });
    // });
  };

  addBank = event => {
    event.preventDefault();
    axios
      .post(`${API_URL  }/generateOTP`, {
        name: this.state.name,
        mobile: this.state.mobile,
        page: 'addBank',
        token,
      })
      .then(res => {
        if(res.status == 200){
          if(res.data.error){
            throw res.data.error;
          }else{
            this.setState({
              showOtp: true,
              notification: 'OTP Sent'
            });
            this.success();
          }
        }else{
          const error = new Error(res.data.error);
          throw error;
        }
      })
      .catch(err => {
        this.setState({
          notification: (err.response) ? err.response.data.error : err.toString()
        });
        this.error();
      });
  };

  approve = event => {
    event.preventDefault();
    axios
      .post(`${API_URL  }/approveFee`, {
        id: this.state.sid,
        token,
      })
      .then(res => {
        if(res.status == 200){
          if(res.data.error){
            throw res.data.error;
          }else{
            this.setState({
              notification: 'Approved'
            });
            this.success();
            
          }
        }else{
          const error = new Error(res.data.error);
          throw error;
        }
      })
      .catch(err => {
        this.setState({
          notification: (err.response) ? err.response.data.error : err.toString()
        });
        this.error();
        
      });
  };

  decline = event => {
    event.preventDefault();
    axios
      .post(`${API_URL  }/declineFee`, {
        id: this.state.sid,
        token,
      })
      .then(res => {
        if(res.status == 200){
          if(res.data.error){
            throw res.data.error;
          }else{
            this.setState({
              notification: 'Declined'
            });
            this.success();
            
          }
        }else{
          const error = new Error(res.data.error);
          throw error;
        }
      })
      .catch(err => {
        this.setState({
          notification: (err.response) ? err.response.data.error : err.toString()
        });
        this.error();
      });
  };


  showWallet = event => {
    event.preventDefault();
    
  };

  verifyOTP = event => {
    event.preventDefault();
    axios
      .post(`${API_URL  }/addBank`, {
        name: this.state.name,
        address1: this.state.address1,
        state: this.state.state,
        zip: this.state.zip,
        country: this.state.country,
        ccode: this.state.ccode,
        email: this.state.email,
        mobile: this.state.mobile,
        logo: this.state.logo,
        contract: this.state.contract,
        otp: this.state.otp,
        token,
      })
      .then(res => {
        if(res.status == 200){
          if(res.data.error){
            throw res.data.error;
          }else{
            this.setState({
              notification: "Bank added successfully!",
            });
            this.success();
            this.closeMiniPopUp();
            this.getBanks();
          }
        }else{
          const error = new Error(res.data.error);
          throw error;
        }
      })
      .catch(err => {
        this.setState({
          notification: (err.response) ? err.response.data.error : err.toString()
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
      this.fileUpload(e.target.files[0], e.target.getAttribute("data-key"));
    }
  }

  fileUpload(file, key) {
    const formData = new FormData();
    //  formData.append('token',token);
    formData.append('file', file);
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      },
    };

    axios
      .post(`${API_URL  }/fileUpload?token=${  token}`, formData, config)
      .then(res => {
        if(res.status == 200){
          if(res.data.error){
            throw res.data.error;
          }else{
            this.setState({
              [key] : res.data.name
            });
          }
        }else{
          throw res.data.error;
        }
      })
      .catch(err => {
        this.setState({
          notification: (err.response) ? err.response.data.error : err.toString()
        });
        this.error();
      });
  }

  getBanks = () => {

  };

  getRules = () => {
    axios
      .post(`${API_URL  }/getBankRules`, { bank_id: this.state.bank })
      .then(res => {
        if(res.status == 200){
          
          this.setState({ rules: res.data.rules });
        }
      })
      .catch(err => {
        
      });
  };

  getDocs = () => {
    axios
      .post(`${API_URL  }/getDocs`, { bank_id: this.state.bank_id })
      .then(res => {
        
        if(res.status == 200){
          this.setState({ loading: false, docs: res.data.docs }, function(){
            console.log(this.state.docs);
          });
        }
      })
      .catch(err => {
        
      });
  };
  

  componentDidMount() {
    
    if (token !== undefined && token !== null) {
      
      this.getBanks();
      this.getDocs();
    } else {
      // alert('Login to continue');
      // this.setState({loading: false, redirect: true });
    }
  }

  render() {
    
    function inputFocus(e) {
      const { target } = e;
      target.parentElement.querySelector("label").classList.add("focused");
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
      return null;
    }
    const dis = this;
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return (
      
      <Wrapper  from="bank">
        <Helmet>
          <meta charSet="utf-8" />
          <title>Banks | INFRA | E-WALLET</title>
        </Helmet>
        <PartnerHeader />
        <Container verticalMargin>
          <BankSidebarTwo active="documents" />
          <Main>

            <Card bigPadding>

              <div className="cardBody clr">
              <h3>FILES</h3>
              {
                  
                  this.state.docs && this.state.docs.length > 0
                    ? this.state.docs.map(function(b) {
                      var filename = b.contract.replace(/^.*[\\\/]/, '');
                      var ext = b.contract.split('.').pop();
                      var icon = (ext == 'pdf') ? STATIC_URL+'main/pdf-icon.png' : STATIC_URL+'main/pdf-icon.png';
                      var isoformat = b.created_at;
                      var readable = new Date(isoformat);
                      var m = readable.getMonth(); // returns 6
                      var d = readable.getDay();  // returns 15
                      var y = readable.getFullYear();
                      var h = readable.getHours();
                      var mi = readable.getMinutes();
                      var mlong = months[m];
                      var fulldate = d + " " + mlong + " " + y+ " " + h+ ":" + mi;
                      return <Card key={b._id} blueHover col horizontalMargin="10px" cardWidth="192px" className="doc">
                        <a href={CONTRACT_URL+b.contract} target="_blank">
                        <div className="profile">
                          <img src={icon} />
                          </div>
                          <h4 className="hhh">{filename}</h4>
                          <h4 className="hhhh">{fulldate}</h4>
                          </a>
                      </Card>
                      
                    })
                    :
                    null
                }
              </div>
            </Card>
          </Main>
        </Container>
        { this.state.popup ? 
          <MiniPopUp close={this.closeMiniPopUp.bind(this)}>
            {
              this.state.showOtp ?
              <div>
              <h1><FormattedMessage {...messages.verify} /></h1>
            <form >
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
              <Button filledBtn marginTop="50px">
                <span><FormattedMessage {...messages.verify} /></span>
              </Button>
              </form>
              </div>
              :
              <div>
            
            <form >
              <p><span  id="popname">{this.state.popname}</span></p>
              <p > Sending from <span id="poptype">{this.state.poptype}</span></p>
              <p > Transaction range<span id="poprange">{this.state.poprange}</span></p>
              <p > Fee <span id="poppercent">{this.state.poppercent}</span> &nbsp; &nbsp; Priority: <span>100</span></p>
                         <Row>
                  <Col>
                  <FormGroup>
                  <Button filledBtn marginTop="50px" accentedBtn onClick={this.decline}>
                <span>Decline</span>
              </Button >
                  </FormGroup>
                  </Col>
                  <Col>
                  <FormGroup>
                  <Button filledBtn marginTop="50px"  onClick={this.approve}>
                <span>Approve</span>
              </Button>
                  </FormGroup>
                  </Col>
                </Row>

              
            </form>
            </div>
            }
          </MiniPopUp>
          : null }
      </Wrapper>
    );
  }
}
