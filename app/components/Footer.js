import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import locale from 'yup/lib/locale';
import styled from 'styled-components';
import { STATIC_URL, CURRENCY } from '../containers/App/constants';



const FrontLeftWrap = styled.section`
    background-image: ${(props) => props.theme.vGradient};
    position: fixed,
    left: 0,
    bottom: 0,
    width: 100%;
    height: 100px;
    display: flex;
    flex-direction: column;
    color: #fff;
    align-items: center;
    justify-content: center;
  `;

const Footer = (props) => {
  const bankname  = props.bankname;
  const banklogo = props.banklogo;
    return (
      <FrontLeftWrap>
      <Grid
        container
        direction="row"
        justify="space-between"
        alignContent="center"
        alignItems="center"
      >
        <div style={{display:'inline-flex', marginLeft:'50px'}}>
        <Typography>
        <img
          src={require('../components/Assets/logo.png')}
          alt=""
          style={{
            height: '50px',
            width: '50px',
            paddingRight: '10px',
            marginRight: '10px',
          }}
        />
        </Typography>
        <Typography
          style={{
            fontWeight: '400',
            fontSize: '15px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
        Powered by Digital business ecosystem. 
        </Typography>
        </div>

        <div style={{display:'inline-flex', marginRight:'50px'}}>
        <Typography>
        <img
          src={`${STATIC_URL}${banklogo}`}
          alt=""
          style={{
            height: '50px',
            width: '50px',
            paddingRight: '10px',
            marginRight: '10px',
          }}
        />
         </Typography>
        <Typography
          style={{
            fontWeight: '400',
            fontSize: '15px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
        Associated with {bankname}.
        </Typography>
        </div>
      </Grid>
    </FrontLeftWrap>
    );
};

export default Footer;