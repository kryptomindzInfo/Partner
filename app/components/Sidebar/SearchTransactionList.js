import React, {  useEffect, useState } from 'react';
import Button from 'components/Button';
import Row from 'components/Row';
import Col from 'components/Col'
import FormGroup from 'components/FormGroup';
import Loader from 'components/Loader';
import Card from 'components/Card';
import Table from 'components/Table';


const SearchTransactionList = props => {

    const list = props.transactionList;
    useEffect(() => {
        console.log(props.transactionList);
      }, []);

    const formatDate = date => {
        var months = [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ];
        var isoformat = date;
    
        var readable = new Date(isoformat);
        var m = readable.getMonth(); // returns 6
        var d = readable.getDate(); // returns 15
        var y = readable.getFullYear();
        var h = readable.getHours();
        var mi = readable.getMinutes();
        var mlong = months[m];
        return (
          {
            date: d + ' ' + mlong + ' ' + y,
            time: h + ':' + mi,
          }
        )
      };
  
  return (
    
    <div>

      <Card>
        {list && list.length > 0 ? (
        <Table marginTop="34px" smallTd>
          <tbody>
            {list.map( (b,i) => {
                var fulldate = formatDate(b.createdAt);
                let child = [];
                if (props.type === 'Claim Money'){
                    child = b.childTx.filter(c=>c.transaction.note === "Cashier claim Money");
                }else{
                    child = b.childTx;
                }
                if(child.length>0){
                    return (
                        <tr key={i} >
                            <td style={{textAlign:"center"}}>
                                <div className="labelGrey">{fulldate.date}</div>
                            </td>
                            <td style={{textAlign:"center"}}>
                                <div className="labelGrey">
                                  Transfered From {child[0].transaction.from_name} to {child[0].transaction.to_name}
                                </div>
                            </td>
                            <td style={{textAlign:"center"}}>
                                <div className="labelGrey">{b.txType}</div>
                            </td>
                            <td style={{textAlign:"center"}}> 
                                <div className="labelGrey">XOF {child[0].transaction.amount}</div>
                            </td>
                            <td className="tac bold">
                            <div
                              style={{
                                display: 'flex',
                                cursor: 'pointer',
                                justifyContent: 'center',
                                color: 'green',
                              }}
                            >
                              <span onClick={() => props.handletransactionreceipt(b.transaction,child[0].transaction.master_code,b.txType)}>
                                Receipt
                              </span>
                            </div>
                          </td>
                        </tr>
                    )
                }
            })}
                     
            </tbody>
        </Table>
        ):<h3 style={{textAlign:'center'}}>No Transactions found</h3>}
      </Card>
    </div>
    
  );
};


export default SearchTransactionList;
