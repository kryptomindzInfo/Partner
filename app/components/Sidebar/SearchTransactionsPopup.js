import React, { useState, useEffect } from 'react';
import { Form, Formik, ErrorMessage } from 'formik';
import Button from 'components/Button';
import Row from 'components/Row';
import Col from 'components/Col';
import SelectInput from 'components/SelectInput';
import FormGroup from 'components/FormGroup';
import TextInput from 'components/TextInput';

import Loader from 'components/Loader';
import * as Yup from 'yup';
import axios from 'axios';
import Popup from '../../components/Popup';
import { inputBlur, inputFocus } from '../../components/handleInputFocus';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { API_URL, CURRENCY, STATIC_URL } from '../../containers/App/constants';
import SearchTransactionList from './SearchTransactionList';
import TransactionReciept from './TransactionReceipt';

const SearchTransactionPopup = props => {
  const [isLoading, setLoading] = useState(false);
  const [type, setType] = useState('');
  const [formdate, setFormdate] = useState(new Date);
  const [transactionList, setTransactionList] = useState([]);
  const [displayTransactionReceipt, setDisplayTransactionReceipt] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState({});
  const [displayTransactionList, setDisplayTransactionList] = useState(false);
  const [displayReceipt, setDisplayReceipt] = useState(false);
  const [mastercode, setMastercode] = useState(false);
  const [values, setValues] = useState(false);
  const id = localStorage.getItem('cashierId');
  const bankId = localStorage.getItem('bankId');
  const token =  localStorage.getItem('cashierLogged');
 

  const getHistory = async(after,before,mobile) => {
      console.log(type);
    try{
      const res = await axios.post(`${API_URL}/partnerCashier/queryCashierTransactionStates`, {
        token: token,
        bank_id: bankId,
        cashier_id: id,
        status: "2",
        date_after: after,
        date_before: before,
        page_start: 0,
        limit: 100
      });
      if (res.status == 200) {
          return ({
            transactions:res.data.transactions.filter(trans => (trans.transaction ? trans.transaction.mobile === mobile : null) || trans.childTx[0].transaction.master_code === mobile),
          });
      }
    } catch (err){
      console.log(err);
    }
  }

  const handleTransactionReceipt = (values,code,type) => {
    setValues(values);
    setDisplayTransactionList(false);
    setMastercode(code);
    setType(type);
    setDisplayReceipt(true);
  };

  useEffect(() => {
    console.log(localStorage);
  }, []);

  return (
    <div>
      <Popup accentedH1 bigBody close={props.close}>
          <div>
            <h1>Search Transactions</h1>
            {!displayTransactionList && !displayReceipt ? (
              <Formik
                initialValues={{
                  mobile: '',
                }}
                onSubmit={async (values) => {
                    const after = new Date(formdate);
                    const before = new Date(formdate);
                    after.setHours(0,0,0,0);
                    before.setHours(23,59,59,0);
                    const res = await getHistory(after,before,values.mobile);
                    console.log(res.transactions);
                    setTransactionList(res.transactions);
                    setDisplayTransactionList(true);
                }}
                validationSchema={Yup.object().shape({
                  mobile: Yup.string().required('Required'),
                })}
              >
                {formikProps => {
                  const { values, handleChange, handleBlur } = formikProps;
                  return (
                    <Form>
                      <Row>
                        <Col cW='35%'>
                            <FormGroup style={{marginBottom:'12px'}}>
                                <MuiPickersUtilsProvider
                                    utils={DateFnsUtils}
                                >
                                    <KeyboardDatePicker
                                        id="date-picker-dialog"
                                        size="small"
                                        maxDate={new Date()}
                                        fullWidth
                                        inputVariant="outlined"
                                        format="dd/MM/yyyy"
                                        required
                                        InputLabelProps={{
                                        shrink: true,
                                        }}
                                        value={formdate}
                                        onFocus={e => {
                                            inputFocus(e);
                                            handleChange(e);
                                        }}
                                        onBlur={e => {
                                            inputBlur(e);
                                            handleBlur(e);
                                        }}
                                        onChange={date => {
                                            console.log(date);
                                            setFormdate(date);
                                        }
                                        }
                                        KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                                                    }}
                                    />
                                </MuiPickersUtilsProvider>
                            </FormGroup>
                        </Col>
                        <Col cW="65%">
                        <FormGroup>
                            <label htmlFor="invoiceIdOrMobile">
                              Mobile/Transaction Code
                            </label>
                            <TextInput
                              type="text"
                              name="mobile"
                              onFocus={e => {
                                inputFocus(e);
                                handleChange(e);
                              }}
                              onBlur={e => {
                                inputBlur(e);
                                handleBlur(e);
                              }}
                              onChange={handleChange}
                              value={values.mobile}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <FormGroup>
                        <Button filledBtn>
                          {isLoading ? <Loader /> : 'Get'}
                        </Button>
                      </FormGroup>
                    </Form>
                  );
                }}
              </Formik>
            ) : (
              ''
            )}
             {displayTransactionList ? (
              <SearchTransactionList
                transactionList={transactionList}
                type={type}
                handletransactionreceipt={(values,mastercode,type) => handleTransactionReceipt(values,mastercode,type)}
                close={props.close}
              />
            ) : (
              ''
            )}
            {displayReceipt ? (
              <TransactionReciept
                values={values}
                type={type}
                code={mastercode}
                date={formdate}
                close={props.close}
              />
            ) : (
              ''
            )}
          </div>
      </Popup>
    </div>
  );
};

export default SearchTransactionPopup;
