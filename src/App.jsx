import React from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { ServiceDetailModal } from './components/ServiceDetailModal';
import { BottomNav } from './components/BottomNav';

// Pages
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { LoansPage } from './pages/LoansPage';
import { TrackApplicationPage } from './pages/TrackApplicationPage';
import { FranchisePage } from './pages/FranchisePage';

// CRM
import { CrmLayout } from './pages/crm/CrmLayout';

export const App = () => {
  const { activeView } = useApp();

  if (activeView === 'crm') {
    return (
      <>
        <CrmLayout />
        <Toast />
      </>
    );
  }

  return (
    <div className="app-viewport-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main className="app-main-content" style={{ flex: 1 }}>
        {activeView === 'website' && <HomePage />}
        {activeView === 'services' && <ServicesPage />}
        {activeView === 'loans' && <LoansPage />}
        {activeView === 'track' && <TrackApplicationPage />}
        {activeView === 'franchise' && <FranchisePage />}
      </main>

      <Footer />
      <BottomNav />
      <ServiceDetailModal />
      <Toast />
    </div>
  );
};
