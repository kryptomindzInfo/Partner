import React, { useEffect } from 'react';

import Loader from '../../../components/Loader';
import { STATIC_URL } from '../../App/constants';
import { fetchInfraMerchantList } from './Api/InfraMerchantApi';
import history from '../../../utils/history';

function InfraMerchantList(props) {
  const [addMerchantPopup, setAddMerchantPopup] = React.useState(false);
  const [merchantList, setMerchantList] = React.useState([]);
  const [popupType, setPopupType] = React.useState('new');
  const [editingMerchant, setEditingMerchant] = React.useState({});
  const [isLoading, setLoading] = React.useState(false);
  const { match } = props;
  const { id } = match.params;

  const handleMerchantPopupClick = (type, merchant) => {
    setEditingMerchant(merchant);
    setPopupType(type);
    setAddMerchantPopup(true);
  };

  const onPopupClose = () => {
    setAddMerchantPopup(false);
  };

  const getMerchantList = async () => {
    setLoading(true);
    fetchInfraMerchantList(id)
      .then(data => {
        setMerchantList(data.list);
        setLoading(data.loading);
      })
      .catch(error => {
        setLoading(false);
      });
  };
  useEffect(() => {
    getMerchantList();
  }, []); // Or [] if effect doesn't need props or state

  const merchants = merchantList.map(merchant => (
    <tr key={merchant._id}>
      <td className="tac">
        <img
          style={{ height: '60px', width: '60px' }}
          src={`${STATIC_URL}${merchant.logo}`}
        />
      </td>
      <td className="tac">{merchant.name}</td>
      <td className="tac">{merchant.bills_paid}</td>
      <td className="tac">{merchant.bills_raised}</td>
      <td className="tac">{merchant.amount_collected}</td>
      <td className="tac">{merchant.amount_due}</td>
      <td className="tac">{merchant.fee_generated}</td>
      <td className="tac">
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <td className="tac">{merchant.creator === 0 ? 'Bank' : 'Infra'}</td>
          <span
            style={{ top: 'inherit' }}
            className="absoluteMiddleRight primary popMenuTrigger"
          >
            <i className="material-icons ">more_vert</i>
            <div className="popMenu">
            {merchant.creator === 1 ? (
              <span
                onClick={() => handleMerchantPopupClick('update', merchant)}
              >
                Edit
              </span>
            ) : null}
              <span
                onClick={() => {
                  localStorage.setItem('selectedBankId', id);
                  localStorage.setItem(
                    'selectedMerchant',
                    JSON.stringify(merchant),
                  );
                  history.push({
                    pathname: `/infra/merchant/fees/${merchant._id}`,
                    state: merchant,
                  });
                }}
              >
                Revenue Sharing Rules
              </span>
              <span
                onClick={() => {
                  localStorage.setItem('selectedBankId', id);
                  localStorage.setItem(
                    'selectedMerchant',
                    JSON.stringify(merchant),
                  );
                  history.push({
                    pathname: `/infra/merchant/commission/${merchant._id}`,
                    state: merchant,
                  });
                }}
              >
                Commission Sharing Rules
              </span>
              {merchant.status === 2 ? (
                <span>Unblock</span>
              ) : (
                <span>Block</span>
              )}
            </div>
          </span>
        </div>
      </td>
    </tr>
  ));
  if (isLoading) {
    return <Loader fullPage />;
  }

  return (
    <div>
      <h1>fwef</h1>
    </div>
  );
}

export default InfraMerchantList;
