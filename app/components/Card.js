import styled from 'styled-components';

const Card = styled.div`
  display: block;
  width: ${props => (props.cardWidth ? props.cardWidth : '100%')};
  margin-left: ${props =>
    props.horizontalMargin ? props.horizontalMargin : '0'};
  margin-right: ${props =>
    props.horizontalMargin ? props.horizontalMargin : '0'};
  padding: ${props => (props.bigPadding ? '18px 30px' : '12px 6px')};
  box-shadow: 0 4px 9px 0 rgba(0, 0, 0, 0.02);
  background-color: ${props => (props.selected ? props.theme.primary : '#fff')};
  color: ${props => (props.selected ? '#fff' : '#323c47')};
  border-radius: ${props => (props.rounded ? '5px' : '0')};
  margin-bottom: ${props => (props.marginBottom ? props.marginBottom : '0')};
  text-align: ${props => (props.textAlign ? props.textAlign : 'left')};
  float: ${props => (props.col ? 'left' : 'none')};
  max-width: ${props => (props.centerSmall ? '600px' : '100%')};
  margin: ${props => (props.centerSmall ? '0 auto' : 'sdf')};
  position: relative;
  border: ${props => (props.bordered ? '1px solid #e4e8ea' : 'sdf')};
  &:hover {
    border: ${props => (props.blueHover ? '1px solid #4da1ff' : '')};
  }
  .infoLeft {
    font-size: 20px;
    font-weight: bold;
    color: #4a4a4a;
    margin-bottom: 30px;
  }
  .infoRight {
    font-size: 20px;
    font-weight: bold;
    color: #000000;
    text-align: right;
    margin-bottom: 30px;
    color: green;
  }


  .profile {
    img {
      max-width: 100%;
      max-height: 100px;
    }
    margin-bottom: 20px;
    text-align: center;
  }
  .history {
    position: absolute;
    right: 20px;
    bottom: 25px;
    color: ${props => props.theme.accent} !important;
  }
  &.sideNav {
    padding: 15px 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 10px;
    border: solid 1px #e9eff4;
    box-shaddow: none;
    i {
      margin-right: 10px;
      margin-top: 0;
      color: ${props => (props.selected ? '#fff' : '#417505')};
    }
    h3 {
      font-size: 13px;
      font-weight: bold;
      margin: 0;
      color: ${props => (props.selected ? '#fff' : '#323c47')};
    
    }
  }
  &.sideNav:hover {
    background-color: #417505;
    i{
      color: #fff;
    }
    h3 {
      color: #fff !important;
    }
  }
  > .cardHeader:after {
    content: '';
    display: block;
    clear: both;
  }
  > .cardHeader > .cardHeaderRight > h3,
  > h3 {
    color: #323c47;
    font-size: 24px;
    font-weight: normal;
    margin-top: 0;
    margin-bottom: 20px;
    .anchor{
      color:${props => props.theme.accent};
      right: 10px;
      position: absolute;
      top: 25px;
    }
  }
  > .cardHeader > .cardHeaderRight > h3 {
    margin-bottom: 1px;
  }
  .doc {
    border: solid 1px #e9eff4;
    border-radius: 5px;
    padding: 10px;
  }
  .hh {
    margin-top: 10px;
    margin-bottom: 0;
    font-size: 16px;
    color: #323c47;
  }
  .hhh {
    font-size: 12px;
    font-weight: bold;
    letter-spacing: 0.11px;
    color: #323c47;
    text-align: center;
  }
  .hhhh {
    font-size: 10px;
    font-weight: bold;
    text-align: center;
    letter-spacing: 0.09px;
    color: #9b9b9b;
}
.miniTitle{
  color:#f5a623;
  font-size: 16px;
}
> .cardHeader  > .cardHeaderLeft{
    float:left;
    &.flex{
        display:flex;
        align-items:center;
        justify-content: flex-start;
        flex-direction: row;
        h3{
            font-size: 28px;
        }
        .material-icons{
            background: ${props => props.theme.primary};
            color: #fff;
            margin-right: 10px;
            font-size: 28px;
    padding: 4px;
    border-radius: 50%;
        }
    }
}
> .cardHeader  > .cardHeaderRight{
    float:left;
}

> .cardHeader > .cardHeaderLeft > .material-icons {
    width: 46px;
    height: 46px;
    color: ${props => props.theme.primary};
    background: transparent;
    border-radius: 50%;
    margin: 3px 17px;
    font-size: 40px;
    padding: 0;
    line-height: 46px;
  }
  > h4 {
    font-size: ${props => (props.h4FontSize ? props.h4FontSize : '18px')};
    font-weight: normal;
    color: #323c47;
    margin-top: 0;
    margin-bottom: 18px;
  }
  .menuTabs {
    font-size: 20px;
    color: ${props => props.theme.primary};
    font-weight: bold;
    float: left;
    margin-top: 20px;
    margin-right: 30px;
  }
  > .cardHeader > .cardHeaderRight > h5,
  h5 {
    font-size: 14px;
    font-weight: 300;
    color: rgba(50, 60, 71, 0.4);
    margin-top: 0;
    margin-bottom: 15px;
  }

.cardValue{
    font-size: ${props => props.smallValue ? '20px' : '32px'};
    font-weight: bold;
    color: ${props => props.theme.primary};
    word-break: initial;
  }

 > button, .sendMoneyButton{
    padding: 6px;
    border-radius: 2px;
    min-width: 0 !important;
    border: solid 1px ${props => props.theme.primary};
    color: ${props => props.theme.primary};
    font-size: 11px;
    font-weight: bold;
    background: #fff;
    margin-top: ${props =>
      props.buttonMarginTop ? props.buttonMarginTop : '0'};

    > i {
      margin-right: 5px;
      font-size: 11px;
    }
  }
`;
export default Card;
