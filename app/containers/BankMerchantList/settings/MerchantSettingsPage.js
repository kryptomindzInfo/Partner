import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Wrapper from '../../../components/Wrapper';
import Container from '../../../components/Container';
import Main from '../../../components/Main';
import ActionBar from '../../../components/ActionBar';
import Button from '../../../components/Button';
import Card from '../../../components/Card';
import Row from '../../../components/Row';
import Col from '../../../components/Col';
import EditMerchantPopup from './EditMerchantPopup';
import Loader from '../../../components/Loader';
import SettingSideBar from '../SettingSidebar';
import PartnerHeader from '../../../components/Header/PartnerHeader';

const MerchantSettingsPage = props => {
  const [editMerchantPopup, setEditMerchantPopup] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [merchantInfo, setMerchantInfo] = useState(JSON.parse(localStorage.getItem('currentMerchant')));
  const { match } = props;
  const { id } = match.params;
  localStorage.setItem('currentMerchantId', id);
  const handlePopupClick = () => {
    setEditMerchantPopup(true);
  };
  const onPopupClose = () => {
    setEditMerchantPopup(false);
  };
  const refreshMerchantInfo = data => {
    setLoading(true);
    setMerchantInfo(data);
    // const merchantLogged = JSON.parse(localStorage.getItem('merchantLogged'));
    // merchantLogged.details = data;
    // localStorage.setItem('merchantLogged', JSON.stringify(merchantLogged));
    setLoading(false);
  };
  if (isLoading) {
    return <Loader fullPage />;
  }
  return (
    <Wrapper>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Merchant | Settings</title>
      </Helmet>
      <PartnerHeader active="merchants" />
      <Container verticalMargin>
        <SettingSideBar merchantId={id} active="info" />
        <Main>
          <ActionBar
            marginBottom="33px"
            inputWidth="calc(100% - 241px)"
            className="clr"
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}
          >
            <Button
              className="addBankButton"
              style={{ padding: '8px' }}
              onClick={() => handlePopupClick()}
              flex
            >
              <span>Edit</span>
            </Button>
          </ActionBar>
          <Card bigPadding bordered>
            <div className="cardBody">
              <Row>
                <Col className="infoLeft">Merchant Name</Col>
                <Col className="infoRight">{merchantInfo.name}</Col>
              </Row>

              <Row>
                <Col className="infoLeft">Merchant Code</Col>
                <Col className="infoRight">{merchantInfo.username}</Col>
              </Row>

              <Row>
                <Col className="infoLeft">Email</Col>
                <Col className="infoRight">{merchantInfo.email}</Col>
              </Row>

              <Row>
                <Col className="infoLeft">Phone Number</Col>
                <Col className="infoRight">{merchantInfo.mobile}</Col>
              </Row>

              <Row>
                <Col className="infoLeft">Description</Col>
                <Col className="infoRight">{merchantInfo.description}</Col>
              </Row>
            </div>
          </Card>
        </Main>
      </Container>
      {editMerchantPopup ? (
        <EditMerchantPopup
          refreshMerchantList={data => refreshMerchantInfo(data)}
          merchant={merchantInfo}
          onClose={() => onPopupClose()}
        />
      ) : null}
    </Wrapper>
  );
};
export default MerchantSettingsPage;
