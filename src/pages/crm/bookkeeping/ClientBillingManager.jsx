import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { 
  Building2, Plus, Printer, Download, Share2, Eye, FileText, 
  Trash2, CheckCircle2, User, Phone, MapPin, IndianRupee, 
  ShoppingBag, ShoppingCart, Image, Check, RefreshCw, Layers, 
  Sparkles, Sliders, ArrowRight, Smartphone, AlertCircle, 
  Truck, Package, QrCode, UploadCloud, Copy, ExternalLink
} from 'lucide-react';

export const ClientBillingManager = ({ customer }) => {
  const { showToast } = useApp();

  // Active sub-section: 'sales' | 'purchases' | 'parties' | 'daybook'
  const [activeSubTab, setActiveSubTab] = useState('sales');

  // List of Client Companies DUS manages outsourced accounts for
  const [companiesList, setCompaniesList] = useState([
    {
      id: customer?.id || 'CUST-001',
      name: customer?.name || 'Sharma Agro Solutions Pvt Ltd',
      tradeName: customer?.kycProfile?.tradeName || 'Sharma Agro Foods',
      gstin: customer?.gstin || '08AAECS1234F1Z5',
      pan: customer?.kycProfile?.pan || 'AAECS1234F',
      address: customer?.kycProfile?.registeredAddress || 'Plot 44, Agro Park Phase 2, Sitapura Industrial Area, Jaipur, RJ - 302022',
      phone: customer?.phone || '+91 94120 55890',
      email: customer?.email || 'billing@sharmaagro.in',
      bankName: 'State Bank of India (SBI), Industrial Area Branch',
      bankAccount: '389100291823',
      ifsc: 'SBIN0031821',
      billPrefix: 'SAS/2026/',
      nextBillSerial: 49
    },
    {
      id: 'CUST-002',
      name: 'Karni Steel & Infrastructure Ltd',
      tradeName: 'Karni TMT & Wire Mills',
      gstin: '08BBKPS5512L1Z9',
      pan: 'BBKPS5512L',
      address: 'F-118, RIICO Industrial Area, Bagru, Jaipur, Rajasthan - 303007',
      phone: '+91 98291 44512',
      email: 'accounts@karnisteel.in',
      bankName: 'Punjab National Bank, Bagru Branch',
      bankAccount: '19280021000192',
      ifsc: 'PUNB0192800',
      billPrefix: 'KSI/26-27/',
      nextBillSerial: 112
    },
    {
      id: 'CUST-003',
      name: 'Mewar Handloom & Organic Spices',
      tradeName: 'Mewar Organics',
      gstin: '08CCMPS8819M1Z2',
      pan: 'CCMPS8819M',
      address: 'B-4, M.I. Road, Near Panch Batti, Jaipur, Rajasthan - 302001',
      phone: '+91 97840 22190',
      email: 'sales@mewarorganics.com',
      bankName: 'Bank of Baroda, MI Road',
      bankAccount: '00120200004918',
      ifsc: 'BARB0MIROAD',
      billPrefix: 'MHO/2026/',
      nextBillSerial: 28
    }
  ]);

  // Selected Active Company
  const [selectedCompanyId, setSelectedCompanyId] = useState(customer?.id || 'CUST-001');
  const clientCompany = companiesList.find(c => c.id === selectedCompanyId) || companiesList[0];

  // Add Company Modal State
  const [showAddCompanyModal, setShowAddCompanyModal] = useState(false);
  const [newCompName, setNewCompName] = useState('');
  const [newCompTradeName, setNewCompTradeName] = useState('');
  const [newCompGstin, setNewCompGstin] = useState('');
  const [newCompPan, setNewCompPan] = useState('');
  const [newCompAddress, setNewCompAddress] = useState('');
  const [newCompPhone, setNewCompPhone] = useState('');
  const [newCompPrefix, setNewCompPrefix] = useState('BILL/2026/');
  const [newCompBank, setNewCompBank] = useState('');
  const [newCompAccount, setNewCompAccount] = useState('');
  const [newCompIfsc, setNewCompIfsc] = useState('');

  // Client's Buyers & Suppliers Directory (Parties)
  const [partiesList, setPartiesList] = useState([
    { id: 'BUY-01', name: 'Marwar Wholesale Traders', contactPerson: 'Rameshwar Ji', phone: '+91 98290 88219', city: 'Jodhpur, Rajasthan', address: 'Plot 12, Mandore Krishi Mandi, Jodhpur', gstin: '08BBNPP8821C1Z3', stateCode: '08 (Rajasthan)', type: 'Buyer' },
    { id: 'BUY-02', name: 'Kota Retail Kirana Association', contactPerson: 'Mukesh Gupta', phone: '+91 94140 12891', city: 'Kota, Rajasthan', address: 'Shop 4-5, Grain Market, Rampura, Kota', gstin: '08AACCK9912D1Z8', stateCode: '08 (Rajasthan)', type: 'Buyer' },
    { id: 'BUY-03', name: 'Delhi NCR Organics Pvt Ltd', contactPerson: 'Amitabh Sen', phone: '+91 98110 55421', city: 'New Delhi', address: 'Warehouse 9, Okhla Phase 3, New Delhi', gstin: '07AAACD7712E1Z1', stateCode: '07 (Delhi - Interstate)', type: 'Buyer' },
    { id: 'SUP-01', name: 'Kisan Agro Seed & Fertilizer Supplier', contactPerson: 'Devendra Singh', phone: '+91 97840 33112', city: 'Alwar, Rajasthan', address: 'Station Road, Alwar Industrial Area', gstin: '08AAAFK8821B1Z9', stateCode: '08 (Rajasthan)', type: 'Supplier' },
    { id: 'SUP-02', name: 'Shree Balaji Packaging & Non-Woven Bags', contactPerson: 'Suresh Agarwal', phone: '+91 94130 99412', city: 'Jaipur, Rajasthan', address: 'G-22, Sanganer Industrial Area, Jaipur', gstin: '08BBLPA4412F1Z4', stateCode: '08 (Rajasthan)', type: 'Supplier' }
  ]);

  // Sales Bills Generated on behalf of client
  const [salesBills, setSalesBills] = useState([
    { 
      id: 'SAS/2026/048', 
      date: '2026-09-04', 
      buyerName: 'Marwar Wholesale Traders', 
      buyerGstin: '08BBNPP8821C1Z3', 
      buyerAddress: 'Plot 12, Mandore Krishi Mandi, Jodhpur',
      buyerPhone: '+91 98290 88219',
      taxableAmount: 38500.00, 
      gstAmount: 1925.00, 
      totalAmount: 40425.00, 
      status: 'Paid', 
      itemsCount: 2,
      transporter: 'Jaipur Golden Transport',
      vehicleNo: 'RJ-14-GA-8821',
      lrNo: 'LR-99210',
      packages: '6 Cartons (180 Kg)',
      vaultUploaded: true,
      items: [
        { desc: 'Premium Organic Wheat Flour (Atta 50kg Bag)', hsn: '1101', qty: 20, unit: 'Bags', rate: 1400, taxRate: 5 },
        { desc: 'Cold-Pressed Mustard Oil (15 Litre Tin)', hsn: '1507', qty: 7, unit: 'Tins', rate: 1500, taxRate: 5 }
      ]
    },
    { 
      id: 'SAS/2026/047', 
      date: '2026-09-02', 
      buyerName: 'Kota Retail Kirana Association', 
      buyerGstin: '08AACCK9912D1Z8', 
      buyerAddress: 'Shop 4-5, Grain Market, Rampura, Kota',
      buyerPhone: '+91 94140 12891',
      taxableAmount: 62000.00, 
      gstAmount: 3100.00, 
      totalAmount: 65100.00, 
      status: 'Payment Pending', 
      itemsCount: 3,
      transporter: 'VRL Logistics Ltd',
      vehicleNo: 'RJ-20-EA-4192',
      lrNo: 'VRL-33190',
      packages: '12 Cartons (320 Kg)',
      vaultUploaded: true,
      items: [
        { desc: 'Organic Chana Dal (Unpolished 30kg Bag)', hsn: '0713', qty: 25, unit: 'Bags', rate: 2000, taxRate: 5 },
        { desc: 'Organic Basmati Rice (25kg Bag)', hsn: '1006', qty: 6, unit: 'Bags', rate: 2000, taxRate: 5 }
      ]
    },
    { 
      id: 'SAS/2026/046', 
      date: '2026-08-30', 
      buyerName: 'Delhi NCR Organics Pvt Ltd', 
      buyerGstin: '07AAACD7712E1Z1', 
      buyerAddress: 'Warehouse 9, Okhla Phase 3, New Delhi',
      buyerPhone: '+91 98110 55421',
      taxableAmount: 95000.00, 
      gstAmount: 4750.00, 
      totalAmount: 99750.00, 
      status: 'Paid', 
      itemsCount: 4,
      transporter: 'Safechem Cargo Carriers',
      vehicleNo: 'DL-01-AB-1920',
      lrNo: 'SCC-88129',
      packages: '20 Cartons (500 Kg)',
      vaultUploaded: true,
      items: [
        { desc: 'Cold Pressed Sesame & Groundnut Oil (15L Tin)', hsn: '1508', qty: 35, unit: 'Tins', rate: 2400, taxRate: 5 },
        { desc: 'Stone Ground Multigrain Flour (30kg)', hsn: '1101', qty: 10, unit: 'Bags', rate: 1100, taxRate: 5 }
      ]
    }
  ]);

  // Purchase Bills Inward
  const [purchaseBills, setPurchaseBills] = useState([
    { id: 'INW-892', supplierName: 'Kisan Agro Seed & Fertilizer Supplier', billNo: 'KAS/26/109', date: '2026-09-01', taxableAmount: 54000.00, gstAmount: 2700.00, totalAmount: 56700.00, itcEligible: true },
    { id: 'INW-891', supplierName: 'Shree Balaji Packaging', billNo: 'SBP/0821', date: '2026-08-28', taxableAmount: 18000.00, gstAmount: 900.00, totalAmount: 18900.00, itcEligible: true }
  ]);

  // Active Bill Preview / Modal State
  const [showBillModal, setShowBillModal] = useState(false);
  const [previewBill, setPreviewBill] = useState(null);
  const [showPhotoPreview, setShowPhotoPreview] = useState(false);

  // Bill Outer (बाहरी बिल / डिस्पैच पर्ची) Modal State
  const [showOuterModal, setShowOuterModal] = useState(false);
  const [outerBillData, setOuterBillData] = useState(null);
  const [outerTransporter, setOuterTransporter] = useState('Jaipur Golden Transport');
  const [outerVehicleNo, setOuterVehicleNo] = useState('RJ-14-GA-8821');
  const [outerLrNo, setOuterLrNo] = useState('LR-99210');
  const [outerPackages, setOuterPackages] = useState('6 Cartons (180 Kg)');
  const [outerEwayBill, setOuterEwayBill] = useState('2110 8829 4410');

  // New Party Form Modal
  const [showPartyModal, setShowPartyModal] = useState(false);
  const [partyType, setPartyType] = useState('Buyer');
  const [partyName, setPartyName] = useState('');
  const [partyContact, setPartyContact] = useState('');
  const [partyPhone, setPartyPhone] = useState('');
  const [partyCity, setPartyCity] = useState('Jaipur, Rajasthan');
  const [partyAddress, setPartyAddress] = useState('');
  const [partyGstin, setPartyGstin] = useState('');

  // New Invoice Creator State
  const [invoiceType, setInvoiceType] = useState('Tax_Invoice'); // 'Tax_Invoice' | 'Estimate_Quotation' | 'Delivery_Challan'
  const [selectedBuyerId, setSelectedBuyerId] = useState('BUY-01');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [invoiceTransporter, setInvoiceTransporter] = useState('Jaipur Golden Transport');
  const [invoiceVehicleNo, setInvoiceVehicleNo] = useState('RJ-14-GA-8821');
  const [invoiceLrNo, setInvoiceLrNo] = useState('');
  const [invoicePackages, setInvoicePackages] = useState('5 Cartons (150 Kg)');
  const [autoUploadVault, setAutoUploadVault] = useState(true);

  const [invoiceItems, setInvoiceItems] = useState([
    { desc: 'Premium Organic Wheat Flour (Atta 50kg Bag)', hsn: '1101', qty: 25, unit: 'Bags', rate: 1400, taxRate: 5 },
    { desc: 'Cold-Pressed Mustard Oil (15 Litre Tin)', hsn: '1507', qty: 10, unit: 'Tins', rate: 1850, taxRate: 5 }
  ]);

  // Calculation for New Invoice
  const subtotal = invoiceItems.reduce((acc, it) => acc + (it.qty * it.rate), 0);
  const totalTax = invoiceItems.reduce((acc, it) => acc + ((it.qty * it.rate) * (it.taxRate / 100)), 0);
  const grandTotal = Math.round(subtotal + totalTax);

  const handleAddItem = () => {
    setInvoiceItems([...invoiceItems, { desc: '', hsn: '1101', qty: 1, unit: 'Pcs', rate: 500, taxRate: 5 }]);
  };

  const handleRemoveItem = (idx) => {
    setInvoiceItems(invoiceItems.filter((_, i) => i !== idx));
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...invoiceItems];
    updated[index][field] = value;
    setInvoiceItems(updated);
  };

  // Generate, Save & Print Bill
  const handleSaveAndPrintBill = (doPrint = true) => {
    const buyer = partiesList.find(p => p.id === selectedBuyerId) || partiesList[0];
    const newBillNo = `${clientCompany.billPrefix}${String(clientCompany.nextBillSerial).padStart(3, '0')}`;
    
    const newBillObj = {
      id: newBillNo,
      date: invoiceDate,
      buyerName: buyer.name,
      buyerGstin: buyer.gstin,
      buyerAddress: buyer.address || buyer.city,
      buyerPhone: buyer.phone,
      taxableAmount: subtotal,
      gstAmount: totalTax,
      totalAmount: grandTotal,
      status: 'Payment Pending',
      itemsCount: invoiceItems.length,
      transporter: invoiceTransporter,
      vehicleNo: invoiceVehicleNo,
      lrNo: invoiceLrNo || `LR-${Math.floor(10000 + Math.random() * 90000)}`,
      packages: invoicePackages,
      vaultUploaded: autoUploadVault,
      items: [...invoiceItems],
      company: clientCompany
    };

    setSalesBills([newBillObj, ...salesBills]);

    // Increment bill serial for this company
    const updatedCompanies = companiesList.map(c => {
      if (c.id === clientCompany.id) {
        return { ...c, nextBillSerial: c.nextBillSerial + 1 };
      }
      return c;
    });
    setCompaniesList(updatedCompanies);

    // If auto upload requested, record into customer vault
    if (autoUploadVault) {
      if (customer && customer.documentsVault) {
        customer.documentsVault.unshift({
          id: `DOC-BILL-${newBillNo}`,
          name: `${invoiceType === 'Tax_Invoice' ? 'Tax Invoice' : 'Quotation'} #${newBillNo} (${buyer.name})`,
          folder: 'Invoices_Receipts',
          size: '180 KB',
          date: new Date().toLocaleDateString('en-GB'),
          verified: true
        });
      }
    }

    setShowBillModal(false);

    if (doPrint) {
      setPreviewBill(newBillObj);
      window.print();
      showToast(`✓ Bill #${newBillNo} printed & auto-uploaded to ${clientCompany.name} Document Vault!`);
    } else {
      showToast(`✓ Bill #${newBillNo} generated & saved successfully!`);
    }
  };

  // Add New Party (Buyer or Supplier)
  const handleAddPartySubmit = (e) => {
    e.preventDefault();
    if (!partyName || !partyPhone) return;

    const newParty = {
      id: `${partyType === 'Buyer' ? 'BUY' : 'SUP'}-${String(partiesList.length + 1).padStart(2, '0')}`,
      name: partyName,
      contactPerson: partyContact || partyName,
      phone: partyPhone,
      city: partyCity,
      address: partyAddress || `${partyCity}`,
      gstin: partyGstin || 'Unregistered Consumer',
      stateCode: '08 (Rajasthan)',
      type: partyType
    };

    setPartiesList([...partiesList, newParty]);
    showToast(`${partyType} "${partyName}" added to client directory!`);
    setShowPartyModal(false);
    setPartyName('');
    setPartyPhone('');
    setPartyAddress('');
    setPartyGstin('');
  };

  // Add New Client Company
  const handleAddCompanySubmit = (e) => {
    e.preventDefault();
    if (!newCompName) return;

    const newCompany = {
      id: `CUST-00${companiesList.length + 1}`,
      name: newCompName,
      tradeName: newCompTradeName || newCompName,
      gstin: newCompGstin || '08XXXXX0000X1ZX',
      pan: newCompPan || 'XXXXX0000X',
      address: newCompAddress || 'Jaipur, Rajasthan',
      phone: newCompPhone || '+91 98000 00000',
      email: 'billing@clientcorp.in',
      bankName: newCompBank || 'State Bank of India',
      bankAccount: newCompAccount || '3000129910',
      ifsc: newCompIfsc || 'SBIN0001234',
      billPrefix: newCompPrefix || `${newCompName.substring(0, 3).toUpperCase()}/2026/`,
      nextBillSerial: 1
    };

    setCompaniesList([...companiesList, newCompany]);
    setSelectedCompanyId(newCompany.id);
    setShowAddCompanyModal(false);
    showToast(`Client Company "${newCompName}" created! Bill book initialized.`);
    
    // Reset inputs
    setNewCompName('');
    setNewCompTradeName('');
    setNewCompGstin('');
    setNewCompPan('');
    setNewCompAddress('');
    setNewCompPhone('');
  };

  // Open Outer Modal for a bill
  const handleOpenOuterModal = (bill) => {
    setOuterBillData(bill);
    setOuterTransporter(bill.transporter || 'Jaipur Golden Transport');
    setOuterVehicleNo(bill.vehicleNo || 'RJ-14-GA-8821');
    setOuterLrNo(bill.lrNo || 'LR-99210');
    setOuterPackages(bill.packages || '6 Cartons (180 Kg)');
    setShowOuterModal(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: '#0b1727' }}>
      
      {/* Top Banner: Multi-Company Client Billing & Bookkeeping Command */}
      <div style={{
        background: 'linear-gradient(135deg, #0b1727 0%, #1e293b 50%, #334155 100%)',
        color: '#fff',
        padding: '20px 24px',
        borderRadius: '14px',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 8px 25px rgba(0,0,0,0.25)'
      }}>
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div style={{ flex: 1, minWidth: '280px' }}>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="badge badge-saffron" style={{ fontSize: '0.72rem' }}>
                Outsourced Billing &amp; Invoicing Desk
              </span>
              <span className="badge badge-emerald" style={{ fontSize: '0.72rem' }}>
                Active Prefix: {clientCompany.billPrefix} (Next: #{clientCompany.nextBillSerial})
              </span>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                Total Managed Companies: {companiesList.length}
              </span>
            </div>

            {/* Company Selector Switcher */}
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <Building2 size={20} color="#ff6f00" />
              <select
                value={selectedCompanyId}
                onChange={e => setSelectedCompanyId(e.target.value)}
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.25)',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  fontWeight: '800',
                  fontSize: '1.05rem',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                {companiesList.map(comp => (
                  <option key={comp.id} value={comp.id} style={{ background: '#0b1727', color: '#fff' }}>
                    🏢 {comp.name} ({comp.tradeName})
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => setShowAddCompanyModal(true)}
                className="btn btn-sm btn-outline-white"
                style={{ fontSize: '0.75rem', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}
                title="Add Another Customer Company for Bookkeeping"
              >
                <Plus size={13} /> + Add Company
              </button>
            </div>

            <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#cbd5e1' }}>
              GSTIN: <strong style={{ color: '#fff' }}>{clientCompany.gstin}</strong> • PAN: <strong>{clientCompany.pan}</strong> • {clientCompany.address}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => {
                setInvoiceType('Tax_Invoice');
                setShowBillModal(true);
              }}
              className="btn btn-sm btn-primary"
              style={{ background: 'linear-gradient(135deg, #ff6f00, #ea580c)', padding: '9px 18px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Plus size={16} />
              <span>+ Create Sale Bill</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setInvoiceType('Estimate_Quotation');
                setShowBillModal(true);
              }}
              className="btn btn-sm btn-outline-white"
              style={{ padding: '9px 14px', display: 'flex', alignItems: 'center', gap: '5px' }}
            >
              <FileText size={15} />
              <span>+ Quotation</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Monthly Bookkeeping Key Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
        <div className="card" style={{ padding: '14px 18px', borderLeft: '4px solid #10b981' }}>
          <small style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: '700' }}>Outward Sales (This Month)</small>
          <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#15803d', fontFamily: 'var(--font-mono)' }}>
            ₹{salesBills.reduce((acc, b) => acc + b.totalAmount, 0).toLocaleString('en-IN')}
          </div>
          <small style={{ color: '#64748b' }}>{salesBills.length} Bills Generated &amp; Auto-Vaulted</small>
        </div>

        <div className="card" style={{ padding: '14px 18px', borderLeft: '4px solid #3b82f6' }}>
          <small style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: '700' }}>Inward Purchases (Supplier)</small>
          <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#1e40af', fontFamily: 'var(--font-mono)' }}>
            ₹{purchaseBills.reduce((acc, b) => acc + b.totalAmount, 0).toLocaleString('en-IN')}
          </div>
          <small style={{ color: '#64748b' }}>{purchaseBills.length} Inward ITC Bills</small>
        </div>

        <div className="card" style={{ padding: '14px 18px', borderLeft: '4px solid #f59e0b' }}>
          <small style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: '700' }}>Net GST Output Payable</small>
          <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#b45309', fontFamily: 'var(--font-mono)' }}>
            ₹{(salesBills.reduce((acc, b) => acc + b.gstAmount, 0) - purchaseBills.reduce((acc, b) => acc + b.gstAmount, 0)).toFixed(2)}
          </div>
          <small style={{ color: '#64748b' }}>Sales Output minus ITC</small>
        </div>

        <div className="card" style={{ padding: '14px 18px', borderLeft: '4px solid #ff6f00' }}>
          <small style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: '700' }}>Customer Parties Directory</small>
          <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#ea580c' }}>
            {partiesList.length} Parties
          </div>
          <small style={{ color: '#64748b' }}>
            {partiesList.filter(p => p.type === 'Buyer').length} Buyers • {partiesList.filter(p => p.type === 'Supplier').length} Suppliers
          </small>
        </div>
      </div>

      {/* Sub-Navigation Switcher */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #e2e8f0', paddingBottom: '6px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'sales', label: `1. Sales Invoices & Bill Book (${salesBills.length})`, icon: ShoppingCart },
            { id: 'purchases', label: `2. Purchase Register (${purchaseBills.length})`, icon: ShoppingBag },
            { id: 'parties', label: `3. Customer's Buyers & Suppliers (${partiesList.length})`, icon: User },
            { id: 'daybook', label: '4. Monthly GST Daybook Summary', icon: Layers }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSubTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: isActive ? '800' : '600',
                  background: isActive ? '#ff6f00' : '#f1f5f9',
                  color: isActive ? '#fff' : '#475569',
                  fontSize: '0.82rem'
                }}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Quick Action: Add Party */}
        <button
          type="button"
          onClick={() => setShowPartyModal(true)}
          className="btn btn-sm btn-outline"
          style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <Plus size={13} /> + Add Buyer / Supplier Party
        </button>
      </div>

      {/* ======================================================== */}
      {/* 1. SALES INVOICES & BILL BOOK DESK                       */}
      {/* ======================================================== */}
      {activeSubTab === 'sales' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="table-wrapper">
            <table className="data-table" style={{ fontSize: '0.84rem' }}>
              <thead>
                <tr>
                  <th>Bill / Invoice No</th>
                  <th>Date</th>
                  <th>Buyer (Customer's Customer)</th>
                  <th>Buyer GSTIN</th>
                  <th style={{ textAlign: 'right' }}>Taxable Val</th>
                  <th style={{ textAlign: 'right' }}>GST</th>
                  <th style={{ textAlign: 'right' }}>Total (₹)</th>
                  <th>Vault Status</th>
                  <th style={{ textAlign: 'right' }}>1-Click Staff Actions</th>
                </tr>
              </thead>
              <tbody>
                {salesBills.map(b => (
                  <tr key={b.id}>
                    <td>
                      <strong style={{ color: '#2563eb', fontFamily: 'var(--font-mono)' }}>{b.id}</strong>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{b.itemsCount} Items</div>
                    </td>
                    <td>{b.date}</td>
                    <td>
                      <strong>{b.buyerName}</strong>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{b.buyerPhone}</div>
                    </td>
                    <td><span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>{b.buyerGstin}</span></td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>₹{b.taxableAmount.toLocaleString('en-IN')}</td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', color: '#ea580c' }}>₹{b.gstAmount.toLocaleString('en-IN')}</td>
                    <td style={{ textAlign: 'right', fontWeight: '800', fontFamily: 'var(--font-mono)', color: '#0b1727' }}>
                      ₹{b.totalAmount.toLocaleString('en-IN')}
                    </td>
                    <td>
                      {b.vaultUploaded ? (
                        <span className="badge badge-emerald" style={{ fontSize: '0.68rem', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                          <CheckCircle2 size={10} /> Vault Saved
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            b.vaultUploaded = true;
                            showToast(`Uploaded ${b.id} to Customer Document Vault!`);
                          }}
                          className="badge badge-amber"
                          style={{ cursor: 'pointer', border: 'none' }}
                        >
                          + Upload
                        </button>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="flex items-center gap-1 justify-end flex-wrap">
                        {/* 1. Print Bill */}
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewBill(b);
                            window.print();
                          }}
                          className="btn btn-sm btn-outline"
                          style={{ padding: '4px 8px', fontSize: '0.72rem' }}
                          title="Print Tax Invoice (A4)"
                        >
                          <Printer size={12} /> Bill
                        </button>

                        {/* 2. Bill Outer / Dispatch Slip (User Explicit Request) */}
                        <button
                          type="button"
                          onClick={() => handleOpenOuterModal(b)}
                          className="btn btn-sm btn-outline"
                          style={{ padding: '4px 8px', fontSize: '0.72rem', color: '#d97706', borderColor: '#fcd34d', background: '#fffbeb' }}
                          title="Download / Print Bill Outer (बाहरी बिल / डिस्पैच पर्ची)"
                        >
                          <Truck size={12} /> Outer
                        </button>

                        {/* 3. Export Photo / WhatsApp Card */}
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewBill(b);
                            setShowPhotoPreview(true);
                          }}
                          className="btn btn-sm btn-outline"
                          style={{ padding: '4px 8px', fontSize: '0.72rem', color: '#059669', borderColor: '#86efac', background: '#f0fdf4' }}
                          title="Export as Photo Card for WhatsApp"
                        >
                          <Image size={12} /> Photo
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. PURCHASE REGISTER DESK                                */}
      {/* ======================================================== */}
      {activeSubTab === 'purchases' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="table-wrapper">
            <table className="data-table" style={{ fontSize: '0.85rem' }}>
              <thead>
                <tr>
                  <th>Entry Ref</th>
                  <th>Supplier / Vendor</th>
                  <th>Supplier Bill No</th>
                  <th>Date</th>
                  <th style={{ textAlign: 'right' }}>Taxable Val</th>
                  <th style={{ textAlign: 'right' }}>Input Tax (ITC)</th>
                  <th style={{ textAlign: 'right' }}>Total Bill</th>
                  <th>ITC Status</th>
                </tr>
              </thead>
              <tbody>
                {purchaseBills.map(p => (
                  <tr key={p.id}>
                    <td><span className="badge badge-blue">{p.id}</span></td>
                    <td><strong>{p.supplierName}</strong></td>
                    <td><strong style={{ fontFamily: 'var(--font-mono)' }}>{p.billNo}</strong></td>
                    <td>{p.date}</td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>₹{p.taxableAmount.toLocaleString('en-IN')}</td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', color: '#15803d' }}>₹{p.gstAmount.toLocaleString('en-IN')}</td>
                    <td style={{ textAlign: 'right', fontWeight: '800', fontFamily: 'var(--font-mono)' }}>₹{p.totalAmount.toLocaleString('en-IN')}</td>
                    <td><span className="badge badge-emerald">✓ 100% ITC Eligible</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. CLIENT'S PARTIES DIRECTORY (BUYERS & SUPPLIERS)       */}
      {/* ======================================================== */}
      {activeSubTab === 'parties' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          {partiesList.map(p => (
            <div key={p.id} className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className={`badge ${p.type === 'Buyer' ? 'badge-emerald' : 'badge-blue'}`}>{p.type}</span>
                  <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: '#64748b' }}>{p.id}</span>
                </div>
                <h4 style={{ fontSize: '1rem', margin: '0 0 4px', color: '#0b1727' }}>{p.name}</h4>
                <div style={{ fontSize: '0.82rem', color: '#475569' }}>👤 {p.contactPerson} • 📞 {p.phone}</div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>📍 {p.address || p.city}</div>
                <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', background: '#f8fafc', padding: '3px 6px', borderRadius: '4px', marginTop: '6px' }}>
                  GSTIN: {p.gstin}
                </div>
              </div>

              <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedBuyerId(p.id);
                    setShowBillModal(true);
                  }}
                  className="btn btn-sm btn-primary"
                  style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                >
                  + Create Bill / Quotation
                </button>
                <button
                  type="button"
                  onClick={() => showToast(`Party statement opened for ${p.name}`)}
                  className="btn btn-sm btn-outline"
                  style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                >
                  Ledger
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. DAYBOOK & MONTHLY GST SUMMARY                         */}
      {/* ======================================================== */}
      {activeSubTab === 'daybook' && (
        <div style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '22px' }}>
          <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
            <div>
              <h4 style={{ fontSize: '1.1rem', margin: 0 }}>Monthly GSTR-1 &amp; 3B Readiness Summary</h4>
              <small style={{ color: '#64748b' }}>Outsourced records for {clientCompany.name}</small>
            </div>
            <button onClick={() => showToast('GSTR-1 JSON Payload exported for filing!')} className="btn btn-sm btn-primary">
              Export GSTR-1 JSON
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#15803d', marginBottom: '8px' }}>
                OUTWARD TAXABLE SALES (GSTR-1 Table 4 &amp; 5)
              </div>
              <div className="flex justify-between py-1 border-b text-sm">
                <span>B2B Registered Taxable Sales:</span>
                <strong>₹{salesBills.reduce((acc, b) => acc + b.taxableAmount, 0).toLocaleString('en-IN')}</strong>
              </div>
              <div className="flex justify-between py-1 text-sm font-bold text-emerald-700">
                <span>Output CGST (2.5%) + SGST (2.5%):</span>
                <span>₹{salesBills.reduce((acc, b) => acc + b.gstAmount, 0).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#1e40af', marginBottom: '8px' }}>
                INWARD TAXABLE PURCHASES (GSTR-3B Table 4 ITC)
              </div>
              <div className="flex justify-between py-1 border-b text-sm">
                <span>Eligible B2B Input Purchases:</span>
                <strong>₹{purchaseBills.reduce((acc, b) => acc + b.taxableAmount, 0).toLocaleString('en-IN')}</strong>
              </div>
              <div className="flex justify-between py-1 text-sm font-bold text-blue-700">
                <span>Input Tax Credit (ITC Available):</span>
                <span>₹{purchaseBills.reduce((acc, b) => acc + b.gstAmount, 0).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: CREATE NEW SALE INVOICE / QUOTATION                */}
      {/* ======================================================== */}
      {showBillModal && (
        <div className="modal-overlay" style={{ zIndex: 1100 }} onClick={() => setShowBillModal(false)}>
          <div className="modal-card" style={{ maxWidth: '840px', padding: 0, overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
            <div style={{ background: '#0b1727', color: '#fff', padding: '16px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.15rem' }}>Create Client Invoice / Quotation</h4>
                <small style={{ color: '#94a3b8' }}>Generating on behalf of {clientCompany.name}</small>
              </div>
              <button onClick={() => setShowBillModal(false)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ padding: '20px', maxHeight: '72vh', overflowY: 'auto' }}>
              {/* Type, Buyer & Date */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Document Type</label>
                  <select value={invoiceType} onChange={e => setInvoiceType(e.target.value)} className="input input-sm w-full">
                    <option value="Tax_Invoice">Tax Invoice (GST B2B)</option>
                    <option value="Estimate_Quotation">Estimate / Quotation</option>
                    <option value="Delivery_Challan">Delivery Challan / Dispatch</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-600">Select Buyer / Customer Party</label>
                    <button
                      type="button"
                      onClick={() => setShowPartyModal(true)}
                      style={{ background: 'none', border: 'none', color: '#ff6f00', fontSize: '0.72rem', fontWeight: '700', cursor: 'pointer' }}
                    >
                      + Quick Add Party
                    </button>
                  </div>
                  <select value={selectedBuyerId} onChange={e => setSelectedBuyerId(e.target.value)} className="input input-sm w-full">
                    {partiesList.filter(p => p.type === 'Buyer').map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.city})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Invoice Date</label>
                  <input type="date" value={invoiceDate} onChange={e => setInvoiceDate(e.target.value)} className="input input-sm w-full" />
                </div>
              </div>

              {/* Transport / Outer Slip Details */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: '800', color: '#475569', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Truck size={14} color="#ff6f00" />
                  <span>Transport &amp; Bill Outer Info (डिस्पैच / ट्रांसपोर्ट विवरण)</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1.2fr', gap: '10px' }}>
                  <div>
                    <label className="text-xs text-slate-500 block">Transporter Name</label>
                    <input type="text" value={invoiceTransporter} onChange={e => setInvoiceTransporter(e.target.value)} placeholder="Jaipur Golden Transport" className="input input-sm w-full" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 block">Vehicle / Lorry No</label>
                    <input type="text" value={invoiceVehicleNo} onChange={e => setInvoiceVehicleNo(e.target.value)} placeholder="RJ-14-GA-8821" className="input input-sm w-full" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 block">Bilty / LR No</label>
                    <input type="text" value={invoiceLrNo} onChange={e => setInvoiceLrNo(e.target.value)} placeholder="Optional" className="input input-sm w-full" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 block">Packages &amp; Weight</label>
                    <input type="text" value={invoicePackages} onChange={e => setInvoicePackages(e.target.value)} placeholder="e.g. 5 Cartons (150 Kg)" className="input input-sm w-full" />
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div style={{ marginBottom: '16px' }}>
                <div className="flex justify-between items-center mb-2">
                  <strong style={{ fontSize: '0.88rem' }}>Line Items &amp; Products:</strong>
                  <button type="button" onClick={handleAddItem} className="btn btn-sm btn-outline" style={{ fontSize: '0.72rem' }}>
                    + Add Item Line
                  </button>
                </div>

                <div className="table-wrapper">
                  <table className="data-table" style={{ fontSize: '0.82rem' }}>
                    <thead>
                      <tr>
                        <th>Item Description</th>
                        <th>HSN</th>
                        <th style={{ width: '70px' }}>Qty</th>
                        <th style={{ width: '80px' }}>Unit</th>
                        <th style={{ width: '90px' }}>Rate (₹)</th>
                        <th style={{ width: '70px' }}>GST %</th>
                        <th style={{ textAlign: 'right' }}>Total (₹)</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoiceItems.map((it, idx) => (
                        <tr key={idx}>
                          <td>
                            <input
                              type="text"
                              value={it.desc}
                              onChange={e => handleItemChange(idx, 'desc', e.target.value)}
                              placeholder="e.g. Wheat Flour Bag"
                              className="input input-sm w-full"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={it.hsn}
                              onChange={e => handleItemChange(idx, 'hsn', e.target.value)}
                              className="input input-sm"
                              style={{ width: '60px' }}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={it.qty}
                              onChange={e => handleItemChange(idx, 'qty', Number(e.target.value))}
                              className="input input-sm"
                              style={{ width: '60px' }}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={it.unit}
                              onChange={e => handleItemChange(idx, 'unit', e.target.value)}
                              className="input input-sm"
                              style={{ width: '70px' }}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={it.rate}
                              onChange={e => handleItemChange(idx, 'rate', Number(e.target.value))}
                              className="input input-sm"
                              style={{ width: '80px' }}
                            />
                          </td>
                          <td>
                            <select
                              value={it.taxRate}
                              onChange={e => handleItemChange(idx, 'taxRate', Number(e.target.value))}
                              className="input input-sm"
                              style={{ width: '60px' }}
                            >
                              <option value="0">0%</option>
                              <option value="5">5%</option>
                              <option value="12">12%</option>
                              <option value="18">18%</option>
                            </select>
                          </td>
                          <td style={{ textAlign: 'right', fontWeight: '700', fontFamily: 'var(--font-mono)' }}>
                            ₹{Math.round((it.qty * it.rate) * (1 + it.taxRate / 100)).toLocaleString('en-IN')}
                          </td>
                          <td>
                            {invoiceItems.length > 1 && (
                              <button type="button" onClick={() => handleRemoveItem(idx)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                                <Trash2 size={14} />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Total Summary & Auto-Save Checkbox */}
              <div style={{ background: '#f8fafc', padding: '14px 18px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    Series: <strong>{clientCompany.billPrefix}{String(clientCompany.nextBillSerial).padStart(3, '0')}</strong> • State of Supply: Rajasthan (08)
                  </div>
                  <label className="flex items-center gap-2 mt-1 cursor-pointer" style={{ fontSize: '0.78rem', color: '#059669', fontWeight: '700' }}>
                    <input
                      type="checkbox"
                      checked={autoUploadVault}
                      onChange={e => setAutoUploadVault(e.target.checked)}
                    />
                    <span>Auto-Save &amp; Upload to Client Document Vault (क्लाइंट वॉल्ट में सुरक्षित रखें)</span>
                  </label>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.82rem', color: '#64748b' }}>Subtotal: ₹{subtotal.toFixed(2)} | GST: ₹{totalTax.toFixed(2)}</div>
                  <div style={{ fontSize: '1.35rem', fontWeight: '900', color: '#0b1727', fontFamily: 'var(--font-mono)' }}>
                    Grand Total: ₹{grandTotal.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '14px 20px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <button onClick={() => setShowBillModal(false)} className="btn btn-outline btn-sm">Cancel</button>
              
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleSaveAndPrintBill(false)}
                  className="btn btn-sm btn-outline"
                >
                  Save Bill Only
                </button>

                <button
                  type="button"
                  onClick={() => handleSaveAndPrintBill(true)}
                  className="btn btn-sm btn-primary"
                  style={{ background: 'linear-gradient(135deg, #059669, #10b981)', display: 'flex', alignItems: 'center', gap: '5px' }}
                >
                  <Printer size={14} />
                  <span>Generate, Auto-Save &amp; Print</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: BILL OUTER / DISPATCH CONSIGNMENT SLIP            */}
      {/* (User Explicit Request: "staff Ko download karke        */}
      {/*  bil outer banaa kar de deta hai")                       */}
      {/* ======================================================== */}
      {showOuterModal && outerBillData && (
        <div className="modal-overlay" style={{ zIndex: 1100 }} onClick={() => setShowOuterModal(false)}>
          <div className="modal-card" style={{ maxWidth: '620px', padding: 0, overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
            <div style={{ background: '#d97706', color: '#fff', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="flex items-center gap-2">
                <Package size={20} />
                <div>
                  <strong style={{ fontSize: '1rem' }}>Bill Outer / Dispatch Consignment Slip</strong>
                  <div style={{ fontSize: '0.72rem', color: '#fef3c7' }}>बाहरी बिल / पार्सल डिलीवरी चालान पर्ची</div>
                </div>
              </div>
              <button onClick={() => setShowOuterModal(false)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ padding: '20px', background: '#f8fafc' }}>
              {/* Printable Outer Slip Card */}
              <div style={{
                background: '#fff',
                border: '2px dashed #0b1727',
                borderRadius: '10px',
                padding: '18px',
                color: '#0b1727'
              }}>
                {/* Outer Header */}
                <div style={{ borderBottom: '2px solid #0b1727', paddingBottom: '10px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span className="badge badge-amber" style={{ fontSize: '0.7rem', fontWeight: '900', textTransform: 'uppercase' }}>
                      CONSIGNMENT OUTER SLIP
                    </span>
                    <h3 style={{ fontSize: '1.2rem', margin: '3px 0 0', fontWeight: '900' }}>
                      {clientCompany.name}
                    </h3>
                    <div style={{ fontSize: '0.75rem', color: '#475569' }}>
                      GSTIN: <strong>{clientCompany.gstin}</strong> • Phone: {clientCompany.phone}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Invoice / Bill Ref</div>
                    <strong style={{ fontSize: '1.1rem', fontFamily: 'var(--font-mono)', color: '#2563eb' }}>
                      {outerBillData.id}
                    </strong>
                    <div style={{ fontSize: '0.72rem', color: '#475569' }}>Date: {outerBillData.date}</div>
                  </div>
                </div>

                {/* Consignee / Deliver To */}
                <div style={{ background: '#f1f5f9', padding: '12px', borderRadius: '8px', marginBottom: '14px', borderLeft: '4px solid #ff6f00' }}>
                  <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#ff6f00', fontWeight: '800' }}>
                    DELIVER TO (कस्टमर का खरीदार):
                  </div>
                  <h4 style={{ fontSize: '1.05rem', margin: '2px 0 2px', fontWeight: '900' }}>
                    {outerBillData.buyerName}
                  </h4>
                  <div style={{ fontSize: '0.82rem', color: '#334155' }}>
                    📍 {outerBillData.buyerAddress}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: '3px' }}>
                    📞 Contact: <strong>{outerBillData.buyerPhone}</strong> • GSTIN: <strong>{outerBillData.buyerGstin}</strong>
                  </div>
                </div>

                {/* Transporter & Logistics Details */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px', fontSize: '0.8rem' }}>
                  <div style={{ background: '#fff', border: '1px solid #cbd5e1', padding: '8px 10px', borderRadius: '6px' }}>
                    <span style={{ color: '#64748b', fontSize: '0.7rem' }}>Transporter / Courier:</span>
                    <div style={{ fontWeight: '700' }}>{outerTransporter}</div>
                  </div>

                  <div style={{ background: '#fff', border: '1px solid #cbd5e1', padding: '8px 10px', borderRadius: '6px' }}>
                    <span style={{ color: '#64748b', fontSize: '0.7rem' }}>Vehicle / Lorry No:</span>
                    <div style={{ fontWeight: '700', fontFamily: 'var(--font-mono)' }}>{outerVehicleNo}</div>
                  </div>

                  <div style={{ background: '#fff', border: '1px solid #cbd5e1', padding: '8px 10px', borderRadius: '6px' }}>
                    <span style={{ color: '#64748b', fontSize: '0.7rem' }}>Bilty / LR Number:</span>
                    <div style={{ fontWeight: '700', fontFamily: 'var(--font-mono)' }}>{outerLrNo}</div>
                  </div>

                  <div style={{ background: '#fff', border: '1px solid #cbd5e1', padding: '8px 10px', borderRadius: '6px' }}>
                    <span style={{ color: '#64748b', fontSize: '0.7rem' }}>Packages &amp; Gross Weight:</span>
                    <div style={{ fontWeight: '700' }}>{outerPackages}</div>
                  </div>
                </div>

                {/* Amount & Barcode Strip */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '10px' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Consignment Value</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#15803d', fontFamily: 'var(--font-mono)' }}>
                      ₹{outerBillData.totalAmount.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ fontSize: '0.68rem', color: '#64748b', textAlign: 'right' }}>
                      Scan for Digital Delivery<br/>Proof &amp; E-Way Bill
                    </div>
                    <div style={{ background: '#0b1727', color: '#fff', padding: '6px', borderRadius: '6px' }}>
                      <QrCode size={28} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer with 1-Click Download / Print Outer */}
            <div style={{ padding: '12px 18px', background: '#fff', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={() => setShowOuterModal(false)} className="btn btn-outline btn-sm">Close</button>
              
              <button
                type="button"
                onClick={() => {
                  window.print();
                  showToast(`Bill Outer for ${outerBillData.id} printed successfully!`);
                }}
                className="btn btn-sm btn-primary"
                style={{ background: '#d97706', display: 'flex', alignItems: 'center', gap: '5px' }}
              >
                <Printer size={14} /> Download &amp; Print Bill Outer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: EXPORT PHOTO CARD FOR WHATSAPP                    */}
      {/* ======================================================== */}
      {showPhotoPreview && previewBill && (
        <div className="modal-overlay" style={{ zIndex: 1100 }} onClick={() => setShowPhotoPreview(false)}>
          <div className="modal-card" style={{ maxWidth: '420px', padding: 0, overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
            <div style={{ background: '#075e54', color: '#fff', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="flex items-center gap-2">
                <Smartphone size={18} />
                <strong style={{ fontSize: '0.95rem' }}>WhatsApp Invoice Card Preview</strong>
              </div>
              <button onClick={() => setShowPhotoPreview(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>✕</button>
            </div>

            {/* Simulated Clean Photo Card for WhatsApp sharing */}
            <div style={{ padding: '20px', background: '#e5ddd5' }}>
              <div style={{ background: '#fff', borderRadius: '12px', padding: '18px', boxShadow: '0 4px 14px rgba(0,0,0,0.15)', color: '#0b1727' }}>
                <div style={{ borderBottom: '2px solid #075e54', paddingBottom: '8px', marginBottom: '12px' }}>
                  <div style={{ fontSize: '0.72rem', color: '#075e54', fontWeight: '800', textTransform: 'uppercase' }}>Tax Invoice</div>
                  <h4 style={{ fontSize: '1.1rem', margin: '2px 0 0', color: '#0b1727' }}>{clientCompany.name}</h4>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>GSTIN: {clientCompany.gstin}</div>
                </div>

                <div style={{ fontSize: '0.8rem', marginBottom: '10px' }}>
                  <div>Invoice No: <strong>{previewBill.id}</strong></div>
                  <div>Date: <strong>{previewBill.date}</strong></div>
                  <div>Buyer: <strong>{previewBill.buyerName}</strong></div>
                </div>

                <div style={{ background: '#f8fafc', padding: '8px 12px', borderRadius: '6px', marginBottom: '12px', fontSize: '0.82rem' }}>
                  <div className="flex justify-between mb-1">
                    <span>Taxable Amount:</span>
                    <strong>₹{previewBill.taxableAmount.toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span>GST:</span>
                    <strong>₹{previewBill.gstAmount.toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="flex justify-between border-t pt-1 font-bold text-base text-emerald-800">
                    <span>Grand Total:</span>
                    <span>₹{previewBill.totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div style={{ fontSize: '0.72rem', color: '#64748b', textAlign: 'center', borderTop: '1px dashed #cbd5e1', paddingTop: '8px' }}>
                  Bank: {clientCompany.bankName}<br/>
                  A/c: {clientCompany.bankAccount} • IFSC: {clientCompany.ifsc}
                </div>
              </div>
            </div>

            <div style={{ padding: '12px 18px', background: '#fff', display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={() => setShowPhotoPreview(false)} className="btn btn-outline btn-sm">Close</button>
              <a
                href={`https://wa.me/?text=Namaste,%20Invoice%20${encodeURIComponent(previewBill.id)}%20for%20Rs.%20${previewBill.totalAmount}%20from%20${encodeURIComponent(clientCompany.name)}.`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-sm btn-primary"
                style={{ background: '#25d366', color: '#fff', display: 'flex', alignItems: 'center', gap: '5px' }}
              >
                <Share2 size={14} /> Send on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD NEW CLIENT COMPANY (MULTIPLE CUSTOMER SYSTEM) */}
      {/* ======================================================== */}
      {showAddCompanyModal && (
        <div className="modal-overlay" style={{ zIndex: 1100 }} onClick={() => setShowAddCompanyModal(false)}>
          <div className="modal-card" style={{ maxWidth: '520px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h4 style={{ fontSize: '1.1rem', margin: 0 }}>Add New Client Company for Bookkeeping</h4>
              <button onClick={() => setShowAddCompanyModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleAddCompanySubmit}>
              <div className="modal-body">
                <div className="form-group mb-3">
                  <label className="form-label">Company / Firm Legal Name *</label>
                  <input type="text" required placeholder="e.g. Agarwal Trading Corporation" className="form-control" value={newCompName} onChange={e => setNewCompName(e.target.value)} />
                </div>

                <div className="form-group mb-3">
                  <label className="form-label">Trade / Brand Name</label>
                  <input type="text" placeholder="e.g. Agarwal Oils & Grains" className="form-control" value={newCompTradeName} onChange={e => setNewCompTradeName(e.target.value)} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                  <div>
                    <label className="form-label">GSTIN</label>
                    <input type="text" placeholder="08AAAAA0000A1Z5" className="form-control" value={newCompGstin} onChange={e => setNewCompGstin(e.target.value)} />
                  </div>
                  <div>
                    <label className="form-label">PAN Number</label>
                    <input type="text" placeholder="AAAAA0000A" className="form-control" value={newCompPan} onChange={e => setNewCompPan(e.target.value)} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                  <div>
                    <label className="form-label">Bill Series Prefix *</label>
                    <input type="text" required placeholder="e.g. ATC/2026/" className="form-control" value={newCompPrefix} onChange={e => setNewCompPrefix(e.target.value)} />
                  </div>
                  <div>
                    <label className="form-label">Contact Phone *</label>
                    <input type="tel" required placeholder="+91 98290..." className="form-control" value={newCompPhone} onChange={e => setNewCompPhone(e.target.value)} />
                  </div>
                </div>

                <div className="form-group mb-3">
                  <label className="form-label">Registered Office Address</label>
                  <input type="text" placeholder="Industrial Area, Jaipur" className="form-control" value={newCompAddress} onChange={e => setNewCompAddress(e.target.value)} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                  <div>
                    <label className="form-label">Bank Name</label>
                    <input type="text" placeholder="SBI Bank" className="form-control" value={newCompBank} onChange={e => setNewCompBank(e.target.value)} />
                  </div>
                  <div>
                    <label className="form-label">Account No</label>
                    <input type="text" placeholder="389100..." className="form-control" value={newCompAccount} onChange={e => setNewCompAccount(e.target.value)} />
                  </div>
                  <div>
                    <label className="form-label">IFSC Code</label>
                    <input type="text" placeholder="SBIN003..." className="form-control" value={newCompIfsc} onChange={e => setNewCompIfsc(e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setShowAddCompanyModal(false)} className="btn btn-outline btn-sm">Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm">Save Client Company</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD NEW PARTY (BUYER / SUPPLIER)                  */}
      {/* ======================================================== */}
      {showPartyModal && (
        <div className="modal-overlay" style={{ zIndex: 1100 }} onClick={() => setShowPartyModal(false)}>
          <div className="modal-card" style={{ maxWidth: '460px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h4 style={{ fontSize: '1.1rem', margin: 0 }}>Add Party to {clientCompany.name} Directory</h4>
              <button onClick={() => setShowPartyModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleAddPartySubmit}>
              <div className="modal-body">
                <div className="form-group mb-3">
                  <label className="form-label">Party Type *</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="ptype" value="Buyer" checked={partyType === 'Buyer'} onChange={() => setPartyType('Buyer')} />
                      <span>Buyer (कस्टमर का ग्राहक)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="ptype" value="Supplier" checked={partyType === 'Supplier'} onChange={() => setPartyType('Supplier')} />
                      <span>Supplier (सप्लायर / वेंडर)</span>
                    </label>
                  </div>
                </div>

                <div className="form-group mb-3">
                  <label className="form-label">Business / Shop Name *</label>
                  <input type="text" required placeholder="e.g. Marwar Retail Mart" className="form-control" value={partyName} onChange={e => setPartyName(e.target.value)} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                  <div>
                    <label className="form-label">Contact Person</label>
                    <input type="text" placeholder="Owner Name" className="form-control" value={partyContact} onChange={e => setPartyContact(e.target.value)} />
                  </div>
                  <div>
                    <label className="form-label">Mobile Number *</label>
                    <input type="tel" required placeholder="+91 98290..." className="form-control" value={partyPhone} onChange={e => setPartyPhone(e.target.value)} />
                  </div>
                </div>

                <div className="form-group mb-3">
                  <label className="form-label">City / State</label>
                  <input type="text" placeholder="Jaipur, Rajasthan" className="form-control" value={partyCity} onChange={e => setPartyCity(e.target.value)} />
                </div>

                <div className="form-group mb-3">
                  <label className="form-label">Full Delivery / Dispatch Address</label>
                  <input type="text" placeholder="Plot 12, Krishi Mandi Road..." className="form-control" value={partyAddress} onChange={e => setPartyAddress(e.target.value)} />
                </div>

                <div className="form-group mb-3">
                  <label className="form-label">GSTIN (Optional)</label>
                  <input type="text" placeholder="08AAAAA0000A1Z5" className="form-control" value={partyGstin} onChange={e => setPartyGstin(e.target.value)} />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setShowPartyModal(false)} className="btn btn-outline btn-sm">Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm">Save Party</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
