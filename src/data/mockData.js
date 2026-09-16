// Master Data for Digital Udyog Seva Enterprise CRM
export * from './lead360MockData';
export * from './businessHubMockData';

export const popularServices = [
  {
    id: 'pvt-ltd',
    name: 'Private Limited Company Registration',
    category: 'Business Registration',
    badge: 'Most Popular',
    price: '₹4,999',
    rawPrice: 4999,
    time: '7-10 Working Days',
    desc: 'Complete company incorporation with MCA, SPICe+ filing, Name Approval, 2 DINs, DSCs, PAN, TAN and Bank Account.',
    docs: ['PAN Card & Aadhaar of Directors', 'Passport Size Photographs', 'Electricity Bill of Registered Office', 'Bank Statement / Cancelled Cheque']
  },
  {
    id: 'gst-reg',
    name: 'GST Registration & Return Filing',
    category: 'Tax & Compliance',
    badge: 'Fast Track',
    price: '₹999',
    rawPrice: 999,
    time: '3-5 Working Days',
    desc: 'Guaranteed GSTIN generation with free filing assistance for first month. Zero hassle documentation.',
    docs: ['PAN Card of Business / Proprietor', 'Aadhaar Card', 'Proof of Business Address', 'Bank Statement with IFSC']
  },
  {
    id: 'udyam-msme',
    name: 'Udyam / MSME Registration',
    category: 'Govt Registration',
    badge: 'Govt Subsidy Eligible',
    price: '₹499',
    rawPrice: 499,
    time: '24-48 Hours',
    desc: 'Unlock government subsidies, priority bank lending, collateral-free loans, and exemption on trademark fees.',
    docs: ['Aadhaar linked with Mobile', 'PAN Card', 'Business Activity Details', 'Bank Account Number']
  },
  {
    id: 'trademark',
    name: 'Trademark Registration (™)',
    category: 'Intellectual Property',
    badge: 'Brand Protection',
    price: '₹1,999',
    rawPrice: 1999,
    time: '1 Day for Filing',
    desc: 'Protect your brand name, logo, or slogan nationwide. Comprehensive search report included.',
    docs: ['Brand Logo / Name', 'Applicant Identity Proof', 'Power of Attorney (Form 48)', 'User Affidavit if prior use']
  },
  {
    id: 'itr-filing',
    name: 'Income Tax Return (ITR) Filing',
    category: 'Tax & Compliance',
    badge: 'Expert CA Assisted',
    price: '₹799',
    rawPrice: 799,
    time: '1-2 Days',
    desc: 'ITR-1 to ITR-4 filing for salaried professionals, businesses, and freelancers with maximum refund optimization.',
    docs: ['Form 16 / Form 16A', 'Bank Statements (Full Year)', 'Investment Proofs (80C/80D)', 'Aadhaar & PAN']
  },
  {
    id: 'fssai-license',
    name: 'FSSAI Food Safety License',
    category: 'Licensing',
    badge: '14-Digit FoSCoS',
    price: '₹1,499',
    rawPrice: 1499,
    time: '5-7 Days',
    desc: 'Mandatory license for restaurants, food manufacturers, cloud kitchens, retail shops, and traders.',
    docs: ['Photo ID of Food Operator', 'Premises Rent Agreement / Bill', 'Food Category List', 'Partnership Deed / Incorporation']
  },
  {
    id: 'pmegp-dpr',
    name: 'PMEGP Detailed Project Report (DPR)',
    category: 'Loan & DPR',
    badge: 'High Bank Approval',
    price: '₹3,499',
    rawPrice: 3499,
    time: '3-4 Days',
    desc: 'Bank-compliant CMA data and 5-year financial projections tailored for KVIC & MSME loan sanctions.',
    docs: ['Quotation of Machinery / Civil Works', 'Promoter Profile & KYC', 'Educational Qualification Certificate', 'Project Site Details']
  },
  {
    id: 'iso-cert',
    name: 'ISO 9001:2015 Certification',
    category: 'Certification',
    badge: 'Tender Friendly',
    price: '₹2,999',
    rawPrice: 2999,
    time: '3 Working Days',
    desc: 'Boost your business credibility and qualify for government tenders and international contracts.',
    docs: ['Business Registration Proof', 'Organization Chart', 'Sample Invoice / Letterhead', 'Scope of Activity']
  }
];

export const loanSchemes = [
  {
    id: 'pmegp',
    name: 'PMEGP Govt Loan Scheme',
    tagline: 'Prime Minister Employment Generation Programme',
    maxAmount: '₹50 Lakhs',
    subsidy: '15% to 35% Capital Subsidy',
    interestRate: '8.5% - 11.5%',
    tenure: 'Up to 7 Years',
    type: 'Government Sponsored',
    benefits: ['Subsidized loan by KVIC', 'Own contribution only 5% to 10%', 'Both manufacturing & service units eligible']
  },
  {
    id: 'mudra',
    name: 'Pradhan Mantri Mudra Yojana (PMMY)',
    tagline: 'Collateral-Free Micro Enterprise Finance',
    maxAmount: '₹10 Lakhs',
    subsidy: '0% Collateral / Zero Security',
    interestRate: '9.0% - 12.0%',
    tenure: 'Up to 5 Years',
    type: 'Collateral-Free',
    benefits: ['Shishu (up to ₹50,000)', 'Kishore (₹50k to ₹5 Lakhs)', 'Tarun (₹5 Lakhs to ₹10 Lakhs)']
  },
  {
    id: 'cgtmse',
    name: 'MSME Collateral-Free Business Loan',
    tagline: 'Credit Guarantee Fund Trust for Micro & Small Enterprises',
    maxAmount: '₹2 Crores',
    subsidy: 'Govt Guarantee up to 85%',
    interestRate: '9.5% - 13.0%',
    tenure: 'Up to 7 Years',
    type: 'Commercial MSME',
    benefits: ['No third-party guarantee needed', 'Fast track processing', 'Working capital & term loan options']
  },
  {
    id: 'lap',
    name: 'Loan Against Property (LAP)',
    tagline: 'High Value Capital with Lowest Interest',
    maxAmount: '₹10 Crores',
    subsidy: 'Lowest ROI in Market',
    interestRate: '8.25% - 10.5%',
    tenure: 'Up to 15 Years',
    type: 'Secured Loan',
    benefits: ['Lowest monthly EMI', 'Commercial or residential property accepted', 'Quick liquidity for expansion']
  }
];

export const sampleApplications = {
  'DUS-2026-8942': {
    id: 'DUS-2026-8942',
    clientName: 'Sunil Kumar Sharma',
    businessName: 'Sharma Agro Solutions Pvt Ltd',
    service: 'Private Limited Company Registration',
    amount: '₹4,999',
    appliedDate: '2026-08-28',
    currentStage: 3,
    stages: [
      { label: 'Application Submitted', date: '28 Aug 2026', done: true },
      { label: 'DSC & DIN Approved', date: '30 Aug 2026', done: true },
      { label: 'SPICe+ Part B Filed (MCA)', date: '01 Sep 2026', done: true },
      { label: 'Certificate of Incorporation', date: 'Expected 05 Sep', done: false }
    ],
    status: 'In Progress',
    officer: 'CA Rajesh Verma'
  },
  'DUS-2026-9114': {
    id: 'DUS-2026-9114',
    clientName: 'Pooja Textiles',
    businessName: 'Pooja Fashion Hub',
    service: 'PMEGP Loan (₹25 Lakhs)',
    amount: '₹25,00,000',
    appliedDate: '2026-08-15',
    currentStage: 4,
    stages: [
      { label: 'Project Report Prepared', date: '16 Aug 2026', done: true },
      { label: 'KVIC Portal Submission', date: '19 Aug 2026', done: true },
      { label: 'Bank Forwarding (SBI)', date: '25 Aug 2026', done: true },
      { label: 'Sanction Letter Issued', date: '02 Sep 2026', done: true }
    ],
    status: 'Sanctioned',
    officer: 'Anil Tyagi (Loan Specialist)'
  }
};

// -------------------------------------------------------------
// ENRICHED LEADS (With all 8 Lifecycle Steps)
// -------------------------------------------------------------
export const initialLeads = [
  {
    id: 'LD-101',
    name: 'Vikram Rajput',
    phone: '+91 98765 43210',
    email: 'vikram.r@gmail.com',
    service: 'Private Limited Company Registration',
    stage: 'New Leads',
    value: 7500,
    date: '2026-09-02',
    notes: 'Planning to launch EV battery assembly unit in Pune. Needs 2 directors DIN and capital assistance.',
    
    // Step 1: Lead Source
    leadSource: {
      channel: 'Website Form',
      campaign: 'MCA Startup Incorp Campaign Q3',
      referrer: 'Google Organic Search',
      landingPage: '/services/pvt-ltd',
      ipCity: 'Pune, Maharashtra',
      utmMedium: 'cpc'
    },
    // Step 2: Sales
    sales: {
      assignedExecutive: 'Neha Sharma',
      department: 'Corporate MCA',
      priority: 'High',
      targetCloseDate: '2026-09-08',
      dealValue: 7500,
      salesProbability: '85%'
    },
    // Step 3: Follow-up
    followUps: [
      { id: 1, type: 'Phone Call', date: '2026-09-03', time: '11:30 AM', notes: 'Discussed registered office address proof and DIN KYC requirements.', status: 'Completed' },
      { id: 2, type: 'WhatsApp', date: '2026-09-04', time: '02:00 PM', notes: 'Send SPICe+ documents checklist and quote.', status: 'Pending' }
    ],
    // Step 4: Interested
    interested: {
      temperature: 'Hot', // Hot | Warm | Cold
      selectedPackages: ['Pvt Ltd (SPICe+ Part A & B)', '2 Class 3 DSCs', 'PAN/TAN/Bank Account', 'Name RUN Approval'],
      budget: '₹8,000 - ₹10,000',
      timeline: 'Immediate (< 7 Days)'
    },
    // Step 5: Eligibility
    eligibility: {
      cibilScore: 780,
      annualTurnover: '₹45 Lakhs (Projected)',
      gstStatus: 'Not Yet Registered',
      directorsCount: 2,
      residencyStatus: 'Indian Residents',
      verdict: 'Pre-Approved (100% Eligible)',
      checkedDate: '2026-09-02'
    },
    // Step 6: Quotation
    quotation: {
      quoteNo: 'QUO-2026-101',
      date: '2026-09-02',
      items: [
        { desc: 'Private Limited Company Incorporation Fee', amount: 4999 },
        { desc: '2 Digital Signature Certificates (DSC Class 3)', amount: 1500 },
        { desc: 'Name Reservation RUN Govt Challan', amount: 1000 }
      ],
      subtotal: 7499,
      gst: 1349.82,
      total: 8848.82,
      status: 'Sent to Client'
    },
    // Step 7: Payment
    payment: {
      advancePaid: 3000,
      balanceDue: 5848.82,
      mode: 'UPI (Google Pay)',
      utrNo: 'UPI/3892019482/YESB',
      receiptNo: 'REC-2026-081',
      paymentDate: '2026-09-03',
      status: 'Verified & Credited'
    },
    // Step 8: Converted
    converted: {
      isConverted: false,
      convertedDate: null,
      customerId: null,
      projectId: null
    }
  },
  {
    id: 'LD-102',
    name: 'Amitabh Sanyal',
    phone: '+91 98230 11223',
    email: 'amitabh@sanyaltech.in',
    service: 'PMEGP Govt Loan (₹35L)',
    stage: 'Contacted',
    value: 12000,
    date: '2026-09-01',
    notes: 'Wants DPR and KVIC application assistance. Own contribution 10% ready.',
    leadSource: {
      channel: 'Google Ads',
      campaign: 'PMEGP 35% Capital Subsidy Promo',
      referrer: 'google.co.in',
      landingPage: '/loan',
      ipCity: 'Varanasi, Uttar Pradesh',
      utmMedium: 'search'
    },
    sales: {
      assignedExecutive: 'Anil Tyagi',
      department: 'Govt Banking & DPR',
      priority: 'Urgent',
      targetCloseDate: '2026-09-06',
      dealValue: 12000,
      salesProbability: '90%'
    },
    followUps: [
      { id: 1, type: 'Video Call', date: '2026-09-02', time: '04:00 PM', notes: 'Verified machinery quotation and project site land papers.', status: 'Completed' }
    ],
    interested: {
      temperature: 'Hot',
      selectedPackages: ['PMEGP 5-Year CMA Project Report', 'KVIC Online Portal Submission', 'Bank Liaisoning with PNB'],
      budget: '₹12,000 - ₹15,000',
      timeline: '15 Days'
    },
    eligibility: {
      cibilScore: 745,
      annualTurnover: '₹20 Lakhs',
      gstStatus: 'Exempted (Micro Unit)',
      directorsCount: 1,
      residencyStatus: 'Indian Resident (OBC Category - 35% Subsidy)',
      verdict: 'Pre-Approved (35% Subsidy Eligible)',
      checkedDate: '2026-09-01'
    },
    quotation: {
      quoteNo: 'QUO-2026-102',
      date: '2026-09-01',
      items: [
        { desc: 'Comprehensive Detailed Project Report (DPR - 35L)', amount: 8000 },
        { desc: 'KVIC Portal Submission & Bank Compliance CMA', amount: 4000 }
      ],
      subtotal: 12000,
      gst: 2160,
      total: 14160,
      status: 'Accepted'
    },
    payment: {
      advancePaid: 5000,
      balanceDue: 9160,
      mode: 'NEFT / Netbanking',
      utrNo: 'PUNBH26090128391',
      receiptNo: 'REC-2026-085',
      paymentDate: '2026-09-02',
      status: 'Verified & Credited'
    },
    converted: {
      isConverted: false,
      convertedDate: null,
      customerId: null,
      projectId: null
    }
  },
  {
    id: 'LD-103',
    name: 'Meenakshi Enterprises',
    phone: '+91 97654 88765',
    email: 'meenakshi@textiles.com',
    service: 'GST Registration + 1 Yr Return',
    stage: 'In Progress',
    value: 5400,
    date: '2026-08-30',
    notes: 'Documents collected. Rent agreement stamp paper uploaded.',
    leadSource: {
      channel: 'Franchise Partner',
      campaign: 'Surat District Partner Desk',
      referrer: 'Franchise Kendra #FR-042',
      landingPage: '/franchise-referral',
      ipCity: 'Surat, Gujarat',
      utmMedium: 'offline'
    },
    sales: {
      assignedExecutive: 'Suresh Patil',
      department: 'Indirect Tax',
      priority: 'Medium',
      targetCloseDate: '2026-09-05',
      dealValue: 5400,
      salesProbability: '95%'
    },
    followUps: [
      { id: 1, type: 'Phone Call', date: '2026-08-31', time: '01:00 PM', notes: 'Obtained electricity bill consumer number for GST verification.', status: 'Completed' }
    ],
    interested: {
      temperature: 'Warm',
      selectedPackages: ['GSTIN Registration', '12 Months GSTR-1 & 3B Filing Plan'],
      budget: '₹5,500',
      timeline: '3 Days'
    },
    eligibility: {
      cibilScore: 710,
      annualTurnover: '₹60 Lakhs',
      gstStatus: 'New Application',
      directorsCount: 1,
      residencyStatus: 'Proprietorship',
      verdict: 'Eligible',
      checkedDate: '2026-08-30'
    },
    quotation: {
      quoteNo: 'QUO-2026-103',
      date: '2026-08-30',
      items: [
        { desc: 'GST Registration Filing', amount: 999 },
        { desc: 'Annual GST Return Filing Plan (Quarterly/Monthly)', amount: 4401 }
      ],
      subtotal: 5400,
      gst: 972,
      total: 6372,
      status: 'Accepted'
    },
    payment: {
      advancePaid: 6372,
      balanceDue: 0,
      mode: 'UPI (PhonePe)',
      utrNo: 'UPI/28941049281/SBI',
      receiptNo: 'REC-2026-089',
      paymentDate: '2026-08-31',
      status: 'Fully Paid'
    },
    converted: {
      isConverted: true,
      convertedDate: '2026-08-31',
      customerId: 'CUST-303',
      projectId: 'PRJ-2026-003'
    }
  },
  {
    id: 'LD-104',
    name: 'Rajeshwari Logistics',
    phone: '+91 99112 33445',
    email: 'rajeshwari.fleet@gmail.com',
    service: 'Mudra Loan (Tarun - ₹10L)',
    stage: 'Documents Pending',
    value: 8500,
    date: '2026-08-27',
    notes: 'Bank 6-month statement pending from customer.',
    leadSource: {
      channel: 'Direct Walk-in',
      campaign: 'Regional Hub Center',
      referrer: 'Local Board Banner',
      landingPage: '/walk-in',
      ipCity: 'Jaipur, Rajasthan',
      utmMedium: 'direct'
    },
    sales: {
      assignedExecutive: 'Rahul Mehta',
      department: 'Govt Banking & DPR',
      priority: 'High',
      targetCloseDate: '2026-09-07',
      dealValue: 8500,
      salesProbability: '70%'
    },
    followUps: [
      { id: 1, type: 'Phone Call', date: '2026-08-29', time: '11:00 AM', notes: 'Reminded client for current account statement PDF.', status: 'Completed' }
    ],
    interested: {
      temperature: 'Warm',
      selectedPackages: ['Mudra Tarun Scheme File', 'CMA Data Preparation'],
      budget: '₹8,500',
      timeline: '10 Days'
    },
    eligibility: {
      cibilScore: 730,
      annualTurnover: '₹85 Lakhs',
      gstStatus: 'Active',
      directorsCount: 2,
      residencyStatus: 'Partnership',
      verdict: 'Under Verification',
      checkedDate: '2026-08-27'
    },
    quotation: {
      quoteNo: 'QUO-2026-104',
      date: '2026-08-27',
      items: [{ desc: 'Mudra Tarun Loan Scheme Documentation', amount: 8500 }],
      subtotal: 8500,
      gst: 1530,
      total: 10030,
      status: 'Sent'
    },
    payment: {
      advancePaid: 2000,
      balanceDue: 8030,
      mode: 'Cash Receipt',
      utrNo: 'CASH-REC-041',
      receiptNo: 'REC-2026-092',
      paymentDate: '2026-08-28',
      status: 'Verified'
    },
    converted: {
      isConverted: false,
      convertedDate: null,
      customerId: null,
      projectId: null
    }
  },
  {
    id: 'LD-105',
    name: 'GreenTech BioSolutions',
    phone: '+91 98334 55667',
    email: 'ceo@greentech.org',
    service: 'Trademark & ISO 9001',
    stage: 'Converted',
    value: 14500,
    date: '2026-08-25',
    notes: 'Payment verified. Application filed with IP India.',
    leadSource: {
      channel: 'Referral',
      campaign: 'Client Advocate Program',
      referrer: 'Apex Robotics LLP',
      landingPage: '/referral',
      ipCity: 'Bengaluru, Karnataka',
      utmMedium: 'referral'
    },
    sales: {
      assignedExecutive: 'Neha Sharma',
      department: 'Intellectual Property',
      priority: 'High',
      targetCloseDate: '2026-08-27',
      dealValue: 14500,
      salesProbability: '100%'
    },
    followUps: [
      { id: 1, type: 'Email', date: '2026-08-26', time: '10:30 AM', notes: 'Shared Form TM-A acknowledgment receipt number.', status: 'Completed' }
    ],
    interested: {
      temperature: 'Hot',
      selectedPackages: ['Trademark Class 42 Filing', 'ISO 9001:2015 Audit Certification'],
      budget: '₹15,000',
      timeline: 'Completed'
    },
    eligibility: {
      cibilScore: 820,
      annualTurnover: '₹1.4 Crores',
      gstStatus: 'Active & Clean Track',
      directorsCount: 3,
      residencyStatus: 'Private Limited',
      verdict: 'Fully Approved',
      checkedDate: '2026-08-25'
    },
    quotation: {
      quoteNo: 'QUO-2026-105',
      date: '2026-08-25',
      items: [
        { desc: 'Trademark Application Form TM-A (Class 42)', amount: 6500 },
        { desc: 'ISO 9001:2015 Quality Certification', amount: 8000 }
      ],
      subtotal: 14500,
      gst: 2610,
      total: 17110,
      status: 'Accepted'
    },
    payment: {
      advancePaid: 17110,
      balanceDue: 0,
      mode: 'Netbanking (HDFC)',
      utrNo: 'HDFCR2608259128',
      receiptNo: 'REC-2026-095',
      paymentDate: '2026-08-26',
      status: 'Fully Paid'
    },
    converted: {
      isConverted: true,
      convertedDate: '2026-08-26',
      customerId: 'CUST-302',
      projectId: 'PRJ-2026-002'
    }
  }
];

// -------------------------------------------------------------
// ENRICHED CUSTOMERS (With all 8 Customer 360° Tabs)
// -------------------------------------------------------------
export const initialCustomers = [
  {
    id: 'CUST-301',
    name: 'Sharma Agro Solutions Pvt Ltd',
    contactPerson: 'Sunil Kumar Sharma',
    phone: '+91 94120 55890',
    email: 'sunil@sharmaagro.in',
    city: 'Jaipur, Rajasthan',
    gstin: '08AAECS1234F1Z5',
    cin: 'U01111RJ2026PTC089123',
    kycStatus: 'Verified',
    totalBilled: '₹28,500',
    activeServices: ['Pvt Ltd Registration', 'GST Monthly Filing'],

    // 1. Customer 360°
    customer360: {
      healthScore: 94, // Out of 100
      tier: 'Enterprise Platinum',
      ltv: 28500,
      relationshipManager: 'CA Rajesh Verma',
      satisfactionRating: '5.0 ★',
      clientSince: 'August 2026',
      summary: 'High-growth agri-tech enterprise. Prompt payments, zero compliance non-adherence. Expanding into grain packaging.'
    },

    // 2. KYC / Profile
    kycProfile: {
      legalName: 'Sharma Agro Solutions Private Limited',
      tradeName: 'Sharma Agro',
      pan: 'AAECS1234F',
      aadhaarSignatory: 'XXXX-XXXX-8921 (Sunil K. Sharma)',
      gstin: '08AAECS1234F1Z5',
      cin: 'U01111RJ2026PTC089123',
      registeredAddress: 'Plot 44, Agro Park Phase 2, Sitapura Industrial Area, Jaipur, RJ 302022',
      signatoryDesignation: 'Managing Director',
      verificationDate: '2026-08-30',
      status: 'Verified & Certified'
    },

    // 3. Services
    services: [
      { id: 'SRV-01', name: 'Private Limited Company Incorporation', category: 'MCA', status: 'Active (Completed)', startDate: '2026-08-28', renewalDate: 'Annual ROC 2027', fee: '₹4,999' },
      { id: 'SRV-02', name: 'GST Monthly Filing & Compliance (Retainer)', category: 'Taxation', status: 'Active (Monthly)', startDate: '2026-09-01', renewalDate: '2027-08-31', fee: '₹1,500/mo' }
    ],

    // 4. Payments
    payments: [
      { id: 'PAY-101', date: '2026-08-28', invoiceNo: 'INV-2026-089', amount: 8848.82, method: 'Netbanking (HDFC)', status: 'Verified', receiptUrl: '#' },
      { id: 'PAY-102', date: '2026-09-01', invoiceNo: 'INV-2026-112', amount: 18000.00, method: 'NEFT (ICICI)', status: 'Verified', receiptUrl: '#' }
    ],

    // 5. Documents
    documents: [
      { id: 'DOC-1', name: 'Certificate of Incorporation (SPICe+)', type: 'PDF', uploadDate: '2026-09-01', status: 'Verified', verifiedBy: 'CA Rajesh Verma' },
      { id: 'DOC-2', name: 'Memorandum of Association (MOA)', type: 'PDF', uploadDate: '2026-08-30', status: 'Verified', verifiedBy: 'CS Priya Nair' },
      { id: 'DOC-3', name: 'Articles of Association (AOA)', type: 'PDF', uploadDate: '2026-08-30', status: 'Verified', verifiedBy: 'CS Priya Nair' },
      { id: 'DOC-4', name: 'Director PAN & Aadhaar Vault', type: 'ZIP', uploadDate: '2026-08-28', status: 'Verified', verifiedBy: 'Neha Sharma' }
    ],

    // 6. Support
    support: [
      { id: 'TKT-01', ticketNo: 'SUP-2026-041', subject: 'Inquiry regarding PMEGP 35% subsidy claim window', priority: 'Medium', status: 'Resolved', createdDate: '2026-08-31', resolvedDate: '2026-09-01' }
    ],

    // 7. Projects
    projects: [
      { id: 'PRJ-2026-001', name: 'Sharma Agro MCA Incorporation', service: 'Private Limited Registration', status: 'Final Stage (RoC Approved)', progress: 90 }
    ],

    // 8. Previous History
    previousHistory: [
      { id: 1, date: '2026-08-28', event: 'Lead Created & Initial Consultation', performedBy: 'Website & Neha Sharma', notes: 'SPICe+ Part A Name approval RUN submitted.' },
      { id: 2, date: '2026-08-30', event: 'DSC Issued & SPICe+ Part B Filed', performedBy: 'CS Priya Nair', notes: 'Digital signatures generated and MCA submission verified.' },
      { id: 3, date: '2026-09-01', event: 'Corporate Bank Account Approved', performedBy: 'CA Rajesh Verma', notes: 'HDFC Bank linked zero-balance corporate account generated.' }
    ]
  },
  {
    id: 'CUST-302',
    name: 'Apex Robotics LLP',
    contactPerson: 'Karan Malhotra',
    phone: '+91 98110 44321',
    email: 'karan@apexrobotics.co',
    city: 'Bengaluru, Karnataka',
    gstin: '29AABCA9876E1Z2',
    cin: 'AAX-9821 (LLPIN)',
    kycStatus: 'Verified',
    totalBilled: '₹42,000',
    activeServices: ['LLP Registration', 'Trademark Filing', 'Startup India Seed Fund'],

    customer360: {
      healthScore: 98,
      tier: 'Diamond Tech Partner',
      ltv: 42000,
      relationshipManager: 'Neha Sharma',
      satisfactionRating: '4.9 ★',
      clientSince: 'July 2026',
      summary: 'Drone navigation startup. DPIIT recognized. Filed 2 trademarks and ISO 9001 certification.'
    },
    kycProfile: {
      legalName: 'Apex Robotics Limited Liability Partnership',
      tradeName: 'Apex Robotics',
      pan: 'AABCA9876E',
      aadhaarSignatory: 'XXXX-XXXX-3341 (Karan Malhotra)',
      gstin: '29AABCA9876E1Z2',
      cin: 'AAX-9821',
      registeredAddress: 'Level 4, Innov8 Hub, Koramangala 5th Block, Bengaluru, KA 560095',
      signatoryDesignation: 'Designated Partner',
      verificationDate: '2026-07-22',
      status: 'Verified & Certified'
    },
    services: [
      { id: 'SRV-11', name: 'LLP Incorporation (FiLLiP)', category: 'MCA', status: 'Completed', startDate: '2026-07-15', renewalDate: 'Annual Form 11', fee: '₹6,000' },
      { id: 'SRV-12', name: 'Trademark Filing (Class 9 & 42)', category: 'IP', status: 'Active (Examined)', startDate: '2026-08-10', renewalDate: '10 Years', fee: '₹14,500' }
    ],
    payments: [
      { id: 'PAY-201', date: '2026-07-15', invoiceNo: 'INV-2026-041', amount: 18000, method: 'Credit Card', status: 'Verified', receiptUrl: '#' },
      { id: 'PAY-202', date: '2026-08-10', invoiceNo: 'INV-2026-068', amount: 24000, method: 'NEFT', status: 'Verified', receiptUrl: '#' }
    ],
    documents: [
      { id: 'DOC-11', name: 'LLP Agreement (Form 3 MCA Stamp)', type: 'PDF', uploadDate: '2026-07-28', status: 'Verified', verifiedBy: 'Neha Sharma' },
      { id: 'DOC-12', name: 'DPIIT Startup India Recognition Certificate', type: 'PDF', uploadDate: '2026-08-12', status: 'Verified', verifiedBy: 'Neha Sharma' }
    ],
    support: [],
    projects: [
      { id: 'PRJ-2026-002', name: 'Apex Robotics IP Brand Protection', service: 'Trademark Registration', status: 'Filing Completed', progress: 100 }
    ],
    previousHistory: [
      { id: 1, date: '2026-07-15', event: 'LLP Name RUN Reserved', performedBy: 'Neha Sharma', notes: 'Apex Robotics approved on first attempt.' },
      { id: 2, date: '2026-08-10', event: 'Trademark Application TM-A Dispatched', performedBy: 'Neha Sharma', notes: 'Government challan generated.' }
    ]
  },
  {
    id: 'CUST-303',
    name: 'Pooja Fashion Hub',
    contactPerson: 'Pooja Devi',
    phone: '+91 97180 33441',
    email: 'pooja.fashion@gmail.com',
    city: 'Surat, Gujarat',
    gstin: '24AAFFP5544K1ZP',
    cin: 'Sole Proprietorship',
    kycStatus: 'Verified',
    totalBilled: '₹15,000',
    activeServices: ['PMEGP Loan Support', 'Udyam Registration'],

    customer360: {
      healthScore: 92,
      tier: 'Gold MSME Partner',
      ltv: 15000,
      relationshipManager: 'Anil Tyagi',
      satisfactionRating: '5.0 ★',
      clientSince: 'August 2026',
      summary: 'Apparel manufacturing unit with ₹25L PMEGP bank sanction in SBI Surat. High compliance record.'
    },
    kycProfile: {
      legalName: 'Pooja Fashion Hub (Proprietorship)',
      tradeName: 'Pooja Textiles & Fashion',
      pan: 'AAFFP5544K',
      aadhaarSignatory: 'XXXX-XXXX-9912 (Pooja Devi)',
      gstin: '24AAFFP5544K1ZP',
      cin: 'UDYAM-GJ-22-0091241',
      registeredAddress: 'Shop 14, Raghukul Textile Market, Ring Road, Surat, GJ 395002',
      signatoryDesignation: 'Proprietor',
      verificationDate: '2026-08-18',
      status: 'Verified & Certified'
    },
    services: [
      { id: 'SRV-21', name: 'PMEGP Detailed Project Report & Bank Liaison', category: 'Banking', status: 'Sanctioned', startDate: '2026-08-15', renewalDate: 'One Time', fee: '₹12,000' }
    ],
    payments: [
      { id: 'PAY-301', date: '2026-08-15', invoiceNo: 'INV-2026-055', amount: 15000, method: 'UPI', status: 'Verified', receiptUrl: '#' }
    ],
    documents: [
      { id: 'DOC-21', name: 'State Bank of India Loan Sanction Letter', type: 'PDF', uploadDate: '2026-09-02', status: 'Verified', verifiedBy: 'Anil Tyagi' },
      { id: 'DOC-22', name: 'Machinery Quotations & Proforma Invoice', type: 'PDF', uploadDate: '2026-08-16', status: 'Verified', verifiedBy: 'Anil Tyagi' }
    ],
    support: [],
    projects: [
      { id: 'PRJ-2026-003', name: 'Pooja Textiles PMEGP Project Case', service: 'PMEGP Govt Loan', status: 'Sanction Letter Issued', progress: 100 }
    ],
    previousHistory: [
      { id: 1, date: '2026-08-15', event: 'DPR Prepared & CMA Finalized', performedBy: 'Anil Tyagi', notes: '5-year cash flow projections signed off.' },
      { id: 2, date: '2026-09-02', event: 'SBI Sanction Letter Issued (₹25L)', performedBy: 'Anil Tyagi', notes: 'Customer received in branch.' }
    ]
  }
];

// -------------------------------------------------------------
// ENRICHED PROJECTS (With all 12 Project Lifecycle Elements)
// -------------------------------------------------------------
export const initialProjects = [
  {
    id: 'PRJ-2026-001',
    projectCode: 'DUS-PRJ-089',
    customerId: 'CUST-301',
    customerName: 'Sharma Agro Solutions Pvt Ltd',
    contactPerson: 'Sunil Kumar Sharma',
    phone: '+91 94120 55890',
    service: 'PMEGP Govt Loan (₹45 Lakhs) & Food Processing Unit',
    serviceCategory: 'Govt Banking & Subsidies',
    serviceStream: 'Govt_Scheme_Loan', // 'Govt_Scheme_Loan' | 'Fast_Compliance' | 'DPR_Financial'
    
    // Execution Mode (In-House vs Outsourced)
    executionMode: 'In_House',
    assignedDesk: 'Cabin #04 (Govt Subsidy & Banking Liaison)',
    assignedPerson: {
      name: 'Sunil Manchanda',
      role: 'Senior Banking Liaison Officer',
      phone: '+91 98290 88219',
      email: 'sunil.manchanda@digitaludyogseva.com'
    },
    
    // 10-Stage Lifecycle Pipeline
    lifecycleStage: 'Bank_Branch_Liaison',
    currentStatus: 'Bank Branch Scrutiny',
    currentProcess: 'File forwarded by DIC to SBI Sitapura; Branch Manager inspection scheduled',
    currentLocation: 'SBI Industrial Area Branch, Sitapura, Jaipur',

    // Legal Agreement (Client Agreement to prevent disputes)
    legalAgreement: {
      signed: true,
      agreementNo: 'DUS-AGR-2026-081',
      signedDate: '2026-08-20',
      feePackage: '₹18,500 Consultation + 1.5% Post-Sanction Success Fee',
      initialFeeCollected: 18500,
      agreementDoc: 'Signed_Legal_Consultancy_Agreement.pdf'
    },

    // Support vs Operations QA Handover Desk
    qaHandover: {
      status: 'Approved_For_Submission',
      collectedBy: 'Pooja Sharma (Support Desk)',
      verifiedBy: 'Virendra Singh (Operations Head)',
      bouncedHistory: [
        { date: '2026-08-22', reason: 'Machinery quotation lacked GST breakdown; updated quotation collected by Support on 23-Aug.' }
      ]
    },

    // Department Portal Submission & Objections / Queries
    departmentDetails: {
      departmentName: 'District Industries Centre (DIC) Jaipur Urban / KVIC',
      portalName: 'KVIC PMEGP Portal (kviconline.gov.in)',
      applicationNo: 'PMEGP-RJ-2026-88190',
      submissionDate: '2026-08-25',
      portalStatus: 'DLFC Approved • Forwarded to Bank',
      queries: [
        {
          id: 'QRY-01',
          raisedBy: 'DIC GM Scrutiny Desk',
          date: '2026-08-28',
          objectionText: 'Provide revised land possession certificate and electricity feasibility letter from JVVNL for Sitapura Unit.',
          replyText: 'Submitted JVVNL commercial connection receipt #JV-88192 and RIICO plot lease registered deed.',
          replyDate: '2026-08-29',
          status: 'Resolved & Accepted',
          clientNotified: true
        }
      ],
      dlfcInterview: {
        scheduled: true,
        interviewDate: '2026-09-01',
        committeeRemarks: 'Recommended 100% by District Task Force. Forwarded to State Bank of India.',
        status: 'Passed'
      }
    },

    // Bank Branch Liaison & Scrutiny
    bankLiaison: {
      bankName: 'State Bank of India (SBI)',
      branchName: 'Sitapura Industrial Area Branch, Jaipur',
      branchManager: 'Mr. Arvind Saxena (Chief Manager)',
      branchPhone: '+91 94140 18892',
      fileReceivedDate: '2026-09-03',
      scrutinyStatus: 'Technical Valuation & Search Report In-Progress',
      cmaRevisionRequired: true,
      cmaRevisionNotes: 'Manager requested DSCR sensitivity analysis at 10.5% interest rate. Revised CMA uploaded.',
      bankQueryLetter: 'Bank requested secondary guarantor IT returns for last 2 assessment years.',
      sanctionStatus: 'Under Appraisal',
      sanctionAmount: 4500000,
      sanctionLetterDoc: null
    },

    // Subsidy Claim Tracking & Target Countdown
    subsidyClaim: {
      schemeName: 'PMEGP 35% Capital Subsidy',
      subsidyAmountExpected: 1575000,
      targetDaysToClaim: 30,
      claimWindowDeadline: '2026-10-15',
      daysRemaining: 28,
      claimPortal: 'KVIC Subsidy Disbursement Portal',
      claimStatus: 'Awaiting 1st Loan Disbursal',
      tdrAccountNo: 'Pending Loan Disbursal',
      fastActionRequired: false
    },

    requirement: {
      businessObjective: 'Establish an agri-tech automated grain sorting and packing plant in Sitapura, Jaipur.',
      authorizedCapital: '₹10,00,000 (10 Lakhs)',
      paidUpCapital: '₹1,00,000 (1 Lakh)',
      directorsCount: 2,
      shareholdingSplit: 'Sunil Sharma (60%), Rekha Sharma (40%)',
      specialNotes: 'Require corporate current account with SBI and simultaneous MSME Udyam registration.'
    },

    documents: [
      { name: 'Director PAN & Aadhaar Cards', required: true, status: 'Verified' },
      { name: 'RIICO Sitapura Land Allotment Letter', required: true, status: 'Verified' },
      { name: 'Automated Machinery Quotations (₹32L)', required: true, status: 'Verified' },
      { name: '5-Year Detailed Project Report (DPR)', required: true, status: 'Verified' },
      { name: 'Last 3-Years Audited Financials', required: true, status: 'Verified' }
    ],

    tasks: [
      { id: 'T-01', task: 'Review DPR & CMA Ratios with Client', done: true, dueDate: '2026-08-24', assignee: 'Sunil Manchanda' },
      { id: 'T-02', task: 'KVIC Online Portal Submission & Uploads', done: true, dueDate: '2026-08-25', assignee: 'Sunil Manchanda' },
      { id: 'T-03', task: 'Submit DIC Query Reply on Portal', done: true, dueDate: '2026-08-29', assignee: 'Sunil Manchanda' },
      { id: 'T-04', task: 'Attend DLFC Interview with Client', done: true, dueDate: '2026-09-01', assignee: 'Sunil Manchanda' },
      { id: 'T-05', task: 'Follow up with SBI Branch Manager for Valuation', done: false, dueDate: '2026-09-08', assignee: 'Sunil Manchanda' }
    ],

    timeline: [
      { stage: 'Eligibility & Legal Agreement Signed', targetDate: '20 Aug 2026', actualDate: '20 Aug 2026', done: true },
      { stage: 'Support Doc Collection & Operations QA', targetDate: '23 Aug 2026', actualDate: '23 Aug 2026', done: true },
      { stage: 'KVIC Portal Submission (App #88190)', targetDate: '25 Aug 2026', actualDate: '25 Aug 2026', done: true },
      { stage: 'DIC Query Resolved & DLFC Approved', targetDate: '01 Sep 2026', actualDate: '01 Sep 2026', done: true },
      { stage: 'SBI Branch Valuation & Sanction', targetDate: '12 Sep 2026', actualDate: 'In Progress', done: false },
      { stage: 'PMEGP Subsidy Claim Filing', targetDate: '30 Sep 2026', actualDate: 'Pending', done: false }
    ],

    completion: {
      isCompleted: false,
      completionDate: null,
      deliverables: ['PMEGP Sanction Letter', 'Bank Disbursal Advice', 'KVIC Subsidy TDR Certificate'],
      dispatchTrackingNo: 'Pending Sanction'
    }
  },

  {
    id: 'PRJ-2026-002',
    projectCode: 'DUS-PRJ-090',
    customerId: 'CUST-302',
    customerName: 'Rajasthan Solar Tech & Irrigation',
    contactPerson: 'Mahendra Bishnoi',
    phone: '+91 98295 11200',
    service: 'Rajasthan MLUPY Scheme (₹50 Lakhs) with 8% Interest Subsidy',
    serviceCategory: 'Govt Banking & Subsidies',
    serviceStream: 'Govt_Scheme_Loan',

    executionMode: 'In_House',
    assignedDesk: 'Cabin #03 (Govt Subsidy Desk)',
    assignedPerson: {
      name: 'Vikramaditya Rathore',
      role: 'Senior Project Consultant',
      phone: '+91 97840 44192',
      email: 'vikram.rathore@digitaludyogseva.com'
    },

    lifecycleStage: 'Subsidy_Claim',
    currentStatus: 'Subsidy Claim Window Active',
    currentProcess: 'Bank disbursed 1st tranche; Subsidy Claim portal filing deadline in 18 days',
    currentLocation: 'PNB MI Road & Rajasthan Industries Nodal Subsidy Portal',

    legalAgreement: {
      signed: true,
      agreementNo: 'DUS-AGR-2026-074',
      signedDate: '2026-07-15',
      feePackage: '₹25,000 Consultation + 2% Subsidy Success',
      initialFeeCollected: 25000,
      agreementDoc: 'Signed_MLUPY_Agreement.pdf'
    },

    qaHandover: {
      status: 'Approved_For_Submission',
      collectedBy: 'Neha Sharma (Support)',
      verifiedBy: 'Virendra Singh (Operations Head)'
    },

    departmentDetails: {
      departmentName: 'Department of Industries & Commerce, Govt of Rajasthan',
      portalName: 'MLUPY SSO Portal (industries.rajasthan.gov.in)',
      applicationNo: 'MLUPY-2026-99214',
      submissionDate: '2026-07-22',
      portalStatus: 'Sanction Approved by DIC Committee',
      queries: []
    },

    bankLiaison: {
      bankName: 'Punjab National Bank (PNB)',
      branchName: 'M.I. Road Branch, Jaipur',
      branchManager: 'Sanjay Chawla',
      branchPhone: '+91 98290 77123',
      fileReceivedDate: '2026-08-01',
      scrutinyStatus: 'Loan Sanctioned & First Tranche Disbursed',
      sanctionStatus: 'Sanctioned',
      sanctionAmount: 5000000,
      sanctionLetterDoc: 'PNB_Sanction_Letter_50Lakhs.pdf'
    },

    subsidyClaim: {
      schemeName: 'Rajasthan MLUPY 8% Subvention Subsidy',
      subsidyAmountExpected: 400000, // Annual 8% interest relief
      targetDaysToClaim: 30,
      claimWindowDeadline: '2026-09-24',
      daysRemaining: 18,
      claimPortal: 'Rajasthan Single Sign On (SSO) Industries Portal',
      claimStatus: 'Claim Filed by Bank • Verification in Progress',
      tdrAccountNo: 'PNB-TDR-8812901',
      fastActionRequired: true
    },

    requirement: {
      businessObjective: 'Manufacturing solar agricultural pumps and drip irrigation control units in Bagru.',
      authorizedCapital: '₹25,00,000',
      paidUpCapital: '₹5,00,000',
      directorsCount: 2,
      specialNotes: 'Subsidized at 8% per annum for 5 years under CM Small Industry Promotion Scheme (MLUPY).'
    },

    documents: [
      { name: 'Udyam Registration & Industrial Electricity Bill', required: true, status: 'Verified' },
      { name: 'Solar Pump Technical Testing Reports', required: true, status: 'Verified' },
      { name: 'PNB Loan Sanction Letter', required: true, status: 'Verified' },
      { name: 'Nodal Bank Subsidy Claim Form A', required: true, status: 'Verified' }
    ],

    tasks: [
      { id: 'T-11', task: 'Download official MLUPY Sanction Order from DIC SSO', done: true, dueDate: '2026-08-15', assignee: 'Vikramaditya Rathore' },
      { id: 'T-12', task: 'Coordinate with PNB Branch for TDR Certificate', done: true, dueDate: '2026-08-25', assignee: 'Vikramaditya Rathore' },
      { id: 'T-13', task: 'Upload Claim Form A & Disbursal Proof on SSO Portal', done: true, dueDate: '2026-09-02', assignee: 'Vikramaditya Rathore' },
      { id: 'T-14', task: 'Track DIC Nodal Officer subsidy verification (Due in 18 days)', done: false, dueDate: '2026-09-20', assignee: 'Vikramaditya Rathore' }
    ],

    timeline: [
      { stage: 'MLUPY Portal Application Filed', targetDate: '22 Jul 2026', actualDate: '22 Jul 2026', done: true },
      { stage: 'PNB Loan Sanction (₹50 Lakhs)', targetDate: '10 Aug 2026', actualDate: '10 Aug 2026', done: true },
      { stage: '1st Loan Disbursal Issued', targetDate: '25 Aug 2026', actualDate: '25 Aug 2026', done: true },
      { stage: 'Subsidy Claim Portal Verification (18 Days Remaining)', targetDate: '24 Sep 2026', actualDate: 'In Progress', done: false }
    ],

    completion: {
      isCompleted: false,
      completionDate: null,
      deliverables: ['MLUPY Sanction Order', 'PNB Loan Sanction Letter', '8% Interest Subsidy Certificate'],
      dispatchTrackingNo: 'MLUPY-SSO-CLAIM-9921'
    }
  },

  {
    id: 'PRJ-2026-003',
    projectCode: 'DUS-PRJ-091',
    customerId: 'CUST-303',
    customerName: 'Karni Infrastructure & Earthmovers',
    contactPerson: 'Bhawani Singh Rathore',
    phone: '+91 98291 99120',
    service: 'PWD Class-AA Contractor License & Labour Department Registration',
    serviceCategory: 'Contractor & Govt Works Licensing',
    serviceStream: 'Fast_Compliance',

    // Execution Mode: Outsourced to External Legal Firm
    executionMode: 'Outsourced',
    outsourceDetails: {
      vendorName: 'Shree Shyam Legal & Licensing Consultants',
      contactPerson: 'Advocate Hemant Sharma',
      phone: '+91 94140 55123',
      agreedCost: 6500,
      paidStatus: 'Paid (100%)',
      handoverDate: '2026-08-28',
      deliveryDueDate: '2026-09-12',
      vendorStatus: 'Scrutiny Cleared at PWD Chief Engineer Office; Final Certificate Signing',
      deliverableUploaded: true,
      deliverableFile: 'PWD_Class_AA_Draft_License.pdf'
    },

    lifecycleStage: 'Dept_Portal',
    currentStatus: 'Govt Department Processing',
    currentProcess: 'Police verification and solvency scrutiny at PWD Secretariat',
    currentLocation: 'PWD Head Office, Jacob Road, Civil Lines, Jaipur',

    legalAgreement: {
      signed: true,
      agreementNo: 'DUS-AGR-2026-095',
      signedDate: '2026-08-27',
      feePackage: '₹14,500 All-inclusive govt fee & consulting',
      initialFeeCollected: 14500,
      agreementDoc: 'Signed_PWD_Licensing_Contract.pdf'
    },

    qaHandover: {
      status: 'Approved_For_Submission',
      collectedBy: 'Pooja Sharma (Support)',
      verifiedBy: 'Virendra Singh (Operations Head)'
    },

    departmentDetails: {
      departmentName: 'Public Works Department (PWD) Rajasthan',
      portalName: 'PWD Contractor Enrolment Portal',
      applicationNo: 'PWD-AA-2026-4412',
      submissionDate: '2026-08-30',
      portalStatus: 'Under Technical Committee Scrutiny',
      queries: []
    },

    requirement: {
      businessObjective: 'Obtain Class-AA unlimited tender bidding license for government highway and civil works in Rajasthan.',
      specialNotes: 'Solvency certificate of ₹50 Lakhs provided from Bank of Baroda.'
    },

    documents: [
      { name: 'Banker Solvency Certificate (₹50L)', required: true, status: 'Verified' },
      { name: 'Machinery Ownership Proof (JCB, Mixers)', required: true, status: 'Verified' },
      { name: 'Past 3-Years Work Completion Certificates', required: true, status: 'Verified' },
      { name: 'Police Verification Report (SP Office)', required: true, status: 'Verified' }
    ],

    tasks: [
      { id: 'T-21', task: 'Handover file to Advocate Hemant Sharma (Outsource Partner)', done: true, dueDate: '2026-08-28', assignee: 'Virendra Singh' },
      { id: 'T-22', task: 'Verify Solvency & Machinery physical inspection in PWD', done: true, dueDate: '2026-09-02', assignee: 'Advocate Hemant' },
      { id: 'T-23', task: 'Collect signed PWD Class-AA book & certificate', done: false, dueDate: '2026-09-12', assignee: 'Advocate Hemant' }
    ],

    timeline: [
      { stage: 'Case Handed to Outsource Partner (Shree Shyam Legal)', targetDate: '28 Aug 2026', actualDate: '28 Aug 2026', done: true },
      { stage: 'PWD Portal Submission (App #4412)', targetDate: '30 Aug 2026', actualDate: '30 Aug 2026', done: true },
      { stage: 'Technical Committee Scrutiny', targetDate: '06 Sep 2026', actualDate: '06 Sep 2026', done: true },
      { stage: 'Final Class-AA License Book Issuance', targetDate: '12 Sep 2026', actualDate: 'Pending', done: false }
    ],

    completion: {
      isCompleted: false,
      completionDate: null,
      deliverables: ['PWD Class-AA Enrolment Book', 'Labour Department 50+ Worker License'],
      dispatchTrackingNo: 'PWD-CO-2026-4412'
    }
  },

  {
    id: 'PRJ-2026-004',
    projectCode: 'DUS-PRJ-092',
    customerId: 'CUST-304',
    customerName: 'Shri Balaji Marbles & Minerals',
    contactPerson: 'Kishore Toshniwal',
    phone: '+91 94140 88214',
    service: 'Rajasthan Pollution Control Board (RSPCB) CTE & CTO Clearance',
    serviceCategory: 'Environmental Clearances',
    serviceStream: 'Fast_Compliance',

    // Execution Mode: Outsourced
    executionMode: 'Outsourced',
    outsourceDetails: {
      vendorName: 'Green Enviro Environmental Solutions',
      contactPerson: 'Dr. Ashok Singhal (EIA Consultant)',
      phone: '+91 98290 66311',
      agreedCost: 8500,
      paidStatus: 'Partial (₹4,000 Advance)',
      handoverDate: '2026-09-01',
      deliveryDueDate: '2026-09-15',
      vendorStatus: 'Environmental Management Plan (EMP) drafted; Water/Air sample submitted to lab',
      deliverableUploaded: false,
      deliverableFile: null
    },

    lifecycleStage: 'Dept_Portal',
    currentStatus: 'Pollution Board Scrutiny',
    currentProcess: 'Consent to Establish (CTE) application filed on RSPCB e-Clearance Portal',
    currentLocation: 'RSPCB Regional Office, Kishangarh / Jaipur',

    legalAgreement: {
      signed: true,
      agreementNo: 'DUS-AGR-2026-102',
      signedDate: '2026-08-31',
      feePackage: '₹19,000 Including lab testing & consulting',
      initialFeeCollected: 19000,
      agreementDoc: 'Signed_RSPCB_Agreement.pdf'
    },

    qaHandover: {
      status: 'Approved_For_Submission',
      collectedBy: 'Pooja Sharma (Support)',
      verifiedBy: 'Virendra Singh (Operations Head)'
    },

    departmentDetails: {
      departmentName: 'Rajasthan State Pollution Control Board (RSPCB)',
      portalName: 'RSPCB e-Consent Portal',
      applicationNo: 'RSPCB-CTE-2026-891',
      submissionDate: '2026-09-03',
      portalStatus: 'Under Scrutiny by Regional Officer Kishangarh',
      queries: []
    },

    requirement: {
      businessObjective: 'Consent to Establish (CTE Green Category) for marble cutting and granite slab finishing plant.'
    },

    documents: [
      { name: 'Plant Layout & Machinery Acoustic Plan', required: true, status: 'Verified' },
      { name: 'Water Slurry Recycling Tank Design', required: true, status: 'Verified' },
      { name: 'RIICO Industrial Plot Allotment Letter', required: true, status: 'Verified' }
    ],

    tasks: [
      { id: 'T-31', task: 'Assign project to Green Enviro Solutions', done: true, dueDate: '2026-09-01', assignee: 'Virendra Singh' },
      { id: 'T-32', task: 'Draft Environmental Management Plan (EMP)', done: true, dueDate: '2026-09-03', assignee: 'Dr. Ashok Singhal' },
      { id: 'T-33', task: 'File CTE Application on RSPCB Portal', done: true, dueDate: '2026-09-04', assignee: 'Dr. Ashok Singhal' },
      { id: 'T-34', task: 'Secure CTE Consent Order & deliver to client', done: false, dueDate: '2026-09-15', assignee: 'Dr. Ashok Singhal' }
    ],

    timeline: [
      { stage: 'Case Initiated & Transferred to Green Enviro', targetDate: '01 Sep 2026', actualDate: '01 Sep 2026', done: true },
      { stage: 'CTE Application Filed (App #891)', targetDate: '04 Sep 2026', actualDate: '04 Sep 2026', done: true },
      { stage: 'Pollution Board Inspection & CTE Consent', targetDate: '15 Sep 2026', actualDate: 'Pending', done: false }
    ],

    completion: {
      isCompleted: false,
      completionDate: null,
      deliverables: ['RSPCB CTE Consent Order', 'Slurry Recycling Compliance Certificate'],
      dispatchTrackingNo: 'RSPCB-KSG-CTE-891'
    }
  },

  {
    id: 'PRJ-2026-005',
    projectCode: 'DUS-PRJ-093',
    customerId: 'CUST-305',
    customerName: 'Bikaner Sweet & Namkeen Udyog',
    contactPerson: 'Mukesh Agarwal',
    phone: '+91 94140 33410',
    service: 'FSSAI Central Food Processing License & Water Testing Report',
    serviceCategory: 'Food Safety & Standards',
    serviceStream: 'Fast_Compliance',

    executionMode: 'In_House',
    assignedDesk: 'Cabin #02 (Legal & Statutory Registrations)',
    assignedPerson: {
      name: 'CS Priya Nair',
      role: 'Head of Corporate Registrations',
      phone: '+91 98760 11990',
      email: 'priya.nair@digitaludyogseva.com'
    },

    // Bounced back to Support due to missing documents! (User explicit workflow)
    lifecycleStage: 'Support_Collection',
    currentStatus: 'Bounced to Support Desk (Missing Docs)',
    currentProcess: 'Operations QA rejected: Commercial electricity bill & NABL water test report missing',
    currentLocation: 'Support Desk (Pooja Sharma) • Client Follow-up Active',

    legalAgreement: {
      signed: true,
      agreementNo: 'DUS-AGR-2026-108',
      signedDate: '2026-09-02',
      feePackage: '₹8,500 FSSAI License + Lab testing fee',
      initialFeeCollected: 8500,
      agreementDoc: 'Signed_FSSAI_Agreement.pdf'
    },

    qaHandover: {
      status: 'Bounced_To_Support',
      collectedBy: 'Pooja Sharma (Support)',
      verifiedBy: 'Virendra Singh (Operations Head)',
      bouncedHistory: [
        { 
          date: '2026-09-04', 
          reason: 'Operations QA Check Failed: Electricity bill was residential instead of industrial; NABL water test certificate expired. Bounced to Support Desk for re-collection.' 
        }
      ]
    },

    departmentDetails: {
      departmentName: 'Food Safety and Standards Authority of India (FSSAI)',
      portalName: 'FoSCoS Portal (foscos.fssai.gov.in)',
      applicationNo: 'Pending Document Completion',
      submissionDate: null,
      portalStatus: 'Drafted • Awaiting Documents',
      queries: []
    },

    requirement: {
      businessObjective: 'Obtain Central FSSAI Manufacturing License for 15+ MT/day namkeen and packaged sweets production.'
    },

    documents: [
      { name: 'Plant Layout & Equipment Blueprint', required: true, status: 'Verified' },
      { name: 'FSMS Food Safety Plan', required: true, status: 'Verified' },
      { name: 'Industrial Electricity Bill (<2 months)', required: true, status: 'Pending / Rejected' },
      { name: 'NABL Accredited Water Potability Report', required: true, status: 'Pending / Rejected' }
    ],

    tasks: [
      { id: 'T-41', task: 'Collect KYC & signed agreement', done: true, dueDate: '2026-09-02', assignee: 'Pooja Sharma' },
      { id: 'T-42', task: 'Operations QA Scrutiny (REJECTED & BOUNCED)', done: true, dueDate: '2026-09-04', assignee: 'Virendra Singh' },
      { id: 'T-43', task: 'Call Mukesh Ji for fresh JVVNL bill & NABL report', done: false, dueDate: '2026-09-06', assignee: 'Pooja Sharma' },
      { id: 'T-44', task: 'Submit FoSCoS portal application', done: false, dueDate: '2026-09-08', assignee: 'CS Priya Nair' }
    ],

    timeline: [
      { stage: 'Case Booked & Initial Fee Collected', targetDate: '02 Sep 2026', actualDate: '02 Sep 2026', done: true },
      { stage: 'Operations QA Scrutiny (Bounced to Support)', targetDate: '04 Sep 2026', actualDate: '04 Sep 2026', done: true },
      { stage: 'Re-collection of Industrial Bill & Water Report', targetDate: '06 Sep 2026', actualDate: 'In Progress', done: false },
      { stage: 'FoSCoS Portal Submission', targetDate: '08 Sep 2026', actualDate: 'Pending', done: false }
    ],

    completion: {
      isCompleted: false,
      completionDate: null,
      deliverables: ['FSSAI Central License Certificate (5 Years)'],
      dispatchTrackingNo: 'Pending'
    }
  },

  {
    id: 'PRJ-2026-006',
    projectCode: 'DUS-PRJ-094',
    customerId: 'CUST-306',
    customerName: 'Marwar Organic Seeds & Bio-Fertilizers',
    contactPerson: 'Devendra Singh Bhati',
    phone: '+91 97840 55219',
    service: 'Bank DPR & 5-Year CMA Data Compilation (₹1.20 Crore Expansion)',
    serviceCategory: 'Financial Modeling & Project Reports',
    serviceStream: 'DPR_Financial',

    executionMode: 'In_House',
    assignedDesk: 'Cabin #02 (Financial Engineering & CA Desk)',
    assignedPerson: {
      name: 'CA Rajesh Verma',
      role: 'Senior Financial Analyst & Partner',
      phone: '+91 98290 12345',
      email: 'rajesh.verma@digitaludyogseva.com'
    },

    lifecycleStage: 'Bank_Branch_Liaison',
    currentStatus: 'Completed & Delivered to Bank',
    currentProcess: 'Comprehensive 42-page TEV DPR and audited CMA data handed over to Bank of Baroda SME Hub',
    currentLocation: 'Bank of Baroda Regional Zonal Office, Jaipur',

    legalAgreement: {
      signed: true,
      agreementNo: 'DUS-AGR-2026-112',
      signedDate: '2026-08-25',
      feePackage: '₹22,000 DPR & CMA Data formulation',
      initialFeeCollected: 22000,
      agreementDoc: 'Signed_DPR_Engagement.pdf'
    },

    qaHandover: {
      status: 'Approved_For_Submission',
      collectedBy: 'Neha Sharma (Support)',
      verifiedBy: 'CA Rajesh Verma (Operations)'
    },

    departmentDetails: {
      departmentName: 'Bank Appraisal Desk (Direct Submission)',
      portalName: 'N/A (Direct Banking File)',
      applicationNo: 'BOB-SME-2026-120',
      submissionDate: '2026-08-30',
      portalStatus: 'Under Credit Appraisal Committee',
      queries: []
    },

    bankLiaison: {
      bankName: 'Bank of Baroda (BOB)',
      branchName: 'Nehru Place SME Branch, Jaipur',
      branchManager: 'Mr. R. C. Mathur',
      branchPhone: '+91 98291 00214',
      fileReceivedDate: '2026-08-31',
      scrutinyStatus: 'TEV Study Approved; Sanction Note prepared for Zonal Head',
      sanctionStatus: 'Sanctioned',
      sanctionAmount: 12000000,
      sanctionLetterDoc: 'BOB_Sanction_Advice_1.2Cr.pdf'
    },

    subsidyClaim: {
      schemeName: 'Agricultural Infrastructure Fund (AIF) 3% Interest Subvention',
      subsidyAmountExpected: 360000,
      targetDaysToClaim: 45,
      claimWindowDeadline: '2026-10-20',
      daysRemaining: 34,
      claimPortal: 'Agri Infra Fund Portal (agriinfra.dac.gov.in)',
      claimStatus: 'Awaiting Bank Loan Disbursal',
      tdrAccountNo: 'BOB-TDR-AIF-991',
      fastActionRequired: false
    },

    requirement: {
      businessObjective: 'Setting up automated organic seed grading plant and bio-fertilizer production lab in Jodhpur rural.'
    },

    documents: [
      { name: 'Detailed Technical Machinery Quotes (₹80L)', required: true, status: 'Verified' },
      { name: 'Last 3-Years Audited Balance Sheets & ITRs', required: true, status: 'Verified' },
      { name: 'Civil Construction Estimate by Approved Valuer', required: true, status: 'Verified' },
      { name: '5-Year Projected CMA Data & Sensitivity Ratios', required: true, status: 'Verified' }
    ],

    tasks: [
      { id: 'T-51', task: 'Formulate 5-year break-even & DSCR sensitivity model', done: true, dueDate: '2026-08-27', assignee: 'CA Rajesh Verma' },
      { id: 'T-52', task: 'Compile 42-page Techno-Economic Viability (TEV) DPR', done: true, dueDate: '2026-08-29', assignee: 'CA Rajesh Verma' },
      { id: 'T-53', task: 'Attend credit appraisal meeting with BOB Zonal Credit Head', done: true, dueDate: '2026-09-02', assignee: 'CA Rajesh Verma' },
      { id: 'T-54', task: 'Secure formal bank in-principle sanction letter', done: true, dueDate: '2026-09-05', assignee: 'CA Rajesh Verma' }
    ],

    timeline: [
      { stage: 'Financial Modeling & Ratio Analysis', targetDate: '27 Aug 2026', actualDate: '27 Aug 2026', done: true },
      { stage: '42-Page Bound DPR Printed & Delivered', targetDate: '29 Aug 2026', actualDate: '29 Aug 2026', done: true },
      { stage: 'Credit Committee Defense with Zonal Head', targetDate: '02 Sep 2026', actualDate: '02 Sep 2026', done: true },
      { stage: 'BOB Sanction Advice Issued (₹1.20 Cr)', targetDate: '05 Sep 2026', actualDate: '05 Sep 2026', done: true }
    ],

    completion: {
      isCompleted: true,
      completionDate: '2026-09-05',
      deliverables: ['Bound 42-Page TEV Project Report', '5-Year Signed CMA Data Sheets', 'BOB ₹1.20 Cr Sanction Advice'],
      dispatchTrackingNo: 'BOB-JAIPUR-SME-120'
    }
  },

  {
    id: 'PRJ-2026-007',
    projectCode: 'DUS-PRJ-095',
    customerId: 'CUST-307',
    customerName: 'Jaipur Craft & Block Print Exports',
    contactPerson: 'Suresh Kumawat',
    phone: '+91 98290 33419',
    service: 'GST Registration, LUT Filing & Monthly Return Compliance',
    serviceCategory: 'Taxation & Regulatory Retainer',
    serviceStream: 'Fast_Compliance',

    executionMode: 'In_House',
    assignedDesk: 'Cabin #02 (Taxation & Accounts Desk)',
    assignedPerson: {
      name: 'CA Rajesh Verma',
      role: 'Partner - Taxation',
      phone: '+91 98290 12345',
      email: 'rajesh.verma@digitaludyogseva.com'
    },

    lifecycleStage: 'Bank_Sanctioned',
    currentStatus: 'Completed (Certificate Dispatched)',
    currentProcess: 'GST Registration Certificate (REG-06) issued & Letter of Undertaking (LUT) filed',
    currentLocation: 'Client Email & DUS Customer Document Vault',

    legalAgreement: {
      signed: true,
      agreementNo: 'DUS-AGR-2026-118',
      signedDate: '2026-08-18',
      feePackage: '₹4,500 One-time GST + LUT',
      initialFeeCollected: 4500,
      agreementDoc: 'Signed_GST_Engagement.pdf'
    },

    qaHandover: {
      status: 'Approved_For_Submission',
      collectedBy: 'Pooja Sharma (Support)',
      verifiedBy: 'CA Rajesh Verma'
    },

    departmentDetails: {
      departmentName: 'Goods and Services Tax (GST) Department',
      portalName: 'GST Common Portal (gst.gov.in)',
      applicationNo: 'ARN-AA08082600192',
      submissionDate: '2026-08-20',
      portalStatus: 'Approved • GSTIN 08AACFJ8821B1Z2 Active',
      queries: []
    },

    requirement: {
      businessObjective: 'Obtain export-ready GSTIN with LUT filing to export Sanganeri block print fabrics with 0% IGST under bond.'
    },

    documents: [
      { name: 'Proprietor PAN & Aadhaar (Aadhaar OTP Verified)', required: true, status: 'Verified' },
      { name: 'Sanganer Workshop Registered Rent Deed', required: true, status: 'Verified' },
      { name: 'Electricity Bill of Workshop', required: true, status: 'Verified' },
      { name: 'Cancelled Cheque of Current Account', required: true, status: 'Verified' }
    ],

    tasks: [
      { id: 'T-61', task: 'File REG-01 Application with Aadhaar Biometric Authentication', done: true, dueDate: '2026-08-20', assignee: 'CA Rajesh Verma' },
      { id: 'T-62', task: 'Download Form GST REG-06 Certificate', done: true, dueDate: '2026-08-23', assignee: 'CA Rajesh Verma' },
      { id: 'T-63', task: 'File RFD-11 Letter of Undertaking (LUT) for zero-rated exports', done: true, dueDate: '2026-08-24', assignee: 'CA Rajesh Verma' },
      { id: 'T-64', task: 'Auto-save Certificate in Client Document Vault', done: true, dueDate: '2026-08-25', assignee: 'CA Rajesh Verma' }
    ],

    timeline: [
      { stage: 'REG-01 Filed with Aadhaar Auth', targetDate: '20 Aug 2026', actualDate: '20 Aug 2026', done: true },
      { stage: 'REG-06 GSTIN Certificate Issued', targetDate: '23 Aug 2026', actualDate: '23 Aug 2026', done: true },
      { stage: 'LUT RFD-11 Approved for Export', targetDate: '24 Aug 2026', actualDate: '24 Aug 2026', done: true }
    ],

    completion: {
      isCompleted: true,
      completionDate: '2026-08-25',
      deliverables: ['GST Certificate (REG-06)', 'LUT Filing Acknowledgment RFD-11', 'Export GST Compliance Kit'],
      dispatchTrackingNo: 'GSTIN-08AACFJ8821B1Z2 (Delivered to Vault)'
    }
  }
];

export const initialEstimates = [
  {
    id: 'EST-2026-041',
    client: 'Vikram Rajput (EV Assembly)',
    date: '2026-09-02',
    items: [
      { desc: 'Private Limited Company Incorporation (SPICe+)', amount: 4999 },
      { desc: '2 Digital Signature Certificates (Class 3)', amount: 2000 },
      { desc: 'Name Reservation RUN Form Fee', amount: 1000 }
    ],
    tax: 1439.82,
    total: 9438.82,
    status: 'Sent'
  },
  {
    id: 'EST-2026-042',
    client: 'Amitabh Sanyal (KVIC Unit)',
    date: '2026-09-01',
    items: [
      { desc: 'PMEGP Detailed Project Report (DPR - 5 Years)', amount: 6500 },
      { desc: 'CMA Data Compilation & Financial Ratios', amount: 3500 }
    ],
    tax: 1800.00,
    total: 11800.00,
    status: 'Accepted'
  }
];

export const loanStagesMaster = [
  { id: 'Inquiry', label: 'Lead / Inquired', color: '#64748b' },
  { id: 'Doc Collection', label: 'Docs Collection', color: '#f59e0b' },
  { id: 'DPR Preparation', label: 'DPR & CMA Data', color: '#8b5cf6' },
  { id: 'Portal Login', label: 'JanSamarth / Portal Login', color: '#0ea5e9' },
  { id: 'Bank Underwriting', label: 'Bank Underwriting & FI', color: '#3b82f6' },
  { id: 'Sanctioned', label: 'Sanction Letter Issued', color: '#10b981' },
  { id: 'Disbursed', label: 'Disbursed', color: '#059669' },
  { id: 'Subsidy Claimed', label: 'Subsidy Claimed & Settled', color: '#047857' },
  { id: 'Rejected', label: 'Rejected / Query Raised', color: '#ef4444' }
];

export const lendersMaster = [
  { id: 'sbi', name: 'State Bank of India (SBI)', type: 'Public Sector Bank' },
  { id: 'pnb', name: 'Punjab National Bank (PNB)', type: 'Public Sector Bank' },
  { id: 'bob', name: 'Bank of Baroda (BOB)', type: 'Public Sector Bank' },
  { id: 'canara', name: 'Canara Bank', type: 'Public Sector Bank' },
  { id: 'union', name: 'Union Bank of India', type: 'Public Sector Bank' },
  { id: 'hdfc', name: 'HDFC Bank', type: 'Private Bank' },
  { id: 'icici', name: 'ICICI Bank', type: 'Private Bank' },
  { id: 'axis', name: 'Axis Bank', type: 'Private Bank' },
  { id: 'bajaj', name: 'Bajaj Finance', type: 'NBFC' },
  { id: 'tata', name: 'Tata Capital', type: 'NBFC' }
];

export const initialLoanCases = [
  {
    id: 'LN-2026-081',
    applicantName: 'Pooja Varma',
    businessName: 'Pooja Fashion & Garment Hub',
    customerType: 'Proprietorship',
    contact: '+91 98251 44320',
    email: 'pooja.fashion@gmail.com',
    city: 'Surat',
    state: 'Gujarat',
    pinCode: '395002',
    pan: 'AWZPV8921K',
    aadhaarLast4: '4821',
    vintageYears: 3.5,
    gstin: '24AWZPV8921K1ZT',
    udyamNumber: 'UDYAM-GJ-01-0089211',
    annualTurnover: 4800000,
    monthlySales: 400000,
    scheme: 'PMEGP Govt Loan',
    loanType: 'Term Loan + Working Capital',
    requiredAmount: 2500000,
    loanPurpose: 'Automatic high-speed garment embroidery machinery installation and cotton fabric raw material stock.',
    cibilScore: 768,
    cibilStatus: 'Excellent',
    existingLoans: 250000,
    existingEmi: 12500,
    stage: 'Sanctioned',
    priority: 'High',
    applicationDate: '2026-08-14',
    underwriter: 'Anil Tyagi (Senior Credit Lead)',
    bankDetails: {
      lenderName: 'State Bank of India (SBI)',
      branch: 'Ring Road Commercial Branch, Surat',
      branchManager: 'Mr. R. K. Joshi (94260 11982)',
      creditOfficer: 'Siddharth Dave',
      portalLoginId: 'PMEGP-2026-GJ-8921',
      janSamarthId: 'JS-MFR-2026-90412',
      loginDate: '2026-08-19',
      sanctionDate: '2026-09-02',
      sanctionedAmount: 2500000,
      roi: '8.65%',
      tenureMonths: 84,
      processingFee: 12500,
      disbursedAmount: 0,
      disbursementDate: null,
      utrNo: null
    },
    subsidy: {
      eligible: true,
      schemeName: 'PMEGP Capital Subsidy',
      category: 'Special (Women / Urban)',
      subsidyPercent: 25,
      subsidyAmount: 625000,
      kvicClaimNo: 'KVIC-GJ-SUR-2026-0412',
      claimStatus: 'Landed at Nodal Bank (TDR In-Progress)'
    },
    documents: [
      { name: 'Applicant PAN & Aadhaar Card', status: 'Verified', mandatory: true },
      { name: 'Udyam Registration Certificate', status: 'Verified', mandatory: true },
      { name: 'GST 3B Returns (Last 12 Months)', status: 'Verified', mandatory: true },
      { name: '3-Year CA Audited ITR & Balance Sheets', status: 'Verified', mandatory: true },
      { name: 'Detailed Project Report (DPR 5 Years)', status: 'Verified', mandatory: true },
      { name: 'Bank Statement (12 Months Current A/c)', status: 'Verified', mandatory: true },
      { name: 'Machinery Quotation from OEM', status: 'Verified', mandatory: true },
      { name: 'Premises Rent Agreement & Electricity Bill', status: 'Verified', mandatory: true }
    ],
    timeline: [
      { date: '14 Aug 2026', title: 'Application Initiated', desc: 'Inquiry received via website, basic eligibility assessed.' },
      { date: '17 Aug 2026', title: 'DPR & CMA Prepared', desc: 'CA-certified 5-year financial projections created.' },
      { date: '19 Aug 2026', title: 'PMEGP Portal Login', desc: 'Uploaded to JanSamarth & KVIC portal.' },
      { date: '26 Aug 2026', title: 'SBI Branch Inspection', desc: 'Field inspection completed successfully with branch manager.' },
      { date: '02 Sep 2026', title: 'Official Sanction Letter Issued', desc: 'SBI issued formal sanction of ₹25 Lakhs at 8.65% ROI.' }
    ]
  },
  {
    id: 'LN-2026-092',
    applicantName: 'Ramesh Sharma',
    businessName: 'Sharma Agro Food Processing',
    customerType: 'Partnership',
    contact: '+91 94140 33812',
    email: 'sharma.agro@yahoo.com',
    city: 'Jaipur',
    state: 'Rajasthan',
    pinCode: '302013',
    pan: 'AARPS4102M',
    aadhaarLast4: '9012',
    vintageYears: 2.0,
    gstin: '08AARPS4102M1Z5',
    udyamNumber: 'UDYAM-RJ-12-0044120',
    annualTurnover: 3200000,
    monthlySales: 260000,
    scheme: 'Mudra Tarun Scheme',
    loanType: 'Term Loan (Machinery)',
    requiredAmount: 1000000,
    loanPurpose: 'Cold press oil extraction machinery and spice grinding setup.',
    cibilScore: 742,
    cibilStatus: 'Good',
    existingLoans: 0,
    existingEmi: 0,
    stage: 'Bank Underwriting',
    priority: 'High',
    applicationDate: '2026-08-22',
    underwriter: 'Neha Sharma (Credit Analyst)',
    bankDetails: {
      lenderName: 'Punjab National Bank (PNB)',
      branch: 'M.I. Road Branch, Jaipur',
      branchManager: 'Mr. Arvind Meena',
      creditOfficer: 'Pawan Pareek',
      portalLoginId: 'MUDRA-PNB-2026-891',
      janSamarthId: 'JS-AGRI-2026-7789',
      loginDate: '2026-08-25',
      sanctionDate: null,
      sanctionedAmount: 0,
      roi: '9.15%',
      tenureMonths: 60,
      processingFee: 5000,
      disbursedAmount: 0,
      disbursementDate: null,
      utrNo: null
    },
    subsidy: {
      eligible: false,
      schemeName: 'Mudra Scheme (Collateral-Free)',
      category: 'Tarun Category',
      subsidyPercent: 0,
      subsidyAmount: 0,
      kvicClaimNo: 'N/A',
      claimStatus: 'No Capital Subsidy Applicable'
    },
    documents: [
      { name: 'Partners PAN & KYC', status: 'Verified', mandatory: true },
      { name: 'Partnership Deed & GSTIN', status: 'Verified', mandatory: true },
      { name: 'Udyam Registration Certificate', status: 'Verified', mandatory: true },
      { name: 'Bank Statement (Last 12 Months)', status: 'Verified', mandatory: true },
      { name: 'Machinery Vendor Invoices', status: 'Verified', mandatory: true },
      { name: 'FSSAI Food License', status: 'Verified', mandatory: true },
      { name: 'Projected Balance Sheet (3 Years)', status: 'In Review', mandatory: true }
    ],
    timeline: [
      { date: '22 Aug 2026', title: 'Application Created', desc: 'Mudra Tarun request logged with complete partner KYC.' },
      { date: '25 Aug 2026', title: 'Logged in PNB M.I. Road', desc: 'File submitted to branch manager Arvind Meena.' },
      { date: '30 Aug 2026', title: 'FI Completed', desc: 'Physical premises verification passed with zero remarks.' }
    ]
  },
  {
    id: 'LN-2026-104',
    applicantName: 'Dr. Vivek Saxena',
    businessName: 'Apex BioSolutions Pvt Ltd',
    customerType: 'Private Limited',
    contact: '+91 99102 77451',
    email: 'corp@apexbio.in',
    city: 'Pune',
    state: 'Maharashtra',
    pinCode: '411045',
    pan: 'AABCA8941N',
    aadhaarLast4: '3391',
    vintageYears: 4.8,
    gstin: '27AABCA8941N1Z8',
    udyamNumber: 'UDYAM-MH-26-0091442',
    annualTurnover: 12500000,
    monthlySales: 1050000,
    scheme: 'CGTMSE Collateral-Free',
    loanType: 'Term Loan + Cash Credit (CC)',
    requiredAmount: 4500000,
    loanPurpose: 'Bio-testing laboratory expansion, ISO cleanroom equipment, and working capital credit line.',
    cibilScore: 785,
    cibilStatus: 'Excellent',
    existingLoans: 800000,
    existingEmi: 28000,
    stage: 'DPR Preparation',
    priority: 'Urgent',
    applicationDate: '2026-08-28',
    underwriter: 'Rahul Mehta (Corporate Finance)',
    bankDetails: {
      lenderName: 'Bank of Baroda (BOB)',
      branch: 'Shivaji Nagar SME Branch, Pune',
      branchManager: 'Mrs. Smita Patil',
      creditOfficer: 'Kunal Gokhale',
      portalLoginId: 'Pending CMA Finalization',
      janSamarthId: 'JS-MSME-2026-1029',
      loginDate: null,
      sanctionDate: null,
      sanctionedAmount: 0,
      roi: '8.80%',
      tenureMonths: 72,
      processingFee: 22500,
      disbursedAmount: 0,
      disbursementDate: null,
      utrNo: null
    },
    subsidy: {
      eligible: true,
      schemeName: 'CGTMSE Guarantee Coverage',
      category: 'MSME Guarantee Trust (85% Risk Cover)',
      subsidyPercent: 0,
      subsidyAmount: 0,
      kvicClaimNo: 'CGTMSE-BOB-2026-99',
      claimStatus: 'Credit Guarantee Fee Waiver Eligible'
    },
    documents: [
      { name: 'Directors KYC & DIN', status: 'Verified', mandatory: true },
      { name: 'MOA, AOA & Certificate of Incorporation', status: 'Verified', mandatory: true },
      { name: '3-Year Audited Balance Sheets & Tax Audit Report', status: 'Verified', mandatory: true },
      { name: 'CMA Data 5-Year Projections', status: 'In Preparation', mandatory: true },
      { name: 'Bank Statements (SBI & HDFC 12M)', status: 'Verified', mandatory: true },
      { name: 'Lab Equipment Proforma Invoices', status: 'Verified', mandatory: true }
    ],
    timeline: [
      { date: '28 Aug 2026', title: 'Consultancy Retainer Signed', desc: 'CGTMSE proposal received for ₹45 Lakhs.' },
      { date: '31 Aug 2026', title: 'CMA Data Modelling', desc: 'DSCR ratio calculated at 1.82 (Safe for BOB sanction).' }
    ]
  },
  {
    id: 'LN-2026-118',
    applicantName: 'Gurpreet Singh',
    businessName: 'Singh Fabricators & CNC Works',
    customerType: 'Proprietorship',
    contact: '+91 98721 99014',
    email: 'singh.cnc@gmail.com',
    city: 'Ludhiana',
    state: 'Punjab',
    pinCode: '141003',
    pan: 'BHPPS9910Q',
    aadhaarLast4: '7721',
    vintageYears: 5.2,
    gstin: '03BHPPS9910Q1ZL',
    udyamNumber: 'UDYAM-PB-10-0012994',
    annualTurnover: 8500000,
    monthlySales: 710000,
    scheme: 'Machinery Loan (MSME)',
    loanType: 'Equipment Term Loan',
    requiredAmount: 3000000,
    loanPurpose: 'Imported fiber laser cutting machine with 3KW source.',
    cibilScore: 755,
    cibilStatus: 'Good',
    existingLoans: 450000,
    existingEmi: 18000,
    stage: 'Disbursed',
    priority: 'Medium',
    applicationDate: '2026-08-01',
    underwriter: 'Anil Tyagi (Senior Credit Lead)',
    bankDetails: {
      lenderName: 'Canara Bank',
      branch: 'Industrial Area B, Ludhiana',
      branchManager: 'Mr. Satish Duggal',
      creditOfficer: 'Manish Verma',
      portalLoginId: 'CAN-LDH-2026-0881',
      janSamarthId: 'JS-MACH-2026-5512',
      loginDate: '2026-08-05',
      sanctionDate: '2026-08-20',
      sanctionedAmount: 3000000,
      roi: '8.95%',
      tenureMonths: 60,
      processingFee: 15000,
      disbursedAmount: 3000000,
      disbursementDate: '2026-08-28',
      utrNo: 'CANB202608289941029'
    },
    subsidy: {
      eligible: false,
      schemeName: 'Commercial Machinery Loan',
      category: 'Standard Commercial',
      subsidyPercent: 0,
      subsidyAmount: 0,
      kvicClaimNo: 'N/A',
      claimStatus: 'No Subsidy'
    },
    documents: [
      { name: 'Proprietor KYC & Land Deed', status: 'Verified', mandatory: true },
      { name: 'Udyam Registration & GST Returns', status: 'Verified', mandatory: true },
      { name: 'Audited Financials 3 Years', status: 'Verified', mandatory: true },
      { name: 'Laser Machine Proforma Invoice & OEM Certificate', status: 'Verified', mandatory: true },
      { name: 'Disbursement Letter & Loan Agreement', status: 'Verified', mandatory: true }
    ],
    timeline: [
      { date: '01 Aug 2026', title: 'Application Logged', desc: 'Machinery loan file initiated.' },
      { date: '05 Aug 2026', title: 'File Logged in Canara Bank', desc: 'Submitted with complete quotation.' },
      { date: '20 Aug 2026', title: 'Sanction Issued', desc: 'Canara Bank sanctioned ₹30 Lakhs.' },
      { date: '28 Aug 2026', title: 'Disbursement Completed', desc: '₹30,00,000 paid to machine manufacturer via RTGS.' }
    ]
  },
  {
    id: 'LN-2026-125',
    applicantName: 'Anita Mondal',
    businessName: 'Mondal Honey & Bee-keeping Cluster',
    customerType: 'Proprietorship',
    contact: '+91 91234 56780',
    email: 'anita.honey@rediffmail.com',
    city: 'Kolkata (Rural)',
    state: 'West Bengal',
    pinCode: '700124',
    pan: 'CZMPM4419E',
    aadhaarLast4: '6610',
    vintageYears: 1.2,
    gstin: '19CZMPM4419E1ZH',
    udyamNumber: 'UDYAM-WB-14-0033190',
    annualTurnover: 1400000,
    monthlySales: 115000,
    scheme: 'PMEGP Govt Loan',
    loanType: 'Agro / Rural Enterprise',
    requiredAmount: 1500000,
    loanPurpose: 'Honey processing unit, scientific bee-boxes, glass bottling line, and rural marketing.',
    cibilScore: 712,
    cibilStatus: 'Good',
    existingLoans: 0,
    existingEmi: 0,
    stage: 'Subsidy Claimed',
    priority: 'High',
    applicationDate: '2026-07-10',
    underwriter: 'Neha Sharma (Credit Analyst)',
    bankDetails: {
      lenderName: 'Union Bank of India',
      branch: 'Barasat Rural Branch, WB',
      branchManager: 'Mr. P. C. Das',
      creditOfficer: 'Ranjit Ghosh',
      portalLoginId: 'PMEGP-2026-WB-4412',
      janSamarthId: 'JS-RUR-2026-3391',
      loginDate: '2026-07-18',
      sanctionDate: '2026-08-04',
      sanctionedAmount: 1500000,
      roi: '8.40%',
      tenureMonths: 84,
      processingFee: 7500,
      disbursedAmount: 1500000,
      disbursementDate: '2026-08-12',
      utrNo: 'UBIN20260812998811'
    },
    subsidy: {
      eligible: true,
      schemeName: 'PMEGP Capital Subsidy',
      category: 'Special (Rural Women Entrepreneur 35%)',
      subsidyPercent: 35,
      subsidyAmount: 525000,
      kvicClaimNo: 'KVIC-WB-BAR-2026-081',
      claimStatus: 'Subsidy Deposited in 3-Year TDR Lock Account'
    },
    documents: [
      { name: 'Aadhaar, PAN & Rural Resident Certificate', status: 'Verified', mandatory: true },
      { name: 'Special Category Caste / Women Affirmation', status: 'Verified', mandatory: true },
      { name: 'Udyam Registration & Bank Passbook', status: 'Verified', mandatory: true },
      { name: 'Detailed Project Report (DPR)', status: 'Verified', mandatory: true },
      { name: 'KVIC EDP Training Certificate (10 Days)', status: 'Verified', mandatory: true },
      { name: 'Subsidy TDR Receipt Copy', status: 'Verified', mandatory: true }
    ],
    timeline: [
      { date: '10 Jul 2026', title: 'Application Registered', desc: 'PMEGP rural women proposal initiated.' },
      { date: '18 Jul 2026', title: 'Submitted to JanSamarth', desc: 'KVIC verified and sponsored to Union Bank.' },
      { date: '04 Aug 2026', title: 'Union Bank Sanctioned', desc: 'Sanction letter issued for ₹15 Lakhs.' },
      { date: '12 Aug 2026', title: 'Disbursement Done', desc: 'First tranche disbursed to savings account.' },
      { date: '29 Aug 2026', title: 'Govt Subsidy Released', desc: '₹5,25,000 (35%) margin money credited to TDR deposit.' }
    ]
  }
];

