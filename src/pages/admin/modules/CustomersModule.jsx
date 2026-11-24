import React, { useState, useEffect } from 'react';
import { useRouter } from '../../../router/Router';
import { useApp } from '../../../context/AppContext';
import { 
  UserCheck, 
  Search, 
  Filter, 
  Phone, 
  Mail, 
  Building2, 
  ChevronRight, 
  FileText, 
  CreditCard, 
  Briefcase, 
  ShieldCheck, 
  ArrowLeft,
  Download,
  Plus
} from 'lucide-react';

export const CustomersModule = () => {
  const { currentPath, navigate, matchPath } = useRouter();
  const { showToast, customers: contextCustomers = [] } = useApp();

  const isCreateRoute = currentPath === '/admin/customers/create';
  const editMatch = matchPath('/admin/customers/:id/edit');
  const detailMatch = !isCreateRoute && !editMatch ? matchPath('/admin/customers/:id') : null;
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Customer List derived from database & context
  const [customerList, setCustomerList] = useState([]);

  useEffect(() => {
    // If context customers exist, use them as baseline
    if (contextCustomers && contextCustomers.length > 0) {
      setCustomerList(contextCustomers);
    } else {
      // Mock / fallback verified list of customers
      setCustomerList([
        {
          id: 1,
          customer_code: 'CUST-2026-001',
          name: 'Amit Enterprises',
          contact_person: 'Amit Sharma',
          mobile: '9829012345',
          email: 'amit@amitenterprises.in',
          city: 'Jaipur',
          state: 'Rajasthan',
          gstin: '08AABCA1234A1Z5',
          kyc_status: 'Verified',
          active_projects: 2,
          total_billed: 45000,
          assigned_rm: 'CA Rajesh Verma'
        },
        {
          id: 2,
          customer_code: 'CUST-2026-002',
          name: 'Sharma Industries',
          contact_person: 'Virendra Sharma',
          mobile: '9414056789',
          email: 'sharma.ind@gmail.com',
          city: 'Jodhpur',
          state: 'Rajasthan',
          gstin: '08BBCCS5678B2Z1',
          kyc_status: 'Verified',
          active_projects: 1,
          total_billed: 28000,
          assigned_rm: 'Anil Tyagi'
        },
        {
          id: 3,
          customer_code: 'CUST-2026-003',
          name: 'ABC Manufacturing Pvt Ltd',
          contact_person: 'Bhupendra Patel',
          mobile: '9928345678',
          email: 'patel@abcmfg.com',
          city: 'Ahmedabad',
          state: 'Gujarat',
          gstin: '24AACCA9876C1Z9',
          kyc_status: 'Under Review',
          active_projects: 1,
          total_billed: 35000,
          assigned_rm: 'Neha Sharma'
        }
      ]);
    }
  }, [contextCustomers]);

  const activeCustomers = customerList.length > 0 ? customerList : contextCustomers;

  // -------------------------------------------------------------
  // VIEW: CREATE CUSTOMER (/admin/customers/create)
  // -------------------------------------------------------------
  if (isCreateRoute) {
    return (
      <CreateCustomerView 
        onCancel={() => navigate('/admin/customers')}
        onSave={(newCust) => {
          const item = {
            id: Date.now(),
            customer_code: `CUST-${Date.now().toString().slice(-4)}`,
            ...newCust,
            active_projects: 0,
            total_billed: 0
          };
          setCustomerList([item, ...customerList]);
          showToast(`Customer ${newCust.name} created successfully`, 'success');
          navigate('/admin/customers');
        }}
      />
    );
  }

  // -------------------------------------------------------------
  // VIEW: EDIT CUSTOMER (/admin/customers/:id/edit)
  // -------------------------------------------------------------
  if (editMatch) {
    const editId = editMatch.params.id;
    const existing = activeCustomers.find(c => String(c.id) === String(editId)) || activeCustomers[0] || {
      id: editId,
      name: '',
      contact_person: '',
      mobile: '',
      email: '',
      city: 'Jaipur',
      state: 'Rajasthan',
      gstin: '',
      kyc_status: 'Verified',
      assigned_rm: 'CA Rajesh Verma'
    };

    return (
      <EditCustomerView 
        customer={existing}
        onCancel={() => navigate(`/admin/customers/${editId}`)}
        onSave={(updated) => {
          setCustomerList(prev => prev.map(c => String(c.id) === String(editId) ? { ...c, ...updated } : c));
          showToast(`Customer ${updated.name || existing.name} updated successfully`, 'success');
          navigate(`/admin/customers/${editId}`);
        }}
      />
    );
  }

  // -------------------------------------------------------------
  // VIEW 1: CUSTOMER 360° DOSSIER (/admin/customers/:id)
  // -------------------------------------------------------------
  if (detailMatch) {
    const custId = detailMatch.params.id;
    const customer = activeCustomers.find(c => String(c.id) === String(custId)) || activeCustomers[0] || {
      id: custId,
      name: 'Amit Enterprises',
      contact_person: 'Amit Sharma',
      mobile: '9829012345',
      email: 'amit@example.com',
      city: 'Jaipur',
      state: 'Rajasthan',
      gstin: '08AABCA1234A1Z5',
      kyc_status: 'Verified',
      assigned_rm: 'CA Rajesh Verma'
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              type="button"
              onClick={() => navigate('/admin/customers')}
              className="paytm-btn paytm-btn-outline paytm-btn-sm"
            >
              <ArrowLeft size={16} />
              <span>Back to Customers</span>
            </button>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#002970', margin: 0 }}>
                {customer.name}
              </h2>
              <span style={{ fontSize: '0.85rem', color: '#64748B' }}>
                Customer Code: {customer.customer_code || `CUST-${customer.id}`} • RM: {customer.assigned_rm || 'CA Rajesh Verma'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              type="button"
              onClick={() => navigate(`/admin/customers/${customer.id}/edit`)}
              className="paytm-btn paytm-btn-outline paytm-btn-sm"
              style={{ color: '#002970', borderColor: '#CBD5E1' }}
            >
              Edit Profile
            </button>
            <button 
              type="button"
              onClick={() => navigate('/admin/projects/create')}
              className="paytm-btn paytm-btn-primary paytm-btn-sm"
            >
              <Plus size={16} />
              <span>New Project Dossier</span>
            </button>
          </div>
        </div>

        {/* 360 Dossier Header */}
        <div className="paytm-card">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', borderBottom: '1px solid #E2E8F0', paddingBottom: '20px', marginBottom: '20px' }}>
            <div>
              <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: '600' }}>PRIMARY CONTACT</div>
              <div style={{ fontSize: '1rem', fontWeight: '700', color: '#002970', marginTop: '4px' }}>
                {customer.contact_person || customer.name}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#64748B' }}>{customer.mobile}</div>
            </div>

            <div>
              <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: '600' }}>GSTIN &amp; TAX IDENTIFIER</div>
              <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#002970', marginTop: '4px' }}>
                {customer.gstin || '08AABCA1234A1Z5'}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#16A34A', fontWeight: '600' }}>Active Filing</div>
            </div>

            <div>
              <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: '600' }}>LOCATION / JURISDICTION</div>
              <div style={{ fontSize: '1rem', fontWeight: '700', color: '#002970', marginTop: '4px' }}>
                {customer.city || 'Jaipur'}, {customer.state || 'Rajasthan'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: '600' }}>KYC STATUS</div>
              <div style={{ marginTop: '4px' }}>
                <span className="paytm-badge paytm-badge-success">
                  <ShieldCheck size={14} />
                  <span>Verified Client</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Tabs Overview */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
            <div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#002970', marginBottom: '14px' }}>
                Active Consultancy Engagements
              </h4>
              <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <div>
                    <div style={{ fontWeight: '700', color: '#002970' }}>PMEGP Subsidy Loan Application</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Case ID: PRJ-1024 • Stage: Bank Clarification &amp; Query</div>
                  </div>
                  <span className="paytm-badge paytm-badge-sky">Stage 16 / 23</span>
                </div>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#002970', marginBottom: '14px' }}>
                Billing &amp; Ledger Summary
              </h4>
              <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>Total Billed Consultancy:</span>
                  <span style={{ fontWeight: '700', color: '#002970' }}>₹45,000</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>Received Payments:</span>
                  <span style={{ fontWeight: '700', color: '#16A34A' }}>₹35,000</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #E2E8F0', paddingTop: '8px', marginTop: '4px' }}>
                  <span style={{ color: '#64748B' }}>Outstanding Balance:</span>
                  <span style={{ fontWeight: '800', color: '#DC2626' }}>₹10,000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: CUSTOMERS DIRECTORY (/admin/customers)
  // -------------------------------------------------------------
  const filteredCustomers = activeCustomers.filter(c => {
    const term = searchTerm.toLowerCase();
    const nameMatch = c.name && c.name.toLowerCase().includes(term);
    const codeMatch = c.customer_code && c.customer_code.toLowerCase().includes(term);
    const phoneMatch = c.mobile && c.mobile.includes(term);
    const cityMatch = c.city && c.city.toLowerCase().includes(term);
    return nameMatch || codeMatch || phoneMatch || cityMatch;
  });

  return (
    <div>
      <div className="paytm-page-header">
        <div>
          <h1 className="paytm-page-title">Customer Database &amp; Dossiers</h1>
          <p className="paytm-page-subtitle">
            Enterprise clients, converted loan beneficiaries &amp; active compliance accounts ({activeCustomers.length} total)
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            type="button"
            onClick={() => navigate('/admin/customers/create')}
            className="paytm-btn paytm-btn-primary"
            style={{ fontWeight: '700' }}
          >
            <Plus size={16} />
            <span>+ Add Customer</span>
          </button>
          <button 
            type="button"
            onClick={() => showToast('Exporting Customer Master CSV...', 'success')}
            className="paytm-btn paytm-btn-outline"
          >
            <Download size={16} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="paytm-card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#F1F5F9', padding: '8px 14px', borderRadius: '8px', width: '340px' }}>
            <Search size={16} color="#64748B" />
            <input 
              type="text" 
              placeholder="Search by client name, code, city, phone..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none', fontSize: '0.88rem' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {['All', 'Verified', 'Under Review'].map(st => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: '1px solid',
                  borderColor: statusFilter === st ? '#00BAF2' : '#E2E8F0',
                  background: statusFilter === st ? '#E0F6FD' : '#FFFFFF',
                  color: statusFilter === st ? '#002970' : '#475569',
                  fontSize: '0.8rem',
                  fontWeight: statusFilter === st ? '700' : '500',
                  cursor: 'pointer'
                }}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="paytm-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="paytm-table-container" style={{ border: 'none' }}>
          <table className="paytm-table">
            <thead>
              <tr>
                <th>Customer ID</th>
                <th>Client / Enterprise Name</th>
                <th>Contact</th>
                <th>City &amp; State</th>
                <th>GSTIN</th>
                <th>KYC Status</th>
                <th>Assigned RM</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.slice(0, 50).map((cust) => (
                <tr key={cust.id}>
                  <td style={{ fontWeight: '700', color: '#002970', fontSize: '0.82rem' }}>
                    {cust.customer_code || `CUST-${cust.id}`}
                  </td>
                  <td>
                    <div style={{ fontWeight: '700', color: '#002970' }}>{cust.name}</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                      {cust.contact_person || 'Proprietor'}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.85rem' }}>{cust.mobile}</div>
                    {cust.email && (
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{cust.email}</div>
                    )}
                  </td>
                  <td style={{ fontSize: '0.85rem', color: '#334155' }}>
                    {cust.city || 'Jaipur'}, {cust.state || 'Rajasthan'}
                  </td>
                  <td style={{ fontSize: '0.82rem', fontFamily: 'monospace', color: '#002970' }}>
                    {cust.gstin || '08AABCA1234A1Z5'}
                  </td>
                  <td>
                    <span className="paytm-badge paytm-badge-success">
                      {cust.kyc_status || 'Verified'}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.85rem', color: '#475569' }}>
                    {cust.assigned_rm || 'CA Rajesh Verma'}
                  </td>
                  <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                      <button 
                        type="button"
                        onClick={() => navigate(`/admin/customers/${cust.id}/edit`)}
                        className="paytm-btn paytm-btn-outline paytm-btn-sm"
                        style={{ padding: '4px 8px', fontSize: '0.78rem' }}
                      >
                        Edit
                      </button>
                      <button 
                        type="button"
                        onClick={() => navigate(`/admin/customers/${cust.id}`)}
                        className="paytm-btn paytm-btn-outline paytm-btn-sm"
                        style={{ color: '#008BCB', borderColor: '#00BAF2', padding: '4px 10px', fontSize: '0.78rem' }}
                      >
                        <span>View 360°</span>
                        <ChevronRight size={14} />
                      </button>
                    </div>
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

// -------------------------------------------------------------
// HELPER: CREATE CUSTOMER VIEW
// -------------------------------------------------------------
const CreateCustomerView = ({ onCancel, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    contact_person: '',
    mobile: '',
    email: '',
    city: 'Jaipur',
    state: 'Rajasthan',
    gstin: '',
    kyc_status: 'Verified',
    assigned_rm: 'CA Rajesh Verma'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile) return;
    onSave(formData);
  };

  return (
    <div className="paytm-card" style={{ maxWidth: '850px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid #E2E8F0', paddingBottom: '16px', marginBottom: '24px' }}>
        <button type="button" onClick={onCancel} className="paytm-btn paytm-btn-outline paytm-btn-sm">
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#002970', margin: 0 }}>
            Onboard New Client / Enterprise
          </h2>
          <p style={{ margin: '2px 0 0', fontSize: '0.85rem', color: '#64748B' }}>
            Register new business for loan processing, DPR drafting &amp; compliance management
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#1E293B', marginBottom: '6px' }}>
              Enterprise / Business Name *
            </label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Modern Fabtech Pvt Ltd"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#1E293B', marginBottom: '6px' }}>
              Authorized Contact Person *
            </label>
            <input 
              type="text" 
              required
              value={formData.contact_person}
              onChange={e => setFormData({ ...formData, contact_person: e.target.value })}
              placeholder="e.g. Arvind Mehta (Managing Director)"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#1E293B', marginBottom: '6px' }}>
              Mobile Number (WhatsApp) *
            </label>
            <input 
              type="tel" 
              required
              value={formData.mobile}
              onChange={e => setFormData({ ...formData, mobile: e.target.value })}
              placeholder="10-digit mobile number"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#1E293B', marginBottom: '6px' }}>
              Corporate Email Address
            </label>
            <input 
              type="email" 
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              placeholder="director@company.com"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#1E293B', marginBottom: '6px' }}>
              City
            </label>
            <input 
              type="text" 
              value={formData.city}
              onChange={e => setFormData({ ...formData, city: e.target.value })}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#1E293B', marginBottom: '6px' }}>
              State
            </label>
            <input 
              type="text" 
              value={formData.state}
              onChange={e => setFormData({ ...formData, state: e.target.value })}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#1E293B', marginBottom: '6px' }}>
              GSTIN / Udyam Number
            </label>
            <input 
              type="text" 
              value={formData.gstin}
              onChange={e => setFormData({ ...formData, gstin: e.target.value })}
              placeholder="e.g. 08AABCM1234A1Z1"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#1E293B', marginBottom: '6px' }}>
              Assigned Relationship Manager
            </label>
            <select 
              value={formData.assigned_rm}
              onChange={e => setFormData({ ...formData, assigned_rm: e.target.value })}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', background: '#fff' }}
            >
              <option value="CA Rajesh Verma">CA Rajesh Verma</option>
              <option value="Neha Sharma">Neha Sharma</option>
              <option value="Anil Tyagi">Anil Tyagi</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid #E2E8F0', paddingTop: '16px' }}>
          <button type="button" onClick={onCancel} className="paytm-btn paytm-btn-outline">Cancel</button>
          <button type="submit" className="paytm-btn paytm-btn-primary" style={{ padding: '10px 24px', fontWeight: '700' }}>Save Customer Record</button>
        </div>
      </form>
    </div>
  );
};

// -------------------------------------------------------------
// HELPER: EDIT CUSTOMER VIEW
// -------------------------------------------------------------
const EditCustomerView = ({ customer, onCancel, onSave }) => {
  const [formData, setFormData] = useState({
    name: customer.name || '',
    contact_person: customer.contact_person || '',
    mobile: customer.mobile || '',
    email: customer.email || '',
    city: customer.city || 'Jaipur',
    state: customer.state || 'Rajasthan',
    gstin: customer.gstin || '',
    kyc_status: customer.kyc_status || 'Verified',
    assigned_rm: customer.assigned_rm || 'CA Rajesh Verma'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="paytm-card" style={{ maxWidth: '850px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid #E2E8F0', paddingBottom: '16px', marginBottom: '24px' }}>
        <button type="button" onClick={onCancel} className="paytm-btn paytm-btn-outline paytm-btn-sm">
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#002970', margin: 0 }}>
            Edit Customer: {customer.name}
          </h2>
          <p style={{ margin: '2px 0 0', fontSize: '0.85rem', color: '#64748B' }}>
            Update client contact person, GST details and assigned consultant
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#1E293B', marginBottom: '6px' }}>
              Enterprise / Business Name *
            </label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#1E293B', marginBottom: '6px' }}>
              Authorized Contact Person *
            </label>
            <input 
              type="text" 
              required
              value={formData.contact_person}
              onChange={e => setFormData({ ...formData, contact_person: e.target.value })}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#1E293B', marginBottom: '6px' }}>
              Mobile Number (WhatsApp) *
            </label>
            <input 
              type="tel" 
              required
              value={formData.mobile}
              onChange={e => setFormData({ ...formData, mobile: e.target.value })}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#1E293B', marginBottom: '6px' }}>
              Corporate Email Address
            </label>
            <input 
              type="email" 
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#1E293B', marginBottom: '6px' }}>
              City
            </label>
            <input 
              type="text" 
              value={formData.city}
              onChange={e => setFormData({ ...formData, city: e.target.value })}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#1E293B', marginBottom: '6px' }}>
              State
            </label>
            <input 
              type="text" 
              value={formData.state}
              onChange={e => setFormData({ ...formData, state: e.target.value })}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#1E293B', marginBottom: '6px' }}>
              GSTIN / Udyam Number
            </label>
            <input 
              type="text" 
              value={formData.gstin}
              onChange={e => setFormData({ ...formData, gstin: e.target.value })}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#1E293B', marginBottom: '6px' }}>
              KYC Status
            </label>
            <select 
              value={formData.kyc_status}
              onChange={e => setFormData({ ...formData, kyc_status: e.target.value })}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', background: '#fff' }}
            >
              <option value="Verified">Verified</option>
              <option value="Under Review">Under Review</option>
              <option value="Documents Pending">Documents Pending</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid #E2E8F0', paddingTop: '16px' }}>
          <button type="button" onClick={onCancel} className="paytm-btn paytm-btn-outline">Cancel</button>
          <button type="submit" className="paytm-btn paytm-btn-primary" style={{ padding: '10px 24px', fontWeight: '700' }}>Save &amp; Update Customer</button>
        </div>
      </form>
    </div>
  );
};
