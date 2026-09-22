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

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("React Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0b1727', color: '#fff', padding: '24px', textAlign: 'center' }}>
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '32px', maxWidth: '500px', width: '100%' }}>
            <h2 style={{ fontSize: '1.4rem', color: '#f87171', marginBottom: '12px' }}>Something went wrong</h2>
            <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '20px' }}>
              {this.state.error?.message || 'An unexpected error occurred while loading this view.'}
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button 
                onClick={() => window.location.reload()}
                style={{ padding: '10px 20px', background: '#ff6f00', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}
              >
                Reload App
              </button>
              <button 
                onClick={() => { this.setState({ hasError: false, error: null }); window.location.href = '/'; }}
                style={{ padding: '10px 20px', background: 'transparent', color: '#cbd5e1', border: '1px solid #475569', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
              >
                Back to Website
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export const App = () => {
  const { activeView } = useApp();

  if (activeView === 'crm') {
    return (
      <ErrorBoundary>
        <CrmLayout />
        <Toast />
      </ErrorBoundary>
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
