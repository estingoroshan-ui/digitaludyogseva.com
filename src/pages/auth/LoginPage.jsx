import React, { useState, useEffect } from 'react';
import { useRouter } from '../../router/Router';
import { useApp } from '../../context/AppContext';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  Users, 
  Briefcase, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  ArrowLeft
} from 'lucide-react';

export const LoginPage = ({ initialPortal = 'admin' }) => {
  const { navigate, currentPath } = useRouter();
  const { showToast } = useApp();

  // Detect active portal from current path or prop
  let detectedPortal = initialPortal;
  if (currentPath.includes('customer')) detectedPortal = 'customer';
  else if (currentPath.includes('employee')) detectedPortal = 'employee';
  else if (currentPath.includes('admin')) detectedPortal = 'admin';

  const [portal, setPortal] = useState(detectedPortal);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    setErrorMessage('');
    setSuccessMessage('');
  }, [portal]);

  const portalConfig = {
    customer: {
      title: 'Customer Portal Login',
      subtitle: 'Access your loan tracking, subsidy status & document vault',
      badge: 'Client Portal',
      badgeColor: '#00BAF2',
      defaultRedirect: '/portal/customer',
      icon: Users,
      demoCreds: { user: 'amitkumhar0099@gmail.com', pass: 'admin123' },
      secondaryAction: {
        text: "Don't have an account?",
        linkText: 'Register as New Customer',
        path: '/customer/register'
      }
    },
    employee: {
      title: 'Employee / Staff Login',
      subtitle: 'Consultancy workspace, lead pipeline & attendance portal',
      badge: 'Staff Workspace',
      badgeColor: '#002970',
      defaultRedirect: '/portal/employee',
      icon: Briefcase,
      demoCreds: { user: 'DILEEPMAHOLIYA91@GMAIL.COM', pass: 'admin123' },
      secondaryAction: {
        text: 'Facing login issues?',
        linkText: 'Contact HR Helpdesk',
        path: '/contact'
      }
    },
    admin: {
      title: 'Enterprise Admin Login',
      subtitle: 'Management ERP, scheme configuration & financial audits',
      badge: 'Super Admin Access',
      badgeColor: '#DC2626',
      defaultRedirect: '/admin/leads',
      icon: ShieldCheck,
      demoCreds: { user: 'manish872@gmail.com', pass: 'admin123' },
      secondaryAction: {
        text: 'Forgot administrative credentials?',
        linkText: 'Reset Password',
        path: '/forgot-password'
      }
    }
  };

  const currentCfg = portalConfig[portal];

  const handlePortalSwitch = (newPortal) => {
    setPortal(newPortal);
    if (newPortal === 'customer') navigate('/customer/login');
    else if (newPortal === 'employee') navigate('/employee/login');
    else navigate('/admin/login');
  };

  const fillDemo = () => {
    setUsername(currentCfg.demoCreds.user);
    setPassword(currentCfg.demoCreds.pass);
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!username.trim() || !password.trim()) {
      setErrorMessage('Please enter your registered email/mobile and password.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/v1/auth.php?action=login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
          portal: portal
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Login failed. Please check your credentials.');
      }

      // Store in localStorage
      localStorage.setItem('dus_auth_token', data.token);
      localStorage.setItem('dus_auth_user', JSON.stringify(data.user));
      localStorage.setItem('dus_portal', data.portal);
      localStorage.setItem('dus_permissions', JSON.stringify(data.permissions || []));
      if (data.linked_entity) {
        localStorage.setItem('dus_linked_entity', JSON.stringify(data.linked_entity));
      }

      setSuccessMessage('Authentication verified! Redirecting to your workspace...');
      if (showToast) {
        showToast(`Welcome back, ${data.user.name}!`, 'success');
      }

      setTimeout(() => {
        navigate(currentCfg.defaultRedirect);
      }, 600);

    } catch (err) {
      setErrorMessage(err.message || 'Unable to connect to authentication server.');
    } finally {
      setLoading(false);
    }
  };

  const Icon = currentCfg.icon;

  return (
    <div style={{ minHeight: '100vh', background: '#F4F8FC', display: 'flex', flexDirection: 'column' }}>
      {/* Top Header */}
      <header style={{ background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', padding: '14px 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div 
            onClick={() => navigate('/')} 
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          >
            <img 
              src="/assets/logo.webp" 
              alt="Digital Udyog Seva" 
              style={{ width: '40px', height: '40px', objectFit: 'contain' }}
              onError={(e) => { e.target.src = '/assets/logo.png'; }}
            />
            <div>
              <span style={{ fontSize: '1.15rem', fontWeight: '800', color: '#002970', display: 'block', lineHeight: 1.1 }}>
                Digital Udyog <span style={{ color: '#00BAF2' }}>Seva</span>
              </span>
              <span style={{ fontSize: '0.65rem', fontWeight: '700', color: '#64748B', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Enterprise Authentication
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate('/login')}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#002970',
              fontSize: '0.84rem',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={16} /> All Portals
          </button>
        </div>
      </header>

      {/* Main Form Container */}
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '36px 16px' }}>
        <div style={{ width: '100%', maxWidth: '460px' }}>
          
          {/* Portal Switcher Tabs */}
          <div style={{ 
            display: 'flex', 
            background: '#E2E8F0', 
            borderRadius: '12px', 
            padding: '4px', 
            marginBottom: '20px',
            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.06)'
          }}>
            {[
              { id: 'customer', label: 'Customer', icon: Users },
              { id: 'employee', label: 'Staff / RM', icon: Briefcase },
              { id: 'admin', label: 'Admin ERP', icon: ShieldCheck }
            ].map((t) => {
              const TIcon = t.icon;
              const isActive = portal === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handlePortalSwitch(t.id)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: 'none',
                    background: isActive ? '#FFFFFF' : 'transparent',
                    color: isActive ? '#002970' : '#64748B',
                    fontWeight: isActive ? '800' : '600',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    boxShadow: isActive ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <TIcon size={14} color={isActive ? '#00BAF2' : '#64748B'} />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          {/* Login Card */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 8px 30px rgba(0, 41, 112, 0.08)',
            padding: '36px 32px',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '22px' }}>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '12px', 
                background: `${currentCfg.badgeColor}12`, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: currentCfg.badgeColor
              }}>
                <Icon size={24} />
              </div>
              <div>
                <h1 style={{ fontSize: '1.28rem', fontWeight: '800', color: '#002970', margin: 0 }}>
                  {currentCfg.title}
                </h1>
                <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '2px 0 0 0' }}>
                  {currentCfg.subtitle}
                </p>
              </div>
            </div>

            {/* Error Notification */}
            {errorMessage && (
              <div style={{ 
                background: '#FEF2F2', 
                border: '1px solid #FCA5A5', 
                borderRadius: '8px', 
                padding: '10px 14px', 
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: '8px', 
                marginBottom: '18px',
                fontSize: '0.84rem',
                color: '#991B1B'
              }}>
                <AlertCircle size={16} color="#DC2626" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Success Notification */}
            {successMessage && (
              <div style={{ 
                background: '#F0FDF4', 
                border: '1px solid #86EFAC', 
                borderRadius: '8px', 
                padding: '10px 14px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                marginBottom: '18px',
                fontSize: '0.84rem',
                color: '#166534'
              }}>
                <CheckCircle2 size={16} color="#16A34A" />
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Username / Email Field */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  Email Address or Mobile Number
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. name@company.com or 9876543210"
                    required
                    style={{
                      width: '100%',
                      padding: '11px 14px 11px 40px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.9rem',
                      color: '#0F172A',
                      outline: 'none',
                      background: '#F8FAFC',
                      transition: 'border 0.2s'
                    }}
                    onFocus={(e) => { e.target.style.borderColor = '#00BAF2'; e.target.style.background = '#FFFFFF'; }}
                    onBlur={(e) => { e.target.style.borderColor = '#CBD5E1'; }}
                  />
                  <Mail size={16} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
              </div>

              {/* Password Field */}
              <div style={{ marginBottom: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: '700', color: '#334155' }}>
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => navigate('/forgot-password')}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#007AA6',
                      fontSize: '0.78rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    Forgot Password?
                  </button>
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    style={{
                      width: '100%',
                      padding: '11px 40px 11px 40px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.9rem',
                      color: '#0F172A',
                      outline: 'none',
                      background: '#F8FAFC',
                      transition: 'border 0.2s'
                    }}
                    onFocus={(e) => { e.target.style.borderColor = '#00BAF2'; e.target.style.background = '#FFFFFF'; }}
                    onBlur={(e) => { e.target.style.borderColor = '#CBD5E1'; }}
                  />
                  <Lock size={16} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#94A3B8',
                      padding: '4px'
                    }}
                    aria-label="Toggle Password Visibility"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#475569', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{ accentColor: '#00BAF2', cursor: 'pointer' }}
                  />
                  <span>Keep me signed in for 7 days</span>
                </label>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #002970 0%, #001B48 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '13px 20px',
                  fontSize: '0.95rem',
                  fontWeight: '800',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(0, 41, 112, 0.18)',
                  opacity: loading ? 0.7 : 1,
                  transition: 'opacity 0.2s'
                }}
              >
                {loading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Sign In to {currentCfg.badge}</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Credentials Filler for Testing */}
            <div style={{ marginTop: '20px', padding: '12px', background: '#F8FAFC', borderRadius: '8px', border: '1px dashed #CBD5E1', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '6px' }}>
                QA / Client Review Credentials:
              </div>
              <button
                type="button"
                onClick={fillDemo}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  borderRadius: '6px',
                  padding: '4px 12px',
                  fontSize: '0.76rem',
                  fontWeight: '700',
                  color: '#002970',
                  cursor: 'pointer'
                }}
              >
                Fill Sample ({currentCfg.demoCreds.user})
              </button>
            </div>

            {/* Secondary Action */}
            <div style={{ textAlign: 'center', marginTop: '22px', fontSize: '0.82rem', color: '#64748B' }}>
              <span>{currentCfg.secondaryAction.text} </span>
              <button
                type="button"
                onClick={() => navigate(currentCfg.secondaryAction.path)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#007AA6',
                  fontWeight: '800',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                {currentCfg.secondaryAction.linkText}
              </button>
            </div>
          </div>

          {/* Security Assurance */}
          <div style={{ textAlign: 'center', marginTop: '20px', color: '#94A3B8', fontSize: '0.74rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <ShieldCheck size={14} color="#16A34A" />
            <span>Protected by SSL 256-Bit Encryption &amp; Role-Based Access Control</span>
          </div>
        </div>
      </main>
    </div>
  );
};
