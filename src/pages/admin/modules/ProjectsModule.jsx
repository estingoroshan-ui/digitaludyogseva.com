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

  const detailMatch = matchPath('/admin/projects/:id');

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
              onClick={() => showToast('Stage completion approved and logged to audit trial', 'success')}
              className="paytm-btn paytm-btn-primary paytm-btn-sm"
            >
              <CheckCircle2 size={16} />
              <span>Approve Stage Progress</span>
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
                  <td style={{ textAlign: 'right' }}>
                    <button 
                      type="button"
                      onClick={() => navigate(`/admin/projects/${p.id}`)}
                      className="paytm-btn paytm-btn-outline paytm-btn-sm"
                      style={{ color: '#008BCB', borderColor: '#00BAF2' }}
                    >
                      <span>Workspace</span>
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
