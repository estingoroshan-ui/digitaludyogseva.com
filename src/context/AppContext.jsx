import React, { createContext, useContext, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  popularServices,
  loanSchemes,
  sampleApplications,
  initialCustomers,
  initialProjects,
  initialEstimates,
  initialLoanCases,
  loanStagesMaster,
  lendersMaster,
  leadSourcesMaster,
  leadStagesMaster,
  coreServicesPricingMaster,
  assignmentRulesMaster,
  aiTemplatesMaster,
  externalConsultantsMaster,
  initial360Leads
} from '../data/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Navigation & View state
  const [activeView, setActiveView] = useState('website'); // 'website' | 'crm' | 'services' | 'loans' | 'track' | 'franchise'
  const [crmSection, setCrmSection] = useState('leads'); // 'leads' | 'dashboard' | 'customers' | 'projects' | 'estimates' | 'loans' | 'admin_settings' | 'external_portal'
  const [activeLeadTab, setActiveLeadTab] = useState('overview'); // Lead 360 drawer active tab

  // RBAC Active Role Switcher
  const [activeRole, setActiveRole] = useState('Admin'); // 'Admin' | 'Senior Manager' | 'Sales RM' | 'Telecaller' | 'External Consultant'

  // Master Data State
  const [leadSources, setLeadSources] = useState(leadSourcesMaster);
  const [leadStages, setLeadStages] = useState(leadStagesMaster);
  const [assignmentRules, setAssignmentRules] = useState(assignmentRulesMaster);
  const [aiTemplates, setAiTemplates] = useState(aiTemplatesMaster);
  const [externalConsultants, setExternalConsultants] = useState(externalConsultantsMaster);

  // Core Data State
  const [leads, setLeads] = useState(initial360Leads);
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
  // LEAD 360° AUTOPILOT ACTIONS
  // -----------------------------------------------------------

  // Auto-Assignment Rule Resolver
  const resolveAssignment = (sourceName, serviceName, district) => {
    const match = assignmentRules.find(r => 
      r.active && (
        (r.criteriaType === 'Service' && serviceName.toLowerCase().includes(r.criteriaValue.toLowerCase())) ||
        (r.criteriaType === 'Source' && sourceName.toLowerCase().includes(r.criteriaValue.toLowerCase())) ||
        (r.criteriaType === 'District' && district.toLowerCase().includes(r.criteriaValue.toLowerCase()))
      )
    );
    return match ? match.assignedStaff : 'Neha Sharma (Corporate Lead)';
  };

  // 1. Ingest / Add Lead
  const addLead = (newLead) => {
    const nextIdNum = Math.floor(106 + Math.random() * 800);
    const leadCode = `LEAD-2026-${nextIdNum}`;
    const id = `LD-${nextIdNum}`;
    const assignedExecutive = resolveAssignment(
      newLead.source || 'Website Inbound Form',
      newLead.service || 'Private Limited Company Registration',
      newLead.district || 'Jaipur'
    );

    const fullLead = {
      id,
      leadCode,
      name: newLead.name,
      phone: newLead.phone,
      whatsapp: newLead.whatsapp || newLead.phone,
      email: newLead.email || `${newLead.name.toLowerCase().replace(/\s+/g, '')}@example.com`,
      service: newLead.service || 'Private Limited Company Registration',
      stage: 'New Lead',
      priority: newLead.priority || 'Urgent',
      temperature: 'Hot',
      leadScore: 85,
      value: Number(newLead.value) || 7499,
      date: new Date().toISOString().split('T')[0],
      lastActivity: 'Just now',
      nextFollowup: 'Today, 04:00 PM',
      state: newLead.state || 'Rajasthan',
      district: newLead.district || 'Jaipur',
      city: newLead.city || 'Jaipur',
      businessName: newLead.businessName || `${newLead.name} Enterprises`,
      businessType: newLead.businessType || 'General Business',
      requirement: newLead.requirement || newLead.notes || 'Inbound inquiry received via autopilot channel.',

      leadSource: {
        channel: newLead.source || 'Website Inbound Form',
        code: 'WEBSITE',
        campaign: newLead.campaign || 'Direct Inbound Organic',
        referrer: 'Direct Web Traffic',
        landingPage: '/services',
        ipCity: `${newLead.district || 'Jaipur'}, ${newLead.state || 'Rajasthan'}`,
        utmMedium: 'inbound',
        createdAt: new Date().toLocaleString('en-IN'),
        createdBy: 'Autopilot Ingestion Engine'
      },

      sales: {
        assignedExecutive,
        staffRole: 'Relationship Manager',
        department: 'Corporate Advisory',
        priority: 'Urgent',
        targetCloseDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        dealValue: Number(newLead.value) || 7499,
        salesProbability: '80%'
      },

      notes: [
        { id: 1, text: `Lead automatically ingested and assigned to ${assignedExecutive}. Initial inquiry: "${newLead.notes || 'Interested in ' + (newLead.service || 'services')}"`, author: 'System Autopilot', date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ],

      calls: [],
      voiceNotes: [],
      followUps: [
        { id: 1, type: 'Phone Call', date: new Date().toISOString().split('T')[0], time: '04:00 PM', notes: 'Immediate discovery & KYC verification call.', status: 'Pending', officer: assignedExecutive }
      ],

      tasks: [
        { id: `TSK-${Date.now().toString().slice(-4)}`, title: `Call client ${newLead.name} (${newLead.service})`, type: 'Contact', priority: 'Urgent', dueDate: 'Today', status: 'Pending', isAutoGenerated: true }
      ],

      appointments: [],
      documents: [],
      estimates: [
        {
          id: `EST-${Date.now().toString().slice(-4)}`,
          estimateCode: `EST-2026-${Math.floor(100 + Math.random() * 900)}`,
          serviceName: newLead.service || 'Private Limited Company Registration',
          basePrice: Number(newLead.value) || 7499,
          quantity: 1,
          discountAmount: 0,
          taxableAmount: Number(newLead.value) || 7499,
          gstPercent: 18,
          gstAmount: (Number(newLead.value) || 7499) * 0.18,
          totalAmount: (Number(newLead.value) || 7499) * 1.18,
          status: 'Draft',
          createdBy: assignedExecutive,
          date: new Date().toISOString().split('T')[0]
        }
      ],
      proposals: [],
      payments: [],
      externalTasks: [],
      activities: [
        { id: 1, type: 'created', title: 'Lead Ingested via Autopilot', desc: `Source: ${newLead.source || 'Website'}. Auto-assigned to ${assignedExecutive}.`, staff: 'Autopilot Engine', time: 'Just now' },
        { id: 2, type: 'ai_response', title: 'AI WhatsApp Response Sent', desc: `Dispatched approved ${newLead.service || 'service'} intro knowledge to ${newLead.phone}.`, staff: 'AI Bot', time: 'Just now' }
      ],
      auditLogs: [
        { id: 1, action: 'Assignment', field: 'assigned_employee', oldVal: 'Unassigned', newVal: assignedExecutive, user: 'Auto-Assignment Rule Engine', reason: 'Rule matched for service/source', time: 'Just now' }
      ],

      aiSummary: {
        clientIntent: `Needs professional assistance for ${newLead.service || 'Business Compliance'}.`,
        interestedService: newLead.service || 'Private Limited Company Registration',
        interestScore: 85,
        interestTemperature: 'Hot',
        potentialObjection: 'Requires prompt callback and quote verification.',
        budgetTimeline: `Budget ₹${Number(newLead.value || 7499).toLocaleString('en-IN')}`,
        lastInteractionRecap: 'Inbound lead received. AI Auto-response dispatched via WhatsApp.',
        recommendedNextAction: 'Perform initial discovery call within 15 minutes.'
      },

      converted: {
        isConverted: false,
        convertedDate: null,
        customerId: null,
        projectId: null
      },
      ...newLead
    };

    setLeads(prev => [fullLead, ...prev]);
    showToast(`🎉 Lead registered for ${fullLead.name}! Auto-assigned to ${assignedExecutive}.`);
    return fullLead;
  };

  // 2. Update Lead Stage with Full History
  const updateLeadStage = (leadId, newStage) => {
    setLeads(prev => prev.map(lead => {
      if (lead.id === leadId) {
        if (newStage === 'Converted') {
          convertLeadToCustomerAndProject(leadId);
          return lead;
        }

        const newActivity = {
          id: (lead.activities?.length || 0) + 1,
          type: 'status_change',
          title: `Stage Updated to "${newStage}"`,
          desc: `Pipeline status transitioned from ${lead.stage} to ${newStage}.`,
          staff: activeRole,
          time: 'Just now'
        };

        const newAudit = {
          id: (lead.auditLogs?.length || 0) + 1,
          action: 'Status_Change',
          field: 'lead_stage',
          oldVal: lead.stage,
          newVal: newStage,
          user: activeRole,
          reason: 'Stage progressed in CRM Pipeline',
          time: 'Just now'
        };

        const updated = {
          ...lead,
          stage: newStage,
          lastActivity: 'Stage updated',
          activities: [newActivity, ...(lead.activities || [])],
          auditLogs: [newAudit, ...(lead.auditLogs || [])]
        };

        if (selectedLeadForDetail?.id === leadId) {
          setSelectedLeadForDetail(updated);
        }
        showToast(`Lead ${lead.name} moved to "${newStage}"`);
        return updated;
      }
      return lead;
    }));
  };

  // 3. Add Internal Note
  const addNoteToLead = (leadId, noteText) => {
    if (!noteText.trim()) return;
    setLeads(prev => prev.map(lead => {
      if (lead.id === leadId) {
        const newNote = {
          id: (lead.notes?.length || 0) + 1,
          text: noteText,
          author: activeRole === 'Admin' ? 'Admin Director' : (lead.sales?.assignedExecutive || 'Staff Officer'),
          date: new Date().toLocaleString([], { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
        };
        const newAct = {
          id: (lead.activities?.length || 0) + 1,
          type: 'note',
          title: 'Internal Note Added',
          desc: noteText.slice(0, 80) + (noteText.length > 80 ? '...' : ''),
          staff: newNote.author,
          time: 'Just now'
        };
        const updated = {
          ...lead,
          notes: [newNote, ...(lead.notes || [])],
          activities: [newAct, ...(lead.activities || [])]
        };
        if (selectedLeadForDetail?.id === leadId) {
          setSelectedLeadForDetail(updated);
        }
        showToast('Internal note saved.');
        return updated;
      }
      return lead;
    }));
  };

  // 4. Log Call with Outcome & Next Follow-up
  const logCallToLead = (leadId, callData) => {
    setLeads(prev => prev.map(lead => {
      if (lead.id === leadId) {
        const newCall = {
          id: `CALL-${Date.now().toString().slice(-4)}`,
          caller: activeRole,
          callType: callData.callType || 'Outbound',
          callResult: callData.callResult || 'Connected',
          durationSeconds: Number(callData.durationSeconds) || 60,
          recordingUrl: 'audio/simulated_recording.mp3',
          transcript: callData.transcript || callData.notes || `Call with ${lead.name} regarding ${lead.service}. Outcome: ${callData.callResult}`,
          aiCallSummary: callData.aiSummary || `Outcome: ${callData.callResult}. Action: ${callData.nextAction || 'Follow-up scheduled.'}`,
          nextAction: callData.nextAction || 'Follow-up Call',
          datetime: new Date().toLocaleString()
        };

        const newAct = {
          id: (lead.activities?.length || 0) + 1,
          type: 'call',
          title: `Call Logged: ${callData.callResult}`,
          desc: `Duration: ${newCall.durationSeconds}s. Outcome: ${callData.callResult}`,
          staff: activeRole,
          time: 'Just now'
        };

        let newFollowUps = lead.followUps || [];
        if (callData.nextDate) {
          newFollowUps = [
            {
              id: newFollowUps.length + 1,
              type: 'Phone Call',
              date: callData.nextDate,
              time: callData.nextTime || '11:00 AM',
              notes: callData.nextAction || 'Post-call follow-up',
              status: 'Pending',
              officer: lead.sales?.assignedExecutive || activeRole
            },
            ...newFollowUps
          ];
        }

        const updated = {
          ...lead,
          calls: [newCall, ...(lead.calls || [])],
          activities: [newAct, ...(lead.activities || [])],
          followUps: newFollowUps,
          nextFollowup: callData.nextDate ? `${callData.nextDate}, ${callData.nextTime || '11:00 AM'}` : lead.nextFollowup,
          lastActivity: 'Call logged'
        };

        if (callData.callResult === 'Human Required') {
          triggerHumanHandover(leadId, 'Client requested human manager during phone call.');
        }

        if (selectedLeadForDetail?.id === leadId) {
          setSelectedLeadForDetail(updated);
        }
        showToast(`Call logged (${callData.callResult}) for ${lead.name}!`);
        return updated;
      }
      return lead;
    }));
  };

  // 5. Add Voice Note (Voice to CRM)
  const addVoiceNoteToLead = (leadId, voiceData) => {
    setLeads(prev => prev.map(lead => {
      if (lead.id === leadId) {
        const newVoiceNote = {
          id: `VN-${Date.now().toString().slice(-4)}`,
          staffName: activeRole,
          durationSeconds: voiceData.durationSeconds || 15,
          transcript: voiceData.transcript,
          aiExtractedIntent: voiceData.intent || 'Service Inquiry Update',
          aiExtractedService: voiceData.service || lead.service,
          aiExtractedFollowupTime: voiceData.followupTime || 'Tomorrow 11:00 AM',
          actionStatus: 'Task_Created',
          createdAt: new Date().toLocaleString()
        };

        const newNote = {
          id: (lead.notes?.length || 0) + 1,
          text: `🎙️ [Voice Memo Note]: "${voiceData.transcript}" — Extracted: ${newVoiceNote.aiExtractedIntent}`,
          author: activeRole,
          date: new Date().toLocaleString([], { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
        };

        const newTask = {
          id: `TSK-${Date.now().toString().slice(-4)}`,
          title: `Voice Memo Follow-up: ${newVoiceNote.aiExtractedIntent}`,
          type: 'Follow_up',
          priority: 'High',
          dueDate: 'Tomorrow',
          status: 'Pending',
          isAutoGenerated: true
        };

        const newAct = {
          id: (lead.activities?.length || 0) + 1,
          type: 'voice_note',
          title: 'Voice Note Transcribed & Processed',
          desc: `Voice: "${voiceData.transcript.slice(0, 60)}..." converted to note & follow-up task.`,
          staff: activeRole,
          time: 'Just now'
        };

        const updated = {
          ...lead,
          voiceNotes: [newVoiceNote, ...(lead.voiceNotes || [])],
          notes: [newNote, ...(lead.notes || [])],
          tasks: [newTask, ...(lead.tasks || [])],
          activities: [newAct, ...(lead.activities || [])],
          lastActivity: 'Voice memo processed'
        };

        if (selectedLeadForDetail?.id === leadId) {
          setSelectedLeadForDetail(updated);
        }
        showToast('Voice memo transcribed! Note and follow-up task created automatically.');
        return updated;
      }
      return lead;
    }));
  };

  // 6. Add Follow-up
  const addFollowUpToLead = (leadId, followUpData) => {
    setLeads(prev => prev.map(lead => {
      if (lead.id === leadId) {
        const newFollowUp = {
          id: (lead.followUps?.length || 0) + 1,
          type: followUpData.type || 'Phone Call',
          date: followUpData.date,
          time: followUpData.time || '11:00 AM',
          notes: followUpData.notes,
          status: 'Pending',
          officer: lead.sales?.assignedExecutive || activeRole
        };

        const newAct = {
          id: (lead.activities?.length || 0) + 1,
          type: 'followup',
          title: `Follow-up Scheduled (${newFollowUp.type})`,
          desc: `Scheduled for ${newFollowUp.date} at ${newFollowUp.time}: "${newFollowUp.notes}"`,
          staff: activeRole,
          time: 'Just now'
        };

        const updated = {
          ...lead,
          followUps: [newFollowUp, ...(lead.followUps || [])],
          activities: [newAct, ...(lead.activities || [])],
          nextFollowup: `${newFollowUp.date}, ${newFollowUp.time}`
        };

        if (selectedLeadForDetail?.id === leadId) {
          setSelectedLeadForDetail(updated);
        }
        showToast(`Follow-up scheduled with ${lead.name} for ${followUpData.date}!`);
        return updated;
      }
      return lead;
    }));
  };

  // 7. Toggle Lead Task
  const toggleLeadTask = (leadId, taskId) => {
    setLeads(prev => prev.map(lead => {
      if (lead.id === leadId) {
        const updatedTasks = (lead.tasks || []).map(t => {
          if (t.id === taskId) {
            const nextStatus = t.status === 'Completed' ? 'Pending' : 'Completed';
            return { ...t, status: nextStatus };
          }
          return t;
        });

        const updated = { ...lead, tasks: updatedTasks };
        if (selectedLeadForDetail?.id === leadId) {
          setSelectedLeadForDetail(updated);
        }
        showToast('Task status updated.');
        return updated;
      }
      return lead;
    }));
  };

  // 8. Add Lead Task
  const addLeadTask = (leadId, taskData) => {
    setLeads(prev => prev.map(lead => {
      if (lead.id === leadId) {
        const newTask = {
          id: `TSK-${Date.now().toString().slice(-4)}`,
          title: taskData.title,
          type: taskData.type || 'General',
          priority: taskData.priority || 'Medium',
          dueDate: taskData.dueDate || 'Today',
          status: 'Pending',
          isAutoGenerated: false
        };
        const updated = {
          ...lead,
          tasks: [newTask, ...(lead.tasks || [])]
        };
        if (selectedLeadForDetail?.id === leadId) {
          setSelectedLeadForDetail(updated);
        }
        showToast('Task added to lead.');
        return updated;
      }
      return lead;
    }));
  };

  // 9. Save Estimate & Proposal
  const saveLeadEstimateAndProposal = (leadId, data) => {
    setLeads(prev => prev.map(lead => {
      if (lead.id === leadId) {
        const basePrice = Number(data.basePrice) || lead.value;
        const discount = Number(data.discountAmount) || 0;
        const taxable = Math.max(0, basePrice - discount);
        const gst = taxable * 0.18;
        const total = taxable + gst;

        const estCode = `EST-2026-${Math.floor(100 + Math.random() * 900)}`;
        const propCode = `PROP-2026-${Math.floor(100 + Math.random() * 900)}`;

        const newEstimate = {
          id: `EST-${Date.now().toString().slice(-4)}`,
          estimateCode: estCode,
          serviceName: data.serviceName || lead.service,
          basePrice,
          quantity: Number(data.quantity) || 1,
          discountAmount: discount,
          taxableAmount: taxable,
          gstPercent: 18,
          gstAmount: gst,
          totalAmount: total,
          status: 'Sent',
          createdBy: activeRole,
          date: new Date().toISOString().split('T')[0]
        };

        const newProposal = {
          id: `PROP-${Date.now().toString().slice(-4)}`,
          proposalCode: propCode,
          title: `Proposal for ${data.serviceName || lead.service}`,
          scopeOfWork: data.scopeOfWork || `Statutory execution & filing for ${data.serviceName || lead.service}.`,
          deliverables: data.deliverables || 'Government Registration Certificate & Compliance Dossier',
          totalValue: total,
          validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'Sent',
          sentVia: data.sentVia || 'WhatsApp',
          openedCount: 1,
          createdBy: activeRole,
          date: new Date().toISOString().split('T')[0]
        };

        let newAudits = lead.auditLogs || [];
        if (discount > 0) {
          newAudits = [
            {
              id: newAudits.length + 1,
              action: 'Discount',
              field: 'proposal_discount',
              oldVal: '₹0.00',
              newVal: `₹${discount}`,
              user: activeRole,
              reason: 'Sales RM discount applied on quotation',
              time: 'Just now'
            },
            ...newAudits
          ];
        }

        const newAct = {
          id: (lead.activities?.length || 0) + 1,
          type: 'proposal',
          title: `Proposal ${propCode} Generated`,
          desc: `Total Amount: ₹${total.toLocaleString('en-IN', { maximumFractionDigits: 2 })} sent via WhatsApp.`,
          staff: activeRole,
          time: 'Just now'
        };

        const updated = {
          ...lead,
          estimates: [newEstimate, ...(lead.estimates || [])],
          proposals: [newProposal, ...(lead.proposals || [])],
          auditLogs: newAudits,
          activities: [newAct, ...(lead.activities || [])],
          stage: lead.stage === 'New Lead' || lead.stage === 'Requirement Discussed' ? 'Proposal' : lead.stage,
          value: taxable,
          lastActivity: 'Proposal generated'
        };

        if (selectedLeadForDetail?.id === leadId) {
          setSelectedLeadForDetail(updated);
        }
        showToast(`Formal Proposal ${propCode} generated and dispatched!`);
        return updated;
      }
      return lead;
    }));
  };

  // 10. Record Lead Payment / Eligibility Fee
  const recordLeadPayment = (leadId, paymentData) => {
    setLeads(prev => prev.map(lead => {
      if (lead.id === leadId) {
        const newPayment = {
          id: `PAY-${Date.now().toString().slice(-4)}`,
          receiptNo: `REC-2026-${Math.floor(100 + Math.random() * 900)}`,
          type: paymentData.type || 'Token_Advance',
          amount: Number(paymentData.amount || paymentData.advancePaid) || 3000,
          paymentMode: paymentData.mode || 'UPI (Google Pay)',
          transactionRef: paymentData.utrNo || `UPI/${Date.now().toString().slice(-10)}`,
          paymentLink: 'https://pay.digitaludyogseva.com/receipt',
          termsAccepted: true,
          noRefundConsent: true,
          status: 'Verified',
          date: new Date().toISOString().split('T')[0],
          verifiedBy: activeRole
        };

        const newAct = {
          id: (lead.activities?.length || 0) + 1,
          type: 'payment',
          title: `Payment Received: ₹${newPayment.amount.toLocaleString('en-IN')}`,
          desc: `Receipt: ${newPayment.receiptNo} | Mode: ${newPayment.paymentMode} | UTR: ${newPayment.transactionRef}`,
          staff: activeRole,
          time: 'Just now'
        };

        const updated = {
          ...lead,
          payments: [newPayment, ...(lead.payments || [])],
          activities: [newAct, ...(lead.activities || [])],
          stage: lead.stage === 'Payment Pending' ? 'Interested' : lead.stage,
          lastActivity: 'Payment credited'
        };

        if (selectedLeadForDetail?.id === leadId) {
          setSelectedLeadForDetail(updated);
        }
        showToast(`Payment of ₹${newPayment.amount} recorded! Receipt: ${newPayment.receiptNo}`);
        return updated;
      }
      return lead;
    }));
  };

  // 11. Assign External Third-Party Task (CA/CS/Advocate)
  const assignExternalTask = (leadId, taskData) => {
    setLeads(prev => prev.map(lead => {
      if (lead.id === leadId) {
        const newExt = {
          id: `EXT-${Date.now().toString().slice(-4)}`,
          consultantName: taskData.consultantName || 'CS Priya Nair',
          role: taskData.role || 'Company Secretary',
          mobile: taskData.mobile || '+91 98760 11223',
          scope: taskData.scope || 'Review statutory filings and legal drafting.',
          deliverable: taskData.deliverable || 'Signed MOA/AOA Certification',
          deadline: taskData.deadline || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          payoutAgreed: Number(taskData.payoutAgreed) || 1500,
          status: 'Assigned',
          submissionNotes: null,
          submissionFileUrl: null,
          assignedBy: activeRole
        };

        const newAct = {
          id: (lead.activities?.length || 0) + 1,
          type: 'external_assignment',
          title: `Sub-Task Delegated to External ${newExt.role}`,
          desc: `Assigned to ${newExt.consultantName} (Payout: ₹${newExt.payoutAgreed}). Deadline: ${newExt.deadline}`,
          staff: activeRole,
          time: 'Just now'
        };

        const updated = {
          ...lead,
          externalTasks: [newExt, ...(lead.externalTasks || [])],
          activities: [newAct, ...(lead.activities || [])]
        };

        if (selectedLeadForDetail?.id === leadId) {
          setSelectedLeadForDetail(updated);
        }
        showToast(`Sub-task assigned to external ${newExt.consultantName}!`);
        return updated;
      }
      return lead;
    }));
  };

  // 12. Submit & Approve External Task Deliverable
  const updateExternalTaskStatus = (leadId, extTaskId, status, notes = '', fileUrl = '') => {
    setLeads(prev => prev.map(lead => {
      if (lead.id === leadId) {
        const updatedExts = (lead.externalTasks || []).map(t => {
          if (t.id === extTaskId) {
            return {
              ...t,
              status,
              submissionNotes: notes || t.submissionNotes,
              submissionFileUrl: fileUrl || t.submissionFileUrl
            };
          }
          return t;
        });

        const newAct = {
          id: (lead.activities?.length || 0) + 1,
          type: 'external_update',
          title: `External Deliverable: ${status}`,
          desc: `External task #${extTaskId} updated to ${status}.`,
          staff: activeRole,
          time: 'Just now'
        };

        const updated = {
          ...lead,
          externalTasks: updatedExts,
          activities: [newAct, ...(lead.activities || [])]
        };

        if (selectedLeadForDetail?.id === leadId) {
          setSelectedLeadForDetail(updated);
        }
        showToast(`External task updated to "${status}"`);
        return updated;
      }
      return lead;
    }));
  };

  // 13. Trigger Human Handover
  const triggerHumanHandover = (leadId, reason = 'Client requested human RM assistance.') => {
    setLeads(prev => prev.map(lead => {
      if (lead.id === leadId) {
        const newAct = {
          id: (lead.activities?.length || 0) + 1,
          type: 'handover',
          title: '🚨 Human Intervention Escalated',
          desc: reason,
          staff: 'AI Auto-Response Engine',
          time: 'Just now'
        };

        const newAudit = {
          id: (lead.auditLogs?.length || 0) + 1,
          action: 'Handover',
          field: 'escalation_queue',
          oldVal: 'AI Automation',
          newVal: 'Senior Human RM Desk',
          user: 'AI Safety Watchdog',
          reason,
          time: 'Just now'
        };

        const updated = {
          ...lead,
          priority: 'Urgent',
          temperature: 'Hot',
          leadScore: 99,
          activities: [newAct, ...(lead.activities || [])],
          auditLogs: [newAudit, ...(lead.auditLogs || [])]
        };

        if (selectedLeadForDetail?.id === leadId) {
          setSelectedLeadForDetail(updated);
        }
        showToast(`🚨 Lead ${lead.name} escalated to Human RM Telecalling Queue!`, 'warning');
        return updated;
      }
      return lead;
    }));
  };

  // 14. Reassign Lead Staff
  const reassignLeadStaff = (leadId, newStaffName, reason = 'Workload rebalance') => {
    setLeads(prev => prev.map(lead => {
      if (lead.id === leadId) {
        const oldStaff = lead.sales?.assignedExecutive || 'Unassigned';
        const newAudit = {
          id: (lead.auditLogs?.length || 0) + 1,
          action: 'Assignment',
          field: 'assigned_employee',
          oldVal: oldStaff,
          newVal: newStaffName,
          user: activeRole,
          reason,
          time: 'Just now'
        };

        const newAct = {
          id: (lead.activities?.length || 0) + 1,
          type: 'reassignment',
          title: `Assigned RM Changed to ${newStaffName}`,
          desc: `Reassigned from ${oldStaff}. Reason: ${reason}`,
          staff: activeRole,
          time: 'Just now'
        };

        const updated = {
          ...lead,
          sales: { ...lead.sales, assignedExecutive: newStaffName },
          auditLogs: [newAudit, ...(lead.auditLogs || [])],
          activities: [newAct, ...(lead.activities || [])]
        };

        if (selectedLeadForDetail?.id === leadId) {
          setSelectedLeadForDetail(updated);
        }
        showToast(`Lead reassigned to ${newStaffName}`);
        return updated;
      }
      return lead;
    }));
  };

  // 15. Convert Lead to Customer & Launch Project
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

    const newCustomer = {
      id: newCustomerId,
      name: lead.businessName || `${lead.name}'s Enterprise`,
      contactPerson: lead.name,
      phone: lead.phone,
      email: lead.email,
      city: `${lead.district || 'Jaipur'}, ${lead.state || 'Rajasthan'}`,
      gstin: 'Pending Application',
      cin: 'In Processing',
      kycStatus: 'Verified',
      totalBilled: `₹${((lead.value || 7499) * 1.18).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
      activeServices: [lead.service],
      customer360: {
        healthScore: 96,
        tier: 'Gold Enterprise',
        ltv: lead.value || 7499,
        relationshipManager: lead.sales?.assignedExecutive || 'Neha Sharma',
        satisfactionRating: '5.0 ★',
        clientSince: 'Today',
        summary: `Converted from Lead #${lead.id} (${lead.leadCode || lead.id}). Rapid onboarding activated.`
      },
      kycProfile: {
        legalName: lead.businessName || `${lead.name}'s Enterprise`,
        tradeName: lead.name,
        pan: 'Pending Document',
        aadhaarSignatory: `XXXX-XXXX-${lead.phone.slice(-4)}`,
        gstin: 'Under Filing',
        cin: 'In Process',
        registeredAddress: `${lead.city || 'Jaipur'}, ${lead.state || 'Rajasthan'}`,
        signatoryDesignation: 'Director / Proprietor',
        verificationDate: new Date().toISOString().split('T')[0],
        status: 'KYC Verified'
      },
      services: [
        { id: `SRV-${Math.floor(10 + Math.random() * 90)}`, name: lead.service, category: 'Corporate & Legal', status: 'Active (In Execution)', startDate: new Date().toISOString().split('T')[0], renewalDate: 'Annual', fee: `₹${lead.value || 7499}` }
      ],
      payments: (lead.payments || []).map(p => ({
        id: p.id,
        date: p.date,
        invoiceNo: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
        amount: p.amount,
        method: p.paymentMode,
        status: 'Verified',
        receiptUrl: '#'
      })),
      documents: (lead.documents || []).map(d => ({
        id: d.id,
        name: d.name,
        type: 'PDF',
        uploadDate: d.date,
        status: 'Verified',
        verifiedBy: lead.sales?.assignedExecutive || 'Neha Sharma'
      })),
      support: [],
      projects: [
        { id: newProjectId, name: `${lead.name} — ${lead.service}`, service: lead.service, status: 'Execution Initiated', progress: 20 }
      ],
      previousHistory: [
        { id: 1, date: new Date().toISOString().split('T')[0], event: `Converted from Lead #${lead.id}`, performedBy: lead.sales?.assignedExecutive || 'Neha Sharma', notes: 'Case launched & onboarding activated.' }
      ]
    };

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
        specialNotes: lead.requirement || 'Expedited filing priority.'
      },
      documents: (lead.documents || []).map(d => ({
        name: d.name,
        required: true,
        status: 'Verified'
      })),
      currentStatus: 'Initiated',
      currentProcess: 'Statutory Preparation & Backoffice Scrutiny',
      currentLocation: 'Corporate Backoffice Command Desk',
      assignedPerson: {
        name: lead.sales?.assignedExecutive || 'Neha Sharma',
        role: 'Case Officer',
        phone: '+91 98760 11990',
        email: 'caseofficer@digitaludyogseva.com'
      },
      tasks: [
        { id: 'T-01', task: 'Review client intake documents & KYC', done: true, dueDate: 'Today', assignee: lead.sales?.assignedExecutive || 'Neha Sharma' },
        { id: 'T-02', task: 'Generate DSC tokens & MCA draft', done: false, dueDate: 'Tomorrow', assignee: 'CS Priya Nair' }
      ],
      department: 'Corporate Legal & MCA',
      consultant: {
        name: 'CS Priya Nair (FCS 8921)',
        signoffDate: 'Today',
        reviewRemarks: 'Pre-check completed. Ready for portal submission.'
      },
      timeline: [
        { stage: 'Case Initiated from Lead Conversion', targetDate: 'Today', actualDate: 'Today', done: true },
        { stage: 'Document Scrutiny & Signoff', targetDate: '+2 Days', actualDate: 'Pending', done: false },
        { stage: 'Government Portal Submission', targetDate: '+4 Days', actualDate: 'Pending', done: false },
        { stage: 'Final Certification & Dispatch', targetDate: '+7 Days', actualDate: 'Pending', done: false }
      ],
      completion: {
        isCompleted: false,
        completionDate: null,
        deliverables: ['Statutory Incorporation Certificate', 'Company PAN & TAN', 'Bank Activation Kit'],
        dispatchTrackingNo: 'Pending'
      }
    };

    setCustomers(prev => [newCustomer, ...prev]);
    setProjects(prev => [newProject, ...prev]);

    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        const newAct = {
          id: (l.activities?.length || 0) + 1,
          type: 'converted',
          title: '🎉 Lead Converted to Customer & Case Project',
          desc: `Customer #${newCustomerId} and Project Case #${newProjectId} launched.`,
          staff: activeRole,
          time: 'Just now'
        };

        const updated = {
          ...l,
          stage: 'Converted',
          converted: {
            isConverted: true,
            convertedDate: new Date().toISOString().split('T')[0],
            customerId: newCustomerId,
            projectId: newProjectId
          },
          activities: [newAct, ...(l.activities || [])]
        };

        if (selectedLeadForDetail?.id === leadId) {
          setSelectedLeadForDetail(updated);
        }
        return updated;
      }
      return l;
    }));

    showToast(`🎉 Lead ${lead.name} converted! Customer #${newCustomerId} & Project #${newProjectId} created.`, 'success');
  };

  // -----------------------------------------------------------
  // PROJECT & LOAN ACTIONS
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

  const addEstimate = (estimateData) => {
    const est = {
      id: `EST-2026-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Sent',
      ...estimateData
    };
    setEstimates(prev => [est, ...prev]);
    showToast(`Quotation #${est.id} generated!`);
    return est;
  };

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
        { name: 'Detailed Project Report (DPR)', status: 'In Preparation', mandatory: true }
      ],
      timeline: [
        { date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }), title: 'Case File Created', desc: `Inquiry logged for ${caseData.scheme || 'MSME Loan'}.` }
      ],
      ...caseData
    };
    setLoanCases(prev => [newCase, ...prev]);
    showToast(`Loan Application #${newCase.id} created!`);
    return newCase;
  };

  const updateLoanCaseStage = (caseId, newStage, remarks = '') => {
    setLoanCases(prev => prev.map(c => {
      if (c.id === caseId) {
        const updated = {
          ...c,
          stage: newStage,
          timeline: [
            { date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }), title: `Stage Updated to ${newStage}`, desc: remarks || 'Updated in pipeline.' },
            ...c.timeline
          ]
        };
        if (selectedLoanForDetail?.id === caseId) {
          setSelectedLoanForDetail(updated);
        }
        return updated;
      }
      return c;
    }));
    showToast(`Loan Case advanced to ${newStage}`);
  };

  const trackApplication = (appId) => {
    const cleanId = appId.trim().toUpperCase();
    return sampleApplications[cleanId] || null;
  };

  return (
    <AppContext.Provider
      value={{
        activeView,
        setActiveView,
        crmSection,
        setCrmSection,
        activeLeadTab,
        setActiveLeadTab,
        activeRole,
        setActiveRole,

        // Masters & Configs
        leadSources,
        setLeadSources,
        leadStages,
        setLeadStages,
        assignmentRules,
        setAssignmentRules,
        aiTemplates,
        setAiTemplates,
        externalConsultants,
        setExternalConsultants,
        coreServicesPricingMaster,

        // Lead 360 Actions
        leads,
        setLeads,
        addLead,
        updateLeadStage,
        addNoteToLead,
        logCallToLead,
        addVoiceNoteToLead,
        addFollowUpToLead,
        toggleLeadTask,
        addLeadTask,
        saveLeadEstimateAndProposal,
        recordLeadPayment,
        assignExternalTask,
        updateExternalTaskStatus,
        triggerHumanHandover,
        reassignLeadStaff,
        convertLeadToCustomerAndProject,
        selectedLeadForDetail,
        setSelectedLeadForDetail,

        // Customers & Projects
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
