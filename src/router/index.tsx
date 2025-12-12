import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Layout from 'components/Layout';
import { Login } from 'pages/Login';
import { Dashboard } from 'pages/Dashboard';
import { Admin } from 'pages/Admin';
import { Users } from 'pages/Users';
import { PushNotification } from 'pages/PushNotification';
import {
  Live,
  PartnershipList,
  Prize,
  RoundHistory,
  Youtube,
} from 'pages/Operation';
import { Ad, VideoAd } from 'pages/Ad';
import { ResultInput, Shipping, WinningHistory } from 'pages/Again';
import { Inquiry, Faq, Notice, Partner } from 'pages/Customer';
import { Policy } from 'pages/Policy';
import { WinningDetail } from 'pages/Again/WinningDetail';
import { useRecoilValue } from 'recoil';
import { rolesState } from 'recoil/atoms/roles';

function Root() {
  const accessToken = localStorage.getItem('accessToken') ?? '';
  const roles = useRecoilValue(rolesState);

  const CheckRole = (keyword: string) => {
    let result;
    if (roles.includes('MASTER')) {
      return true;
    }
    switch (keyword) {
      case 'dashboard':
        result = roles.includes('READ_DASHBOARD');
        break;
      case 'admin':
        result = roles.includes('READ_ADMIN');
        break;
      case 'user':
        result = roles.includes('READ_USER');
        break;
      case 'inquiry':
        result = roles.includes('READ_INQUIRY');
        break;
      case 'giveaway':
        result = roles.includes('READ_GIVEAWAY');
        break;
      case 'broadcastInfo':
        result = roles.includes('READ_BROADCAST_INFO');
        break;
      case 'advertisement':
        result = roles.includes('READ_ADVERTISEMENT');
        break;
      case 'winningNumber':
        result = roles.includes('READ_WINNING_NUMBER');
        break;
      case 'partnershipInquiry':
        result = roles.includes('READ_PARTNERSHIP_INQUIRY');
        break;
      case 'faq':
        result = roles.includes('READ_FAQ');
        break;
      case 'notice':
        result = roles.includes('READ_NOTICE');
        break;
      case 'policy':
        result = roles.includes('READ_POLICY');
        break;
      case 'pushNotification':
        result = roles.some((v) =>
          ['READ_NOTIFICATION', 'READ_USER'].includes(v),
        );
        break;
      case 'youtube':
        result = roles.some((v) =>
          ['READ_YOUTUBE_SUBSCRIPTION', 'READ_STATIC_LINK'].includes(v),
        );
        break;
      case 'registrationInfo':
        result = roles.includes('READ_REGISTRATION_INFO');
        break;
      default:
        break;
    }
    return result;
  };

  return (
    <BrowserRouter>
      <Routes>
        {accessToken?.length && (
          <Route path="/" element={<Layout />}>
            <Route path="*" element={<Navigate to="/" />} />
            {CheckRole('dashboard') && <Route index element={<Dashboard />} />}
            {CheckRole('admin') && <Route path="admin" element={<Admin />} />}
            {CheckRole('user') && <Route path="users" element={<Users />} />}
            {CheckRole('pushNotification') && (
              <Route path="push-notification" element={<PushNotification />} />
            )}
            <Route path="operation">
              {CheckRole('giveaway') && (
                <Route path="prize" element={<Prize />} />
              )}
              {CheckRole('broadcastInfo') && (
                <Route path="live" element={<Live />} />
              )}
              {(CheckRole('giveaway') || CheckRole('broadcastInfo')) && (
                <Route path="history" element={<RoundHistory />} />
              )}
              {CheckRole('youtube') && (
                <Route path="youtube" element={<Youtube />} />
              )}
              <Route path="partner" element={<PartnershipList />} />
            </Route>
            {CheckRole('advertisement') && (
              <Route path="advertisement">
                <Route path="image" element={<Ad />} />
                <Route path="video" element={<VideoAd />} />
              </Route>
            )}
            <Route path="again">
              {CheckRole('winningNumber') && (
                <Route path="input" element={<ResultInput />} />
              )}
              {CheckRole('winningNumber') && (
                <Route path="history" element={<WinningHistory />} />
              )}
              {CheckRole('winningNumber') && (
                <Route path="detail" element={<WinningDetail />} />
              )}
              {CheckRole('registrationInfo') && (
                <Route path="shipping" element={<Shipping />} />
              )}
            </Route>
            <Route path="/customer">
              {CheckRole('inquiry') && (
                <Route path="inquiry" element={<Inquiry />} />
              )}
              {CheckRole('faq') && <Route path="faq" element={<Faq />} />}
              {CheckRole('notice') && (
                <Route path="notice" element={<Notice />} />
              )}
              {CheckRole('partnershipInquiry') && (
                <Route path="partner" element={<Partner />} />
              )}
            </Route>
            {CheckRole('policy') && (
              <Route path="policy" element={<Policy />} />
            )}
          </Route>
        )}
        {!accessToken?.length && (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default Root;
