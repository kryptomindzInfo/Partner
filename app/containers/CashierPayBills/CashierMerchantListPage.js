import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Wrapper from '../../components/Wrapper';
import Container from '../../components/Container';
import Main from '../../components/Main';
import ActionBar from '../../components/ActionBar';
import Card from '../../components/Card';
import Table from '../../components/Table';
import { STATIC_URL } from '../App/constants';
import Loader from '../../components/Loader';
import CashierHeader from '../../components/Header/CashierHeader';
import SidebarCashier from '../../components/Sidebar/SidebarCashier';
import { fetchCashierMerchantList } from './api/CashierMerchantAPI';
import PayBillPopup from './PayBillPopup';
import TransactionReceipt from './TransactionReciept';
import Button from '../../components/Button';
import { isNull } from 'lodash';
import { API_URL } from '../App/constants';
import axios from 'axios';

function CashierMerchantListPage(props) {
  const [addMerchantPopup, setAddMerchantPopup] = React.useState(false);
  const [receiptvalues, setReceiptvalues] = React.useState();
  const [receiptPopup, setReceiptPopup] = React.useState(false);
  const [payBillsPopup, setPayBillsPopup] = React.useState(false);
  const [merchantList, setMerchantList] = React.useState([]);
  const [copyMerchantList, setcopyMerchantList] = React.useState([]);
  const [popupType, setPopupType] = React.useState('new');
  const [editingMerchant, setEditingMerchant] = React.useState({});
  const [isLoading, setLoading] = React.useState(false);
  const [isClosed, setIsClosed] = React.useState(false);
  const logo = localStorage.getItem('bankLogo');
  const token = localStorage.getItem('cashierLogged');

  const handleMerchantPopupClick = (type, merchant) => {
    setEditingMerchant(merchant);
    setPopupType(type);
    setAddMerchantPopup(true);
  };

  const onPopupClose = () => {
    setAddMerchantPopup(false);
  };

  const onReceiptPopupOpen = () => {
    setReceiptPopup(true);
  };

  const onReceiptClose = () => {
    setReceiptPopup(false);
  };

  const onPayBillsPopupClose = () => {
    setPayBillsPopup(false);
    setEditingMerchant({});
  };

  const refreshMerchantList = async () => {
    const data = {};
    setMerchantList(data.list);
    setLoading(data.loading);
  };

  const getMerchantList = async () => {
    setLoading(true);
    fetchCashierMerchantList()
      .then(data => {
        setMerchantList(data.list);
        setLoading(data.loading);
        setcopyMerchantList(data.list);

      })
      .catch(error => setLoading(false));
  };

  const getStats = () => {
    const getStatus = setInterval(function () {
      axios
        .post(`${API_URL}/partnerCashier/getDashStats`, {
          token: token
        })
        .then(res => {
          if (res.status == 200) {
            setIsClosed(res.data.isClosed);
          }
        })
    }, 2000)
  };

  useEffect(() => {
    getMerchantList();
    getStats();
  }, []); // Or [] if effect doesn't need props or state

  const searchlistfunction = (value) => {
    console.log(value)
    // console.log(this.state.searchrules)
    const newfilterdata = copyMerchantList.filter(element =>
      element.name.toLowerCase().includes(value.toLowerCase()),
    );

    setMerchantList(newfilterdata)

    // this.setState({ branches: newfilterdata })

  }

  const getMerchants = () =>
    merchantList.map(merchant => (
      <tr key={merchant._id}>
        <td className="tac">
          <img
            style={{ height: '60px', width: '60px' }}
            src={`${STATIC_URL}${merchant.logo}`}
            alt=""
          />
        </td>
        <td className="tac">{merchant.name}</td>
        <td className="tac" style={{ cursor: 'pointer', color: '#417505' }}>
          {isClosed ? (
            <div>Casier Closed</div>
          ) : (
              <div
                onClick={() => {
                  setEditingMerchant(merchant);
                  setPayBillsPopup(true);
                }}
              >
                Select Merchant
              </div>
            )}
        </td>
      </tr>
    ));
  if (isLoading) {
    return <Loader fullPage />;
  }
  return (
    <Wrapper from="branch">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Dashboard | CASHIER | E-WALLET</title>
      </Helmet>
      <CashierHeader
        active="bills"
        from="cashier"
        bankName={props.match.params.bank}
        bankLogo={STATIC_URL + logo}
      />
      <Container verticalMargin>
        <SidebarCashier
          branchName={props.match.params.bank}
          refresh={() => { }}
        />
        <Main>
          <ActionBar marginBottom="33px" className="clr">
            <div className="iconedInput fl">
              <i className="material-icons">search</i>
              <input type="text" placeholder="Search Merchants" onChange={(e) => {
                searchlistfunction(e.target.value)
              }} />
            </div>
          </ActionBar>
          <Card bigPadding>
            <div className="cardHeader">
              <div className="cardHeaderLeft">
                <i className="material-icons">supervised_user_circle</i>
              </div>
              <div className="cardHeaderRight">
                <h3>Merchant List</h3>
                <h5>Pay your bills safely with us</h5>
              </div>
            </div>
            <div className="cardBody">
              <Table marginTop="34px" smallTd>
                <thead>
                  <tr>
                    <th>Logo</th>
                    <th>Name</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {merchantList && merchantList.length > 0
                    ? getMerchants()
                    : null}
                </tbody>
              </Table>
            </div>
          </Card>
        </Main>
      </Container>

      {receiptPopup ? (
        <TransactionReceipt
          values={receiptvalues}
          close={() => onReceiptClose()}
        />
      ) : (
          ''
        )}

      {payBillsPopup ? (
        <PayBillPopup
          close={() => onPayBillsPopupClose()}
          merchant={editingMerchant}
          showReceiptPopup={(values) => {
            console.log(values);
            setReceiptvalues(values)
          }}
          show={onReceiptPopupOpen}
        />
      ) : (
          ''
        )}
    </Wrapper>
  );
}

export default CashierMerchantListPage;
