import React, { Component } from 'react';
import Row from 'components/Row';
import Col from 'components/Col';
import Container from 'components/Container';
import Table from 'components/Table';


const username = localStorage.getItem('cashierUserName');
const bankName = localStorage.getItem('bankName');
const branchName = localStorage.getItem('branchName');

export class InvoiceReciept extends Component {
  componentDidMount() {
    console.log(this.props.values);
  }
  getInvoiceList = () =>
    this.props.values.map((node,index) => (
      <tr key={node.invoice._id}>
        <td className="tac">{node.invoice.number}</td>
        <td className="tac">{node.invoice.amount}</td>
        <td className="tac">{node.penalty}</td>
        <td className="tac">
        {node.invoice.amount+node.penalty}</td>
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
              Paid Invoice Transaction Receipt
            </div>
          <hr style={{border: '1px solid black'}}></hr>
          <Row>
            <Col cW="33.33%">
              <Row>
                <Col cW="40%" className="popInfoLeft">Transaction ID :</Col>
                  <Col cW="60%" className="popInfoRight">
                    {this.props.values[0].invoice.transaction_code}
                </Col>
              </Row>
              <Row>
                <Col cW="40%" className="popInfoLeft">Bank Name :</Col>
                <Col  cW="60%" className="popInfoRight">
                   {bankName}
                </Col>
              </Row>
            </Col>
            <Col cW="33.33%">
              <Row>
                <Col cW="40%" className="popInfoLeft">Branch Name :</Col>
                  <Col  cW="60%" className="popInfoRight">
                    {branchName}
                </Col>
              </Row>
              <Row>
                <Col cW="40%" className="popInfoLeft">Cashier Name :</Col>
                <Col  cW="60%" className="popInfoRight">
                  {username}
                </Col>
              </Row>
            </Col>
            <Col cW="33.33%">
              <Row>
                <Col cW="40%" className="popInfoLeft">Transaction Date :</Col>
                  <Col  cW="60%" className="popInfoRight">
                    {new Date(this.props.values[0].invoice.date_paid).toLocaleDateString('en-US')}
                </Col>
              </Row>
              <Row>
                <Col cW="40%" className="popInfoLeft">Amount :</Col>
                <Col  cW="60%" className="popInfoRight">
                  {this.props.values[0].invoice.amount}
                </Col>
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
