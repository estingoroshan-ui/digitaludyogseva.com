import React, { useState, useEffect } from 'react';
import { useRouter } from '../../../router/Router';
import { useApp } from '../../../context/AppContext';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Clock, 
  ArrowRight, 
  ChevronRight, 
  Flame, 
  Sun, 
  Snowflake, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  UserCheck,
  Send,
  Building2,
  Briefcase,
  IndianRupee,
  Layers,
  ArrowLeft
} from 'lucide-react';

export const LeadsModule = () => {
  const { currentPath, navigate, matchPath } = useRouter();
  const { showToast, leads: contextLeads = [] } = useApp();

  const [dbLeads, setDbLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [tempFilter, setTempFilter] = useState('All');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'kanban'

  // Sub-route matching
  const isCreateRoute = currentPath === '/admin/leads/create';
  const detailMatch = matchPath('/admin/leads/:id');
  const editMatch = matchPath('/admin/leads/:id/edit');
  const isFollowupsRoute = currentPath === '/admin/follow-ups';

  // Lead Creation Form State
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    altMobile: '',
    email: '',
    businessName: '',
    businessType: 'Manufacturing',
    constitution: 'Proprietorship',
    industry: 'Engineering & Fabrication',
    state: 'Rajasthan',
    district: 'Jaipur',
    loanAmount: '1500000',
    schemeInterest: 'PMEGP Subsidy Loan',
    source: 'Website Inbound',
    priority: 'high',
    temperature: 'hot',
    assignedTo: 'Project Team',
    remarks: '',
    nextFollowupDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    nextFollowupTime: '11:00'
  });

  // Fetch leads from backend API
  useEffect(() => {
    let isMounted = true;
    fetch('api/v1/lead_engine.php?action=list')
      .then(res => res.json())
      .then(res => {
        if (isMounted && res.status && Array.isArray(res.data) && res.data.length > 0) {
          setDbLeads(res.data);
        } else if (contextLeads.length > 0) {
          setDbLeads(contextLeads);
        }
      })
      .catch(err => {
        console.warn('Leads fallback to local store:', err);
        if (contextLeads.length > 0) setDbLeads(contextLeads);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [contextLeads]);

  const activeLeads = dbLeads.length > 0 ? dbLeads : contextLeads;

  // Filtered Leads
  const filteredLeads = activeLeads.filter(lead => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      (lead.name && lead.name.toLowerCase().includes(term)) ||
      (lead.mobile && lead.mobile.includes(term)) ||
      (lead.email && lead.email.toLowerCase().includes(term)) ||
      (lead.business_name && lead.business_name.toLowerCase().includes(term)) ||
      (lead.lead_code && lead.lead_code.toLowerCase().includes(term));

    const matchesStatus = statusFilter === 'All' || 
      (lead.stage && lead.stage.toLowerCase().includes(statusFilter.toLowerCase()));

    const matchesTemp = tempFilter === 'All' || 
      (lead.temperature && lead.temperature.toLowerCase() === tempFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesTemp;
  });

  // Lead Submission
  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile) {
      showToast('Name and Mobile number are required.', 'error');
      return;
    }

    const newLead = {
      id: Date.now(),
      lead_code: `LEAD-${Date.now().toString().slice(-6)}`,
      name: formData.name,
      mobile: formData.mobile,
      email: formData.email,
      business_name: formData.businessName || `${formData.name} Enterprises`,
      value: formData.loanAmount,
      stage: 'New Lead',
      stage_color: '#00BAF2',
      source: formData.source,
      service: formData.schemeInterest,
      assigned_to: formData.assignedTo,
      temperature: formData.temperature,
      date: new Date().toISOString().split('T')[0]
    };

    // Save locally
    setDbLeads([newLead, ...dbLeads]);
    showToast(`Lead created successfully for ${formData.name}`, 'success');

    // Attempt persist to DB via API
    fetch('api/v1/leads.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.name,
        phone: formData.mobile,
        email: formData.email,
        value: formData.loanAmount,
        source: formData.source,
        notes: formData.remarks
      })
    }).catch(e => console.log('Lead persistence async sync'));

    navigate('/admin/leads');
  };

  // -------------------------------------------------------------
  // VIEW 1: CREATE LEAD FORM
  // -------------------------------------------------------------
  if (isCreateRoute) {
    return (
      <div className="paytm-card" style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid #E2E8F0', paddingBottom: '16px', marginBottom: '24px' }}>
          <button 
            type="button" 
            onClick={() => navigate('/admin/leads')}
            className="paytm-btn paytm-btn-outline paytm-btn-sm"
          >
            <ArrowLeft size={16} />
            <span>Back to Leads</span>
          </button>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#002970', margin: 0 }}>
              Create New Consultancy Lead
            </h2>
            <p style={{ margin: '2px 0 0', fontSize: '0.85rem', color: '#64748B' }}>
              Capture prospective business applicant details for government scheme eligibility
            </p>
          </div>
        </div>

        <form onSubmit={handleCreateSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            {/* Applicant Name */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#1E293B', marginBottom: '6px' }}>
                Applicant Full Name *
              </label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Rajesh Kumar"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', outline: 'none' }}
              />
            </div>

            {/* Mobile Number */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#1E293B', marginBottom: '6px' }}>
                Primary Mobile Number *
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

            {/* Email Address */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#1E293B', marginBottom: '6px' }}>
                Email Address
              </label>
              <input 
                type="email" 
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="client@example.com"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', outline: 'none' }}
              />
            </div>

            {/* Business / Enterprise Name */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#1E293B', marginBottom: '6px' }}>
                Proposed or Existing Business Name
              </label>
              <input 
                type="text" 
                value={formData.businessName}
                onChange={e => setFormData({ ...formData, businessName: e.target.value })}
                placeholder="e.g. Kumar Engineering Works"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', outline: 'none' }}
              />
            </div>

            {/* Required Loan Amount */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#1E293B', marginBottom: '6px' }}>
                Required Loan / Project Cost (₹)
              </label>
              <input 
                type="number" 
                value={formData.loanAmount}
                onChange={e => setFormData({ ...formData, loanAmount: e.target.value })}
                placeholder="e.g. 1500000"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', outline: 'none' }}
              />
            </div>

            {/* Scheme Interest */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#1E293B', marginBottom: '6px' }}>
                Interested Government Scheme
              </label>
              <select 
                value={formData.schemeInterest}
                onChange={e => setFormData({ ...formData, schemeInterest: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', outline: 'none', background: '#fff' }}
              >
                <option value="PMEGP Subsidy Loan">PMEGP (Up to 35% Govt Subsidy)</option>
                <option value="MUDRA Tarun (₹10-20 Lakhs)">MUDRA Tarun (Unsecured Business Loan)</option>
                <option value="CGTMSE Collateral-Free">CGTMSE Credit Guarantee Loan</option>
                <option value="Stand-Up India (SC/ST/Women)">Stand-Up India Scheme</option>
                <option value="State Industrial Subsidy">State Industrial Investment Subsidy</option>
              </select>
            </div>

            {/* State */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#1E293B', marginBottom: '6px' }}>
                State / UT
              </label>
              <input 
                type="text" 
                value={formData.state}
                onChange={e => setFormData({ ...formData, state: e.target.value })}
                placeholder="e.g. Rajasthan"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', outline: 'none' }}
              />
            </div>

            {/* Lead Source */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#1E293B', marginBottom: '6px' }}>
                Lead Inbound Source
              </label>
              <select 
                value={formData.source}
                onChange={e => setFormData({ ...formData, source: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', outline: 'none', background: '#fff' }}
              >
                <option value="Website Inbound">Website Inbound</option>
                <option value="Facebook / Instagram Ads">Facebook / Instagram Ads</option>
                <option value="Google Search Ads">Google Search Ads</option>
                <option value="WhatsApp Direct">WhatsApp Direct</option>
                <option value="Franchise Partner Kendra">Franchise Partner Kendra</option>
                <option value="Telecalling Team">Telecalling Team</option>
                <option value="Walk-in Client">Walk-in Client</option>
              </select>
            </div>
          </div>

          {/* Remarks */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#1E293B', marginBottom: '6px' }}>
              Consultancy Observations & Remarks
            </label>
            <textarea 
              rows={3}
              value={formData.remarks}
              onChange={e => setFormData({ ...formData, remarks: e.target.value })}
              placeholder="Enter client initial requirements, machinery quotes available, or notes..."
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button 
              type="button" 
              onClick={() => navigate('/admin/leads')}
              className="paytm-btn paytm-btn-outline"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="paytm-btn paytm-btn-primary"
              style={{ padding: '10px 24px', fontWeight: '700' }}
            >
              Save &amp; Ingest Lead
            </button>
          </div>
        </form>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: LEAD 360° DOSSIER DETAILS (/admin/leads/:id)
  // -------------------------------------------------------------
  if (detailMatch) {
    const leadId = detailMatch.params.id;
    const currentLead = activeLeads.find(l => String(l.id) === String(leadId)) || activeLeads[0] || {
      id: leadId,
      name: 'Perfex TestLead',
      mobile: '9876541513',
      email: 'lead@example.com',
      business_name: 'Perfex Tech Solutions',
      value: '750000',
      stage: 'Converted',
      source: 'Website Form'
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              type="button"
              onClick={() => navigate('/admin/leads')}
              className="paytm-btn paytm-btn-outline paytm-btn-sm"
            >
              <ArrowLeft size={16} />
              <span>Back to Leads</span>
            </button>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#002970', margin: 0 }}>
                {currentLead.name}
              </h2>
              <span style={{ fontSize: '0.85rem', color: '#64748B' }}>
                Lead Code: {currentLead.lead_code || `LEAD-${currentLead.id}`} • Registered on {currentLead.date || '2026-08-28'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              type="button"
              onClick={() => navigate('/admin/eligibility')}
              className="paytm-btn paytm-btn-outline paytm-btn-sm"
              style={{ color: '#008BCB', borderColor: '#00BAF2' }}
            >
              Check Scheme Eligibility
            </button>
            <button 
              type="button"
              onClick={() => {
                showToast(`Lead ${currentLead.name} converted to Customer dossier`, 'success');
                navigate('/admin/customers');
              }}
              className="paytm-btn paytm-btn-primary paytm-btn-sm"
            >
              Convert to Customer
            </button>
          </div>
        </div>

        {/* Lead Dossier Tabs */}
        <div className="paytm-card" style={{ padding: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', borderBottom: '1px solid #E2E8F0', paddingBottom: '20px', marginBottom: '20px' }}>
            <div>
              <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: '600' }}>PHONE &amp; WHATSAPP</div>
              <div style={{ fontSize: '1rem', fontWeight: '700', color: '#002970', marginTop: '4px' }}>{currentLead.mobile}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: '600' }}>BUSINESS ENTITY</div>
              <div style={{ fontSize: '1rem', fontWeight: '700', color: '#002970', marginTop: '4px' }}>{currentLead.business_name || 'Proposed Enterprise'}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: '600' }}>REQUIRED LOAN ESTIMATE</div>
              <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#16A34A', marginTop: '4px' }}>
                ₹{Number(currentLead.value || 1500000).toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: '800', color: '#002970', marginBottom: '12px' }}>
                Consultancy Assessment Overview
              </h4>
              <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '10px', fontSize: '0.88rem', lineHeight: '1.6', color: '#334155' }}>
                <p style={{ margin: '0 0 10px 0' }}>
                  <strong>Client Status:</strong> <span className="paytm-badge paytm-badge-sky">{currentLead.stage || 'Connected'}</span>
                </p>
                <p style={{ margin: '0 0 10px 0' }}>
                  <strong>Lead Source:</strong> {currentLead.source || 'Website Organic'}
                </p>
                <p style={{ margin: '0 0 10px 0' }}>
                  <strong>Assigned Consultant:</strong> {currentLead.assigned_to || 'Neha Sharma (Corporate Lead)'}
                </p>
                <p style={{ margin: 0 }}>
                  <strong>Preliminary Finding:</strong> Suitable for PMEGP Manufacturing Subsidy Loan or MUDRA Tarun credit guarantee. Awaiting Udyam certificate and project report draft.
                </p>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: '800', color: '#002970', marginBottom: '12px' }}>
                Quick Action Tools
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button 
                  type="button" 
                  onClick={() => navigate('/admin/scorecards')}
                  className="paytm-btn paytm-btn-outline" 
                  style={{ justifyContent: 'flex-start' }}
                >
                  <FileText size={16} color="#00BAF2" />
                  <span>Generate 100-Point Scorecard</span>
                </button>
                <button 
                  type="button" 
                  onClick={() => navigate('/admin/documents')}
                  className="paytm-btn paytm-btn-outline" 
                  style={{ justifyContent: 'flex-start' }}
                >
                  <FileCheck size={16} color="#16A34A" />
                  <span>Verify Client KYC Documents</span>
                </button>
                <button 
                  type="button" 
                  onClick={() => navigate('/admin/follow-ups')}
                  className="paytm-btn paytm-btn-outline" 
                  style={{ justifyContent: 'flex-start' }}
                >
                  <Clock size={16} color="#F59E0B" />
                  <span>Schedule Consultation Call</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 3: MAIN LEADS TABLE & LIST (/admin/leads)
  // -------------------------------------------------------------
  return (
    <div>
      {/* Page Header */}
      <div className="paytm-page-header">
        <div>
          <h1 className="paytm-page-title">
            {isFollowupsRoute ? 'Pending Follow-ups Queue' : 'Lead Management CRM'}
          </h1>
          <p className="paytm-page-subtitle">
            {isFollowupsRoute 
              ? 'Scheduled consultations, telecall reminders and applicant contact pipeline' 
              : `Tracking ${activeLeads.length} prospective entrepreneurs and loan applicants`}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            type="button"
            onClick={() => navigate('/admin/leads/create')}
            className="paytm-btn paytm-btn-primary"
            style={{ fontWeight: '700' }}
          >
            <Plus size={18} />
            <span>+ Create Lead</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="paytm-card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          {/* Search Box */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#F1F5F9', padding: '8px 14px', borderRadius: '8px', width: '320px' }}>
            <Search size={16} color="#64748B" />
            <input 
              type="text" 
              placeholder="Search leads by name, phone, company..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none', fontSize: '0.88rem' }}
            />
          </div>

          {/* Status Filters */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748B' }}>STAGE:</span>
            {['All', 'New Lead', 'Connected', 'Converted', 'Not Eligible'].map((st) => (
              <button 
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                style={{ 
                  padding: '6px 12px', 
                  borderRadius: '6px', 
                  border: '1px solid',
                  borderColor: statusFilter === st ? '#00BAF2' : '#E2E8F0',
                  background: statusFilter === st ? '#E0F6FD' : '#FFFFFF',
                  color: statusFilter === st ? '#002970' : '#475569',
                  fontSize: '0.78rem',
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

      {/* Leads Table */}
      <div className="paytm-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="paytm-table-container" style={{ border: 'none' }}>
          <table className="paytm-table">
            <thead>
              <tr>
                <th>Lead ID</th>
                <th>Applicant / Enterprise</th>
                <th>Contact</th>
                <th>Required Loan</th>
                <th>Source</th>
                <th>Status</th>
                <th>Assigned To</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.slice(0, 50).map((lead) => (
                <tr key={lead.id}>
                  <td style={{ fontWeight: '700', color: '#002970', fontSize: '0.82rem' }}>
                    {lead.lead_code || `LEAD-${lead.id}`}
                  </td>
                  <td>
                    <div style={{ fontWeight: '700', color: '#002970' }}>{lead.name}</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                      {lead.business_name || lead.company || 'New Enterprise'}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}>
                      <Phone size={12} color="#00BAF2" />
                      <span>{lead.mobile}</span>
                    </div>
                    {lead.email && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#64748B' }}>
                        <Mail size={11} />
                        <span>{lead.email}</span>
                      </div>
                    )}
                  </td>
                  <td style={{ fontWeight: '700', color: '#16A34A' }}>
                    ₹{Number(lead.value || 1500000).toLocaleString('en-IN')}
                  </td>
                  <td style={{ fontSize: '0.82rem', color: '#475569' }}>
                    {lead.source || 'Website'}
                  </td>
                  <td>
                    <span 
                      className="paytm-badge"
                      style={{ 
                        background: lead.stage === 'Converted' ? '#DCFCE7' :
                                    lead.stage === 'Connected' ? '#E0F6FD' :
                                    lead.stage === 'Not Eligible' ? '#FEE2E2' : '#F1F5F9',
                        color: lead.stage === 'Converted' ? '#16A34A' :
                               lead.stage === 'Connected' ? '#008BCB' :
                               lead.stage === 'Not Eligible' ? '#DC2626' : '#002970'
                      }}
                    >
                      {lead.stage || 'New Lead'}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.82rem', color: '#64748B' }}>
                    {lead.assigned_to || 'Project Team'}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button 
                      type="button"
                      onClick={() => navigate(`/admin/leads/${lead.id}`)}
                      className="paytm-btn paytm-btn-outline paytm-btn-sm"
                      style={{ color: '#008BCB', borderColor: '#00BAF2' }}
                    >
                      <span>View 360°</span>
                      <ChevronRight size={14} />
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
