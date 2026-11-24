import React, { useState } from 'react';
import { useRouter } from '../../../router/Router';
import { useApp } from '../../../context/AppContext';
import { 
  Award, 
  Search, 
  Filter, 
  Plus, 
  ExternalLink, 
  ShieldCheck, 
  Building2, 
  Percent, 
  IndianRupee, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft,
  FileText
} from 'lucide-react';

export const SchemesModule = () => {
  const { currentPath, navigate, matchPath } = useRouter();
  const { showToast } = useApp();

  const isCreate = currentPath === '/admin/schemes/create';
  const editMatch = matchPath('/admin/schemes/:id/edit');
  const detailMatch = !isCreate && !editMatch ? matchPath('/admin/schemes/:id') : null;

  const [schemes, setSchemes] = useState([
    {
      id: 1,
      name: 'Prime Minister Employment Generation Programme (PMEGP)',
      code: 'SCH-PMEGP-01',
      type: 'Central Government',
      ministry: 'Ministry of MSME (KVIC)',
      maxLoan: '₹50,00,000 (Mfg) / ₹20,00,000 (Service)',
      subsidy: '15% to 35% Govt Subsidy (Margin Money)',
      ownContribution: '5% to 10%',
      targetSector: 'Manufacturing & Service Enterprises',
      officialUrl: 'https://www.kviconline.gov.in/pmegpeportal/',
      status: 'Active & Verified',
      lastVerified: '2026-11-20'
    },
    {
      id: 2,
      name: 'Pradhan Mantri MUDRA Yojana (PMMY) - Tarun',
      code: 'SCH-MUDRA-02',
      type: 'Central Government',
      ministry: 'Ministry of Finance (SIDBI)',
      maxLoan: '₹10,00,000 to ₹20,00,000',
      subsidy: 'Interest Subvention / Guarantee Backed',
      ownContribution: '10% to 15%',
      targetSector: 'Non-Corporate, Non-Farm Small/Micro Enterprises',
      officialUrl: 'https://www.mudra.org.in/',
      status: 'Active & Verified',
      lastVerified: '2026-11-18'
    },
    {
      id: 3,
      name: 'Credit Guarantee Scheme for Micro & Small Enterprises (CGTMSE)',
      code: 'SCH-CGTMSE-03',
      type: 'Central Government',
      ministry: 'Ministry of MSME & SIDBI',
      maxLoan: 'Up to ₹5,00,00,000',
      subsidy: '85% Credit Guarantee Cover (Collateral-Free)',
      ownContribution: '15% to 25%',
      targetSector: 'New and Existing Micro and Small Enterprises',
      officialUrl: 'https://www.cgtmse.in/',
      status: 'Active & Verified',
      lastVerified: '2026-11-15'
    },
    {
      id: 4,
      name: 'Stand-Up India Scheme',
      code: 'SCH-STANDUP-04',
      type: 'Central Government',
      ministry: 'Department of Financial Services (DFS)',
      maxLoan: '₹10,00,000 to ₹1,00,00,000',
      subsidy: 'Margin Money Support & Credit Guarantee',
      ownContribution: '15%',
      targetSector: 'SC, ST or Woman Entrepreneur Green-Field Projects',
      officialUrl: 'https://www.standupmitra.in/',
      status: 'Active & Verified',
      lastVerified: '2026-11-12'
    },
    {
      id: 5,
      name: 'State Industrial Investment Promotion Scheme (RIPS)',
      code: 'SCH-STATE-RIPS',
      type: 'State Government',
      ministry: 'Department of Industries (State Govt)',
      maxLoan: 'Project Cost Linked',
      subsidy: '75% Reimbursement on SGST + 5% Interest Subsidy',
      ownContribution: '20% to 25%',
      targetSector: 'State Manufacturing, Agri-Processing & Warehousing',
      officialUrl: 'https://industries.rajasthan.gov.in/',
      status: 'Active & Verified',
      lastVerified: '2026-11-10'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  // Form State for Scheme Creation
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: 'Central Government',
    ministry: '',
    maxLoan: '',
    subsidy: '',
    ownContribution: '',
    targetSector: '',
    officialUrl: ''
  });

  const handleCreateScheme = (e) => {
    e.preventDefault();
    if (!formData.name) return;
    const newScheme = {
      id: Date.now(),
      name: formData.name,
      code: formData.code || `SCH-${Date.now().toString().slice(-4)}`,
      type: formData.type,
      ministry: formData.ministry || 'Ministry of MSME',
      maxLoan: formData.maxLoan || '₹25,00,000',
      subsidy: formData.subsidy || '25% Subsidy',
      ownContribution: formData.ownContribution || '10%',
      targetSector: formData.targetSector || 'Micro & Small Enterprises',
      officialUrl: formData.officialUrl || 'https://msme.gov.in/',
      status: 'Active & Verified',
      lastVerified: new Date().toISOString().split('T')[0]
    };
    setSchemes([...schemes, newScheme]);
    showToast(`Scheme ${formData.name} added to catalog`, 'success');
    navigate('/admin/schemes');
  };

  if (isCreate) {
    return (
      <div className="paytm-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid #E2E8F0', paddingBottom: '16px', marginBottom: '24px' }}>
          <button 
            type="button" 
            onClick={() => navigate('/admin/schemes')}
            className="paytm-btn paytm-btn-outline paytm-btn-sm"
          >
            <ArrowLeft size={16} />
            <span>Back to Schemes</span>
          </button>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#002970', margin: 0 }}>
              Add Government Scheme Record
            </h2>
            <p style={{ margin: '2px 0 0', fontSize: '0.85rem', color: '#64748B' }}>
              Add officially verified central or state subsidy scheme with documented parameters
            </p>
          </div>
        </div>

        <form onSubmit={handleCreateScheme}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#1E293B', marginBottom: '6px' }}>
                Official Scheme Name *
              </label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Credit Linked Capital Subsidy Scheme (CLCSS)"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#1E293B', marginBottom: '6px' }}>
                Scheme Type
              </label>
              <select 
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', outline: 'none', background: '#fff' }}
              >
                <option value="Central Government">Central Government</option>
                <option value="State Government">State Government</option>
                <option value="Credit Guarantee">Credit Guarantee Agency</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#1E293B', marginBottom: '6px' }}>
                Ministry / Department
              </label>
              <input 
                type="text" 
                value={formData.ministry}
                onChange={e => setFormData({ ...formData, ministry: e.target.value })}
                placeholder="e.g. Ministry of MSME / KVIC"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#1E293B', marginBottom: '6px' }}>
                Maximum Loan Amount
              </label>
              <input 
                type="text" 
                value={formData.maxLoan}
                onChange={e => setFormData({ ...formData, maxLoan: e.target.value })}
                placeholder="e.g. ₹50,00,000"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#1E293B', marginBottom: '6px' }}>
                Government Subsidy % / Terms
              </label>
              <input 
                type="text" 
                value={formData.subsidy}
                onChange={e => setFormData({ ...formData, subsidy: e.target.value })}
                placeholder="e.g. 15% to 35% Margin Money Subsidy"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', outline: 'none' }}
              />
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#1E293B', marginBottom: '6px' }}>
                Official Portal / Guidelines URL *
              </label>
              <input 
                type="url" 
                value={formData.officialUrl}
                onChange={e => setFormData({ ...formData, officialUrl: e.target.value })}
                placeholder="https://official-government-portal.gov.in"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', outline: 'none' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button 
              type="button" 
              onClick={() => navigate('/admin/schemes')}
              className="paytm-btn paytm-btn-outline"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="paytm-btn paytm-btn-primary"
              style={{ padding: '10px 24px', fontWeight: '700' }}
            >
              Save Scheme Record
            </button>
          </div>
        </form>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW: EDIT SCHEME (/admin/schemes/:id/edit)
  // -------------------------------------------------------------
  if (editMatch) {
    const editId = editMatch.params.id;
    const existing = schemes.find(s => String(s.id) === String(editId)) || schemes[0];
    return (
      <EditSchemeView 
        scheme={existing}
        onCancel={() => navigate(`/admin/schemes/${editId}`)}
        onSave={(updated) => {
          setSchemes(prev => prev.map(s => String(s.id) === String(editId) ? { ...s, ...updated } : s));
          showToast(`Scheme ${updated.name || existing.name} updated successfully`, 'success');
          navigate(`/admin/schemes/${editId}`);
        }}
      />
    );
  }

  // -------------------------------------------------------------
  // VIEW: SCHEME DETAILS (/admin/schemes/:id)
  // -------------------------------------------------------------
  if (detailMatch) {
    const schemeId = detailMatch.params.id;
    const scheme = schemes.find(s => String(s.id) === String(schemeId)) || schemes[0];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              type="button" 
              onClick={() => navigate('/admin/schemes')}
              className="paytm-btn paytm-btn-outline paytm-btn-sm"
            >
              <ArrowLeft size={16} />
              <span>Back to Schemes</span>
            </button>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#002970', margin: 0 }}>
                {scheme.name}
              </h2>
              <span style={{ fontSize: '0.85rem', color: '#64748B' }}>
                Code: {scheme.code} • Ministry: {scheme.ministry} • Type: {scheme.type}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              type="button"
              onClick={() => navigate(`/admin/schemes/${scheme.id}/edit`)}
              className="paytm-btn paytm-btn-outline paytm-btn-sm"
              style={{ color: '#002970', borderColor: '#CBD5E1' }}
            >
              Edit Scheme
            </button>
            <button 
              type="button"
              onClick={() => navigate('/admin/eligibility')}
              className="paytm-btn paytm-btn-primary paytm-btn-sm"
            >
              Check Eligibility for Client
            </button>
          </div>
        </div>

        {/* Scheme Parameters Card */}
        <div className="paytm-card" style={{ padding: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', borderBottom: '1px solid #E2E8F0', paddingBottom: '20px', marginBottom: '20px' }}>
            <div>
              <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: '600' }}>MAXIMUM LOAN LIMIT</div>
              <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#002970', marginTop: '4px' }}>{scheme.maxLoan}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: '600' }}>SUBSIDY / GUARANTEE BENEFIT</div>
              <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#16A34A', marginTop: '4px' }}>{scheme.subsidy}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: '600' }}>APPLICANT CONTRIBUTION</div>
              <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#F59E0B', marginTop: '4px' }}>{scheme.ownContribution}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: '800', color: '#002970', marginBottom: '12px' }}>
                Scheme Description &amp; Target Beneficiaries
              </h4>
              <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '10px', fontSize: '0.88rem', lineHeight: '1.6', color: '#334155' }}>
                <p style={{ margin: '0 0 10px 0' }}>
                  <strong>Target Sector:</strong> {scheme.targetSector || 'Micro & Small Manufacturing, Service, Trading Units'}
                </p>
                <p style={{ margin: '0 0 10px 0' }}>
                  <strong>Administering Agency:</strong> {scheme.ministry}
                </p>
                <p style={{ margin: '0 0 10px 0' }}>
                  <strong>Verification Status:</strong> <span className="paytm-badge paytm-badge-success">{scheme.status}</span>
                </p>
                <p style={{ margin: 0 }}>
                  <strong>Official Portal:</strong>{' '}
                  <a href={scheme.officialUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#008BCB', fontWeight: '600', textDecoration: 'underline' }}>
                    {scheme.officialUrl}
                  </a>
                </p>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: '800', color: '#002970', marginBottom: '12px' }}>
                Eligible Documentation Checklist
              </h4>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: '#334155' }}>
                <li style={{ padding: '8px 12px', background: '#F8FAFC', borderRadius: '6px' }}>✓ Aadhaar Card &amp; PAN Card of Applicant</li>
                <li style={{ padding: '8px 12px', background: '#F8FAFC', borderRadius: '6px' }}>✓ Udyam / MSME Registration Certificate</li>
                <li style={{ padding: '8px 12px', background: '#F8FAFC', borderRadius: '6px' }}>✓ Detailed Project Report (DPR) with CMA Data</li>
                <li style={{ padding: '8px 12px', background: '#F8FAFC', borderRadius: '6px' }}>✓ Land / Lease Agreement for Unit Location</li>
                <li style={{ padding: '8px 12px', background: '#F8FAFC', borderRadius: '6px' }}>✓ Quotation for Plant &amp; Machinery from Authorized Vendor</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const filteredSchemes = schemes.filter(s => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = s.name.toLowerCase().includes(term) || s.code.toLowerCase().includes(term);
    const matchesType = typeFilter === 'All' || s.type.includes(typeFilter);
    return matchesSearch && matchesType;
  });

  return (
    <div>
      <div className="paytm-page-header">
        <div>
          <h1 className="paytm-page-title">Government Scheme Master Database</h1>
          <p className="paytm-page-subtitle">
            Officially verified central, state &amp; credit guarantee schemes for MSMEs and startups
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            type="button"
            onClick={() => navigate('/admin/eligibility')}
            className="paytm-btn paytm-btn-outline"
            style={{ color: '#008BCB', borderColor: '#00BAF2' }}
          >
            Run Eligibility Assessment
          </button>
          <button 
            type="button"
            onClick={() => navigate('/admin/schemes/create')}
            className="paytm-btn paytm-btn-primary"
            style={{ fontWeight: '700' }}
          >
            <Plus size={18} />
            <span>+ Add Scheme</span>
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="paytm-card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#F1F5F9', padding: '8px 14px', borderRadius: '8px', width: '320px' }}>
            <Search size={16} color="#64748B" />
            <input 
              type="text" 
              placeholder="Search scheme by name or code..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none', fontSize: '0.88rem' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {['All', 'Central', 'State', 'Guarantee'].map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setTypeFilter(t)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: '1px solid',
                  borderColor: typeFilter === t ? '#00BAF2' : '#E2E8F0',
                  background: typeFilter === t ? '#E0F6FD' : '#FFFFFF',
                  color: typeFilter === t ? '#002970' : '#475569',
                  fontSize: '0.8rem',
                  fontWeight: typeFilter === t ? '700' : '500',
                  cursor: 'pointer'
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Schemes Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: '20px' }}>
        {filteredSchemes.map((s) => (
          <div key={s.id} className="paytm-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <span className="paytm-badge paytm-badge-sky" style={{ fontSize: '0.72rem' }}>
                  {s.type}
                </span>
                <span style={{ fontSize: '0.72rem', color: '#16A34A', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ShieldCheck size={14} />
                  <span>Verified</span>
                </span>
              </div>

              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#002970', margin: '0 0 6px 0', lineHeight: '1.4' }}>
                {s.name}
              </h3>
              <div style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '16px' }}>
                {s.ministry} • Code: {s.code}
              </div>

              <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>Loan Limit:</span>
                  <span style={{ fontWeight: '700', color: '#002970' }}>{s.maxLoan}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>Subsidy / Guarantee:</span>
                  <span style={{ fontWeight: '700', color: '#16A34A' }}>{s.subsidy}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>Own Contribution:</span>
                  <span style={{ fontWeight: '600', color: '#1E293B' }}>{s.ownContribution}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '18px', paddingTop: '14px', borderTop: '1px solid #F1F5F9' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  type="button"
                  onClick={() => navigate(`/admin/schemes/${s.id}`)}
                  className="paytm-btn paytm-btn-outline paytm-btn-sm"
                  style={{ color: '#002970', borderColor: '#CBD5E1', padding: '4px 10px', fontSize: '0.78rem' }}
                >
                  View Details
                </button>
                <button 
                  type="button"
                  onClick={() => navigate(`/admin/schemes/${s.id}/edit`)}
                  className="paytm-btn paytm-btn-outline paytm-btn-sm"
                  style={{ padding: '4px 8px', fontSize: '0.78rem' }}
                >
                  Edit
                </button>
              </div>

              <button 
                type="button"
                onClick={() => navigate('/admin/eligibility')}
                className="paytm-btn paytm-btn-primary paytm-btn-sm"
              >
                Assess Candidate
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// HELPER: EDIT SCHEME VIEW
// -------------------------------------------------------------
const EditSchemeView = ({ scheme, onCancel, onSave }) => {
  const [formData, setFormData] = useState({
    name: scheme.name || '',
    code: scheme.code || '',
    type: scheme.type || 'Central Government',
    ministry: scheme.ministry || '',
    maxLoan: scheme.maxLoan || '',
    subsidy: scheme.subsidy || '',
    ownContribution: scheme.ownContribution || '',
    targetSector: scheme.targetSector || '',
    officialUrl: scheme.officialUrl || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="paytm-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid #E2E8F0', paddingBottom: '16px', marginBottom: '24px' }}>
        <button type="button" onClick={onCancel} className="paytm-btn paytm-btn-outline paytm-btn-sm">
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#002970', margin: 0 }}>
            Edit Scheme: {scheme.name}
          </h2>
          <p style={{ margin: '2px 0 0', fontSize: '0.85rem', color: '#64748B' }}>
            Modify maximum loan limits, subsidy percentages or official guidelines
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#1E293B', marginBottom: '6px' }}>
              Official Scheme Name *
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
              Scheme Code
            </label>
            <input 
              type="text" 
              value={formData.code}
              onChange={e => setFormData({ ...formData, code: e.target.value })}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#1E293B', marginBottom: '6px' }}>
              Administering Ministry / Agency
            </label>
            <input 
              type="text" 
              value={formData.ministry}
              onChange={e => setFormData({ ...formData, ministry: e.target.value })}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#1E293B', marginBottom: '6px' }}>
              Maximum Loan Limit
            </label>
            <input 
              type="text" 
              value={formData.maxLoan}
              onChange={e => setFormData({ ...formData, maxLoan: e.target.value })}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#1E293B', marginBottom: '6px' }}>
              Subsidy Benefit Rate
            </label>
            <input 
              type="text" 
              value={formData.subsidy}
              onChange={e => setFormData({ ...formData, subsidy: e.target.value })}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
            />
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#1E293B', marginBottom: '6px' }}>
              Official Portal URL
            </label>
            <input 
              type="url" 
              value={formData.officialUrl}
              onChange={e => setFormData({ ...formData, officialUrl: e.target.value })}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid #E2E8F0', paddingTop: '16px' }}>
          <button type="button" onClick={onCancel} className="paytm-btn paytm-btn-outline">Cancel</button>
          <button type="submit" className="paytm-btn paytm-btn-primary" style={{ padding: '10px 24px', fontWeight: '700' }}>Save &amp; Update Scheme</button>
        </div>
      </form>
    </div>
  );
};
