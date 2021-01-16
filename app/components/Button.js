import styled from 'styled-components';

const Button = styled.button`
  min-width: ${props => (props.filledBtn || props.dashBtn || props.smallDashBtn ? '100%' : '110px')};
  min-width: ${props => (props.noMin ? '0' : 'sdd')};
  padding: ${props => (props.accentedBtn ? '7px' : '5px')};
  padding: ${props => (props.padding ? props.padding : '5px')};
  text-align: center;
  border-radius: ${props => (props.dashBtn  ? '8px' : '5px')};
  float: ${props => (props.float ? props.float : 'none')};
  background-color: ${props =>
    props.filledBtn ? props.theme.primary : '#fff'};
    background-color: ${props =>
      props.smallDashBtn ? '#50e3c2' : 'sdf'};
  background-color: ${props =>
      props.dashBtn ? '#97bfee' : 'sdf'};
  background-color: ${props =>
    props.accentedBtn ? props.theme.accent : 'sdf'};
  background-color: ${props => (props.accentedOutline ? 'transparent' : 'sdf')};
  border: ${props => (props.accentedBtn || props.dashBtn || props.smallDashBtn  ? 'none' : '1px solid #417505')};
  border: ${props =>
    props.accentedOutline ? `1px solid ${props.theme.primary}` : 'sd'};
  color: ${props =>
    props.filledBtn || props.accentedBtn || props.dashBtn || props.smallDashBtn ? '#fff' : props.theme.primary};
  color: ${props => (props.accentedOutline ? props.theme.accent : 'sd')};
  font-size: ${props => (props.filledBtn ? '20px' : '11px')};
  font-size: ${props => (props.dashBtn || props.smallDashBtn ? 'small' : 'sdf')};
  font-size: ${props => (props.accentedBtn ? '16px' : 'sdf')};
  font-size: ${props => (props.fontSize ? 'props.fontSize' : 'sdf')};
  font-weight: ${props =>
    props.filledBtn || props.accentedBtn || props.dashBtn || props.smallDashBtn ? 'bold' : 'normal'};
  display: ${props => (props.flex ? 'flex' : 'block')};
  align-items: center;
  justify-content: center;
  margin-top: ${props => (props.marginTop ? props.marginTop : '0')};
  margin-bottom: ${props => (props.marginBottom ? props.marginBottom : '0')};
  position: ${props => (props.bottomRight ? 'absolute' : 'relative')};
  bottom: ${props => (props.bottomRight ? '2px;' : '0')};
  right: ${props => (props.bottomRight ? '2px;' : '0')};
  > i {
    font-size: 13px;
  }
  &.toggle {
    border: 1px solid ${props => props.theme.accent};
    color: ${props => props.theme.accent};
  }
  &.active {
    background-color: ${props => props.theme.accent};
    color: #ffffff;
  }

  ${props => props.filledBtn && `:hover{background-color: #1c3302}`}
  ${props => props.dashBtn && `:hover{background-color: #5d87f1}`}
  ${props => props.smallDashBtn && `:hover{background-color: #1bceaa}`}
`;

export default Button;