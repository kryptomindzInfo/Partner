/**
 *
 * BankTheme
 *
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { compose } from 'redux';
import { SwatchesPicker } from 'react-color';
import Color from 'color';

import PartnerHeader from 'components/Header/PartnerHeader';
import Container from 'components/Container';
import BankSidebarTwo from 'components/Sidebar/BankSidebarTwo';
import Main from 'components/Main';
import Card from 'components/Card';
import { Container as Con, Row, Col } from 'react-grid-system';

import messages from './messages';

export function BankTheme(props) {
  // useEffect(() => {
  //   console.log(props);
  //   setTimeout(() => {
  //     props.setTheme({ ...props.appTheme, primary: '#ff0000' });
  //   }, 3000);
  // }, []);
  return (
    <div>
      <Helmet>
        <title>BankTheme</title>
        <meta name="description" content="Description of BankTheme" />
      </Helmet>
      <PartnerHeader />
      <Container>
        <BankSidebarTwo active="theme" />
        <Main>
          {' '}
          <Card bigPadding>
            <Con>
              <Row style={{ paddingBottom: '10px' }}>
                <Col sm={6}>
                  <SwatchesPicker
                    color={props.appTheme.primary}
                    onChangeComplete={color => {
                      console.log(color);
                      const lightColor = Color(color.hex)
                        .lighten(1)
                        .hex();
                      props.setTheme({
                        ...props.appTheme,
                        primary: color.hex,
                        hGradient: `linear-gradient(to right, ${lightColor} 1%, ${
                          color.hex
                        })`,
                      });

                      console.log(lightColor);
                    }}
                  />
                </Col>
                <Col sm={6}>
                  <SwatchesPicker
                    color={props.appTheme.secondary}
                    onChangeComplete={color => {
                      console.log(color);
                      props.setTheme({
                        ...props.appTheme,
                        secondary: color.hex,
                      });
                    }}
                  />
                </Col>
              </Row>
              <Row>
                <Col sm={6}>
                  <SwatchesPicker
                    color={props.appTheme.accent}
                    onChangeComplete={color => {
                      console.log(color);
                      props.setTheme({
                        ...props.appTheme,
                        accent: color.hex,
                      });
                    }}
                  />
                </Col>
                <Col sm={6}>
                  <SwatchesPicker
                    color={props.appTheme.light}
                    onChangeComplete={color => {
                      console.log(color);
                      props.setTheme({
                        ...props.appTheme,
                        light: color.hex,
                      });
                    }}
                  />
                </Col>
              </Row>
              {/* <Row>
                <Col sm={4}>df</Col>
                <Col sm={4}>df</Col>
                <Col sm={4}>df</Col>
              </Row> */}
            </Con>
          </Card>
        </Main>
      </Container>
    </div>
  );
}

BankTheme.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  null,
  mapDispatchToProps,
);

export default compose(withConnect)(BankTheme);
