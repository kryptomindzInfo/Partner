import React, { Component } from "react";
import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

import CircularLogo from './CircularLogo';
import Title from './Title';
import SubTitle from './SubTitle';

const FrontLeftWrap = styled.section`
background-image: ${props => props.theme.vGradient};
width: 50%;
position:absolute;
top:0;
left:0;
height:100%;
display:flex;
flex-direction: column;
align-items:center;
justify-content:center;
`;

class FrontLeftSection extends Component {
  render() {
    return (
        <FrontLeftWrap>
          <CircularLogo>
            {
              (this.props.logo) ?
              <img src={this.props.logo} />
              :
              (this.props.from == 'partner')  ?
                'PARTNER'
              :
              (this.props.from == 'user')  ?
              <FormattedMessage {...messages.user} />
              :
              <FormattedMessage {...messages.infra} />

            }
          </CircularLogo>
          <Title>
            {
              this.props.title ?
              <span>{this.props.title.toUpperCase()}</span>
              :
              <FormattedMessage {...messages.title} />
            }

          </Title>
          <SubTitle>
            Welcome to {
              this.props.title ?
              <span>{this.props.title}</span>
              :
              <span>E-WALLET</span>
            }
            <br />
            <FormattedMessage {...messages.subTitle2} />
            <br />
            <FormattedMessage {...messages.subTitle3} />
          </SubTitle>
        </FrontLeftWrap>
    );
  }
}

export default FrontLeftSection;
