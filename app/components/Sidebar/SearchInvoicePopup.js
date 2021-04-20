import { ErrorMessage, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import axios from 'axios';
import Button from 'components/Button';
import Col from 'components/Col';
import FormGroup from 'components/FormGroup';
import { inputBlur, inputFocus } from 'components/handleInputFocus';
import Loader from 'components/Loader';
import Popup from 'components/Popup';
import Row from 'components/Row';
import SelectInput from 'components/SelectInput';
import TextInput from 'components/TextInput';
import PaidInvoiceList from './PaidInvoiceList';
import PaidInvoiceDetails from './PaidInvoiceDetails';
import { API_URL, CONTRACT_URL, CURRENCY, STATIC_URL } from 'containers/App/constants';

const SearchInvoicePopup = (props) => {
  const token = localStorage.getItem('cashierLogged');
  const [isLoading, setLoading] = useState(false);
  const [invoiceList, setInvoiceList] = useState([]);
  const [payingInvoiceList, setPayingInvoiceList] = useState([]);
  const [editingInvoice, setEditingInvoice] = useState({});
  const [editingInvoicePenalty, setEditingInvoicePenalty] = useState({});
  const [displayInvoiceList, setDisplayInvoiceList] = useState(false);
  const [displayInvoiceDetailForm, setDisplayInvoiceDetailForm] = useState(
    false,
  );
  const [invoiceName, setInvoiceName] = useState('');
  const [isBackButtonEnabled, setBackButtonEnabled] = useState(false);

  const getPaidInvoiceDetails = async (number) => {
    try {
      const res = await axios.post(`${API_URL}/partnerCashier/cashierSearchPaidInvoiceByBillNumber`, {
        token,
        number,
      });
      if (res.status === 200) {
        if (res.data.status === 0) {
          toast.error(res.data.message);
          return { list: [], loading: false };
        }
        return { list: res.data.invoices, loading: false };
      }
      toast.error(res.data.message);
      return { list: [], loading: false };
    } catch (err) {
      toast.error('Something went wrong');
      return { list: [], loading: false };
    }
  };

  const getPaidUserInvoices = async (mobile) => {
    try {
      const res = await axios.post(`${API_URL}/partnerCashier/cashierSearchPaidInvoiceByMobile`, {
        token,
        mobile,
      });
      if (res.status === 200) {
        if (res.data.status === 0) {
          toast.error(res.data.message);
          return { list: [], loading: false };
        }
        return { list: res.data.invoices, loading: false };
      }
      toast.error(res.data.message);
      return { list: [], loading: false };
    } catch (err) {
      toast.error('Something went wrong');
      return { list: [], loading: false };
    }
  };

  const getPaidInvoiceByCustomerCode = async (customerCode, merchantId) => {
    try {
      const res = await axios.post(
        `${API_URL}/partnerCashier/cashierSearchPaidInvoiceByCustomerCode`,
        {
          token,
          customer_code: customerCode,
        },
      );
      if (res.status === 200) {
        if (res.data.status === 0) {
          toast.error(res.data.message);
          return { list: [], loading: false };
        }
        return { list: res.data.invoices, loading: false };
      }
      toast.error(res.data.message);
      return { list: [], loading: false };
    } catch (err) {
      toast.error('Something went wrong');
      return { list: [], loading: false };
    }
  };

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
  }, []);

  return (
    <div>
      <Popup accentedH1 bigBody close={props.close}>
          <div>
            <h1>Paid Bills</h1>
            {!displayInvoiceList && !displayInvoiceDetailForm ? (
              <Formik
                initialValues={{
                  invoiceIdOrMobile: '',
                  searchBy: 'Mobile',
                }}
                onSubmit={async (values) => {
                  console.log('efiif');
                  if (values.searchBy === 'Mobile') {
                    getPaidUserInvoices(values.invoiceIdOrMobile).then((data) => {
                      setInvoiceList(data.list.reverse());
                      setDisplayInvoiceList(true);
                      if (data.list.length > 0) {
                        setInvoiceName(data.list[0].name);
                      }
                    });
                  } else if (values.searchBy === 'BillNumber') {
                    getPaidInvoiceDetails(
                      values.invoiceIdOrMobile,
                    ).then((data) => {
                      setInvoiceList(data.list.reverse());
                      setDisplayInvoiceList(true);
                      if (data.list.length > 0) {
                        setInvoiceName(data.list[0].name);
                      }
                    });
                  } else {
                    getPaidInvoiceByCustomerCode(
                      values.invoiceIdOrMobile,
                    ).then((data) => {
                      setInvoiceList(data.list.reverse());
                      setDisplayInvoiceList(true);
                      if (data.list.length > 0) {
                        setInvoiceName(data.list[0].name);
                      }
                    });
                  }
                }}
                validationSchema={Yup.object().shape({
                  invoiceIdOrMobile: Yup.string().required('Required'),
                })}
              >
                {(formikProps) => {
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
                              <option value="Mobile">Mobile Number</option>
                              <option value="BillNumber">Bill Number</option>
                              <option value="CustomerCode">
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
                              onFocus={(e) => {
                                inputFocus(e);
                                handleChange(e);
                              }}
                              onBlur={(e) => {
                                inputBlur(e);
                                handleBlur(e);
                              }}
                              required
                              onChange={handleChange}
                              value={values.invoiceIdOrMobile}
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
            {displayInvoiceList ? (
              <PaidInvoiceList
                invoiceList={invoiceList}
                setEditingInvoice={(value, penalty) => handleSetEditingInvoice(value, penalty)}
                close={props.close}
              />
            ) : (
              ''
            )}
            {displayInvoiceDetailForm ? (
              <PaidInvoiceDetails
                close={props.close}
                invoice={editingInvoice}
              />
            ) : (
              ''
            )}
          </div>

      </Popup>
    </div>
  );
};

export default SearchInvoicePopup;
