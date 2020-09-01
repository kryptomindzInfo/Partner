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

import Wrapper from 'components/Wrapper';
import Container from 'components/Container';
import A from 'components/A';
import Main from 'components/Main';
import Card from 'components/Card';
import Button from 'components/Button';
import FormGroup from 'components/FormGroup';
import TextInput from 'components/TextInput';
import SelectInput from 'components/SelectInput';
import Row from 'components/Row';
import Col from 'components/Col';
import styled from 'styled-components';
import Loader from 'components/Loader';
import PartnerHeader from 'components/Header/PartnerHeader';
import BankSidebarTwo from 'components/Sidebar/BankSidebarTwo';
import { API_URL } from '../App/constants';

import 'react-toastify/dist/ReactToastify.css';

const H4 = styled.h4 `
 > span{
   font-size: 13px;
   color: #666;
 }
`;

toast.configure({
  position: 'bottom-right',
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
});

const token = localStorage.getItem('bankLogged');
const rid = localStorage.getItem('feeid');

const bid = localStorage.getItem('bankId');

export default class BankEditFee extends Component {
  constructor() {
    super();
    this.state = {
      bank_id: bid,
      logo: null,
      rule_id : rid,
      contract: null,
      loading: true,
      redirect: false,
      name: '',
      trans_type: '',
      active: 'Active',
      trans_from: '',
      trans_to: '',
      transcount_from: '',
      transcount_to: '',
      fixed_amount: '',
      percentage: '',
      notification: '',
      popup: false,
      user_id: token,
      banks: [],
      ranges: [],
      otp: '',
      showOtp: false,
      token: token,
      permissions: {}
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
    console.log(event);
    const { value, name } = event.target;
    this.setState({
      [name]: value,
    });
  };

  showPopup = () => {
    //this.setState({ popup: true });
    this.props.history.push('/createfee/'+this.props.match.params.bank);
  };

  closePopup = () => {
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
  addRange = () => {
    var temp = this.state.ranges;
    var l = temp.length;
    var last = temp[l-1].trans_to;
    if(last == ''){
      this.setState({
        notification: "Fill previous range first"
      }, () =>{
        this.error();
      });
    }
    else if(last <= temp[l-1].trans_from){
      this.setState({
        notification: "To value has to be greater than From value in all ranges"
      }, () =>{
        this.error();
      });
    }
    else{
      last = Number(last)+1;
    temp.push({
        trans_from: last,
        trans_to: '999999999',
        fixed_amount: '',
        percentage: ''
    });
    this.setState({
      ranges : temp
    });
  }
  };
  handleInputChange2 = event => {
    // console.log(k);

    const { value, name } = event.target;
    var temp = this.state.ranges;
    var k = event.target.getAttribute("data-key");

     temp[k][name] = value;
     console.log(temp[k]);
    this.setState({
      ranges : temp
    });

    // this.setState({
    //   [name]: value,
    // });
  };
  removeRange = (k) => {
    console.log(k);
    // var dis = this;
    var temp = this.state.ranges;
    // delete temp[k];
    temp.splice(k, 1);
    this.setState({
      ranges : temp
    });
    // console.log(temp);
    // var out = [];

    // for(var i = 0; i < temp.length; i++){
    //   if(i != k){
    //     out.push(temp[i]);
    //   }
    //   if(i == (temp.length)-1){
    //     dis.setState({
    //       ranges : out
    //     });
    //   }
    // }

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

  createRules = event => {
    event.preventDefault();
    if((this.state.fixed_amount == '' && this.state.percentage == '') || this.state.fixed_amount != '' && this.state.percentage != ''){
      this.setState({
        notification: 'Fill either fixed amount or percentage'
      }, () => {
        this.error();
    });
    }else{
    axios
      .post(`${API_URL  }/createRules`, this.state)
      .then(res => {
        if(res.status == 200){
          if(res.data.error){
            throw res.data.error;
          }else{
            //console.log(res.data);
            this.setState({
              notification: 'Rule added'
            }, () => {
              this.success();
              let ba = this.state.bank;
              let history = this.props.history;
              setTimeout(function(){
                history.push('/fees/'+ba);
              }, 1000);
          });
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
    }
  };



  editRrRules = () => {
    // event.preventDefault();
    // if((this.state.fixed_amount == '' && this.state.percentage == '') || this.state.fixed_amount != '' && this.state.percentage != ''){
    //   this.setState({
    //     notification: 'Fill either fixed amount or percentage'
    //   }, () => {
    //     this.error();
    // });
    // }else{
      this.setState({
        editRulesLoading: true
      });



      let {name, trans_type, active, ranges, bank_id, token, rrId:rule_id} = this.state;


    ranges = ranges.map(r => ({
          trans_from: r.trans_from,
          trans_to: r.trans_to,
          fixed_amount: r.revenue_sharing_fixed_amount,
          percentage: r.revenue_sharing_percentage,
    }));


    axios
      .post(`${API_URL  }/editRule`, {
        name,
        trans_type, active, ranges, bank_id, token, rule_id
      })
      .then(res => {
        if(res.status == 200){
          if(res.data.error){
            throw res.data.error;
          }else{
            //console.log(res.data);
            this.setState({
              notification: 'Rule updated'
            }, () => {
              this.success();
              let ba = this.state.bank;
              let history = this.props.history;
              setTimeout(function(){
                history.push('/bank/fees/');
              }, 1000);
          });
          }
        }else{
          const error = new Error(res.data.error);
          throw error;
        }
        this.setState({
          editRulesLoading: false
        });
      })
      .catch(err => {
        this.setState({
          notification: (err.response) ? err.response.data.error : err.toString(),
          editRulesLoading: false
        });
        this.error();
      });
    //}
  };






  editRules = event => {
    event.preventDefault();

      this.setState({
        editRulesLoading: true
      });
    axios
      .post(`${API_URL  }/editBankBankRule`, this.state)
      .then(res => {
        if(res.status == 200){
          if(res.data.error){
            throw res.data.error;
          }else{
            //console.log(res.data);
            this.setState({
              notification: 'Rule updated'
            }, () => {
              this.success();
              let ba = this.state.bank;
              let history = this.props.history;
              setTimeout(() => {
                history.push('/bank/fees/');
                // this.editRrRules()
              }, 1000);
          });
          }
        }else{
          const error = new Error(res.data.error);
          throw error;
        }
        this.setState({
          editRulesLoading: false
        });
      })
      .catch(err => {
        this.setState({
          notification: (err.response) ? err.response.data.error : err.toString(),
          editRulesLoading: false
        });
        this.error();
      });
    //}
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
            this.closePopup();
            this.getBanks();
            this.getFees();
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
    axios
      .post(`${API_URL  }/getBank`, { token:token, bank_id: this.props.match.params.bank })
      .then(res => {
        if(res.status == 200){

          this.setState({ banks: res.data.banks, logo: res.data.banks.logo, bank_id: this.props.match.params.bank});
        }
      })
      .catch(err => {

      });
  };

  getRrFees = () => {
    axios.post(`${API_URL  }/getRule`, {token, rule_id: this.state.rrId }).then(res => {
      if(res.status == 200) {
        console.log(res.data);
        let {ranges} = state;
        ranges = ranges.map(r => ({
          ...r,
          revenue_sharing_fixed_amount: r.fixed_amount,
          revenue_sharing_percentage: r.percentage
        }))

        this.setState({ranges});

      }

    }).catch(err => {

    })
  }

  getFees = () => {
    axios
      .post(`${API_URL  }/getOne`, { token:token, page_id: this.state.rule_id, type: 'bank', page: 'bankfee' })
      .then(res => {
        if(res.status == 200){
          var temp = res.data.row.ranges;
          this.setState({ loading:false, name: res.data.row.name, trans_type: res.data.row.trans_type, active: res.data.row.active, ranges: temp, trans_from: res.data.row.trans_from, trans_to: res.data.row.trans_to}, ()=>{
            // this.getRrFees();
          });
        }
      })
      .catch(err => {
        this.setState({loading:false})
      });
  };



  componentDidMount() {
    this.setState({ rule_id: this.props.match.params.fee }, () => {
      // this.getBanks();
     this.getFees();
    });
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

    function onChange(event){
      console.log(event);
      // this.setState({
      //   trans_type: event.target.value
      // });
     }

    const { loading, redirect } = this.state;
    if (loading) {
      return <Loader fullPage />;
    }
    if (redirect) {
      return <Redirect to="/" />
    }
    const dis = this;
    return (
      <Wrapper>
        <Helmet>
          <meta charSet="utf-8" />
          <title>Create Fee | INFRA | E-WALLET</title>
        </Helmet>
        <PartnerHeader />
        <Container verticalMargin>
          <BankSidebarTwo active="fees" />
          <Main>
            <Card bigPadding >
              <div className="cardHeader" >
                <div className="cardHeaderLeft flex">
                  <A  href={"/bank/fees/"}>
                  <i className="material-icons">arrow_back</i>
                  </A>
                  <h3>Edit Fee Rule</h3>
                </div>
              </div>
              <div className="cardBody">
              <form action="" method="post" onSubmit={this.editRules}>
              <FormGroup>
                <label>Name*</label>
                <TextInput
                  type="text"
                  name="name"
                  onFocus={inputFocus}
                  onBlur={inputBlur}
                  value={this.state.name}
                  autoFocus
                  onChange={this.handleInputChange}
                  required
                />
              </FormGroup>

                <Row>
                  <Col>
                  <FormGroup>
                   <SelectInput
                    type="text"
                    name="trans_type"
                    value={this.state.trans_type}
                    autoFocus
                    onChange={this.handleInputChange.bind(this)}
                    required
                    list="ttype"
                  >
                       <option value="">Transaction Type*</option>
                    <option >Wallet to Wallet </option>
                    <option >Non Wallet to Non Wallet</option>
                    <option >Non Wallet to Wallet</option>
                    <option >Wallet to Non Wallet</option>
                    <option >Wallet to merchant</option>
                    <option >Non Wallet to Merchant</option>
                    <option >Wallet to Bank Account</option>
                    <option >Bank Account to Wallet Request</option>
                  </SelectInput>

                  </FormGroup>
                  </Col>
                  <Col>
                  <FormGroup>
                  <SelectInput
                    type="text"
                    name="active"
                    value={this.state.active}
                    autoFocus
                    onChange={this.handleInputChange}
                    required
                    list="act"
                  >
                     <option>Active</option>
                    <option>Inactive </option>
                  </SelectInput>
                  </FormGroup>
                  </Col>
                </Row>
                {/* <H4>Transaction Range</H4>
                  <Row>
                    <Col>
                      <FormGroup>
                      <TextInput
                      type="text"
                      name="trans_from"
                      onFocus={inputFocus}
                      onBlur={inputBlur}
                      value={this.state.trans_from}
                      onChange={this.handleInputChange}
                      placeholder="From"
                      required
                    />
                      </FormGroup>
                    </Col>
                    <Col>
                      <FormGroup>
                      <TextInput
                      type="text"
                      name="trans_to"
                      onFocus={inputFocus}
                      onBlur={inputBlur}
                      value={this.state.trans_to}
                      onChange={this.handleInputChange}
                      placeholder="To"
                      required
                    />
                      </FormGroup>
                    </Col>
                  </Row> */}

                <H4>Transaction Range</H4>
                {
                  this.state.ranges.map(function(v, i) {

                    return <Row key={i}>
                    <Col cW="20%" mR="2%">
                    <FormGroup>
                    <label>From*</label>
                    {
                        i > 0 ?
                        <TextInput
                        type="text"
                        name="trans_from"
                        onFocus={inputFocus}
                        onBlur={inputBlur}
                        value={v.trans_from}
                        onChange={dis.handleInputChange2}
                        data-key = {i}
                        autoFocus
                        readOnly
                        required
                      />
                        :
                        <TextInput
                        type="text"
                        pattern="[0-9]{1,}"
                        title="Greater than or equal to 0"
                        name="trans_from"
                        onFocus={inputFocus}
                        onBlur={inputBlur}
                        value={v.trans_from}
                        onChange={dis.handleInputChange2}
                        data-key = {i}
                        autoFocus
                        required
                      />
                      }

                    </FormGroup>
                    </Col>
                    <Col cW="20%" mR="2%">
                    <FormGroup>
                    <label>To*</label>
                    <TextInput
                       type="text"
                       pattern="[0-9]{1,}"
                       title="Greater than or equal to 0"
                      name="trans_to"
                      onFocus={inputFocus}
                      onBlur={inputBlur}
                      value={v.trans_to}
                      onChange={dis.handleInputChange2}
                      data-key = {i}
                      autoFocus
                      required
                    />
                    </FormGroup>
                    </Col>
                    <Col cW="26%" mR="2%">
                    <FormGroup>
                    <label>Fixed Amount*</label>
                    <TextInput
                      type="text"
                      name="fixed_amount"
                      onFocus={inputFocus}
                      required
                      onBlur={inputBlur}
                      value={v.fixed_amount}
                      autoFocus
                      onChange={dis.handleInputChange2}
                      data-key = {i}

                    />
                    </FormGroup>
                    </Col>
                    <Col cW="28%" mR="8%">
                    <FormGroup>
                    <label>Percentage*</label>
                    <TextInput
                    required
                      type="text"
                      name="percentage"
                      onFocus={inputFocus}
                      onBlur={inputBlur}
                      value={v.percentage}
                      autoFocus
                      onChange={dis.handleInputChange2}
                      data-key = {i}

                    />
                    </FormGroup>

                    {i > 0 ? (
                            <span
                              onClick={() => dis.removeRange(i)}
                              className="material-icons removeBtn pointer"
                            >
                              cancel
                            </span>
                          ) : null}
                    </Col>

                    {/* <Col cW="45%" mR="2%">
                        <FormGroup>
                            <label>Revenue Fixed Amount*</label>
                            <TextInput
                              required
                              type="text"
                              name="revenue_sharing_fixed_amount"
                              onFocus={inputFocus}
                              onBlur={inputBlur}
                              value={v.revenue_sharing_fixed_amount}
                              onChange={dis.handleInputChange2}
                              data-key={i}
                            />
                          </FormGroup>
                        </Col>
                        <Col cW="23%" mR="2%">
                        <FormGroup>
                            <label>Revenue %*</label>
                            <TextInput
                              required
                              type="text"
                              name="revenue_sharing_percentage"
                              onFocus={inputFocus}
                              onBlur={inputBlur}
                              value={v.revenue_sharing_percentage}
                              onChange={dis.handleInputChange2}
                              data-key={i}
                            />
                          </FormGroup> */}

                        {/* </Col> */}
                  </Row>
                  })
                }
                 <Button type="button" accentedBtn marginTop="10px" onClick={this.addRange}>
                <span>Add Another Range</span>
              </Button>
                {
                  this.state.editRulesLoading ?
                  <Button filledBtn marginTop="50px" disabled>
                <Loader />
              </Button>
                  :
                  <Button filledBtn marginTop="50px">
                <span>Update Rule</span>
              </Button>
                }

            </form>
              </div>
            </Card>
          </Main>
        </Container>

      </Wrapper>
    );
  }
}
