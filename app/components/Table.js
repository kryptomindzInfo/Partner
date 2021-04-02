import styled from 'styled-components';

const Table = styled.table `
width:100%;
word-break: initial;
margin-top: ${props => props.marginTop ? props.marginTop : '0' };

> thead > tr > th{
    font-size:14px;
    font-weight:bold;
    padding: 8px;
    text-align:center;
    background-color: ${props => props.theme.accent};
    color: #fff;
    position:relative;
    width: 12%;
}
> tbody > tr {
        color: #4a4a4a;
        &.red {
          color: #FF0000;
        }
    >td {
        font-size: 16px;
        font-weight: 300;
        text-align: ${props => props.textAlign ? props.textAlign : 'center' };
        padding: ${props => props.smallTd ? '10px' : '14px 22px' };
        background-color: rgba(81, 111, 10, 0.01);
        position:relative;
        &.green{
            color: ${props => props.theme.primary};
        }
        > a{
            font-size: 12px;
        }
        &.right{
            text-align: right;
        }
        .labelGrey{
            font-size: 16px;
            font-weight: 300;
            font-stretch: normal;
            font-style: normal;
            line-height: normal;
            letter-spacing: -0.13px;
            color: #4a4a4a;
        }
        .labelBlue{
            font-size: 20px;
            font-weight: bold;
            font-stretch: normal;
            font-style: normal;
            line-height: normal;
            letter-spacing: -0.1px;
            color: #4a90e2;
        }
        .labelSmallGrey{
            font-size: 12px;
            font-weight: 300;
            font-stretch: normal;
            font-style: normal;
            line-height: normal;
            letter-spacing: -0.13px;
            color: #4a4a4a;
        }
    }
    td > .material-icons{
        font-size: 19px;
        font-weight:bold;
        color:${props => props.theme.primary};
    }
    >
    .bold{
        font-weight:bold;
    }
}

.popMenuTrigger{
    i{
    font-size: 18px;
    }
    cursor: pointer;
    .popMenu{
        display: none;
        position: absolute;
        z-index: 10;
        font-size: 13px;
        font-weight:normal;
        width: 130px;
        right: 18px;
        margin-top: -15px;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
  background-color: #ffffff;
        padding: 5px 10px;
        > span {
            margin: 8px 0 12px;
            text-align: left;
            display:block;
            color: #000;
            font-size:13px;
            font-weight:normal;
        }
    }
    &:hover .popMenu, .popMenu:hover{
        display:block;
    }
  
}

`;

export default Table;