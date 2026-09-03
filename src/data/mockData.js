// Master Mock Data for Digital Udyog Seva

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

export const initialLeads = [
  {
    id: 'LD-101',
    name: 'Vikram Rajput',
    phone: '+91 98765 43210',
    email: 'vikram.r@gmail.com',
    service: 'Pvt Ltd Company Registration',
    stage: 'New Leads',
    value: 7500,
    source: 'Website Form',
    assignedTo: 'Neha Sharma',
    notes: 'Planning to launch EV battery assembly unit in Pune. Needs 2 directors DIN.',
    date: '2026-09-02'
  },
  {
    id: 'LD-102',
    name: 'Amitabh Sanyal',
    phone: '+91 98230 11223',
    email: 'amitabh@sanyaltech.in',
    service: 'PMEGP Govt Loan (₹35L)',
    stage: 'Contacted',
    value: 12000,
    source: 'Google Ads',
    assignedTo: 'Rahul Mehta',
    notes: 'Wants DPR and KVIC application assistance. Own contribution ready.',
    date: '2026-09-01'
  },
  {
    id: 'LD-103',
    name: 'Meenakshi Enterprises',
    phone: '+91 97654 88765',
    email: 'meenakshi@textiles.com',
    service: 'GST Registration + 1 Yr Return',
    stage: 'In Progress',
    value: 5400,
    source: 'Franchise Partner',
    assignedTo: 'Suresh Patil',
    notes: 'Documents collected. Rent agreement stamp paper uploaded.',
    date: '2026-08-30'
  },
  {
    id: 'LD-104',
    name: 'Rajeshwari Logistics',
    phone: '+91 99112 33445',
    email: 'rajeshwari.fleet@gmail.com',
    service: 'Mudra Loan (Tarun - ₹10L)',
    stage: 'Documents Pending',
    value: 8500,
    source: 'Direct Walk-in',
    assignedTo: 'Rahul Mehta',
    notes: 'Bank 6-month statement pending from customer.',
    date: '2026-08-27'
  },
  {
    id: 'LD-105',
    name: 'GreenTech BioSolutions',
    phone: '+91 98334 55667',
    email: 'ceo@greentech.org',
    service: 'Trademark & ISO 9001',
    stage: 'Converted',
    value: 14500,
    source: 'Referral',
    assignedTo: 'Neha Sharma',
    notes: 'Payment verified. Application filed with IP India.',
    date: '2026-08-25'
  }
];

export const initialCustomers = [
  {
    id: 'CUST-301',
    name: 'Sharma Agro Solutions Pvt Ltd',
    contactPerson: 'Sunil Kumar Sharma',
    phone: '+91 94120 55890',
    email: 'sunil@sharmaagro.in',
    city: 'Jaipur, Rajasthan',
    gstin: '08AAECS1234F1Z5',
    kycStatus: 'Verified',
    totalBilled: '₹28,500',
    activeServices: ['Pvt Ltd Registration', 'GST Monthly Filing']
  },
  {
    id: 'CUST-302',
    name: 'Apex Robotics LLP',
    contactPerson: 'Karan Malhotra',
    phone: '+91 98110 44321',
    email: 'karan@apexrobotics.co',
    city: 'Bengaluru, Karnataka',
    gstin: '29AABCA9876E1Z2',
    kycStatus: 'Verified',
    totalBilled: '₹42,000',
    activeServices: ['LLP Registration', 'Trademark Filing', 'Startup India Seed Fund']
  },
  {
    id: 'CUST-303',
    name: 'Pooja Fashion Hub',
    contactPerson: 'Pooja Devi',
    phone: '+91 97180 33441',
    email: 'pooja.fashion@gmail.com',
    city: 'Surat, Gujarat',
    gstin: '24AAFFP5544K1ZP',
    kycStatus: 'Verified',
    totalBilled: '₹15,000',
    activeServices: ['PMEGP Loan Support', 'Udyam Registration']
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
