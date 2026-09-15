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

### Module 4: AI Subsidy & Eligibility Engine
- **Automated Parameter Matching:** Evaluates applicants based on:
  - Beneficiary Category (General, OBC, SC/ST, Women, Ex-Servicemen, Specially Abled)
  - Business Location (Rural vs. Urban)
  - Industry Sector (Manufacturing, Service, Agro-Processing)
  - Project Size (₹5 Lakhs to ₹50 Lakhs)
- **Instant Financial Breakdown:**
  - Eligible Subsidy Percentage (15% to 35%)
  - Estimated Government Grant Amount (in ₹)
  - Mandatory Owner Margin Contribution (5% or 10%)
  - Eligible Bank Term Loan & Working Capital Amount
  - Best Scheme Recommendation (PMEGP vs. PMFME vs. Mudra Tarun)

---

### Module 5: LEAD 360° Autopilot Pipeline
- **Lead Capture Channels:** Website inquiry forms, Kendra franchise referrals, offline walk-ins, Meta/Google ad integrations, phone inquiries.
- **Kanban & List Dual View:** Intuitive stage progression:
  1. *New Lead* ➔ 2. *Consulting / Feasibility* ➔ 3. *Documentation Required* ➔ 4. *Bank Login* ➔ 5. *Sanctioned / Converted* ➔ 6. *Lost / Closed*.
- **Omnichannel Communication:** Pre-configured 1-click WhatsApp messaging, call logging, note creation, and full audit timeline.

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

### Module 8: Customer 360° & Master Billing
- **Customer 360° Dossier:** Unified client history displaying all associated leads, active loan cases, completed company setups, past invoices, uploaded identity proofs, and audit logs in a single window.
- **Estimates & Invoicing Engine:** Pre-loaded government & statutory service master (GST, Udyam, FSSAI, Trade License, Trademark, Company Registration). Generates itemized estimates, tax invoices, calculates 18% GST, and manages payment statuses.

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

## 6. Technical Specifications & Database Schema

- **Frontend Technology:** React 18 SPA, Lucide UI Icons, Modern Pure CSS Design Tokens, Fully Responsive Mobile & Desktop Layout.
- **Backend Architecture:** Modular PHP REST API endpoints (`/api/v1/leads.php`, `/api/v1/lead_engine.php`, `/api/v1/services.php`).
- **Relational Database (MySQL InnoDB):**
  - **CRM & Leads:** `leads`, `lead_notes`, `lead_activities`, `lead_documents`, `lead_sources`, `lead_statuses`
  - **Loan Management:** `loan_cases`, `loan_types`, `lenders`, `loan_case_documents`, `loan_case_status_history`
  - **Cabins & Franchise:** `cabins`, `cabin_bills`, `cabin_transfers`, `franchises`, `franchise_commissions`
  - **Trading & Machinery:** `machinery_catalog`, `machinery_inquiries`, `b2b_products`
  - **Customers & Billing:** `customers`, `customer_contacts`, `estimates`, `estimate_items`, `invoices`, `services_master`
  - **Staff & Projects:** `staff`, `departments`, `attendance`, `projects`, `project_tasks`, `project_milestones`

---
*Digital Udyog Seva (DUS) Master CRM – Engineered for Scalable MSME Consulting & Financial Operations.*
