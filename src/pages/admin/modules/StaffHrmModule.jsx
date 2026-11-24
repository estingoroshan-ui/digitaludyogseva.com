import React, { useState, useEffect } from 'react';
import { useRouter, getApiUrl } from '../../../router/Router';
import { useApp } from '../../../context/AppContext';
import { 
  Users, 
  UserCheck, 
  UserPlus, 
  CalendarCheck, 
  Clock, 
  Wallet, 
  Building2, 
  Briefcase, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  MoreVertical, 
  ChevronRight, 
  ChevronLeft, 
  Plus, 
  FileText, 
  FileCheck, 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  CreditCard, 
  Lock, 
  Printer
} from 'lucide-react';

export const StaffHrmModule = () => {
  const { currentPath, navigate, matchPath } = useRouter();
  const { showToast } = useApp();

  const isAttendance = currentPath === '/admin/attendance';
  const isPayroll = currentPath === '/admin/payroll';
  const isLeaves = currentPath === '/admin/leaves';
  const isCreateEmployee = currentPath === '/admin/employees/create';

  // Sub-tabs matching user wireframe (Image 2)
  const [activeSubTab, setActiveSubTab] = useState(
    isAttendance ? 'attendance' :
    isPayroll ? 'payroll' :
    isLeaves ? 'leave' : 'employees'
  );

  const [activeActionMenuId, setActiveActionMenuId] = useState(null);
  const [selectedEmployeeForView, setSelectedEmployeeForView] = useState(null);

  // Stats matching Image 2
  const [stats, setStats] = useState({
    totalEmployees: 16,
    presentToday: 14,
    onLeave: 2,
    departments: 6,
    monthlyPayroll: '₹6.80L'
  });

  // Employee Roster matching Image 2 & 16 full team members
  const [employeeList, setEmployeeList] = useState([
    {
      id: 1,
      emp_code: 'EMP-001',
      name: 'Rajesh Verma',
      avatar: 'RV',
      department: 'Accounts & Audit',
      designation: 'Senior CA & Compliance Lead',
      role: 'Manager',
      salary: '₹65,000',
      basic_salary: 65000,
      status: 'Active',
      presentToday: true,
      checkInTime: '09:28 AM',
      branch: 'Head Office Jaipur',
      reporting_manager: 'Managing Director',
      joining_date: '2023-04-10',
      mobile: '9829011223',
      email: 'rajesh.verma@digitaludyogseva.com'
    },
    {
      id: 2,
      emp_code: 'EMP-002',
      name: 'Neha Sharma',
      avatar: 'NS',
      department: 'Sales',
      designation: 'Corporate Sales Lead',
      role: 'Team Lead',
      salary: '₹45,000',
      basic_salary: 45000,
      status: 'Active',
      presentToday: true,
      checkInTime: '09:32 AM',
      branch: 'Head Office Jaipur',
      reporting_manager: 'Rajesh Verma',
      joining_date: '2023-06-15',
      mobile: '9928344556',
      email: 'neha.sharma@digitaludyogseva.com'
    },
    {
      id: 3,
      emp_code: 'EMP-003',
      name: 'Anil Tyagi',
      avatar: 'AT',
      department: 'Loan Processing',
      designation: 'Senior Loan Underwriting Specialist',
      role: 'Executive',
      salary: '₹48,000',
      basic_salary: 48000,
      status: 'Active',
      presentToday: true,
      checkInTime: '09:15 AM',
      branch: 'Delhi Regional Office',
      reporting_manager: 'Rajesh Verma',
      joining_date: '2023-08-01',
      mobile: '9414077889',
      email: 'anil.tyagi@digitaludyogseva.com'
    },
    {
      id: 4,
      emp_code: 'EMP-004',
      name: 'Suresh Patil',
      avatar: 'SP',
      department: 'Taxation',
      designation: 'Tax & MCA Advisory Consultant',
      role: 'Consultant',
      salary: '₹40,000',
      basic_salary: 40000,
      status: 'Active',
      presentToday: true,
      checkInTime: '09:40 AM',
      branch: 'Mumbai Liaison Desk',
      reporting_manager: 'Rajesh Verma',
      joining_date: '2023-09-12',
      mobile: '9784412300',
      email: 'suresh.patil@digitaludyogseva.com'
    },
    {
      id: 5,
      emp_code: 'EMP-005',
      name: 'Rahul Mehta',
      avatar: 'RM',
      department: 'Loan Processing',
      designation: 'Bank Liaison Officer',
      role: 'Executive',
      salary: '₹35,000',
      basic_salary: 35000,
      status: 'Active',
      presentToday: false,
      checkInTime: 'On Approved Leave',
      branch: 'Head Office Jaipur',
      reporting_manager: 'Anil Tyagi',
      joining_date: '2024-01-10',
      mobile: '9828556677',
      email: 'rahul.mehta@digitaludyogseva.com'
    },
    {
      id: 6,
      emp_code: 'EMP-006',
      name: 'Pooja Verma',
      avatar: 'PV',
      department: 'Project Reports / DPR',
      designation: 'Financial Model Analyst',
      role: 'Analyst',
      salary: '₹42,000',
      basic_salary: 42000,
      status: 'Active',
      presentToday: true,
      checkInTime: '09:25 AM',
      branch: 'Head Office Jaipur',
      reporting_manager: 'Rajesh Verma',
      joining_date: '2024-02-01',
      mobile: '9828114477',
      email: 'pooja.verma@digitaludyogseva.com'
    },
    {
      id: 7,
      emp_code: 'EMP-007',
      name: 'Vikas Yadav',
      avatar: 'VY',
      department: 'Sales',
      designation: 'Government Schemes Consultant',
      role: 'Executive',
      salary: '₹38,000',
      basic_salary: 38000,
      status: 'Active',
      presentToday: true,
      checkInTime: '09:30 AM',
      branch: 'Delhi Regional Office',
      reporting_manager: 'Neha Sharma',
      joining_date: '2024-03-15',
      mobile: '9784332211',
      email: 'vikas.yadav@digitaludyogseva.com'
    },
    {
      id: 8,
      emp_code: 'EMP-008',
      name: 'Sunita Choudhary',
      avatar: 'SC',
      department: 'Documentation & KYC',
      designation: 'KYC Verification Officer',
      role: 'Officer',
      salary: '₹32,000',
      basic_salary: 32000,
      status: 'Active',
      presentToday: true,
      checkInTime: '09:20 AM',
      branch: 'Head Office Jaipur',
      reporting_manager: 'Anil Tyagi',
      joining_date: '2024-04-01',
      mobile: '9829988776',
      email: 'sunita.c@digitaludyogseva.com'
    },
    {
      id: 9,
      emp_code: 'EMP-009',
      name: 'Manish Saini',
      avatar: 'MS',
      department: 'IT & Operations',
      designation: 'Portal & Infrastructure Administrator',
      role: 'Admin',
      salary: '₹52,000',
      basic_salary: 52000,
      status: 'Active',
      presentToday: true,
      checkInTime: '09:10 AM',
      branch: 'Head Office Jaipur',
      reporting_manager: 'Managing Director',
      joining_date: '2023-01-15',
      mobile: '9414556633',
      email: 'manish.saini@digitaludyogseva.com'
    },
    {
      id: 10,
      emp_code: 'EMP-010',
      name: 'Priyanka Sen',
      avatar: 'PS',
      department: 'Accounts & Audit',
      designation: 'Junior Accountant & Tally Specialist',
      role: 'Executive',
      salary: '₹28,000',
      basic_salary: 28000,
      status: 'Active',
      presentToday: true,
      checkInTime: '09:35 AM',
      branch: 'Head Office Jaipur',
      reporting_manager: 'Rajesh Verma',
      joining_date: '2024-05-10',
      mobile: '9784112299',
      email: 'priyanka.sen@digitaludyogseva.com'
    },
    {
      id: 11,
      emp_code: 'EMP-011',
      name: 'Deepak Rawat',
      avatar: 'DR',
      department: 'Documentation & KYC',
      designation: 'Document Dispatch Coordinator',
      role: 'Coordinator',
      salary: '₹30,000',
      basic_salary: 30000,
      status: 'Active',
      presentToday: false,
      checkInTime: 'On Sick Leave',
      branch: 'Delhi Regional Office',
      reporting_manager: 'Sunita Choudhary',
      joining_date: '2024-06-01',
      mobile: '9829334411',
      email: 'deepak.rawat@digitaludyogseva.com'
    },
    {
      id: 12,
      emp_code: 'EMP-012',
      name: 'Ankit Joshi',
      avatar: 'AJ',
      department: 'Sales',
      designation: 'Tele-calling Executive',
      role: 'Executive',
      salary: '₹25,000',
      basic_salary: 25000,
      status: 'Active',
      presentToday: true,
      checkInTime: '09:22 AM',
      branch: 'Head Office Jaipur',
      reporting_manager: 'Neha Sharma',
      joining_date: '2024-07-15',
      mobile: '9928551122',
      email: 'ankit.joshi@digitaludyogseva.com'
    },
    {
      id: 13,
      emp_code: 'EMP-013',
      name: 'Meenakshi Jain',
      avatar: 'MJ',
      department: 'Loan Processing',
      designation: 'Bank Submission Coordinator',
      role: 'Coordinator',
      salary: '₹34,000',
      basic_salary: 34000,
      status: 'Active',
      presentToday: true,
      checkInTime: '09:28 AM',
      branch: 'Mumbai Liaison Desk',
      reporting_manager: 'Anil Tyagi',
      joining_date: '2024-08-01',
      mobile: '9414223344',
      email: 'meenakshi.jain@digitaludyogseva.com'
    },
    {
      id: 14,
      emp_code: 'EMP-014',
      name: 'Rohit Kumawat',
      avatar: 'RK',
      department: 'Project Reports / DPR',
      designation: 'Draftsman & Project Assistant',
      role: 'Assistant',
      salary: '₹29,000',
      basic_salary: 29000,
      status: 'Active',
      presentToday: true,
      checkInTime: '09:30 AM',
      branch: 'Head Office Jaipur',
      reporting_manager: 'Pooja Verma',
      joining_date: '2024-09-01',
      mobile: '9784998877',
      email: 'rohit.k@digitaludyogseva.com'
    },
    {
      id: 15,
      emp_code: 'EMP-015',
      name: 'Kavita Mishra',
      avatar: 'KM',
      department: 'Taxation',
      designation: 'GST & TDS Compliance Assistant',
      role: 'Assistant',
      salary: '₹31,000',
      basic_salary: 31000,
      status: 'Active',
      presentToday: true,
      checkInTime: '09:18 AM',
      branch: 'Head Office Jaipur',
      reporting_manager: 'Suresh Patil',
      joining_date: '2024-10-01',
      mobile: '9828441188',
      email: 'kavita.mishra@digitaludyogseva.com'
    },
    {
      id: 16,
      emp_code: 'EMP-016',
      name: 'Gaurav Agarwal',
      avatar: 'GA',
      department: 'IT & Operations',
      designation: 'System Support Specialist',
      role: 'Executive',
      salary: '₹36,000',
      basic_salary: 36000,
      status: 'Active',
      presentToday: true,
      checkInTime: '09:25 AM',
      branch: 'Head Office Jaipur',
      reporting_manager: 'Manish Saini',
      joining_date: '2024-10-15',
      mobile: '9414667788',
      email: 'gaurav.a@digitaludyogseva.com'
    }
  ]);

  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [desigFilter, setDesigFilter] = useState('All');
  const [branchFilter, setBranchFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [managerFilter, setManagerFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4; // Exactly matching Image 2 ("Showing 1-4 of 16 employees")

  // Load from API if available
  useEffect(() => {
    fetch(getApiUrl('api/v1/employees.php?action=list'))
      .then(res => res.json())
      .then(data => {
        if (data.success && data.employees && data.employees.length > 0) {
          setEmployeeList(data.employees.map(e => ({
            ...e,
            salary: e.salary || ('₹' + Number(e.basic_salary).toLocaleString('en-IN'))
          })));
          if (data.stats) {
            setStats({
              totalEmployees: data.stats.total_employees,
              presentToday: data.stats.present_today,
              onLeave: data.stats.on_leave,
              departments: data.stats.departments,
              monthlyPayroll: data.stats.monthly_payroll_formatted || '₹6.80L'
            });
          }
        }
      })
      .catch(() => {});
  }, []);

  // Filter Logic
  const filteredEmployees = employeeList.filter(emp => {
    const term = searchTerm.toLowerCase();
    const nameMatch = emp.name.toLowerCase().includes(term) || emp.emp_code.toLowerCase().includes(term);
    const deptMatch = deptFilter === 'All' || emp.department === deptFilter;
    const desigMatch = desigFilter === 'All' || emp.designation.includes(desigFilter);
    const branchMatch = branchFilter === 'All' || emp.branch === branchFilter;
    const statusMatch = statusFilter === 'All' || emp.status === statusFilter;
    const managerMatch = managerFilter === 'All' || emp.reporting_manager === managerFilter;
    return nameMatch && deptMatch && desigMatch && branchMatch && statusMatch && managerMatch;
  });

  const totalPages = Math.ceil(filteredEmployees.length / pageSize) || 1;
  const paginatedEmployees = filteredEmployees.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // -------------------------------------------------------------
  // VIEW: 5-STEP ADD EMPLOYEE WIZARD (Matching Image 3)
  // -------------------------------------------------------------
  if (isCreateEmployee) {
    return (
      <AddEmployeeWizard 
        onCancel={() => navigate('/admin/employees')}
        onComplete={(newEmp) => {
          setEmployeeList([newEmp, ...employeeList]);
          setStats(prev => ({ ...prev, totalEmployees: prev.totalEmployees + 1 }));
          showToast(`Employee ${newEmp.name} (${newEmp.emp_code}) enrolled successfully`, 'success');
          navigate('/admin/employees');
        }}
      />
    );
  }

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
      {/* Top Header matching Image 2 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: '800', color: '#002970', margin: '0 0 4px 0' }}>
            Employee Management
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#64748B', margin: 0 }}>
            Manage your workforce, departments and access permissions
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            type="button"
            onClick={() => {
              showToast('Exporting employee register to Excel format...', 'success');
            }}
            style={{
              padding: '10px 20px',
              background: '#FFFFFF',
              color: '#002970',
              border: '1px solid #CBD5E1',
              borderRadius: '8px',
              fontWeight: '700',
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Download size={16} color="#002970" />
            <span>Export</span>
          </button>
          <button 
            type="button"
            onClick={() => navigate('/admin/employees/create')}
            style={{
              padding: '10px 22px',
              background: '#00BAF2',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '700',
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(0,186,242,0.25)'
            }}
          >
            <Plus size={16} />
            <span>+ Add Employee</span>
          </button>
        </div>
      </div>

      {/* 5 KPI Cards in Top Row (Matching Image 2) */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(5, 1fr)', 
        gap: '16px', 
        marginBottom: '24px' 
      }}>
        <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: '18px 20px', border: '1px solid #E2E8F0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: '600', color: '#64748B', marginBottom: '6px' }}>Total Employees</div>
          <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#002970' }}>{stats.totalEmployees}</div>
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: '18px 20px', border: '1px solid #E2E8F0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: '600', color: '#64748B', marginBottom: '6px' }}>Present Today</div>
          <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#16A34A' }}>{stats.presentToday}</div>
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: '18px 20px', border: '1px solid #E2E8F0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: '600', color: '#64748B', marginBottom: '6px' }}>On Leave</div>
          <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#002970' }}>0{stats.onLeave}</div>
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: '18px 20px', border: '1px solid #E2E8F0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: '600', color: '#64748B', marginBottom: '6px' }}>Departments</div>
          <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#002970' }}>0{stats.departments}</div>
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: '18px 20px', border: '1px solid #E2E8F0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: '600', color: '#64748B', marginBottom: '6px' }}>Monthly Payroll</div>
          <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#002970' }}>{stats.monthlyPayroll}</div>
        </div>
      </div>

      {/* 7 Sub-tabs matching Image 2 */}
      <div style={{ 
        display: 'flex', 
        gap: '6px', 
        background: '#F8FAFC', 
        padding: '6px', 
        borderRadius: '10px', 
        border: '1px solid #E2E8F0',
        marginBottom: '20px'
      }}>
        {[
          { id: 'employees', label: 'Employees' },
          { id: 'departments', label: 'Departments' },
          { id: 'designations', label: 'Designations' },
          { id: 'roles', label: 'Roles & Access' },
          { id: 'attendance', label: 'Attendance' },
          { id: 'leave', label: 'Leave' },
          { id: 'payroll', label: 'Payroll' }
        ].map(tab => {
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveSubTab(tab.id);
                if (tab.id === 'attendance') navigate('/admin/attendance');
                else if (tab.id === 'leave') navigate('/admin/leaves');
                else if (tab.id === 'payroll') navigate('/admin/payroll');
                else navigate('/admin/employees');
              }}
              style={{
                flex: 1,
                padding: '9px 12px',
                borderRadius: '8px',
                border: 'none',
                background: isActive ? '#00BAF2' : 'transparent',
                color: isActive ? '#FFFFFF' : '#475569',
                fontWeight: isActive ? '700' : '600',
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Filter Bar matching Image 2 */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '12px',
        padding: '16px',
        border: '1px solid #E2E8F0',
        marginBottom: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '11px' }} />
            <input 
              type="text"
              placeholder="Search employee..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px 9px 36px',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                fontSize: '0.88rem'
              }}
            />
          </div>

          <div>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.88rem', color: '#1E293B' }}
            >
              <option value="All">Department ▾</option>
              <option value="Accounts & Audit">Accounts & Audit</option>
              <option value="Sales">Sales & Business Dev</option>
              <option value="Loan Processing">Loan Processing</option>
              <option value="Taxation">Taxation & MCA</option>
              <option value="Project Reports / DPR">Project Reports / DPR</option>
              <option value="Documentation & KYC">Documentation & KYC</option>
              <option value="IT & Operations">IT & Operations</option>
            </select>
          </div>

          <div>
            <select
              value={desigFilter}
              onChange={(e) => setDesigFilter(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.88rem', color: '#1E293B' }}
            >
              <option value="All">Designation ▾</option>
              <option value="Senior CA">Senior CA & Compliance Lead</option>
              <option value="Sales Lead">Corporate Sales Lead</option>
              <option value="Underwriting">Loan Underwriting Specialist</option>
              <option value="Consultant">Tax Advisory Consultant</option>
              <option value="Analyst">Financial Model Analyst</option>
              <option value="Coordinator">Submission Coordinator</option>
            </select>
          </div>

          <div>
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.88rem', color: '#1E293B' }}
            >
              <option value="All">Branch ▾</option>
              <option value="Head Office Jaipur">Head Office Jaipur</option>
              <option value="Delhi Regional Office">Delhi Regional Office</option>
              <option value="Mumbai Liaison Desk">Mumbai Liaison Desk</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', alignItems: 'center' }}>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.88rem', color: '#1E293B' }}
            >
              <option value="All">Status ▾</option>
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div>
            <select
              value={managerFilter}
              onChange={(e) => setManagerFilter(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.88rem', color: '#1E293B' }}
            >
              <option value="All">Reporting Manager ▾</option>
              <option value="Managing Director">Managing Director</option>
              <option value="Rajesh Verma">CA Rajesh Verma</option>
              <option value="Neha Sharma">Neha Sharma</option>
              <option value="Anil Tyagi">Anil Tyagi</option>
            </select>
          </div>

          <div>
            <input 
              type="text" 
              placeholder="Joining Date ▾"
              onFocus={(e) => e.target.type = 'date'}
              onBlur={(e) => e.target.type = 'text'}
              style={{ width: '100%', padding: '9px 12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.88rem' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => showToast('Filters refreshed', 'info')}
              style={{
                flex: 1,
                padding: '9px',
                background: '#F1F5F9',
                color: '#002970',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              Advanced Filters
            </button>
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setDeptFilter('All');
                setDesigFilter('All');
                setBranchFilter('All');
                setStatusFilter('All');
                setManagerFilter('All');
              }}
              style={{
                padding: '9px 14px',
                background: 'transparent',
                color: '#64748B',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Main Table matching Image 2 */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #E2E8F0',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                <th style={{ padding: '14px 18px', fontSize: '0.82rem', fontWeight: '700', color: '#475569', textTransform: 'uppercase' }}>Employee</th>
                <th style={{ padding: '14px 18px', fontSize: '0.82rem', fontWeight: '700', color: '#475569', textTransform: 'uppercase' }}>Department</th>
                <th style={{ padding: '14px 18px', fontSize: '0.82rem', fontWeight: '700', color: '#475569', textTransform: 'uppercase' }}>Role</th>
                <th style={{ padding: '14px 18px', fontSize: '0.82rem', fontWeight: '700', color: '#475569', textTransform: 'uppercase' }}>Salary</th>
                <th style={{ padding: '14px 18px', fontSize: '0.82rem', fontWeight: '700', color: '#475569', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '14px 18px', fontSize: '0.82rem', fontWeight: '700', color: '#475569', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedEmployees.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>
                    No matching employees found for the applied filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedEmployees.map(emp => (
                  <tr key={emp.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    {/* Employee Avatar + Name + EMP Code */}
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '50%',
                          background: '#E2E8F0',
                          color: '#002970',
                          fontWeight: '800',
                          fontSize: '0.85rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          letterSpacing: '0.5px'
                        }}>
                          {emp.avatar}
                        </div>
                        <div>
                          <div style={{ fontWeight: '700', color: '#002970', fontSize: '0.92rem' }}>
                            {emp.name}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#64748B', fontFamily: 'monospace' }}>
                            {emp.emp_code}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Department */}
                    <td style={{ padding: '14px 18px', color: '#334155', fontSize: '0.9rem', fontWeight: '500' }}>
                      {emp.department}
                    </td>

                    {/* Role */}
                    <td style={{ padding: '14px 18px', color: '#475569', fontSize: '0.9rem' }}>
                      {emp.role}
                    </td>

                    {/* Salary */}
                    <td style={{ padding: '14px 18px', color: '#002970', fontSize: '0.9rem', fontWeight: '700' }}>
                      {emp.salary}
                    </td>

                    {/* Status Badge */}
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '0.78rem',
                        fontWeight: '700',
                        background: '#DCFCE7',
                        color: '#16A34A'
                      }}>
                        {emp.status}
                      </span>
                    </td>

                    {/* Actions: View, Edit, ... Popover */}
                    <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', position: 'relative' }}>
                        <button
                          type="button"
                          onClick={() => setSelectedEmployeeForView(emp)}
                          style={{
                            padding: '6px 14px',
                            background: '#F1F5F9',
                            color: '#002970',
                            border: '1px solid #CBD5E1',
                            borderRadius: '6px',
                            fontWeight: '600',
                            fontSize: '0.82rem',
                            cursor: 'pointer'
                          }}
                        >
                          View
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            showToast(`Editing profile for ${emp.name}`, 'info');
                          }}
                          style={{
                            padding: '6px 14px',
                            background: '#FFFFFF',
                            color: '#475569',
                            border: '1px solid #CBD5E1',
                            borderRadius: '6px',
                            fontWeight: '600',
                            fontSize: '0.82rem',
                            cursor: 'pointer'
                          }}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => setActiveActionMenuId(activeActionMenuId === emp.id ? null : emp.id)}
                          style={{
                            padding: '6px 10px',
                            background: '#F8FAFC',
                            color: '#64748B',
                            border: '1px solid #CBD5E1',
                            borderRadius: '6px',
                            cursor: 'pointer'
                          }}
                        >
                          <MoreVertical size={16} />
                        </button>

                        {/* Dropdown Popover */}
                        {activeActionMenuId === emp.id && (
                          <div style={{
                            position: 'absolute',
                            right: 0,
                            top: '38px',
                            width: '210px',
                            background: '#FFFFFF',
                            borderRadius: '10px',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
                            border: '1px solid #E2E8F0',
                            zIndex: 50,
                            padding: '6px 0',
                            textAlign: 'left'
                          }}>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveActionMenuId(null);
                                setSelectedEmployeeForView(emp);
                              }}
                              style={{ width: '100%', padding: '8px 14px', background: 'none', border: 'none', textAlign: 'left', fontSize: '0.84rem', color: '#1E293B', cursor: 'pointer' }}
                            >
                              Employee 360° Profile
                            </button>
                            <a
                              href={getApiUrl(`api/v1/generate_pdf.php?type=payslip&id=${emp.emp_code}&mode=inline`)}
                              target="_blank"
                              rel="noreferrer"
                              onClick={() => setActiveActionMenuId(null)}
                              style={{ display: 'block', width: '100%', padding: '8px 14px', background: 'none', border: 'none', textAlign: 'left', fontSize: '0.84rem', color: '#008BCB', fontWeight: '700', textDecoration: 'none' }}
                            >
                              Generate Official Payslip PDF
                            </a>
                            <a
                              href={getApiUrl(`api/v1/generate_pdf.php?type=payslip&id=${emp.emp_code}&mode=download`)}
                              download={`Payslip_${emp.emp_code}.pdf`}
                              onClick={() => setActiveActionMenuId(null)}
                              style={{ display: 'block', width: '100%', padding: '8px 14px', background: 'none', border: 'none', textAlign: 'left', fontSize: '0.84rem', color: '#1E293B', textDecoration: 'none' }}
                            >
                              Download Payslip PDF
                            </a>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveActionMenuId(null);
                                showToast(`Punching Geo-Attendance for ${emp.name}`, 'success');
                              }}
                              style={{ width: '100%', padding: '8px 14px', background: 'none', border: 'none', textAlign: 'left', fontSize: '0.84rem', color: '#1E293B', cursor: 'pointer' }}
                            >
                              Log Daily Attendance
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination matching Image 2 */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 20px',
          borderTop: '1px solid #E2E8F0',
          background: '#FFFFFF'
        }}>
          <div style={{ fontSize: '0.88rem', color: '#64748B' }}>
            Showing {filteredEmployees.length === 0 ? '0' : `1-${Math.min(pageSize, filteredEmployees.length)}`} of {filteredEmployees.length} employees
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              style={{
                padding: '6px 12px',
                border: '1px solid #CBD5E1',
                borderRadius: '6px',
                background: currentPage === 1 ? '#F8FAFC' : '#FFFFFF',
                color: currentPage === 1 ? '#94A3B8' : '#002970',
                fontSize: '0.84rem',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
              }}
            >
              Previous
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                type="button"
                onClick={() => setCurrentPage(i + 1)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: currentPage === (i + 1) ? 'none' : '1px solid #CBD5E1',
                  background: currentPage === (i + 1) ? '#00BAF2' : '#FFFFFF',
                  color: currentPage === (i + 1) ? '#FFFFFF' : '#475569',
                  fontWeight: currentPage === (i + 1) ? '700' : '500',
                  fontSize: '0.84rem',
                  cursor: 'pointer'
                }}
              >
                {i + 1}
              </button>
            ))}

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              style={{
                padding: '6px 12px',
                border: '1px solid #CBD5E1',
                borderRadius: '6px',
                background: currentPage === totalPages ? '#F8FAFC' : '#FFFFFF',
                color: currentPage === totalPages ? '#94A3B8' : '#002970',
                fontSize: '0.84rem',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Employee 360° Profile Modal */}
      {selectedEmployeeForView && (
        <Employee360Modal 
          employee={selectedEmployeeForView} 
          onClose={() => setSelectedEmployeeForView(null)} 
        />
      )}
    </div>
  );
};

// -----------------------------------------------------------------
// COMPONENT: ADD EMPLOYEE 5-STEP ONBOARDING WIZARD (Matching Image 3)
// -----------------------------------------------------------------
const AddEmployeeWizard = ({ onCancel, onComplete }) => {
  const { showToast } = useApp();
  const [step, setStep] = useState(1);

  // Form State across all 5 steps
  const [formData, setFormData] = useState({
    // Step 1: Personal Information
    fullName: '',
    mobileNumber: '',
    emailAddress: '',
    dob: '',
    gender: 'Male',
    emergencyContact: '',
    permanentAddress: '',
    currentAddress: '',

    // Step 2: Employment Information
    empCode: 'EMP-017',
    joiningDate: new Date().toISOString().split('T')[0],
    department: 'Loan Processing',
    designation: 'Loan Underwriting Specialist',
    branch: 'Head Office Jaipur',
    reportingManager: 'Rajesh Verma',
    employmentType: 'Full-time Regular',
    workShift: 'General Shift (09:30 AM - 06:30 PM)',
    status: 'Active',

    // Step 3: Documents
    aadhaarNumber: '',
    panNumber: '',
    aadhaarFile: null,
    panFile: null,
    photoFile: null,
    qualificationCert: null,
    bankChequeFile: null,

    // Step 4: Salary & Bank Info
    basicSalary: 45000,
    hra: 18000,
    allowances: 7000,
    pfDeduction: 1800,
    ptDeduction: 200,
    tdsDeduction: 1500,
    bankName: 'HDFC Bank Ltd.',
    accountNumber: '',
    ifscCode: 'HDFC0001234',

    // Step 5: System Access & Login
    officialEmail: '',
    loginRole: 'Loan Underwriter',
    systemAccessEnabled: true,
    permissions: {
      leads: true,
      schemes: true,
      customers: true,
      projects: true,
      documents: true,
      billing: false,
      payroll: false,
      settings: false
    }
  });

  const grossSalary = Number(formData.basicSalary || 0) + Number(formData.hra || 0) + Number(formData.allowances || 0);
  const totalDeductions = Number(formData.pfDeduction || 0) + Number(formData.ptDeduction || 0) + Number(formData.tdsDeduction || 0);
  const netSalary = grossSalary - totalDeductions;

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.fullName.trim() || !formData.mobileNumber.trim()) {
        showToast('Please provide employee full name and mobile number', 'error');
        return;
      }
    }
    setStep(prev => Math.min(5, prev + 1));
  };

  const handleBack = () => {
    setStep(prev => Math.max(1, prev - 1));
  };

  const handleSubmit = () => {
    const parts = formData.fullName.trim().split(' ');
    const avatar = (parts[0]?.[0] || 'E') + (parts[1]?.[0] || 'M');

    const newEmp = {
      id: Date.now(),
      emp_code: formData.empCode,
      name: formData.fullName,
      avatar: avatar.toUpperCase(),
      department: formData.department,
      designation: formData.designation,
      role: formData.loginRole,
      salary: '₹' + Number(formData.basicSalary).toLocaleString('en-IN'),
      basic_salary: formData.basicSalary,
      status: 'Active',
      presentToday: false,
      checkInTime: 'Not Punched Today',
      branch: formData.branch,
      reporting_manager: formData.reportingManager,
      joining_date: formData.joiningDate,
      mobile: formData.mobileNumber,
      email: formData.officialEmail || formData.emailAddress
    };

    // Save to API
    fetch(getApiUrl('api/v1/employees.php?action=create'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEmp)
    }).catch(() => {});

    onComplete(newEmp);
  };

  return (
    <div style={{ maxWidth: '980px', margin: '0 auto' }}>
      <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
        
        {/* Wizard Header matching Image 3 */}
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '1.45rem', fontWeight: '800', color: '#002970', margin: '0 0 4px 0' }}>
            Add New Employee
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#64748B', margin: 0 }}>
            प्रस्तावित Employee Registration Form
          </p>
        </div>

        {/* 5-Step Process Bar matching Image 3 */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          position: 'relative',
          marginBottom: '36px',
          padding: '0 20px'
        }}>
          {/* Connector Line */}
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '60px',
            right: '60px',
            height: '2px',
            background: '#E2E8F0',
            zIndex: 1
          }}>
            <div style={{
              height: '100%',
              background: '#00BAF2',
              width: `${((step - 1) / 4) * 100}%`,
              transition: 'width 0.3s ease'
            }} />
          </div>

          {[
            { num: 1, label: 'Personal' },
            { num: 2, label: 'Employment' },
            { num: 3, label: 'Documents' },
            { num: 4, label: 'Salary' },
            { num: 5, label: 'Access' }
          ].map(s => {
            const isCompleted = step > s.num;
            const isCurrent = step === s.num;
            return (
              <div key={s.num} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: isCurrent ? '#00BAF2' : isCompleted ? '#002970' : '#FFFFFF',
                  color: (isCurrent || isCompleted) ? '#FFFFFF' : '#94A3B8',
                  border: isCompleted || isCurrent ? 'none' : '2px solid #CBD5E1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '0.95rem',
                  boxShadow: isCurrent ? '0 0 0 4px rgba(0,186,242,0.2)' : 'none'
                }}>
                  {isCompleted ? '✓' : s.num}
                </div>
                <div style={{
                  fontSize: '0.85rem',
                  fontWeight: isCurrent ? '700' : '500',
                  color: isCurrent ? '#002970' : '#64748B',
                  marginTop: '8px'
                }}>
                  {s.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* STEP 1: PERSONAL INFORMATION (Matching Image 3) */}
        {step === 1 && (
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#002970', marginBottom: '20px' }}>
              Personal Information
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter Full Name"
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                  Mobile Number *
                </label>
                <input
                  type="text"
                  placeholder="Enter Mobile Number"
                  value={formData.mobileNumber}
                  onChange={(e) => handleChange('mobileNumber', e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.9rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter Email Address"
                  value={formData.emailAddress}
                  onChange={(e) => handleChange('emailAddress', e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => handleChange('dob', e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.9rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleChange('gender', e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.9rem' }}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                  Emergency Contact
                </label>
                <input
                  type="text"
                  placeholder="Enter Emergency Contact"
                  value={formData.emergencyContact}
                  onChange={(e) => handleChange('emergencyContact', e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.9rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                  Permanent Address
                </label>
                <input
                  type="text"
                  placeholder="Enter Permanent Address"
                  value={formData.permanentAddress}
                  onChange={(e) => handleChange('permanentAddress', e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                  Current Address
                </label>
                <input
                  type="text"
                  placeholder="Enter Current Address"
                  value={formData.currentAddress}
                  onChange={(e) => handleChange('currentAddress', e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.9rem' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: EMPLOYMENT INFORMATION */}
        {step === 2 && (
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#002970', marginBottom: '20px' }}>
              Employment Information
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                  Employee ID Code (Auto-generated)
                </label>
                <input
                  type="text"
                  value={formData.empCode}
                  readOnly
                  style={{ width: '100%', padding: '11px 14px', border: '1px solid #E2E8F0', background: '#F8FAFC', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '700', color: '#002970' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                  Date of Joining
                </label>
                <input
                  type="date"
                  value={formData.joiningDate}
                  onChange={(e) => handleChange('joiningDate', e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.9rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                  Department
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => handleChange('department', e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.9rem' }}
                >
                  <option value="Loan Processing">Loan Processing &amp; Underwriting</option>
                  <option value="Sales">Sales &amp; Business Development</option>
                  <option value="Accounts & Audit">Corporate Accounts &amp; Audit</option>
                  <option value="Taxation">Taxation &amp; MCA Filings</option>
                  <option value="Project Reports / DPR">Detailed Project Reports (DPR)</option>
                  <option value="Documentation & KYC">Documentation &amp; KYC Verification</option>
                  <option value="IT & Operations">IT &amp; Platform Operations</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                  Designation
                </label>
                <input
                  type="text"
                  placeholder="e.g. Loan Underwriting Specialist"
                  value={formData.designation}
                  onChange={(e) => handleChange('designation', e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.9rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                  Work Branch Location
                </label>
                <select
                  value={formData.branch}
                  onChange={(e) => handleChange('branch', e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.9rem' }}
                >
                  <option value="Head Office Jaipur">Head Office Jaipur</option>
                  <option value="Delhi Regional Office">Delhi Regional Office</option>
                  <option value="Mumbai Liaison Desk">Mumbai Liaison Desk</option>
                  <option value="Remote / Work From Home">Remote / Hybrid</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                  Reporting Manager
                </label>
                <select
                  value={formData.reportingManager}
                  onChange={(e) => handleChange('reportingManager', e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.9rem' }}
                >
                  <option value="Managing Director">Managing Director</option>
                  <option value="Rajesh Verma">CA Rajesh Verma (Accounts &amp; Compliance)</option>
                  <option value="Neha Sharma">Neha Sharma (Sales Lead)</option>
                  <option value="Anil Tyagi">Anil Tyagi (Loan Processing)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: EMPLOYEE DOCUMENTS */}
        {step === 3 && (
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#002970', marginBottom: '20px' }}>
              Employee Identity &amp; Educational Documents
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div style={{ border: '1px dashed #CBD5E1', borderRadius: '10px', padding: '18px', background: '#F8FAFC' }}>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: '700', color: '#002970', marginBottom: '4px' }}>
                  Aadhaar Card (National ID)
                </label>
                <input
                  type="text"
                  placeholder="Enter 12-digit Aadhaar Number"
                  value={formData.aadhaarNumber}
                  onChange={(e) => handleChange('aadhaarNumber', e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '10px' }}
                />
                <input type="file" style={{ fontSize: '0.82rem', color: '#64748B' }} />
              </div>

              <div style={{ border: '1px dashed #CBD5E1', borderRadius: '10px', padding: '18px', background: '#F8FAFC' }}>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: '700', color: '#002970', marginBottom: '4px' }}>
                  Permanent Account Number (PAN)
                </label>
                <input
                  type="text"
                  placeholder="Enter 10-character PAN"
                  value={formData.panNumber}
                  onChange={(e) => handleChange('panNumber', e.target.value.toUpperCase())}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '10px' }}
                />
                <input type="file" style={{ fontSize: '0.82rem', color: '#64748B' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div style={{ border: '1px dashed #CBD5E1', borderRadius: '10px', padding: '18px', background: '#F8FAFC' }}>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: '700', color: '#002970', marginBottom: '6px' }}>
                  Passport Size Photograph
                </label>
                <input type="file" accept="image/*" style={{ fontSize: '0.82rem', color: '#64748B' }} />
              </div>

              <div style={{ border: '1px dashed #CBD5E1', borderRadius: '10px', padding: '18px', background: '#F8FAFC' }}>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: '700', color: '#002970', marginBottom: '6px' }}>
                  Bank Cancelled Cheque / Passbook
                </label>
                <input type="file" style={{ fontSize: '0.82rem', color: '#64748B' }} />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: SALARY AND BANK INFORMATION */}
        {step === 4 && (
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#002970', marginBottom: '20px' }}>
              Salary Structure &amp; Banking Details
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                  Basic Monthly Pay (₹) *
                </label>
                <input
                  type="number"
                  value={formData.basicSalary}
                  onChange={(e) => handleChange('basicSalary', e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                  House Rent Allowance (HRA)
                </label>
                <input
                  type="number"
                  value={formData.hra}
                  onChange={(e) => handleChange('hra', e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                  Special Allowances
                </label>
                <input
                  type="number"
                  value={formData.allowances}
                  onChange={(e) => handleChange('allowances', e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.9rem' }}
                />
              </div>
            </div>

            {/* Calculations Card */}
            <div style={{ background: '#F1F5F9', borderRadius: '10px', padding: '16px 20px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.82rem', color: '#64748B' }}>Gross Monthly Salary</div>
                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#002970' }}>₹{grossSalary.toLocaleString('en-IN')}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.82rem', color: '#64748B' }}>Total Deductions (PF/PT/TDS)</div>
                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#DC2626' }}>- ₹{totalDeductions.toLocaleString('en-IN')}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.82rem', color: '#64748B' }}>Net Take-Home Salary</div>
                <div style={{ fontSize: '1.35rem', fontWeight: '800', color: '#16A34A' }}>₹{netSalary.toLocaleString('en-IN')}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                  Bank Name
                </label>
                <input
                  type="text"
                  value={formData.bankName}
                  onChange={(e) => handleChange('bankName', e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                  Bank Account Number
                </label>
                <input
                  type="text"
                  placeholder="Enter Account Number"
                  value={formData.accountNumber}
                  onChange={(e) => handleChange('accountNumber', e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                  Bank IFSC Code
                </label>
                <input
                  type="text"
                  value={formData.ifscCode}
                  onChange={(e) => handleChange('ifscCode', e.target.value.toUpperCase())}
                  style={{ width: '100%', padding: '11px 14px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.9rem' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: LOGIN & SECURITY ACCESS */}
        {step === 5 && (
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#002970', marginBottom: '20px' }}>
              Login Credentials &amp; Role-based Permissions
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                  Official Work Email ID
                </label>
                <input
                  type="email"
                  placeholder="name@digitaludyogseva.com"
                  value={formData.officialEmail}
                  onChange={(e) => handleChange('officialEmail', e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                  Assigned ERP Security Role
                </label>
                <select
                  value={formData.loginRole}
                  onChange={(e) => handleChange('loginRole', e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.9rem' }}
                >
                  <option value="Manager">Senior Manager / Admin</option>
                  <option value="Team Lead">Team Lead</option>
                  <option value="Loan Underwriter">Loan Underwriter / Analyst</option>
                  <option value="Consultant">Tax &amp; Scheme Consultant</option>
                  <option value="Officer">KYC Verification Officer</option>
                  <option value="Executive">Field &amp; Tele-Executive</option>
                </select>
              </div>
            </div>

            {/* Permission Checkboxes */}
            <div style={{ background: '#F8FAFC', borderRadius: '12px', padding: '20px', border: '1px solid #E2E8F0', marginBottom: '24px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#002970', margin: '0 0 14px 0' }}>
                Module Access Permissions
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
                {[
                  { key: 'leads', label: 'Lead Management' },
                  { key: 'schemes', label: 'Government Schemes' },
                  { key: 'customers', label: 'Customer 360°' },
                  { key: 'projects', label: 'Projects & Loans' },
                  { key: 'documents', label: 'Document Vault' },
                  { key: 'billing', label: 'Billing & Invoices' },
                  { key: 'payroll', label: 'Staff & Payroll' },
                  { key: 'settings', label: 'System Settings' }
                ].map(p => (
                  <label key={p.key} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: '#334155', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={formData.permissions[p.key]}
                      onChange={(e) => {
                        const newPerms = { ...formData.permissions, [p.key]: e.target.checked };
                        handleChange('permissions', newPerms);
                      }}
                    />
                    <span>{p.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Wizard Footer Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E2E8F0', paddingTop: '20px', marginTop: '20px' }}>
          <button
            type="button"
            onClick={step === 1 ? onCancel : handleBack}
            style={{
              padding: '10px 22px',
              background: '#FFFFFF',
              color: '#475569',
              border: '1px solid #CBD5E1',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            {step === 1 ? 'Cancel' : '← Back'}
          </button>

          {step < 5 ? (
            <button
              type="button"
              onClick={handleNext}
              style={{
                padding: '10px 24px',
                background: '#00BAF2',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              Continue to Step {step + 1} →
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              style={{
                padding: '11px 28px',
                background: '#16A34A',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '800',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(22,163,74,0.3)'
              }}
            >
              ✓ Complete &amp; Enroll Employee
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// -----------------------------------------------------------------
// COMPONENT: EMPLOYEE 360° PROFILE MODAL
// -----------------------------------------------------------------
const Employee360Modal = ({ employee, onClose }) => {
  const [profileTab, setProfileTab] = useState('overview');

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.65)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        maxWidth: '850px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
      }}>
        {/* Header */}
        <div style={{ background: '#002970', padding: '24px 28px', color: '#FFFFFF', borderRadius: '16px 16px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#00BAF2', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: '800' }}>
              {employee.avatar}
            </div>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: '800', margin: '0 0 4px 0' }}>{employee.name}</h2>
              <div style={{ fontSize: '0.86rem', color: '#93C5FD' }}>
                {employee.emp_code} • {employee.designation} • {employee.department}
              </div>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#FFFFFF', fontSize: '1.5rem', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>

        {/* Modal Sub-Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #E2E8F0', padding: '0 28px', background: '#F8FAFC' }}>
          {['overview', 'employment', 'payroll', 'documents'].map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setProfileTab(t)}
              style={{
                padding: '12px 18px',
                border: 'none',
                background: 'none',
                borderBottom: profileTab === t ? '3px solid #00BAF2' : '3px solid transparent',
                color: profileTab === t ? '#002970' : '#64748B',
                fontWeight: profileTab === t ? '700' : '500',
                fontSize: '0.88rem',
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {t}
            </button>
          ))}
        </div>

        <div style={{ padding: '28px' }}>
          {profileTab === 'overview' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ background: '#F8FAFC', padding: '18px', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Branch &amp; Location</div>
                <div style={{ fontWeight: '700', color: '#002970', marginTop: '4px' }}>{employee.branch || 'Head Office Jaipur'}</div>
              </div>

              <div style={{ background: '#F8FAFC', padding: '18px', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Reporting Manager</div>
                <div style={{ fontWeight: '700', color: '#002970', marginTop: '4px' }}>{employee.reporting_manager || 'Managing Director'}</div>
              </div>

              <div style={{ background: '#F8FAFC', padding: '18px', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Official Mobile</div>
                <div style={{ fontWeight: '700', color: '#002970', marginTop: '4px' }}>{employee.mobile}</div>
              </div>

              <div style={{ background: '#F8FAFC', padding: '18px', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Official Work Email</div>
                <div style={{ fontWeight: '700', color: '#002970', marginTop: '4px' }}>{employee.email}</div>
              </div>
            </div>
          )}

          {profileTab === 'payroll' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#002970', margin: 0 }}>
                  Monthly Salary &amp; Payslip History
                </h3>
                <a
                  href={getApiUrl(`api/v1/generate_pdf.php?type=payslip&id=${employee.emp_code}&mode=download`)}
                  download={`Payslip_${employee.emp_code}.pdf`}
                  style={{
                    padding: '8px 16px',
                    background: '#00BAF2',
                    color: '#FFFFFF',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Download size={14} />
                  <span>Download Payslip PDF</span>
                </a>
              </div>

              <div style={{ background: '#F8FAFC', borderRadius: '10px', padding: '18px', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ color: '#64748B' }}>Basic Salary</span>
                  <span style={{ fontWeight: '700', color: '#002970' }}>{employee.salary}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ color: '#64748B' }}>Provident Fund (PF)</span>
                  <span style={{ color: '#DC2626' }}>- ₹1,800</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ color: '#64748B' }}>Professional Tax (PT)</span>
                  <span style={{ color: '#DC2626' }}>- ₹200</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #CBD5E1', paddingTop: '10px', marginTop: '10px' }}>
                  <span style={{ fontWeight: '700', color: '#002970' }}>Net Payable Take-Home</span>
                  <span style={{ fontWeight: '800', color: '#16A34A', fontSize: '1.1rem' }}>
                    ₹{(Number(employee.basic_salary || 50000) - 2000).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          )}

          {profileTab === 'employment' && (
            <div style={{ fontSize: '0.9rem', color: '#334155', lineHeight: '1.8' }}>
              <div><strong>Date of Joining:</strong> {employee.joining_date}</div>
              <div><strong>Employment Status:</strong> {employee.status} (Verified)</div>
              <div><strong>Assigned System Role:</strong> {employee.role}</div>
              <div><strong>Work Timing:</strong> 09:30 AM - 06:30 PM (IST)</div>
            </div>
          )}

          {profileTab === 'documents' && (
            <div style={{ fontSize: '0.88rem', color: '#475569' }}>
              <div style={{ padding: '12px', background: '#F1F5F9', borderRadius: '8px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                <span>Aadhaar Verification Card</span>
                <span style={{ color: '#16A34A', fontWeight: '700' }}>Verified</span>
              </div>
              <div style={{ padding: '12px', background: '#F1F5F9', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
                <span>PAN Card Copy</span>
                <span style={{ color: '#16A34A', fontWeight: '700' }}>Verified</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
