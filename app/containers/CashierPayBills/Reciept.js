import React, { Component } from 'react';
import Row from '../../components/Row';
import Col from '../../components/Col';
import Container from '../../components/Container';
import Table from '../../components/Table';


const date = new Date();
const username = localStorage.getItem('cashierUserName');

export class Reciept extends Component {

  componentDidMount() {
    console.log(this.props.values);
  }
  getInvoiceList = () =>
    this.props.values.map((node,index) => (
      <tr key={node.invoice._id}>
        <td className="tac">{node.invoice.number}</td>
        <td className="tac">{node.invoice.amount}</td>
        <td className="tac">{node.penalty}</td>
        <td className="tac">{node.fee}</td>
        <td className="tac">
        {node.invoice.amount+node.penalty+node.fee}</td>
        <td className="tac">{node.invoice.due_date} </td>
        <td className="tac bold">
          <div
            style={{
              display: 'flex',
              cursor: 'pointer',
              justifyContent: 'center',
              color: 'green',
            }}
          >
            <span>
              Paid
            </span>
          </div>
        </td>
      </tr>
    ));
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
                <Col className="popInfoLeft">Bank Name :</Col>
                <Col className="popInfoRight">
                   ------------------
                </Col>
              </Row>
            </Col>
            <Col cW="33.33%">
              <Row>
                <Col className="popInfoLeft">Branch Name :</Col>
                  <Col className="popInfoRight">
                    ------------------
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
              </Row>
            </Col>
          </Row>
          </Col>
        </Row>
        <hr style={{border: '1px solid black'}}></hr>
        <Table marginTop="34px" smallTd>
          <thead>
            <tr>
              <th>Number</th>
              <th>Amount</th>
              <th>Penalty</th>
              <th>Fees</th>
              <th>Total Amount</th> 
              <th>Due Date</th>
              <th />
            </tr>
            </thead>
            <tbody>
              {this.getInvoiceList()}
            </tbody>
        </Table>
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
