import React, { useState, useEffect, useRef } from 'react';
import { useRouter, getApiUrl } from '../../router/Router';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  Users, 
  Award, 
  Calculator, 
  UserCheck, 
  Briefcase, 
  FileCheck, 
  Receipt, 
  CreditCard, 
  UserCog, 
  CalendarCheck, 
  Wallet, 
  BarChart3, 
  Settings, 
  Search, 
  Bell, 
  ChevronRight, 
  ChevronDown,
  Menu, 
  X,
  ExternalLink,
  Smartphone,
  Globe,
  SlidersHorizontal,
  LogOut,
  FolderOpen,
  Plus,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Building2,
  HelpCircle,
  Check,
  FileSpreadsheet
} from 'lucide-react';
import { EnterpriseQuickCreateModal } from '../../components/common/EnterpriseQuickCreateModal';

export const AdminLayout = ({ children }) => {
  const { currentPath, navigate, isActive, breadcrumbs } = useRouter();
  const { showToast, activeRole, setActiveRole } = useApp();
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [quickCreateOpen, setQuickCreateOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);

  // Expanded Groups in Sidebar Navigation
  const [expandedGroups, setExpandedGroups] = useState({
    crm: true,
    schemes: true,
    projects: true,
    finance: true,
    hrms: true,
    system: true
  });

  const toggleGroup = (groupKey) => {
    setExpandedGroups(prev => ({ ...prev, [groupKey]: !prev[groupKey] }));
  };

  // Dynamic Metrics for Sidebar Badges
  const [metrics, setMetrics] = useState({
    total_leads: 769,
    total_customers: 319,
    active_projects: 86,
    total_documents: 142,
    total_employees: 16,
    present_today: 14,
    monthly_payroll: '₹6.80L'
  });

  useEffect(() => {
    let isMounted = true;
    fetch(getApiUrl('api/v1/dashboard_stats.php'))
      .then(res => res.json())
      .then(res => {
        if (isMounted && res.status && res.data && res.data.metrics) {
          setMetrics(prev => ({
            ...prev,
            total_leads: res.data.metrics.total_leads || 769,
            total_customers: res.data.metrics.total_customers || 319,
            active_projects: res.data.metrics.active_projects || 86
          }));
        }
      })
      .catch(() => {});
    return () => { isMounted = false; };
  }, []);

  // -------------------------------------------------------------
  // GROUPED ENTERPRISE NAVIGATION DEFINITION
  // -------------------------------------------------------------
  const navGroups = [
    {
      key: 'overview',
      title: 'CORE PLATFORM',
      items: [
        { label: 'Master Dashboard', path: '/admin/dashboard', icon: LayoutDashboard }
      ]
    },
    {
      key: 'crm',
      title: 'CRM & CLIENT RELATIONS',
      items: [
        { label: 'Lead Management', path: '/admin/leads', icon: Users, badge: String(metrics.total_leads) },
        { label: 'Follow-ups Calendar', path: '/admin/follow-ups', icon: Clock },
        { label: 'Customer 360°', path: '/admin/customers', icon: UserCheck, badge: String(metrics.total_customers) }
      ]
    },
    {
      key: 'schemes',
      title: 'GOVT SCHEMES & ELIGIBILITY',
      items: [
        { label: 'Schemes Catalog', path: '/admin/schemes', icon: Award },
        { label: 'Eligibility & 100-Pt Scorecard', path: '/admin/eligibility', icon: Calculator }
      ]
    },
    {
      key: 'projects',
      title: 'OPERATIONS & LOAN CASES',
      items: [
        { label: 'Project Management', path: '/admin/projects', icon: Briefcase, badge: String(metrics.active_projects) },
        { label: 'Digital Document Vault', path: '/admin/documents', icon: FileCheck, badge: String(metrics.total_documents) }
      ]
    },
    {
      key: 'finance',
      title: 'BILLING & FINANCIAL ACCOUNTS',
      items: [
        { label: 'Invoices & Billing', path: '/admin/invoices', icon: Receipt },
        { label: 'Payments & Collections', path: '/admin/payments', icon: CreditCard },
        { label: 'Customer Ledger & Accounts', path: '/admin/accounts', icon: FileSpreadsheet },
        { label: 'Services & Quotations', path: '/admin/services', icon: Building2 }
      ]
    },
    {
      key: 'hrms',
      title: 'HRMS & WORKFORCE',
      items: [
        { label: 'Staff Management', path: '/admin/employees', icon: UserCog, badge: String(metrics.total_employees) },
        { label: 'Attendance & Biometrics', path: '/admin/attendance', icon: CalendarCheck, badge: `${metrics.present_today} Present` },
        { label: 'Leave Requests', path: '/admin/leaves', icon: Clock },
        { label: 'Payroll & Salary Slips', path: '/admin/payroll', icon: Wallet }
      ]
    },
    {
      key: 'system',
      title: 'INTELLIGENCE & CONFIG',
      items: [
        { label: 'Reports & Analytics', path: '/admin/reports', icon: BarChart3 },
        { label: 'Master Settings & Rules', path: '/admin/settings', icon: Settings }
      ]
    }
  ];

  // Filter nav groups by sidebar search
  const filteredNavGroups = navGroups.map(grp => {
    if (!sidebarSearch.trim()) return grp;
    const filteredItems = grp.items.filter(item => 
      item.label.toLowerCase().includes(sidebarSearch.toLowerCase())
    );
    return { ...grp, items: filteredItems };
  }).filter(grp => grp.items.length > 0);

  // Global Search Handler
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchDropdownOpen(false);
    if (globalSearch.trim()) {
      navigate(`/admin/leads?search=${encodeURIComponent(globalSearch.trim())}`);
    }
  };

  const searchResults = globalSearch.trim().length > 1 ? [
    { type: 'Lead', label: `Lead: "${globalSearch}"`, path: `/admin/leads?search=${encodeURIComponent(globalSearch.trim())}` },
    { type: 'Customer', label: `Customer Profile: "${globalSearch}"`, path: `/admin/customers?search=${encodeURIComponent(globalSearch.trim())}` },
    { type: 'Project', label: `Loan Case: "${globalSearch}"`, path: `/admin/projects?search=${encodeURIComponent(globalSearch.trim())}` },
    { type: 'Document', label: `Vault Search: "${globalSearch}"`, path: `/admin/documents?search=${encodeURIComponent(globalSearch.trim())}` },
    { type: 'Invoice', label: `Billing Search: "${globalSearch}"`, path: `/admin/invoices?search=${encodeURIComponent(globalSearch.trim())}` }
  ] : [];

  return (
    <div className="paytm-app">
      {/* 1. STICKY TOPBAR */}
      <header className="paytm-topbar" style={{ position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        
        {/* Left: Brand Logo & Hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button 
            type="button"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="paytm-btn paytm-btn-outline paytm-btn-sm"
            style={{ padding: '6px 8px', border: 'none', background: '#F8FAFC', borderRadius: '6px' }}
            title="Toggle Sidebar"
          >
            <Menu size={18} color="#002970" />
          </button>

          {/* Official Brand Logo */}
          <div 
            onClick={() => navigate('/admin/dashboard')}
            className="paytm-logo"
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <img 
              src="/assets/logo.webp" 
              alt="Digital Udyog Seva Logo" 
              style={{ width: '34px', height: '34px', objectFit: 'contain' }} 
            />
            <div>
              <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#002970' }}>Digital Udyog </span>
              <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#00BAF2' }}>Seva</span>
            </div>
          </div>
        </div>

        {/* Center: Global Search Bar */}
        <div style={{ position: 'relative', width: '380px' }}>
          <form onSubmit={handleSearchSubmit} className="paytm-search-box" style={{ width: '100%', background: '#F8FAFC' }}>
            <Search size={16} color="#64748B" />
            <input 
              type="text" 
              placeholder="Search leads, customers, projects, invoices..."
              value={globalSearch}
              onChange={(e) => {
                setGlobalSearch(e.target.value);
                setSearchDropdownOpen(e.target.value.trim().length > 1);
              }}
              onFocus={() => {
                if (globalSearch.trim().length > 1) setSearchDropdownOpen(true);
              }}
            />
            {globalSearch && (
              <X 
                size={14} 
                color="#94A3B8" 
                style={{ cursor: 'pointer' }} 
                onClick={() => { setGlobalSearch(''); setSearchDropdownOpen(false); }} 
              />
            )}
          </form>

          {/* Quick Search Dropdown */}
          {searchDropdownOpen && searchResults.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              marginTop: '4px',
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
              zIndex: 100,
              padding: '8px 0'
            }}>
              <div style={{ padding: '6px 14px', fontSize: '0.74rem', color: '#64748B', fontWeight: '700' }}>
                LIVE DATABASE SEARCH RESULTS
              </div>
              {searchResults.map((res, idx) => (
                <div 
                  key={idx}
                  onClick={() => {
                    setSearchDropdownOpen(false);
                    navigate(res.path);
                  }}
                  style={{
                    padding: '8px 14px',
                    fontSize: '0.84rem',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: idx === searchResults.length - 1 ? 'none' : '1px solid #F1F5F9'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#F0F9FF'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#FFFFFF'}
                >
                  <span style={{ color: '#002970', fontWeight: '600' }}>{res.label}</span>
                  <span style={{ fontSize: '0.72rem', background: '#E0F2FE', color: '#008BCB', padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>
                    {res.type}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Quick-Create, Portal Links, Notifications & Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          
          {/* Quick Create Button (+ New) */}
          <button
            type="button"
            onClick={() => setQuickCreateOpen(true)}
            style={{
              padding: '7px 14px',
              background: '#00BAF2',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '700',
              fontSize: '0.84rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 6px rgba(0,186,242,0.25)'
            }}
          >
            <Plus size={15} />
            <span>+ Quick Create</span>
          </button>

          {/* Quick Portal Switch Pills */}
          <div style={{ display: 'flex', gap: '4px', background: '#F1F5F9', padding: '3px', borderRadius: '8px' }}>
            <button 
              type="button"
              onClick={() => navigate('/portal/employee')}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 8px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '600', color: '#002970' }}
              title="Open Employee Workspace"
            >
              <Smartphone size={12} color="#00BAF2" />
              <span>Employee</span>
            </button>
            <button 
              type="button"
              onClick={() => navigate('/portal/customer')}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 8px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '600', color: '#002970' }}
              title="Open Customer Portal"
            >
              <Users size={12} color="#16A34A" />
              <span>Customer</span>
            </button>
            <button 
              type="button"
              onClick={() => navigate('/')}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 8px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '600', color: '#64748B' }}
              title="Return to Public Website"
            >
              <Globe size={12} />
              <span>Public</span>
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
              <div style={{ position: 'absolute', right: 0, top: '40px', width: '320px', background: '#fff', border: '1px solid #E2E8F0', borderRadius: '10px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', padding: '16px', zIndex: 100 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F1F5F9', paddingBottom: '8px', marginBottom: '10px' }}>
                  <span style={{ fontWeight: '700', fontSize: '0.9rem', color: '#002970' }}>Real-time Notifications</span>
                  <span style={{ fontSize: '0.75rem', color: '#00BAF2', cursor: 'pointer' }} onClick={() => setNotificationsOpen(false)}>Close</span>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ padding: '8px', background: '#F8FAFC', borderRadius: '6px', borderLeft: '3px solid #00BAF2' }}>
                    <div style={{ fontWeight: '700', color: '#002970' }}>18 Pending Follow-ups Today</div>
                    <div style={{ fontSize: '0.74rem', color: '#64748B' }}>PMEGP &amp; MUDRA leads requiring customer contact</div>
                  </div>
                  <div style={{ padding: '8px', background: '#F8FAFC', borderRadius: '6px', borderLeft: '3px solid #16A34A' }}>
                    <div style={{ fontWeight: '700', color: '#002970' }}>12 Documents Awaiting Verification</div>
                    <div style={{ fontSize: '0.74rem', color: '#64748B' }}>KYC, DPR &amp; Bank Quotations in Digital Vault</div>
                  </div>
                  <div style={{ padding: '8px', background: '#F8FAFC', borderRadius: '6px', borderLeft: '3px solid #F59E0B' }}>
                    <div style={{ fontWeight: '700', color: '#002970' }}>Payment Received: ₹29,500</div>
                    <div style={{ fontSize: '0.74rem', color: '#64748B' }}>Receipt RCT-2026-901 generated successfully</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar */}
          <div style={{ position: 'relative' }}>
            <div 
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
            >
              <div style={{ textAlign: 'right', display: 'none' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#002970' }}>Admin Officer</div>
                <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Jaipur Head Office</div>
              </div>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#002970', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.95rem' }}>
                A
              </div>
            </div>

            {profileDropdownOpen && (
              <div style={{
                position: 'absolute',
                right: 0,
                top: '44px',
                width: '220px',
                background: '#FFFFFF',
                borderRadius: '10px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                zIndex: 100,
                padding: '8px 0'
              }}>
                <div style={{ padding: '8px 16px', borderBottom: '1px solid #F1F5F9' }}>
                  <div style={{ fontWeight: '700', color: '#002970', fontSize: '0.88rem' }}>Admin / Compliance Lead</div>
                  <div style={{ fontSize: '0.74rem', color: '#64748B' }}>Jaipur Head Office Branch</div>
                </div>

                <div 
                  onClick={() => { setProfileDropdownOpen(false); navigate('/admin/settings'); }}
                  style={{ padding: '8px 16px', fontSize: '0.84rem', color: '#334155', cursor: 'pointer' }}
                >
                  System Master Settings
                </div>

                <div 
                  onClick={() => { setProfileDropdownOpen(false); navigate('/admin/employees'); }}
                  style={{ padding: '8px 16px', fontSize: '0.84rem', color: '#334155', cursor: 'pointer' }}
                >
                  My Staff Profile
                </div>

                <div 
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    showToast('Logged out securely', 'info');
                    navigate('/');
                  }}
                  style={{ padding: '8px 16px', fontSize: '0.84rem', color: '#DC2626', cursor: 'pointer', borderTop: '1px solid #F1F5F9', fontWeight: '600' }}
                >
                  Sign Out
                </div>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* 2. MAIN LAYOUT: SIDEBAR + CONTENT */}
      <div className="paytm-layout">
        
        {/* Left Sidebar */}
        <aside className={`paytm-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`} style={{ overflowY: 'auto' }}>
          
          {/* Sidebar Search Filter */}
          {!sidebarCollapsed && (
            <div style={{ padding: '12px 14px 6px 14px' }}>
              <div style={{ position: 'relative' }}>
                <Search size={14} color="#94A3B8" style={{ position: 'absolute', left: '10px', top: '8px' }} />
                <input
                  type="text"
                  placeholder="Filter modules..."
                  value={sidebarSearch}
                  onChange={(e) => setSidebarSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '6px 10px 6px 30px',
                    border: '1px solid #E2E8F0',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    background: '#F8FAFC',
                    outline: 'none'
                  }}
                />
              </div>
            </div>
          )}

          {/* Grouped Sidebar Navigation */}
          <nav className="paytm-sidebar-nav" style={{ padding: '8px 10px' }}>
            {filteredNavGroups.map((group) => {
              const isGroupExpanded = expandedGroups[group.key] !== false;

              return (
                <div key={group.key} style={{ marginBottom: '12px' }}>
                  
                  {/* Group Header (if not collapsed) */}
                  {!sidebarCollapsed && group.title && (
                    <div 
                      onClick={() => toggleGroup(group.key)}
                      style={{
                        padding: '6px 10px',
                        fontSize: '0.7rem',
                        fontWeight: '800',
                        color: '#94A3B8',
                        letterSpacing: '0.5px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}
                    >
                      <span>{group.title}</span>
                      <ChevronDown 
                        size={12} 
                        style={{
                          transform: isGroupExpanded ? 'rotate(0deg)' : 'rotate(-90deg)',
                          transition: 'transform 0.15s ease'
                        }} 
                      />
                    </div>
                  )}

                  {/* Group Items */}
                  {(sidebarCollapsed || isGroupExpanded) && group.items.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);

                    return (
                      <div 
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        className={`paytm-nav-link ${active ? 'active' : ''}`}
                        title={item.label}
                        style={{
                          margin: '2px 0',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          cursor: 'pointer',
                          background: active ? '#00BAF2' : 'transparent',
                          color: active ? '#FFFFFF' : '#334155',
                          fontWeight: active ? '700' : '500',
                          fontSize: '0.84rem',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <Icon size={17} color={active ? '#FFFFFF' : '#002970'} />
                        {!sidebarCollapsed && (
                          <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {item.label}
                          </span>
                        )}
                        {!sidebarCollapsed && item.badge && (
                          <span style={{
                            fontSize: '0.68rem',
                            background: active ? 'rgba(255,255,255,0.25)' : '#F1F5F9',
                            color: active ? '#FFFFFF' : '#475569',
                            padding: '2px 7px',
                            borderRadius: '10px',
                            fontWeight: '700'
                          }}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                    );
                  })}

                </div>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="paytm-main-wrapper" style={{ background: '#F4F7FB' }}>
          <div className="paytm-content" style={{ padding: '20px 24px' }}>
            
            {/* Live Breadcrumbs */}
            <div className="paytm-breadcrumbs" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#64748B' }}>
              <span onClick={() => navigate('/admin/dashboard')} style={{ cursor: 'pointer', color: '#002970', fontWeight: '600' }}>
                Home
              </span>
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={crumb.path}>
                  <ChevronRight size={12} color="#94A3B8" />
                  {crumb.isLast ? (
                    <span style={{ color: '#00BAF2', fontWeight: '700' }}>{crumb.label}</span>
                  ) : (
                    <span onClick={() => navigate(crumb.path)} style={{ cursor: 'pointer', color: '#475569' }}>
                      {crumb.label}
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Injected Active Module */}
            {children}

          </div>
        </main>

      </div>

      {/* Global Quick Create Modal */}
      <EnterpriseQuickCreateModal 
        isOpen={quickCreateOpen} 
        onClose={() => setQuickCreateOpen(false)} 
      />
    </div>
  );
};
