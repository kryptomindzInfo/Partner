import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '../../App/constants';

toast.configure({
  position: 'bottom-right',
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
});

const createMerchant = async (props, values, token) => {
  try {
    const res = await axios.post(`${API_URL}/bank/createMerchant`, {
      token,
      ...values,
    });
    if (res.status === 200) {
      if (res.data.status === 0) {
        toast.error(res.data.message);
      } else {
        toast.success(res.data.message);
        props.refreshMerchantList();
        props.onClose();
      }
    } else {
      toast.error(res.data.message);
    }
  } catch (err) {
    toast.error('Something went wrong');
  }
};

const editMerchant = async (props, values, token) => {
  try {
    const res = await axios.post(`${API_URL}/bank/editMerchant`, {
      token,
      status: 1,
      ...values,
    });
    if (res.status === 200) {
      if (res.data.status === 0) {
        toast.error(res.data.message);
      } else {
        toast.success(res.data.message);
        props.refreshMerchantList();
        props.onClose();
      }
    } else {
      toast.error(res.data.message);
    }
  } catch (e) {
    toast.error('Something went wrong');
  }
};
const token = localStorage.getItem('bankLogged');

const fetchMerchantList = async () => {
  try {
    const res = await axios.post(`${API_URL}/bank/listMerchants`, {
      token,
    });
    if (res.status === 200) {
      if (res.data.status === 0) {
        toast.error(res.data.message);
        return { list: [], loading: false };
      }
      return { list: res.data.list, loading: false };
    }
    toast.error(res.data.message);
    return { list: [], loading: false };
  } catch (err) {
    toast.error('Something went wrong');
    return { list: [], loading: false };
  }
};

// Revenue Rule APIs

const createMerchantRule = async (props, ruleType, payload) => {
  let URL = '';
  if (ruleType === 'revenue') {
    URL = `${API_URL}/bank/merchantFee/createRule`;
  } else {
    URL = `${API_URL}/bank/commission/createRule`;
  }
  try {
    const res = await axios.post(URL, {
      token,
      ...payload,
    });
    if (res.status === 200) {
      if (res.data.status === 0) {
        toast.error(res.data.error);
      } else {
        toast.success(res.data.message);
        props.refreshRuleList();
      }
    } else {
      toast.error(res.data.message);
    }
  } catch (e) {
    toast.error('Something went wrong');
  }
};

const editMerchantRule = async (props, ruleType, payload) => {
  let URL = '';
  if (ruleType === 'revenue') {
    URL = `${API_URL}/bank/merchantFee/editRule`;
  } else {
    URL = `${API_URL}/bank/commission/editRule`;
  }
  try {
    const res = await axios.post(URL, {
      token,
      ...payload,
    });
    if (res.status === 200) {
      if (res.data.status === 0) {
        toast.error(res.data.message);
      } else {
        toast.success(res.data.message);
        props.refreshRuleList();
      }
    } else {
      toast.error(res.data.message);
    }
  } catch (e) {
    toast.error('Something went wrong');
  }
};

const getRules = async (ruleType, merchantId) => {
  try {
    let URL = '';
    if (ruleType === 'revenue') {
      URL = `${API_URL}/bank/merchantFee/getRules`;
    } else {
      URL = `${API_URL}/bank/commission/getRules`;
    }
    const res = await axios.post(URL, { token, merchant_id: merchantId });
    if (res.status === 200) {
      if (res.data.status === 0) {
        toast.error(res.data.message);
        return { list: [], loading: false };
      }
      return { list: res.data.rules, loading: false };
    }
    toast.error(res.data.message);
    return { list: [], loading: false };
  } catch (err) {
    toast.error('Something went wrong');
    return { list: [], loading: false };
  }
};

const addInfraShare = async (props, ruleType, payload) => {
  let URL = '';
  if (ruleType === 'revenue') {
    URL = `${API_URL}/bank/merchantFee/addInfraShare`;
  } else {
    URL = `${API_URL}/bank/commission/addInfraShare`;
  }
  try {
    const res = await axios.post(URL, {
      token,
      ...payload,
    });
    if (res.status === 200) {
      if (res.data.status === 0) {
        toast.error(res.data.message);
        return { status: 0, loading: false };
      }
      toast.success(res.data.message);
      props.refreshRuleList();
      return res.data.rule;
    }
    toast.error(res.data.message);
    return { status: 0, loading: false };
  } catch (e) {
    toast.error('Something went wrong');
    return { status: 0, loading: false };
  }
};

const editInfraShare = async (props, ruleType, payload) => {
  let URL = '';
  if (ruleType === 'revenue') {
    URL = `${API_URL}/bank/merchantFee/editInfraShare`;
  } else {
    URL = `${API_URL}/bank/commission/editInfraShare`;
  }
  try {
    const res = await axios.post(URL, {
      token,
      ...payload,
    });
    if (res.status === 200) {
      if (res.data.status === 0) {
        toast.error(res.data.error);
        return { status: 0, loading: false };
      }
      toast.success(res.data.message);
      props.refreshRuleList();
      if (ruleType === 'revenue') {
        return { status: 1, rule: res.data.fee, loading: false };
      }
      return { status: 1, rule: res.data.comm, loading: false };
    }
    toast.error(res.data.error);
    return { status: 0, loading: false };
  } catch (e) {
    toast.error('Something went wrong');
    return { status: 0, loading: false };
  }
};

const updatePartnerShare = async (props, ruleType, payload) => {
  let URL = '';
  if (ruleType === 'Revenue') {
    URL = `${API_URL}/bank/merchantFee/updatePartnersShare`;
  } else {
    URL = `${API_URL}/bank/commission/updatePartnersShare`;
  }
  try {
    const res = await axios.post(URL, {
      token,
      ...payload,
    });
    if (res.status === 200) {
      if (res.data.status === 0) {
        toast.error(res.data.message);
        return { status: 0, loading: false };
      }
      toast.success(res.data.message);
      props.refreshRuleList();
      return res.data.rule;
    }
    toast.error(res.data.message);
    return { status: 0, loading: false };
  } catch (e) {
    toast.error('Something went wrong');
    return { status: 0, loading: false };
  }
};

export {
  createMerchant,
  editMerchant,
  fetchMerchantList,
  createMerchantRule,
  getRules,
  editMerchantRule,
  addInfraShare,
  editInfraShare,
  updatePartnerShare,
};
