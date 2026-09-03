import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Building2, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  FileText, 
  Banknote, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Award, 
  TrendingUp, 
  Calendar, 
  ArrowRight,
  ChevronRight,
  ExternalLink,
  Percent,
  Check,
  Briefcase
} from 'lucide-react';

export const LoanCaseDetailModal = () => {
  const { 
    selectedLoanForDetail, 
    setSelectedLoanForDetail, 
    updateLoanCaseStage,
    updateLoanBankDetails,
    updateLoanSubsidy,
    loanStagesMaster 
  } = useApp();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'credit' | 'documents' | 'bank' | 'subsidy' | 'timeline'
  const [stageRemarks, setStageRemarks] = useState('');

  if (!selectedLoanForDetail) return null;

  const c = selectedLoanForDetail;

  const handleStageChange = (newStage) => {
    updateLoanCaseStage(c.id, newStage, stageRemarks || `Stage changed to ${newStage}`);
    setStageRemarks('');
  };

  const getCibilColor = (score) => {
    if (score >= 750) return '#059669';
    if (score >= 700) return '#d97706';
    return '#dc2626';
  };

  return (
    <div className="crm-modal-backdrop" onClick={() => setSelectedLoanForDetail(null)}>
      <div 
        className="crm-modal-container"
        style={{ maxWidth: '980px', maxHeight: '90vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{ background: '#0b1727', color: '#fff', padding: '24px 28px', borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}>
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="badge badge-saffron" style={{ fontFamily: 'var(--font-mono)', fontWeight: '800' }}>
                  {c.id}
                </span>
                <span className="badge badge-slate" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}>
                  {c.scheme}
                </span>
                <span className="badge" style={{ background: 'rgba(5, 150, 105, 0.2)', color: '#34d399', border: '1px solid rgba(52, 211, 153, 0.4)' }}>
                  Stage: {c.stage}
                </span>
              </div>

              <h2 style={{ fontSize: '1.45rem', fontWeight: '800', margin: '4px 0', color: '#fff' }}>
                {c.businessName}
              </h2>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                Applicant: <strong style={{ color: '#fff' }}>{c.applicantName}</strong> • {c.customerType} • {c.city}, {c.state}
              </div>
            </div>

            <button 
              onClick={() => setSelectedLoanForDetail(null)}
              className="btn btn-ghost"
              style={{ color: '#fff', padding: '6px' }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Quick Metrics Strip */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <div>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Required Loan</span>
              <div style={{ fontSize: '1.2rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: '#fff' }}>
                ₹{Number(c.requiredAmount).toLocaleString('en-IN')}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Sanctioned</span>
              <div style={{ fontSize: '1.2rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: c.bankDetails?.sanctionedAmount > 0 ? '#34d399' : '#94a3b8' }}>
                {c.bankDetails?.sanctionedAmount > 0 ? `₹${Number(c.bankDetails.sanctionedAmount).toLocaleString('en-IN')}` : 'Pending Review'}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Lender Bank</span>
              <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#fff' }}>
                {c.bankDetails?.lenderName || 'Not Assigned'}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>CIBIL Health</span>
              <div style={{ fontSize: '1.2rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: getCibilColor(c.cibilScore) }}>
                {c.cibilScore || 'N/A'} <span style={{ fontSize: '0.75rem', fontWeight: '600' }}>({c.cibilStatus})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', padding: '0 24px', display: 'flex', gap: '4px', overflowX: 'auto' }}>
          {[
            { id: 'overview', label: '1. Case & Business Profile' },
            { id: 'credit', label: '2. Financials & CIBIL' },
            { id: 'documents', label: `3. Document Docket (${c.documents?.length || 0})` },
            { id: 'bank', label: '4. Bank & Underwriting' },
            { id: 'subsidy', label: '5. Govt Subsidy (KVIC)' },
            { id: 'timeline', label: '6. Follow-ups & Audit' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 16px',
                border: 'none',
                background: 'transparent',
                fontSize: '0.84rem',
                fontWeight: activeTab === tab.id ? '700' : '500',
                color: activeTab === tab.id ? '#ff6f00' : '#64748b',
                borderBottom: activeTab === tab.id ? '3px solid #ff6f00' : '3px solid transparent',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px 28px', overflowY: 'auto', maxHeight: 'calc(90vh - 280px)' }}>
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                {/* Applicant Box */}
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <h4 style={{ margin: '0 0 12px', fontSize: '0.92rem', color: '#0b1727', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <User size={16} color="#ff6f00" />
                    <span>Applicant Information</span>
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem' }}>
                    <div><strong>Full Name:</strong> {c.applicantName}</div>
                    <div><strong>Mobile:</strong> <a href={`tel:${c.contact}`} style={{ color: '#2563eb' }}>{c.contact}</a></div>
                    <div><strong>Email:</strong> {c.email}</div>
                    <div><strong>PAN Card:</strong> <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700' }}>{c.pan}</span></div>
                    <div><strong>Aadhaar No.:</strong> •••• •••• {c.aadhaarLast4}</div>
                    <div><strong>Location:</strong> {c.city}, {c.state} - {c.pinCode}</div>
                  </div>
                </div>

                {/* Business Box */}
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <h4 style={{ margin: '0 0 12px', fontSize: '0.92rem', color: '#0b1727', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Building2 size={16} color="#ff6f00" />
                    <span>Enterprise & Scheme Profile</span>
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem' }}>
                    <div><strong>Business Entity:</strong> {c.businessName}</div>
                    <div><strong>Constitution:</strong> {c.customerType}</div>
                    <div><strong>Vintage:</strong> {c.vintageYears} Years in Operation</div>
                    <div><strong>GSTIN:</strong> <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700' }}>{c.gstin}</span></div>
                    <div><strong>Udyam Number:</strong> <span style={{ fontFamily: 'var(--font-mono)', color: '#059669', fontWeight: '700' }}>{c.udyamNumber}</span></div>
                    <div><strong>Assigned Underwriter:</strong> {c.underwriter}</div>
                  </div>
                </div>
              </div>

              {/* Loan Purpose Note */}
              <div style={{ background: '#eff6ff', padding: '16px', borderRadius: '12px', border: '1px solid #bfdbfe' }}>
                <h4 style={{ margin: '0 0 6px', fontSize: '0.88rem', color: '#1e40af' }}>
                  Loan Objective & Utilization Summary
                </h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#1e3a8a', lineHeight: '1.5' }}>
                  {c.loanPurpose}
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: CREDIT & FINANCIALS */}
          {activeTab === 'credit' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>CIBIL Credit Score</div>
                  <div style={{ fontSize: '2rem', fontWeight: '900', fontFamily: 'var(--font-mono)', color: getCibilColor(c.cibilScore), margin: '4px 0' }}>
                    {c.cibilScore}
                  </div>
                  <span className="badge badge-emerald" style={{ fontSize: '0.75rem' }}>{c.cibilStatus} Rating</span>
                </div>

                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Annual GST Turnover</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: '#0b1727', margin: '4px 0' }}>
                    ₹{Number(c.annualTurnover).toLocaleString('en-IN')}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Avg Monthly: ₹{Number(c.monthlySales).toLocaleString('en-IN')}</div>
                </div>

                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Existing Loan Debt</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: '#0b1727', margin: '4px 0' }}>
                    ₹{Number(c.existingLoans).toLocaleString('en-IN')}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#dc2626' }}>Monthly EMI: ₹{Number(c.existingEmi).toLocaleString('en-IN')}</div>
                </div>
              </div>

              {/* Debt Service Feasibility Box */}
              <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ margin: '0 0 12px', fontSize: '0.92rem', color: '#0b1727', fontWeight: '700' }}>
                  Credit Underwriting Appraisal & Repayment Assessment
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', fontSize: '0.84rem' }}>
                  <div>
                    <div style={{ color: '#64748b' }}>Projected Debt-Service Coverage (DSCR):</div>
                    <div style={{ fontWeight: '800', fontSize: '1.1rem', color: '#059669' }}>1.78 (Bank Benchmark &gt; 1.50)</div>
                  </div>
                  <div>
                    <div style={{ color: '#64748b' }}>Fixed Obligation to Income (FOIR):</div>
                    <div style={{ fontWeight: '800', fontSize: '1.1rem', color: '#2563eb' }}>32% (Healthy &lt; 50%)</div>
                  </div>
                  <div>
                    <div style={{ color: '#64748b' }}>Underwriter Verdict:</div>
                    <div style={{ fontWeight: '800', fontSize: '1.1rem', color: '#059669' }}>Strong Recommendation for Sanction</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DOCUMENT DOCKET */}
          {activeTab === 'documents' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#0b1727', fontWeight: '700' }}>
                    Mandatory Bank & Scheme Document Docket
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
                    Verification status of KYC, statutory registrations, CA audited financials, and DPR.
                  </p>
                </div>
                <span className="badge badge-emerald">
                  {c.documents?.filter(d => d.status === 'Verified').length} / {c.documents?.length} Verified
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {c.documents?.map((doc, idx) => (
                  <div 
                    key={idx}
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      padding: '12px 16px', 
                      background: '#f8fafc', 
                      borderRadius: '10px', 
                      border: '1px solid #e2e8f0' 
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div style={{ 
                        width: '28px', 
                        height: '28px', 
                        borderRadius: '50%', 
                        background: doc.status === 'Verified' ? '#ecfdf5' : '#fff7ed', 
                        color: doc.status === 'Verified' ? '#059669' : '#ea580c',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {doc.status === 'Verified' ? <Check size={16} /> : <Clock size={16} />}
                      </div>
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '0.88rem', color: '#0b1727' }}>
                          {doc.name}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                          {doc.mandatory ? 'Mandatory for Bank Login' : 'Supporting Evidence'}
                        </div>
                      </div>
                    </div>

                    <span className={`badge ${doc.status === 'Verified' ? 'badge-emerald' : 'badge-amber'}`} style={{ fontSize: '0.75rem' }}>
                      {doc.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: BANK & UNDERWRITING */}
          {activeTab === 'bank' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <h4 style={{ margin: '0 0 12px', fontSize: '0.92rem', color: '#0b1727', fontWeight: '700' }}>
                    Target Bank Branch Liaison
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem' }}>
                    <div><strong>Bank Name:</strong> {c.bankDetails?.lenderName}</div>
                    <div><strong>Branch:</strong> {c.bankDetails?.branch}</div>
                    <div><strong>Branch Manager:</strong> {c.bankDetails?.branchManager || 'Under Coordination'}</div>
                    <div><strong>Credit Officer:</strong> {c.bankDetails?.creditOfficer || 'Desk Assigned'}</div>
                    <div><strong>Portal Login ID:</strong> <span style={{ fontFamily: 'var(--font-mono)' }}>{c.bankDetails?.portalLoginId || 'Pending'}</span></div>
                    <div><strong>JanSamarth Ref:</strong> <span style={{ fontFamily: 'var(--font-mono)' }}>{c.bankDetails?.janSamarthId || 'N/A'}</span></div>
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <h4 style={{ margin: '0 0 12px', fontSize: '0.92rem', color: '#0b1727', fontWeight: '700' }}>
                    Sanction & Disbursement Status
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem' }}>
                    <div>
                      <strong>Sanction Status:</strong>{' '}
                      {c.bankDetails?.sanctionDate ? (
                        <span style={{ color: '#059669', fontWeight: '700' }}>Sanctioned on {c.bankDetails.sanctionDate}</span>
                      ) : (
                        <span style={{ color: '#64748b' }}>Under Processing</span>
                      )}
                    </div>
                    <div><strong>Sanctioned Amount:</strong> ₹{Number(c.bankDetails?.sanctionedAmount || 0).toLocaleString('en-IN')}</div>
                    <div><strong>Interest Rate (ROI):</strong> {c.bankDetails?.roi || '8.50% - 9.25%'}</div>
                    <div><strong>Tenure:</strong> {c.bankDetails?.tenureMonths || 60} Months</div>
                    <div>
                      <strong>Disbursement UTR:</strong>{' '}
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: c.bankDetails?.utrNo ? '#059669' : '#94a3b8' }}>
                        {c.bankDetails?.utrNo || 'Awaiting Sanction Clearance'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: GOVT SUBSIDY */}
          {activeTab === 'subsidy' && (
            <div>
              {c.subsidy?.eligible ? (
                <div style={{ background: '#fff7ed', border: '1px solid #ffedd5', borderRadius: '12px', padding: '20px' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="badge badge-saffron">Govt Capital Subsidy Scheme</span>
                    <span style={{ fontWeight: '800', color: '#0b1727', fontSize: '1.05rem' }}>
                      {c.subsidy.schemeName}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', margin: '16px 0' }}>
                    <div>
                      <div style={{ fontSize: '0.78rem', color: '#9a3412' }}>Subsidy Percentage</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#c2410c' }}>
                        {c.subsidy.subsidyPercent}% Capital Margin
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.78rem', color: '#9a3412' }}>Eligible Subsidy Value</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#059669', fontFamily: 'var(--font-mono)' }}>
                        ₹{Number(c.subsidy.subsidyAmount).toLocaleString('en-IN')}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.78rem', color: '#9a3412' }}>KVIC Claim Reference</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: '#0b1727' }}>
                        {c.subsidy.kvicClaimNo}
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: '12px 16px', background: '#fff', borderRadius: '8px', border: '1px solid #fed7aa', fontSize: '0.84rem' }}>
                    <strong>Current Subsidy Lifecycle:</strong> {c.subsidy.claimStatus}
                    <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>
                      Note: PMEGP capital subsidy is credited to borrower's Term Deposit Receipt (TDR) locked for 3 years without interest.
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '36px 20px', textAlign: 'center', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', color: '#64748b' }}>
                  <ShieldCheck size={36} style={{ color: '#cbd5e1', marginBottom: '8px' }} />
                  <div style={{ fontWeight: '700', fontSize: '1rem', color: '#475569' }}>Standard Commercial Bank Product</div>
                  <div style={{ fontSize: '0.84rem' }}>This scheme does not include a direct government capital subsidy component.</div>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: TIMELINE & AUDIT */}
          {activeTab === 'timeline' && (
            <div>
              <h4 style={{ margin: '0 0 16px', fontSize: '0.92rem', color: '#0b1727', fontWeight: '700' }}>
                Case Timeline & Underwriting Audit Log
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderLeft: '2px solid #e2e8f0', paddingLeft: '20px', marginLeft: '10px' }}>
                {c.timeline?.map((t, idx) => (
                  <div key={idx} style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '-27px', top: '2px', width: '12px', height: '12px', borderRadius: '50%', background: '#ff6f00', border: '2px solid #fff' }} />
                    <div style={{ fontSize: '0.74rem', fontWeight: '700', color: '#64748b' }}>{t.date}</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0b1727' }}>{t.title}</div>
                    <div style={{ fontSize: '0.82rem', color: '#475569', marginTop: '2px' }}>{t.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer / Stage Progression */}
        <div style={{ background: '#f8fafc', padding: '16px 28px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'gap', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px' }}>
          <div className="flex items-center gap-2">
            <span style={{ fontSize: '0.84rem', fontWeight: '700', color: '#0b1727' }}>Advance Stage:</span>
            <select 
              value={c.stage}
              onChange={(e) => handleStageChange(e.target.value)}
              className="form-control"
              style={{ width: 'auto', fontSize: '0.82rem', padding: '6px 10px' }}
            >
              {loanStagesMaster.map(s => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setSelectedLoanForDetail(null)}
              className="btn btn-outline btn-sm"
              style={{ padding: '8px 16px' }}
            >
              Close Docket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
