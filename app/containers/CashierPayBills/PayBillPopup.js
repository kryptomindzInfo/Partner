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
import Popup from '../../components/Popup';
import { inputBlur, inputFocus } from '../../components/handleInputFocus';
import PayBillsInvoiceList from './PayBillsInvoiceList';
import PayBillsInvoiceDetails from './PayBillsInvoiceDetails';
import { getInvoiceDetails, getUserInvoices, getInvoiceByCustomerCode} from './api/PayBillsAPI';
import PayBillOTP from './PayBillOTP';

const PayBillPopup = props => {
  const { merchant } = props;
  const [isLoading, setLoading] = useState(false);
  const [isMobile, setMobile] = useState(false);
  const [isInvoiceId, setInvoiceId] = useState(false);
  const [invoiceList, setInvoiceList] = useState([]);
  const [editingInvoice, setEditingInvoice] = useState({});
  const [editingInvoicePenalty, setEditingInvoicePenalty] = useState();
  const [displayInvoiceList, setDisplayInvoiceList] = useState(false);
  const [paybillOTP, setPaybillOTP] = useState(false);
  const [displayInvoiceDetailForm, setDisplayInvoiceDetailForm] = useState(
    false,
  );
  const [invoiceName, setInvoiceName] = useState('');
  const [isBackButtonEnabled, setBackButtonEnabled] = useState(false);

  const handleSetEditingInvoice = (invoice, penalty) => {
    setEditingInvoicePenalty(penalty);
    setEditingInvoice(invoice);
    setDisplayInvoiceList(false);
    setBackButtonEnabled(true);
    setDisplayInvoiceDetailForm(true);
  };
  const onBack = () => {
    setDisplayInvoiceList(true);
    setBackButtonEnabled(false);
    setDisplayInvoiceDetailForm(false);
  };

  useEffect(() => {
    console.log(merchant._id);
  }, []);

  return (
    <div>
      <Popup accentedH1 bigBody close={props.close}>
        {paybillOTP ? (
          <PayBillOTP close={props.close} invoice={editingInvoice}  merchant={merchant}/>
        ) : (
          <div>
            <h1>Pay {invoiceName} Bills</h1>
            {!displayInvoiceList && !displayInvoiceDetailForm ? (
              <Formik
                initialValues={{
                  invoiceIdOrMobile: '',
                  searchBy: 'Mobile',
                }}
                onSubmit={async values => {
                  console.log(values);
                  if (values.searchBy === 'Mobile') {
                    getUserInvoices(values.invoiceIdOrMobile, merchant._id).then(data => {
                      console.log(data.list);
                      setInvoiceList(data.list);
                      setDisplayInvoiceList(true);
                      if(data.list.length > 0){
                        setInvoiceName(data.list[0].name);
                      }
                    });
                  } else if (values.searchBy === 'BillNumber') {
                    getInvoiceDetails(values.invoiceIdOrMobile, merchant._id).then(data => {
                      console.log(data.list);
                      setInvoiceList(data.list);
                      setDisplayInvoiceList(true);
                      if(data.list.length > 0){
                        setInvoiceName(data.list[0].name);
                      }
                    });
                  } else {
                    getInvoiceByCustomerCode(values.invoiceIdOrMobile, merchant._id).then(data => {
                      console.log(data.list);
                      setInvoiceList(data.list);
                      setDisplayInvoiceList(true);
                      if(data.list.length > 0){
                        setInvoiceName(data.list[0].name);
                      }
                    });
                  }
                }}
                validationSchema={Yup.object().shape({
                  invoiceIdOrMobile: Yup.string()
                    .required('Required'),
                })}
              >
                {formikProps => {
                  const { values, handleChange, handleBlur } = formikProps;
                  return (
                    <Form>
                      <Row>
                        <Col cW="20%">
                          <FormGroup>
                            <label htmlFor="searchBy" className="focused">
                              Search By
                            </label>
                            <SelectInput
                              name="searchBy"
                              onFocus={(e) => {
                                handleChange(e);
                                inputFocus(e);
                              }}
                              onBlur={(e) => {
                                handleBlur(e);
                                handleChange(e);
                                inputBlur(e);
                              }}
                              value={values.searchBy}
                              onChange={handleChange}
                              required
                            >
                              <option  value="Mobile">
                                Mobile Number
                              </option>
                              <option  value="BillNumber">
                                Bill Number
                              </option>
                              <option  value="CustomerCode">
                                Customer Code
                              </option>
                            </SelectInput>
                          </FormGroup>
                        </Col>
                        <Col cW="80%">
                          <FormGroup>
                            <label htmlFor="invoiceIdOrMobile">
                              Mobile/Invoice Id/Customer Code
                            </label>
                            <TextInput
                              type="text"
                              name="invoiceIdOrMobile"
                              onFocus={e => {
                                inputFocus(e);
                                handleChange(e);
                              }}
                              onBlur={e => {
                                inputBlur(e);
                                handleBlur(e);
                              }}
                              onChange={handleChange}
                              value={values.invoiceIdOrMobile}
                            />
                            <ErrorMessage name="invoiceIdOrMobile" />
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
            {displayInvoiceList ? (
              <PayBillsInvoiceList
                merchant={merchant}
                invoiceList={invoiceList}
                setEditingInvoice={(value, penalty) => handleSetEditingInvoice(value, penalty)}
                close={props.close}
                showOTPPopup={values => {
                  setEditingInvoice(values);
                  setPaybillOTP(true);
                }}
              />
            ) : (
              ''
            )}
            {displayInvoiceDetailForm ? (
              <PayBillsInvoiceDetails
                merchantId={merchant._id}
                showOTPPopup={values => {
                  setEditingInvoice(values);
                  setPaybillOTP(true);
                }}
                close={props.close}
                invoice={editingInvoice}
                penalty={editingInvoicePenalty}
                merchant={merchant}
              />
            ) : (
              ''
            )}
          </div>
        )}
      </Popup>
    </div>
  );
};

export default PayBillPopup;
