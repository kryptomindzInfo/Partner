import React, { Fragment } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import { Grid, Typography } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import InputAdornment from '@material-ui/core/InputAdornment';
import axios from 'axios';
import Paper from '@material-ui/core/Paper';
import PdfIcon from '../images/pdf_icon.png';
import DocumentIcon from '../images/document_icon.png';
import { API_URL, CONTRACT_URL } from '../containers/App/constants';

const dialogTilteStyles = theme => ({
  root: {
    margin: 0,
    color: 'white',
    textAlign: 'center',
    backgroundColor: 'orange',
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: 'white',
  },
});

const DialogTitle = withStyles(dialogTilteStyles)(props => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <i className="material-icons">close</i>
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const dialogContentStyles = makeStyles(() => ({
  '@global': {
    'MuiOutlinedInput-input': {
      padding: '12.5px 10px 12.5px 10px',
    },
  },
  dialogNonWallet: {
    paddingTop: '5%',
  },
  dialogGridMiddle: {
    align: 'center',
    paddingTop: '10%',
    paddingLeft: '10%',
    paddingRight: '10%',
  },
  dialogGridLeft: {
    paddingTop: '5%',
    paddingBottom: '2%',
    paddingLeft: '10%',
    paddingRight: '2%',
  },
  dialogGridRight: {
    paddingTop: '5%',
    paddingBottom: '2%',
    paddingRight: '10%',
    paddingLeft: '2%',
    marginRight: '5px',
  },
  dialogTextFieldGrid: {
    paddingLeft: '1%',
    paddingRight: '1%',
    paddingBottom: '1.5%',
  },
  dialogTextField: {
    paddingLeft: '1%',
    paddingRight: '1%',
  },
  dialogTextFieldGridErrorText: {
    color: 'red',
    fontSize: '12px',
  },
  dialogTextFieldFullRow: {
    padding: '0.5%',
    marginBottom: '10px',
  },
  dialogSubHeader: {
    paddingBottom: '4%',
    paddingRight: '3%',
    paddingLeft: '3%',
  },
  dialogButton: {
    padding: '2%',
  },
  dialogPaperSmall: {
    minHeight: '40%',
    maxHeight: '40%',
    minWidth: '50%',
    maxWidth: '50%',
  },
  dialogPaperLarge: {
    minHeight: '75%',
    maxHeight: '75%',
    minWidth: '75%',
    maxWidth: '75%',
  },
  dialogPaper: {
    height: '500px',
    padding: '2%',
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    margin: '2%',
    width: '100%',
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
      color: '#333',
    },
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
  documentCard: {
    display: 'flex',
    flexDirection: 'column',
    width: '178px',
    height: '150px',
    borderRadius: '5px',
    justifyContent: 'center',
    marginLeft: '20px',
    marginTop: '20px',
    alignItems: 'center',
    border: 'solid 1px #e9eff4',
    cursor: 'pointer',
    '&:hover': {
      border: 'solid 1px #4da1ff',
    },
  },
}));

export default function FormDialog() {
  const classes = dialogContentStyles();
  const [open, setOpen] = React.useState(false);
  const [user, setUser] = React.useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setUser(null);
    localStorage.removeItem('editableUser');
  };

  const handleDocumentUploadChange = e => {
    if (e.target.files !== undefined) {
      Object.values(e.target.files).map(file => {
        fileUpload(file, e.target.getAttribute('data-key'));
      });
    }
  };
  const triggerBrowse = inp => {
    const input = document.getElementById(inp);
    input.click();
  };

  const fileUpload = (file, key) => {
    const doc = {};
    doc.name = file.name;
    doc.type = file.type;
    const formData = new FormData();
    formData.append('file', file);
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    };
    let method = 'fileUpload';

    if (key === 'contract') {
      method = 'ipfsUpload';
    }

    const token = localStorage.getItem('cashierLogged');

    axios
      .post(`${API_URL}/${method}?token=${token}`, formData, config)
      .then(res => {
        if (res.status === 200) {
          if (res.data.error) {
            throw res.data.error;
          } else {
            doc.hash = res.data.name;
            user.docs_hash.push(doc);
            setUser(user);
          }
        } else {
          throw res.data.error;
        }
      })
      .catch(err => {
        console.log('An error occurred while uploading document');
      });
  };

  return (
    <Fragment>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Verify User
      </Button>
      <Dialog
        maxWidth={user ? 'md' : 'sm'}
        fullWidth
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        classes={{
          paper: user ? classes.dialogPaperLarge : classes.dialogPaperSmall,
        }}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Verify User
        </DialogTitle>
        {user === null ? (
          <Formik
            initialValues={{
              mobile: '',
            }}
            onSubmit={values => {
              const token = localStorage.getItem('cashierLogged');
              const { mobile } = values;
              axios
                .post(`${API_URL}/cashier/getUser`, { token, mobile })
                .then(res => {
                  if (res.data.error) {
                    setUser({});
                    throw res.data.error;
                  } else {
                    setUser(res.data.data);
                    localStorage.setItem(
                      'editableUser',
                      JSON.stringify(res.data.data),
                    );
                  }
                })
                .catch(error => {
                  console.log(error);
                });
            }}
            validationSchema={Yup.object().shape({
              mobile: Yup.string()
                .matches(
                  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
                  'Mobile no must be valid',
                )
                .required('Mobile no is required'),
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
              } = formikProps;
              return (
                <Form onSubmit={handleSubmit}>
                  <Grid item xs={12} alignItems="center" justify="center">
                    <Grid
                      container
                      direction="column"
                      alignItems="center"
                      justify="center"
                      direaction="column"
                      className={classes.dialogGridMiddle}
                    >
                      <Grid container justify="center" alignItems="center">
                        <Grid
                          container
                          direction="row"
                          justify="center"
                          alignItems="center"
                          className={classes.dialogTextFieldGrid}
                        >
                          <TextField
                            autoFocus
                            error={errors.mobile && touched.mobile}
                            name="mobile"
                            id="form-phone"
                            label="Phone No"
                            placeholder=""
                            variant="outlined"
                            type="number"
                            value={values.mobile}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={classes.dialogTextFieldGrid}
                            helperText={
                              errors.mobile && touched.mobile
                                ? errors.mobile
                                : ''
                            }
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  +91
                                </InputAdornment>
                              ),
                            }}
                            style={{ width: '60%' }}
                          />
                        </Grid>
                        <Grid
                          container
                          direction="row"
                          justify="center"
                          alignItems="center"
                          className={classes.dialogTextFieldGrid}
                        >
                          <Button
                            type="submit"
                            fullWidth
                            className={classes.proceedButton}
                            variant="contained"
                            color="primary"
                            disableElevation
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            style={{ padding: '3%', width: '60%' }}
                          >
                            Proceed
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Form>
              );
            }}
          </Formik>
        ) : (
          <Formik
            enableReinitialize={user}
            initialValues={{
              mobile: user.mobile || '',
              name: user.name || '',
              last_name: '',
              address: user.address || '',
              state: user.state || '',
              receiverZip: user.zip || '',
              country: user.country || '',
              email: user.email || '',
              id_name: '',
              id_type: '',
              id_number: '',
              valid_till: '',
              city: '',
              dob: '',
              gender: '',
              sending_amount: '',
            }}
            onSubmit={values => {
              const cashiertoken = localStorage.getItem('cashierLogged');
              axios
                .post(
                  user
                    ? `${API_URL}/cashier/editUser`
                    : `${API_URL}/cashier/createUser`,
                  {
                    cashiertoken,
                    ...values,
                    docs_hash: user.docs_hash,
                    bank: user.bank,
                    password: user.password,
                    otp: user.otp,
                  },
                )
                .then(res => {
                  if (res.data.error) {
                    throw res.data.error;
                  } else {
                    setOpen(false);
                    const { mobile } = JSON.parse(
                      localStorage.getItem('editableUser'),
                    );
                    return axios
                      .post(`${API_URL}/cashier/activateUser`, {
                        token: cashiertoken,
                        mobile,
                      })
                      .then(r => {
                        if (r.data.error) {
                          throw r.data.error;
                        } else {
                          setUser(null);
                        }
                      })
                      .catch(error => {
                        console.log(error);
                        setUser(null);
                      });
                  }
                })
                .catch(error => {
                  console.log(error);
                  setUser(null);
                });
            }}
            validationSchema={Yup.object().shape({
              mobile: Yup.string()
                .matches(
                  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
                  'Mobile no must be valid',
                )
                .required('Mobile no is required'),
              name: Yup.string().required('Given Name is required'),
              last_name: Yup.string().required('Family Name is required'),
              country: Yup.string().required('Country is required'),
              email: Yup.string()
                .email('Email is invalid')
                .required('Email is required'),
              id_type: Yup.string().required('Type is required'),
              id_name: Yup.string().required('Name is required'),
              id_number: Yup.number().required('Number no is required'),
              valid_till: Yup.string().required('Date is required'),
              sending_amount: Yup.number().required('Amount is required'),
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
              } = formikProps;
              return (
                <Form onSubmit={handleSubmit}>
                  <Grid container direction="row">
                    <Grid item md={6} xs={12}>
                      <Grid
                        container
                        direction="column"
                        className={classes.dialogGridLeft}
                      >
                        <Grid container direction="row" alignItems="flex-start">
                          <Grid
                            item
                            xs={2}
                            alignItems="center"
                            className={classes.dialogTextFieldGrid}
                          >
                            <TextField
                              autoFocus
                              id="form-phone-pre"
                              label="+91"
                              className={classes.formField}
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
                              autoFocus
                              error={errors.mobile && touched.mobile}
                              name="mobile"
                              id="form-phone"
                              label="Phone No"
                              fullWidth
                              placeholder=""
                              variant="outlined"
                              type="number"
                              value={values.mobile}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className={classes.dialogTextFieldGrid}
                              helperText={
                                errors.mobile && touched.mobile
                                  ? errors.mobile
                                  : ''
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
                              name="name"
                              id="form-given-name"
                              label="Given Name"
                              error={errors.name && touched.name}
                              fullWidth
                              placeholder=""
                              variant="outlined"
                              type="text"
                              value={values.name}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className={classes.dialogTextFieldGrid}
                              helperText={
                                errors.name && touched.name ? errors.name : ''
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
                              name="last_name"
                              id="form-family-name"
                              label="Family Name"
                              fullWidth
                              placeholder=""
                              variant="outlined"
                              type="text"
                              value={values.last_name}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className={classes.dialogTextFieldGrid}
                              error={errors.last_name && touched.last_name}
                              helperText={
                                errors.last_name && touched.last_name
                                  ? errors.last_name
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
                              name="address"
                              id="form-address"
                              label="Address"
                              fullWidth
                              placeholder=""
                              variant="outlined"
                              type="text"
                              value={values.address}
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
                              name="receiverZip"
                              id="form-zip"
                              label="Zip Code"
                              fullWidth
                              placeholder=""
                              variant="outlined"
                              type="text"
                              value={values.receiverZip}
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
                            <TextField
                              name="country"
                              id="form-country"
                              label="Country"
                              fullWidth
                              placeholder=""
                              variant="outlined"
                              type="text"
                              value={values.country}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className={classes.dialogTextFieldGrid}
                              error={errors.country && touched.country}
                              helperText={
                                errors.country && touched.country
                                  ? errors.country
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
                                errors.email && touched.email
                                  ? errors.email
                                  : ''
                              }
                            />
                          </Grid>
                        </Grid>

                        <Typography
                          variant="h5"
                          className={classes.dialogSubHeader}
                        >
                          Identification
                        </Typography>

                        <Grid container direction="row" alignItems="flex-start">
                          <Grid
                            item
                            xs={6}
                            alignItems="center"
                            className={classes.dialogTextFieldGrid}
                          >
                            <TextField
                              name="id_name"
                              id="form-identification-country"
                              label="Name"
                              fullWidth
                              placeholder=""
                              variant="outlined"
                              type="text"
                              value={values.id_name}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className={classes.dialogTextFieldGrid}
                              error={errors.id_name && touched.id_name}
                              helperText={
                                errors.id_name && touched.id_name
                                  ? errors.id_name
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
                              name="id_type"
                              id="form-fidentification-type"
                              label="Type"
                              fullWidth
                              placeholder=""
                              variant="outlined"
                              type="text"
                              value={values.id_type}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className={classes.dialogTextFieldGrid}
                              error={errors.id_type && touched.id_type}
                              helperText={
                                errors.id_type && touched.id_type
                                  ? errors.id_type
                                  : ''
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
                              name="id_number"
                              id="form-identification-number"
                              label="Number"
                              fullWidth
                              placeholder=""
                              variant="outlined"
                              type="number"
                              value={values.id_number}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className={classes.dialogTextFieldGrid}
                              error={errors.id_number && touched.id_number}
                              helperText={
                                errors.id_number && touched.id_number
                                  ? errors.id_number
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
                              name="valid_till"
                              id="form-idetification-valid-till"
                              label="Valid Till"
                              fullWidth
                              InputLabelProps={{
                                shrink: true,
                              }}
                              placeholder=""
                              variant="outlined"
                              type="date"
                              value={values.valid_till}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className={classes.dialogTextFieldGrid}
                              error={errors.valid_till && touched.valid_till}
                              helperText={
                                errors.valid_till && touched.valid_till
                                  ? errors.valid_till
                                  : ''
                              }
                            />
                          </Grid>
                        </Grid>

                        <Grid container direction="row" alignItems="flex-start">
                          <Grid
                            item
                            xs={2}
                            alignItems="center"
                            className={classes.dialogTextFieldGrid}
                          >
                            <TextField
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
                              name="sending_amount"
                              id="form-sending-amount"
                              label="Amount"
                              fullWidth
                              placeholder=""
                              variant="outlined"
                              type="number"
                              value={values.sending_amount}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className={classes.dialogTextFieldGridFullRow}
                              error={
                                errors.sending_amount && touched.sending_amount
                              }
                              helperText={
                                errors.sending_amount && touched.sending_amount
                                  ? errors.sending_amount
                                  : ''
                              }
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <Grid
                        container
                        direction="column"
                        justify="space-evenly"
                        alignItems="center"
                        className={classes.dialogGridRight}
                      >
                        <Button
                          fullWidth
                          disableRipple
                          variant="contained"
                          color="primary"
                          onClick={() => triggerBrowse('contract')}
                          className={classes.dialogButton}
                        >
                          <input
                            id="contract"
                            onChange={e => handleDocumentUploadChange(e)}
                            data-key="contract"
                            multiple
                            style={{ width: '0px', visibility: 'hidden' }}
                            accept=".pdf,.docs"
                            type="file"
                          />
                          Upload Documents
                        </Button>

                        <Paper
                          variant="outlined"
                          className={classes.dialogPaper}
                        >
                          {user.docs_hash.length > 0 ? (
                            user.docs_hash.map((value, index) => (
                              <a
                                target="_blank"
                                href={`${CONTRACT_URL}/${value.hash}`}
                              >
                                <div
                                  key={index}
                                  className={classes.documentCard}
                                >
                                  <img
                                    width={60}
                                    height={70}
                                    src={
                                      value.type === 'application/pdf'
                                        ? PdfIcon
                                        : DocumentIcon
                                    }
                                  />
                                  <span style={{ marginTop: '20px' }}>
                                    {value.name}
                                  </span>
                                </div>
                              </a>
                            ))
                          ) : (
                            <Typography variant="headline">
                              No documents uploaded
                            </Typography>
                          )}
                        </Paper>
                        <Button
                          type="submit"
                          fullWidth
                          className={classes.dialogButton}
                          variant="contained"
                          color="primary"
                          disableRipple
                          onClick={handleSubmit}
                          disabled={isSubmitting}
                        >
                          Proceed
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Form>
              );
            }}
          </Formik>
        )}
      </Dialog>
    </Fragment>
  );
}
