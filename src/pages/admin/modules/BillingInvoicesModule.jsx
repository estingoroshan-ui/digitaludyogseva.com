import React, { useState, useEffect } from 'react';
import { useRouter, getApiUrl } from '../../../router/Router';
import { useApp } from '../../../context/AppContext';
import { 
  Receipt, 
  CreditCard, 
  FileText, 
  IndianRupee, 
  Search, 
  Filter, 
  Download, 
  Plus, 
  CheckCircle2, 
  Clock, 
  ArrowLeft,
  Building2,
  TrendingUp,
  Wallet,
  ExternalLink
} from 'lucide-react';

export const BillingInvoicesModule = () => {
  const { currentPath, navigate } = useRouter();
  const { showToast } = useApp();

  const isPayments = currentPath === '/admin/payments';
  const isQuotations = currentPath === '/admin/quotations';
  const isServices = currentPath === '/admin/services';
  const isAccounts = currentPath === '/admin/accounts';

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newInvoiceData, setNewInvoiceData] = useState({
    customer: '',
    service: 'PMEGP Subsidy Loan Dossier & DPR Preparation',
    subtotal: 25000,
    paymentMode: 'Bank Transfer / UPI'
  });

  // Subtab navigation pills
  const navTabs = [
    { label: 'Invoices', path: '/admin/invoices' },
    { label: 'Payments', path: '/admin/payments' },
    { label: 'Quotations', path: '/admin/quotations' },
    { label: 'Services Master', path: '/admin/services' },
    { label: 'Financial Accounts', path: '/admin/accounts' }
  ];

  const [invoices, setInvoices] = useState([
    {
      id: 1,
      invoiceNo: 'INV-2026-0842',
      customer: 'Amit Enterprises',
      service: 'PMEGP Subsidy Loan Dossier & DPR Preparation',
      subtotal: 25000,
      gst: 4500,
      total: 29500,
      status: 'Paid',
      date: '2026-11-20',
      paymentMode: 'UPI / Bank Transfer'
    },
    {
      id: 2,
      invoiceNo: 'INV-2026-0843',
      customer: 'Sharma Industries',
      service: 'MUDRA Tarun CMA Data & Financial Projections',
      subtotal: 18000,
      gst: 3240,
      total: 21240,
      status: 'Paid',
      date: '2026-11-18',
      paymentMode: 'Net Banking'
    },
    {
      id: 3,
      invoiceNo: 'INV-2026-0844',
      customer: 'ABC Manufacturing Pvt Ltd',
      service: 'State Industrial Investment Subsidy Claim Filing',
      subtotal: 35000,
      gst: 6300,
      total: 41300,
      status: 'Pending',
      date: '2026-11-15',
      paymentMode: 'Cheque Pending'
    }
  ]);

  const quotations = [
    { id: 1, quoteNo: 'QUOT-2026-101', customer: 'Apex BioSolutions', service: 'CGTMSE DPR & Bank Pitch Deck', amount: 35000, validTill: '2026-12-10', status: 'Approved' },
    { id: 2, quoteNo: 'QUOT-2026-102', customer: 'Goyal Agro Tech', service: 'Food Processing Subsidy & CMA Data', amount: 28000, validTill: '2026-12-15', status: 'Sent' },
    { id: 3, quoteNo: 'QUOT-2026-103', customer: 'Pooja Fashion Hub', service: 'PMEGP 35% Subsidy End-to-End Filing', amount: 25000, validTill: '2026-12-05', status: 'Draft' }
  ];

  const payments = [
    { id: 1, receiptNo: 'RCT-2026-901', customer: 'Amit Enterprises', amount: 29500, mode: 'UPI / Razorpay', refNo: 'TXN-98234871', date: '2026-11-20' },
    { id: 2, receiptNo: 'RCT-2026-902', customer: 'Sharma Industries', amount: 21240, mode: 'HDFC NEFT', refNo: 'HDFC-8827361', date: '2026-11-18' },
    { id: 3, receiptNo: 'RCT-2026-903', customer: 'Goyal Agro Tech', amount: 15000, mode: 'IMPS', refNo: 'IMPS-1192837', date: '2026-11-12' }
  ];

  const servicesMaster = [
    { id: 1, name: 'PMEGP Subsidy Loan Dossier (Mfg)', category: 'Govt Loan Advisory', fee: 25000, govFee: 0, turnaround: '7-10 Days' },
    { id: 2, name: 'MUDRA Tarun CMA Data & Projections', category: 'Credit Underwriting', fee: 18000, govFee: 0, turnaround: '3-5 Days' },
    { id: 3, name: 'CGTMSE Collateral-Free Bank Project Report', category: 'Govt Loan Advisory', fee: 35000, govFee: 0, turnaround: '10-14 Days' },
    { id: 4, name: 'Private Limited Company Incorporation', category: 'Corporate Licensing', fee: 6999, govFee: 1500, turnaround: '5-7 Days' },
    { id: 5, name: 'GST Registration & 1-Year Returns', category: 'Taxation & Accounting', fee: 4999, govFee: 0, turnaround: '2-3 Days' },
    { id: 6, name: 'Trademark Registration & Class Search', category: 'IP Protection', fee: 4500, govFee: 4500, turnaround: '1 Day' },
    { id: 7, name: 'Udyam / MSME Registration Certificate', category: 'Govt Registration', fee: 999, govFee: 0, turnaround: 'Same Day' },
    { id: 8, name: 'State Industrial Investment Subsidy Claim (RIPS)', category: 'Govt Loan Advisory', fee: 40000, govFee: 0, turnaround: '15-20 Days' }
  ];

  const handleCreateInvoiceSubmit = (e) => {
    e.preventDefault();
    if (!newInvoiceData.customer) {
      showToast('Please specify customer name', 'error');
      return;
    }
    const subtotal = Number(newInvoiceData.subtotal);
    const gst = Math.round(subtotal * 0.18);
    const total = subtotal + gst;
    const inv = {
      id: Date.now(),
      invoiceNo: `INV-2026-${Date.now().toString().slice(-4)}`,
      customer: newInvoiceData.customer,
      service: newInvoiceData.service,
      subtotal,
      gst,
      total,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
      paymentMode: newInvoiceData.paymentMode
    };
    setInvoices([inv, ...invoices]);
    setShowCreateModal(false);
    showToast(`Invoice ${inv.invoiceNo} generated for ${newInvoiceData.customer}`, 'success');
  };

  return (
    <div>
      <div className="paytm-page-header">
        <div>
          <h1 className="paytm-page-title">
            {isPayments ? 'Payments & Transaction Receipts' :
             isQuotations ? 'Consultancy Quotations & Estimates' :
             isServices ? 'Configurable Service Master & Pricing' :
             isAccounts ? 'Financial Accounts & Revenue Ledger' : 'Billing, Invoices & Accounts'}
          </h1>
          <p className="paytm-page-subtitle">
            GST compliant invoices, receipts &amp; consultancy fee management (strictly separated from loan funds)
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="paytm-btn paytm-btn-primary"
          >
            <Plus size={16} />
            <span>Create Invoice</span>
          </button>
        </div>
      </div>

      {/* Module Sub-tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px', marginBottom: '20px' }}>
        {navTabs.map(tab => {
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

      {/* Create Invoice Modal */}
      {showCreateModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="paytm-card" style={{ maxWidth: '550px', width: '100%', padding: '24px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#002970', margin: '0 0 16px 0' }}>
              Create GST Consultancy Invoice
            </h3>
            <form onSubmit={handleCreateInvoiceSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#1E293B', marginBottom: '4px' }}>
                    Customer / Enterprise Name *
                  </label>
                  <input 
                    type="text" 
                    required
                    value={newInvoiceData.customer}
                    onChange={e => setNewInvoiceData({ ...newInvoiceData, customer: e.target.value })}
                    placeholder="e.g. Goyal Agro Tech"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#1E293B', marginBottom: '4px' }}>
                    Service Rendered *
                  </label>
                  <select 
                    value={newInvoiceData.service}
                    onChange={e => setNewInvoiceData({ ...newInvoiceData, service: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', background: '#fff' }}
                  >
                    <option value="PMEGP Subsidy Loan Dossier & DPR Preparation">PMEGP Subsidy Loan Dossier &amp; DPR</option>
                    <option value="MUDRA Tarun CMA Data & Financial Projections">MUDRA Tarun CMA Data &amp; Projections</option>
                    <option value="CGTMSE Collateral-Free Bank Project Report">CGTMSE Collateral-Free Project Report</option>
                    <option value="State Industrial Subsidy Claim Filing">State Industrial Subsidy Claim Filing</option>
                    <option value="Private Limited Incorporation & MCA Filing">Private Limited Incorporation</option>
                    <option value="GST & Income Tax Annual Retainer">GST &amp; Tax Compliance Retainer</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#1E293B', marginBottom: '4px' }}>
                    Consultancy Fee Subtotal (₹) *
                  </label>
                  <input 
                    type="number" 
                    required
                    value={newInvoiceData.subtotal}
                    onChange={e => setNewInvoiceData({ ...newInvoiceData, subtotal: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#1E293B', marginBottom: '4px' }}>
                    Payment Mode
                  </label>
                  <select 
                    value={newInvoiceData.paymentMode}
                    onChange={e => setNewInvoiceData({ ...newInvoiceData, paymentMode: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', background: '#fff' }}
                  >
                    <option value="UPI / Bank Transfer">UPI / Bank Transfer</option>
                    <option value="Net Banking (NEFT/RTGS)">Net Banking (NEFT/RTGS)</option>
                    <option value="Cheque / Draft">Cheque / Demand Draft</option>
                    <option value="Online Gateway (Razorpay)">Online Gateway</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid #E2E8F0', paddingTop: '16px' }}>
                <button type="button" onClick={() => setShowCreateModal(false)} className="paytm-btn paytm-btn-outline">Cancel</button>
                <button type="submit" className="paytm-btn paytm-btn-primary" style={{ fontWeight: '700' }}>Generate Invoice</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Financial Overview Metrics */}
      <div className="paytm-stat-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '24px' }}>
        <div className="paytm-card" style={{ padding: '20px' }}>
          <div className="paytm-stat-label">Consultancy Revenue</div>
          <div className="paytm-stat-value" style={{ color: '#16A34A' }}>₹8,45,000</div>
          <div className="paytm-stat-desc">Fee earned to date</div>
        </div>

        <div className="paytm-card" style={{ padding: '20px' }}>
          <div className="paytm-stat-label">Outstanding Payments</div>
          <div className="paytm-stat-value" style={{ color: '#F59E0B' }}>₹1,42,000</div>
          <div className="paytm-stat-desc">Pending client receivables</div>
        </div>

        <div className="paytm-card" style={{ padding: '20px' }}>
          <div className="paytm-stat-label">Monthly Collections</div>
          <div className="paytm-stat-value" style={{ color: '#002970' }}>₹2,65,000</div>
          <div className="paytm-stat-desc">November collections</div>
        </div>

        <div className="paytm-card" style={{ padding: '20px' }}>
          <div className="paytm-stat-label">Operating Expenses</div>
          <div className="paytm-stat-value" style={{ color: '#64748B' }}>₹1,85,000</div>
          <div className="paytm-stat-desc">Staff, office &amp; tech overhead</div>
        </div>
      </div>

      {/* TAB 1: PAYMENTS */}
      {isPayments && (
        <div className="paytm-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="paytm-table-container" style={{ border: 'none' }}>
            <table className="paytm-table">
              <thead>
                <tr>
                  <th>Receipt No</th>
                  <th>Customer / Enterprise</th>
                  <th>Amount Paid</th>
                  <th>Payment Mode</th>
                  <th>Transaction Reference</th>
                  <th>Date</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {payments.map(p => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: '700', color: '#002970', fontFamily: 'monospace' }}>{p.receiptNo}</td>
                    <td style={{ fontWeight: '700', color: '#334155' }}>{p.customer}</td>
                    <td style={{ fontWeight: '800', color: '#16A34A' }}>₹{p.amount.toLocaleString('en-IN')}</td>
                    <td><span className="paytm-badge paytm-badge-sky">{p.mode}</span></td>
                    <td style={{ fontSize: '0.85rem', color: '#64748B', fontFamily: 'monospace' }}>{p.refNo}</td>
                    <td style={{ fontSize: '0.85rem', color: '#475569' }}>{p.date}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button 
                        type="button" 
                        onClick={() => showToast(`Downloading Payment Receipt ${p.receiptNo}...`, 'success')} 
                        className="paytm-btn paytm-btn-outline paytm-btn-sm"
                        style={{ color: '#008BCB', borderColor: '#00BAF2' }}
                      >
                        <Download size={14} />
                        <span>Receipt</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: QUOTATIONS */}
      {isQuotations && (
        <div className="paytm-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="paytm-table-container" style={{ border: 'none' }}>
            <table className="paytm-table">
              <thead>
                <tr>
                  <th>Quote No</th>
                  <th>Customer</th>
                  <th>Service Description</th>
                  <th>Quoted Amount</th>
                  <th>Valid Until</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {quotations.map(q => (
                  <tr key={q.id}>
                    <td style={{ fontWeight: '700', color: '#002970', fontFamily: 'monospace' }}>{q.quoteNo}</td>
                    <td style={{ fontWeight: '700', color: '#334155' }}>{q.customer}</td>
                    <td style={{ fontSize: '0.85rem', color: '#475569' }}>{q.service}</td>
                    <td style={{ fontWeight: '800', color: '#002970' }}>₹{q.amount.toLocaleString('en-IN')}</td>
                    <td style={{ fontSize: '0.85rem', color: '#64748B' }}>{q.validTill}</td>
                    <td>
                      <span className={`paytm-badge ${q.status === 'Approved' ? 'paytm-badge-success' : 'paytm-badge-warning'}`}>
                        {q.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        <a 
                          href={getApiUrl(`api/v1/generate_pdf.php?type=quotation&id=${q.quoteNo}&mode=inline`)} 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="paytm-btn paytm-btn-outline paytm-btn-sm"
                          style={{ color: '#008BCB', borderColor: '#BAE6FD', padding: '4px 8px', fontSize: '0.78rem' }}
                          title="Preview PDF"
                        >
                          <ExternalLink size={13} />
                          <span>Preview</span>
                        </a>
                        <a 
                          href={getApiUrl(`api/v1/generate_pdf.php?type=quotation&id=${q.quoteNo}&mode=download`)} 
                          className="paytm-btn paytm-btn-primary paytm-btn-sm"
                          style={{ padding: '4px 8px', fontSize: '0.78rem' }}
                          title="Download PDF"
                        >
                          <Download size={13} />
                          <span>Download</span>
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SERVICES MASTER */}
      {isServices && (
        <div className="paytm-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="paytm-table-container" style={{ border: 'none' }}>
            <table className="paytm-table">
              <thead>
                <tr>
                  <th>Service Title</th>
                  <th>Category</th>
                  <th>Professional Fee</th>
                  <th>Govt / Statutory Fee</th>
                  <th>Turnaround Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {servicesMaster.map(s => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: '700', color: '#002970' }}>{s.name}</td>
                    <td><span className="paytm-badge paytm-badge-sky">{s.category}</span></td>
                    <td style={{ fontWeight: '800', color: '#16A34A' }}>₹{s.fee.toLocaleString('en-IN')}</td>
                    <td style={{ color: '#64748B' }}>{s.govFee > 0 ? `₹${s.govFee.toLocaleString('en-IN')}` : 'Nil'}</td>
                    <td style={{ fontSize: '0.85rem', color: '#475569' }}>{s.turnaround}</td>
                    <td><span className="paytm-badge paytm-badge-success">Active &amp; Configured</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: ACCOUNTS & LEDGER */}
      {isAccounts && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="paytm-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#002970', margin: '0 0 16px 0' }}>
              Financial Profit &amp; Loss Summary (FY 2026-27)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
              <div style={{ background: '#F0FDF4', padding: '16px', borderRadius: '10px', border: '1px solid #BBF7D0' }}>
                <div style={{ fontSize: '0.8rem', color: '#166534', fontWeight: '600' }}>TOTAL CONSULTANCY INCOME</div>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#16A34A', marginTop: '6px' }}>₹8,45,000</div>
                <div style={{ fontSize: '0.75rem', color: '#166534', marginTop: '4px' }}>From 176 loan &amp; compliance files</div>
              </div>
              <div style={{ background: '#FEF2F2', padding: '16px', borderRadius: '10px', border: '1px solid #FECACA' }}>
                <div style={{ fontSize: '0.8rem', color: '#991B1B', fontWeight: '600' }}>OPERATING OVERHEAD</div>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#DC2626', marginTop: '6px' }}>₹1,85,000</div>
                <div style={{ fontSize: '0.75rem', color: '#991B1B', marginTop: '4px' }}>Staff, software, server &amp; office rent</div>
              </div>
              <div style={{ background: '#EFF6FF', padding: '16px', borderRadius: '10px', border: '1px solid #BFDBFE' }}>
                <div style={{ fontSize: '0.8rem', color: '#1E40AF', fontWeight: '600' }}>NET OPERATING SURPLUS</div>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#002970', marginTop: '6px' }}>₹6,60,000</div>
                <div style={{ fontSize: '0.75rem', color: '#1E40AF', marginTop: '4px' }}>Operating Profit Margin: 78.1%</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: MAIN INVOICES TABLE (default) */}
      {!isPayments && !isQuotations && !isServices && !isAccounts && (
        <div className="paytm-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="paytm-table-container" style={{ border: 'none' }}>
            <table className="paytm-table">
              <thead>
                <tr>
                  <th>Invoice No</th>
                  <th>Client / Enterprise</th>
                  <th>Service Rendered</th>
                  <th>Fee Subtotal</th>
                  <th>GST (18%)</th>
                  <th>Total Payable</th>
                  <th>Status</th>
                  <th>Payment Mode</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id}>
                    <td style={{ fontWeight: '700', color: '#002970', fontFamily: 'monospace' }}>
                      {inv.invoiceNo}
                    </td>
                    <td style={{ fontWeight: '700', color: '#334155' }}>
                      {inv.customer}
                    </td>
                    <td style={{ fontSize: '0.85rem', color: '#475569' }}>
                      {inv.service}
                    </td>
                    <td style={{ fontSize: '0.85rem', color: '#64748B' }}>
                      ₹{inv.subtotal.toLocaleString('en-IN')}
                    </td>
                    <td style={{ fontSize: '0.85rem', color: '#64748B' }}>
                      ₹{inv.gst.toLocaleString('en-IN')}
                    </td>
                    <td style={{ fontWeight: '800', color: '#002970' }}>
                      ₹{inv.total.toLocaleString('en-IN')}
                    </td>
                    <td>
                      <span className={`paytm-badge ${inv.status === 'Paid' ? 'paytm-badge-success' : 'paytm-badge-warning'}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.82rem', color: '#64748B' }}>
                      {inv.paymentMode}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        <a 
                          href={getApiUrl(`api/v1/generate_pdf.php?type=invoice&id=${inv.invoiceNo}&mode=inline`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="paytm-btn paytm-btn-outline paytm-btn-sm"
                          style={{ color: '#008BCB', borderColor: '#BAE6FD', padding: '4px 8px', fontSize: '0.78rem' }}
                          title="Preview PDF"
                        >
                          <ExternalLink size={13} />
                          <span>Preview</span>
                        </a>
                        <a 
                          href={getApiUrl(`api/v1/generate_pdf.php?type=invoice&id=${inv.invoiceNo}&mode=download`)}
                          className="paytm-btn paytm-btn-primary paytm-btn-sm"
                          style={{ padding: '4px 8px', fontSize: '0.78rem' }}
                          title="Download PDF"
                        >
                          <Download size={13} />
                          <span>Download</span>
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
