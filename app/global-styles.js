import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
*{
  box-sizing:border-box;
  outline:0;
}
body{
  zoom: 0.9;
}
.clr:after{
  content:'';
  display:block;
  clear:both;
}
.hide{
  display:none;
}
.text-accent{
  color: #f5a623;
}
.text-light{
  color: #9b9b9b;
}
.fullWidth{
  width: 100%;
  box-sizing:border-box;
}
.dropdown{
  position:relative;
  padding-bottom: 10px;
}
.dropdown:hover > .subNav{
  display:block !important;
}
.fl{float:left;}
.fr{float:right;}

.formWrap{
  max-width: 445px;
}
  @import url('https://fonts.googleapis.com/css?family=Roboto|Material+Icons&display=swap');
  html,
  body {
    height: 100%;
    width: 100%;
    font-family: 'Roboto', sans-serif;
    font-size: ${props => props.theme.fontSize};
    margin:0;
    background-color: #fcfffc;
  }
  button{
    cursor:pointer;
  }
  a{
    text-decoration:none;
    color: ${props => props.theme.primary};
    font-weight: bold;
    font-size: 14px;
  }
  .green{
    color: ${props => props.theme.primary};
  }
  a >  span > span {
    color: ${props => props.theme.light};
  }

  #app {
    background-color: #fcfffc;
    min-height: 100%;
    min-width: 100%;
  }
  p,
  label {
    line-height: 1.5em;
  }
  .mt10{
    margin-top:10px;
  }
  .m0{
    margin:0;
  }
  .absoluteRight{
    position:absolute;
    right:0;
  }
  .absoluteTopRight{
    position:absolute;
    top:0;
    right:0;
  }
  .tac{text-align:center;}
  .bold{font-weight:bold; }
  .pagination{
    display: block;
    list-style: none;
    padding: 0;
  }
  .pagination:after{
    content: '';
    display:block;
    clear:both;
  }
  .pagination li{
    float: left;
    background: #558b53;
    margin-right: 3px;
  }
  .pagination li a{

    padding: 5px 10px;
    color: #fff;
    display:block;
  }
  .pagination li.disabled{
    background: #656565;
  }
  .pagination li.active{
    background: #f5a623;
  }
  .note{
    color: #9b9b9b;
    size: 12px;
    a{
      color: #56575a;
      text-decoration:underline;
    }

  }
  .removeBtn{
    color: red;
    position:absolute;
    right:-30px;
    top: 10px;
  }
  .resend{
    .timer{
      color: #f5a623;
    }
    .go{
      font-weight: bold;
      background: #f5a623;
      padding: 4px 10px;
      border-radius: 7px;
      color: #fff;
      cursor: pointer;
    }
  }
  .pointer{
    cursor:pointer;
  }
  .bankLogoActivate{
    text-align:center;
    img{
      height: 80px;
      margin-top:20px;
    }
  }
`;

export default GlobalStyle;
