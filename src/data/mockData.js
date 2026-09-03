// Master Data for Digital Udyog Seva Enterprise CRM

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
    
    // 1. Service
    service: 'Private Limited Company Incorporation (SPICe+)',
    serviceCategory: 'MCA Corporate Services',
    
    // 2. Requirement
    requirement: {
      businessObjective: 'Establish an agri-tech automated grain sorting and packing plant in Sitapura, Jaipur.',
      authorizedCapital: '₹10,00,000 (10 Lakhs)',
      paidUpCapital: '₹1,00,000 (1 Lakh)',
      directorsCount: 2,
      shareholdingSplit: 'Sunil Sharma (60%), Rekha Sharma (40%)',
      specialNotes: 'Require corporate current account with HDFC and simultaneous MSME Udyam registration.'
    },

    // 3. Documents Checklist
    documents: [
      { name: 'Director PAN Cards', required: true, status: 'Verified' },
      { name: 'Director Aadhaar Cards (Phone Linked)', required: true, status: 'Verified' },
      { name: 'Electricity Bill of Registered Office (< 2 Months)', required: true, status: 'Verified' },
      { name: 'NOC from Property Owner', required: true, status: 'Verified' },
      { name: 'Bank Account Cancelled Cheque', required: true, status: 'Verified' },
      { name: 'DSC Form & Token Credentials', required: true, status: 'Verified' }
    ],

    // 4. Current Status
    currentStatus: 'Govt Submission (In Review)', // Initiated | Document Review | Govt Submission | Processing | Approved | Completed
    
    // 5. Current Process
    currentProcess: 'SPICe+ Part B & AGILE-PRO-S Resubmission Verification with RoC Officer',
    
    // 6. Current Location
    currentLocation: 'RoC Desk Jaipur & CRC Manesar (MCA Backoffice)',

    // 7. Assigned Person
    assignedPerson: {
      name: 'CA Rajesh Verma',
      role: 'Principal Compliance Officer',
      phone: '+91 98760 11990',
      email: 'rajesh.verma@digitaludyogseva.com'
    },

    // 8. Tasks Checklist
    tasks: [
      { id: 'T-01', task: 'Obtain & verify Director KYC details', done: true, dueDate: '2026-08-28', assignee: 'Neha Sharma' },
      { id: 'T-02', task: 'Class 3 DSC generation & video verification', done: true, dueDate: '2026-08-29', assignee: 'CS Priya Nair' },
      { id: 'T-03', task: 'Draft e-MOA and e-AOA with specialized agro clauses', done: true, dueDate: '2026-08-30', assignee: 'CS Priya Nair' },
      { id: 'T-04', task: 'Submit SPICe+ Part B on MCA V3 Portal', done: true, dueDate: '2026-09-01', assignee: 'CA Rajesh Verma' },
      { id: 'T-05', task: 'Download Certificate of Incorporation & PAN card', done: false, dueDate: '2026-09-05', assignee: 'CA Rajesh Verma' }
    ],

    // 9. Department
    department: 'Corporate MCA & Legal Compliance',

    // 10. Consultant
    consultant: {
      name: 'CS Priya Nair (FCS 8921)',
      signoffDate: '2026-08-31',
      reviewRemarks: 'All statutory declarations under Section 7(1) verified. Name conforms to Rule 8 of Companies (Incorporation) Rules.'
    },

    // 11. Timeline
    timeline: [
      { stage: 'Case Initiated & Documents Received', targetDate: '28 Aug 2026', actualDate: '28 Aug 2026', done: true },
      { stage: 'DSCs Approved & SPICe+ Part A Name Reserved', targetDate: '30 Aug 2026', actualDate: '30 Aug 2026', done: true },
      { stage: 'SPICe+ Part B & AGILE-PRO-S Filed', targetDate: '01 Sep 2026', actualDate: '01 Sep 2026', done: true },
      { stage: 'RoC Scrutiny & Approval', targetDate: '04 Sep 2026', actualDate: 'Expected Today', done: false },
      { stage: 'Certificate of Incorporation Dispatch', targetDate: '06 Sep 2026', actualDate: 'Pending', done: false }
    ],

    // 12. Completion
    completion: {
      isCompleted: false,
      completionDate: null,
      deliverables: ['Certificate of Incorporation', 'Company PAN & TAN', 'e-MOA & e-AOA', 'Director DIN Letters', 'HDFC Bank Welcome Kit'],
      dispatchTrackingNo: 'Pending Generation'
    }
  },
  {
    id: 'PRJ-2026-002',
    projectCode: 'DUS-PRJ-090',
    customerId: 'CUST-302',
    customerName: 'Apex Robotics LLP',
    contactPerson: 'Karan Malhotra',
    phone: '+91 98110 44321',
    service: 'Trademark Registration (™) & Brand Protection',
    serviceCategory: 'Intellectual Property Rights',
    
    requirement: {
      businessObjective: 'Register brand name "Apex Robotics" and logo emblem across Class 9 (Drones, Hardware) and Class 42 (Software & AI navigation).',
      authorizedCapital: 'N/A',
      paidUpCapital: 'N/A',
      directorsCount: 2,
      shareholdingSplit: 'Equal Partners',
      specialNotes: 'DPIIT startup rebate claimed: 50% statutory fee waiver applied under MSME/Startup provisions.'
    },

    documents: [
      { name: 'Logo High Resolution PNG & Vector', required: true, status: 'Verified' },
      { name: 'Form 48 Power of Attorney', required: true, status: 'Verified' },
      { name: 'User Affidavit showing usage since Jan 2026', required: true, status: 'Verified' },
      { name: 'DPIIT Startup Certificate', required: true, status: 'Verified' }
    ],

    currentStatus: 'Completed (Dispatched)',
    currentProcess: 'Form TM-A Dispatched & Application Number Generated on IP India Portal',
    currentLocation: 'Trade Marks Registry (Chennai & Mumbai Virtual IP Desk)',

    assignedPerson: {
      name: 'Neha Sharma',
      role: 'Senior IP Attorney & Trademark Agent',
      phone: '+91 98765 22110',
      email: 'neha.sharma@digitaludyogseva.com'
    },

    tasks: [
      { id: 'T-11', task: 'Conduct phonetic and visual search in Vienna code index', done: true, dueDate: '2026-08-10', assignee: 'Neha Sharma' },
      { id: 'T-12', task: 'Prepare user affidavit and stamp duty', done: true, dueDate: '2026-08-11', assignee: 'Neha Sharma' },
      { id: 'T-13', task: 'File Form TM-A with IP India portal', done: true, dueDate: '2026-08-12', assignee: 'Neha Sharma' },
      { id: 'T-14', task: 'Issue official filing receipt and TM certificate kit to client', done: true, dueDate: '2026-08-13', assignee: 'Neha Sharma' }
    ],

    department: 'Intellectual Property (IP India Desk)',

    consultant: {
      name: 'Advocate Saurabh Joshi (IP Attorney)',
      signoffDate: '2026-08-12',
      reviewRemarks: 'Zero conflicting trademarks in Class 9 or 42. Distinctive design qualifying for prima facie registration.'
    },

    timeline: [
      { stage: 'Public Search Report Prepared', targetDate: '10 Aug 2026', actualDate: '10 Aug 2026', done: true },
      { stage: 'Power of Attorney & Affidavit Executed', targetDate: '11 Aug 2026', actualDate: '11 Aug 2026', done: true },
      { stage: 'Form TM-A Filed & Challan Paid', targetDate: '12 Aug 2026', actualDate: '12 Aug 2026', done: true },
      { stage: 'TM Number & Acknowledgment Issued', targetDate: '13 Aug 2026', actualDate: '13 Aug 2026', done: true }
    ],

    completion: {
      isCompleted: true,
      completionDate: '2026-08-13',
      deliverables: ['Form TM-A Official Government Acknowledgment', 'Trademark Search Analysis Report', 'Official ™ Brand Usage Guidelines'],
      dispatchTrackingNo: 'DUS-TM-2026-0481 (Delivered Online)'
    }
  },
  {
    id: 'PRJ-2026-003',
    projectCode: 'DUS-PRJ-091',
    customerId: 'CUST-303',
    customerName: 'Pooja Fashion Hub',
    contactPerson: 'Pooja Devi',
    phone: '+91 97180 33441',
    service: 'PMEGP Govt Loan (₹25 Lakhs) & DPR Execution',
    serviceCategory: 'Govt Banking & Subsidies',
    
    requirement: {
      businessObjective: 'Procure high-speed automated textile embroidery machinery to scale garment manufacturing capacity in Surat.',
      authorizedCapital: 'N/A',
      paidUpCapital: 'N/A',
      directorsCount: 1,
      shareholdingSplit: '100% Proprietor',
      specialNotes: 'Eligible for 35% Capital Subsidy under Special Category (Woman Entrepreneur in Urban/Semi-Urban). Own contribution: 5% (₹1.25 Lakhs).'
    },

    documents: [
      { name: 'Machinery Quotations & Technical Specs', required: true, status: 'Verified' },
      { name: 'Premises Lease Agreement & Utility Bill', required: true, status: 'Verified' },
      { name: 'Promoter Aadhaar & Educational Proof (10th Pass)', required: true, status: 'Verified' },
      { name: 'EDP Training Certificate / Exemption Declaration', required: true, status: 'Verified' },
      { name: '6-Month Savings Bank Account Statement', required: true, status: 'Verified' }
    ],

    currentStatus: 'Completed (Sanctioned)',
    currentProcess: 'Loan Sanction Letter Issued by State Bank of India, Ring Road Branch Surat',
    currentLocation: 'SBI SME Hub Surat & KVIC District Task Force Desk',

    assignedPerson: {
      name: 'Anil Tyagi',
      role: 'Chief Banking & DPR Specialist',
      phone: '+91 98110 55432',
      email: 'anil.tyagi@digitaludyogseva.com'
    },

    tasks: [
      { id: 'T-21', task: 'Formulate 5-year projected profit & loss and CMA balance sheet', done: true, dueDate: '2026-08-17', assignee: 'Anil Tyagi' },
      { id: 'T-22', task: 'Submit online application on KVIC PMEGP portal', done: true, dueDate: '2026-08-19', assignee: 'Anil Tyagi' },
      { id: 'T-23', task: 'Liaise with SBI Branch Manager for file appraisal', done: true, dueDate: '2026-08-25', assignee: 'Anil Tyagi' },
      { id: 'T-24', task: 'Secure formal in-principle sanction letter for ₹25 Lakhs', done: true, dueDate: '2026-09-02', assignee: 'Anil Tyagi' }
    ],

    department: 'Government Banking & Capital Subsidies',

    consultant: {
      name: 'CA Sunil Aggarwal (Credit Consultant)',
      signoffDate: '2026-08-18',
      reviewRemarks: 'Debt Service Coverage Ratio (DSCR) is 1.84, which comfortably satisfies bank underwriting parameters.'
    },

    timeline: [
      { stage: 'Project Feasibility & CMA Data Preparation', targetDate: '17 Aug 2026', actualDate: '17 Aug 2026', done: true },
      { stage: 'KVIC Portal Submission (Application #2026/8912)', targetDate: '19 Aug 2026', actualDate: '19 Aug 2026', done: true },
      { stage: 'Bank Field Verification & Officer Interview', targetDate: '25 Aug 2026', actualDate: '25 Aug 2026', done: true },
      { stage: 'Sanction Letter Issued (₹25,00,000)', targetDate: '02 Sep 2026', actualDate: '02 Sep 2026', done: true }
    ],

    completion: {
      isCompleted: true,
      completionDate: '2026-09-02',
      deliverables: ['Official Bank Sanction Letter (₹25 Lakhs)', '5-Year CMA Project Report Bound Copy', 'KVIC Subsidy Lock Certificate'],
      dispatchTrackingNo: 'SBI-SRT-SANC-081 (Handed in Person)'
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
