import React, { useState, useEffect } from 'react';
import { Form, Formik, useField } from 'formik';
import Popup from 'components/Popup';
import Loader from 'components/Loader';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import * as Yup from 'yup';
import { makeStyles } from '@material-ui/core/styles';
import { toast } from 'react-toastify';
import Popper from '@material-ui/core/Popper';
import Grow from '@material-ui/core/Grow/Grow';
import Paper from '@material-ui/core/Paper/Paper';
import MenuList from '@material-ui/core/MenuList/MenuList';
import CircularProgress from '@material-ui/core/CircularProgress';
import MenuItem from '@material-ui/core/MenuItem';
import MuiCheckbox from '@material-ui/core/Checkbox';
import DateFnsUtils from '@date-io/date-fns';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import OperationalTransactionReceipt from '../OperationalTransactionReciept';
import { API_URL, CURRENCY } from '../../containers/App/constants';
import CountrySelectBox from '../Form/CountrySelectBox';
import TypeSelectBox from '../Form/TypeSelectBox';
import OtpPopup from './OtpPopup';

toast.configure({
  position: 'bottom-right',
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
});

const styles = makeStyles(() => ({
  '@global': {
    'MuiOutlinedInput-input': {
      padding: '12.5px 10px 12.5px 10px',
    },
  },
  dialogNonWallet: {
    paddingTop: '5%',
  },
  dialogGridLeft: {
    paddingBottom: '2%',
    paddingLeft: '10%',
    paddingRight: '2%',
  },
  dialogGridRight: {
    paddingBottom: '2%',
    paddingRight: '10%',
    paddingLeft: '2%',
  },
  dialogTextFieldGrid: {
    paddingLeft: '1%',
    paddingRight: '1%',
    paddingBottom: '2%',
  },
  dialogTextField: {
    paddingLeft: '1%',
    paddingRight: '1%',
  },
  dialogTextFieldGridErrorText: {
    color: 'red',
    fontSize: '10px',
  },
  dialogTextFieldFullRow: {
    padding: '0.5%',
    marginBottom: '5px',
  },
  dialogSubHeader: {
    paddingBottom: '2%',
    paddingRight: '3%',
    paddingLeft: '3%',
  },
  dialogButton: {
    padding: '2%',
  },
  dialogPaper: {
    color: 'grey',
    padding: '2%',
    height: '80%',
    width: '95%',
  },
  noteTextField: {
    height: '70px',
  },
  toggleButtonGroup: {
    color: 'green',
    marginTop: '10px',
  },
  toggleButton: {
    width: '150px',
    background: '#1a841b',
    color: '#fff',
    '&:hover': {
      background: '#1a841b',
      color: '#fff',
    },
  },
  toggleButtonDisabled: {
    color: '#1a841b',
    border: '1px solid #1a841b',
  },
  otpTextField: {
    margin: '80px',
    marginTop: '150px',
    marginBottom: '5px',
  },
  resendText: {
    fontSize: '12px',
    marginRight: '80px',
    marginLeft: '80px',
    marginBottom: '10px',
  },
  proceedButton: {
    paddingTop: '1%',
    paddingBottom: '1%',
  },
}));

export const Checkbox = ({ ...props }) => {
  const [field] = useField(props.name);

  return (
    <MuiCheckbox
      {...field}
      style={{
        color: 'rgb(53, 153, 51)',
        '&$checked': {
          color: 'rgb(53, 153, 51)',
        },
      }}
      checked={field.value}
    />
  );
};

const CashierToWalletForm = ({ close }) => {
  const classes = styles();
  const date = new Date();
  const [liveFee, setLiveFee] = useState(0);
  const anchorRef = React.useRef(null);
  const [openWalletPopup, setWalletPopup] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [interbank, setInterBank] = React.useState(true);
  const [amount, setAmount] = React.useState('');
  const [showOtp, setShowOtp] = React.useState(false);
  const [showReceipt, setShowReceipt] = React.useState(false);
  const [values, setvalues] = React.useState({});

  const haldleOtpClick = (values) => {
    setvalues(values);
    setShowOtp(true);
  };



  const getLiveFee = amount => {
    const token = localStorage.getItem('cashierLogged');
    console.log(amount);
    if (amount !== '') {
      let API = "";
      if (interbank) {
        API = "partnerCashier/interBank/checkFee"
      } else {
        API = "partnerCashier/checkFee"
      }
      axios
        .post(`${API_URL}/${API}`,
          {
            token,
            amount,
            type: "IBNWO",
            trans_type: "Non Wallet to Operational",
          })
        .then(res => {
          console.log(res);
          if (res.status === 200) {
            if (res.data.error) {
              setLiveFee('');
              toast.error(res.data.error);
            } else {
              setLiveFee(res.data.fee);
            }
          }
        })
        .catch(err => {
          setLiveFee('');
          toast.error(err.response.data.error);
        });
    }
  };

  const handleFeeTypeChange = (inter, amount) => {
    setAmount(amount);
    setInterBank(inter);
  };

  const handleOnProceedClick = async (values) => {
    setLoading(true);
    const token = localStorage.getItem('cashierLogged');
    let receiverIdentificationAmount = values.amount
    let isInclusive = values.is_inclusive
    values.receiverIdentificationAmount = receiverIdentificationAmount
    values.isInclusive = isInclusive
    delete values.amount
    delete values.is_inclusive
    let API = "";
    if (interbank) {
      API = "partnerCashier/interBank/sendToOperational"
    } else {
      API = "partnerCashier/sendToOperational"
    }
    try {
      const res = await axios.post(`${API_URL}/${API}`, {
        ...values,
        token,
      });
      if (res.status === 200) {
        if (res.data.status === 0) {
          toast.error(res.data.message);
          setLoading(false);
        } else {
          toast.success(res.data.message);
          setShowReceipt(true);
        }
      } else {
        toast.error(res.data.message);
        setLoading(false);
      }
    } catch (err) {
      toast.error('Something went wrong');
    }
  };

  useEffect(() => {
    getLiveFee(amount);
  }, [interbank]);

  return (
    <Popup bigBody close={close}>
      {showOtp ? (
        <div>
          {showReceipt ? (
            <OperationalTransactionReceipt
              values={values}
              close={close}
            />
          ) : (
              <OtpPopup
                values={values}
                execute={handleOnProceedClick}
                close={close}
              />
            )}
        </div>
      ) : (
          <div>
            <h1>Send Money to Operational</h1>
            <Formik
              initialValues={{
                ccode: '+221',
                givenname: '',
                familyname: '',
                note: '',
                senderIdentificationCountry: 'Senegal',
                senderIdentificationType: '',
                senderIdentificationNumber: '',
                senderIdentificationValidTill: '',
                address1: '',
                state: '',
                zip: '',
                country: 'Senegal',
                email: '',
                mobile: '',
                livefee: '',
                requireOTP: '',
                wallet_id: '',
                amount: '',
                is_inclusive: false,
                interbank: true,
                // termsAndCondition: false,
              }}
              onSubmit={async values => {
                values.livefee = liveFee;
                values.requireOTP = '111111';
                haldleOtpClick(values);
              }}
              validationSchema={Yup.object().shape({
                mobile: Yup.string()
                  .min(10, 'number should be atleast 10 digits')
                  .max(10, 'number cannot exceed 10 digits')
                  .matches(
                    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
                    'Mobile no must be valid',
                  )
                  .required('Mobile no is required'),
                wallet_id: Yup.string().required('Wallet Id is required'),
                givenname: Yup.string().required('Given Name is required'),
                familyname: Yup.string().required('Family Name is required'),
                country: Yup.string().required('Country is required'),
                email: Yup.string()
                  .email('Email is invalid')
                  .required('Email is required'),
                senderIdentificationType: Yup.string().required('Type is required'),
                senderIdentificationNumber: Yup.number().required(
                  'Number no is required',
                ),
                senderIdentificationValidTill: Yup.string().required(
                  'Date is required',
                ),
                amount: Yup.number().required(
                  'Amount is required',
                ),
                senderIdentificationCountry: Yup.string().required(
                  'Country is required',
                ),
                // termsAndCondition: Yup.boolean().oneOf(
                //   [true],
                //   'You must accept the terms and conditions.',
                // ),
              })}
            >
              {formikProps => {
                const {
                  values,
                  touched,
                  errors,
                  isSubmitting,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  setFieldValue,
                } = formikProps;
                const senderIdentificationTypeChange = event => {
                  const { value } = event.target;
                  setFieldValue('senderIdentificationType', value, true);
                };
                const senderIdentificationCountryChange = event => {
                  const { value } = event.target;
                  setFieldValue('senderIdentificationCountry', value, true);
                };
                const countryChange = event => {
                  const { value } = event.target;
                  const { title } = event.target.options[event.target.selectedIndex];
                  setFieldValue('ccode', title, true);
                  setFieldValue('country', value, true);
                };
                const handleDateChange = (date, field) => {
                  const formattedDate = new Date(date).toLocaleDateString();
                  setFieldValue(field, formattedDate, true);
                };

                return (
                  <Form>
                    <Grid
                      container
                      direction="row"
                      alignItems="center"
                      justify="center"
                    >
                      <Grid item md={6} xs={12}>
                        <Grid
                          container
                          direction="column"
                          className={classes.dialogGridLeft}
                        >
                          <Typography
                            variant="h6"
                            className={classes.dialogSubHeader}
                          >
                            Sender's Info
                    </Typography>
                          <Grid container direction="row" alignItems="flex-start">
                            <Grid
                              item
                              xs={2}
                              alignItems="center"
                              className={classes.dialogTextFieldGrid}
                            >
                              <TextField
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                size="small"
                                autoFocus
                                id="form-phone-pre"
                                value={values.ccode}
                                variant="outlined"
                                type="text"
                                name="ccode"
                                disabled
                              />
                            </Grid>
                            <Grid
                              item
                              xs={10}
                              alignItems="center"
                              className={classes.dialogTextFieldGrid}
                            >
                              <TextField
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                size="small"
                                autoFocus
                                error={errors.mobile && touched.mobile}
                                name="mobile"
                                id="form-phone"
                                label="Phone No"
                                fullWidth
                                placeholder=""
                                variant="outlined"
                                type="text"
                                value={values.mobile}
                                onChange={handleChange}
                                // onBlur={() => getSenderUser(values.mobile)}
                                className={classes.dialogTextFieldGrid}
                                helperText={
                                  errors.mobile && touched.mobile ? errors.mobile : ''
                                }
                              />
                            </Grid>
                          </Grid>
                          <Grid container direction="row" alignItems="flex-start">
                            <Grid
                              item
                              xs={6}
                              alignItems="center"
                              className={classes.dialogTextFieldGrid}
                            >
                              <TextField
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                size="small"
                                name="givenname"
                                id="form-given-name"
                                label="Given Name"
                                error={errors.givenname && touched.givenname}
                                fullWidth
                                placeholder=""
                                variant="outlined"
                                type="text"
                                value={values.givenname}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={classes.dialogTextFieldGrid}
                                helperText={
                                  errors.givenname && touched.givenname
                                    ? errors.givenname
                                    : ''
                                }
                              />
                            </Grid>
                            <Grid
                              item
                              xs={6}
                              alignItems="center"
                              className={classes.dialogTextFieldGrid}
                            >
                              <TextField
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                size="small"
                                name="familyname"
                                id="form-family-name"
                                label="Family Name"
                                fullWidth
                                placeholder=""
                                variant="outlined"
                                type="text"
                                value={values.familyname}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={classes.dialogTextFieldGrid}
                                error={errors.familyname && touched.familyname}
                                helperText={
                                  errors.familyname && touched.familyname
                                    ? errors.familyname
                                    : ''
                                }
                              />
                            </Grid>
                          </Grid>

                          <Grid container direction="row" alignItems="flex-start">
                            <Grid
                              item
                              xs={12}
                              md={12}
                              alignItems="center"
                              className={classes.dialogTextFieldGrid}
                            >
                              <TextField
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                size="small"
                                name="address1"
                                id="form-address"
                                label="Address"
                                fullWidth
                                placeholder=""
                                variant="outlined"
                                type="text"
                                value={values.address1}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={classes.dialogTextFieldFullRow}
                              />
                            </Grid>
                          </Grid>

                          <Grid container direction="row" alignItems="flex-start">
                            <Grid
                              item
                              xs={6}
                              alignItems="center"
                              className={classes.dialogTextFieldGrid}
                            >
                              <TextField
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                size="small"
                                name="state"
                                id="form-state"
                                label="State"
                                fullWidth
                                placeholder=""
                                variant="outlined"
                                type="text"
                                value={values.state}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={classes.dialogTextField}
                              />
                            </Grid>
                            <Grid
                              item
                              xs={6}
                              alignItems="center"
                              className={classes.dialogTextFieldGrid}
                            >
                              <TextField
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                size="small"
                                name="zip"
                                id="form-zip"
                                label="Zip Code"
                                fullWidth
                                placeholder=""
                                variant="outlined"
                                type="text"
                                value={values.zip}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={classes.dialogTextField}
                              />
                            </Grid>
                          </Grid>

                          <Grid container direction="row" alignItems="flex-start">
                            <Grid
                              item
                              xs={6}
                              alignItems="center"
                              className={classes.dialogTextFieldGrid}
                            >
                              <CountrySelectBox
                                type="text"
                                name="country"
                                value={values.country}
                                onChange={countryChange}
                                data-change="ccode"
                                required
                              />
                              {errors.country && touched.country ? (
                                <div
                                  style={{
                                    fontSize: '10px',
                                    color: 'red',
                                    paddingLeft: '5px',
                                  }}
                                >
                                  {errors.country}
                                </div>
                              ) : (
                                  ''
                                )}
                            </Grid>
                            <Grid
                              item
                              xs={6}
                              alignItems="center"
                              className={classes.dialogTextFieldGrid}
                            >
                              <TextField
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                size="small"
                                name="email"
                                id="form-email"
                                label="Email"
                                fullWidth
                                placeholder=""
                                variant="outlined"
                                type="email"
                                value={values.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={classes.dialogTextFieldGrid}
                                error={errors.email && touched.email}
                                helperText={
                                  errors.email && touched.email ? errors.email : ''
                                }
                              />
                            </Grid>
                          </Grid>

                          <Typography
                            variant="h6"
                            className={classes.dialogSubHeader}
                          >
                            Sender's Identification
                    </Typography>

                          <Grid container direction="row" alignItems="flex-start">
                            <Grid
                              item
                              xs={6}
                              alignItems="center"
                              className={classes.dialogTextFieldGrid}
                            >
                              <CountrySelectBox
                                type="text"
                                name="country"
                                value={values.senderIdentificationCountry}
                                onChange={senderIdentificationCountryChange}
                              />
                            </Grid>
                            <Grid
                              item
                              xs={6}
                              alignItems="center"
                              className={classes.dialogTextFieldGrid}
                            >
                              <TypeSelectBox
                                type="text"
                                name="senderIdentificationType"
                                value={values.senderIdentificationType}
                                onChange={senderIdentificationTypeChange}
                                required
                              />
                              {errors.senderIdentificationType &&
                                touched.senderIdentificationType ? (
                                  <div
                                    style={{
                                      fontSize: '10px',
                                      color: 'red',
                                      paddingLeft: '5px',
                                    }}
                                  >
                                    {errors.senderIdentificationType}
                                  </div>
                                ) : (
                                  ''
                                )}
                            </Grid>
                          </Grid>

                          <Grid container direction="row" alignItems="flex-start">
                            <Grid
                              item
                              xs={6}
                              alignItems="center"
                              className={classes.dialogTextFieldGrid}
                            >
                              <TextField
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                size="small"
                                name="senderIdentificationNumber"
                                id="form-identification-number"
                                label="Number"
                                fullWidth
                                placeholder=""
                                variant="outlined"
                                type="number"
                                value={values.senderIdentificationNumber}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={classes.dialogTextFieldGrid}
                                error={
                                  errors.senderIdentificationNumber &&
                                  touched.senderIdentificationNumber
                                }
                                helperText={
                                  errors.senderIdentificationNumber &&
                                    touched.senderIdentificationNumber
                                    ? errors.senderIdentificationNumber
                                    : ''
                                }
                              />
                            </Grid>
                            <Grid
                              item
                              xs={6}
                              alignItems="center"
                              className={classes.dialogTextFieldGrid}
                            >
                              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardDatePicker
                                  id="date-picker-dialog"
                                  label="Valid Till"
                                  size="small"
                                  minDate={date}
                                  fullWidth
                                  inputVariant="outlined"
                                  format="dd/MM/yyyy"
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                  value={values.senderIdentificationValidTill}
                                  onChange={date =>
                                    handleDateChange(
                                      date,
                                      'senderIdentificationValidTill',
                                    )
                                  }
                                  KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                  }}
                                  error={
                                    errors.senderIdentificationValidTill &&
                                    touched.senderIdentificationValidTill
                                  }
                                  helperText={
                                    errors.senderIdentificationValidTill &&
                                      touched.senderIdentificationValidTill
                                      ? errors.senderIdentificationValidTill
                                      : ''
                                  }
                                />
                              </MuiPickersUtilsProvider>
                            </Grid>
                          </Grid>
                          {/*  <Grid container direction="column" alignItems="flex-start">
                      <Grid item className={classes.dialogTextFieldGrid}>
                        <Checkbox name="requireOTP"/>
                        <span>require OTP</span>
                      </Grid>
                    </Grid> */}
                        </Grid>
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <Grid
                          container
                          direction="column"
                          className={classes.dialogGridRight}
                        >
                          <Typography
                            variant="h6"
                            className={classes.dialogSubHeader}
                          >
                            Receivers's Info
                    </Typography>
                          <Grid container direction="row" alignItems="flex-start">
                            <Grid
                              item
                              xs={6}
                              md={6}
                              alignItems="center"
                              className={classes.dialogTextFieldGrid}
                            >
                              <TextField
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                size="small"
                                error={
                                  errors.wallet_id && touched.wallet_id
                                }
                                name="wallet_id"
                                id="form-phone"
                                label="Wallet Id"
                                placeholder=""
                                variant="outlined"
                                type="text"
                                fullWidth
                                value={values.wallet_id}
                                ref={anchorRef}
                                aria-controls={
                                  openWalletPopup ? 'menu-list-grow' : undefined
                                }
                                aria-haspopup="true"
                                onChange={e => {
                                  handleChange(e);
                                }}
                                onBlur={handleBlur}
                                className={classes.dialogTextFieldGrid}
                                helperText={
                                  errors.wallet_id && touched.wallet_id
                                    ? errors.wallet_id
                                    : ''
                                }
                              />
                            </Grid>
                            <Popper
                              open={openWalletPopup}
                              anchorEl={anchorRef.current}
                              role={undefined}
                              transition
                              style={{ width: '300px', zIndex: '3' }}
                              disablePortal
                            >
                              {({ TransitionProps, placement }) => (
                                <Grow
                                  {...TransitionProps}
                                  style={{
                                    transformOrigin:
                                      placement === 'bottom'
                                        ? 'center top'
                                        : 'center bottom',
                                  }}
                                >
                                  <Paper>
                                    <MenuList
                                      autoFocusItem={openWalletPopup}
                                      id="menu-list-grow"
                                    >
                                      {isUserLoading ? (
                                        <CircularProgress />
                                      ) : (
                                          <MenuItem
                                            style={{
                                              fontWeight: '600',
                                              background: '#f5d18f',
                                              color: 'green',
                                            }}
                                            onClick={() =>
                                              handleWalletSelection(
                                                values.receiverMobile,
                                                availableWallet,
                                              )
                                            }
                                          >
                                            {availableWallet}
                                          </MenuItem>
                                        )}
                                    </MenuList>
                                  </Paper>
                                </Grow>
                              )}
                            </Popper>
                          </Grid>

                          <Grid container direction="row" alignItems="flex-start">
                            <Grid
                              item
                              xs={2}
                              alignItems="center"
                              className={classes.dialogTextFieldGrid}
                            >
                              <TextField
                                size="small"
                                id="form-amount-pre"
                                label="XOF"
                                variant="outlined"
                                type="text"
                                disabled
                              />
                            </Grid>
                            <Grid
                              item
                              xs={10}
                              alignItems="center"
                              className={classes.dialogTextFieldGrid}
                            >
                              <TextField
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                size="small"
                                name="amount"
                                id="form-sending-amount"
                                label="Amount"
                                fullWidth
                                placeholder=""
                                variant="outlined"
                                type="number"
                                value={values.amount}
                                onChange={handleChange}
                                onBlur={e =>
                                  getLiveFee(values.amount)
                                }
                                className={classes.dialogTextFieldGridFullRow}
                                error={
                                  errors.amount &&
                                  touched.amount
                                }
                                helperText={
                                  errors.amount &&
                                    touched.amount
                                    ? errors.amount
                                    : ''
                                }
                              />
                            </Grid>
                          </Grid>

                          <Grid container direction="row" alignItems="flex-start">
                            <Grid
                              item
                              xs={12}
                              alignItems="center"
                              className={classes.dialogTextFieldGrid}
                            >
                              <TextField
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                size="small"
                                name="note"
                                id="form-note"
                                fullWidth
                                placeholder="Note"
                                variant="outlined"
                                multiline
                                rows="4"
                                type="text"
                                value={values.note}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                            </Grid>
                          </Grid>
                          <div style={{ marginLeft: '1%' }}>
                            <Checkbox name="is_inclusive" />
                            <span>Receiver pays transaction fees</span>
                          </div>
                          <div style={{ marginLeft: '1%' }}>
                            <Checkbox
                              name="interbank"
                              onChange={handleFeeTypeChange(values.interbank, values.amount)
                              }
                            />
                            <span>Is receivers from different bank ?</span>
                          </div>
                          <Typography
                            style={{
                              color: 'rgb(53, 153, 51)',
                              fontSize: '14px',
                              marginBottom: '2%',
                            }}
                          >
                            {CURRENCY} {liveFee} will be charged as fee and {CURRENCY}{' '}
                            {!values.is_inclusive
                              ? values.amount
                                ? values.amount
                                : '0'
                              : values.amount
                                ? values.amount - liveFee
                                : '0'}{' '}
                      will be sent to the receiver
                    </Typography>
                          <Grid
                            container
                            direction="row"
                            justify="space-between"
                            alignItems="center"
                            className={classes.dialogTextFieldGrid}
                          >
                            <Button
                              type="submit"
                              fullWidth
                              onClick={handleSubmit}
                              className={classes.proceedButton}
                              variant="contained"
                              color="primary"
                              disableElevation
                              disabled={
                                isSubmitting &&
                                values.amount
                              }
                            >
                              {loading ? (
                                <Loader></Loader>
                              ) : (
                                  <Typography variant="h6">
                                    {values.amount
                                      ? 'Collect '
                                      : ''}
                                    {values.amount
                                      ? values.is_inclusive
                                        ? `${values.amount} and `
                                        : `${values.amount +
                                        liveFee} and `
                                      : ''}
                            Proceed
                                  </Typography>
                                )}
                            </Button>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Form>
                );
              }}
            </Formik>
          </div>
        )}
    </Popup>
  );
};

export default CashierToWalletForm;
