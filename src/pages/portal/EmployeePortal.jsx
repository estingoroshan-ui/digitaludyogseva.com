import React, { useState } from 'react';
import { useRouter } from '../../router/Router';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  Briefcase, 
  CheckCircle2, 
  CalendarCheck, 
  Wallet, 
  FileText, 
  ArrowLeft, 
  Clock, 
  ChevronRight,
  Phone,
  ShieldCheck
} from 'lucide-react';

export const EmployeePortal = () => {
  const { navigate } = useRouter();
  const { showToast } = useApp();

  const [isCheckedIn, setIsCheckedIn] = useState(true);
  const [checkTime, setCheckTime] = useState('09:30 AM');

  const toggleAttendance = () => {
    if (isCheckedIn) {
      setIsCheckedIn(false);
      showToast('Checked out at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 'success');
    } else {
      setIsCheckedIn(true);
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setCheckTime(timeStr);
      showToast('Checked in successfully at ' + timeStr, 'success');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F4F7FA', paddingBottom: '80px' }}>
      {/* Top Mobile/App Header */}
      <div style={{ background: '#002970', color: '#FFFFFF', padding: '24px 20px 32px' }}>
        <div style={{ maxWidth: '480px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <button 
              type="button" 
              onClick={() => navigate('/admin/dashboard')}
              style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <ArrowLeft size={14} />
              <span>Admin ERP</span>
            </button>
            <span style={{ fontSize: '0.8rem', color: '#00BAF2', fontWeight: '700' }}>
              Staff Workspace
            </span>
          </div>

          <h1 style={{ fontSize: '1.45rem', fontWeight: '800', margin: '0 0 4px 0' }}>
            Staff Workspace
          </h1>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#CBD5E1' }}>
            Good Morning, Employee • Tuesday, 24 November
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '480px', margin: '-18px auto 0', padding: '0 16px' }}>
        {/* Attendance Card */}
        <div className="paytm-card" style={{ padding: '20px', borderRadius: '16px', marginBottom: '20px', boxShadow: '0 8px 20px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: '600' }}>
            Today's Attendance
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: '900', color: '#002970', margin: '6px 0 14px' }}>
            {checkTime}
          </div>
          <button 
            type="button"
            onClick={toggleAttendance}
            className="paytm-btn paytm-btn-primary"
            style={{ width: '100%', padding: '12px', borderRadius: '10px', fontWeight: '700', fontSize: '0.92rem' }}
          >
            <Clock size={16} />
            <span>{isCheckedIn ? 'Check Out' : 'Check In'}</span>
          </button>
        </div>

        {/* Task and Metrics Card List */}
        <div className="paytm-card" style={{ padding: '8px 16px', borderRadius: '16px', marginBottom: '20px' }}>
          {[
            { label: 'Assigned Leads', value: '24', isAction: false, onClick: () => navigate('/admin/leads') },
            { label: 'Pending Tasks', value: '08', isAction: false, onClick: () => navigate('/admin/follow-ups') },
            { label: 'Active Projects', value: '12', isAction: false, onClick: () => navigate('/admin/projects') },
            { label: 'My Salary', value: 'View', isAction: true, onClick: () => navigate('/admin/payroll') },
            { label: 'Leave Requests', value: 'Apply', isAction: true, onClick: () => navigate('/admin/leaves') },
            { label: 'My Documents', value: 'View', isAction: true, onClick: () => navigate('/admin/documents') }
          ].map((item, idx) => (
            <div
              key={idx}
              onClick={item.onClick}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 4px',
                borderBottom: idx < 5 ? '1px solid #F1F5F9' : 'none',
                cursor: 'pointer'
              }}
            >
              <span style={{ fontSize: '0.92rem', color: '#334155', fontWeight: '500' }}>
                {item.label}
              </span>
              <span style={{ fontSize: '1rem', fontWeight: '800', color: item.isAction ? '#008BCB' : '#002970' }}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
