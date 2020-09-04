import React, {  useEffect, useState } from 'react';
import Button from 'components/Button';
import Row from 'components/Row';
import Col from 'components/Col'
import FormGroup from 'components/FormGroup';
import Loader from 'components/Loader';
import Card from 'components/Card';
import Table from '../../components/Table';
import { STATIC_URL } from '../App/constants';
import { checkCashierFee } from './api/CashierMerchantAPI';
import { isEmpty } from 'lodash';

const PayBillsInvoiceList = props => {
  const { merchant } = props;
  const [isLoading, setLoading] = useState(true);
  const [isButtonLoading, setButtonLoading] = useState(false);
  const [selectedInvoiceList, setSelectedInvoiceList] = useState([]);
  const [totalFee, setTotalFee] = useState(0);
  const [feeList, setFeeList] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [invoiceList, setInvoiceList] = useState(
    props.invoiceList.filter(i => i.paid === 0),
  );
  const handleCheckboxClick = async (e, invoice, index) => {
    setButtonLoading(true);
    console.log(index);
    if(e.target.checked) {
      setTotalAmount(totalAmount + invoice.amount);
      const data = await checkCashierFee({
        merchant_id: merchant._id,
        amount: totalAmount + invoice.amount,
      });
      setTotalFee(data.fee);
      const list = [...selectedInvoiceList,invoice._id];
      setSelectedInvoiceList(list);
      setButtonLoading(false);
    } else {
      const data = await checkCashierFee({
        merchant_id: merchant._id,
        amount: totalAmount - invoice.amount,
      });
      setTotalFee(data.fee);
      const list = selectedInvoiceList.filter((val) => val !== invoice._id);
      setSelectedInvoiceList(list);
      setTotalAmount(totalAmount-invoice.amount);
      setButtonLoading(false);
    }
  };

  const handleMultipleInvoiceSubmit = () => {
    const obj = {
      invoice_ids : selectedInvoiceList,
      merchant_id : merchant._id,
    }
    props.showOTPPopup(obj);
  };
  
  const getInvoiceList = () =>
    invoiceList.map((invoice,index) => (
      <tr key={invoice._id}>
        <td
          className="tac"
        >
          <Row>
            <Col cW="10%">
              <FormGroup onChange={(e) => handleCheckboxClick(e, invoice, index)}>
                <input
                  type="checkbox"
                  value={invoice._id}>
                </input>
                </FormGroup>
            </Col>
            <Col 
              cW="90%"
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              {invoice.number}
            </Col>
          </Row>
        </td>
        <td className="tac">{invoice.amount}</td>
        <td className="tac">
          {feeList[index] > 0 ? feeList[index] : 'NA'}
        </td>
        <td className="tac">
        {feeList[index] > 0 ? invoice.amount+feeList[index] : 'NA'}</td>
        <td className="tac">{invoice.due_date} </td>
        <td className="tac bold">
          <div
            style={{
              display: 'flex',
              cursor: 'pointer',
              justifyContent: 'center',
              color: 'green',
            }}
          >
            <span onClick={() => props.setEditingInvoice(invoice)}>
              Pay Bill
            </span>
          </div>
        </td>
      </tr>
    ));

  const fetchfee = async() => {
    const feelist = invoiceList.map(async invoice => {
      if (invoice.amount < 0) {
        const data = await checkCashierFee({
          merchant_id: merchant._id,
          amount: invoice.amount * -1,
        });
        return (-data.fee);
      } else {
        const data = await checkCashierFee({
          merchant_id: merchant._id,
          amount: invoice.amount,
        });
        return (data.fee);
      }
    })
    const result= await Promise.all(feelist);
    return(result);
  }

  useEffect(() => {
    setLoading(true);
    const getFeeList = async () => {
      const res= await fetchfee();
      setFeeList(res);
      setLoading(false);
    };
    getFeeList();
    }, []); // Or [] if effect doesn't need props or state
  
  if (isLoading) {
    return <Loader  />;
  }
  return (
    <div>
      <Card>
        <div className="cardHeader">
          <div className="cardHeaderLeft">
            <img
              src={`${STATIC_URL}${merchant.logo}`}
              alt=""
              style={{ height: '60px', width: '60px', paddingRight: '10px' }}
            />
          </div>
          <div className="cardHeaderRight">
            <h4 style={{ color: 'green' }}>{merchant.name}</h4>
            <p>{merchant.description}</p>
          </div>
        </div>
        <div />
        <Table marginTop="34px" smallTd>
          <thead>
            <tr>
              <th>Number</th>
              <th>Amount</th>
              <th>Fees</th>
              <th>Amount With Fees</th> 
              <th>Due Date</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {invoiceList && invoiceList.length > 0 ? getInvoiceList() : null}
          </tbody>
        </Table>
        <FormGroup>
          {totalAmount > 0 ? (
            <Button onClick={handleMultipleInvoiceSubmit} filledBtn>
              {isButtonLoading ? (
                <Loader />
              ) : (
                `Collect Amount ${totalAmount} + Fee ${totalFee} = Total ${totalAmount+totalFee} and Pay Bill`
              )}
            </Button>
          ) : (
            null
          )}
        </FormGroup>
      </Card>
    </div>
  );
};


export default PayBillsInvoiceList;
