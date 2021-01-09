import React, { Component } from 'react';
import Row from './Row';
import Col from './Col';
import Container from './Container';

const username = localStorage.getItem('cashierUserName');
const partnerName = localStorage.getItem('partnerName');
const branchName = localStorage.getItem('branchName');
const cashier = localStorage.getItem('cashierName');
const date = new Date();
export class Reciept extends Component {
  componentDidMount() {
    console.log(this.props.values);
  }
    render() {
      return (
      <Container>
        <Row vAlign="flex-start">
          <Col cW="100%">
         
          <div
              style={{
              fontSize: '34px',
              fontWeight: 'bold',
              padding: '13px 0px',
              textAlign: 'center',
              color: '#417505',
            }}
          >
              {this.props.values.type} Transaction Receipt
            </div>
          <hr style={{border: '1px solid black'}}></hr>
          <Row>
            <Col cW="33.33%">
              <Row>
                <Col className="popInfoLeft">Transaction ID :</Col>
                  <Col className="popInfoRight">
                    67648821974200954
                </Col>
              </Row>
              <Row>
                <Col className="popInfoLeft">Bank Partner Name :</Col>
                <Col className="popInfoRight">
                   {partnerName}
                </Col>
              </Row>
            </Col>
            <Col cW="33.33%">
              <Row>
                <Col className="popInfoLeft">Branch Name :</Col>
                  <Col className="popInfoRight">
                    {branchName}
                </Col>
              </Row>
              <Row>
                <Col className="popInfoLeft">Cashier Name :</Col>
                <Col className="popInfoRight">
                  {username}
                </Col>
              </Row>
            </Col>
            <Col cW="33.33%">
              <Row>
                <Col className="popInfoLeft">Transaction Date :</Col>
                  <Col className="popInfoRight">
                    {date.toLocaleDateString('en-US')}
                </Col>
              </Row>
              <Row>
                <Col className="popInfoLeft">Amount :</Col>
                <Col className="popInfoRight">
                  {this.props.values.receiverIdentificationAmount}
                </Col>
              </Row>
            </Col>
          </Row>
          </Col>
        </Row>
        <hr style={{border: '1px solid black'}}></hr>
        <Row vAlign="flex-start">
          <Col
            sm="12"
            md="4"
            style={{
              // display: this.state.sender_id ? 'block' : 'none',
              display: 'block,'
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
                {this.props.values.mobile}
              </Col>
              </Row>
            <Row>
              <Col className="popInfoLeft">Given Name</Col>
               <Col className="popInfoRight">
                              {this.props.values.givenname}
                            </Col>
                          </Row>
                          <Row>

                            <Col className="popInfoLeft">Family Name</Col>
                            <Col className="popInfoRight">
                              {this.props.values.familyname}
                            </Col>
                          </Row>
                          <Row>
                            <Col className="popInfoLeft">Address</Col>
                            <Col className="popInfoRight">
                              {this.props.values.address1}
                            </Col>
                          </Row>
                          <Row>
                            <Col className="popInfoLeft">State</Col>
                            <Col className="popInfoRight">
                              {this.props.values.state}
                            </Col>
                          </Row>
                          <Row>
                            <Col className="popInfoLeft">Zip Code</Col>
                            <Col className="popInfoRight">{this.props.values.zip}</Col>
                          </Row>
                          <Row>
                            <Col className="popInfoLeft">Country</Col>
                            <Col className="popInfoRight">
                              {this.props.values.country}
                            </Col>
                          </Row>
                          <Row>
                            <Col className="popInfoLeft">Email ID</Col>
                            <Col className="popInfoRight">
                              {this.props.values.email}
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
                              {this.props.values.receiverMobile}
                            </Col>
                          </Row>
                          <Row>
                            <Col className="popInfoLeft">Given Name</Col>
                            <Col className="popInfoRight">
                              {this.props.values.receiverGivenName}
                            </Col>
                          </Row>
                          <Row>
                            <Col className="popInfoLeft">Family Name</Col>
                            <Col className="popInfoRight">
                              {this.props.values.receiverFamilyName}
                            </Col>
                          </Row>
                          <Row>
                            <Col className="popInfoLeft">Country</Col>
                            <Col className="popInfoRight">
                              {this.props.values.receiverCountry}
                            </Col>
                          </Row>
                          <Row>
                            <Col className="popInfoLeft">Email ID</Col>
                            <Col className="popInfoRight">
                              {this.props.values.receiverEmail}
                            </Col>
                          </Row>
                          <Row /> <Row /> <Row />
                        </Col>
                      </Row>
                      <hr style={{border: '1px solid black'}}></hr>
                      <Row>
                        <Col >
                      <div
                            style={{
                              fontSize: '20px',
                              fontWeight: 'bold',
                              padding: '13px 0px',
                              color: '#417505',
                            }}
                            >
                            Signature: ____________________
                          </div>
                        </Col>
                        <Col></Col>

                      </Row>
      </Container>
      );
    }
  }
