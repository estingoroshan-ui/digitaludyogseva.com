import React, { useState } from 'react';
import { useRouter, Link } from '../../router/Router';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  UserCheck, 
  IndianRupee, 
  FileText, 
  FileCheck, 
  Award, 
  Calculator, 
  Receipt, 
  CreditCard, 
  UserCog, 
  CalendarCheck, 
  Wallet, 
  BarChart3, 
  Settings, 
  Search, 
  Bell, 
  Menu, 
  X, 
  ChevronRight, 
  ChevronDown, 
  ExternalLink,
  ShieldCheck,
  Smartphone,
  Globe,
  SlidersHorizontal,
  LogOut,
  FolderOpen
} from 'lucide-react';

export const AdminLayout = ({ children }) => {
  const { currentPath, navigate, isActive, breadcrumbs } = useRouter();
  const { showToast, activeRole, setActiveRole } = useApp();
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  // Nav Menu Items matching Paytm UI and user specification
  const navMenuItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Lead Management', path: '/admin/leads', icon: Users, badge: '769' },
    { label: 'Government Schemes', path: '/admin/schemes', icon: Award },
    { label: 'Eligibility & Scorecard', path: '/admin/eligibility', icon: Calculator },
    { label: 'Customers', path: '/admin/customers', icon: UserCheck, badge: '319' },
    { label: 'Project Management', path: '/admin/projects', icon: Briefcase, badge: '86' },
    { label: 'Document Management', path: '/admin/documents', icon: FileCheck },
    { label: 'Billing & Invoices', path: '/admin/invoices', icon: Receipt },
    { label: 'Payments & Accounts', path: '/admin/payments', icon: CreditCard },
    { label: 'Staff Management', path: '/admin/employees', icon: UserCog },
    { label: 'Attendance', path: '/admin/attendance', icon: CalendarCheck },
    { label: 'Payroll & Salary', path: '/admin/payroll', icon: Wallet },
    { label: 'Reports & Analytics', path: '/admin/reports', icon: BarChart3 },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (globalSearch.trim()) {
      navigate(`/admin/leads?search=${encodeURIComponent(globalSearch.trim())}`);
    }
  };

  return (
    <div className="paytm-app">
      {/* Top Navbar */}
      <header className="paytm-topbar">
        {/* Left: Brand Logo & Hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button 
            type="button"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="paytm-btn paytm-btn-outline paytm-btn-sm"
            style={{ padding: '6px 8px', border: 'none', background: '#F8FAFC' }}
            title="Toggle Sidebar"
          >
            <Menu size={18} color="#002970" />
          </button>

          <div 
            onClick={() => navigate('/admin/dashboard')}
            className="paytm-logo"
          >
            <span className="paytm-logo-navy">Consultancy</span>
            <span className="paytm-logo-sky">ERP</span>
          </div>
        </div>

        {/* Center: Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="paytm-search-box">
          <Search size={16} color="#64748B" />
          <input 
            type="text" 
            placeholder="Search leads, customers, projects..."
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
          />
        </form>

        {/* Right: Quick Portal Links, Notifications & Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Quick Portal Switch Pills */}
          <div style={{ display: 'flex', gap: '6px', background: '#F1F5F9', padding: '3px', borderRadius: '8px' }}>
            <button 
              type="button"
              onClick={() => navigate('/portal/employee')}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 8px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '600', color: '#002970' }}
              title="Open Employee Workspace"
            >
              <Smartphone size={12} color="#00BAF2" />
              <span>Employee App</span>
            </button>
            <button 
              type="button"
              onClick={() => navigate('/portal/customer')}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 8px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '600', color: '#002970' }}
              title="Open Customer Portal"
            >
              <Users size={12} color="#16A34A" />
              <span>Customer App</span>
            </button>
            <button 
              type="button"
              onClick={() => navigate('/')}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 8px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '600', color: '#64748B' }}
              title="Return to Public Website"
            >
              <Globe size={12} />
              <span>Public Site</span>
            </button>
          </div>

          {/* Notifications Bell */}
          <div style={{ position: 'relative' }}>
            <button 
              type="button"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', position: 'relative', padding: '6px' }}
            >
              <Bell size={20} color="#002970" />
              <span style={{ position: 'absolute', top: '2px', right: '2px', width: '8px', height: '8px', background: '#00BAF2', borderRadius: '50%' }} />
            </button>

            {notificationsOpen && (
              <div style={{ position: 'absolute', right: 0, top: '40px', width: '300px', background: '#fff', border: '1px solid #E2E8F0', borderRadius: '10px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', padding: '16px', zIndex: 100 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F1F5F9', paddingBottom: '8px', marginBottom: '10px' }}>
                  <span style={{ fontWeight: '700', fontSize: '0.9rem', color: '#002970' }}>Notifications</span>
                  <span style={{ fontSize: '0.75rem', color: '#00BAF2', cursor: 'pointer' }} onClick={() => setNotificationsOpen(false)}>Close</span>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ padding: '8px', background: '#F8FAFC', borderRadius: '6px' }}>
                    <div style={{ fontWeight: '600' }}>18 Pending Follow-ups Today</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Leads requiring client teleconsultation</div>
                  </div>
                  <div style={{ padding: '8px', background: '#F8FAFC', borderRadius: '6px' }}>
                    <div style={{ fontWeight: '600' }}>12 Documents Awaiting Verification</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748B' }}>PMEGP & MUDRA applicant files</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar */}
          <div 
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          >
            <span style={{ fontSize: '0.88rem', fontWeight: '700', color: '#002970' }}>Admin</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#002970', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.95rem' }}>
              A
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout Container */}
      <div className="paytm-layout">
        {/* Left Sidebar */}
        <aside className={`paytm-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
          <nav className="paytm-sidebar-nav">
            {navMenuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <div 
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`paytm-nav-link ${active ? 'active' : ''}`}
                  title={item.label}
                >
                  <Icon size={18} />
                  {!sidebarCollapsed && (
                    <span style={{ flex: 1 }}>{item.label}</span>
                  )}
                  {!sidebarCollapsed && item.badge && (
                    <span style={{ fontSize: '0.7rem', background: active ? '#00BAF2' : '#F1F5F9', color: active ? '#fff' : '#64748B', padding: '2px 6px', borderRadius: '10px', fontWeight: '700' }}>
                      {item.badge}
                    </span>
                  )}
                </div>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="paytm-main-wrapper">
          <div className="paytm-content">
            {/* Live Breadcrumbs */}
            <div className="paytm-breadcrumbs">
              <span onClick={() => navigate('/admin/dashboard')} style={{ cursor: 'pointer' }}>Home</span>
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={crumb.path}>
                  <ChevronRight size={12} />
                  {crumb.isLast ? (
                    <span className="current">{crumb.label}</span>
                  ) : (
                    <span onClick={() => navigate(crumb.path)} style={{ cursor: 'pointer' }}>
                      {crumb.label}
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Injected Route Component */}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
