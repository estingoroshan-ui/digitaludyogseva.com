// =============================================================
// LEAD MODULE 360° AUTOPILOT - MASTER DATASETS & RULES
// DIGITAL UDYOG SEVA
// =============================================================

export const leadSourcesMaster = [
  { id: 'src-1', code: 'WEBSITE', name: 'Website Inbound Form', category: 'Digital', icon: 'Globe', active: true },
  { id: 'src-2', code: 'GOOGLE_ADS', name: 'Google PPC Search Ads', category: 'Digital', icon: 'Search', active: true },
  { id: 'src-3', code: 'FB_INSTA_ADS', name: 'Facebook & Instagram Ads', category: 'Digital', icon: 'Share2', active: true },
  { id: 'src-4', code: 'WHATSAPP_INBOUND', name: 'WhatsApp Direct Inbound', category: 'Digital', icon: 'MessageSquare', active: true },
  { id: 'src-5', code: 'YOUTUBE', name: 'YouTube MSME Channel', category: 'Digital', icon: 'Video', active: true },
  { id: 'src-6', code: 'INDIAMART', name: 'IndiaMART Verified Lead', category: 'Partner', icon: 'ShoppingBag', active: true },
  { id: 'src-7', code: 'JUSTDIAL', name: 'Justdial Verified Lead', category: 'Partner', icon: 'PhoneCall', active: true },
  { id: 'src-8', code: 'REFERRAL', name: 'Client / Peer Referral', category: 'Direct', icon: 'Users', active: true },
  { id: 'src-9', code: 'FRANCHISE', name: 'Franchise Kendra Partner', category: 'Partner', icon: 'Store', active: true },
  { id: 'src-10', code: 'AGENT_BROKER', name: 'Registered Agent / DSA', category: 'Partner', icon: 'Briefcase', active: true },
  { id: 'src-11', code: 'CA_CS_NETWORK', name: 'CA / CS Partner Network', category: 'Partner', icon: 'Award', active: true },
  { id: 'src-12', code: 'BANK_PARTNER', name: 'Bank Loan Officer Referral', category: 'Partner', icon: 'Landmark', active: true },
  { id: 'src-13', code: 'MACHINERY_PARTNER', name: 'Machinery Supplier Partner', category: 'Partner', icon: 'Wrench', active: true },
  { id: 'src-14', code: 'MARKET_VISIT', name: 'Field / Market Visit', category: 'Field', icon: 'MapPin', active: true },
  { id: 'src-15', code: 'CAMPAIGN_EVENT', name: 'Govt MSME Camp / Expo', category: 'Field', icon: 'Calendar', active: true },
  { id: 'src-16', code: 'MANUAL_ENTRY', name: 'Backoffice Direct Entry', category: 'Direct', icon: 'Edit3', active: true },
  { id: 'src-17', code: 'API_WEBHOOK', name: 'Third-Party API Webhook', category: 'API', icon: 'Code', active: true },
  { id: 'src-18', code: 'OTHER', name: 'Other Inbound Source', category: 'Other', icon: 'HelpCircle', active: true }
];

export const leadStagesMaster = [
  { id: 'stg-1', code: 'New Lead', name: 'New Lead', type: 'Active', color: '#3b82f6', badgeClass: 'badge-blue', task: 'Immediate Discovery Call' },
  { id: 'stg-2', code: 'Contact Attempted', name: 'Contact Attempted', type: 'Active', color: '#f59e0b', badgeClass: 'badge-amber', task: 'Follow-up Call Retry' },
  { id: 'stg-3', code: 'Connected', name: 'Connected', type: 'Active', color: '#10b981', badgeClass: 'badge-emerald', task: 'Discuss Scope & Timelines' },
  { id: 'stg-4', code: 'Requirement Discussed', name: 'Requirement Discussed', type: 'Active', color: '#8b5cf6', badgeClass: 'badge-purple', task: 'Prepare Itemized Estimate' },
  { id: 'stg-5', code: 'Interested', name: 'Interested', type: 'Positive', color: '#ec4899', badgeClass: 'badge-rose', task: 'Schedule Formal Consultation' },
  { id: 'stg-6', code: 'Follow-up', name: 'Follow-up Scheduled', type: 'Active', color: '#f97316', badgeClass: 'badge-saffron', task: 'Resolve Client Objections' },
  { id: 'stg-7', code: 'Appointment', name: 'Appointment Booked', type: 'Positive', color: '#06b6d4', badgeClass: 'badge-cyan', task: 'Conduct Video/Office Meeting' },
  { id: 'stg-8', code: 'Estimate', name: 'Estimate Prepared', type: 'Active', color: '#6366f1', badgeClass: 'badge-indigo', task: 'Verify Discount & Pricing' },
  { id: 'stg-9', code: 'Proposal', name: 'Proposal Sent', type: 'Positive', color: '#14b8a6', badgeClass: 'badge-teal', task: 'Track Proposal Decision' },
  { id: 'stg-10', code: 'Negotiation', name: 'Negotiation / Review', type: 'Active', color: '#eab308', badgeClass: 'badge-amber', task: 'Finalize Terms & Concessions' },
  { id: 'stg-11', code: 'Payment Pending', name: 'Payment Pending', type: 'Positive', color: '#f43f5e', badgeClass: 'badge-rose', task: 'Send Payment Link & Follow-up' },
  { id: 'stg-12', code: 'Converted', name: 'Converted (Won)', type: 'Terminal', color: '#15803d', badgeClass: 'badge-emerald', task: 'Launch Customer 360 & Project' },
  { id: 'stg-13', code: 'Not Interested', name: 'Not Interested', type: 'Negative', color: '#64748b', badgeClass: 'badge-slate', task: 'Archive Feedback' },
  { id: 'stg-14', code: 'Lost', name: 'Lost to Competitor', type: 'Negative', color: '#dc2626', badgeClass: 'badge-rose', task: 'Lost Reason Analysis' },
  { id: 'stg-15', code: 'Invalid', name: 'Invalid / Spam', type: 'Terminal', color: '#94a3b8', badgeClass: 'badge-slate', task: 'None' },
  { id: 'stg-16', code: 'Duplicate', name: 'Duplicate Entry', type: 'Terminal', color: '#94a3b8', badgeClass: 'badge-slate', task: 'Merge with Master Lead' },
  { id: 'stg-17', code: 'Do Not Contact', name: 'Do Not Contact (DND)', type: 'Terminal', color: '#0f172a', badgeClass: 'badge-dark', task: 'Permanent DND Suppression' }
];

export const coreServicesPricingMaster = [
  {
    id: 'srv-pvt-ltd',
    name: 'Private Limited Company Registration',
    category: 'Corporate MCA',
    basePrice: 4999,
    sacCode: '998311',
    gstRate: 18,
    turnaround: '7-10 Working Days',
    packages: ['2 Class-3 DSCs', '2 DINs', 'Name Reservation (RUN)', 'SPICe+ Part A & B Filing', 'COI, PAN, TAN & Bank A/c']
  },
  {
    id: 'srv-pmegp',
    name: 'PMEGP Govt Loan Detailed Project Report (DPR)',
    category: 'Govt Banking & DPR',
    basePrice: 7999,
    sacCode: '998312',
    gstRate: 18,
    turnaround: '3-4 Working Days',
    packages: ['5-Year CMA Data', 'KVIC JanSamarth Portal Filing', 'Bank Liaisoning Support', '35% Subsidy Structuring']
  },
  {
    id: 'srv-gst',
    name: 'GST Registration + 1 Year Return Filing',
    category: 'Tax & Compliance',
    basePrice: 4999,
    sacCode: '998313',
    gstRate: 18,
    turnaround: '3-5 Working Days',
    packages: ['Guaranteed GSTIN generation', '12 Months GSTR-1 & 3B Monthly Return Filing', 'Input Tax Credit Reconciliations']
  },
  {
    id: 'srv-tm',
    name: 'Trademark Registration (™) Form TM-A',
    category: 'Intellectual Property',
    basePrice: 3499,
    sacCode: '998314',
    gstRate: 18,
    turnaround: '24 Hours Filing',
    packages: ['Prior Comprehensive Public Search', 'Class Analysis', 'Filing with Trademark Registry', 'Objection Advisory']
  },
  {
    id: 'srv-fssai',
    name: 'FSSAI Food Business License (14-Digit)',
    category: 'Licensing & Compliance',
    basePrice: 2499,
    sacCode: '998315',
    gstRate: 18,
    turnaround: '5-7 Working Days',
    packages: ['FoSCoS Application Drafting', 'Category List Mapping', 'Food Safety Declaration', 'Govt Challan Verification']
  }
];

export const assignmentRulesMaster = [
  { id: 'rule-1', name: 'MCA & Company Registration to Corporate Team', criteriaType: 'Service', criteriaValue: 'Company', assignedStaff: 'Neha Sharma', priority: 1, active: true },
  { id: 'rule-2', name: 'PMEGP & Mudra Loan to Loan Specialists', criteriaType: 'Service', criteriaValue: 'Loan', assignedStaff: 'Anil Tyagi', priority: 1, active: true },
  { id: 'rule-3', name: 'Tax & GST to Taxation Desk', criteriaType: 'Service', criteriaValue: 'GST', assignedStaff: 'Suresh Patil', priority: 2, active: true },
  { id: 'rule-4', name: 'WhatsApp Inbound Rapid Telecallers', criteriaType: 'Source', criteriaValue: 'WhatsApp', assignedStaff: 'Pooja Verma', priority: 3, active: true },
  { id: 'rule-5', name: 'Rajasthan / Jaipur Leads Regional Allocation', criteriaType: 'District', criteriaValue: 'Jaipur', assignedStaff: 'Rahul Mehta', priority: 4, active: true },
  { id: 'rule-6', name: 'Default Workload Round-Robin Fallback', criteriaType: 'Workload_RoundRobin', criteriaValue: 'All', assignedStaff: 'Auto-Distribute Least Loaded', priority: 5, active: true }
];

export const aiTemplatesMaster = [
  {
    id: 'ai-tmpl-1',
    service: 'Private Limited Company Registration',
    channel: 'WhatsApp',
    templateText: 'Namaste {name}! Greetings from Digital Udyog Seva. We received your request regarding Private Limited Company Incorporation. Our all-inclusive startup package covers 2 DSCs, 2 DINs, SPICe+ MCA approval, PAN/TAN, and Zero Balance Bank Account. Would you like our senior corporate advisor to verify your proposed name and share our fast-track checklist?',
    triggersHumanHandover: false
  },
  {
    id: 'ai-tmpl-2',
    service: 'PMEGP Govt Loan Scheme',
    channel: 'WhatsApp',
    templateText: 'Namaste {name}! Digital Udyog Seva is ready to assist you with PMEGP Loan up to ₹50 Lakhs with 15% to 35% Govt Capital Subsidy. We prepare bank-approved CMA Data & Detailed Project Reports (DPR). Do you have your machinery quotation and Aadhaar ready?',
    triggersHumanHandover: false
  },
  {
    id: 'ai-tmpl-3',
    service: 'Human Assistance Request Escalation',
    channel: 'Internal System Alert',
    templateText: '🚨 [URGENT AI ESCALATION]: Client {name} requested to speak with a human manager immediately regarding {service}. High intent detected. Handed over to Telecalling Desk Queue.',
    triggersHumanHandover: true
  }
];

export const externalConsultantsMaster = [
  { id: 'ext-1', name: 'CS Priya Nair (FCS 8921)', role: 'Company Secretary', mobile: '+91 98760 11223', email: 'priya.cs@legalnetwork.in', rating: '4.9 ★', activeTasks: 2 },
  { id: 'ext-2', name: 'CA Rajesh Verma (FCA 40192)', role: 'Chartered Accountant', mobile: '+91 98221 44556', email: 'rajesh.ca@auditfirm.in', rating: '5.0 ★', activeTasks: 3 },
  { id: 'ext-3', name: 'Adv. Sanjay Sharma (D/1482/2014)', role: 'High Court Advocate', mobile: '+91 94140 88990', email: 'sanjay.adv@courtcounsel.org', rating: '4.8 ★', activeTasks: 1 },
  { id: 'ext-4', name: 'Er. Sandeep Joshi (Govt Approved Valuer)', role: 'Technical Chartered Engineer', mobile: '+91 97890 22334', email: 'sandeep.valuer@techcma.in', rating: '4.7 ★', activeTasks: 1 }
];

export const initial360Leads = [
  {
    id: 'LD-101',
    leadCode: 'LEAD-2026-101',
    name: 'Vikram Rajput',
    phone: '+91 98765 43210',
    whatsapp: '+91 98765 43210',
    email: 'vikram.r@gmail.com',
    service: 'Private Limited Company Registration',
    stage: 'Requirement Discussed',
    priority: 'Urgent',
    temperature: 'Hot',
    leadScore: 88,
    value: 7499,
    date: '2026-09-02',
    lastActivity: '10 mins ago',
    nextFollowup: 'Today, 04:30 PM',
    state: 'Maharashtra',
    district: 'Pune',
    city: 'Pune',
    businessName: 'Rajput EV Powertrain LLP',
    businessType: 'EV Manufacturing & Battery Assembly',
    requirement: 'Client wants expedited incorporation with 2 directors for state EV subsidy tender bidding. Requires DIN, DSC, and MOA objects clearance.',

    leadSource: {
      channel: 'Google PPC Search Ads',
      code: 'GOOGLE_ADS',
      campaign: 'MCA Startup Incorp Campaign Q3',
      referrer: 'google.co.in/search?q=pvt+ltd+company+registration',
      landingPage: '/services/pvt-ltd',
      ipCity: 'Pune, Maharashtra',
      utmMedium: 'cpc',
      createdAt: '2026-09-02 10:15:30',
      createdBy: 'Autopilot Ingestion Engine'
    },

    sales: {
      assignedExecutive: 'Neha Sharma',
      staffRole: 'Senior Corporate RM',
      department: 'Corporate MCA Desk',
      priority: 'Urgent',
      targetCloseDate: '2026-09-06',
      dealValue: 7499,
      salesProbability: '85%'
    },

    notes: [
      { id: 1, text: 'Client confirmed 2 directors: Vikram Rajput and Sunita Rajput. Registered office electricity bill is ready in father name (NOC will be signed).', author: 'Neha Sharma', date: '2026-09-02 11:30 AM' },
      { id: 2, text: 'Promoters have verified shareholding ratio: 60% Vikram, 40% Sunita. Paid-up capital ₹1,00,000.', author: 'Neha Sharma', date: '2026-09-03 02:15 PM' }
    ],

    calls: [
      {
        id: 'CALL-101',
        caller: 'Neha Sharma',
        callType: 'Outbound',
        callResult: 'Connected',
        durationSeconds: 245,
        recordingUrl: 'audio/call_rec_101.mp3',
        transcript: 'Neha: Hello Vikram ji, greetings from Digital Udyog Seva. Vikram: Yes madam, we want to incorporate our private limited company for EV assembly in Pune. Neha: Great, we will handle your RUN name search, 2 Class 3 DSCs, SPICe+ Part A & B, and PAN/TAN. Vikram: Please share quote with GST by evening.',
        aiCallSummary: 'Client requires urgent Pvt Ltd incorporation for EV assembly. 2 directors verified. Awaiting quotation PDF on WhatsApp.',
        nextAction: 'Send Formal Proposal with Class 3 DSC inclusion',
        datetime: '2026-09-02 11:15 AM'
      }
    ],

    voiceNotes: [
      {
        id: 'VN-101',
        staffName: 'Neha Sharma',
        durationSeconds: 18,
        transcript: 'ग्राहक ने बताया कि उसको प्राइवेट लिमिटेड कंपनी जल्दी चाहिए और कल दोपहर 2 बजे तक प्रपोजल एक्सेप्ट करके एडवांस पेमेंट कर देगा।',
        aiExtractedIntent: 'Company Incorporation Approval & Advance Payment',
        aiExtractedService: 'Private Limited Company Registration',
        aiExtractedFollowupTime: 'Tomorrow 02:00 PM',
        actionStatus: 'Task_Created',
        createdAt: '2026-09-03 03:40 PM'
      }
    ],

    followUps: [
      { id: 1, type: 'Phone Call', date: '2026-09-02', time: '11:30 AM', notes: 'Initial discovery call and director KYC verification.', status: 'Completed', officer: 'Neha Sharma' },
      { id: 2, type: 'WhatsApp Follow-up', date: '2026-09-04', time: '04:30 PM', notes: 'Follow up on proposal acceptance and advance token.', status: 'Pending', officer: 'Neha Sharma' }
    ],

    tasks: [
      { id: 'TSK-101', title: 'Scrutinize Director KYC (PAN & Aadhaar)', type: 'Document_Scrutiny', priority: 'High', dueDate: 'Today', status: 'Completed', isAutoGenerated: true },
      { id: 'TSK-102', title: 'Prepare RUN Name Reservation Form', type: 'Filing_Draft', priority: 'Urgent', dueDate: 'Tomorrow', status: 'Pending', isAutoGenerated: true },
      { id: 'TSK-103', title: 'Generate Digital Signature Class 3 Tokens', type: 'DSC_Creation', priority: 'Medium', dueDate: '2026-09-06', status: 'Pending', isAutoGenerated: false }
    ],

    appointments: [
      { id: 'APP-101', type: 'Video Conference (Google Meet)', title: 'MCA Incorporation Final Review with Promoters', date: '2026-09-05', time: '11:00 AM', duration: '30 mins', link: 'https://meet.google.com/dus-pvt-ltd', status: 'Confirmed' }
    ],

    documents: [
      { id: 'DOC-101', name: 'Director 1 PAN Card (Vikram Rajput)', category: 'Identity Proof', fileName: 'vikram_pan.pdf', uploadedBy: 'Neha Sharma', version: 'v1.0', remarks: 'Verified with ITD database', date: '2026-09-02' },
      { id: 'DOC-102', name: 'Director 2 Aadhaar Card (Sunita Rajput)', category: 'Identity Proof', fileName: 'sunita_aadhaar.pdf', uploadedBy: 'Neha Sharma', version: 'v1.0', remarks: 'Mobile linked Aadhaar verified', date: '2026-09-02' },
      { id: 'DOC-103', name: 'Registered Office Electricity Bill (Pune)', category: 'Address Proof', fileName: 'pune_office_bill.pdf', uploadedBy: 'Neha Sharma', version: 'v1.0', remarks: 'Under 2 months old bill', date: '2026-09-03' }
    ],

    estimates: [
      {
        id: 'EST-101',
        estimateCode: 'EST-2026-101',
        serviceName: 'Private Limited Company Registration',
        basePrice: 4999,
        quantity: 1,
        discountAmount: 500,
        taxableAmount: 4499,
        gstPercent: 18,
        gstAmount: 809.82,
        totalAmount: 5308.82,
        status: 'Sent',
        createdBy: 'Neha Sharma',
        date: '2026-09-02'
      }
    ],

    proposals: [
      {
        id: 'PROP-101',
        proposalCode: 'PROP-2026-101',
        title: 'Complete Corporate Incorporation & Compliance Package',
        scopeOfWork: 'Complete private limited company incorporation with SPICe+ MCA filing, 2 DSCs, 2 DINs, Name Approval, PAN/TAN, and Bank Account kit.',
        deliverables: '1. Certificate of Incorporation (COI), 2. PAN & TAN, 3. MOA & AOA, 4. 2 Class-3 USB Tokens, 5. Bank Account Approval',
        totalValue: 5308.82,
        validUntil: '2026-09-17',
        status: 'Sent',
        sentVia: 'WhatsApp & Email',
        openedCount: 3,
        createdBy: 'Neha Sharma',
        date: '2026-09-02'
      }
    ],

    payments: [
      {
        id: 'PAY-101',
        receiptNo: 'REC-2026-101',
        type: 'Token_Advance',
        amount: 3000,
        paymentMode: 'UPI (Google Pay)',
        transactionRef: 'UPI/3892019482/YESB',
        paymentLink: 'https://pay.digitaludyogseva.com/l/LD-101-ADV',
        termsAccepted: true,
        noRefundConsent: true,
        status: 'Verified',
        date: '2026-09-03',
        verifiedBy: 'Accounts Desk'
      }
    ],

    externalTasks: [
      {
        id: 'EXT-101',
        consultantName: 'CS Priya Nair (FCS 8921)',
        role: 'Company Secretary',
        mobile: '+91 98760 11223',
        scope: 'Draft main objects clause for EV assembly and certify SPICe+ Part B statutory declaration.',
        deliverable: 'Approved MOA Main Objects & Digitally Signed Form',
        deadline: '2026-09-05',
        payoutAgreed: 1200,
        status: 'In_Review',
        submissionNotes: 'Objects drafted adhering to National Electric Mobility Mission. Awaiting client signature.',
        submissionFileUrl: 'docs/ev_moa_draft_v1.pdf',
        assignedBy: 'Neha Sharma'
      }
    ],

    activities: [
      { id: 1, type: 'created', title: 'Lead Ingested via Autopilot', desc: 'Google PPC Ads inbound. Auto-assigned to Neha Sharma.', staff: 'Autopilot Engine', time: '02 Sep 10:15 AM' },
      { id: 2, type: 'ai_response', title: 'AI WhatsApp Response Dispatched', desc: 'Sent MCA incorporation fast-track greeting and checklist.', staff: 'AI Bot', time: '02 Sep 10:16 AM' },
      { id: 3, type: 'call', title: 'Discovery Call Completed', desc: 'Connected for 245s. Confirmed 2 directors.', staff: 'Neha Sharma', time: '02 Sep 11:15 AM' },
      { id: 4, type: 'proposal', title: 'Proposal PROP-2026-101 Dispatched', desc: 'Total ₹5,308.82 sent via WhatsApp.', staff: 'Neha Sharma', time: '02 Sep 04:20 PM' },
      { id: 5, type: 'payment', title: 'Advance Payment Credited', desc: '₹3,000 token received via UPI.', staff: 'Accounts Desk', time: '03 Sep 02:30 PM' },
      { id: 6, type: 'voice_note', title: 'Voice Note Transcribed', desc: 'Staff recorded voice memo. Follow-up scheduled.', staff: 'Neha Sharma', time: '03 Sep 03:40 PM' }
    ],

    auditLogs: [
      { id: 1, action: 'Price_Change', field: 'discount_amount', oldVal: '₹0.00', newVal: '₹500.00', user: 'Neha Sharma (RM)', reason: 'First-time founder promotion concession applied', time: '02 Sep 04:18 PM' },
      { id: 2, action: 'Assignment', field: 'assigned_employee', oldVal: 'Unassigned Queue', newVal: 'Neha Sharma', user: 'Auto-Assignment Rule Engine', reason: 'Rule #1: MCA Company Registration matched', time: '02 Sep 10:15 AM' },
      { id: 3, action: 'Status_Change', field: 'lead_stage', oldVal: 'New Lead', newVal: 'Requirement Discussed', user: 'Neha Sharma', reason: 'Directors verified on discovery call', time: '02 Sep 11:20 AM' }
    ],

    aiSummary: {
      clientIntent: 'Wants expedited Private Limited Company Incorporation for EV battery assembly unit in Pune.',
      interestedService: 'Private Limited Company Registration',
      interestScore: 88,
      interestTemperature: 'Hot',
      potentialObjection: 'May need clarity on registered office NOC format since utility bill is in father name.',
      budgetTimeline: 'Budget ₹5,000 - ₹8,000 | Target Close Date: 06 Sep 2026',
      lastInteractionRecap: 'Call completed & voice memo recorded. Token advance of ₹3,000 credited.',
      recommendedNextAction: 'Review CS Priya Nair MOA draft and schedule name approval filing.'
    },

    converted: {
      isConverted: false,
      convertedDate: null,
      customerId: null,
      projectId: null
    }
  },
  {
    id: 'LD-102',
    leadCode: 'LEAD-2026-102',
    name: 'Amitabh Sanyal',
    phone: '+91 98230 11223',
    whatsapp: '+91 98230 11223',
    email: 'amitabh@sanyaltech.in',
    service: 'PMEGP Govt Loan (₹35L)',
    stage: 'Proposal',
    priority: 'Urgent',
    temperature: 'Hot',
    leadScore: 92,
    value: 12000,
    date: '2026-09-01',
    lastActivity: '1 hour ago',
    nextFollowup: 'Tomorrow, 11:00 AM',
    state: 'Uttar Pradesh',
    district: 'Varanasi',
    city: 'Varanasi',
    businessName: 'Sanyal Agro & Cold Storage Unit',
    businessType: 'Agro Processing & Solar Cold Storage',
    requirement: 'Applicant has 10% own contribution ready. Wants Detailed Project Report (DPR) tailored for KVIC & Punjab National Bank 35% capital subsidy.',

    leadSource: {
      channel: 'Facebook & Instagram Ads',
      code: 'FB_INSTA_ADS',
      campaign: 'PMEGP 35% Capital Subsidy Promo',
      referrer: 'facebook.com/ad/pmegp-subsidy',
      landingPage: '/loans/pmegp',
      ipCity: 'Varanasi, Uttar Pradesh',
      utmMedium: 'social_cpc',
      createdAt: '2026-09-01 09:30:00',
      createdBy: 'Autopilot Ingestion Engine'
    },

    sales: {
      assignedExecutive: 'Anil Tyagi',
      staffRole: 'Senior Credit Lead',
      department: 'Govt Banking & DPR Desk',
      priority: 'Urgent',
      targetCloseDate: '2026-09-06',
      dealValue: 12000,
      salesProbability: '90%'
    },

    notes: [
      { id: 1, text: 'Applicant belongs to Special Category (OBC Rural - 35% Subsidy). Land is owned by applicant with clear mutation record.', author: 'Anil Tyagi', date: '2026-09-01 10:30 AM' },
      { id: 2, text: 'Machinery quotation received from approved supplier: ₹22,50,000 for cold storage compressors and insulated panels.', author: 'Anil Tyagi', date: '2026-09-02 04:00 PM' }
    ],

    calls: [
      {
        id: 'CALL-102',
        caller: 'Anil Tyagi',
        callType: 'Outbound',
        callResult: 'Connected',
        durationSeconds: 310,
        recordingUrl: 'audio/call_rec_102.mp3',
        transcript: 'Anil: Amitabh ji, I have verified your machinery quotation. You are eligible for full 35% subsidy under PMEGP rural category. Amitabh: Sir, please prepare bank CMA and portal submission file immediately.',
        aiCallSummary: 'Verified 35% subsidy eligibility and ₹22.5L machinery quotation. Client agreed to DPR drafting fee ₹12,000.',
        nextAction: 'Submit formal proposal and assign CMA preparation to CA Rajesh Verma',
        datetime: '2026-09-02 04:15 PM'
      }
    ],

    voiceNotes: [
      {
        id: 'VN-102',
        staffName: 'Anil Tyagi',
        durationSeconds: 22,
        transcript: 'क्लाइंट की मशीनरी कोटेशन आ गई है और उसका सीए डेटा तुरंत बनाकर पीएनबी बैंक की मुख्य शाखा को भेजना है।',
        aiExtractedIntent: 'Bank CMA Preparation & Subsidy Structuring',
        aiExtractedService: 'PMEGP Govt Loan Scheme',
        aiExtractedFollowupTime: 'Tomorrow 11:00 AM',
        actionStatus: 'Task_Created',
        createdAt: '2026-09-02 05:00 PM'
      }
    ],

    followUps: [
      { id: 1, type: 'Video Call', date: '2026-09-02', time: '04:00 PM', notes: 'Verified project site papers and electricity connection.', status: 'Completed', officer: 'Anil Tyagi' },
      { id: 2, type: 'Phone Call', date: '2026-09-05', time: '11:00 AM', notes: 'Confirm DPR draft and JanSamarth portal submission login.', status: 'Scheduled', officer: 'Anil Tyagi' }
    ],

    tasks: [
      { id: 'TSK-201', title: 'Prepare 5-Year Financial CMA Projections', type: 'DPR_Preparation', priority: 'Urgent', dueDate: 'Today', status: 'In_Progress', isAutoGenerated: true },
      { id: 'TSK-202', title: 'KVIC JanSamarth Portal Application Entry', type: 'Portal_Filing', priority: 'High', dueDate: '2026-09-06', status: 'Pending', isAutoGenerated: true }
    ],

    appointments: [
      { id: 'APP-102', type: 'Office Meeting', title: 'PNB Branch Manager Liaisoning Meeting', date: '2026-09-08', time: '02:00 PM', duration: '45 mins', location: 'PNB Varanasi Main Branch', status: 'Confirmed' }
    ],

    documents: [
      { id: 'DOC-201', name: 'Applicant PAN & Aadhaar (OBC Rural)', category: 'Identity Proof', fileName: 'amitabh_kyc.pdf', uploadedBy: 'Anil Tyagi', version: 'v1.0', remarks: 'Rural domicile certified', date: '2026-09-01' },
      { id: 'DOC-202', name: 'Machinery Quotation (₹22.50L)', category: 'Financials', fileName: 'machinery_quote_pune.pdf', uploadedBy: 'Anil Tyagi', version: 'v1.0', remarks: 'ISO certified vendor quote', date: '2026-09-02' }
    ],

    estimates: [
      {
        id: 'EST-102',
        estimateCode: 'EST-2026-102',
        serviceName: 'Comprehensive PMEGP DPR + JanSamarth Filing',
        basePrice: 12000,
        quantity: 1,
        discountAmount: 0,
        taxableAmount: 12000,
        gstPercent: 18,
        gstAmount: 2160,
        totalAmount: 14160,
        status: 'Sent',
        createdBy: 'Anil Tyagi',
        date: '2026-09-01'
      }
    ],

    proposals: [
      {
        id: 'PROP-102',
        proposalCode: 'PROP-2026-102',
        title: 'PMEGP Detailed Project Report & JanSamarth Sponsorship Mandate',
        scopeOfWork: 'Comprehensive 5-year financial CMA modeling, DSCR calculations, KVIC portal online submission, and bank forwarding to Punjab National Bank.',
        deliverables: '1. Bank-Compliant 28-Page DPR Report, 2. JanSamarth Sponsorship Acknowledgement, 3. Subsidy Claim Tracker',
        totalValue: 14160,
        validUntil: '2026-09-16',
        status: 'Sent',
        sentVia: 'WhatsApp',
        openedCount: 5,
        createdBy: 'Anil Tyagi',
        date: '2026-09-01'
      }
    ],

    payments: [
      {
        id: 'PAY-102',
        receiptNo: 'REC-2026-102',
        type: 'Token_Advance',
        amount: 5000,
        paymentMode: 'NEFT / Netbanking',
        transactionRef: 'PUNBH26090128391',
        paymentLink: 'https://pay.digitaludyogseva.com/l/LD-102-DPR',
        termsAccepted: true,
        noRefundConsent: true,
        status: 'Verified',
        date: '2026-09-02',
        verifiedBy: 'Accounts Desk'
      }
    ],

    externalTasks: [
      {
        id: 'EXT-102',
        consultantName: 'CA Rajesh Verma (FCA 40192)',
        role: 'Chartered Accountant',
        mobile: '+91 98221 44556',
        scope: 'Audit 5-year projected profit & loss statement, balance sheet, and DSCR ratios for ₹35L PMEGP case.',
        deliverable: 'CA Signed CMA Data Sheet & Net Worth Statement',
        deadline: '2026-09-06',
        payoutAgreed: 2500,
        status: 'Assigned',
        submissionNotes: 'Data received. Preparing sensitivity analysis.',
        submissionFileUrl: null,
        assignedBy: 'Anil Tyagi'
      }
    ],

    activities: [
      { id: 1, type: 'created', title: 'Lead Ingested via FB Ads', desc: 'PMEGP promo ad lead. Auto-assigned to Anil Tyagi.', staff: 'Autopilot Engine', time: '01 Sep 09:30 AM' },
      { id: 2, type: 'ai_response', title: 'AI Subsidy Knowledge Dispatched', desc: 'Dispatched 35% capital subsidy requirements on WhatsApp.', staff: 'AI Bot', time: '01 Sep 09:31 AM' },
      { id: 3, type: 'call', title: 'Subsidy Eligibility Confirmed', desc: 'Call duration 310s. Machinery quotation verified.', staff: 'Anil Tyagi', time: '02 Sep 04:15 PM' },
      { id: 4, type: 'payment', title: 'Token Advance ₹5,000 Received', desc: 'Credited via PNB Netbanking.', staff: 'Accounts Desk', time: '02 Sep 04:50 PM' }
    ],

    auditLogs: [
      { id: 1, action: 'Assignment', field: 'assigned_employee', oldVal: 'Unassigned', newVal: 'Anil Tyagi', user: 'Rule Engine', reason: 'Rule #2: PMEGP Loan Service matched', time: '01 Sep 09:30 AM' },
      { id: 2, action: 'Status_Change', field: 'lead_stage', oldVal: 'Contacted', newVal: 'Proposal Sent', user: 'Anil Tyagi', reason: 'Quotation accepted and advance received', time: '02 Sep 04:55 PM' }
    ],

    aiSummary: {
      clientIntent: 'Requires bank-ready DPR for ₹35L PMEGP cold storage project to secure 35% capital subsidy.',
      interestedService: 'PMEGP Govt Loan Scheme',
      interestScore: 92,
      interestTemperature: 'Hot',
      potentialObjection: 'Needs assurance regarding JanSamarth portal processing turnaround time.',
      budgetTimeline: 'Deal Value ₹12,000 + GST | Target JanSamarth Login: 06 Sep 2026',
      lastInteractionRecap: 'Quotation verified & ₹5,000 token received. CA Rajesh Verma drafting CMA sheet.',
      recommendedNextAction: 'Review completed CMA data and dispatch PDF draft for client approval.'
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
    leadCode: 'LEAD-2026-103',
    name: 'Meenakshi Textiles',
    phone: '+91 97654 88765',
    whatsapp: '+91 97654 88765',
    email: 'meenakshi@textiles.com',
    service: 'GST Registration + 1 Yr Return',
    stage: 'Payment Pending',
    priority: 'Medium',
    temperature: 'Warm',
    leadScore: 78,
    value: 5400,
    date: '2026-08-30',
    lastActivity: '3 hours ago',
    nextFollowup: 'Today, 05:00 PM',
    state: 'Gujarat',
    district: 'Surat',
    city: 'Surat',
    businessName: 'Meenakshi Silk & Jacquard Weaving',
    businessType: 'Textile Manufacturing & Wholesale',
    requirement: 'New GSTIN required urgently for inter-state yarn procurement from Maharashtra.',

    leadSource: {
      channel: 'Franchise Kendra Partner',
      code: 'FRANCHISE',
      campaign: 'Surat District Partner Desk',
      referrer: 'Franchise Kendra #FR-042',
      landingPage: '/franchise-referral',
      ipCity: 'Surat, Gujarat',
      utmMedium: 'offline',
      createdAt: '2026-08-30 11:00:00',
      createdBy: 'Franchise Manager Surat'
    },

    sales: {
      assignedExecutive: 'Suresh Patil',
      staffRole: 'Taxation Lead',
      department: 'Indirect Tax Desk',
      priority: 'Medium',
      targetCloseDate: '2026-09-05',
      dealValue: 5400,
      salesProbability: '95%'
    },

    notes: [
      { id: 1, text: 'Rent agreement stamp paper and electricity bill verified from Surat Franchise Desk.', author: 'Suresh Patil', date: '2026-08-30 12:00 PM' }
    ],
    calls: [],
    voiceNotes: [],
    followUps: [
      { id: 1, type: 'WhatsApp', date: '2026-09-04', time: '05:00 PM', notes: 'Payment link reminder for ₹5,400.', status: 'Pending', officer: 'Suresh Patil' }
    ],
    tasks: [
      { id: 'TSK-301', title: 'Prepare Form GST REG-01 Draft', type: 'Tax_Filing', priority: 'Medium', dueDate: 'Today', status: 'Pending', isAutoGenerated: true }
    ],
    appointments: [],
    documents: [
      { id: 'DOC-301', name: 'Proprietor Aadhaar & PAN Card', category: 'Identity Proof', fileName: 'meenakshi_kyc.pdf', uploadedBy: 'Suresh Patil', version: 'v1.0', remarks: 'Verified', date: '2026-08-30' }
    ],
    estimates: [
      {
        id: 'EST-103',
        estimateCode: 'EST-2026-103',
        serviceName: 'GST Registration + 1 Yr Return Retainer',
        basePrice: 5400,
        quantity: 1,
        discountAmount: 0,
        taxableAmount: 5400,
        gstPercent: 18,
        gstAmount: 972,
        totalAmount: 6372,
        status: 'Sent',
        createdBy: 'Suresh Patil',
        date: '2026-08-30'
      }
    ],
    proposals: [
      {
        id: 'PROP-103',
        proposalCode: 'PROP-2026-103',
        title: 'GST Compliance & Annual Filing Plan',
        scopeOfWork: 'GSTIN Registration and 12-month GSTR-1 & 3B return filings.',
        deliverables: 'GSTIN Certificate & Monthly Filing Receipts',
        totalValue: 6372,
        validUntil: '2026-09-15',
        status: 'Accepted',
        sentVia: 'WhatsApp',
        openedCount: 2,
        createdBy: 'Suresh Patil',
        date: '2026-08-30'
      }
    ],
    payments: [
      {
        id: 'PAY-103',
        receiptNo: 'REC-2026-103',
        type: 'Full_Payment',
        amount: 6372,
        paymentMode: 'UPI (PhonePe)',
        transactionRef: 'UPI/28941049281/SBI',
        paymentLink: 'https://pay.digitaludyogseva.com/l/LD-103-GST',
        termsAccepted: true,
        noRefundConsent: true,
        status: 'Pending',
        date: '2026-08-31',
        verifiedBy: null
      }
    ],
    externalTasks: [],
    activities: [
      { id: 1, type: 'created', title: 'Lead Sourced from Franchise Kendra #FR-042', desc: 'Auto-assigned to Suresh Patil.', staff: 'Autopilot Engine', time: '30 Aug 11:00 AM' }
    ],
    auditLogs: [],
    aiSummary: {
      clientIntent: 'Wants fast GST registration and 12-month monthly return filing retainer.',
      interestedService: 'GST Registration + 1 Yr Return',
      interestScore: 78,
      interestTemperature: 'Warm',
      potentialObjection: 'Needs fast GSTIN generation in 3 days.',
      budgetTimeline: '₹6,372 all inclusive.',
      lastInteractionRecap: 'Payment pending confirmation.',
      recommendedNextAction: 'Send automated WhatsApp payment reminder and verify REG-01 draft.'
    },
    converted: {
      isConverted: false,
      convertedDate: null,
      customerId: null,
      projectId: null
    }
  },
  {
    id: 'LD-104',
    leadCode: 'LEAD-2026-104',
    name: 'Rajeshwari Cold Logistics',
    phone: '+91 99112 33445',
    whatsapp: '+91 99112 33445',
    email: 'rajeshwari.fleet@gmail.com',
    service: 'Mudra Loan (Tarun - ₹10L)',
    stage: 'Follow-up',
    priority: 'High',
    temperature: 'Warm',
    leadScore: 72,
    value: 8500,
    date: '2026-08-27',
    lastActivity: '4 hours ago',
    nextFollowup: 'Today, 03:00 PM',
    state: 'Rajasthan',
    district: 'Jaipur',
    city: 'Jaipur',
    businessName: 'Rajeshwari Refrigerated Fleet Services',
    businessType: 'Commercial Goods Transport',
    requirement: 'Collateral-free working capital loan for fleet expansion of 2 refrigerated vans.',

    leadSource: {
      channel: 'Field / Market Visit',
      code: 'MARKET_VISIT',
      campaign: 'Transport Nagar Industrial Drive',
      referrer: 'Jaipur Transport Hub Kendra',
      landingPage: '/walk-in',
      ipCity: 'Jaipur, Rajasthan',
      utmMedium: 'field',
      createdAt: '2026-08-27 02:00:00',
      createdBy: 'Rahul Mehta'
    },

    sales: {
      assignedExecutive: 'Rahul Mehta',
      staffRole: 'Field Relationship Officer',
      department: 'Banking & Transport Finance Desk',
      priority: 'High',
      targetCloseDate: '2026-09-08',
      dealValue: 8500,
      salesProbability: '75%'
    },

    notes: [
      { id: 1, text: '6-month bank statement collected. CIBIL score 730 verified. Preparing CMA file.', author: 'Rahul Mehta', date: '2026-08-28 11:00 AM' }
    ],
    calls: [],
    voiceNotes: [],
    followUps: [
      { id: 1, type: 'Phone Call', date: '2026-09-04', time: '03:00 PM', notes: 'Collect last year audited ITR copy.', status: 'Pending', officer: 'Rahul Mehta' }
    ],
    tasks: [
      { id: 'TSK-401', title: 'Collect Partner PAN & Vehicle RC Book Copy', type: 'Document_Collection', priority: 'High', dueDate: 'Today', status: 'Pending', isAutoGenerated: true }
    ],
    appointments: [],
    documents: [
      { id: 'DOC-401', name: 'Partnership Deed (Registered)', category: 'Business Docs', fileName: 'rajeshwari_deed.pdf', uploadedBy: 'Rahul Mehta', version: 'v1.0', remarks: 'Verified', date: '2026-08-27' }
    ],
    estimates: [
      {
        id: 'EST-104',
        estimateCode: 'EST-2026-104',
        serviceName: 'Mudra Loan File & CMA Preparation',
        basePrice: 8500,
        quantity: 1,
        discountAmount: 0,
        taxableAmount: 8500,
        gstPercent: 18,
        gstAmount: 1530,
        totalAmount: 10030,
        status: 'Sent',
        createdBy: 'Rahul Mehta',
        date: '2026-08-27'
      }
    ],
    proposals: [
      {
        id: 'PROP-104',
        proposalCode: 'PROP-2026-104',
        title: 'Mudra Tarun Scheme ₹10L Assistance Proposal',
        scopeOfWork: 'Preparation of CMA data, bank application forms, and submission to SBI Transport Nagar Branch.',
        deliverables: 'Bank File & Sanction Follow-up',
        totalValue: 10030,
        validUntil: '2026-09-12',
        status: 'Sent',
        sentVia: 'Direct',
        openedCount: 1,
        createdBy: 'Rahul Mehta',
        date: '2026-08-27'
      }
    ],
    payments: [
      {
        id: 'PAY-104',
        receiptNo: 'REC-2026-104',
        type: 'Token_Advance',
        amount: 2000,
        paymentMode: 'Cash Office Receipt',
        transactionRef: 'CASH-REC-041',
        paymentLink: '#',
        termsAccepted: true,
        noRefundConsent: true,
        status: 'Verified',
        date: '2026-08-28',
        verifiedBy: 'Cash Desk'
      }
    ],
    externalTasks: [],
    activities: [
      { id: 1, type: 'created', title: 'Market Visit Lead Logged', desc: 'Direct field intake by Rahul Mehta.', staff: 'Rahul Mehta', time: '27 Aug 02:00 PM' }
    ],
    auditLogs: [],
    aiSummary: {
      clientIntent: 'Mudra Tarun loan for transport van expansion.',
      interestedService: 'Mudra Loan (Tarun - ₹10L)',
      interestScore: 72,
      interestTemperature: 'Warm',
      potentialObjection: 'Awaiting balance sheets.',
      budgetTimeline: 'Deal Value ₹8,500.',
      lastInteractionRecap: 'Token of ₹2,000 paid. Pending ITR file.',
      recommendedNextAction: 'Call customer to confirm ITR receipt and submit file to SBI.'
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
    leadCode: 'LEAD-2026-105',
    name: 'GreenTech BioSolutions',
    phone: '+91 98334 55667',
    whatsapp: '+91 98334 55667',
    email: 'ceo@greentech.org',
    service: 'Trademark & ISO 9001',
    stage: 'Converted',
    priority: 'High',
    temperature: 'Hot',
    leadScore: 98,
    value: 14500,
    date: '2026-08-25',
    lastActivity: 'Converted Won',
    nextFollowup: 'Completed',
    state: 'Karnataka',
    district: 'Bengaluru',
    city: 'Bengaluru',
    businessName: 'GreenTech BioSolutions Private Limited',
    businessType: 'Biotech & Organic Enzyme Formulations',
    requirement: 'Brand protection under Trademark Class 42 and ISO 9001:2015 certification for tender qualification.',

    leadSource: {
      channel: 'Client / Peer Referral',
      code: 'REFERRAL',
      campaign: 'Client Advocate Program',
      referrer: 'Apex Robotics LLP',
      landingPage: '/referral',
      ipCity: 'Bengaluru, Karnataka',
      utmMedium: 'referral',
      createdAt: '2026-08-25 10:00:00',
      createdBy: 'Neha Sharma'
    },

    sales: {
      assignedExecutive: 'Neha Sharma',
      staffRole: 'Senior Corporate RM',
      department: 'Intellectual Property Desk',
      priority: 'High',
      targetCloseDate: '2026-08-26',
      dealValue: 14500,
      salesProbability: '100%'
    },

    notes: [
      { id: 1, text: 'Trademark search report was 100% distinct. Application Form TM-A filed successfully.', author: 'Neha Sharma', date: '2026-08-26 11:00 AM' }
    ],
    calls: [],
    voiceNotes: [],
    followUps: [],
    tasks: [],
    appointments: [],
    documents: [
      { id: 'DOC-501', name: 'Form TM-A Filing Acknowledgment Receipt', category: 'Business Docs', fileName: 'tm_acknowledgement.pdf', uploadedBy: 'Neha Sharma', version: 'v1.0', remarks: 'Govt IP India Number Issued', date: '2026-08-26' }
    ],
    estimates: [],
    proposals: [],
    payments: [
      {
        id: 'PAY-105',
        receiptNo: 'REC-2026-105',
        type: 'Full_Payment',
        amount: 17110,
        paymentMode: 'Netbanking (HDFC)',
        transactionRef: 'HDFCR2608259128',
        paymentLink: '#',
        termsAccepted: true,
        noRefundConsent: true,
        status: 'Verified',
        date: '2026-08-26',
        verifiedBy: 'Accounts Desk'
      }
    ],
    externalTasks: [
      {
        id: 'EXT-501',
        consultantName: 'Adv. Sanjay Sharma (D/1482/2014)',
        role: 'Advocate',
        mobile: '+91 94140 88990',
        scope: 'Certify user affidavit and power of attorney for Trademark Class 42 filing.',
        deliverable: 'Signed Form 48 & TM-A e-Filing Verification',
        deadline: '2026-08-26',
        payoutAgreed: 1800,
        status: 'Completed',
        submissionNotes: 'All filings cleared with IP India.',
        submissionFileUrl: 'docs/tm48_signed.pdf',
        assignedBy: 'Neha Sharma'
      }
    ],
    activities: [
      { id: 1, type: 'converted', title: '🎉 Lead Converted to Customer & Project', desc: 'Customer CUST-302 and Project PRJ-2026-002 launched.', staff: 'Neha Sharma', time: '26 Aug 03:00 PM' }
    ],
    auditLogs: [],
    aiSummary: {
      clientIntent: 'Trademark and ISO certification.',
      interestedService: 'Trademark & ISO 9001',
      interestScore: 98,
      interestTemperature: 'Hot',
      potentialObjection: 'None. Won & Converted.',
      budgetTimeline: 'Fully Paid (₹17,110).',
      lastInteractionRecap: 'Converted to Customer 360° and Project Cases.',
      recommendedNextAction: 'Project Case in execution under CS/IP Team.'
    },
    converted: {
      isConverted: true,
      convertedDate: '2026-08-26',
      customerId: 'CUST-302',
      projectId: 'PRJ-2026-002'
    }
  }
];
