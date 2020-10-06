import React, { useState, useEffect } from 'react';
import { Form, Formik, useField } from 'formik';
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
import { API_URL, CURRENCY } from '../../containers/App/constants';
import CountrySelectBox from '../Form/CountrySelectBox';
import TypeSelectBox from '../Form/TypeSelectBox';

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

const CashierToWalletForm = ({ onClose, formValues, isValidFee }) => {
  const classes = styles();
  const date = new Date();
  const [user, setUser] = React.useState({});
  const [liveFee, setLiveFee] = useState(0);
  const [isFeeValid, setIsFeeValid] = useState(isValidFee);

  const anchorRef = React.useRef(null);
  const [walletBankName, setWalletBankName] = React.useState('');
  const [availableWallet, setAvailableWallet] = React.useState('');
  const [openWalletPopup, setWalletPopup] = React.useState(false);
  const [isUserLoading, setUserLoading] = React.useState(false);
  const [selectedMobile, setSelectedMobile] = React.useState('');
  const [interbank, setInterBank] =React.useState(true);
  const [amount, setAmount] =React.useState('');
  const [ccCode, setCcCode] = React.useState('+000');
  const [country, setCountry] = React.useState('');
  const [
    senderIdentificationCountry,
    setSenderIdentificationCountry,
  ] = React.useState('');
  const [
    senderIdentificationType,
    setSenderIdentificationType,
  ] = React.useState('');
  const handleClose = () => {
    onClose();
  };

  const resetWallet = () => {
    setAvailableWallet('');
    setWalletBankName('');
    setSelectedMobile('');
    setWalletPopup(false);
  };

  const getLiveFee = amount => {
    const token = localStorage.getItem('cashierLogged');
    if (amount !== '') {
      let API = "";
      if(interbank){
        API = "partnerCashier/interBank/checkFee"
      } else {
        API = "partnerCashier/checkNonWaltoWalFee"
      }
      axios
        .post(`${API_URL}/${API}`, { token, amount, type:"IBNWW" })
        .then(res => {
          if (res.status === 200) {
            if (res.data.status === 0) {
              setLiveFee('');
              toast.error(res.data.message);
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

  const getUser = value => {
    const token = localStorage.getItem('cashierLogged');
    if (value) {
      if (value.length === 10) {
        if (value === selectedMobile) {
          return true;
        }
        setAvailableWallet('');
        setWalletBankName('');
        return new Promise((resolve, reject) => {
          axios
            .post(`${API_URL}/partnerCashier/getUserByMobile`, {
              mobile: value,
              token,
            })
            .then(res => {
              if (res.data.error || res.data.status !== 1) {
                resolve(false);
                setUserLoading(false);
                setSelectedMobile('');
                return false;
              }
              setAvailableWallet(res.data.data.bank);
              if (!walletBankName) {
                setWalletPopup(true);
              }
              setSelectedMobile(value);
              resolve(true);
              setUserLoading(false);
              return true;
            })
            .catch(err => {
              setSelectedMobile('');
              resolve(false);
            });
        });
      }
      return false;
    }
    return false;
  };

  const getSenderUser = value => {
    const token = localStorage.getItem('cashierLogged');
    if (value) {
      if (value.length === 10) {
        axios
          .post(`${API_URL}/partnerCashier/getUserByMobile`, {
            mobile: value,
            token,
          })
          .then(res => {
            if (res.data.error || res.data.status !== 1) {
              setUser({});
              toast.error(res.data.error);
            } else {
              setUser(res.data.data);
            }
          })
          .catch(err => {
            toast.error(err.response.data.error);
          });
      }
    }
  };

  const handleFeeTypeChange = (inter ,amount) => {
    setAmount(amount);
    setInterBank(inter);
  };

  const handleWalletSelection = (mobile, wallet) => {
    setWalletBankName(`${mobile}@${wallet}`);
    setWalletPopup(false);
  };

  const handleOnProceedClick = values => {
    formValues(values);
  };

  useEffect(() => {
    getLiveFee(amount);
  }, [interbank]);

  return (
    <div>
      <Formik
        enableReinitialize={user}
        initialValues={{
          ccode: '+221',
          givenname: user.name || '',
          familyname: user.last_name || '',
          note: '',
          senderIdentificationCountry: user.country || 'Senegal',
          senderIdentificationType: '',
          senderIdentificationNumber: user.id_number || '',
          senderIdentificationValidTill: user.valid_till || '',
          address1: user.address || '',
          state: user.state || '',
          zip: user.zip || '',
          country: user.country || 'Senegal',
          email: user.email || '',
          mobile: user.mobile || '',
          livefee: '',
          requireOTP: '',
          receiverMobile: '',
          receiverIdentificationAmount: '',
          isInclusive: false,
          interbank: true,
          // termsAndCondition: false,
        }}
        onSubmit={async values => {
          values.livefee = liveFee;
          values.requireOTP = '111111';
          handleOnProceedClick(values);
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
          receiverMobile: Yup.string()
            .min(10, 'number should be atleast 10 digits')
            .max(10, 'number cannot exceed 10 digits')
            .matches(
              /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
              'Mobile no must be valid',
            )
            .required('Mobile no is required')
            .test('numberMatch', 'You cannot send money to yourself!', function(
              value,
            ) {
              return this.parent.mobile !== value;
            })
            .test(
              'WalletCheck',
              'Wallet for this number does not exist!',
              value => getUser(value),
            ),
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
          receiverIdentificationAmount: Yup.number().required(
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
                          onBlur={() => getSenderUser(values.mobile)}
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
                            minDate= {date}
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
                        xs={2}
                        alignItems="center"
                        className={classes.dialogTextFieldGrid}
                      >
                        <TextField
                          size="small"
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
                            errors.receiverMobile && touched.receiverMobile
                          }
                          name="receiverMobile"
                          id="form-phone"
                          label="Phone No"
                          placeholder=""
                          variant="outlined"
                          type="text"
                          fullWidth
                          value={values.receiverMobile}
                          ref={anchorRef}
                          aria-controls={
                            openWalletPopup ? 'menu-list-grow' : undefined
                          }
                          aria-haspopup="true"
                          onChange={e => {
                            handleChange(e);
                            resetWallet();
                          }}
                          onBlur={handleBlur}
                          className={classes.dialogTextFieldGrid}
                          helperText={
                            errors.receiverMobile && touched.receiverMobile
                              ? errors.receiverMobile
                              : ''
                          }
                        />
                      </Grid>
                      <Grid
                        item
                        xs={4}
                        md={4}
                        alignItems="center"
                        className={classes.dialogTextFieldGrid}
                      >
                        {walletBankName ? (
                          <TextField
                            InputLabelProps={{
                              shrink: true,
                            }}
                            id="walletName"
                            disabled
                            fullWidth
                            className={classes.dialogTextFieldGrid}
                            variant="outlined"
                            style={{
                              color: 'green',
                              fontSize: '13px',
                              fontWeight: '600',
                            }}
                            type="text"
                            size="small"
                            value={walletBankName}
                          />
                        ) : (
                          ''
                        )}
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
                                    {values.receiverMobile}@{availableWallet}
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
                          name="receiverIdentificationAmount"
                          id="form-sending-amount"
                          label="Amount"
                          fullWidth
                          placeholder=""
                          variant="outlined"
                          type="number"
                          value={values.receiverIdentificationAmount}
                          onChange={handleChange}
                          onBlur={e =>
                            getLiveFee(values.receiverIdentificationAmount)
                          }
                          className={classes.dialogTextFieldGridFullRow}
                          error={
                            errors.receiverIdentificationAmount &&
                            touched.receiverIdentificationAmount
                          }
                          helperText={
                            errors.receiverIdentificationAmount &&
                            touched.receiverIdentificationAmount
                              ? errors.receiverIdentificationAmount
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
                      <Checkbox name="isInclusive" />
                      <span>Receiver pays transaction fees</span>
                    </div>
                    <div style={{ marginLeft: '1%' }}>
                      <Checkbox
                        name="interbank"
                        onChange={handleFeeTypeChange(values.interbank, values.receiverIdentificationAmount)}
                      />
                      <span>Receiver can recieve from any bank</span>
                    </div>
                    <Typography
                      style={{
                        color: 'rgb(53, 153, 51)',
                        fontSize: '14px',
                        marginBottom: '2%',
                      }}
                    >
                      {CURRENCY} {liveFee} will be charged as fee and {CURRENCY}{' '}
                      {!values.isInclusive
                        ? values.receiverIdentificationAmount
                          ? values.receiverIdentificationAmount
                          : '0'
                        : values.receiverIdentificationAmount
                          ? values.receiverIdentificationAmount - liveFee
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
                          isFeeValid &&
                          values.receiverIdentificationAmount
                        }
                      >
                        <Typography variant="h6">
                          {values.receiverIdentificationAmount
                            ? 'Collect '
                            : ''}
                          {values.receiverIdentificationAmount
                            ? values.isInclusive
                              ? `${values.receiverIdentificationAmount} and `
                              : `${values.receiverIdentificationAmount +
                                  liveFee} and `
                            : ''}
                          Proceed
                        </Typography>
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
  );
};

export default CashierToWalletForm;
