import React, { createContext, useContext, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  popularServices,
  loanSchemes,
  sampleApplications,
  initialLeads,
  initialCustomers,
  initialEstimates
} from '../data/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Navigation & View state
  const [activeView, setActiveView] = useState('website'); // 'website' | 'crm' | 'services' | 'loans' | 'track' | 'franchise'
  const [crmSection, setCrmSection] = useState('dashboard'); // 'dashboard' | 'leads' | 'customers' | 'estimates' | 'loans'
  
  // Data State
  const [leads, setLeads] = useState(initialLeads);
  const [customers, setCustomers] = useState(initialCustomers);
  const [estimates, setEstimates] = useState(initialEstimates);
  const [applications, setApplications] = useState(sampleApplications);
  const [selectedService, setSelectedService] = useState(null); // For service modal
  const [searchQuery, setSearchQuery] = useState('');

  // Toast Notification State
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Lead Actions
  const addLead = (newLead) => {
    const lead = {
      id: `LD-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toISOString().split('T')[0],
      stage: 'New Leads',
      ...newLead
    };
    setLeads(prev => [lead, ...prev]);
    showToast(`Lead registered for ${lead.name}! Assigned to CRM team.`);
    return lead;
  };

  const updateLeadStage = (leadId, newStage) => {
    setLeads(prev => prev.map(lead => {
      if (lead.id === leadId) {
        if (newStage === 'Converted') {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
          showToast(`🎉 Congratulations! Lead ${lead.name} marked as Won/Converted!`, 'success');
        } else {
          showToast(`Lead stage updated to "${newStage}"`);
        }
        return { ...lead, stage: newStage };
      }
      return lead;
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
        customers,
        estimates,
        addEstimate,
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
