import React, { createContext, useContext, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  popularServices,
  loanSchemes,
  sampleApplications,
  initialLeads,
  initialCustomers,
  initialProjects,
  initialEstimates,
  initialLoanCases,
  loanStagesMaster,
  lendersMaster
} from '../data/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Navigation & View state
  const [activeView, setActiveView] = useState('website'); // 'website' | 'crm' | 'services' | 'loans' | 'track' | 'franchise'
  const [crmSection, setCrmSection] = useState('dashboard'); // 'dashboard' | 'leads' | 'customers' | 'projects' | 'estimates' | 'loans'
  
  // Data State
  const [leads, setLeads] = useState(initialLeads);
  const [customers, setCustomers] = useState(initialCustomers);
  const [projects, setProjects] = useState(initialProjects);
  const [estimates, setEstimates] = useState(initialEstimates);
  const [applications, setApplications] = useState(sampleApplications);
  const [loanCases, setLoanCases] = useState(initialLoanCases);

  // Active Detail Drawer/Modal selections
  const [selectedLeadForDetail, setSelectedLeadForDetail] = useState(null);
  const [selectedCustomerFor360, setSelectedCustomerFor360] = useState(null);
  const [selectedProjectForDetail, setSelectedProjectForDetail] = useState(null);
  const [selectedLoanForDetail, setSelectedLoanForDetail] = useState(null);
  const [isNewLoanModalOpen, setIsNewLoanModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // -----------------------------------------------------------
  // LEAD ACTIONS
  // -----------------------------------------------------------
  const addLead = (newLead) => {
    const lead = {
      id: `LD-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toISOString().split('T')[0],
      stage: 'New Leads',
      value: newLead.value || 5000,
      leadSource: {
        channel: newLead.source || 'Website Form',
        campaign: 'Direct Inbound',
        referrer: 'Direct',
        landingPage: '/',
        ipCity: 'India',
        utmMedium: 'inbound'
      },
      sales: {
        assignedExecutive: newLead.assignedTo || 'Neha Sharma',
        department: 'Corporate Advisory',
        priority: 'High',
        targetCloseDate: '2026-09-10',
        dealValue: newLead.value || 5000,
        salesProbability: '75%'
      },
      followUps: [
        { id: 1, type: 'Phone Call', date: new Date().toISOString().split('T')[0], time: '11:00 AM', notes: 'Initial customer inquiry received.', status: 'Pending' }
      ],
      interested: {
        temperature: 'Hot',
        selectedPackages: [newLead.service || 'Business Compliance'],
        budget: `₹${newLead.value || 5000}`,
        timeline: '7 Days'
      },
      eligibility: {
        cibilScore: 750,
        annualTurnover: '₹25 Lakhs',
        gstStatus: 'In Verification',
        directorsCount: 2,
        residencyStatus: 'Indian Resident',
        verdict: 'Eligible',
        checkedDate: new Date().toISOString().split('T')[0]
      },
      quotation: {
        quoteNo: `QUO-2026-${Math.floor(100 + Math.random() * 900)}`,
        date: new Date().toISOString().split('T')[0],
        items: [{ desc: newLead.service || 'Professional Service Fee', amount: newLead.value || 5000 }],
        subtotal: newLead.value || 5000,
        gst: (newLead.value || 5000) * 0.18,
        total: (newLead.value || 5000) * 1.18,
        status: 'Generated'
      },
      payment: {
        advancePaid: 0,
        balanceDue: (newLead.value || 5000) * 1.18,
        mode: 'Pending',
        utrNo: 'N/A',
        receiptNo: 'N/A',
        paymentDate: null,
        status: 'Pending'
      },
      converted: {
        isConverted: false,
        convertedDate: null,
        customerId: null,
        projectId: null
      },
      ...newLead
    };
    setLeads(prev => [lead, ...prev]);
    showToast(`Lead registered for ${lead.name}! Assigned to ${lead.sales.assignedExecutive}.`);
    return lead;
  };

  const updateLeadStage = (leadId, newStage) => {
    setLeads(prev => prev.map(lead => {
      if (lead.id === leadId) {
        if (newStage === 'Converted') {
          convertLeadToCustomerAndProject(leadId);
        } else {
          showToast(`Lead stage updated to "${newStage}"`);
        }
        return { ...lead, stage: newStage };
      }
      return lead;
    }));
  };

  const addFollowUpToLead = (leadId, followUpData) => {
    setLeads(prev => prev.map(lead => {
      if (lead.id === leadId) {
        const newFollowUp = {
          id: (lead.followUps?.length || 0) + 1,
          ...followUpData,
          status: 'Scheduled'
        };
        const updated = {
          ...lead,
          followUps: [...(lead.followUps || []), newFollowUp]
        };
        if (selectedLeadForDetail?.id === leadId) {
          setSelectedLeadForDetail(updated);
        }
        showToast(`Follow-up scheduled with ${lead.name} on ${followUpData.date}!`);
        return updated;
      }
      return lead;
    }));
  };

  const recordLeadPayment = (leadId, paymentData) => {
    setLeads(prev => prev.map(lead => {
      if (lead.id === leadId) {
        const updated = {
          ...lead,
          payment: {
            ...lead.payment,
            ...paymentData,
            status: 'Verified & Credited'
          }
        };
        if (selectedLeadForDetail?.id === leadId) {
          setSelectedLeadForDetail(updated);
        }
        showToast(`Payment of ₹${paymentData.advancePaid} recorded for Lead ${lead.name}!`);
        return updated;
      }
      return lead;
    }));
  };

  const convertLeadToCustomerAndProject = (leadId) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 }
    });

    const newCustomerId = `CUST-${Math.floor(400 + Math.random() * 500)}`;
    const newProjectId = `PRJ-2026-${Math.floor(100 + Math.random() * 900)}`;

    // Create Customer
    const newCustomer = {
      id: newCustomerId,
      name: `${lead.name}'s Enterprise`,
      contactPerson: lead.name,
      phone: lead.phone,
      email: lead.email,
      city: lead.leadSource?.ipCity || 'Mumbai, Maharashtra',
      gstin: 'Pending Application',
      cin: 'In Processing',
      kycStatus: 'Verified',
      totalBilled: `₹${(lead.value * 1.18).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
      activeServices: [lead.service],
      customer360: {
        healthScore: 95,
        tier: 'Gold Enterprise',
        ltv: lead.value,
        relationshipManager: lead.sales?.assignedExecutive || 'CA Rajesh Verma',
        satisfactionRating: '5.0 ★',
        clientSince: 'Today',
        summary: `Converted from Lead ${lead.id}. Rapid onboarding initiated.`
      },
      kycProfile: {
        legalName: `${lead.name}'s Enterprise`,
        tradeName: lead.name,
        pan: 'Pending Document',
        aadhaarSignatory: `XXXX-XXXX-${lead.phone.slice(-4)}`,
        gstin: 'Under Filing',
        cin: 'In Process',
        registeredAddress: lead.leadSource?.ipCity || 'Corporate Address Provided',
        signatoryDesignation: 'Director / Proprietor',
        verificationDate: new Date().toISOString().split('T')[0],
        status: 'KYC Verified'
      },
      services: [
        { id: `SRV-${Math.floor(10 + Math.random() * 90)}`, name: lead.service, category: 'Corporate', status: 'Active (In Execution)', startDate: new Date().toISOString().split('T')[0], renewalDate: 'Annual', fee: `₹${lead.value}` }
      ],
      payments: [
        { id: `PAY-${Math.floor(100 + Math.random() * 900)}`, date: new Date().toISOString().split('T')[0], invoiceNo: `INV-2026-${Math.floor(100 + Math.random() * 900)}`, amount: lead.value, method: lead.payment?.mode || 'UPI', status: 'Verified', receiptUrl: '#' }
      ],
      documents: [
        { id: 'DOC-1', name: 'Identity & Address Proof', type: 'PDF', uploadDate: new Date().toISOString().split('T')[0], status: 'Verified', verifiedBy: lead.sales?.assignedExecutive }
      ],
      support: [],
      projects: [
        { id: newProjectId, name: `${lead.name} — ${lead.service}`, service: lead.service, status: 'Execution Initiated', progress: 25 }
      ],
      previousHistory: [
        { id: 1, date: new Date().toISOString().split('T')[0], event: `Converted from Lead #${lead.id}`, performedBy: lead.sales?.assignedExecutive, notes: 'Case launched & onboarding activated.' }
      ]
    };

    // Create Project
    const newProject = {
      id: newProjectId,
      projectCode: `DUS-PRJ-${Math.floor(100 + Math.random() * 900)}`,
      customerId: newCustomerId,
      customerName: newCustomer.name,
      contactPerson: lead.name,
      phone: lead.phone,
      service: lead.service,
      serviceCategory: 'Corporate & Legal Services',
      requirement: {
        businessObjective: `Successfully complete ${lead.service} for client.`,
        authorizedCapital: '₹10,00,000',
        paidUpCapital: '₹1,00,000',
        directorsCount: 2,
        shareholdingSplit: 'Standard Promoter Allocation',
        specialNotes: lead.notes || 'Proceed with priority filing.'
      },
      documents: [
        { name: 'Director PAN Cards', required: true, status: 'Verified' },
        { name: 'Director Aadhaar Cards', required: true, status: 'Verified' },
        { name: 'Registered Office Address Proof', required: true, status: 'Under Review' },
        { name: 'DSC Authorization Token', required: true, status: 'Verified' }
      ],
      currentStatus: 'Initiated',
      currentProcess: 'Intake Verification & Drafting Statutory Declarations',
      currentLocation: 'Corporate Backoffice Command Desk',
      assignedPerson: {
        name: lead.sales?.assignedExecutive || 'CA Rajesh Verma',
        role: 'Case Officer',
        phone: '+91 98760 11990',
        email: 'caseofficer@digitaludyogseva.com'
      },
      tasks: [
        { id: 'T-01', task: 'Review client intake documents', done: true, dueDate: 'Today', assignee: lead.sales?.assignedExecutive },
        { id: 'T-02', task: 'Generate Class 3 DSC credentials', done: false, dueDate: 'Tomorrow', assignee: 'CS Priya Nair' },
        { id: 'T-03', task: 'Draft statutory MOA/AOA declarations', done: false, dueDate: '+3 Days', assignee: 'CA Rajesh Verma' }
      ],
      department: 'Corporate Legal & MCA',
      consultant: {
        name: 'CS Priya Nair (FCS 8921)',
        signoffDate: 'Today',
        reviewRemarks: 'Pre-check completed. Ready for portal submission.'
      },
      timeline: [
        { stage: 'Case Initiated from Lead Conversion', targetDate: 'Today', actualDate: 'Today', done: true },
        { stage: 'Document Scrutiny & DSC Signature', targetDate: '+2 Days', actualDate: 'Pending', done: false },
        { stage: 'Government Portal Submission', targetDate: '+4 Days', actualDate: 'Pending', done: false },
        { stage: 'Final Certification & Dispatch', targetDate: '+7 Days', actualDate: 'Pending', done: false }
      ],
      completion: {
        isCompleted: false,
        completionDate: null,
        deliverables: ['Statutory Incorporation Certificate', 'Company PAN & TAN', 'Bank Account Activation Kit'],
        dispatchTrackingNo: 'Pending'
      }
    };

    setCustomers(prev => [newCustomer, ...prev]);
    setProjects(prev => [newProject, ...prev]);

    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        return {
          ...l,
          stage: 'Converted',
          converted: {
            isConverted: true,
            convertedDate: new Date().toISOString().split('T')[0],
            customerId: newCustomerId,
            projectId: newProjectId
          }
        };
      }
      return l;
    }));

    showToast(`🎉 Lead ${lead.name} converted! Customer #${newCustomerId} & Project #${newProjectId} launched!`, 'success');
  };

  // -----------------------------------------------------------
  // PROJECT ACTIONS
  // -----------------------------------------------------------
  const toggleProjectTask = (projectId, taskId) => {
    setProjects(prev => prev.map(proj => {
      if (proj.id === projectId) {
        const updatedTasks = proj.tasks.map(t => {
          if (t.id === taskId) {
            return { ...t, done: !t.done };
          }
          return t;
        });
        const updated = { ...proj, tasks: updatedTasks };
        if (selectedProjectForDetail?.id === projectId) {
          setSelectedProjectForDetail(updated);
        }
        showToast('Task status updated.');
        return updated;
      }
      return proj;
    }));
  };

  const updateProjectStatus = (projectId, newStatus, newProcess, newLocation) => {
    setProjects(prev => prev.map(proj => {
      if (proj.id === projectId) {
        const isCompleted = newStatus === 'Completed (Dispatched)' || newStatus === 'Completed (Sanctioned)';
        if (isCompleted) {
          confetti({ particleCount: 70, spread: 60 });
        }
        const updated = {
          ...proj,
          currentStatus: newStatus,
          currentProcess: newProcess || proj.currentProcess,
          currentLocation: newLocation || proj.currentLocation,
          completion: {
            ...proj.completion,
            isCompleted: isCompleted,
            completionDate: isCompleted ? new Date().toISOString().split('T')[0] : proj.completion.completionDate
          }
        };
        if (selectedProjectForDetail?.id === projectId) {
          setSelectedProjectForDetail(updated);
        }
        showToast(`Project #${projectId} updated to "${newStatus}"!`);
        return updated;
      }
      return proj;
    }));
  };

  // Estimate Actions
  const addEstimate = (estimateData) => {
    const est = {
      id: `EST-2026-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Sent',
      ...estimateData
    };
    setEstimates(prev => [est, ...prev]);
    showToast(`Quotation #${est.id} generated and sent to client!`);
    return est;
  };

  // -----------------------------------------------------------
  // GOVERNMENT LOAN CASE ACTIONS
  // -----------------------------------------------------------
  const addLoanCase = (caseData) => {
    const newCase = {
      id: `LN-2026-${Math.floor(100 + Math.random() * 900)}`,
      applicationDate: new Date().toISOString().split('T')[0],
      stage: 'Inquiry',
      priority: 'High',
      cibilScore: caseData.cibilScore || 740,
      cibilStatus: (caseData.cibilScore || 740) >= 750 ? 'Excellent' : 'Good',
      existingLoans: Number(caseData.existingLoans) || 0,
      existingEmi: Number(caseData.existingEmi) || 0,
      underwriter: 'Anil Tyagi (Senior Credit Lead)',
      bankDetails: {
        lenderName: caseData.preferredBank || 'State Bank of India (SBI)',
        branch: caseData.preferredBranch || 'Main Branch',
        branchManager: 'Not Assigned',
        creditOfficer: 'Pending Desk Review',
        portalLoginId: 'In Process',
        janSamarthId: `JS-${Math.floor(1000 + Math.random() * 9000)}`,
        loginDate: null,
        sanctionDate: null,
        sanctionedAmount: 0,
        roi: '8.75%',
        tenureMonths: 60,
        processingFee: (Number(caseData.requiredAmount) || 1000000) * 0.005,
        disbursedAmount: 0,
        disbursementDate: null,
        utrNo: null
      },
      subsidy: {
        eligible: (caseData.scheme || '').includes('PMEGP'),
        schemeName: (caseData.scheme || '').includes('PMEGP') ? 'PMEGP Capital Subsidy' : 'Standard Scheme',
        category: caseData.subsidyCategory || 'General Category',
        subsidyPercent: (caseData.scheme || '').includes('PMEGP') ? 25 : 0,
        subsidyAmount: (caseData.scheme || '').includes('PMEGP') ? (Number(caseData.requiredAmount) || 1000000) * 0.25 : 0,
        kvicClaimNo: 'Pending Portal Submission',
        claimStatus: 'Application Created'
      },
      documents: [
        { name: 'Applicant PAN & Aadhaar Card', status: 'Verified', mandatory: true },
        { name: 'Udyam Registration Certificate', status: 'Verified', mandatory: true },
        { name: 'Bank Statement (Last 12 Months)', status: 'Verified', mandatory: true },
        { name: '3-Year CA Audited ITR & Balance Sheets', status: 'In Review', mandatory: true },
        { name: 'Detailed Project Report (DPR)', status: 'In Preparation', mandatory: true },
        { name: 'Machinery / Stock Quotations', status: 'Pending Upload', mandatory: false }
      ],
      timeline: [
        { 
          date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }), 
          title: 'Case File Created', 
          desc: `Government loan inquiry logged for ${caseData.scheme || 'MSME Loan'}.` 
        }
      ],
      ...caseData
    };

    setLoanCases(prev => [newCase, ...prev]);
    showToast(`Loan Application #${newCase.id} created successfully!`);
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
    return newCase;
  };

  const updateLoanCaseStage = (caseId, newStage, remarks = '') => {
    setLoanCases(prev => prev.map(c => {
      if (c.id === caseId) {
        const updated = {
          ...c,
          stage: newStage,
          timeline: [
            {
              date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
              title: `Stage Updated to ${newStage}`,
              desc: remarks || `Status updated in pipeline by Credit Team.`
            },
            ...c.timeline
          ]
        };

        if (newStage === 'Sanctioned' && !updated.bankDetails.sanctionDate) {
          updated.bankDetails.sanctionDate = new Date().toISOString().split('T')[0];
          updated.bankDetails.sanctionedAmount = updated.requiredAmount;
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        }
        if (newStage === 'Disbursed' && !updated.bankDetails.disbursementDate) {
          updated.bankDetails.disbursementDate = new Date().toISOString().split('T')[0];
          updated.bankDetails.disbursedAmount = updated.bankDetails.sanctionedAmount || updated.requiredAmount;
          updated.bankDetails.utrNo = `RTGS${Date.now().toString().slice(-8)}`;
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
        }

        if (selectedLoanForDetail && selectedLoanForDetail.id === caseId) {
          setSelectedLoanForDetail(updated);
        }
        return updated;
      }
      return c;
    }));

    showToast(`Loan Case #${caseId} advanced to ${newStage}!`);
  };

  const updateLoanBankDetails = (caseId, bankData) => {
    setLoanCases(prev => prev.map(c => {
      if (c.id === caseId) {
        const updated = {
          ...c,
          bankDetails: { ...c.bankDetails, ...bankData }
        };
        if (selectedLoanForDetail && selectedLoanForDetail.id === caseId) {
          setSelectedLoanForDetail(updated);
        }
        return updated;
      }
      return c;
    }));
    showToast(`Bank & underwriting details updated for #${caseId}!`);
  };

  const updateLoanSubsidy = (caseId, subsidyData) => {
    setLoanCases(prev => prev.map(c => {
      if (c.id === caseId) {
        const updated = {
          ...c,
          subsidy: { ...c.subsidy, ...subsidyData }
        };
        if (selectedLoanForDetail && selectedLoanForDetail.id === caseId) {
          setSelectedLoanForDetail(updated);
        }
        return updated;
      }
      return c;
    }));
    showToast(`Subsidy status updated for #${caseId}!`);
  };

  // Tracking Action
  const trackApplication = (appId) => {
    const cleanId = appId.trim().toUpperCase();
    if (applications[cleanId]) {
      return applications[cleanId];
    }
    return null;
  };

  return (
    <AppContext.Provider
      value={{
        activeView,
        setActiveView,
        crmSection,
        setCrmSection,
        leads,
        addLead,
        updateLeadStage,
        addFollowUpToLead,
        recordLeadPayment,
        convertLeadToCustomerAndProject,
        selectedLeadForDetail,
        setSelectedLeadForDetail,
        customers,
        selectedCustomerFor360,
        setSelectedCustomerFor360,
        projects,
        toggleProjectTask,
        updateProjectStatus,
        selectedProjectForDetail,
        setSelectedProjectForDetail,
        estimates,
        addEstimate,
        loanCases,
        addLoanCase,
        updateLoanCaseStage,
        updateLoanBankDetails,
        updateLoanSubsidy,
        selectedLoanForDetail,
        setSelectedLoanForDetail,
        isNewLoanModalOpen,
        setIsNewLoanModalOpen,
        loanStagesMaster,
        lendersMaster,
        applications,
        trackApplication,
        popularServices,
        loanSchemes,
        selectedService,
        setSelectedService,
        searchQuery,
        setSearchQuery,
        toasts,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);

