import React, { useState } from 'react';
import { useRouter } from '../../router/Router';
import { 
  KeyRound, 
  Mail, 
  Lock, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export const ForgotPasswordPage = () => {
  const { navigate } = useRouter();

  const [step, setStep] = useState(1); // 1 = Request, 2 = Reset
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleRequestToken = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const response = await fetch('/api/v1/auth.php?action=forgot_password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to request password reset.');
      }

      setSuccessMessage(data.message);
      if (data.reset_token) {
        setToken(data.reset_token);
      }
      setStep(2);
    } catch (err) {
      setErrorMessage(err.message || 'Error communicating with server.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/v1/auth.php?action=reset_password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: token.trim(),
          new_password: newPassword.trim()
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Password reset failed.');
      }

      setSuccessMessage('Password reset successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setErrorMessage(err.message || 'Error resetting password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F4F8FC', display: 'flex', flexDirection: 'column' }}>
      <header style={{ background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', padding: '14px 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <img src="/assets/logo.webp" alt="Digital Udyog Seva" style={{ width: '40px', height: '40px', objectFit: 'contain' }} onError={(e) => { e.target.src = '/assets/logo.png'; }} />
            <div>
              <span style={{ fontSize: '1.15rem', fontWeight: '800', color: '#002970', display: 'block', lineHeight: 1.1 }}>
                Digital Udyog <span style={{ color: '#00BAF2' }}>Seva</span>
              </span>
              <span style={{ fontSize: '0.65rem', fontWeight: '700', color: '#64748B', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Account Recovery
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
            <ArrowLeft size={16} /> Back to Login
          </button>
        </div>
      </header>

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '36px 16px' }}>
        <div style={{ width: '100%', maxWidth: '440px' }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 8px 30px rgba(0, 41, 112, 0.08)',
            padding: '36px 32px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '22px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(0, 41, 112, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#002970' }}>
                <KeyRound size={24} />
              </div>
              <div>
                <h1 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#002970', margin: 0 }}>
                  Reset Your Password
                </h1>
                <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '2px 0 0 0' }}>
                  {step === 1 ? 'Enter your registered email address' : 'Enter reset token and new password'}
                </p>
              </div>
            </div>

            {errorMessage && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '8px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', fontSize: '0.84rem', color: '#991B1B' }}>
                <AlertCircle size={16} color="#DC2626" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div style={{ background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: '8px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', fontSize: '0.84rem', color: '#166534' }}>
                <CheckCircle2 size={16} color="#16A34A" />
                <span>{successMessage}</span>
              </div>
            )}

            {step === 1 ? (
              <form onSubmit={handleRequestToken}>
                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                    Registered Email Address
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      required
                      style={{
                        width: '100%',
                        padding: '11px 14px 11px 40px',
                        borderRadius: '8px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.9rem'
                      }}
                    />
                    <Mail size={16} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    background: '#002970',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '12px 20px',
                    fontSize: '0.92rem',
                    fontWeight: '800',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  {loading ? 'Generating...' : 'Generate Reset Token'}
                  {!loading && <ArrowRight size={16} />}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword}>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                    Reset Token
                  </label>
                  <input
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Enter security token"
                    required
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.88rem'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    required
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.88rem'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    required
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.88rem'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    background: '#002970',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '12px 20px',
                    fontSize: '0.92rem',
                    fontWeight: '800',
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {loading ? 'Updating Password...' : 'Save New Password & Login'}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
