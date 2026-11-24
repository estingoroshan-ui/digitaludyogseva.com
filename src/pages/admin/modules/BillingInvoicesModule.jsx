import React, { useState } from 'react';
import { useRouter } from '../../../router/Router';
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
  Wallet
} from 'lucide-react';

export const BillingInvoicesModule = () => {
  const { currentPath, navigate } = useRouter();
  const { showToast } = useApp();

  const isPayments = currentPath === '/admin/payments';
  const isQuotations = currentPath === '/admin/quotations';
  const isServices = currentPath === '/admin/services';
  const isAccounts = currentPath === '/admin/accounts';

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
            onClick={() => showToast('Opening invoice builder modal...', 'success')}
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

      {/* Invoices Table */}
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
                    <button 
                      type="button"
                      onClick={() => showToast(`Generating PDF for ${inv.invoiceNo}...`, 'success')}
                      className="paytm-btn paytm-btn-outline paytm-btn-sm"
                      style={{ color: '#008BCB', borderColor: '#00BAF2' }}
                    >
                      <Download size={14} />
                      <span>PDF</span>
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
