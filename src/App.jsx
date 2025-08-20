import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { SocketProvider } from './context/SocketContext';
import AdSenseManager from './components/ads/AdSenseManager';
import LandingPage from './pages/LandingPage';
import PreferencesPage from './pages/PreferencesPage';
import ChatPage from './pages/ChatPage';
import CommunityPage from './pages/CommunityPage';
import AdminPage from './pages/AdminPage';
import MainLayout from './components/layout/MainLayout';
import TermsAndConditions from './pages/TermsAndConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';

import './App.css';
import AboutPage from './pages/AboutPage';
import ContactUs from './pages/ContactPage';
import CommunityGuidelinesPage from './pages/CommunityGuidelinesPage';
import HelpFAQPage from './pages/HelpFaqPage';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancel from './pages/PaymentCancel';


const App = () => {
  return (
    <SocketProvider>
      <AdSenseManager>
        <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="/preferences" element={<PreferencesPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/terms" element={<TermsAndConditions />} />
        <Route path='/communityGuide' element={<CommunityGuidelinesPage/>}/>
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/helpfaq" element={<HelpFAQPage />} />


        </Route>
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/cancel" element={<PaymentCancel />} />
        </Routes>
      </AdSenseManager>
    </SocketProvider>
  );
};

export default App;
