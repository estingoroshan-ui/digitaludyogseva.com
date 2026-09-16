# Digital Udyog Seva (DUS) – Unified Master CRM & Business Hub Ecosystem
## Comprehensive System Architecture, Workflow & Functional Structure Document

---

## 1. Executive Summary
**Digital Udyog Seva (DUS) Master CRM** is an end-to-end, enterprise-grade business management ecosystem tailored specifically for Indian MSMEs, Government Subsidies (PMEGP, PMFME, Mudra), Banking Loan Underwriting, Kendra Franchise networks, Machinery Trading, and CA/CS Legal Project Delivery.

It unifies physical walk-in operations across specialized consultation desks with digital lead automation, loan sanction pipelines, and automated multi-tier billing.

---

## 2. High-Level System Architecture Diagram

```
                               ┌──────────────────────────────────────────────┐
                               │        DUS MASTER CRM COMMAND CENTER         │
                               └──────────────────────┬───────────────────────┘
                                                      │
         ┌────────────────────────────────────────────┼────────────────────────────────────────────┐
         ▼                                            ▼                                            ▼
┌─────────────────────────────────┐        ┌─────────────────────────────────┐        ┌─────────────────────────────────┐
│       BUSINESS HUB CABINS       │        │      PIPELINES & CASE HUB       │        │        GROWTH & ECOSYSTEM       │
├─────────────────────────────────┤        ├─────────────────────────────────┤        ├─────────────────────────────────┤
│ • 7 Specialized Department Desks│        │ • Lead 360° Autopilot Pipeline  │        │ • District Kendra Franchises    │
│ • In-Person Walk-in Tracker     │        │ • Loan Cases Hub (PMEGP/Mudra)  │        │ • Plant & Machinery Catalog     │
│ • Inter-Cabin Case Transfer     │        │ • Project & DPR Execution Cases │        │ • B2B Raw Material Trading Hub  │
│ • Cabin Billing & Receipts      │        │ • Customer 360° Master Record   │        │ • AI Subsidy Eligibility Engine │
│ • Cabin Staffing & Performance  │        │ • CA/CS Outsource Legal Portal  │        │ • Multi-Tier Franchise Wallet   │
└─────────────────────────────────┘        └─────────────────────────────────┘        └─────────────────────────────────┘
                                                      │
                                                      ▼
                               ┌──────────────────────────────────────────────┐
                               │           ENTERPRISE DATA & ACCESS           │
                               │  Role-Based Access Control (RBAC) • MySQL DB │
                               │   REST API Backend • GST Invoicing Engine    │
                               └──────────────────────────────────────────────┘
```

---

## 3. Detailed Functional Modules Breakdown

### Module 1: The 7 Business Hub Cabins (Department Desks)
Physical walk-ins and cases are managed across 7 dedicated department desks, each with specialized heads, case queues, and dedicated billing models:

| Cabin No. | Cabin Title | Lead Consultant / Head | Core Specialization & Scope | Billing Type |
| :--- | :--- | :--- | :--- | :--- |
| **Cabin #01** | **Business Consulting & Feasibility Desk** | Dr. R. K. Saxena *(Sr. Consultant)* | Business idea validation, financial viability, market assessment, walk-in consultation | Advisory & Feasibility Fee |
| **Cabin #02** | **Documentation & CA/CS Legal Desk** | CA Amit Singhal & CS Megha Bansal | MCA Company Incorporation, GST, Udyam, ITR, 3-Yr Balance Sheets, CMA Data, DPR | Legal Filing & Documentation Bill |
| **Cabin #03** | **Govt Schemes & Subsidy Desk** | Vikramaditya Rathore *(Ex-DIC Officer)* | PMEGP (35% Subsidy), Mudra, PMFME, State Industrial Grants, DIC coordination | Subsidy Advisory & Success Bill |
| **Cabin #04** | **Banking & Finance Liaison Desk** | Sunil Manchanda *(Ex-SBI Chief Mgr)* | Bank file login (SBI, PNB, BOB, HDFC), Manager meetings, Sanction letters, TDR lock | Banking Liaison & Commission |
| **Cabin #05** | **Plant, Machinery & Equipment Desk** | Er. Rajesh Choudhary *(Tech Director)* | Machinery selection, bank quotations, vendor sourcing, technical specs & delivery | Machinery Supply & Tech Invoice |
| **Cabin #06** | **Raw Material & B2B Trading Hub** | Harsh Vardhan Jain *(Supply Chain)* | Bulk raw material procurement, B2B wholesale buyer matchmaking, supplier orders | Trading Commission & Brokerage |
| **Cabin #07** | **Franchise & Kendra Ops Hub** | Pooja Agarwal *(Franchise Director)* | District/Tehsil partner onboarding, lead allocation, commission payouts & royalty | Kendra Franchise Setup & Royalty |

**Key Capabilities:**
- **Walk-in Tracker:** Monitors live visitor footfall per cabin daily.
- **Inter-Cabin Case Dispatch:** Effortless 1-click case transfer from one cabin to another with contextual notes.
- **Desk Invoicing:** Instant cabin-specific receipt and bill generation with GST.

---

### Module 2: Kendra Franchise Network Management
- **Regional Hubs:** Onboard and manage franchised service centres across Districts and Tehsils (e.g., Jaipur, Jodhpur, Kota, Agra, Indore, Ahmedabad).
- **Kendra Profiles:** Each franchise has a unique partner code (e.g., `DUS-KD-JPR01`), contact info, assigned geographic district, and verified KYC status.
- **Financial Ledger & Wallet:** Real-time tracking of active leads, total sanctioned business volume, agreed revenue sharing rate (35% - 40%), accrued wallet balance, and lifetime payout history.
- **Integrated Lead Dispatch:** Franchise centers directly push borrower files into the central CRM for processing by Cabin #02, #03, and #04.

---

### Module 3: Machinery & B2B Trading Marketplace
- **Verified Machinery Catalog:** Pre-configured commercial manufacturing units (Atta Chakki & Flour Mills, Cold-Pressed Oil Expellers, Automatic Paper Cup Machines, Spice Grinding Pulverizers, Non-Woven Bag Plants, Corrugated Box Lines).
- **Subsidy Integration:** Every machine lists its eligible government subsidy bracket (up to 35% under PMEGP/PMFME) and bank-quotation readiness.
- **B2B Trading Desk:** Matchmaking portal linking newly established factories with bulk raw material suppliers and verified bulk buyers.

---

### Module 4: 7-Pillar Credit Underwriting & AI Subsidy Engine
- **Automated Parameter Matching & 7-Pillars:**
  1. *Demographics & Education:* Age, 8th/10th/Graduate/Technical ITI qualification, dependent family members.
  2. *Business & Market Viability:* Manufacturing, Service, Agro-Processing; B2B Wholesale, Retail, E-Commerce, Government Tenders; Location advantage (highway/commercial connectivity).
  3. *Financial Standing & Net Worth:* Applicant monthly income, family annual income, property assets, liquid FD/LIC/MF securities, active debts and liabilities.
  4. *CIBIL & Bureau Health:* Real-time credit score meter (500–900), DPD (Days Past Due - 30/60/90 days), and Loan Settlement / Written-off detection with penalty scoring.
  5. *Sanction Probability Score (%):* Dynamic 0–100% approval chance gauge categorizing applicants into Prime (High Approval), Moderate (Conditional), or High Risk.
  6. *Rajasthan & Central Government Scheme Matching:*
     - **Rajasthan MLUPY:** Up to 8% interest subsidy for loans up to ₹25 Lakhs (effective net interest 2.5%).
     - **PMEGP (Central KVIC):** 15% to 35% capital grant (up to ₹17.5 Lakhs grant) with 5% or 10% promoter equity.
     - **PMFME (MoFPI):** 35% credit-linked grant (max ₹10 Lakhs) for food processing units.
     - **Mudra (PMMY):** Shishu, Kishore, and Tarun (up to ₹20 Lakhs) with zero processing fee.
     - **CGTMSE:** Collateral-free MSME bank guarantee up to ₹5 Crores without property mortgage.
  7. *1-Page Executive Bank Brief Profile:* Formatted printable / shareable dossier for Bank Branch Managers (SBI, PNB, BOB) with Means of Finance, DSCR, promoter strengths, and risk mitigants.
- **Chargeable Paid Feasibility Model:**
  - Integrated between Lead capture and Customer conversion.
  - Paid Audit Fee (₹999) unlock mechanism with official watermark-free certificate.
  - Actionable AI Recommendations for CIBIL repair, co-applicant addition, and margin optimization.
  - 1-Click Consultant In-Person / Video Appointment booking with Cabin #01, #03, and #04.

---

### Module 5: LEAD 360° Omnichannel Autopilot & Alert System
- **Lead Capture Channels:** Website inquiry forms, Kendra franchise referrals, offline walk-ins, Meta/Google ads, Mobile App Chatbot, phone inquiries.
- **Real-Time Sound & Topbar Notification Center:**
  - Instant Web Audio API chime on new inbound lead arrival.
  - Topbar Notification Bell with live count badge and 1-click lead drawer action.
  - Automated WhatsApp & SMS welcome dispatch with App download link and instant Chatbot Q&A.
- **Kanban & List Dual View:** Intuitive stage progression:
  1. *New Lead* ➔ 2. *Eligibility & Scorecard* ➔ 3. *Consulting / Feasibility* ➔ 4. *Documentation Required* ➔ 5. *Bank Login* ➔ 6. *Sanctioned / Converted* ➔ 7. *Lost / Closed*.
- **Omnichannel Communication & Dossier Vault:** Pre-configured 1-click WhatsApp messaging, call logging, voice memo recording (Voice-to-CRM playback), internal notes, and full audit timeline.

---

### Module 6: Government Loan Cases Hub (Banking Underwriting)
- **Comprehensive Loan Types:** PMEGP Subsidy Loans, Mudra (Shishu, Kishore, Tarun), CGTMSE (Collateral-Free MSME Loans), Cash Credit (CC), Overdraft (OD), Machinery Term Loans, Loan Against Property (LAP).
- **Lender Repository:** Integrated database of nationalized, private, and NBFC lenders (SBI, PNB, Bank of Baroda, HDFC, ICICI, Axis, SIDBI).
- **Underwriting Checklist & Audit:** Credit evaluation, CIBIL verification, project report appraisal, field inspection scheduling, sanction letter archival, and TDR subsidy claim management.

---

### Module 7: Project & CA/CS Execution Cases
- **Detailed Project Reports (DPR):** Financial modeling, means of finance, 5-year projected balance sheets, profit & loss statements, and Debt Service Coverage Ratio (DSCR).
- **CA/CS Outsource Desk:** Secure portal allowing external chartered accountants, company secretaries, and advocates to review, verify, and digitally clear legal compliance tasks.

---

### Module 8: Customer 360° Master Ecosystem & Enterprise Accounting Hub
- **Unified Customer 360° Master Dossier (9 Enterprise Capabilities):**
  1. *Complete Dual Profile:* Separate tracking of Personal Residential Address and Registered Commercial / Factory Address, with Director/Signatory KYC links.
  2. *Assigned Relationship Manager (RM) Profile:* Dedicated officer allocation (Name, Direct Phone, Official Email, Cabin Desk, Assignment Date, Assignor User) with 1-click Reassignment modal.
  3. *Statement of Account (खाता / लेजर):* Chronological running financial ledger with Debits, Credits, Running Balance, and 1-Click PDF / Print export.
  4. *Multi-Tier Billing & Adjustments:* Tax Invoices, Credit Notes (concessions/adjustments), Debit Notes (statutory fee extensions), and Advance Payment Receipts (with UTR/Netbanking tracking).
  5. *Out-of-Pocket Expense Tracking:* Client-specific expense logging (MCA Government Challans, Electronic Stamp Duty, Notary & Affidavits, Field Travel) with reimbursement status.
  6. *Recurring Retainers & Subscriptions (बार-बार किए जाने वाले कार्य):* Automated monthly/annual retainer billing schedules (e.g. Monthly GST Filing, Annual RoC Compliance) with auto-alerts.
  7. *Folder-Wise Document Vault:* Centralized encrypted repository organized into 5 structured MSME/corporate folders:
     - 📁 *KYC & Registrations* (Aadhaar, PAN, GST, Udyam, MOA/AOA)
     - 📁 *Financials & Tax* (ITR Returns, 3-Yr Balance Sheets, Bank Statements)
     - 📁 *Project & DPR* (Detailed Project Reports, Machinery Quotations)
     - 📁 *Banking & Sanctions* (Sanction Letters, 3-Yr TDR Deposit, CGTMSE)
     - 📁 *Invoices & Receipts* (Bills, Receipts, Statements)
  8. *Internal Notes & Voice-to-CRM Memos:* Written discussion notes paired with playable encrypted voice audio recordings.
  9. *Security, Access Audit & Activity Log ("किसने कब लॉगिन करके क्या देखा, क्या एडिट किया"):* Immutable access log tracking User, Role, Action, IP Address, and Timestamp.
- **Universal Multi-Parameter Filtering & Export:** Instant filtering by RM, KYC Status, City, and Service, plus 1-click export to CSV/Excel and print roster.

---

### Module 9: HRM & Cabin Staff Desk
- **Staff-to-Desk Roster:** Tracks consultants, caseworkers, and legal executives assigned to each cabin.
- **Performance & Target Monitoring:** Live tracking of daily attendance, active case loads, and monthly file sanction targets vs. actual achievement.

---

## 4. Role-Based Access Control (RBAC) Matrix

| Feature / Module | Super Admin | Cabin In-Charge | Franchise Kendra | Bank Liaison Officer | External CA/CS |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Command Center & Global Analytics** | Full Access | No | No | No | No |
| **Business Cabins & Walk-in Desk** | Full Access | Assigned Cabin | No | View Only | No |
| **Cabin Invoicing & Billing** | Full Access | Desk Invoicing | No | No | No |
| **Franchise Network & Wallets** | Full Access | View Only | Own Kendra Only | No | No |
| **LEAD 360° Pipeline** | Full Access | Assigned Leads | Own Leads | Assigned Leads | No |
| **Loan Cases & Underwriting** | Full Access | Read / Write | Track Status | Full Liaison | No |
| **Machinery & B2B Trading** | Full Access | View / Quote | Catalog Access | No | No |
| **DPR / CA/CS Legal Projects** | Full Access | Assigned Desk | No | View DPR | Dedicated Desk |
| **Staff & HRM Attendance** | Full Access | View Team | No | No | No |

---

## 5. End-to-End Operational Lifecycle Workflow

```
[ Step 1: Client Ingestion ]
    │  • Walk-in at Headquarters OR Online Inquiry OR Kendra Franchise Referral
    ▼
[ Step 2: Feasibility & AI Evaluation ]
    │  • Cabin #01 consults client & validates idea
    │  • AI Subsidy Engine checks PMEGP / Mudra / PMFME eligibility (up to 35%)
    ▼
[ Step 3: Legal & Financial Documentation ]
    │  • Cabin #02 & Outsource CA/CS Desk draft DPR, CMA Data & Statutory Registrations
    ▼
[ Step 4: Machinery Selection & Quotation ]
    │  • Cabin #05 sources certified machinery quotations for bank submission
    ▼
[ Step 5: Bank File Login & Underwriting ]
    │  • Cabin #04 coordinates with Bank Branch Manager for inspection & sanction
    ▼
[ Step 6: Loan Sanction & Disbursal ]
    │  • Bank sanctions loan; subsidy locked in 3-year TDR deposit
    ▼
[ Step 7: Final Settlement & Distribution ]
    │  • Desk invoice issued to client
    │  • Franchise Kendra wallet credited automatically with partner commission
```

---

## 6. Client Bookkeeping, Bill Books & Outsourced Invoicing Desk (आउटसोर्स बिलिंग व सेल-परचेज़)

Many MSME clients outsource their day-to-day accounts and billing to DUS. DUS staff & accountants can manage multiple client firms from a centralized command desk:

- **Multi-Company Management:**
  - Support for multiple client businesses (`Sharma Agro Solutions`, `Karni Steel`, `Mewar Organics`, etc.).
  - 1-click `+ Add Company` modal: Legal Name, Trade Name, GSTIN, PAN, Address, Bank details, Bill prefix series (e.g. `SAS/2026/`), and starting serial counter.
- **Client's Parties Directory (कस्टमर के ग्राहक व सप्लायर):**
  - Maintain client's own buyers (ग्राहक) and suppliers (वेंडर).
  - Quick-add party directly inside invoice creator without switching windows.
- **Sales & Purchase Registers:**
  - Generate GST Tax Invoices (B2B), Quotations / Estimates, and Delivery Challans.
  - Line items with HSN codes, quantity, units, rates, and automated CGST/SGST/IGST calculation.
  - Track inward supplier bills and 100% eligible Input Tax Credit (ITC).
- **Bill Outer / Dispatch Consignment Slip (बाहरी बिल / पार्सल पर्ची):**
  - Dedicated 1-click Bill Outer modal with Transporter Name, Vehicle/Lorry No, Bilty/LR No, Package Count, Weight, and QR Code.
  - Downloadable and printable for transport drivers and parcel packaging.
- **Print & Auto-Save to Document Vault:**
  - Whenever an invoice is generated or printed, it is automatically archived into the client's `Invoices & Receipts` folder in their Document Vault.
- **WhatsApp Photo Card Export:**
  - Generates high-contrast, clean invoice photo cards for 1-click WhatsApp transmission to clients and buyers.

---

## 7. Project & MSME Consultancy Execution Engine (10-Stage Lifecycle, In-House vs Outsource & Subsidy Tracking)

Engineered for the complex, multi-stakeholder operational realities of Digital Udyog Seva:

- **1. Three Core Project Streams:**
  - **🏛️ Govt Scheme Loans & MSME Consultancy:** Flagship end-to-end consulting for PMEGP (up to 35% capital subsidy), Rajasthan MLUPY (up to 8% interest subsidy), PMFME, Mudra Tarun, and AHD.
  - **⚡ Fast Compliance & Regulatory Licenses:** Labour Contractor License, PWD Class-AA License, FSSAI Central License, RSPCB Pollution CTE/CTO, Trust/NGO & Company Incorporation, GST Retainers.
  - **📊 Financial Engineering & Technical Modeling:** 5-Year CMA Data, Techno-Economic Viability (TEV) DPR formulation, and Bank Appraisal Reports.

- **2. The 10-Stage Operational Lifecycle Pipeline:**
  1. *Lead & Product Consult:* Viability assessment and scheme orientation.
  2. *Eligibility Check, Audit Fee & Legal Agreement:* 7-pillar eligibility scoring, fee collection, and mandatory **Signed Legal Contract** to protect against disputes.
  3. *Support Desk Document Collection & Fee Invoicing:* Online upload link dispatch, fee receipt, and KYC gathering.
  4. *Operations QA Handover & Loop:* Operations scrutiny. If incomplete, **"Bounce back to Support"** with missing documents checklist. When complete, approved for submission.
  5. *Department Portal Submission:* Submitted on official government portals (KVIC, KVIB, DIC, District Collector Committee, FoSCoS, PWD, RSPCB).
  6. *Department Query & Objection Management:* Dedicated query desk to log objections, upload query notices, draft portal replies, submit resubmissions, and notify clients via WhatsApp.
  7. *DLFC / Task Force Committee Interview:* Track interview schedule, committee remarks, or direct bank forwarding where interview is exempted.
  8. *Bank Branch Liaison & Revision Desk:* Coordinate with Branch Managers; track property valuation, legal search reports, CMA data revisions, and bank query letters.
  9. *Bank Loan Sanction & Disbursal:* Upload sanction letter, record sanction amount, and monitor first tranche disbursal.
  10. *Subsidy Claim Tracker & Target Countdown:* Active days countdown timer (e.g. 30/45-day window following disbursal), Nodal portal claim submission, and TDR reserve lock tracking.

- **3. In-House vs Outsourced Routing (आंतरिक बनाम बाहरी पार्टी):**
  - Instant toggle between **🏢 In-House DUS Cabin Desks** and **🤝 Outsourced External Partners** (CA firms, Advocate associates, Environmental engineers).
  - Outsource Partner tracking: Vendor firm name, Contact person, Mobile, Agreed Payout (₹), Payment status, Handover & Delivery due dates, and Final Deliverable file upload.

---

## 8. Technical Specifications & Database Schema

- **Frontend Technology:** React 18 SPA, Lucide UI Icons, Modern Pure CSS Design Tokens, Fully Responsive Mobile & Desktop Layout.
- **Backend Architecture:** Modular PHP REST API endpoints (`/api/v1/leads.php`, `/api/v1/lead_engine.php`, `/api/v1/services.php`).
- **Relational Database (MySQL InnoDB):**
  - **CRM & Leads:** `leads`, `lead_notes`, `lead_activities`, `lead_documents`, `lead_sources`, `lead_statuses`
  - **Loan Management:** `loan_cases`, `loan_types`, `lenders`, `loan_case_documents`, `loan_case_status_history`
  - **Cabins & Franchise:** `cabins`, `cabin_bills`, `cabin_transfers`, `franchises`, `franchise_commissions`
  - **Trading & Machinery:** `machinery_catalog`, `machinery_inquiries`, `b2b_products`
  - **Customers & Billing:** `customers`, `customer_contacts`, `estimates`, `estimate_items`, `invoices`, `services_master`
  - **Outsourced Bookkeeping:** `client_companies`, `client_bill_books`, `client_parties`, `client_sales_invoices`, `client_purchases`
  - **Project Lifecycle Engine:** `projects`, `project_department_queries`, `project_bank_liaisons`, `project_subsidy_claims`, `project_outsource_assignments`
  - **Staff & HRM:** `staff`, `departments`, `attendance`, `project_tasks`, `project_milestones`

---
*Digital Udyog Seva (DUS) Master CRM – Engineered for Scalable MSME Consulting & Financial Operations.*


