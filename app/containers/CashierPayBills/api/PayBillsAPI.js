import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '../../App/constants';

const token = localStorage.getItem('cashierLogged');
const getUserInvoices = async mobile => {
  try {
    const res = await axios.post(`${API_URL}/partnerCashier/getUserInvoices`, {
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

const getInvoiceDetails = async (number, merchant_id) => {
  try {
    const res = await axios.post(`${API_URL}/partnerCashier/getInvoiceDetails`, {
      token: token,
      number: number,
      merchant_id: merchant_id,
    });
    if (res.status === 200) {
      if (res.data.status === 0) {
        toast.error(res.data.message);
        return { list: [], loading: false };
      }
      return { list: res.data.invoice, loading: false };
    }
    toast.error(res.data.message);
    return { list: [], loading: false };
  } catch (err) {
    toast.error('Something went wrong');
    return { list: [], loading: false };
  }
};

const getInvoiceByCustomerCode = async (customerCode, merchant_id) => {
  try {
    const res = await axios.post(`${API_URL}/partnerCashier/getInvoicesForCustomerCode`, {
      token: token,
      customer_code: customerCode,
      merchant_id: merchant_id,
    });
    if (res.status === 200) {
      if (res.data.status === 0) {
        toast.error(res.data.message);
        return { list: [], loading: false };
      }
      return { list: res.data.invoice, loading: false };
    }
    toast.error(res.data.message);
    return { list: [], loading: false };
  } catch (err) {
    toast.error('Something went wrong');
    return { list: [], loading: false };
  }
};

const payInvoice = async values => {
  console.log(values);
  try {
    const res = await axios.post(`${API_URL}/partnerCashier/payInvoice`, {
      token,
      ...values,
    });
    if (res.status === 200) {
      if (res.data.status === 0) {
        toast.error(res.data.message);
      } else {
        toast.success(res.data.message);
      }
    }
  } catch (err) {
    toast.error('Something went wrong');
  }
};

export { getUserInvoices, getInvoiceDetails, payInvoice, getInvoiceByCustomerCode};
