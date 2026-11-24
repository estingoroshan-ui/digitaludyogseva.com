import React, { useState } from 'react';
import { useRouter } from '../../../router/Router';
import { useApp } from '../../../context/AppContext';
import { 
  UserCog, 
  CalendarCheck, 
  Wallet, 
  Users, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Download, 
  ArrowLeft,
  Calendar,
  Building2,
  Phone,
  Mail
} from 'lucide-react';

export const StaffHrmModule = () => {
  const { currentPath, navigate } = useRouter();
  const { showToast } = useApp();

  const isAttendance = currentPath === '/admin/attendance';
  const isPayroll = currentPath === '/admin/payroll';
  const isLeaves = currentPath === '/admin/leaves';

  const hrmTabs = [
    { label: 'Employees Roster', path: '/admin/employees' },
    { label: 'Attendance Management', path: '/admin/attendance' },
    { label: 'Leave Requests', path: '/admin/leaves' },
    { label: 'Payroll & Salary Slips', path: '/admin/payroll' }
  ];

  const employees = [
    {
      id: 1,
      empCode: 'EMP-01',
      name: 'CA Rajesh Verma',
      department: 'Corporate Accounts & Audit',
      designation: 'Senior CA & Compliance Lead',
      mobile: '9829011223',
      basicSalary: 65000,
      status: 'Active',
      presentToday: true,
      checkInTime: '09:28 AM'
    },
    {
      id: 2,
      empCode: 'EMP-02',
      name: 'Neha Sharma',
      department: 'Lead 360 & Sales Operations',
      designation: 'Corporate Sales Lead',
      mobile: '9928344556',
      basicSalary: 45000,
      status: 'Active',
      presentToday: true,
      checkInTime: '09:32 AM'
    },
    {
      id: 3,
      empCode: 'EMP-03',
      name: 'Anil Tyagi',
      department: 'Government Subsidy & Loans',
      designation: 'Loan Underwriting Specialist',
      mobile: '9414077889',
      basicSalary: 48000,
      status: 'Active',
      presentToday: true,
      checkInTime: '09:15 AM'
    },
    {
      id: 4,
      empCode: 'EMP-04',
      name: 'Suresh Patil',
      department: 'Taxation & MCA Filings',
      designation: 'Tax Advisory Specialist',
      mobile: '9784412300',
      basicSalary: 40000,
      status: 'Active',
      presentToday: true,
      checkInTime: '09:40 AM'
    },
    {
      id: 5,
      empCode: 'EMP-05',
      name: 'Rahul Mehta',
      department: 'Field & Bank Liaison',
      designation: 'Bank Liaison Officer',
      mobile: '9828556677',
      basicSalary: 35000,
      status: 'Active',
      presentToday: false,
      checkInTime: 'On Approved Leave'
    }
  ];

  return (
    <div>
      <div className="paytm-page-header">
        <div>
          <h1 className="paytm-page-title">
            {isAttendance ? 'Attendance & Biometric Operations' :
             isPayroll ? 'Automated Payroll & Salary Register' :
             isLeaves ? 'Leave Management & Approvals' : 'Staff Management & HRM'}
          </h1>
          <p className="paytm-page-subtitle">
            Manage employee master, shift schedules, geo-attendance, leave balances and payroll calculation
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            type="button"
            onClick={() => showToast('Self Check-in registered with timestamp 09:30 AM', 'success')}
            className="paytm-btn paytm-btn-primary"
          >
            <CalendarCheck size={16} />
            <span>Mark Attendance</span>
          </button>
        </div>
      </div>

      {/* HRM Navigation Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px', marginBottom: '20px' }}>
        {hrmTabs.map(tab => {
          const active = currentPath === tab.path;
          return (
            <button
              key={tab.path}
              type="button"
              onClick={() => navigate(tab.path)}
              style={{
                padding: '8px 18px',
                borderRadius: '8px',
                border: 'none',
                background: active ? '#00BAF2' : '#F1F5F9',
                color: active ? '#FFFFFF' : '#475569',
                fontWeight: active ? '700' : '500',
                fontSize: '0.88rem',
                cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Summary KPI Cards */}
      <div className="paytm-stat-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '24px' }}>
        <div className="paytm-card" style={{ padding: '20px' }}>
          <div className="paytm-stat-label">Total Staff</div>
          <div className="paytm-stat-value">16</div>
          <div className="paytm-stat-desc">Full-time employees</div>
        </div>

        <div className="paytm-card" style={{ padding: '20px' }}>
          <div className="paytm-stat-label">Present Today</div>
          <div className="paytm-stat-value" style={{ color: '#16A34A' }}>14</div>
          <div className="paytm-stat-desc">On-duty staff</div>
        </div>

        <div className="paytm-card" style={{ padding: '20px' }}>
          <div className="paytm-stat-label">Absent / Leave</div>
          <div className="paytm-stat-value" style={{ color: '#F59E0B' }}>02</div>
          <div className="paytm-stat-desc">Approved leaves</div>
        </div>

        <div className="paytm-card" style={{ padding: '20px' }}>
          <div className="paytm-stat-label">Monthly Payroll</div>
          <div className="paytm-stat-value" style={{ color: '#002970' }}>₹6,80,000</div>
          <div className="paytm-stat-desc">Gross salary budget</div>
        </div>
      </div>

      {/* Employee List Table */}
      <div className="paytm-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="paytm-table-container" style={{ border: 'none' }}>
          <table className="paytm-table">
            <thead>
              <tr>
                <th>Emp Code</th>
                <th>Employee Full Name</th>
                <th>Department &amp; Designation</th>
                <th>Mobile Number</th>
                <th>Basic Salary</th>
                <th>Today's Attendance</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id}>
                  <td style={{ fontWeight: '700', color: '#002970', fontFamily: 'monospace' }}>
                    {emp.empCode}
                  </td>
                  <td>
                    <div style={{ fontWeight: '700', color: '#002970' }}>{emp.name}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: '600', color: '#334155' }}>{emp.designation}</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748B' }}>{emp.department}</div>
                  </td>
                  <td style={{ fontSize: '0.85rem', color: '#475569' }}>
                    {emp.mobile}
                  </td>
                  <td style={{ fontWeight: '700', color: '#002970' }}>
                    ₹{emp.basicSalary.toLocaleString('en-IN')}
                  </td>
                  <td>
                    <span className={`paytm-badge ${emp.presentToday ? 'paytm-badge-success' : 'paytm-badge-warning'}`}>
                      {emp.checkInTime}
                    </span>
                  </td>
                  <td>
                    <span className="paytm-badge paytm-badge-sky">
                      {emp.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button 
                      type="button"
                      onClick={() => showToast(`Generating Payslip for ${emp.name}...`, 'success')}
                      className="paytm-btn paytm-btn-outline paytm-btn-sm"
                      style={{ color: '#008BCB', borderColor: '#00BAF2' }}
                    >
                      <span>Payslip</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
