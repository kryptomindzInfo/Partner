import React, { useRef } from 'react';
import ReactToPrint from 'react-to-print';
import PrintIcon from '@material-ui/icons/Print';
import Popup from 'components/Popup';
import Button from 'components/Button';
import { InvoiceReciept } from './InvoiceReciept';


const InvoiceTransactionReciept = props => {
  const componentRef = useRef();


  return (
    <Popup close={props.close} bigBody roundedCorner>
      
                       
      <ReactToPrint
        trigger={() => <Button><PrintIcon/>  Print</Button>}
        content={() => componentRef.current}
      />
      <InvoiceReciept values={props.values} ref={componentRef} />
    </Popup>
  );
};

export default InvoiceTransactionReciept;
