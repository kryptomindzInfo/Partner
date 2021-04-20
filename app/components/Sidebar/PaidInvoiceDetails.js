import React, { useEffect, useState } from 'react';
import { Form, Formik } from 'formik';
import Table from 'components/Table';
import Button from 'components/Button';
import Row from 'components/Row';
import Col from 'components/Col';
import Popup from 'components/Popup';
import Container from 'components/Container';
import InvoiceTransactionReceipt from './InvoiceTransactionReciept';


const PaidInvoiceDetails = (props) => {
  const [receiptvalues, setreceiptvalues] = useState([{
    invoice: props.invoice,
    penalty: props.invoice.penalty,
  }]);
  const [receipt, setreceipt] = useState(false);
  const [invoice, setInvoice] = useState(props.invoice);
  const [totalAmount, setTotalAmount] = useState(
    invoice.items.reduce(function (a, b) {
      return a + b.quantity * b.item_desc.unit_price;
    }, 0),
  );
  const [totalTax, setTotalTax] = useState(
    invoice.items.reduce(function (a, b) {
      return a + (b.total_amount - b.quantity * b.item_desc.unit_price);
    }, 0),
  );

  const getItems = () =>
    invoice.items.map((item) => {
      return (
        <tr key={item._id}>
          <td className="tac">{item.item_desc.name}</td>
          <td className="tac">{item.item_desc.description}</td>
          <td className="tac">{item.item_desc.code}</td>
          <td className="tac">{item.item_desc.unit_of_measure}</td>
          <td className="tac">{item.item_desc.unit_price}</td>
          <td className="tac">{item.quantity}</td>
          <td className="tac">{item.quantity * item.item_desc.unit_price}</td>
          <td className="tac">{item.tax_desc.value}</td>
          <td className="tac">{item.total_amount}</td>
        </tr>
      );
    });

  const sumtotal2 = () => {
    return totalAmount + totalTax + invoice.penalty;
  };

  return (
    <div>
      {receipt ? (
        <InvoiceTransactionReceipt
        values={receiptvalues}
        close={props.close} 
      />
      ) : (
        <Popup accentedH1 bigBody close={props.close}>
        <Container>
                <Row style={{ marginBottom: '20px' }}>
                  <Col cW="40%"></Col>
                  <Col cW="10%">
                  <div className="cardHeaderRight">
                    <Button
                      onClick={()=>{setreceipt(true)}}
                    >
                      Transaction Receipt
                    </Button>
                  </div>
                  </Col>
                </Row>
                <Row>
                  <Col cW="33%">
                    <Row>
                      <Col className="popInfoLeft">Customer Code</Col>
                      {invoice.customer_code ? (
                        <Col className="popInfoRight">
                          {invoice.customer_code}
                        </Col>
                      ) : (
                        <Col className="popInfoRight">Passing by customer</Col>
                      )}
                    </Row>
                    <Row>
                      <Col className="popInfoLeft">Mobile</Col>
                      <Col className="popInfoRight">{invoice.mobile}</Col>
                    </Row>
                  </Col>
                  <Col cW="33%">
                    <Row>
                      <Col className="popInfoLeft">Bill No</Col>
                      <Col className="popInfoRight">{invoice.number}</Col>
                    </Row>
                    <Row>
                      <Col className="popInfoLeft">Bill Date</Col>
                      <Col className="popInfoRight">{invoice.bill_date}</Col>
                    </Row>
                  </Col>
                  <Col cW="33%">
                    <Row>
                      <Col className="popInfoLeft">Due Date</Col>
                      <Col className="popInfoRight">{invoice.due_date}</Col>
                    </Row>
                    <Row>
                      <Col className="popInfoLeft">Period</Col>
                      <Col className="popInfoRight">
                        {invoice.bill_period.period_name}
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row>
                  <Col cW="100%">
                    <Row />
                    <Table marginTop="34px" smallTd>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Description</th>
                          <th>Code</th>
                          <th>Unit of measure</th>
                          <th>Unit price</th>
                          <th>Quantity</th>
                          <th>Amount</th>
                          <th>Tax %</th>
                          <th>Amount with tax</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoice.items && invoice.items.length > 0
                          ? getItems()
                          : null}
                      </tbody>
                    </Table>
                    <Row style={{ marginTop: '8px' }}>
                      <Col cW="50%"></Col>
                      <Col cW="25%"></Col>
                      <Col cW="25%">
                        <Row>
                          <Col className="popInfoLeft">Total Amount</Col>
                          <Col className="popInfoRight">{totalAmount}</Col>
                        </Row>
                        <Row>
                          <Col className="popInfoLeft">Total Tax</Col>
                          <Col className="popInfoRight">{totalTax}</Col>
                        </Row>
                        <Row>
                          <Col className="popInfoLeft">Penalty</Col>
                          <Col className="popInfoRight">{invoice.penalty}</Col>
                        </Row>
                        <Row>
                          <Col className="popInfoLeft">Sum Total</Col>
                          <Col className="popInfoRight">{sumtotal2()}</Col>
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Container>
      </Popup>

      )}
      
      
          
    </div>
  );
};

export default PaidInvoiceDetails;
