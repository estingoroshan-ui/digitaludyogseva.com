import React from 'react';
import { useApp } from './context/AppContext';
import { useRouter } from './router/Router';

// Common Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { ServiceDetailModal } from './components/ServiceDetailModal';
import { BottomNav } from './components/BottomNav';

// Public Website Pages
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { LoansPage } from './pages/LoansPage';
import { TrackApplicationPage } from './pages/TrackApplicationPage';
import { FranchisePage } from './pages/FranchisePage';

// Admin ERP Shell & Modules (Paytm-Inspired Enterprise Design)
import { AdminLayout } from './pages/admin/AdminLayout';
import { PaytmDashboard } from './pages/admin/PaytmDashboard';
import { LeadsModule } from './pages/admin/modules/LeadsModule';
import { SchemesModule } from './pages/admin/modules/SchemesModule';
import { EligibilityScorecardModule } from './pages/admin/modules/EligibilityScorecardModule';
import { CustomersModule } from './pages/admin/modules/CustomersModule';
import { ProjectsModule } from './pages/admin/modules/ProjectsModule';
import { DocumentsModule } from './pages/admin/modules/DocumentsModule';
import { BillingInvoicesModule } from './pages/admin/modules/BillingInvoicesModule';
import { StaffHrmModule } from './pages/admin/modules/StaffHrmModule';
import { ReportsModule } from './pages/admin/modules/ReportsModule';
import { SettingsModule } from './pages/admin/modules/SettingsModule';

// Self-Service Portals
import { CustomerPortal } from './pages/portal/CustomerPortal';
import { EmployeePortal } from './pages/portal/EmployeePortal';

// Modals
import { Lead360Modal } from './pages/crm/lead360/Lead360Modal';
import { Customer360Modal } from './pages/crm/Customer360Modal';
import { ProjectDetailModal } from './pages/crm/ProjectDetailModal';
import { LoanCaseDetailModal } from './pages/crm/LoanCaseDetailModal';
import { NewLoanCaseModal } from './pages/crm/NewLoanCaseModal';

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
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#F4F7FA', color: '#1E293B', padding: '24px', textAlign: 'center' }}>
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '36px', maxWidth: '520px', width: '100%', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#FEE2E2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '1.5rem', fontWeight: '800' }}>
              !
            </div>
            <h2 style={{ fontSize: '1.35rem', color: '#002970', fontWeight: '800', marginBottom: '8px' }}>
              Temporary View Rendering Issue
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#64748B', marginBottom: '24px', lineHeight: '1.6' }}>
              {this.state.error?.message || 'The requested module encountered a runtime rendering exception. Data remains safely preserved.'}
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button 
                onClick={() => { this.setState({ hasError: false, error: null }); window.location.href = '/admin/dashboard'; }}
                style={{ padding: '10px 20px', background: '#00BAF2', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}
              >
                Go to Admin Dashboard
              </button>
              <button 
                onClick={() => window.location.reload()}
                style={{ padding: '10px 20px', background: 'transparent', color: '#475569', border: '1px solid #CBD5E1', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
              >
                Reload
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
  const { currentPath, matchPath } = useRouter();

  // -------------------------------------------------------------
  // ROUTE BRANCH 1: SUPER ADMIN ERP (/admin/*)
  // -------------------------------------------------------------
  if (currentPath.startsWith('/admin')) {
    // Dynamic matching of admin modules
    let AdminViewComponent = PaytmDashboard;

    if (
      currentPath === '/admin/leads' ||
      currentPath === '/admin/leads/create' ||
      currentPath === '/admin/follow-ups' ||
      matchPath('/admin/leads/:id') ||
      matchPath('/admin/leads/:id/edit')
    ) {
      AdminViewComponent = LeadsModule;
    } else if (
      currentPath === '/admin/schemes' ||
      currentPath === '/admin/schemes/create' ||
      matchPath('/admin/schemes/:id') ||
      matchPath('/admin/schemes/:id/edit')
    ) {
      AdminViewComponent = SchemesModule;
    } else if (
      currentPath === '/admin/eligibility' ||
      currentPath === '/admin/scorecards'
    ) {
      AdminViewComponent = EligibilityScorecardModule;
    } else if (
      currentPath === '/admin/customers' ||
      currentPath === '/admin/customers/create' ||
      matchPath('/admin/customers/:id') ||
      matchPath('/admin/customers/:id/edit')
    ) {
      AdminViewComponent = CustomersModule;
    } else if (
      currentPath === '/admin/projects' ||
      currentPath === '/admin/projects/create' ||
      matchPath('/admin/projects/:id') ||
      matchPath('/admin/projects/:id/edit')
    ) {
      AdminViewComponent = ProjectsModule;
    } else if (currentPath === '/admin/documents') {
      AdminViewComponent = DocumentsModule;
    } else if (
      currentPath === '/admin/services' ||
      currentPath === '/admin/quotations' ||
      currentPath === '/admin/invoices' ||
      currentPath === '/admin/payments' ||
      currentPath === '/admin/accounts'
    ) {
      AdminViewComponent = BillingInvoicesModule;
    } else if (
      currentPath === '/admin/employees' ||
      currentPath === '/admin/employees/create' ||
      matchPath('/admin/employees/:id') ||
      currentPath === '/admin/attendance' ||
      currentPath === '/admin/leaves' ||
      currentPath === '/admin/payroll'
    ) {
      AdminViewComponent = StaffHrmModule;
    } else if (currentPath === '/admin/reports') {
      AdminViewComponent = ReportsModule;
    } else if (currentPath === '/admin/settings') {
      AdminViewComponent = SettingsModule;
    }

    return (
      <ErrorBoundary>
        <AdminLayout>
          <AdminViewComponent />
        </AdminLayout>
        
        {/* Global CRM Modals */}
        <Lead360Modal />
        <Customer360Modal />
        <ProjectDetailModal />
        <LoanCaseDetailModal />
        <NewLoanCaseModal />
        <Toast />
      </ErrorBoundary>
    );
  }

  // -------------------------------------------------------------
  // ROUTE BRANCH 2: CUSTOMER SELF-SERVICE PORTAL (/portal/customer/*)
  // -------------------------------------------------------------
  if (currentPath.startsWith('/portal/customer')) {
    return (
      <ErrorBoundary>
        <CustomerPortal />
        <Toast />
      </ErrorBoundary>
    );
  }

  // -------------------------------------------------------------
  // ROUTE BRANCH 3: EMPLOYEE SELF-SERVICE PORTAL (/portal/employee/*)
  // -------------------------------------------------------------
  if (currentPath.startsWith('/portal/employee')) {
    return (
      <ErrorBoundary>
        <EmployeePortal />
        <Toast />
      </ErrorBoundary>
    );
  }

  // -------------------------------------------------------------
  // ROUTE BRANCH 4: PUBLIC CONSULTANCY WEBSITE
  // -------------------------------------------------------------
  const isServices = currentPath === '/services';
  const isLoans = currentPath === '/loans';
  const isTrack = currentPath === '/track';
  const isFranchise = currentPath === '/franchise';

  return (
    <ErrorBoundary>
      <div className="app-viewport-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />

        <main className="app-main-content" style={{ flex: 1 }}>
          {isServices && <ServicesPage />}
          {isLoans && <LoansPage />}
          {isTrack && <TrackApplicationPage />}
          {isFranchise && <FranchisePage />}
          {!isServices && !isLoans && !isTrack && !isFranchise && <HomePage />}
        </main>

        <Footer />
        <BottomNav />
        <ServiceDetailModal />
        <Toast />
      </div>
    </ErrorBoundary>
  );
};
