import React, { useState } from 'react';
import { useRouter } from '../../../router/Router';
import { useApp } from '../../../context/AppContext';
import { 
  Briefcase, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Building2, 
  IndianRupee, 
  ChevronRight, 
  ArrowLeft,
  FileText,
  ShieldCheck,
  Send,
  Upload
} from 'lucide-react';

export const ProjectsModule = () => {
  const { currentPath, navigate, matchPath } = useRouter();
  const { showToast } = useApp();

  const isCreateRoute = currentPath === '/admin/projects/create';
  const editMatch = matchPath('/admin/projects/:id/edit');
  const detailMatch = !isCreateRoute && !editMatch ? matchPath('/admin/projects/:id') : null;

  const [projectsList, setProjectsList] = useState([
    {
      id: 1,
      code: 'PRJ-1024',
      name: 'Amit Enterprises - PMEGP Expansion',
      customer: 'Amit Enterprises',
      scheme: 'PMEGP Subsidy Loan',
      loanAmount: 2500000,
      sanctioned: 0,
      currentStage: 'Stage 16: Bank Query & Clarification',
      stageIndex: 16,
      progress: 68,
      status: 'In Progress',
      assignedTo: 'Project Team',
      startDate: '2026-10-15',
      deadline: '2026-12-15'
    },
    {
      id: 2,
      code: 'PRJ-1025',
      name: 'Sharma Industries - MUDRA Tarun Working Capital',
      customer: 'Sharma Industries',
      scheme: 'MUDRA Tarun Scheme',
      loanAmount: 1500000,
      sanctioned: 1500000,
      currentStage: 'Stage 19: Pre-disbursement Documentation',
      stageIndex: 19,
      progress: 82,
      status: 'Verification',
      assignedTo: 'Credit Team',
      startDate: '2026-10-02',
      deadline: '2026-11-30'
    },
    {
      id: 3,
      code: 'PRJ-1026',
      name: 'ABC Manufacturing - State Subsidy & DPR',
      customer: 'ABC Manufacturing Pvt Ltd',
      scheme: 'RIPS State Industrial Subsidy',
      loanAmount: 4500000,
      sanctioned: 0,
      currentStage: 'Stage 9: Detailed Project Report (DPR)',
      stageIndex: 9,
      progress: 40,
      status: 'Pending',
      assignedTo: 'Documentation',
      startDate: '2026-11-01',
      deadline: '2026-12-30'
    },
    {
      id: 4,
      code: 'PRJ-1027',
      name: 'Goyal Agro - Food Processing Subsidy',
      customer: 'Goyal Agro Tech',
      scheme: 'PMEGP Agro Processing',
      loanAmount: 2000000,
      sanctioned: 1800000,
      currentStage: 'Stage 20: Loan Disbursement Verified',
      stageIndex: 20,
      progress: 90,
      status: 'In Progress',
      assignedTo: 'Project Team',
      startDate: '2026-09-10',
      deadline: '2026-11-28'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // -------------------------------------------------------------
  // VIEW: CREATE PROJECT (/admin/projects/create)
  // -------------------------------------------------------------
  if (isCreateRoute) {
    return (
      <CreateProjectView 
        onCancel={() => navigate('/admin/projects')}
        onSave={(newProj) => {
          const item = {
            id: Date.now(),
            code: `PRJ-${Date.now().toString().slice(-4)}`,
            currentStage: 'Stage 1: Customer Onboarding',
            stageIndex: 1,
            progress: 5,
            sanctioned: 0,
            status: 'In Progress',
            startDate: new Date().toISOString().split('T')[0],
            ...newProj
          };
          setProjectsList([item, ...projectsList]);
          showToast(`Project ${newProj.name} created successfully`, 'success');
          navigate('/admin/projects');
        }}
      />
    );
  }

  // -------------------------------------------------------------
  // VIEW: EDIT PROJECT (/admin/projects/:id/edit)
  // -------------------------------------------------------------
  if (editMatch) {
    const editId = editMatch.params.id;
    const existing = projectsList.find(p => String(p.id) === String(editId)) || projectsList[0];
    return (
      <EditProjectView 
        project={existing}
        onCancel={() => navigate(`/admin/projects/${editId}`)}
        onSave={(updated) => {
          setProjectsList(prev => prev.map(p => String(p.id) === String(editId) ? { ...p, ...updated } : p));
          showToast(`Project ${updated.name || existing.name} updated successfully`, 'success');
          navigate(`/admin/projects/${editId}`);
        }}
      />
    );
  }

  // -------------------------------------------------------------
  // VIEW 1: PROJECT WORKSPACE DETAILS (/admin/projects/:id)
  // -------------------------------------------------------------
  if (detailMatch) {
    const projId = detailMatch.params.id;
    const project = projectsList.find(p => String(p.id) === String(projId)) || projectsList[0];

    const stages = [
      'Customer Onboarding',
      'Initial Consultation',
      'Government Scheme Selection',
      'Eligibility Assessment',
      'Internal Scorecard Underwriting',
      'KYC & Document Collection',
      'Document Verification',
      'Business Plan Preparation',
      'Detailed Project Report (DPR)',
      'CMA Data & Financial Projections',
      'Internal Quality Review',
      'Customer Approval',
      'Government Portal Application',
      'Bank / Financial Institution Submission',
      'Application Acknowledgement',
      'Bank Query & Clarification',
      'Verification / Site Inspection',
      'Loan Sanction',
      'Pre-disbursement Documentation',
      'Loan Disbursement',
      'Subsidy Application & Claim',
      'Post-disbursement Compliance',
      'Project Completion'
    ];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              type="button"
              onClick={() => navigate('/admin/projects')}
              className="paytm-btn paytm-btn-outline paytm-btn-sm"
            >
              <ArrowLeft size={16} />
              <span>Back to Projects</span>
            </button>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#002970', margin: 0 }}>
                {project.name}
              </h2>
              <span style={{ fontSize: '0.85rem', color: '#64748B' }}>
                Project ID: {project.code} • Customer: {project.customer} • Scheme: {project.scheme}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              type="button"
              onClick={() => navigate(`/admin/projects/${project.id}/edit`)}
              className="paytm-btn paytm-btn-outline paytm-btn-sm"
              style={{ color: '#002970', borderColor: '#CBD5E1' }}
            >
              Edit Project
            </button>
            <button 
              type="button"
              onClick={() => {
                const nextStageIndex = Math.min((project.stageIndex || 1) + 1, 23);
                const nextProgress = Math.round((nextStageIndex / 23) * 100);
                const nextStageName = `Stage ${nextStageIndex}: ${stages[nextStageIndex - 1]}`;
                const isSanctioned = nextStageIndex >= 18;
                setProjectsList(prev => prev.map(p => String(p.id) === String(project.id) ? {
                  ...p,
                  stageIndex: nextStageIndex,
                  currentStage: nextStageName,
                  progress: nextProgress,
                  sanctioned: isSanctioned ? (p.sanctioned || p.loanAmount) : p.sanctioned
                } : p));
                showToast(`Advanced to ${nextStageName} (${nextProgress}% complete)`, 'success');
              }}
              className="paytm-btn paytm-btn-primary paytm-btn-sm"
            >
              <CheckCircle2 size={16} />
              <span>Advance to Next Stage</span>
            </button>
          </div>
        </div>

        {/* Project KPI Summary */}
        <div className="paytm-card" style={{ padding: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            <div>
              <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: '600' }}>REQUESTED LOAN</div>
              <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#002970', marginTop: '4px' }}>
                ₹{project.loanAmount.toLocaleString('en-IN')}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: '600' }}>SANCTIONED AMOUNT</div>
              <div style={{ fontSize: '1.25rem', fontWeight: '800', color: project.sanctioned > 0 ? '#16A34A' : '#64748B', marginTop: '4px' }}>
                {project.sanctioned > 0 ? `₹${project.sanctioned.toLocaleString('en-IN')}` : 'Awaiting Sanction'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: '600' }}>CURRENT PROCESSING STAGE</div>
              <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#008BCB', marginTop: '4px' }}>
                {project.currentStage}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: '600' }}>LIFECYCLE PROGRESS</div>
              <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#002970', marginTop: '4px' }}>
                {project.progress}% Completed
              </div>
            </div>
          </div>
        </div>

        {/* 23-Stage Lifecycle Timeline */}
        <div className="paytm-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#002970', marginBottom: '16px' }}>
            23-Stage Government Scheme Lifecycle Execution Timeline
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {stages.map((stg, idx) => {
              const stageNum = idx + 1;
              const isCompleted = stageNum < project.stageIndex;
              const isCurrent = stageNum === project.stageIndex;

              return (
                <div 
                  key={stageNum}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: isCurrent ? '#E0F6FD' : isCompleted ? '#F8FAFC' : '#FFFFFF',
                    border: '1px solid',
                    borderColor: isCurrent ? '#00BAF2' : isCompleted ? '#E2E8F0' : '#F1F5F9'
                  }}
                >
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: isCurrent ? '#00BAF2' : isCompleted ? '#16A34A' : '#E2E8F0',
                    color: isCurrent || isCompleted ? '#FFFFFF' : '#64748B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.78rem',
                    fontWeight: '800'
                  }}>
                    {isCompleted ? '✓' : stageNum}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: isCurrent ? '700' : '500', color: isCurrent ? '#002970' : isCompleted ? '#334155' : '#94A3B8' }}>
                      Stage {stageNum}: {stg}
                    </div>
                  </div>

                  {isCurrent && (
                    <span style={{ fontSize: '0.7rem', background: '#00BAF2', color: '#fff', padding: '2px 8px', borderRadius: '10px', fontWeight: '700' }}>
                      In Progress
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: ALL PROJECTS TABLE (/admin/projects)
  // -------------------------------------------------------------
  const filteredProjects = projectsList.filter(p => {
    const term = searchTerm.toLowerCase();
    const nameMatch = p.name.toLowerCase().includes(term);
    const codeMatch = p.code.toLowerCase().includes(term);
    const custMatch = p.customer.toLowerCase().includes(term);
    return nameMatch || codeMatch || custMatch;
  });

  return (
    <div>
      <div className="paytm-page-header">
        <div>
          <h1 className="paytm-page-title">Project Management &amp; Case Processing</h1>
          <p className="paytm-page-subtitle">
            End-to-end 23-stage workflow tracking from DPR preparation to bank disbursement
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            type="button"
            onClick={() => navigate('/admin/projects/create')}
            className="paytm-btn paytm-btn-primary"
            style={{ fontWeight: '700' }}
          >
            <Plus size={16} />
            <span>+ Create Project</span>
          </button>
          <button 
            type="button"
            onClick={() => showToast('Workflow templates configured for PMEGP, MUDRA & CGTMSE', 'success')}
            className="paytm-btn paytm-btn-outline"
          >
            Workflow Templates
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="paytm-card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#F1F5F9', padding: '8px 14px', borderRadius: '8px', width: '340px' }}>
            <Search size={16} color="#64748B" />
            <input 
              type="text" 
              placeholder="Search projects by ID, customer, scheme..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none', fontSize: '0.88rem' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {['All', 'In Progress', 'Verification', 'Pending'].map(st => (
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

      {/* Projects Table */}
      <div className="paytm-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="paytm-table-container" style={{ border: 'none' }}>
          <table className="paytm-table">
            <thead>
              <tr>
                <th>Project ID</th>
                <th>Project / Enterprise Name</th>
                <th>Government Scheme</th>
                <th>Requested Loan</th>
                <th>Current Processing Stage</th>
                <th>Progress</th>
                <th>Assigned Desk</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((p) => (
                <tr key={p.id}>
                  <td style={{ fontWeight: '700', color: '#002970', fontSize: '0.82rem' }}>
                    {p.code}
                  </td>
                  <td>
                    <div style={{ fontWeight: '700', color: '#002970' }}>{p.name}</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748B' }}>{p.customer}</div>
                  </td>
                  <td style={{ color: '#334155' }}>
                    {p.scheme}
                  </td>
                  <td style={{ fontWeight: '700', color: '#16A34A' }}>
                    ₹{p.loanAmount.toLocaleString('en-IN')}
                  </td>
                  <td style={{ fontSize: '0.82rem', color: '#008BCB', fontWeight: '600' }}>
                    {p.currentStage}
                  </td>
                  <td>
                    <div style={{ width: '100px', height: '8px', background: '#E2E8F0', borderRadius: '4px', overflow: 'hidden', marginBottom: '4px' }}>
                      <div style={{ width: `${p.progress}%`, height: '100%', background: '#00BAF2' }} />
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: '700' }}>{p.progress}% Done</span>
                  </td>
                  <td style={{ fontSize: '0.82rem', color: '#475569' }}>
                    {p.assignedTo}
                  </td>
                  <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                      <button 
                        type="button"
                        onClick={() => navigate(`/admin/projects/${p.id}/edit`)}
                        className="paytm-btn paytm-btn-outline paytm-btn-sm"
                        style={{ padding: '4px 8px', fontSize: '0.78rem' }}
                      >
                        Edit
                      </button>
                      <button 
                        type="button"
                        onClick={() => navigate(`/admin/projects/${p.id}`)}
                        className="paytm-btn paytm-btn-outline paytm-btn-sm"
                        style={{ color: '#008BCB', borderColor: '#00BAF2', padding: '4px 10px', fontSize: '0.78rem' }}
                      >
                        <span>Workspace</span>
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
// HELPER: CREATE PROJECT VIEW
// -------------------------------------------------------------
const CreateProjectView = ({ onCancel, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    customer: '',
    scheme: 'PMEGP Subsidy Loan',
    loanAmount: 2500000,
    assignedTo: 'Project Team',
    targetBank: 'State Bank of India (SBI)',
    deadline: '2026-12-31'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.customer) return;
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
            Create New Government Scheme Project
          </h2>
          <p style={{ margin: '2px 0 0', fontSize: '0.85rem', color: '#64748B' }}>
            Initialize 23-stage project workflow for loan subsidy processing
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#1E293B', marginBottom: '6px' }}>
              Project / Enterprise Title *
            </label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Sharma Agro Processing Unit"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#1E293B', marginBottom: '6px' }}>
              Associated Customer / Enterprise *
            </label>
            <input 
              type="text" 
              required
              value={formData.customer}
              onChange={e => setFormData({ ...formData, customer: e.target.value })}
              placeholder="e.g. Sharma Industries"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#1E293B', marginBottom: '6px' }}>
              Government Scheme *
            </label>
            <select 
              value={formData.scheme}
              onChange={e => setFormData({ ...formData, scheme: e.target.value })}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', background: '#fff' }}
            >
              <option value="PMEGP Subsidy Loan">PMEGP Subsidy Loan (Up to 35% Subsidy)</option>
              <option value="MUDRA Tarun Scheme">MUDRA Tarun Scheme (₹10L to ₹20L)</option>
              <option value="CGTMSE Collateral-Free">CGTMSE Collateral-Free Cover (Up to ₹5 Cr)</option>
              <option value="Stand-Up India Scheme">Stand-Up India Scheme (SC/ST/Women)</option>
              <option value="RIPS State Industrial Subsidy">State Industrial Investment Subsidy</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#1E293B', marginBottom: '6px' }}>
              Requested Loan Amount (₹) *
            </label>
            <input 
              type="number" 
              required
              value={formData.loanAmount}
              onChange={e => setFormData({ ...formData, loanAmount: Number(e.target.value) })}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#1E293B', marginBottom: '6px' }}>
              Target Financing Bank &amp; Branch
            </label>
            <input 
              type="text" 
              value={formData.targetBank}
              onChange={e => setFormData({ ...formData, targetBank: e.target.value })}
              placeholder="e.g. State Bank of India, Jaipur"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#1E293B', marginBottom: '6px' }}>
              Assigned Consulting Team
            </label>
            <select 
              value={formData.assignedTo}
              onChange={e => setFormData({ ...formData, assignedTo: e.target.value })}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', background: '#fff' }}
            >
              <option value="Project Team">Project Team</option>
              <option value="Credit Team">Credit Team</option>
              <option value="Documentation">Documentation Team</option>
              <option value="CA Rajesh Verma">CA Rajesh Verma</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid #E2E8F0', paddingTop: '16px' }}>
          <button type="button" onClick={onCancel} className="paytm-btn paytm-btn-outline">Cancel</button>
          <button type="submit" className="paytm-btn paytm-btn-primary" style={{ padding: '10px 24px', fontWeight: '700' }}>Initialize Project Workflow</button>
        </div>
      </form>
    </div>
  );
};

// -------------------------------------------------------------
// HELPER: EDIT PROJECT VIEW
// -------------------------------------------------------------
const EditProjectView = ({ project, onCancel, onSave }) => {
  const [formData, setFormData] = useState({
    name: project.name || '',
    customer: project.customer || '',
    scheme: project.scheme || 'PMEGP Subsidy Loan',
    loanAmount: project.loanAmount || 2500000,
    sanctioned: project.sanctioned || 0,
    status: project.status || 'In Progress',
    assignedTo: project.assignedTo || 'Project Team'
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
            Edit Project: {project.code}
          </h2>
          <p style={{ margin: '2px 0 0', fontSize: '0.85rem', color: '#64748B' }}>
            Modify loan amounts, status, scheme or assigned consultancy team
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#1E293B', marginBottom: '6px' }}>
              Project Name *
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
              Associated Customer *
            </label>
            <input 
              type="text" 
              required
              value={formData.customer}
              onChange={e => setFormData({ ...formData, customer: e.target.value })}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#1E293B', marginBottom: '6px' }}>
              Government Scheme *
            </label>
            <input 
              type="text" 
              required
              value={formData.scheme}
              onChange={e => setFormData({ ...formData, scheme: e.target.value })}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#1E293B', marginBottom: '6px' }}>
              Requested Loan (₹) *
            </label>
            <input 
              type="number" 
              required
              value={formData.loanAmount}
              onChange={e => setFormData({ ...formData, loanAmount: Number(e.target.value) })}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#1E293B', marginBottom: '6px' }}>
              Sanctioned Loan (₹)
            </label>
            <input 
              type="number" 
              value={formData.sanctioned}
              onChange={e => setFormData({ ...formData, sanctioned: Number(e.target.value) })}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#1E293B', marginBottom: '6px' }}>
              Status
            </label>
            <select 
              value={formData.status}
              onChange={e => setFormData({ ...formData, status: e.target.value })}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', background: '#fff' }}
            >
              <option value="In Progress">In Progress</option>
              <option value="Verification">Verification</option>
              <option value="Sanctioned">Sanctioned</option>
              <option value="Disbursed">Disbursed</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid #E2E8F0', paddingTop: '16px' }}>
          <button type="button" onClick={onCancel} className="paytm-btn paytm-btn-outline">Cancel</button>
          <button type="submit" className="paytm-btn paytm-btn-primary" style={{ padding: '10px 24px', fontWeight: '700' }}>Save &amp; Update Project</button>
        </div>
      </form>
    </div>
  );
};
