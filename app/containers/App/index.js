/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React, { useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import { toast } from 'react-toastify';

import HomePage from 'containers/HomePage/Loadable';
import SignupPage from 'containers/SignupPage/Loadable';
import ForgotPasswordPage from 'containers/ForgotPasswordPage/Loadable';
import OTPPage from 'containers/OTPPage/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import LocaleToggle from 'containers/LocaleToggle/index';

import LoginPage from 'containers/PartnerLoginPage/Loadable';
import BankForgotPasswordPage from 'containers/BankForgotPasswordPage/Loadable';
import BankOTPPage from 'containers/BankOTPPage/Loadable';
import SetupPage from 'containers/SetupPage/Loadable';
import PartnerDashboard from 'containers/PartnerDashboard/Loadable';
import Activate from 'containers/PartnerActivate/Loadable';
import ForgotSetup from 'containers/ForgotSetup/Loadable';
import PartnerInfo from 'containers/PartnerInfo/Loadable';
import PartnerBranchInfo from 'containers/PartnerBranchInfo/Loadable';
import BankDocuments from 'containers/BankDocuments/Loadable';
import BankTheme from 'containers/BankTheme/Loadable';
import BankFees from 'containers/BankFees/Loadable';
import PartnerOperationalHistory from 'containers/PartnerOperationalHistory/Loadable';
import PartnerMasterHistory from 'containers/PartnerMasterHistory/Loadable';
import BankEscrowHistory from 'containers/BankEscrowHistory/Loadable';
import PartnerBranchList from 'containers/PartnerBranchList/Loadable';
import TermsConditions from 'components/TermsConditions';
import BankCreateFee from 'containers/BankCreateFee/Loadable';
import PartnerCashierList from 'containers/PartnerCashierList/Loadable';
import PartnerUser from 'containers/PartnerUser';
import BranchLogin from 'containers/BranchLogin';
import BranchForgotPassword from 'containers/BranchForgotPassword';
import BranchOTPPage from 'containers/BranchOTPPage';
import BranchSetup from 'containers/BranchSetup';
import BranchDashboard from 'containers/BranchDashboard';
import BranchInfo from 'containers/BranchInfo';
import PartnerCashierInfo from 'containers/PartnerCashierInfo';
import BranchCashierList from 'containers/BranchCashierList';
import BranchCashierInfo from 'containers/BranchCashierInfo';
import BranchOperationalHistory from 'containers/BranchOperationalHistory';
import BranchMasterHistory from 'containers/BranchMasterHistory';
import CashierSendMoney from 'containers/CashierSendMoney';
import CashierLogin from 'containers/CashierLogin';
import CashierForgotPassword from 'containers/CashierForgotPassword';
import CashierOTPPage from 'containers/CashierOTPPage';
import CashierSetup from 'containers/CashierSetup';
import BranchReports from 'containers/BranchReports';
import PartnerReports from 'containers/PartnerReports';
import CashierReports from 'containers/CashierReports';
import CashierDashboard from 'containers/CashierDashboard';
import CashierInfo from 'containers/CashierInfo';
import BankEditFee from 'containers/BankEditFee';

import { ThemeProvider } from 'styled-components';
import CashierRoute from './CashierRoute';
import BranchRoute from './BranchRoute';
import BankRoute from './BankRoute';
import InfraRoute from './InfraRoute';
import GlobalStyle from '../../global-styles';
import BankMerchantList from '../BankMerchantList/BankMerchantList';
import MerchantFeesPage from '../BankMerchantList/fees/MerchantFeesPage';
import CommissionFeesPage from '../BankMerchantList/commission/CommissionFeesPage';
import MerchantSettingsPage from '../BankMerchantList/settings/MerchantSettingsPage';
import CashierMerchantListPage from '../CashierPayBills/CashierMerchantListPage';
// import { CashierSendMoney } from '../CashierSendMoney';

const appTheme = {
  primary: '#316B83',
  // primary: "#ff0000",
  // secondary: "#ff0000",
  secondary: '#6D8299',
  accent: '#f5a623',
  danger: '#f52828',
  light: '#9ea0a5',
  greyLine: '#666565 ',
  vGradient: 'linear-gradient(to bottom, #6D8299, #316B83)',
  hGradient: 'linear-gradient(to right, #6D8299 1%, #316B83)',
  font: 'Roboto',
  fontSize: '14px',
};
toast.configure();

export default function App(props) {
  const [theme, setTheme] = useState(appTheme);
  const notify = () => toast('Wow so easy !');

  return (
    <ThemeProvider theme={theme}>
      <div>
        <Switch>
          <BranchRoute exact path="/send-money" component={CashierSendMoney} />
          <Route exact path="/lang" component={LocaleToggle} />
          <Route exact path="/signup" component={SignupPage} />
          <Route exact path="/forgot-password" component={ForgotPasswordPage} />
          <Route exact path="/forgot-setup" component={ForgotSetup} />
          <Route exact path="/otp" component={OTPPage} />
          <Route exact path="/termsConditions" component={TermsConditions} />


          <Route exact path="/" component={LoginPage} />
          <Route exact path="/setup" component={SetupPage} />
          <Route exact path="/activate" component={Activate} />
          <Route
            exact
            path="/bank/forgot-password"
            component={BankForgotPasswordPage}
          />
          <Route exact path="/bank/otp" component={BankOTPPage} />

          <BankRoute exact path="/dashboard" component={PartnerBranchList} />
          <BankRoute exact path="/reports" component={PartnerReports} />
          <BankRoute path="/info" component={PartnerInfo} />
          <BankRoute path="/bank/fees" component={BankFees} />
          <BankRoute path="/bank/documents" component={BankDocuments} />
          <BankRoute path="/branches" component={PartnerBranchList} />
          <BankRoute
            exact
            apitype={'partner'}
            path="/partner/branch/reports/:id?"
            component={BranchReports}
          />
           <BankRoute
            apitype='partner'
            exact
            path="/partner/branch/cashier/reports/:id"
            component={CashierReports}
          />
          <BankRoute
            apitype={"partner"}
            exact
            path="/partner/branch/dashboard/:id?"
            component={BranchDashboard}
          />
          <BankRoute path="/partner/branch/:branch?" component={PartnerBranchInfo} />
          
          <BankRoute
            path="/partner/cashiers/:branch?"
            component={PartnerCashierList}
          />
          <BankRoute path="/users" component={PartnerUser} />
          <BankRoute path="/bank/create-fee" component={BankCreateFee} />
          <BankRoute
            path="/bank/theme"
            component={BankTheme}
            setTheme={setTheme}
            appTheme={theme}
          />
          <BankRoute
            path="/partner/operationalHistory"
            component={PartnerOperationalHistory}
          />
          <BankRoute
            exact
            path="/partner/cashier/:branch?/:cashier?"
            component={PartnerCashierInfo}
          />
          <BankRoute exact path="/bank/create-fee" component={BankCreateFee} />
          <BankRoute
            exact
            path="/bank/theme"
            component={BankTheme}
            setTheme={setTheme}
            appTheme={theme}
          />
          <BankRoute
            exact
            path="/partner/operationalHistory"
            component={PartnerOperationalHistory}
          />
          <BankRoute
            exact
            path="/partner/masterHistory"
            component={PartnerMasterHistory}
          />
          <BankRoute
            exact
            path="/bank/escrowHistory"
            component={BankEscrowHistory}
          />
          <BankRoute
            exact
            path="/bank/edit-fee/:fee?"
            component={BankEditFee}
          />
          <BankRoute
            exact
            path="/bank/merchants"
            component={BankMerchantList}
          />
          <BankRoute
            exact
            path="/bank/merchants/fee/:id"
            component={MerchantFeesPage}
          />
          <BankRoute
            exact
            path="/bank/merchants/info/:id"
            component={MerchantSettingsPage}
          />
          <BankRoute
            exact
            path="/bank/merchants/commision/:id"
            component={CommissionFeesPage}
          />

          <Route exact path="/branch/:bank?" component={BranchLogin} />
          <Route
            exact
            path="/branch/:bank?/forgot-password"
            component={BranchForgotPassword}
          />
          <Route exact path="/branch/:bank?/otp" component={BranchOTPPage} />
          <Route exact path="/branch/:bank?/setup" component={BranchSetup} />
          <BranchRoute
            apitype={"partnerBranch"}
            exact
            path="/branch/:bank?/dashboard"
            component={BranchDashboard}
          />
          <BranchRoute
            exact
            apitype={'partnerBranch'}
            path="/branch/:bank?/report"
            component={BranchReports}
          />
           <BranchRoute
            apitype='partnerBranch'
            exact
            path="/branch/:bank?/cashier/reports/:id"
            component={CashierReports}
          />
          {/* <BranchRoute
            exact
            path="/branch/operationalHistory"
            component={BranchOperationalHistory}
          /> */}
          <BranchRoute
            exact
            path="/branch/:bank?/operationalHistory"
            component={BranchOperationalHistory}
          />
          <BranchRoute
            exact
            path="/branch/:bank?/masterHistory"
            component={BranchMasterHistory}
          />
          <BranchRoute
            exact
            path="/branch/:bank?/info"
            component={BranchInfo}
          />
          <BranchRoute
            exact
            path="/branch/:bank?/cashiers"
            component={BranchCashierList}
          />
          <BranchRoute
            exact
            path="/branch/:bank?/cashier/:cashier?"
            component={BranchCashierInfo}
          />
          <BranchRoute
            exact
            path="/branch/:bank?/dashboard/send-money"
            component={CashierSendMoney}
          />

          <Route exact path="/cashier/:bank?" component={CashierLogin} />
          <Route
            exact
            path="/cashier/:bank?/forgot-password"
            component={CashierForgotPassword}
          />
          <Route exact path="/cashier/:bank?/otp" component={CashierOTPPage} />
          <Route exact path="/cashier/:bank?/setup" component={CashierSetup} />
          <CashierRoute
            exact
            path="/cashier/:bank?/dashboard"
            component={CashierDashboard}
          />
          <CashierRoute
            exact
            path="/cashier/:bank?/info"
            component={CashierInfo}
          />
          <CashierRoute
            exact
            path="/cashier/:bank?/pay-bills"
            component={p => <CashierMerchantListPage {...p} />}
          />
          <CashierRoute
            apitype='partnerCashier'
            exact
            path="/cashier/:bank?/reports"
            component={CashierReports}
          />

          <Route component={NotFoundPage} />
        </Switch>
        <GlobalStyle />
      </div>
    </ThemeProvider>
  );
}
