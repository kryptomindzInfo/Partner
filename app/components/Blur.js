import React, { Fragment } from 'react';
import { Grid, Typography } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/core/styles';

const blurStyles = makeStyles(() => ({
  featureNotAvailable: {
    width: '100%',
    height: '100%',
    filter: 'blur(.5rem)',
    cursor: 'not-allowed',
  },
}));

function Blur(props) {
  const classes = blurStyles();
  const { children, isValidFee } = props;
  return (
    <Fragment>
      <div className={!isValidFee ? classes.featureNotAvailable : ''}>
        {children}
      </div>

      <Grid
        style={{
          width: '100%',
          height: '500px',
          cursor: 'not-allowed',
          position: 'absolute',
          top: '25%',
        }}
        hidden={isValidFee}
        container
        direction="row"
        justify="center"
        alignContent="center"
      >
        <Icon fontSize="large">error</Icon>
        <Typography variant="h4" noWrap align="center">
          Transaction can't be processed at this time.
        </Typography>
      </Grid>
    </Fragment>
  );
}

export default Blur;
