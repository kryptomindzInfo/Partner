import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import Card from './node_modules/components/Card';
import Button from './node_modules/components/Button';
import FormGroup from './node_modules/components/FormGroup';
import TextInput from './node_modules/components/TextInput';
import SelectInput from './node_modules/components/SelectInput';
import Row from './node_modules/components/Row';
import Col from './node_modules/components/Col';
import Loader from './node_modules/components/Loader';

import './node_modules/react-toastify/dist/ReactToastify.css';
import { Form, Formik, FieldArray, ErrorMessage } from 'formik';
import {
  correctFocus,
  inputBlur,
  inputFocus,
} from '../../../components/handleInputFocus';

toast.configure({
  position: 'bottom-right',
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
});

const MerchantFee = props => {
  const [isLoading, setLoading] = useState(false);
  const [rule, setRule] = useState(props.rules);

  useEffect(() => {
    if (Object.keys(rule).length > 0) {
      correctFocus('update');
    }
  });

  return (
    <Card bigPadding>
      <div className="cardHeader" style={{ paddingBottom: '20px' }}>
        <div className="cardHeaderLeft flex">
          <i className="material-icons" onClick={props.onBack}>
            arrow_back
          </i>
          <h3>Create Revenue sharing Rules</h3>
        </div>
      </div>
      <div className="cardBody">
        <Formik
          enableReinitialize
          initialValues={{
            name: rule.name || '',
            transType: rule.transType || '',
            active: rule.active || '',
            transactions: rule.transactions || [
              {
                trans_from: '',
                trans_to: '',
                fixed_amount: '',
                percentage: '',
              },
            ],
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string().required('Name is required'),
            transType: Yup.string().required('Transaction Type is required'),
            active: Yup.string().required('Status is required'),
            transaction: Yup.array().of(
              Yup.object().shape({
                trans_from: Yup.number().required('Trans From is required'),
                trans_to: Yup.number().required('Trans To is required'),
                fixed_amount: Yup.number().required('Fixed Amount is required'),
                percentage: Yup.number()
                  .max(100, 'Cannot exceed 100')
                  .required('Percentage is required'),
              }),
            ),
          })}
          onSubmit={() => {}}
        >
          {formikProps => {
            const { handleChange, handleBlur } = formikProps;
            return (
              <Form>
                <FormGroup>
                  <label htmlFor="name">Name*</label>
                  <TextInput
                    type="text"
                    name="name"
                    onFocus={e => {
                      inputFocus(e);
                      handleChange(e);
                    }}
                    onBlur={e => {
                      inputBlur(e);
                      handleBlur(e);
                    }}
                    onChange={handleChange}
                    value={formikProps.values.name}
                  />
                  <ErrorMessage name="name" />
                </FormGroup>
                <Row>
                  <Col>
                    <FormGroup>
                      <SelectInput
                        type="text"
                        name="transType"
                        value={formikProps.values.transType}
                        onChange={handleChange}
                      >
                        <option value="">Transaction Type*</option>
                        <option>Wallet to Wallet</option>
                        <option>Non Wallet to Non Wallet</option>
                        <option>Non Wallet to Wallet</option>
                        <option>Wallet to Non Wallet</option>
                        <option>Wallet to merchant</option>
                        <option>Non Wallet to Merchant</option>
                        <option>Wallet to Bank Account</option>
                        <option>Bank Account to Wallet Request</option>
                      </SelectInput>
                      <ErrorMessage name="transType" />
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup>
                      <SelectInput
                        type="text"
                        name="active"
                        value={formikProps.values.active}
                        onChange={handleChange}
                      >
                        <option value="">Status Type*</option>
                        <option>Active</option>
                        <option>Inactive </option>
                      </SelectInput>
                      <ErrorMessage name="active" />
                    </FormGroup>
                  </Col>
                </Row>
                <FormGroup>
                  <label htmlFor="transactions">Transaction</label>
                  <FieldArray name="transactions">
                    {fieldArrayProps => {
                      const { push, remove, form } = fieldArrayProps;
                      const { values } = form;
                      const { transactions } = values;
                      console.log(fieldArrayProps);
                      return (
                        <div>
                          {transactions.map((transaction, index) => (
                            <Row key={index}>
                              <Col>
                                <FormGroup>
                                  <label
                                    className="focused"
                                    htmlFor={`transactions[${index}].trans_from`}
                                  >
                                    Transaction From
                                  </label>
                                  <TextInput
                                    type="number"
                                    name={`transactions[${index}].trans_from`}
                                    onFocus={e => {
                                      inputFocus(e);
                                      handleChange(e);
                                    }}
                                    onBlur={e => {
                                      inputBlur(e);
                                      handleBlur(e);
                                    }}
                                    onChange={handleChange}
                                    value={transaction.trans_from}
                                  />
                                  <ErrorMessage
                                    name={`transactions[${index}].trans_from`}
                                  />
                                </FormGroup>
                              </Col>
                              <Col>
                                <FormGroup>
                                  <label
                                    htmlFor={`transactions[${index}].trans_to`}
                                  >
                                    Transaction To
                                  </label>
                                  <TextInput
                                    type="number"
                                    name={`transactions[${index}].trans_to`}
                                    value={transaction.trans_to}
                                    onFocus={e => {
                                      inputFocus(e);
                                      handleChange(e);
                                    }}
                                    onBlur={e => {
                                      inputBlur(e);
                                      handleBlur(e);
                                    }}
                                    onChange={e => {
                                      handleChange(e);
                                    }}
                                  />
                                  <ErrorMessage
                                    name={`transactions[${index}].trans_to`}
                                  />
                                </FormGroup>
                              </Col>
                              <Col>
                                <FormGroup>
                                  <label
                                    htmlFor={`transactions[${index}].fixed_amount`}
                                  >
                                    Fixed Amount
                                  </label>
                                  <TextInput
                                    type="number"
                                    name={`transactions[${index}].fixed_amount`}
                                    value={transaction.fixed_amount}
                                    onFocus={e => {
                                      inputFocus(e);
                                      handleChange(e);
                                    }}
                                    onBlur={e => {
                                      inputBlur(e);
                                      handleBlur(e);
                                    }}
                                    onChange={handleChange}
                                  />
                                  <ErrorMessage
                                    name={`transactions[${index}].fixed_amount`}
                                  />
                                </FormGroup>
                              </Col>
                              <Col>
                                <FormGroup>
                                  <label
                                    htmlFor={`transactions[${index}].percentage`}
                                  >
                                    Percentage
                                  </label>
                                  <TextInput
                                    type="number"
                                    name={`transactions[${index}].percentage`}
                                    value={transaction.percentage}
                                    onFocus={e => {
                                      inputFocus(e);
                                      handleChange(e);
                                    }}
                                    onBlur={e => {
                                      inputBlur(e);
                                      handleBlur(e);
                                    }}
                                    onChange={handleChange}
                                  />
                                  <ErrorMessage
                                    name={`transactions[${index}].percentage`}
                                  />
                                </FormGroup>
                              </Col>
                              {index > 0 ? (
                                <Col
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    marginBottom: '14px',
                                  }}
                                >
                                  <FormGroup>
                                    <Button onClick={() => remove(index)}>
                                      <i className="material-icons">delete</i>
                                    </Button>
                                  </FormGroup>
                                </Col>
                              ) : null}
                            </Row>
                          ))}
                          <Button
                            type="button"
                            accentedBtn
                            marginTop="10px"
                            onClick={() => {
                              push({
                                trans_from:
                                  transactions[transactions.length - 1]
                                    .trans_to + 1,
                                trans_to: '',
                                fixed_amount: '',
                                percentage: '',
                              });
                            }}
                          >
                            <span>Add Another Range</span>
                          </Button>
                        </div>
                      );
                    }}
                  </FieldArray>
                </FormGroup>
                <Button type="submit" filledBtn marginTop="100px">
                  {isLoading ? <Loader /> : 'Save'}
                </Button>
              </Form>
            );
          }}
        </Formik>
      </div>
    </Card>
  );
};

export default MerchantFee;