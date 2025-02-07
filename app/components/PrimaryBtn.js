import styled from 'styled-components';

const PrimaryBtn = styled.button `
  width: 100%;
  box-sizing:border-box;
  padding:8px;
  background-color: ${props => props.theme.primary};
  color: white;
  border: 0;
  border-radius: 4px;
  display: block;
  outline: 0;
  text-transform: uppercase;
  font-weight: bold;
  font-size: 18px;
  :hover{
    background-color: #1c3302;
  }
`;

export default PrimaryBtn;