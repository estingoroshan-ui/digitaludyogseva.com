import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { 
  Settings, 
  Package, 
  Zap, 
  TrendingUp, 
  Receipt, 
  Search, 
  CheckCircle, 
  FileText, 
  ArrowRight, 
  Plus, 
  Building2, 
  Phone, 
  BadgeCheck, 
  Sparkles,
  ShoppingBag,
  Send
} from 'lucide-react';

export const MachineryTradingHub = () => {
  const { 
    machineryCatalog, 
    tradingInquiries, 
    createMachineryOrder, 
    addTradingInquiry,
    customers,
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState('machinery'); // 'machinery' | 'raw_materials' | 'finished_goods'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMachineForOrder, setSelectedMachineForOrder] = useState(null);
  const [clientForQuote, setClientForQuote] = useState('');

  // New Raw Material Form State
  const [newMaterialName, setNewMaterialName] = useState('');
  const [newQuantity, setNewQuantity] = useState('');
  const [newBudget, setNewBudget] = useState('');
  const [newCustomerName, setNewCustomerName] = useState('');

  const handleCreateQuote = (e) => {
    e.preventDefault();
    if (!selectedMachineForOrder || !clientForQuote) return;

    createMachineryOrder({
      machineryName: selectedMachineForOrder.name,
      machineryPrice: selectedMachineForOrder.price,
      customerName: clientForQuote
    });

    setSelectedMachineForOrder(null);
    setClientForQuote('');
  };

  const handleAddTradeInquiry = (e) => {
    e.preventDefault();
    if (!newMaterialName || !newCustomerName) return;

    addTradingInquiry({
      customerName: newCustomerName,
      owner: newCustomerName,
      type: activeTab === 'raw_materials' ? 'Raw Material Procurement' : 'Finished Goods Buyer Connect',
      material: newMaterialName,
      quantity: newQuantity || 'As per requirement',
      budget: newBudget ? `₹${Number(newBudget).toLocaleString('en-IN')}` : 'Market Price'
    });

    setNewMaterialName('');
    setNewQuantity('');
    setNewBudget('');
    setNewCustomerName('');
  };

  const filteredMachinery = machineryCatalog.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.supplier.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #070e17 0%, #1e293b 60%, #0f766e 100%)',
        borderRadius: 'var(--radius-xl)',
        padding: '30px',
        color: '#fff',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: 'var(--shadow-xl)'
      }}>
        <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #0d9488, #14b8a6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <Settings size={26} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.6rem', color: '#fff', margin: 0, fontWeight: 800 }}>
                Plant, Machinery &amp; B2B Trading Hub (Cabin #05 &amp; #06)
              </h1>
              <p style={{ color: '#99f6e4', fontSize: '0.88rem', margin: 0, marginTop: '4px' }}>
                Bank Proforma Quotation Generator, Technical Machinery Sourcing, Raw Material Sourcing &amp; B2B Finished Goods Sales Connect
              </p>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-3 mt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: '18px' }}>
          <button
            onClick={() => setActiveTab('machinery')}
            className={`btn btn-sm ${activeTab === 'machinery' ? 'btn-primary' : 'btn-outline-white'}`}
          >
            <Settings size={15} />
            <span>Machinery Catalog ({machineryCatalog.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('raw_materials')}
            className={`btn btn-sm ${activeTab === 'raw_materials' ? 'btn-primary' : 'btn-outline-white'}`}
          >
            <Package size={15} />
            <span>Raw Material Sourcing Desk</span>
          </button>

          <button
            onClick={() => setActiveTab('finished_goods')}
            className={`btn btn-sm ${activeTab === 'finished_goods' ? 'btn-primary' : 'btn-outline-white'}`}
          >
            <ShoppingBag size={15} />
            <span>Finished Goods Buyer Connect</span>
          </button>
        </div>
      </div>

      {/* View 1: Machinery Catalog */}
      {activeTab === 'machinery' && (
        <>
          <div style={{ background: '#fff', padding: '18px 24px', borderRadius: 'var(--radius-xl)', border: '1px solid var(--slate-200)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '380px' }}>
              <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              <input 
                type="text" 
                className="form-control"
                style={{ paddingLeft: '36px' }}
                placeholder="Search machinery (Flour mill, Oil expeller, Paper cup...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <span style={{ fontSize: '0.85rem', color: 'var(--slate-600)', fontWeight: '600' }}>
              All machines certified bank-compliant with 35% PMEGP/PMFME Subsidy Eligibility
            </span>
          </div>

          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
            {filteredMachinery.map((mach) => (
              <div 
                key={mach.id}
                style={{
                  background: '#fff',
                  borderRadius: 'var(--radius-xl)',
                  border: '1px solid var(--slate-200)',
                  padding: '24px',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'var(--transition)'
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '3px 10px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: '700' }}>
                      {mach.category}
                    </span>

                    <span style={{ background: '#dcfce7', color: '#15803d', padding: '3px 8px', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: '800' }}>
                      {mach.subsidyEligible}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--navy-950)', marginBottom: '8px' }}>
                    {mach.name}
                  </h3>

                  <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f766e', fontFamily: 'var(--font-mono)', marginBottom: '12px' }}>
                    ₹{mach.price.toLocaleString('en-IN')}
                    <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}> + 18% GST (Tax Invoice)</span>
                  </div>

                  <p style={{ fontSize: '0.82rem', color: 'var(--slate-600)', lineHeight: 1.45, marginBottom: '14px' }}>
                    {mach.description}
                  </p>

                  {/* Technical Specs box */}
                  <div style={{ background: 'var(--slate-50)', padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--slate-200)', marginBottom: '16px' }}>
                    <div className="flex items-center justify-between mb-1" style={{ fontSize: '0.78rem' }}>
                      <span style={{ color: '#64748b' }}>Production Capacity:</span>
                      <strong style={{ color: 'var(--navy-900)' }}>{mach.capacity}</strong>
                    </div>
                    <div className="flex items-center justify-between mb-1" style={{ fontSize: '0.78rem' }}>
                      <span style={{ color: '#64748b' }}>Power Required:</span>
                      <strong style={{ color: 'var(--navy-900)' }}>{mach.power}</strong>
                    </div>
                    <div className="flex items-center justify-between" style={{ fontSize: '0.78rem' }}>
                      <span style={{ color: '#64748b' }}>OEM Supplier:</span>
                      <span style={{ color: '#2563eb', fontWeight: '700' }}>{mach.supplier}</span>
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--slate-100)', paddingTop: '14px' }}>
                  <button 
                    onClick={() => setSelectedMachineForOrder(mach)}
                    className="btn btn-primary"
                    style={{ width: '100%', fontSize: '0.88rem' }}
                  >
                    <Receipt size={16} />
                    <span>Generate Bank Proforma Invoice</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* View 2 & 3: Raw Materials & Finished Goods Trading Desk */}
      {(activeTab === 'raw_materials' || activeTab === 'finished_goods') && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Add Inquiry Form */}
          <div style={{ background: '#fff', padding: '24px', borderRadius: 'var(--radius-xl)', border: '1px solid var(--slate-200)', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--navy-950)', marginBottom: '6px' }}>
              {activeTab === 'raw_materials' ? 'Log New Bulk Raw Material Requirement' : 'Connect Readymade Product with B2B Wholesale Buyers'}
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--slate-500)', marginBottom: '16px' }}>
              Cabin #06 Trading Desk coordinates directly with verified raw material suppliers and national distributors.
            </p>

            <form onSubmit={handleAddTradeInquiry} className="grid" style={{ gridTemplateColumns: '1.2fr 1.2fr 1fr 1fr auto', gap: '14px', alignItems: 'flex-end' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--slate-600)', display: 'block', marginBottom: '4px' }}>
                  Client / Company Name *
                </label>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="e.g. Shree Ram Agro Unit"
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--slate-600)', display: 'block', marginBottom: '4px' }}>
                  {activeTab === 'raw_materials' ? 'Required Raw Material *' : 'Manufactured Product *'}
                </label>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder={activeTab === 'raw_materials' ? 'e.g. Food Grade Paper Rolls (190 GSM)' : 'e.g. 50,000 Cotton Carry Bags'}
                  value={newMaterialName}
                  onChange={(e) => setNewMaterialName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--slate-600)', display: 'block', marginBottom: '4px' }}>
                  Quantity
                </label>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="e.g. 10 Tonnes / Month"
                  value={newQuantity}
                  onChange={(e) => setNewQuantity(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--slate-600)', display: 'block', marginBottom: '4px' }}>
                  Target Budget (₹)
                </label>
                <input 
                  type="number" 
                  className="form-control"
                  placeholder="500000"
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ height: '42px', padding: '10px 18px' }}>
                <Send size={15} />
                <span>Log Deal</span>
              </button>
            </form>
          </div>

          {/* Active Inquiries Table */}
          <div style={{ background: '#fff', borderRadius: 'var(--radius-xl)', border: '1px solid var(--slate-200)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--navy-950)', marginBottom: '14px' }}>
              Active Trading &amp; Sourcing Deals (Cabin #06)
            </h3>

            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Deal #</th>
                    <th>Client Entity</th>
                    <th>Deal Type</th>
                    <th>Material / Commodity</th>
                    <th>Volume / Quantity</th>
                    <th>Approx Budget</th>
                    <th>Matched Supplier / Buyer</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {tradingInquiries.map((trd) => (
                    <tr key={trd.id}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: '700' }}>{trd.id}</td>
                      <td>
                        <div style={{ fontWeight: '700', color: 'var(--navy-900)' }}>{trd.customerName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>{trd.owner}</div>
                      </td>
                      <td>
                        <span className={`badge ${trd.type.includes('Procurement') ? 'badge-blue' : 'badge-emerald'}`} style={{ fontSize: '0.72rem' }}>
                          {trd.type}
                        </span>
                      </td>
                      <td style={{ fontWeight: '600', color: 'var(--navy-950)' }}>{trd.material}</td>
                      <td>{trd.quantity}</td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: '700' }}>{trd.budget}</td>
                      <td style={{ fontSize: '0.82rem', color: '#2563eb' }}>{trd.matchedVendor || 'Matching in progress...'}</td>
                      <td>
                        <span className="badge badge-amber" style={{ fontSize: '0.72rem' }}>
                          {trd.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Proforma Invoice Generator Modal */}
      {selectedMachineForOrder && (
        <div className="modal-overlay" onClick={() => setSelectedMachineForOrder(null)}>
          <div className="modal-card" style={{ maxWidth: '540px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header" style={{ background: 'linear-gradient(135deg, #0b1727, #0f766e)', color: '#fff' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', margin: 0, color: '#fff' }}>Generate Bank Proforma Invoice</h3>
                <span style={{ fontSize: '0.75rem', color: '#99f6e4' }}>For PMEGP / Mudra / Bank Loan Sanction</span>
              </div>
              <button onClick={() => setSelectedMachineForOrder(null)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateQuote}>
              <div className="modal-body" style={{ padding: '24px' }}>
                <div style={{ background: 'var(--slate-50)', padding: '14px', borderRadius: '10px', border: '1px solid var(--slate-200)', marginBottom: '18px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Selected Machine:</div>
                  <div style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--navy-950)' }}>{selectedMachineForOrder.name}</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f766e', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                    ₹{selectedMachineForOrder.price.toLocaleString('en-IN')} + 18% GST
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Client Name (Loan Applicant) *</label>
                  <input 
                    type="text" 
                    className="form-control"
                    placeholder="e.g. Ramesh Kumar Verma (M/s Verma Foods)"
                    value={clientForQuote}
                    onChange={(e) => setClientForQuote(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Issuing Bank Name</label>
                  <select className="form-control">
                    <option value="SBI">State Bank of India (SBI)</option>
                    <option value="PNB">Punjab National Bank (PNB)</option>
                    <option value="BOB">Bank of Baroda (BOB)</option>
                    <option value="HDFC">HDFC Bank Limited</option>
                    <option value="KVIC">KVIC / DIC Department Directly</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setSelectedMachineForOrder(null)} className="btn btn-outline btn-sm">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  <CheckCircle size={15} />
                  <span>Issue Bank Quotation</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
