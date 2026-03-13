# Unideft – AI-Driven Visa Management CRM

Unideft is an **AI-driven visa management CRM** built on the Frappe/ERPNext framework, designed specifically for **overseas education and migration consultancies**.  
It centralizes student applications, documents, visa stages, financials, and team workflows into a single, auditable system, while leveraging **Python-based automation and data analytics to generate insights, streamline decision-making, and improve operational efficiency.**

---

## 🚀 Key Highlights

- **End‑to‑end visa lifecycle**: From initial enquiry and offer letter to COE, file lodging, visa decision, enrollment, and post‑visa scenarios.
- **Rich Application doctype**:
  - Multi‑tab layout: Details, Processing, Financials, GS Processing, Acceptance, COE, File Lodged, Visa, Enrolled, On‑shore College Change, Visa Refused, Refund, etc.
  - Deep linkage with Students, Agents, Universities, Courses, Sponsors, and Documents.
- **AI‑assisted operations**:
  - Eligibility triage and risk flags (gap, funds, refusals).
  - Task recommendations and reminders based on stage + conditions.
  - Structured, machine‑readable data for future ML models.

---

## 🧩 Core Features (Application Workflow)

### 1. Details Tab – Application Information

- Student profile & contact:
  - Student link, **Student Email**, **Student Contact No**, DOB, marital status.
  - Auto‑calculated **current age**.
- Visa history & gap:
  - Any visa refused? (with notes and outcomes).
  - Study gap, **Study Gap Proof** (linked to structured child tables), and “OK” status.
- Preferences:
  - Destination country, higher education level, preferred universities and courses, intake.
- Case 4 – Spouse logic:
  - Spouse qualification, marriage duration, and dynamic recommendations for proceeding with/without spouse.

---

### 2. Processing Tab

#### A. Email & Package Case

- Fields for email login, passwords, recovery email, and login contact – conditionally mandatory when **Package Case** is checked.

#### B. Documents 10th to 12th / Graduation

- Child table: **Application Documents 10th To 12th**
  - `Document Type` (Select):
    - 12th Admit card  
    - school domain email id  
    - digilocker id/password
  - `Write Details` (Small Text) – appears when:
    - Document Type = **school domain email id** or **digilocker id/password**
  - `Upload Document` (Attach)
- 12th admit card uploaded flag and consolidated **“Upload in Single PDF”** table for verified docs.
- Graduation verification section (separate child table and DigiLocker credentials for graduates).

#### C. English Proficiency Test

- Child table: **Application English Test**
  - Test Type: IELTS / PTE / TOEFL
  - Structured score sections per test
  - Login credentials & verification status
  - **TOEFL Type**:
    - IBT Center Based  
    - **IBT Home Edition Based**  
  - When **IBT Home Edition Based** is selected:
    - Status field: `"This test type is not accepted"` appears.

#### D. Study Gap Proof

- Main Application:
  - `study_gap` (Check), `study_gap_proof` (Table), `study_gap_ok` (auto text)
- Child doctype: **Study Gap Proof**
  - Types: Educational / Work / Other
  - **For Work**:
    - Work Experience Details:
      - Company Name (text)
      - Position (text)
      - Duration (text / from–to)
      - Employer Domain ID (text)
    - Attachments:
      - ITR
      - Salary Slips
      - Experience Letter
      - Bank Statement
    - Verification checkboxes:
      - Work Experience Verified
      - ITR Verified (as per Work Experience)
      - Salary Slips Verified (6 Months)
      - Bank Statement Verified
  - Educational + Other scenarios supported with their own structured fields.

#### E. Passport

- Flags for passport uploaded, attached documents, and verification outputs.

#### F. Applications (Who Filled the Application)

- `Application Filled By` (Select):
  - Application filled by us
  - Filled on portal
  - Filled by Vendor
- If **Application filled by us**:
  - Application Form 1–4 Upload (Attach fields)
  - SOP Upload (Attach)
- If **Filled on portal**:
  - SOP Upload
- If **Filled by Vendor**:
  - SOP Upload

---

### 3. Financials Tab

- **Conditions on Offer Letter** (Table MultiSelect) linking to **Offer Letter Condition** master:
  - Drives visibility of the following condition sections:
    - Interview Condition (timing, deadline)
    - English Requirement
    - Gap Justification
    - Verification
- **Section B – Conditions**:
  - Logic uses the **child rows’ `condition` values** to decide which sections to show:
    - Interview
    - English Requirement
    - Gap Justification
    - Verification
- All funds, tuition fee, OSHC, living/travel expenses, and multi‑sponsor structures are captured and linked to sponsor documents.

---

### 4. GS Processing Tab

- **GS Processing** stage with:
  - `interview_stage_available` (Check)
  - `interview_deadline` (Date)
- **Student Prepare** – Select (Yes/No):
  - Yes → status: “✓ Schedule Interview (if not scheduled)”
  - No → status: “⚠ Prepare Student – Set Reminder to Prepare Student”
- **Schedule Interview** – Select (Yes/No):
  - Yes → status: “✓ Prepare Student Strongly – Reminder Set for Interview Date”
  - No → status: “⚠ Prepare Student – Set Reminder for Follow Up Interview Schedule”
- Additional logic in `application.js`:
  - Creates GS reminders based on dropdown selections and deadlines.

---

### 5. Acceptance, COE, File Lodged, Visa & Enrolled Tabs

#### Acceptance

- Acceptance before COE logic and interview scheduling.
- Requirements and upload handling similar to GS Processing.

#### Submitted Tab (Offer Letter Follow‑up)

- `Any Further Requirement for offer letter?` (Check):
  - If **No**:
    - Note: **“If no → Set reminder: Follow up on Offer Letter”**
  - If **Yes**:
    - `Pending Requirement Details` (Text)
    - `Pending requirements Completed?` – Select (Yes/No)
    - If **No**:
      - Note: **“→ Set reminder: To Complete Pending requirements”**
    - If **Yes**:
      - `Supporting Documents` (student documents table)
- `application.js` also creates reminder records in the background.

#### Enrolled Tab

- Tab renamed to **“Enrolled”**.
- Child table uses new **Enrollment Document** doctype:
  - Document Name (Data)
  - Upload (Attach)
- Used to track final enrollment‑stage documents post visa approval.

---

### 6. Spouse & Sponsors UX Improvements

- **Spouse Details** child table (`spouse_details_list`):
  - Uses **Spouse Details** doctype with `editable_grid = 0`.
  - “Add Row” opens a **full modal form**, easier for complex data.
- **C. Sponsors** table (`table_ihmq`):
  - Uses **Application Sponsor Complete** doctype with `editable_grid = 0`.
  - “Add Row” opens complete sponsor form in a **modal**.
- `application.js` additionally forces form‑view for these tables via `allow_on_grid_editing = false` to ensure consistent modal behavior.

---

## 🧱 Tech Stack

- **Framework**: Frappe / ERPNext
- **Language**: Python (backend), JavaScript (client scripts)
- **Database**: MariaDB (via Frappe)
- **UI**: Frappe Desk, Form Views, Child Tables

---

## 🖼 Screenshots

> Replace the placeholders below with actual image links or GitHub‑hosted screenshots.

### Application Overview

*(Screenshot: Application list or main form header with tabs)*  
`![Application Overview](./docs/screenshots/application-overview.png)`

### Processing Tab – Documents & English Tests

*(Screenshot: Processing tab with Documents (10th to 12th), English Test child table, and Study Gap Proof)*  
`![Processing Tab](./docs/screenshots/processing-tab.png)`

### GS Processing – Interview Flow

*(Screenshot: GS Processing tab showing Student Prepare & Schedule Interview dropdowns and statuses)*  
`![GS Processing](./docs/screenshots/gs-processing.png)`

### Financials – Conditions on Offer Letter

*(Screenshot: Financials tab, Conditions on Offer Letter + dynamically shown sections)*  
`![Financials Conditions](./docs/screenshots/financials-conditions.png)`

### Enrolled Tab – Final Enrollment Docs

*(Screenshot: Enrolled tab with Enrollment Documents table)*  
`![Enrolled Tab](./docs/screenshots/enrolled-tab.png)`

---

## 🛠 Setup (High‑Level)

> This is intentionally brief; adjust for your exact bench/app setup.

1. Install Frappe/ERPNext and create a bench.
2. Clone this app:
   cd /path/to/frappe-bench/apps
   git clone https://github.com/<your-username>/unidef-erp.git
   
