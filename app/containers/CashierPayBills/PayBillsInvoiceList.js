import React, {  useEffect, useState } from 'react';
import Button from 'components/Button';
import Row from 'components/Row';
import Col from 'components/Col'
import FormGroup from 'components/FormGroup';
import Loader from 'components/Loader';
import Card from 'components/Card';
import Table from '../../components/Table';
import { STATIC_URL } from '../App/constants';
import { checkCashierFee, getPenaltyRule } from './api/CashierMerchantAPI';
import { isEmpty } from 'lodash';

const PayBillsInvoiceList = props => {
  const { merchant } = props;
  const currentDate = new Date(); 
  const [isLoading, setLoading] = useState(true);
  const [isButtonLoading, setButtonLoading] = useState(false);
  const [selectedInvoiceList, setSelectedInvoiceList] = useState([]);
  const [totalFee, setTotalFee] = useState(0);
  const [payingInvoiceList, setPayingInvoiceList] = useState([]);
  const [feeList, setFeeList] = useState([]);
  const [penaltyList, setPenaltyList] = useState([]);
  const [penaltyRule, setPenaltyRule] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);
  const [invoiceList, setInvoiceList] = useState(
    props.invoiceList.filter(i => i.paid === 0),
  );
  const handleCheckboxClick = async (e, invoice, index) => {
    setButtonLoading(true);
    if(e.target.checked) {
      if(invoice.has_counter_invoice === true){
        const counterInvoice = invoiceList.filter((val) => val.number === `${invoice.number}C`);
        setTotalAmount(totalAmount + invoice.amount + counterInvoice[0].amount + penaltyList[index]);
        const data = await checkCashierFee({
          merchant_id: merchant._id,
          amount: totalAmount + invoice.amount + counterInvoice[0].amount + penaltyList[index],
        });
        setTotalFee(data.fee);
        const obj1 = {
          id: invoice._id,
          penalty: penaltyList[index],
        }
        const obj2 = {
          id: counterInvoice[0]._id,
          penalty: 0,
        }
        const obj4 = {
          invoice: invoice,
          penalty: penaltyList[index],
          fee: feeList[index],
        }
        const obj3 = {
          invoice: counterInvoice[0],
          penalty: 0,
          fee: feeList[index],
        }
        const paylist = [...payingInvoiceList];
        paylist.push(obj3);
        paylist.push(obj4);
        const list = [...selectedInvoiceList];
        list.push(obj1);
        list.push(obj2);
        setSelectedInvoiceList(list);
        setPayingInvoiceList(paylist);
        setButtonLoading(false);
      } else {
        setTotalAmount(totalAmount + invoice.amount + penaltyList[index]);
        const data = await checkCashierFee({
          merchant_id: merchant._id,
          amount: totalAmount + invoice.amount + penaltyList[index],
        });
        setTotalFee(data.fee);
        const obj1 = {
          id: invoice._id,
          penalty: penaltyList[index],
        }
        const obj2 = {
          invoice: invoice,
          penalty: penaltyList[index],
          fee: feeList[index],
        }
        const paylist = [...payingInvoiceList];
        paylist.push(obj2);
        setPayingInvoiceList(paylist);
        const list = [...selectedInvoiceList];
        list.push(obj1);
        setSelectedInvoiceList(list);
        setButtonLoading(false);
      }
    } else {
      if(invoice.has_counter_invoice === true){
        const counterInvoice = invoiceList.filter((val) => val.number === `${invoice.number}C`);
        const data = await checkCashierFee({
          merchant_id: merchant._id,
          amount: totalAmount - invoice.amount - counterInvoice[0].amount - penaltyList[index],
        });
        setTotalFee(data.fee);
        const list = selectedInvoiceList.filter((val) => val.id !== invoice._id &&  val.id !== counterInvoice[0]._id);
        setSelectedInvoiceList(list);
        const paylist = payingInvoiceList.filter((val) => val.invoice.id !== invoice._id &&  val.invoive.id !== counterInvoice[0]._id);
        setPayingInvoiceList(paylist);
        setTotalAmount(totalAmount-invoice.amount-counterInvoice[0].amount - penaltyList[index]);
        setButtonLoading(false);
      } else {
        const data = await checkCashierFee({
          merchant_id: merchant._id,
          amount: totalAmount - invoice.amount - penaltyList[index],
        });
        setTotalFee(data.fee);
        const list = selectedInvoiceList.filter((val) => val.id !== invoice._id);
        setSelectedInvoiceList(list);
        const paylist = payingInvoiceList.filter((val) => val.invoice.id !== invoice._id);
        setPayingInvoiceList(paylist);
        setTotalAmount(totalAmount- invoice.amount - penaltyList[index]);
        setButtonLoading(false);
      }
    }
  };

  const handleMultipleInvoiceSubmit = () => {
    const obj = {
      invoices : selectedInvoiceList,
      merchant_id : merchant._id,
    }
    props.showOTPPopup(obj,payingInvoiceList);
  };
  
  
  const getInvoiceList = () =>
    invoiceList.map((invoice,index) => (
      <tr key={invoice._id} className={ penaltyList[index] > 0 ? 'red' : ''}>
        <td
          className="tac"
        >
          <Row>
            <Col cW="10%">
            {invoice.is_counter ? (
              <div>
                {selectedInvoiceList.map(a => a.id).includes(invoice._id) ? (
                  <FormGroup>
                    <input
                      type="checkbox"
                      checked
                      value={invoice._id}>
                    </input>
                  </FormGroup>
                ) : (
                  <FormGroup>
                    <input
                      type="checkbox"
                      disabled
                      value={invoice._id}>
                    </input>
                  </FormGroup>
                )}
              </div>
            ) : (
              <FormGroup onChange={(e) => handleCheckboxClick(e, invoice, index)}>
                <input
                  type="checkbox"
                  value={invoice._id}>
                </input>
                </FormGroup>
            )}
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
        <td className="tac">{penaltyList[index]}</td>
        <td className="tac">
          {feeList[index] > 0 ? feeList[index].toFixed(2) : 'NA'}
        </td>
        <td className="tac">
        {feeList[index] > 0 ? invoice.amount+feeList[index]+penaltyList[index] : 'NA'}</td>
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
            <span onClick={() => props.setEditingInvoice(invoice, penaltyList[index])}>
              Pay Bill
            </span>
          </div>
        </td>
      </tr>
    ));

  const fetchfee = async(penaltylist) => {
    const feelist = invoiceList.map(async (invoice,index) => {
      if (invoice.amount + penaltylist[index] < 0) {
        const data = await checkCashierFee({
          merchant_id: merchant._id,
          amount: invoice.amount * -1,
        });
        return (-data.fee);
      } else {
        const data = await checkCashierFee({
          merchant_id: merchant._id,
          amount: invoice.amount + penaltylist[index],
        });
        return (data.fee);
      }
    })
    const result= await Promise.all(feelist);
    return({res:result, loading:false});
  }

  const calculatePenalty = async(rule) => {
    const penaltylist = invoiceList.map(async invoice => {
      if (invoice.amount < 0) {
        return (0);
      }else if(!rule.type){
        return (0);
      }
      const datesplit = invoice.due_date.split("/");
      const dueDate = new Date(datesplit[2],datesplit[1]-1,datesplit[0]);
      if (currentDate <= dueDate) {
          return (0);
      } else {
        if(rule.type === 'once') {
          return (rule.fixed_amount + (invoice.amount*rule.percentage)/100);
        } else {
          // To calculate the time difference of two dates 
          var Difference_In_Time = currentDate.getTime() - dueDate.getTime(); 
          // To calculate the no. of days between two dates 
          var Difference_In_Days = Math.trunc(Difference_In_Time / (1000 * 3600 * 24)); 
          console.log(currentDate,dueDate,Difference_In_Days);     
          return ((rule.fixed_amount + (invoice.amount*rule.percentage)/100)*Difference_In_Days.toFixed(2));
        }
      }
    });
    const result= await Promise.all(penaltylist);
    return(result);
  }

  const fetchPenaltyRule = async() => {
    const data = await getPenaltyRule({
      merchant_id: merchant._id,
    });
    return(data.rule);
  }

  useEffect(() => {
    setLoading(true);
    const getRule = async() => {
      const res1= await fetchPenaltyRule();
      const res2= await calculatePenalty(res1);
      setPenaltyList(res2);
      const res3= await fetchfee(res2);
      setFeeList(res3.res);
      setLoading(res3.loading);
    }
    getRule();
    }, []); // Or [] if effect doesn't need props or state
  
  if (isLoading) {
    return <Loader />;
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
              <th>Penalty</th>
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
                `Collect Amount ${totalAmount} + Fee ${totalFee.toFixed(2)} = Total ${totalAmount+totalFee} and Pay Bill`
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
