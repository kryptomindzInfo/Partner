import React, { useEffect, useState } from 'react';
import Card from 'components/Card';
import Table from 'components/Table';


const PaidInvoiceList = (props) => {

  const [invoiceList, setInvoiceList] = useState(
    props.invoiceList
  );
  
  const getInvoiceList = () =>
    invoiceList.map((invoice, index) => (
      <tr key={invoice._id}>
        <td
          className="tac"
        >
         {invoice.number}
        </td>
        <td className="tac">{invoice.name}</td>
        <td className="tac">{invoice.amount}</td>
        <td className="tac">{invoice.penalty}</td>
        <td className="tac">
          {invoice.amount + invoice.penalty}</td>
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
            <span onClick={() => props.setEditingInvoice(invoice, invoice.penalty)}>
              View
            </span>
          </div>
        </td>
      </tr>
    ));



  useEffect(() => {
  }, []);

  return (
    <div>
      <Card>
        {invoiceList && invoiceList.length > 0 ? (
          <Table marginTop="5px" smallTd>
            <thead>
              <tr>
                <th>Number</th>
                <th>Name</th>
                <th>Amount</th>
                <th>Penalty</th>
                <th>Total Amount</th>
                <th>Due Date</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {invoiceList && invoiceList.length > 0 ? getInvoiceList() : null}
            </tbody>
          </Table>
        ) : (
            <center><h2>No Bill Available Found</h2></center>
          )
        }
      </Card >
    </div >
  );
};

export default PaidInvoiceList;
