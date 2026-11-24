import React, { useState, useEffect } from 'react';
import { useRouter, getApiUrl } from '../../../router/Router';
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
  FileCheck,
  FileText,
  UserCheck,
  Send,
  Building2,
  Briefcase,
  IndianRupee,
  Layers,
  ArrowLeft,
  Download,
  Upload,
  MoreHorizontal,
  X,
  MessageCircle,
  Check
} from 'lucide-react';

export const LeadsModule = () => {
  const { currentPath, navigate, matchPath } = useRouter();
  const { showToast, leads: contextLeads = [] } = useApp();

  const [dbLeads, setDbLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateRangeFilter, setDateRangeFilter] = useState('All');
  const [staffFilter, setStaffFilter] = useState('All');
  const [stateFilter, setStateFilter] = useState('All');
  const [schemeFilter, setSchemeFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false);

  // Table selection & bulk actions
  const [selectedLeadIds, setSelectedLeadIds] = useState([]);
  const [activeActionDropdown, setActiveActionDropdown] = useState(null);

  // Sub-route matching
  const isCreateRoute = currentPath === '/admin/leads/create';
  const editMatch = matchPath('/admin/leads/:id/edit');
  const detailMatch = !isCreateRoute && !editMatch ? matchPath('/admin/leads/:id') : null;

  // Fetch leads from backend API
  useEffect(() => {
    let isMounted = true;
    fetch(getApiUrl('api/v1/lead_engine.php?action=list'))
      .then(res => res.json())
      .then(res => {
        if (isMounted && res.status && Array.isArray(res.data) && res.data.length > 0) {
          setDbLeads(res.data);
        } else {
          setDbLeads(getDefaultLeads());
        }
      })
      .catch(() => {
        if (isMounted) setDbLeads(getDefaultLeads());
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  const activeLeads = dbLeads.length > 0 ? dbLeads : getDefaultLeads();

  // Summary counts matching Image 2
  const summaryMetrics = {
    all: 769,
    new: 82,
    followups: 46,
    qualified: 124,
    converted: 319
  };

  // -------------------------------------------------------------
  // VIEW: CREATE LEAD (/admin/leads/create)
  // -------------------------------------------------------------
  if (isCreateRoute) {
    return (
      <CreateLeadView 
        onCancel={() => navigate('/admin/leads')}
        onSave={(newLead) => {
          showToast(`Lead for ${newLead.name} created successfully.`, 'success');
          navigate('/admin/leads');
        }}
      />
    );
  }

  // -------------------------------------------------------------
  // VIEW: EDIT LEAD (/admin/leads/:id/edit)
  // -------------------------------------------------------------
  if (editMatch) {
    const leadId = editMatch.id;
    const currentLead = activeLeads.find(l => String(l.id) === String(leadId)) || activeLeads[0];
    return (
      <EditLeadView 
        lead={currentLead}
        onCancel={() => navigate(`/admin/leads/${leadId}`)}
        onSave={(updated) => {
          showToast(`Lead #${leadId} updated successfully.`, 'success');
          navigate(`/admin/leads/${leadId}`);
        }}
      />
    );
  }

  // -------------------------------------------------------------
  // VIEW: LEAD DETAILS DOSSIER (/admin/leads/:id)
  // -------------------------------------------------------------
  if (detailMatch) {
    const leadId = detailMatch.id;
    const currentLead = activeLeads.find(l => String(l.id) === String(leadId)) || activeLeads[0];
    return (
      <LeadDetailDossierView 
        lead={currentLead}
        navigate={navigate}
        showToast={showToast}
      />
    );
  }

  // -------------------------------------------------------------
  // VIEW: MAIN ADVANCED LEAD MANAGEMENT TABLE (MATCHING IMAGE 2)
  // -------------------------------------------------------------
  const filteredLeads = activeLeads.filter(lead => {
    // Search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const match = (lead.name && lead.name.toLowerCase().includes(term)) ||
                    (lead.business_name && lead.business_name.toLowerCase().includes(term)) ||
                    (lead.company && lead.company.toLowerCase().includes(term)) ||
                    (lead.mobile && lead.mobile.includes(term));
      if (!match) return false;
    }

    // Status filter
    if (statusFilter !== 'All') {
      const st = (lead.stage || '').toLowerCase();
      if (statusFilter === 'New' && !st.includes('new')) return false;
      if (statusFilter === 'Follow-ups' && !st.includes('follow') && !st.includes('connect')) return false;
      if (statusFilter === 'Qualified' && !st.includes('qualif') && !st.includes('eligib')) return false;
      if (statusFilter === 'Converted' && !st.includes('convert')) return false;
    }

    // Staff filter
    if (staffFilter !== 'All') {
      if ((lead.assigned_to || '').toLowerCase().indexOf(staffFilter.toLowerCase()) === -1) return false;
    }

    return true;
  });

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedLeadIds(filteredLeads.map(l => l.id));
    } else {
      setSelectedLeadIds([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelectedLeadIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const resetAllFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setDateRangeFilter('All');
    setStaffFilter('All');
    setStateFilter('All');
    setSchemeFilter('All');
    setSourceFilter('All');
    setPriorityFilter('All');
  };

  return (
    <div>
      {/* Top Header matching Image 2 */}
      <div className="paytm-page-header">
        <div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: '800', color: '#002970', margin: 0 }}>
            Lead Management
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            type="button" 
            onClick={() => showToast('Opening Excel Lead Importer...', 'info')}
            className="paytm-btn paytm-btn-outline paytm-btn-sm"
          >
            Import
          </button>
          <button 
            type="button" 
            onClick={() => showToast('Exporting 769 leads to CSV...', 'info')}
            className="paytm-btn paytm-btn-outline paytm-btn-sm"
          >
            Export
          </button>
          <button 
            type="button" 
            onClick={() => navigate('/admin/leads/create')}
            className="paytm-btn paytm-btn-primary paytm-btn-sm"
            style={{ background: '#00BAF2' }}
          >
            + Add Lead
          </button>
        </div>
      </div>

      {/* 5 Summary KPI Cards matching Image 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '14px', marginBottom: '20px' }}>
        {/* Card 1: All Leads */}
        <div 
          className="paytm-card" 
          onClick={() => setStatusFilter('All')}
          style={{ 
            padding: '16px 20px', 
            cursor: 'pointer',
            border: statusFilter === 'All' ? '2px solid #002970' : '1px solid #E2E8F0',
            transition: 'all 0.15s ease'
          }}
        >
          <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: '600' }}>All Leads</div>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#002970', marginTop: '4px' }}>
            {summaryMetrics.all}
          </div>
        </div>

        {/* Card 2: New */}
        <div 
          className="paytm-card" 
          onClick={() => setStatusFilter('New')}
          style={{ 
            padding: '16px 20px', 
            cursor: 'pointer',
            border: statusFilter === 'New' ? '2px solid #00BAF2' : '1px solid #E2E8F0',
            transition: 'all 0.15s ease'
          }}
        >
          <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: '600' }}>New</div>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#00BAF2', marginTop: '4px' }}>
            {summaryMetrics.new}
          </div>
        </div>

        {/* Card 3: Follow-ups */}
        <div 
          className="paytm-card" 
          onClick={() => setStatusFilter('Follow-ups')}
          style={{ 
            padding: '16px 20px', 
            cursor: 'pointer',
            border: statusFilter === 'Follow-ups' ? '2px solid #F59E0B' : '1px solid #E2E8F0',
            transition: 'all 0.15s ease'
          }}
        >
          <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: '600' }}>Follow-ups</div>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#002970', marginTop: '4px' }}>
            {summaryMetrics.followups}
          </div>
        </div>

        {/* Card 4: Qualified */}
        <div 
          className="paytm-card" 
          onClick={() => setStatusFilter('Qualified')}
          style={{ 
            padding: '16px 20px', 
            cursor: 'pointer',
            border: statusFilter === 'Qualified' ? '2px solid #16A34A' : '1px solid #E2E8F0',
            transition: 'all 0.15s ease'
          }}
        >
          <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: '600' }}>Qualified</div>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#002970', marginTop: '4px' }}>
            {summaryMetrics.qualified}
          </div>
        </div>

        {/* Card 5: Converted */}
        <div 
          className="paytm-card" 
          onClick={() => setStatusFilter('Converted')}
          style={{ 
            padding: '16px 20px', 
            cursor: 'pointer',
            border: statusFilter === 'Converted' ? '2px solid #16A34A' : '1px solid #E2E8F0',
            transition: 'all 0.15s ease'
          }}
        >
          <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: '600' }}>Converted</div>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#002970', marginTop: '4px' }}>
            {summaryMetrics.converted}
          </div>
        </div>
      </div>

      {/* Filter Bar (Two Rows matching Image 2) */}
      <div className="paytm-card mb-4" style={{ padding: '16px 20px' }}>
        {/* Row 1: Search, Date Range, Lead Status, Assigned Staff */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '11px', color: '#94A3B8' }} />
            <input 
              type="text" 
              placeholder="Search name, phone, business..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="paytm-form-control"
              style={{ paddingLeft: '36px', height: '38px', fontSize: '0.86rem' }}
            />
          </div>

          <select 
            value={dateRangeFilter}
            onChange={e => setDateRangeFilter(e.target.value)}
            className="paytm-form-control"
            style={{ height: '38px', fontSize: '0.85rem' }}
          >
            <option value="All">Date Range ▾</option>
            <option value="Today">Today</option>
            <option value="Week">This Week</option>
            <option value="Month">This Month</option>
          </select>

          <select 
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="paytm-form-control"
            style={{ height: '38px', fontSize: '0.85rem' }}
          >
            <option value="All">Lead Status ▾</option>
            <option value="New">New</option>
            <option value="Follow-ups">Follow-up</option>
            <option value="Qualified">Qualified</option>
            <option value="Converted">Converted</option>
          </select>

          <select 
            value={staffFilter}
            onChange={e => setStaffFilter(e.target.value)}
            className="paytm-form-control"
            style={{ height: '38px', fontSize: '0.85rem' }}
          >
            <option value="All">Assigned Staff ▾</option>
            <option value="Rahul">Rahul</option>
            <option value="Neha">Neha</option>
            <option value="Vikas">Vikas</option>
            <option value="Credit Team">Credit Team</option>
          </select>
        </div>

        {/* Row 2: State, Scheme, Lead Source, Priority, Advanced Filters, Reset */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1.3fr 0.8fr', gap: '12px', alignItems: 'center' }}>
          <select 
            value={stateFilter}
            onChange={e => setStateFilter(e.target.value)}
            className="paytm-form-control"
            style={{ height: '38px', fontSize: '0.85rem' }}
          >
            <option value="All">State ▾</option>
            <option value="Rajasthan">Rajasthan</option>
            <option value="Gujarat">Gujarat</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Delhi">Delhi</option>
          </select>

          <select 
            value={schemeFilter}
            onChange={e => setSchemeFilter(e.target.value)}
            className="paytm-form-control"
            style={{ height: '38px', fontSize: '0.85rem' }}
          >
            <option value="All">Scheme ▾</option>
            <option value="PMEGP">PMEGP</option>
            <option value="MUDRA">MUDRA</option>
            <option value="CGTMSE">CGTMSE</option>
            <option value="State Scheme">State Scheme</option>
          </select>

          <select 
            value={sourceFilter}
            onChange={e => setSourceFilter(e.target.value)}
            className="paytm-form-control"
            style={{ height: '38px', fontSize: '0.85rem' }}
          >
            <option value="All">Lead Source ▾</option>
            <option value="Website">Website</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="Direct">Direct</option>
          </select>

          <select 
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
            className="paytm-form-control"
            style={{ height: '38px', fontSize: '0.85rem' }}
          >
            <option value="All">Priority ▾</option>
            <option value="Hot">Hot</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <button 
            type="button"
            onClick={() => setAdvancedFiltersOpen(!advancedFiltersOpen)}
            style={{ 
              height: '38px', 
              borderRadius: '6px', 
              border: '1px solid #00BAF2',
              background: advancedFiltersOpen ? '#00BAF2' : '#E0F2FE',
              color: advancedFiltersOpen ? '#fff' : '#008BCB',
              fontWeight: '700',
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            Advanced Filters
          </button>

          <button 
            type="button"
            onClick={resetAllFilters}
            className="paytm-btn paytm-btn-outline paytm-btn-sm"
            style={{ height: '38px', justifyContent: 'center' }}
          >
            Reset
          </button>
        </div>

        {/* Expandable Advanced Filters Drawer */}
        {advancedFiltersOpen && (
          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #E2E8F0', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: '700' }}>MIN LOAN AMOUNT (INR)</label>
              <input type="number" placeholder="e.g. 500000" className="paytm-form-control mt-1" style={{ height: '36px' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: '700' }}>MAX LOAN AMOUNT (INR)</label>
              <input type="number" placeholder="e.g. 5000000" className="paytm-form-control mt-1" style={{ height: '36px' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: '700' }}>BUSINESS CATEGORY</label>
              <select className="paytm-form-control mt-1" style={{ height: '36px' }}>
                <option value="All">All Categories</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Services">Services</option>
                <option value="Trading">Trading</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: '700' }}>KYC / DOCUMENT STATUS</label>
              <select className="paytm-form-control mt-1" style={{ height: '36px' }}>
                <option value="All">All Statuses</option>
                <option value="Collected">Documents Collected</option>
                <option value="Pending">Pending Documents</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Bulk Action Strip */}
      {selectedLeadIds.length > 0 && (
        <div style={{ 
          background: '#002970', 
          color: '#fff', 
          padding: '10px 20px', 
          borderRadius: '8px', 
          marginBottom: '16px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>
            {selectedLeadIds.length} leads selected
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              type="button" 
              onClick={() => showToast(`Bulk assigned ${selectedLeadIds.length} leads to Credit Team.`, 'success')}
              style={{ background: '#00BAF2', color: '#fff', border: 'none', padding: '5px 12px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer' }}
            >
              Bulk Assign
            </button>
            <button 
              type="button" 
              onClick={() => showToast(`Exported ${selectedLeadIds.length} selected leads.`, 'success')}
              style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none', padding: '5px 12px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer' }}
            >
              Export Selected
            </button>
            <button 
              type="button" 
              onClick={() => setSelectedLeadIds([])}
              style={{ background: 'none', border: 'none', color: '#94A3B8', fontSize: '0.8rem', cursor: 'pointer', padding: '0 8px' }}
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Main Leads Table matching Image 2 */}
      <div className="paytm-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="paytm-table-responsive">
          <table className="paytm-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>
                  <input 
                    type="checkbox" 
                    onChange={handleSelectAll}
                    checked={selectedLeadIds.length > 0 && selectedLeadIds.length === filteredLeads.length}
                  />
                </th>
                <th>Lead / Business</th>
                <th>Loan Amount</th>
                <th>Scheme</th>
                <th>Assigned To</th>
                <th>Follow-up</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => {
                const isSelected = selectedLeadIds.includes(lead.id);
                const schemeName = lead.scheme || (lead.business_name && lead.business_name.includes('Agro') ? 'PMEGP' : lead.business_name && lead.business_name.includes('Industries') ? 'MUDRA' : 'State Scheme');
                const loanAmt = lead.loan_amount || (lead.value ? `₹${(lead.value / 100000).toFixed(0)} Lakh` : '₹25 Lakh');
                const followupText = lead.followup || (lead.id % 4 === 0 ? 'Overdue' : lead.id % 3 === 0 ? 'Tomorrow' : lead.id % 2 === 0 ? '24 Nov' : 'Today');
                const statusBadge = lead.stage || (lead.id % 4 === 0 ? 'Pending' : lead.id % 3 === 0 ? 'Qualified' : lead.id % 2 === 0 ? 'New' : 'Interested');
                const assignedStaff = lead.assigned_to || (lead.id % 3 === 0 ? 'Neha' : lead.id % 2 === 0 ? 'Vikas' : 'Rahul');

                return (
                  <tr key={lead.id} style={{ background: isSelected ? '#F0F9FF' : 'transparent' }}>
                    <td>
                      <input 
                        type="checkbox" 
                        checked={isSelected}
                        onChange={() => handleSelectOne(lead.id)}
                      />
                    </td>
                    <td>
                      <div style={{ fontWeight: '700', color: '#002970', fontSize: '0.9rem' }}>
                        {lead.business_name || lead.name}
                      </div>
                      {lead.name && lead.business_name && lead.name !== lead.business_name && (
                        <div style={{ fontSize: '0.78rem', color: '#64748B' }}>{lead.name}</div>
                      )}
                    </td>
                    <td style={{ fontWeight: '700', color: '#1E293B', fontSize: '0.88rem' }}>
                      {loanAmt}
                    </td>
                    <td style={{ fontSize: '0.85rem', color: '#475569' }}>
                      {schemeName}
                    </td>
                    <td style={{ fontSize: '0.85rem', color: '#475569' }}>
                      {assignedStaff}
                    </td>
                    <td>
                      <span style={{ 
                        fontSize: '0.82rem', 
                        fontWeight: '600',
                        color: followupText === 'Overdue' ? '#DC2626' : followupText === 'Today' ? '#008BCB' : '#475569'
                      }}>
                        {followupText}
                      </span>
                    </td>
                    <td>
                      <span className={`paytm-badge ${
                        statusBadge === 'Qualified' ? 'paytm-badge-success' :
                        statusBadge === 'Interested' ? 'paytm-badge-sky' :
                        statusBadge === 'New' ? 'paytm-badge-sky' : 'paytm-badge-warning'
                      }`}>
                        {statusBadge}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <button 
                          type="button"
                          onClick={() => navigate(`/admin/leads/${lead.id}`)}
                          className="paytm-btn paytm-btn-outline paytm-btn-sm"
                          style={{ padding: '4px 14px', fontSize: '0.8rem', color: '#008BCB', borderColor: '#BAE6FD' }}
                        >
                          View
                        </button>
                        
                        {/* More Actions Dropdown */}
                        <div style={{ position: 'relative' }}>
                          <button 
                            type="button"
                            onClick={() => setActiveActionDropdown(activeActionDropdown === lead.id ? null : lead.id)}
                            style={{ 
                              background: '#F1F5F9', 
                              border: '1px solid #CBD5E1', 
                              borderRadius: '4px', 
                              padding: '4px 8px', 
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center'
                            }}
                          >
                            <MoreHorizontal size={14} color="#475569" />
                          </button>

                          {activeActionDropdown === lead.id && (
                            <div style={{
                              position: 'absolute',
                              right: 0,
                              top: '100%',
                              marginTop: '4px',
                              background: '#FFFFFF',
                              border: '1px solid #E2E8F0',
                              borderRadius: '8px',
                              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                              zIndex: 50,
                              width: '180px',
                              textAlign: 'left',
                              padding: '6px 0'
                            }}>
                              <div 
                                onClick={() => { setActiveActionDropdown(null); navigate(`/admin/leads/${lead.id}`); }}
                                style={{ padding: '8px 14px', fontSize: '0.82rem', cursor: 'pointer', color: '#002970', fontWeight: '600' }}
                              >
                                View Dossier
                              </div>
                              <div 
                                onClick={() => { setActiveActionDropdown(null); navigate(`/admin/leads/${lead.id}/edit`); }}
                                style={{ padding: '8px 14px', fontSize: '0.82rem', cursor: 'pointer', color: '#334155' }}
                              >
                                Edit Lead
                              </div>
                              <div 
                                onClick={() => { setActiveActionDropdown(null); showToast(`Dialing client at ${lead.mobile}...`, 'info'); }}
                                style={{ padding: '8px 14px', fontSize: '0.82rem', cursor: 'pointer', color: '#334155' }}
                              >
                                Call Customer
                              </div>
                              <div 
                                onClick={() => { setActiveActionDropdown(null); showToast('WhatsApp advisory link dispatched', 'success'); }}
                                style={{ padding: '8px 14px', fontSize: '0.82rem', cursor: 'pointer', color: '#16A34A' }}
                              >
                                WhatsApp
                              </div>
                              <div 
                                onClick={() => { setActiveActionDropdown(null); navigate('/admin/eligibility'); }}
                                style={{ padding: '8px 14px', fontSize: '0.82rem', cursor: 'pointer', color: '#008BCB' }}
                              >
                                Check Eligibility
                              </div>
                              <div 
                                onClick={() => { setActiveActionDropdown(null); showToast(`Converted ${lead.name} to Customer`, 'success'); navigate('/admin/customers'); }}
                                style={{ padding: '8px 14px', fontSize: '0.82rem', cursor: 'pointer', color: '#16A34A', fontWeight: '700', borderTop: '1px solid #F1F5F9' }}
                              >
                                Convert to Customer
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// COMPONENT: FULL LEAD DETAIL DOSSIER (15-TAB WORKSPACE)
// -------------------------------------------------------------
const LeadDetailDossierView = ({ lead, navigate, showToast }) => {
  const [activeTab, setActiveTab] = useState('Overview');

  const tabs = [
    'Overview', 'Applicant Details', 'Business Details', 'Loan Requirement', 
    'Government Schemes', 'Eligibility Assessment', 'Scorecard', 'Documents', 
    'Follow-ups', 'Appointments', 'Quotations', 'Billing', 'Communication', 'Notes', 'Activity History'
  ];

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ fontSize: '0.82rem', color: '#64748B', marginBottom: '14px' }}>
        <span style={{ cursor: 'pointer', color: '#008BCB' }} onClick={() => navigate('/admin/leads')}>Leads</span>
        <span style={{ margin: '0 8px' }}>/</span>
        <span>Lead Details</span>
        <span style={{ margin: '0 8px' }}>/</span>
        <span style={{ fontWeight: '700', color: '#002970' }}>{lead.name}</span>
      </div>

      {/* Header Profile Box */}
      <div className="paytm-card mb-4" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontSize: '1.45rem', fontWeight: '800', color: '#002970', margin: 0 }}>
                {lead.business_name || lead.name}
              </h2>
              <span className="paytm-badge paytm-badge-sky">
                {lead.stage || 'Interested'}
              </span>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '6px' }}>
              Lead Code: {lead.lead_code || `LEAD-${lead.id}`} • Phone: {lead.mobile} • RM: {lead.assigned_to || 'Rahul Sharma'}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              type="button"
              onClick={() => navigate(`/admin/leads/${lead.id}/edit`)}
              className="paytm-btn paytm-btn-outline paytm-btn-sm"
            >
              Edit Lead
            </button>
            <button 
              type="button"
              onClick={() => navigate('/admin/eligibility')}
              className="paytm-btn paytm-btn-outline paytm-btn-sm"
              style={{ color: '#008BCB', borderColor: '#00BAF2' }}
            >
              Check Eligibility
            </button>
            <button 
              type="button"
              onClick={() => {
                showToast(`Lead ${lead.name} converted to registered Customer.`, 'success');
                navigate('/admin/customers');
              }}
              className="paytm-btn paytm-btn-primary paytm-btn-sm"
              style={{ background: '#16A34A' }}
            >
              Convert to Customer
            </button>
          </div>
        </div>
      </div>

      {/* 15 Dedicated Tabs */}
      <div className="paytm-card mb-4" style={{ padding: '12px 18px' }}>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {tabs.map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setActiveTab(t)}
              style={{
                padding: '6px 14px',
                fontSize: '0.82rem',
                fontWeight: activeTab === t ? '700' : '500',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                background: activeTab === t ? '#E0F2FE' : 'transparent',
                color: activeTab === t ? '#008BCB' : '#475569'
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Tab: Overview */}
      {activeTab === 'Overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
          <div className="paytm-card">
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#002970', marginBottom: '14px' }}>
              Lead Assessment &amp; Proposal Summary
            </h3>
            <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '10px', fontSize: '0.88rem', lineHeight: '1.7', color: '#334155' }}>
              <div style={{ marginBottom: '8px' }}>
                <strong>Requested Loan Amount:</strong> <span style={{ fontWeight: '800', color: '#16A34A' }}>₹25,00,000</span>
              </div>
              <div style={{ marginBottom: '8px' }}>
                <strong>Target Scheme:</strong> PMEGP Manufacturing Subsidy (35% Govt grant eligible)
              </div>
              <div style={{ marginBottom: '8px' }}>
                <strong>Industry Sector:</strong> Agro Food Processing &amp; Grain Milling
              </div>
              <div>
                <strong>Current Verification Stage:</strong> Preliminary CIBIL and document collection under progress.
              </div>
            </div>
          </div>

          <div className="paytm-card">
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#002970', marginBottom: '14px' }}>
              Pending Action Items
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button 
                type="button"
                onClick={() => navigate('/admin/scorecards')}
                className="paytm-btn paytm-btn-outline"
                style={{ justifyContent: 'flex-start' }}
              >
                <FileText size={16} color="#00BAF2" />
                <span>Formulate 100-Point Scorecard</span>
              </button>
              <button 
                type="button"
                onClick={() => navigate('/admin/documents')}
                className="paytm-btn paytm-btn-outline"
                style={{ justifyContent: 'flex-start' }}
              >
                <FileCheck size={16} color="#16A34A" />
                <span>Verify Project Quotations &amp; KYC</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Business Details */}
      {activeTab === 'Business Details' && (
        <div className="paytm-card">
          <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#002970', marginBottom: '16px' }}>
            Enterprise Profile
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', fontSize: '0.88rem' }}>
            <div>
              <span style={{ color: '#64748B', fontSize: '0.78rem' }}>Business Name</span>
              <div style={{ fontWeight: '700', color: '#002970' }}>{lead.business_name || 'Amit Enterprises'}</div>
            </div>
            <div>
              <span style={{ color: '#64748B', fontSize: '0.78rem' }}>Industry Sector</span>
              <div style={{ fontWeight: '700', color: '#002970' }}>Manufacturing &amp; Processing</div>
            </div>
            <div>
              <span style={{ color: '#64748B', fontSize: '0.78rem' }}>City / State</span>
              <div style={{ fontWeight: '700', color: '#002970' }}>Jaipur, Rajasthan</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Scorecard */}
      {activeTab === 'Scorecard' && (
        <div className="paytm-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#002970', margin: 0 }}>
              Lead Scorecard &amp; Risk Appraisal
            </h3>
            <a 
              href={getApiUrl(`api/v1/generate_pdf.php?type=scorecard&id=${lead.id}&mode=download`)}
              className="paytm-btn paytm-btn-primary paytm-btn-sm"
            >
              <Download size={14} />
              <span>Download Scorecard PDF</span>
            </a>
          </div>
          <div style={{ background: '#F8FAFC', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#16A34A' }}>82 / 100</div>
            <div style={{ fontSize: '1rem', fontWeight: '700', color: '#002970', marginTop: '4px' }}>High Viability / Bank Sanction Ready</div>
          </div>
        </div>
      )}

      {/* Other tabs fallback */}
      {!['Overview', 'Business Details', 'Scorecard'].includes(activeTab) && (
        <div className="paytm-card">
          <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#002970', marginBottom: '10px' }}>
            {activeTab} Management Workspace
          </h3>
          <p style={{ color: '#64748B', fontSize: '0.88rem' }}>
            Active CRM records and logs for {lead.name} are loaded in this module.
          </p>
        </div>
      )}
    </div>
  );
};

// -------------------------------------------------------------
// HELPER FORMS: CREATE & EDIT LEAD
// -------------------------------------------------------------
const CreateLeadView = ({ onCancel, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    business_name: '',
    loan_amount: '2500000',
    scheme: 'PMEGP',
    assigned_to: 'Rahul'
  });

  return (
    <div className="paytm-card" style={{ maxWidth: '750px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px', borderBottom: '1px solid #E2E8F0', paddingBottom: '14px' }}>
        <button type="button" onClick={onCancel} className="paytm-btn paytm-btn-outline paytm-btn-sm">
          <ArrowLeft size={16} />
        </button>
        <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#002970', margin: 0 }}>
          Create New Lead
        </h2>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="paytm-form-group">
            <label className="paytm-form-label">Applicant Name *</label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="paytm-form-control"
              placeholder="e.g. Amit Sharma"
            />
          </div>

          <div className="paytm-form-group">
            <label className="paytm-form-label">Business / Enterprise Name</label>
            <input 
              type="text" 
              value={formData.business_name}
              onChange={e => setFormData({ ...formData, business_name: e.target.value })}
              className="paytm-form-control"
              placeholder="e.g. Amit Enterprises"
            />
          </div>

          <div className="paytm-form-group">
            <label className="paytm-form-label">Mobile Number *</label>
            <input 
              type="tel" 
              required
              value={formData.mobile}
              onChange={e => setFormData({ ...formData, mobile: e.target.value })}
              className="paytm-form-control"
              placeholder="e.g. 9829012345"
            />
          </div>

          <div className="paytm-form-group">
            <label className="paytm-form-label">Required Loan Amount (INR)</label>
            <input 
              type="number" 
              value={formData.loan_amount}
              onChange={e => setFormData({ ...formData, loan_amount: e.target.value })}
              className="paytm-form-control"
            />
          </div>

          <div className="paytm-form-group">
            <label className="paytm-form-label">Preferred Scheme</label>
            <select 
              value={formData.scheme}
              onChange={e => setFormData({ ...formData, scheme: e.target.value })}
              className="paytm-form-control"
            >
              <option value="PMEGP">PMEGP Subsidy Loan</option>
              <option value="MUDRA">MUDRA Tarun Scheme</option>
              <option value="CGTMSE">CGTMSE Collateral-Free</option>
              <option value="State Scheme">State Government Subsidy</option>
            </select>
          </div>

          <div className="paytm-form-group">
            <label className="paytm-form-label">Assign To Staff</label>
            <select 
              value={formData.assigned_to}
              onChange={e => setFormData({ ...formData, assigned_to: e.target.value })}
              className="paytm-form-control"
            >
              <option value="Rahul">Rahul Sharma</option>
              <option value="Neha">Neha Sharma</option>
              <option value="Vikas">Vikas Kumar</option>
              <option value="Credit Team">Credit Team</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '24px', borderTop: '1px solid #E2E8F0', paddingTop: '16px' }}>
          <button type="button" onClick={onCancel} className="paytm-btn paytm-btn-outline paytm-btn-sm">
            Cancel
          </button>
          <button type="submit" className="paytm-btn paytm-btn-primary paytm-btn-sm">
            Save Lead
          </button>
        </div>
      </form>
    </div>
  );
};

const EditLeadView = ({ lead, onCancel, onSave }) => {
  const [formData, setFormData] = useState({
    name: lead.name || '',
    mobile: lead.mobile || '',
    business_name: lead.business_name || lead.company || '',
    loan_amount: lead.loan_amount || '2500000',
    stage: lead.stage || 'Interested'
  });

  return (
    <div className="paytm-card" style={{ maxWidth: '750px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px', borderBottom: '1px solid #E2E8F0', paddingBottom: '14px' }}>
        <button type="button" onClick={onCancel} className="paytm-btn paytm-btn-outline paytm-btn-sm">
          <ArrowLeft size={16} />
        </button>
        <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#002970', margin: 0 }}>
          Edit Lead Details
        </h2>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="paytm-form-group">
            <label className="paytm-form-label">Applicant Name</label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="paytm-form-control"
            />
          </div>

          <div className="paytm-form-group">
            <label className="paytm-form-label">Business Name</label>
            <input 
              type="text" 
              value={formData.business_name}
              onChange={e => setFormData({ ...formData, business_name: e.target.value })}
              className="paytm-form-control"
            />
          </div>

          <div className="paytm-form-group">
            <label className="paytm-form-label">Mobile</label>
            <input 
              type="tel" 
              required
              value={formData.mobile}
              onChange={e => setFormData({ ...formData, mobile: e.target.value })}
              className="paytm-form-control"
            />
          </div>

          <div className="paytm-form-group">
            <label className="paytm-form-label">Lead Status / Stage</label>
            <select 
              value={formData.stage}
              onChange={e => setFormData({ ...formData, stage: e.target.value })}
              className="paytm-form-control"
            >
              <option value="New">New</option>
              <option value="Interested">Interested</option>
              <option value="Qualified">Qualified</option>
              <option value="Converted">Converted</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '24px', borderTop: '1px solid #E2E8F0', paddingTop: '16px' }}>
          <button type="button" onClick={onCancel} className="paytm-btn paytm-btn-outline paytm-btn-sm">
            Cancel
          </button>
          <button type="submit" className="paytm-btn paytm-btn-primary paytm-btn-sm">
            Update Lead
          </button>
        </div>
      </form>
    </div>
  );
};

// -------------------------------------------------------------
// DEFAULT LEADS SEED (Exact matching wireframe Image 2)
// -------------------------------------------------------------
function getDefaultLeads() {
  return [
    {
      id: 1,
      name: 'Amit Sharma',
      business_name: 'Amit Enterprises',
      mobile: '9829012345',
      loan_amount: '₹25 Lakh',
      scheme: 'PMEGP',
      assigned_to: 'Rahul',
      followup: 'Today',
      stage: 'Interested'
    },
    {
      id: 2,
      name: 'Virendra Sharma',
      business_name: 'Sharma Industries',
      mobile: '9414056789',
      loan_amount: '₹10 Lakh',
      scheme: 'MUDRA',
      assigned_to: 'Neha',
      followup: 'Tomorrow',
      stage: 'Qualified'
    },
    {
      id: 3,
      name: 'Bhupendra Patel',
      business_name: 'ABC Manufacturing',
      mobile: '9928345678',
      loan_amount: '₹50 Lakh',
      scheme: 'State Scheme',
      assigned_to: 'Vikas',
      followup: '24 Nov',
      stage: 'New'
    },
    {
      id: 4,
      name: 'Ramesh Goyal',
      business_name: 'Goyal Agro Tech',
      mobile: '9166402351',
      loan_amount: '₹15 Lakh',
      scheme: 'PMEGP',
      assigned_to: 'Rahul',
      followup: 'Overdue',
      stage: 'Pending'
    }
  ];
}
